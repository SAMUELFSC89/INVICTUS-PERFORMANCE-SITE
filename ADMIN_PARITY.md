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

## Segurança

- Login usa o mesmo Firebase Auth do Invictus.
- A autoridade administrativa continua sendo validada no backend.
- Ações sensíveis não são liberadas apenas por UI/rota.
- Saques permanecem no motor financeiro/Asaas do backend.
- Power Lift permanece server-authoritative.
- Firestore mantém as regras atuais; dados server-only da loja e Drops passam por API.

## Ainda não remover do app

As rotas administrativas do aplicativo permanecem durante a migração. Remover somente depois de:

1. backend complementar estar em `main` e produção;
2. site admin estar em produção;
3. login administrativo validado;
4. cada módulo ser testado com dados reais;
5. faturamento ser conciliado com as fontes financeiras;
6. ações destrutivas/financeiras passarem por teste ponta a ponta;
7. então remover AdminShell/rotas administrativas do aplicativo em PR separada.

## Backoffice novo, além da paridade

A gestão completa de Campeonatos pelo site (criar/editar/publicar/encerrar, datas, preço, categorias, regulamento, inscrições, premiação e resultados) é uma expansão do backoffice e deve permanecer no site, não voltar ao app.
