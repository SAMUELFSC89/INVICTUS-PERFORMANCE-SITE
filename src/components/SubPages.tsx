/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  AlertTriangle, 
  Mail, 
  Send, 
  CheckCircle, 
  Lock, 
  HelpCircle, 
  UserX,
  FileText,
  LifeBuoy
} from 'lucide-react';
import { 
  PageType, 
  FAQ_DATA, 
  TERMS_DOCUMENT, 
  PRIVACY_DOCUMENT, 
  RULES_DOCUMENT, 
  REWARDS_DOCUMENT, 
  VALIDATION_DOCUMENT,
  INCENTIVES_DOCUMENT
} from '../types';

interface SubPagesProps {
  page: PageType;
  onBack: () => void;
}

export default function SubPages({ page, onBack }: SubPagesProps) {
  // Contact and Support form states
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSubject, setSupportSubject] = useState('Dúvida Geral');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Account deletion states
  const [deletionEmail, setDeletionEmail] = useState('');
  const [deletionChecked, setDeletionChecked] = useState(false);
  const [deletionPass, setDeletionPass] = useState('');
  const [deletionSubmitted, setDeletionSubmitted] = useState(false);

  // FAQ state
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  // Helper to scroll to top when mounting
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMessage) return;
    setSupportSubmitted(true);
  };

  const handleDeletionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionEmail || !deletionChecked || !deletionPass) return;
    setDeletionSubmitted(true);
  };

  const toggleFAQ = (id: string) => {
    if (openFAQ === id) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(id);
    }
  };

  // Select document based on page
  const getDocumentData = () => {
    switch (page) {
      case 'terms': return TERMS_DOCUMENT;
      case 'privacy': return PRIVACY_DOCUMENT;
      case 'rules': return RULES_DOCUMENT;
      case 'rewards': return REWARDS_DOCUMENT;
      case 'validation': return VALIDATION_DOCUMENT;
      case 'incentives': return INCENTIVES_DOCUMENT;
      default: return null;
    }
  };

  const doc = getDocumentData();

  return (
    <div id="sub-pages-container" className="min-h-screen bg-[#050505] text-[#EDEDED] font-sans pt-24 pb-32">
      {/* Top Banner / Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <button
          id="btn-back-landing"
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para a Landing Page
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Render standard legal documents */}
        {doc && (
          <article className="space-y-10 animate-fade-in">
            <header className="border-b border-zinc-800 pb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 mb-4 text-xs font-mono text-red-500">
                <FileText className="w-3.5 h-3.5" />
                Documento Oficial de Conformidade
              </div>
              <h1 id="legal-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
                {doc.title}
              </h1>
              <p className="text-xs text-zinc-400 font-mono">
                Última atualização: {doc.lastUpdated} • ID de Emissão: INV-2026-V3
              </p>
            </header>

            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-base space-y-6">
              <p className="border-l-2 border-red-550 pl-4 py-1 italic bg-red-500/5 text-zinc-200">
                {doc.introduction}
              </p>

              <div className="space-y-8 mt-12">
                {doc.sections.map((sec, sIdx) => (
                  <section key={sIdx} className="space-y-4">
                    <h2 className="text-xl font-medium text-white border-b border-zinc-900 pb-2 mt-8">
                      {sec.title}
                    </h2>
                    {sec.content.map((pText, pIdx) => (
                      <p key={pIdx} className="text-zinc-300 antialiased leading-relaxed">
                        {pText}
                      </p>
                    ))}
                  </section>
                ))}
              </div>
            </div>

            {/* Verification assurance card */}
            <div className="mt-16 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex flex-col sm:flex-row gap-4 items-start">
              <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1 text-sm">Garantia de Transparência Invictus</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Todos os nossos termos estão estruturados de acordo com as políticas internacionais de integridade do desenvolvedor. Proibimos estritamente condutas nocivas, abusos algorítmicos ou fraudes mecânicas nos termos descritos acima. O Invictus é operado de acordo com as leis e diretrizes nacionais sem mecanismos de jogos de azar ou especulação.
                </p>
              </div>
            </div>
          </article>
        )}

        {/* Render FAQ page */}
        {page === 'faq' && (
          <div className="space-y-10">
            <header className="border-b border-zinc-800 pb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 mb-4 text-xs font-mono text-red-500">
                <HelpCircle className="w-3.5 h-3.5" />
                Dúvidas Resolvidas
              </div>
              <h1 id="faq-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
                Perguntas Frequentes (FAQ)
              </h1>
              <p className="text-sm text-zinc-400">
                Todas as respostas sobre a plataforma, recompensas saudáveis e integridade de treinos do Invictus.
              </p>
            </header>

            <div className="space-y-4 mt-8">
              {FAQ_DATA.map((item) => {
                const isOpen = openFAQ === item.id;
                return (
                  <div 
                    key={item.id} 
                    className="border border-zinc-800 bg-[#0A0A0A] rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-red-500/55 transition-all duration-300"
                  >
                    <button
                      id={`faq-btn-${item.id}`}
                      onClick={() => toggleFAQ(item.id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-900/50 transition-colors focus:outline-none"
                    >
                      <span className="font-medium text-white text-base sm:text-lg pr-4">{item.question}</span>
                      <span className={`text-zinc-500 transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-red-550' : ''}`}>
                        ▼
                      </span>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 border-t border-zinc-800/80 p-6 bg-zinc-900/10' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed antialiased">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Render Account Deletion page */}
        {page === 'account-deletion' && (
          <div className="space-y-10">
            <header className="border-b border-zinc-850 pb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/20 rounded-full border border-red-900/35 mb-4 text-xs font-mono text-red-400">
                <UserX className="w-3.5 h-3.5" />
                Segurança do Usuário • Opção de Autosserviço
              </div>
              <h1 id="deletion-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
                Solicitação de Exclusão de Conta
              </h1>
              <p className="text-sm text-zinc-400">
                Respeitamos a privacidade e soberania de seus dados pessoais. Solicite a exclusão de sua conta de forma direta.
              </p>
            </header>

            {!deletionSubmitted ? (
              <form id="account-deletion-form" onSubmit={handleDeletionSubmit} className="space-y-8 mt-6">
                {/* Warning Notification Block */}
                <div className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6 text-zinc-300 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    ATENÇÃO: Ação irreversível
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-400 leading-relaxed">
                    <li>Seu perfil público, sequência de dias (streaks) e reputação esportiva nos rankings serão apagados permanentemente.</li>
                    <li>Sua integração ativa com relógios Garmin, Strava e Apple Health será revogada por completo.</li>
                    <li>O histórico total de treinos, cardios validados administrativamente e conquistas digitais serão destruídos definitivamente de nossos storages.</li>
                  </ul>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="del-email" className="block text-sm font-semibold text-zinc-300">
                    E-mail Cadastrado na Plataforma
                  </label>
                  <input
                    id="del-email"
                    type="email"
                    required
                    value={deletionEmail}
                    onChange={(e) => setDeletionEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm"
                  />
                </div>

                {/* Password confirmation for security auth */}
                <div className="space-y-2">
                  <label htmlFor="del-pass" className="block text-sm font-semibold text-zinc-300">
                    Senha de Segurança
                  </label>
                  <input
                    id="del-pass"
                    type="password"
                    required
                    value={deletionPass}
                    onChange={(e) => setDeletionPass(e.target.value)}
                    placeholder="Digite sua senha cadastrada"
                    className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm"
                  />
                </div>

                {/* Mandatory compliance checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    id="del-check"
                    type="checkbox"
                    required
                    checked={deletionChecked}
                    onChange={(e) => setDeletionChecked(e.target.checked)}
                    className="w-5 h-5 accent-red-500 rounded border-zinc-800 bg-[#0A0A0A] cursor-pointer mt-0.5"
                  />
                  <label htmlFor="del-check" className="text-xs text-zinc-400 leading-relaxed select-none cursor-pointer">
                    Estou ciente de que todos os meus dados esportivos coletados sob termos legais e integrados de biometria serão excluídos em até 30 dias de nossos servidores secundários e cópias de segurança.
                  </label>
                </div>

                {/* Button container */}
                <button
                  id="btn-confirm-deletion"
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  Excluir Permanentemente Minha Conta
                </button>
              </form>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-semibold text-white">Solicitação de Exclusão Registrada</h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                  Um e-mail de confirmação foi encaminhado ao endereço <strong className="text-[#EDEDED]">{deletionEmail}</strong>. Por motivos de segurança cibernética e soberania de dados, a exclusão definitiva ocorrerá após a expiração do prazo de arrependimento regulamentar de 15 dias.
                </p>
                <div className="pt-4">
                  <button
                    id="btn-return-deletion"
                    onClick={onBack}
                    className="px-6 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-xl text-sm text-zinc-300 transition-colors cursor-pointer"
                  >
                    Voltar para o Início
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Render Contact and Support page */}
        {page === 'support' && (
          <div className="space-y-10">
            <header className="border-b border-zinc-800 pb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 mb-4 text-xs font-mono text-red-500">
                <LifeBuoy className="w-3.5 h-3.5" />
                Suporte de Alta Performance
              </div>
              <h1 id="support-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
                Contato e Suporte Oficial
              </h1>
              <p className="text-sm text-zinc-400">
                Tem dúvidas sobre validação, integração de dispositivos ou sincronização de treinos? Nossa equipe especializada está aqui para ajudar.
              </p>
            </header>

            {!supportSubmitted ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form column */}
                <form id="support-contact-form" onSubmit={handleSupportSubmit} className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="sup-name" className="block text-sm font-semibold text-zinc-300">
                        Nome Completo
                      </label>
                      <input
                        id="sup-name"
                        type="text"
                        required
                        value={supportName}
                        onChange={(e) => setSupportName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-550 focus:ring-1 focus:ring-red-550 transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="sup-email" className="block text-sm font-semibold text-zinc-350">
                        E-mail de Contato
                      </label>
                      <input
                        id="sup-email"
                        type="email"
                        required
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="voce@exemplo.com"
                        className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-550 focus:ring-1 focus:ring-red-550 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="sup-subject" className="block text-sm font-semibold text-zinc-300">
                      Assunto Principal
                    </label>
                    <select
                      id="sup-subject"
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-red-550 focus:ring-1 focus:ring-red-550 transition-colors text-sm"
                    >
                      <option value="Dúvida Geral">Dúvida Geral</option>
                      <option value="Falha de Integração">Falha de Integração (Garmin/Strava/Apple)</option>
                      <option value="Validação de Atividade">Validação de Presença ou Erro Antifraude</option>
                      <option value="Ligas ou Rankings">Discrepância em Classificação ou Ranking</option>
                      <option value="Suporte de Conta">Problema no Cadastro ou Senha</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="sup-message" className="block text-sm font-semibold text-zinc-300">
                      Mensagem
                    </label>
                    <textarea
                      id="sup-message"
                      required
                      rows={5}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Descreva detalhadamente sua solicitação para agilizar o atendimento..."
                      className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-550 focus:ring-1 focus:ring-red-550 transition-colors text-sm resize-none"
                    />
                  </div>

                  <button
                    id="btn-send-support"
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer focus:outline-none"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Canal de Suporte
                  </button>
                </form>

                {/* Details column */}
                <div className="space-y-6">
                  <div className="border border-zinc-800 rounded-2xl p-6 bg-[#0A0A0A] space-y-4">
                    <h3 className="font-semibold text-white text-base">Canais Diretos</h3>
                    <div className="space-y-3 text-xs text-zinc-400">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-red-500" />
                        <span>suporte@invictusapp.com.br</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-red-500" />
                        <span>Segurança da Informação ativa</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-zinc-800 rounded-2xl p-6 bg-[#0A0A0A] space-y-3">
                    <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Horário de Operação</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Segunda a Sexta-feira: 08:00 às 18:00 BRT.<br />
                      Sábados e Feriados de Atletismo: Regime de Plantão para conferência de pontuações de liga.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6">
                <CheckCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h3 className="text-2xl font-semibold text-white">Solicitação Recebida com Sucesso!</h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                  Obrigado pelo seu contato, <strong className="text-white">{supportName}</strong>! Um protocolo de ticket oficial foi aberto. Nossa equipe de auditores técnicos responderá ao seu endereço <strong className="text-white">{supportEmail}</strong> em até 4 horas úteis.
                </p>
                <div className="pt-4">
                  <button
                    id="btn-return-support"
                    onClick={onBack}
                    className="px-6 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-xl text-sm text-zinc-300 transition-colors cursor-pointer"
                  >
                    Voltar para o Início
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
