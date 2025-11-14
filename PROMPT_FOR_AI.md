# Промпт для нейросети-помощника

Скопируйте этот текст и отправьте нейросети для получения детального плана:

---

Я хочу разработать мобильное приложение **Fin Tracker** на React + TypeScript + Capacitor для iOS.

## Описание проекта:

**Fin Tracker** — мобильное приложение для отслеживания личных финансов. Позволяет вести учет расходов, доходов, обязательных трат, целей накопления и счетов. Все данные хранятся локально на устройстве в SQLite базе данных.

**Целевая платформа:** iOS (через Capacitor)  
**Пользователи:** один пользователь (без бэкенда, без синхронизации)  
**Подход:** офлайн-первый (все данные локально)

## Сущности данных:

1. **Расходы (Expenses)** - дата, сумма, описание ("на что"), категория (опционально)
2. **Доходы (Income)** - дата, сумма, описание (опционально)
3. **Обязательные траты (Recurring Expenses)** - дата, сумма, описание ("на что"), статус выполнения (выполнено/не выполнено)
4. **Цели (Goals)** - целевая сумма, текущая накопленная сумма, дедлайн (опционально), статус выполнения, привязанный счет
5. **Счета (Accounts)** - название, баланс (текущий)
6. **Категории (Categories)** - название, иконка, цвет, тип (предустановленная/кастомная)

## Технологический стек:

- **React 19** + **TypeScript** (strict mode)
- **React Router DOM** для роутинга
- **Tailwind CSS** + **shadcn/ui** для UI компонентов
- **@capacitor-community/sqlite** для локального хранения данных
- **Context API** для state management
- **Create React App** для сборки
- **Capacitor** для мобильной платформы

## Структура проекта (feature-first подход):

```
src/
├── features/          # Доменные фичи (изолированные модули)
│   ├── expenses/      # Расходы
│   ├── income/        # Доходы
│   ├── goals/         # Цели
│   ├── accounts/      # Счета
│   ├── categories/    # Категории
│   ├── recurring-expenses/ # Обязательные траты
│   └── statistics/    # Статистика
│
├── shared/            # Общий переиспользуемый код
│   ├── components/    # UI компоненты (shadcn) и layout
│   ├── hooks/         # Общие хуки
│   ├── utils/         # Утилиты (date, currency, validation)
│   ├── types/         # Общие типы
│   └── constants/     # Константы
│
├── services/          # Сервисы уровня приложения
│   └── database/      # Работа с SQLite
│
├── app/               # Конфигурация приложения
│   ├── App.tsx        # Главный компонент
│   ├── routes.tsx     # Роутинг
│   ├── providers/     # Context providers
│   └── pages/         # Страницы (роуты)
│
└── styles/            # Глобальные стили
```

## Что нужно сделать:

Создай **подробный пошаговый план** в формате .md файла с чекбоксами для реализации приложения **с нуля**.

### План должен включать:

1. **Настройку проекта**
   - Установку зависимостей
   - Настройку TypeScript
   - Настройку Tailwind CSS и shadcn/ui
   - Создание структуры папок

2. **Настройку базы данных SQLite**
   - Инициализацию SQLite
   - Создание схемы БД (все таблицы для сущностей)
   - Систему миграций

3. **Базовую инфраструктуру**
   - Настройку роутинга (React Router)
   - Создание Context Providers (DatabaseProvider, AppProvider)
   - Инициализацию БД при запуске приложения
   - Базовые UI компоненты (shadcn)

4. **Реализацию фич** (в порядке приоритета):
   - **Категории** (самая простая, базовая фича)
   - **Расходы** (основная функциональность)
   - **Доходы**
   - **Счета**
   - **Обязательные траты**
   - **Цели**
   - **Статистика**

### Для каждой фичи описать:

- ✅ Создание типов TypeScript (`types/entity.types.ts`)
- ✅ Создание репозитория (`services/entityRepository.ts`) с CRUD операциями:
  - getAll() - получение всех записей
  - getById(id) - получение по ID
  - create(entity) - создание
  - update(id, entity) - обновление
  - delete(id) - удаление
- ✅ Создание хуков (`hooks/useEntity.ts`, `hooks/useEntityForm.ts`)
- ✅ Создание UI компонентов:
  - EntityForm.tsx - форма добавления/редактирования
  - EntityList.tsx - список записей
  - EntityItem.tsx - элемент списка
- ✅ Создание страницы (`app/pages/EntityPage.tsx`)
- ✅ Добавление маршрута

### Технические требования:

- Использовать **shadcn/ui** компоненты (button, input, card, dialog, select, calendar)
- Использовать **SQLite** через @capacitor-community/sqlite:
  - `db.query()` для SELECT запросов
  - `db.run()` для INSERT/UPDATE/DELETE/CREATE
  - `db.beginTransaction()`, `db.commitTransaction()`, `db.rollbackTransaction()` для транзакций
- Следовать **feature-first** структуре (каждая фича изолирована)
- Использовать **TypeScript строго** (strict mode)
- Все данные в **SQLite локально** (без бэкенда)
- Использовать **Context API** для глобального состояния
- **Приглушенные тона** для цветовой палитры (без темной темы)

### Структура базы данных:

```sql
-- Таблица категорий
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  is_default INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);

-- Таблица счетов
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  balance REAL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Таблица расходов
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT,
  date INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Таблица доходов
CREATE TABLE income (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  date INTEGER NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Таблица обязательных трат
CREATE TABLE recurring_expenses (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  description TEXT NOT NULL,
  date INTEGER NOT NULL,
  is_completed INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Таблица целей
CREATE TABLE goals (
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
```

### Формат плана:

- **Markdown файл** с расширением .md
- **Заголовки и подзаголовки** для структуры
- **Чекбоксы** `- [ ]` для отслеживания прогресса
- **Детальное описание** каждого шага
- **Примеры кода** где необходимо
- **Объяснения** "что" и "зачем" для каждого шага
- **Приоритеты выполнения** (высокий/средний/низкий)

### Важно:

- План должен быть **максимально детальным** и **пошаговым**
- Каждый шаг должен быть понятен даже новичку в React/TypeScript
- Включить **примеры кода** для сложных моментов
- Объяснить **назначение** каждого компонента/файла
- Указать **порядок выполнения** (что делать сначала, что потом)

Создай такой план, чтобы я мог следовать ему самостоятельно от начала до конца, отмечая выполненные задачи чекбоксами.

---
