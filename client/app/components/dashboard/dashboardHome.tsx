'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  FileText,
  CreditCard,
  TrendingUp,
  Receipt,
  Calculator,
  Menu,
  X,
  LogOut
} from 'lucide-react';

import FinanceDashboard from './finance-dashboard';
import ExpenseTracking from './expense-tracking';
import InvoiceAutomation from './invoice-automation';
import AutoBookkeeping from './auto-bookkeeping';
import CashFlowInsights from './cash-flow-insights';
import ReportsGeneration from './resports-generation';



type Feature = 'dashboard' | 'expenses' | 'invoices' | 'bookkeeping' | 'reports' | 'cashflow';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'expenses', label: 'Expense Tracking', icon: Receipt },
  { id: 'invoices', label: 'Invoice Automation', icon: FileText },
  { id: 'bookkeeping', label: 'Auto Bookkeeping', icon: Calculator },
  { id: 'reports', label: 'Reports', icon: TrendingUp },
  { id: 'cashflow', label: 'Cash Flow', icon: CreditCard },
];

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<Feature>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderFeature = () => {
    switch (activeFeature) {
      case 'dashboard':
        return <FinanceDashboard />;
      case 'expenses':
        return <ExpenseTracking />;
      case 'invoices':
        return <InvoiceAutomation />;
      case 'bookkeeping':
        return <AutoBookkeeping />;
      case 'reports':
        return <ReportsGeneration />;
      case 'cashflow':
        return <CashFlowInsights />;
      default:
        return <FinanceDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-primary/5 to-primary/10 border-r border-border transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FinanceHub</h1>
              <p className="text-xs text-muted-foreground">Pro</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFeature === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFeature(item.id as Feature)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-foreground hover:bg-primary/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-destructive/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-background border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex-1 ml-4">
            <h2 className="text-xl font-semibold text-foreground">
              {navigationItems.find(item => item.id === activeFeature)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-secondary rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderFeature()}
        </div>
      </div>
    </div>
  );
}
