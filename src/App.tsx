import React from 'react';
import { AppProvider } from './app/providers/AppProvider';
import { TestPage } from './app/pages/TestPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <TestPage />
    </AppProvider>
  );
}

export default App;
