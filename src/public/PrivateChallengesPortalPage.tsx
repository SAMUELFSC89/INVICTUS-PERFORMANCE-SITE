import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, CheckCircle2, Coins, Copy, Crown, Lock, LogIn, Plus, RefreshCw, ShieldCheck, Trophy, UserPlus, Users } from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import { hasActiveProEntitlement } from '../lib/proEntitlement';
import { createPrivateChallenge, joinPrivateChallenge, listPrivateChallenges, type PrivateChallenge } from '../lib/privateChallengesApi';
import './PrivateChallengesPortal.css';

type Mode = 'ativos' | 'criar' | 'entrar';
const STAKE_PRESETS = [0, 50, 100, 250] as const;

const statusLabel = (value: unknown) => {
  const status = String(value || '').toLowerCase();
  if (status === 'active') return 'ATIVO';
  if (status === 'forming') return 'FORMANDO GRUPO';
  if (status === 'completed' || status === 'finished') return 'FINALIZADO';
  if (status === 'cancelled') return 'CANCELADO';
  return status ? status.replaceAll('_', ' ').toUpperCase() : 'ATIVO';
};

const resultCopy = (challenge: PrivateChallenge) => {
  if (challenge.winnerName) return `Campeão: ${challenge.winnerName}`;
  const reason = String(challenge.resultReason || '');
  if (reason === 'TOP_SCORE_TIE') return 'Empate no topo: regra de extensão/desempate aplicada.';
  if (String(challenge.resultStatus || '').includes('SPLIT')) return 'Pote dividido entre os atletas empatados no topo.';
  if (String(challenge.resultStatus || '').includes('CANCELLED')) return 'Desafio cancelado e Coins devolvidas aos participantes.';
  return '';
};

export default function PrivateChallengesPortalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [mode, setMode] = useState<Mode>('ativos');
  const [challenges, setChallenges] = useState<PrivateChallenge[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState<7 | 15 | 30>(7);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  const loadProfile = useCallback(async () => {
    if (!auth.currentUser) { setProfile(null); return null; }
    const snapshot = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const value = snapshot.exists() ? snapshot.data() : null;
    setProfile(value);
    return value;
  }, []);

  const loadChallenges = useCallback(async () => {
    if (!auth.currentUser) return;
    setBusy(true); setError('');
    try { setChallenges(await listPrivateChallenges()); }
    catch (err: any) { setError(err?.message || 'Não foi possível carregar seus desafios.'); }
    finally { setBusy(false); }
  }, []);

  useEffect(() => {
    if (!ready || !user) { if (ready) setProfile(null); return; }
    void (async () => {
      setBusy(true); setError('');
      try {
        const currentProfile = await loadProfile();
        if (hasActiveProEntitlement(currentProfile)) setChallenges(await listPrivateChallenges());
      } catch (err: any) { setError(err?.message || 'Não foi possível sincronizar sua conta.'); }
      finally { setBusy(false); }
    })();
  }, [ready, user, loadProfile]);

  const isPro = useMemo(() => hasActiveProEntitlement(profile), [profile]);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    const normalizedStake = Math.max(0, Math.min(2000, Math.floor(Number(stakeAmount) || 0)));
    setBusy(true); setError(''); setSuccess('');
    try {
      const result = await createPrivateChallenge({
        title: title.trim(),
        description: description.trim(),
        durationDays,
        stakeAmount: normalizedStake,
      });
      const code = String(result?.inviteCode || '').trim();
      const confirmedStake = Math.max(0, Number(result?.stakeAmount ?? normalizedStake) || 0);
      setSuccess(confirmedStake > 0
        ? `Desafio criado. ${confirmedStake} Coins foram reservadas para o prêmio. Código: ${code || 'gerado pelo servidor'}.`
        : code ? `Desafio criado. Código de convite: ${code}` : 'Desafio criado com sucesso.');
      setTitle(''); setDescription(''); setStakeAmount(0); setMode('ativos');
      setChallenges(await listPrivateChallenges());
    } catch (err: any) { setError(err?.message || 'Não foi possível criar o desafio.'); }
    finally { setBusy(false); }
  };

  const join = async (event: FormEvent) => {
    event.preventDefault();
    if (!inviteCode.trim()) return;
    setBusy(true); setError(''); setSuccess('');
    try {
      const result = await joinPrivateChallenge(inviteCode);
      const confirmedStake = Math.max(0, Number(result?.stakeAmount) || 0);
      setSuccess(confirmedStake > 0
        ? `Você entrou no desafio. ${confirmedStake} Coins foram debitadas para compor o pote.`
        : 'Você entrou no desafio com sucesso.');
      setInviteCode(''); setMode('ativos');
      setChallenges(await listPrivateChallenges());
    } catch (err: any) { setError(err?.message || 'Não foi possível entrar no desafio.'); }
    finally { setBusy(false); }
  };

  const copyCode = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(code); window.setTimeout(() => setCopied(''), 1800); }
    catch { setError('Não foi possível copiar o código automaticamente.'); }
  };

  return <main className="friends-live-page">
    <header className="friends-live-header"><a href="/"><ArrowLeft size={17}/> Início</a><a className="friends-live-logo" href="/">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>

    <section className="friends-live-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(4,4,4,.97),rgba(4,4,4,.42)),url(/assets/invictus/friends-hero.webp)'}}>
      <div><p>BENEFÍCIO EXCLUSIVO INVICTUS PRO</p><h1>ENTRE <em>AMIGOS</em></h1><h2>Seu treino vira uma disputa de verdade.</h2><span>Crie um desafio privado, convide seus amigos e acompanhe a classificação pelo IGA dentro da janela oficial do desafio. Se o grupo quiser, cada participante pode colocar Invictus Coins para formar um pote interno para o vencedor.</span><div className="friends-live-chips"><b><BarChart3 size={14}/> RANKING POR IGA</b><b><Coins size={14}/> COINS OPCIONAIS</b><b><Users size={14}/> GRUPO PRIVADO</b></div></div>
    </section>

    <div className="friends-live-shell">
      {!ready || busy && !profile ? <div className="friends-live-loading"><RefreshCw className="spin" size={19}/> Sincronizando com o Invictus...</div> : !user ? <section className="friends-live-gate"><LogIn size={34}/><p>CONTA ÚNICA INVICTUS</p><h2>Entre para criar ou participar</h2><span>O Entre Amigos usa a mesma conta, saldo de Coins e dados competitivos do aplicativo.</span><a href="/conta">Entrar na minha conta</a></section> : !isPro ? <section className="friends-live-gate"><Lock size={34}/><p>INVICTUS PRO</p><h2>Recurso exclusivo do plano PRO</h2><span>Criação e participação em Desafios Privados exigem um entitlement PRO ativo.</span><a href="/conta">Ver minha conta</a></section> : <>
        <section className="friends-live-console">
          <div className="friends-live-console-head"><div><p>DESAFIOS PRIVADOS</p><h2>Gerencie sua disputa</h2></div><button onClick={() => void loadChallenges()} disabled={busy}><RefreshCw className={busy?'spin':''} size={15}/> Atualizar</button></div>
          <div className="friends-live-tabs"><button className={mode==='ativos'?'active':''} onClick={()=>setMode('ativos')}><Trophy size={15}/> Ativos</button><button className={mode==='criar'?'active':''} onClick={()=>setMode('criar')}><Plus size={15}/> Criar</button><button className={mode==='entrar'?'active':''} onClick={()=>setMode('entrar')}><UserPlus size={15}/> Usar código</button></div>
          {error&&<div className="friends-live-alert error">{error}</div>}
          {success&&<div className="friends-live-alert success"><CheckCircle2 size={15}/>{success}</div>}

          {mode==='ativos' && <div className="friends-live-list">{challenges.length ? challenges.map((challenge,index)=>{
            const code=String(challenge.inviteCode||'').trim();
            const count=Number(challenge.participantsCount ?? challenge.participantCount ?? 0);
            const stake=Math.max(0,Number(challenge.stakeAmount)||0);
            const pot=Math.max(0,Number(challenge.potTotal)||0);
            const result=resultCopy(challenge);
            const members=Array.isArray(challenge.members)?challenge.members:[];
            const usesIga=String(challenge.scoringMode||'IGA').toUpperCase()==='IGA'&&!challenge.isLegacyMoneyChallenge;
            const isLive=['active','forming'].includes(String(challenge.status||'').toLowerCase());
            return <article key={String(challenge.id||`${challenge.title}-${index}`)}>
              <div className="friends-live-card-copy"><span className="friends-live-status">{statusLabel(challenge.status)}</span><h3>{String(challenge.title||'Desafio privado')}</h3><p>{String(challenge.description||'Disputa privada entre atletas Invictus.')}</p>{result&&<small className="friends-live-result"><Crown size={13}/>{result}</small>}</div>
              <div className="friends-live-meta"><span><Users size={14}/>{count || '—'} participantes</span>{challenge.durationDays&&<span>{challenge.durationDays} dias</span>}{stake>0&&<span className="friends-live-coin"><Coins size={14}/>{stake} Coins / atleta</span>}{pot>0&&<span className="friends-live-coin"><Trophy size={14}/>Pote {pot} Coins</span>}{challenge.extendedOnce&&<span>+1 dia de desempate</span>}{code&&<button onClick={()=>void copyCode(code)}><Copy size={14}/>{copied===code?'Copiado':code}</button>}</div>
              {members.length>0&&<div className="friends-live-ranking">
                <div className="friends-live-ranking-head"><div><BarChart3 size={15}/><span>{usesIga?'CLASSIFICAÇÃO POR IGA':'CLASSIFICAÇÃO LEGADA'}</span></div><small>{usesIga?(isLive?'IGA calculado do início do desafio até agora':'IGA final da janela oficial'):'Registro histórico'}</small></div>
                <div className="friends-live-ranking-rows">{members.slice(0,10).map((member,memberIndex)=>{
                  const score=Math.max(0,Number(member.igaScore ?? member.points)||0);
                  const isMe=member.userId===user.uid;
                  return <div className={`friends-live-ranking-row${isMe?' me':''}`} key={String(member.userId||memberIndex)}>
                    <strong>{memberIndex+1}º</strong>
                    <span className="friends-live-ranking-name">{String(member.userName||'Atleta')}{isMe?' · você':''}</span>
                    <span>{Math.max(0,Number(member.workoutsCount)||0)} atividades</span>
                    <b>{usesIga?`${score.toFixed(2)} IGA`:`${score.toFixed(2)} pts`}</b>
                  </div>;
                })}</div>
              </div>}
            </article>}) : <div className="friends-live-empty"><Trophy size={30}/><h3>Nenhum desafio por aqui</h3><p>Crie o primeiro desafio, escolha se haverá prêmio em Coins e compartilhe o código.</p><button onClick={()=>setMode('criar')}>Criar desafio</button></div>}</div>}

          {mode==='criar' && <form className="friends-live-form" onSubmit={create}>
            <label>Nome do desafio<input value={title} onChange={e=>setTitle(e.target.value)} maxLength={80} placeholder="Ex.: Consistência de Setembro" required/></label>
            <label>Descrição<textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={240} placeholder="Objetivo do grupo"/></label>
            <label>Duração<select value={durationDays} onChange={e=>setDurationDays(Number(e.target.value) as 7|15|30)}><option value={7}>7 dias</option><option value={15}>15 dias</option><option value={30}>30 dias</option></select></label>
            <div className="friends-live-stake"><span>COINS POR PARTICIPANTE <small>Opcional · máximo 2.000</small></span><div>{STAKE_PRESETS.map(amount=><button key={amount} type="button" className={stakeAmount===amount?'active':''} onClick={()=>setStakeAmount(amount)}>{amount===0?'Sem prêmio':`${amount} Coins`}</button>)}</div><input type="number" min={0} max={2000} step={1} value={stakeAmount===0?'':stakeAmount} onChange={e=>setStakeAmount(Math.max(0,Math.min(2000,Math.floor(Number(e.target.value)||0))))} placeholder="Outro valor"/><p><Coins size={13}/>{stakeAmount>0?`Cada participante coloca ${stakeAmount} Coins. O líder pelo IGA leva o pote; empate aplica a regra automática de desempate.`:'Sem Coins, o desafio continua disponível como disputa privada simbólica, ainda classificada pelo IGA.'}</p></div>
            <button disabled={busy}><Plus size={16}/>{busy?'Criando...':'Criar desafio privado'}</button>
          </form>}

          {mode==='entrar' && <form className="friends-live-form compact" onSubmit={join}><label>Código de convite<input value={inviteCode} onChange={e=>setInviteCode(e.target.value.toUpperCase())} maxLength={40} placeholder="Digite o código recebido" required/></label><button disabled={busy}><UserPlus size={16}/>{busy?'Entrando...':'Entrar no desafio'}</button><p className="friends-live-join-note"><Coins size={13}/>Se o convite tiver prêmio em Coins, o mesmo valor definido pelo criador é debitado automaticamente ao entrar. Saldo insuficiente impede a entrada.</p></form>}
        </section>
      </>}

      <section className="friends-live-rules"><article><BarChart3/><h3>IGA decide a disputa</h3><p>O motor calcula o IGA de cada participante dentro do período do próprio desafio, com atualização da classificação durante a janela. O placar não depende de pontuação manual.</p></article><article><Coins/><h3>Prêmio em Invictus Coins</h3><p>O valor por participante é opcional. Quando ativado, as Coins formam um pote interno do ecossistema e não representam dinheiro sacável.</p></article><article><Crown/><h3>Desempate automático</h3><p>Empate no topo estende o desafio por 1 dia uma única vez. Se persistir, o pote é dividido entre os líderes; com menos de 2 participantes, as Coins são devolvidas.</p></article></section>
    </div>
  </main>;
}
