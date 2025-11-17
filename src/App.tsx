import React from 'react';
import { DatabaseProvider } from './app/providers/DatabaseProvider';
import { TestPage } from './app/pages/TestPage';
import './App.css';

function App() {
  return (
    <DatabaseProvider>
      <TestPage />
    </DatabaseProvider>
  );
}

export default App;
