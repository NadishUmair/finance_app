const { prisma } = require("../config/db");

exports.getOrganizationSummary = async (req, res) => {
  try {
    const { organizationId } = req.query;
    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId query parameter is required" });
    }

    const orgId = parseInt(organizationId, 10);

    const totalIncome = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { organizationId: orgId, type: "INCOME" },
    });

    const totalExpense = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { organizationId: orgId, type: "EXPENSE" },
    });

    const accountCount = await prisma.account.count({ where: { organizationId: orgId } });
    const invoiceCount = await prisma.invoice.count({ where: { organizationId: orgId } });

    return res.status(200).json({
      success: true,
      data: {
        totalIncome: parseFloat(totalIncome._sum.amount || 0),
        totalExpense: parseFloat(totalExpense._sum.amount || 0),
        netCashFlow: parseFloat((totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0)),
        accountCount,
        invoiceCount,
      },
    });
  } catch (error) {
    console.error("getOrganizationSummary error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getInvoiceAgingReport = async (req, res) => {
  try {
    const { organizationId } = req.query;
    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId query parameter is required" });
    }

    const orgId = parseInt(organizationId, 10);

    const invoices = await prisma.invoice.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        invoiceNumber: true,
        clientName: true,
        status: true,
        dueDate: true,
        amountDue: true,
      },
    });

    const today = new Date();
    const aging = invoices.map((inv) => ({
      ...inv,
      daysOverdue: inv.dueDate < today ? Math.floor((today - inv.dueDate) / (1000 * 60 * 60 * 24)) : 0,
    }));

    return res.status(200).json({ success: true, data: aging });
  } catch (error) {
    console.error("getInvoiceAgingReport error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
