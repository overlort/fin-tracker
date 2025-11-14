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