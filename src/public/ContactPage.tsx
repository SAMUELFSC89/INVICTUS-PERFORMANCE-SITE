import { ArrowLeft, CreditCard, Crown, Mail, ShieldCheck, Trophy, UserRound } from 'lucide-react';
import { COMPANY, SUPPORT_EMAIL } from '../lib/publicLegal';
import './PublicPortal.css';
import './ContactPage.css';

const subjects = [
  {
    icon: <Trophy />,
    title: 'Campeonatos',
    text: 'Inscrição, regulamento, atividade, classificação ou premiação.',
    subject: 'Ajuda com campeonato',
  },
  {
    icon: <CreditCard />,
    title: 'Pagamentos',
    text: 'Cobrança, pagamento pendente, cancelamento ou reembolso.',
    subject: 'Ajuda com pagamento',
  },
  {
    icon: <Crown />,
    title: 'Plano PRO',
    text: 'Ativação, benefícios, renovação ou cancelamento do plano.',
    subject: 'Ajuda com o Plano PRO',
  },
  {
    icon: <UserRound />,
    title: 'Conta e aplicativo',
    text: 'Acesso, cadastro, senha, perfil, sincronização ou uso do app.',
    subject: 'Ajuda com minha conta',
  },
  {
    icon: <ShieldCheck />,
    title: 'Privacidade',
    text: 'Dados pessoais, consentimentos, correção ou exclusão de conta.',
    subject: 'Solicitação sobre privacidade',
  },
];

const mailto = (subject: string) => `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export default function ContactPage() {
  return <main className="pub-page contact-page">
    <header className="pub-header"><a href="/"><ArrowLeft size={17} /> Início</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>

    <section className="contact-hero">
      <div>
        <p className="pub-eyebrow">FALE COM A INVICTUS</p>
        <h1>COMO PODEMOS AJUDAR?</h1>
        <p>Escolha o assunto da sua dúvida para enviar uma mensagem ao canal oficial de atendimento.</p>
        <a className="contact-primary" href={`mailto:${SUPPORT_EMAIL}`}><Mail size={18} /> {SUPPORT_EMAIL}</a>
      </div>
    </section>

    <div className="contact-shell">
      <section className="contact-topics">
        <div className="contact-title"><p className="pub-eyebrow">ESCOLHA UM ASSUNTO</p><h2>Direcione sua mensagem</h2><p>Isso ajuda a identificar sua solicitação com mais rapidez.</p></div>
        <div className="contact-grid">{subjects.map(item => <a key={item.title} href={mailto(item.subject)}>
          <span className="contact-icon">{item.icon}</span>
          <div><h3>{item.title}</h3><p>{item.text}</p><b>Enviar mensagem</b></div>
        </a>)}</div>
      </section>

      <section className="contact-before">
        <div><p className="pub-eyebrow">ANTES DE ENVIAR</p><h2>Inclua estas informações</h2></div>
        <ul>
          <li>Nome e e-mail usados na conta Invictus.</li>
          <li>Campeonato ou recurso relacionado à dúvida.</li>
          <li>Uma descrição clara do que aconteceu.</li>
          <li>Comprovante ou captura de tela, quando necessário.</li>
        </ul>
      </section>

      <section className="contact-help">
        <div><h2>Talvez sua resposta já esteja disponível</h2><p>Consulte regras, planos, funcionalidades e dúvidas comuns na Central Invictus.</p></div>
        <a href="/perguntas-frequentes">Abrir Central de Ajuda</a>
      </section>

      <footer className="contact-company"><b>{COMPANY.legalName}</b><span>CNPJ {COMPANY.cnpj}</span><span>{COMPANY.address}</span></footer>
    </div>
  </main>;
}
