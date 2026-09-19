import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, CreditCard, RefreshCw, ShoppingBag, TrendingDown, TrendingUp, Trophy, UserCheck, WalletCards } from 'lucide-react';
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { secureAppRequest } from '../lib/secureAppApi';
import { db } from '../lib/firebaseClient';
import { hasActiveProEntitlement } from '../lib/proEntitlement';

type FeedbackSetter = (message: { type: 'success' | 'error'; text: string } | null) => void;
type Point = { key: string; label: string; revenue: number; payments: number };
type FinancialOverview = {
  grossRevenue: number;
  approvedPayments: number;
  averageTicket: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  monthOverMonthPercent: number | null;
  championships: { revenue: number; registrations: number };
  store: { revenue: number; orders: number };
  payouts: { paidAmount: number; paidCount: number; inFlowCount: number };
  monthly: Point[];
  daily: Point[];
  byCategory: Array<{ category: string; revenue: number; payments: number }>;
  generatedAt: string;
};

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function FinanceOverviewPanel({ setFeedback }: { setFeedback: FeedbackSetter }) {
  const [data, setData] = useState<FinancialOverview | null>(null);
  const [activePro, setActivePro] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'monthly' | 'daily'>('monthly');
  const refreshTimer = useRef<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setFeedback(null);
    try {
      const [result, proResult] = await Promise.allSettled([
        secureAppRequest<FinancialOverview & { success?: boolean }>('/api/admin-financial-overview'),
        getDocs(query(collection(db, 'users'), where('subscriptionTier', 'in', ['performance', 'pro']))),
      ]);
      if (result.status === 'rejected') throw result.reason;
      setData(result.value);
      if (proResult.status === 'fulfilled') {
        setActivePro(proResult.value.docs.filter(document => hasActiveProEntitlement(document.data())).length);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Não foi possível carregar o faturamento.' });
    } finally { setLoading(false); }
  }, [setFeedback]);
  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    let firstPaymentSnapshot = true;
    let firstUserSnapshot = true;
    const scheduleReload = () => {
      if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
      refreshTimer.current = window.setTimeout(() => void load(), 350);
    };

    const unsubscribePayments = onSnapshot(
      query(collection(db, 'payment_orders'), orderBy('updatedAt', 'desc'), limit(1)),
      () => {
        if (firstPaymentSnapshot) { firstPaymentSnapshot = false; return; }
        scheduleReload();
      },
      () => undefined,
    );
    const unsubscribeUsers = onSnapshot(
      query(collection(db, 'users'), where('subscriptionTier', 'in', ['performance', 'pro'])),
      snapshot => {
        setActivePro(snapshot.docs.filter(document => hasActiveProEntitlement(document.data())).length);
        if (firstUserSnapshot) { firstUserSnapshot = false; return; }
        scheduleReload();
      },
      () => undefined,
    );

    return () => {
      unsubscribePayments();
      unsubscribeUsers();
      if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
    };
  }, [load]);

  const points = mode === 'monthly' ? data?.monthly || [] : data?.daily || [];
  const max = useMemo(() => Math.max(1, ...points.map(point => point.revenue)), [points]);
  const maxCategory = useMemo(() => Math.max(1, ...(data?.byCategory || []).map(item => item.revenue)), [data]);
  const growth = data?.monthOverMonthPercent;

  return <>
    <div className="adm-finance-hero">
      <div><p className="adm-kicker">FINANÇAS DA PLATAFORMA</p><h2>Faturamento e fluxo financeiro</h2><p>Assinaturas/pagamentos aprovados, inscrições pagas em campeonatos, loja física e saques em uma única central. O gráfico principal usa fontes com confirmação financeira canônica; a loja física aparece separada enquanto o modelo não possui um único timestamp imutável de liquidação.</p></div>
      <button className="adm-refresh" onClick={() => void load()} disabled={loading}><RefreshCw size={15}/>{loading ? 'Atualizando...' : 'Atualizar'}</button>
    </div>
    <div className="adm-metrics adm-metrics-seven">
      <FinanceMetric label="Receita confirmada 12 meses" value={money(data?.grossRevenue)} icon={<BarChart3/>}/>
      <FinanceMetric label="Receita este mês" value={money(data?.currentMonthRevenue)} icon={growth !== null && growth !== undefined && growth < 0 ? <TrendingDown/> : <TrendingUp/>} sub={growth === null || growth === undefined ? 'Sem base anterior' : `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% vs. mês anterior`}/>
      <FinanceMetric label="Ticket médio" value={money(data?.averageTicket)} icon={<CreditCard/>} sub={`${Number(data?.approvedPayments || 0).toLocaleString('pt-BR')} cobranças confirmadas`}/>
      <FinanceMetric label="PRO ativos" value={activePro.toLocaleString('pt-BR')} icon={<UserCheck/>} sub="Política canônica de entitlement"/>
      <FinanceMetric label="Campeonatos" value={money(data?.championships?.revenue)} icon={<Trophy/>} sub={`${Number(data?.championships?.registrations || 0).toLocaleString('pt-BR')} inscrições pagas`}/>
      <FinanceMetric label="Loja física" value={money(data?.store?.revenue)} icon={<ShoppingBag/>} sub={`${Number(data?.store?.orders || 0).toLocaleString('pt-BR')} pedidos faturados`}/>
      <FinanceMetric label="Saques pagos" value={money(data?.payouts?.paidAmount)} icon={<WalletCards/>} sub={`${Number(data?.payouts?.paidCount || 0).toLocaleString('pt-BR')} pagos · ${Number(data?.payouts?.inFlowCount || 0).toLocaleString('pt-BR')} em fluxo`}/>
    </div>

    <section className="adm-card">
      <div className="adm-card-title"><div><small>RECEITA CONFIRMADA</small><h2>Evolução do faturamento</h2></div><div className="adm-pills"><button className={mode==='monthly'?'active':''} onClick={()=>setMode('monthly')}>12 meses</button><button className={mode==='daily'?'active':''} onClick={()=>setMode('daily')}>30 dias</button></div></div>
      {loading ? <div className="adm-empty">Carregando faturamento...</div> : <div className={`adm-bars-chart ${mode}`} aria-label="Gráfico de faturamento">{points.map(point => <div className="adm-bar-column" key={point.key} title={`${point.label}: ${money(point.revenue)} · ${point.payments} pagamento(s)`}><div className="adm-bar-track"><i style={{height:`${Math.max(2,(point.revenue/max)*100)}%`}}/></div><b>{point.label}</b>{mode==='monthly'&&<small>{money(point.revenue)}</small>}</div>)}</div>}
    </section>

    <div className="adm-two-col">
      <section className="adm-card"><div className="adm-card-title"><div><small>COMPOSIÇÃO</small><h2>Receita por produto/origem</h2></div></div>{data?.byCategory?.length ? <div className="adm-category-bars">{data.byCategory.map(item => <div key={item.category}><header><b>{item.category}</b><span>{money(item.revenue)} · {item.payments} pgto.</span></header><div><i style={{width:`${Math.max(2,(item.revenue/maxCategory)*100)}%`}}/></div></div>)}</div> : <div className="adm-empty">Sem categorias financeiras no período.</div>}</section>
      <section className="adm-card"><div className="adm-card-title"><div><small>RESUMO</small><h2>Leitura operacional</h2></div></div><div className="adm-finance-summary"><p><span>Receita do mês anterior</span><b>{money(data?.previousMonthRevenue)}</b></p><p><span>Cobranças confirmadas</span><b>{Number(data?.approvedPayments||0).toLocaleString('pt-BR')}</b></p><p><span>PRO ativos</span><b>{activePro.toLocaleString('pt-BR')}</b></p><p><span>Inscrições de campeonatos</span><b>{Number(data?.championships?.registrations||0).toLocaleString('pt-BR')}</b></p><p><span>Saques em processamento</span><b>{Number(data?.payouts?.inFlowCount||0).toLocaleString('pt-BR')}</b></p><p><span>Última atualização</span><b>{data?.generatedAt ? new Date(data.generatedAt).toLocaleString('pt-BR') : '—'}</b></p></div></section>
    </div>
  </>;
}

function FinanceMetric({label,value,icon,sub}:{label:string;value:string;icon:React.ReactNode;sub?:string}){
  return <article className="adm-metric adm-finance-metric"><div className="adm-finance-icon">{icon}</div><small>{label}</small><strong>{value}</strong>{sub&&<span>{sub}</span>}</article>;
}
