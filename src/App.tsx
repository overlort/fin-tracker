import React, { useState } from 'react';
import { FinanceDataProvider } from './app/providers/FinanceDataProvider';
import { Dashboard } from './app/components/Dashboard';
import { Accounts } from './app/components/Accounts';
import { Recurring } from './app/components/Recurring';
import { Goals } from './app/components/Goals';
import { Home, Wallet, Repeat, Target } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home, component: Dashboard },
    { id: 'accounts', label: 'Accounts', icon: Wallet, component: Accounts },
    { id: 'recurring', label: 'Recurring', icon: Repeat, component: Recurring },
    { id: 'goals', label: 'Goals', icon: Target, component: Goals },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <FinanceDataProvider>
      <div className="min-h-screen bg-slate-50 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
            <h1 className="text-slate-800">Finance Tracker</h1>
          </header>

          {/* Main Content */}
          <main className="px-4 py-6">
            <ActiveComponent />
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
            <div className="max-w-md mx-auto flex justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center py-3 px-4 flex-1 transition-colors ${
                      isActive ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </FinanceDataProvider>
  );
}
