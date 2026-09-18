import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Cpu,
  Fingerprint,
  Gauge,
  HeartPulse,
  Network,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { secureAppRequest } from '../lib/secureAppApi';
import './AdminPanel.css';
import './AuditCenterPage.css';

type EngineCatalog = {
  security?: {
    engineVersion?: string;
    pipelineVersion?: string;
    ruleVersion?: string;
    order?: string[];
    engines?: Record<string, { version?: string; purpose?: string }>;
    thresholds?: Record<string, any>;
    authoritativeCollections?: string[];
  };
  iga?: {
    formulaVersion?: string;
    formula?: string;
    rules?: Record<string, string>;
    frequencyConfig?: Record<string, any>;
    timeConfig?: Record<string, any>;
    intensityConfig?: Record<string, any>;
    persistedFields?: string[];
  };
  scoring?: Record<string, Record<string, any>>;
  evidence?: Record<string, string>;
};

type SecurityReportRow = {
  id: string;
  activityId: string;
  userId: string;
  activityType?: string;
  decision?: string;
  riskScore?: number;
  riskLevel?: string;
  integrityScore?: number;
  behaviorScore?: number;
  trustScore?: number;
  reputationScore?: number;
  evidenceCount?: number;
  primaryRiskDriver?: string;
  timestamp?: string;
  securityVersion?: string;
  pipelineVersion?: string;
  rulesVersion?: string;
};

type IgaDrift = {
  persisted?: number;
  expected?: number;
  difference?: number;
  matches?: boolean;
};

type AuditPayload = Record<string, any>;
type View = 'reports' | 'engines' | 'activity';

const DECISIONS = ['', 'APPROVED', 'PARTIALLY_APPROVED', 'UNDER_REVIEW', 'BLOCKED'];
const score = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 });

function Status({ value }: { value: unknown }) {
  const normalized = String(value || 'UNKNOWN').toUpperCase();
  const className = normalized === 'APPROVED' || normalized === 'VALIDATED'
    ? 'approved'
    : normalized === 'BLOCKED' || normalized === 'REJECTED' || normalized === 'INVALID'
      ? 'rejected'
      : 'under_review';
  return <span className={`adm-status ${className}`}>{normalized}</span>;
}

function Metric({ label, value, attention = false }: { label: string; value: string; attention?: boolean }) {
  return <article className={`adm-metric ${attention ? 'attention' : ''}`}><small>{label}</small><strong>{value}</strong></article>;
}

function IgaComparison({ label, drift }: { label: string; drift?: IgaDrift | null }) {
  const hasPreview = Boolean(drift);
  const matches = drift?.matches === true;
  const difference = Number(drift?.difference || 0);
  const differenceLabel = hasPreview ? `${difference > 0 ? '+' : ''}${score(difference)}` : '—';
  return <article className={`audit-iga-comparison ${!hasPreview ? 'unknown' : matches ? 'synced' : 'drift'}`}>
    <div className="audit-iga-comparison-head"><div><small>JANELA</small><h3>{label}</h3></div><span>{!hasPreview ? 'SEM PREVIEW' : matches ? 'SINCRONIZADO' : 'DIVERGENTE'}</span></div>
    <dl><div><dt>Persistido</dt><dd>{hasPreview ? score(drift?.persisted) : '—'}</dd></div><div><dt>Esperado</dt><dd>{hasPreview ? score(drift?.expected) : '—'}</dd></div><div><dt>Diferença</dt><dd>{differenceLabel}</dd></div></dl>
  </article>;
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  if (value === undefined || value === null) return null;
  return <details className="audit-json-block"><summary>{title}</summary><pre>{JSON.stringify(value, null, 2)}</pre></details>;
}

export default function AuditCenterPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>('reports');
  const [catalog, setCatalog] = useState<EngineCatalog | null>(null);
  const [reports, setReports] = useState<SecurityReportRow[]>([]);
  const [decision, setDecision] = useState('');
  const [activityId, setActivityId] = useState('');
  const [audit, setAudit] = useState<AuditPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  const loadCatalog = useCallback(async () => {
    const response = await secureAppRequest<EngineCatalog>('/api/admin-audit', { query: { action: 'engine-catalog' } });
    setCatalog(response);
  }, []);

  const loadReports = useCallback(async () => {
    const response = await secureAppRequest<{ reports?: SecurityReportRow[] }>('/api/admin-audit', {
      query: { action: 'security-reports', limit: 150, decision: decision || undefined },
    });
    setReports(response.reports || []);
  }, [decision]);

  const refresh = useCallback(async () => {
    setBusy(true); setMessage(null);
    try {
      await Promise.all([loadCatalog(), loadReports()]);
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Falha ao carregar a auditoria.' });
    } finally { setBusy(false); }
  }, [loadCatalog, loadReports]);

  useEffect(() => { if (user) void refresh(); }, [user, refresh]);

  const openActivity = async (id?: string) => {
    const target = String(id || activityId).trim();
    if (!target) return;
    setBusy(true); setMessage(null);
    try {
      const response = await secureAppRequest<{ audit: AuditPayload }>('/api/admin-audit', {
        query: { action: 'activity', activityId: target },
      });
      setAudit(response.audit);
      setActivityId(target);
      setView('activity');
    } catch (error: any) {
      setAudit(null);
      setMessage({ type: 'error', text: error?.message || 'Atividade não encontrada na auditoria.' });
    } finally { setBusy(false); }
  };

  const reconcileIga = async () => {
    const userId = String(audit?.workout?.userId || audit?.securityReport?.userId || '').trim();
    if (!userId) return;
    if (!window.confirm('Recalcular agora o IGA semanal, mensal e da temporada deste atleta usando exclusivamente a fonte canônica? A operação ficará registrada no log administrativo.')) return;
    setBusy(true); setMessage(null);
    try {
      const response = await secureAppRequest<any>('/api/admin-audit', {
        method: 'POST',
        query: { action: 'reconcile-iga' },
        body: { userId },
      });
      const successText = `IGA reconciliado: semana ${score(response.after?.weeklyScore)}, mês ${score(response.after?.monthlyScore)}, temporada ${score(response.after?.seasonScore)}.`;
      await openActivity(audit?.activityId);
      setMessage({ type: 'success', text: successText });
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Não foi possível reconciliar o IGA.' });
    } finally { setBusy(false); }
  };

  const blocked = useMemo(() => reports.filter(item => String(item.decision).toUpperCase() === 'BLOCKED').length, [reports]);
  const review = useMemo(() => reports.filter(item => ['UNDER_REVIEW', 'PARTIALLY_APPROVED'].includes(String(item.decision).toUpperCase())).length, [reports]);
  const averageRisk = useMemo(() => reports.length ? reports.reduce((sum, item) => sum + Number(item.riskScore || 0), 0) / reports.length : 0, [reports]);

  if (!ready) return <div className="adm-loading">Carregando central de auditoria...</div>;
  if (!user) {
    window.location.replace('/admin');
    return <div className="adm-loading">Redirecionando para o login administrativo...</div>;
  }

  const security = catalog?.security;
  const iga = catalog?.iga;
  const securityReport = audit?.securityReport || {};
  const workout = audit?.workout || {};
  const weekly = audit?.iga?.weeklyAudit || {};
  const igaAudit = audit?.iga || {};
  const igaDrift = igaAudit?.drift || {};

  return <main className="audit-page">
    <header className="audit-topbar">
      <div><p className="adm-kicker">INVICTUS CONTROL CENTER</p><h1>Antifraude e Pontuação</h1><p>Auditoria integral dos motores de segurança, evidências competitivas, IGA e demais motores de pontuação.</p></div>
      <div className="adm-actions"><button onClick={() => window.location.assign('/admin')}><ArrowLeft size={14}/>Painel</button><button className="gold" disabled={busy} onClick={() => void refresh()}><RefreshCw size={14}/>{busy ? 'Atualizando...' : 'Atualizar'}</button></div>
    </header>

    {message && <div className={`adm-feedback ${message.type}`}><span>{message.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>} {message.text}</span><button onClick={() => setMessage(null)}><XCircle size={15}/></button></div>}

    <nav className="audit-tabs">
      <button className={view === 'reports' ? 'active' : ''} onClick={() => setView('reports')}><ShieldAlert size={15}/>Eventos</button>
      <button className={view === 'engines' ? 'active' : ''} onClick={() => setView('engines')}><Cpu size={15}/>Motores e regras</button>
      <button className={view === 'activity' ? 'active' : ''} onClick={() => setView('activity')}><Search size={15}/>Auditar atividade</button>
    </nav>

    {view === 'reports' && <>
      <div className="adm-metrics audit-metrics"><Metric label="Relatórios carregados" value={String(reports.length)}/><Metric label="Bloqueados" value={String(blocked)} attention={blocked > 0}/><Metric label="Em revisão / parcial" value={String(review)} attention={review > 0}/><Metric label="Risco médio" value={score(averageRisk)}/></div>
      <section className="adm-card">
        <div className="adm-toolbar adm-toolbar-spread"><div><small className="adm-kicker">SECURITY REPORTS</small><h2>Decisões recentes do pipeline</h2></div><select value={decision} onChange={event => setDecision(event.target.value)}>{DECISIONS.map(value => <option key={value} value={value}>{value || 'Todas as decisões'}</option>)}</select></div>
        <div className="adm-table-wrap"><table><thead><tr><th>Atividade</th><th>Atleta</th><th>Decisão</th><th>Risco</th><th>Integridade</th><th>Trust</th><th>Evidências</th><th>Motor</th><th></th></tr></thead><tbody>{reports.map(item => <tr key={item.id}><td><b>{item.activityType || 'Atividade'}</b><small>{item.activityId}</small></td><td>{item.userId || '—'}</td><td><Status value={item.decision}/></td><td><b>{score(item.riskScore)}</b><small>{item.riskLevel || '—'}</small></td><td>{score(item.integrityScore)}</td><td>{score(item.trustScore)}</td><td>{item.evidenceCount || 0}<small>{item.primaryRiskDriver || 'sem driver principal'}</small></td><td><small>Security {item.securityVersion || '—'}<br/>Pipeline {item.pipelineVersion || '—'}<br/>Rules {item.rulesVersion || '—'}</small></td><td><button className="adm-icon-btn" onClick={() => void openActivity(item.activityId)}><Search size={14}/></button></td></tr>)}</tbody></table></div>
        {!reports.length && <div className="adm-empty">Nenhum relatório de segurança encontrado neste filtro.</div>}
      </section>
    </>}

    {view === 'engines' && <>
      <section className="audit-engine-hero adm-card"><div><ShieldCheck/><p className="adm-kicker">PIPELINE CANÔNICO</p><h2>{security?.engineVersion || 'Security Engine'}</h2><p>Pipeline {security?.pipelineVersion || '—'} · Regras {security?.ruleVersion || '—'}</p></div><div className="audit-pipeline">{(security?.order || []).map((name, index) => <span key={name}><b>{String(index + 1).padStart(2, '0')}</b>{name}</span>)}</div></section>
      <section className="adm-card"><div className="adm-card-title"><div><small>ANTIFRAUDE</small><h2>O que cada camada analisa</h2></div><Cpu/></div><div className="audit-engine-grid">{Object.entries(security?.engines || {}).map(([key, engine]) => <article key={key}><div className="audit-engine-icon">{key === 'deviceFingerprint' ? <Fingerprint/> : key === 'network' ? <Network/> : key === 'risk' ? <Gauge/> : <ShieldCheck/>}</div><small>{key}</small><h3>v{engine.version || '—'}</h3><p>{engine.purpose || 'Sem descrição.'}</p></article>)}</div></section>
      <section className="adm-card"><div className="adm-card-title"><div><small>IGA</small><h2>{iga?.formulaVersion || 'IGA'}</h2></div><BarChart3/></div><div className="audit-formula">{iga?.formula || '—'}</div><div className="audit-rule-list">{Object.entries(iga?.rules || {}).map(([key, value]) => <p key={key}><b>{key}</b><span>{value}</span></p>)}</div></section>
      <section className="adm-card"><div className="adm-card-title"><div><small>OUTROS MOTORES DE PONTUAÇÃO</small><h2>Como cada ranking é formado</h2></div><Gauge/></div><div className="audit-scoring-grid">{Object.entries(catalog?.scoring || {}).map(([name, engine]) => <article key={name}><small>{name}</small><h3>{String(engine.engine || engine.source || 'Motor Invictus')}</h3>{Object.entries(engine).filter(([key]) => !['engine','source'].includes(key)).map(([key, value]) => <p key={key}><b>{key}</b><span>{Array.isArray(value) ? value.join(' → ') : String(value)}</span></p>)}</article>)}</div></section>
      <div className="adm-two-col"><section className="adm-card"><h3>Configuração antifraude ativa</h3><pre className="adm-json">{JSON.stringify(security?.thresholds || {}, null, 2)}</pre></section><section className="adm-card"><h3>Configuração IGA ativa</h3><pre className="adm-json">{JSON.stringify({ frequency: iga?.frequencyConfig, time: iga?.timeConfig, intensity: iga?.intensityConfig }, null, 2)}</pre></section></div>
      <section className="adm-card"><div className="adm-card-title"><div><small>FONTES DE VERDADE</small><h2>Onde auditar cada etapa</h2></div><ShieldCheck/></div><div className="audit-evidence-map">{Object.entries(catalog?.evidence || {}).map(([key, value]) => <p key={key}><b>{key}</b><code>{value}</code></p>)}</div></section>
    </>}

    {view === 'activity' && <>
      <section className="adm-card audit-search-card"><div><small className="adm-kicker">AUDITORIA FORENSE</small><h2>Atividade específica</h2><p>Informe o ID da atividade para cruzar treino, SecurityPipeline, evidências competitivas, campeonato, revisão humana, IGA e ledger de recompensa.</p></div><div className="adm-inline"><input value={activityId} onChange={event => setActivityId(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') void openActivity(); }} placeholder="activity_..., workout ID..."/><button className="adm-primary" disabled={busy || !activityId.trim()} onClick={() => void openActivity()}><Search size={14}/>Auditar</button></div></section>
      {audit && <>
        <div className="adm-metrics audit-metrics"><Metric label="Decisão antifraude" value={String(securityReport.decision || workout.securityDecision || '—')}/><Metric label="Risk Score" value={score(securityReport.risk?.riskScore ?? workout.securityRiskScore)}/><Metric label="IGA semanal persistido" value={score(igaAudit?.persistedScores?.weeklyScore)}/><Metric label="Sincronia IGA" value={igaAudit?.inSync === true ? 'OK' : igaAudit?.inSync === false ? 'DIVERGENTE' : 'SEM PREVIEW'} attention={igaAudit?.inSync === false}/></div>
        <section className={`adm-card audit-iga-card ${igaAudit?.inSync === false ? 'has-drift' : ''}`}>
          <div className="adm-card-title"><div><small>CONTRATO CANÔNICO DO RANKING</small><h2>IGA persistido × esperado × diferença</h2><p className="audit-iga-intro">O esperado é calculado em dry-run pela mesma fonte canônica usada para o ranking. A diferença mostra exatamente se o valor salvo no usuário está coerente com o que deveria estar persistido agora.</p></div><span className={`audit-sync-pill ${igaAudit?.inSync === true ? 'synced' : igaAudit?.inSync === false ? 'drift' : 'unknown'}`}>{igaAudit?.inSync === true ? 'SINCRONIZADO' : igaAudit?.inSync === false ? 'DIVERGÊNCIA DETECTADA' : 'PREVIEW INDISPONÍVEL'}</span></div>
          <div className="audit-iga-grid"><IgaComparison label="Semana" drift={igaDrift?.weekly}/><IgaComparison label="Mês" drift={igaDrift?.monthly}/><IgaComparison label="Temporada" drift={igaDrift?.season}/></div>
          {igaAudit?.dryRunError && <div className="audit-iga-warning"><AlertTriangle size={16}/><span>Não foi possível concluir o dry-run do IGA: {String(igaAudit.dryRunError)}</span></div>}
          <div className="audit-iga-footer"><div><small>SESSÃO AUDITADA</small><b>{igaAudit?.activityIncludedInCurrentWeeklyAudit ? 'Incluída no IGA semanal atual' : 'Não incluída no IGA semanal atual'}</b></div><button className="gold" disabled={busy || !(workout.userId || securityReport.userId)} onClick={() => void reconcileIga()}><RefreshCw size={14}/>Reconciliar IGA canônico</button></div>
        </section>
        <section className="adm-card"><div className="adm-card-title"><div><small>RESUMO</small><h2>{audit.activityId}</h2></div><Status value={securityReport.decision || workout.competitionReviewStatus || workout.validationStatus}/></div><div className="audit-summary-grid"><article><Activity/><small>Tipo</small><b>{workout.cardioType || workout.type || securityReport.activityType || '—'}</b></article><article><UserRound/><small>Atleta</small><b>{workout.userId || securityReport.userId || '—'}</b></article><article><ShieldCheck/><small>Integridade</small><b>{score(securityReport.integrity?.integrityScore)}</b></article><article><Gauge/><small>Risco</small><b>{score(securityReport.risk?.riskScore)}</b></article><article><HeartPulse/><small>FC média</small><b>{score(securityReport.heartRate?.avgHeartRate || weekly.avgHeartRate)} bpm</b></article><article><BarChart3/><small>IGA</small><b>{score(weekly.igaRanking)} pts</b></article></div></section>
        <div className="audit-engine-detail-grid"><JsonBlock title="1 · Validation" value={securityReport.validation}/><JsonBlock title="2 · Integrity" value={securityReport.integrity}/><JsonBlock title="3 · Behavior" value={securityReport.behavior}/><JsonBlock title="4 · Device Fingerprint" value={securityReport.deviceFingerprint}/><JsonBlock title="5 · Network" value={securityReport.network}/><JsonBlock title="6 · Fraud" value={securityReport.fraud}/><JsonBlock title="7 · Reputation" value={securityReport.reputation}/><JsonBlock title="8 · Trust" value={securityReport.trust}/><JsonBlock title="9 · Risk" value={securityReport.risk}/><JsonBlock title="10 · Explainability" value={securityReport.explanation}/></div>
        <section className="adm-card"><div className="adm-card-title"><div><small>PONTUAÇÃO</small><h2>Auditoria do IGA e competição</h2></div><BarChart3/></div><JsonBlock title="IGA esperado em dry-run" value={audit.iga?.expectedAudit}/><JsonBlock title="IGA semanal persistido" value={audit.iga?.weeklyAudit}/><JsonBlock title="IGA mensal persistido" value={audit.iga?.monthlyAudit}/><JsonBlock title="IGA da temporada persistido" value={audit.iga?.seasonAudit}/><JsonBlock title="Auditoria desta sessão no IGA" value={audit.iga?.sessionAudit}/><JsonBlock title="Entradas competitivas" value={audit.competition?.entries}/><JsonBlock title="Pontuações de campeonatos" value={audit.competition?.championshipScores}/><JsonBlock title="Ledger de XP/recompensa da atividade" value={audit.economy?.activityRewardLedger}/></section>
        <section className="adm-card"><div className="adm-card-title"><div><small>EVIDÊNCIA BRUTA DE AUDITORIA</small><h2>Rastreabilidade completa</h2></div><ShieldAlert/></div><JsonBlock title="Workout canônico" value={audit.workout}/><JsonBlock title="Security report completo" value={audit.securityReport}/><JsonBlock title="Audit log imutável" value={audit.securityAudit}/><JsonBlock title="Trust profile" value={audit.trustProfile}/><JsonBlock title="Revisões administrativas" value={audit.adminReviews}/></section>
      </>}
    </>}
  </main>;
}
