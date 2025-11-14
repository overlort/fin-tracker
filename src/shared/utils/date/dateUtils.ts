import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматирование даты из timestamp в читаемый формат
 * @param timestamp - timestamp в миллисекундах
 * @returns Отформатированная дата (например: "15 января 2024")
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'd MMMM yyyy', { locale: ru });
};

/**
 * Форматирование даты для отображения в коротком формате
 * @param timestamp - timestamp в миллисекундах
 * @returns Отформатированная дата (например: "15.01.2024")
 */
export const formatDateShort = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'dd.MM.yyyy', { locale: ru });
};

/**
 * Форматирование даты для input[type="date"]
 * @param timestamp - timestamp в миллисекундах
 * @returns Дата в формате YYYY-MM-DD
 */
export const formatDateForInput = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'yyyy-MM-dd');
};

/**
 * Парсинг даты из input[type="date"] в timestamp
 * @param dateString - Дата в формате YYYY-MM-DD
 * @returns Timestamp в миллисекундах
 */
export const parseDateInput = (dateString: string): number => {
  const date = parseISO(dateString);
  return date.getTime();
};

/**
 * Получение начала дня в timestamp
 * @param timestamp - timestamp в миллисекундах
 * @returns Timestamp начала дня (00:00:00)
 */
export const getStartOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/**
 * Получение конца дня в timestamp
 * @param timestamp - timestamp в миллисекундах
 * @returns Timestamp конца дня (23:59:59.999)
 */
export const getEndOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

/**
 * Получение начала месяца в timestamp
 * @param timestamp - timestamp в миллисекундах
 * @returns Timestamp начала месяца
 */
export const getStartOfMonth = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/**
 * Получение конца месяца в timestamp
 * @param timestamp - timestamp в миллисекундах
 * @returns Timestamp конца месяца
 */
export const getEndOfMonth = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

/**
 * Форматирование времени из timestamp
 * @param timestamp - timestamp в миллисекундах
 * @returns Время в формате HH:mm
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'HH:mm', { locale: ru });
};

