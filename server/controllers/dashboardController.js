const { prisma } = require("../config/db.js");

exports.getStats = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const { period = "6 months" } = req.query; // e.g. 'month', 'year', 'week' - for future use
    const now = new Date();
    const startOfYear = new Date(now.getFullYear() - 1, now.getMonth(), 2);
    const monthsBack = {
      week: 1,
      month: 1,
      "6 months": 6,
      year: 12,
    };

    const months = monthsBack[period] || 6;
    const [
      totalIncome,
      totalExpenses,
      categoryBreakdown,
      monthlyFlow,
      recentTransactions,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: { organizationId, type: "INCOME", date: { gte: startOfYear } },
        _sum: { amount: true },
      }),

      prisma.transaction.aggregate({
        where: { organizationId, type: "EXPENSE", date: { gte: startOfYear } },
        _sum: { amount: true },
      }),

      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { organizationId, type: "EXPENSE", date: { gte: startOfYear } },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
      }),

      // ✅ CAST to float so numbers come back, not strings
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(date, 'Mon YYYY') as month,
          DATE_TRUNC('month', date) as month_date,
          CAST(SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) AS FLOAT) as income,
          CAST(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS FLOAT) as expenses
        FROM "Transaction"
        WHERE "organizationId" = ${organizationId}
          AND date >= NOW() - (${months} * INTERVAL '6 months')
        GROUP BY DATE_TRUNC('month', date), TO_CHAR(date, 'Mon YYYY')
        ORDER BY month_date ASC
      `,

      prisma.transaction.findMany({
        where: { organizationId },
        orderBy: { date: "desc" },
        take: 5,
        include: { category: true, account: true },
      }),
    ]);

    // Fetch category names
    const categoryIds = categoryBreakdown
      .map((c) => c.categoryId)
      .filter(Boolean);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });
    const categoryMap = {};
    categories.forEach((c) => {
      categoryMap[c.id] = c;
    });

    // ✅ Convert all Decimals to numbers
    const income = parseFloat(totalIncome._sum.amount) || 0;
    const expenses = parseFloat(totalExpenses._sum.amount) || 0;

    return res.json({
      summary: {
        income,
        expenses,
        net: income - expenses,
      },

      // ✅ expenseBreakdown (renamed) with numbers + value field for pie chart
      expenseBreakdown: categoryBreakdown.map((c) => ({
        category: categoryMap[c.categoryId]?.name || "Other",
        color: categoryMap[c.categoryId]?.color || "#6B7280",
        amount: parseFloat(c._sum.amount), // ✅ number
        value: parseFloat(c._sum.amount), // ✅ recharts pie needs 'value'
      })),

      // ✅ monthlyFlow already has floats from CAST
      monthlyFlow,

      // ✅ flatten category and account to strings
      recentTransactions: recentTransactions.map((tx) => ({
        ...tx,
        amount: parseFloat(tx.amount), // ✅ number
        category: tx.category?.name || "Other", // ✅ string not object
        account: tx.account?.name || "Unknown", // ✅ string not object
      })),
    });
  } catch (error) {
    console.error("getStats error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
