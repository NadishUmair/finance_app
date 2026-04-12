import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Search, Filter, Plus } from 'lucide-react';
import CategoryBadge from '../CategoryBadge';
import { Button } from '../ui/button';
import { getTransactions } from "../../services/transactionsServices";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  status: 'PENDING' | 'CLEARED' | 'RECONCILED' | 'VOID';
  currency: string;
  reference?: string;
  aiCategory?: string;
  aiConfidence?: number;
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
interface Pagination {
  page: number;
  pages: number;
  total: number;
  limit: number;
}
interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  loading?: boolean;
}

export default function TransactionTable({
  onEdit,
  onDelete,
  onCreate,
  loading = false
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loadingTransactions, setLoadingTransactions] = useState(loading);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [transactions,setTransactions]=useState<Transaction[]>([]);
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.aiCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    const matchesType = !typeFilter || transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CLEARED': return 'bg-green-100 text-green-800';
      case 'RECONCILED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'VOID': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INCOME': return 'text-green-600';
      case 'EXPENSE': return 'text-red-600';
      case 'TRANSFER': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const loadTransactions = async () => {
    setLoadingTransactions(true);
    try {
      // Simulate loading delay
       const resposnse= await getTransactions(page);
        setTransactions(resposnse?.data);
        setPagination(resposnse?.pagination);
        console.log("Transactions loaded:", resposnse);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoadingTransactions(false);
    }
  }

    useEffect(()=>{
      loadTransactions();
    },[page])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header with search and filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
          <Button
            onClick={onCreate}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CLEARED">Cleared</option>
              <option value="RECONCILED">Reconciled</option>
              <option value="VOID">Void</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions?.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    {transaction?.aiCategory && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        AI: {transaction?.aiCategory}
                        {transaction?.aiConfidence && (
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            transaction?.aiConfidence > 0.8 ? 'bg-green-100 text-green-800' :
                            transaction?.aiConfidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {(transaction.aiConfidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction?.category ? (
                    <CategoryBadge category={transaction.category} />
                  ) : (
                    <span className="text-gray-400">Uncategorized</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction?.account?.name}
                  {transaction?.toAccount && transaction?.type === 'TRANSFER' && (
                    <div className="text-xs text-gray-500">
                      → {transaction?.account?.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                    {transaction?.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                    {transaction?.type === 'EXPENSE' ? '-' : transaction?.type === 'INCOME' ? '+' : ''}
                    ${transaction?.amount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction?.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination — add this after the empty state div */}
{pagination && pagination.pages > 1 && (
  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
    
    {/* Info */}
    <p className="text-sm text-gray-500">
      Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
      {pagination.total} transactions
    </p>

    {/* Controls */}
    <div className="flex items-center gap-1">
      {/* Prev */}
      <button
        onClick={() => setPage(p => p - 1)}
        disabled={pagination.page === 1}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Page numbers */}
      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === pagination.pages || Math.abs(p - pagination.page) <= 1)
        .reduce((acc: (number | string)[], p, i, arr) => {
          if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
          acc.push(p);
          return acc;
        }, [])
        .map((p, i) => 
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p as number)}
              className={`px-3 py-1.5 text-sm border rounded-md ${
                pagination.page === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )
      }

      {/* Next */}
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={pagination.page === pagination.pages}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
)}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions found</p>
        </div>
      )}
    </div>
  );
}