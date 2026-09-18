import { ShieldCheck, Trophy } from 'lucide-react';
import AdminPanel from './AdminPanel';
import './AdminShell.css';

export default function AdminShell() {
  return <div className="admin-shell-wrap">
    <AdminPanel />
    <nav className="admin-advanced-shortcuts" aria-label="Centrais administrativas avançadas">
      <a href="/admin/audit" title="Abrir central antifraude e pontuação"><ShieldCheck size={15}/><span>Auditoria</span></a>
      <a href="/admin/championships" title="Administrar campeonatos oficiais"><Trophy size={15}/><span>Campeonatos</span></a>
    </nav>
  </div>;
}
