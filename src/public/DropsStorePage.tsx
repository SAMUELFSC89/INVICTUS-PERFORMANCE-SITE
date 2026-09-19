import { ArrowLeft, Coins, Gift, PackageSearch, ShieldCheck, ShoppingBag, Smartphone, Truck } from 'lucide-react';
import AppDownloadPanel from './AppDownloadPanel';
import './DropsStore.css';

export default function DropsStorePage(){
  return <main className="drops-live-page">
    <header className="drops-live-header"><a href="/"><ArrowLeft size={17}/> Início</a><a className="drops-live-logo" href="/">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>
    <section className="drops-live-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(4,4,4,.97),rgba(4,4,4,.48)),url(/assets/invictus/drops-hero.webp)'}}><div><p>PRODUTOS. RECOMPENSAS. EXPERIÊNCIA INVICTUS.</p><h1>DROPS <em>INVICTUS</em></h1><span>Produtos e recompensas do universo Invictus, com lançamentos limitados que podem ser resgatados com Invictus Coins.</span><div className="drops-live-chips"><b><ShoppingBag size={14}/> PRODUTOS INVICTUS</b><b><Coins size={14}/> INVICTUS COINS</b><b><Truck size={14}/> PEDIDOS RASTREÁVEIS</b></div></div></section>
    <div className="drops-live-shell">
      <section className="drops-live-gate">
        <Smartphone size={34}/>
        <p>DISPONÍVEL NO APLICATIVO</p>
        <h2>Catálogo, compra e resgate acontecem no app</h2>
        <span>Aqui no site você conhece a Loja Invictus. Para ver o catálogo completo, comprar produtos ou resgatar um Drop com suas Coins, abra o aplicativo Invictus com sua conta.</span>
        <div className="drops-live-howto">
          <article><PackageSearch size={16}/><div><b>Explore o catálogo</b><span>Suplementos, vestuário, acessórios e combos do universo Invictus.</span></div></article>
          <article><Gift size={16}/><div><b>Resgate em Drops</b><span>Lançamentos limitados com estoque reservado, resgatáveis com Invictus Coins.</span></div></article>
          <article><Truck size={16}/><div><b>Acompanhe seu pedido</b><span>Pagamento, preparo e entrega rastreáveis direto na sua conta.</span></div></article>
        </div>
      </section>

      <AppDownloadPanel/>

      <section className="drops-live-rules"><article><ShieldCheck/><h3>100% seguro</h3><p>Pedidos rastreáveis do pagamento até a entrega, com endereço e status acompanhados na sua conta.</p></article><article><Coins/><h3>Invictus Coins</h3><p>Coins são recompensas do ecossistema: não têm valor em dinheiro, não são vendidas e não podem ser sacadas via PIX.</p></article><article><Gift/><h3>Drops limitados</h3><p>Cada Drop tem estoque separado e reservado — quando esgota, só volta na próxima janela.</p></article></section>
    </div>
  </main>;
}
