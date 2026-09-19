import { ArrowLeft, ArrowRight, Activity, AlertTriangle, BrainCircuit, FileText, RefreshCcw, Target } from 'lucide-react';
import AppDownloadPanel from './AppDownloadPanel';
import './ExplainerPortal.css';

export default function SmartTrainingPage() {
  return <main className="explain-page">
    <header className="explain-header"><a href="/"><ArrowLeft size={17} /> Início</a><a className="explain-logo" href="/">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>

    <section className="explain-hero"><div>
      <p className="explain-eyebrow">COMO O INVICTUS MONTA SEU TREINO</p>
      <h1>TREINO <em>INTELIGENTE</em></h1>
      <span>Todo atleta Invictus treina com um plano estruturado, montado por um motor de prescrição próprio a partir do seu objetivo, experiência e equipamento disponível. No plano PRO, uma camada adicional de inteligência artificial refina esse plano dentro de limites seguros — sem nunca deixar você sem treino se a IA estiver indisponível.</span>
      <div className="explain-chips"><b><Target size={13} /> MOTOR DE PRESCRIÇÃO EM TODOS OS PLANOS</b><b><BrainCircuit size={13} /> REFINAMENTO POR IA NO PRO</b><b><RefreshCcw size={13} /> RESERVA AUTOMÁTICA SE A IA FALHAR</b></div>
    </div></section>

    <div className="explain-shell">
      <div className="explain-section-title"><p>COMO FUNCIONA</p><h2>Do seu perfil ao treino do dia</h2></div>
      <div className="explain-steps">
        <article><Target size={20} /><div><b>Seu objetivo e contexto</b><span>Você informa objetivo, experiência, dias e tempo disponíveis, equipamento e restrições de exercício. É a base do plano, em qualquer plano de assinatura.</span></div></article>
        <article><Activity size={20} /><div><b>Motor de prescrição</b><span>Um algoritmo baseado em regras monta o treino com exercícios do catálogo oficial Invictus, respeitando faixas de repetição, esforço e volume semanal por grupo muscular.</span></div></article>
        <article><BrainCircuit size={20} /><div><b>Refinamento por IA (PRO)</b><span>No PRO, a mesma estrutura passa por uma camada de inteligência artificial que pode ajustar exercícios, séries e repetições dentro do catálogo oficial e de limites seguros, com uma justificativa explicada.</span></div></article>
      </div>

      <div className="explain-section-title"><p>FREE E PRO</p><h2>A diferença é o refinamento, não a segurança</h2></div>
      <div className="explain-compare">
        <article><h3><Target size={16} /> Free</h3><ul>
          <li>Plano completo gerado pelo motor de prescrição.</li>
          <li>Exercícios do catálogo oficial Invictus.</li>
          <li>Ajustado ao seu objetivo, experiência, tempo e equipamento.</li>
          <li>Mesmas regras de segurança do PRO.</li>
        </ul></article>
        <article className="pro"><h3><BrainCircuit size={16} /> PRO</h3><ul>
          <li>Tudo o que o Free entrega, sempre.</li>
          <li>Camada extra de IA que refina exercícios, séries e repetições dentro do catálogo oficial.</li>
          <li>Justificativa explicada para cada ajuste da IA.</li>
          <li>Se a IA não responder, seu treino do dia continua vindo do motor de prescrição — automaticamente.</li>
        </ul></article>
      </div>

      <div className="explain-callout"><AlertTriangle size={20} /><div><b>Antes de treinar</b><p>O Invictus não é um dispositivo médico, não diagnostica lesões e não substitui avaliação de médico, nutricionista ou profissional de educação física. Nenhum plano usa idade, peso ou sexo para definir carga inicial. Adapte sempre os exercícios à sua condição, ambiente e equipamento, e interrompa a atividade diante de qualquer sinal de risco.</p></div></div>

      <div className="explain-legal"><h3><FileText size={16} /> Onde estão as regras completas</h3><p>Esta página explica como o recurso funciona. As condições de uso do treino e da inteligência artificial estão nos Termos de Uso, e o tratamento dos seus dados de treino está na Política de Privacidade.</p><a href="/termos#sec-4">Termos de Uso · Treinos e IA <ArrowRight size={13} /></a><a href="/privacidade#sec-3">Política de Privacidade · Finalidades <ArrowRight size={13} /></a></div>

      <AppDownloadPanel />
    </div>
  </main>;
}
