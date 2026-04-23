import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSecurity } from './lib/security';
import { validateEnvironment } from './lib/envValidator';
import { ensureCSRFToken } from './lib/csrf';

try {
  validateEnvironment();
  initializeSecurity();
  ensureCSRFToken();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Application initialization failed:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; background: linear-gradient(to bottom right, #1f2937, #111827); color: white; font-family: system-ui, -apple-system, sans-serif;">
      <div style="max-width: 600px; text-align: center;">
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Configuration Error</h1>
        <p style="color: #9ca3af; margin-bottom: 2rem;">
          The application is not properly configured. Please check the console for details.
        </p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500;">
          Retry
        </button>
      </div>
    </div>
  `;
}
