import { SQLiteDBConnection } from '@capacitor-community/sqlite';

/**
 * Мок для базы данных для разработки в браузере
 * Использует localStorage для хранения данных
 */
class MockDatabaseService {
  private storageKey = 'fin_tracker_mock_db';
  private data: Record<string, any[]> = {};

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load mock data from storage:', error);
      this.data = {};
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save mock data to storage:', error);
    }
  }

  private initializeDefaultData(): void {
    if (!this.data.categories || this.data.categories.length === 0) {
      const now = Date.now();
      this.data.categories = [
        { id: '1', name: 'Продукты', icon: '🍔', color: '#FF6B6B', is_default: 1, created_at: now },
        { id: '2', name: 'Транспорт', icon: '🚗', color: '#4ECDC4', is_default: 1, created_at: now },
        { id: '3', name: 'Развлечения', icon: '🎬', color: '#95E1D3', is_default: 1, created_at: now },
        { id: '4', name: 'Здоровье', icon: '💊', color: '#F38181', is_default: 1, created_at: now },
        { id: '5', name: 'Одежда', icon: '👕', color: '#AA96DA', is_default: 1, created_at: now },
        { id: '6', name: 'Жилье', icon: '🏠', color: '#FCBAD3', is_default: 1, created_at: now },
        { id: '7', name: 'Образование', icon: '📚', color: '#A8E6CF', is_default: 1, created_at: now },
        { id: '8', name: 'Прочее', icon: '📦', color: '#DDA0DD', is_default: 1, created_at: now },
      ];
      this.saveToStorage();
    }

    // Инициализируем другие таблицы, если их нет
    if (!this.data.expenses) this.data.expenses = [];
    if (!this.data.income) this.data.income = [];
    if (!this.data.accounts) this.data.accounts = [];
    if (!this.data.goals) this.data.goals = [];
    if (!this.data.recurring_expenses) this.data.recurring_expenses = [];
  }

  async initialize(): Promise<void> {
    // В моке инициализация уже выполнена в конструкторе
    return Promise.resolve();
  }

  async getConnection(): Promise<SQLiteDBConnection> {
    // Создаем мок, который реализует только необходимые методы
    // Используем приведение типа, так как SQLiteDBConnection имеет много внутренних свойств
    const mockConnection = {
      query: async (statement: string, params?: any[]): Promise<any> => {
        return this.mockQuery(statement, params || []);
      },
      run: async (statement: string, params?: any[]): Promise<any> => {
        return this.mockRun(statement, params || []);
      },
      execute: async (statements: string[], params?: any[][]): Promise<any> => {
        const results = [];
        for (let i = 0; i < statements.length; i++) {
          results.push(await this.mockRun(statements[i], params?.[i] || []));
        }
        return { changes: { changes: results.reduce((sum, r) => sum + (r.changes || 0), 0) } };
      },
      close: async (): Promise<void> => {
        return Promise.resolve();
      },
      isDBOpen: async (): Promise<boolean> => {
        return Promise.resolve(true);
      },
    };
    
    // Приведение типа через unknown для обхода проверки TypeScript
    return mockConnection as unknown as SQLiteDBConnection;
  }

  async close(): Promise<void> {
    this.saveToStorage();
    return Promise.resolve();
  }

  private mockQuery(statement: string, params: any[]): any {
    const upperStatement = statement.toUpperCase().trim();

    // SELECT * FROM categories
    if (upperStatement.includes('SELECT') && upperStatement.includes('FROM CATEGORIES')) {
      let categories = [...this.data.categories];
      
      if (upperStatement.includes('WHERE')) {
        if (upperStatement.includes('IS_DEFAULT = 1')) {
          categories = categories.filter(c => c.is_default === 1);
        }
        if (upperStatement.includes('COUNT(*)')) {
          return { values: [{ count: categories.length }] };
        }
      }
      
      if (upperStatement.includes('ORDER BY')) {
        if (upperStatement.includes('CREATED_AT DESC')) {
          categories.sort((a, b) => b.created_at - a.created_at);
        }
      }

      return { values: categories };
    }

    // SELECT * FROM expenses
    if (upperStatement.includes('SELECT') && upperStatement.includes('FROM EXPENSES')) {
      let expenses = [...this.data.expenses];
      
      if (upperStatement.includes('ORDER BY')) {
        if (upperStatement.includes('DATE DESC')) {
          expenses.sort((a, b) => b.date - a.date);
        }
      }

      return { values: expenses };
    }

    // SELECT * FROM income
    if (upperStatement.includes('SELECT') && upperStatement.includes('FROM INCOME')) {
      return { values: [...this.data.income] };
    }

    // SELECT * FROM accounts
    if (upperStatement.includes('SELECT') && upperStatement.includes('FROM ACCOUNTS')) {
      return { values: [...this.data.accounts] };
    }

    // SELECT * FROM goals
    if (upperStatement.includes('SELECT') && upperStatement.includes('FROM GOALS')) {
      return { values: [...this.data.goals] };
    }

    // SELECT * FROM recurring_expenses
    if (upperStatement.includes('SELECT') && upperStatement.includes('FROM RECURRING_EXPENSES')) {
      return { values: [...this.data.recurring_expenses] };
    }

    return { values: [] };
  }

  private mockRun(statement: string, params: any[]): any {
    const upperStatement = statement.toUpperCase().trim();

    // INSERT INTO categories
    if (upperStatement.includes('INSERT INTO CATEGORIES')) {
      const newCategory = {
        id: params[0],
        name: params[1],
        icon: params[2] || null,
        color: params[3] || null,
        is_default: params[4] || 0,
        created_at: params[5],
      };
      this.data.categories.push(newCategory);
      this.saveToStorage();
      return { changes: { changes: 1, lastId: newCategory.id } };
    }

    // INSERT INTO expenses
    if (upperStatement.includes('INSERT INTO EXPENSES')) {
      const newExpense = {
        id: params[0],
        amount: params[1],
        description: params[2],
        category_id: params[3] || null,
        date: params[4],
        created_at: params[5],
        updated_at: params[6],
      };
      this.data.expenses.push(newExpense);
      this.saveToStorage();
      return { changes: { changes: 1, lastId: newExpense.id } };
    }

    // INSERT INTO income
    if (upperStatement.includes('INSERT INTO INCOME')) {
      const newIncome = {
        id: params[0],
        amount: params[1],
        date: params[2],
        description: params[3] || null,
        created_at: params[4],
        updated_at: params[5],
      };
      this.data.income.push(newIncome);
      this.saveToStorage();
      return { changes: { changes: 1, lastId: newIncome.id } };
    }

    // UPDATE
    if (upperStatement.includes('UPDATE')) {
      // Простая реализация - в реальности нужно парсить WHERE
      this.saveToStorage();
      return { changes: { changes: 1 } };
    }

    // DELETE
    if (upperStatement.includes('DELETE')) {
      // Простая реализация
      this.saveToStorage();
      return { changes: { changes: 1 } };
    }

    // CREATE TABLE - игнорируем в моке
    if (upperStatement.includes('CREATE TABLE')) {
      return { changes: { changes: 0 } };
    }

    return { changes: { changes: 0 } };
  }

  // Метод для очистки тестовых данных (для разработки)
  clearMockData(): void {
    this.data = {};
    localStorage.removeItem(this.storageKey);
    this.initializeDefaultData();
  }
}

export const mockDatabaseService = new MockDatabaseService();

