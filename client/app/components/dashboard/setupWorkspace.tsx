import React, { useState, useEffect } from "react";
import { Plus, Building2, Tag, FileUp } from "lucide-react";
import CreateCategoryModal from "../modals/createCategroyModal";
import { Pencil, Trash2 } from "lucide-react";

import EditAccountModal from "../modals/editAccountModals";
import DeleteAccountModal from "../modals/deleteAccountModal";

import EditCategoryModal from "../modals/editCategoryModal";
import DeleteCategoryModal from "../modals/deleteCategoryModal";
import api from "../../lib/axiosInstance";
/* ================= TYPES ================= */

interface Account {
  id: number;
  name: string;
  type: string;
}

interface Category {
  id: number;
  name: string;
}

const ORGANIZATION_ID = 1; // replace with real org id from auth/context

/* ================= MODAL ================= */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function SetupWorkspace() {
  /* ================= STATE ================= */

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<
    "accounts" | "categories" | "actions"
  >("accounts");
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);

  /* ================= FETCH ================= */

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const response = await api.get(`/setup/accounts`);
      setAccounts(response?.data?.accounts);
    } catch (error) {
      console.error("Failed to load accounts:", error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get(`/setup/categories`);
      setCategories(response?.data?.categories); // ✅ adjust based on actual response shape
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // ✅ fetch on mount
  useEffect(() => {
    loadAccounts();
    loadCategories();
  }, []);

  /* ================= HANDLERS ================= */

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("accountName") as HTMLInputElement)
      .value;
    const type = (form.elements.namedItem("accountType") as HTMLSelectElement)
      .value;

    try {
      await api.post("/setup/create-account", { name, type });
      await loadAccounts(); // ✅ re-fetch from backend
      setShowAccountForm(false);
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  console.log("categories",categories);
  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white text-black p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Workspace Setup
        </h1>
        <p className="text-gray-500 mt-2">
          Create accounts, categories, and manage your financial workspace.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6 mb-8">
        {(["accounts", "categories", "actions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            {tab === "actions" ? "Quick Actions" : tab}
          </button>
        ))}
      </div>

      {/* ================= ACCOUNTS TAB ================= */}
      {activeTab === "accounts" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Accounts</h2>
            <button
              onClick={() => setShowAccountForm(true)}
              className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
            >
              <Plus className="h-4 w-4" />
              Create Account
            </button>
          </div>

          <div className="border rounded-lg divide-y">
            {loadingAccounts ? (
              <div className="p-6 text-gray-500 text-center">
                Loading accounts...
              </div>
            ) : accounts?.length === 0 ? (
              <div className="p-6 text-gray-500 text-center">
                No accounts yet.
                <br />
                Create your first account to begin.
              </div>
            ) : (
              accounts?.map((account) => (
                <div
                  key={account.id}
                  className="flex justify-between  items-center gap-3 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-gray-500">{account.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAccount(account)}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setDeletingAccount(account)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= CATEGORIES TAB ================= */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
            >
              <Plus className="h-4 w-4" />
              Create Category
            </button>
          </div>

          <div className="border rounded-lg divide-y">
            {loadingCategories ? (
              <div className="p-6 text-gray-500 text-center">
                Loading categories...
              </div>
            ) : categories?.length === 0 ? (
              <div className="p-6 text-gray-500 text-center">
                No categories yet.
                <br />
                Create categories to organize transactions.
              </div>
            ) : (
              categories?.map((category) => (
                <div
                  key={category.id}
                  className="flex justify-between items-center gap-3 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span>{category?.icon}</span>
                    <p className="font-medium">{category.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setDeletingCategory(category)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= QUICK ACTIONS TAB ================= */}
      {activeTab === "actions" && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setShowTransactionForm(true)}
              className="border rounded-lg p-6 hover:bg-black hover:text-white transition text-left"
            >
              <h3 className="font-semibold mb-2">Create Transaction</h3>
              <p className="text-sm text-gray-500">
                Add income, expense, or transfer manually.
              </p>
            </button>

            <button
              onClick={() => setShowCSVImport(true)}
              className="border rounded-lg p-6 hover:bg-black hover:text-white transition text-left"
            >
              <FileUp className="h-6 w-6 mb-3" />
              <h3 className="font-semibold mb-2">Import CSV</h3>
              <p className="text-sm text-gray-500">
                Upload bank statement CSV.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ================= ACCOUNT MODAL ================= */}
      {showAccountForm && (
        <Modal title="Create Account" onClose={() => setShowAccountForm(false)}>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <input
              name="accountName"
              placeholder="Account Name"
              required
              className="w-full border p-2 rounded"
            />
            <select
              name="accountType"
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Type</option>
              <option value="BANK">Bank</option>
              <option value="CASH">Cash</option>
              <option value="CREDIT_CARD">Credit Card</option>
            </select>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              Save Account
            </button>
          </form>
        </Modal>
      )}

      {/* ================= CATEGORY MODAL ================= */}
      {showCategoryForm && ( // ✅ was missing this check before!
        <CreateCategoryModal
          organizationId={ORGANIZATION_ID}
          onClose={() => setShowCategoryForm(false)}
          onSuccess={loadCategories} // ✅ now this function actually exists
        />
      )}

      {/* ================= TRANSACTION MODAL ================= */}
      {showTransactionForm && (
        <Modal
          title="Create Transaction"
          onClose={() => setShowTransactionForm(false)}
        >
          <form className="space-y-4">
            <input
              type="number"
              placeholder="Amount"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              Save Transaction
            </button>
          </form>
        </Modal>
      )}

      {/* ================= CSV MODAL ================= */}
      {showCSVImport && (
        <Modal title="Import CSV" onClose={() => setShowCSVImport(false)}>
          <div className="space-y-4">
            <input
              type="file"
              accept=".csv"
              className="w-full border p-2 rounded"
            />
            <button className="w-full bg-black text-white py-2 rounded">
              Upload CSV
            </button>
          </div>
        </Modal>
      )}

      {/* ================= EDIT/DELETE MODALS ================= */}
      {/* ACCOUNT MODALS */}

      {editingAccount && (
        <EditAccountModal
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSuccess={loadAccounts}
        />
      )}

      {deletingAccount && (
        <DeleteAccountModal
          account={deletingAccount}
          onClose={() => setDeletingAccount(null)}
          onSuccess={loadAccounts}
        />
      )}

      {/* CATEGORY MODALS */}

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={loadCategories}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onSuccess={loadCategories}
        />
      )}
    </div>
  );
}
