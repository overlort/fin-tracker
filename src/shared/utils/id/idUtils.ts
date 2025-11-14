/**
 * Генерация уникального ID на основе timestamp и случайной строки
 * @returns Уникальный идентификатор в формате: timestamp-randomString
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Проверка, является ли строка валидным ID
 * @param id - Строка для проверки
 * @returns true, если строка является валидным ID
 */
export const isValidId = (id: string): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  // Проверяем формат: timestamp-randomString
  const idRegex = /^\d+-[a-z0-9]+$/;
  return idRegex.test(id);
};

