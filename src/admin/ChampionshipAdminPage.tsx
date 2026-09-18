import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  FileCheck2,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { secureAppRequest } from '../lib/secureAppApi';
import './AdminPanel.css';
import './ChampionshipAdminPage.css';

type Prize = { rank: number; amount: number; label?: string };
type ChampionshipState = {
  runtime: Record<string, any>;
  draft?: Record<string, any> | null;
  lock?: Record<string, any> | null;
  settlement?: Record<string, any> | null;
  registrations?: { total?: number; paid?: number; pending?: number; reconciliation?: number };
};
type StatePayload = {
  championships?: ChampionshipState[];
  migration?: { phase?: string; liveRuntimeSource?: string; targetRuntimeSource?: string; publishEnabled?: boolean; reason?: string };
  generatedAt?: string;
};

type DraftForm = {
  championshipId: string;
  title: string;
  edition: string;
  description: string;
  startAt: string;
  endAt: string;
  settlementAt: string;
  registrationOpensAt: string;
  registrationClosesAt: string;
  registrationPrice: number;
  prizes: Prize[];
  allowedCardioTypes: string[];
  antiFraudProfile: {
    minDurationMinutes: number;
    maxDurationMinutes: number;
    requireGeofence: boolean;
    requireContinuousGPS: boolean;
    maxRiskScore: number;
  };
  registrationEnabled: boolean;
};

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const localDate = (value: unknown) => {
  if (!value) return '';
  const date = new Date(String(value));
  if (!Number.isFinite(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
const displayDate = (value: unknown) => value ? new Date(String(value)).toLocaleString('pt-BR') : 'Não publicado';

function emptyDraft(runtime: Record<string, any>): DraftForm {
  const cardio = runtime.id === 'invictus_cardio_v1';
  return {
    championshipId: String(runtime.id || ''),
    title: String(runtime.title || ''),
    edition: '',
    description: String(runtime.description || ''),
    startAt: '', endAt: '', settlementAt: '', registrationOpensAt: '', registrationClosesAt: '',
    registrationPrice: Number(runtime.registrationPrice || 29.9),
    prizes: Array.isArray(runtime.prizeDistribution) && runtime.prizeDistribution.length
      ? runtime.prizeDistribution.map((item: any) => ({ rank: Number(item.rank), amount: Number(item.amount), label: item.label }))
      : [{ rank: 1, amount: 500, label: '1º lugar' }],
    allowedCardioTypes: cardio ? [...(runtime.antiFraudProfile?.allowedCardioTypes || ['running'])] : [],
    antiFraudProfile: {
      minDurationMinutes: Number(runtime.antiFraudProfile?.minDurationMinutes || (cardio ? 20 : 30)),
      maxDurationMinutes: Number(runtime.antiFraudProfile?.maxDurationMinutes || 90),
      requireGeofence: !cardio,
      requireContinuousGPS: cardio,
      maxRiskScore: Number(runtime.antiFraudProfile?.maxRiskScore || 35),
    },
    registrationEnabled: false,
  };
}

function fromSavedDraft(runtime: Record<string, any>, saved: Record<string, any>): DraftForm {
  const fallback = emptyDraft(runtime);
  return {
    ...fallback,
    ...saved,
    startAt: localDate(saved.startAt),
    endAt: localDate(saved.endAt),
    settlementAt: localDate(saved.settlementAt),
    registrationOpensAt: localDate(saved.registrationOpensAt),
    registrationClosesAt: localDate(saved.registrationClosesAt),
    registrationPrice: Number(saved.registrationPrice || fallback.registrationPrice),
    prizes: Array.isArray(saved.prizes) && saved.prizes.length ? saved.prizes.map((item: any) => ({ rank: Number(item.rank), amount: Number(item.amount), label: item.label })) : fallback.prizes,
    allowedCardioTypes: Array.isArray(saved.allowedCardioTypes) ? saved.allowedCardioTypes : fallback.allowedCardioTypes,
    antiFraudProfile: { ...fallback.antiFraudProfile, ...(saved.antiFraudProfile || {}) },
  };
}

export default function ChampionshipAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<StatePayload | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState<DraftForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  const load = useCallback(async () => {
    setBusy(true); setFeedback(null);
    try {
      const response = await secureAppRequest<StatePayload>('/api/admin-championships', { query: { action: 'state' } });
      setState(response);
      const first = selectedId || response.championships?.[0]?.runtime?.id || '';
      setSelectedId(first);
      const selected = response.championships?.find(item => item.runtime?.id === first) || response.championships?.[0];
      if (selected) setForm(selected.draft ? fromSavedDraft(selected.runtime, selected.draft) : emptyDraft(selected.runtime));
    } catch (error: any) {
      setFeedback({ type: 'error', text: error?.message || 'Não foi possível carregar a administração dos campeonatos.' });
    } finally { setBusy(false); }
  }, [selectedId]);

  useEffect(() => { if (user) void load(); }, [user]);

  const choose = (item: ChampionshipState) => {
    setSelectedId(String(item.runtime.id));
    setForm(item.draft ? fromSavedDraft(item.runtime, item.draft) : emptyDraft(item.runtime));
    setFeedback(null);
  };

  const selected = useMemo(() => state?.championships?.find(item => item.runtime?.id === selectedId) || null, [state, selectedId]);
  const prizePool = useMemo(() => (form?.prizes || []).reduce((sum, item) => sum + Number(item.amount || 0), 0), [form?.prizes]);

  const save = async () => {
    if (!form) return;
    setBusy(true); setFeedback(null);
    try {
      await secureAppRequest('/api/admin-championships', {
        method: 'POST', query: { action: 'save-draft' }, body: { draft: form as any },
      });
      setFeedback({ type: 'success', text: 'Rascunho validado e salvo no backoffice. Nenhuma edição live foi alterada.' });
      await load();
    } catch (error: any) {
      setFeedback({ type: 'error', text: error?.message || 'Não foi possível salvar o rascunho.' });
    } finally { setBusy(false); }
  };

  const discard = async () => {
    if (!form || !window.confirm('Descartar o rascunho desta modalidade? A edição atualmente publicada não será alterada.')) return;
    setBusy(true); setFeedback(null);
    try {
      await secureAppRequest('/api/admin-championships', { method: 'POST', query: { action: 'delete-draft' }, body: { championshipId: form.championshipId } });
      setFeedback({ type: 'success', text: 'Rascunho descartado.' });
      await load();
    } catch (error: any) { setFeedback({ type: 'error', text: error?.message || 'Falha ao descartar rascunho.' }); }
    finally { setBusy(false); }
  };

  const publish = async () => {
    setBusy(true); setFeedback(null);
    try {
      await secureAppRequest('/api/admin-championships', { method: 'POST', query: { action: 'publish' }, body: { championshipId: form?.championshipId } });
    } catch (error: any) {
      setFeedback({ type: 'error', text: error?.message || 'Publicação ainda protegida durante a migração.' });
    } finally { setBusy(false); }
  };

  const setField = <K extends keyof DraftForm>(key: K, value: DraftForm[K]) => setForm(current => current ? { ...current, [key]: value } : current);
  const setFraud = (key: keyof DraftForm['antiFraudProfile'], value: number | boolean) => setForm(current => current ? { ...current, antiFraudProfile: { ...current.antiFraudProfile, [key]: value } } : current);
  const setPrize = (index: number, key: keyof Prize, value: string | number) => setForm(current => current ? { ...current, prizes: current.prizes.map((item, i) => i === index ? { ...item, [key]: key === 'amount' || key === 'rank' ? Number(value) : value } : item) } : current);
  const addPrize = () => setForm(current => current ? { ...current, prizes: [...current.prizes, { rank: current.prizes.length + 1, amount: 0, label: `${current.prizes.length + 1}º lugar` }] } : current);
  const removePrize = (index: number) => setForm(current => current ? { ...current, prizes: current.prizes.filter((_, i) => i !== index).map((item, i) => ({ ...item, rank: i + 1 })) } : current);

  if (!ready) return <div className="adm-loading">Carregando campeonatos...</div>;
  if (!user) { window.location.replace('/admin'); return <div className="adm-loading">Redirecionando...</div>; }

  return <main className="champ-admin-page">
    <header className="champ-admin-top">
      <div><p className="adm-kicker">INVICTUS BACKOFFICE</p><h1>Campeonatos oficiais</h1><p>Calendário, preço, regras, antifraude, premiação, inscrições e identidade da edição em uma única central.</p></div>
      <div className="adm-actions"><button onClick={() => window.location.assign('/admin')}><ArrowLeft size={14}/>Painel</button><button className="gold" onClick={() => void load()} disabled={busy}><RefreshCw size={14}/>Atualizar</button></div>
    </header>

    {feedback && <div className={`adm-feedback ${feedback.type}`}><span>{feedback.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>} {feedback.text}</span><button onClick={() => setFeedback(null)}><XCircle size={15}/></button></div>}

    <section className="champ-migration-banner"><ShieldCheck/><div><small>STATUS DA MIGRAÇÃO</small><b>{state?.migration?.phase || '—'}</b><p>{state?.migration?.reason || 'Carregando estado do runtime.'}</p><span>Atual: {state?.migration?.liveRuntimeSource || '—'} → Destino: {state?.migration?.targetRuntimeSource || '—'}</span></div></section>

    <div className="champ-admin-layout">
      <aside className="champ-admin-list">
        {(state?.championships || []).map(item => <button key={item.runtime.id} className={selectedId === item.runtime.id ? 'active' : ''} onClick={() => choose(item)}><Trophy/><span><b>{item.runtime.categoryLabel || item.runtime.title}</b><small>{item.runtime.edition || 'Sem edição'} · {item.runtime.status}</small><small>{item.draft ? 'Rascunho salvo' : 'Sem rascunho'}</small></span><strong>{item.registrations?.paid || 0}</strong></button>)}
      </aside>

      {selected && form && <div className="champ-admin-editor">
        <section className="adm-card champ-runtime-card"><div className="adm-card-title"><div><small>EDIÇÃO LIVE ATUAL</small><h2>{selected.runtime.title}</h2></div><span className="adm-badge">{String(selected.runtime.status || '').toUpperCase()}</span></div><div className="champ-runtime-grid"><Info icon={<CalendarDays/>} label="Período" value={`${displayDate(selected.runtime.startAt)} → ${displayDate(selected.runtime.endAt)}`}/><Info icon={<Coins/>} label="Preço" value={money(selected.runtime.registrationPrice)}/><Info icon={<Trophy/>} label="Premiação mínima" value={money(selected.runtime.prizePool)}/><Info icon={<Users/>} label="Inscrições pagas" value={String(selected.registrations?.paid || 0)}/><Info icon={<FileCheck2/>} label="Edition ID" value={String(selected.runtime.editionId || '—')}/><Info icon={<ShieldCheck/>} label="Settlement" value={String(selected.settlement?.status || 'Ainda não iniciado')}/></div></section>

        <section className="adm-card"><div className="adm-card-title"><div><small>PRÓXIMA EDIÇÃO</small><h2>Configuração administrativa</h2></div><Save/></div><div className="champ-form-grid"><Field label="Título" value={form.title} onChange={value => setField('title', value)}/><Field label="Edição" value={form.edition} onChange={value => setField('edition', value)}/><DateField label="Abertura das inscrições" value={form.registrationOpensAt} onChange={value => setField('registrationOpensAt', value)}/><DateField label="Fechamento das inscrições" value={form.registrationClosesAt} onChange={value => setField('registrationClosesAt', value)}/><DateField label="Início" value={form.startAt} onChange={value => setField('startAt', value)}/><DateField label="Fim" value={form.endAt} onChange={value => setField('endAt', value)}/><DateField label="Homologação" value={form.settlementAt} onChange={value => setField('settlementAt', value)}/><NumberField label="Preço da inscrição" value={form.registrationPrice} onChange={value => setField('registrationPrice', value)}/></div><label className="champ-textarea">Descrição<textarea value={form.description} onChange={event => setField('description', event.target.value)}/></label>
        </section>

        <section className="adm-card"><div className="adm-card-title"><div><small>CONTROLES COMPETITIVOS</small><h2>Antifraude da edição</h2></div><ShieldCheck/></div><div className="champ-form-grid"><NumberField label="Duração mínima (min)" value={form.antiFraudProfile.minDurationMinutes} onChange={value => setFraud('minDurationMinutes', value)}/><NumberField label="Duração máxima (min)" value={form.antiFraudProfile.maxDurationMinutes} onChange={value => setFraud('maxDurationMinutes', value)}/><NumberField label="Risco máximo elegível" value={form.antiFraudProfile.maxRiskScore} onChange={value => setFraud('maxRiskScore', value)}/><label className="champ-check"><input type="checkbox" checked={form.antiFraudProfile.requireGeofence} onChange={event => setFraud('requireGeofence', event.target.checked)}/>Geofence obrigatório</label><label className="champ-check"><input type="checkbox" checked={form.antiFraudProfile.requireContinuousGPS} onChange={event => setFraud('requireContinuousGPS', event.target.checked)}/>GPS contínuo obrigatório</label></div>{form.championshipId === 'invictus_cardio_v1' && <Field label="Modalidades de cardio elegíveis (separadas por vírgula)" value={form.allowedCardioTypes.join(', ')} onChange={value => setField('allowedCardioTypes', value.split(',').map(item => item.trim().toLowerCase()).filter(Boolean))}/>}</section>

        <section className="adm-card"><div className="adm-card-title"><div><small>PREMIAÇÃO</small><h2>Distribuição oficial</h2></div><Trophy/></div><div className="champ-prize-total"><small>POTE CONFIGURADO</small><strong>{money(prizePool)}</strong></div><div className="champ-prize-list">{form.prizes.map((prize, index) => <div key={index}><b>#{index + 1}</b><input value={prize.label || ''} onChange={event => setPrize(index, 'label', event.target.value)} placeholder="Rótulo"/><input type="number" min="0" step="0.01" value={prize.amount} onChange={event => setPrize(index, 'amount', event.target.value)}/><button disabled={form.prizes.length <= 1} onClick={() => removePrize(index)}><Trash2 size={14}/></button></div>)}</div><button className="adm-secondary" onClick={addPrize}>+ Adicionar posição</button></section>

        <section className="adm-card champ-publish-card"><div><small className="adm-kicker">PUBLICAÇÃO</small><h2>Salvar agora, publicar somente com runtime atômico</h2><p>O rascunho já pode ser preparado e auditado no site. A ativação live continua fail-closed até o backend terminar de trocar inscrição, scoring e settlement para a mesma fonte publicada.</p></div><div className="champ-publish-actions"><label className="champ-check"><input type="checkbox" checked={form.registrationEnabled} onChange={event => setField('registrationEnabled', event.target.checked)}/>Abrir inscrições quando a edição for publicada</label><div className="adm-actions"><button className="danger" disabled={busy || !selected.draft} onClick={() => void discard()}><Trash2 size={14}/>Descartar rascunho</button><button disabled={busy} onClick={() => void save()}><Save size={14}/>Salvar rascunho</button><button className="gold" disabled={busy || !state?.migration?.publishEnabled} onClick={() => void publish()}><ShieldCheck size={14}/>Publicar edição</button></div>{!state?.migration?.publishEnabled && <small className="champ-publish-lock"><AlertTriangle size={13}/>Publicação live bloqueada por segurança até a conclusão da migração atômica.</small>}</div></section>
      </div>}
    </div>
  </main>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <article>{icon}<small>{label}</small><b>{value}</b></article>; }
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label><span>{label}</span><input value={value} onChange={event => onChange(event.target.value)}/></label>; }
function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label><span>{label}</span><input type="datetime-local" value={value} onChange={event => onChange(event.target.value)}/></label>; }
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label><span>{label}</span><input type="number" step="0.01" value={value} onChange={event => onChange(Number(event.target.value))}/></label>; }
