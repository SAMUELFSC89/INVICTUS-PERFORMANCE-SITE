import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, CreditCard, Dumbbell, FileText, Footprints, KeyRound, LayoutDashboard, LogIn, LogOut, Mail, RefreshCw, ShieldCheck, Smartphone, Trash2, Trophy, UserRound } from 'lucide-react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import { getChampionships, getMyChampionshipRegistrations, type Championship, type ChampionshipRegistration } from '../lib/championshipApi';
import { SUPPORT_EMAIL } from '../lib/publicLegal';
import { subscribeAdminRealtime } from '../lib/adminRealtime';
import { adminRequest } from '../lib/adminApi';
import AppDownloadPanel from './AppDownloadPanel';
import './PublicPortal.css';
import './ChampionshipsLive.css';
import './AccountPortalEnhancements.css';

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const when = (value: unknown) => {
  if (!value) return '—';
  const raw = typeof (value as any)?.toDate === 'function' ? (value as any).toDate() : new Date(String(value));
  return Number.isFinite(raw.getTime()) ? raw.toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
};
const period = (start?: string, end?: string) => {
  if (!start || !end) return 'Calendário em publicação';
  const a = new Date(start); const b = new Date(end);
  if (!Number.isFinite(a.getTime()) || !Number.isFinite(b.getTime())) return 'Calendário em publicação';
  return `${a.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })} — ${b.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })}`;
};

function friendlyAuthError(err: any) {
  const code = String(err?.code || '');
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'E-mail ou senha inválidos.';
  if (code.includes('invalid-email')) return 'Informe um e-mail válido.';
  if (code.includes('too-many-requests')) return 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
  return err?.message || 'Não foi possível concluir esta ação.';
}

export default function AccountPortalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [registrations, setRegistrations] = useState<ChampionshipRegistration[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recovering, setRecovering] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const lastRevision = useRef<number | null>(null);

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    let cancelled = false;
    // Verificação silenciosa: só decide se mostramos o atalho "Painel Admin".
    // A autoridade de verdade continua sendo validada pelo backend em toda chamada real do /admin.
    adminRequest('metrics').then(() => { if (!cancelled) setIsAdmin(true); }).catch(() => { if (!cancelled) setIsAdmin(false); });
    return () => { cancelled = true; };
  }, [user]);

  const load = useCallback(async () => {
    if (!auth.currentUser) { setProfile(null); setChampionships([]); setRegistrations([]); return; }
    setBusy(true); setError('');
    try {
      const [profileSnap, championshipList, registrationList] = await Promise.all([
        getDoc(doc(db, 'users', auth.currentUser.uid)),
        getChampionships(),
        getMyChampionshipRegistrations(),
      ]);
      setProfile(profileSnap.exists() ? profileSnap.data() : null);
      setChampionships(championshipList);
      setRegistrations(registrationList);
    } catch (err: any) {
      setError(err?.message || 'Não foi possível atualizar sua conta.');
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { if (ready) void load(); }, [ready, user, load]);
  useEffect(() => {
    if (!user) { lastRevision.current = null; return; }
    return subscribeAdminRealtime(state => {
      if (lastRevision.current === null) { lastRevision.current = state.revision; return; }
      if (state.revision === lastRevision.current) return;
      lastRevision.current = state.revision;
      if (state.lastEventType.startsWith('CHAMPIONSHIP_') || state.lastEventType === 'SUBSCRIPTION_CHANGED' || state.lastEventType === 'USER_CHANGED' || state.lastEventType === 'SYSTEM_CHANGED') void load();
    });
  }, [user, load]);

  const login = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setResetSent(false);
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch (err: any) { setError(friendlyAuthError(err)); }
    finally { setBusy(false); }
  };

  const sendReset = async (targetEmail: string) => {
    const continueUrl = `${window.location.origin}/conta`;
    try {
      await sendPasswordResetEmail(auth, targetEmail, { url: continueUrl, handleCodeInApp: false });
    } catch (resetError: any) {
      if (String(resetError?.code || '').includes('unauthorized-continue-uri')) await sendPasswordResetEmail(auth, targetEmail);
      else throw resetError;
    }
  };

  const recoverPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) { setError('Informe seu e-mail para recuperar a senha.'); return; }
    setBusy(true); setError(''); setResetSent(false);
    try { await sendReset(email.trim()); setResetSent(true); }
    catch (err: any) { setError(friendlyAuthError(err)); }
    finally { setBusy(false); }
  };

  const changePassword = async () => {
    const currentEmail = auth.currentUser?.email;
    if (!currentEmail) return;
    setBusy(true); setError(''); setNotice('');
    try { await sendReset(currentEmail); setNotice('Enviamos um e-mail para você definir uma nova senha.'); }
    catch (err: any) { setError(friendlyAuthError(err)); }
    finally { setBusy(false); }
  };

  if (!ready) return <main className="pub-page"><div className="pub-loading" style={{padding:40}}><RefreshCw className="spin" size={18}/> Carregando sua conta...</div></main>;

  if (!user) return <main className="pub-page account-portal">
    <header className="pub-header"><a href="/"><ArrowLeft size={17}/> Voltar</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><span/></header>
    <section className="account-login-wrap"><form onSubmit={recovering ? recoverPassword : login} className="account-login-card">{recovering ? <KeyRound size={30}/> : <UserRound size={30}/>}<p className="pub-eyebrow">CONTA ÚNICA INVICTUS</p><h1>{recovering ? 'RECUPERAR SENHA' : 'ENTRAR'}</h1><p>{recovering ? 'Informe o e-mail da sua conta Invictus. Você receberá o link oficial para definir uma nova senha.' : 'Use a mesma conta do aplicativo para acessar campeonatos, inscrições e sua área de usuário.'}</p>{!recovering&&<div className="account-login-switch">Ainda não tem conta? <a href="/conta/cadastro">Criar conta</a></div>}{error&&<div className="pub-alert error">{error}</div>}{resetSent&&<div className="pub-alert success"><CheckCircle2 size={16}/>E-mail de recuperação enviado. Confira sua caixa de entrada e spam.</div>}<label>E-mail<input type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email" required/></label>{!recovering&&<label>Senha<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" required/></label>}<button disabled={busy}>{recovering ? <KeyRound size={16}/> : <LogIn size={16}/>} {busy ? 'Processando...' : recovering ? 'Enviar recuperação' : 'Entrar na conta'}</button><div className="account-login-secondary">{recovering ? <button type="button" onClick={()=>{setRecovering(false);setError('');setResetSent(false);}}>Voltar ao login</button> : <button type="button" onClick={()=>{setRecovering(true);setError('');setResetSent(false);}}>Esqueci minha senha</button>}</div></form></section>
  </main>;

  const paid = registrations.filter(item => item.paymentStatus === 'PAID' || item.status === 'paga' || item.status === 'ACTIVE');
  const pending = registrations.filter(item => !paid.includes(item));
  const displayName = profile?.displayName || user.displayName || 'Atleta Invictus';
  const tier = String(profile?.subscriptionTier || profile?.plan || 'open').toUpperCase();

  return <main className="pub-page account-portal">
    <header className="pub-header"><a href="/"><ArrowLeft size={17}/> Início</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><button onClick={()=>void signOut(auth)}><LogOut size={16}/> Sair</button></header>
    <section className="account-live-hero" id="dados"><div><p className="pub-eyebrow">MINHA CONTA</p><h1>{displayName}</h1><p>{user.email}</p><span><BadgeCheck size={15}/> PLANO {tier}</span></div></section>
    <div className="account-live-shell">
      {error&&<div className="pub-alert error">{error}</div>}
      {notice&&<div className="pub-alert success"><CheckCircle2 size={16}/>{notice}</div>}
      <div className="account-live-metrics"><article><Trophy/><small>Inscrições ativas</small><b>{paid.length}</b></article><article><CreditCard/><small>Aguardando pagamento</small><b>{pending.length}</b></article><article><BadgeCheck/><small>Conta</small><b>Ativa</b></article></div>

      <section className="pub-card account-menu-section">
        <div className="account-section-head"><div><p className="pub-eyebrow">CONTA E SUPORTE</p><h2>O que você precisa?</h2><p className="account-section-copy">Acesse rapidamente suas inscrições, segurança, documentos e canais de contato.</p></div></div>
        <div className="account-menu-grid">
          {isAdmin && <a href="/admin" className="account-admin-entry"><LayoutDashboard/><div><b>Painel Admin</b><span>Central administrativa Invictus</span></div><ArrowRight/></a>}
          <a href="#campeonatos"><Trophy/><div><b>Campeonatos</b><span>Ver edições disponíveis</span></div><ArrowRight/></a>
          <a href="#inscricoes"><BadgeCheck/><div><b>Minhas inscrições</b><span>Acompanhar participação</span></div><ArrowRight/></a>
          <a href="#aplicativo"><Smartphone/><div><b>Baixar aplicativo</b><span>App Store e Google Play</span></div><ArrowRight/></a>
          <button onClick={()=>void changePassword()} disabled={busy}><KeyRound/><div><b>Alterar senha</b><span>Receber link por e-mail</span></div><ArrowRight/></button>
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Suporte%20Invictus`}><Mail/><div><b>Entrar em contato</b><span>{SUPPORT_EMAIL}</span></div><ArrowRight/></a>
          <a href="/termos"><FileText/><div><b>Termos de Uso</b><span>Condições da plataforma</span></div><ArrowRight/></a>
          <a href="/privacidade"><ShieldCheck/><div><b>Privacidade</b><span>Dados, direitos e proteção</span></div><ArrowRight/></a>
          <a href="/conta/excluir" className="danger"><Trash2/><div><b>Excluir conta</b><span>Solicitar exclusão dos dados</span></div><ArrowRight/></a>
        </div>
      </section>

      <section className="pub-card account-championships-section" id="campeonatos">
        <div className="account-section-head"><div><p className="pub-eyebrow">CAMPEONATOS OFICIAIS</p><h2>Campeonatos disponíveis</h2><p className="account-section-copy">Escolha uma modalidade e conclua sua inscrição usando esta mesma conta Invictus.</p></div><button onClick={()=>void load()} disabled={busy}><RefreshCw className={busy?'spin':''} size={15}/> Atualizar</button></div>
        {championships.length ? <div className="live-champs-grid account-championship-grid">{championships.map(champ => {
          const cardio = champ.type === 'run_elite_corrida';
          const href = cardio ? '/campeonatos/cardio' : '/campeonatos/musculacao';
          const registration = registrations.find(item => item.championshipId === champ.id && item.editionId === champ.editionId);
          const registrationPaid = registration?.paymentStatus === 'PAID' || registration?.status === 'paga' || registration?.status === 'ACTIVE';
          const cta = registrationPaid ? 'Inscrição confirmada' : registration ? 'Continuar inscrição' : champ.registrationOpen ? 'Inscrever-se' : 'Ver campeonato';
          return <a className="live-champ-card" href={href} key={`${champ.id}-${champ.editionId}`}>
            <div className="live-champ-img"><span className={champ.registrationOpen?'open':'closed'}>{champ.registrationOpen?'INSCRIÇÕES ABERTAS':'INDISPONÍVEL'}</span>{cardio?<Footprints/>:<Dumbbell/>}</div>
            <div className="live-champ-body"><small>{champ.categoryLabel} · {champ.edition}</small><h3>{champ.title}</h3><p>{champ.subtitle || champ.description}</p><div className="live-champ-meta"><span><CalendarDays/> {period(champ.startAt,champ.endAt)}</span><span><Trophy/> {money(champ.registrationPrice)}</span></div>{registrationPaid&&<em className="account-registration-inline paid">Sua inscrição nesta edição já está ativa.</em>}{registration&&!registrationPaid&&<em className="account-registration-inline pending">Você possui uma inscrição aguardando conclusão.</em>}{!champ.registrationOpen&&!registration&&<em>{champ.registrationReadinessReason || 'Inscrições ainda não abertas.'}</em>}<b>{cta} <ArrowRight size={14}/></b></div>
          </a>;
        })}</div> : <div className="pub-loading">Nenhum campeonato disponível neste momento.</div>}
      </section>

      <section className="pub-card" id="inscricoes"><div className="account-section-head"><div><p className="pub-eyebrow">MINHA PARTICIPAÇÃO</p><h2>Minhas inscrições</h2></div><button onClick={()=>void load()} disabled={busy}><RefreshCw className={busy?'spin':''} size={15}/> Atualizar</button></div>{registrations.length ? <div className="account-registration-list">{registrations.map((item,index)=>{const isPaid=item.paymentStatus==='PAID'||item.status==='paga'||item.status==='ACTIVE';return <article key={`${item.championshipId}-${item.editionId}-${index}`}><div><b>{item.championshipId==='invictus_cardio_v1'?'Campeonato de Cardio':item.championshipId==='invictus_strength_v1'?'Campeonato de Musculação':item.championshipId}</b><small>Edição {item.editionId || 'atual'} · {when(item.pagaEm || item.criadaEm)}</small></div><div className="account-registration-status"><span className={isPaid?'paid':'pending'}>{isPaid?'ATIVA':'PENDENTE'}</span><strong>{money(item.valor ?? item.amount)}</strong></div></article>})}</div> : <div className="pub-loading">Você ainda não possui inscrição em campeonato nesta conta.</div>}</section>

      <AppDownloadPanel/>
    </div>
  </main>;
}
