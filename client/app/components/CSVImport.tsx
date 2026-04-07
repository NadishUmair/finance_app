import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Loader,
} from "lucide-react";
import Papa from "papaparse";
import axios from "axios";

interface CSVRow {
  [key: string]: string | number;
}

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  reference?: string;
}

interface CSVImportProps {
  onImport: (transactions: ParsedTransaction[]) => Promise<void>;
  onCancel: () => void;
}

// Add to COLUMN_MAPPINGS:
const COLUMN_MAPPINGS = {
  date: [
    "date",
    "transaction date",
    "posting date",
    "value date",
    "txn date",
    "trans date",
    "valuedate",
    "txndate",
  ],
  description: [
    "description",
    "memo",
    "details",
    "transaction details",
    "narration",
    "particulars",
    "remarks",
    "transaction particulars",
  ],
  amount: ["amount", "value", "transaction amount", "txn amount"],
  debit: [
    "debit",
    "withdrawal",
    "dr",
    "withdrawal amt",
    "debit amount",
    "withdrawalamt",
  ],
  credit: [
    "credit",
    "deposit",
    "cr",
    "deposit amt",
    "credit amount",
    "depositamt",
  ],
  reference: [
    "reference",
    "ref",
    "check number",
    "transaction id",
    "cheque number",
    "chequeno",
    "refno",
  ],
};

export default function CSVImport({ onImport, onCancel }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[\s_\-]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const parseAmount = (str: string) => {
    const num = parseFloat(
      str.replace(/[$,£€₹₽₩₦₨₪₫₡₵₺₴₸₼₲₱₭₯₰₳₶₷]/g, "").replace(/,/g, ""),
    );
    return isNaN(num) ? null : num;
  };

  const parseDate = (str: string) => {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const mapColumns = (headers: string[]) => {
    const mapped: { [key: string]: string } = {};
    Object.entries(COLUMN_MAPPINGS).forEach(([field, names]) => {
      const found = headers.find((h) => {
        const nh = normalize(h);
        return names.some((n) => {
          const nn = normalize(n);
          return nh === nn || nh.includes(nn) || nn.includes(nh);
        });
      });
      if (found) mapped[field] = found;
    });
    return mapped;
  };

  const processCSV = (data: CSVRow[]): ParsedTransaction[] => {
    if (!data.length) throw new Error("CSV is empty");
    const headers = Object.keys(data[0]);
    const mapped = mapColumns(headers);

    if (!mapped.date || !mapped.description) {
      setErrors([
        `Couldn't detect required columns. Found: ${headers.join(", ")}`, // show actual headers!
      ]);
      return [];
    }

    const newErrors: string[] = [];
    const transactions: ParsedTransaction[] = data
      .map((row, i) => {
        try {
          const date = parseDate(String(row[mapped.date]));
          if (!date) {
            newErrors.push(`Row ${i + 1}: Invalid date`);
            return null;
          }

          const description = String(row[mapped.description] || "").trim();
          const reference = mapped.reference
            ? String(row[mapped.reference] || "")
            : "";
          const debit = mapped.debit
            ? parseAmount(String(row[mapped.debit] || ""))
            : null;
          const credit = mapped.credit
            ? parseAmount(String(row[mapped.credit] || ""))
            : null;

          let amount =
            credit && !debit
              ? credit
              : debit && !credit
                ? -debit
                : credit && debit
                  ? credit > debit
                    ? credit
                    : -debit
                  : mapped.amount
                    ? parseAmount(String(row[mapped.amount] || ""))
                    : null;
          if (amount === null) {
            newErrors.push(`Row ${i + 1}: Could not determine amount`);
            return null;
          }

          return {
            date: date.toISOString().split("T")[0],
            description,
            amount: Math.abs(amount),
            type: amount > 0 ? "INCOME" : "EXPENSE",
            reference: reference || undefined,
          };
        } catch (e) {
          newErrors.push(
            `Row ${i + 1}: ${e instanceof Error ? e.message : "Unknown error"}`,
          );
          return null;
        }
      })
      .filter(Boolean) as ParsedTransaction[];

    if (newErrors.length) setErrors(newErrors);
    if (!transactions.length) throw new Error("No valid transactions found");
    return transactions;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    setErrors([]);

    // If file is small, parse locally
    if (f.size < 5 * 1024 * 1024) {
      Papa.parse(f, {
        header: true,
        skipEmptyLines: true,
        encoding: "UTF-8", // add this
        transformHeader: (h) => h.replace(/^\uFEFF/, "").trim(),
        complete: async (r) => {
          try {
            const data = processCSV(r.data as CSVRow[]);

            if (data.length === 0) throw new Error("Mapping failed");

            setParsedData(data);
          } catch (err) {
            // 🔥 fallback to backend
            try {
              const formData = new FormData();
              formData.append("file", f);

              const res = await axios.post("/api/transactions/upload-csv", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              console.log(res);
              setParsedData(res.data.transactions);
            } catch (e) {
              setErrors(["Failed to process CSV"]);
            }
          } finally {
            setLoading(false);
          }
        },
      });
    } else {
      // Large file → send to backend
      try {
        const formData = new FormData();
        formData.append("file", f);
        const res = await axios.post("/upload-csv", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setParsedData(json.transactions);
      } catch (err: any) {
        setErrors([err.message || "Upload failed"]);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    if (fileRef.current) fileRef.current.value = "";
  };
  const handleImport = async () => {
    if (!parsedData.length) return;
    setImporting(true);
    try {
      await onImport(parsedData);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Import Bank Statement CSV
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {!file ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">
                Upload CSV file
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Select a bank statement CSV to import transactions
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
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

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Parsing CSV...</span>
            </div>
          )}

          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {parsedData.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Preview ({parsedData.length} transactions)
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Date",
                        "Description",
                        "Type",
                        "Amount",
                        "Reference",
                      ].map((h, i) => (
                        <th
                          key={i}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedData.slice(0, 10).map((t, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(t.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {t.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${t.type === "INCOME" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${t.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {t.reference || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing first 10. {parsedData.length - 10} more will be
                    imported.
                  </p>
                )}
              </div>
            </div>
          )}

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
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
