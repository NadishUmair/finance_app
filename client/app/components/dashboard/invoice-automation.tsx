'use client';

import React, { useState } from 'react';
import {
  Send,
  Download,
  Eye,
  Trash2,
  Copy,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  RefreshCw,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdDate: string;
  automationLevel: 'manual' | 'semi-auto' | 'fully-auto';
}

interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  isActive: boolean;
  invoicesSaved: number;
}

const InvoiceAutomation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      client: 'Acme Corporation',
      amount: 5000.00,
      dueDate: '2024-02-15',
      status: 'paid',
      createdDate: '2024-01-15',
      automationLevel: 'fully-auto',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      client: 'Tech Startups Inc',
      amount: 3500.00,
      dueDate: '2024-02-10',
      status: 'sent',
      createdDate: '2024-01-16',
      automationLevel: 'fully-auto',
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      client: 'Global Solutions Ltd',
      amount: 7200.00,
      dueDate: '2024-01-25',
      status: 'overdue',
      createdDate: '2024-01-10',
      automationLevel: 'semi-auto',
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      client: 'Digital Ventures',
      amount: 2800.00,
      dueDate: '2024-02-20',
      status: 'draft',
      createdDate: '2024-01-17',
      automationLevel: 'manual',
    },
    {
      id: '5',
      invoiceNumber: 'INV-2024-005',
      client: 'Enterprise Systems',
      amount: 9500.00,
      dueDate: '2024-02-05',
      status: 'sent',
      createdDate: '2024-01-14',
      automationLevel: 'fully-auto',
    },
  ];

  const automationRules: AutomationRule[] = [
    { id: '1', name: 'Auto-send on creation', condition: 'All new invoices', action: 'Send email to client', isActive: true, invoicesSaved: 847 },
    { id: '2', name: 'Recurring invoices', condition: 'Monthly subscriptions', action: 'Create & send automatically', isActive: true, invoicesSaved: 342 },
    { id: '3', name: 'Late payment reminders', condition: 'Payment overdue 5+ days', action: 'Send reminder email', isActive: true, invoicesSaved: 156 },
    { id: '4', name: 'Payment confirmation', condition: 'Payment received', action: 'Send receipt & thank you email', isActive: true, invoicesSaved: 523 },
    { id: '5', name: 'Bulk approval', condition: 'Invoices <$1000', action: 'Auto-approve & send', isActive: false, invoicesSaved: 0 },
  ];

  const automationMetrics = [
    { name: 'Mon', time: 12, revenue: 2400 },
    { name: 'Tue', time: 18, revenue: 1398 },
    { name: 'Wed', time: 9, revenue: 9800 },
    { name: 'Thu', time: 14, revenue: 3908 },
    { name: 'Fri', time: 22, revenue: 4800 },
    { name: 'Sat', time: 11, revenue: 3800 },
    { name: 'Sun', time: 8, revenue: 4300 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'sent':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getAutomationBadge = (level: string) => {
    switch (level) {
      case 'fully-auto':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Fully Automated</span>;
      case 'semi-auto':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Semi-Automated</span>;
      case 'manual':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Manual</span>;
      default:
        return null;
    }
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === 'sent' || inv.status === 'draft').reduce((sum, inv) => sum + inv.amount, 0);
  const automationRate = 78;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoice Automation</h1>
          <p className="text-muted-foreground mt-1">Automate invoice creation, sending, and payment tracking</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200">
          <p className="text-sm text-muted-foreground">Total Invoiced</p>
          <p className="text-3xl font-bold text-foreground">${(totalInvoiced / 1000).toFixed(1)}k</p>
          <p className="text-xs text-blue-600 mt-1">5 invoices this month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-3xl font-bold text-green-600">${(totalPaid / 1000).toFixed(1)}k</p>
          <p className="text-xs text-green-600 mt-1">1 invoice paid</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-3xl font-bold text-orange-600">${(totalPending / 1000).toFixed(1)}k</p>
          <p className="text-xs text-orange-600 mt-1">2 pending</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200">
          <p className="text-sm text-muted-foreground">Automation Rate</p>
          <p className="text-3xl font-bold text-purple-600">{automationRate}%</p>
          <p className="text-xs text-purple-600 mt-1">↑ 12% from last month</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </Select>
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
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Invoice #</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Due Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Automation</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{invoice.client}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">${invoice.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{getAutomationBadge(invoice.automationLevel)}</td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button className="p-1 hover:bg-secondary rounded transition-colors">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Automation Rules Tab */}
        <TabsContent value="automation" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Automation Rules</h3>
              <p className="text-sm text-muted-foreground">Manage automatic invoice workflows</p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Rule
            </Button>
          </div>

          <div className="space-y-3">
            {automationRules.map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{rule.name}</h4>
                      {rule.isActive && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                      )}
                      {!rule.isActive && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Condition: {rule.condition}</p>
                    <p className="text-sm text-muted-foreground mb-3">Action: {rule.action}</p>
                    <p className="text-xs text-primary font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {rule.invoicesSaved} invoices automated
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Time Saved (Hours)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={automationMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="time" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Generated</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={automationMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--chart-2)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Automation Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-muted-foreground">Invoices Automated</p>
                <p className="text-3xl font-bold text-green-600">1,868</p>
                <p className="text-xs text-green-600 mt-1">78% automation rate</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-3xl font-bold text-blue-600">342 hrs</p>
                <p className="text-xs text-blue-600 mt-1">~$17,100 saved</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-3xl font-bold text-purple-600">0.2%</p>
                <p className="text-xs text-purple-600 mt-1">4 errors in 1,868 invoices</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceAutomation;
