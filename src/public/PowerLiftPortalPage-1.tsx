import { ArrowLeft, Crown, Diamond, Dumbbell, ShieldCheck, Smartphone, Trophy, Users, Video } from 'lucide-react';
import AppDownloadPanel from './AppDownloadPanel';
import './PowerLiftPortal.css';

export default function PowerLiftPortalPage(){
  return <main className="pl-live-page">
    <header className="pl-live-header"><a href="/"><ArrowLeft size={17}/> Início</a><a className="pl-live-logo" href="/">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>
    <section className="pl-live-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(4,4,4,.97),rgba(4,4,4,.42)),url(/assets/invictus/powerlift-hero.webp)'}}><div><p>BENEFÍCIO INVICTUS PRO · 30 DIAS · TRÊS MOVIMENTOS</p><h1>POWER <em>LIFT</em></h1><span>Um benefício competitivo do Invictus PRO para transformar evolução de força em uma temporada oficial. Construa sua marca em Supino, Agachamento Livre e Levantamento Terra, avance de Ferro a Diamante e desbloqueie os rankings de elite.</span><div className="pl-live-chips"><b><Crown size={14}/> BENEFÍCIO PRO</b><b><Dumbbell size={14}/> 1 MARCA OFICIAL / MODALIDADE / DIA</b><b><Diamond size={14}/> FERRO → DIAMANTE</b><b><Trophy size={14}/> ELITE + GERAL</b></div></div></section>
    <div className="pl-live-shell">
      <section className="pl-live-gate">
        <Smartphone size={34}/>
        <p>DISPONÍVEL NO APLICATIVO</p>
        <h2>Envio de vídeo e ranking acontecem no app</h2>
        <span>Aqui no site você conhece o Power Lift. Para enviar seu vídeo, acompanhar sua categoria (Ferro a Diamante) e entrar nos rankings Elite e Geral, abra o aplicativo Invictus com sua conta.</span>
        <div className="pl-live-howto">
          <article><Video size={16}/><div><b>Grave o levantamento</b><span>Um vídeo contínuo por modalidade por dia, mostrando os pesos utilizados e a execução completa do movimento em ambiente de academia.</span></div></article>
          <article><ShieldCheck size={16}/><div><b>Validação por IA e equipe técnica</b><span>Cada vídeo passa por análise automática. Quando a confiança não é alta o suficiente, um auditor humano revisa antes de aprovar ou recusar a marca.</span></div></article>
          <article><Users size={16}/><div><b>Sua melhor marca no ranking</b><span>Só a maior carga homologada de cada atleta em cada modalidade entra no Ranking Geral, com filtros por Geral, sua Academia e Minhas Marcas.</span></div></article>
        </div>
      </section>

      <AppDownloadPanel/>

      <section className="pl-live-rules"><article><Crown/><h3>Benefício exclusivo PRO</h3><p>O Power Lift é um benefício competitivo do Invictus PRO para Supino, Agachamento Livre e Levantamento Terra.</p></article><article><ShieldCheck/><h3>Marca oficial auditada</h3><p>O envio do vídeo e a validação — automática e, quando necessário, manual — acontecem no aplicativo antes de a marca valer no ranking.</p></article><article><Dumbbell/><h3>Um envio por dia, por modalidade</h3><p>Você pode enviar uma nova marca por modalidade a cada dia; uma carga homologada maior substitui a marca anterior no ranking.</p></article></section>
    </div>
  </main>;
}
