/**
 * Форматирование суммы в валюту (₽)
 * @param amount - Сумма в рублях
 * @returns Отформатированная строка (например: "1 234,56 ₽")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Форматирование суммы без символа валюты
 * @param amount - Сумма в рублях
 * @returns Отформатированная строка (например: "1 234,56")
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Парсинг строки в число
 * Удаляет пробелы и заменяет запятую на точку
 * @param value - Строка с числом (например: "1 234,56" или "1234.56")
 * @returns Число или NaN, если не удалось распарсить
 */
export const parseCurrency = (value: string): number => {
  if (!value || value.trim() === '') {
    return 0;
  }

  // Удаляем пробелы и заменяем запятую на точку
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Проверка, является ли значение валидной суммой
 * @param value - Строка для проверки
 * @returns true, если значение можно распарсить как число
 */
export const isValidAmount = (value: string): boolean => {
  const parsed = parseCurrency(value);
  return !isNaN(parsed) && parsed >= 0;
};

