import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Building2, CheckCircle2, Eye, FileSearch, MapPin, RefreshCw, Search, ShieldAlert, ShieldCheck, Wrench, X, XCircle } from 'lucide-react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import { adminRequest } from '../lib/adminApi';

type FeedbackSetter = (message: { type: 'success' | 'error'; text: string } | null) => void;
type AdminActivity = Record<string, any> & { id: string; userId?: string };

type ActivityState = 'validated' | 'rejected' | 'pending' | 'completed';
function finalState(item: AdminActivity): ActivityState {
  if (item.pendingReview === true || item.dataQualityStatus === 'dedup_pending') return 'pending';
  const validation = String(item.validationStatus || '').toLowerCase();
  const competition = String(item.competitionReviewStatus || item.competitionStatus || '').toLowerCase();
  const status = String(item.status || '').toLowerCase();
  if (validation === 'rejected' || competition === 'rejected' || ['invalid', 'rejected'].includes(status)) return 'rejected';
  if (validation === 'validated' || competition === 'approved' || status === 'valid') return 'validated';
  if (['pending', 'pending_review'].includes(validation) || ['pending', 'pending_review'].includes(competition) || status === 'pending') return 'pending';
  return 'completed';
}
function activityLabel(item: AdminActivity) {
  if (item.cardioTypeLabel) return String(item.cardioTypeLabel);
  if (item.cardioType) return String(item.cardioType).replaceAll('_', ' ');
  if (item.muscleGroup) return `Musculação · ${item.muscleGroup}`;
  if (item.type === 'cardio') return 'Cardio';
  if (item.type === 'checkin') return 'Check-in';
  return String(item.type || item.activityType || 'Atividade');
}
function activityDate(item: AdminActivity) {
  const raw = item.createdAt || item.timestamp || item.completedAt || item.updatedAt;
  const date = raw?.toDate?.() || (raw ? new Date(raw) : null);
  return date && Number.isFinite(date.getTime()) ? date.toLocaleString('pt-BR') : 'Data indisponível';
}

export function ActivitiesPanel({ setFeedback, openPending }: { setFeedback: FeedbackSetter; openPending: () => void }) {
  const [items, setItems] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | ActivityState>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminActivity | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setFeedback(null);
    try {
      let snapshot;
      try { snapshot = await getDocs(query(collection(db, 'workouts'), orderBy('createdAt', 'desc'), limit(150))); }
      catch { snapshot = await getDocs(query(collection(db, 'workouts'), orderBy('timestamp', 'desc'), limit(150))); }
      setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err: any) { setFeedback({ type: 'error', text: err?.message || 'Não foi possível carregar as atividades.' }); }
    finally { setLoading(false); }
  }, [setFeedback]);
  useEffect(() => { void load(); }, [load]);

  const counts = useMemo(() => items.reduce((acc, item) => { acc[finalState(item)] += 1; return acc; }, { validated: 0, rejected: 0, pending: 0, completed: 0 }), [items]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(item => (filter === 'all' || finalState(item) === filter) && (!q || [item.id, item.userId, item.type, item.cardioType, item.muscleGroup, item.validationStatus, item.nonScoringReason].some(v => String(v || '').toLowerCase().includes(q))));
  }, [filter, items, search]);

  return <>
    <div className="adm-metrics">
      <Metric label="Validadas" value={counts.validated} /><Metric label="Fora da pontuação" value={counts.rejected} /><Metric label="Pendências" value={counts.pending} attention={counts.pending > 0} /><Metric label="Outras concluídas" value={counts.completed} />
    </div>
    <section className="adm-card">
      <div className="adm-card-title"><div><small>HISTÓRICO OPERACIONAL</small><h2>Atividades canônicas</h2></div><div className="adm-actions"><button onClick={openPending}><ShieldAlert size={13}/>Fila de pendências</button><button onClick={() => void load()}><RefreshCw size={13}/>Atualizar</button></div></div>
      <div className="adm-toolbar adm-toolbar-spread"><div className="adm-pills">{(['all','validated','rejected','pending'] as const).map(key => <button key={key} className={filter===key?'active':''} onClick={() => setFilter(key)}>{key==='all'?'Todas':key==='validated'?'Validadas':key==='rejected'?'Fora da pontuação':'Pendências'}</button>)}</div><label className="adm-search-inline"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar ID, usuário, tipo ou motivo..."/></label></div>
      {loading ? <div className="adm-empty">Carregando atividades...</div> : <div className="adm-table-wrap"><table><thead><tr><th>Atividade</th><th>Usuário</th><th>Data</th><th>Estado</th><th>Dados</th><th></th></tr></thead><tbody>{filtered.map(item => <tr key={item.id}><td><b>{activityLabel(item)}</b><small>{item.id}</small></td><td>{item.userId || '—'}</td><td>{activityDate(item)}</td><td><span className={`adm-status ${finalState(item)==='validated'?'approved':finalState(item)==='rejected'?'rejected':finalState(item)==='pending'?'under_review':''}`}>{finalState(item).toUpperCase()}</span></td><td>{item.distance ? `${Number(item.distance).toFixed(2)} km` : item.calories ? `${Math.round(Number(item.calories))} kcal` : 'registro'}</td><td><button className="adm-icon-btn" onClick={() => setSelected(item)}><Eye size={15}/></button></td></tr>)}</tbody></table></div>}
      {!loading && !filtered.length && <div className="adm-empty">Nenhuma atividade encontrada.</div>}
    </section>
    {selected && <div className="adm-modal-backdrop" onClick={()=>setSelected(null)}><section className="adm-modal" onClick={e=>e.stopPropagation()}><button className="adm-modal-close" onClick={()=>setSelected(null)}><X size={17}/></button><p className="adm-kicker">DETALHES DA ATIVIDADE</p><h2>{activityLabel(selected)}</h2><small>{selected.id}</small>{selected.photoUrl && <img className="adm-modal-image" src={selected.photoUrl} alt="Registro da atividade" referrerPolicy="no-referrer"/>}<div className="adm-detail-grid"><Detail label="Usuário" value={selected.userId}/><Detail label="Estado" value={finalState(selected)}/><Detail label="Validação" value={selected.validationStatus || selected.validation?.status}/><Detail label="Competição" value={selected.competitionReviewStatus || selected.competitionStatus}/><Detail label="Decisão antifraude" value={selected.securityDecision}/><Detail label="Motivo" value={selected.nonScoringReason || selected.rejectionReason}/></div>{finalState(selected)==='pending' && <button className="adm-primary adm-full" onClick={openPending}><ShieldAlert size={14}/>Abrir fila de pendências</button>}</section></div>}
  </>;
}

type SecurityTab = 'fraud' | 'validation' | 'alerts' | 'system';
const SECURITY: Record<SecurityTab, { label: string; category: string }> = { fraud:{label:'Antifraude',category:'fraud_audit_logs'}, validation:{label:'Validação',category:'activity_validation_logs'}, alerts:{label:'Alertas',category:'system_alerts'}, system:{label:'Sistema',category:'system_logs'} };
export function SecurityPanel({ setFeedback }: { setFeedback: FeedbackSetter }) {
  const [tab, setTab] = useState<SecurityTab>('fraud'); const [logs, setLogs] = useState<any[]>([]); const [loading,setLoading]=useState(true); const [search,setSearch]=useState(''); const [traceQuery,setTraceQuery]=useState(''); const [trace,setTrace]=useState<any>(null);
  const load = useCallback(async()=>{ setLoading(true); setFeedback(null); try { const p=await adminRequest<any>('logs',{query:{category:SECURITY[tab].category,limit:100}}); setLogs(p.logs||[]); } catch(err:any){setFeedback({type:'error',text:err?.message||'Falha ao carregar auditoria.'});} finally{setLoading(false);} },[tab,setFeedback]);
  useEffect(()=>{void load();},[load]);
  const filtered=useMemo(()=>{const q=search.trim().toLowerCase(); return !q?logs:logs.filter(e=>[e.id,e.message,e.userId,e.route,e.severity,JSON.stringify(e.details||{})].some(v=>String(v||'').toLowerCase().includes(q)));},[logs,search]);
  const findTrace=async()=>{if(!traceQuery.trim())return; setFeedback(null); try{setTrace(await adminRequest('get-trace',{query:{traceId:traceQuery.trim()}}));}catch(err:any){setTrace(null);setFeedback({type:'error',text:err?.message||'Trace não encontrado.'});}};
  return <><div className="adm-metrics"><Metric label="Eventos" value={logs.length}/><Metric label="Críticos" value={logs.filter(e=>String(e.severity).toUpperCase()==='CRITICAL').length} attention/><Metric label="Alto risco" value={logs.filter(e=>String(e.severity).toUpperCase()==='HIGH_RISK').length} attention/><Metric label="Avisos" value={logs.filter(e=>String(e.severity).toUpperCase()==='WARNING').length}/></div><section className="adm-card"><div className="adm-toolbar adm-toolbar-spread"><div className="adm-pills">{(Object.keys(SECURITY) as SecurityTab[]).map(k=><button className={tab===k?'active':''} key={k} onClick={()=>setTab(k)}>{SECURITY[k].label}</button>)}</div><label className="adm-search-inline"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar usuário, rota ou mensagem..."/></label></div>{loading?<div className="adm-empty">Carregando logs...</div>:<div className="adm-log-list">{filtered.map((entry,i)=><div key={entry.id||i}><b>{String(entry.severity||'INFO')}</b><span>{entry.message||'Evento sem mensagem'}<small className="adm-inline-meta">{entry.userId||'system'} · {entry.route||'sem rota'}</small>{entry.details&&Object.keys(entry.details).length>0?<pre>{JSON.stringify(entry.details,null,2)}</pre>:null}</span><small>{formatDate(entry.timestamp||entry.createdAt)}</small></div>)}</div>}</section><section className="adm-card"><div className="adm-card-title"><div><small>RASTREABILIDADE</small><h2>Buscar pipeline trace</h2></div><FileSearch/></div><div className="adm-inline"><input value={traceQuery} onChange={e=>setTraceQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void findTrace();}} placeholder="trc_..., corr_... ou activityId"/><button className="adm-primary" onClick={()=>void findTrace()}>Buscar</button></div>{trace&&<pre className="adm-json">{JSON.stringify(trace,null,2)}</pre>}</section></>;
}

type AuditItem={id:string;placeId:string;name:string;latitude:number|null;longitude:number|null;registeredAddress:string;googleMapsAddress:string;googleMapsLat:number|null;googleMapsLng:number|null;distanceMeters:number|null;status:'OK'|'WARNING'|'ERROR';errors:string[];warnings:string[]};
type AuditReport={providerConfigured:boolean;gymsCount:number;errorsCount:number;warningsCount:number;results:AuditItem[]};
export function GymAuditPanel({ setFeedback }: { setFeedback: FeedbackSetter }) {
  const [report,setReport]=useState<AuditReport|null>(null); const [loading,setLoading]=useState(true); const [filter,setFilter]=useState<'all'|'errors'|'warnings'|'ok'>('all'); const [search,setSearch]=useState(''); const [fixing,setFixing]=useState('');
  const load=useCallback(async()=>{setLoading(true);setFeedback(null);try{setReport(await adminRequest<AuditReport>('gyms-audit'));}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha na auditoria de academias.'});}finally{setLoading(false);}},[setFeedback]);
  useEffect(()=>{void load();},[load]);
  const filtered=useMemo(()=>{const q=search.trim().toLowerCase();return(report?.results||[]).filter(i=>(filter==='all'||(filter==='errors'&&i.status==='ERROR')||(filter==='warnings'&&i.status==='WARNING')||(filter==='ok'&&i.status==='OK'))&&(!q||[i.id,i.name,i.registeredAddress,i.googleMapsAddress,i.placeId].some(v=>String(v||'').toLowerCase().includes(q))));},[report,filter,search]);
  const fix=async(item:AuditItem)=>{if(!window.confirm(`Sincronizar ${item.name} com o Google Places?`))return;setFixing(item.id);setFeedback(null);try{const r:any=await adminRequest('fix-gym-coordinates',{method:'POST',body:{gymId:item.id}});setFeedback({type:'success',text:`Academia sincronizada. ${Number(r.affectedUsers||0)} perfil(is) atualizado(s).`});await load();}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha ao corrigir academia.'});}finally{setFixing('');}};
  const healthy=report?Math.max(0,report.gymsCount-report.errorsCount-report.warningsCount):0;
  return <><div className="adm-metrics"><Metric label="Academias" value={report?.gymsCount||0}/><Metric label="Consistentes" value={healthy}/><Metric label="Avisos" value={report?.warningsCount||0} attention={(report?.warningsCount||0)>0}/><Metric label="Erros" value={report?.errorsCount||0} attention={(report?.errorsCount||0)>0}/></div>{report&&!report.providerConfigured&&<div className="adm-feedback error"><span><AlertTriangle size={16}/>Google Places não está configurado neste ambiente; a validação externa fica indisponível.</span></div>}<section className="adm-card"><div className="adm-toolbar adm-toolbar-spread"><div className="adm-pills">{(['all','errors','warnings','ok'] as const).map(k=><button className={filter===k?'active':''} key={k} onClick={()=>setFilter(k)}>{k==='all'?'Todas':k==='errors'?'Erros':k==='warnings'?'Avisos':'Consistentes'}</button>)}</div><label className="adm-search-inline"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar academia, endereço ou Place ID..."/></label></div>{loading?<div className="adm-empty">Auditando academias...</div>:<div className="adm-stack">{filtered.map(item=><article className={`adm-audit-row ${item.status.toLowerCase()}`} key={item.id}><div className="adm-audit-head"><div><b>{item.name}</b><small>{item.id} · {item.placeId||'Place ID ausente'}</small></div><span className={`adm-status ${item.status==='OK'?'approved':item.status==='ERROR'?'rejected':'under_review'}`}>{item.status}</span></div><div className="adm-audit-grid"><Detail label="Cadastro Invictus" value={`${item.registeredAddress||'—'} · ${item.latitude??'—'}, ${item.longitude??'—'}`}/><Detail label="Google Places" value={`${item.googleMapsAddress||'—'} · ${item.googleMapsLat??'—'}, ${item.googleMapsLng??'—'}`}/></div><p className="adm-audit-distance"><MapPin size={13}/>{item.distanceMeters===null?'Sem comparação externa':`${item.distanceMeters.toLocaleString('pt-BR')} m de diferença`}</p>{[...(item.errors||[]),...(item.warnings||[])].map((m,i)=><p className="adm-audit-message" key={i}><AlertTriangle size={13}/>{m}</p>)}{item.googleMapsLat!==null&&item.googleMapsLng!==null&&item.status!=='OK'&&<button className="adm-primary" disabled={fixing===item.id} onClick={()=>void fix(item)}><Wrench size={14}/>{fixing===item.id?'Sincronizando...':'Sincronizar com Google'}</button>}</article>)}</div>}</section></>;
}

function Metric({label,value,attention=false}:{label:string;value:number;attention?:boolean}){return <article className={`adm-metric ${attention?'attention':''}`}><small>{label}</small><strong>{Number(value).toLocaleString('pt-BR')}</strong></article>}
function Detail({label,value}:{label:string;value:any}){return <div className="adm-detail"><small>{label}</small><b>{value===undefined||value===null||value===''?'—':String(value)}</b></div>}
function formatDate(raw:any){const date=raw?.toDate?.()||(raw?new Date(raw):null);return date&&Number.isFinite(date.getTime())?date.toLocaleString('pt-BR'):'Data indisponível'}
