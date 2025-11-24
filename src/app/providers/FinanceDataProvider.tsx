import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DatabaseProvider, useDatabase } from './DatabaseProvider';
import { databaseService } from '@/services/database/db';
import { generateId } from '@/shared/utils/id/idUtils';

// Типы данных (соответствуют Figma интерфейсу)
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  accountId: string;
  date: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  balance: number;
}

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  category: string;
  accountId: string;
  nextDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

interface FinanceDataContextType {
  transactions: Transaction[];
  accounts: Account[];
  recurring: RecurringPayment[];
  goals: SavingsGoal[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  addRecurring: (payment: Omit<RecurringPayment, 'id'>) => Promise<void>;
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const FinanceDataContext = createContext<FinanceDataContextType | undefined>(undefined);

export const useFinanceData = () => {
  const context = useContext(FinanceDataContext);
  if (!context) {
    throw new Error('useFinanceData must be used within FinanceDataProvider');
  }
  return context;
};

interface FinanceDataProviderInnerProps {
  children: ReactNode;
}

const FinanceDataProviderInner: React.FC<FinanceDataProviderInnerProps> = ({ children }) => {
  const { isInitialized } = useDatabase();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recurring, setRecurring] = useState<RecurringPayment[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  const loadData = async () => {
    if (!isInitialized) return;

    try {
      const db = databaseService.getDatabase();

      // Загружаем accounts
      const accountsData = await db.accounts.orderBy('created_at').reverse().toArray();
      const accountsMapped: Account[] = accountsData.map((row) => ({
        id: row.id,
        name: row.name,
        balance: row.balance || 0,
        type: (row.type || 'checking') as 'checking' | 'savings' | 'credit' | 'cash',
      }));
      setAccounts(accountsMapped);

      // Загружаем expenses
      const expensesData = await db.expenses.orderBy('date').reverse().toArray();
      const expensesMapped: Transaction[] = expensesData.map((row) => ({
        id: row.id,
        type: 'expense' as const,
        amount: row.amount,
        description: row.description || '',
        category: row.category_id || 'Other',
        accountId: '',
        date: new Date(row.date).toISOString().split('T')[0],
      }));

      // Загружаем income
      const incomeData = await db.income.orderBy('date').reverse().toArray();
      const incomeMapped: Transaction[] = incomeData.map((row) => ({
        id: row.id,
        type: 'income' as const,
        amount: row.amount,
        description: row.description || '',
        category: 'Income',
        accountId: '',
        date: new Date(row.date).toISOString().split('T')[0],
      }));

      // Объединяем expenses и income
      setTransactions([...expensesMapped, ...incomeMapped]);

      // Загружаем recurring expenses
      const recurringData = await db.recurring_expenses
        .where('is_completed')
        .equals(0)
        .sortBy('date');
      const recurringMapped: RecurringPayment[] = recurringData.map((row) => ({
        id: row.id,
        name: row.name || row.description || '',
        amount: row.amount,
        frequency: (row.frequency || 'monthly') as 'weekly' | 'monthly' | 'yearly',
        category: row.category || 'Other',
        accountId: row.account_id || '',
        nextDate: new Date(row.date).toISOString().split('T')[0],
      }));
      setRecurring(recurringMapped);

      // Загружаем goals
      const goalsData = await db.goals
        .where('is_completed')
        .equals(0)
        .toArray();
      const goalsMapped: SavingsGoal[] = goalsData
        .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
        .map((row) => ({
          id: row.id,
          name: row.name || row.description || 'Goal',
          target: row.target_amount,
          current: row.current_amount || 0,
          deadline: row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : '',
          color: row.color || '#64748b',
        }));
      setGoals(goalsMapped);
    } catch (error) {
      console.error('Error loading finance data:', error);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [isInitialized]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    if (!isInitialized) return;

    try {
      const db = databaseService.getDatabase();
      const id = generateId();
      const now = Date.now();
      const dateTimestamp = new Date(transactionData.date).getTime();

      if (transactionData.type === 'income') {
        await db.income.add({
          id,
          amount: transactionData.amount,
          date: dateTimestamp,
          description: transactionData.description || null,
          created_at: now,
          updated_at: now,
        });
      } else {
        await db.expenses.add({
          id,
          amount: transactionData.amount,
          description: transactionData.description || '',
          category_id: transactionData.category || null,
          date: dateTimestamp,
          created_at: now,
          updated_at: now,
        });
      }

      // Обновляем баланс счета, если указан
      if (transactionData.accountId) {
        const account = await db.accounts.get(transactionData.accountId);
        if (account) {
          const newBalance = transactionData.type === 'income' 
            ? account.balance + transactionData.amount
            : account.balance - transactionData.amount;
          
          await db.accounts.update(transactionData.accountId, {
            balance: newBalance,
            updated_at: now,
          });
        }
      }

      // Перезагружаем данные
      await loadData();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const addAccount = async (accountData: Omit<Account, 'id'>) => {
    if (!isInitialized) return;

    try {
      const db = databaseService.getDatabase();
      const id = generateId();
      const now = Date.now();

      await db.accounts.add({
        id,
        name: accountData.name,
        balance: accountData.balance || 0,
        type: accountData.type || 'checking',
        created_at: now,
        updated_at: now,
      });

      // Перезагружаем данные
      await loadData();
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  };

  const addRecurring = async (paymentData: Omit<RecurringPayment, 'id'>) => {
    if (!isInitialized) return;

    try {
      const db = databaseService.getDatabase();
      const id = generateId();
      const now = Date.now();
      const nextDateTimestamp = new Date(paymentData.nextDate).getTime();

      await db.recurring_expenses.add({
        id,
        amount: paymentData.amount,
        description: paymentData.name,
        name: paymentData.name,
        frequency: paymentData.frequency || 'monthly',
        category: paymentData.category || 'Other',
        account_id: paymentData.accountId || null,
        date: nextDateTimestamp,
        is_completed: 0,
        created_at: now,
        updated_at: now,
      });

      // Перезагружаем данные
      await loadData();
    } catch (error) {
      console.error('Error adding recurring payment:', error);
      throw error;
    }
  };

  const addGoal = async (goalData: Omit<SavingsGoal, 'id'>) => {
    if (!isInitialized) return;

    try {
      const db = databaseService.getDatabase();
      const id = generateId();
      const now = Date.now();
      const deadlineTimestamp = goalData.deadline ? new Date(goalData.deadline).getTime() : null;

      await db.goals.add({
        id,
        target_amount: goalData.target,
        current_amount: goalData.current || 0,
        deadline: deadlineTimestamp,
        name: goalData.name,
        description: goalData.name,
        color: goalData.color || '#64748b',
        is_completed: 0,
        account_id: null,
        created_at: now,
        updated_at: now,
      });

      // Перезагружаем данные
      await loadData();
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  const updateGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    if (!isInitialized) return;

    try {
      const db = databaseService.getDatabase();
      const now = Date.now();
      
      const updateData: any = {
        updated_at: now,
      };

      if (updates.name !== undefined) {
        updateData.name = updates.name;
        updateData.description = updates.name;
      }
      
      if (updates.target !== undefined) {
        updateData.target_amount = updates.target;
      }
      
      if (updates.current !== undefined) {
        updateData.current_amount = updates.current;
      }
      
      if (updates.deadline !== undefined) {
        updateData.deadline = updates.deadline ? new Date(updates.deadline).getTime() : null;
      }
      
      if (updates.color !== undefined) {
        updateData.color = updates.color;
      }

      await db.goals.update(id, updateData);

      // Перезагружаем данные
      await loadData();
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  return (
    <FinanceDataContext.Provider
      value={{
        transactions,
        accounts,
        recurring,
        goals,
        addTransaction,
        addAccount,
        addRecurring,
        addGoal,
        updateGoal,
        refreshData: loadData,
      }}
    >
      {children}
    </FinanceDataContext.Provider>
  );
};

interface FinanceDataProviderProps {
  children: ReactNode;
}

/**
 * Провайдер финансовых данных
 * Обертка над DatabaseProvider для удобства использования
 */
export const FinanceDataProvider: React.FC<FinanceDataProviderProps> = ({ children }) => {
  return (
    <DatabaseProvider>
      <FinanceDataProviderInner>
        {children}
      </FinanceDataProviderInner>
    </DatabaseProvider>
  );
};
