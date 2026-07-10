import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Trophy, 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Heart, 
  Play, 
  CheckCircle2, 
  Flame, 
  Compass, 
  ChevronRight, 
  Smartphone,
  ShieldCheck,
  CalendarDays,
  Bell,
  Star,
  Zap,
  User,
  Plus,
  Activity,
  Clock,
  CircleDot,
  Building2,
  Lock,
  Utensils,
  Camera,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InvictusLogo from './InvictusLogo';

type MockTab = 'inicio' | 'ranking' | 'treinos' | 'perfil';

export default function SmartphoneMockup({ onlyPhone = false }: { onlyPhone?: boolean }) {
  const [activeTab, setActiveTab] = useState<MockTab>('inicio');
  const [workoutChecked, setWorkoutChecked] = useState<boolean[]>([true, true, false, false]);
  const [timeState, setTimeState] = useState(542); // Simulated timer (9:02)
  const [heartRate, setHeartRate] = useState(132);
  const [isManual, setIsManual] = useState(false);

  // Auto-rotate tabs to illustrate different interface aspects on the landing page, 
  // pausing instantly once the user manually interacts.
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeState(prev => prev + 1);
      setHeartRate(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next > 165 ? 150 : next < 118 ? 130 : next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isManual || onlyPhone) return;
    const interval = setInterval(() => {
      setActiveTab(prev => {
        if (prev === 'inicio') return 'ranking';
        if (prev === 'ranking') return 'treinos';
        if (prev === 'treinos') return 'perfil';
        return 'inicio';
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isManual, onlyPhone]);

  const toggleWorkout = (index: number) => {
    const nextList = [...workoutChecked];
    nextList[index] = !nextList[index];
    setWorkoutChecked(nextList);
  };

  const minutes = Math.floor(timeState / 60);
  const seconds = timeState % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16 justify-center">
      
      {/* Visual Navigation Controls on the Left side */}
      {!onlyPhone && (
        <div className="w-full lg:w-1/2 flex flex-col gap-5 text-left order-last lg:order-first">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 text-xs font-mono text-red-500 w-fit mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            Acompanhe no Seu Ritmo
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-white mb-2">
            Uma interface lapidada para foco total
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-4">
            Esqueça os aplicativos abarrotados de menus complicados e pop-ups irritantes. O Invictus foi projetado com uma experiência focada na ação rápida: abra, selecione, execute e conquiste.
          </p>

          {/* Tab Cards (Premium Interactive Toggle Buttons) */}
          <div className="space-y-3">
            {[
              {
                id: 'inicio' as MockTab,
                icon: <CircleDot className="w-5 h-5" />,
                title: "Painel Principal",
                desc: "A tela de acompanhamento diário com status integrados de temporada, suas próximas metas semanais e resumo de calorias."
              },
              {
                id: 'ranking' as MockTab,
                icon: <Trophy className="w-5 h-5" />,
                title: "Tabela de Classificação Real",
                desc: "Ligas de competitividade saudáveis criadas para medir disciplina, separando atletas em rankings locais de esforço."
              },
              {
                id: 'treinos' as MockTab,
                icon: <Dumbbell className="w-5 h-5" />,
                title: "Registro de Treino Presencial",
                desc: "Controle refinado de cargas de força, biometria cardíaca e validação inteligente de permanência baseada em GPS."
              },
              {
                id: 'perfil' as MockTab,
                icon: <User className="w-5 h-5" />,
                title: "Sua Identidade e Integrações",
                desc: "Sincronização com relógios Garmin Connect e Strava API. Conquistas meritocráticas auditadas sem anúncios."
              }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  id={`mock-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsManual(true);
                  }}
                  className={`w-full flex gap-4 p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group focus:outline-none ${
                    isSelected 
                      ? 'bg-zinc-900 border-amber-500/40 shadow-2xl shadow-amber-500/5' 
                      : 'bg-zinc-950/20 border-zinc-900 hover:bg-zinc-900/40 hover:border-zinc-850'
                  }`}
                >
                  {/* Visual Accent for Selected State */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
                  )}
                  
                  <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isSelected ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 group-hover:text-white'
                  }`}>
                    {tab.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-base font-semibold font-display transition-colors ${isSelected ? 'text-amber-300' : 'text-zinc-300 group-hover:text-white'}`}>
                      {tab.title}
                    </h4>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 leading-normal">
                      {tab.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Simulated Smartphone mockup Container on the Right */}
      <div className={`${onlyPhone ? 'w-full' : 'w-full lg:w-1/2'} flex justify-center relative p-2`}>
        {/* Glow behind phone */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/10 to-transparent blur-3xl rounded-full opacity-60 pointer-events-none" />

        {/* Outer Phone Frame */}
        <div className="relative w-[315px] sm:w-[335px] h-[650px] sm:h-[670px] bg-zinc-900 rounded-[50px] p-3 border-4 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
          {/* Inner Screen Surface */}
          <div className="relative w-full h-full bg-[#050505] rounded-[40px] border-2 border-zinc-950 flex flex-col overflow-hidden select-none">
            
            {/* Dynamic Island bar styled cutout */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-between px-4">
              <div className="w-2 h-2 bg-zinc-900/90 rounded-full border border-zinc-850" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[8.5px] font-mono text-zinc-400 tracking-wide">SYSTEM REY</span>
              </div>
            </div>

            {/* Simulated Smartphone Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-9 px-7 pt-1.5 flex justify-between items-center text-[10px] font-bold font-mono text-zinc-400 z-20 pointer-events-none">
              <span>23:21</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4a.5.5 0 00.35.85h14.6a.5.5 0 00.35-.85l-1.62-1.79C19.26 16.07 20 14.12 20 12c0-4.97-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                </svg>
                <span>4G</span>
                <div className="flex items-center gap-0.5 border border-zinc-500 rounded px-1 py-0.2">
                  <span className="text-[8px]">44%</span>
                  <div className="w-2.5 h-1.5 bg-green-500 rounded-xs" />
                </div>
              </div>
            </div>

            {/* Interactive Screen Layout and Content block */}
            <div className="flex-1 overflow-y-auto pt-10 pb-16 space-y-4 relative z-10 scrollbar-none text-left bg-[#0A0A0A]">
              <AnimatePresence mode="wait">
                
                {/* 1. SEU PAINEL PRINCIPAL */}
                {activeTab === 'inicio' && (
                  <motion.div
                    key="inicio-screen"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="p-4 space-y-4"
                  >
                    {/* Unique Profile Welcome Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Avatar with athletic visual representation */}
                        <div className="relative w-9 h-9 rounded-full border border-amber-400 overflow-hidden shrink-0 bg-zinc-900 flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.1)]">
                          <svg viewBox="0 0 100 100" className="w-5 h-5 text-zinc-350">
                            <path fill="currentColor" d="M50 15c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 46c-19 0-35 11-35 24v5h70v-5c0-13-16-24-35-24z"/>
                          </svg>
                          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent" />
                        </div>
                        <div className="text-left leading-tight">
                          <p className="text-[8px] font-bold text-zinc-500 tracking-wider">BEM-VINDO(A),</p>
                          <p className="text-sm font-black font-display text-white tracking-wider italic leading-none my-0.5">ATLETA</p>
                          <div className="inline-flex items-center px-1.5 py-0.5 bg-zinc-950 border border-amber-400/40 rounded text-[7px] font-black font-display text-amber-400 mt-0.5 leading-none">
                            LVL 1
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {/* INVICTUS Badge matching screenshot */}
                        <button className="px-3.5 py-1 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center hover:bg-zinc-900">
                          <span className="text-[9px] font-black font-display tracking-widest text-[#FFC107] italic leading-none">INVICTUS</span>
                        </button>
                        {/* Notification bell */}
                        <button className="p-1.5 px-2 bg-zinc-950 border border-zinc-900 rounded-xl text-zinc-400 relative hover:text-white">
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* SUA ARENA DE TREINO CARD */}
                    <div className="p-4 bg-zinc-950/80 border border-amber-500/20 rounded-3xl relative overflow-hidden space-y-4 shadow-md text-left">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[8.5px] text-zinc-500 uppercase tracking-widest font-mono font-bold">SUA ARENA DE TREINO</p>
                          <h4 className="font-extrabold text-[#EDEDED] text-base tracking-tight leading-none italic font-display">
                            GYM FITNESS ACADEMIA
                          </h4>
                          <p className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wide leading-none mt-1">
                            LIGA DE CONSISTÊNCIA DE FORÇA & HIPERTROFIA
                          </p>
                        </div>
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl shrink-0 flex items-center justify-center">
                          <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      </div>

                      {/* Progress bar and weekly target */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9.5px] font-bold font-display italic">
                          <span className="text-amber-400 uppercase tracking-wide">META SEMANAL (0/5 TREINOS)</span>
                          <span className="text-zinc-400 font-mono">0%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="w-0 h-full bg-amber-400" />
                        </div>
                      </div>
                    </div>

                    {/* PROGRAMA DE HIPERTROFIA CARD */}
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-3xl flex items-center justify-between gap-3 relative overflow-hidden text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-400/10 text-amber-500 border border-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
                          <Dumbbell className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[8.5px] text-zinc-500 uppercase tracking-widest font-mono font-bold">PROGRAMA DE HIPERTROFIA</p>
                          <h5 className="font-extrabold text-white text-xs tracking-tight font-display uppercase leading-tight">
                            MANTER CONSTÂNCIA DE 5 TREINOS DE MUSCULAÇÃO
                          </h5>
                          <p className="text-[9px] font-mono text-zinc-500 font-bold leading-none mt-0.5">0/5 TREINOS DE FORÇA CONCLUÍDOS</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center text-center shrink-0">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400/20 mb-0.5" />
                        <span className="text-[9px] font-mono font-black text-amber-400 leading-none">
                          +2.000 XP
                        </span>
                      </div>
                    </div>

                    {/* ATHLETE METRICS HEADER row */}
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-wider uppercase px-1 pt-1.5">
                      <span className="text-zinc-400 font-display">MÉTRICAS DO ATLETA</span>
                      <button className="text-amber-400 font-black text-[9.5px] tracking-wide font-display italic">
                        VER RANKING
                      </button>
                    </div>

                    {/* Grid of 3 metrics cards */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* total_treats */}
                        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center h-24 text-center relative overflow-hidden">
                          <Dumbbell className="w-4 h-4 text-zinc-650 stroke-[1.5]" />
                          <span className="font-display font-black text-white text-2xl tracking-tight leading-none mt-2">
                            0
                          </span>
                          <span className="text-[7.5px] font-bold font-mono tracking-wider text-zinc-500 uppercase mt-1">TOTAL DE TREINOS</span>
                        </div>

                        {/* active_sequence */}
                        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center h-24 text-center relative overflow-hidden">
                          <Flame className="w-4 h-4 text-zinc-650 stroke-[1.5]" />
                          <span className="font-display font-black text-white text-2xl tracking-tight leading-none mt-2">
                            0 <span className="text-sm font-light italic text-zinc-500">dias</span>
                          </span>
                          <span className="text-[7.5px] font-bold font-mono tracking-wider text-zinc-500 uppercase mt-1">SEQUÊNCIA ATIVA</span>
                        </div>
                      </div>

                      {/* points earned full-width */}
                      <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center h-24 text-center relative overflow-hidden col-span-2">
                        <Trophy className="w-4 h-4 text-zinc-650 stroke-[1.5]" />
                        <span className="font-display font-black text-white text-2xl tracking-tight leading-none mt-2">
                          0 XP
                        </span>
                        <span className="text-[7.5px] font-bold font-mono tracking-wider text-zinc-500 uppercase mt-1">PONTOS GANHOS</span>
                      </div>
                    </div>

                    {/* Active Community section */}
                    <div className="space-y-3.5 pt-2 text-left">
                      <div className="flex justify-between items-end pl-1">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-amber-500 tracking-wider font-mono">COMUNIDADE ATIVA</p>
                          <h4 className="font-black text-white text-sm font-display tracking-wide uppercase leading-none">
                            MURAL DE SUPERAÇÃO COLETIVA
                          </h4>
                        </div>
                        <button className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-amber-400 font-bold text-[8.5px] tracking-wide font-display flex items-center gap-1.5 shrink-0 transition-all">
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                          </svg>
                          GERAR CARD STORY
                        </button>
                      </div>

                      {/* Empty state dashed message container */}
                      <div className="p-6 bg-zinc-950/40 border border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
                        <h6 className="text-[10px] font-extrabold text-zinc-400 tracking-wider uppercase leading-none">SEM PUBLICAÇÕES RECENTES</h6>
                        <p className="text-[8.5px] text-zinc-500 leading-normal font-sans font-bold max-w-[210px]">
                          SEJA O PRIMEIRO A MOTIVAR A COMUNIDADE USANDO O BOTÃO FLUTUANTE DE MAIS (+)!
                        </p>
                      </div>
                    </div>

                    {/* ATIVIDADE RECENTE row */}
                    <div className="pt-2 text-left">
                      <p className="text-[9px] font-bold text-zinc-500 tracking-wider font-mono">ATIVIDADE RECENTE</p>
                    </div>

                    {/* Floating Action Button (FAB) nested absolutely within the phone screen context */}
                    <button className="shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 absolute bottom-18 right-5 w-11 h-11 rounded-full bg-amber-400 flex items-center justify-center text-black font-extrabold z-20">
                      <Plus className="w-5 h-5 stroke-[3]" />
                    </button>
                  </motion.div>
                )}

                {/* 2. TABELA DE CLASSIFICAÇÃO / RANKING */}
                {activeTab === 'ranking' && (
                  <motion.div
                    key="ranking-screen"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="p-4 space-y-3"
                  >
                    {/* Header welcome */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full border border-amber-400 overflow-hidden shrink-0 bg-zinc-900 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-4 h-4 text-zinc-300">
                            <path fill="currentColor" d="M50 15c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 46c-19 0-35 11-35 24v5h70v-5c0-13-16-24-35-24z"/>
                          </svg>
                        </div>
                        <div className="text-left leading-none">
                          <p className="text-[7.5px] font-bold text-zinc-500 uppercase">Membro</p>
                          <p className="text-xs font-black font-display text-white tracking-wide italic">ATLETA</p>
                          <span className="text-[7px] font-bold font-mono text-amber-400">1 LVL</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 rounded-full flex items-center">
                          <span className="text-[8px] font-black font-display tracking-widest text-[#FFC107] italic">INVICTUS</span>
                        </div>
                      </div>
                    </div>

                    {/* Subtabs matching screenshot */}
                    <div className="flex border-b border-zinc-900 text-[10px] font-bold pb-1 font-display">
                      <button className="flex-1 text-center text-[#FFC107] border-b border-[#FFC107] pb-1 flex items-center justify-center gap-1 text-[8.5px]">
                        <Building2 className="w-3 h-3" /> ACADEMIA
                      </button>
                      <button className="flex-1 text-center text-zinc-650 flex items-center justify-center gap-1 cursor-not-allowed text-[8.5px]" disabled>
                        <Lock className="w-2.5 h-2.5" /> CIDADE
                      </button>
                      <button className="flex-1 text-center text-zinc-650 flex items-center justify-center gap-1 cursor-not-allowed text-[8.5px]" disabled>
                        <Lock className="w-2.5 h-2.5" /> NACIONAL
                      </button>
                    </div>

                    {/* Temporal subtabs */}
                    <div className="flex gap-1.5 text-[8.5px] font-mono">
                      <span className="px-2 py-0.5 bg-amber-400 text-black font-bold rounded-full text-[8px]">TEMPORADA</span>
                      <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 text-zinc-400 rounded-full text-[8px]">SEMANAL</span>
                      <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 text-zinc-400 rounded-full text-[8px]">MENSAL</span>
                    </div>

                    {/* Big Card: Incentivos */}
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2 text-left relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[7.5px] font-mono tracking-widest text-[#FFC107] font-bold uppercase leading-none">INCENTIVOS DA TEMPORADA</p>
                          <h4 className="font-extrabold text-white text-2xl tracking-tighter mt-1 font-display leading-none">
                            R$ 0
                          </h4>
                        </div>
                        <span className="text-[6.5px] font-mono text-zinc-500 uppercase bg-zinc-900 px-1 py-0.5 rounded font-bold leading-none shrink-0">EXCLUSIVO UNIDADE</span>
                      </div>
                      <p className="text-[8px] text-zinc-500 leading-normal font-sans">
                        OS INCENTIVOS EXIBIDOS NESTA TEMPORADA FAZEM PARTE DE CAMPANHAS PROMOCIONAIS, AÇÕES DE ENGAJAMENTO E PROGRAMAS DE RECONHECIMENTO ESPORTIVO DISPONIBILIZADOS PELA PLATAFORMA E PARCEIROS PARTICIPANTES.
                      </p>
                      <button className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-850 text-amber-400 text-[8.5px] font-mono font-bold rounded-lg border border-amber-500/10 flex items-center justify-center gap-1 mt-1 transition-colors">
                        ⚡ DISTRIBUIÇÃO PARA O TOP 10
                      </button>
                    </div>

                    {/* Stats columns */}
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                        <span className="text-[7px] font-mono text-zinc-500 uppercase">ATLETAS</span>
                        <p className="text-lg font-black text-white font-display mt-0.5">0</p>
                      </div>
                      <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                        <span className="text-[7px] font-mono text-zinc-500 uppercase">SUA POSIÇÃO</span>
                        <p className="text-lg font-black text-white font-display mt-0.5">#-</p>
                      </div>
                    </div>

                    {/* Yellow status bar banner */}
                    <div className="p-2 bg-amber-400 text-black font-semibold rounded-xl flex justify-between items-center text-[9px] uppercase font-display italic">
                      <span className="flex items-center gap-0.5">📍 POSIÇÃO ACADEMIA | ⌃ SUBINDO!</span>
                      <span className="font-mono font-black text-xs">0 PTS</span>
                    </div>
                  </motion.div>
                )}

                {/* 3. REGISTRO DE TREINO / TREINOS */}
                {activeTab === 'treinos' && (
                  <motion.div
                    key="treinos-screen"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="p-4 space-y-3.5"
                  >
                    {/* Header welcome same as Início */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full border border-amber-400 overflow-hidden shrink-0 bg-zinc-900 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-4 h-4 text-zinc-300">
                            <path fill="currentColor" d="M50 15c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 46c-19 0-35 11-35 24v5h70v-5c0-13-16-24-35-24z"/>
                          </svg>
                        </div>
                        <div className="text-left leading-none">
                          <p className="text-[7.5px] font-bold text-zinc-500 uppercase">Membro</p>
                          <p className="text-xs font-black font-display text-white tracking-wide italic">ATLETA</p>
                          <span className="text-[7px] font-bold font-mono text-amber-400">1 LVL</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 rounded-full flex items-center">
                          <span className="text-[8px] font-black font-display tracking-widest text-[#FFC107] italic">INVICTUS</span>
                        </div>
                      </div>
                    </div>

                    {/* OBJETIVOS Title divider */}
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-[1px] bg-zinc-800 flex-1" />
                      <span className="text-[8px] font-mono text-zinc-500 tracking-widest font-bold">OBJETIVOS</span>
                      <div className="h-[1px] bg-zinc-800 flex-1" />
                    </div>

                    <h1 className="text-3xl font-black italic tracking-tighter text-amber-400 font-display text-center leading-none">
                      MISSÕES
                    </h1>

                    {/* Slogan */}
                    <p className="text-[9px] font-bold font-mono text-center text-zinc-400 border-y border-zinc-900 py-1 uppercase tracking-wide">
                      FORJA SUA CONSISTÊNCIA. DOMINA O RANKING.
                    </p>

                    {/* Gym Context Card */}
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-left space-y-1">
                      <span className="text-[7px] font-mono text-amber-500 font-bold uppercase">SUA ACADEMIA</span>
                      <h6 className="text-xs font-bold text-white flex items-center gap-1 font-display leading-none">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" /> GYM FITNESS ACADEMIA
                      </h6>
                    </div>

                    {/* Item list */}
                    <div className="space-y-2">
                      {/* Exercise 1 */}
                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-500/15 shrink-0">
                            <Dumbbell className="w-4 h-4" />
                          </div>
                          <div className="text-left space-y-0.5 truncate">
                            <h5 className="text-[11px] font-bold text-white leading-none">TREINO</h5>
                            <p className="text-[8.5px] text-zinc-500 truncate">Musculação validada</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[8px] font-mono bg-zinc-900 text-amber-400 border border-amber-500/20 px-1 py-0.5 rounded font-black">+150 PTS</span>
                          <button className="px-2 py-1 bg-amber-400 hover:bg-amber-350 text-black text-[8.5px] font-extrabold uppercase rounded-lg font-display">
                            INICIAR ➔
                          </button>
                        </div>
                      </div>

                      {/* Exercise 2 */}
                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-2 bg-amber-400/10 text-amber-500 rounded-xl border border-amber-500/15 shrink-0">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div className="text-left space-y-0.5 truncate">
                            <h5 className="text-[11px] font-bold text-white leading-none">CARDIO</h5>
                            <p className="text-[8.5px] text-zinc-500 truncate">Corrida ou Bike GPS</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[8px] font-mono bg-zinc-900 text-amber-400 border border-amber-500/20 px-1 py-0.5 rounded font-black">+120 PTS</span>
                          <button className="px-2 py-1 bg-amber-400 hover:bg-amber-350 text-black text-[8.5px] font-extrabold uppercase rounded-lg font-display">
                            INICIAR ➔
                          </button>
                        </div>
                      </div>

                      {/* Exercise 3 */}
                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/15 shrink-0">
                            <Utensils className="w-4 h-4" />
                          </div>
                          <div className="text-left space-y-0.5 truncate">
                            <h5 className="text-[11px] font-bold text-white leading-none">SEGUIR DIETA</h5>
                            <p className="text-[8.5px] text-zinc-500 truncate">Validação IA Refeição</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[8px] font-mono bg-zinc-900 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-black uppercase">STREAK IA</span>
                          <button className="px-2 py-1 bg-blue-500 hover:bg-blue-450 text-white text-[8.5px] font-extrabold uppercase rounded-lg font-display">
                            VALIDAR ➔
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recuperação Inteligente */}
                    <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-2.5xl text-left space-y-2 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h6 className="text-[10px] font-black font-display text-white tracking-wide flex items-center gap-0.5">
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/10" /> RECUPERAÇÃO REGENERATIVA
                        </h6>
                        <span className="text-[6px] font-mono uppercase bg-zinc-800 text-zinc-400 px-1 py-0.5 font-bold rounded">DESCANSO ATIVO</span>
                      </div>
                      <p className="text-[8.5px] text-zinc-400 leading-normal font-sans">
                        Consistência também é saber descansar. Evite o burnout, blinde suas articulações e mantenha sua sequência de atividade (STREAK) intacta. Ganhe incentivos sem sobrecarregar o corpo.
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[7.5px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 font-bold rounded">
                          LIMITE SEMANAL: 0/2 UTILIZADOS
                        </span>
                        <span className="text-[7.5px] font-mono text-zinc-450 border border-zinc-90 w bg-zinc-900/50 px-1.5 py-0.5 font-bold rounded">
                          STATUS: 1 ATIVO
                        </span>
                      </div>
                      <button className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-850 text-red-400 text-[8.5px] font-extrabold uppercase rounded-lg border border-red-500/10 flex items-center justify-center gap-1 transition-colors">
                        ❤️ REGENERAR HOJE (+15 PTS)
                      </button>
                    </div>

                    {/* Transparência Total */}
                    <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-2.5xl text-left space-y-2.5">
                      <div>
                        <span className="text-[7px] font-mono text-amber-500 font-bold uppercase">TRANSPARÊNCIA TOTAL</span>
                        <h6 className="text-[9.5px] font-black font-display text-white mt-0.5 uppercase">ENTENDA COMO OS PONTOS SÃO CALCULADOS</h6>
                      </div>
                      <p className="text-[8px] text-zinc-500 leading-relaxed font-sans">
                        NOSSA PLATAFORMA PREZA PELA MERITOCRACIA. O INCENTIVO PROMOCIONAL DE CONSISTÊNCIA ESPORTIVA É DISTRIBUÍDO PROPORCIONALMENTE AO ESFORÇO FÍSICO VALIDADO.
                      </p>
                      
                      <div className="p-2 bg-zinc-900/40 rounded-xl border border-zinc-800/80 leading-normal text-[8px] text-zinc-400 space-y-0.5">
                        <p className="font-bold text-white uppercase text-[7.5px]">CAMPANHAS DE INCENTIVO</p>
                        <p className="font-sans text-zinc-500 text-[7.5px]">OS ORÇAMENTOS DE PUBLICIDADE E PATROCÍNIO SÃO DISTRIBUÍDOS PROPORCIONALMENTE ENTRE O TOP 3 ELEGÍVEL DE CADA TEMPORADA.</p>
                      </div>

                      <div className="p-2 bg-zinc-900/40 rounded-xl border border-zinc-800/80 leading-normal text-[8px] text-zinc-400 space-y-0.5">
                        <p className="font-bold text-white uppercase text-[7.5px]">✓ REGRAS DA TEMPORADA</p>
                        <p className="font-sans text-zinc-500 text-[7.5px]">INÍCIO E FIM: A TEMPORADA INICIA NO DIA 01 E AS INSCRIÇÕES FECHAM NO DIA 10.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. CLÃ ELITE E DIVISÕES / ELITE */}
                {activeTab === 'elite' && (
                  <motion.div
                    key="elite-screen"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="p-4 space-y-3.5 text-left"
                  >
                    {/* Header welcome same as Início */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full border border-amber-400 overflow-hidden shrink-0 bg-zinc-900 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-4 h-4 text-zinc-300">
                            <path fill="currentColor" d="M50 15c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 46c-19 0-35 11-35 24v5h70v-5c0-13-16-24-35-24z"/>
                          </svg>
                        </div>
                        <div className="text-left leading-none">
                          <p className="text-[7.5px] font-bold text-zinc-500 uppercase">Membro</p>
                          <p className="text-xs font-black font-display text-white tracking-wide italic">ATLETA</p>
                          <span className="text-[7px] font-bold font-mono text-amber-400">1 LVL</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 rounded-full flex items-center">
                          <span className="text-[8px] font-black font-display tracking-widest text-[#FFC107] italic">INVICTUS</span>
                        </div>
                      </div>
                    </div>

                    {/* Elite Subtabs */}
                    <div className="flex border-b border-zinc-900 text-[10px] font-bold pb-1 font-display">
                      <button className="flex-1 text-center text-[#FFC107] border-b border-[#FFC107] pb-1 text-[8.5px]">
                        EXPLORAR
                      </button>
                      <button className="flex-1 text-center text-zinc-650 cursor-not-allowed text-[8.5px]" disabled>
                        MEUS DESAFIOS
                      </button>
                      <button className="flex-1 text-center text-zinc-650 cursor-not-allowed text-[8.5px]" disabled>
                        HISTÓRICO
                      </button>
                    </div>

                    {/* Orange connect Strava alert banner */}
                    <button className="w-full bg-[#E65C00] hover:bg-[#CC5200] text-black font-black text-[9px] py-1.5 px-3 rounded-lg flex items-center justify-between font-display italic transition-colors">
                      <span>CONECTAR STRAVA ⚡</span>
                      <span>VINCULAR PONTOS ➔</span>
                    </button>

                    {/* Endeavor Certification card */}
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl relative overflow-hidden space-y-2.5 shadow-2xl">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 blur-3xl rounded-full" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[7px] font-mono tracking-widest text-zinc-500 uppercase font-bold">ENDEAVOR</p>
                          <h6 className="text-[10px] font-extrabold text-white uppercase tracking-tight leading-none font-display">
                            Certificação de performance
                          </h6>
                        </div>
                      </div>

                      {/* VALIDE bold banner inside */}
                      <div className="py-2.5 px-3 bg-zinc-900 border border-zinc-800/80 rounded-xl text-center relative overflow-hidden">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-amber-500/10 blur-xl opacity-50" />
                        <h2 className="text-3xl font-extrabold font-display tracking-tight text-white italic leading-none relative z-10">
                          VALIDE
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[7.5px] font-mono text-zinc-400">
                        <div className="space-y-0.5">
                          <p className="text-zinc-600 uppercase font-sans font-bold leading-none">PROGRAMA</p>
                          <p className="text-white font-semibold">INDIVIDUAL</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-zinc-600 uppercase font-sans font-bold leading-none">CONQUISTAS</p>
                          <p className="text-[#FFC107] font-semibold">MEDALHAS</p>
                        </div>
                      </div>
                    </div>

                    {/* Section selector */}
                    <div className="space-y-2">
                      <h4 className="text-[9px] font-semibold font-display text-white uppercase pl-0.5">Circuitos de Certificação</h4>
                      
                      <div className="flex gap-1 text-[8px] font-mono">
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 text-zinc-400 rounded-full text-[7.5px]">30 DIAS</span>
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 text-zinc-400 rounded-full text-[7.5px]">60 DIAS</span>
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 text-zinc-400 rounded-full text-[7.5px]">90 DIAS</span>
                        <span className="px-2.5 py-0.5 bg-amber-400 text-black font-extrabold rounded-full text-[7.5px]">TODOS</span>
                      </div>

                      {/* Circuits items */}
                      <div className="space-y-2 pt-1 uppercase text-[8.5px]">
                        {[
                          { name: "IGNITE", desc: "80 km • 30 dias", diff: "BAIXA", rarity: "COMUM", color: "text-zinc-300" },
                          { name: "PULSE", desc: "120 km • 30 dias", diff: "MÉDIA", rarity: "RARA", color: "text-[#FFC107]" },
                          { name: "APEX", desc: "160 km • 30 dias", diff: "ALTA", rarity: "ÉPICA", color: "text-purple-400" },
                          { name: "TITAN", desc: "220 km • 30 dias", diff: "EXTREMA", rarity: "LENDÁRIA", color: "text-red-500" },
                        ].map((circuit) => (
                          <div key={circuit.name} className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2">
                            <div className="flex justify-between items-start gap-1">
                              <div className="text-left min-w-0">
                                <h6 className="text-[10.5px] font-black font-display text-white tracking-widest">{circuit.name}</h6>
                                <p className="text-[8px] font-mono text-zinc-500 leading-none mt-0.5">{circuit.desc}</p>
                              </div>
                              <div className="text-right text-[7px] font-mono tracking-wide shrink-0 font-bold">
                                <p className="text-zinc-500 font-sans leading-none">DIFICULDADE | <span className="text-white font-black">{circuit.diff}</span></p>
                                <p className="text-zinc-500 font-sans leading-none mt-0.5">RARIDADE | <span className={`${circuit.color} font-black`}>{circuit.rarity}</span></p>
                              </div>
                            </div>
                            <button className="w-full py-1 bg-zinc-900 hover:bg-zinc-850 text-amber-400 text-[8px] font-mono font-black border border-amber-500/10 rounded-md flex items-center justify-center gap-1 transition-colors">
                              REIVINDICAR CERTIFICADO ➔
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. SUA IDENTIDADE / PERFIL */}
                {activeTab === 'perfil' && (
                  <motion.div
                    key="perfil-screen"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="p-4 space-y-3.5"
                  >
                    {/* Header same as Início */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full border border-amber-400 overflow-hidden shrink-0 bg-zinc-900 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-4 h-4 text-zinc-300">
                            <path fill="currentColor" d="M50 15c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 46c-19 0-35 11-35 24v5h70v-5c0-13-16-24-35-24z"/>
                          </svg>
                        </div>
                        <div className="text-left leading-none">
                          <p className="text-[7.5px] font-bold text-zinc-500 uppercase">Membro</p>
                          <p className="text-xs font-black font-display text-white tracking-wide italic">ATLETA</p>
                          <span className="text-[7px] font-bold font-mono text-amber-400">1 LVL</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 rounded-full flex items-center">
                          <span className="text-[8px] font-black font-display tracking-widest text-[#FFC107] italic">INVICTUS</span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Summary info */}
                    <div className="flex flex-col items-center justify-center py-2 text-center space-y-2 uppercase">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden bg-zinc-900 flex items-center justify-center relative shadow-lg">
                          <svg viewBox="0 0 100 100" className="w-6 h-6 text-amber-400">
                            <path fill="currentColor" d="M50 15c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 46c-19 0-35 11-35 24v5h70v-5c0-13-16-24-35-24z"/>
                          </svg>
                        </div>
                        <span className="absolute -top-1 -right-1 bg-black border border-amber-400 text-amber-400 text-[5px] font-bold px-1 py-0.2 rounded font-mono">
                          LVL 1
                        </span>
                        <div className="absolute -bottom-1 -left-1 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-full p-1 shadow">
                          <Camera className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      <div className="space-y-1 w-full">
                        <h4 className="font-extrabold text-[#EDEDED] text-[10.5px] font-display tracking-wide italic leading-tight">
                          ATLETA INVICTUS
                        </h4>

                        {/* Edit Buttons */}
                        <div className="flex justify-center items-center gap-1">
                          <button className="px-2.5 py-0.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-[7.5px] font-mono font-bold rounded uppercase">
                            EDITAR PERFIL
                          </button>
                          <button className="p-0.5 px-1 bg-zinc-900 hover:bg-zinc-850 text-red-400 border border-zinc-800 rounded">
                            <LogOut className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Pill status */}
                      <div className="flex justify-center gap-1 pt-1 text-[7px] font-semibold font-mono">
                        <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                          ❤️ 0
                        </span>
                        <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                          🏆 0
                        </span>
                        <span className="px-1.5 py-0.5 bg-blue-500/15 border border-blue-500/20 text-blue-400 rounded-full">
                          📍 Porto Alegre
                        </span>
                      </div>

                      <button className="text-[7.5px] text-[#FFC107] font-bold font-mono">
                        + ADICIONAR BIOGRAFIA
                      </button>
                    </div>

                    {/* Stats columns */}
                    <div className="grid grid-cols-2 gap-2 text-left uppercase">
                      <div className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl space-y-0.5">
                        <div className="flex items-center gap-1 text-[6.5px] font-mono text-zinc-500">
                          <Building2 className="w-2.5 h-2.5 text-zinc-650" />
                          <span>RANK ACADEMIA</span>
                        </div>
                        <p className="text-xs font-black text-white font-display">#-</p>
                        <p className="text-[6px] text-zinc-500 truncate">GYM FITNESS ACADEMIA</p>
                      </div>

                      <div className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl space-y-0.5">
                        <div className="flex items-center gap-1 text-[6.5px] font-mono text-zinc-500">
                          <MapPin className="w-2.5 h-2.5 text-zinc-650" />
                          <span>RANK CIDADE</span>
                        </div>
                        <p className="text-xs font-black text-white font-display">#-</p>
                        <p className="text-[6px] text-zinc-500 truncate font-sans">PORTO ALEGRE</p>
                      </div>
                    </div>

                    {/* Core Bio-Behavioral Engine Indicator */}
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl text-left space-y-1.5 relative overflow-hidden uppercase">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[7px] font-sans font-bold text-zinc-500">🛡️ MOTOR BIO-COMPORTAMENTAL</span>
                          <h6 className="text-[8px] font-black font-display text-white mt-0.5">ÍNDICE DE CONFIABILIDADE ANTI-FRAUDE</h6>
                        </div>
                        <span className="text-[6px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.5 rounded font-black shrink-0">
                          ✓ CONFIRMADO IA
                        </span>
                      </div>
                      
                      <div className="flex items-baseline gap-0.5 pt-1">
                        <span className="text-3xl font-extrabold font-display leading-none text-white italic">98</span>
                        <span className="text-[9px] text-zinc-500 font-bold font-sans">/ 100</span>
                      </div>

                      {/* Mini Telemetries */}
                      <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-zinc-900/60 text-[6px] font-mono text-zinc-500 font-bold">
                        <div>
                          <p className="font-sans text-zinc-600">GPS RULING</p>
                          <p className="text-emerald-400 mt-0.2">CONSISTENTE</p>
                        </div>
                        <div>
                          <p className="font-sans text-zinc-600">ACELERAÇÃO</p>
                          <p className="text-emerald-400 mt-0.2">HUMANOIDE</p>
                        </div>
                        <div>
                          <p className="font-sans text-zinc-600">FINGERPRINT</p>
                          <p className="text-emerald-400 mt-0.2">APROVADO</p>
                        </div>
                      </div>
                    </div>

                    {/* Streak Protection */}
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl text-left space-y-1.5 relative overflow-hidden uppercase">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[7px] font-sans font-bold text-zinc-500">🔥 PROTEÇÃO DE STREAK</span>
                          <h6 className="text-[8px] font-black font-display text-white mt-0.5">STREAK FREEZE PROTETOR CONTRA ADVERSIDADES</h6>
                        </div>
                        <span className="text-[6px] font-mono text-zinc-400 bg-zinc-905 border border-zinc-850 px-1 py-0.5 rounded font-black shrink-0">
                          SEM ESCUDO
                        </span>
                      </div>
                      
                      <div className="flex items-baseline gap-0.5 pt-1">
                        <span className="text-2xl font-extrabold font-display leading-none text-white italic">0 / 1</span>
                        <span className="text-[7px] text-zinc-500 font-bold font-sans">ATIVO</span>
                      </div>

                      <button className="w-full py-1 bg-[#E65C00]/10 hover:bg-[#E65C00]/20 text-[#FFC107] border border-[#E65C00]/20 text-[8px] font-mono font-black rounded-md transition-colors uppercase">
                        COMPRAR SHIELD (15 CRÉDITOS)
                      </button>
                    </div>

                    {/* Tabs area inside profile */}
                    <div className="space-y-3 pt-1.5 uppercase text-left">
                      <div className="flex border-b border-zinc-900 text-[9px] font-bold pb-1 font-display">
                        <span className="flex-1 text-center text-[#FFC107] border-b border-[#FFC107] pb-1">
                          CONQUISTAS
                        </span>
                        <span className="flex-1 text-center text-zinc-650">
                          TEMPORADAS
                        </span>
                        <span className="flex-1 text-center text-zinc-650">
                          ATIVIDADES
                        </span>
                      </div>

                      {/* Achievements counter empty state */}
                      <div className="flex flex-col items-center justify-center p-3 text-center space-y-1 bg-zinc-950 rounded-2xl border border-zinc-900">
                        <span className="text-xl font-black text-zinc-600 font-display">0</span>
                        <p className="text-[8px] text-zinc-400 font-bold">AINDA NÃO HÁ CONQUISTAS DESBLOQUEADAS</p>
                        <p className="text-[7px] text-zinc-600">Continue treinando para ganhar medalhas!</p>
                      </div>

                      {/* Locked achievements list */}
                      <div className="space-y-1">
                        <p className="text-[7px] font-mono text-zinc-550 font-bold pl-0.5">PRÓXIMAS CONQUISTAS COBICEIS</p>
                        {[
                          { name: "INICIANTE CONSISTENTE", d: "STREAK >= 3 DIAS" },
                          { name: "ESTILO INVICTUS", d: "STREAK >= 7 DIAS" },
                          { name: "COMPROMETIDO", d: "STREAK >= 15 DIAS" },
                        ].map((ac) => (
                          <div key={ac.name} className="p-2 bg-zinc-950/40 border border-zinc-900/60 rounded-xl flex items-center justify-between text-[7px] font-bold">
                            <span className="text-zinc-500">{ac.name}</span>
                            <span className="text-zinc-600 font-mono italic">{ac.d}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sincronização box */}
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[7.5px] text-zinc-500 font-mono tracking-wide font-bold">⚡ APPS CONECTADOS</p>
                        
                        <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <h6 className="text-[9px] font-black font-display text-white tracking-widest flex items-center gap-1">
                                STRAVA
                              </h6>
                              <p className="text-[7.5px] text-zinc-500 truncate leading-none mt-0.5">VALIDE SUAS CORRIDAS COM GPS</p>
                            </div>
                          </div>
                          
                          <button className="w-full py-1 bg-[#E65C00] hover:bg-[#CC5200] text-black text-[8px] font-black rounded font-display uppercase leading-none transition-colors">
                            CONECTAR
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom 4 Tabs Navigation Bar matching user's screen exactly */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/90 backdrop-blur-md border-t border-zinc-900/60 px-2 flex justify-between items-center z-20">
              {[
                { id: 'inicio' as MockTab, label: 'INÍCIO', icon: <CircleDot className="w-4 h-4" /> },
                { id: 'ranking' as MockTab, label: 'RANKING', icon: <Trophy className="w-4 h-4" /> },
                { id: 'treinos' as MockTab, label: 'TREINOS', icon: <Dumbbell className="w-4 h-4" /> },
                { id: 'perfil' as MockTab, label: 'PERFIL', icon: <User className="w-4 h-4" /> }
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    id={`phone-nav-${tab.id}`}
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsManual(true);
                    }}
                    className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 relative focus:outline-none cursor-pointer ${
                      isSelected ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-350'
                    }`}
                  >
                    <div className="mb-0.5">
                      {tab.icon}
                    </div>
                    <span className="text-[7.5px] font-display font-semibold tracking-wide leading-none select-none">
                      {tab.label}
                    </span>
                    {/* Tiny active notch indicator dot */}
                    {isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Simulated iPhone home swipe home button overlay */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-zinc-800 rounded-full z-30" />
          </div>
        </div>
      </div>
    </div>
  );
}
