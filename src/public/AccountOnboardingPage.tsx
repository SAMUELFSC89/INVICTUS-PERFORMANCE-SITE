import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { deleteUser, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { checkCpfInUse, CURRENT_LEGAL_VERSION, onboardAccount, runIdentityAction } from '../lib/accountApi';
import './AccountAccess.css';

const digits = (value: string, max: number) => value.replace(/\D/g, '').slice(0, max);

export default function AccountOnboardingPage() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [ready, setReady] = useState(Boolean(auth.currentUser));
  const [name, setName] = useState(() => sessionStorage.getItem('invictus_signup_name') || '');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  const clearSignupMarkers = () => {
    sessionStorage.removeItem('invictus_signup_name');
    sessionStorage.removeItem('invictus_signup_created_uid');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) { setError('Sua sessão expirou. Entre novamente para concluir o cadastro.'); return; }
    if (!terms) { setError('Aceite os Termos de Uso e a Política de Privacidade para continuar.'); return; }
    const normalizedCpf = digits(cpf, 11);
    const normalizedPhone = digits(phone, 11);
    if (normalizedCpf.length !== 11) { setError('Informe um CPF válido com 11 dígitos.'); return; }
    if (!birthDate) { setError('Informe sua data de nascimento.'); return; }
    if (normalizedPhone.length < 10) { setError('Informe um celular brasileiro com DDD.'); return; }

    setBusy(true); setError('');
    try {
      const cpfAlreadyInUse = await checkCpfInUse(user, normalizedCpf);
      if (cpfAlreadyInUse) {
        const createdUid = sessionStorage.getItem('invictus_signup_created_uid');
        if (createdUid === user.uid) {
          try {
            await deleteUser(user);
          } catch {
            await signOut(auth).catch(() => undefined);
          }
          clearSignupMarkers();
          throw new Error('Este CPF já está em uso por outra conta. A identidade recém-criada foi descartada; entre com a conta que já possui este CPF.');
        }
        throw new Error('Este CPF já está em uso por outra conta. Nenhuma alteração foi feita nesta conta.');
      }

      await onboardAccount(user, {
        displayName: name.trim(),
        cpf: normalizedCpf,
        birthDate,
        height,
        weight,
        sex,
        weeklyFrequency: '3-4',
        bodySelfAssessment: 'normal',
        objective: 'emagrecer',
        preferredPlan: 'open',
        city: city.trim(),
        state: state.trim().toUpperCase(),
        whatsappEnabled: true,
        phoneNumber: normalizedPhone,
        termsAccepted: true,
        termsVersionAccepted: CURRENT_LEGAL_VERSION,
      });
      // Receita/Serpro está temporariamente suspensa por decisão de produto.
      // Mantemos o CPF cadastrado e único, mas não chamamos verify-cpf aqui.
      try { await runIdentityAction('send-verification-email'); } catch { /* a conta continua válida e o e-mail pode ser reenviado depois */ }
      clearSignupMarkers();
      setSuccess(true);
      window.setTimeout(() => window.location.assign('/conta'), 900);
    } catch (reason: any) {
      setError(reason?.message || 'Não foi possível concluir o cadastro agora.');
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return <main className="account-access-page"><div className="account-access-loading">Preparando seu cadastro...</div></main>;
  if (!user) return <main className="account-access-page"><div className="account-access-gate"><ShieldCheck/><h1>Sessão necessária</h1><p>Entre ou crie uma conta antes de completar o cadastro.</p><a href="/conta">Ir para a conta</a></div></main>;

  return <main className="account-access-page">
    <header><a href="/conta"><ArrowLeft size={17}/> Conta</a><a href="/" className="account-access-logo">INVICTUS <span>PERFORMANCE</span></a><span/></header>
    <div className="account-access-shell compact">
      <section className="account-access-intro"><p>ÚLTIMA ETAPA</p><h1>COMPLETE SEU<br/><em>PERFIL</em></h1><span>Preencha seus dados para concluir a conta, participar das categorias corretas e manter sua experiência protegida.</span><div><ShieldCheck/><b>Seus dados protegidos</b><small>As informações são usadas somente para sua conta, segurança e participação nos recursos Invictus.</small></div></section>
      <form className="account-access-card signup" onSubmit={submit}><ShieldCheck size={30}/><p>PERFIL DO ATLETA</p><h2>Completar cadastro</h2>{error&&<div className="account-access-alert error">{error}</div>}{success&&<div className="account-access-alert success"><CheckCircle2 size={15}/>Cadastro concluído. Abrindo sua conta...</div>}<div className="account-access-grid"><label className="wide">Nome completo<input required value={name} onChange={event=>setName(event.target.value)} autoComplete="name"/></label><label>CPF<input required inputMode="numeric" value={cpf} onChange={event=>setCpf(digits(event.target.value,11))} placeholder="00000000000"/></label><label>Nascimento<input required type="date" value={birthDate} onChange={event=>setBirthDate(event.target.value)}/></label><label>Celular com DDD<input required inputMode="tel" value={phone} onChange={event=>setPhone(digits(event.target.value,11))} placeholder="51999999999"/></label><label>Cidade<input required value={city} onChange={event=>setCity(event.target.value)}/></label><label>UF<input required maxLength={2} value={state} onChange={event=>setState(event.target.value.toUpperCase())}/></label><label>Altura (cm)<input required type="number" min={100} max={250} value={height} onChange={event=>setHeight(event.target.value)}/></label><label>Peso (kg)<input required type="number" min={30} max={350} step="0.1" value={weight} onChange={event=>setWeight(event.target.value)}/></label><label className="wide">Sexo biológico<select value={sex} onChange={event=>setSex(event.target.value as 'male'|'female')}><option value="male">Masculino</option><option value="female">Feminino</option></select></label></div><label className="account-access-check"><input type="checkbox" checked={terms} onChange={event=>setTerms(event.target.checked)}/><span>Li e aceito os Termos de Uso e a Política de Privacidade vigentes do Invictus.</span></label><button className="account-access-primary" disabled={busy}>{busy?'Concluindo...':'Concluir cadastro'}</button><small className="account-access-foot">O e-mail de verificação da Invictus é enviado ao final. A confirmação por SMS poderá ser concluída no fluxo de identidade do ecossistema.</small></form>
    </div>
  </main>;
}
