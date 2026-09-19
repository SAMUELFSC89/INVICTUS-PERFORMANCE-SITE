import { ArrowLeft, ArrowRight, AlertTriangle, Banknote, Coins, FileText, Gift, ShieldCheck, Trophy } from 'lucide-react';
import './ExplainerPortal.css';

export default function InvictusEconomyPage() {
  return <main className="explain-page">
    <header className="explain-header"><a href="/"><ArrowLeft size={17} /> Início</a><a className="explain-logo" href="/">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>

    <section className="explain-hero"><div>
      <p className="explain-eyebrow">RECOMPENSAS E PREMIAÇÃO</p>
      <h1>ECONOMIA <em>INVICTUS</em></h1>
      <span>O Invictus tem duas formas de recompensa, e elas não se misturam: Invictus Coins, a moeda interna do ecossistema, e a premiação em dinheiro real dos campeonatos pagos. Esta página explica exatamente o que é cada uma, para onde vai e como sacar quando aplicável.</span>
      <div className="explain-chips"><b><Coins size={13} /> COINS · SEM VALOR EM DINHEIRO</b><b><Banknote size={13} /> PREMIAÇÃO · DINHEIRO REAL VIA PIX</b><b><ShieldCheck size={13} /> DOIS SALDOS SEPARADOS</b></div>
    </div></section>

    <div className="explain-shell">
      <div className="explain-section-title"><p>DUAS COISAS DIFERENTES</p><h2>Coins não são dinheiro. Premiação de campeonato é.</h2></div>
      <div className="explain-split">
        <article><h3><Coins size={18} /> Invictus Coins</h3>
          <p>Coins são pontos promocionais internos e cumulativos, usados para resgates na Loja Invictus (produtos e Drops limitados).</p>
          <ul>
            <li>Ganhas em missões, desafios, campeonatos e no Power Lift.</li>
            <li>Gastas na Loja: compra com Coins ou combinação de Coins e dinheiro.</li>
            <li>Não são moeda, ativo financeiro, dinheiro eletrônico ou investimento.</li>
            <li>Não têm cotação fixa em reais, não rendem juros e não podem ser sacadas via PIX, transferidas ou convertidas em dinheiro.</li>
          </ul>
        </article>
        <article className="highlight"><h3><Banknote size={18} /> Premiação em dinheiro</h3>
          <p>Campeonatos pagos com premiação publicada pagam em dinheiro real (R$) aos colocados, conforme o regulamento específico daquela edição.</p>
          <ul>
            <li>Valor, quantidade de posições premiadas e data de homologação ficam publicados na edição antes da inscrição.</li>
            <li>Pago após o encerramento e a homologação do resultado, podendo aguardar revisões pendentes.</li>
            <li>Saldo separado do saldo de Coins — um nunca vira o outro.</li>
            <li>Sujeito às regras de cancelamento, reembolso e chargeback do regulamento da edição.</li>
          </ul>
        </article>
      </div>

      <div className="explain-section-title"><p>DE ONDE VÊM AS COINS</p><h2>Formas confirmadas de ganhar e gastar</h2></div>
      <div className="explain-steps">
        <article><Trophy size={20} /><div><b>Competindo</b><span>Participação e resultado em missões, desafios Entre Amigos e campeonatos podem pagar Coins, conforme o recurso e a regra vigente.</span></div></article>
        <article><Gift size={20} /><div><b>Resgatando</b><span>As Coins são usadas na Loja Invictus: produtos, recompensas e Drops de lançamento limitado, em compra só com Coins ou combinada com dinheiro.</span></div></article>
        <article><ShieldCheck size={20} /><div><b>Corrigidas quando necessário</b><span>Créditos obtidos por erro, duplicidade ou fraude podem ser corrigidos pelo Invictus, com registro auditável.</span></div></article>
      </div>

      <div className="explain-callout"><AlertTriangle size={20} /><div><b>Importante</b><p>Assinatura PRO não compra pontuação, Coins, produto, colocação ou participação em campeonato — o benefício do PRO está nos recursos digitais da oferta, não em vantagem competitiva ou financeira.</p></div></div>

      <div className="explain-legal"><h3><FileText size={16} /> Onde estão as regras completas</h3><p>As condições de Coins estão nos Termos de Uso. Prêmios em dinheiro seguem o regulamento específico publicado em cada edição de campeonato pago, disponível antes da inscrição.</p><a href="/termos#sec-8">Termos de Uso · Invictus Coins <ArrowRight size={13} /></a><a href="/campeonatos">Ver campeonatos com premiação publicada <ArrowRight size={13} /></a></div>
    </div>
  </main>;
}
