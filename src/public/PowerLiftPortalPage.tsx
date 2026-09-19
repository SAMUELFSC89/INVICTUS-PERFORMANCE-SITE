import { ArrowLeft, Coins, Crown, Diamond, Dumbbell, ShieldCheck, Smartphone, Trophy, Video } from 'lucide-react';
import AppDownloadPanel from './AppDownloadPanel';
import './PowerLiftPortal.css';

export default function PowerLiftPortalPage(){
  return <main className="pl-live-page">
    <header className="pl-live-header"><a href="/"><ArrowLeft size={17}/> Início</a><a className="pl-live-logo" href="/">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>
    <section className="pl-live-hero"><div><p>BENEFÍCIO INVICTUS PRO · 30 DIAS · TRÊS MOVIMENTOS</p><h1>POWER <em>LIFT</em></h1><span>Um benefício competitivo do Invictus PRO para transformar evolução de força em uma temporada oficial. Construa sua marca em Supino, Agachamento Livre e Levantamento Terra, avance de Ferro a Diamante e desbloqueie os rankings de elite.</span><div className="pl-live-chips"><b><Crown size={14}/> BENEFÍCIO PRO</b><b><Dumbbell size={14}/> 1 MARCA OFICIAL / MODALIDADE / DIA</b><b><Diamond size={14}/> FERRO → DIAMANTE</b><b><Trophy size={14}/> ELITE + GERAL</b></div></div></section>
    <div className="pl-live-shell">
      <section className="pl-live-gate">
        <Smartphone size={34}/>
        <p>DISPONÍVEL NO APLICATIVO</p>
        <h2>Envio de vídeo e ranking acontecem no app</h2>
        <span>Aqui no site você conhece a sistemática completa do Power Lift. Para enviar seu vídeo, acompanhar sua categoria e entrar nos rankings, abra o aplicativo Invictus com sua conta.</span>
        <div className="pl-live-howto">
          <article><Video size={16}/><div><b>Grave o levantamento</b><span>Um vídeo contínuo por modalidade por dia, mostrando os pesos utilizados e a execução completa do movimento em ambiente de academia.</span></div></article>
          <article><ShieldCheck size={16}/><div><b>Validação automática e revisão Invictus</b><span>Cada vídeo é analisado antes de contar no ranking. Quando necessário, a equipe Invictus faz uma revisão adicional.</span></div></article>
          <article><Diamond size={16}/><div><b>Suba de categoria</b><span>Cada modalidade evolui por Ferro, Bronze, Prata, Ouro, Platina e Diamante. Uma marca homologada avança no máximo uma categoria por vez, mesmo superando a próxima faixa.</span></div></article>
        </div>
      </section>

      <AppDownloadPanel/>

      <section className="pl-live-rules"><article><Crown/><h3>Benefício exclusivo PRO</h3><p>O Power Lift é um benefício competitivo do Invictus PRO para Supino, Agachamento Livre e Levantamento Terra, organizado em temporadas de 30 dias.</p></article><article><ShieldCheck/><h3>Marca oficial auditada</h3><p>O envio do vídeo e a validação — automática e, quando necessário, manual — acontecem no aplicativo antes de a marca valer no ranking.</p></article><article><Trophy/><h3>Ranking Elite e Ranking Geral</h3><p>Chegar a Diamante numa modalidade libera o Ranking Elite dela. Chegar a Diamante nas três modalidades na mesma temporada (Triplo Diamante) libera o Ranking Geral daquela categoria sexual.</p></article><article><Coins/><h3>Recompensas em Invictus Coins</h3><p>Cada categoria conquistada paga Coins uma única vez por modalidade e temporada. Os pódios de cada modalidade e o prêmio Master do Ranking Geral são liquidados em Coins após o fechamento da temporada.</p></article></section>
    </div>
  </main>;
}
