"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Calendar,
  Download,
  MoreVertical,
  Zap,
  Target,
  PieChart,
  AlertCircle,
  CheckCircle2,
  FileText,
  BarChart3,
  Wallet,
  CreditCard,
  Clock,
  Filter,
  Settings,
  Plus,
  ChevronRight,
  Activity,
  Flame,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import type { tr } from "framer-motion/client";
import { getStats } from "~/services/dashboardServices";
import { set } from "date-fns";

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  pendingInvoices: number;
  monthlyRecurringRevenue: number;
  cashFlowForecast: number;
  automationRate: number;

  cashFlow: Array<{
    month: string;
    income: number;
    expenses: number;
    forecast?: number;
  }>;

  recentTransactions: Array<{
    id: number;
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: string;
    category?: string;
    status: "completed" | "pending" | "overdue";
    automated?: boolean;
  }>;
  invoices: Array<{
    id: number;
    clientName: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: "paid" | "pending" | "overdue";
    automated?: boolean;
  }>;
  bookkeepingStatus: {
    lastSync: string;
    transactionsProcessed: number;
    automatedPercentage: number;
    nextSync: string;
  };
}

const FinanceDashboard = () => {
  const [data, setData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    pendingInvoices: 0,
    monthlyRecurringRevenue: 0,
    cashFlowForecast: 0,
    automationRate: 0,
    cashFlow: [],

    recentTransactions: [],
    invoices: [],
    bookkeepingStatus: {
      lastSync: "",
      transactionsProcessed: 0,
      automatedPercentage: 0,
      nextSync: "",
    },
  });

  const [stats, setStats] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any>([]);
  const [expenseBreakdown, setexpenseBreakdown] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("6 months");
  
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockData: FinancialData = {
        totalIncome: 245430.5,
        totalExpenses: 167150.75,
        netIncome: 78279.75,
        pendingInvoices: 6,
        monthlyRecurringRevenue: 42500,
        cashFlowForecast: 92500,
        automationRate: 87,

        cashFlow: [
          { month: "Jan", income: 42000, expenses: 28000, forecast: 45000 },
          { month: "Feb", income: 48500, expenses: 31200, forecast: 50000 },
          { month: "Mar", income: 51200, expenses: 32800, forecast: 52000 },
          { month: "Apr", income: 38200, expenses: 25150, forecast: 40000 },
          { month: "May", income: 55600, expenses: 41200, forecast: 58000 },
          { month: "Jun", income: 52900, expenses: 48650, forecast: 55000 },
        ],

        invoices: [
          {
            id: 2024001,
            clientName: "Acme Industries",
            amount: 12500.0,
            issueDate: "2024-01-10",
            dueDate: "2024-02-10",
            status: "paid",
            automated: true,
          },
          {
            id: 2024008,
            clientName: "Tech Solutions Inc",
            amount: 8750.0,
            issueDate: "2024-01-20",
            dueDate: "2024-02-20",
            status: "pending",
            automated: true,
          },
          {
            id: 2024009,
            clientName: "Global Enterprises",
            amount: 15300.0,
            issueDate: "2024-01-15",
            dueDate: "2024-02-15",
            status: "overdue",
            automated: false,
          },
          {
            id: 2024010,
            clientName: "Creative Agency Co",
            amount: 6200.0,
            issueDate: "2024-01-22",
            dueDate: "2024-02-22",
            status: "pending",
            automated: true,
          },
        ],

        bookkeepingStatus: {
          lastSync: "2024-01-28 14:32 UTC",
          transactionsProcessed: 847,
          automatedPercentage: 87,
          nextSync: "2024-01-29 02:00 UTC",
        },
      };

      setData(mockData);
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getStats();
      console.log("Stats:", response);
      setStats(response);
      setRecentTransactions(response?.recentTransactions);
      setexpenseBreakdown(response?.expenseBreakdown);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handlePeriodChange = async (period: string) => {
    setSelectedPeriod(period);
    try {
      const response = await getStats(period);
      // ✅ only update chart, keep everything else
      setStats((prev: any) => ({
        ...prev,
        monthlyFlow: response.monthlyFlow,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log("Stats state recentTransactions:", recentTransactions);
  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    subtitle,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    subtitle?: string;
  }) => (
    <div className="bg-linear-to-br from-white to-slate-50 rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-linear-to-br from-blue-50 to-blue-100">
          {Icon}
        </div>
      </div>
      {subtitle && <p className="text-xs text-slate-500 mb-3">{subtitle}</p>}
      {trend && (
        <div className="flex items-center gap-1">
          {trend === "up" && (
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          )}
          {trend === "down" && (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ${
              trend === "up"
                ? "text-emerald-600"
                : trend === "down"
                  ? "text-red-600"
                  : "text-slate-600"
            }`}
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );

  const CHART_COLORS = [
    "#0f172a",
    "#1e293b",
    "#3b82f6",
    "#06b6d4",
    "#f59e0b",
    "#ef4444",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">
            Loading financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Finance Control Center
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Real-time financial overview and analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title={showBalances ? "Hide balances" : "Show balances"}
              >
                {showBalances ? (
                  <Eye className="h-5 w-5 text-slate-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-slate-600" />
                )}
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Download className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Income"
            value={
              stats?.summary?.income
                ? `Rs${(stats.summary.income / 1000).toFixed(0)}K`
                : "••••••"
            }
            icon={<TrendingUp className="h-6 w-6 text-emerald-600" />}
            trend="up"
            trendValue="+18.5%"
            subtitle="Last 6 months"
          />
          <StatCard
            title="Total Expenses"
            value={
              stats?.summary?.expenses
                ? `Rs${(stats.summary.expenses / 1000).toFixed(0)}K`
                : "••••••"
            }
            icon={<TrendingDown className="h-6 w-6 text-orange-600" />}
            trend="down"
            trendValue="-5.2%"
            subtitle="Cost optimization"
          />
          <StatCard
            title="Net Income"
            value={
              stats?.summary?.net
                ? `Rs${(stats.summary.net / 1000).toFixed(0)}K`
                : "••••••"
            }
            icon={<DollarSign className="h-6 w-6 text-blue-600" />}
            trend="up"
            trendValue="+22.3%"
            subtitle="Profitability"
          />
          <StatCard
            title="Monthly Recurring"
            value={
              showBalances
                ? `$${(data.monthlyRecurringRevenue / 1000).toFixed(1)}K`
                : "••••••"
            }
            icon={<Flame className="h-6 w-6 text-red-600" />}
            trend="up"
            trendValue="+12.1%"
            subtitle="Predictable revenue"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-lg p-1 border border-slate-200 w-fit">
          {[
            { id: "overview", label: "Overview" },
            { id: "expenses", label: "Expense Tracking" },
            { id: "invoices", label: "Invoice Automation" },
            { id: "bookkeeping", label: "Auto Bookkeeping" },
            { id: "reports", label: "Reports" },
          ]?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Cash Flow Chart */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Cash Flow Insights
                  </h3>
                  <p className="text-sm text-slate-600">
                    Income vs Expenses trend analysis
                  </p>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 hover:border-slate-300"
                >
                  <option value="6months">Last 6 months</option>
                  <option value="12months">Last 12 months</option>
                  <option value="ytd">Year to date</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats?.monthlyFlow}>
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorExpenses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Expense Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={500}>
                  <RechartsPieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => name}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="category"
                    >
                      {expenseBreakdown?.map((_: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `Rs${Number(value).toLocaleString()}`,
                      ]}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Transactions
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                    View all <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentTransactions?.map((tx: any) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            tx.type === "INCOME"
                              ? "bg-emerald-100"
                              : "bg-orange-100"
                          }`}
                        >
                          {tx.type === "INCOME" ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {tx.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">
                              {tx.category}
                            </span>
                            {tx.automated && (
                              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                <Zap className="h-3 w-3" />
                                Auto
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            tx.type === "INCOME"
                              ? "text-emerald-600"
                              : "text-orange-600"
                          }`}
                        >
                          {tx.type === "INCOME" ? "+" : "-"}Rs{tx?.amount}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expense Tracking Tab */}
        {activeTab === "expenses" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Expense Tracking & Analysis
                  </h3>
                  <p className="text-sm text-slate-600">
                    Monitor spending patterns and budget allocation
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  <Plus className="h-4 w-4" />
                  Log Expense
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Categories */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">
                    By Category
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={expenseBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="category"
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Budget vs Actual */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Budget Status
                  </h4>
                  <div className="space-y-4">
                    {expenseBreakdown?.map((category: any) => (
                      <div key={category.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            {category?.category}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">
                            Rs{category?.amount}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{
                              width: `${Math.min((category?.value / 60000) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {category?.percentage}% of total
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Automation Tab */}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Invoice Automation
                  </h3>
                  <p className="text-sm text-slate-600">
                    Manage recurring and one-time invoices automatically
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  <Plus className="h-4 w-4" />
                  Create Invoice
                </button>
              </div>

              {/* Invoice Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-700 font-medium">Paid</p>
                  <p className="text-2xl font-bold text-emerald-900 mt-1">
                    $
                    {data.invoices
                      .filter((i) => i.status === "paid")
                      .reduce((sum, i) => sum + i.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    $
                    {data.invoices
                      .filter((i) => i.status === "pending")
                      .reduce((sum, i) => sum + i.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-700 font-medium">Overdue</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">
                    $
                    {data.invoices
                      .filter((i) => i.status === "overdue")
                      .reduce((sum, i) => sum + i.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Invoice List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">
                        Invoice ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-4 px-4 text-sm font-medium text-blue-600">
                          {invoice.id}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-900">
                          {invoice.clientName}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-900">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              invoice.status === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : invoice.status === "pending"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {invoice.status === "paid" && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {invoice.status === "pending" && (
                              <Clock className="h-3 w-3" />
                            )}
                            {invoice.status === "overdue" && (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {invoice.automated ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              <Zap className="h-3 w-3" />
                              Automated
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">
                              Manual
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Auto Bookkeeping Tab */}
        {activeTab === "bookkeeping" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Auto Bookkeeping Status
                  </h3>
                  <p className="text-sm text-slate-600">
                    Automated transaction processing and ledger management
                  </p>
                </div>
              </div>

              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900">
                      Automation Rate
                    </h4>
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-blue-900 mb-2">
                    {data.bookkeepingStatus.automatedPercentage}%
                  </div>
                  <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{
                        width: `${data.bookkeepingStatus.automatedPercentage}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    of transactions processed automatically
                  </p>
                </div>

                <div className="bg-linear-to-br from-emerald-50 to-teal-100 rounded-lg p-6 border border-emerald-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900">
                      Processed Transactions
                    </h4>
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-4xl font-bold text-emerald-900 mb-2">
                    {data.bookkeepingStatus.transactionsProcessed.toLocaleString()}
                  </div>
                  <p className="text-sm text-emerald-700">
                    Total transactions in ledger
                  </p>
                </div>
              </div>

              {/* Sync Information */}
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-4">
                  Sync Information
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Last Sync</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {data.bookkeepingStatus.lastSync}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Next Sync</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {data.bookkeepingStatus.nextSync}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-8">
                <h4 className="font-semibold text-slate-900 mb-4">
                  Active Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Automatic Categorization", status: "active" },
                    { title: "Duplicate Detection", status: "active" },
                    { title: "Bank Reconciliation", status: "active" },
                    { title: "Multi-Currency Support", status: "active" },
                    { title: "Tax Compliance", status: "active" },
                    { title: "Audit Trail", status: "active" },
                  ].map((feature) => (
                    <div
                      key={feature.title}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="font-medium text-slate-900">
                        {feature.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Financial Reports
                  </h3>
                  <p className="text-sm text-slate-600">
                    Generate comprehensive financial statements and analytics
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Income Statement",
                    description: "Revenue, costs, and profitability",
                    icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
                  },
                  {
                    title: "Balance Sheet",
                    description: "Assets, liabilities, and equity",
                    icon: <Wallet className="h-6 w-6 text-emerald-600" />,
                  },
                  {
                    title: "Cash Flow Statement",
                    description: "Liquidity and cash movements",
                    icon: <TrendingUp className="h-6 w-6 text-cyan-600" />,
                  },
                  {
                    title: "Tax Report",
                    description: "Tax calculations and deductions",
                    icon: <FileText className="h-6 w-6 text-orange-600" />,
                  },
                  {
                    title: "Budget vs Actual",
                    description: "Budget performance analysis",
                    icon: <Target className="h-6 w-6 text-purple-600" />,
                  },
                  {
                    title: "Cash Forecast",
                    description: "Projected cash position",
                    icon: <Activity className="h-6 w-6 text-pink-600" />,
                  },
                ].map((report) => (
                  <button
                    key={report.title}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-slate-100 group-hover:bg-slate-200 rounded-lg transition-colors">
                        {report.icon}
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h4 className="font-semibold text-slate-900 group-hover:text-blue-600">
                      {report.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {report.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;
