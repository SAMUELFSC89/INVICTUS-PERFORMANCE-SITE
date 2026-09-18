import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Copy, Crown, Lock, LogIn, Plus, RefreshCw, ShieldCheck, Trophy, UserPlus, Users } from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import { hasActiveProEntitlement } from '../lib/proEntitlement';
import { createPrivateChallenge, joinPrivateChallenge, listPrivateChallenges, type PrivateChallenge } from '../lib/privateChallengesApi';
import './PrivateChallengesPortal.css';

type Mode = 'ativos' | 'criar' | 'entrar';

const statusLabel = (value: unknown) => {
  const status = String(value || '').toLowerCase();
  if (status === 'active') return 'ATIVO';
  if (status === 'forming') return 'FORMANDO GRUPO';
  if (status === 'completed' || status === 'finished') return 'FINALIZADO';
  return status ? status.replaceAll('_', ' ').toUpperCase() : 'ATIVO';
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
    setBusy(true); setError(''); setSuccess('');
    try {
      const result = await createPrivateChallenge({ title: title.trim(), description: description.trim(), durationDays });
      const code = String(result?.inviteCode || '').trim();
      setSuccess(code ? `Desafio criado. Código de convite: ${code}` : 'Desafio criado com sucesso.');
      setTitle(''); setDescription(''); setMode('ativos');
      setChallenges(await listPrivateChallenges());
    } catch (err: any) { setError(err?.message || 'Não foi possível criar o desafio.'); }
    finally { setBusy(false); }
  };

  const join = async (event: FormEvent) => {
    event.preventDefault();
    if (!inviteCode.trim()) return;
    setBusy(true); setError(''); setSuccess('');
    try {
      await joinPrivateChallenge(inviteCode);
      setSuccess('Você entrou no desafio com sucesso.');
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
      <div><p>BENEFÍCIO EXCLUSIVO INVICTUS PRO</p><h1>ENTRE <em>AMIGOS</em></h1><h2>Treinar junto muda tudo.</h2><span>Crie desafios privados, compartilhe um código e acompanhe a disputa com seus parceiros de treino — sem taxa por desafio e sem prêmio em dinheiro.</span><div className="friends-live-chips"><b><Users size={14}/> GRUPO PRIVADO</b><b><Trophy size={14}/> TOP 1 EM DESTAQUE</b><b><ShieldCheck size={14}/> MESMA CONTA DO APP</b></div></div>
    </section>

    <div className="friends-live-shell">
      {!ready || busy && !profile ? <div className="friends-live-loading"><RefreshCw className="spin" size={19}/> Sincronizando com o Invictus...</div> : !user ? <section className="friends-live-gate"><LogIn size={34}/><p>CONTA ÚNICA INVICTUS</p><h2>Entre para criar ou participar</h2><span>O Entre Amigos usa a mesma conta do aplicativo e mantém tudo sincronizado com o backend oficial.</span><a href="/conta">Entrar na minha conta</a></section> : !isPro ? <section className="friends-live-gate"><Lock size={34}/><p>INVICTUS PRO</p><h2>Recurso exclusivo do plano PRO</h2><span>Sua conta está conectada, mas Desafios Privados exigem entitlement PRO ativo. A validação é a mesma usada pelo aplicativo.</span><a href="/conta">Ver minha conta</a></section> : <>
        <section className="friends-live-console">
          <div className="friends-live-console-head"><div><p>DESAFIOS PRIVADOS</p><h2>Gerencie sua disputa</h2></div><button onClick={() => void loadChallenges()} disabled={busy}><RefreshCw className={busy?'spin':''} size={15}/> Atualizar</button></div>
          <div className="friends-live-tabs"><button className={mode==='ativos'?'active':''} onClick={()=>setMode('ativos')}><Trophy size={15}/> Ativos</button><button className={mode==='criar'?'active':''} onClick={()=>setMode('criar')}><Plus size={15}/> Criar</button><button className={mode==='entrar'?'active':''} onClick={()=>setMode('entrar')}><UserPlus size={15}/> Usar código</button></div>
          {error&&<div className="friends-live-alert error">{error}</div>}
          {success&&<div className="friends-live-alert success"><CheckCircle2 size={15}/>{success}</div>}

          {mode==='ativos' && <div className="friends-live-list">{challenges.length ? challenges.map((challenge,index)=>{const code=String(challenge.inviteCode||'').trim();const count=Number(challenge.participantsCount ?? challenge.participantCount ?? 0);return <article key={String(challenge.id||`${challenge.title}-${index}`)}><div><span className="friends-live-status">{statusLabel(challenge.status)}</span><h3>{String(challenge.title||'Desafio privado')}</h3><p>{String(challenge.description||'Disputa privada entre atletas Invictus.')}</p></div><div className="friends-live-meta"><span><Users size={14}/>{count || '—'} participantes</span>{challenge.durationDays&&<span>{challenge.durationDays} dias</span>}{code&&<button onClick={()=>void copyCode(code)}><Copy size={14}/>{copied===code?'Copiado':code}</button>}</div></article>}) : <div className="friends-live-empty"><Trophy size={30}/><h3>Nenhum desafio por aqui</h3><p>Crie o primeiro desafio e compartilhe o código com seus parceiros.</p><button onClick={()=>setMode('criar')}>Criar desafio</button></div>}</div>}

          {mode==='criar' && <form className="friends-live-form" onSubmit={create}><label>Nome do desafio<input value={title} onChange={e=>setTitle(e.target.value)} maxLength={80} placeholder="Ex.: Consistência de Setembro" required/></label><label>Descrição<textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={240} placeholder="Objetivo do grupo"/></label><label>Duração<select value={durationDays} onChange={e=>setDurationDays(Number(e.target.value) as 7|15|30)}><option value={7}>7 dias</option><option value={15}>15 dias</option><option value={30}>30 dias</option></select></label><button disabled={busy}><Plus size={16}/>{busy?'Criando...':'Criar desafio privado'}</button></form>}

          {mode==='entrar' && <form className="friends-live-form compact" onSubmit={join}><label>Código de convite<input value={inviteCode} onChange={e=>setInviteCode(e.target.value.toUpperCase())} maxLength={40} placeholder="Digite o código recebido" required/></label><button disabled={busy}><UserPlus size={16}/>{busy?'Entrando...':'Entrar no desafio'}</button></form>}
        </section>
      </>}

      <section className="friends-live-rules"><article><Crown/><h3>PRO, sem taxa por desafio</h3><p>O acesso depende do plano PRO ativo; não existe cobrança separada para criar ou entrar.</p></article><article><Users/><h3>Convite privado</h3><p>O código conecta apenas as pessoas que você escolher para a disputa.</p></article><article><Trophy/><h3>Reconhecimento</h3><p>O foco é consistência e competição saudável; o primeiro colocado recebe destaque, não prêmio em dinheiro.</p></article></section>
    </div>
  </main>;
}
