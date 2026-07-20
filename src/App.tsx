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
  LockKeyhole,
  User
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

  // Modal and custom states
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);

  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [academyName, setAcademyName] = useState('');
  const [academyEmail, setAcademyEmail] = useState('');
  const [academyCity, setAcademyCity] = useState('');
  const [academyMessage, setAcademyMessage] = useState('');
  const [isAcademySubmitted, setIsAcademySubmitted] = useState(false);

  const [activeMockTab, setActiveMockTab] = useState<'inicio' | 'ranking' | 'treinos' | 'perfil'>('inicio');

  // Listen to scroll to update smartphone mockup tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['real-ranking', 'real-performance', 'real-seasons', 'real-history'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            if (section === 'real-ranking') setActiveMockTab('ranking');
            if (section === 'real-performance') setActiveMockTab('inicio');
            if (section === 'real-seasons') setActiveMockTab('perfil');
            if (section === 'real-history') setActiveMockTab('treinos');
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              className="relative w-full overflow-hidden border-b border-zinc-900 pt-32 pb-24 sm:pt-40 sm:pb-36 lg:pt-48 lg:pb-44 bg-black"
            >
              {/* Ultra-premium subtle abstract light design */}
              <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />
              <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                
                {/* Left Block text */}
                <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
                  
                  {/* Premium Badges row */}
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-full">
                      <InvictusLogo size={18} showText={false} />
                      <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 font-semibold uppercase">
                        CAMPEONATO DE CONSISTÊNCIA
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-full text-[10px] font-mono text-zinc-400 font-semibold uppercase">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      100% Automatizado
                    </div>
                  </div>

                  {/* Heading Title */}
                  <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tight text-white leading-tight">
                    Sua academia vira <br className="hidden sm:inline" />
                    um campeonato <br className="hidden sm:inline" />
                    de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE699] via-[#FBBF24] to-[#B45309]">
                      30 dias
                    </span>.
                  </h1>

                  {/* Hero Subtitle */}
                  <p className="text-zinc-400 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl antialiased">
                    Treine normalmente. O Invictus registra automaticamente seus treinos, atualiza sua posição no ranking e transforma consistência em conquistas.
                  </p>

                  <div className="h-[1px] bg-zinc-900 w-full" />

                  {/* Core Value Pillars row for fast 5-second comprehension */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-left hover:border-blue-500/20 transition-all">
                      <Dumbbell className="w-5 h-5 text-blue-400 mb-2" />
                      <span className="text-white text-xs font-semibold uppercase font-mono tracking-wider block">Musculação</span>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1">Pontos via check-in inteligente presencial.</p>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-left hover:border-purple-500/20 transition-all">
                      <Activity className="w-5 h-5 text-purple-400 mb-2" />
                      <span className="text-white text-xs font-semibold uppercase font-mono tracking-wider block">Relógios</span>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1">Cardios importados de forma autêntica.</p>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-left hover:border-blue-500/20 transition-all">
                      <Trophy className="w-5 h-5 text-blue-400 mb-2" />
                      <span className="text-white text-xs font-semibold uppercase font-mono tracking-wider block">Temporadas</span>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1">Dispute ligas locais de 30 dias com igualdade.</p>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-left hover:border-purple-500/20 transition-all">
                      <Star className="w-5 h-5 text-purple-400 mb-2" />
                      <span className="text-white text-xs font-semibold uppercase font-mono tracking-wider block">Premios</span>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1">Desbloqueie conquistas por disciplina pura.</p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                    <button
                      id="btn-hero-cta"
                      onClick={() => setIsWaitlistOpen(true)}
                      className="px-8 py-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-2xl text-center shadow-lg transition-all cursor-pointer font-sans text-sm tracking-wide"
                    >
                      Entrar na lista de espera
                    </button>
                    <button
                      id="btn-hero-secondary"
                      onClick={() => handleScrollToId('como-funciona')}
                      className="px-8 py-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white font-semibold rounded-2xl text-center transition-colors cursor-pointer font-sans text-sm tracking-wide"
                    >
                      Ver como funciona
                    </button>
                  </div>
                </div>

                {/* Right Block: Live Premium Smartphone mockup */}
                <div className="lg:col-span-5 flex justify-center relative w-full pt-6 lg:pt-0">
                  <div className="absolute -inset-10 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                  <SmartphoneMockup onlyPhone={true} />
                </div>
              </div>
            </section>

            {/* SEÇÃO 1.5 — PROPÓSITO: O QUE É O INVICTUS PERFORMANCE */}
            <section
              id="propósito"
              className="py-32 sm:py-40 w-full border-b border-zinc-900 bg-black relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[160px] pointer-events-none z-0" />
              
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left content block */}
                  <div className="lg:col-span-7 text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 rounded-full">
                      <Star className="w-3.5 h-3.5 text-blue-400" />
                      Evolução sem desculpas
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                      O que é o <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Invictus Performance?
                      </span>
                    </h2>
                    
                    <div className="space-y-6 text-zinc-400 text-base sm:text-lg leading-relaxed antialiased">
                      <p className="font-semibold text-white text-lg sm:text-xl">
                        O Invictus Performance é um aplicativo de desafios fitness que transforma sua rotina de treinos em uma experiência competitiva e gamificada por consistência.
                      </p>
                      <p>
                        Acreditamos que o maior problema do treinamento esportivo tradicional é a quebra de ritmo. No Invictus, o usuário treina normalmente. O aplicativo registra automaticamente seus treinos, calcula sua pontuação em tempo real e promove a evolução saudável em rankings regionais exclusivos.
                      </p>
                      <p>
                        Aqui, não existem atalhos. O mérito é medido por esforço biomecânico autêntico, trazendo para o digital a exata medida de sua dedicação diária.
                      </p>
                    </div>

                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl border-l-4 border-l-blue-500">
                      <p className="text-zinc-300 font-display text-lg font-medium leading-relaxed italic">
                        "Você não treina sozinho. Você entra em uma competição pela sua melhor versão."
                      </p>
                    </div>
                  </div>

                  {/* Right visual key card */}
                  <div className="lg:col-span-5">
                    <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl text-left space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150">
                        <InvictusLogo size={90} showText={false} />
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">DIRETRIZES DE BASE</span>
                        <h4 className="text-xl font-bold text-white">Como você participa</h4>
                      </div>

                      <div className="space-y-5">
                        <div className="flex gap-4 items-start">
                          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-blue-400 shrink-0">
                            <Dumbbell className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Realize Treinos Próprios</h5>
                            <p className="text-xs text-zinc-550 mt-1">Gere pontos através da sua dedicação presencial registrada e validada de forma transparente.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-purple-400 shrink-0">
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Evolua no Ranking</h5>
                            <p className="text-xs text-zinc-550 mt-1">Compita com outros participantes em tabelas locais pareadas para um campeonato justo.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-blue-400 shrink-0">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Temporadas e Prêmios</h5>
                            <p className="text-xs text-zinc-550 mt-1">Participe de ciclos de 30 dias com recompensas associadas aos marcos de performance.</p>
                          </div>
                        </div>
                      </div>

                      <div className="h-[1px] bg-zinc-900 w-full" />

                      <button
                        onClick={() => handleScrollToId('como-funciona')}
                        className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-mono font-bold tracking-widest uppercase text-white transition-all cursor-pointer"
                      >
                        Descobrir Funcionamento
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
                <div className="text-left max-w-3xl mb-24 space-y-4">
                  <span className="text-blue-400 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                    FLUXO DE PRODUTO
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Sua jornada em três passos.
                  </h2>
                  <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
                    Mantendo o foco no seu treinamento diário tradicional, o Invictus cuida da automação e da competição saudável nos bastidores.
                  </p>
                </div>

                {/* Redesigned 3-Step cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  
                  {/* Passo 1 */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-blue-500/20 transition-all duration-300 relative group text-left h-[280px]">
                    <span className="text-6xl font-mono text-zinc-900 absolute top-6 right-8 font-black">01</span>
                    <div className="space-y-6 pt-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-blue-400">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Conecte seu dispositivo</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Sincronize sua conta com o Apple Health, Health Connect ou Strava de forma instantânea em apenas um clique.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Passo 2 */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 relative group text-left h-[280px]">
                    <span className="text-6xl font-mono text-zinc-900 absolute top-6 right-8 font-black">02</span>
                    <div className="space-y-6 pt-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-purple-400">
                        <Dumbbell className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Treine normalmente</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Musculação ou cardio, o app detecta e calcula seus pontos baseados em gasto calórico, geocercas e cadência biomecânica real.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Passo 3 */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-blue-500/20 transition-all duration-300 relative group text-left h-[280px]">
                    <span className="text-6xl font-mono text-zinc-900 absolute top-6 right-8 font-black">03</span>
                    <div className="space-y-6 pt-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-blue-400">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Suba no ranking e vença</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Acompanhe sua posição no ranking de 30 dias de forma meritocrática e desbloqueie recompensas reais exclusivas por dedicação.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO 3 — EXPLORE A INTERFACE (HIGH-FIDELITY SCREENSHOTS PRESENTATION) */}
            <section
              id="interface"
              className="py-32 sm:py-40 w-full border-b border-zinc-900 bg-black relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left Controls: Click to switch smartphone tabs */}
                  <div className="lg:col-span-6 text-left space-y-12">
                    <div className="space-y-4">
                      <span className="text-purple-400 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                        INTERFACE PREMIUM
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                        Screenshots Reais do Aplicativo
                      </h2>
                      <p className="text-zinc-400 text-base sm:text-lg">
                        Explore como nossa tecnologia de ponta é traduzida em uma experiência visual extremamente limpa, rápida e inspiradora.
                      </p>
                    </div>

                    <div className="space-y-4">
                      
                      {/* Control 1: Desempenho */}
                      <button
                        onClick={() => setActiveMockTab('inicio')}
                        className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 ${
                          activeMockTab === 'inicio' 
                            ? 'bg-zinc-950 border-blue-500/30 shadow-lg shadow-blue-500/5' 
                            : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <div className={`p-3 rounded-xl border shrink-0 transition-all ${
                          activeMockTab === 'inicio' ? 'bg-zinc-900 border-blue-500/20 text-blue-400' : 'bg-zinc-900/50 border-zinc-850 text-zinc-500'
                        }`}>
                          <Activity className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white text-base font-bold">Seu Desempenho</h4>
                          <p className="text-xs text-zinc-400 leading-normal">
                            Visualize gráficos consolidados de treino, calorias queimadas e seu score de consistência de alta precisão.
                          </p>
                        </div>
                      </button>

                      {/* Control 2: Ranking */}
                      <button
                        onClick={() => setActiveMockTab('ranking')}
                        className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 ${
                          activeMockTab === 'ranking' 
                            ? 'bg-zinc-950 border-purple-500/30 shadow-lg shadow-purple-500/5' 
                            : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <div className={`p-3 rounded-xl border shrink-0 transition-all ${
                          activeMockTab === 'ranking' ? 'bg-zinc-900 border-purple-500/20 text-purple-400' : 'bg-zinc-900/50 border-zinc-850 text-zinc-500'
                        }`}>
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white text-base font-bold">Ranking em Tempo Real</h4>
                          <p className="text-xs text-zinc-400 leading-normal">
                            Monitore as movimentações diárias da tabela competitiva. Cada suor validado altera a tabela imediatamente.
                          </p>
                        </div>
                      </button>

                      {/* Control 3: Histórico */}
                      <button
                        onClick={() => setActiveMockTab('treinos')}
                        className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 ${
                          activeMockTab === 'treinos' 
                            ? 'bg-zinc-950 border-blue-500/30 shadow-lg shadow-blue-500/5' 
                            : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <div className={`p-3 rounded-xl border shrink-0 transition-all ${
                          activeMockTab === 'treinos' ? 'bg-zinc-900 border-blue-500/20 text-blue-400' : 'bg-zinc-900/50 border-zinc-850 text-zinc-500'
                        }`}>
                          <Dumbbell className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white text-base font-bold">Histórico e Validações</h4>
                          <p className="text-xs text-zinc-400 leading-normal">
                            Linha do tempo auditável com todos os seus treinos e registros homologados por nossa IA de integridade física.
                          </p>
                        </div>
                      </button>

                      {/* Control 4: Perfil */}
                      <button
                        onClick={() => setActiveMockTab('perfil')}
                        className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 ${
                          activeMockTab === 'perfil' 
                            ? 'bg-zinc-950 border-purple-500/30 shadow-lg shadow-purple-500/5' 
                            : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <div className={`p-3 rounded-xl border shrink-0 transition-all ${
                          activeMockTab === 'perfil' ? 'bg-zinc-900 border-purple-500/20 text-purple-400' : 'bg-zinc-900/50 border-zinc-850 text-zinc-500'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white text-base font-bold">Seu Perfil e Temporadas</h4>
                          <p className="text-xs text-zinc-400 leading-normal">
                            Gerencie suas conquistas, níveis de XP acumulado, insígnias conquistadas e métricas corporais integradas.
                          </p>
                        </div>
                      </button>

                    </div>
                  </div>

                  {/* Right Phone Mockup displaying corresponding active screen */}
                  <div className="lg:col-span-6 flex justify-center relative w-full pt-10 lg:pt-0">
                    <div className="absolute -inset-10 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                    <SmartphoneMockup onlyPhone={true} activeTabOverride={activeMockTab} />
                  </div>

                </div>
              </div>
            </section>


            {/* SEÇÃO 4 — PLANOS */}
            <section
              id="planos"
              className="py-32 sm:py-40 w-full border-b border-zinc-900 bg-black"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-left max-w-3xl mb-24 space-y-4">
                  <span className="text-blue-400 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                    ACESSO EXCLUSIVO
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Escolha o plano ideal para sua rotina.
                  </h2>
                  <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
                    Comece com o Plano Essencial ou libere a experiência máxima de performance desportiva.
                  </p>
                </div>

                {/* Grid of plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                  
                  {/* Plano Essencial */}
                  <div className="p-10 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-3xl flex flex-col justify-between transition-all duration-300 text-left relative overflow-hidden">
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white uppercase tracking-wider font-display">Plano Essencial</h3>
                        <p className="text-sm text-zinc-500 leading-normal">
                          Entrada para o universo de competição saudável do Invictus.
                        </p>
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-baseline gap-1 py-2">
                        <span className="text-sm text-zinc-400 font-mono leading-none">R$</span>
                        <span className="text-5xl font-bold text-white font-mono leading-none">9,90</span>
                        <span className="text-sm text-zinc-500 font-mono leading-none">/ mês</span>
                      </div>

                      {/* Divider */}
                      <div className="h-[1px] bg-zinc-900 w-full" />

                      {/* Benefits list */}
                      <div className="space-y-4">
                        <p className="text-xs font-semibold text-zinc-500 font-mono uppercase tracking-widest mb-2">Recursos Incluídos:</p>
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
                          <div key={idx} className="flex items-center gap-3 text-zinc-300 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-10">
                      <button
                        onClick={() => handleScrollToId('download')}
                        className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-semibold rounded-2xl transition-all cursor-pointer text-sm font-mono uppercase tracking-widest"
                      >
                        Selecionar Essencial
                      </button>
                    </div>
                  </div>

                  {/* Plano Performance */}
                  <div className="p-10 bg-zinc-950 border border-blue-500/20 rounded-3xl flex flex-col justify-between transition-all duration-300 text-left relative overflow-hidden ring-1 ring-blue-500/10">
                    
                    {/* RECOMMENDED BADGE */}
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold font-mono uppercase tracking-widest select-none">
                      Recomendado
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white uppercase tracking-wider font-display">Plano Performance</h3>
                        <p className="text-sm text-zinc-400 leading-normal">
                          Experiência completa para quem quer competir no máximo nível de integridade física.
                        </p>
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-baseline gap-1 py-2">
                        <span className="text-sm text-zinc-400 font-mono leading-none">R$</span>
                        <span className="text-5xl font-bold text-white font-mono leading-none">49,90</span>
                        <span className="text-sm text-zinc-500 font-mono leading-none">/ mês</span>
                      </div>

                      {/* Divider */}
                      <div className="h-[1px] bg-zinc-900 w-full" />

                      {/* Benefits list */}
                      <div className="space-y-4">
                        <p className="text-xs font-semibold text-amber-500 font-mono uppercase tracking-widest mb-2">Recursos Máximos Incluídos:</p>
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
                          <div key={idx} className="flex items-center gap-3 text-zinc-300 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className={idx > 0 ? "text-amber-200 font-medium" : ""}>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-10">
                      <button
                        onClick={() => handleScrollToId('download')}
                        className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold rounded-2xl transition-all cursor-pointer text-sm font-mono uppercase tracking-widest shadow-lg shadow-amber-500/10 hover:scale-[1.01]"
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
              className="py-32 sm:py-40 w-full bg-black border-b border-zinc-900"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left Column: Informative textual base */}
                  <div className="lg:col-span-4 space-y-8 text-left">
                    <div className="space-y-4">
                      <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                        INTEGRIDADE E PRIVACIDADE
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                        Auditoria em tempo real.
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed">
                        O Invictus utiliza algoritmos sofisticados de criptografia e validação física para garantir a autenticidade de cada metro percorrido ou repetição executada.
                      </p>
                    </div>

                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Respeitando sua privacidade de dados de ponta a ponta. Nosso pipeline de integridade avalia apenas assinaturas biométricas e de esforço agregado, sem armazenar rotas geográficas ou dados sensíveis.
                    </p>

                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-zinc-300">
                        <Lock className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-mono">Protocolo Antifraude Ativo</span>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-950 text-amber-500 px-3 py-1 rounded-full font-bold">SHA-256</span>
                    </div>
                  </div>

                  {/* Right Column: Beautiful 8 Validation Cards */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Card 1 */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 text-left h-44">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                          <Map className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CAMADA 01</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-base">Geolocalização Assistida</h4>
                        <p className="text-xs text-zinc-400 leading-normal">Validação espacial passiva para comprovar presença física real no local selecionado.</p>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 text-left h-44">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CAMADA 02</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-base">Análise de Permanência</h4>
                        <p className="text-xs text-zinc-400 leading-normal">Cálculo em background de tempo de sessão para neutralizar check-ins falsos e relatórios nulos.</p>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 text-left h-44">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CAMADA 03</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-base">Cadência Biomecânica</h4>
                        <p className="text-xs text-zinc-400 leading-normal">Filtro mecânico estatístico para descartar falsos registros gerados por transporte veicular.</p>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 text-left h-44">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                          <Lock className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CAMADA 04</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-base">Mapeamento de Sensores</h4>
                        <p className="text-xs text-zinc-400 leading-normal">Assinatura de acelerômetro e giroscópio do dispositivo para autenticar o movimento humano.</p>
                      </div>
                    </div>

                    {/* Card 5 */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 text-left h-44">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                          <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CAMADA 05</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-base">Micro-Verificações</h4>
                        <p className="text-xs text-zinc-400 leading-normal">Solicitações intermitentes discretas baseadas em comportamento de pontuação anômala.</p>
                      </div>
                    </div>

                    {/* Card 6 */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 text-left h-44">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                          <Eye className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CAMADA 06</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-base">Revisão Humana</h4>
                        <p className="text-xs text-zinc-400 leading-normal">Comitê de integridade focado em avaliar logs extremos reportados pelo sistema automático.</p>
                      </div>
                    </div>

                    {/* Card 7 */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 text-left h-44">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CAMADA 07</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-base">Feedback Comunitário</h4>
                        <p className="text-xs text-zinc-400 leading-normal">Canal transparente dentro das ligas para reportar comportamentos manifestamente irregulares.</p>
                      </div>
                    </div>

                    {/* Card 8 */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 text-left h-44">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CAMADA 08</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-base">Score de Confiança</h4>
                        <p className="text-xs text-zinc-400 leading-normal">Índice cumulativo do atleta atualizado em tempo real baseado no histórico de validações bem-sucedidas.</p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — CARDIO (MAIS FORMAS DE EVOLUIR) */}
            <section
              id="cardio"
              className="py-32 sm:py-40 w-full bg-black border-b border-zinc-900"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-left max-w-3xl mb-24 space-y-4">
                  <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                    CARDIO RASTREÁVEL
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Mais formas de evoluir.
                  </h2>
                  <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
                    Escolha a modalidade que melhor se adapta à sua rotina desportiva diária.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-7xl mx-auto">
                  
                  {/* Left: Tab Selectors */}
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mb-4">Selecione o esporte:</p>
                    
                    <button
                      id="tab-corrida"
                      onClick={() => setActiveCardioTab('corrida')}
                      className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'corrida' 
                          ? 'bg-zinc-950 border-amber-500/30 text-white shadow-lg' 
                          : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-bold text-base">🏃 Corrida</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <button
                      id="tab-caminhada"
                      onClick={() => setActiveCardioTab('caminhada')}
                      className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'caminhada' 
                          ? 'bg-zinc-950 border-amber-500/30 text-white shadow-lg' 
                          : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-bold text-base">🚶 Caminhada</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <button
                      id="tab-bike"
                      onClick={() => setActiveCardioTab('bike')}
                      className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'bike' 
                          ? 'bg-zinc-950 border-amber-500/30 text-white shadow-lg' 
                          : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-bold text-base">🚴 Bike</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <button
                      id="tab-academia"
                      onClick={() => setActiveCardioTab('academia')}
                      className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'academia' 
                          ? 'bg-zinc-950 border-amber-500/30 text-white shadow-lg' 
                          : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-bold text-base">🏋️ Cardio na academia</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <button
                      id="tab-outros"
                      onClick={() => setActiveCardioTab('outros')}
                      className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeCardioTab === 'outros' 
                          ? 'bg-zinc-950 border-amber-500/30 text-white shadow-lg' 
                          : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span className="font-bold text-base">➕ Outros</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Right: Dynamic Description Display Box */}
                  <div className="lg:col-span-7 border border-zinc-900 bg-zinc-950 p-10 rounded-3xl min-h-[340px] flex flex-col justify-between text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none scale-[2]">
                      <InvictusLogo size={120} showText={false} />
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <span className="px-4 py-1.5 bg-amber-950 border border-amber-500/20 text-amber-500 font-mono text-xs rounded-full uppercase tracking-wider font-bold">
                          {cardioDetails[activeCardioTab].tag}
                        </span>
                        {cardioDetails[activeCardioTab].icon}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">{cardioDetails[activeCardioTab].title}</h3>
                        <p className="text-zinc-400 text-base leading-relaxed antialiased">
                          {cardioDetails[activeCardioTab].desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-900 mt-8 text-zinc-500 text-sm font-mono flex items-center gap-2">
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
              className="py-32 sm:py-40 w-full bg-black border-b border-zinc-900"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left Column: text content */}
                  <div className="lg:col-span-5 space-y-8 text-left">
                    <div className="space-y-4">
                      <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                        TELEMETRIA INTEGRADA
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                        Seus dados, sua evolução.
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed">
                        Visualize o progresso real de suas sessões desportivas de maneira limpa, unificada e sem fricções.
                      </p>
                    </div>

                    <p className="text-zinc-500 text-base leading-relaxed">
                      Acompanhe em detalhes a sua frequência cardíaca, gasto energético real, sequência de treinos ativos e evolução temporal sem a poluição de notificações promocionais ou ruídos desnecessários.
                    </p>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setActiveDashboardRange('semanal')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all border ${
                          activeDashboardRange === 'semanal' 
                            ? 'bg-white text-black border-white shadow-md' 
                            : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-900'
                        }`}
                      >
                        Semanal
                      </button>
                      <button
                        onClick={() => setActiveDashboardRange('mensal')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all border ${
                          activeDashboardRange === 'mensal' 
                            ? 'bg-white text-black border-white shadow-md' 
                            : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-900'
                        }`}
                      >
                        Mensal
                      </button>
                      <button
                        onClick={() => setActiveDashboardRange('anual')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all border ${
                          activeDashboardRange === 'anual' 
                            ? 'bg-white text-black border-white shadow-md' 
                            : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-900'
                        }`}
                      >
                        Anual
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Premium Dashboard Graphic with CSS interactive charts */}
                  <div className="lg:col-span-7 relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/5 to-transparent rounded-[40px] blur-3xl opacity-50 pointer-events-none" />
                    
                    <div className="relative p-8 bg-zinc-950 rounded-3xl border border-zinc-900 space-y-8">
                      
                      {/* Dashboard Header toolbar */}
                      <div className="flex justify-between items-center pb-6 border-b border-zinc-900">
                        <div className="flex items-center gap-3">
                          <span className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl">
                            <Activity className="w-5 h-5" />
                          </span>
                          <div className="text-left">
                            <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-wider">TECLADO DO DISPOSITIVO</span>
                            <h4 className="text-white text-sm font-bold uppercase tracking-widest font-sans">MÉTRICAS ATIVAS</h4>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-950 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                          Sincronizado
                        </span>
                      </div>
 
                      {/* Info Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl text-left">
                          <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Frequência</span>
                          <p className="text-white text-xl sm:text-2xl font-bold font-mono mt-2 flex items-baseline gap-1">
                            {activeDashboardRange === 'semanal' ? '138' : activeDashboardRange === 'mensal' ? '135' : '131'}
                            <span className="text-xs text-zinc-500 font-normal">BPM</span>
                          </p>
                        </div>
                        <div className="p-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl text-left">
                          <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Energia</span>
                          <p className="text-white text-xl sm:text-2xl font-bold font-mono mt-2 flex items-baseline gap-1">
                            {activeDashboardRange === 'semanal' ? '540' : activeDashboardRange === 'mensal' ? '2.400' : '28k'}
                            <span className="text-xs text-zinc-500 font-normal">kcal</span>
                          </p>
                        </div>
                        <div className="p-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl text-left">
                          <span className="text-[10px] font-mono text-zinc-550 block uppercase tracking-wider">Tempo</span>
                          <p className="text-white text-xl sm:text-2xl font-bold font-mono mt-2 flex items-baseline gap-1">
                            {activeDashboardRange === 'semanal' ? '4.5' : activeDashboardRange === 'mensal' ? '18.2' : '224'}
                            <span className="text-xs text-zinc-500 font-normal">h</span>
                          </p>
                        </div>
                        <div className="p-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl text-left">
                          <span className="text-[10px] font-mono text-zinc-550 block uppercase tracking-wider">Sequência</span>
                          <p className="text-amber-500 text-xl sm:text-2xl font-bold font-mono mt-2 flex items-baseline gap-1">
                            12
                            <span className="text-xs text-zinc-500 font-normal">dias</span>
                          </p>
                        </div>
                      </div>

                      {/* Custom Decorative Graphic Chart using SVG */}
                      <div className="p-6 bg-black border border-zinc-900 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-zinc-400">Esforço Desportivo Agregado</span>
                          <span className="text-amber-500 bg-amber-950 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">LIGA OUTUBRO</span>
                        </div>
                        
                        {/* Interactive custom line simulation */}
                        <div className="h-44 flex items-end justify-between gap-1 sm:gap-3 pt-4 text-zinc-500 font-mono text-[9px]">
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
                              <div className="w-full bg-zinc-950 rounded-lg h-full flex flex-col justify-end relative overflow-hidden border border-zinc-900">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${item.val}%` }}
                                  transition={{ duration: 1, delay: id * 0.05 }}
                                  className="w-full bg-gradient-to-t from-amber-600 to-amber-500" 
                                />
                              </div>
                              <span className="text-zinc-550 font-mono text-[10px]">{item.label}</span>
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
              className="py-32 sm:py-40 w-full bg-black border-b border-zinc-900"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left Column: Visual Ranking screen (reused and upgraded original visual) */}
                  <div className="lg:col-span-6 relative order-last lg:order-first">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="relative p-8 bg-zinc-950 rounded-3xl border border-zinc-900 text-left space-y-6">
                      <div className="flex justify-between items-start border-b border-zinc-900 pb-5">
                        <div>
                          <p className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest font-bold">Liga Semanal Oficial</p>
                          <h4 className="font-bold text-white text-lg font-display">Classificação Desportiva</h4>
                        </div>
                        <span className="p-1.5 px-3 bg-zinc-900 text-amber-500 rounded-full text-xs font-mono font-bold border border-zinc-800">
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
                            className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                              user.self 
                                ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_4px_30px_rgba(245,158,11,0.05)]' 
                                : 'bg-zinc-950 border-zinc-900/60 hover:border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`font-mono text-sm font-extrabold w-5 ${user.rank === 1 ? 'text-amber-500' : 'text-zinc-500'}`}>
                                #{user.rank}
                              </span>
                              <div>
                                <h5 className={`text-sm font-bold ${user.self ? 'text-amber-300' : 'text-zinc-250'}`}>{user.name}</h5>
                                <span className="text-[10px] text-zinc-500 font-mono tracking-wide">{user.xp}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-xs text-right">
                              <span className="font-bold text-white">{user.pts}</span>
                              <span className="text-[10px] text-zinc-500">pts</span>
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
                  <div className="lg:col-span-6 space-y-8 text-left">
                    <div className="space-y-4">
                      <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                        COMPETIÇÃO EQUILIBRADA
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                        Rankings por região.
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed">
                        Os rankings são organizados automaticamente por microrregiões para manter o pareamento geográfico justo e motivador.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono tracking-wider uppercase text-zinc-400">
                      <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 text-left">
                        <span className="block text-white font-bold text-sm mb-1 uppercase font-sans tracking-wide">Divisão Local</span>
                        Ligas micro-regionais para alinhar competidores de acordo com a sua localidade imediata.
                      </div>
                      <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 text-left">
                        <span className="block text-white font-bold text-sm mb-1 uppercase font-sans tracking-wide">Chaves Fechadas</span>
                        Limite estrito de atletas por chave para assegurar que a classificação permaneça dinâmica e acessível.
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — DESAFIOS PRIVADOS */}
            <section
              id="desafios"
              className="py-32 sm:py-40 w-full bg-black border-b border-zinc-900"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left Column: explanations */}
                  <div className="lg:col-span-5 space-y-8 text-left">
                    <div className="space-y-4">
                      <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                        INTEGRAÇÃO SOCIAL
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                        Crie desafios privados.
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed">
                        Crie os seus próprios torneios de consistência física. Escolha os amigos participantes, as metas agregadas e acompanhe a disputa em tempo real.
                      </p>
                    </div>
                    
                    <p className="text-zinc-500 text-sm pl-4 border-l-2 border-amber-500/40 leading-relaxed italic">
                      "Desafiar meus colegas de trabalho no fim de semana mudou radicalmente nosso nível de constância desportiva." — Equipe Alpha de Curitiba.
                    </p>
                  </div>

                  {/* Right Column: Visual Challenge Card */}
                  <div className="lg:col-span-7 relative">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="relative p-8 bg-zinc-950 border border-zinc-900 rounded-3xl text-left space-y-6 max-w-xl mx-auto">
                      
                      {/* Heading */}
                      <div className="flex justify-between items-start pb-4 border-b border-zinc-900">
                        <div>
                          <span className="text-[10px] font-mono text-amber-500 uppercase font-bold">Torneio Ativo</span>
                          <h4 className="font-bold text-white text-base sm:text-lg">Foco Total no Cardio Amigos</h4>
                        </div>
                        <span className="px-3 py-1 bg-red-950/40 border border-red-500/20 text-red-400 font-mono text-[10px] rounded-full font-bold">
                          FALTAM 3 DIAS
                        </span>
                      </div>

                      {/* Params definition */}
                      <div className="grid grid-cols-3 gap-3 text-xs font-mono text-zinc-400 uppercase">
                        <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                          <span className="block text-zinc-550 text-[9px] mb-1 font-bold">DURAÇÃO</span>
                          <span className="text-white font-bold">30 DIAS</span>
                        </div>
                        <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                          <span className="block text-zinc-550 text-[9px] mb-1 font-bold">OBJETIVO</span>
                          <span className="text-white font-bold">6.000 KCAL</span>
                        </div>
                        <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                          <span className="block text-zinc-550 text-[9px] mb-1 font-bold">REQUISITO</span>
                          <span className="text-white font-bold">GPS + FC</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-zinc-400 font-mono">
                          <span>Progresso Coletivo</span>
                          <span className="text-white font-bold">4.440 kcal (74%)</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-600 to-amber-500 h-full rounded-full" style={{ width: '74%' }} />
                        </div>
                      </div>

                      {/* Active friends loop list */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase font-bold tracking-wider">Participantes no Desafio</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { name: "Thiago", val: "1.800 kcal", active: true },
                            { name: "Ana Beatriz", val: "1.520 kcal", active: true },
                            { name: "Lucas (Você)", val: "1.120 kcal", active: true }
                          ].map((friend, fId) => (
                            <div key={fId} className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center gap-2.5 text-left text-xs text-zinc-300">
                              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-bold text-white text-[11px] truncate">{friend.name}</p>
                                <span className="text-[9.5px] font-mono text-zinc-500 block">{friend.val}</span>
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
            <section
              id="beneficios"
              className="py-32 sm:py-40 w-full bg-black border-b border-zinc-900 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(245,158,11,0.015)_0%,transparent_50%)] pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="text-left max-w-3xl mb-24 space-y-4">
                  <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                    O DIFERENCIAL DEFINITIVO
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Por que o Invictus é diferente?
                  </h2>
                  <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
                    Unimos tecnologia desportiva avançada, validação física de integridade e gamificação saudável para blindar sua constância diária.
                  </p>
                </div>

                {/* 5 Pillars Bento Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto items-stretch">
                  
                  {/* Pillar 1: Gamificação */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-3xl space-y-5 transition-all duration-300 flex flex-col justify-between md:col-span-6 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl w-fit group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-white text-lg sm:text-xl font-display">Gamificação dos Treinos</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Esqueça rotinas monótonas. Suas atividades físicas são convertidas em pontos de XP legítimos, sequências diárias ativas e conquistas estruturadas.
                      </p>
                    </div>
                    <div className="pt-4 text-xs font-mono text-zinc-500 uppercase tracking-wider">Engajamento Comprovado</div>
                  </div>

                  {/* Pillar 2: Rankings */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-3xl space-y-5 transition-all duration-300 flex flex-col justify-between md:col-span-6 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl w-fit group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-white text-lg sm:text-xl font-display">Rankings Competitivos</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Compita em ligas regionais dinâmicas. Nosso sistema divide os atletas de forma justa baseado em dados físicos históricos reais para garantir que todos tenham chances de vencer com dedicação.
                      </p>
                    </div>
                    <div className="pt-4 text-xs font-mono text-zinc-500 uppercase tracking-wider">Competição Justa</div>
                  </div>

                  {/* High impact central banner (Span 12) */}
                  <div className="md:col-span-12 p-10 sm:p-12 bg-zinc-950 border border-zinc-900 rounded-3xl text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4 group">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full" />
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full" />
                    
                    <span className="text-xs font-mono text-amber-500 tracking-[0.3em] uppercase font-bold">O MANIFESTO INVICTUS</span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight max-w-4xl">
                      "Você não treina sozinho. Você entra em uma competição diária pela sua melhor versão física."
                    </h3>
                    <div className="w-16 h-[2px] bg-amber-500 mt-2" />
                  </div>

                  {/* Pillar 3: Desafios por Temporadas */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-3xl space-y-5 transition-all duration-300 flex flex-col justify-between md:col-span-4 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl w-fit group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-base sm:text-lg font-display">Ciclos por Temporadas</h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        Participe de ciclos de performance com metas que mudam a cada estação, garantindo estímulos novos e constância contínua.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 4: Comunidade Fitness */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-3xl space-y-5 transition-all duration-300 flex flex-col justify-between md:col-span-4 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl w-fit group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                        <Users className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-base sm:text-lg font-display">Comunidade Ativa</h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        Conecte-se com pessoas reais que compartilham o mesmo propósito desportivo focado em superação física e saúde mental.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 5: Sistema de Evolução */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-3xl space-y-5 transition-all duration-300 flex flex-col justify-between md:col-span-4 text-left group">
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-850 text-amber-500 rounded-2xl w-fit group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                        <Activity className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-base sm:text-lg font-display">Estatísticas Unificadas</h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        Seus dados biométricos, calorias e treinos consolidados de forma organizada, limpa e legível diretamente no celular.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* SEÇÃO — PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
            <section
              id="faq"
              className="py-32 sm:py-40 w-full bg-black border-b border-zinc-900"
            >
              <div className="max-w-4xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-left mb-24 space-y-4">
                  <span className="text-amber-500 font-mono text-xs tracking-[0.25em] font-semibold uppercase block">
                    TIRE SUAS DÚVIDAS
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Perguntas Frequentes.
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Esclareça de forma simples as principais dúvidas sobre nossa plataforma, segurança e conformidade desportiva.
                  </p>
                </div>

                {/* FAQ Accordion Lists */}
                <div className="space-y-4 text-left">
                  {[
                    {
                      q: "O Invictus é plataforma de apostas?",
                      a: "Não. O Invictus não possui jogos de azar, apostas de cotas fixas ou sorteios em dinheiro. Nosso foco exclusivo é incentivar hábitos saudáveis por meio da gamificação esportiva e do reconhecimento de mérito individual por esforço real."
                    },
                    {
                      q: "Preciso treinar todos os dias para competir?",
                      a: "Não. Nós valorizamos o descanso inteligente como parte vital de sua evolução física. Você pode configurar dias de OFF no aplicativo para preservar sua sequência sem sofrer penalizações nas tabelas de rankings."
                    },
                    {
                      q: "Preciso possuir um smartwatch para participar?",
                      a: "Não. O plano Essencial permite rastrear sessões em academias credenciadas de forma simples por meio do check-in por geolocalização do próprio celular. O plano Performance adiciona suporte detalhado a relógios inteligentes (Apple Watch, Garmin, Strava) para coletar frequência cardíaca de cardio."
                    },
                    {
                      q: "Como os dados físicos são validados contra fraudes?",
                      a: "Combinamos barreiras de validação física passiva (geolocalização inteligente, cadência de sensores móveis e cruzamento de frequências biológicas) para identificar registros artificiais, mantendo a integridade desportiva do ranking."
                    }
                  ].map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div 
                        key={fIdx} 
                        className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          id={`faq-accordion-${fIdx}`}
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full flex items-center justify-between p-6 hover:bg-zinc-900/40 transition-colors text-left focus:outline-none cursor-pointer"
                        >
                          <span className="font-bold text-white text-base sm:text-lg pr-4">{faq.q}</span>
                          <span className={`text-amber-500 font-mono transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen 
                              ? 'max-h-96 opacity-100 border-t border-zinc-900 p-6 bg-black text-zinc-350 text-sm sm:text-base leading-relaxed antialiased' 
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
              className="py-32 sm:py-40 w-full bg-black relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.02)_0%,transparent_60%)] pointer-events-none" />
              
              <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10 flex flex-col items-center">
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-950 border border-amber-500/20 rounded-full font-mono text-xs text-amber-500 font-bold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  consistência é progresso
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Pronto para evoluir de verdade?
                  </h2>
                  <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed antialiased">
                    Baixe o Invictus agora mesmo. Inicie sua jornada de hábitos fortes, sincronize seus dispositivos e proteja sua consistência desportiva.
                  </p>
                </div>

                {/* Android vs iOS main triggers */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md pt-4">
                  <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 flex-1 flex flex-col justify-between items-center text-center hover:border-zinc-800 transition-all">
                    <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest mb-4 block">Google Android</span>
                    <button 
                      id="btn-trigger-playstore"
                      onClick={() => showToast("O download do aplicativo Android iniciou de forma segura através do Google Play Store.")}
                      className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl text-xs tracking-wider uppercase font-mono transition-colors focus:outline-none cursor-pointer"
                    >
                      Google Play
                    </button>
                  </div>
                  <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 flex-1 flex flex-col justify-between items-center text-center hover:border-zinc-800 transition-all">
                    <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest mb-4 block">Apple iOS iPhone</span>
                    <button 
                      id="btn-trigger-appstore"
                      onClick={() => showToast("O download do aplicativo iOS iniciou de forma segura através da Apple App Store.")}
                      className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-semibold rounded-xl text-xs tracking-wider uppercase font-mono transition-colors focus:outline-none cursor-pointer"
                    >
                      App Store
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-w-xl mx-auto border-t border-zinc-900 pt-8">
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                    As campanhas de motivação e recompensas realizadas pela plataforma seguem critérios desportivos estabelecidos em regulamentos próprios. Consulte as diretrizes vigentes no aplicativo.
                  </p>
                  <p className="text-[10px] font-mono text-zinc-600">
                    Invictus é gratuito para iniciar • Atualização de ligas desportivas aos domingos às 23:59 UTC-3.
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
            className="fixed bottom-6 right-6 z-50 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm"
          >
            <div className="p-2.5 bg-amber-950 text-amber-500 rounded-xl">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div className="text-left">
              <h5 className="text-white text-xs font-mono uppercase tracking-wider font-bold">Download Iniciado</h5>
              <p className="text-zinc-400 text-xs mt-1 leading-normal">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
