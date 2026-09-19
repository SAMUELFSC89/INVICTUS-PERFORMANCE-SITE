import { ArrowLeft, BarChart3, Coins, Crown, Diamond, Dumbbell, ShieldCheck, Smartphone, Trophy, Video } from 'lucide-react';
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
          <article><Video size={16}/><div><b>Grave o levantamento</b><span>Um vídeo por modalidade por dia, seguindo a regra técnica de cada movimento.</span></div></article>
          <article><ShieldCheck size={16}/><div><b>Validação oficial</b><span>Visão computacional e equipe técnica homologam a marca antes de valer no ranking.</span></div></article>
          <article><Diamond size={16}/><div><b>Suba de categoria</b><span>Evolua de Ferro a Diamante e desbloqueie o Ranking Elite da modalidade.</span></div></article>
        </div>
      </section>

      <AppDownloadPanel/>

      <section className="pl-live-rules"><article><Crown/><h3>Benefício exclusivo PRO</h3><p>O Power Lift faz parte do pacote competitivo do Invictus PRO, junto das progressões e rankings sazonais.</p></article><article><ShieldCheck/><h3>Marca oficial auditada</h3><p>O registro do levantamento e o vídeo são feitos no aplicativo, onde passam pela validação oficial.</p></article><article><Coins/><h3>Invictus Coins</h3><p>Cada avanço de categoria pode gerar Coins; pódios Elite e Campeão Master são pagos após o fechamento da temporada.</p></article></section>
    </div>
  </main>;
}
