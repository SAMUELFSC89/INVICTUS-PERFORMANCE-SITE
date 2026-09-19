import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { getAccountDeletionStatus, requestAccountDeletion, type AccountDeletionStatus } from '../lib/accountApi';
import './AccountPortalEnhancements.css';

const when=(value?:string|null)=>value?new Date(value).toLocaleString('pt-BR',{dateStyle:'medium',timeStyle:'short'}):'—';

export default function AccountDeletionPage(){
  const[user,setUser]=useState<User|null>(null);
  const[ready,setReady]=useState(false);
  const[status,setStatus]=useState<AccountDeletionStatus|null>(null);
  const[busy,setBusy]=useState(false);
  const[error,setError]=useState('');
  const[message,setMessage]=useState('');
  const[confirmRetention,setConfirmRetention]=useState(false);
  const[confirmSubscription,setConfirmSubscription]=useState(false);
  const[typed,setTyped]=useState('');

  useEffect(()=>onAuthStateChanged(auth,current=>{setUser(current);setReady(true)}),[]);
  useEffect(()=>{if(!ready||!user)return;setBusy(true);getAccountDeletionStatus().then(setStatus).catch(err=>setError(err?.message||'Não foi possível consultar sua solicitação.')).finally(()=>setBusy(false));},[ready,user]);

  const submit=async()=>{
    if(typed.trim().toUpperCase()!=='EXCLUIR'||!confirmRetention||!confirmSubscription)return;
    setBusy(true);setError('');setMessage('');
    try{
      const result=await requestAccountDeletion();
      setMessage(result.message||'Solicitação de exclusão registrada.');
      setStatus({requested:true,status:result.status||'requested',requestedAt:result.requestedAt||new Date().toISOString()});
    }catch(err:any){setError(err?.message||'Não foi possível registrar a exclusão.')}finally{setBusy(false)}
  };

  if(!ready)return <main className="pub-page"><div className="pub-loading" style={{padding:40}}><RefreshCw className="spin"/> Carregando...</div></main>;
  if(!user)return <main className="pub-page account-deletion-page"><header className="pub-header"><a href="/conta"><ArrowLeft size={17}/> Voltar</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><span/></header><section className="account-deletion-shell"><div className="account-deletion-card"><Trash2/><h1>Excluir conta</h1><p>Entre na sua conta Invictus para solicitar a exclusão.</p><a href="/conta">Entrar na minha conta</a></div></section></main>;

  const alreadyRequested=Boolean(status?.requested);
  return <main className="pub-page account-deletion-page">
    <header className="pub-header"><a href="/conta"><ArrowLeft size={17}/> Minha conta</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><span/></header>
    <section className="account-deletion-shell">
      <div className="account-deletion-card danger-zone">
        <Trash2/>
        <p className="pub-eyebrow">SEGURANÇA E CONTA</p>
        <h1>Excluir minha conta</h1>
        <p>A solicitação inicia o processo de exclusão ou anonimização dos dados associados à sua conta. Informações que precisem ser mantidas por obrigação legal, segurança, prevenção a fraude, chargeback ou exercício regular de direitos podem ser conservadas pelo prazo aplicável.</p>
        <div className="account-deletion-note"><ShieldCheck/><span>O processamento é normalmente concluído em até 30 dias.</span></div>
        <div className="account-deletion-note"><AlertTriangle/><span>Excluir a conta Invictus não cancela automaticamente uma assinatura feita pela App Store ou Google Play. Se houver assinatura ativa, cancele a renovação também na própria loja.</span></div>
        {error&&<div className="pub-alert error">{error}</div>}
        {message&&<div className="pub-alert success"><CheckCircle2/>{message}</div>}
        {alreadyRequested?<div className="account-deletion-status"><CheckCircle2/><div><b>Solicitação já registrada</b><span>Status: {String(status?.status||'requested').toUpperCase()} · solicitada em {when(status?.requestedAt)}</span></div></div>:<>
          <label className="account-danger-check"><input type="checkbox" checked={confirmRetention} onChange={e=>setConfirmRetention(e.target.checked)}/><span>Entendi que alguns dados podem ser mantidos quando houver obrigação legal ou motivo legítimo de segurança e auditoria.</span></label>
          <label className="account-danger-check"><input type="checkbox" checked={confirmSubscription} onChange={e=>setConfirmSubscription(e.target.checked)}/><span>Entendi que assinaturas contratadas pela App Store ou Google Play precisam ser canceladas também na própria loja.</span></label>
          <label className="account-delete-confirm">Para confirmar, digite <b>EXCLUIR</b><input value={typed} onChange={e=>setTyped(e.target.value)} placeholder="EXCLUIR" autoComplete="off"/></label>
          <button className="account-delete-button" disabled={busy||typed.trim().toUpperCase()!=='EXCLUIR'||!confirmRetention||!confirmSubscription} onClick={()=>void submit()}><Trash2/>{busy?'Registrando...':'Solicitar exclusão da conta'}</button>
        </>}
      </div>
    </section>
  </main>;
}
