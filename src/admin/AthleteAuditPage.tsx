import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Gauge,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { subscribeAdminRealtime } from '../lib/adminRealtime';
import { secureAppRequest } from '../lib/secureAppApi';
import './AdminPanel.css';
import './AthleteAuditPage.css';

type Drift = { persisted?: number; expected?: number; difference?: number; matches?: boolean };
type AthleteAudit = Record<string, any> & {
  user?: Record<string, any>;
  summary?: Record<string, any>;
  iga?: { persisted?: Record<string, number>; expected?: Record<string, number> | null; drift?: { weekly?: Drift; monthly?: Drift; season?: Drift } | null; inSync?: boolean | null; dryRunError?: string | null };
  activities?: Array<Record<string, any>>;
  registrations?: Array<Record<string, any>>;
  adminReviews?: Array<Record<string, any>>;
};

const score = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 3 });
const dateText = (value: unknown) => {
  if (!value) return '—';
  const date = new Date(String(value));
  return Number.isFinite(date.getTime()) ? date.toLocaleString('pt-BR') : String(value);
};

function Metric({ label, value, attention = false }: { label: string; value: string; attention?: boolean }) {
  return <article className={`adm-metric ${attention ? 'attention' : ''}`}><small>{label}</small><strong>{value}</strong></article>;
}

function DriftCard({ label, drift }: { label: string; drift?: Drift | null }) {
  const available = Boolean(drift);
  const matches = drift?.matches === true;
  const difference = Number(drift?.difference || 0);
  return <article className={`athlete-drift-card ${!available ? 'unknown' : matches ? 'ok' : 'bad'}`}>
    <div><small>{label}</small><span>{!available ? 'SEM PREVIEW' : matches ? 'SINCRONIZADO' : 'DIVERGENTE'}</span></div>
    <dl><div><dt>Persistido</dt><dd>{available ? score(drift?.persisted) : '—'}</dd></div><div><dt>Esperado</dt><dd>{available ? score(drift?.expected) : '—'}</dd></div><div><dt>Diferença</dt><dd>{available ? `${difference > 0 ? '+' : ''}${score(difference)}` : '—'}</dd></div></dl>
  </article>;
}

export default function AthleteAuditPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [target, setTarget] = useState('');
  const [audit, setAudit] = useState<AthleteAudit | null>(null);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  const loadTarget = useCallback(async (searchTarget: string, quiet = false) => {
    const normalized = searchTarget.trim();
    if (!normalized) return;
    if (!quiet) setBusy(true);
    if (!quiet) setFeedback(null);
    try {
      const response = await secureAppRequest<{ audit: AthleteAudit }>('/api/admin-audit', { query: { action: 'athlete', target: normalized, limit: 75 } });
      setAudit(response.audit);
      if (!quiet && response.audit?.user?.uid) setTarget(String(response.audit.user.uid));
    } catch (error: any) {
      if (!quiet) setAudit(null);
      setFeedback({ type: 'error', text: error?.message || 'Não foi possível auditar este atleta.' });
    } finally { if (!quiet) setBusy(false); }
  }, []);

  const search = async (event?: FormEvent) => {
    event?.preventDefault();
    await loadTarget(target);
  };

  const activeUid = String(audit?.user?.uid || '');
  useEffect(() => {
    if (!user || !activeUid) return;
    let revision: number | null = null;
    setLive('connecting');
    return subscribeAdminRealtime(state => {
      setLive('live');
      if (revision === null) { revision = state.revision; return; }
      if (revision !== state.revision) {
        revision = state.revision;
        void loadTarget(activeUid, true);
      }
    }, () => setLive('offline'));
  }, [user, activeUid, loadTarget]);

  const activities = audit?.activities || [];
  const suspicious = useMemo(() => activities.filter(item => Number(item.riskScore || 0) >= 60 || ['BLOCKED', 'UNDER_REVIEW', 'PARTIALLY_APPROVED'].includes(String(item.decision || '').toUpperCase())), [activities]);

  if (!ready) return <div className="adm-loading">Carregando auditoria do atleta...</div>;
  if (!user) { window.location.replace('/admin'); return <div className="adm-loading">Redirecionando...</div>; }

  return <main className="athlete-audit-page">
    <header className="athlete-audit-top">
      <div><p className="adm-kicker">INVICTUS FORENSICS</p><h1>Auditoria por atleta</h1><p>Visão consolidada de confiança, antifraude, atividades, pontuação, campeonatos e revisões administrativas.</p></div>
      <div className="adm-actions">{audit && <span className={`athlete-live ${live}`}>{live === 'live' ? 'AO VIVO' : live === 'offline' ? 'SEM TEMPO REAL' : 'CONECTANDO'}</span>}<button onClick={() => window.location.assign('/admin/audit')}><ArrowLeft size={14}/>Auditoria geral</button></div>
    </header>

    {feedback && <div className={`adm-feedback ${feedback.type}`}><span>{feedback.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>} {feedback.text}</span><button onClick={() => setFeedback(null)}><XCircle size={15}/></button></div>}

    <section className="adm-card athlete-audit-search"><div><small className="adm-kicker">LOCALIZAR ATLETA</small><h2>UID, e-mail ou CPF</h2><p>A consulta cruza as fontes canônicas sem modificar nenhum dado.</p></div><form onSubmit={search}><input value={target} onChange={event => setTarget(event.target.value)} placeholder="UID, e-mail ou CPF"/><button className="adm-primary" disabled={busy || !target.trim()}><Search size={15}/>{busy ? 'Auditando...' : 'Auditar atleta'}</button></form></section>

    {audit && <>
      <section className="adm-card athlete-profile-card"><div className="athlete-profile-icon"><UserRound/></div><div><small>ATLETA</small><h2>{audit.user?.displayName || 'Usuário Invictus'}</h2><p>{audit.user?.email || 'sem e-mail'} · UID {audit.user?.uid || '—'}</p><span>{String(audit.user?.subscriptionTier || 'OPEN').toUpperCase()} · {audit.user?.gymName || 'sem academia'}</span></div><div className={`athlete-sync-badge ${audit.iga?.inSync === false ? 'bad' : audit.iga?.inSync === true ? 'ok' : ''}`}>{audit.iga?.inSync === false ? <ShieldAlert/> : <ShieldCheck/>}<span>{audit.iga?.inSync === false ? 'IGA DIVERGENTE' : audit.iga?.inSync === true ? 'IGA SINCRONIZADO' : 'IGA SEM PREVIEW'}</span></div></section>

      <div className="adm-metrics athlete-audit-metrics"><Metric label="Atividades carregadas" value={String(activities.length)}/><Metric label="Suspeitas / revisão" value={String(suspicious.length)} attention={suspicious.length > 0}/><Metric label="Security reports" value={String(audit.summary?.securityReportsLoaded || 0)}/><Metric label="Revisões Admin" value={String(audit.summary?.adminReviews || 0)}/><Metric label="Inscrições" value={String(audit.summary?.registrations || 0)}/><Metric label="High risk" value={String(audit.summary?.highRiskActivities || 0)} attention={Number(audit.summary?.highRiskActivities || 0) > 0}/></div>

      <section className="adm-card"><div className="adm-card-title"><div><small>IGA DRY-RUN</small><h2>Persistido × esperado</h2></div><BarChart3/></div>{audit.iga?.dryRunError && <div className="adm-feedback error"><span><AlertTriangle size={15}/> {audit.iga.dryRunError}</span></div>}<div className="athlete-drift-grid"><DriftCard label="Semanal" drift={audit.iga?.drift?.weekly}/><DriftCard label="Mensal" drift={audit.iga?.drift?.monthly}/><DriftCard label="Temporada" drift={audit.iga?.drift?.season}/></div></section>

      <section className="adm-card"><div className="adm-card-title"><div><small>ATIVIDADES</small><h2>Risco e elegibilidade competitiva</h2></div><Gauge/></div><div className="adm-table-wrap"><table><thead><tr><th>Atividade</th><th>Data</th><th>Decisão</th><th>Risco</th><th>Integridade</th><th>Trust</th><th>Scoring</th><th>Evidências</th></tr></thead><tbody>{activities.map(item => <tr key={item.id}><td><b>{item.type || 'Atividade'}</b><small>{item.id}</small></td><td>{dateText(item.endTime || item.startTime)}</td><td><span className={`adm-status ${String(item.decision || '').toLowerCase()}`}>{String(item.decision || item.competitionReviewStatus || '—').toUpperCase()}</span><small>{item.primaryRiskDriver || 'sem driver principal'}</small></td><td><b>{score(item.riskScore)}</b><small>{item.riskLevel || '—'}</small></td><td>{score(item.integrityScore)}</td><td>{score(item.trustScore)}</td><td>{item.isScoringEligible === true ? 'ELEGÍVEL' : item.isScoringEligible === false ? 'NÃO' : '—'}<small>{item.score == null ? '' : `${score(item.score)} pts`}</small></td><td>{item.evidenceCount || 0}</td></tr>)}</tbody></table></div>{!activities.length && <div className="adm-empty">Nenhuma atividade encontrada para este atleta.</div>}</section>

      <div className="athlete-audit-two-col"><section className="adm-card"><div className="adm-card-title"><div><small>TRUST PROFILE</small><h2>Confiança acumulada</h2></div><ShieldCheck/></div><pre className="athlete-json">{JSON.stringify(audit.trustProfile || {}, null, 2)}</pre></section><section className="adm-card"><div className="adm-card-title"><div><small>DECISÕES</small><h2>Distribuição recente</h2></div><ShieldAlert/></div><pre className="athlete-json">{JSON.stringify(audit.summary?.decisions || {}, null, 2)}</pre></section></div>

      <section className="adm-card"><div className="adm-card-title"><div><small>TRILHA ADMINISTRATIVA</small><h2>Revisões e reconciliações</h2></div><ShieldAlert/></div><div className="athlete-review-list">{(audit.adminReviews || []).map((review: any, index: number) => <article key={review.id || index}><div><b>{review.type || review.status || 'REVISÃO'}</b><small>{dateText(review.createdAt)}</small></div><p>{review.reason || review.resolution || 'Sem observação textual.'}</p><code>{review.reviewerId || 'sistema'}</code></article>)}</div>{!(audit.adminReviews || []).length && <div className="adm-empty">Nenhuma revisão administrativa registrada para este atleta.</div>}</section>
    </>}
  </main>;
}
