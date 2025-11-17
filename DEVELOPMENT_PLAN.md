# План разработки Fin Tracker

Детальный пошаговый план разработки мобильного приложения для отслеживания личных финансов.

---

## 📋 Содержание

1. [Настройка проекта](#1-настройка-проекта)
2. [Настройка базы данных SQLite](#2-настройка-базы-данных-sqlite)
3. [Базовая инфраструктура](#3-базовая-инфраструктура)
4. [Реализация фич](#4-реализация-фич)
5. [Тестирование и финализация](#5-тестирование-и-финализация)

---

## 1. Настройка проекта

### 1.1. Инициализация проекта

**Приоритет:** Высокий

- [x] Создать проект через Create React App с TypeScript шаблоном:
  ```bash
  npx create-react-app fin-tracker --template typescript
  ```
  **Зачем:** Базовая структура React приложения с TypeScript

- [x] Перейти в директорию проекта:
  ```bash
  cd fin-tracker
  ```

### 1.2. Установка зависимостей

**Приоритет:** Высокий

- [x] Установить Capacitor и плагины:
  ```bash
  npm install @capacitor/core @capacitor/cli @capacitor/ios
  npm install @capacitor-community/sqlite
  ```
  **Зачем:** Capacitor для мобильной платформы, SQLite для локального хранения

- [x] Установить React Router DOM:
  ```bash
  npm install react-router-dom
  ```
  **Зачем:** Роутинг между страницами приложения

- [x] Установить Tailwind CSS и зависимости:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npm install -D tailwindcss-animate
  ```
  **Зачем:** Стилизация компонентов

- [x] Установить shadcn/ui зависимости:
  ```bash
  npm install class-variance-authority clsx tailwind-merge
  npm install @radix-ui/react-dialog @radix-ui/react-select
  npm install @radix-ui/react-label @radix-ui/react-slot
  npm install @radix-ui/react-popover @radix-ui/react-checkbox
  npm install react-day-picker date-fns
  ```
  **Зачем:** UI компоненты и утилиты для работы с датами

### 1.3. Настройка TypeScript

**Приоритет:** Высокий

- [x] Проверить `tsconfig.json` - должен быть включен strict mode:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      ...
    }
  }
  ```
  **Зачем:** Строгая типизация для безопасности кода

- [x] Настроить path aliases в `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"],
        "@/features/*": ["./src/features/*"],
        "@/shared/*": ["./src/shared/*"],
        "@/services/*": ["./src/services/*"],
        "@/app/*": ["./src/app/*"]
      }
    }
  }
  ```
  **Зачем:** Упрощение импортов и навигации по коду

### 1.4. Настройка Tailwind CSS

**Приоритет:** Высокий

- [x] Инициализировать Tailwind CSS:
  ```bash
  npx tailwindcss init -p
  ```
  **Зачем:** Создание конфигурационных файлов

- [x] Настроить `tailwind.config.js`:
  ```js
  module.exports = {
    darkMode: ["class"],
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Приглушенная палитра без темной темы
          background: "hsl(0, 0%, 100%)",
          foreground: "hsl(222.2, 84%, 4.9%)",
          primary: {
            DEFAULT: "hsl(221.2, 83.2%, 53.3%)",
            foreground: "hsl(210, 40%, 98%)",
          },
          secondary: {
            DEFAULT: "hsl(210, 40%, 96.1%)",
            foreground: "hsl(222.2, 47.4%, 11.2%)",
          },
          muted: {
            DEFAULT: "hsl(210, 40%, 96.1%)",
            foreground: "hsl(215.4, 16.3%, 46.9%)",
          },
          accent: {
            DEFAULT: "hsl(210, 40%, 96.1%)",
            foreground: "hsl(222.2, 47.4%, 11.2%)",
          },
        },
        borderRadius: {
          lg: "0.5rem",
          md: "calc(0.5rem - 2px)",
          sm: "calc(0.5rem - 4px)",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  ```
  **Зачем:** Настройка цветовой палитры и стилей

- [x] Обновить `src/index.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  
  @layer base {
    * {
      @apply border-border;
    }
    body {
      @apply bg-background text-foreground;
    }
  }
  ```
  **Зачем:** Подключение Tailwind стилей

### 1.5. Настройка Capacitor

**Приоритет:** Высокий

- [x] Инициализировать Capacitor:
  ```bash
  npx cap init
  ```
  **Зачем:** Создание конфигурации Capacitor

- [ ] Добавить iOS платформу:
  ```bash
  npx cap add ios
  ```
  **Зачем:** Поддержка iOS платформы

- [x] Настроить `capacitor.config.ts`:
  ```typescript
  import { CapacitorConfig } from '@capacitor/cli';

  const config: CapacitorConfig = {
    appId: 'com.fintracker.app',
    appName: 'Fin Tracker',
    webDir: 'build',
    server: {
      iosScheme: 'https'
    }
  };

  export default config;
  ```
  **Зачем:** Конфигурация приложения для iOS

### 1.6. Создание структуры папок

**Приоритет:** Высокий

- [x] Создать структуру папок для фич:
  ```bash
  mkdir -p src/features/{expenses,income,goals,accounts,categories,recurring-expenses,statistics}
  ```
  **Зачем:** Организация кода по доменным фичам

- [x] Для каждой фичи создать подпапки:
  ```bash
  # Для каждой фичи выполнить:
  mkdir -p src/features/{feature-name}/{components,hooks,services,types}
  ```
  **Зачем:** Изоляция логики каждой фичи

- [x] Создать структуру shared:
  ```bash
  mkdir -p src/shared/{components/{ui,layout},hooks,utils/{date,currency,validation},types,constants}
  ```
  **Зачем:** Общие переиспользуемые компоненты и утилиты

- [x] Создать структуру services:
  ```bash
  mkdir -p src/services/database/migrations
  ```
  **Зачем:** Сервисы уровня приложения (БД)

- [x] Создать структуру app:
  ```bash
  mkdir -p src/app/{pages,providers}
  ```
  **Зачем:** Конфигурация приложения и провайдеры

- [x] Создать папку для стилей:
  ```bash
  mkdir -p src/styles
  ```
  **Зачем:** Глобальные стили

---

## 2. Настройка базы данных SQLite

### 2.1. Создание утилит для работы с БД

**Приоритет:** Высокий

- [x] Создать `src/services/database/db.ts` - базовый класс для работы с SQLite:
  ```typescript
  import { SQLiteDBConnection } from '@capacitor-community/sqlite';
  import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

  class DatabaseService {
    private db: SQLiteDBConnection | null = null;
    private dbName = 'fin_tracker.db';

    async initialize(): Promise<void> {
      // Инициализация БД
    }

    async getConnection(): Promise<SQLiteDBConnection> {
      // Получение соединения
    }

    async close(): Promise<void> {
      // Закрытие соединения
    }
  }

  export const databaseService = new DatabaseService();
  ```
  **Зачем:** Централизованное управление подключением к БД

### 2.2. Создание схемы базы данных

**Приоритет:** Высокий

- [x] Создать `src/services/database/schema.ts` с SQL схемой:
  ```typescript
  export const schema = {
    categories: `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        is_default INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      );
    `,
    accounts: `
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        balance REAL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `,
    expenses: `
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        category_id TEXT,
        date INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `,
    income: `
      CREATE TABLE IF NOT EXISTS income (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        date INTEGER NOT NULL,
        description TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `,
    recurring_expenses: `
      CREATE TABLE IF NOT EXISTS recurring_expenses (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        date INTEGER NOT NULL,
        is_completed INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `,
    goals: `
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        target_amount REAL NOT NULL,
        current_amount REAL DEFAULT 0,
        deadline INTEGER,
        is_completed INTEGER DEFAULT 0,
        account_id TEXT,
        description TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      );
    `
  };
  ```
  **Зачем:** Определение структуры всех таблиц

### 2.3. Система миграций

**Приоритет:** Высокий

- [x] Создать `src/services/database/migrations/migration.ts`:
  ```typescript
  export interface Migration {
    version: number;
    up: (db: SQLiteDBConnection) => Promise<void>;
    down?: (db: SQLiteDBConnection) => Promise<void>;
  }
  ```
  **Зачем:** Тип для миграций

- [x] Создать `src/services/database/migrations/001_initial_schema.ts`:
  ```typescript
  import { Migration } from './migration';
  import { schema } from '../schema';

  export const migration001: Migration = {
    version: 1,
    async up(db) {
      // Создание всех таблиц
      await db.run(schema.categories, []);
      await db.run(schema.accounts, []);
      await db.run(schema.expenses, []);
      await db.run(schema.income, []);
      await db.run(schema.recurring_expenses, []);
      await db.run(schema.goals, []);
    }
  };
  ```
  **Зачем:** Первая миграция для создания схемы

- [x] Создать `src/services/database/migrations/index.ts`:
  ```typescript
  import { migration001 } from './001_initial_schema';
  
  export const migrations = [migration001];
  ```
  **Зачем:** Реестр всех миграций

- [x] Создать таблицу версий в `src/services/database/migrations/000_create_migrations_table.ts`:
  ```typescript
  export const createMigrationsTable = `
    CREATE TABLE IF NOT EXISTS migrations (
      version INTEGER PRIMARY KEY,
      applied_at INTEGER NOT NULL
    );
  `;
  ```
  **Зачем:** Отслеживание примененных миграций

- [x] Реализовать систему миграций в `src/services/database/db.ts`:
  ```typescript
  async runMigrations(): Promise<void> {
    // Проверка текущей версии
    // Применение новых миграций
  }
  ```
  **Зачем:** Автоматическое применение миграций при обновлении

### 2.4. Инициализация базы данных

**Приоритет:** Высокий

- [x] Реализовать метод `initialize()` в `src/services/database/db.ts`:
  ```typescript
  async initialize(): Promise<void> {
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    
    // Проверка существования БД
    // Создание/открытие БД
    // Создание таблицы миграций
    // Применение миграций
    // Заполнение предустановленными данными (категории)
  }
  ```
  **Зачем:** Инициализация БД при запуске приложения

- [x] Создать функцию для заполнения предустановленными категориями:
  ```typescript
  async seedDefaultCategories(): Promise<void> {
    // Вставка предустановленных категорий расходов
  }
  ```
  **Зачем:** Начальные данные для работы приложения

---

## 3. Базовая инфраструктура

### 3.1. Утилиты (shared/utils)

**Приоритет:** Высокий

- [x] Создать `src/shared/lib/utils.ts` с функцией `cn()`:
  ```typescript
  import { clsx, type ClassValue } from "clsx";
  import { twMerge } from "tailwind-merge";

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
  **Зачем:** Утилита для объединения классов Tailwind

- [x] Создать `src/shared/utils/date/dateUtils.ts`:
  ```typescript
  import { format, parseISO } from 'date-fns';
  import { ru } from 'date-fns/locale';

  export const formatDate = (timestamp: number): string => {
    // Форматирование даты из timestamp
  };

  export const formatDateForInput = (timestamp: number): string => {
    // Форматирование для input[type="date"]
  };

  export const parseDateInput = (dateString: string): number => {
    // Парсинг даты из input в timestamp
  };
  ```
  **Зачем:** Утилиты для работы с датами

- [x] Создать `src/shared/utils/currency/currencyUtils.ts`:
  ```typescript
  export const formatCurrency = (amount: number): string => {
    // Форматирование суммы в валюту (₽)
  };

  export const parseCurrency = (value: string): number => {
    // Парсинг строки в число
  };
  ```
  **Зачем:** Утилиты для работы с валютами

- [x] Создать `src/shared/utils/validation/validationUtils.ts`:
  ```typescript
  export const validateAmount = (value: string): boolean => {
    // Валидация суммы
  };

  export const validateRequired = (value: string): boolean => {
    // Валидация обязательных полей
  };
  ```
  **Зачем:** Утилиты для валидации форм

- [x] Создать `src/shared/utils/id/idUtils.ts`:
  ```typescript
  export const generateId = (): string => {
    // Генерация уникального ID (UUID или timestamp-based)
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  ```
  **Зачем:** Генерация уникальных идентификаторов

### 3.2. Общие типы (shared/types)

**Приоритет:** Высокий

- [x] Создать `src/shared/types/common.types.ts`:
  ```typescript
  export interface BaseEntity {
    id: string;
    created_at: number;
    updated_at: number;
  }
  ```
  **Зачем:** Базовый тип для всех сущностей

- [x] Создать `src/shared/types/database.types.ts`:
  ```typescript
  export interface DatabaseRow {
    [key: string]: any;
  }
  ```
  **Зачем:** Типы для работы с БД

### 3.3. Базовые UI компоненты (shadcn/ui)

**Приоритет:** Высокий

- [x] Создать `src/shared/components/ui/button.tsx`:
  ```typescript
  // Компонент Button из shadcn/ui
  ```
  **Зачем:** Кнопка для действий

- [x] Создать `src/shared/components/ui/input.tsx`:
  ```typescript
  // Компонент Input из shadcn/ui
  ```
  **Зачем:** Поле ввода

- [x] Создать `src/shared/components/ui/card.tsx`:
  ```typescript
  // Компонент Card из shadcn/ui
  ```
  **Зачем:** Карточка для отображения данных

- [x] Создать `src/shared/components/ui/dialog.tsx`:
  ```typescript
  // Компонент Dialog из shadcn/ui
  ```
  **Зачем:** Модальное окно для форм

- [x] Создать `src/shared/components/ui/select.tsx`:
  ```typescript
  // Компонент Select из shadcn/ui
  ```
  **Зачем:** Выпадающий список

- [x] Создать `src/shared/components/ui/label.tsx`:
  ```typescript
  // Компонент Label из shadcn/ui
  ```
  **Зачем:** Метка для полей формы

- [x] Создать `src/shared/components/ui/calendar.tsx`:
  ```typescript
  // Компонент Calendar из shadcn/ui
  ```
  **Зачем:** Календарь для выбора даты

- [x] Создать `src/shared/components/ui/checkbox.tsx`:
  ```typescript
  // Компонент Checkbox из shadcn/ui
  ```
  **Зачем:** Чекбокс для булевых значений

### 3.4. Layout компоненты

**Приоритет:** Высокий

- [x] Создать `src/shared/components/layout/BottomNavigation.tsx`:
  ```typescript
  // Нижняя навигация для мобильного приложения
  ```
  **Зачем:** Навигация между основными разделами

- [?] Создать `src/shared/components/layout/PageLayout.tsx`:
  ```typescript
  // Обертка для страниц
  ```
  **Зачем:** Единый layout для всех страниц

### 3.5. Context Providers

**Приоритет:** Высокий

- [x] Создать `src/app/providers/DatabaseProvider.tsx`:
  ```typescript
  interface DatabaseContextType {
    isInitialized: boolean;
    initialize: () => Promise<void>;
  }

  export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Инициализация БД при монтировании
    // Предоставление контекста для доступа к БД
  };
  ```
  **Зачем:** Глобальный доступ к состоянию БД

- [x] Создать `src/app/providers/AppProvider.tsx`:
  ```typescript
  export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Объединение всех провайдеров
    return (
      <DatabaseProvider>
        {children}
      </DatabaseProvider>
    );
  };
  ```
  **Зачем:** Корневой провайдер приложения

### 3.6. Настройка роутинга

**Приоритет:** Высокий

- [ ] Создать `src/app/routes.tsx`:
  ```typescript
  import { Routes, Route } from 'react-router-dom';

  export const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Добавлять маршруты по мере реализации фич */}
      </Routes>
    );
  };
  ```
  **Зачем:** Определение маршрутов приложения

- [ ] Обновить `src/app/App.tsx`:
  ```typescript
  import { BrowserRouter } from 'react-router-dom';
  import { AppProvider } from './providers/AppProvider';
  import { AppRoutes } from './routes';

  function App() {
    return (
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    );
  }
  ```
  **Зачем:** Подключение роутинга и провайдеров

- [ ] Создать `src/app/pages/HomePage.tsx`:
  ```typescript
  // Главная страница с обзором финансов
  ```
  **Зачем:** Начальная страница приложения

---

## 4. Реализация фич

### 4.1. Категории (Categories)

**Приоритет:** Высокий (базовая фича, нужна для расходов)

#### 4.1.1. Типы

- [ ] Создать `src/features/categories/types/category.types.ts`:
  ```typescript
  export interface Category extends BaseEntity {
    name: string;
    icon: string | null;
    color: string | null;
    is_default: boolean;
  }

  export interface CreateCategoryDto {
    name: string;
    icon?: string;
    color?: string;
  }

  export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
  ```
  **Зачем:** Типы для категорий

#### 4.1.2. Репозиторий

- [ ] Создать `src/features/categories/services/categoryRepository.ts`:
  ```typescript
  import { databaseService } from '@/services/database/db';

  export const categoryRepository = {
    async getAll(): Promise<Category[]> {
      // SELECT * FROM categories ORDER BY created_at DESC
    },

    async getById(id: string): Promise<Category | null> {
      // SELECT * FROM categories WHERE id = ?
    },

    async create(data: CreateCategoryDto): Promise<Category> {
      // INSERT INTO categories ...
    },

    async update(id: string, data: UpdateCategoryDto): Promise<Category> {
      // UPDATE categories SET ... WHERE id = ?
    },

    async delete(id: string): Promise<void> {
      // DELETE FROM categories WHERE id = ?
    }
  };
  ```
  **Зачем:** CRUD операции для категорий

#### 4.1.3. Хуки

- [ ] Создать `src/features/categories/hooks/useCategories.ts`:
  ```typescript
  export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCategories = async () => {
      // Загрузка категорий
    };

    useEffect(() => {
      loadCategories();
    }, []);

    return { categories, loading, refetch: loadCategories };
  };
  ```
  **Зачем:** Хук для работы с категориями

- [ ] Создать `src/features/categories/hooks/useCategoryForm.ts`:
  ```typescript
  export const useCategoryForm = (category?: Category) => {
    const [formData, setFormData] = useState<CreateCategoryDto>({...});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
      // Валидация формы
    };

    const handleSubmit = async () => {
      // Сохранение категории
    };

    return { formData, setFormData, errors, handleSubmit, validate };
  };
  ```
  **Зачем:** Хук для работы с формой категории

#### 4.1.4. Компоненты

- [ ] Создать `src/features/categories/components/CategoryForm.tsx`:
  ```typescript
  // Форма добавления/редактирования категории
  // Поля: name, icon (select), color (color picker)
  ```
  **Зачем:** Форма для создания/редактирования категории

- [ ] Создать `src/features/categories/components/CategoryList.tsx`:
  ```typescript
  // Список всех категорий
  // Отображение: иконка, название, цвет
  // Действия: редактирование, удаление
  ```
  **Зачем:** Отображение списка категорий

- [ ] Создать `src/features/categories/components/CategoryItem.tsx`:
  ```typescript
  // Элемент списка категории
  // Отображение иконки, названия, цвета
  ```
  **Зачем:** Отдельный элемент категории

#### 4.1.5. Страница

- [ ] Создать `src/app/pages/CategoriesPage.tsx`:
  ```typescript
  // Страница управления категориями
  // Кнопка "Добавить категорию"
  // Список категорий
  // Диалог для формы
  ```
  **Зачем:** Страница для работы с категориями

- [ ] Добавить маршрут в `src/app/routes.tsx`:
  ```typescript
  <Route path="/categories" element={<CategoriesPage />} />
  ```
  **Зачем:** Доступ к странице категорий

### 4.2. Расходы (Expenses)

**Приоритет:** Высокий (основная функциональность)

#### 4.2.1. Типы

- [ ] Создать `src/features/expenses/types/expense.types.ts`:
  ```typescript
  export interface Expense extends BaseEntity {
    amount: number;
    description: string;
    category_id: string | null;
    date: number; // timestamp
  }

  export interface CreateExpenseDto {
    amount: number;
    description: string;
    category_id?: string;
    date: number;
  }

  export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {}
  ```
  **Зачем:** Типы для расходов

#### 4.2.2. Репозиторий

- [ ] Создать `src/features/expenses/services/expenseRepository.ts`:
  ```typescript
  export const expenseRepository = {
    async getAll(): Promise<Expense[]> {
      // SELECT * FROM expenses ORDER BY date DESC, created_at DESC
    },

    async getById(id: string): Promise<Expense | null> {
      // SELECT * FROM expenses WHERE id = ?
    },

    async getByDateRange(startDate: number, endDate: number): Promise<Expense[]> {
      // SELECT * FROM expenses WHERE date >= ? AND date <= ?
    },

    async create(data: CreateExpenseDto): Promise<Expense> {
      // INSERT INTO expenses ...
    },

    async update(id: string, data: UpdateExpenseDto): Promise<Expense> {
      // UPDATE expenses SET ... WHERE id = ?
    },

    async delete(id: string): Promise<void> {
      // DELETE FROM expenses WHERE id = ?
    },

    async getTotalByPeriod(startDate: number, endDate: number): Promise<number> {
      // SELECT SUM(amount) FROM expenses WHERE date >= ? AND date <= ?
    }
  };
  ```
  **Зачем:** CRUD операции и аналитика для расходов

#### 4.2.3. Хуки

- [ ] Создать `src/features/expenses/hooks/useExpenses.ts`:
  ```typescript
  export const useExpenses = (filters?: { startDate?: number; endDate?: number }) => {
    // Загрузка расходов с фильтрами
  };
  ```
  **Зачем:** Хук для работы с расходами

- [ ] Создать `src/features/expenses/hooks/useExpenseForm.ts`:
  ```typescript
  export const useExpenseForm = (expense?: Expense) => {
    // Логика формы расхода
  };
  ```
  **Зачем:** Хук для формы расхода

#### 4.2.4. Компоненты

- [ ] Создать `src/features/expenses/components/ExpenseForm.tsx`:
  ```typescript
  // Форма добавления/редактирования расхода
  // Поля: amount, description, category (select), date (calendar)
  ```
  **Зачем:** Форма для создания/редактирования расхода

- [ ] Создать `src/features/expenses/components/ExpenseList.tsx`:
  ```typescript
  // Список расходов
  // Группировка по датам
  // Фильтры по периоду
  ```
  **Зачем:** Отображение списка расходов

- [ ] Создать `src/features/expenses/components/ExpenseItem.tsx`:
  ```typescript
  // Элемент списка расхода
  // Отображение: сумма, описание, категория, дата
  ```
  **Зачем:** Отдельный элемент расхода

#### 4.2.5. Страница

- [ ] Создать `src/app/pages/ExpensesPage.tsx`:
  ```typescript
  // Страница расходов
  // Кнопка "Добавить расход"
  // Список расходов с фильтрами
  // Статистика за период
  ```
  **Зачем:** Страница для работы с расходами

- [ ] Добавить маршрут в `src/app/routes.tsx`:
  ```typescript
  <Route path="/expenses" element={<ExpensesPage />} />
  ```
  **Зачем:** Доступ к странице расходов

### 4.3. Доходы (Income)

**Приоритет:** Средний

#### 4.3.1. Типы

- [ ] Создать `src/features/income/types/income.types.ts`:
  ```typescript
  export interface Income extends BaseEntity {
    amount: number;
    date: number;
    description: string | null;
  }

  export interface CreateIncomeDto {
    amount: number;
    date: number;
    description?: string;
  }

  export interface UpdateIncomeDto extends Partial<CreateIncomeDto> {}
  ```
  **Зачем:** Типы для доходов

#### 4.3.2. Репозиторий

- [ ] Создать `src/features/income/services/incomeRepository.ts`:
  ```typescript
  export const incomeRepository = {
    async getAll(): Promise<Income[]> {},
    async getById(id: string): Promise<Income | null> {},
    async getByDateRange(startDate: number, endDate: number): Promise<Income[]> {},
    async create(data: CreateIncomeDto): Promise<Income> {},
    async update(id: string, data: UpdateIncomeDto): Promise<Income> {},
    async delete(id: string): Promise<void> {},
    async getTotalByPeriod(startDate: number, endDate: number): Promise<number> {}
  };
  ```
  **Зачем:** CRUD операции для доходов

#### 4.3.3. Хуки

- [ ] Создать `src/features/income/hooks/useIncome.ts`
- [ ] Создать `src/features/income/hooks/useIncomeForm.ts`

#### 4.3.4. Компоненты

- [ ] Создать `src/features/income/components/IncomeForm.tsx`
- [ ] Создать `src/features/income/components/IncomeList.tsx`
- [ ] Создать `src/features/income/components/IncomeItem.tsx`

#### 4.3.5. Страница

- [ ] Создать `src/app/pages/IncomePage.tsx`
- [ ] Добавить маршрут в `src/app/routes.tsx`

### 4.4. Счета (Accounts)

**Приоритет:** Средний (нужны для целей)

#### 4.4.1. Типы

- [ ] Создать `src/features/accounts/types/account.types.ts`:
  ```typescript
  export interface Account extends BaseEntity {
    name: string;
    balance: number;
  }

  export interface CreateAccountDto {
    name: string;
    balance?: number;
  }

  export interface UpdateAccountDto extends Partial<CreateAccountDto> {}
  ```
  **Зачем:** Типы для счетов

#### 4.4.2. Репозиторий

- [ ] Создать `src/features/accounts/services/accountRepository.ts`:
  ```typescript
  export const accountRepository = {
    async getAll(): Promise<Account[]> {},
    async getById(id: string): Promise<Account | null> {},
    async create(data: CreateAccountDto): Promise<Account> {},
    async update(id: string, data: UpdateAccountDto): Promise<Account> {},
    async updateBalance(id: string, newBalance: number): Promise<void> {},
    async delete(id: string): Promise<void> {}
  };
  ```
  **Зачем:** CRUD операции для счетов

#### 4.4.3. Хуки

- [ ] Создать `src/features/accounts/hooks/useAccounts.ts`
- [ ] Создать `src/features/accounts/hooks/useAccountForm.ts`

#### 4.4.4. Компоненты

- [ ] Создать `src/features/accounts/components/AccountForm.tsx`
- [ ] Создать `src/features/accounts/components/AccountList.tsx`
- [ ] Создать `src/features/accounts/components/AccountItem.tsx`

#### 4.4.5. Страница

- [ ] Создать `src/app/pages/AccountsPage.tsx`
- [ ] Добавить маршрут в `src/app/routes.tsx`

### 4.5. Обязательные траты (Recurring Expenses)

**Приоритет:** Средний

#### 4.5.1. Типы

- [ ] Создать `src/features/recurring-expenses/types/recurringExpense.types.ts`:
  ```typescript
  export interface RecurringExpense extends BaseEntity {
    amount: number;
    description: string;
    date: number;
    is_completed: boolean;
  }

  export interface CreateRecurringExpenseDto {
    amount: number;
    description: string;
    date: number;
  }

  export interface UpdateRecurringExpenseDto extends Partial<CreateRecurringExpenseDto> {
    is_completed?: boolean;
  }
  ```
  **Зачем:** Типы для обязательных трат

#### 4.5.2. Репозиторий

- [ ] Создать `src/features/recurring-expenses/services/recurringExpenseRepository.ts`:
  ```typescript
  export const recurringExpenseRepository = {
    async getAll(): Promise<RecurringExpense[]> {},
    async getById(id: string): Promise<RecurringExpense | null> {},
    async getPending(): Promise<RecurringExpense[]> {},
    async create(data: CreateRecurringExpenseDto): Promise<RecurringExpense> {},
    async update(id: string, data: UpdateRecurringExpenseDto): Promise<RecurringExpense> {},
    async markCompleted(id: string): Promise<void> {},
    async delete(id: string): Promise<void> {}
  };
  ```
  **Зачем:** CRUD операции для обязательных трат

#### 4.5.3. Хуки

- [ ] Создать `src/features/recurring-expenses/hooks/useRecurringExpenses.ts`
- [ ] Создать `src/features/recurring-expenses/hooks/useRecurringExpenseForm.ts`

#### 4.5.4. Компоненты

- [ ] Создать `src/features/recurring-expenses/components/RecurringExpenseForm.tsx`
- [ ] Создать `src/features/recurring-expenses/components/RecurringExpenseList.tsx`
- [ ] Создать `src/features/recurring-expenses/components/RecurringExpenseItem.tsx`

#### 4.5.5. Страница

- [ ] Создать `src/app/pages/RecurringExpensesPage.tsx`
- [ ] Добавить маршрут в `src/app/routes.tsx`

### 4.6. Цели (Goals)

**Приоритет:** Средний

#### 4.6.1. Типы

- [ ] Создать `src/features/goals/types/goal.types.ts`:
  ```typescript
  export interface Goal extends BaseEntity {
    target_amount: number;
    current_amount: number;
    deadline: number | null;
    is_completed: boolean;
    account_id: string | null;
    description: string | null;
  }

  export interface CreateGoalDto {
    target_amount: number;
    current_amount?: number;
    deadline?: number;
    account_id?: string;
    description?: string;
  }

  export interface UpdateGoalDto extends Partial<CreateGoalDto> {
    is_completed?: boolean;
  }
  ```
  **Зачем:** Типы для целей

#### 4.6.2. Репозиторий

- [ ] Создать `src/features/goals/services/goalRepository.ts`:
  ```typescript
  export const goalRepository = {
    async getAll(): Promise<Goal[]> {},
    async getById(id: string): Promise<Goal | null> {},
    async getActive(): Promise<Goal[]> {},
    async create(data: CreateGoalDto): Promise<Goal> {},
    async update(id: string, data: UpdateGoalDto): Promise<Goal> {},
    async addAmount(id: string, amount: number): Promise<void> {},
    async markCompleted(id: string): Promise<void> {},
    async delete(id: string): Promise<void> {}
  };
  ```
  **Зачем:** CRUD операции для целей

#### 4.6.3. Хуки

- [ ] Создать `src/features/goals/hooks/useGoals.ts`
- [ ] Создать `src/features/goals/hooks/useGoalForm.ts`

#### 4.6.4. Компоненты

- [ ] Создать `src/features/goals/components/GoalForm.tsx`
- [ ] Создать `src/features/goals/components/GoalList.tsx`
- [ ] Создать `src/features/goals/components/GoalItem.tsx` (с прогресс-баром)

#### 4.6.5. Страница

- [ ] Создать `src/app/pages/GoalsPage.tsx`
- [ ] Добавить маршрут в `src/app/routes.tsx`

### 4.7. Статистика (Statistics)

**Приоритет:** Низкий

#### 4.7.1. Типы

- [ ] Создать `src/features/statistics/types/statistics.types.ts`:
  ```typescript
  export interface PeriodStatistics {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    expensesByCategory: Array<{ categoryId: string; amount: number }>;
  }

  export interface MonthlyStatistics {
    month: number;
    year: number;
    income: number;
    expenses: number;
    balance: number;
  }
  ```
  **Зачем:** Типы для статистики

#### 4.7.2. Сервисы

- [ ] Создать `src/features/statistics/services/statisticsService.ts`:
  ```typescript
  export const statisticsService = {
    async getPeriodStatistics(startDate: number, endDate: number): Promise<PeriodStatistics> {
      // Агрегация данных за период
    },

    async getMonthlyStatistics(year: number): Promise<MonthlyStatistics[]> {
      // Статистика по месяцам
    },

    async getExpensesByCategory(startDate: number, endDate: number): Promise<Array<{...}>> {
      // Группировка расходов по категориям
    }
  };
  ```
  **Зачем:** Сервисы для расчета статистики

#### 4.7.3. Хуки

- [ ] Создать `src/features/statistics/hooks/useStatistics.ts`:
  ```typescript
  export const useStatistics = (period: { startDate: number; endDate: number }) => {
    // Загрузка статистики за период
  };
  ```
  **Зачем:** Хук для работы со статистикой

#### 4.7.4. Компоненты

- [ ] Создать `src/features/statistics/components/StatisticsCard.tsx`:
  ```typescript
  // Карточка со статистикой (доходы, расходы, баланс)
  ```
  **Зачем:** Отображение основных метрик

- [ ] Создать `src/features/statistics/components/CategoryChart.tsx`:
  ```typescript
  // График расходов по категориям (можно использовать простую визуализацию без библиотек)
  ```
  **Зачем:** Визуализация расходов по категориям

- [ ] Создать `src/features/statistics/components/MonthlyChart.tsx`:
  ```typescript
  // График доходов/расходов по месяцам
  ```
  **Зачем:** Визуализация динамики по месяцам

#### 4.7.5. Страница

- [ ] Создать `src/app/pages/StatisticsPage.tsx`:
  ```typescript
  // Страница статистики
  // Фильтры по периоду
  // Карточки с метриками
  // Графики
  ```
  **Зачем:** Страница со статистикой

- [ ] Добавить маршрут в `src/app/routes.tsx`

### 4.8. Главная страница (Home/Dashboard)

**Приоритет:** Высокий

- [ ] Обновить `src/app/pages/HomePage.tsx`:
  ```typescript
  // Дашборд с:
  // - Краткой статистикой (баланс, доходы/расходы за месяц)
  // - Последними транзакциями
  // - Активными целями
  // - Предстоящими обязательными тратами
  // - Быстрыми действиями (добавить расход/доход)
  ```
  **Зачем:** Главный экран приложения с обзором

- [ ] Добавить маршрут `/` в `src/app/routes.tsx`

---

## 5. Тестирование и финализация

### 5.1. Интеграция и тестирование

**Приоритет:** Высокий

- [ ] Протестировать создание всех сущностей
- [ ] Протестировать редактирование всех сущностей
- [ ] Протестировать удаление всех сущностей
- [ ] Протестировать связи между сущностями (категории-расходы, счета-цели)
- [ ] Протестировать валидацию форм
- [ ] Протестировать работу с датами
- [ ] Протестировать форматирование валют
- [ ] Протестировать статистику

### 5.2. UI/UX улучшения

**Приоритет:** Средний

- [ ] Добавить loading состояния для всех операций
- [ ] Добавить error handling и отображение ошибок
- [ ] Добавить подтверждения для удаления
- [ ] Оптимизировать отображение списков (виртуализация при необходимости)
- [ ] Добавить пустые состояния (empty states)
- [ ] Улучшить мобильную адаптивность

### 5.3. Оптимизация производительности

**Приоритет:** Средний

- [ ] Оптимизировать запросы к БД (индексы при необходимости)
- [ ] Добавить мемоизацию для тяжелых вычислений
- [ ] Оптимизировать ре-рендеры компонентов
- [ ] Проверить размер бандла

### 5.4. Подготовка к сборке

**Приоритет:** Высокий

- [ ] Собрать проект для production:
  ```bash
  npm run build
  ```
  **Зачем:** Проверка сборки

- [ ] Синхронизировать с Capacitor:
  ```bash
  npx cap sync ios
  ```
  **Зачем:** Обновление iOS проекта

- [ ] Открыть проект в Xcode:
  ```bash
  npx cap open ios
  ```
  **Зачем:** Финальная проверка и настройка

### 5.5. Финальные проверки

**Приоритет:** Высокий

- [ ] Проверить работу на iOS симуляторе
- [ ] Проверить работу на реальном устройстве
- [ ] Проверить сохранение данных после перезапуска
- [ ] Проверить работу всех функций
- [ ] Проверить производительность

---

## 📝 Примечания

### Порядок выполнения

1. **Сначала:** Настройка проекта, БД, базовая инфраструктура
2. **Затем:** Категории (базовая фича)
3. **Далее:** Расходы (основная функциональность)
4. **После:** Доходы, Счета, Обязательные траты, Цели
5. **В конце:** Статистика и финализация

### Важные моменты

- Каждая фича должна быть полностью изолирована
- Все операции с БД должны быть в репозиториях
- Использовать TypeScript strict mode
- Все данные хранятся локально в SQLite
- Приглушенная цветовая палитра без темной темы
- Мобильная оптимизация UI

### Полезные команды

```bash
# Запуск dev сервера
npm start

# Сборка для production
npm run build

# Синхронизация с Capacitor
npx cap sync ios

# Открыть в Xcode
npx cap open ios

# Запуск тестов
npm test
```

---

**Удачи в разработке! 🚀**

