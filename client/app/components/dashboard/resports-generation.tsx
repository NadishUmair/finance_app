'use client';

import React, { useState } from 'react';
import {
  Download,
  Eye,
  Share2,
  Trash2,
  Plus,
  Calendar,
  FileText,
  TrendingUp,
  PieChart,
  BarChart3,
  Clock,
  Filter,
  Search,
  Settings
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
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
import { Input } from '../ui/input';

interface Report {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  period: string;
  status: 'ready' | 'generating' | 'scheduled';
  fileSize: string;
  format: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  frequency: string;
}

const ReportsGeneration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const recentReports: Report[] = [
    {
      id: '1',
      name: 'Income Statement',
      type: 'Profitability',
      generatedDate: '2024-01-20',
      period: 'January 2024',
      status: 'ready',
      fileSize: '2.4 MB',
      format: 'PDF',
    },
    {
      id: '2',
      name: 'Cash Flow Report',
      type: 'Liquidity',
      generatedDate: '2024-01-20',
      period: 'January 2024',
      status: 'ready',
      fileSize: '1.8 MB',
      format: 'Excel',
    },
    {
      id: '3',
      name: 'Balance Sheet',
      type: 'Financial Position',
      generatedDate: '2024-01-19',
      period: 'January 2024',
      status: 'ready',
      fileSize: '3.2 MB',
      format: 'PDF',
    },
    {
      id: '4',
      name: 'Tax Report',
      type: 'Compliance',
      generatedDate: '2024-01-15',
      period: '2024 YTD',
      status: 'ready',
      fileSize: '4.1 MB',
      format: 'PDF',
    },
    {
      id: '5',
      name: 'Budget vs Actual',
      type: 'Analysis',
      generatedDate: '2024-01-10',
      period: 'January 2024',
      status: 'ready',
      fileSize: '2.7 MB',
      format: 'Excel',
    },
  ];

  const reportTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Income Statement',
      description: 'Revenue, expenses, and net profit analysis',
      icon: <TrendingUp className="w-6 h-6" />,
      category: 'Financial',
      frequency: 'Monthly',
    },
    {
      id: '2',
      name: 'Balance Sheet',
      description: 'Assets, liabilities, and equity overview',
      icon: <BarChart3 className="w-6 h-6" />,
      category: 'Financial',
      frequency: 'Monthly',
    },
    {
      id: '3',
      name: 'Cash Flow',
      description: 'Cash inflows and outflows tracking',
      icon: <FileText className="w-6 h-6" />,
      category: 'Liquidity',
      frequency: 'Monthly',
    },
    {
      id: '4',
      name: 'Tax Report',
      description: 'Tax liabilities and compliance summary',
      icon: <FileText className="w-6 h-6" />,
      category: 'Compliance',
      frequency: 'Quarterly',
    },
    {
      id: '5',
      name: 'Budget vs Actual',
      description: 'Compare budgeted vs actual expenses',
      icon: <BarChart3 className="w-6 h-6" />,
      category: 'Analysis',
      frequency: 'Monthly',
    },
    {
      id: '6',
      name: 'Cash Forecast',
      description: 'Projected cash position and flow',
      icon: <TrendingUp className="w-6 h-6" />,
      category: 'Forecast',
      frequency: 'Monthly',
    },
  ];

  const incomeStatementData = [
    { category: 'Revenue', amount: 45230 },
    { category: 'Cost of Goods', amount: 12500 },
    { category: 'Operating Expenses', amount: 8900 },
    { category: 'Utilities', amount: 2100 },
    { category: 'Net Income', amount: 21730 },
  ];

  const budgetVsActualData = [
    { category: 'Marketing', budget: 5000, actual: 4250 },
    { category: 'Technology', budget: 3000, actual: 3450 },
    { category: 'Office', budget: 2000, actual: 1850 },
    { category: 'Utilities', budget: 1500, actual: 1600 },
    { category: 'Travel', budget: 2500, actual: 2100 },
  ];

  const cashFlowData = [
    { week: 'Week 1', inflow: 15000, outflow: 8900 },
    { week: 'Week 2', inflow: 12000, outflow: 10200 },
    { week: 'Week 3', inflow: 18500, outflow: 9100 },
    { week: 'Week 4', inflow: 14200, outflow: 8700 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">Generating...</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and manage financial reports</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200">
          <p className="text-sm text-muted-foreground">Total Reports</p>
          <p className="text-3xl font-bold text-blue-600">47</p>
          <p className="text-xs text-blue-600 mt-1">5 this month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200">
          <p className="text-sm text-muted-foreground">Storage Used</p>
          <p className="text-3xl font-bold text-green-600">18.2 GB</p>
          <p className="text-xs text-green-600 mt-1">of 100 GB</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200">
          <p className="text-sm text-muted-foreground">Avg Gen Time</p>
          <p className="text-3xl font-bold text-purple-600">3.2s</p>
          <p className="text-xs text-purple-600 mt-1">↓ 15% faster</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200">
          <p className="text-sm text-muted-foreground">Scheduled</p>
          <p className="text-3xl font-bold text-orange-600">12</p>
          <p className="text-xs text-orange-600 mt-1">Automated reports</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Recent Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground">
              <option value="all">All Types</option>
              <option value="financial">Financial</option>
              <option value="compliance">Compliance</option>
              <option value="analysis">Analysis</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Report Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Period</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Generated</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Format</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{report.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{report.type}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{report.period}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{report.generatedDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant="outline">{report.format}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(report.status)}</td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {template.icon}
                  </div>
                  <Badge variant="outline">{template.frequency}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{template.category}</span>
                  <Button size="sm" className="gap-1">
                    <Plus className="w-3 h-3" />
                    Generate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Income Statement Preview</h3>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeStatementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="category" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Budget vs Actual</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={budgetVsActualData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" stroke="var(--muted-foreground)" angle={-45} height={80} />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="var(--chart-1)" />
                  <Bar dataKey="actual" fill="var(--chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Cash Flow</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="inflow" stroke="var(--chart-1)" strokeWidth={2} />
                  <Line type="monotone" dataKey="outflow" stroke="var(--chart-2)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Expense Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={budgetVsActualData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, actual }) => `${category} $${actual}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="actual"
                  >
                    {budgetVsActualData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[
                        'var(--chart-1)',
                        'var(--chart-2)',
                        'var(--chart-3)',
                        'var(--chart-4)',
                        'var(--chart-5)',
                      ][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>

              <div className="flex flex-col justify-center gap-3">
                {budgetVsActualData.map((item, index) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor: [
                          'var(--chart-1)',
                          'var(--chart-2)',
                          'var(--chart-3)',
                          'var(--chart-4)',
                          'var(--chart-5)',
                        ][index],
                      }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.category}</p>
                      <p className="text-xs text-muted-foreground">${item.actual.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsGeneration;
