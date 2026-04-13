import React, { useState, useEffect } from 'react';
import { Upload, Plus } from 'lucide-react';
import TransactionTable from './TransactionTable';
import TransactionForm from './TransactionForm';
import CSVImport from '../CSVImport';

import { useTransactions } from '../../hooks/useTransactions';
import { Button } from '../ui/button';
import { getCategories } from '~/services/categoryServices';
import { getAccounts } from '../../services/accountServices';
import { createTransaction } from '~/services/transactionsServices';

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

export default function Transactions() {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const {
    transactions,
    loading,
    pagination,
    filters,
    setFilters,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  } = useTransactions({
    organizationId: 1,
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const loadAccounts = async () => {
      try {
        setLoadingAccounts(true);
        const response = await getAccounts();
        setAccounts(response?.accounts);
      } catch (error) {
        console.error("Failed to load accounts:", error);
      } finally {
        setLoadingAccounts(false);
      }
    };


  const loadCategories = async () => {
  try {
    setLoadingCategories(true);
    const res = await getCategories(); // ✅ clean, no shape handling here
    console.log("Fetched categories:", res);
    setCategories(res?.categories);
  } catch (error) {
    console.error("Failed to load categories:", error);
  } finally {
    setLoadingCategories(false);
  }
};

 useEffect(() => {
    loadAccounts();
    loadCategories();
  }, []);



  

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
      for (const transaction of parsedTransactions) {
        await createTransaction({
          organizationId: filters.organizationId,
          fromAccountId: 1,
          type: transaction.type,
          status: 'PENDING' as const,
          amount: transaction.amount,
          currency: 'USD' as const,
          date: transaction.date,
          description: transaction.description,
          reference: transaction.reference,
          isAiReviewed: false,
          fromAccount: {} as any,
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

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">Manage your financial transactions and import bank statements</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleImportClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button
              onClick={handleCreateTransaction}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </div>
        </div>

        {/* {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )} */}

        <TransactionTable
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onCreate={handleCreateTransaction}
          loading={loading}
        />

        {pagination && (
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
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

        {showImport && (
          <CSVImport
            onImport={handleCSVImport}
            onCancel={handleImportCancel}
          />
        )}
      </div>
 
  );
}
