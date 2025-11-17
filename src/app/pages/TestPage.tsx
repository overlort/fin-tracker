import React, { useEffect, useState } from 'react';
import { useDatabase } from '../providers/DatabaseProvider';
import { databaseService } from '@/services/database/db';

export const TestPage: React.FC = () => {
  const { isInitialized, isInitializing, error, initialize } = useDatabase();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    if (!isInitialized) return;

    try {
      setLoading(true);
      const db = await databaseService.getConnection();
      const result = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
      setCategories(result.values || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      loadCategories();
    }
  }, [isInitialized]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Тест базы данных</h1>

        {/* Статус инициализации */}
        <div className="mb-6 p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Статус БД</h2>
          {isInitializing && (
            <p className="text-muted-foreground">Инициализация базы данных...</p>
          )}
          {error && (
            <div className="text-destructive">
              <p className="font-semibold">Ошибка:</p>
              <p>{error}</p>
            </div>
          )}
          {isInitialized && !error && (
            <div className="text-green-600 font-semibold">
              ✅ База данных успешно инициализирована
            </div>
          )}
          {!isInitialized && !isInitializing && !error && (
            <button
              onClick={initialize}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Инициализировать БД
            </button>
          )}
        </div>

        {/* Категории */}
        {isInitialized && (
          <div className="mb-6 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Категории</h2>
              <button
                onClick={loadCategories}
                disabled={loading}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 disabled:opacity-50"
              >
                {loading ? 'Загрузка...' : 'Обновить'}
              </button>
            </div>

            {categories.length === 0 ? (
              <p className="text-muted-foreground">Категории не найдены</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      {category.icon && (
                        <span className="text-2xl">{category.icon}</span>
                      )}
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        {category.color && (
                          <div
                            className="w-4 h-4 rounded-full mt-1"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          ID: {category.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Информация о платформе */}
        <div className="p-4 rounded-lg border bg-muted">
          <h2 className="text-xl font-semibold mb-2">Информация о платформе</h2>
          <p className="text-sm text-muted-foreground">
            Capacitor: {typeof window !== 'undefined' && (window as any).Capacitor ? '✅ Да' : '❌ Нет'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Платформа: {typeof window !== 'undefined' && (window as any).Capacitor?.getPlatform() || 'Web'}
          </p>
          {typeof window !== 'undefined' && !(window as any).Capacitor && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <p className="text-blue-800 font-semibold">🔧 Режим разработки</p>
              <p className="text-blue-600 mt-1">
                Используется мок БД (localStorage). Данные сохраняются между перезагрузками страницы.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

