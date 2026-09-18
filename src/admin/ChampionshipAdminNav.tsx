import { Settings2, Activity } from 'lucide-react';
import './ChampionshipAdminNav.css';

export default function ChampionshipAdminNav({ mode }: { mode: 'config' | 'operations' }) {
  return <nav className="champ-admin-mode-nav" aria-label="Áreas de campeonatos">
    <a className={mode === 'config' ? 'active' : ''} href="/admin/championships"><Settings2 size={14}/><span>Configuração</span></a>
    <a className={mode === 'operations' ? 'active' : ''} href="/admin/championships/operations"><Activity size={14}/><span>Operação</span></a>
  </nav>;
}
