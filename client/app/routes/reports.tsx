import React from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">Financial analytics and insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Reports</h3>
            <p className="text-gray-500">Income statements, balance sheets, and cash flow reports</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trend Analysis</h3>
            <p className="text-gray-500">Track spending patterns and revenue trends over time</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <PieChart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Category Breakdown</h3>
            <p className="text-gray-500">Visual breakdown of expenses by category</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Reporting</h3>
          <p className="text-gray-500 mb-6">Generate detailed financial reports with charts and analytics.</p>
          <p className="text-sm text-gray-400">Coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}