/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Flame, Download } from 'lucide-react';
import { PageType } from '../types';
import InvictusLogo from './InvictusLogo';

interface NavbarProps {
  onNavigateToPage: (page: PageType) => void;
  currentPage: PageType;
}

export default function Navbar({ onNavigateToPage, currentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    onNavigateToPage('home');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    onNavigateToPage('home');
    setMobileMenuOpen(false);
    
    // Allow React state change to commit before querying
    setTimeout(() => {
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
    }, 100);
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[#050505]/85 backdrop-blur-md border-zinc-900/80 py-4 shadow-lg' 
          : 'bg-transparent border-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          id="btn-nav-logo"
          onClick={handleLogoClick}
          className="flex items-center focus:outline-none cursor-pointer group"
        >
          <InvictusLogo size={36} showText={true} />
        </button>

        {/* Action Center - Desktop Links */}
        {currentPage === 'home' ? (
          <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-zinc-400">
            {[
              { label: 'Como Funciona', id: 'como-funciona' },
              { label: 'Pontuação', id: 'pontuacao' },
              { label: 'Consistência', id: 'consistencia' },
              { label: 'Rankings', id: 'rankings' },
              { label: 'Antifraude', id: 'antifraude' },
            ].map((link, idx) => (
              <button
                id={`nav-link-${link.id}`}
                key={idx}
                onClick={() => scrollToSection(link.id)}
                className="hover:text-red-500 transition-colors duration-200 focus:outline-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-zinc-400">
            <button
              id="nav-link-doc-home"
              onClick={handleLogoClick}
              className="hover:text-red-500 transition-colors duration-200 focus:outline-none cursor-pointer"
            >
              Página Inicial
            </button>
            <button
              id="nav-link-doc-faq"
              onClick={() => onNavigateToPage('faq')}
              className={`hover:text-red-500 transition-colors duration-200 focus:outline-none cursor-pointer ${currentPage === 'faq' ? 'text-red-500 font-bold' : ''}`}
            >
              Como Funciona (FAQ)
            </button>
          </div>
        )}

        {/* CTA Store Download Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="btn-nav-download"
            onClick={() => scrollToSection('download')}
            className="px-6 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-red-500 animate-bounce" />
            BAIXAR APP
          </button>
        </div>

        {/* Mobile Toggle Trigger */}
        <button
          id="btn-nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 md:hidden text-zinc-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#050505]/95 backdrop-blur-lg border-b border-zinc-900 py-6 px-6 space-y-5 animate-fade-in z-40 shadow-2xl">
          {currentPage === 'home' ? (
            <div className="flex flex-col gap-4 text-sm font-semibold tracking-wide text-zinc-300">
              {[
                { label: 'Como funciona', id: 'como-funciona' },
                { label: 'Pontuação de treino', id: 'pontuacao' },
                { label: 'Calendário de Consistência', id: 'consistencia' },
                { label: 'Rankings e Ligas', id: 'rankings' },
                { label: 'Sistema Antifraude', id: 'antifraude' },
              ].map((link, idx) => (
                <button
                  id={`nav-link-mob-${link.id}`}
                  key={idx}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left py-1 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-sm font-semibold tracking-wide text-zinc-300">
              <button
                id="nav-link-mob-home"
                onClick={handleLogoClick}
                className="text-left py-1 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
              >
                Voltar à Página Inicial
              </button>
              <button
                id="nav-link-mob-faq"
                onClick={() => {
                  onNavigateToPage('faq');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
              >
                Perguntas Frequentes (FAQ)
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-900/60 flex flex-col gap-3">
            <button
              id="btn-nav-mob-download"
              onClick={() => scrollToSection('download')}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-center text-sm flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              <Download className="w-4 h-4" />
              Baixar para Android & iOS
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
