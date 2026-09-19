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
- Entre Amigos está materializado no APP/backend como recurso PRO com IGA canônico na janela do desafio e aposta opcional em Invictus Coins.
- Criação/entrada com stake em Coins usa débito transacional; o pote é server-authoritative e dinheiro real permanece aposentado para desafios novos.
- Entre Amigos resolve vencedor pelo IGA tanto com stake quanto sem stake; empate no topo estende exatamente 1 dia uma vez, empate persistente divide o pote e menos de 2 participantes reembolsa Coins.
- Settlement de Entre Amigos é idempotente e possui testes de débito, saldo insuficiente, payout, extensão, divisão, reembolso e não duplicação.
- Ranking ativo de Entre Amigos calcula IGA somente para desafios que o usuário pode visualizar e limita a janela ativa ao instante atual, evitando calcular período futuro ou desafios privados de terceiros.
- Portal web de Entre Amigos cria/entra com stake opcional, exibe pote, resultado e classificação real por IGA com atividades válidas e destaque do próprio usuário.
- Power Lift público ligado ao motor sazonal e comunicado como benefício PRO; gate técnico definitivo aguarda conclusão da mudança correspondente no APP/backend.
- Drops público usa catálogo oficial, Coins, pedidos, PIX e resgate; sem catálogo fictício quando `PUBLIC_STORE_ENABLED=false`.
- Drops público escuta realtime e atualiza pedido aberto quando pagamento/status muda.
- Home não contém mais as páginas-demo antigas do `RebuildApp`; todos os CTAs navegam para páginas canônicas.
- Dados demonstrativos antigos de campeonatos/rankings/datas foram removidos do bundle da Home.
- Central Admin, auditoria antifraude/IGA, administração e operação de campeonatos estão conectadas às APIs canônicas.
- O placeholder legado de Campeonatos no `AdminPanel` foi removido; qualquer acesso residual aponta explicitamente para `/admin/championships`.
- Realtime administrativo usa `system_stats/admin_realtime` e o site recarrega módulos relevantes por revisão/evento.
- Backend da PR #190 publica realtime para: inscrição pendente, pagamento confirmado/conciliação, score/ranking automático, invalidação após revisão, settlement, saques, loja, revisões administrativas e Power Lift.
- Teste de contrato `admin-realtime-producers-contract.test.ts` impede regressão da cobertura de inscrição/score/settlement.
- SITE CI executa TypeScript + build + smoke de produção.
- Smoke de produção valida 16 rotas, shell React, bundles JS/CSS, contratos de fonte e ausência de dados-demo antigos na Home.
- A falha inicial do smoke foi identificada como falso negativo do harness: o teste concluía `Smoke OK`, encerrava o Vite intencionalmente com SIGTERM e tratava o código 143 como erro. O harness foi corrigido.
- SITE CI #163 passou TypeScript, build e smoke no head limpo após a remoção do placeholder administrativo.
- APP CI #1472 passou TypeScript, validação das regras Firebase, todos os testes unitários, build web/ESM e compilação do Android debug APK no head `6b38414` da PR #190.
- Preview Vercel do mesmo head está `READY`.

## Divergências conhecidas entre SITE e APP durante a implementação

### Entre Amigos — contrato materializado; implantação da PR #190 ainda necessária

O patch histórico `0002-feat-challenges-add-Invictus-Coins-wagering-to-priva.patch` foi usado apenas como fonte da regra aprovada. O contrato já foi materializado no runtime da branch `feat/site-admin-powerlift-20260918`, com ajustes adicionais de segurança/transação e ranking live:

- exclusivo PRO;
- aposta opcional em Invictus Coins;
- mesmo valor por participante;
- débito atômico no wallet ao criar/entrar;
- score calculado pelo IGA canônico na janela do desafio;
- ranking ativo por IGA até o instante atual;
- nenhum cálculo live de IGA para desafio privado de terceiro;
- líder único leva o pote;
- empate no topo estende 1 dia uma única vez;
- empate persistente divide o pote;
- menos de 2 participantes devolve as Coins;
- settlement idempotente;
- caminho sem stake também resolve vencedor por IGA;
- dinheiro real legado continua apenas como histórico e não é reativado.

O CI final da PR #190 está verde. Falta integrar/implantar essa PR antes de considerar o E2E live de Entre Amigos concluído.

### Power Lift — comunicação PRO antecipada

O site já posiciona Power Lift como benefício PRO. A implementação de entitlement/gate definitivo está sendo concluída no APP/backend; o site não cria um bloqueio técnico independente para não divergir da fonte canônica.

## Bloqueadores restantes para chamar o SITE inteiro de finalizado

### 1. E2E live com sessão real e dados controlados

A camada automatizada de rotas/build está verde e o preview do backend da PR #190 está `READY`. Foram tentados tanto o fetch autenticado da integração Vercel quanto um link compartilhado em navegador real; em ambos os casos a camada SSO da Vercel interceptou a requisição antes do backend, inclusive em `/api/championships`. Portanto isso é um bloqueio de acesso ao preview, não uma falha da API Invictus, e não deve ser marcado como E2E aprovado nem como erro do backend.

Executar com sessão Vercel autorizada ou após a implantação em ambiente acessível, usando contas de teste e dados controlados:

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
18. após implantação da PR #190, testar Entre Amigos ponta a ponta: criação com/sem stake, entrada, débito, ranking IGA live, vencedor, empate, extensão, divisão e reembolso.

### 2. Power Lift — gate PRO definitivo

Concluir o entitlement PRO no backend/app e depois alinhar o gate do site à mesma fonte canônica. A comunicação pública já está pronta.

### 3. Backend e produção

- Integrar e implantar a PR #190 antes de o SITE depender definitivamente dos novos produtores realtime/APIs administrativas e do contrato materializado de Entre Amigos.
- Concluir o gate PRO do Power Lift.
- Conferir Firebase público, proxy `/api`, CORS, domínio oficial, robots/sitemap e ambiente Asaas.
- Conferir `PUBLIC_STORE_ENABLED` no ambiente correto.
- SITE PR permanece draft até E2E live, auditoria funcional e assets/auditoria visual final.
- Só depois remover as telas administrativas do aplicativo, em PR separada.

### 4. Assets visuais finais — DEIXAR POR ÚLTIMO

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
- contrato novo de Entre Amigos estiver implantado e gate PRO do Power Lift estiver concluído;
- nenhuma imagem necessária estiver ausente;
- desktop/mobile tiverem sido aprovados visualmente;
- backend e site estiverem implantados em produção.
