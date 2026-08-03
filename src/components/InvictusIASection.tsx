/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Mic, 
  Sparkles, 
  Brain, 
  Lock, 
  Activity, 
  Volume2, 
  CheckCircle2, 
  Play, 
  Pause,
  MessageSquare,
  Shield,
  Zap,
  TrendingUp,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InvictusLogo from './InvictusLogo';

interface InvictusIASectionProps {
  onScrollToDownload?: () => void;
}

export default function InvictusIASection({ onScrollToDownload }: InvictusIASectionProps) {
  const [isListening, setIsListening] = useState(true);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  const samplePrompts = [
    {
      userQuery: "Como esteve minha recuperação cardíaca na última semana em comparação com o mês passado?",
      iaResponse: "Sua frequência cardíaca de repouso caiu de 62 BPM para 58 BPM. A variabilidade da frequência cardíaca (VFC) subiu 14%, indicando excelente adaptação ao volume do Centro de Performance.",
      statsHighlight: "FCR: 58 BPM (-4) • VFC: +14%"
    },
    {
      userQuery: "Qual é o meu progresso no Índice Geral Invictus (IGA) deste mês?",
      iaResponse: "Você atingiu 84/100 no IGA, impulsionado por 98% de consistência nas sessões de força e cardio auditadas. Recomendamos manter 48h de recuperação ativa.",
      statsHighlight: "IGA: 84/100 • Consistência: 98%"
    },
    {
      userQuery: "Analisar meu VO2 Máx e capacidade cardiovascular atual.",
      iaResponse: "Seu VO2 Máx estimado é de 48,7 mL/kg/min (+5,1% neste trimestre). Suas sessões de corrida mantiveram-se predominantemente na Zona 3 com baixo estresse cardíaco.",
      statsHighlight: "VO2 Máx: 48.7 mL/kg/min (+5.1%)"
    }
  ];

  const handleSelectPrompt = (index: number) => {
    if (index === activePromptIndex) return;
    setIsThinking(true);
    setActivePromptIndex(index);
    setTimeout(() => {
      setIsThinking(false);
    }, 600);
  };

  return (
    <section
      id="invictus-ia"
      className="relative w-full py-28 sm:py-36 bg-[#040406] text-white overflow-hidden border-b border-zinc-900"
    >
      {/* ------------------- ATMOSPHERIC GYM BACKGROUND & AMBIENT LIGHT ------------------- */}
      {/* Subtle Magenta/Cyan Spotlights imitating high-end gym neon lighting */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-purple-900/15 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-cyan-900/15 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-pink-600/5 rounded-full blur-[200px] pointer-events-none z-0" />

      {/* Discreet Gym Background Texture Overlay (Squat rack / Dumbbells silhouette effect) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,rgba(4,4,6,0.95)_80%)] pointer-events-none z-0" />

      {/* Decorative Gym Hardware Silhouettes in background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 overflow-hidden">
        {/* Abstract Dumbbells / Metallic Grid silhouette */}
        <div className="absolute top-20 left-10 w-96 h-96 border-4 border-white/20 rounded-full blur-sm" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-10 w-80 h-[500px] border-r-2 border-white/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ------------------- TOP SECTION HEADER / BRANDING ------------------- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-xl flex items-center justify-center">
              <InvictusLogo size={24} showText={false} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-400 font-bold uppercase block">
                CÉREBRO TECNOLÓGICO DO INVICTUS
              </span>
              <h3 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                INVICTUS IA <span className="text-xs px-2 py-0.5 bg-cyan-950 border border-cyan-500/30 text-cyan-400 rounded-full font-mono font-normal">SISTEMA ATIVO</span>
              </h3>
            </div>
          </div>

          {/* Top Right Floating Frosted Glass Pill (Matching uploaded reference pill UI) */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 px-5 py-2.5 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-purple-950/40"
          >
            {/* Glowing Mini Orb */}
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 animate-ping opacity-30" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/50">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-200 flex items-center gap-1.5 font-sans">
                Invictus IA ouvindo...
              </span>
            </div>

            {/* Live Audio Equalizer Bars */}
            <div className="flex items-center gap-1 h-4 ml-2">
              {[40, 80, 100, 60, 90, 45, 75, 95, 50, 85, 30, 70].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: isListening ? [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] : '20%' }}
                  transition={{ repeat: Infinity, duration: 0.8 + (i % 4) * 0.2, ease: "easeInOut" }}
                  className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-cyan-400' : 'bg-pink-500'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ------------------- MAIN COMPOSITION GRID ------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4">

          {/* LEFT COLUMN: Clean Typography Block (Exact wording from uploaded image) */}
          <div className="lg:col-span-5 text-left space-y-8 z-20">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full text-xs font-mono text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                INTEGRACÃO DE VOZ + DADOS BIOMÉTRICOS
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-[1.12]">
                TECNOLOGIA QUE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300">
                  OUVE, ENTENDE
                </span> E <br />
                IMPULSIONA SUA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600">
                  EVOLUÇÃO.
                </span>
              </h2>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-normal antialiased">
                A Invictus IA utiliza inteligência artificial avançada e dados reais para entregar respostas precisas, análises profundas e insights que transformam seu desempenho todos os dias.
              </p>
            </div>

            {/* Interactive Query Selectors */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-semibold">
                EXPERIMENTE OS COMANDOS DE VOZ:
              </span>
              
              <div className="space-y-2">
                {samplePrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPrompt(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                      activePromptIndex === idx
                        ? 'bg-zinc-900/90 border-cyan-500/50 text-white shadow-lg shadow-cyan-950/40'
                        : 'bg-zinc-950/60 hover:bg-zinc-900/50 border-zinc-900 text-zinc-400'
                    }`}
                  >
                    <span className="truncate pr-3 font-medium">"{item.userQuery}"</span>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${activePromptIndex === idx ? 'text-cyan-400 translate-x-1' : 'text-zinc-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Security & Data Integrity Badge */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl flex items-center gap-3">
              <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-xs text-zinc-400 leading-normal">
                <strong className="text-zinc-200">Privacidade Absoluta:</strong> Apenas dados biométricos reais e autorizados alimentam os modelos de linguagem.
              </p>
            </div>
          </div>

          {/* CENTER & RIGHT COLUMN: THE HERO VISUAL COMPOSITION (ORB + WAVEFORM + PHONE + SHAKER) */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[500px]">

            {/* HORIZONTAL CONTINUOUS AUDIO EQUALIZER WAVE (Spans across center) */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-24 flex items-center justify-between px-2 pointer-events-none z-10 opacity-70">
              <div className="w-full h-full flex items-center justify-center gap-1">
                {Array.from({ length: 60 }).map((_, idx) => {
                  const distFromCenter = Math.abs(idx - 30);
                  const baseHeight = Math.max(10, 100 - distFromCenter * 3);
                  return (
                    <motion.div
                      key={idx}
                      animate={{
                        height: isListening 
                          ? [`${Math.max(15, baseHeight * 0.2)}%`, `${Math.min(100, baseHeight * 1.1)}%`, `${Math.max(10, baseHeight * 0.3)}%`]
                          : `${baseHeight * 0.3}%`
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7 + (idx % 5) * 0.15,
                        ease: "easeInOut"
                      }}
                      className={`w-1 rounded-full ${
                        idx < 30 
                          ? 'bg-gradient-to-t from-pink-600 via-purple-500 to-pink-400' 
                          : 'bg-gradient-to-t from-cyan-600 via-teal-400 to-cyan-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* ------------------- THE CENTRAL GLOWING SPHERE (ORB) ------------------- */}
            <div className="relative z-20 flex items-center justify-center my-8">
              
              {/* Outer Atmospheric Glow Halos */}
              <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-tr from-pink-600/30 via-purple-600/20 to-cyan-400/30 blur-[60px] animate-pulse pointer-events-none" />
              <div className="absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full bg-cyan-500/20 blur-[40px] pointer-events-none" />

              {/* Orbiting Rotating Energy Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[290px] h-[290px] sm:w-[350px] sm:h-[350px] rounded-full border-2 border-dashed border-cyan-400/30 p-2 pointer-events-none"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full border border-pink-500/30 pointer-events-none"
              />

              {/* Main Sphere Container */}
              <div className="relative w-[240px] h-[240px] sm:w-[290px] sm:h-[290px] rounded-full bg-black/90 p-1.5 shadow-[0_0_80px_rgba(6,182,212,0.5)] border border-cyan-400/50 flex items-center justify-center overflow-hidden backdrop-blur-md">
                
                {/* Internal Sphere Fluid Neon Light Layer */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.8),rgba(236,72,153,0.7)_60%,rgba(5,5,5,0.95)_100%)] opacity-80" />
                
                {/* Glowing Core Wave Surface Effect */}
                <div className="absolute inset-2 rounded-full bg-black/70 flex items-center justify-center p-6 border border-white/20">
                  
                  {/* Internal Sphere Content: Spartan Logo + Text */}
                  <div className="flex flex-col items-center text-center space-y-2 z-10">
                    <motion.div 
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="p-3 bg-cyan-950/80 border border-cyan-400/60 rounded-full text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)]"
                    >
                      <InvictusLogo size={36} showText={false} />
                    </motion.div>

                    <h4 className="text-white text-base sm:text-lg font-black font-display tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      INVICTUS IA
                    </h4>

                    <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300 font-bold uppercase animate-pulse flex items-center gap-1 bg-black/60 px-3 py-1 rounded-full border border-cyan-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      {isThinking ? "ANALISANDO..." : "OUVINDO..."}
                    </span>
                  </div>

                </div>

                {/* Glass Reflection Highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-full pointer-events-none" />
              </div>

            </div>

            {/* ------------------- INTERACTIVE RESPONSE CARD BELOW SPHERE ------------------- */}
            <motion.div 
              key={activePromptIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xl p-6 bg-zinc-950/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl space-y-3 text-left shadow-2xl relative z-20"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                  <Bot className="w-4 h-4" />
                  <span>RESPOSTA EM TEMPO REAL</span>
                </div>
                <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full font-semibold">
                  {samplePrompts[activePromptIndex].statsHighlight}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                {samplePrompts[activePromptIndex].iaResponse}
              </p>

              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auditado com Apple Health & Strava
                </span>
                <span className="text-zinc-400">Voz Sincronizada</span>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ------------------- BOTTOM FEATURE STRIP (Apple / Tesla level design) ------------------- */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-zinc-900/80">
          <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-3xl text-left space-y-2 hover:border-cyan-500/30 transition-all">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-cyan-400 mb-2">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white font-display">Interpretação de Indicadores</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Explica o significado de métricas corporais, zonas de esforço e índices de recuperação em linguagem simples e acionável.
            </p>
          </div>

          <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-3xl text-left space-y-2 hover:border-cyan-500/30 transition-all">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-pink-400 mb-2">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white font-display">Comandos por Voz em Tempo Real</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consulte suas estatísticas ou faça perguntas sobre conceitos fisiológicos conversando naturalmente enquanto treina.
            </p>
          </div>

          <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-3xl text-left space-y-2 hover:border-cyan-500/30 transition-all">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-cyan-400 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white font-display">Uso Autorizado & Proteção de Dados</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A IA utiliza exclusivamente os dados autorizados pelo usuário no Centro de Performance para gerar análises totalmente personalizadas.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
