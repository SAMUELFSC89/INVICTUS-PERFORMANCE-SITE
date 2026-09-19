import { ArrowLeft, BarChart3, Coins, Crown, Plus, ShieldCheck, Smartphone, UserPlus, Users } from 'lucide-react';
import AppDownloadPanel from './AppDownloadPanel';
import './PrivateChallengesPortal.css';

export default function PrivateChallengesPortalPage() {
  return <main className="friends-live-page">
    <header className="friends-live-header"><a href="/"><ArrowLeft size={17}/> Início</a><a className="friends-live-logo" href="/">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>

    <section className="friends-live-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(4,4,4,.97),rgba(4,4,4,.42)),url(/assets/invictus/friends-hero.webp)'}}>
      <div><p>BENEFÍCIO EXCLUSIVO INVICTUS PRO</p><h1>ENTRE <em>AMIGOS</em></h1><h2>Seu treino vira uma disputa de verdade.</h2><span>Crie um desafio privado, convide seus amigos e acompanhe a classificação pelo IGA dentro da janela oficial do desafio. Se o grupo quiser, cada participante pode colocar Invictus Coins para formar um pote interno para o vencedor.</span><div className="friends-live-chips"><b><BarChart3 size={14}/> RANKING POR IGA</b><b><Coins size={14}/> COINS OPCIONAIS</b><b><Users size={14}/> GRUPO PRIVADO</b></div></div>
    </section>

    <div className="friends-live-shell">
      <section className="friends-live-gate">
        <Smartphone size={34}/>
        <p>DISPONÍVEL NO APLICATIVO</p>
        <h2>Criar, convidar e acompanhar acontece no app</h2>
        <span>Aqui no site você conhece o Entre Amigos. Para criar um desafio, entrar com um código de convite ou acompanhar a classificação em tempo real, abra o aplicativo Invictus com sua conta.</span>
        <div className="friends-live-howto">
          <article><Plus size={16}/><div><b>Crie o desafio</b><span>Defina nome, duração e se haverá prêmio opcional em Coins.</span></div></article>
          <article><UserPlus size={16}/><div><b>Convide pelo código</b><span>Compartilhe o código de convite com seus parceiros de treino.</span></div></article>
          <article><BarChart3/><div><b>Acompanhe o IGA</b><span>A classificação atualiza em tempo real até o fim da janela do desafio.</span></div></article>
        </div>
      </section>

      <AppDownloadPanel/>

      <section className="friends-live-rules"><article><BarChart3/><h3>IGA decide a disputa</h3><p>O motor calcula o IGA de cada participante dentro do período do próprio desafio, com atualização da classificação durante a janela. O placar não depende de pontuação manual.</p></article><article><Coins/><h3>Prêmio em Invictus Coins</h3><p>O valor por participante é opcional. Quando ativado, as Coins formam um pote interno do ecossistema e não representam dinheiro sacável.</p></article><article><Crown/><h3>Desempate automático</h3><p>Empate no topo estende o desafio por 1 dia uma única vez. Se persistir, o pote é dividido entre os líderes; com menos de 2 participantes, as Coins são devolvidas.</p></article></section>
      <p className="friends-live-pro-note"><ShieldCheck size={14}/> Entre Amigos é um benefício exclusivo do Invictus PRO. A criação e a participação exigem um entitlement PRO ativo na sua conta.</p>
    </div>
  </main>;
}
