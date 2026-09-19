import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, BadgeCheck, BarChart3, BrainCircuit, Clock, Coins, Crown, Dumbbell, FileCheck2, Gift, HeartPulse, Lock, Menu, ShieldCheck, Star, Target, Trophy, Users, Watch, X } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebaseClient';
import { getMyChampionshipRegistrations, type ChampionshipRegistration } from './lib/championshipApi';
import { COMPANY, SUPPORT_EMAIL } from './lib/publicLegal';

type Route='/'|'/campeonatos'|'/entre-amigos'|'/power-lift'|'/drops'|'/conta';
const nav:[string,Route][]=[['Início','/'],['Campeonatos','/campeonatos'],['Entre Amigos','/entre-amigos'],['Power Lift','/power-lift'],['Drops','/drops']];
const asset=(name:string)=>`/assets/invictus/${name}`;
const bg=(name:string)=>({backgroundImage:`linear-gradient(90deg,rgba(4,4,4,.94),rgba(4,4,4,.18)),url(${asset(name)})`});
const heroBg=(desktop:string,mobile?:string)=>({
  '--hero-desktop':`url(${asset(desktop)})`,
  '--hero-mobile':`url(${asset(mobile||desktop)})`,
} as React.CSSProperties);
const go=(route:Route)=>{if(route==='/'){window.scrollTo({top:0,behavior:'smooth'});return;}window.location.assign(route);};

function Brand(){return <div className="brand"><img className="brandLogo" src={asset('logo-invictus.png')} alt="Invictus Performance"/></div>}
const goHref=(href:string)=>{window.location.assign(href);};
function Header(){const[open,setOpen]=useState(false);const[signedIn,setSignedIn]=useState(Boolean(auth.currentUser));const close=()=>setOpen(false);useEffect(()=>onAuthStateChanged(auth,current=>setSignedIn(Boolean(current))),[]);return <header><button className="brandBtn" onClick={()=>go('/')}><Brand/></button><nav className={open?'open':''}>{nav.map(([label,route])=><button key={route} className={route==='/'?'active':''} onClick={()=>{go(route);close();}}>{label}</button>)}<button onClick={()=>{goHref('/perguntas-frequentes#contato');close();}}>Contato</button><div className="navAuth">{signedIn?<button className="gold" onClick={()=>{go('/conta');close();}}>Minha Conta</button>:<><button className="ghost" onClick={()=>{go('/conta');close();}}>Entrar</button><button className="gold" onClick={()=>{goHref('/conta/cadastro');close();}}>Inscreva-se</button></>}</div></nav><div className="headActions">{signedIn?<button className="gold" onClick={()=>go('/conta')}>Minha Conta</button>:<><button className="ghost" onClick={()=>go('/conta')}>Entrar</button><button className="gold" onClick={()=>goHref('/conta/cadastro')}>Inscreva-se</button></>}<button className="menu" onClick={()=>setOpen(value=>!value)}>{open?<X/>:<Menu/>}</button></div></header>}
function Footer(){const[signedIn,setSignedIn]=useState(Boolean(auth.currentUser));useEffect(()=>onAuthStateChanged(auth,current=>setSignedIn(Boolean(current))),[]);return <footer className="siteFooter">
  <div className="footerCol footerBrand"><Brand/><p>Mais que treino.<br/>É legado.</p></div>
  <div className="footerCol"><h4>Navegação</h4>{nav.map(([label,route])=><button key={route} onClick={()=>go(route)}>{label}</button>)}</div>
  <div className="footerCol"><h4>Conta</h4>{signedIn?<button onClick={()=>go('/conta')}>Minha Conta</button>:<><button onClick={()=>go('/conta')}>Entrar</button><button onClick={()=>goHref('/conta/cadastro')}>Inscreva-se</button></>}<button onClick={()=>goHref('/conta/excluir')}>Excluir conta</button></div>
  <div className="footerCol"><h4>Institucional</h4><button onClick={()=>goHref('/treino-inteligente')}>Treino Inteligente</button><button onClick={()=>goHref('/economia-invictus')}>Economia Invictus</button><button onClick={()=>goHref('/perguntas-frequentes')}>Perguntas Frequentes</button><button onClick={()=>goHref('/termos')}>Termos de Uso</button><button onClick={()=>goHref('/privacidade')}>Política de Privacidade</button></div>
  <div className="footerCol footerContact"><h4>Contato</h4><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><span>{COMPANY.legalName}</span><span>CNPJ {COMPANY.cnpj}</span><span>{COMPANY.address}</span></div>
  <div className="footerCopy"><span>© {new Date().getFullYear()} Invictus Performance</span></div>
</footer>}
function Title({title,eyebrow}:{title:string;eyebrow?:string}){return <div className="sectionTitle">{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div>}
function Hero({assetName,mobileAssetName,eyebrow,title,goldTitle,desc,primary,secondary,onPrimary,onSecondary,chips=[]}:{assetName:string;mobileAssetName?:string;eyebrow:string;title:string;goldTitle?:string;desc:string;primary:string;secondary?:string;onPrimary?:()=>void;onSecondary?:()=>void;chips?:string[]}){return <section className="hero approvedHero" style={heroBg(assetName,mobileAssetName)}><div className="heroCopy"><p className="eyebrow">{eyebrow}</p><h1>{title}{goldTitle&&<><br/><em>{goldTitle}</em></>}</h1><p>{desc}</p><div className="heroActions"><button className="gold" onClick={onPrimary}>{primary}<ArrowRight size={16}/></button>{secondary&&<button className="outline" onClick={onSecondary}>{secondary}</button>}</div><div className="chips">{chips.map(chip=><span key={chip}>{chip}</span>)}</div></div></section>}
function Step({n,icon,title,text}:{n:string;icon:React.ReactNode;title:string;text:string}){return <article className="step"><strong>{n}</strong>{icon}<div><h3>{title}</h3><p>{text}</p></div></article>}
function Mode({title,text,assetName,icon,badge,onClick}:{title:string;text:string;assetName:string;icon:React.ReactNode;badge?:string;onClick:()=>void}){return <button className="mode" onClick={onClick}><div className="modeImg" style={bg(assetName)}/><div className="modeBody">{badge&&<small className="modeBadge">{badge}</small>}{icon}<h3>{title}</h3><p>{text}</p><span>Explorar <ArrowRight size={14}/></span></div></button>}
function InfoCard({icon,title,text,onClick}:{icon:React.ReactNode;title:string;text:string;onClick:()=>void}){return <button className="infoCard" onClick={onClick}>{icon}<h3>{title}</h3><p>{text}</p><span>Entenda como funciona <ArrowRight size={14}/></span></button>}
const championshipLabel=(id:string)=>id==='invictus_cardio_v1'?'Campeonato de Cardio':id==='invictus_strength_v1'?'Campeonato de Musculação':id;
const whenShort=(value?:string)=>{if(!value)return '—';const raw=new Date(value);return Number.isFinite(raw.getTime())?raw.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'}):'—';};
function RecentActivity({registrations}:{registrations:ChampionshipRegistration[]}){
  if(!registrations.length)return null;
  const sorted=[...registrations].sort((a,b)=>new Date(b.pagaEm||b.criadaEm||0).getTime()-new Date(a.pagaEm||a.criadaEm||0).getTime()).slice(0,4);
  return <section><Title title="SUA ATIVIDADE RECENTE" eyebrow="ACOMPANHE SUAS INSCRIÇÕES"/><div className="activityTimeline">{sorted.map((item,index)=>{
    const isPaid=item.paymentStatus==='PAID'||item.status==='paga'||item.status==='ACTIVE';
    return <article className="activityRow" key={`${item.championshipId}-${item.editionId}-${index}`}>
      <div className="activityIcon">{isPaid?<BadgeCheck/>:<Clock/>}</div>
      <div className="activityBody"><b>{championshipLabel(item.championshipId)}</b><span>Edição {item.editionId||'atual'} · {whenShort(item.pagaEm||item.criadaEm)}</span></div>
      <div className={`activityStatus ${isPaid?'paid':'pending'}`}>{isPaid?'Inscrição ativa':'Aguardando pagamento'}</div>
    </article>;
  })}</div><button className="activityMore" onClick={()=>go('/conta')}>Ver todas as inscrições <ArrowRight size={14}/></button></section>;
}
function RecommendedForYou({tier}:{tier:string}){
  const isPro=tier==='PRO'||tier==='PERFORMANCE';
  const cards=isPro?[
    {icon:<Users/>,title:'Crie um desafio Entre Amigos',text:'Seu plano PRO já libera desafios privados por convite, disputados pelo IGA, com prêmio opcional em Invictus Coins.',cta:'Conhecer Entre Amigos',href:'/entre-amigos'},
    {icon:<Dumbbell/>,title:'Registre uma marca no Power Lift',text:'Envie seu vídeo de Supino, Agachamento Livre ou Levantamento Terra e evolua de categoria nesta temporada.',cta:'Ver Power Lift',href:'/power-lift'},
  ]:[
    {icon:<Users/>,title:'Entre Amigos',text:'Crie um desafio privado por convite e dispute com seus amigos pelo IGA, com prêmio opcional em Invictus Coins.',cta:'Conhecer o recurso',href:'/entre-amigos'},
    {icon:<Dumbbell/>,title:'Power Lift',text:'Temporadas oficiais de 30 dias em Supino, Agachamento e Terra, com progressão por categoria de Ferro a Diamante.',cta:'Conhecer o recurso',href:'/power-lift'},
  ];
  return <section><Title title={isPro?'APROVEITE SEU PLANO PRO':'RECOMENDADO PARA VOCÊ'} eyebrow={isPro?'RECURSOS JÁ LIBERADOS NA SUA CONTA':'DESBLOQUEIE MAIS COM O INVICTUS PRO'}/><div className="recommendGrid">{cards.map(card=><button className="recommendCard" key={card.title} onClick={()=>goHref(card.href)}>{!isPro&&<span className="recommendLock"><Lock size={11}/> PRO</span>}{card.icon}<h3>{card.title}</h3><p>{card.text}</p><span className="recommendCta">{card.cta} <ArrowRight size={14}/></span></button>)}</div></section>;
}

function useHomeHero(){
  const [signedIn,setSignedIn]=useState(Boolean(auth.currentUser));
  const [displayName,setDisplayName]=useState('');
  const [tier,setTier]=useState('');
  const [registrations,setRegistrations]=useState<ChampionshipRegistration[]>([]);
  useEffect(()=>onAuthStateChanged(auth,current=>setSignedIn(Boolean(current))),[]);
  useEffect(()=>{
    if(!signedIn){setDisplayName('');setTier('');setRegistrations([]);return;}
    let cancelled=false;
    const uid=auth.currentUser?.uid;
    Promise.all([
      uid?getDoc(doc(db,'users',uid)).catch(()=>null):Promise.resolve(null),
      getMyChampionshipRegistrations().catch(()=>[]),
    ]).then(([profileSnap,regs])=>{
      if(cancelled)return;
      const profile=profileSnap&&profileSnap.exists()?profileSnap.data():null;
      setDisplayName(profile?.displayName||auth.currentUser?.displayName||'Atleta Invictus');
      setTier(String(profile?.subscriptionTier||profile?.plan||'OPEN').toUpperCase());
      setRegistrations(regs);
    });
    return ()=>{cancelled=true;};
  },[signedIn]);
  const paid=registrations.filter(item=>item.paymentStatus==='PAID'||item.status==='paga'||item.status==='ACTIVE');
  const pending=registrations.filter(item=>!paid.includes(item));
  if(!signedIn)return{signedIn,tier,registrations,paid,pending,hero:{
    eyebrow:'MAIS QUE TREINO. UM PROPÓSITO.',title:'TREINE. COMPITA.',goldTitle:'PROVE.',
    desc:'O treino deixa de ser só treino quando existe algo em jogo. Campeonatos oficiais, desafios Entre Amigos por IGA, Power Lift e Drops em um mesmo ecossistema.',
    primary:'Ver Campeonatos',secondary:'Acessar Minha Conta',onPrimary:()=>go('/campeonatos'),onSecondary:()=>go('/conta'),
    chips:['ATLETAS REAIS','DESAFIOS REAIS','RESULTADOS REAIS'],
  }};
  const chips=[`PLANO ${tier||'OPEN'}`,`${paid.length} INSCRIÇÃO(ÕES) ATIVA(S)`,`${pending.length} AGUARDANDO PAGAMENTO`];
  if(pending.length)return{signedIn,tier,registrations,paid,pending,hero:{
    eyebrow:'BEM-VINDO DE VOLTA',title:displayName||'Atleta Invictus',
    desc:'Você tem inscrições aguardando pagamento. Finalize para garantir sua vaga na competição.',
    primary:'Continuar inscrição',secondary:'Ver Campeonatos',onPrimary:()=>go('/conta'),onSecondary:()=>go('/campeonatos'),chips,
  }};
  if(paid.length)return{signedIn,tier,registrations,paid,pending,hero:{
    eyebrow:'BEM-VINDO DE VOLTA',title:displayName||'Atleta Invictus',
    desc:'Sua participação está confirmada. Acompanhe seu desempenho e explore novos desafios.',
    primary:'Ver minha conta',secondary:'Ver Campeonatos',onPrimary:()=>go('/conta'),onSecondary:()=>go('/campeonatos'),chips,
  }};
  return{signedIn,tier,registrations,paid,pending,hero:{
    eyebrow:'BEM-VINDO DE VOLTA',title:displayName||'Atleta Invictus',
    desc:'Explore os campeonatos, desafios e temporadas disponíveis para você agora.',
    primary:'Ver Campeonatos',secondary:'Minha Conta',onPrimary:()=>go('/campeonatos'),onSecondary:()=>go('/conta'),chips,
  }};
}
function HomePage(){const {hero,signedIn,tier,registrations}=useHomeHero();return <><Hero assetName="home-hero.webp" mobileAssetName="home-hero-mobile.webp" {...hero}/><main className="shell">{signedIn&&registrations.length>0&&<RecentActivity registrations={registrations}/>}<section><Title title="ESCOLHA COMO COMPETIR" eyebrow="DIFERENTES MODOS. O MESMO PROPÓSITO."/><div className="modeGrid"><Mode title="Campeonatos Invictus" text="Cardio, musculação e competições oficiais com ranking e validação." assetName="championships-hero.webp" icon={<Trophy/>} onClick={()=>go('/campeonatos')}/><Mode title="Entre Amigos" text="Crie uma disputa privada, convide seus amigos e dispute pelo IGA, com prêmio opcional em Invictus Coins." assetName="friends-hero.webp" icon={<Users/>} onClick={()=>go('/entre-amigos')}/><Mode title="Power Lift" text="Prove sua evolução em Supino, Agachamento e Terra, com progressão sazonal e rankings." assetName="powerlift-hero.webp" icon={<Dumbbell/>} onClick={()=>go('/power-lift')}/><Mode title="Drops" text="Produtos, recompensas e lançamentos exclusivos do universo Invictus." assetName="drops-hero.webp" icon={<Gift/>} onClick={()=>go('/drops')}/></div></section><section className="soft"><Title title="COMO FUNCIONA" eyebrow="DO PRIMEIRO PASSO AO TOPO DO RANKING."/><div className="stepGrid"><Step n="01" icon={<Target/>} title="Escolha" text="Encontre o desafio ou competição que combina com você."/><Step n="02" icon={<FileCheck2/>} title="Entre" text="Confirme sua participação pelas regras de cada modalidade."/><Step n="03" icon={<Activity/>} title="Treine no app" text="Registre suas atividades pelo Invictus."/><Step n="04" icon={<BarChart3/>} title="Acompanhe" text="Veja evolução, IGA e rankings nas experiências elegíveis."/></div></section><section><Title title="RESULTADOS VALIDADOS" eyebrow="COMPETIÇÃO SÉRIA. EXPERIÊNCIA PREMIUM."/><div className="featureGrid"><article><BarChart3/><h3>Ranking transparente</h3><p>Resultados calculados pelas fontes oficiais do ecossistema.</p></article><article><ShieldCheck/><h3>Validação por evidências</h3><p>Regras claras e auditoria compatível com cada modalidade.</p></article><article><Crown/><h3>Performance com propósito</h3><p>Consistência e evolução acima de atalhos.</p></article><article><Star/><h3>Experiência Invictus</h3><p>Uma comunidade construída para atletas reais.</p></article></div></section><section className="soft"><Title title="TRANSPARÊNCIA TOTAL" eyebrow="COMO O INVICTUS TREINA E RECOMPENSA VOCÊ"/><div className="infoGrid"><InfoCard icon={<BrainCircuit/>} title="Treino Inteligente" text="Motor de prescrição em todos os planos, com refinamento por IA no PRO — e reserva automática se a IA falhar." onClick={()=>goHref('/treino-inteligente')}/><InfoCard icon={<Coins/>} title="Economia Invictus" text="Invictus Coins não são dinheiro. Premiação de campeonato paga é, via PIX. Entenda a diferença." onClick={()=>goHref('/economia-invictus')}/></div><p className="infoNote"><HeartPulse size={13}/> Sincronize Apple Health, Google Health Connect ou Strava e acompanhe sua Jornada Cardio, com metas semanais que se adaptam ao seu progresso, direto no aplicativo. <Watch size={13}/></p></section>{signedIn&&<RecommendedForYou tier={tier}/>}<section className="cta approvedInstitutional"><div><small>PRONTO PARA ENTRAR NO INVICTUS?</small><h2>Transforme treino em história.</h2></div><button className="gold" onClick={()=>go('/campeonatos')}>Começar agora<ArrowRight size={16}/></button></section></main></>}

export default function RebuildApp(){return <div className="rebuild"><Header/><HomePage/><Footer/></div>}
