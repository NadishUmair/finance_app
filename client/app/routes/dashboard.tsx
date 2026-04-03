import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardHome from '../components/dashboard/dashboardHome';
import FinanceDashboard from '../components/dashboard/finance-dashboard';
import ExpenseTracking from '../components/dashboard/expense-tracking';
import AutoBookkeeping from '../components/dashboard/auto-bookkeeping';
import CashFlowInsights from '../components/dashboard/cash-flow-insights';
import InvoiceAutomation from '../components/dashboard/invoice-automation';
import ReportsGeneration from '../components/dashboard/resports-generation';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial management and insights</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="bookkeeping">Bookkeeping</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardHome />
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <FinanceDashboard />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <ExpenseTracking />
          </TabsContent>

          <TabsContent value="bookkeeping" className="space-y-6">
            <AutoBookkeeping />
          </TabsContent>

          <TabsContent value="cashflow" className="space-y-6">
            <CashFlowInsights />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <InvoiceAutomation />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsGeneration />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}