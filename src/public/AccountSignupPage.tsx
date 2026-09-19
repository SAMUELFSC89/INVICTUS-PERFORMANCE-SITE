import { FormEvent, useState } from 'react';
import { ArrowLeft, ShieldCheck, UserPlus } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import './AccountAccess.css';

function authError(error: any) {
  const code = String(error?.code || '');
  if (code.includes('email-already-in-use')) return 'Este e-mail já possui uma conta Invictus. Entre ou recupere sua senha.';
  if (code.includes('weak-password')) return 'Escolha uma senha com pelo menos 6 caracteres.';
  if (code.includes('invalid-email')) return 'Informe um e-mail válido.';
  if (code.includes('too-many-requests')) return 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
  return error?.message || 'Não foi possível criar a conta agora.';
}

export default function AccountSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      sessionStorage.setItem('invictus_signup_name', name.trim());
      sessionStorage.setItem('invictus_signup_created_uid', credential.user.uid);
      window.location.assign('/conta/completar');
    } catch (reason: any) {
      setError(authError(reason));
    } finally {
      setBusy(false);
    }
  };

  return <main className="account-access-page">
    <header><a href="/conta"><ArrowLeft size={17}/> Entrar</a><a href="/" className="account-access-logo">INVICTUS <span>PERFORMANCE</span></a><span/></header>
    <div className="account-access-shell">
      <section className="account-access-intro"><p>CONTA ÚNICA INVICTUS</p><h1>COMECE SUA<br/><em>JORNADA</em></h1><span>Crie seu acesso uma vez e use a mesma conta no site e no aplicativo.</span><div><ShieldCheck/><b>Um acesso para tudo</b><small>Suas inscrições, seu plano e sua evolução ficam reunidos na mesma conta.</small></div></section>
      <form className="account-access-card" onSubmit={submit}><UserPlus size={30}/><p>NOVO ATLETA</p><h2>Criar conta</h2>{error&&<div className="account-access-alert error">{error}</div>}<label>Nome completo<input required value={name} onChange={event=>setName(event.target.value)} autoComplete="name"/></label><label>E-mail<input required type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email"/></label><label>Senha<input required minLength={6} type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="new-password"/></label><button className="account-access-primary" disabled={busy}>{busy?'Criando...':'Continuar cadastro'}</button><small className="account-access-foot">Na próxima etapa você completa os dados obrigatórios do perfil e aceita os termos vigentes.</small></form>
    </div>
  </main>;
}
