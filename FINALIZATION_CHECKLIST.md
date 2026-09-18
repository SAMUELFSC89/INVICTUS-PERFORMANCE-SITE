# Finalização do site Invictus Performance

Este checklist registra o estado real da reconstrução e evita considerar o site concluído antes de todos os fluxos públicos, administrativos, visuais e de produção estarem validados.

> Atualização de 18/09/2026: por decisão de produto, os assets visuais finais ficam para a última etapa. O trabalho segue primeiro nos fluxos funcionais, integração, Admin, realtime e E2E.

## Já implementado e validado

- Nova base visual e responsiva preto/grafite/dourado.
- Home, Campeonatos, Entre Amigos, Power Lift, Drops e Minha Conta como rotas públicas canônicas.
- Catálogo oficial de campeonatos ligado ao backend canônico do app.
- Detalhes de Cardio e Musculação ligados ao runtime publicado da edição.
- Login Firebase compartilhado entre app e site.
- Recuperação de senha por Firebase Auth no site.
- Cadastro web em duas etapas usando o mesmo Firebase Auth do app e `/api/profile?action=onboard` server-authoritative.
- CPF continua obrigatório e com checagem de unicidade, mas Receita/Serpro está temporariamente suspenso por decisão de produto e não bloqueia onboarding.
- Caso de CPF duplicado após criação do Auth protegido: somente o UID recém-criado por aquele fluxo pode ser excluído, evitando identidade órfã sem risco para conta existente.
- Aceite de regulamento e checkout oficial de campeonato pelo site.
- Confirmação financeira server-authoritative via Asaas/webhook.
- Minha Conta sincronizada com inscrições reais do atleta.
- Entre Amigos comunicado e preparado no site como PRO + IGA + prêmio opcional em Invictus Coins.
- Cliente web de Entre Amigos aceita `stakeAmount` e exibe pote/resultado quando o backend retorna esses campos.
- Power Lift público ligado ao motor sazonal e comunicado como benefício PRO; gate técnico definitivo aguarda conclusão da mudança correspondente no APP/backend.
- Drops público usa catálogo oficial, Coins, pedidos, PIX e resgate; sem catálogo fictício quando `PUBLIC_STORE_ENABLED=false`.
- Drops público escuta realtime e atualiza pedido aberto quando pagamento/status muda.
- Home não contém mais as páginas-demo antigas do `RebuildApp`; todos os CTAs navegam para páginas canônicas.
- Dados demonstrativos antigos de campeonatos/rankings/datas foram removidos do bundle da Home.
- Central Admin, auditoria antifraude/IGA, administração e operação de campeonatos estão conectadas às APIs canônicas.
- Realtime administrativo usa `system_stats/admin_realtime` e o site recarrega módulos relevantes por revisão/evento.
- Backend da PR #190 agora publica realtime para: inscrição pendente, pagamento confirmado/conciliação, score/ranking automático, invalidação após revisão, settlement, saques, loja, revisões administrativas e Power Lift.
- Teste de contrato `admin-realtime-producers-contract.test.ts` impede regressão da cobertura de inscrição/score/settlement.
- PR #190 passou TypeScript, Firebase Rules, unit tests, build web e Android debug APK no workflow #1446.
- SITE CI executa TypeScript + build + smoke de produção.
- Smoke de produção valida 16 rotas, shell React, bundles JS/CSS, contratos de fonte e ausência de dados-demo antigos na Home.
- A falha inicial do smoke foi identificada como falso negativo do harness: o teste concluía `Smoke OK`, encerrava o Vite intencionalmente com SIGTERM e tratava o código 143 como erro. O harness foi corrigido e o workflow atual está verde.

## Divergências conhecidas entre SITE e APP durante a implementação

### Entre Amigos — implementação existe como patch, mas ainda não está materializada no handler ativo

A regra nova está integralmente versionada no repositório do APP em `0002-feat-challenges-add-Invictus-Coins-wagering-to-priva.patch` e corresponde ao produto aprovado:

- exclusivo PRO;
- aposta opcional em Invictus Coins;
- mesmo valor por participante;
- débito atômico no wallet ao criar/entrar;
- score calculado pelo IGA canônico na janela do desafio;
- líder único leva o pote;
- empate no topo estende 1 dia uma única vez;
- empate persistente divide o pote;
- menos de 2 participantes devolve as Coins;
- settlement idempotente;
- testes próprios de débito, saldo insuficiente, payout, extensão, divisão e não duplicação.

A conferência de 18/09/2026 mostrou que `api/_handlers/private-challenges.ts` tanto na `main` quanto na branch `feat/site-admin-powerlift-20260918` ainda contém o contrato anterior sem stake/IGA. Portanto o patch está versionado, mas ainda não foi aplicado ao código executável. Não considerar o E2E de Entre Amigos concluído até essa materialização passar CI e estar implantada.

### Power Lift — comunicação PRO antecipada

O site já posiciona Power Lift como benefício PRO. A implementação de entitlement/gate definitivo está sendo concluída no APP/backend; o site não cria um bloqueio técnico independente para não divergir da fonte canônica.

## Bloqueadores restantes para chamar o SITE inteiro de finalizado

### 1. E2E live com sessão real e dados controlados

A camada automatizada de rotas/build está verde. O preview do backend da PR #190 também está `READY`, porém protegido pelo SSO da Vercel. Falta executar a camada live autenticada sem confundir proteção do preview com erro de API.

Executar com contas de teste e dados controlados:

1. criar conta pelo site;
2. confirmar o mesmo UID/perfil no app;
3. recuperar senha;
4. abrir e publicar edição pelo Admin;
5. confirmar atualização do catálogo público;
6. aceitar regulamento;
7. gerar checkout;
8. confirmar pagamento Asaas em ambiente de teste/controlado;
9. confirmar a mesma inscrição no app e no site;
10. registrar atividade no app;
11. confirmar score/ranking realtime no site;
12. forçar revisão antifraude;
13. aprovar/rejeitar e confirmar invalidação/atualização realtime;
14. homologar edição e conferir vencedores/premiação;
15. testar refund/chargeback/conciliação;
16. testar saques e loja/Drops administrativos;
17. testar `PUBLIC_STORE_ENABLED=true` e `false`;
18. após materializar o patch de Entre Amigos, testar criação com/sem stake, entrada, débito, IGA, vencedor, empate, extensão, divisão e reembolso.

### 2. Entre Amigos — aplicar o patch já aprovado

Materializar o patch versionado no handler/IGA/wallet/tipos/testes, resolver eventuais conflitos com o código mais novo e passar o CI completo. Só então o contrato servido pelo APP estará igual à comunicação do SITE.

### 3. Power Lift — gate PRO definitivo

Concluir o entitlement PRO no backend/app e depois alinhar o gate do site à mesma fonte canônica. A comunicação pública já está pronta.

### 4. Backend e produção

- Integrar e implantar a PR #190 antes de o SITE depender definitivamente dos novos produtores realtime/APIs administrativas.
- Materializar e implantar o contrato novo de Entre Amigos.
- Concluir o gate PRO do Power Lift.
- Conferir Firebase público, proxy `/api`, CORS, domínio oficial, robots/sitemap e ambiente Asaas.
- Conferir `PUBLIC_STORE_ENABLED` no ambiente correto.
- SITE PR permanece draft até E2E live, auditoria funcional e assets/auditoria visual final.
- Só depois remover as telas administrativas do aplicativo, em PR separada.

### 5. Assets visuais finais — DEIXAR POR ÚLTIMO

Os componentes apontam para `/public/assets/invictus`, mas os binários finais ainda precisam entrar com os exports aprovados, sem stock e sem aproximações:

- `home-hero.webp`
- `championships-hero.webp`
- `cardio-hero.webp`
- `friends-hero.webp`
- `powerlift-hero.webp`
- `drops-hero.webp`
- `account-hero.webp`
- cards específicos de campeonatos;
- produtos individuais do Drops quando necessário;
- logos/marks oficiais Invictus usados pela interface.

Depois da inclusão: conferir desktop + mobile lado a lado com as referências aprovadas.

## Critério de conclusão

O site só deve ser chamado de finalizado quando:

- nenhum CTA visível estiver sem função;
- dados financeiros/competitivos vierem de fonte canônica;
- app e site convergirem automaticamente para o mesmo estado;
- produtores críticos de realtime estiverem implantados;
- Admin tiver paridade operacional validada;
- E2E financeiro, competitivo, conta e loja estiver verde;
- contrato novo de Entre Amigos e gate PRO do Power Lift estiverem implantados;
- nenhuma imagem necessária estiver ausente;
- desktop/mobile tiverem sido aprovados visualmente;
- backend e site estiverem implantados em produção.
