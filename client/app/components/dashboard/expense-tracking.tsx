'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Calendar,
  DollarSign,
  ShoppingCart,
  Zap,
  Home,
  Briefcase
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select } from '../ui/select';
import { Input } from '../ui/input';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'overdue';
}

const ExpenseTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  const expenses: Expense[] = [
    { id: '1', description: 'Office Supplies', amount: 245.50, category: 'Office', date: '2024-01-15', paymentMethod: 'Credit Card', status: 'paid' },
    { id: '2', description: 'Software Subscription', amount: 99.99, category: 'Technology', date: '2024-01-14', paymentMethod: 'Bank Transfer', status: 'paid' },
    { id: '3', description: 'Marketing Campaign', amount: 1250.00, category: 'Marketing', date: '2024-01-13', paymentMethod: 'Credit Card', status: 'pending' },
    { id: '4', description: 'Internet Bill', amount: 79.99, category: 'Utilities', date: '2024-01-12', paymentMethod: 'Auto-pay', status: 'paid' },
    { id: '5', description: 'Client Meeting Lunch', amount: 125.75, category: 'Entertainment', date: '2024-01-11', paymentMethod: 'Cash', status: 'overdue' },
    { id: '6', description: 'Server Hosting', amount: 299.00, category: 'Technology', date: '2024-01-10', paymentMethod: 'Bank Transfer', status: 'paid' },
  ];

  const expensesByCategory = [
    { name: 'Technology', value: 398.99, color: '#3b82f6' },
    { name: 'Marketing', value: 1250.00, color: '#f97316' },
    { name: 'Office', value: 245.50, color: '#8b5cf6' },
    { name: 'Utilities', value: 79.99, color: '#06b6d4' },
    { name: 'Entertainment', value: 125.75, color: '#ec4899' },
  ];

  const trendData = [
    { month: 'Jan 1-7', amount: 1200 },
    { month: 'Jan 8-14', amount: 1850 },
    { month: 'Jan 15-21', amount: 1450 },
    { month: 'Jan 22-28', amount: 2100 },
    { month: 'Jan 29+', amount: 950 },
  ];

  const categoryStats = [
    { name: 'Technology', total: 398.99, percentage: 18, trend: 'up' },
    { name: 'Marketing', total: 1250.00, percentage: 57, trend: 'up' },
    { name: 'Office', total: 245.50, percentage: 11, trend: 'down' },
    { name: 'Utilities', total: 79.99, percentage: 4, trend: 'neutral' },
    { name: 'Entertainment', total: 125.75, percentage: 6, trend: 'up' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technology':
        return <Zap className="w-4 h-4" />;
      case 'Marketing':
        return <TrendingUp className="w-4 h-4" />;
      case 'Office':
        return <Briefcase className="w-4 h-4" />;
      case 'Utilities':
        return <Home className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expense Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all business expenses</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1">↓ 5.2% from last month</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Highest Category</p>
              <p className="text-2xl font-bold text-foreground">Marketing</p>
              <p className="text-xs text-orange-600 mt-1">57% of total</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue Expenses</p>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-xs text-red-600 mt-1">$125.75 due</p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Budget Used</p>
              <p className="text-2xl font-bold text-foreground">68%</p>
              <p className="text-xs text-green-600 mt-1">$1,000 remaining</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Expense List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        {/* Expense List Tab */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="marketing">Marketing</option>
              <option value="office">Office</option>
              <option value="utilities">Utilities</option>
              <option value="entertainment">Entertainment</option>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Payment Method</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{expense.description}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(expense.category)}
                          {expense.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">${expense.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{expense.date}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{expense.paymentMethod}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Expense Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--primary)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Category Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Expense Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {categoryStats.map((stat) => (
                <div key={stat.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{stat.name}</span>
                      <span className="text-sm font-semibold text-foreground">${stat.total.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-red-600' : stat.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                      {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'} {stat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Monthly Budget</p>
              <p className="text-3xl font-bold text-foreground">$5,000.00</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Used</p>
              <p className="text-3xl font-bold text-orange-600">$3,400.23</p>
              <p className="text-xs text-muted-foreground mt-1">68% of budget</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-3xl font-bold text-green-600">$1,599.77</p>
              <p className="text-xs text-muted-foreground mt-1">32% remaining</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Budget by Category</h3>
            <div className="space-y-4">
              {[
                { name: 'Marketing', allocated: 2000, spent: 1250, color: 'bg-orange-500' },
                { name: 'Technology', allocated: 1500, spent: 398.99, color: 'bg-blue-500' },
                { name: 'Office', allocated: 800, spent: 245.50, color: 'bg-purple-500' },
                { name: 'Utilities', allocated: 400, spent: 79.99, color: 'bg-cyan-500' },
                { name: 'Entertainment', allocated: 300, spent: 125.75, color: 'bg-pink-500' },
              ].map((budget) => (
                <div key={budget.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{budget.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${budget.spent.toFixed(2)} / ${budget.allocated.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div
                      className={`${budget.color} h-3 rounded-full`}
                      style={{ width: `${(budget.spent / budget.allocated) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseTracking;
