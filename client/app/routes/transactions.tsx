import React, { useState, useEffect } from 'react';
import { Upload, Plus } from 'lucide-react';
import TransactionTable from '../components/TransactionTable';
import TransactionForm from '../components/TransactionForm';
import CSVImport from '../components/CSVImport';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useTransactions } from '../hooks/useTransactions';

interface Account {
  id: number;
  name: string;
  type: string;
  currency: string;
}

interface Category {
  id: number;
  name: string;
  color?: string;
  icon?: string;
}

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize with default organization ID (should come from auth context)
  const {
    transactions,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  } = useTransactions({
    organizationId: 1, // TODO: Get from auth context
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch accounts and categories on mount
  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, []);

  const fetchAccounts = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/accounts?organizationId=1');
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/categories?organizationId=1');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
      } else {
        await createTransaction(data);
      }
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleImportClick = () => {
    setShowImport(true);
  };

  const handleImportCancel = () => {
    setShowImport(false);
  };

  const handleCSVImport = async (parsedTransactions: any[]) => {
    try {
      // Process each transaction
      for (const transaction of parsedTransactions) {
        await createTransaction({
          organizationId: filters.organizationId,
          fromAccountId: 1, // TODO: Let user select default account
          type: transaction.type,
          status: 'PENDING' as const,
          amount: transaction.amount,
          currency: 'USD' as const,
          date: transaction.date,
          description: transaction.description,
          reference: transaction.reference,
          isAiReviewed: false,
          fromAccount: {} as any, // This will be populated by the API
          toAccount: undefined,
          category: undefined,
          invoiceId: undefined,
        });
      }
      setShowImport(false);
      await refreshTransactions();
    } catch (error) {
      console.error('Error importing transactions:', error);
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">Manage your financial transactions and import bank statements</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleImportClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </button>
            <button
              onClick={handleCreateTransaction}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onCreate={handleCreateTransaction}
          loading={loading}
        />

        {/* Pagination Info */}
        {pagination && (
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} transactions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setFilters({ page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            accounts={accounts}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
          />
        )}

        {/* CSV Import Modal */}
        {showImport && (
          <CSVImport
            onImport={handleCSVImport}
            onCancel={handleImportCancel}
          />
        )}
      </div>
    </DashboardLayout>
  );
}