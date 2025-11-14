/**
 * Базовый интерфейс для всех сущностей в системе
 * Все сущности должны иметь id, created_at и updated_at
 */
export interface BaseEntity {
  id: string;
  created_at: number;
  updated_at: number;
}

/**
 * Интерфейс для DTO создания сущности
 * Не содержит системных полей (id, created_at, updated_at)
 */
export interface CreateDto {
  // Базовый интерфейс, расширяется в конкретных сущностях
}

/**
 * Интерфейс для DTO обновления сущности
 * Все поля опциональны
 */
export interface UpdateDto {
  // Базовый интерфейс, расширяется в конкретных сущностях
}

