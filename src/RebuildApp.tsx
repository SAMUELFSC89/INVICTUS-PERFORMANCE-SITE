import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, BadgeCheck, BarChart3, BrainCircuit, Check, Clock, Coins, Crown, Dumbbell, FileCheck2, Gift, HeartPulse, HelpCircle, Lock, Menu, ShieldCheck, Smartphone, Star, Target, Trophy, Users, Watch, X } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebaseClient';
import { getMyChampionshipRegistrations, type ChampionshipRegistration } from './lib/championshipApi';
import { COMPANY, SUPPORT_EMAIL } from './lib/publicLegal';

type Route='/'|'/campeonatos'|'/entre-amigos'|'/power-lift'|'/drops'|'/conta';
const nav:[string,string][]=[['Início','/'],['Campeonatos','/campeonatos'],['Plano PRO','/#pro'],['Como funciona','/perguntas-frequentes'],['Contato','/contato']];
const asset=(name:string)=>`/assets/invictus/${name}`;
const go=(route:Route)=>{if(route==='/'){window.scrollTo({top:0,behavior:'smooth'});return;}window.location.assign(route);};

function Brand(){return <div className="brand"><img className="brandLogo" src={asset('logo-invictus.png')} alt="Invictus Performance"/></div>}
const goHref=(href:string)=>{window.location.assign(href);};
function Header(){const[open,setOpen]=useState(false);const[signedIn,setSignedIn]=useState(Boolean(auth.currentUser));const close=()=>setOpen(false);useEffect(()=>onAuthStateChanged(auth,current=>setSignedIn(Boolean(current))),[]);return <header><button className="brandBtn" onClick={()=>go('/')}><Brand/></button><nav className={open?'open':''}>{nav.map(([label,href])=><button key={href} className={href==='/'?'active':''} onClick={()=>{goHref(href);close();}}>{label}</button>)}<div className="navAuth">{signedIn?<button className="gold" onClick={()=>{go('/conta');close();}}>Minha Conta</button>:<><button className="ghost" onClick={()=>{go('/conta');close();}}>Entrar</button><button className="gold" onClick={()=>{goHref('/conta/cadastro');close();}}>Criar conta</button></>}</div></nav><div className="headActions">{signedIn?<button className="gold" onClick={()=>go('/conta')}>Minha Conta</button>:<><button className="ghost" onClick={()=>go('/conta')}>Entrar</button><button className="gold" onClick={()=>goHref('/conta/cadastro')}>Criar conta</button></>}<button className="menu" aria-label={open?'Fechar menu':'Abrir menu'} onClick={()=>setOpen(value=>!value)}>{open?<X/>:<Menu/>}</button></div></header>}
function Footer(){const[signedIn,setSignedIn]=useState(Boolean(auth.currentUser));useEffect(()=>onAuthStateChanged(auth,current=>setSignedIn(Boolean(current))),[]);return <footer className="siteFooter">
  <div className="footerCol footerBrand"><Brand/><p>Mais que treino.<br/>É legado.</p></div>
  <div className="footerCol"><h4>Navegação</h4>{nav.map(([label,href])=><button key={href} onClick={()=>goHref(href)}>{label}</button>)}<button onClick={()=>goHref('/entre-amigos')}>Entre Amigos</button><button onClick={()=>goHref('/power-lift')}>Power Lift</button><button onClick={()=>goHref('/drops')}>Drops</button></div>
  <div className="footerCol"><h4>Conta</h4>{signedIn?<button onClick={()=>go('/conta')}>Minha Conta</button>:<><button onClick={()=>go('/conta')}>Entrar</button><button onClick={()=>goHref('/conta/cadastro')}>Inscreva-se</button></>}<button onClick={()=>goHref('/conta/excluir')}>Excluir conta</button></div>
  <div className="footerCol"><h4>Institucional</h4><button onClick={()=>goHref('/treino-inteligente')}>Treino Inteligente</button><button onClick={()=>goHref('/economia-invictus')}>Economia Invictus</button><button onClick={()=>goHref('/perguntas-frequentes')}>Perguntas Frequentes</button><button onClick={()=>goHref('/contato')}>Contato</button><button onClick={()=>goHref('/termos')}>Termos de Uso</button><button onClick={()=>goHref('/privacidade')}>Política de Privacidade</button></div>
  <div className="footerCol footerContact"><h4>Contato</h4><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><span>{COMPANY.legalName}</span><span>CNPJ {COMPANY.cnpj}</span><span>{COMPANY.address}</span></div>
  <div className="footerCopy"><span>© {new Date().getFullYear()} Invictus Performance</span></div>
</footer>}
function Title({title,eyebrow}:{title:string;eyebrow?:string}){return <div className="sectionTitle">{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div>}
function Hero({eyebrow,title,goldTitle,desc,primary,secondary,onPrimary,onSecondary,chips=[]}:{assetName?:string;mobileAssetName?:string;eyebrow:string;title:string;goldTitle?:string;desc:string;primary:string;secondary?:string;onPrimary?:()=>void;onSecondary?:()=>void;chips?:string[]}){return <section className="hero approvedHero"><div className="heroCopy"><p className="eyebrow">{eyebrow}</p><h1>{title}{goldTitle&&<><br/><em>{goldTitle}</em></>}</h1><p>{desc}</p><div className="heroActions"><button className="gold" onClick={onPrimary}>{primary}<ArrowRight size={16}/></button>{secondary&&<button className="outline" onClick={onSecondary}>{secondary}</button>}</div><div className="chips">{chips.map(chip=><span key={chip}>{chip}</span>)}</div></div></section>}
function Step({n,icon,title,text}:{n:string;icon:React.ReactNode;title:string;text:string}){return <article className="step"><strong>{n}</strong>{icon}<div><h3>{title}</h3><p>{text}</p></div></article>}
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
function HomePage(){const {hero,signedIn,tier,registrations}=useHomeHero();const salesHero=signedIn?hero:{eyebrow:'CAMPEONATOS DE CARDIO E MUSCULAÇÃO',title:'SEU TREINO.',goldTitle:'AGORA VALE MAIS.',desc:'Entre em campeonatos oficiais, registre suas atividades pelo aplicativo e acompanhe sua evolução em rankings com regras claras.',primary:'Ver campeonatos abertos',secondary:'Conhecer o Plano PRO',onPrimary:()=>go('/campeonatos'),onSecondary:()=>goHref('/#pro'),chips:['INSCRIÇÃO PELO SITE','ATIVIDADES PELO APP','RESULTADOS VALIDADOS']};return <><Hero assetName="home-hero.webp" mobileAssetName="home-hero-mobile.webp" {...salesHero}/><main className="shell">{signedIn&&registrations.length>0&&<RecentActivity registrations={registrations}/>}<section className="championshipSales"><Title title="ESCOLHA SEU CAMPEONATO" eyebrow="ENTRE NA PRÓXIMA DISPUTA"/><p className="sectionLead">Você não precisa ser atleta profissional. Escolha a modalidade, confira o regulamento e faça sua inscrição. Depois, use o aplicativo para registrar tudo o que vale para a competição.</p><div className="salesGrid"><button className="salesCard cardio" onClick={()=>goHref('/campeonatos/cardio')}><div><small>CARDIO</small><h3>Corra. Pedale. Evolua.</h3><p>Competições por desempenho e consistência, com atividades sincronizadas e critérios publicados antes da largada.</p><span>Ver campeonato de Cardio <ArrowRight size={16}/></span></div></button><button className="salesCard strength" onClick={()=>goHref('/campeonatos/musculacao')}><div><small>MUSCULAÇÃO</small><h3>Transforme treino em resultado.</h3><p>Competições de musculação com regras próprias, acompanhamento no app e resultados homologados.</p><span>Ver campeonato de Musculação <ArrowRight size={16}/></span></div></button></div><button className="textCta" onClick={()=>go('/campeonatos')}>Ver todos os campeonatos e inscrições <ArrowRight size={15}/></button></section><section className="soft journeySection"><Title title="DO SITE AO RANKING" eyebrow="SIMPLES PARA ENTRAR. CLARO PARA COMPETIR."/><div className="stepGrid"><Step n="01" icon={<Target/>} title="Escolha" text="Veja datas, preço, premiação e regras do campeonato."/><Step n="02" icon={<FileCheck2/>} title="Inscreva-se" text="Crie sua conta, aceite o regulamento e conclua o pagamento no site."/><Step n="03" icon={<Smartphone/>} title="Treine no app" text="Entre com a mesma conta e registre suas atividades válidas."/><Step n="04" icon={<BarChart3/>} title="Acompanhe" text="Veja classificação, validações e resultado da edição."/></div></section><section id="pro" className="proSales"><div className="proIntro"><p className="eyebrow">INVICTUS PRO</p><h2>UM PLANO PARA QUEM QUER <em>EVOLUIR DE VERDADE.</em></h2><p>O PRO amplia sua experiência dentro do aplicativo com treino inteligente refinado por IA, desafios privados, Power Lift e recursos avançados de acompanhamento.</p><div className="proPrice"><strong>R$ 29,90</strong><span>por mês</span></div><div className="proActions"><button className="gold" onClick={()=>goHref('/conta/cadastro')}>Começar no Invictus PRO <ArrowRight size={16}/></button><button className="outline" onClick={()=>goHref('/perguntas-frequentes#planos')}>Comparar e tirar dúvidas</button></div></div><div className="proBenefits"><article><BrainCircuit/><div><h3>Treino inteligente com IA</h3><p>Plano adaptado ao seu objetivo, experiência, rotina e equipamentos disponíveis.</p></div><Check/></article><article><Users/><div><h3>Entre Amigos</h3><p>Crie desafios privados, convide sua turma e dispute pelo IGA.</p></div><Check/></article><article><Dumbbell/><div><h3>Power Lift</h3><p>Evolua em Supino, Agachamento Livre e Terra, de Ferro a Diamante.</p></div><Check/></article><article><HeartPulse/><div><h3>Mais dados para evoluir</h3><p>Acompanhe métricas e integrações compatíveis com sua jornada.</p></div><Check/></article></div></section><section id="aplicativo" className="appBridge"><div className="appBridgeCopy"><p className="eyebrow">SITE + APLICATIVO</p><h2>CADA ETAPA NO LUGAR CERTO.</h2><p>No site, você entende, compara, consulta regras e se inscreve. No aplicativo, você treina, registra atividades e acompanha sua evolução.</p><div className="bridgeColumns"><article><b>Aqui no site</b><span><Check/> Campeonatos e inscrições</span><span><Check/> Planos, recursos e regras</span><span><Check/> Pagamentos e sua conta</span><span><Check/> Central completa de ajuda</span></article><article><b>Dentro do aplicativo</b><span><Check/> Treinos e atividades</span><span><Check/> Rankings e progresso</span><span><Check/> Entre Amigos e Power Lift</span><span><Check/> Saúde, integrações e conquistas</span></article></div><button className="gold" onClick={()=>goHref('/conta')}>Acessar minha conta <ArrowRight size={16}/></button></div><div className="appBridgeVisual" aria-hidden="true"><Smartphone/><span>INVICTUS</span><b>Seu treino continua no app.</b></div></section><section className="helpHub"><Title title="ENTENDA TUDO ANTES DE COMEÇAR" eyebrow="REGRAS, PLANOS E FUNCIONALIDADES"/><p className="sectionLead">A Central Invictus reúne as respostas que você precisa sem obrigar você a procurar dentro do aplicativo.</p><div className="helpGrid"><button onClick={()=>goHref('/perguntas-frequentes#campeonatos')}><Trophy/><div><h3>Campeonatos</h3><p>Inscrição, modalidades, validação, premiação e reembolso.</p></div><ArrowRight/></button><button onClick={()=>goHref('/perguntas-frequentes#planos')}><Crown/><div><h3>Planos e treino</h3><p>Free, PRO, montagem do plano e inteligência artificial.</p></div><ArrowRight/></button><button onClick={()=>goHref('/perguntas-frequentes#aplicativo')}><Smartphone/><div><h3>Aplicativo e dispositivos</h3><p>Conta, download, registro de treino e integrações.</p></div><ArrowRight/></button><button onClick={()=>goHref('/perguntas-frequentes#integridade')}><ShieldCheck/><div><h3>Regras e segurança</h3><p>IGA, evidências, revisão e proteção dos rankings.</p></div><ArrowRight/></button></div><button className="textCta" onClick={()=>goHref('/perguntas-frequentes')}>Abrir Central de Ajuda completa <HelpCircle size={15}/></button></section>{signedIn&&<RecommendedForYou tier={tier}/>}<section className="cta approvedInstitutional"><div><small>PRONTO PARA COMPETIR?</small><h2>Escolha seu campeonato e entre no jogo.</h2></div><button className="gold" onClick={()=>go('/campeonatos')}>Ver campeonatos<ArrowRight size={16}/></button></section></main></>}

export default function RebuildApp(){return <div className="rebuild"><Header/><HomePage/><Footer/></div>}
