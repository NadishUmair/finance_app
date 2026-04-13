import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Account {
  id: number;
  name: string;
  type: string;
  currency: string;
}

interface Category {
  id: number;
  name: string;
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

interface Props {
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
}: Props) {

  const [formData, setFormData] = useState<TransactionFormData>({
    organizationId: transaction?.organizationId || 1,
    fromAccountId: transaction?.fromAccountId || 0,
    toAccountId: transaction?.toAccountId,
    categoryId: transaction?.categoryId,
    type: transaction?.type || 'EXPENSE',
    status: transaction?.status || 'PENDING',
    amount: transaction?.amount || 0,
    currency: transaction?.currency || 'USD',
    date:
      transaction?.date ||
      new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    reference: transaction?.reference || ''
  });

  const [selectedDate, setSelectedDate] =
    useState<Date>(
      new Date(formData.date)
    );

    console.log("categories in form", categories);

  const [errors, setErrors] =
    useState<Partial<
      Record<keyof TransactionFormData, string>
    >>({});

  /* ============================= */
  /* AUTO SET CURRENCY FROM ACCOUNT */
  /* ============================= */

  useEffect(() => {
    const account = accounts?.find(
      a => a.id === formData.fromAccountId
    );

    if (account) {
      setFormData(prev => ({
        ...prev,
        currency: account.currency
      }));
    }
  }, [formData.fromAccountId, accounts]);

  /* ============================= */
  /* VALIDATION */
  /* ============================= */

  const validateForm = () => {

    const newErrors: Partial<
      Record<keyof TransactionFormData, string>
    > = {};

    if (!formData.fromAccountId)
      newErrors.fromAccountId =
        'Account required';

    if (
      formData.type === 'TRANSFER' &&
      !formData.toAccountId
    ) {
      newErrors.toAccountId =
        'Destination required';
    }

    if (
      !formData.amount ||
      formData.amount <= 0
    ) {
      newErrors.amount =
        'Amount must be > 0';
    }

    if (!formData.description.trim()) {
      newErrors.description =
        'Description required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ============================= */
  /* HANDLE INPUT */
  /* ============================= */

  const handleInputChange = (
    field: keyof TransactionFormData,
    value: any
  ) => {

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    if (
      field === 'type' &&
      value !== 'TRANSFER'
    ) {
      setFormData(prev => ({
        ...prev,
        toAccountId: undefined
      }));
    }
  };

  /* ============================= */
  /* SUBMIT */
  /* ============================= */

  const handleSubmit = async (e: React.FormEvent ) => {

    e.preventDefault();
   console.log("Submitting form with data:", formData);
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
    }
  };

  /* ============================= */
  /* FILTER ACCOUNTS */
  /* ============================= */



  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-lg font-semibold">

            {transaction?.id
              ? 'Edit Transaction'
              : 'New Transaction'}

          </h2>

          <button onClick={onCancel}>
            <X className="h-6 w-6"/>
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >

          {/* TYPE */}

          <div>

            <label className="text-sm font-medium">
              Type
            </label>

            <select
              value={formData.type}
              onChange={e =>
                handleInputChange(
                  'type',
                  e.target.value
                )
              }
              className="w-full border px-3 py-2 rounded-md"
            >

              <option value="EXPENSE">
                Expense
              </option>

              <option value="INCOME">
                Income
              </option>

              <option value="TRANSFER">
                Transfer
              </option>

            </select>

          </div>

          {/* ACCOUNTS */}

          <div className="grid md:grid-cols-2 gap-4">

            {/* FROM */}

            <div>

              <label className="text-sm font-medium">

                From Account

              </label>

              <select
                value={formData.fromAccountId}
                onChange={e =>
                  handleInputChange(
                    'fromAccountId',
                    parseInt(e.target.value)
                  )
                }
                className="w-full border px-3 py-2 rounded-md"
              >

                <option value={0}>
                  Select Account
                </option>

                {accounts?.map(acc => (

                  <option
                    key={acc.id}
                    value={acc.id}
                  >

                    {acc.name}

                  </option>

                ))}

              </select>

            </div>

            {/* TO */}

            {formData.type === 'TRANSFER' && (

              <div>

                <label className="text-sm font-medium">

                  To Account

                </label>

                <select
                  value={
                    formData.toAccountId || 0
                  }
                  onChange={e =>
                    handleInputChange(
                      'toAccountId',
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full border px-3 py-2 rounded-md"
                >

                  <option value={0}>
                    Select Account
                  </option>

                  {accounts
                    .filter(
                      acc =>
                        acc.id !==
                        formData.fromAccountId
                    )
                    .map(acc => (

                      <option
                        key={acc.id}
                        value={acc.id}
                      >

                        {acc.name}

                      </option>

                    ))}

                </select>

              </div>

            )}

          </div>

          {/* AMOUNT + DATE */}

          <div className="grid md:grid-cols-2 gap-4">

            {/* AMOUNT */}

            <div>

              <label className="text-sm font-medium">
                Amount
              </label>

              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={e =>
                  handleInputChange(
                    'amount',
                    parseFloat(
                      e.target.value
                    )
                  )
                }
                className="w-full border px-3 py-2 rounded-md"
              />

            </div>

            {/* DATE CALENDAR */}

            <div>

              <label className="text-sm font-medium">
                Date
              </label>

              <DatePicker
                selected={selectedDate}
                onChange={(date: Date) => {

                  setSelectedDate(date);

                  handleInputChange(
                    'date',
                    date
                      .toISOString()
                      .split('T')[0]
                  );

                }}
                className="w-full border px-3 py-2 rounded-md"
                dateFormat="dd/MM/yyyy"
              />

            </div>

          </div>

          {/* CATEGORY */}

          {formData.type !== 'TRANSFER' && (

            <div>

              <label className="text-sm font-medium">
                Category
              </label>

              <select
                value={formData.categoryId || 0}
                onChange={e =>
                  handleInputChange(
                    'categoryId',
                    parseInt(e.target.value)
                  )
                }
                className="w-full border px-3 py-2 rounded-md"
              >

                <option value={0}>
                  Select Category
                </option>

                {categories?.map(cat => (

                  <option
                    key={cat.id}
                    value={cat.id}
                  >

                    {cat.name}

                  </option>

                ))}

              </select>

            </div>

          )}

          {/* DESCRIPTION */}

          <div>

            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              value={formData.description}
              onChange={e =>
                handleInputChange(
                  'description',
                  e.target.value
                )
              }
              className="w-full border px-3 py-2 rounded-md"
            />

          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-md"
            >

              Cancel

            </button>

            <Button
              type="submit"
              disabled={loading}
              className="gap-2"
            >

              {loading
                ? <Loader className="h-4 w-4 animate-spin"/>
                : <Save className="h-4 w-4"/>}

              {transaction?.id
                ? 'Update'
                : 'Create'}

            </Button>

          </div>

        </form>

      </div>

    </div>

  );
}