import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { databaseService } from "@/services/database/db";

interface DatabaseContextType {
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  initialize: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialize = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      await databaseService.initialize();
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Database initialization error:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    // Инициализируем IndexedDB при монтировании
    initialize();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        isInitialized,
        isInitializing,
        error,
        initialize,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

