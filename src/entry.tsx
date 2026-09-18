import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RebuildApp from './RebuildApp';
import AdminPanel from './admin/AdminPanel';
import AuditCenterPage from './admin/AuditCenterPage';
import PowerLiftReviewPage from './admin/PowerLiftReviewPage';
import ChampionshipSignupPage from './public/ChampionshipSignupPage';
import AccountPortalPage from './public/AccountPortalPage';
import './RebuildApp.css';
import './admin/AdminOperational.css';
import './admin/FinanceOverviewPanel.css';

const path = window.location.pathname.replace(/\/$/, '') || '/';
const isAuditAdminRoute = path === '/admin/audit' || path.startsWith('/admin/audit/');
const isPowerLiftAdminRoute = path === '/admin/powerlift' || path.startsWith('/admin/powerlift/');
const isAdminRoute = path === '/admin' || path.startsWith('/admin/');
const isAccountRoute = path === '/conta' || path.startsWith('/conta/');
const championshipId = path === '/campeonatos/cardio'
  ? 'invictus_cardio_v1'
  : path === '/campeonatos/musculacao'
    ? 'invictus_strength_v1'
    : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAuditAdminRoute
      ? <AuditCenterPage />
      : isPowerLiftAdminRoute
        ? <PowerLiftReviewPage />
        : isAdminRoute
          ? <AdminPanel />
          : isAccountRoute
            ? <AccountPortalPage />
            : championshipId
              ? <ChampionshipSignupPage championshipId={championshipId} />
              : <RebuildApp />}
  </StrictMode>,
);
