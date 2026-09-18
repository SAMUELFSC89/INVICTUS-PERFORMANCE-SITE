import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Dumbbell,
  FileCheck2,
  LogOut,
  Package,
  PackageCheck,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Trophy,
  Users,
  WalletCards,
  XCircle,
} from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import { adminRequest, API_BASE } from '../lib/adminApi';
import { ActivitiesPanel, GymAuditPanel, SecurityPanel } from './OperationalPanels';
import { FinanceOverviewPanel } from './FinanceOverviewPanel';
import { StoreDropsPanel, StoreOrdersPanel, StoreProductsPanel } from './StorePanels';
import './AdminPanel.css';

type Tab =
  | 'dashboard'
  | 'revenue'
  | 'withdrawals'
  | 'flagged'
  | 'activities'
  | 'security'
  | 'users'
  | 'gyms'
  | 'store-products'
  | 'store-drops'
  | 'store-orders'
  | 'powerlift'
  | 'championships'
  | 'settings';

type Feedback = { type: 'success' | 'error'; text: string } | null;
type Withdrawal = Record<string, any> & { id: string; status?: string; amount?: number; userDisplayName?: string; userId?: string; pixKey?: string; pixKeyType?: string; reconciliationRequired?: boolean; providerTransferId?: string };
type FlaggedActivity = Record<string, any> & { id?: string; activityId?: string; userId?: string; type?: string; riskScore?: number; pendingReview?: boolean; competitionReviewStatus?: string };
type AdminUser = Record<string, any> & { uid: string; email?: string; displayName?: string; displayNameLower?: string; role?: string; subscriptionTier?: string; cpf?: string; createdAt?: any };
type EconomyConfig = {
  economy?: { pilotUserLimit?: number; missionMonthlyCap?: number | null; globalIssuanceBudget?: number | null; enforceGlobalBudget?: boolean };
  championship?: { top1Prize?: number; top2Prize?: number; top3Prize?: number; participationPrize?: number };
};

const NAV: Array<{ id: Tab; label: string; icon: any }> = [
  { id: 'dashboard', label: 'Visão geral', icon: BarChart3 },
  { id: 'revenue', label: 'Faturamento', icon: WalletCards },
  { id: 'withdrawals', label: 'Financeiro / Saques', icon: CreditCard },
  { id: 'flagged', label: 'Pendências', icon: ShieldAlert },
  { id: 'activities', label: 'Atividades', icon: Activity },
  { id: 'security', label: 'Antifraude', icon: ShieldCheck },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'gyms', label: 'Academias', icon: Building2 },
  { id: 'store-products', label: 'Loja / Produtos', icon: ShoppingBag },
  { id: 'store-drops', label: 'Drops', icon: Package },
  { id: 'store-orders', label: 'Pedidos', icon: PackageCheck },
  { id: 'powerlift', label: 'Power Lift', icon: Dumbbell },
  { id: 'championships', label: 'Campeonatos', icon: Trophy },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const text = (value: unknown, fallback = '—') => value === undefined || value === null || value === '' ? fallback : String(value);

function Brand() {
  return <div className="adm-brand"><span className="adm-mark">⬢</span><div><b>INVICTUS</b><small>CENTRAL ADMINISTRATIVA</small></div></div>;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await signInWithEmailAndPassword(auth, email.trim(), password); await adminRequest('metrics'); }
    catch (err: any) { await signOut(auth).catch(() => undefined); setError(err?.message?.includes('Acesso negado') ? 'Esta conta não possui permissão administrativa ativa.' : (err?.message || 'Não foi possível entrar.')); }
    finally { setLoading(false); }
  };
  return <main className="adm-login"><section className="adm-login-card"><Brand/><p className="adm-kicker">ACESSO RESTRITO</p><h1>Painel Administrativo</h1><p>Esta é a central operacional do Invictus. A mesma conta administrativa do aplicativo é validada novamente pelo backend em cada ação sensível.</p><form onSubmit={submit}><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></label><label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>{error&&<div className="adm-error"><AlertTriangle size={16}/>{error}</div>}<button className="adm-primary" disabled={loading}>{loading?'Validando...':'Entrar no painel'}</button></form><small>API operacional: {API_BASE}</small></section></main>;
}

function Metric({label,value,attention=false}:{label:string;value:string;attention?:boolean}){return <article className={`adm-metric ${attention?'attention':''}`}><small>{label}</small><strong>{value}</strong></article>}
function Empty({children}:{children:string}){return <div className="adm-empty">{children}</div>}

export default function AdminPanel(){
  const[user,setUser]=useState<User|null>(null);const[authReady,setAuthReady]=useState(false);const[tab,setTab]=useState<Tab>('dashboard');const[feedback,setFeedback]=useState<Feedback>(null);const[busy,setBusy]=useState(false);
  const[metrics,setMetrics]=useState<any>(null);const[withdrawals,setWithdrawals]=useState<Withdrawal[]>([]);const[flagged,setFlagged]=useState<FlaggedActivity[]>([]);const[recentUsers,setRecentUsers]=useState<AdminUser[]>([]);const[economy,setEconomy]=useState<EconomyConfig>({});const[withdrawalStatus,setWithdrawalStatus]=useState('');const[userSearch,setUserSearch]=useState('');const[userResults,setUserResults]=useState<AdminUser[]>([]);const[minWithdrawal,setMinWithdrawal]=useState('');
  useEffect(()=>onAuthStateChanged(auth,current=>{setUser(current);setAuthReady(true);}),[]);

  const loadDashboard=useCallback(async()=>{setBusy(true);setFeedback(null);try{const[adminMetrics,userCount,recent,flaggedResult,withdrawalResult]=await Promise.all([adminRequest<any>('metrics'),getCountFromServer(collection(db,'users')),getDocs(query(collection(db,'users'),orderBy('createdAt','desc'),limit(8))),adminRequest<any>('list-flagged-activities',{query:{limit:100}}),adminRequest<any>('list-withdrawals')]);setMetrics({...adminMetrics,totalUsers:userCount.data().count});setRecentUsers(recent.docs.map(d=>({uid:d.id,...d.data()} as AdminUser)));setFlagged(Array.isArray(flaggedResult?.activities)?flaggedResult.activities:[]);setWithdrawals(Array.isArray(withdrawalResult)?withdrawalResult:(withdrawalResult?.withdrawals||[]));}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha ao carregar o painel.'});}finally{setBusy(false);}},[]);
  const loadWithdrawals=useCallback(async()=>{setBusy(true);setFeedback(null);try{const result=await adminRequest<any>('list-withdrawals',{query:{status:withdrawalStatus||undefined}});setWithdrawals(Array.isArray(result)?result:(result?.withdrawals||[]));}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha ao carregar saques.'});}finally{setBusy(false);}},[withdrawalStatus]);
  const loadFlagged=useCallback(async()=>{setBusy(true);setFeedback(null);try{const result=await adminRequest<any>('list-flagged-activities',{query:{limit:100}});setFlagged(result?.activities||[]);}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha ao carregar a fila.'});}finally{setBusy(false);}},[]);
  const loadEconomy=useCallback(async()=>{setBusy(true);setFeedback(null);try{setEconomy(await adminRequest<EconomyConfig>('get-reward-economy-config'));}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha ao carregar configurações.'});}finally{setBusy(false);}},[]);
  useEffect(()=>{if(!user)return;if(tab==='dashboard')void loadDashboard();if(tab==='withdrawals')void loadWithdrawals();if(tab==='flagged')void loadFlagged();if(tab==='settings')void loadEconomy();},[user,tab,loadDashboard,loadWithdrawals,loadFlagged,loadEconomy]);

  const pendingWithdrawals=useMemo(()=>withdrawals.filter(w=>['pending','under_review','approved','processing'].includes(String(w.status))).length,[withdrawals]);
  const actWithdrawal=async(item:Withdrawal,action:'approve'|'reject'|'cancel'|'process'|'reconcile')=>{const labels={approve:'aprovar',reject:'recusar',cancel:'cancelar e estornar',process:'enviar o PIX via Asaas',reconcile:'conciliar com o Asaas'};if(!window.confirm(`Confirma ${labels[action]} este saque de ${money(item.amount)}?`))return;const reason=action==='reject'?(window.prompt('Motivo da recusa (opcional):')||undefined):undefined;setBusy(true);setFeedback(null);try{let result:any;if(action==='process')result=await adminRequest('process-withdrawal-payment',{method:'POST',body:{withdrawalId:item.id}});else if(action==='reconcile')result=await adminRequest('reconcile-withdrawal-provider',{method:'POST',body:{withdrawalId:item.id}});else result=await adminRequest('update-withdrawal-status',{method:'POST',body:{withdrawalId:item.id,status:action==='approve'?'approved':action==='reject'?'rejected':'cancelled',reason}});setFeedback({type:'success',text:result?.message||'Operação concluída.'});await loadWithdrawals();}catch(err:any){setFeedback({type:'error',text:err?.message||'Operação não concluída.'});}finally{setBusy(false);}};
  const reviewActivity=async(item:FlaggedActivity,status:'valid'|'invalid')=>{const activityId=String(item.activityId||item.id||'');if(!activityId)return;const resolution=window.prompt('Observação da decisão (opcional):')||undefined;setBusy(true);setFeedback(null);try{const result:any=await adminRequest('review-activity',{method:'POST',body:{activityId,status,resolution}});setFeedback({type:'success',text:result?.message||'Revisão concluída.'});await loadFlagged();}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha na revisão.'});}finally{setBusy(false);}};

  const searchUsers=async(event:FormEvent)=>{event.preventDefault();const target=userSearch.trim();if(!target)return;setBusy(true);setFeedback(null);try{const found=new Map<string,AdminUser>();const direct=await getDoc(doc(db,'users',target));if(direct.exists())found.set(direct.id,{uid:direct.id,...direct.data()} as AdminUser);const jobs:Promise<any>[]=[];if(target.includes('@'))jobs.push(getDocs(query(collection(db,'users'),where('email','==',target.toLowerCase()),limit(10))));const cpf=target.replace(/\D/g,'');if(cpf.length===11)jobs.push(getDocs(query(collection(db,'users'),where('cpf','==',cpf),limit(10))));const normalized=target.toLowerCase();if(!target.includes('@')&&cpf.length!==11)jobs.push(getDocs(query(collection(db,'users'),where('displayNameLower','>=',normalized),where('displayNameLower','<=',`${normalized}\uf8ff`),limit(20))));const results=await Promise.allSettled(jobs);results.forEach(r=>{if(r.status==='fulfilled')r.value.forEach((d:any)=>found.set(d.id,{uid:d.id,...d.data()} as AdminUser));});setUserResults([...found.values()]);if(!found.size)setFeedback({type:'error',text:'Nenhum usuário encontrado por UID, nome, e-mail ou CPF.'});}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha na busca.'});}finally{setBusy(false);}};
  const changeRole=async(target:AdminUser,role:'admin'|'user')=>{if(!window.confirm(`Alterar ${target.displayName||target.email||target.uid} para ${role.toUpperCase()}?`))return;setBusy(true);setFeedback(null);try{const result:any=await adminRequest('set-user-role',{method:'POST',body:{targetUid:target.uid,role}});setFeedback({type:'success',text:`Papel atualizado para ${result?.role||role}.`});setUserResults(list=>list.map(item=>item.uid===target.uid?{...item,role}:item));}catch(err:any){setFeedback({type:'error',text:err?.message||'Não foi possível alterar o papel.'});}finally{setBusy(false);}};
  const deactivateUser=async(target:AdminUser)=>{if(!window.confirm(`DESATIVAR a conta ${target.displayName||target.email||target.uid}? Esta ação bloqueia a conta e revoga sessões.`))return;setBusy(true);setFeedback(null);try{const result:any=await adminRequest('delete-user',{method:'POST',body:{target:target.uid}});setFeedback({type:'success',text:result?.message||'Conta desativada.'});setUserResults(list=>list.filter(item=>item.uid!==target.uid));}catch(err:any){setFeedback({type:'error',text:err?.message||'Não foi possível desativar a conta.'});}finally{setBusy(false);}};
  const saveEconomy=async(event:FormEvent)=>{event.preventDefault();setBusy(true);setFeedback(null);try{const payload={...(economy.economy||{}),...(economy.championship||{})};const result:any=await adminRequest('update-reward-economy-config',{method:'POST',body:payload});setFeedback({type:'success',text:result?.message||'Configurações atualizadas.'});await loadEconomy();}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha ao atualizar configurações.'});}finally{setBusy(false);}};
  const saveMinWithdrawal=async()=>{setBusy(true);setFeedback(null);try{const result:any=await adminRequest('update-withdrawal-min-amount',{method:'POST',body:{minWithdrawalAmount:Number(minWithdrawal)}});setFeedback({type:'success',text:result?.message||'Saque mínimo atualizado.'});}catch(err:any){setFeedback({type:'error',text:err?.message||'Falha ao atualizar o saque mínimo.'});}finally{setBusy(false);}};

  if(!authReady)return <div className="adm-loading">Carregando ambiente administrativo...</div>;if(!user)return <Login/>;
  return <main className="adm-shell"><aside className="adm-sidebar"><Brand/><nav>{NAV.map(item=>{const Icon=item.icon;return <button key={item.id} className={tab===item.id?'active':''} onClick={()=>item.id==='powerlift'?window.location.assign('/admin/powerlift'):setTab(item.id)}><Icon size={17}/><span>{item.label}</span><ChevronRight size={14}/></button>})}</nav><div className="adm-sidebar-foot"><small>{user.email}</small><button onClick={()=>void signOut(auth)}><LogOut size={16}/>Sair</button></div></aside><section className="adm-content"><div className="adm-topbar"><div><p className="adm-kicker">INVICTUS PERFORMANCE</p><h1>{NAV.find(item=>item.id===tab)?.label}</h1></div><button className="adm-refresh" disabled={busy} onClick={()=>tab==='dashboard'?void loadDashboard():tab==='withdrawals'?void loadWithdrawals():tab==='flagged'?void loadFlagged():tab==='settings'?void loadEconomy():undefined}><RefreshCw size={16}/>Atualizar</button></div>
  {feedback&&<div className={`adm-feedback ${feedback.type}`}><span>{feedback.type==='success'?<CheckCircle2 size={17}/>:<AlertTriangle size={17}/>} {feedback.text}</span><button onClick={()=>setFeedback(null)}><XCircle size={16}/></button></div>}

  {tab==='dashboard'&&<><div className="adm-metrics"><Metric label="Usuários" value={Number(metrics?.totalUsers||0).toLocaleString('pt-BR')}/><Metric label="Pendências" value={String(flagged.length)} attention={flagged.length>0}/><Metric label="Saques em fluxo" value={String(pendingWithdrawals)} attention={pendingWithdrawals>0}/><Metric label="Alertas do sistema" value={String(metrics?.alerts?.length||0)} attention={Boolean(metrics?.alerts?.length)}/></div><div className="adm-two-col"><section className="adm-card"><div className="adm-card-title"><div><small>OPERAÇÃO</small><h2>Central de trabalho</h2></div></div><div className="adm-queue"><button onClick={()=>setTab('revenue')}><WalletCards/><div><b>Faturamento</b><span>Receita, ticket, loja e gráficos</span></div><strong>→</strong></button><button onClick={()=>setTab('flagged')}><ShieldAlert/><div><b>Pendências</b><span>{flagged.length} atividades aguardando decisão</span></div><strong>{flagged.length}</strong></button><button onClick={()=>setTab('withdrawals')}><CreditCard/><div><b>Saques PIX</b><span>{pendingWithdrawals} saques em andamento</span></div><strong>{pendingWithdrawals}</strong></button><button onClick={()=>setTab('security')}><ShieldCheck/><div><b>Antifraude</b><span>Logs, alertas e traces</span></div><strong>→</strong></button><button onClick={()=>setTab('activities')}><Activity/><div><b>Atividades</b><span>Histórico canônico e evidências</span></div><strong>→</strong></button><button onClick={()=>setTab('gyms')}><Building2/><div><b>Academias</b><span>Geofence e Google Places</span></div><strong>→</strong></button><button onClick={()=>setTab('store-products')}><ShoppingBag/><div><b>Loja</b><span>Produtos, custos, preços e estoque</span></div><strong>→</strong></button><button onClick={()=>window.location.assign('/admin/powerlift')}><Dumbbell/><div><b>Power Lift</b><span>Revisões de vídeo e levantamentos</span></div><strong>→</strong></button></div></section><section className="adm-card"><div className="adm-card-title"><div><small>RECENTES</small><h2>Novos usuários</h2></div></div><div className="adm-user-list">{recentUsers.map(u=><div key={u.uid}><span className="adm-avatar">{(u.displayName||u.email||'U').slice(0,1).toUpperCase()}</span><div><b>{u.displayName||'Usuário'}</b><small>{u.email||u.uid}</small></div><span className="adm-tag">{u.role==='admin'?'ADMIN':(u.subscriptionTier||'OPEN').toUpperCase()}</span></div>)}</div></section></div><section className="adm-card"><div className="adm-card-title"><div><small>SISTEMA</small><h2>Alertas recentes</h2></div></div>{metrics?.alerts?.length?<div className="adm-log-list">{metrics.alerts.map((a:any,i:number)=><div key={a.id||i}><b>{text(a.severity,'INFO')}</b><span>{text(a.message)}</span><small>{text(a.createdAt||a.timestamp)}</small></div>)}</div>:<Empty>Nenhum alerta crítico retornado pela API.</Empty>}</section></>}
  {tab==='revenue'&&<FinanceOverviewPanel setFeedback={setFeedback}/>} 
  {tab==='withdrawals'&&<section className="adm-card"><div className="adm-toolbar"><select value={withdrawalStatus} onChange={e=>setWithdrawalStatus(e.target.value)}><option value="">Todos os status</option><option value="pending">Pendente</option><option value="under_review">Em revisão</option><option value="approved">Aprovado</option><option value="processing">Processando</option><option value="paid">Pago</option><option value="cancelled">Cancelado</option><option value="rejected">Rejeitado</option></select><button className="adm-secondary" onClick={()=>void loadWithdrawals()}><SlidersHorizontal size={15}/>Aplicar</button></div><div className="adm-table-wrap"><table><thead><tr><th>Solicitação</th><th>Usuário</th><th>Valor</th><th>PIX</th><th>Status</th><th>Ações</th></tr></thead><tbody>{withdrawals.map(item=><tr key={item.id}><td><b>{item.id.slice(0,12)}</b><small>{text(item.createdAt)}</small></td><td>{item.userDisplayName||item.userId||'—'}</td><td>{money(item.amount)}</td><td><b>{text(item.pixKeyType)}</b><small>{text(item.pixKey)}</small></td><td><span className={`adm-status ${item.status||''}`}>{text(item.status).toUpperCase()}</span></td><td><div className="adm-actions">{['pending','under_review'].includes(String(item.status))&&<><button onClick={()=>void actWithdrawal(item,'approve')}>Aprovar</button><button className="danger" onClick={()=>void actWithdrawal(item,'reject')}>Recusar</button></>}{item.status==='approved'&&<button className="gold" onClick={()=>void actWithdrawal(item,'process')}>Enviar PIX</button>}{item.status==='processing'&&item.reconciliationRequired&&!item.providerTransferId&&<button className="warn" onClick={()=>void actWithdrawal(item,'reconcile')}>Conciliar</button>}{['pending','approved'].includes(String(item.status))&&<button className="danger" onClick={()=>void actWithdrawal(item,'cancel')}>Cancelar</button>}</div></td></tr>)}</tbody></table></div>{!withdrawals.length&&<Empty>Nenhum saque encontrado para este filtro.</Empty>}</section>}
  {tab==='flagged'&&<section className="adm-card"><div className="adm-card-title"><div><small>FILA CANÔNICA</small><h2>Exceções manuais</h2></div><span className="adm-counter">{flagged.length}</span></div><div className="adm-table-wrap"><table><thead><tr><th>Atividade</th><th>Usuário</th><th>Tipo</th><th>Risco</th><th>Estado</th><th>Decisão</th></tr></thead><tbody>{flagged.map((item,i)=>{const id=String(item.activityId||item.id||`item-${i}`);return <tr key={id}><td><b>{id.slice(0,15)}</b><small>{text(item.createdAt)}</small></td><td>{text(item.userId)}</td><td>{text(item.type)}</td><td>{text(item.riskScore??item.risk?.score)}</td><td><span className="adm-status under_review">{text(item.competitionReviewStatus||(item.pendingReview?'pending_review':item.status)).toUpperCase()}</span></td><td><div className="adm-actions"><button onClick={()=>void reviewActivity(item,'valid')}>Validar</button><button className="danger" onClick={()=>void reviewActivity(item,'invalid')}>Rejeitar</button></div></td></tr>})}</tbody></table></div>{!flagged.length&&<Empty>Nenhuma atividade pendente de revisão.</Empty>}</section>}
  {tab==='activities'&&<ActivitiesPanel setFeedback={setFeedback} openPending={()=>setTab('flagged')}/>} 
  {tab==='security'&&<SecurityPanel setFeedback={setFeedback}/>} 
  {tab==='gyms'&&<GymAuditPanel setFeedback={setFeedback}/>} 
  {tab==='store-products'&&<StoreProductsPanel setFeedback={setFeedback}/>} 
  {tab==='store-drops'&&<StoreDropsPanel setFeedback={setFeedback}/>} 
  {tab==='store-orders'&&<StoreOrdersPanel setFeedback={setFeedback}/>} 
  {tab==='users'&&<><section className="adm-card"><div className="adm-card-title"><div><small>BUSCA SEGURA</small><h2>Localizar usuário</h2></div></div><form className="adm-search-form" onSubmit={searchUsers}><Search size={18}/><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="UID, nome, e-mail ou CPF"/><button className="adm-primary">Buscar</button></form></section><section className="adm-card">{userResults.length?<div className="adm-table-wrap"><table><thead><tr><th>Usuário</th><th>UID</th><th>Plano</th><th>Papel</th><th>Ações</th></tr></thead><tbody>{userResults.map(u=><tr key={u.uid}><td><b>{u.displayName||'Sem nome'}</b><small>{u.email||'Sem e-mail'}</small></td><td>{u.uid}</td><td>{text(u.subscriptionTier,'open')}</td><td><span className="adm-status">{text(u.role,'user').toUpperCase()}</span></td><td><div className="adm-actions"><button onClick={()=>void changeRole(u,u.role==='admin'?'user':'admin')}>{u.role==='admin'?'Remover admin':'Tornar admin'}</button><button className="danger" onClick={()=>void deactivateUser(u)}>Desativar</button></div></td></tr>)}</tbody></table></div>:<Empty>Pesquise um usuário para visualizar ações administrativas.</Empty>}</section></>}
  {tab==='championships'&&<section className="adm-module-grid"><article className="adm-module"><Trophy/><h2>Campeonatos oficiais</h2><p>A área fica no site administrativo. Criação, datas, preço, inscrições, categorias, regras e publicação de resultados serão centralizadas aqui, sem depender do aplicativo.</p><span className="adm-badge">BACKOFFICE WEB</span></article><article className="adm-module"><FileCheck2/><h2>Regulamentos e inscrições</h2><p>Esta etapa é adicional à migração das funções atuais do app e será ligada ao motor de campeonatos já existente.</p></article></section>}
  {tab==='settings'&&<><section className="adm-card"><div className="adm-card-title"><div><small>ECONOMIA</small><h2>Invictus Coins e premiação</h2></div><Settings/></div><form className="adm-form-grid" onSubmit={saveEconomy}><label>Limite piloto<input type="number" value={economy.economy?.pilotUserLimit??1000} onChange={e=>setEconomy({...economy,economy:{...(economy.economy||{}),pilotUserLimit:Number(e.target.value)}})}/></label><label>Cap mensal missões<input type="number" value={economy.economy?.missionMonthlyCap??''} onChange={e=>setEconomy({...economy,economy:{...(economy.economy||{}),missionMonthlyCap:e.target.value?Number(e.target.value):null}})}/></label><label>Top 1<input type="number" value={economy.championship?.top1Prize??2500} onChange={e=>setEconomy({...economy,championship:{...(economy.championship||{}),top1Prize:Number(e.target.value)}})}/></label><label>Top 2<input type="number" value={economy.championship?.top2Prize??1500} onChange={e=>setEconomy({...economy,championship:{...(economy.championship||{}),top2Prize:Number(e.target.value)}})}/></label><label>Top 3<input type="number" value={economy.championship?.top3Prize??1000} onChange={e=>setEconomy({...economy,championship:{...(economy.championship||{}),top3Prize:Number(e.target.value)}})}/></label><label>Participação<input type="number" value={economy.championship?.participationPrize??50} onChange={e=>setEconomy({...economy,championship:{...(economy.championship||{}),participationPrize:Number(e.target.value)}})}/></label><button className="adm-primary" disabled={busy}>Salvar economia</button></form></section><section className="adm-card"><div className="adm-card-title"><div><small>SAQUES</small><h2>Valor mínimo</h2></div><CreditCard/></div><div className="adm-inline"><input type="number" step="0.01" value={minWithdrawal} onChange={e=>setMinWithdrawal(e.target.value)} placeholder="Ex.: 20,00"/><button className="adm-primary" disabled={!minWithdrawal||busy} onClick={()=>void saveMinWithdrawal()}>Atualizar mínimo</button></div></section></>}
  </section></main>;
}
