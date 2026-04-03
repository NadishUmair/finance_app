const { prisma } = require("../config/db");

exports.createAccount = async (req, res) => {
  try {
    const { organizationId, name, type, currency = "USD", bankName, accountNumber, initialBalance = 0 } = req.body;

    if (!organizationId || !name || !type) {
      return res.status(400).json({ success: false, message: "organizationId, name and type are required" });
    }

    const account = await prisma.account.create({
      data: {
        organizationId,
        name,
        type,
        currency,
        balance: initialBalance,
        bankName,
        accountNumber,
      },
    });

    return res.status(201).json({ success: true, data: account });
  } catch (error) {
    console.error("createAccount error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const { organizationId, type, includeBalances = true } = req.query;
    const where = organizationId ? { organizationId: parseInt(organizationId, 10) } : {};
    if (type) where.type = type;

    let accounts = await prisma.account.findMany({
      where: { ...where, isActive: true },
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ],
    });

    if (includeBalances === 'true') {
      // Calculate current balances based on transactions
      accounts = await Promise.all(
        accounts.map(async (account) => {
          const balance = await calculateAccountBalance(account.id);
          return { ...account, currentBalance: balance };
        })
      );
    }

    return res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    console.error("getAccounts error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    const account = await prisma.account.findFirst({
      where: {
        id: parseInt(id, 10),
        organizationId: organizationId ? parseInt(organizationId, 10) : undefined,
        isActive: true,
      },
    });

    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    // Calculate current balance
    const currentBalance = await calculateAccountBalance(account.id);

    return res.status(200).json({
      success: true,
      data: { ...account, currentBalance }
    });
  } catch (error) {
    console.error("getAccountById error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId, ...payload } = req.body;

    const account = await prisma.account.update({
      where: {
        id: parseInt(id, 10),
        organizationId: organizationId ? parseInt(organizationId, 10) : undefined,
      },
      data: payload,
    });

    return res.status(200).json({ success: true, data: account });
  } catch (error) {
    console.error("updateAccount error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    // Soft delete by setting isActive to false
    await prisma.account.update({
      where: {
        id: parseInt(id, 10),
        organizationId: organizationId ? parseInt(organizationId, 10) : undefined,
      },
      data: { isActive: false },
    });

    return res.status(200).json({ success: true, message: "Account deactivated successfully" });
  } catch (error) {
    console.error("deleteAccount error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Chart of Accounts - grouped by type
exports.getChartOfAccounts = async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId is required" });
    }

    const accounts = await prisma.account.findMany({
      where: {
        organizationId: parseInt(organizationId, 10),
        isActive: true,
      },
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ],
    });

    // Group accounts by type
    const chartOfAccounts = {
      ASSETS: {
        CASH: [],
        BANK: [],
        ACCOUNTS_RECEIVABLE: [],
      },
      LIABILITIES: {
        CREDIT_CARD: [],
        ACCOUNTS_PAYABLE: [],
      },
      EQUITY: {
        EQUITY: [],
      },
      REVENUE: {
        REVENUE: [],
      },
      EXPENSES: {
        EXPENSE_ACCOUNT: [],
      },
    };

    // Calculate balances and organize
    for (const account of accounts) {
      const balance = await calculateAccountBalance(account.id);
      const accountWithBalance = { ...account, currentBalance: balance };

      if (chartOfAccounts[account.type]) {
        // For asset/liability accounts, use the specific type
        if (account.type === 'CASH' || account.type === 'BANK' || account.type === 'ACCOUNTS_RECEIVABLE') {
          chartOfAccounts.ASSETS[account.type].push(accountWithBalance);
        } else if (account.type === 'CREDIT_CARD' || account.type === 'ACCOUNTS_PAYABLE') {
          chartOfAccounts.LIABILITIES[account.type].push(accountWithBalance);
        } else {
          chartOfAccounts[account.type][account.type].push(accountWithBalance);
        }
      }
    }

    // Calculate totals
    const totals = {
      ASSETS: Object.values(chartOfAccounts.ASSETS).flat().reduce((sum, acc) => sum + parseFloat(acc.currentBalance), 0),
      LIABILITIES: Object.values(chartOfAccounts.LIABILITIES).flat().reduce((sum, acc) => sum + parseFloat(acc.currentBalance), 0),
      EQUITY: chartOfAccounts.EQUITY.EQUITY.reduce((sum, acc) => sum + parseFloat(acc.currentBalance), 0),
      REVENUE: chartOfAccounts.REVENUE.REVENUE.reduce((sum, acc) => sum + parseFloat(acc.currentBalance), 0),
      EXPENSES: chartOfAccounts.EXPENSES.EXPENSE_ACCOUNT.reduce((sum, acc) => sum + parseFloat(acc.currentBalance), 0),
    };

    return res.status(200).json({
      success: true,
      data: chartOfAccounts,
      totals,
    });
  } catch (error) {
    console.error("getChartOfAccounts error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Helper function to calculate account balance
async function calculateAccountBalance(accountId) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { balance: true, type: true },
  });

  if (!account) return 0;

  // Get all transactions for this account
  const [incoming, outgoing] = await Promise.all([
    // Transactions where this account receives money
    prisma.Transaction.aggregate({
      where: {
        OR: [
          { toAccountId: accountId },
          {
            fromAccountId: accountId,
            type: 'INCOME' // Income transactions credit the account
          }
        ]
      },
      _sum: { amount: true },
    }),
    // Transactions where this account sends money
    prisma.Transaction.aggregate({
      where: {
        OR: [
          { fromAccountId: accountId, type: { in: ['EXPENSE', 'TRANSFER'] } },
          {
            toAccountId: accountId,
            type: 'EXPENSE' // Expense transactions debit the account
          }
        ]
      },
      _sum: { amount: true },
    }),
  ]);

  const incomingTotal = parseFloat(incoming._sum.amount || 0);
  const outgoingTotal = parseFloat(outgoing._sum.amount || 0);

  return incomingTotal - outgoingTotal;
}
