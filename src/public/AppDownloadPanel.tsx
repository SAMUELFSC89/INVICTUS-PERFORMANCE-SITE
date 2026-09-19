import './AccountPortalEnhancements.css';

const appStoreUrl = String(import.meta.env.VITE_APP_STORE_URL || '').trim();
const googlePlayUrl = String(import.meta.env.VITE_GOOGLE_PLAY_URL || '').trim();

function AppleMark(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.1 12.4c0-2.5 2.1-3.7 2.2-3.8a4.7 4.7 0 0 0-3.7-2c-1.6-.2-3.1.9-3.9.9-.8 0-2-1-3.3-.9a5 5 0 0 0-4.2 2.6c-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.1-2.5 1-1.5 1.5-3 1.5-3.1-.1 0-3-.9-3.1-3.9ZM14.6 5c.7-.9 1.2-2.1 1.1-3.3-1.1 0-2.4.7-3.2 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.6 3.2-1.5Z"/></svg>}
function PlayMark(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.8 2.7c-.5.3-.8.8-.8 1.5v15.6c0 .6.3 1.2.8 1.5L13 12 3.8 2.7Zm10.4 10.5-2.2 2.2 6.7 3.8c.5.3 1.1.2 1.5-.1.4-.3.8-.8.8-1.3 0-.5-.3-1-.8-1.3l-6-3.3Zm0-2.4 6-3.3c.5-.3.8-.8.8-1.3 0-.5-.3-1-.8-1.3-.4-.3-1-.4-1.5-.1L12 8.6l2.2 2.2ZM10.7 9.3 4.6 3.1 17.7 10l-7 3.9 0-4.6Z"/></svg>}

function StoreButton({kind,url}:{kind:'apple'|'google';url:string}){
  const content=<>{kind==='apple'?<AppleMark/>:<PlayMark/>}<span><small>{url?'BAIXAR NA':'EM BREVE NA'}</small><b>{kind==='apple'?'App Store':'Google Play'}</b></span></>;
  return url
    ? <a className="app-store-button" href={url} target="_blank" rel="noreferrer">{content}</a>
    : <span className="app-store-button is-disabled" aria-disabled="true">{content}</span>;
}

export default function AppDownloadPanel({compact=false}:{compact?:boolean}){
  return <section className={`app-download-panel${compact?' is-compact':''}`} id="aplicativo">
    <div><p className="pub-eyebrow">APLICATIVO INVICTUS</p><h2>Continue sua jornada no app</h2><p>Quando o Invictus estiver disponível nas lojas, os botões abaixo levarão você direto para o download oficial.</p></div>
    <div className="app-store-buttons"><StoreButton kind="apple" url={appStoreUrl}/><StoreButton kind="google" url={googlePlayUrl}/></div>
  </section>;
}
