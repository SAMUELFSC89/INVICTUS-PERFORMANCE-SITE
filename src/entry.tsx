import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RebuildApp from './RebuildApp';
import AdminPanel from './admin/AdminPanel';
import PowerLiftReviewPage from './admin/PowerLiftReviewPage';
import './RebuildApp.css';
import './admin/AdminOperational.css';
import './admin/FinanceOverviewPanel.css';

const path = window.location.pathname;
const isPowerLiftAdminRoute = path === '/admin/powerlift' || path.startsWith('/admin/powerlift/');
const isAdminRoute = path === '/admin' || path.startsWith('/admin/');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPowerLiftAdminRoute ? <PowerLiftReviewPage /> : isAdminRoute ? <AdminPanel /> : <RebuildApp />}
  </StrictMode>,
);
