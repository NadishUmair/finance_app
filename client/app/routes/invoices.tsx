import React from 'react';
import { FileText, Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function InvoicesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Create and manage your invoices</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Management</h3>
          <p className="text-gray-500 mb-6">Create professional invoices, track payments, and manage your billing.</p>
          <p className="text-sm text-gray-400">Coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}