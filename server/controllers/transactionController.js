const { prisma } = require("../config/db");

const fs = require('fs');
const Papa = require('papaparse');
const Groq = require('groq-sdk');
const { categorizeTransactions } = require("../util/categoriesKeywords");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })






// 🔁 CORE PROCESS FUNCTION (USED EVERYWHERE)
async function processTransaction(tx) {
  // ... your existing AI categorization code ...
  console.log("tx",tx);
  // ✅ Fetch org's base currency
  const org = await prisma.organization.findUnique({
    where: { id: Number(tx.organizationId) },
    select: { currency: true },
  });

  // const currency = org?.currency || 'USD';
  // const txCurrency = tx.currency;

  let baseAmount = Number(tx.amount);
  let exchangeRate = 1;

  // ✅ Convert if currencies differ
  // if (txCurrency !== currency) {
  //   const rate = await getExchangeRate(txCurrency, currency);
  //   exchangeRate = rate;
  //   baseAmount = Number(tx.amount) * rate;
  // }

  return {
    // ... existing fields ...
    amount:       Number(tx.amount),
    type:         tx.type,
    description:  tx.description || null,
    date:         new Date(tx.date),
    organizationId: tx.organizationId,
    accountId: tx.accountId,
  };
}



exports.importCSV = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // ✅ Read file and strip BOM
    let csvContent = fs.readFileSync(file.path, 'utf8');
    csvContent = csvContent.replace(/^\uFEFF/, '');  // strip BOM
    csvContent = csvContent.replace(/^\ï»¿/, '');    // strip if already decoded wrong

    // ✅ Parse CSV
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // trim whitespace from headers
    });

    console.log("Headers found:", parsed.meta.fields);
    console.log("First row:", parsed.data[0]);

    if (!parsed.data || parsed.data.length === 0) {
      return res.status(400).json({ success: false, message: 'CSV is empty or invalid' });
    }

    // ✅ Map CSV rows to transaction format
    const transactions = parsed.data.map((row) => {
      // Log raw row to see actual column names
      console.log("Row keys:", Object.keys(row));

      return {
        organizationId: Number(organizationId),
        fromAccountId:  Number(row['fromAccountId'] || row['account_id'] || row['Account']),
        amount:         parseFloat(row['amount']  || row['Amount']  || row['AMOUNT']),
        type:           row['type']        || row['Type']        || 'EXPENSE',
        description:    row['description'] || row['Description'] || row['Narration'] || '',
        date:           new Date(row['date'] || row['Date'] || row['DATE']),
        currency:       row['currency']    || row['Currency']    || 'USD',
        reference:      row['reference']   || row['Reference']   || '',
      };
    }).filter(tx => 
      !isNaN(tx.amount) && 
      tx.amount > 0 && 
      !isNaN(tx.fromAccountId) &&
      tx.date instanceof Date && !isNaN(tx.date)
    );

    console.log(`Parsed ${transactions.length} valid transactions`);

    if (transactions.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No valid transactions found in CSV',
        headers: parsed.meta.fields  // ← send back actual headers so frontend can map
      });
    }

    // ✅ Process & insert
    const processedTransactions = [];
    for (const tx of transactions) {
      const processed = await processTransaction(tx);
      processedTransactions.push(processed);
    }

    await prisma.transaction.createMany({ data: processedTransactions });

    // ✅ Cleanup temp file
    fs.unlinkSync(file.path);

    return res.status(201).json({
      success: true,
      message: `${processedTransactions.length} transactions imported`,
      count: processedTransactions.length,
    });

  } catch (error) {
    console.error('CSV import error:', error);
    return res.status(500).json({ success: false, message: 'Import failed', error: error.message });
  }
};

// ✅ CREATE SINGLE TRANSACTION
exports.createTransaction = async (req, res) => {
  try {

    const organizationId =
      req.user.organizationId;

    const data = req.body;

    console.log("data", data);

    // Validate
    if (!data.fromAccountId || !data.date) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (!data.amount || Number(data.amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Verify account belongs to org
    const account =
      await prisma.account.findFirst({
        where: {
          id: Number(data.fromAccountId),
          organizationId:
            Number(organizationId),
        },
      });

    if (!account) {
      return res.status(403).json({
        success: false,
        message:
          "Account not found or access denied",
      });
    }

    // ✅ Inject organizationId safely
    const processed =
      await processTransaction({
        ...data,
        organizationId,
        accountId:account.id, // ✅ ensure we use the verified account ID
      });

    const transaction =
      await prisma.transaction.create({
        data: processed,

        include: {
          category: true,
        },
      });

    return res.status(201).json({
      success: true,
      data: transaction,
    });

  } catch (error) {

    console.error(
      "createTransaction error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

// 🚀 BULK CREATE (CSV IMPORT)
exports.importTransactions = async (req, res) => {
  const { transactions, accountId } = req.body;
  const organizationId = req.user.organizationId;

  // ✅ Load category map once (name → id)
  const categories = await prisma.category.findMany({ 
    where: { organizationId } 
  });
  const categoryMap = {};
  categories.forEach(c => categoryMap[c.name] = c.id);
  console.log("📁 Category map:", categoryMap);

  // ✅ Categorize
  const categorized = await categorizeTransactions(transactions);

  const processed = categorized.map(tx => {
    const categoryId = categoryMap[tx.aiCategory] || categoryMap['Other'];
    
    return {
      date: new Date(tx.date),
      description: tx.description || null,
      amount: parseFloat(tx.amount),
      type: tx.type,
      reference: tx.reference || null,
      categoryId,                              // ✅ real ID, never null
      categoryConfirmed: tx.aiConfidence === 1.0,
      organizationId,
      accountId: parseInt(accountId),
      // ❌ no aiCategory string
    };
  });

  const result = await prisma.transaction.createMany({ data: processed });

  const confirmed = processed.filter(t => t.categoryConfirmed).length;
  const needsReview = processed.filter(t => !t.categoryConfirmed).length;

  return res.json({ 
    success: true, 
    count: result.count,
    breakdown: { confirmed, needsReview }
  });
};


exports.getTransactions = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    console.log("Fetching transactions for org:", organizationId);

    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      type,
      status,
      categoryId,
      accountId,
      search,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "organizationId is required",
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      organizationId: parseInt(organizationId, 10),
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (type) where.type = type;

    if (status) where.status = status;

    if (categoryId) {
      where.categoryId = parseInt(categoryId, 10);
    }

    // ✅ FIXED
    if (accountId) {
      where.accountId = parseInt(accountId, 10);
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } },
        { aiCategory: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [transactions, total] = await Promise.all([
      prisma.Transaction.findMany({
        where,

        // ✅ FIXED include
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },

          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
            },
          },
        },

        orderBy,
        skip,
        take: limitNum,
      }),

      prisma.Transaction.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });

  } catch (error) {
    console.error("getTransactions error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    const transaction = await prisma.Transaction.findFirst({
      where: {
        id: parseInt(id, 10),
        organizationId: organizationId ? parseInt(organizationId, 10) : undefined,
      },
      include: {
        fromAccount: true,
        toAccount: true,
        category: true,
        invoice: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    return res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error("getTransactionById error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId, description, ...updateData } = req.body;

    // If description is being updated, re-categorize
    let aiResult = {};
    if (description !== undefined) {
      aiResult = await categorizeTransaction(description, updateData.amount, updateData.type);
    }

    const transaction = await prisma.Transaction.update({
      where: {
        id: parseInt(id, 10),
        organizationId: organizationId ? parseInt(organizationId, 10) : undefined,
      },
      data: {
        ...updateData,
        ...aiResult,
        date: updateData.date ? new Date(updateData.date) : undefined,
      },
      include: {
        fromAccount: true,
        toAccount: true,
        category: true,
      },
    });

    return res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error("updateTransaction error", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    await prisma.Transaction.delete({
      where: {
        id: parseInt(id, 10),
        organizationId: organizationId ? parseInt(organizationId, 10) : undefined,
      },
    });

    return res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("deleteTransaction error", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.Transaction.findUnique({
      where: { id: parseInt(id, 10) },
      include: { fromAccount: true, toAccount: true, category: true, invoice: true },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    return res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error("getTransactionById error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const transaction = await prisma.Transaction.update({
      where: { id: parseInt(id, 10) },
      data: payload,
    });

    return res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error("updateTransaction error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.Transaction.delete({ where: { id: parseInt(id, 10) } });

    return res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("deleteTransaction error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


// exports.uploadCSV = async (req, res) => {
//   try {
//     console.log("body", req.body);
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
//     console.log("Uploaded file:", req.file);

//     // ✅ Strip BOM before parsing
//     let fileContent = fs.readFileSync(req.file.path, 'utf-8');
//     fileContent = fileContent.replace(/^\uFEFF/, '');

//     const results = Papa.parse(fileContent, {
//       header: true,
//       skipEmptyLines: true,
//       transformHeader: (h) => h.trim(), // ✅ strip whitespace from headers
//     });

//     console.log("Headers found:", results.meta.fields); // ✅ see exact column names

//     const transactions = results.data
//       .map((row) => {
//         const amount = parseFloat(row['Amount'] || row['amount'] || '0');

//         return {
//           date:        row['Txn Date']    || row['Date']        || row['date'],
//           description: row['Description'] || row['Memo']        || row['Narration'] || '',
//           amount:      Math.abs(amount),
//           type:        amount >= 0 ? 'INCOME' : 'EXPENSE',
//           reference:   row['Reference']   || row['Ref']         || row['Chq/Ref No.'] || '',
//         };
//       })
//       .filter((tx) => tx.amount > 0 && tx.date); // ✅ skip rows with no amount or date

//     console.log(`Parsed ${transactions.length} valid transactions`);

//     fs.unlinkSync(req.file.path); // cleanup

//     res.json({ 
//       transactions,
//       count: transactions.length,
//       headers: results.meta.fields, // ✅ send headers to frontend for debugging
//     });

//   } catch (err) {
//     // ✅ Cleanup temp file even if error occurs
//     if (req.file?.path && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ error: err.message });
//   }
// };




exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    console.log("📁 File received:", req.file.originalname, `(${req.file.size} bytes)`);

    const rawBuffer = fs.readFileSync(req.file.path);
    console.log("📦 Raw buffer size:", rawBuffer.length);
    console.log("🔍 First 6 bytes (hex):", rawBuffer.slice(0, 6).toString('hex'));

    // ✅ Strip BOM
    let fileContent;
    if (rawBuffer[0] === 0xEF && rawBuffer[1] === 0xBB && rawBuffer[2] === 0xBF) {
      console.log("✅ BOM detected and stripped");
      fileContent = rawBuffer.slice(3).toString('utf8');
    } else {
      console.log("ℹ️ No BOM detected");
      fileContent = rawBuffer.toString('utf8');
    }

    const totalLines = fileContent.split('\n').length;
    console.log("📄 Total lines in file:", totalLines);
    console.log("📄 First 5 lines:");
    fileContent.split('\n').slice(0, 5).forEach((line, i) => {
      console.log(`  Line ${i + 1}: ${line}`);
    });

    fs.unlinkSync(req.file.path);
    console.log("🗑️ Temp file deleted");

    // ✅ Send to Groq AI for parsing
    console.log("🤖 Sending to Groq AI...");
    const transactions = await parseCSVWithAI(fileContent);
    console.log("🤖 Groq AI returned:", transactions?.length ?? 0, "transactions");
    if (transactions?.length > 0) {
      console.log("🤖 First parsed transaction:", transactions[0]);
    }

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({
        error: 'Could not parse CSV',
        message: 'AI could not detect transaction data. Please check your file format.',
      });
    }

    res.json({
      count: transactions.length,
      transactions,
    });

  } catch (err) {
    console.error("❌ uploadCSV error:", err.message);
    console.error(err.stack);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
};


async function parseCSVWithAI(csvContent) {
  const lines = csvContent.split('\n');

  // ✅ Filter out empty lines first, then take only 30
  const meaningfulLines = lines
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .slice(0, 50);

  const preview = meaningfulLines.join('\n');
  console.log("📤 Sending", meaningfulLines.length, "lines to Groq AI");
  console.log("📝 Preview size (chars):", preview.length);

  const prompt = `Parse this bank CSV. Skip metadata rows. Return ONLY a JSON array.

Format: [{"date":"YYYY-MM-DD","description":"text","amount":0.00,"type":"INCOME or EXPENSE","reference":"","balance":0.00}]

Rules: EXPENSE=debit(money out), INCOME=credit(money in), amount always positive, skip rows with no date or amount.

CSV:
${preview}`;

  console.log("📝 Prompt length (chars):", prompt.length);

  let response;
  try {
    response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 3000,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'Return ONLY a valid JSON array. No explanation, no markdown, no backticks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    console.log("✅ Groq AI response received");
    console.log("📊 Tokens — input:", response.usage.prompt_tokens, "output:", response.usage.completion_tokens);
  } catch (aiError) {
    console.error("❌ Groq API error:", aiError.message);
    throw aiError;
  }

  const text = response.choices[0].message.content.trim();
  console.log("📨 Raw Groq response (first 300 chars):", text.slice(0, 300));

  const clean = text.replace(/```json|```/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
    console.log("✅ JSON parsed successfully, count:", parsed.length);
  } catch (parseError) {
    console.error("❌ JSON parse failed:", parseError.message);
    console.error("❌ Content that failed:", clean.slice(0, 500));
    throw new Error("AI returned invalid JSON: " + parseError.message);
  }

  return parsed;
}