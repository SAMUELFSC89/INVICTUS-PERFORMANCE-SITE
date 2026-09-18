# Finalização do site Invictus Performance

Este checklist registra o estado real da reconstrução e evita considerar o site concluído antes de todos os fluxos públicos, administrativos, visuais e de produção estarem validados.

> Atualização de 18/09/2026: por decisão de produto, os assets visuais finais ficam para a última etapa. O trabalho segue primeiro nos fluxos funcionais, integração, Admin, realtime e E2E.

## Já implementado

- Nova base visual e responsiva preto/grafite/dourado.
- Home, Campeonatos, Entre Amigos, Power Lift, Drops e Minha Conta como rotas públicas.
- Catálogo oficial de campeonatos ligado ao backend canônico do app.
- Detalhes de Cardio e Musculação ligados ao runtime publicado da edição.
- Login Firebase compartilhado entre app e site.
- Recuperação de senha por Firebase Auth no site.
- Cadastro web em duas etapas usando o mesmo Firebase Auth do app e `/api/profile?action=onboard` server-authoritative para concluir o perfil.
- CPF continua obrigatório no cadastro e com checagem de unicidade, porém a consulta/selagem Receita Federal via Serpro está temporariamente suspensa por decisão de produto e não bloqueia o onboarding do site.
- Aceite de regulamento e checkout oficial de campeonato pelo site.
- Confirmação financeira server-authoritative via Asaas/webhook.
- Minha Conta sincronizada com as inscrições reais do atleta.
- Entre Amigos comunicado e preparado no site como benefício PRO com disputa por IGA e prêmio opcional em Invictus Coins: valor por participante, pote, líder, extensão de 1 dia em empate, divisão se o empate persistir e devolução quando não houver participantes suficientes.
- O cliente web de Entre Amigos já aceita `stakeAmount` e exibe os novos campos de pote/resultado quando o backend os retorna.
- Power Lift público ligado ao motor sazonal: temporada, categorias, Power Volume, Power Points, Elite, Geral, opt-in e defesa de título; envio/homologação de marca permanece no app.
- Power Lift já é comunicado em toda a experiência pública como benefício Invictus PRO. O gate técnico definitivo fica para quando a mudança correspondente terminar no backend/app.
- Drops público substituído por catálogo oficial, saldo de Coins, pedidos reais, compra em dinheiro, desconto com Coins, resgate em Drop, endereço e geração de PIX; quando `PUBLIC_STORE_ENABLED` estiver desligado, exibe pré-lançamento em vez de catálogo fictício.
- Busca decorativa do cabeçalho removida.
- Navegação da Home força entrada nas rotas funcionais canônicas de Campeonatos, Cardio, Musculação, Entre Amigos, Power Lift, Drops, Conta e Admin, evitando as telas demonstrativas antigas internas do `RebuildApp`.
- Central Admin com visão geral, faturamento, saques, pendências, atividades, antifraude, usuários, academias, produtos, Drops, pedidos, Power Lift e configurações.
- Central forense de antifraude/IGA por atividade e por atleta.
- Administração de campeonatos: rascunho, publicação imutável, Edition ID, digest, regras, datas, preço, premiação e antifraude.
- Operação de campeonatos: resumo canônico sem limite da tabela, inscrições, ranking, conciliação, vencedores e homologação.
- O tab legado `Campeonatos` do `AdminPanel` redireciona para `/admin/championships`, eliminando o placeholder como destino operacional.
- Realtime administrativo pelo documento `system_stats/admin_realtime`, com listener no site e refresh silencioso de segurança na operação de campeonatos.
- Backend da PR #190 já emite sinais de realtime para confirmação/conciliação de campeonato, eventos financeiros Asaas, saques, loja, várias ações administrativas, revisão de atividade e Power Lift.
- CI do SITE com TypeScript + build de produção; checkpoint atual com cadastro, recuperação, Entre Amigos IGA/Coins, Power Lift PRO e roteamento canônico está verde, com preview Vercel criado.

## Divergências conhecidas entre SITE e APP durante a implementação

### Entre Amigos — contrato novo preparado, handler ativo ainda precisa convergir

A regra nova existe no repositório do APP no patch `0002-feat-challenges-add-Invictus-Coins-wagering-to-priva.patch` e é a regra de produto adotada pelo site:

- PRO;
- prêmio opcional em Invictus Coins;
- mesmo valor por participante;
- score calculado pelo IGA na janela do desafio;
- líder único leva o pote;
- empate no topo estende 1 dia uma única vez;
- empate persistente divide o pote;
- menos de 2 participantes devolve as Coins;
- settlement idempotente.

O arquivo ativo `api/_handlers/private-challenges.ts` da `main` consultada ainda corresponde ao contrato anterior sem stake/IGA. Não considerar o E2E de Entre Amigos concluído até o patch novo estar efetivamente aplicado ao handler implantado.

### Power Lift — comunicação PRO antecipada

O site já posiciona Power Lift como benefício PRO. A implementação de entitlement/gate definitivo está sendo concluída no APP/backend; por enquanto o site não adicionou um bloqueio técnico independente para não divergir da fonte canônica.

## Bloqueadores para chamar o SITE inteiro de finalizado

### 1. Realtime completo de negócio

A auditoria dos produtores confirmou cobertura para pagamentos/inscrições confirmadas, reconciliação financeira, saques, loja, ações administrativas, revisões de atividade e Power Lift.

Gaps concretos encontrados no backend de suporte da PR #190:

- `submitActivityToActiveChampionships()` grava/atualiza `championship_scores` após atividade validada, mas não publica o sinal central de realtime; o ranking pode mudar sem invalidar imediatamente o cache do site;
- a invalidação de score em `syncReviewedActivityCompetitionScores()` também deve publicar alteração competitiva quando zerar/rejeitar scores;
- `finalizePaidChampionship()` e o caminho de retomada de settlement gravam vencedores, resultados e estado `FINALIZED`, mas o serviço de settlement não publica por conta própria um sinal específico de fechamento/vencedores.

Correção prevista: publicar eventos explícitos como `CHAMPIONSHIP_SCORE_CHANGED` e `CHAMPIONSHIP_SETTLEMENT_CHANGED` no produtor server-side, mantendo a verdade de negócio nas coleções/APIs canônicas. Polling continua apenas como segurança e não substitui esses eventos.

### 2. E2E funcional com sessão real

O CI e o build de produção estão verdes e o preview Vercel é criado com sucesso. Porém o preview do SITE está protegido e não pôde ser aberto pelo navegador/fetch disponível neste ambiente com uma sessão real autenticada. Portanto não marcar como executado aquilo que ainda não foi testado interativamente.

Executar com contas de teste e dados reais controlados:

1. criar conta pelo site;
2. confirmar que o mesmo UID/perfil abre no app;
3. recuperar senha;
4. abrir uma edição pelo Admin;
5. publicar edição;
6. catálogo público atualizar;
7. aceitar regulamento;
8. gerar checkout;
9. confirmar pagamento Asaas;
10. app reconhecer a mesma inscrição;
11. registrar atividade no app;
12. score/ranking atualizar automaticamente no site;
13. forçar caso antifraude/revisão;
14. auditar atividade e atleta pelo site;
15. invalidar/aprovar e confirmar atualização imediata do ranking;
16. encerrar edição;
17. homologar e confirmar vencedores/premiação;
18. testar refund/chargeback/conciliação;
19. testar saques e loja/Drops administrativos;
20. testar catálogo/compra/resgate do Drops público com `PUBLIC_STORE_ENABLED=true`;
21. testar `PUBLIC_STORE_ENABLED=false` e confirmar ausência de produtos fictícios;
22. após convergência do handler de Entre Amigos, testar criação com e sem stake, entrada, débito de Coins, IGA, vencedor, empate, extensão, divisão e reembolso.

### 3. Conta/identidade — acabamentos

- Cadastro e recuperação já existem no SITE.
- CPF é coletado e checado quanto à unicidade, mas `verify-cpf` não é chamado enquanto Receita/Serpro estiver temporariamente suspenso.
- E-mail de verificação Invictus é disparado best-effort após onboarding; confirmação por telefone/SMS continua pertencendo à central canônica de identidade.
- Revisar o caso excepcional em que o Firebase Auth é criado e a segunda etapa encontra CPF duplicado, para evitar deixar identidade órfã sem perfil concluído.
- Checkout não deve criar atalhos que contornem validações exigidas pelo backend vigente.

### 4. Navegação/limpeza final de ações

- O tab legado de Campeonatos já redireciona para a central nova.
- A lupa decorativa foi removida.
- As rotas funcionais públicas saem da Home por navegação real.
- Falta a última varredura de dados de demonstração e ações sem handler na árvore legada do `RebuildApp`, removendo código morto onde for seguro sem alterar a Home aprovada.

### 5. Backend e produção

- PR #190 do APP contém o backend de suporte do Admin/realtime e precisa estar integrada/implantada antes da dependência definitiva do SITE.
- O motor sazonal novo do Power Lift e o entitlement PRO precisam convergir no backend implantado antes do gate técnico final no site.
- O contrato novo de Entre Amigos precisa sair do patch e estar aplicado no handler efetivamente implantado.
- Conferir variáveis Firebase públicas, proxy `/api`, domínio oficial, CORS, robots/sitemap e ambiente Asaas correto.
- Conferir `PUBLIC_STORE_ENABLED` no ambiente correto antes de liberar Drops ao público.
- SITE PR permanece draft até E2E, auditoria funcional e, por último, assets + auditoria visual final.
- Validar Vercel preview/produção após o merge.
- Só depois remover as telas administrativas do aplicativo, em PR separada.

### 6. Assets visuais finais — DEIXAR POR ÚLTIMO

Os componentes já apontam para `/public/assets/invictus`, mas os arquivos binários finais ainda não estão versionados nessa pasta. Precisam entrar os exports aprovados, sem stock e sem aproximações:

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

Depois da inclusão: conferir cada página desktop + mobile lado a lado com as referências aprovadas.

## Critério de conclusão

O site só deve ser chamado de finalizado quando:

- nenhum CTA visível estiver sem função;
- dados financeiros/competitivos vierem de fonte canônica;
- app e site convergirem automaticamente para o mesmo estado;
- produtores críticos de realtime estiverem fechados;
- Admin tiver paridade operacional validada;
- E2E financeiro, competitivo, conta e loja estiver verde;
- contrato novo de Entre Amigos e gate PRO do Power Lift estiverem implantados;
- nenhuma imagem necessária estiver ausente;
- desktop/mobile tiverem sido aprovados visualmente;
- backend e site estiverem implantados em produção.
