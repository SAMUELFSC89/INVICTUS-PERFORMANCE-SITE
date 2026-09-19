import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, Clock3, CreditCard, FileText, HeartPulse, LogIn, RefreshCw, ShieldCheck, Trophy, UserPlus, Users, XCircle } from 'lucide-react';
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
import {
  COMPETITIVE_HR_CHECKBOX,
  COMPETITIVE_HR_FULL_TEXT,
  COMPETITIVE_HR_SUMMARY,
  LEGAL_PRIVACY_POLICY,
  LEGAL_TERMS_OF_USE,
  PRIVACY_POLICY_VERSION,
  TERMS_VERSION,
  getChampionshipRuleSections,
} from '../lib/publicLegal';
import { subscribeAdminRealtime } from '../lib/adminRealtime';
import AppDownloadPanel from './AppDownloadPanel';
import './PublicPortal.css';
import './AccountPortalEnhancements.css';

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const date = (value?: string) => value ? new Date(value).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : 'A definir';
const cardioLabel=(value:string)=>({running:'Corrida',walking:'Caminhada',cycling:'Ciclismo',bike:'Ciclismo',swimming:'Natação'}[value.toLowerCase()]||value.replaceAll('_',' '));
function LegalText({text}:{text:string}){return <div className="championship-legal-text">{text.split('\n').map((line,index)=>line.trim()===''?<br key={index}/>:<p key={index}>{line}</p>)}</div>}

export default function ChampionshipSignupPage({ championshipId }: { championshipId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [registration, setRegistration] = useState<ChampionshipRegistration | null>(null);
  const [acceptedRegulation, setAcceptedRegulation] = useState(false);
  const [acceptedHr, setAcceptedHr] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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
      } else setRegistration(null);
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
      if (state.lastEventType.startsWith('CHAMPIONSHIP_') || state.lastEventType === 'SYSTEM_CHANGED') void load();
    });
  }, [user, load]);

  const login = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setMessage('Conta Invictus conectada. Revise os aceites para concluir sua inscrição.');
    } catch (err: any) {
      setError(err?.code === 'auth/invalid-credential' ? 'E-mail ou senha inválidos.' : (err?.message || 'Não foi possível entrar.'));
    } finally { setBusy(false); }
  };

  const allAccepted=acceptedRegulation&&acceptedHr&&acceptedTerms;
  const subscribe = async () => {
    if (!championship || !user) return;
    if (!allAccepted) { setError('Revise e confirme o regulamento, a ciência de frequência cardíaca e os termos antes de continuar.'); return; }
    setBusy(true); setError(''); setMessage('');
    try {
      const acceptance = await acceptChampionshipRegulation(championship);
      const checkout = await createChampionshipCheckout(championship.id, acceptance.acceptanceId);
      if (!checkout.checkoutUrl) throw new Error('O pagamento não está disponível no momento.');
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
  const heroStyle = {'--champ-hero':`url(/assets/invictus/${desktopHero})`,'--champ-hero-mobile':`url(/assets/invictus/${mobileHero})`} as any;
  const prize = championship?.revealedPrizePool ?? championship?.prizePool ?? 0;
  const prizeDistribution=championship?.revealedPrizeDistribution?.length?championship.revealedPrizeDistribution:(championship?.prizeDistribution||[]);
  const statusText = championship?.registrationOpen ? 'INSCRIÇÕES ABERTAS' : (championship?.registrationReadinessReason || 'INSCRIÇÕES INDISPONÍVEIS');
  const category = championship?.categoryLabel || (strength ? 'MUSCULAÇÃO' : 'CARDIO');
  const title = championship?.title || (strength ? 'Campeonato de Musculação' : 'Campeonato de Cardio');
  const regulations=useMemo(()=>championship?getChampionshipRuleSections(championship):[],[championship]);
  const profile=championship?.antiFraudProfile;
  const quickRules=useMemo(()=>{
    if(!championship)return[];
    return [
      profile?.minDurationMinutes?`Atividades válidas a partir de ${profile.minDurationMinutes} minutos`:null,
      profile?.maxDurationMinutes?`Limite de ${profile.maxDurationMinutes} minutos por atividade`:null,
      profile?.requireContinuousGPS?'GPS contínuo obrigatório nas atividades elegíveis':null,
      profile?.requireGeofence?'Comprovação de presença obrigatória quando indicada pela edição':null,
      profile?.allowedCardioTypes?.length?`Modalidades aceitas: ${profile.allowedCardioTypes.map(cardioLabel).join(', ')}`:null,
      'Atividades podem passar por validação e revisão de integridade',
      'Resultados e premiação são homologados após o encerramento',
    ].filter(Boolean) as string[];
  },[championship,profile]);

  return <main className="pub-page championship-full-page">
    <header className="pub-header"><button onClick={() => window.location.assign('/campeonatos')}><ArrowLeft size={17}/> Campeonatos</button><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>
    <section className="pub-hero championship-detail-hero" style={heroStyle}><div><p>{category} · CAMPEONATO OFICIAL</p><h1>{title}</h1><span className={championship?.registrationOpen ? 'open' : 'closed'}>{statusText}</span><p className="pub-desc">{championship?.description || 'Competição oficial Invictus com ranking, regras publicadas e atividades validadas.'}</p></div></section>

    <div className="pub-layout">
      <section className="pub-main">
        {error && <div className="pub-alert error"><XCircle size={18}/>{error}</div>}
        {message && <div className="pub-alert success"><CheckCircle2 size={18}/>{message}</div>}

        <div className="pub-stats">
          <article><CalendarDays/><small>Início</small><b>{date(championship?.startAt)}</b></article>
          <article><Clock3/><small>Fim</small><b>{date(championship?.endAt)}</b></article>
          <article><Trophy/><small>Premiação</small><b>{prize > 0 ? money(prize) : 'Consultar edição'}</b></article>
          <article><Users/><small>Edição</small><b>{championship?.edition || 'Atual'}</b></article>
        </div>

        <section className="pub-card championship-info-card"><p className="pub-eyebrow">INFORMAÇÕES DA COMPETIÇÃO</p><h2>Antes de se inscrever</h2><p>{championship?.subtitle||championship?.description}</p><div className="pub-rule-grid">{quickRules.map(rule=><div key={rule}><ShieldCheck size={17}/><span>{rule}</span></div>)}</div></section>

        <section className="pub-card"><p className="pub-eyebrow">CALENDÁRIO OFICIAL</p><h2>Datas desta edição</h2><div className="pub-timeline"><div><b>Inscrições abrem</b><span>{date(championship?.registrationOpensAt)}</span></div><div><b>Inscrições encerram</b><span>{date(championship?.registrationClosesAt)}</span></div><div><b>Competição começa</b><span>{date(championship?.startAt)}</span></div><div><b>Competição termina</b><span>{date(championship?.endAt)}</span></div><div><b>Homologação</b><span>{date(championship?.settlementAt)}</span></div></div></section>

        <section className="pub-card championship-prizes"><p className="pub-eyebrow">PREMIAÇÃO</p><h2>Distribuição publicada</h2>{prizeDistribution.length?<div className="championship-prize-list">{prizeDistribution.map(item=><article key={`${item.rank}-${item.label}`}><strong>{item.rank}º</strong><div><b>{item.label||`${item.rank}º lugar`}</b>{item.percentage!==undefined&&<span>{item.percentage}% da premiação</span>}</div><em>{money(item.amount)}</em></article>)}</div>:<p>A distribuição será exibida aqui quando estiver publicada para esta edição.</p>}</section>

        <section className="pub-card championship-regulation-card"><p className="pub-eyebrow">REGULAMENTO OFICIAL</p><h2>Regras completas da edição</h2><div className="championship-regulation-version">Versão {championship?.regulationVersion||'vigente'}</div><div className="championship-regulation-sections">{regulations.map(section=><article key={section.id}><h3>{section.title}</h3><p>{section.body}</p></article>)}</div></section>

        <section className="pub-card championship-legal-card"><p className="pub-eyebrow">TERMOS E CIÊNCIAS</p><h2>Documentos aplicáveis</h2><p>Leia os documentos abaixo antes de confirmar sua participação.</p>
          <details open><summary><HeartPulse/> Frequência cardíaca e competição</summary><p className="championship-legal-summary">{COMPETITIVE_HR_SUMMARY}</p><LegalText text={COMPETITIVE_HR_FULL_TEXT}/></details>
          <details><summary><FileText/> Termos de Uso · versão {TERMS_VERSION}</summary><LegalText text={LEGAL_TERMS_OF_USE}/></details>
          <details><summary><ShieldCheck/> Política de Privacidade · versão {PRIVACY_POLICY_VERSION}</summary><LegalText text={LEGAL_PRIVACY_POLICY}/></details>
          <div className="championship-legal-links"><a href="/termos" target="_blank" rel="noreferrer">Abrir Termos em página própria</a><a href="/privacidade" target="_blank" rel="noreferrer">Abrir Política de Privacidade</a></div>
        </section>
      </section>

      <aside className="pub-checkout">
        <p className="pub-eyebrow">GARANTA SUA VAGA</p><h2>{money(championship?.registrationPrice)}</h2><small>Para se inscrever, use ou crie sua conta Invictus.</small>
        {!authReady || loading ? <div className="pub-loading"><RefreshCw className="spin" size={18}/> Carregando...</div> : !user ? <form onSubmit={login} className="pub-login"><p>Entre com a mesma conta do aplicativo ou crie sua conta para continuar.</p><label>E-mail<input type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email" required/></label><label>Senha<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" required/></label><button disabled={busy}><LogIn size={16}/>{busy?'Entrando...':'Entrar e continuar'}</button><a className="championship-auth-create" href="/conta/cadastro"><UserPlus size={15}/> Criar conta Invictus</a></form> : isPaid ? <div className="pub-confirmed"><BadgeCheck size={30}/><b>Inscrição confirmada</b><p>Sua vaga desta edição já está ativa.</p><a href="/conta">Ver na minha conta</a><AppDownloadPanel compact/></div> : <>
          <div className="pub-user"><span>{(user.displayName || user.email || 'A').slice(0,1).toUpperCase()}</span><div><b>{user.displayName || 'Atleta Invictus'}</b><small>{user.email}</small></div></div>
          {pending && <div className="pub-alert pending"><CreditCard size={17}/><span>Existe uma inscrição desta edição aguardando conclusão. Você pode continuar de onde parou.</span></div>}
          <div className="championship-acceptances">
            <label className="pub-consent"><input type="checkbox" checked={acceptedRegulation} onChange={event=>setAcceptedRegulation(event.target.checked)}/><span>Li e aceito o regulamento completo desta edição, versão {championship?.regulationVersion||'vigente'}.</span></label>
            <label className="pub-consent"><input type="checkbox" checked={acceptedHr} onChange={event=>setAcceptedHr(event.target.checked)}/><span>{COMPETITIVE_HR_CHECKBOX}</span></label>
            <label className="pub-consent"><input type="checkbox" checked={acceptedTerms} onChange={event=>setAcceptedTerms(event.target.checked)}/><span>Li e aceito os <a href="/termos" target="_blank" rel="noreferrer">Termos de Uso</a> e declaro ciência da <a href="/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>.</span></label>
          </div>
          <button className="pub-pay" disabled={busy || !allAccepted || !championship?.registrationOpen} onClick={()=>void subscribe()}><CreditCard size={17}/>{busy?'Preparando pagamento...':pending?'Continuar inscrição':'Inscrever-se agora'}</button>
          {!championship?.registrationOpen && <p className="pub-disabled">{championship?.registrationReadinessReason || 'As inscrições desta edição não estão abertas.'}</p>}
        </>}
        <footer><ShieldCheck size={15}/> Confira o regulamento e os termos antes de confirmar sua inscrição.</footer>
      </aside>
    </div>
  </main>;
}
