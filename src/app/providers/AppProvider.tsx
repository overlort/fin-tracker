import React, { ReactNode } from 'react';
import { DatabaseProvider } from './DatabaseProvider';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Корневой провайдер приложения
 * Объединяет все провайдеры (DatabaseProvider и другие)
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <DatabaseProvider>
      {children}
    </DatabaseProvider>
  );
};

