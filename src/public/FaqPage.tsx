import { ArrowLeft, HelpCircle, Mail } from 'lucide-react';
import { SUPPORT_EMAIL } from '../lib/publicLegal';
import './AccountPortalEnhancements.css';
import './PublicPortal.css';

type Item = { q: string; a: string };
type Group = { id: string; title: string; items: Item[] };

const groups: Group[] = [
  {
    id: 'campeonatos',
    title: 'Campeonatos',
    items: [
      { q: 'Como funcionam os Campeonatos Invictus?', a: 'São competições oficiais de Cardio e Musculação, organizadas em edições com calendário, taxa, regulamento e premiação publicados antes da inscrição. A inscrição e o pagamento acontecem aqui pelo site; as atividades da edição são registradas e validadas pelo aplicativo Invictus.' },
      { q: 'Como uma atividade é validada dentro de uma edição?', a: 'Cada edição publica seu próprio perfil de regras: duração mínima e máxima da atividade, modalidades aceitas e, quando indicado, exigência de GPS contínuo ou comprovação de presença. Atividades fora desses critérios, ou sinalizadas por revisão de integridade, podem ser desconsideradas do ranking oficial.' },
      { q: 'Depois de me inscrever, o que eu faço?', a: 'Assim que a inscrição é confirmada, baixe o aplicativo Invictus e entre com a mesma conta usada no site. É pelo app que você registra suas atividades, acompanha sua posição e a homologação dos resultados da edição.' },
      { q: 'Preciso do Invictus PRO para participar dos Campeonatos?', a: 'Não. Os Campeonatos Invictus são abertos a qualquer atleta com conta ativa. O Invictus PRO é exigido apenas para benefícios específicos, como Entre Amigos e Power Lift.' },
      { q: 'Como funcionam cancelamento e reembolso de uma inscrição?', a: 'Cancelamentos e reembolsos seguem a legislação aplicável, o regulamento da edição e o estágio em que a competição se encontra. Reembolso ou chargeback confirmado pode cancelar a inscrição e retirar a elegibilidade competitiva daquela edição. Os detalhes completos estão nos Termos de Uso.' },
      { q: 'Existe alguma idade mínima para participar?', a: 'Sim. O Invictus é destinado a pessoas com 18 anos ou mais, que devem usar dados próprios e corretos e manter uma única conta pessoal.' },
    ],
  },
  {
    id: 'iga',
    title: 'Entre Amigos e o IGA',
    items: [
      { q: 'O que é Entre Amigos?', a: 'Um benefício exclusivo do Invictus PRO para criar um desafio privado, convidar amigos por código e disputar a classificação pelo IGA dentro da janela do próprio desafio. A criação, o convite e o acompanhamento em tempo real acontecem no aplicativo.' },
      { q: 'O que é o IGA e como ele é calculado?', a: 'O IGA (Índice Global de Atividade) combina três fatores das suas atividades sincronizadas: consistência semanal de treinos, qualidade da duração de cada sessão e intensidade medida por frequência cardíaca. O cálculo é automático a partir dos dados do app — não existe pontuação manual nem edição de placar.' },
      { q: 'Como funciona o prêmio em Invictus Coins no Entre Amigos?', a: 'O prêmio é opcional e definido pelo grupo na criação do desafio. Ele é pago em Invictus Coins, a recompensa interna do ecossistema: as Coins não têm valor em dinheiro, não são vendidas e não podem ser sacadas via PIX.' },
      { q: 'O que acontece em caso de empate?', a: 'Um empate no topo da classificação estende o desafio por 1 dia, uma única vez, para desempatar. Se o empate persistir após essa extensão, ele é resolvido conforme o regulamento vigente do recurso no aplicativo.' },
    ],
  },
  {
    id: 'power-lift',
    title: 'Power Lift',
    items: [
      { q: 'Como funciona a temporada do Power Lift?', a: 'O Power Lift roda em temporadas oficiais de 30 dias. Dentro de cada temporada, você registra marcas em três modalidades — Supino, Agachamento Livre e Levantamento Terra — e evolui de categoria em cada uma delas de forma independente.' },
      { q: 'Como uma marca é homologada?', a: 'Você grava um vídeo contínuo mostrando os pesos utilizados e a execução completa do movimento. O vídeo é analisado antes de contar no ranking e, quando necessário, passa por uma revisão adicional da equipe Invictus. Só marcas aprovadas contam.' },
      { q: 'Como funcionam as categorias, de Ferro a Diamante?', a: 'Cada modalidade evolui por seis categorias — Ferro, Bronze, Prata, Ouro, Platina e Diamante — com base na carga homologada. Uma marca aprovada avança no máximo uma categoria por vez em relação à sua categoria atual naquela modalidade, mesmo que o resultado seja alto o bastante para pular mais faixas.' },
      { q: 'O que são o Ranking Elite e o Ranking Geral?', a: 'Chegar a Diamante em uma modalidade libera o Ranking Elite daquela modalidade. Chegar a Diamante nas três modalidades dentro da mesma temporada — o chamado Triplo Diamante — libera o Ranking Geral da sua categoria (masculina ou feminina).' },
      { q: 'Quantas marcas eu posso enviar por dia?', a: 'O envio oficial é de um vídeo por modalidade por dia. Uma carga homologada maior substitui a marca anterior daquela modalidade assim que aprovada.' },
      { q: 'Como funcionam as recompensas em Coins no Power Lift?', a: 'Cada categoria conquistada paga Invictus Coins uma única vez por modalidade e por temporada. Além disso, o pódio de cada modalidade e o prêmio Master de quem fica em 1º no Ranking Geral são pagos em Coins após o fechamento da temporada.' },
    ],
  },
  {
    id: 'coins',
    title: 'Drops e Invictus Coins',
    items: [
      { q: 'O que são os Drops?', a: 'Lançamentos limitados de produtos e recompensas do universo Invictus, com estoque próprio e reservado por janela — quando esgota, só retorna na próxima janela de lançamento.' },
      { q: 'O que são as Invictus Coins?', a: 'Uma recompensa interna do ecossistema Invictus, ganha em recursos elegíveis do app. Coins não são moeda, dinheiro eletrônico ou investimento: não têm valor em dinheiro, não são vendidas e não podem ser sacadas via PIX, transferidas ou convertidas em dinheiro.' },
      { q: 'Onde eu vejo o catálogo e faço o resgate?', a: 'O catálogo completo, a compra e o resgate com Coins acontecem dentro do aplicativo Invictus, na sua conta.' },
      { q: 'Invictus Coins são a mesma coisa que o prêmio em dinheiro dos campeonatos pagos?', a: 'Não. São dois saldos completamente separados. Invictus Coins não têm valor em dinheiro e só servem para resgates na Loja. Já a premiação de um campeonato pago é dinheiro real (R$), publicada no regulamento da edição e paga aos colocados após a homologação — um saldo nunca vira o outro.' },
    ],
  },
  {
    id: 'planos',
    title: 'Treino inteligente e assinatura',
    items: [
      { q: 'Como o Invictus monta meu treino de musculação?', a: 'Todo atleta recebe um plano gerado por um motor de prescrição próprio, com exercícios do catálogo oficial Invictus, a partir do seu objetivo, experiência, tempo disponível e equipamento. É a base do plano em qualquer assinatura, Free ou PRO.' },
      { q: 'Qual a diferença entre o treino Free e o treino PRO?', a: 'No PRO, o mesmo plano passa por uma camada adicional de inteligência artificial, que pode ajustar exercícios, séries e repetições dentro do catálogo oficial e de limites seguros, com justificativa explicada. Se a IA estiver indisponível, seu treino do dia continua vindo do motor de prescrição automaticamente — você nunca fica sem plano.' },
      { q: 'O Invictus usa minha idade, peso ou sexo para definir a carga inicial?', a: 'Não. Nenhum plano, Free ou PRO, usa esses dados para definir carga inicial. O Invictus não é um dispositivo médico, não diagnostica lesões e não substitui avaliação de médico, nutricionista ou profissional de educação física.' },
      { q: 'O Invictus se conecta com Apple Health, Google Health Connect ou Strava?', a: 'Sim. Você pode sincronizar essas fontes para enriquecer suas métricas de atividade. A Jornada Cardio usa esses dados para propor metas semanais que se adaptam ao seu progresso, diretamente no aplicativo.' },
      { q: 'Onde eu conheço e ativo o Invictus PRO?', a: 'Você conhece os benefícios do PRO pelo site e inicia pela sua conta Invictus. Antes de confirmar, a tela de contratação informa o preço, o período, a renovação e o meio de pagamento disponível. O acesso é liberado para a mesma conta usada no site e no aplicativo.' },
      { q: 'Como funciona o cancelamento do PRO?', a: 'O cancelamento deve ser feito pelo mesmo canal em que a assinatura foi contratada. Ao cancelar a renovação, os benefícios permanecem ativos até o fim do período já pago. A sua conta e o histórico de atividades não são excluídos.' },
    ],
  },
  {
    id: 'integridade',
    title: 'Integridade e antifraude',
    items: [
      { q: 'O Invictus verifica se as atividades são reais?', a: 'Sim. Atividades e vídeos passam por verificações de consistência e, quando necessário, por revisão da equipe Invictus. Isso protege a igualdade entre os participantes dos Campeonatos e do Power Lift.' },
      { q: 'O que acontece se uma atividade for sinalizada?', a: 'Atividades sinalizadas por inconsistência podem ser colocadas em revisão, ter a pontuação corrigida ou ser desconsideradas do ranking quando faltarem dados obrigatórios ou houver evidência de manipulação, conforme os Termos de Uso.' },
      { q: 'Por que algumas verificações de segurança não são divulgadas em detalhes?', a: 'Para proteger os rankings e as premiações contra tentativas de manipulação. As regras que o atleta precisa cumprir são sempre informadas; apenas os mecanismos de proteção contra fraude permanecem reservados.' },
    ],
  },
  {
    id: 'aplicativo',
    title: 'Conta e aplicativo',
    items: [
      { q: 'Onde eu baixo o aplicativo Invictus?', a: 'Os links oficiais de download aparecem na sua Central de Conta e nas páginas de Entre Amigos, Power Lift e Drops assim que o Invictus estiver disponível nas lojas.' },
      { q: 'Como eu excluo minha conta?', a: 'Acesse Minha Conta e utilize a opção de exclusão de conta, disponível em /conta/excluir. O processo e seus efeitos estão detalhados na própria tela de solicitação.' },
      { q: 'Como falo com o suporte Invictus?', a: `Escreva para ${SUPPORT_EMAIL}. Esse é o canal oficial para dúvidas sobre sua conta, inscrições, pagamentos e privacidade.` },
    ],
  },
];

export default function FaqPage() {
  return <main className="pub-page faq-public-page">
    <header className="pub-header"><a href="/"><ArrowLeft size={17} /> Início</a><a href="/" className="pub-logo">INVICTUS <span>PERFORMANCE</span></a><a href="/conta">Minha conta</a></header>
    <section className="legal-public-hero"><div><HelpCircle /><p className="pub-eyebrow">CENTRAL INVICTUS</p><h1>Encontre sua resposta</h1><p>Tudo o que você precisa saber antes de se inscrever, assinar o PRO ou começar a treinar: regras, pagamentos, aplicativo, campeonatos e funcionalidades.</p></div></section>
    <div className="legal-public-shell">
      <nav className="faq-index" aria-label="Tópicos da Central Invictus">{groups.map(group=><a key={group.id} href={`#${group.id}`}>{group.title}</a>)}</nav>
      {groups.map(group => <section id={group.id} className="pub-card faq-group" key={group.title}>
        <p className="pub-eyebrow">{group.title.toUpperCase()}</p>
        {group.items.map(item => <details key={item.q}><summary><HelpCircle size={15} />{item.q}</summary><p>{item.a}</p></details>)}
      </section>)}
      <section id="contato" className="pub-card faq-contact"><Mail size={20} /><div><b>Não encontrou o que precisava?</b><span>Fale com a gente em <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</span></div></section>
    </div>
  </main>;
}
