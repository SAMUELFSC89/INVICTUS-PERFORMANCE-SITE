import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, BadgeCheck, CheckCircle2, CreditCard, KeyRound, LogIn, LogOut, RefreshCw, Trophy, UserRound } from 'lucide-react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import { getMyChampionshipRegistrations, type ChampionshipRegistration } from '../lib/championshipApi';
import { subscribeAdminRealtime } from '../lib/adminRealtime';
import './PublicPortal.css';
import './AccountPortalEnhancements.css';

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const when = (value: unknown) => {
  if (!value) return '—';
  const raw = typeof (value as any)?.toDate === 'function' ? (value as any).toDate() : new Date(String(value));
  return Number.isFinite(raw.getTime()) ? raw.toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
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
  const [registrations, setRegistrations] = useState<ChampionshipRegistration[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recovering, setRecovering] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const lastRevision = useRef<number | null>(null);

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  const load = useCallback(async () => {
    if (!auth.currentUser) { setProfile(null); setRegistrations([]); return; }
    setBusy(true); setError('');
    try {
      const [profileSnap, registrationList] = await Promise.all([
        getDoc(doc(db, 'users', auth.currentUser.uid)),
        getMyChampionshipRegistrations(),
      ]);
      setProfile(profileSnap.exists() ? profileSnap.data() : null);
      setRegistrations(registrationList);
    } catch (err: any) {
      setError(err?.message || 'Não foi possível sincronizar sua conta.');
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

  const recoverPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) { setError('Informe seu e-mail para recuperar a senha.'); return; }
    setBusy(true); setError(''); setResetSent(false);
    try {
      const continueUrl = `${window.location.origin}/conta`;
      try {
        await sendPasswordResetEmail(auth, email.trim(), { url: continueUrl, handleCodeInApp: false });
      } catch (resetError: any) {
        if (String(resetError?.code || '').includes('unauthorized-continue-uri')) {
          await sendPasswordResetEmail(auth, email.trim());
        } else {
          throw resetError;
        }
      }
      setResetSent(true);
    } catch (err: any) {
      setError(friendlyAuthError(err));
    } finally { setBusy(false); }
  };

  if (!ready) return <main className="pub-page"><div className="pub-loading" style={{padding:40}}><RefreshCw className="spin" size={18}/> Sincronizando conta Invictus...</div></main>;

  if (!user) return <main className="pub-page account-portal">
    <header className="pub-header"><a href="/"><ArrowLeft size={17}/> Voltar</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><span/></header>
    <section className="account-login-wrap"><form onSubmit={recovering ? recoverPassword : login} className="account-login-card">{recovering ? <KeyRound size={30}/> : <UserRound size={30}/>}<p className="pub-eyebrow">CONTA ÚNICA INVICTUS</p><h1>{recovering ? 'RECUPERAR SENHA' : 'ENTRAR'}</h1><p>{recovering ? 'Informe o e-mail da sua conta Invictus. Você receberá o link oficial para definir uma nova senha.' : 'Use a mesma conta do aplicativo. Seus campeonatos, pagamentos e status ficam sincronizados entre app e site.'}</p>{error&&<div className="pub-alert error">{error}</div>}{resetSent&&<div className="pub-alert success"><CheckCircle2 size={16}/>E-mail de recuperação enviado. Confira sua caixa de entrada e spam.</div>}<label>E-mail<input type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email" required/></label>{!recovering&&<label>Senha<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" required/></label>}<button disabled={busy}>{recovering ? <KeyRound size={16}/> : <LogIn size={16}/>} {busy ? 'Processando...' : recovering ? 'Enviar recuperação' : 'Entrar na conta'}</button><div className="account-login-secondary">{recovering ? <button type="button" onClick={()=>{setRecovering(false);setError('');setResetSent(false);}}>Voltar ao login</button> : <><button type="button" onClick={()=>{setRecovering(true);setError('');setResetSent(false);}}>Esqueci minha senha</button><a href="/conta/cadastro">Criar conta</a></>}</div></form></section>
  </main>;

  const paid = registrations.filter(item => item.paymentStatus === 'PAID' || item.status === 'paga' || item.status === 'ACTIVE');
  const pending = registrations.filter(item => !paid.includes(item));
  const displayName = profile?.displayName || user.displayName || 'Atleta Invictus';
  const tier = String(profile?.subscriptionTier || profile?.plan || 'open').toUpperCase();

  return <main className="pub-page account-portal">
    <header className="pub-header"><a href="/"><ArrowLeft size={17}/> Início</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><button onClick={()=>void signOut(auth)}><LogOut size={16}/> Sair</button></header>
    <section className="account-live-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(4,4,4,.96),rgba(4,4,4,.35)),url(/assets/invictus/account-hero.webp)'}}><div><p className="pub-eyebrow">MINHA CONTA</p><h1>{displayName}</h1><p>{user.email}</p><span><BadgeCheck size={15}/> PLANO {tier}</span></div></section>
    <div className="account-live-shell">
      {error&&<div className="pub-alert error">{error}</div>}
      <div className="account-live-metrics"><article><Trophy/><small>Inscrições ativas</small><b>{paid.length}</b></article><article><CreditCard/><small>Aguardando pagamento</small><b>{pending.length}</b></article><article><BadgeCheck/><small>Conta</small><b>Sincronizada</b></article></div>
      <section className="pub-card"><div className="account-section-head"><div><p className="pub-eyebrow">CAMPEONATOS</p><h2>Minhas inscrições</h2></div><button onClick={()=>void load()} disabled={busy}><RefreshCw className={busy?'spin':''} size={15}/> Atualizar</button></div>{registrations.length ? <div className="account-registration-list">{registrations.map((item,index)=>{const isPaid=item.paymentStatus==='PAID'||item.status==='paga'||item.status==='ACTIVE';return <article key={`${item.championshipId}-${item.editionId}-${index}`}><div><b>{item.championshipId==='invictus_cardio_v1'?'Campeonato de Cardio':item.championshipId==='invictus_strength_v1'?'Campeonato de Musculação':item.championshipId}</b><small>Edição {item.editionId || 'atual'} · {when(item.pagaEm || item.criadaEm)}</small></div><div className="account-registration-status"><span className={isPaid?'paid':'pending'}>{isPaid?'ATIVA':'PENDENTE'}</span><strong>{money(item.valor ?? item.amount)}</strong></div></article>})}</div> : <div className="pub-loading">Você ainda não possui inscrição em campeonato nesta conta.</div>}</section>
    </div>
  </main>;
}