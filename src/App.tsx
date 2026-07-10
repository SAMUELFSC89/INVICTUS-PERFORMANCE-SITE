/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Dumbbell, 
  Trophy, 
  ShieldCheck, 
  Calendar, 
  ChevronRight, 
  Star, 
  ArrowDown, 
  Activity, 
  Users, 
  CheckCircle2, 
  HeartPulse, 
  Sparkles, 
  Lock, 
  Map, 
  Award, 
  Zap, 
  Eye, 
  Clock, 
  UserPlus2,
  Navigation,
  Globe,
  Plus,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Target,
  Shield,
  Smartphone,
  CheckCircle,
  Footprints,
  Clock3,
  Dna,
  Share2,
  LockKeyhole
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SubPages from './components/SubPages';
import SmartphoneMockup from './components/SmartphoneMockup';
import InvictusLogo from './components/InvictusLogo';
import { PageType } from './types';

import HERO_IMG from './assets/images/invictus_hero_workout_1780252420177.png';
import COMMUNITY_IMG from './assets/images/invictus_community_1780252440371.png';
import SECURITY_IMG from './assets/images/invictus_security_1780252457263.png';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  
  // Cardio tab selector state
  const [activeCardioTab, setActiveCardioTab] = useState<'corrida' | 'caminhada' | 'bike' | 'academia' | 'outros'>('corrida');
  
  // Dashboard mock tab selector state
  const [activeDashboardRange, setActiveDashboardRange] = useState<'semanal' | 'mensal' | 'anual'>('semanal');
  
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    // Dismiss after 4s
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  };

  // Constants for Cardio interactive description
  const cardioDetails = {
    corrida: {
      title: "🏃 Corrida de Alta Performance",
      desc: "Ideal para ganho aeróbico bruto e queima calórica intensa. Validado de forma contínua através do GPS e sensores cardíacos do seu smartphone ou relógio.",
      stats: "Média recomendada: 20-50 minutos por sessão. Geração de streak acelerada.",
      tag: "GPS + FC",
      icon: <Activity className="w-6 h-6 text-amber-500 animate-pulse" />
    },
    caminhada: {
      title: "🚶 Caminhada Ativa",
      desc: "Excelente para a saúde circulatória e recuperação ativa muscular. O sistema de IA monitora sua cadência de passos para barrar falsos registros.",
      stats: "Média recomendada: 30-60 minutos. Excelente para dias de descanso ativo.",
      tag: "Passômetro",
      icon: <Footprints className="w-6 h-6 text-amber-500" />
    },
    bike: {
      title: "🚴 Ciclismo e Bike Indoor",
      desc: "Sincronização via sensores Bluetooth do rolo de treino, Strava ou via GPS assistido no percurso externo. Mapeamento de variação de ganho altimétrico.",
      stats: "Média recomendada: 30-90 minutos. Alto impacto no índice de resistência.",
      tag: "Velo-GPS",
      icon: <TrendingUp className="w-6 h-6 text-amber-500" />
    },
    academia: {
      title: "🏋️ Cardio na Academia",
      desc: "Treino aeróbico em esteiras, elípticos ou escadas mecânicas. Sincronizado instantaneamente a partir das imediações da academia homologada por você.",
      stats: "Média recomendada: 20-40 minutos. Integra as calorias de forma contínua.",
      tag: "Geocerca",
      icon: <Dumbbell className="w-6 h-6 text-amber-500" />
    },
    outros: {
      title: "➕ Outras Práticas Esportivas",
      desc: "Suporte a remo seco, natação e treinos funcionais variados compatíveis com relógios desportivos de precisão.",
      stats: "Exige relógio compatível com monitoramento cardíaco para validar o esforço.",
      tag: "Smartwatch",
      icon: <Plus className="w-6 h-6 text-amber-500" />
    }
  };

  // Listen to browser URL hash changes for deep linking routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validSubPages: PageType[] = ['terms', 'privacy', 'rules', 'faq', 'rewards', 'validation', 'account-deletion', 'support', 'incentives'];
      if (validSubPages.includes(hash as PageType)) {
        setCurrentPage(hash as PageType);
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (newPage: PageType) => {
    if (newPage === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = newPage;
    }
    setCurrentPage(newPage);
  };

  const handleScrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-[#050505] text-[#EDEDED] relative overflow-hidden min-h-screen flex flex-col font-sans select-none">
      
      {/* Absolute top glowing radial halo spanning background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(229,169,60,0.06)_0%,transparent_60%)] pointer-events-none z-0" />
      
      {/* Sticky header navigation */}
      <Navbar onNavigateToPage={navigateToPage} currentPage={currentPage} />

      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.main
            key="home-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full"
          >
            
            {/* SEÇÃO 1 — HERO SECTION */}
            <section
              id="hero"
              className="relative w-full overflow-hidden border-b border-zinc-950 pt-20 pb-16 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-b from-[#050505] to-[#080808]"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={HERO_IMG}
                  alt="Atletas focados treinando musculação de forma disciplinada na academia"
                  className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-[#050505]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)]" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Left Block text */}
                <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                  
                  {/* Premium Badges row */}
                  <div className="flex flex-wrap gap-2.5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-zinc-800/80 rounded-full">
                      <InvictusLogo size={18} showText={false} />
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#FFC107] font-semibold uppercase">
                        LIGA MERITOCRÁTICA FITNESS
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-mono text-amber-500 font-semibold uppercase">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                      100% Antifraude
                    </div>
                  </div>

                  {/* Heading Title */}
                  <h1 className="font-accent font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-none">
                    Transforme sua <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                      disciplina em resultados
                    </span>.
                  </h1>

                  {/* Hero Subtitle */}
                  <p className="text-zinc-200 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl antialiased">
                    O aplicativo de desafios fitness onde seus treinos geram pontos, sua evolução vira competição e sua dedicação leva você ao topo.
                  </p>

                  {/* Core Value Pillars row for fast 5-second comprehension */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-2">
                    <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Dumbbell className="w-4 h-4 text-amber-500" />
                        <span className="text-white text-[11px] font-semibold uppercase font-sans">Treinos</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">Gere pontos legítimos na musculação ou cardio.</p>
                    </div>
                    <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-white text-[11px] font-semibold uppercase font-sans">Competição</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">Participe de desafios estimulantes semanais.</p>
                    </div>
                    <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-amber-500" />
                        <span className="text-white text-[11px] font-semibold uppercase font-sans">Evolução</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">Acompanhe seu avanço em níveis de XP e consistência.</p>
                    </div>
                    <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-white text-[11px] font-semibold uppercase font-sans">Conquistas</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">Desbloqueie insígnias e recompensas meritocráticas.</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 font-light max-w-xl leading-relaxed">
                    O INVICTUS é uma plataforma focada unicamente em alta performance física desportiva de forma saudável. 
                    Nossa missão apoia-se em esforço comprovado, sem qualquer envolvimento com sorteios, loterias ou dinâmicas no estilo cassino.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                    <button
                      id="btn-hero-cta"
                      onClick={() => handleScrollToId('download')}
                      className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-xl text-center shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer font-sans text-sm tracking-wide"
                    >
                      Baixar Aplicativo e Começar
                    </button>
                    <button
                      id="btn-hero-secondary"
                      onClick={() => handleScrollToId('como-funciona')}
                      className="px-8 py-4 bg-zinc-950/85 hover:bg-zinc-900 border border-zinc-800 text-white font-semibold rounded-xl text-center transition-colors cursor-pointer font-sans text-sm tracking-wide"
                    >
                      Como Funciona & Ligas
                    </button>
                  </div>
                </div>

                {/* Right Block: Live Premium Smartphone mockup */}
                <div className="lg:col-span-5 flex justify-center relative w-full pt-6 lg:pt-4">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/10 to-transparent blur-3xl rounded-full opacity-60" />
                  <SmartphoneMockup onlyPhone={true} />
                </div>
              </div>
            </section>


            {/* SEÇÃO 1.5 — PROPÓSITO: O QUE É O INVICTUS PERFORMANCE */}
            <section
              id="propósito"
              className="py-20 sm:py-28 w-full border-b border-zinc-950 bg-gradient-to-b from-[#080808] to-[#050505] relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(229,169,60,0.03)_0%,transparent_60%)] pointer-events-none z-0" />
              
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  
                  {/* Left content block */}
                  <div className="lg:col-span-7 text-left space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 text-xs font-mono text-amber-500 w-fit">
                      <Star className="w-3.5 h-3.5 fill-amber-500/20" />
                      Constância e Resultado
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                      O que é o <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Invictus Performance</span>?
                    </h2>
                    
                    <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed antialiased">
                      <p className="font-medium text-white text-base sm:text-lg">
                        O Invictus Performance nasceu para resolver um dos maiores desafios de quem treina: manter a constância.
                      </p>
                      <p>
                        Transformamos disciplina em uma experiência competitiva, onde cada treino aproxima você dos seus objetivos. Conectando-se ao app, seu suor legítimo na musculação ou nos exercícios cardiovasculares gera pontuações auditáveis em tempo real.
                      </p>
                      <p>
                        Não oferecemos atalhos nem falsas promessas: aqui, cada grama de evolução é fruto do seu merecimento e dedicação.
                      </p>
                    </div>

                    {/* Differential highlight statement */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl border-l-4 border-l-amber-500 relative overflow-hidden group">
                      <p className="text-amber-400 font-display text-base sm:text-lg font-medium leading-relaxed italic relative z-10">
                        "Você não treina sozinho. Você entra em uma competição pela sua melhor versão."
                      </p>
                    </div>
                  </div>

                  {/* Right visual key card */}
                  <div className="lg:col-span-5">
                    <div className="p-8 bg-zinc-950/80 border border-zinc-900 rounded-3xl text-left space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150">
                        <InvictusLogo size={90} showText={false} />
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">O Diferencial Principal</span>
                        <h4 className="text-lg font-semibold text-white">Construindo Hábitos Pró</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                          <div className="p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-amber-500 shrink-0">
                            <Flame className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Offline vs Online</h5>
                            <p className="text-xs text-zinc-400 mt-0.5">Sua dedicação diária presencial transposta com precisão para uma liga digital estimulante.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-amber-500 shrink-0">
                            <Trophy className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Ligas de Nível Justo</h5>
                            <p className="text-xs text-zinc-400 mt-0.5">Sem amadorismo. Você compete em grupos de afinidade física pareados com seu ritmo.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-amber-500 shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Evolução de Atleta</h5>
                            <p className="text-xs text-zinc-400 mt-0.5">Sua dedicação monitorada de forma limpa, gerando conquistas duradouras.</p>
                          </div>
                        </div>
                      </div>

                      <div className="h-[1px] bg-zinc-900 w-full" />

                      <button
                        onClick={() => handleScrollToId('como-funciona')}
                        className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-mono font-bold tracking-widest uppercase text-white transition-colors"
                      >
                        Descubra o Funcionamento
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </section>


            {/* SEÇÃO 2 — COMO FUNCIONA (PASSO A PASSO) */}
            <section
              id="como-funciona"
              className="py-24 sm:py-32 w-full border-b border-zinc-950 bg-gradient-to-b from-[#050505] to-[#080808]"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                  <span className="text-[#E5A93C] font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                    SIMPLES • PRÁTICO • ESTIMULANTE
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                    Como funciona o Invictus?
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Sua constância esportiva em um ciclo virtuoso perfeito de apenas 4 passos.
                  </p>
                </div>

                {/* Redesigned 4-Step cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  
                  {/* Passo 1 */}
                  <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col justify-between hover:border-amber-500/20 hover:bg-zinc-950 transition-all duration-300 relative group text-left h-[260px]">
                    <span className="text-5xl font-mono text-zinc-900 group-hover:text-amber-500/10 transition-colors duration-300 absolute top-4 right-6 font-bold font-accent">01</span>
                    <div className="space-y-4 pt-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl w-fit text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Map className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-semibold text-white">1 - Entre em um desafio</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                          Escolha uma competição ativa na plataforma e confirme sua participação para iniciar a disputa.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Passo 2 */}
                  <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col justify-between hover:border-amber-500/20 hover:bg-zinc-950 transition-all duration-300 relative group text-left h-[260px]">
                    <span className="text-5xl font-mono text-zinc-900 group-hover:text-amber-500/10 transition-colors duration-300 absolute top-4 right-6 font-bold font-accent">02</span>
                    <div className="space-y-4 pt-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl w-fit text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Clock3 className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-semibold text-white">2 - Treine e acumule pontos</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                          Sua dedicação gera evolução. Faça treinos legítimos presenciais ou cardios rastreáveis para gerar XP.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Passo 3 */}
                  <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col justify-between hover:border-amber-500/20 hover:bg-zinc-950 transition-all duration-300 relative group text-left h-[260px]">
                    <span className="text-5xl font-mono text-zinc-900 group-hover:text-amber-500/10 transition-colors duration-300 absolute top-4 right-6 font-bold font-accent">03</span>
                    <div className="space-y-4 pt-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl w-fit text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-semibold text-white">3 - Suba no ranking</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                          Compare seu desempenho em chaves regionais equilibradas. Acompanhe a tabela liderada por mérito.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Passo 4 */}
                  <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col justify-between hover:border-amber-500/20 hover:bg-zinc-950 transition-all duration-300 relative group text-left h-[260px]">
                    <span className="text-5xl font-mono text-zinc-900 group-hover:text-amber-500/10 transition-colors duration-300 absolute top-4 right-6 font-bold font-accent">04</span>
                    <div className="space-y-4 pt-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl w-fit text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-semibold text-white">4 - Supere seus limites</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                          Evolua junto com a comunidade. Mantenha streaks ativos e atinja novos limites físicos a cada semana.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO 2.5 — EXPLORE A INTERFACE */}
            <section
              id="interface"
              className="py-24 sm:py-32 w-full border-b border-zinc-950 bg-gradient-to-b from-[#080808] to-[#050505]"
            >
              <div className="max-w-7xl mx-auto px-6">
                <SmartphoneMockup />
              </div>
            </section>


            {/* NEW SECTION — PLANOS */}
            <section
              id="planos"
              className="py-24 sm:py-32 w-full border-b border-zinc-950 bg-gradient-to-b from-[#080808] to-[#050505]"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                  <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                    ACESSO EXCLUSIVO
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                    Escolha o plano ideal para sua rotina
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Comece com o Plano Essencial ou libere a experiência máxima de performance no Plano Performance.
                  </p>
                </div>

                {/* Grid of plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                  
                  {/* Plano Essencial */}
                  <div className="p-8 bg-zinc-950/45 border-2 border-zinc-900 hover:border-zinc-850 rounded-3xl flex flex-col justify-between transition-all duration-300 text-left relative overflow-hidden">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white uppercase font-sans">Plano Essencial</h3>
                        <p className="text-xs text-zinc-500 leading-normal">
                          Entrada para o universo Invictus.
                        </p>
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-baseline gap-1 py-2">
                        <span className="text-sm text-zinc-400 font-mono leading-none">R$</span>
                        <span className="text-5xl font-bold text-white font-mono leading-none">9,90</span>
                        <span className="text-sm text-zinc-500 font-mono leading-none">/ mês</span>
                      </div>

                      {/* Divider */}
                      <div className="h-[1px] bg-zinc-900/80 w-full" />

                      {/* Benefits list */}
                      <div className="space-y-3.5">
                        <p className="text-xs font-semibold text-zinc-400 font-mono uppercase tracking-widest mb-1">Recursos Incluídos:</p>
                        {[
                          "Check-in inteligente via celular",
                          "Sistema de rankings regionais",
                          "Acompanhamento de cardio nativo",
                          "Treinos de academia monitorados",
                          "Mecanismos de segurança antifraude",
                          "Criação de desafios privados com amigos",
                          "Histórico cronológico de atividades",
                          "Evoluição por níveis e XP"
                        ].map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-zinc-300 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8">
                      <button
                        onClick={() => handleScrollToId('download')}
                        className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-semibold rounded-2xl transition-colors cursor-pointer text-sm font-mono uppercase tracking-widest"
                      >
                        Selecionar Essencial
                      </button>
                    </div>
                  </div>

                  {/* Plano Performance */}
                  <div className="p-8 bg-zinc-950 border-2 border-amber-500 rounded-3xl flex flex-col justify-between transition-all duration-300 text-left relative overflow-hidden ring-4 ring-amber-500/5">
                    
                    {/* RECOMMENDED BADGE */}
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-black px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold font-mono uppercase tracking-widest select-none">
                      Plano recomendado
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white uppercase font-sans">Plano Performance</h3>
                        <p className="text-xs text-zinc-400 leading-normal">
                          Experiência completa para quem quer competir no máximo nível.
                        </p>
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-baseline gap-1 py-2">
                        <span className="text-sm text-zinc-400 font-mono leading-none">R$</span>
                        <span className="text-5xl font-bold text-amber-500 font-mono leading-none">49,90</span>
                        <span className="text-sm text-zinc-500 font-mono leading-none">/ mês</span>
                      </div>

                      {/* Divider */}
                      <div className="h-[1px] bg-zinc-900/80 w-full" />

                      {/* Benefits list */}
                      <div className="space-y-3.5">
                        <p className="text-xs font-semibold text-amber-400 font-mono uppercase tracking-widest mb-1">Recursos Máximos Incluídos:</p>
                        {[
                          "Tudo contido no Plano Essencial",
                          "Sincronização com relógios inteligentes",
                          "Captura de frequência cardíaca real",
                          "Medição precisa de calorias gastas",
                          "Relatórios avançados periódicos",
                          "Métricas semanais, mensais e anuais",
                          "Análise profunda de performance mecânica",
                          "Estatísticas desportivas avançadas"
                        ].map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-zinc-300 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className={idx > 0 ? "text-amber-200 font-medium" : ""}>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8">
                      <button
                        onClick={() => handleScrollToId('download')}
                        className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-2xl transition-all cursor-pointer text-sm font-mono uppercase tracking-widest shadow-lg shadow-amber-500/5 hover:scale-[1.01]"
                      >
                        Assinar Performance
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — SISTEMA DE SEGURANÇA ANTIFRAUDE */}
            <section
              id="antifraude"
              className="py-24 sm:py-32 w-full bg-[#050505] border-b border-zinc-950"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  
                  {/* Left Column: Informative textual base */}
                  <div className="lg:col-span-4 space-y-6 text-left">
                    <span className="text-[#FF5500] font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                      AUDITORIA E JUSTIÇA
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                      Segurança em múltiplas camadas
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                      O INVICTUS utiliza um dos sistemas de validação mais completos do segmento fitness para assegurar a idoneidade da nossa tabela de líderes.
                    </p>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Todas as auditorias respeitam integralmente os direitos de privacidade e anonimização de suas rotas, avaliando apenas dados agregados e de esforço bruto necessários para autenticar cada atividade esportiva.
                    </p>

                    <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-900/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-mono font-medium">Conexão Segura SSL</span>
                      </div>
                      <span className="text-[10px] font-mono bg-green-950 text-green-400 px-2 py-0.5 rounded-full">ATIVO</span>
                    </div>
                  </div>

                  {/* Right Column: Beautiful 8 Validation Cards */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Card 1 */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left h-40">
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-550/10 text-amber-500 rounded-xl">
                          <Map className="w-5 h-5" />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">CAMADA 1</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Geolocalização Inteligente</h4>
                        <p className="text-xs text-zinc-500 leading-normal">Validação rigorosa de presença do atleta no local de treino escolhido por meio de checagem espacial.</p>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left h-40">
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-550/10 text-amber-500 rounded-xl">
                          <Clock className="w-5 h-5" />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">CAMADA 2</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Permanência Real</h4>
                        <p className="text-xs text-zinc-500 leading-normal">Validação em segundo plano do tempo mínimo de treinamento na academia para certificar esforço verídico.</p>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left h-40">
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-550/10 text-amber-500 rounded-xl">
                          <Activity className="w-5 h-5" />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">CAMADA 3</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Análise de Movimento</h4>
                        <p className="text-xs text-zinc-500 leading-normal">Análise estatística de cadência e aceleração para neutralizar registros por veículos ou robôs simuladores.</p>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left h-40">
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-550/10 text-amber-500 rounded-xl">
                          <Lock className="w-5 h-5" />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">CAMADA 4</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Validação por Sensores</h4>
                        <p className="text-xs text-zinc-500 leading-normal">Leitura matemática inteligente de sensores integrados nos dispositivos móveis dos esportistas.</p>
                      </div>
                    </div>

                    {/* Card 5 */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left h-40">
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-550/10 text-amber-500 rounded-xl">
                          <Zap className="w-5 h-5" />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">CAMADA 5</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Verificações Aleatórias</h4>
                        <p className="text-xs text-zinc-500 leading-normal">Confirmas ocasionais extras solicitadas de forma discreta pela plataforma para manter o equilíbrio.</p>
                      </div>
                    </div>

                    {/* Card 6 */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left h-40">
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-550/10 text-amber-500 rounded-xl">
                          <Eye className="w-5 h-5" />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">CAMADA 6</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Revisão Manual</h4>
                        <p className="text-xs text-zinc-500 leading-normal">Auditorias personalizadas conduzidas por nossa equipe técnica diante de comportamentos extremos de pontos.</p>
                      </div>
                    </div>

                    {/* Card 7 */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left h-40">
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-550/10 text-amber-500 rounded-xl">
                          <Users className="w-5 h-5" />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">CAMADA 7</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Denúncias da Comunidade</h4>
                        <p className="text-xs text-zinc-500 leading-normal">Sistema intuitivo integrado para relatar suspeitas de uso ilegal do perfil esportivo com transparência.</p>
                      </div>
                    </div>

                    {/* Card 8 */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left h-40">
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-550/10 text-amber-500 rounded-xl">
                          <ShieldCheck className="w-5 h-5" />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">CAMADA 8</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Score de Confiabilidade</h4>
                        <p className="text-xs text-zinc-500 leading-normal">Índice individual cumulativo atualizado por IA que afere a credibilidade de cada treino validado.</p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — CARDIO (MAIS FORMAS DE EVOLUIR) */}
            <section
              id="cardio"
              className="py-24 sm:py-32 w-full bg-gradient-to-b from-[#050505] to-[#080808] border-b border-zinc-950"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="text-[#E5A93C] font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                    CARDIO RASTREÁVEL
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                    Mais formas de evoluir
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Escolha a modalidade que melhor se adapta à sua rotina esportiva diária.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
                  
                  {/* Left: Tab Selectors */}
                  <div className="lg:col-span-5 space-y-4">
                    <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase text-left mb-2">Selecione o esporte:</p>
                    
                    <button
                      id="tab-corrida"
                      onClick={() => setActiveCardioTab('corrida')}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'corrida' 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-semibold text-sm sm:text-base">🏃 Corrida</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      id="tab-caminhada"
                      onClick={() => setActiveCardioTab('caminhada')}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'caminhada' 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-semibold text-sm sm:text-base">🚶 Caminhada</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      id="tab-bike"
                      onClick={() => setActiveCardioTab('bike')}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'bike' 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-semibold text-sm sm:text-base">🚴 Bike</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      id="tab-academia"
                      onClick={() => setActiveCardioTab('academia')}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'academia' 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-semibold text-sm sm:text-base">🏋️ Cardio na academia</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      id="tab-outros"
                      onClick={() => setActiveCardioTab('outros')}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'outros' 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-semibold text-sm sm:text-base">➕ Outros</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right: Dynamic Description Display Box */}
                  <div className="lg:col-span-12 xl:col-span-7 col-span-1 border border-zinc-800/80 bg-zinc-950/50 p-8 rounded-3xl min-h-[300px] flex flex-col justify-between text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none scale-[2]">
                      <InvictusLogo size={120} showText={false} />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-xs rounded-full uppercase tracking-wider font-semibold">
                          {cardioDetails[activeCardioTab].tag}
                        </span>
                        {cardioDetails[activeCardioTab].icon}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">{cardioDetails[activeCardioTab].title}</h3>
                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed antialiased">
                          {cardioDetails[activeCardioTab].desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-900 mt-6 text-zinc-500 text-xs sm:text-sm font-mono flex items-center gap-2">
                      <span className="text-amber-500">◆</span>
                      <span>{cardioDetails[activeCardioTab].stats}</span>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — PERFORMANCE (SEUS DADOS, SUA EVOLUÇÃO) */}
            <section
              id="performance"
              className="py-24 sm:py-32 w-full bg-[#050505] border-b border-zinc-950"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  
                  {/* Left Column: text content */}
                  <div className="lg:col-span-5 space-y-6 text-left">
                    <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                      TELEMETRIA COMPLETA
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                      Seus dados, sua evolução
                    </h2>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                      Visualize o progresso real de suas sessões de atividade física de maneira integrada e imersiva. 
                      Acompanhe em detalhes batimento cardíaco, calorias, streaks e tempos acumulados sem distrações promocionais agressivas.
                    </p>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setActiveDashboardRange('semanal')}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all border ${
                          activeDashboardRange === 'semanal' 
                            ? 'bg-amber-500 text-black border-amber-500' 
                            : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        Semanal
                      </button>
                      <button
                        onClick={() => setActiveDashboardRange('mensal')}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all border ${
                          activeDashboardRange === 'mensal' 
                            ? 'bg-amber-500 text-black border-amber-500' 
                            : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        Mensal
                      </button>
                      <button
                        onClick={() => setActiveDashboardRange('anual')}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all border ${
                          activeDashboardRange === 'anual' 
                            ? 'bg-amber-500 text-black border-amber-500' 
                            : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        Anual
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Premium Dashboard Graphic with CSS interactive charts */}
                  <div className="lg:col-span-7 relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/5 to-transparent rounded-[30px] blur-2xl opacity-80" />
                    
                    <div className="relative p-6 sm:p-8 bg-zinc-950/80 rounded-3xl border border-zinc-850 space-y-6">
                      
                      {/* Dashboard Header toolbar */}
                      <div className="flex justify-between items-center pb-4 border-b border-zinc-900/60">
                        <div className="flex items-center gap-2">
                          <span className="p-2 bg-amber-500/10 rounded-lg">
                            <Activity className="w-5 h-5 text-amber-500" />
                          </span>
                          <div className="text-left">
                            <span className="text-[9px] font-mono text-zinc-550 uppercase">TECLADO DO DISPOSITIVO</span>
                            <h4 className="text-white text-sm font-semibold uppercase tracking-wider font-sans">MÉTRICAS ATIVAS</h4>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-550/15 border border-amber-550/30 text-amber-400 px-2.5 py-1 rounded-full font-mono font-bold">
                          ESTADO: SINCRONIZADO
                        </span>
                      </div>

                      {/* Info Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-2xl text-left">
                          <span className="text-[9.5px] font-mono text-zinc-500 block uppercase">Batimentos (FC)</span>
                          <p className="text-white text-xl sm:text-2xl font-bold font-mono mt-1 flex items-baseline gap-1">
                            {activeDashboardRange === 'semanal' ? '138' : activeDashboardRange === 'mensal' ? '135' : '131'}
                            <span className="text-xs text-zinc-500 font-normal">BPM</span>
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-2xl text-left">
                          <span className="text-[9.5px] font-mono text-zinc-500 block uppercase">Gasto Energético</span>
                          <p className="text-white text-xl sm:text-2xl font-bold font-mono mt-1 flex items-baseline gap-1">
                            {activeDashboardRange === 'semanal' ? '540' : activeDashboardRange === 'mensal' ? '2.400' : '28.800'}
                            <span className="text-xs text-zinc-500 font-normal">kcal</span>
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-2xl text-left">
                          <span className="text-[9.5px] font-mono text-zinc-500 block uppercase">Tempo Praticado</span>
                          <p className="text-white text-xl sm:text-2xl font-bold font-mono mt-1 flex items-baseline gap-1">
                            {activeDashboardRange === 'semanal' ? '4.5' : activeDashboardRange === 'mensal' ? '18.2' : '224'}
                            <span className="text-xs text-zinc-500 font-normal">h</span>
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-2xl text-left">
                          <span className="text-[9.5px] font-mono text-zinc-500 block uppercase">Seq. de Dias</span>
                          <p className="text-amber-400 text-xl sm:text-2xl font-bold font-mono mt-1 flex items-baseline gap-1">
                            12
                            <span className="text-xs text-zinc-500 font-normal">dias</span>
                          </p>
                        </div>
                      </div>

                      {/* Custom Decorative Graphic Chart using SVG */}
                      <div className="p-5 bg-[#000]/10 border border-zinc-900/80 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                          <span>Média Histórica de Esforço</span>
                          <span className="text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30">LIGA OUTUBRO</span>
                        </div>
                        
                        {/* Interactive custom line simulation */}
                        <div className="h-44 flex items-end justify-between gap-1 sm:gap-2.5 pt-4 text-zinc-500 font-mono text-[9px]">
                          {[
                            { label: 'Seg', val: activeDashboardRange === 'semanal' ? 40 : 65 },
                            { label: 'Ter', val: activeDashboardRange === 'semanal' ? 85 : 70 },
                            { label: 'Qua', val: activeDashboardRange === 'semanal' ? 55 : 85 },
                            { label: 'Qui', val: activeDashboardRange === 'semanal' ? 90 : 40 },
                            { label: 'Sex', val: activeDashboardRange === 'semanal' ? 70 : 95 },
                            { label: 'Sáb', val: activeDashboardRange === 'semanal' ? 30 : 60 },
                            { label: 'Dom', val: activeDashboardRange === 'semanal' ? 10 : 30 }
                          ].map((item, id) => (
                            <div key={id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                              <div className="w-full bg-zinc-900/80 rounded h-full flex flex-col justify-end relative">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${item.val}%` }}
                                  transition={{ duration: 1, delay: id * 0.05 }}
                                  className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-b" 
                                />
                              </div>
                              <span className="text-zinc-500 font-mono">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — RANKINGS REGIONAIS */}
            <section
              id="rankings"
              className="py-24 sm:py-32 w-full bg-gradient-to-b from-[#050505] to-[#080808] border-b border-zinc-950"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  
                  {/* Left Column: Visual Ranking screen (reused and upgraded original visual) */}
                  <div className="lg:col-span-6 relative order-last lg:order-first">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/5 to-transparent blur-2xl rounded-full" />
                    
                    <div className="relative p-6 sm:p-7 bg-[#0A0A0A]/95 rounded-3xl border border-zinc-900 text-left space-y-6">
                      <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
                        <div>
                          <p className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest">Liga Semanal Oficial</p>
                          <h4 className="font-semibold text-white text-lg">Classificação Desportiva</h4>
                        </div>
                        <span className="p-1 px-3 bg-zinc-900 text-[#E5A93C] rounded-full text-xs font-mono font-bold border border-zinc-800">
                          Curitiba • G-15
                        </span>
                      </div>

                      {/* Display climbing positions */}
                      <div className="space-y-3">
                        {[
                          { rank: 1, name: "Thiago 'Viking' Ramos", pts: 1540, xp: "Check-in Gympass • Curitiba", up: true },
                          { rank: 2, name: "Ana Beatriz Ramos (Adversária)", pts: 1480, xp: "Garmin Sinc • Cardio", up: false },
                          { rank: 3, name: "Lucas 'Iron' Silva (Sua Posição)", pts: 1420, xp: "Check-in Presencial • Smartfit", self: true, up: true },
                          { rank: 4, name: "Gaby Treinateliê", pts: 1390, xp: "Apple Health • 35min Cardio", up: false },
                        ].map((user, idx) => (
                          <div 
                            key={idx}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                              user.self 
                                ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.05)]' 
                                : 'bg-zinc-950/60 border-zinc-950 hover:border-zinc-850'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`font-mono text-sm font-extrabold w-5 ${user.rank === 1 ? 'text-amber-500' : 'text-zinc-500'}`}>
                                #{user.rank}
                              </span>
                              <div>
                                <h5 className={`text-xs sm:text-sm font-semibold ${user.self ? 'text-amber-300' : 'text-zinc-200'}`}>{user.name}</h5>
                                <span className="text-[10px] text-zinc-500 font-mono tracking-wide">{user.xp}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-xs text-right">
                              <span className="font-bold text-white">{user.pts}</span>
                              <span className="text-[9px] text-zinc-500">pts</span>
                              <span className={`text-[10px] ${user.up ? 'text-green-500' : 'text-red-500'}`}>
                                {user.up ? '▲' : '▼'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: explanations */}
                  <div className="lg:col-span-6 space-y-6 text-left">
                    <span className="text-amber-550 font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                      COMPETICÃO EQUILIBRADA
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                      Rankings por região
                    </h2>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                      Os rankings são organizados por grupos regionais para manter o equilíbrio competitivo. O sistema utiliza limites de participantes por grupo para garantir competitividade e escalabilidade.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono tracking-wider uppercase text-zinc-400">
                      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900/60 text-left">
                        <span className="block text-white font-semibold text-sm mb-0.5">Grupo por Cidade</span>
                        Ligas micro-regionais para parear atletas com rotinas semelhantes.
                      </div>
                      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900/60 text-left">
                        <span className="block text-white font-semibold text-sm mb-0.5">Participação Máxima</span>
                        Limite rigoroso de competidores por chave para evitar tabelas impossíveis de serem acompanhadas.
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — DESAFIOS PRIVADOS */}
            <section
              id="desafios"
              className="py-24 sm:py-32 w-full bg-[#050505] border-b border-zinc-950"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  
                  {/* Left Column: explanations */}
                  <div className="lg:col-span-5 space-y-6 text-left">
                    <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                      INTEGRAÇÃO SOCIAL
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                      Crie desafios com seus amigos
                    </h2>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                      Monte seus próprios desafios de performance física. Defina os participantes, a duração e o objetivo comum. Acompanhe a corrida pelo topo em tempo real através de atualizações automáticas.
                    </p>
                    
                    <p className="text-zinc-400 text-xs sm:text-sm pl-4 border-l-2 border-amber-500/60 leading-relaxed italic">
                      "Desafiar amigos no final de semana aumentou a consistência de nossa garagem de treinos em mais de 65%." — Equipe Alpha de Curitiba.
                    </p>
                  </div>

                  {/* Right Column: Visual Challenge Card */}
                  <div className="lg:col-span-7 relative">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/5 to-transparent blur-2xl rounded-full" />
                    
                    <div className="relative p-6 sm:p-8 bg-zinc-950 border border-zinc-850 rounded-3xl text-left space-y-6 max-w-xl mx-auto">
                      
                      {/* Heading */}
                      <div className="flex justify-between items-start pb-4 border-b border-zinc-900/60">
                        <div>
                          <span className="text-[10px] font-mono text-amber-500 uppercase font-semibold">Torneio Ativo</span>
                          <h4 className="font-semibold text-white text-base sm:text-lg">Foco Total no Cardio Amigos</h4>
                        </div>
                        <span className="px-3 py-1 bg-red-950/20 border border-red-900/35 text-red-400 font-mono text-[10px] rounded-full font-bold">
                          FALTAM 3 DIAS
                        </span>
                      </div>

                      {/* Params definition */}
                      <div className="grid grid-cols-3 gap-3 text-xs font-mono text-zinc-400 uppercase">
                        <div className="p-2.5 bg-zinc-900/40 rounded-xl">
                          <span className="block text-zinc-650 text-[9px] mb-0.5">DURAÇÃO</span>
                          <span className="text-white font-bold">30 DIAS</span>
                        </div>
                        <div className="p-2.5 bg-zinc-900/40 rounded-xl">
                          <span className="block text-zinc-650 text-[9px] mb-0.5">OBJETIVO</span>
                          <span className="text-white font-bold">6.000 KCAL</span>
                        </div>
                        <div className="p-2.5 bg-zinc-900/40 rounded-xl">
                          <span className="block text-zinc-650 text-[9px] mb-0.5">REQUISITO</span>
                          <span className="text-white font-bold">GPS + FC</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-zinc-450 font-mono">
                          <span>Progresso Coletivo</span>
                          <span className="text-white font-bold">4.440 kcal (74%)</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full" style={{ width: '74%' }} />
                        </div>
                      </div>

                      {/* Active friends loop list */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-mono text-zinc-650 block uppercase">Participantes no Desafio</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { name: "Thiago", val: "1.800 kcal", active: true },
                            { name: "Ana Beatriz", val: "1.520 kcal", active: true },
                            { name: "Lucas (Você)", val: "1.120 kcal", active: true }
                          ].map((friend, fId) => (
                            <div key={fId} className="p-2 bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-xl flex items-center gap-2 text-left text-xs text-zinc-300">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              <div>
                                <p className="font-semibold text-white text-[11px] truncate">{friend.name}</p>
                                <span className="text-[9.5px] font-mono text-zinc-500">{friend.val}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — BENEFÍCIOS (DIFERENCIAIS DO INVICTUS) */}
            <section
              id="beneficios"
              className="py-24 sm:py-32 w-full bg-gradient-to-b from-[#050505] to-[#080808] border-b border-zinc-950 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.02)_0%,transparent_50%)] pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                  <span className="text-[#E5A93C] font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                    O DIFERENCIAL DEFINITIVO
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                    Por que o Invictus é diferente?
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Unimos tecnologia esportiva de ponta e gamificação saudável para blindar seu foco e manter sua consistência diária.
                  </p>
                </div>

                {/* 5 Pillars Bento Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto items-stretch">
                  
                  {/* Pillar 1: Gamificação */}
                  <div className="p-6 sm:p-8 bg-zinc-950/70 border border-zinc-900 hover:border-amber-500/20 rounded-3xl space-y-4 transition-all duration-300 flex flex-col justify-between md:col-span-6 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-xl w-fit group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-white text-lg sm:text-xl">Gamificação dos Treinos</h4>
                      <p className="text-sm text-zinc-450 leading-relaxed">
                        Esqueça rotinas monótonas. Suas atividades diárias (musculação ou cardio) são convertidas em pontos de XP legítimos, streaks ativos e medalhas de conquista personalizadas.
                      </p>
                    </div>
                    <div className="pt-4 text-xs font-mono text-zinc-550 uppercase">Engajamento Comprovado</div>
                  </div>

                  {/* Pillar 2: Rankings */}
                  <div className="p-6 sm:p-8 bg-zinc-950/70 border border-zinc-900 hover:border-amber-500/20 rounded-3xl space-y-4 transition-all duration-300 flex flex-col justify-between md:col-span-6 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-xl w-fit group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-white text-lg sm:text-xl">Rankings Competitivos</h4>
                      <p className="text-sm text-zinc-450 leading-relaxed">
                        Compita em ligas regionais balanceadas. Nosso sistema divide os atletas de forma justa baseado em dados físicos históricos reais para garantir que todos tenham chances de vencer com dedicação pura.
                      </p>
                    </div>
                    <div className="pt-4 text-xs font-mono text-zinc-550 uppercase">Competição Justa por Mérito</div>
                  </div>

                  {/* High impact central banner (Span 12) */}
                  <div className="md:col-span-12 p-8 sm:p-10 bg-gradient-to-r from-[#090909] via-zinc-950 to-[#090909] border border-zinc-850 rounded-3xl text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4 group">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full" />
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full" />
                    
                    <span className="text-xs font-mono text-amber-500 tracking-[0.3em] uppercase font-bold">O MANIFESTO INVICTUS</span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white italic tracking-tight leading-tight max-w-4xl">
                      "Você não treina sozinho. Você entra em uma competição pela sua melhor versão."
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full mt-2" />
                  </div>

                  {/* Pillar 3: Desafios por Temporadas */}
                  <div className="p-6 sm:p-8 bg-zinc-950/70 border border-zinc-900 hover:border-amber-500/20 rounded-3xl space-y-4 transition-all duration-300 flex flex-col justify-between md:col-span-4 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-xl w-fit group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-white text-base sm:text-lg">Desafios por Temporadas</h4>
                      <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed">
                        Participe de ciclos de performance com metas que mudam a cada estação, garantindo estímulos novos e constância contínua.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 4: Comunidade Fitness */}
                  <div className="p-6 sm:p-8 bg-zinc-950/70 border border-zinc-900 hover:border-amber-500/20 rounded-3xl space-y-4 transition-all duration-300 flex flex-col justify-between md:col-span-4 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-xl w-fit group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Users className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-white text-base sm:text-lg">Comunidade Fitness</h4>
                      <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed">
                        Conecte-se com pessoas reais que dividem o mesmo propósito de vida física focada em saúde, superação e disciplina mútua.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 5: Sistema de Evolução */}
                  <div className="p-6 sm:p-8 bg-zinc-950/70 border border-zinc-900 hover:border-amber-500/20 rounded-3xl space-y-4 transition-all duration-300 flex flex-col justify-between md:col-span-4 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-xl w-fit group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                        <Activity className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-white text-base sm:text-lg">Sistema de Evolução</h4>
                      <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed">
                        Seus dados biométricos, calorias queimadas e cargas levantadas consolidados de forma organizada e limpa no app.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
            <section
              id="faq"
              className="py-24 sm:py-32 w-full bg-[#050505] border-b border-zinc-950"
            >
              <div className="max-w-4xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase">
                    TIRE SUAS DÚVIDAS
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
                    Perguntas Frequentes
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Esclareça de forma simples qualquer dúvida referente à nossa plataforma, segurança ou diretrizes de conformidade.
                  </p>
                </div>

                {/* FAQ Accordion Lists */}
                <div className="space-y-4 text-left">
                  {[
                    {
                      q: "O INVICTUS é aposta?",
                      a: "Não. O aplicativo não possui jogos de azar, apostas de cotas fixas ou sorteios em dinheiro. Nosso foco exclusivo é incentivar hábitos saudáveis através da gamificação esportiva e do reconhecimento de mérito individual por atividade física comprovada estatisticamente."
                    },
                    {
                      q: "Preciso treinar todos os dias?",
                      a: "Não. Nós valorizamos e consideramos o Descanso Inteligente como parte integral de sua evolução biológica e muscular. Você pode agendar de 1 a 2 dias de OFF (repouso) por semana no aplicativo para preservar seu streak de consistência intacto sem prejuízo na tabela."
                    },
                    {
                      q: "Preciso de um relógio inteligente (smartwatch)?",
                      a: "Não. O Plano Open rastreia suas atividades em academias credenciadas de forma simples por meio do check-in por geolocalização do próprio smartphone móvel. Já o Plano Performance é otimizado para extrair dados cardiopulmonares integrando relógios (Garmin, Apple Watch, Strava)."
                    },
                    {
                      q: "Como as atividades físicas são validadas de forma justa?",
                      a: "Nossa tecnologia combina diversas vedações de segurança (GPS assistido, análise em tempo real de cadência biomecânica e micro-sensores móveis) para filtrar fraudes comuns de tráfego veicular ou registros falsos, blindando a ética da nossa tabela de líderes do ranking."
                    }
                  ].map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div 
                        key={fIdx} 
                        className="bg-zinc-950/80 border border-zinc-900 rounded-2xl overflow-hidden shadow-md transition-all duration-300"
                      >
                        <button
                          id={`faq-accordion-${fIdx}`}
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full flex items-center justify-between p-6 hover:bg-zinc-900/50 transition-colors text-left focus:outline-none cursor-pointer"
                        >
                          <span className="font-semibold text-white text-base sm:text-lg pr-4">{faq.q}</span>
                          <span className={`text-[#FFC107] font-mono transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen 
                              ? 'max-h-96 opacity-100 border-t border-zinc-900 p-6 bg-[#000]/10 text-zinc-300 text-sm sm:text-base leading-relaxed antialiased' 
                              : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>


            {/* SEÇÃO 11 — CHAMADA FINAL */}
            <section
              id="download"
              className="py-24 sm:py-32 w-full bg-[#050505] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,169,60,0.03)_0%,transparent_60%)] pointer-events-none" />
              
              <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10 flex flex-col items-center">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-550/15 border border-amber-550/30 rounded-full font-mono text-xs text-amber-500 font-bold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-spin" />
                  consistência é progresso
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold tracking-tight text-white leading-tight">
                    Pronto para evoluir de verdade?
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed antialiased">
                    Instale o INVICTUS agora mesmo. Inicie sua jornada de hábitos fortes, conecte seus relógios e proteja sua consistência saudável.
                  </p>
                </div>

                {/* Android vs iOS main triggers */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md pt-4">
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 flex-1 flex flex-col justify-between items-center text-center hover:border-amber-500/20 transition-all">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Google Android</span>
                    <button 
                      id="btn-trigger-playstore"
                      onClick={() => showToast("O download do aplicativo Android iniciou de forma segura através do Google Play Store.")}
                      className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl text-xs tracking-wider uppercase font-mono transition-colors focus:outline-none cursor-pointer"
                    >
                      Google Play
                    </button>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 flex-1 flex flex-col justify-between items-center text-center hover:border-amber-500/20 transition-all">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Apple iOS iPhone</span>
                    <button 
                      id="btn-trigger-appstore"
                      onClick={() => showToast("O download do aplicativo iOS iniciou de forma segura através da Apple App Store.")}
                      className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-semibold rounded-xl text-xs tracking-wider uppercase font-mono transition-colors focus:outline-none cursor-pointer"
                    >
                      App Store
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-w-xl mx-auto border-t border-zinc-900 pt-6">
                  <p className="text-[11px] text-zinc-650 font-medium">
                    As campanhas promocionais e ações de incentivo realizadas pela plataforma seguem critérios próprios definidos em regulamento específico. Consulte os regulamentos vigentes dentro do aplicativo.
                  </p>
                  <p className="text-[9.5px] font-mono text-zinc-600">
                    INVICTUS é gratuito para iniciar • Atualização de ligas desportivas coletivas semanalmente aos domingos.
                  </p>
                </div>

              </div>
            </section>

          </motion.main>
        ) : (
          <motion.div
            key="subpages-wrapper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-1 w-full"
          >
            <SubPages page={currentPage} onBack={() => navigateToPage('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global standard compliant footer with disclaimers */}
      <Footer onNavigateToPage={navigateToPage} />

      {/* Premium Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-zinc-950 border-2 border-amber-500 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <div className="p-2 bg-amber-500 text-black rounded-lg">
              <Star className="w-5 h-5 fill-black" />
            </div>
            <div className="text-left">
              <h5 className="text-white text-xs font-mono uppercase tracking-wider font-bold">Download Iniciado</h5>
              <p className="text-zinc-400 text-xs mt-0.5 leading-normal">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
