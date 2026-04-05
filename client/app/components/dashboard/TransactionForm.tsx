import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { Button } from '../ui/button';

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

interface TransactionFormData {
  organizationId: number;
  fromAccountId: number;
  toAccountId?: number;
  categoryId?: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  status: 'PENDING' | 'CLEARED' | 'RECONCILED' | 'VOID';
  amount: number;
  currency: string;
  date: string;
  description: string;
  reference?: string;
}

interface TransactionFormProps {
  transaction?: Partial<TransactionFormData> & { id?: number };
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function TransactionForm({
  transaction,
  accounts,
  categories,
  onSubmit,
  onCancel,
  loading = false
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    organizationId: transaction?.organizationId || 1, // Default org ID
    fromAccountId: transaction?.fromAccountId || 0,
    toAccountId: transaction?.toAccountId,
    categoryId: transaction?.categoryId,
    type: transaction?.type || 'EXPENSE',
    status: transaction?.status || 'PENDING',
    amount: transaction?.amount || 0,
    currency: transaction?.currency || 'USD',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    reference: transaction?.reference || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};

    if (!formData.fromAccountId) newErrors.fromAccountId = 'From account is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (formData.type === 'TRANSFER' && !formData.toAccountId) {
      newErrors.toAccountId = 'To account is required for transfers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Reset toAccountId if type is not TRANSFER
    if (field === 'type' && value !== 'TRANSFER') {
      setFormData(prev => ({ ...prev, toAccountId: undefined }));
    }
  };

  const filteredAccounts = accounts.filter(account =>
    formData.type === 'TRANSFER' ? true : account.type !== 'CREDIT_CARD'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {transaction?.id ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
                <option value="TRANSFER">Transfer</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="CLEARED">Cleared</option>
                <option value="RECONCILED">Reconciled</option>
                <option value="VOID">Void</option>
              </select>
            </div>
          </div>

          {/* Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Account *
              </label>
              <select
                value={formData.fromAccountId}
                onChange={(e) => handleInputChange('fromAccountId', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fromAccountId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value={0}>Select account</option>
                {filteredAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
              {errors.fromAccountId && <p className="mt-1 text-sm text-red-600">{errors.fromAccountId}</p>}
            </div>

            {formData.type === 'TRANSFER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Account *
                </label>
                <select
                  value={formData.toAccountId || 0}
                  onChange={(e) => handleInputChange('toAccountId', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.toAccountId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value={0}>Select account</option>
                  {accounts
                    .filter(account => account.id !== formData.fromAccountId)
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({account.type})
                      </option>
                    ))}
                </select>
                {errors.toAccountId && <p className="mt-1 text-sm text-red-600">{errors.toAccountId}</p>}
              </div>
            )}
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>
          </div>

          {/* Category */}
          {formData.type !== 'TRANSFER' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.categoryId || 0}
                onChange={(e) => handleInputChange('categoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Select category (optional)</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter transaction description..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference (optional)
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Check number, bank reference, etc."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {transaction?.id ? 'Update' : 'Create'} Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}