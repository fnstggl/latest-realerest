
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const renderApp = () => {
  const root = createRoot(rootElement);
  root.render(
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
// This prevents the perpetual loading issue by capturing errors
// without refreshing the page
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent the error from causing a full page refresh
  event.preventDefault();
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the rejection from causing a full page refresh
  event.preventDefault();
});
