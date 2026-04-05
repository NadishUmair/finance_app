'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Activity,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  Bell,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart
} from 'recharts';

import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface CashFlowInsight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success';
  action?: string;
}

interface CashFlowForecast {
  month: string;
  projected: number;
  confidence: number;
  inflow: number;
  outflow: number;
}

const CashFlowInsights = () => {
  const [dateRange, setDateRange] = useState('6months');
  const [forecastDays, setForecastDays] = useState(90);

  const insights: CashFlowInsight[] = [
    {
      id: '1',
      title: 'Strong Cash Position',
      description: 'Your cash balance of $145,230 is 23% above average. Consider strategic investments.',
      severity: 'success',
      action: 'View opportunities',
    },
    {
      id: '2',
      title: 'Seasonal Cash Dip Predicted',
      description: 'Forecast shows Q2 will have 18% lower cash. Plan ahead for this period.',
      severity: 'warning',
      action: 'Create contingency plan',
    },
    {
      id: '3',
      title: 'Invoice Payment Delay Risk',
      description: 'ABC Corp typically takes 45 days to pay. $5,000 invoice from Jan 15 due Feb 28.',
      severity: 'warning',
      action: 'Follow up payment',
    },
    {
      id: '4',
      title: 'Operating Expenses Trending Down',
      description: 'Monthly operating expenses decreased 12% vs last quarter.',
      severity: 'success',
      action: 'View details',
    },
  ];

  const cashFlowData = [
    { month: 'Jan', inflow: 45230, outflow: 32150, balance: 145230 },
    { month: 'Feb', inflow: 52100, outflow: 38900, balance: 158430 },
    { month: 'Mar', inflow: 48500, outflow: 35200, balance: 171730 },
    { month: 'Apr', inflow: 42300, outflow: 42100, balance: 171930 },
    { month: 'May', inflow: 38900, outflow: 39200, balance: 171630 },
    { month: 'Jun', inflow: 55200, outflow: 36800, balance: 190030 },
  ];

  const forecastData: CashFlowForecast[] = [
    { month: 'Jul', projected: 198450, confidence: 95, inflow: 58000, outflow: 34200 },
    { month: 'Aug', projected: 201200, confidence: 92, inflow: 52300, outflow: 35100 },
    { month: 'Sep', projected: 195800, confidence: 88, inflow: 48900, outflow: 37400 },
    { month: 'Oct', projected: 187300, confidence: 82, inflow: 42100, outflow: 38900 },
  ];

  const receivablesData = [
    { category: 'Due Now', amount: 12500, count: 3 },
    { category: 'Due <7 days', amount: 8900, count: 2 },
    { category: 'Due 7-30 days', amount: 15700, count: 4 },
    { category: 'Overdue', amount: 3200, count: 1 },
  ];

  const payablesData = [
    { category: 'Due Now', amount: 5600, count: 2 },
    { category: 'Due <7 days', amount: 12300, count: 5 },
    { category: 'Due 7-30 days', amount: 8900, count: 3 },
    { category: 'Beyond 30 days', amount: 4100, count: 1 },
  ];

  const getInsightIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const currentBalance = 190030;
  const monthlyAverage = (45230 + 52100 + 48500 + 42300 + 38900 + 55200) / 6;
  const projectedBalance = 198450;
  const runwayMonths = Math.round(currentBalance / 35000);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cash Flow Insights</h1>
          <p className="text-muted-foreground mt-1">Real-time cash position and predictive analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button variant="outline" className="gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-3xl font-bold text-green-600">${(currentBalance / 1000).toFixed(1)}k</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200">
          <p className="text-sm text-muted-foreground">Monthly Average</p>
          <p className="text-3xl font-bold text-blue-600">${(monthlyAverage / 1000).toFixed(1)}k</p>
          <p className="text-xs text-blue-600 mt-1">6-month average</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200">
          <p className="text-sm text-muted-foreground">Projected (90d)</p>
          <p className="text-3xl font-bold text-purple-600">${(projectedBalance / 1000).toFixed(1)}k</p>
          <p className="text-xs text-purple-600 mt-1">High confidence</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200">
          <p className="text-sm text-muted-foreground">Cash Runway</p>
          <p className="text-3xl font-bold text-orange-600">{runwayMonths} months</p>
          <p className="text-xs text-orange-600 mt-1">at current burn rate</p>
        </Card>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight) => (
          <Card key={insight.id} className={`p-4 border ${getInsightColor(insight.severity)}`}>
            <div className="flex items-start gap-4">
              {getInsightIcon(insight.severity)}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
              </div>
              {insight.action && (
                <Button size="sm" variant="outline">
                  {insight.action}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Cash Flow</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="receivables">Receivables</TabsTrigger>
          <TabsTrigger value="payables">Payables</TabsTrigger>
        </TabsList>

        {/* Cash Flow Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">6-Month Cash Flow</h3>
              <select className="px-3 py-1 border border-border rounded-lg text-sm bg-background">
                <option value="6months">Last 6 months</option>
                <option value="12months">Last 12 months</option>
                <option value="3months">Last 3 months</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="inflow"
                  stackId="1"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.6}
                  name="Inflow"
                />
                <Area
                  type="monotone"
                  dataKey="outflow"
                  stackId="1"
                  stroke="var(--destructive)"
                  fill="var(--destructive)"
                  fillOpacity={0.6}
                  name="Outflow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Cash Balance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--primary)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">90-Day Cash Forecast</h3>
                <p className="text-sm text-muted-foreground mt-1">Predictive analysis based on historical data</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">AI Powered</Badge>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="inflow" fill="var(--chart-1)" name="Projected Inflow" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outflow" fill="var(--destructive)" name="Projected Outflow" radius={[8, 8, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  name="Projected Balance"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h4 className="font-semibold text-foreground mb-4">Forecast Confidence</h4>
              <div className="space-y-3">
                {forecastData.map((item) => (
                  <div key={item.month}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{item.month}</span>
                      <span className="text-xs font-semibold text-foreground">{item.confidence}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold text-foreground mb-4">Key Forecast Factors</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <ArrowUp className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-muted-foreground">Q3 seasonal revenue increase expected</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowDown className="w-4 h-4 text-red-600 mt-0.5" />
                  <span className="text-muted-foreground">Customer payment delays trending up</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-muted-foreground">Planned expansion costs in Aug</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="text-muted-foreground">Operating expenses stable ±5%</span>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>

        {/* Receivables Tab */}
        <TabsContent value="receivables" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Outstanding Receivables</h3>
              <div className="space-y-3">
                {receivablesData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.category}</p>
                      <p className="text-xs text-muted-foreground">{item.count} invoices</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">${item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">Total Outstanding</p>
                <p className="text-2xl font-bold text-blue-600">$40,300</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Aging Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={receivablesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" stroke="var(--muted-foreground)" angle={-45} height={80} />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Payables Tab */}
        <TabsContent value="payables" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Payables</h3>
              <div className="space-y-3">
                {payablesData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.category}</p>
                      <p className="text-xs text-muted-foreground">{item.count} bills</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">${item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-semibold text-orange-900">Total Payable</p>
                <p className="text-2xl font-bold text-orange-600">$30,900</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Payment Schedule</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={payablesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" stroke="var(--muted-foreground)" angle={-45} height={80} />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashFlowInsights;
