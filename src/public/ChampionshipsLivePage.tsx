import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Dumbbell, Footprints, RefreshCw, ShieldCheck, Trophy, Users } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { getChampionships, type Championship } from '../lib/championshipApi';
import { subscribeAdminRealtime } from '../lib/adminRealtime';
import './PublicPortal.css';

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const period = (start?: string, end?: string) => {
  if (!start || !end) return 'Calendário em publicação';
  const a = new Date(start); const b = new Date(end);
  if (!Number.isFinite(a.getTime()) || !Number.isFinite(b.getTime())) return 'Calendário em publicação';
  return `${a.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })} — ${b.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })}`;
};

export default function ChampionshipsLivePage() {
  const [items, setItems] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signedIn, setSignedIn] = useState(Boolean(auth.currentUser));
  const lastRevision = useRef<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setItems(await getChampionships()); }
    catch (err: any) { setError(err?.message || 'Não foi possível carregar os campeonatos oficiais.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => onAuthStateChanged(auth, current => setSignedIn(Boolean(current))), []);
  useEffect(() => {
    if (!signedIn) return;
    return subscribeAdminRealtime(state => {
      if (lastRevision.current === null) { lastRevision.current = state.revision; return; }
      if (state.revision === lastRevision.current) return;
      lastRevision.current = state.revision;
      if (state.lastEventType.startsWith('CHAMPIONSHIP_') || state.lastEventType === 'SYSTEM_CHANGED') void load();
    });
  }, [signedIn, load]);

  return <main className="pub-page live-champs">
    <header className="pub-header"><a href="/"><ArrowLeft size={17}/> Início</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>
    <section className="pub-hero live-champs-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(3,3,3,.96),rgba(3,3,3,.24)),url(/assets/invictus/championships-hero.webp)'}}><div><p>SUPERAÇÃO TEM COMPANHIA.</p><h1>CAMPEONATOS INVICTUS</h1><p className="pub-desc">Catálogo oficial conectado ao mesmo backend do aplicativo. Abertura de inscrições, calendário, preço e edição vêm da fonte canônica do Invictus.</p></div></section>
    <div className="live-champs-shell">
      <div className="live-champs-head"><div><p className="pub-eyebrow">CAMPEONATOS OFICIAIS</p><h2>ESCOLHA SEU PRÓXIMO DESAFIO</h2></div><button onClick={()=>void load()} disabled={loading}><RefreshCw className={loading?'spin':''} size={15}/> Atualizar</button></div>
      {error&&<div className="pub-alert error">{error}</div>}
      {loading&&!items.length?<div className="pub-loading"><RefreshCw className="spin" size={18}/> Sincronizando catálogo oficial...</div>:<div className="live-champs-grid">{items.map(champ => {
        const cardio=champ.type==='run_elite_corrida';
        const href=cardio?'/campeonatos/cardio':'/campeonatos/musculacao';
        const hero=cardio?'cardio-hero.webp':'powerlift-hero.webp';
        return <a className="live-champ-card" href={href} key={`${champ.id}-${champ.editionId}`}><div className="live-champ-img" style={{backgroundImage:`linear-gradient(0deg,rgba(4,4,4,.92),rgba(4,4,4,.08)),url(/assets/invictus/${hero})`}}><span className={champ.registrationOpen?'open':'closed'}>{champ.registrationOpen?'INSCRIÇÕES ABERTAS':'INDISPONÍVEL'}</span>{cardio?<Footprints/>:<Dumbbell/>}</div><div className="live-champ-body"><small>{champ.categoryLabel} · {champ.edition}</small><h3>{champ.title}</h3><p>{champ.subtitle || champ.description}</p><div className="live-champ-meta"><span><CalendarDays/> {period(champ.startAt,champ.endAt)}</span><span><Trophy/> {money(champ.registrationPrice)}</span></div>{!champ.registrationOpen&&<em>{champ.registrationReadinessReason || 'Inscrições ainda não abertas.'}</em>}<b>Ver detalhes <ArrowRight size={14}/></b></div></a>})}</div>}
      <section className="pub-card live-ecosystem"><p className="pub-eyebrow">OUTRAS FORMAS DE COMPETIR</p><h2>O ecossistema continua conectado</h2><div><a href="/entre-amigos"><Users/><b>Entre Amigos · PRO</b><span>Desafios privados com IGA e prêmio opcional em Invictus Coins.</span></a><a href="/power-lift"><Dumbbell/><b>Power Lift · PRO</b><span>Benefício PRO com progressão sazonal, marcas auditadas e rankings Elite/Geral.</span></a><a href="/conta"><ShieldCheck/><b>Minha Conta</b><span>Acompanhe inscrições confirmadas no site e no app.</span></a></div></section>
    </div>
  </main>;
}