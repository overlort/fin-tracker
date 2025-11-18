import Dexie, { Table } from 'dexie';
import { generateId } from '@/shared/utils/id/idUtils';

// Типы данных
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  balance: number;
  color: string;
  created_at: number;
  updated_at: number;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category_id: string | null;
  date: number;
  created_at: number;
  updated_at: number;
}

export interface Income {
  id: string;
  amount: number;
  date: number;
  description: string | null;
  created_at: number;
  updated_at: number;
}

export interface RecurringExpense {
  id: string;
  amount: number;
  description: string;
  name: string | null;
  frequency: 'weekly' | 'monthly' | 'yearly' | null;
  category: string | null;
  account_id: string | null;
  date: number;
  is_completed: number;
  created_at: number;
  updated_at: number;
}

export interface Goal {
  id: string;
  target_amount: number;
  current_amount: number;
  deadline: number | null;
  is_completed: number;
  account_id: string | null;
  description: string | null;
  name: string | null;
  color: string | null;
  created_at: number;
  updated_at: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  is_default: number;
  created_at: number;
}

// Класс базы данных Dexie
class FinanceDatabase extends Dexie {
  accounts!: Table<Account>;
  expenses!: Table<Expense>;
  income!: Table<Income>;
  recurring_expenses!: Table<RecurringExpense>;
  goals!: Table<Goal>;
  categories!: Table<Category>;

  constructor() {
    super('FinanceTracker');
    
    // Версия 1 - начальная схема
    this.version(1).stores({
      accounts: 'id, name, type, created_at',
      expenses: 'id, date, category_id, created_at',
      income: 'id, date, created_at',
      recurring_expenses: 'id, date, account_id, is_completed, created_at',
      goals: 'id, deadline, account_id, is_completed, created_at',
      categories: 'id, name, is_default, created_at'
    });
  }
}

// Создаем экземпляр БД
const db = new FinanceDatabase();

// Сервис для работы с БД
class DatabaseService {
  private initialized = false;

  /**
   * Инициализация базы данных
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Открываем БД (Dexie автоматически создаст структуру)
      await db.open();
      
      // Заполняем предустановленными категориями, если их нет
      await this.seedDefaultCategories();
      
      this.initialized = true;
      console.log('✅ IndexedDB initialized');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Заполнение предустановленными категориями
   */
  private async seedDefaultCategories(): Promise<void> {
    const count = await db.categories.where('is_default').equals(1).count();
    
    if (count > 0) {
      // Категории уже заполнены
      return;
    }

    const now = Date.now();
    const defaultCategories: Category[] = [
      { id: generateId(), name: 'Продукты', icon: '🍔', color: '#FF6B6B', is_default: 1, created_at: now },
      { id: generateId(), name: 'Транспорт', icon: '🚗', color: '#4ECDC4', is_default: 1, created_at: now },
      { id: generateId(), name: 'Развлечения', icon: '🎬', color: '#95E1D3', is_default: 1, created_at: now },
      { id: generateId(), name: 'Здоровье', icon: '💊', color: '#F38181', is_default: 1, created_at: now },
      { id: generateId(), name: 'Одежда', icon: '👕', color: '#AA96DA', is_default: 1, created_at: now },
      { id: generateId(), name: 'Жилье', icon: '🏠', color: '#FCBAD3', is_default: 1, created_at: now },
      { id: generateId(), name: 'Образование', icon: '📚', color: '#A8E6CF', is_default: 1, created_at: now },
      { id: generateId(), name: 'Прочее', icon: '📦', color: '#DDA0DD', is_default: 1, created_at: now },
    ];

    await db.categories.bulkAdd(defaultCategories);
  }

  /**
   * Получение экземпляра БД
   */
  getDatabase(): FinanceDatabase {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return db;
  }

  /**
   * Закрытие соединения с БД
   */
  async close(): Promise<void> {
    await db.close();
    this.initialized = false;
  }
}

export const databaseService = new DatabaseService();
export { db };
