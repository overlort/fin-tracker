import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Finance Tracker', () => {
  render(<App />);
  const headerElement = screen.getByText(/Finance Tracker/i);
  expect(headerElement).toBeInTheDocument();
});
