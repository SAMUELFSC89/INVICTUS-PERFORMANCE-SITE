import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, Clock3, CreditCard, LogIn, RefreshCw, ShieldCheck, Trophy, UserPlus, Users, XCircle } from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import {
  acceptChampionshipRegulation,
  createChampionshipCheckout,
  getChampionship,
  getMyChampionshipRegistrations,
  type Championship,
  type ChampionshipRegistration,
} from '../lib/championshipApi';
import { subscribeAdminRealtime } from '../lib/adminRealtime';
import './PublicPortal.css';
import './AccountPortalEnhancements.css';

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const date = (value?: string) => value ? new Date(value).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : 'A definir';

export default function ChampionshipSignupPage({ championshipId }: { championshipId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [registration, setRegistration] = useState<ChampionshipRegistration | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const lastRevision = useRef<number | null>(null);

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setAuthReady(true); }), []);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const champ = await getChampionship(championshipId);
      setChampionship(champ);
      if (auth.currentUser && champ) {
        const registrations = await getMyChampionshipRegistrations();
        const current = registrations.find(item => item.championshipId === champ.id && item.editionId === champ.editionId) || null;
        setRegistration(current);
      } else {
        setRegistration(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Não foi possível carregar este campeonato.');
    } finally { setLoading(false); }
  }, [championshipId]);

  useEffect(() => { if (authReady) void load(); }, [authReady, user, load]);

  useEffect(() => {
    if (!user) { lastRevision.current = null; return; }
    return subscribeAdminRealtime(state => {
      if (lastRevision.current === null) { lastRevision.current = state.revision; return; }
      if (state.revision === lastRevision.current) return;
      lastRevision.current = state.revision;
      if (state.lastEventType.startsWith('CHAMPIONSHIP_') || state.lastEventType === 'SYSTEM_CHANGED') {
        void load();
      }
    });
  }, [user, load]);

  const login = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setMessage('Conta Invictus conectada. Agora você pode concluir a inscrição.');
    } catch (err: any) {
      setError(err?.code === 'auth/invalid-credential' ? 'E-mail ou senha inválidos.' : (err?.message || 'Não foi possível entrar.'));
    } finally { setBusy(false); }
  };

  const subscribe = async () => {
    if (!championship || !user) return;
    if (!accepted) { setError('Leia e aceite as condições competitivas antes de continuar.'); return; }
    setBusy(true); setError(''); setMessage('');
    try {
      const acceptance = await acceptChampionshipRegulation(championship);
      const checkout = await createChampionshipCheckout(championship.id, acceptance.acceptanceId);
      if (!checkout.checkoutUrl) throw new Error('O checkout de pagamento não está disponível no momento.');
      window.location.assign(checkout.checkoutUrl);
    } catch (err: any) {
      setError(err?.message || 'Não foi possível iniciar a inscrição.');
    } finally { setBusy(false); }
  };

  const isPaid = registration?.paymentStatus === 'PAID' || registration?.status === 'paga' || registration?.status === 'ACTIVE';
  const pending = !isPaid && Boolean(registration);
  const strength = championship?.type === 'arena_musculacao' || championshipId.includes('strength');
  const desktopHero = strength ? 'strength-hero.webp' : 'cardio-hero.webp';
  const mobileHero = strength ? 'strength-hero.webp' : 'cardio-hero-mobile.webp';
  const heroStyle = {
    '--champ-hero': `url(/assets/invictus/${desktopHero})`,
    '--champ-hero-mobile': `url(/assets/invictus/${mobileHero})`,
  } as any;
  const prize = championship?.revealedPrizePool ?? championship?.prizePool ?? 0;
  const statusText = championship?.registrationOpen ? 'INSCRIÇÕES ABERTAS' : (championship?.registrationReadinessReason || 'INSCRIÇÕES INDISPONÍVEIS');
  const category = championship?.categoryLabel || (championshipId.includes('strength') ? 'MUSCULAÇÃO' : 'CARDIO');
  const title = championship?.title || (championshipId.includes('strength') ? 'Campeonato de Musculação' : 'Campeonato de Cardio');
  const rules = useMemo(() => {
    if (!championship) return [];
    const profile: any = championship.antiFraudProfile || {};
    return [
      profile.minDurationMinutes ? `Atividades válidas a partir de ${profile.minDurationMinutes} minutos` : null,
      profile.maxDurationMinutes ? `Limite de ${profile.maxDurationMinutes} minutos por atividade competitiva` : null,
      profile.requireContinuousGPS ? 'GPS contínuo obrigatório para atividades elegíveis' : null,
      profile.requireGeofence ? 'Check-in de academia e geofence obrigatórios' : null,
      'Atividades passam pelo motor de validação e antifraude do Invictus',
      'Resultados e premiação passam por homologação oficial',
    ].filter(Boolean) as string[];
  }, [championship]);

  return <main className="pub-page">
    <header className="pub-header"><button onClick={() => window.location.assign('/campeonatos')}><ArrowLeft size={17}/> Campeonatos</button><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>
    <section className="pub-hero championship-detail-hero" style={heroStyle}>
      <div><p>{category} · CAMPEONATO OFICIAL</p><h1>{title}</h1><span className={championship?.registrationOpen ? 'open' : 'closed'}>{statusText}</span><p className="pub-desc">{championship?.description || 'Competição oficial Invictus com validação, ranking e regras publicadas.'}</p></div>
    </section>

    <div className="pub-layout">
      <section className="pub-main">
        {error && <div className="pub-alert error"><XCircle size={18}/>{error}</div>}
        {message && <div className="pub-alert success"><CheckCircle2 size={18}/>{message}</div>}

        <div className="pub-stats">
          <article><CalendarDays/><small>Início</small><b>{date(championship?.startAt)}</b></article>
          <article><Clock3/><small>Fim</small><b>{date(championship?.endAt)}</b></article>
          <article><Trophy/><small>Premiação publicada</small><b>{prize > 0 ? money(prize) : 'Consultar regulamento'}</b></article>
          <article><Users/><small>Edição</small><b>{championship?.edition || 'Atual'}</b></article>
        </div>

        <section className="pub-card"><p className="pub-eyebrow">COMO A COMPETIÇÃO FUNCIONA</p><h2>Tudo conectado à sua conta Invictus</h2><p>Ao concluir a inscrição, sua vaga fica vinculada à sua conta e também aparece no aplicativo. Assim que o pagamento for confirmado, o status da inscrição é atualizado automaticamente.</p><div className="pub-rule-grid">{rules.map(rule => <div key={rule}><ShieldCheck size={17}/><span>{rule}</span></div>)}</div></section>

        <section className="pub-card"><p className="pub-eyebrow">CALENDÁRIO OFICIAL</p><h2>Inscrição e homologação</h2><div className="pub-timeline"><div><b>Inscrições abrem</b><span>{date(championship?.registrationOpensAt)}</span></div><div><b>Inscrições encerram</b><span>{date(championship?.registrationClosesAt)}</span></div><div><b>Competição termina</b><span>{date(championship?.endAt)}</span></div><div><b>Homologação</b><span>{date(championship?.settlementAt)}</span></div></div></section>
      </section>

      <aside className="pub-checkout">
        <p className="pub-eyebrow">GARANTA SUA VAGA</p>
        <h2>{money(championship?.registrationPrice)}</h2>
        <small>Para se inscrever, use ou crie sua conta Invictus.</small>

        {!authReady || loading ? <div className="pub-loading"><RefreshCw className="spin" size={18}/> Carregando...</div> : !user ? <form onSubmit={login} className="pub-login"><p>Entre com a mesma conta do aplicativo ou crie sua conta para continuar.</p><label>E-mail<input type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email" required/></label><label>Senha<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" required/></label><button disabled={busy}><LogIn size={16}/>{busy?'Entrando...':'Entrar e continuar'}</button><a className="championship-auth-create" href="/conta/cadastro"><UserPlus size={15}/> Criar conta Invictus</a></form> : isPaid ? <div className="pub-confirmed"><BadgeCheck size={30}/><b>Inscrição confirmada</b><p>Sua vaga desta edição já está ativa e também aparece no aplicativo.</p><a href="/conta">Ver na minha conta</a></div> : <>
          <div className="pub-user"><span>{(user.displayName || user.email || 'A').slice(0,1).toUpperCase()}</span><div><b>{user.displayName || 'Atleta Invictus'}</b><small>{user.email}</small></div></div>
          {pending && <div className="pub-alert pending"><CreditCard size={17}/><span>Existe uma inscrição desta edição aguardando confirmação de pagamento. Você pode continuar de onde parou.</span></div>}
          <label className="pub-consent"><input type="checkbox" checked={accepted} onChange={event=>setAccepted(event.target.checked)}/><span>Li as regras da edição e reconheço que dados de frequência cardíaca e sensores possuem limitações técnicas e poderão ser usados conforme os critérios competitivos publicados.</span></label>
          <button className="pub-pay" disabled={busy || !accepted || !championship?.registrationOpen} onClick={()=>void subscribe()}><CreditCard size={17}/>{busy?'Preparando pagamento...':pending?'Continuar pagamento':'Inscrever-se agora'}</button>
          {!championship?.registrationOpen && <p className="pub-disabled">{championship?.registrationReadinessReason || 'As inscrições desta edição não estão abertas.'}</p>}
        </>}
        <footer><ShieldCheck size={15}/> Sua vaga será atualizada automaticamente assim que o pagamento for aprovado.</footer>
      </aside>
    </div>
  </main>;
}
