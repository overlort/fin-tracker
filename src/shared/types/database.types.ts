/**
 * Тип для строки результата запроса к БД
 * Представляет произвольный объект с ключами-строками и любыми значениями
 */
export interface DatabaseRow {
  [key: string]: any;
}

/**
 * Тип для результата SELECT запроса
 */
export interface QueryResult {
  values?: DatabaseRow[];
  changes?: number;
  lastId?: number;
}

/**
 * Тип для параметров SQL запроса
 */
export type QueryParams = (string | number | null | undefined)[];

