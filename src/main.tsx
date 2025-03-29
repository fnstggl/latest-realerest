
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const renderApp = () => {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

// Render the app
renderApp();

// Add a global error handler to prevent full page crashes
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent the error from causing a full page refresh
  event.preventDefault();
});
