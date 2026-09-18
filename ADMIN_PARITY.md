# Invictus Admin — paridade App → Site

Objetivo: o painel administrativo web substituir integralmente as telas administrativas atualmente existentes no aplicativo. As telas do app só devem ser removidas depois que esta lista estiver validada ponta a ponta no site.

## Rotas administrativas existentes hoje no app

| App atual | Capacidade | Site novo | Estado |
| --- | --- | --- | --- |
| `/admin` | Visão geral, usuários recentes, filas operacionais | `/admin` | Implementado |
| `/admin/flagged-activities` | Fila de exceções e revisão manual | Admin → Pendências | Implementado |
| `/admin/workouts` | Histórico canônico, filtros, busca, evidências | Admin → Atividades | Implementado |
| `/admin/security` | Antifraude, validação, alertas, logs, trace | Admin → Antifraude | Implementado |
| `/admin/payouts` | Aprovar/recusar/cancelar/processar/conciliar saques | Admin → Financeiro / Saques | Implementado |
| `/admin/gym-audit` | Auditoria geofence e correção Google Places | Admin → Academias | Implementado |
| `/admin/store/pricing` | Produtos, fornecedor, custo, preço, margem, Coins e estoque | Admin → Loja / Produtos | Implementado |
| `/admin/store/drops` | Criar/editar Drops, orçamento, estoque, exposição | Admin → Drops | Implementado |
| `/admin/store/orders` | Pedidos, preparação, rastreio, entrega, cancelamento/estorno | Admin → Pedidos | Implementado |

## Capacidades adicionais do site

- Faturamento com série mensal de 12 meses.
- Faturamento diário dos últimos 30 dias.
- Receita do mês atual e anterior e variação mensal.
- Pagamentos aprovados e ticket médio.
- Composição de receita por produto/origem disponível.
- Receita e pedidos da loja física em visão separada.
- Saques pagos e em fluxo.
- Power Lift: fila de revisão, vídeo temporário assinado, aprovação/rejeição e auditoria.
- Central forense `/admin/audit` com Validation, Integrity, Behavior, Device Fingerprint, Network, Fraud, Reputation, Trust, Risk e Explainability.
- Auditoria do IGA 2.0 com parâmetros ativos, sessões utilizadas e snapshots semanal, mensal e de temporada.
- Dry-run do IGA: comparação `persistido × esperado × diferença` sem alterar pontuação.
- Reconciliação manual de IGA separada do dry-run, com administrador, motivo/contexto, antes/depois e evidência registrados em `admin_reviews`.
- Exposição dos demais motores de pontuação: ranking da academia, campeonatos pagos, Power Lift e recompensas de atividade.
- Administração de Campeonatos em `/admin/championships`: rascunho, calendário, preço, premiação, antifraude, abertura de inscrição, publicação e snapshot imutável da edição.
- Operação dos Campeonatos em `/admin/championships/operations`: inscritos, pagamentos, conciliações, ranking, vencedores e homologação administrativa segura.

## Fonte única e sincronização

O site e o aplicativo não sincronizam dados diretamente entre si. Ambos usam a mesma identidade, backend e banco central:

`APP ⇄ backend/Firebase ⇄ SITE`

- Firebase Auth mantém a identidade única.
- Firestore/backend mantêm o estado canônico.
- Asaas/webhooks confirmam a verdade financeira.
- Security/Validation/Fraud/Score engines determinam a verdade competitiva.
- Sinais realtime do Admin atualizam o painel quando ocorrem inscrições, pagamentos, saques, atividades, revisões, Power Lift, loja, Drops e outras operações relevantes.
- Operações sensíveis continuam server-authoritative; o navegador não define pagamento, vencedor, prêmio ou score diretamente.

## Campeonatos — runtime canônico

Toda edição publicada pelo Admin precisa ser consumida pela mesma fonte runtime em inscrição, checkout, conciliação, política competitiva, scoring, ranking, progresso e settlement.

- A publicação cria um `editionId` e `publishedConfigDigest` imutáveis.
- O snapshot publicado fica travado no backend.
- Uma edição ativa não pode ser substituída silenciosamente antes da finalização.
- O orquestrador automático de settlement também usa `listRuntimeChampionships`, evitando homologar uma edição do catálogo legado por engano.
- O catálogo legado baseado em ambiente permanece apenas como fallback de compatibilidade enquanto não houver edição publicada.

## Segurança

- Login usa o mesmo Firebase Auth do Invictus.
- A autoridade administrativa continua sendo validada no backend.
- Ações sensíveis não são liberadas apenas por UI/rota.
- Saques permanecem no motor financeiro/Asaas do backend.
- Power Lift permanece server-authoritative.
- Firestore mantém as regras atuais; dados server-only da loja e Drops passam por API.
- Homologação de campeonato é ação administrativa de alto risco e gera trilha de auditoria.
- Divergência de edição/configuração, pagamento em conciliação, atividade pendente ou empate material bloqueiam a finalização competitiva.

## Ainda não remover do app

As rotas administrativas do aplicativo permanecem durante a migração. Remover somente depois de:

1. backend complementar estar em `main` e produção;
2. site admin estar em produção;
3. login administrativo validado;
4. cada módulo ser testado com dados reais;
5. faturamento ser conciliado com as fontes financeiras;
6. ações destrutivas/financeiras passarem por teste ponta a ponta;
7. publicação, inscrição, ranking e homologação de ao menos uma edição de teste passarem ponta a ponta;
8. auditoria IGA/antifraude ser validada com atividades reais;
9. então remover AdminShell/rotas administrativas do aplicativo em PR separada.

## Backoffice novo, além da paridade

A gestão completa de Campeonatos pelo site é uma expansão permanente do backoffice. Criar, editar, publicar, operar, encerrar e homologar edições, além de acompanhar inscrições, premiação, ranking e resultados, deve permanecer no site e não voltar ao aplicativo.
