import React, { useState } from 'react';
import { FinanceDataProvider } from './app/providers/FinanceDataProvider';
import { ThemeProvider, useTheme } from './app/providers/ThemeProvider';
import { Dashboard } from './app/components/Dashboard';
import { Accounts } from './app/components/Accounts';
import { Recurring } from './app/components/Recurring';
import { Goals } from './app/components/Goals';
import { Home, Wallet, Repeat, Target, Moon, Sun } from 'lucide-react';
import { Button } from './shared/components/ui/button';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home, component: Dashboard },
    { id: 'accounts', label: 'Accounts', icon: Wallet, component: Accounts },
    { id: 'recurring', label: 'Recurring', icon: Repeat, component: Recurring },
    { id: 'goals', label: 'Goals', icon: Target, component: Goals },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <FinanceDataProvider>
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10 flex items-center justify-between">
            <h1 className="text-foreground font-semibold">Finance Tracker</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </header>

          {/* Main Content */}
          <main className="px-4 py-6">
            <ActiveComponent />
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
            <div className="max-w-md mx-auto flex justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center py-3 px-4 flex-1 transition-colors ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
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
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
