import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { subscribeAdminRealtime } from '../lib/adminRealtime';
import { secureAppRequest } from '../lib/secureAppApi';
import './AdminPanel.css';
import './ChampionshipOperationsPage.css';

type Registration = {
  id: string;
  userId: string;
  userName?: string;
  status?: string;
  paymentStatus?: string;
  amount?: number;
  paymentMethod?: string | null;
  createdAt?: string | null;
  paidAt?: string | null;
  reconciliationRequired?: boolean;
};

type LeaderboardEntry = {
  rank?: number;
  userId?: string;
  userName?: string;
  score?: number;
  validActivities?: number;
  totalTimeMinutes?: number;
  finalScoreReachedAt?: string;
  prizeWon?: number;
};

type ChampionshipState = {
  runtime: Record<string, any>;
  settlement?: Record<string, any> | null;
  registrations?: { total?: number; paid?: number; pending?: number; reconciliation?: number };
};

type ChampionshipSummary = {
  total?: number;
  paid?: number;
  pending?: number;
  reconciliation?: number;
  cancelled?: number;
  refunded?: number;
  confirmedRevenue?: number;
};

type StatePayload = { championships?: ChampionshipState[] };

const IDS = [
  { id: 'invictus_cardio_v1', label: 'Cardio' },
  { id: 'invictus_strength_v1', label: 'Musculação' },
];

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dateText = (value: unknown) => {
  if (!value) return '—';
  const parsed = new Date(String(value));
  return Number.isFinite(parsed.getTime()) ? parsed.toLocaleString('pt-BR') : String(value);
};

export default function ChampionshipOperationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [championshipId, setChampionshipId] = useState(IDS[0].id);
  const [state, setState] = useState<StatePayload | null>(null);
  const [summary, setSummary] = useState<ChampionshipSummary | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setBusy(true);
    setFeedback(current => quiet ? current : null);
    try {
      const [stateResponse, summaryResponse, registrationResponse, leaderboardResponse] = await Promise.all([
        secureAppRequest<StatePayload>('/api/admin-championships', { query: { action: 'state' } }),
        secureAppRequest<ChampionshipSummary>('/api/admin-championships', { query: { action: 'summary', championshipId } }),
        secureAppRequest<any>('/api/admin-championships', { query: { action: 'registrations', championshipId, limit: 250 } }),
        secureAppRequest<any>('/api/admin-championships', { query: { action: 'leaderboard', championshipId, limit: 100 } }),
      ]);
      setState(stateResponse);
      setSummary(summaryResponse);
      setRegistrations(Array.isArray(registrationResponse?.registrations) ? registrationResponse.registrations : []);
      setLeaderboard(Array.isArray(leaderboardResponse?.leaderboard) ? leaderboardResponse.leaderboard : []);
    } catch (error: any) {
      setFeedback({ type: 'error', text: error?.message || 'Não foi possível carregar a operação do campeonato.' });
    } finally {
      if (!quiet) setBusy(false);
    }
  }, [championshipId]);

  useEffect(() => { if (user) void load(); }, [user, load]);
  useEffect(() => {
    if (!user) return;
    let revision: number | null = null;
    setLive('connecting');
    return subscribeAdminRealtime(state => {
      setLive('live');
      if (revision === null) { revision = state.revision; return; }
      if (revision !== state.revision) {
        revision = state.revision;
        void load(true);
      }
    }, () => setLive('offline'));
  }, [user, load]);

  const selected = useMemo(() => state?.championships?.find(item => item.runtime?.id === championshipId) || null, [state, championshipId]);
  const paid = Number(summary?.paid ?? selected?.registrations?.paid ?? 0);
  const pending = Number(summary?.pending ?? selected?.registrations?.pending ?? 0);
  const reconciliation = Number(summary?.reconciliation ?? selected?.registrations?.reconciliation ?? 0);
  const revenue = Number(summary?.confirmedRevenue || 0);
  const totalRegistrations = Number(summary?.total ?? selected?.registrations?.total ?? registrations.length);

  const homologate = async () => {
    const runtime = selected?.runtime;
    if (!runtime) return;
    const text = [
      'HOMOLOGAR ESTA EDIÇÃO AGORA?',
      '',
      `${runtime.title || championshipId} · ${runtime.edition || ''}`,
      `Edition ID: ${runtime.editionId || '—'}`,
      `Data prevista: ${dateText(runtime.settlementAt)}`,
      '',
      'O backend vai validar pagamentos, revisões competitivas, ranking congelado, elegibilidade e premiação antes de finalizar.',
    ].join('\n');
    if (!window.confirm(text)) return;
    setBusy(true); setFeedback(null);
    try {
      const result = await secureAppRequest<any>('/api/admin-championships', {
        method: 'POST', query: { action: 'homologate' }, body: { championshipId },
      });
      const status = String(result?.settlement?.status || 'processado');
      setFeedback({ type: 'success', text: `Homologação executada com segurança. Estado: ${status}.` });
      await load(true);
    } catch (error: any) {
      setFeedback({ type: 'error', text: error?.message || 'A homologação foi bloqueada pelo backend.' });
    } finally { setBusy(false); }
  };

  if (!ready) return <div className="adm-loading">Carregando operação dos campeonatos...</div>;
  if (!user) { window.location.replace('/admin'); return <div className="adm-loading">Redirecionando...</div>; }

  return <main className="champ-ops-page">
    <header className="champ-ops-top">
      <div><p className="adm-kicker">INVICTUS BACKOFFICE</p><h1>Operação dos campeonatos</h1><p>Inscrições, conciliação, ranking, vencedores e homologação da edição publicada.</p></div>
      <div className="adm-actions"><span className={`champ-ops-live ${live}`}>{live === 'live' ? 'AO VIVO' : live === 'offline' ? 'SEM TEMPO REAL' : 'CONECTANDO'}</span><button onClick={() => window.location.assign('/admin/championships')}><ArrowLeft size={14}/>Configuração</button><button className="gold" disabled={busy} onClick={() => void load()}><RefreshCw size={14}/>Atualizar</button></div>
    </header>

    {feedback && <div className={`adm-feedback ${feedback.type}`}><span>{feedback.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>} {feedback.text}</span><button onClick={() => setFeedback(null)}><XCircle size={15}/></button></div>}

    <section className="champ-ops-selector adm-card">
      <div><small>MODALIDADE</small><h2>{selected?.runtime?.title || 'Campeonato oficial'}</h2><p>{selected?.runtime?.edition || 'Edição ativa'} · {selected?.runtime?.editionId || 'sem editionId'}</p></div>
      <select value={championshipId} onChange={event => setChampionshipId(event.target.value)}>{IDS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
    </section>

    <div className="adm-metrics champ-ops-metrics">
      <Metric label="Inscrições pagas" value={String(paid)}/>
      <Metric label="Pendentes" value={String(pending)} attention={pending > 0}/>
      <Metric label="Conciliação" value={String(reconciliation)} attention={reconciliation > 0}/>
      <Metric label="Receita confirmada" value={money(revenue)}/>
      <Metric label="Atletas no ranking" value={String(leaderboard.length)}/>
      <Metric label="Settlement" value={String(selected?.settlement?.status || 'NÃO INICIADO')}/>
    </div>

    <div className="champ-ops-two-col">
      <section className="adm-card">
        <div className="adm-card-title"><div><small>RANKING CANÔNICO</small><h2>Classificação da edição</h2></div><Trophy/></div>
        <div className="adm-table-wrap"><table><thead><tr><th>#</th><th>Atleta</th><th>Score</th><th>Atividades</th><th>Tempo</th></tr></thead><tbody>{leaderboard.map((item, index) => <tr key={`${item.userId || index}`}><td><b>{item.rank || index + 1}</b></td><td><b>{item.userName || 'Atleta Invictus'}</b><small>{item.userId || '—'}</small></td><td>{Number(item.score || 0).toLocaleString('pt-BR', { maximumFractionDigits: 3 })}</td><td>{item.validActivities || 0}</td><td>{Number(item.totalTimeMinutes || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} min</td></tr>)}</tbody></table></div>
        {!leaderboard.length && <div className="adm-empty">Ainda não há atletas classificados nesta edição.</div>}
      </section>

      <section className="adm-card champ-ops-settlement">
        <div className="adm-card-title"><div><small>HOMOLOGAÇÃO</small><h2>Encerramento e vencedores</h2></div><ShieldCheck/></div>
        <div className="champ-ops-settlement-info"><p><span>Fim da competição</span><b>{dateText(selected?.runtime?.endAt)}</b></p><p><span>Homologação prevista</span><b>{dateText(selected?.runtime?.settlementAt)}</b></p><p><span>Estado</span><b>{String(selected?.settlement?.status || 'Ainda não iniciado')}</b></p><p><span>Total pago em prêmio</span><b>{money(selected?.settlement?.totalPaid)}</b></p></div>
        {Array.isArray(selected?.settlement?.winnerAssignments) && selected!.settlement!.winnerAssignments.length > 0 && <div className="champ-ops-winners">{selected!.settlement!.winnerAssignments.map((winner: any) => <div key={`${winner.rank}-${winner.userId}`}><Trophy/><span><b>#{winner.rank} · {winner.userName || winner.userId}</b><small>{Number(winner.score || 0).toLocaleString('pt-BR', { maximumFractionDigits: 3 })} pts · {money(winner.amount)}</small></span></div>)}</div>}
        <button className="adm-primary champ-ops-homologate" disabled={busy || selected?.settlement?.status === 'FINALIZED'} onClick={() => void homologate()}><ShieldCheck size={15}/>{selected?.settlement?.status === 'FINALIZED' ? 'Edição homologada' : 'Executar homologação'}</button>
        <small className="champ-ops-note">A ação continua server-authoritative. Se houver pagamento em conciliação, atividade pendente, empate material ou outra inconsistência, o backend bloqueia a finalização.</small>
      </section>
    </div>

    <section className="adm-card">
      <div className="adm-card-title"><div><small>INSCRIÇÕES</small><h2>Participantes e pagamentos</h2><p className="champ-ops-table-note">Exibindo {registrations.length} de {totalRegistrations} inscrições. Os indicadores acima usam o total canônico completo da edição.</p></div><Users/></div>
      <div className="adm-table-wrap"><table><thead><tr><th>Atleta</th><th>Valor</th><th>Pagamento</th><th>Inscrição</th><th>Criada em</th><th>Pago em</th></tr></thead><tbody>{registrations.map(item => <tr key={item.id}><td><b>{item.userName || 'Atleta Invictus'}</b><small>{item.userId}</small></td><td>{money(item.amount)}</td><td><span className={`adm-status ${item.reconciliationRequired ? 'under_review' : ''}`}>{String(item.paymentStatus || '—').toUpperCase()}</span><small>{item.paymentMethod || '—'}</small></td><td>{String(item.status || '—').toUpperCase()}</td><td>{dateText(item.createdAt)}</td><td>{dateText(item.paidAt)}</td></tr>)}</tbody></table></div>
      {!registrations.length && <div className="adm-empty">Nenhuma inscrição encontrada na edição ativa.</div>}
    </section>
  </main>;
}

function Metric({ label, value, attention = false }: { label: string; value: string; attention?: boolean }) {
  return <article className={`adm-metric ${attention ? 'attention' : ''}`}><small>{label}</small><strong>{value}</strong></article>;
}
