'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Database,
  Link2,
  RefreshCw,
  Settings,
  Eye,
  Filter,
  Download,
  Zap,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: 'approved' | 'pending' | 'failed';
  automationConfidence: number;
}

interface Feature {
  name: string;
  description: string;
  isEnabled: boolean;
  transactionsProcessed: number;
  accuracy: number;
}

const AutoBookkeeping = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-20',
      description: 'Invoice Payment - Client ABC',
      category: 'Revenue',
      debitAccount: 'Bank Account',
      creditAccount: 'Sales Revenue',
      amount: 5000,
      status: 'approved',
      automationConfidence: 98,
    },
    {
      id: '2',
      date: '2024-01-20',
      description: 'Office Supplies Purchase',
      category: 'Expense',
      debitAccount: 'Office Supplies Expense',
      creditAccount: 'Bank Account',
      amount: 245.50,
      status: 'approved',
      automationConfidence: 95,
    },
    {
      id: '3',
      date: '2024-01-19',
      description: 'Software License Renewal',
      category: 'Software',
      debitAccount: 'Software Expense',
      creditAccount: 'Bank Account',
      amount: 299.99,
      status: 'pending',
      automationConfidence: 87,
    },
    {
      id: '4',
      date: '2024-01-19',
      description: 'Marketing Campaign - Google Ads',
      category: 'Marketing',
      debitAccount: 'Marketing Expense',
      creditAccount: 'Bank Account',
      amount: 1500,
      status: 'approved',
      automationConfidence: 92,
    },
    {
      id: '5',
      date: '2024-01-18',
      description: 'Employee Salary Transfer',
      category: 'Payroll',
      debitAccount: 'Salary Expense',
      creditAccount: 'Bank Account',
      amount: 15000,
      status: 'approved',
      automationConfidence: 99,
    },
  ];

  const bookkeepingFeatures: Feature[] = [
    { name: 'Transaction Categorization', description: 'Auto-categorize transactions using AI', isEnabled: true, transactionsProcessed: 2847, accuracy: 96 },
    { name: 'Bank Reconciliation', description: 'Automatically match and reconcile bank statements', isEnabled: true, transactionsProcessed: 1523, accuracy: 99 },
    { name: 'Multi-Currency Conversion', description: 'Auto-convert foreign transactions', isEnabled: true, transactionsProcessed: 342, accuracy: 97 },
    { name: 'Tax Compliance', description: 'Track tax-relevant transactions', isEnabled: true, transactionsProcessed: 1156, accuracy: 95 },
    { name: 'Duplicate Detection', description: 'Identify and flag duplicate entries', isEnabled: true, transactionsProcessed: 523, accuracy: 98 },
    { name: 'Receipt Digitization', description: 'OCR scanned receipts into entries', isEnabled: false, transactionsProcessed: 0, accuracy: 0 },
  ];

  const automationData = [
    { month: 'Week 1', manual: 120, automated: 880, accuracy: 96 },
    { month: 'Week 2', manual: 95, automated: 905, accuracy: 97 },
    { month: 'Week 3', manual: 85, automated: 915, accuracy: 98 },
    { month: 'Week 4', manual: 60, automated: 940, accuracy: 98 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Approved</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Pending Review</span>;
      case 'failed':
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Failed</span>;
      default:
        return null;
    }
  };

  const totalTransactions = transactions.length;
  const approvedCount = transactions.filter(t => t.status === 'approved').length;
  const avgConfidence = Math.round(transactions.reduce((sum, t) => sum + t.automationConfidence, 0) / transactions.length);
  const automationRate = Math.round((approvedCount / totalTransactions) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Auto Bookkeeping</h1>
          <p className="text-muted-foreground mt-1">Intelligent transaction recording and accounting automation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </Button>
          <Button className="gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200">
          <p className="text-sm text-muted-foreground">Automation Rate</p>
          <p className="text-3xl font-bold text-green-600">{automationRate}%</p>
          <p className="text-xs text-green-600 mt-1">↑ 15% from last month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200">
          <p className="text-sm text-muted-foreground">Avg Confidence</p>
          <p className="text-3xl font-bold text-blue-600">{avgConfidence}%</p>
          <p className="text-xs text-blue-600 mt-1">High accuracy</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200">
          <p className="text-sm text-muted-foreground">Transactions</p>
          <p className="text-3xl font-bold text-purple-600">{totalTransactions}</p>
          <p className="text-xs text-purple-600 mt-1">This week</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200">
          <p className="text-sm text-muted-foreground">Time Saved</p>
          <p className="text-3xl font-bold text-orange-600">847 hrs</p>
          <p className="text-xs text-orange-600 mt-1">YTD automation</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground">
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Review</option>
              <option value="failed">Failed</option>
            </select>
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
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Debit Account</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Credit Account</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Confidence</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{tx.date}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{tx.description}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{tx.debitAccount}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{tx.creditAccount}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">${tx.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${tx.automationConfidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-foreground">{tx.automationConfidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tx.status)}
                          {getStatusBadge(tx.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {bookkeepingFeatures.map((feature) => (
              <Card key={feature.name} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{feature.name}</h4>
                      {feature.isEnabled ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Transactions Processed</p>
                        <p className="text-lg font-bold text-foreground">{feature.transactionsProcessed}</p>
                      </div>
                      {feature.isEnabled && (
                        <div>
                          <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                          <p className="text-lg font-bold text-green-600">{feature.accuracy}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Automation vs Manual Transactions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={automationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="automated" stackId="1" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                <Area type="monotone" dataKey="manual" stackId="1" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Accuracy Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={automationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">System Health</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">Data Quality</span>
                    <span className="text-sm font-semibold text-green-600">98%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">System Uptime</span>
                    <span className="text-sm font-semibold text-green-600">99.8%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">Processing Speed</span>
                    <span className="text-sm font-semibold text-blue-600">245ms avg</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutoBookkeeping;
