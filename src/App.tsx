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
  User,
  Mic,
  Brain,
  Bot,
  LineChart,
  ShieldAlert,
  FileText,
  Cpu,
  CalendarDays,
  Radio,
  Volume2,
  Stethoscope,
  Scale,
  FolderKanban,
  Info,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SubPages from './components/SubPages';
import SmartphoneMockup from './components/SmartphoneMockup';
import InvictusLogo from './components/InvictusLogo';
import InvictusIASection from './components/InvictusIASection';
import CinematicAtmosphere from './components/CinematicAtmosphere';
import { PageType } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  
  // Performance Center range selector state
  const [activeDashboardRange, setActiveDashboardRange] = useState<'diario' | 'semanal' | 'mensal' | 'anual' | 'longitudinal'>('semanal');
  
  // Cardio tab selector state
  const [activeCardioTab, setActiveCardioTab] = useState<'corrida' | 'caminhada' | 'bike' | 'musculacao' | 'outros'>('corrida');
  
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [activeMockTab, setActiveMockTab] = useState<'inicio' | 'ranking' | 'treinos' | 'perfil'>('inicio');

  // Listen to scroll to update smartphone mockup tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['invictus-ia', 'performance-center', 'integracoes', 'sistema-iga'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            if (section === 'invictus-ia') setActiveMockTab('perfil');
            if (section === 'performance-center') setActiveMockTab('inicio');
            if (section === 'integracoes') setActiveMockTab('ranking');
            if (section === 'sistema-iga') setActiveMockTab('treinos');
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
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  };

  // Constants for Cardio interactive description
  const cardioDetails = {
    corrida: {
      title: "🏃 Corrida e Monitoramento Aeróbico",
      desc: "Captura detalhada de ritmo, cadência, variação altimétrica e zonas de frequência cardíaca via GPS e relógios inteligentes.",
      stats: "Sincronização instantânea com Apple Health, Health Connect e Strava.",
      tag: "GPS + FC",
      icon: <Activity className="w-6 h-6 text-amber-500 animate-pulse" />
    },
    caminhada: {
      title: "🚶 Caminhada e Recuperação Ativa",
      desc: "Acompanhamento da saúde circulatória e gasto energético diário. Contagem biométrica de passos para validar regularidade.",
      stats: "Métricas integradas diretamente ao histórico longitudinal do Centro de Performance.",
      tag: "Passômetro",
      icon: <Footprints className="w-6 h-6 text-amber-500" />
    },
    bike: {
      title: "🚴 Ciclismo e Bike Indoor",
      desc: "Mapeamento telemétrico para saídas ao ar livre ou rolos de treino bluetooth. Análise da curva de velocidade e potência.",
      stats: "Importação direta de trajetos via Strava e sensores parceiros.",
      tag: "Velo-GPS",
      icon: <TrendingUp className="w-6 h-6 text-amber-500" />
    },
    musculacao: {
      title: "🏋️ Musculação e Carga Biomecânica",
      desc: "Validação de sessões de força na academia com verificação de permanência por cerco geográfico e biometria do celular.",
      stats: "Sessões auditadas para nutrir a pontuação do sistema IGA.",
      tag: "Geocerca",
      icon: <Dumbbell className="w-6 h-6 text-amber-500" />
    },
    outros: {
      title: "➕ Outras Modalidades de Saúde",
      desc: "Suporte para remo, natação, ioga e treinos funcionais validados por monitores de frequência cardíaca de precisão.",
      stats: "Consolidação única de todas as suas práticas desportivas.",
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
    <div className="bg-[#040406] text-[#EDEDED] relative overflow-hidden min-h-screen flex flex-col font-sans select-none">
      
      {/* 60 FPS Atmospheric Canvas Particles & Volumetric Lighting */}
      <CinematicAtmosphere />
      
      {/* Absolute top glowing radial halo spanning background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_60%)] pointer-events-none z-0" />
      
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
              className="relative w-full overflow-hidden border-b border-zinc-900 pt-32 pb-24 sm:pt-40 sm:pb-36 lg:pt-44 lg:pb-40 bg-black"
            >
              {/* Ultra-premium subtle abstract light design */}
              <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />
              <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                
                {/* Left Block text */}
                <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
                  
                  {/* Premium Badges row */}
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/80 backdrop-blur-md border border-amber-500/20 rounded-full">
                      <InvictusLogo size={18} showText={false} />
                      <span className="text-[10px] font-mono tracking-[0.2em] text-amber-400 font-bold uppercase">
                        PLATAFORMA INTELIGENTE DE SAÚDE
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/60 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-400 font-semibold uppercase">
                      <Brain className="w-3.5 h-3.5 text-amber-400" />
                      INVICTUS IA + DADOS REAIS
                    </div>
                  </div>

                  {/* Heading Title */}
                  <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1]">
                    Sua saúde, desempenho e evolução pessoal <br />
                    baseados em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE699] via-[#FBBF24] to-[#B45309]">
                      dados reais
                    </span>.
                  </h1>

                  {/* Hero Subtitle */}
                  <p className="text-zinc-400 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl antialiased">
                    O Invictus unifica suas métricas de treino, saúde e longevidade num Centro de Performance completo, impulsionado por análises avançadas da Invictus IA.
                  </p>

                  <div className="h-[1px] bg-zinc-900 w-full" />

                  {/* Core Value Pillars row for fast comprehension */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-left hover:border-amber-500/20 transition-all">
                      <LineChart className="w-5 h-5 text-amber-400 mb-2" />
                      <span className="text-white text-xs font-semibold uppercase font-mono tracking-wider block">Centro de Performance</span>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1">Acompanhamento longitudinal diário, mensal e anual.</p>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-left hover:border-amber-500/20 transition-all">
                      <Brain className="w-5 h-5 text-amber-400 mb-2" />
                      <span className="text-white text-xs font-semibold uppercase font-mono tracking-wider block">Invictus IA</span>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1">Análise inteligente, projeções e respostas por texto/voz.</p>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-left hover:border-amber-500/20 transition-all">
                      <Radio className="w-5 h-5 text-amber-400 mb-2" />
                      <span className="text-white text-xs font-semibold uppercase font-mono tracking-wider block">Integrações Nativas</span>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1">Apple Health, Health Connect, Strava e GPS.</p>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-left hover:border-amber-500/20 transition-all">
                      <ShieldCheck className="w-5 h-5 text-amber-400 mb-2" />
                      <span className="text-white text-xs font-semibold uppercase font-mono tracking-wider block">Sistema IGA</span>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1">Índice equilibrado de desempenho e consistência.</p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                    <button
                      id="btn-hero-cta"
                      onClick={() => handleScrollToId('download')}
                      className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-2xl text-center shadow-lg transition-all cursor-pointer font-sans text-sm tracking-wide"
                    >
                      Conhecer a Plataforma
                    </button>
                    <button
                      id="btn-hero-secondary"
                      onClick={() => handleScrollToId('metodologia')}
                      className="px-8 py-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white font-semibold rounded-2xl text-center transition-colors cursor-pointer font-sans text-sm tracking-wide"
                    >
                      Metodologia Científica
                    </button>
                  </div>
                </div>

                {/* Right Block: Live Premium Smartphone mockup */}
                <div className="lg:col-span-5 flex justify-center relative w-full pt-6 lg:pt-0">
                  <div className="absolute -inset-10 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
                  <SmartphoneMockup onlyPhone={true} />
                </div>
              </div>
            </section>

            {/* SEÇÃO 2 — POSICIONAMENTO E PROPÓSITO DA PLATAFORMA */}
            <section
              id="proposito"
              className="py-28 sm:py-36 w-full border-b border-zinc-900 bg-black relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[160px] pointer-events-none z-0" />
              
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left content block */}
                  <div className="lg:col-span-7 text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 rounded-full">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      Evolução Pessoal Baseada em Evidências
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                      A nova era da <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                        Inteligência em Saúde.
                      </span>
                    </h2>
                    
                    <div className="space-y-6 text-zinc-400 text-base sm:text-lg leading-relaxed antialiased">
                      <p className="font-semibold text-white text-lg sm:text-xl">
                        O Invictus evoluiu de um aplicativo de desafios fitness para uma plataforma completa de acompanhamento da saúde, desempenho esportivo e evolução pessoal.
                      </p>
                      <p>
                        Acreditamos que dados dispersos e isolados perdem seu valor transformador. O Invictus integra informações capturadas por seus dispositivos preferidos em uma linha do tempo permanente, fornecendo clareza sobre seu condicionamento, recuperação e tendências de longo prazo.
                      </p>
                      <p>
                        Sem números simulados, sem estimativas arbitrárias. Toda análise e todo insight derivam diretamente da sua atividade física genuína e métricas reais.
                      </p>
                    </div>

                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl border-l-4 border-l-amber-500">
                      <p className="text-zinc-300 font-display text-lg font-medium leading-relaxed italic">
                        "Transformamos a complexidade dos dados de saúde em conhecimento simples, acionável e cientificamente embasado para a sua evolução contínua."
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
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">PILARES DA PLATAFORMA</span>
                        <h4 className="text-xl font-bold text-white">O Ecossistema Invictus</h4>
                      </div>

                      <div className="space-y-5">
                        <div className="flex gap-4 items-start">
                          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-400 shrink-0">
                            <LineChart className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Centro de Performance</h5>
                            <p className="text-xs text-zinc-550 mt-1">Visão histórica consolidada por dia, semana, mês e ano de sua jornada.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-400 shrink-0">
                            <Brain className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Invictus IA</h5>
                            <p className="text-xs text-zinc-550 mt-1">Assistente analítica integrada por texto e comandos por voz.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-400 shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-semibold">Garantia de Dados Reais</h5>
                            <p className="text-xs text-zinc-550 mt-1">Apenas registros validados por sensores e integrações homologadas.</p>
                          </div>
                        </div>
                      </div>

                      <div className="h-[1px] bg-zinc-900 w-full" />

                      <button
                        onClick={() => handleScrollToId('performance-center')}
                        className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-mono font-bold tracking-widest uppercase text-amber-400 transition-all cursor-pointer"
                      >
                        Explorar Centro de Performance
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* SEÇÃO 3 — METODOLOGIA CIENTÍFICA */}
            <section
              id="metodologia"
              className="py-28 sm:py-36 w-full border-b border-zinc-900 bg-gradient-to-b from-[#050505] to-[#080808]"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-left max-w-3xl mb-20 space-y-4">
                  <span className="text-amber-400 font-mono text-xs tracking-[0.25em] font-bold uppercase block">
                    FUNDAMENTAÇÃO
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Metodologia Científica Invictus.
                  </h2>
                  <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
                    Acompanhamento longitudinal fundamentado nos princípios da fisiologia do exercício, promoção da saúde e ciência dos dados.
                  </p>
                </div>

                {/* 4 Methodology Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1 */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all text-left">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-amber-400">
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">Acompanhamento Longitudinal</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      A evolução biológica não acontece da noite para o dia. Acompanhamos tendências de semanas e meses para estimar sua adaptação real ao esforço.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all text-left">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-amber-400">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">Equilíbrio & Recuperação</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Prevenimos o overtraining avaliando a variação de carga física, frequência cardíaca e descanso necessário para uma longevidade física saudável.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all text-left">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-amber-400">
                      <Dna className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">Integração Multidisciplinar</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Conectamos dados cardíacos, hábitos de mobilidade, volume de treino e consistência corporal num único modelo unificado.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all text-left">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-amber-400">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">Suporte aos Profissionais</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      A tecnologia não substitui os profissionais da saúde; ela os empodera fornecendo dados históricos organizados para decisões precisas.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* SEÇÃO 4 — NOVO CENTRO DE PERFORMANCE */}
            <section
              id="performance-center"
              className="py-28 sm:py-36 w-full border-b border-zinc-900 bg-black relative overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left Column: text content */}
                  <div className="lg:col-span-5 space-y-8 text-left">
                    <div className="space-y-4">
                      <span className="text-amber-400 font-mono text-xs tracking-[0.25em] font-bold uppercase block">
                        PAINEL ANALÍTICO COMPLETO
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                        Centro de Performance.
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed">
                        Análise profunda e contínua do seu histórico esportivo e indicadores biométricos em múltiplos horizontes temporais.
                      </p>
                    </div>

                    {/* Timeline range pills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(['diario', 'semanal', 'mensal', 'anual', 'longitudinal'] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => setActiveDashboardRange(range)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all border cursor-pointer ${
                            activeDashboardRange === range 
                              ? 'bg-amber-400 text-black border-amber-400 shadow-md' 
                              : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-900'
                          }`}
                        >
                          {range === 'diario' ? 'Diário' : range === 'semanal' ? 'Semanal' : range === 'mensal' ? 'Mensal' : range === 'anual' ? 'Anual' : 'Longitudinal'}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 pt-2 text-sm text-zinc-400">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span><strong>Histórico completo:</strong> diário, semanal, mensal, anual e linha do tempo.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span><strong>Gráficos e tendências:</strong> estatísticas, recordes e comparações entre períodos.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span><strong>Indicadores biológicos:</strong> FC, variabilidade cardíaca, consistência e nível de recuperação.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span><strong>Insights e projeções:</strong> estimativas baseadas em aprendizado computacional sobre seus dados reais.</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dashboard Interactive Preview */}
                  <div className="lg:col-span-7 relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/5 to-transparent rounded-[40px] blur-3xl opacity-50 pointer-events-none" />
                    
                    <div className="relative p-8 bg-zinc-950 rounded-3xl border border-zinc-900 space-y-8 text-left">
                      
                      {/* Dashboard Header toolbar */}
                      <div className="flex justify-between items-center pb-6 border-b border-zinc-900">
                        <div className="flex items-center gap-3">
                          <span className="p-3 bg-zinc-900 border border-zinc-800 text-amber-400 rounded-2xl">
                            <LineChart className="w-5 h-5" />
                          </span>
                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">PAINEL DE MÉTRICAS</span>
                            <h4 className="text-white text-sm font-bold uppercase tracking-widest font-sans">
                              VISÃO {activeDashboardRange.toUpperCase()}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-950 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                          DADOS REAIS SINC
                        </span>
                      </div>

                      {/* Info Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
                          <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Méd. Cardíaca</span>
                          <p className="text-white text-xl font-bold font-mono mt-1.5 flex items-baseline gap-1">
                            {activeDashboardRange === 'diario' ? '128' : activeDashboardRange === 'semanal' ? '138' : activeDashboardRange === 'mensal' ? '135' : '132'}
                            <span className="text-xs text-zinc-500 font-normal">BPM</span>
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
                          <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Gasto Calórico</span>
                          <p className="text-white text-xl font-bold font-mono mt-1.5 flex items-baseline gap-1">
                            {activeDashboardRange === 'diario' ? '520' : activeDashboardRange === 'semanal' ? '3.640' : activeDashboardRange === 'mensal' ? '15.800' : '182k'}
                            <span className="text-xs text-zinc-500 font-normal">kcal</span>
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
                          <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Tempo Ativo</span>
                          <p className="text-white text-xl font-bold font-mono mt-1.5 flex items-baseline gap-1">
                            {activeDashboardRange === 'diario' ? '1.2' : activeDashboardRange === 'semanal' ? '8.4' : activeDashboardRange === 'mensal' ? '34.0' : '410'}
                            <span className="text-xs text-zinc-500 font-normal">h</span>
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
                          <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Índice IGA</span>
                          <p className="text-amber-400 text-xl font-bold font-mono mt-1.5 flex items-baseline gap-1">
                            94.8
                            <span className="text-xs text-zinc-500 font-normal">/100</span>
                          </p>
                        </div>
                      </div>

                      {/* Custom Decorative Graphic Chart */}
                      <div className="p-6 bg-black border border-zinc-900 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-zinc-400">Tendência de Volume & Frequência</span>
                          <span className="text-amber-400 bg-amber-950 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            EVOLUÇÃO REGISTRADA
                          </span>
                        </div>
                        
                        <div className="h-44 flex items-end justify-between gap-2 pt-4 text-zinc-500 font-mono text-[9px]">
                          {[
                            { label: 'P-1', val: 50 },
                            { label: 'P-2', val: 68 },
                            { label: 'P-3', val: 60 },
                            { label: 'P-4', val: 82 },
                            { label: 'P-5', val: 75 },
                            { label: 'P-6', val: 90 },
                            { label: 'Atual', val: 95 }
                          ].map((item, id) => (
                            <div key={id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                              <div className="w-full bg-zinc-950 rounded-lg h-full flex flex-col justify-end relative overflow-hidden border border-zinc-900">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${item.val}%` }}
                                  transition={{ duration: 0.8, delay: id * 0.05 }}
                                  className="w-full bg-gradient-to-t from-amber-600 to-amber-400" 
                                />
                              </div>
                              <span className="text-zinc-500 font-mono text-[10px]">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SEÇÃO 5 — INVICTUS IA (ASSISTENTE INTELIGENTE) */}
            <InvictusIASection onScrollToDownload={() => handleScrollToId('download')} />

            {/* SEÇÃO 6 — DADOS REAIS & INTEGRAÇÕES */}
            <section
              id="integracoes"
              className="py-28 sm:py-36 w-full border-b border-zinc-900 bg-gradient-to-b from-[#050505] to-[#080808]"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-left max-w-3xl mb-20 space-y-4">
                  <span className="text-amber-400 font-mono text-xs tracking-[0.25em] font-bold uppercase block">
                    CONECTIVIDADE DE HARDWARE
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Dados Reais. Sem Simulações.
                  </h2>
                  <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
                    Sincronização nativa com os ecossistemas mais confiáveis do mercado para garantir a integridade absoluta dos seus registros.
                  </p>
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: "Apple Health", type: "HealthKit iOS", desc: "Passos, frequência cardíaca, treinos e gasto energético do iPhone/Apple Watch.", icon: "🍎" },
                    { name: "Health Connect", type: "Android Native", desc: "Coleta unificada de biometria e atividades físicas no ecossistema Android.", icon: "🤖" },
                    { name: "Strava", type: "API Esportiva", desc: "Sincronização direta de corridas, pedaladas e trajetos com validação GPS.", icon: "⚡" },
                    { name: "GPS & Sensores", type: "Hardware Mobile", desc: "Acelerômetro, giroscópio e cercas geográficas para auditoria presencial.", icon: "🛰️" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4 text-left hover:border-amber-500/30 transition-all">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">{item.type}</span>
                        <h4 className="text-xl font-bold text-white font-display mt-0.5">{item.name}</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Data Limitations Notice */}
                <div className="mt-12 p-6 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-xs text-zinc-400 leading-normal">
                      <strong>Transparência de Coleta:</strong> Quando os dados fornecidos forem insuficientes em determinado período, certas análises no Centro de Performance ficarão temporariamente limitadas em vez de gerar estimativas fictícias.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-zinc-900 text-zinc-400 text-[10px] font-mono rounded-full font-bold uppercase shrink-0">
                    RIGOR TÉCNICO
                  </span>
                </div>

              </div>
            </section>

            {/* SEÇÃO 7 — NOVO SISTEMA DE PERFORMANCE (SISTEMA IGA) */}
            <section
              id="sistema-iga"
              className="py-28 sm:py-36 w-full border-b border-zinc-900 bg-black relative overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  <div className="lg:col-span-6 text-left space-y-8">
                    <div className="space-y-4">
                      <span className="text-amber-400 font-mono text-xs tracking-[0.25em] font-bold uppercase block">
                        MÉTRICA DE AVALIAÇÃO DE DESEMPENHO
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                        Sistema IGA: Índice de Desempenho.
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed">
                        Um índice equilibrado e transparente que mede sua evolução física integrando múltiplos fatores biomecânicos e cardíacos.
                      </p>
                    </div>

                    <div className="space-y-4 text-sm text-zinc-300">
                      <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl">
                        <h5 className="font-bold text-white mb-1">Equilíbrio Multi-Fatorial</h5>
                        <p className="text-xs text-zinc-400">Pondera regularidade de treinos, intensidade cardiovascular, volume e recuperação muscular.</p>
                      </div>
                      <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl">
                        <h5 className="font-bold text-white mb-1">Evolução Individual Justa</h5>
                        <p className="text-xs text-zinc-400">Avalia o seu progresso pessoal contra o seu próprio histórico, sem expor algoritmos internos sensíveis.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Score Visual Card */}
                  <div className="lg:col-span-6">
                    <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl text-left space-y-6 relative overflow-hidden">
                      <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                        <span className="text-xs font-mono text-zinc-500 uppercase font-bold">PONTUAÇÃO ATUAL IGA</span>
                        <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/40 border border-amber-500/20 px-3 py-1 rounded-full">
                          NÍVEL EXCELENTE
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 py-2">
                        <span className="text-6xl sm:text-7xl font-extrabold font-display text-white italic">94.8</span>
                        <span className="text-sm font-mono text-zinc-500 font-bold">/ 100</span>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono text-zinc-400">
                            <span>Consistência Semanal</span>
                            <span className="text-white font-bold">98%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: '98%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono text-zinc-400">
                            <span>Carga Cardio & Biomecânica</span>
                            <span className="text-white font-bold">92%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono text-zinc-400">
                            <span>Índice de Recuperação</span>
                            <span className="text-white font-bold">94%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: '94%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SEÇÃO 8 — PRIVACIDADE E LIMITAÇÕES DA IA */}
            <section
              id="privacidade"
              className="py-28 sm:py-36 w-full border-b border-zinc-900 bg-black"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Privacy Box */}
                  <div className="lg:col-span-6 p-8 bg-zinc-950 border border-zinc-900 rounded-3xl text-left space-y-6">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-amber-400">
                      <LockKeyhole className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white font-display">Privacidade & Controle de Dados</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Seus dados biométricos e de saúde pertencem exclusivamente a você. Criptografamos todas as conexões e garantimos que suas informações nunca serão comercializadas com parceiros de publicidade ou seguradoras.
                      </p>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-300 font-mono">
                      <li className="flex items-center gap-2">✓ Permissões ativas sob controle do usuário</li>
                      <li className="flex items-center gap-2">✓ Criptografia TLS de ponta a ponta</li>
                      <li className="flex items-center gap-2">✓ Em conformidade estrita com a LGPD</li>
                    </ul>
                  </div>

                  {/* AI Limitations Box (Mandatory Transparency) */}
                  <div id="limitacoes-ia" className="lg:col-span-6 p-8 bg-zinc-950 border border-amber-500/20 rounded-3xl text-left space-y-6 relative overflow-hidden">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-amber-400">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white font-display">Limitações da IA & Aviso de Saúde</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        A Invictus IA foi desenvolvida com finalidade exclusivamente educativa e informativa para auxiliar na compreensão de gráficos e dados do seu Centro de Performance.
                      </p>
                    </div>
                    <div className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-2xl space-y-2 text-xs text-zinc-300">
                      <p className="font-semibold text-amber-400">⚠️ Aviso Importante:</p>
                      <p className="leading-relaxed">
                        A Invictus IA não realiza diagnósticos e <strong>não substitui a consulta a médicos, nutricionistas, fisioterapeutas ou profissionais de Educação Física</strong>. Sempre busque orientação profissional qualificada.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SEÇÃO 9 — ROADMAP (EM BREVE) */}
            <section
              id="roadmap"
              className="py-28 sm:py-36 w-full border-b border-zinc-900 bg-gradient-to-b from-[#050505] to-[#080808]"
            >
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="text-left max-w-3xl mb-16 space-y-4">
                  <span className="text-amber-400 font-mono text-xs tracking-[0.25em] font-bold uppercase block">
                    FUTURO DO INVICTUS
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Roadmap: Em Breve.
                  </h2>
                  <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
                    Nossa equipe técnica trabalha continuamente em novas inovações para expandir seu ecossistema de saúde.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {[
                    { title: "Voice Coach em Tempo Real", desc: "Acompanhamento por voz durante sessões ativas de treino com feedback imediato.", status: "EM DESENVOLVIMENTO" },
                    { title: "Expansão de Wearables", desc: "Suporte expandido para anéis inteligentes e novos monitores contínuos.", status: "PLANEJADO" },
                    { title: "Relatórios Inteligentes PDF", desc: "Exportação de dossiês clínicos de performance para apresentar ao seu médico ou treinador.", status: "EM BREVE" },
                    { title: "Portal para Profissionais", desc: "Painel dedicado para personal trainers e profissionais de saúde acompanharem alunos.", status: "EM BREVE" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-3">
                      <span className="text-[9px] font-mono bg-amber-950 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
                        {item.status}
                      </span>
                      <h4 className="text-lg font-bold text-white font-display">{item.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* SEÇÃO 10 — PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
            <section
              id="faq"
              className="py-28 sm:py-36 w-full bg-black border-b border-zinc-900"
            >
              <div className="max-w-4xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-left mb-20 space-y-4">
                  <span className="text-amber-400 font-mono text-xs tracking-[0.25em] font-bold uppercase block">
                    CENTRAL DE AJUDA
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Perguntas Frequentes.
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Esclareça suas dúvidas sobre o Invictus, a Invictus IA, o Centro de Performance e as integrações.
                  </p>
                </div>

                {/* FAQ Accordion Lists */}
                <div className="space-y-4 text-left">
                  {[
                    {
                      q: "O que é a plataforma INVICTUS?",
                      a: "O INVICTUS é uma plataforma inteligente de acompanhamento da saúde, desempenho esportivo e evolução pessoal baseada em dados reais, integrações nativas e inteligência artificial."
                    },
                    {
                      q: "O que é e como funciona a Invictus IA?",
                      a: "A Invictus IA é uma assistente integrada de saúde e desempenho. Com autorização do usuário, ela interpreta métricas corporais, analisa tendências do seu Centro de Performance e responde a dúvidas sobre treinos e conceitos científicos por texto e voz."
                    },
                    {
                      q: "A Invictus IA substitui profissionais da saúde?",
                      a: "Não. A Invictus IA possui finalidade exclusivamente educativa e informativa. Ela não realiza diagnósticos e não substitui o acompanhamento individualizado de médicos, nutricionistas, fisioterapeutas ou profissionais de Educação Física."
                    },
                    {
                      q: "O que é o Centro de Performance?",
                      a: "É o painel analítico do usuário no aplicativo, oferecendo acompanhamento longitudinal completo com históricos diário, semanal, mensal, anual e de longo prazo, incluindo gráficos de tendência e estatísticas."
                    },
                    {
                      q: "Quais aplicativos e dispositivos vestíveis são integrados?",
                      a: "Integrarmos nativamente a ecossistemas como Apple Health, Health Connect, Strava, GPS do dispositivo e monitores de frequência cardíaca compatíveis."
                    },
                    {
                      q: "Os dados e estatísticas exibidos são reais?",
                      a: "Sim, 100% reais. O Invictus não utiliza números fictícios ou gerados artificialmente. Caso os dados fornecidos em determinado período sejam insuficientes, algumas análises ficarão temporariamente limitadas."
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
                          <span className={`text-amber-400 font-mono transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen 
                              ? 'max-h-96 opacity-100 border-t border-zinc-900 p-6 bg-black text-zinc-300 text-sm sm:text-base leading-relaxed antialiased' 
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
              className="py-28 sm:py-36 w-full bg-black relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_60%)] pointer-events-none" />
              
              <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10 flex flex-col items-center">
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-950 border border-amber-500/20 rounded-full font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  SUA EVOLUÇÃO COMEÇA COM DADOS REAIS
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                    Pronto para experimentar o Invictus?
                  </h2>
                  <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed antialiased">
                    Baixe o aplicativo agora mesmo. Sincronize seus dispositivos e acesse seu Centro de Performance com suporte da Invictus IA.
                  </p>
                </div>

                {/* Android vs iOS triggers */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md pt-4">
                  <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 flex-1 flex flex-col justify-between items-center text-center hover:border-zinc-800 transition-all">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 block">Google Android</span>
                    <button 
                      id="btn-trigger-playstore"
                      onClick={() => showToast("O download do aplicativo Invictus para Android iniciou via Google Play Store.")}
                      className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl text-xs tracking-wider uppercase font-mono transition-colors focus:outline-none cursor-pointer"
                    >
                      Google Play
                    </button>
                  </div>
                  <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 flex-1 flex flex-col justify-between items-center text-center hover:border-zinc-800 transition-all">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 block">Apple iOS iPhone</span>
                    <button 
                      id="btn-trigger-appstore"
                      onClick={() => showToast("O download do aplicativo Invictus para iOS iniciou via Apple App Store.")}
                      className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-semibold rounded-xl text-xs tracking-wider uppercase font-mono transition-colors focus:outline-none cursor-pointer"
                    >
                      App Store
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-w-xl mx-auto border-t border-zinc-900 pt-8">
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                    O Invictus é uma plataforma de acompanhamento de saúde e desempenho esportivo. Toda análise e interação com a Invictus IA possui finalidade informativa.
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
            className="fixed bottom-6 right-6 z-50 p-5 bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm"
          >
            <div className="p-2.5 bg-amber-950 text-amber-400 rounded-xl">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-left">
              <h5 className="text-white text-xs font-mono uppercase tracking-wider font-bold">INVICTUS DOWNLOAD</h5>
              <p className="text-zinc-400 text-xs mt-1 leading-normal">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
