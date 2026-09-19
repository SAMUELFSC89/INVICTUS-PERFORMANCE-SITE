import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import { LEGAL_PRIVACY_POLICY, LEGAL_TERMS_OF_USE } from '../lib/publicLegal';
import './AccountPortalEnhancements.css';

export default function LegalPage({kind}:{kind:'terms'|'privacy'}){
  const isPrivacy=kind==='privacy';
  const title=isPrivacy?'Política de Privacidade':'Termos de Uso';
  const text=isPrivacy?LEGAL_PRIVACY_POLICY:LEGAL_TERMS_OF_USE;
  return <main className="pub-page legal-public-page">
    <header className="pub-header"><a href="/conta"><ArrowLeft size={17}/> Minha conta</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><span/></header>
    <section className="legal-public-hero"><div>{isPrivacy?<ShieldCheck/>:<FileText/>}<p className="pub-eyebrow">INVICTUS PERFORMANCE</p><h1>{title}</h1><p>Documento vigente aplicável ao site, aplicativo e serviços digitais Invictus.</p></div></section>
    <div className="legal-public-shell"><article className="legal-public-document">{text.split('\n').map((line,index)=>line.trim()===''?<br key={index}/>:<p key={index}>{line}</p>)}</article></div>
  </main>;
}
