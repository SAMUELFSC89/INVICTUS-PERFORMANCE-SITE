import { useEffect } from 'react';
import { ShieldCheck, Trophy, UserRoundSearch } from 'lucide-react';
import AdminPanel from './AdminPanel';
import './AdminShell.css';

export default function AdminShell() {
  useEffect(() => {
    const redirectLegacyChampionshipTab = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('button') : null;
      if (!target || target.textContent?.trim() !== 'Campeonatos') return;
      if (!target.closest('.admin-shell-wrap')) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign('/admin/championships');
    };
    document.addEventListener('click', redirectLegacyChampionshipTab, true);
    return () => document.removeEventListener('click', redirectLegacyChampionshipTab, true);
  }, []);

  return <div className="admin-shell-wrap">
    <AdminPanel />
    <nav className="admin-advanced-shortcuts" aria-label="Centrais administrativas avançadas">
      <a href="/admin/audit" title="Abrir central antifraude e pontuação"><ShieldCheck size={15}/><span>Auditoria</span></a>
      <a href="/admin/audit/athlete" title="Auditar um atleta por UID, e-mail ou CPF"><UserRoundSearch size={15}/><span>Atleta</span></a>
      <a href="/admin/championships" title="Administrar campeonatos oficiais"><Trophy size={15}/><span>Campeonatos</span></a>
    </nav>
  </div>;
}
