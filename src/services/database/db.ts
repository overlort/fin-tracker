import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { createMigrationsTable } from './migrations/000_create_migrations_table';
import { migrations } from './migrations';

class DatabaseService {
  private db: SQLiteDBConnection | null = null;
  private dbName = 'fin_tracker.db';
  private sqlite: SQLiteConnection | null = null;

  /**
   * Генерация уникального ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Получение текущей версии БД
   */
  private async getCurrentVersion(): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await this.db.query('SELECT MAX(version) as version FROM migrations');
      if (result.values && result.values.length > 0 && result.values[0].version !== null) {
        return result.values[0].version as number;
      }
      return 0;
    } catch (error) {
      // Таблица миграций еще не создана
      return 0;
    }
  }

  /**
   * Применение миграций
   */
  private async runMigrations(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Создаем таблицу миграций, если её нет
    await this.db.run(createMigrationsTable, []);

    const currentVersion = await this.getCurrentVersion();
    const pendingMigrations = migrations.filter(m => m.version > currentVersion);

    if (pendingMigrations.length === 0) {
      return;
    }

    // Сортируем миграции по версии
    pendingMigrations.sort((a, b) => a.version - b.version);

    for (const migration of pendingMigrations) {
      try {
        await migration.up(this.db);
        
        // Записываем примененную миграцию
        const appliedAt = Date.now();
        await this.db.run(
          'INSERT INTO migrations (version, applied_at) VALUES (?, ?)',
          [migration.version, appliedAt]
        );
      } catch (error) {
        console.error(`Error applying migration ${migration.version}:`, error);
        throw error;
      }
    }
  }

  /**
   * Заполнение предустановленными категориями
   */
  private async seedDefaultCategories(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Проверяем, есть ли уже категории
    const result = await this.db.query('SELECT COUNT(*) as count FROM categories WHERE is_default = 1');
    const count = result.values && result.values.length > 0 ? (result.values[0].count as number) : 0;

    if (count > 0) {
      // Категории уже заполнены
      return;
    }

    const now = Date.now();
    const defaultCategories = [
      { name: 'Продукты', icon: '🍔', color: '#FF6B6B' },
      { name: 'Транспорт', icon: '🚗', color: '#4ECDC4' },
      { name: 'Развлечения', icon: '🎬', color: '#95E1D3' },
      { name: 'Здоровье', icon: '💊', color: '#F38181' },
      { name: 'Одежда', icon: '👕', color: '#AA96DA' },
      { name: 'Жилье', icon: '🏠', color: '#FCBAD3' },
      { name: 'Образование', icon: '📚', color: '#A8E6CF' },
      { name: 'Прочее', icon: '📦', color: '#DDA0DD' },
    ];

    for (const category of defaultCategories) {
      const id = this.generateId();
      await this.db.run(
        `INSERT INTO categories (id, name, icon, color, is_default, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, category.name, category.icon, category.color, 1, now]
      );
    }
  }

  /**
   * Инициализация базы данных
   */
  async initialize(): Promise<void> {
    try {
      this.sqlite = new SQLiteConnection(CapacitorSQLite);

      // Проверяем, существует ли соединение
      const isConn = (await this.sqlite.isConnection(this.dbName, false)).result;

      if (!isConn) {
        // Создаем новое соединение
        this.db = await this.sqlite.createConnection(
          this.dbName,
          false,
          'no-encryption',
          1,
          false
        );
      } else {
        // Открываем существующее соединение
        this.db = await this.sqlite.retrieveConnection(this.dbName, false);
      }

      // Открываем БД
      await this.db.open();

      // Применяем миграции
      await this.runMigrations();

      // Заполняем предустановленными категориями
      await this.seedDefaultCategories();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Получение соединения с БД
   */
  async getConnection(): Promise<SQLiteDBConnection> {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Закрытие соединения с БД
   */
  async close(): Promise<void> {
    if (this.db && this.sqlite) {
      try {
        await this.sqlite.closeConnection(this.dbName, false);
        this.db = null;
      } catch (error) {
        console.error('Error closing database:', error);
        throw error;
      }
    }
  }
}

export const databaseService = new DatabaseService();