import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader } from 'lucide-react';
import Papa from 'papaparse';

interface CSVRow {
  [key: string]: string | number;
}

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  reference?: string;
}

interface CSVImportProps {
  onImport: (transactions: Omit<ParsedTransaction, 'type'>[]) => Promise<void>;
  onCancel: () => void;
}

export default function CSVImport({ onImport, onCancel }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    setLoading(true);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions = processCSVData(results.data as CSVRow[]);
          setParsedData(transactions);
        } catch (error) {
          setErrors([error instanceof Error ? error.message : 'Failed to parse CSV']);
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        setErrors([`CSV parsing error: ${error.message}`]);
        setLoading(false);
      }
    });
  };

  const processCSVData = (data: CSVRow[]): ParsedTransaction[] => {
    if (data.length === 0) {
      throw new Error('CSV file is empty');
    }

    const transactions: ParsedTransaction[] = [];
    const newErrors: string[] = [];

    // Common CSV column mappings for bank statements
    const columnMappings = {
      date: ['date', 'transaction date', 'posting date', 'value date', 'Date'],
      description: ['description', 'memo', 'details', 'transaction details', 'Description', 'Memo'],
      amount: ['amount', 'debit', 'credit', 'value', 'Amount', 'Debit', 'Credit'],
      reference: ['reference', 'ref', 'check number', 'transaction id', 'Reference', 'Ref']
    };

    // Find column headers
    const headers = Object.keys(data[0]);
    const mappedColumns: { [key: string]: string } = {};

    Object.entries(columnMappings).forEach(([field, possibleNames]) => {
      const found = headers.find(header =>
        possibleNames.some(name => header.toLowerCase().includes(name.toLowerCase()))
      );
      if (found) {
        mappedColumns[field] = found;
      }
    });

    // Validate required columns
    if (!mappedColumns.date) {
      throw new Error('Could not find date column. Expected: date, transaction date, posting date, etc.');
    }
    if (!mappedColumns.description) {
      throw new Error('Could not find description column. Expected: description, memo, details, etc.');
    }
    if (!mappedColumns.amount) {
      throw new Error('Could not find amount column. Expected: amount, debit, credit, etc.');
    }

    data.forEach((row, index) => {
      try {
        const dateStr = String(row[mappedColumns.date]).trim();
        const description = String(row[mappedColumns.description]).trim();
        const amountStr = String(row[mappedColumns.amount]).trim();
        const reference = mappedColumns.reference ? String(row[mappedColumns.reference]).trim() : '';

        // Parse date
        const date = parseDate(dateStr);
        if (!date) {
          newErrors.push(`Row ${index + 1}: Invalid date format: ${dateStr}`);
          return;
        }

        // Parse amount
        const amount = parseAmount(amountStr);
        if (amount === null) {
          newErrors.push(`Row ${index + 1}: Invalid amount: ${amountStr}`);
          return;
        }

        // Determine type based on amount sign
        const type = amount >= 0 ? 'INCOME' : 'EXPENSE';

        transactions.push({
          date: date.toISOString().split('T')[0],
          description,
          amount: Math.abs(amount),
          type,
          reference: reference || undefined,
        });
      } catch (error) {
        newErrors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (transactions.length === 0) {
      throw new Error('No valid transactions found in CSV');
    }

    return transactions;
  };

  const parseDate = (dateStr: string): Date | null => {
    // Try different date formats
    const formats = [
      // MM/DD/YYYY
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      // DD/MM/YYYY
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      // YYYY-MM-DD
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      // MM-DD-YYYY
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }

    // Try parsing as-is
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  };

  const parseAmount = (amountStr: string): number | null => {
    // Remove currency symbols and commas
    const cleaned = amountStr.replace(/[$,£€¥₹₽₩₦₨₪₫₡₵₺₴₸₼₲₱₭₯₰₳₶₷₹₻₽₾₿]/g, '').replace(/,/g, '');

    const amount = parseFloat(cleaned);
    if (isNaN(amount)) {
      return null;
    }

    return amount;
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    setImporting(true);
    try {
      await onImport(parsedData);
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Import Bank Statement CSV</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* File Upload */}
          {!file && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload CSV file
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    Select a bank statement CSV file to import transactions
                  </span>
                </label>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* File Info */}
          {file && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Parsing CSV file...</span>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Import Errors</h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {parsedData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Preview ({parsedData.length} transactions)
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
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
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedData.slice(0, 10).map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'INCOME'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.reference || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing first 10 transactions. {parsedData.length - 10} more will be imported.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            {parsedData.length > 0 && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Import {parsedData.length} Transactions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}