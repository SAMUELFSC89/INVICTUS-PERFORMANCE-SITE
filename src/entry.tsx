import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import RebuildApp from './RebuildApp';
import AdminShell from './admin/AdminShell';
import AuditCenterPage from './admin/AuditCenterPage';
import AthleteAuditPage from './admin/AthleteAuditPage';
import ChampionshipAdminPage from './admin/ChampionshipAdminPage';
import ChampionshipAdminNav from './admin/ChampionshipAdminNav';
import ChampionshipOperationsPage from './admin/ChampionshipOperationsPage';
import PowerLiftReviewPage from './admin/PowerLiftReviewPage';
import ChampionshipSignupPage from './public/ChampionshipSignupPage';
import ChampionshipsLivePage from './public/ChampionshipsLivePage';
import AccountPortalPage from './public/AccountPortalPage';
import PrivateChallengesPortalPage from './public/PrivateChallengesPortalPage';
import PowerLiftPortalPage from './public/PowerLiftPortalPage';
import DropsStorePage from './public/DropsStorePage';
import './RebuildApp.css';
import './admin/AdminOperational.css';
import './admin/FinanceOverviewPanel.css';
import './public/PublicCleanup.css';

const path = window.location.pathname.replace(/\/$/, '') || '/';
const isAthleteAuditAdminRoute = path === '/admin/audit/athlete' || path.startsWith('/admin/audit/athlete/');
const isAuditAdminRoute = path === '/admin/audit' || path.startsWith('/admin/audit/');
const isChampionshipOperationsAdminRoute = path === '/admin/championships/operations' || path.startsWith('/admin/championships/operations/');
const isChampionshipAdminRoute = path === '/admin/championships' || path.startsWith('/admin/championships/');
const isPowerLiftAdminRoute = path === '/admin/powerlift' || path.startsWith('/admin/powerlift/');
const isAdminRoute = path === '/admin' || path.startsWith('/admin/');
const isAccountRoute = path === '/conta' || path.startsWith('/conta/');
const isPrivateChallengesRoute = path === '/entre-amigos' || path.startsWith('/entre-amigos/');
const isPowerLiftRoute = path === '/power-lift' || path.startsWith('/power-lift/');
const isDropsRoute = path === '/drops' || path.startsWith('/drops/');
const isChampionshipsLiveRoute = path === '/campeonatos';
const championshipId = path === '/campeonatos/cardio'
  ? 'invictus_cardio_v1'
  : path === '/campeonatos/musculacao'
    ? 'invictus_strength_v1'
    : null;

function RebuildAppRouterBoundary() {
  useEffect(() => {
    const originalPushState = window.history.pushState.bind(window.history);
    const externalPublicRoutes = new Set(['/entre-amigos', '/power-lift', '/drops']);
    const patchedPushState: History['pushState'] = (data, unused, url) => {
      if (url !== undefined && url !== null) {
        const target = new URL(String(url), window.location.origin);
        const normalized = target.pathname.replace(/\/$/, '') || '/';
        if (externalPublicRoutes.has(normalized)) {
          window.location.assign(`${normalized}${target.search}${target.hash}`);
          return;
        }
      }
      originalPushState(data, unused, url);
    };
    window.history.pushState = patchedPushState;
    return () => { window.history.pushState = originalPushState; };
  }, []);
  return <RebuildApp />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAthleteAuditAdminRoute
      ? <AthleteAuditPage />
      : isAuditAdminRoute
        ? <AuditCenterPage />
        : isChampionshipOperationsAdminRoute
          ? <><ChampionshipOperationsPage /><ChampionshipAdminNav mode="operations" /></>
          : isChampionshipAdminRoute
            ? <><ChampionshipAdminPage /><ChampionshipAdminNav mode="config" /></>
            : isPowerLiftAdminRoute
              ? <PowerLiftReviewPage />
              : isAdminRoute
                ? <AdminShell />
                : isAccountRoute
                  ? <AccountPortalPage />
                  : isPrivateChallengesRoute
                    ? <PrivateChallengesPortalPage />
                    : isPowerLiftRoute
                      ? <PowerLiftPortalPage />
                      : isDropsRoute
                        ? <DropsStorePage />
                        : isChampionshipsLiveRoute
                          ? <ChampionshipsLivePage />
                          : championshipId
                            ? <ChampionshipSignupPage championshipId={championshipId} />
                            : <RebuildAppRouterBoundary />}
  </StrictMode>,
);
