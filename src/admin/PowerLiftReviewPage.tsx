import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Dumbbell, ExternalLink, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { adminRequest } from '../lib/adminApi';
import './AdminPanel.css';

type RecordRow = {
  id: string;
  userId: string;
  userName?: string;
  exercise?: string;
  weight?: number;
  videoStatus?: string;
  confidence?: number;
  motives?: string[];
  userMessage?: string;
  createdAt?: string;
};

export default function PowerLiftReviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [status, setStatus] = useState<'manual_review'|'approved'|'rejected'>('manual_review');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setReady(true); }), []);

  const load = async () => {
    if (!auth.currentUser) return;
    setBusy(true); setMessage('');
    try {
      const result = await adminRequest<any>('list-powerlift-reviews', { query: { status, limit: 100 } });
      setRecords(result.records || []);
    } catch (err: any) {
      setMessage(err?.message || 'Falha ao carregar revisões Power Lift.');
    } finally { setBusy(false); }
  };

  useEffect(() => { if (user) void load(); }, [user, status]);

  const openVideo = async (recordId: string) => {
    setBusy(true); setMessage('');
    try {
      const result = await adminRequest<any>('get-powerlift-review-video', { query: { recordId } });
      if (!result.url) throw new Error('O backend não retornou o vídeo seguro.');
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } catch (err: any) { setMessage(err?.message || 'Não foi possível abrir o vídeo.'); }
    finally { setBusy(false); }
  };

  const decide = async (record: RecordRow, decision: 'approved'|'rejected') => {
    const note = window.prompt(decision === 'approved' ? 'Observação da aprovação (opcional):' : 'Informe o motivo da rejeição:') || '';
    if (decision === 'rejected' && !note.trim()) return;
    if (!window.confirm(`${decision === 'approved' ? 'APROVAR' : 'REJEITAR'} ${record.exercise || 'levantamento'} de ${record.weight || 0} kg de ${record.userName || record.userId}?`)) return;
    setBusy(true); setMessage('');
    try {
      const result = await adminRequest<any>('review-powerlift-record', { method: 'POST', body: { recordId: record.id, decision, note } });
      setMessage(result.message || 'Revisão concluída.');
      await load();
    } catch (err: any) { setMessage(err?.message || 'Não foi possível concluir a revisão.'); }
    finally { setBusy(false); }
  };

  if (!ready) return <div className="adm-loading">Carregando revisão Power Lift...</div>;
  if (!user) {
    window.location.replace('/admin');
    return <div className="adm-loading">Redirecionando para o login administrativo...</div>;
  }

  return <main className="adm-content" style={{minHeight:'100vh',background:'#060606',color:'#f5f1e8',padding:'24px'}}>
    <div className="adm-topbar">
      <div><p className="adm-kicker">INVICTUS POWER LIFT</p><h1>Revisão de levantamentos</h1></div>
      <div style={{display:'flex',gap:8}}><button className="adm-secondary" onClick={() => window.location.assign('/admin')}><ArrowLeft size={16}/>Painel</button><button className="adm-refresh" disabled={busy} onClick={() => void load()}><RefreshCw size={16}/>Atualizar</button></div>
    </div>

    {message && <div className="adm-feedback success"><span><ShieldCheck size={17}/>{message}</span><button onClick={() => setMessage('')}><XCircle size={16}/></button></div>}

    <section className="adm-card" style={{marginTop:18}}>
      <div className="adm-toolbar" style={{justifyContent:'space-between'}}>
        <div><small className="adm-kicker">AUDITORIA MANUAL</small><h2 style={{margin:'5px 0 0'}}>Fila Power Lift</h2></div>
        <select value={status} onChange={e => setStatus(e.target.value as any)}><option value="manual_review">Aguardando revisão</option><option value="approved">Aprovados</option><option value="rejected">Rejeitados</option></select>
      </div>
      <div className="adm-table-wrap"><table><thead><tr><th>Atleta</th><th>Exercício</th><th>Carga</th><th>Confiança</th><th>Análise</th><th>Vídeo</th><th>Decisão</th></tr></thead><tbody>{records.map(record => <tr key={record.id}><td><b>{record.userName || 'Atleta'}</b><small>{record.userId}</small></td><td>{record.exercise || '—'}</td><td><b>{Number(record.weight || 0).toLocaleString('pt-BR')} kg</b></td><td>{Math.round(Number(record.confidence || 0))}%</td><td><small>{record.userMessage || (record.motives || []).join(' · ') || 'Sem observação automática.'}</small></td><td><button className="adm-secondary" onClick={() => void openVideo(record.id)}><ExternalLink size={14}/>Abrir vídeo</button></td><td>{record.videoStatus === 'manual_review' ? <div className="adm-actions"><button onClick={() => void decide(record,'approved')}><CheckCircle2 size={13}/>Aprovar</button><button className="danger" onClick={() => void decide(record,'rejected')}><XCircle size={13}/>Rejeitar</button></div> : <span className={`adm-status ${record.videoStatus}`}>{String(record.videoStatus || '').toUpperCase()}</span>}</td></tr>)}</tbody></table></div>
      {!records.length && <div className="adm-empty"><Dumbbell size={22}/><p>Nenhum levantamento encontrado neste status.</p></div>}
    </section>
  </main>;
}
