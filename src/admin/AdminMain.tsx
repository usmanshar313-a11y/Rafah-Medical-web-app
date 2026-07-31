import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './AdminApp';
import '../index.css';

const rootEl = document.getElementById('admin-root') || document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>
  );
}
