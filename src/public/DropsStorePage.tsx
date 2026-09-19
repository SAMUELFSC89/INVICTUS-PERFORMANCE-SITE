import { ArrowLeft, Bell, Coins, Gift, PackageSearch, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import AppDownloadPanel from './AppDownloadPanel';
import './DropsStore.css';

export default function DropsStorePage(){
  return <main className="drops-live-page">
    <header className="drops-live-header"><a href="/"><ArrowLeft size={17}/> Início</a><a className="drops-live-logo" href="/">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>
    <section className="drops-live-hero"><div><p>SUPLEMENTAÇÃO. RECOMPENSAS. PERFORMANCE.</p><h1>DROPS <em>INVICTUS</em></h1><span>Recompensas em suplementação para apoiar sua evolução, com foco principal em whey protein e creatina. Cada Drop apresenta todos os detalhes antes do resgate.</span><div className="drops-live-chips"><b><Sparkles size={14}/> WHEY E CREATINA</b><b><Coins size={14}/> INVICTUS COINS</b><b><Bell size={14}/> DROPS ANUNCIADOS NO APP</b></div></div></section>
    <div className="drops-live-shell">
      <section className="drops-live-gate">
        <Smartphone size={34}/>
        <p>RECOMPENSAS EM SUPLEMENTAÇÃO</p>
        <h2>Whey e creatina em edições limitadas</h2>
        <span>Cada edição informa a marca, a quantidade, o estoque disponível e as condições de resgate antes da sua confirmação.</span>
        <div className="drops-live-howto">
          <article><PackageSearch size={16}/><div><b>Recompensas para sua rotina</b><span>Whey e creatina são os principais tipos de suplemento dos Drops.</span></div></article>
          <article><Gift size={16}/><div><b>Detalhes antes do resgate</b><span>Marca, quantidade, estoque e regras aparecem em cada edição.</span></div></article>
          <article><Bell size={16}/><div><b>Aviso oficial</b><span>As novidades serão comunicadas pelo site e pelo aplicativo Invictus.</span></div></article>
        </div>
      </section>

      <AppDownloadPanel/>

      <section className="drops-live-rules"><article><ShieldCheck/><h3>Informação clara</h3><p>Você vê o suplemento, a quantidade, o estoque e as condições completas antes de usar suas Coins.</p></article><article><Coins/><h3>Invictus Coins</h3><p>Coins são recompensas do ecossistema: não têm valor em dinheiro, não são vendidas e não podem ser sacadas via PIX.</p></article><article><Gift/><h3>Whey e creatina</h3><p>São os principais prêmios dos Drops, sempre identificados com todos os detalhes da edição.</p></article></section>
    </div>
  </main>;
}
