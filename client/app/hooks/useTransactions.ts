import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Transaction {
  id: number;
  organizationId: number;
  fromAccountId: number;
  toAccountId?: number;
  categoryId?: number;
  invoiceId?: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  status: 'PENDING' | 'CLEARED' | 'RECONCILED' | 'VOID';
  amount: number;
  currency: string;
  exchangeRate?: number;
  description: string;
  notes?: string;
  reference?: string;
  date: string;
  aiCategory?: string;
  aiConfidence?: number;
  isAiReviewed: boolean;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  fromAccount: {
    id: number;
    name: string;
    type: string;
  };
  toAccount?: {
    id: number;
    name: string;
    type: string;
  };
  category?: {
    id: number;
    name: string;
    color?: string;
    icon?: string;
  };
}

interface TransactionFilters {
  organizationId: number;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  status?: 'PENDING' | 'CLEARED' | 'RECONCILED' | 'VOID';
  categoryId?: number;
  accountId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  filters: TransactionFilters;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  createTransaction: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: number, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  getTransactionById: (id: number) => Promise<Transaction | null>;
  refreshTransactions: () => Promise<void>;
}

export function useTransactions(initialFilters: TransactionFilters): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filters, setFiltersState] = useState<TransactionFilters>(initialFilters);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get(`/api/transactions?${queryParams.toString()}`);

      if (response.data.success) {
        setTransactions(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTransaction = useCallback(async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/transactions', data);

      if (response.data.success) {
        await fetchTransactions(); // Refresh the list
      } else {
        setError(response.data.message || 'Failed to create transaction');
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error creating transaction:', err);
      const message = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const updateTransaction = useCallback(async (id: number, data: Partial<Transaction>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.patch(`/api/transactions/${id}`, data);

      if (response.data.success) {
        await fetchTransactions(); // Refresh the list
      } else {
        setError(response.data.message || 'Failed to update transaction');
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error updating transaction:', err);
      const message = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/api/transactions/${id}?organizationId=${filters.organizationId}`);

      if (response.data.success) {
        await fetchTransactions(); // Refresh the list
      } else {
        setError(response.data.message || 'Failed to delete transaction');
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      const message = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, filters.organizationId]);

  const getTransactionById = useCallback(async (id: number): Promise<Transaction | null> => {
    try {
      const response = await axios.get(`/api/transactions/${id}?organizationId=${filters.organizationId}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        setError(response.data.message || 'Failed to fetch transaction');
        return null;
      }
    } catch (err) {
      console.error('Error fetching transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transaction');
      return null;
    }
  }, [filters.organizationId]);

  const setFilters = useCallback((newFilters: Partial<TransactionFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    refreshTransactions,
  };
}