const { prisma } = require("../config/db");
const Anthropic = require("@anthropic-ai/sdk");
const fs = require('fs');
const Papa = require('papaparse');


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});



// 🧠 AI Categorization
async function categorizeTransaction(description, amount, type) {
  try {
    const prompt = `
Categorize this financial transaction.

Description: "${description || ''}"
Amount: ${amount}
Type: ${type}

Categories:
Office Supplies, Travel, Meals, Software, Marketing, Utilities, Rent, Salary, Consulting, Equipment, Advertising, Insurance, Professional Services, Training, Internet, Phone, Transportation, Entertainment, Miscellaneous.

Return ONLY JSON:
{"category": "Category Name", "confidence": 0.85}
`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const result = JSON.parse(text);

    return {
      aiCategory: result.category,
      aiConfidence: result.confidence,
    };
  } catch (error) {
    console.error("AI error:", error);
    return { aiCategory: null, aiConfidence: null };
  }
}


// 🔁 CORE PROCESS FUNCTION (USED EVERYWHERE)
async function processTransaction(tx) {
  try {
    // 🧠 1. Check memory (avoid repeated AI calls)
    const existing = await prisma.transaction.findFirst({
      where: {
        description: tx.description,
        aiCategory: { not: null },
      },
      select: {
        aiCategory: true,
        aiConfidence: true,
      },
    });

    let aiCategory = null;
    let aiConfidence = null;

    if (existing) {
      aiCategory = existing.aiCategory;
      aiConfidence = existing.aiConfidence;
    } else {
      const aiResult = await categorizeTransaction(
        tx.description,
        tx.amount,
        tx.type
      );
      aiCategory = aiResult.aiCategory;
      aiConfidence = aiResult.aiConfidence;
    }

    // 🔧 2. Normalize data
    return {
      organizationId: tx.organizationId,
      fromAccountId: tx.fromAccountId,
      toAccountId: tx.toAccountId || null,
      categoryId: tx.categoryId || null,
      invoiceId: tx.invoiceId || null,
      type: tx.type,
      status: tx.status || "PENDING",
      amount: Number(tx.amount),
      currency: tx.currency || "USD",
      date: new Date(tx.date),
      description: tx.description || "",
      reference: tx.reference || null,
      aiCategory,
      aiConfidence,
    };
  } catch (error) {
    console.error("processTransaction error:", error);
    throw error;
  }
}


// ✅ CREATE SINGLE TRANSACTION
exports.createTransaction = async (req, res) => {
  try {
    const data = req.body;

    if (!data.organizationId || !data.fromAccountId || !data.amount || !data.date) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const processed = await processTransaction(data);

    const transaction = await prisma.transaction.create({
      data: processed,
      include: {
        fromAccount: true,
        toAccount: true,
        category: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("createTransaction error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// 🚀 BULK CREATE (CSV IMPORT)
exports.bulkCreateTransactions = async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({
        success: false,
        message: "Transactions array required",
      });
    }

    const processedTransactions = [];

    for (const tx of transactions) {
      const processed = await processTransaction(tx);
      processedTransactions.push(processed);
    }

    await prisma.transaction.createMany({
      data: processedTransactions,
    });

    return res.json({
      success: true,
      count: processedTransactions.length,
    });
  } catch (error) {
    console.error("bulkCreateTransactions error:", error);
    return res.status(500).json({
      success: false,
      message: "Bulk insert failed",
    });
  }
};



exports.getTransactions = async (req, res) => {
  try {
    const {
      organizationId,
      page = 1,
      limit = 20,
      startDate,
      endDate,
      type,
      status,
      categoryId,
      accountId,
      search,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId is required" });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
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
    if (categoryId) where.categoryId = parseInt(categoryId, 10);
    if (accountId) {
      where.OR = [
        { fromAccountId: parseInt(accountId, 10) },
        { toAccountId: parseInt(accountId, 10) },
      ];
    }

    if (search) {
      where.OR = where.OR || [];
      where.OR.push(
        { description: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
        { aiCategory: { contains: search, mode: 'insensitive' } }
      );
    }

    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [transactions, total] = await Promise.all([
      prisma.Transaction.findMany({
        where,
        include: {
          fromAccount: { select: { id: true, name: true, type: true } },
          toAccount: { select: { id: true, name: true, type: true } },
          category: { select: { id: true, name: true, color: true, icon: true } },
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
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
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


exports.uploadCSV = async (req, res) => {
    try {
      console.log("body",req.body);
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      console.log("Uploaded file:", req.file);
      
      const fileContent = fs.readFileSync(req.file.path, 'utf-8');
      const results = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

      const transactions = results.data.map((row) => {
        const amount = parseFloat(row['Amount'] || '0');
        return {
          date: row['Txn Date'] || row['Date'],
          description: row['Description'] || row['Memo'],
          amount: Math.abs(amount),
          type: amount > 0 ? 'INCOME' : 'EXPENSE',
          reference: row['Reference'] || row['Ref'] || ''
        };
      });

      fs.unlinkSync(req.file.path); // cleanup temp file
      res.json({ transactions });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

