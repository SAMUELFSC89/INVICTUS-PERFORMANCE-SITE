/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageType } from '../types';
import { ShieldCheck, HeartPulse, Sparkles, HelpCircle } from 'lucide-react';
import InvictusLogo from './InvictusLogo';

interface FooterProps {
  onNavigateToPage: (page: PageType) => void;
}

export default function Footer({ onNavigateToPage }: FooterProps) {
  const handleLinkClick = (page: PageType) => {
    onNavigateToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnHome = () => {
    onNavigateToPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="global-footer" className="bg-[#050505] border-t border-zinc-900 pt-20 pb-16 px-6 text-zinc-500 font-sans z-10 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1 text-left">
            <button 
              id="btn-footer-logo"
               onClick={handleReturnHome}
              className="flex items-center text-left focus:outline-none cursor-pointer group"
             >
              <InvictusLogo size={36} showText={true} />
             </button>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs antialiased">
              Desenvolvemos tecnologia desportiva de ponta para guiar sua consistência, valorizar seu suor e inspirar hábitos duradouros todos os dias.
            </p>
            <div className="flex items-center gap-3 text-zinc-400">
              <span className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <HeartPulse className="w-4 h-4 text-red-500" />
              </span>
              <span className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-red-500" />
              </span>
              <span className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <Sparkles className="w-4 h-4 text-red-500" />
              </span>
            </div>
          </div>

          {/* Column 2: Legal compliance policies */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
              Regulamentos e Termos
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <button 
                id="footer-link-terms"
                onClick={() => handleLinkClick('terms')} 
                className="hover:text-red-500 transition-colors text-left focus:outline-none cursor-pointer"
              >
                Termos de Uso
              </button>
              <button 
                id="footer-link-privacy"
                onClick={() => handleLinkClick('privacy')} 
                className="hover:text-red-500 transition-colors text-left focus:outline-none cursor-pointer"
              >
                Política de Privacidade
              </button>
              <button 
                id="footer-link-rules"
                onClick={() => handleLinkClick('rules')} 
                className="hover:text-red-500 transition-colors text-left focus:outline-none cursor-pointer"
              >
                Regras de Participação
              </button>
            </div>
          </div>

          {/* Column 3: Custom policies */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
              Políticas Internas
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <button 
                id="footer-link-rewards"
                onClick={() => handleLinkClick('rewards')} 
                className="hover:text-red-500 transition-colors text-left focus:outline-none cursor-pointer"
              >
                Política de Premiações
              </button>
              <button 
                id="footer-link-incentives"
                onClick={() => handleLinkClick('incentives')} 
                className="hover:text-red-500 transition-colors text-left focus:outline-none cursor-pointer"
              >
                Política de Incentivos e Reconhecimento
              </button>
              <button 
                id="footer-link-validation"
                onClick={() => handleLinkClick('validation')} 
                className="hover:text-red-500 transition-colors text-left focus:outline-none cursor-pointer"
              >
                Validação de Atividades
              </button>
              <button 
                id="footer-link-faq"
                onClick={() => handleLinkClick('faq')} 
                className="hover:text-red-500 transition-colors text-left focus:outline-none cursor-pointer flex items-center gap-1.5"
              >
                <span>Perguntas Frequentes (FAQ)</span>
                <HelpCircle className="w-3.5 h-3.5 text-zinc-650" />
              </button>
            </div>
          </div>

          {/* Column 4: Self service support */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
              Suporte Técnico
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <button 
                id="footer-link-support"
                onClick={() => handleLinkClick('support')} 
                className="hover:text-red-500 transition-colors text-left focus:outline-none cursor-pointer"
              >
                Contato e Suporte Oficial
              </button>
              <button 
                id="footer-link-deletion"
                onClick={() => handleLinkClick('account-deletion')} 
                className="text-red-500/80 hover:text-red-400 transition-colors text-left focus:outline-none cursor-pointer"
              >
                Exclusão de Conta Permanente
              </button>
            </div>
          </div>
        </div>

        {/* Bottom compliance and credits */}
        <div className="border-t border-zinc-950/80 pt-10 space-y-6 text-left">
          {/* Detailed Platform statement as required for Google Play & App Store Compliance */}
          <div className="bg-zinc-950/40 border border-zinc-900/30 p-6 rounded-2xl space-y-3">
            <h5 className="font-semibold text-white/95 text-xs uppercase tracking-wider">
              DECLARAÇÃO DE CONFORMIDADE COM AS DIRETRIZES DA APPLE APP STORE E GOOGLE PLAY STORE
            </h5>
            <p className="text-[10.5px] text-zinc-550 leading-relaxed antialiased">
              O aplicativo Invictus, bem como toda a infraestrutura contida nesta página de divulgação, opera estritamente como um ecossistema focado no aprimoramento de saúde, rastreio esportivo e hábitos diários sustentáveis. Sob nenhuma hipótese organizamos, promovemos, facilitamos ou aceitamos transações monetárias voltadas a apostas de cotas fixas, esquemas rápidos de remuneração financeira, cassinos eletrônicos online, sorteios patrocinados ou investimentos especulativos. A aquisição de medalhas físicas, recompensas digitais ou cupons promocionais fornecidos por parceiros é decorrência estrita de critérios meritocráticos de atividade física legitimamente comprovados pelos relógios integrados e auditorias antifraude por GPS. Todas as dinâmicas de engajamento baseiam-se em lógicas puras de gamificação saudável esportiva.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] text-zinc-600">
            <p>
              © {new Date().getFullYear()} Invictus Inc. Todos os direitos reservados. Projeto registrado na Google AI Studio.
            </p>
            <div className="flex gap-4">
              <p>Segurança Militar SSL</p>
              <p>LGPD Proteção de Dados</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
