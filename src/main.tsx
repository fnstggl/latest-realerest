
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

// Wrap rendering in a try-catch to prevent white screens
try {
  renderApp();
} catch (error) {
  console.error('Failed to render application:', error);
  // Render a basic error page if the app fails to load
  rootElement.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 2rem; text-align: center;">
      <h1 style="margin-bottom: 1rem; color: #d60013; font-size: 2rem;">Something went wrong</h1>
      <p style="margin-bottom: 2rem; max-width: 500px;">We're sorry, but something went wrong while loading the application. Please try refreshing the page.</p>
      <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background-color: #d60013; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Refresh Page</button>
    </div>
  `;
}
