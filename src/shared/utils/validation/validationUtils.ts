/**
 * Валидация суммы
 * @param value - Строка с суммой
 * @returns true, если сумма валидна (положительное число)
 */
export const validateAmount = (value: string): boolean => {
  if (!value || value.trim() === '') {
    return false;
  }

  // Удаляем пробелы и заменяем запятую на точку
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);

  return !isNaN(parsed) && parsed > 0 && isFinite(parsed);
};

/**
 * Валидация обязательных полей
 * @param value - Значение для проверки
 * @returns true, если поле заполнено
 */
export const validateRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Валидация email
 * @param email - Email для проверки
 * @returns true, если email валиден
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Валидация длины строки
 * @param value - Строка для проверки
 * @param min - Минимальная длина
 * @param max - Максимальная длина
 * @returns true, если длина в допустимых пределах
 */
export const validateLength = (
  value: string,
  min: number,
  max: number
): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Валидация даты
 * @param timestamp - Timestamp для проверки
 * @returns true, если дата валидна
 */
export const validateDate = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
};

/**
 * Валидация, что дата не в будущем
 * @param timestamp - Timestamp для проверки
 * @returns true, если дата не в будущем
 */
export const validateDateNotFuture = (timestamp: number): boolean => {
  return timestamp <= Date.now();
};

/**
 * Валидация, что дата не в прошлом
 * @param timestamp - Timestamp для проверки
 * @returns true, если дата не в прошлом
 */
export const validateDateNotPast = (timestamp: number): boolean => {
  return timestamp >= Date.now();
};

