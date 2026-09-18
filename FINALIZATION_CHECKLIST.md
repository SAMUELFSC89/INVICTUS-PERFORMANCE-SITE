# Finalização do site Invictus Performance

Este checklist registra o estado real da reconstrução e evita considerar o site concluído antes de todos os fluxos públicos, administrativos, visuais e de produção estarem validados.

> Atualização de 18/09/2026: por decisão de produto, os assets visuais finais ficam para a última etapa. O trabalho segue primeiro nos fluxos funcionais, integração, Admin, realtime e E2E.

## Já implementado

- Nova base visual e responsiva preto/grafite/dourado.
- Home, Campeonatos, Entre Amigos, Power Lift, Drops e Minha Conta como rotas públicas.
- Catálogo oficial de campeonatos ligado ao backend canônico do app.
- Detalhes de Cardio e Musculação ligados ao runtime publicado da edição.
- Login Firebase compartilhado entre app e site.
- Aceite de regulamento e checkout oficial de campeonato pelo site.
- Confirmação financeira server-authoritative via Asaas/webhook.
- Minha Conta sincronizada com as inscrições reais do atleta.
- Entre Amigos público ligado ao runtime real de Desafios Privados: login compartilhado, gate PRO, listar, criar e entrar por código, sem taxa separada e sem prêmio em dinheiro.
- Power Lift público ligado ao motor sazonal: temporada, categorias, Power Volume, Power Points, Elite, Geral, opt-in e defesa de título; envio/homologação de marca permanece no app.
- Drops público substituído por catálogo oficial, saldo de Coins, pedidos reais, compra em dinheiro, desconto com Coins, resgate em Drop, endereço e geração de PIX; quando `PUBLIC_STORE_ENABLED` estiver desligado, exibe pré-lançamento em vez de catálogo fictício.
- Busca decorativa do cabeçalho removida.
- Navegação da Home para Entre Amigos, Power Lift e Drops força entrada nas rotas funcionais reais, evitando as telas antigas do `RebuildApp`.
- Central Admin com visão geral, faturamento, saques, pendências, atividades, antifraude, usuários, academias, produtos, Drops, pedidos, Power Lift e configurações.
- Central forense de antifraude/IGA por atividade e por atleta.
- Administração de campeonatos: rascunho, publicação imutável, Edition ID, digest, regras, datas, preço, premiação e antifraude.
- Operação de campeonatos: resumo canônico sem limite da tabela, inscrições, ranking, conciliação, vencedores e homologação.
- O tab legado `Campeonatos` do `AdminPanel` agora redireciona para `/admin/championships`, eliminando o placeholder como destino operacional.
- Realtime administrativo pelo documento de revisão central, com refresh silencioso de segurança na operação de campeonatos.
- CI do SITE com TypeScript + build de produção; último checkpoint funcional passou verde após Entre Amigos + Power Lift + Drops + navegação + limpeza Admin.

## Bloqueadores para chamar o SITE inteiro de finalizado

### 1. Assets visuais finais — BLOQUEADOR CRÍTICO, DEIXAR POR ÚLTIMO

Os componentes já apontam para `/public/assets/invictus`, mas os arquivos binários finais ainda não estão versionados nessa pasta. Precisam entrar os exports aprovados, sem stock e sem aproximações:

- `home-hero.webp`
- `championships-hero.webp`
- `cardio-hero.webp`
- `friends-hero.webp`
- `powerlift-hero.webp`
- `drops-hero.webp`
- `account-hero.webp`
- cards específicos de campeonatos
- produtos individuais do Drops quando a vitrine pública usar imagens por produto
- logos/marks oficiais Invictus usados pela interface

Depois da inclusão: conferir cada página desktop + mobile lado a lado com as referências aprovadas.

### 2. Conta e aquisição de usuário

- Hoje o site aceita login da conta Firebase existente e sincroniza o mesmo perfil/inscrições.
- O fluxo canônico do app para cadastro já foi identificado: Firebase Auth → checagem autenticada de CPF duplicado → `/api/profile?action=onboard` → central `/api/identity-verification`.
- A central canônica já suporta e-mail Invictus, telefone por SMS/Firebase Auth e CPF validado na Receita Federal via Serpro, sem depender de flags locais do site.
- Ainda falta concluir a gravação do cadastro web e recuperação de senha no SITE sem criar um caminho mais fraco do que o app. A tentativa de escrever diretamente um fluxo que manipula CPF/credenciais foi bloqueada pelo conector; não substituir por bypass.
- Checkout não deve criar atalhos que contornem validações de identidade exigidas pelo backend.

### 3. Realtime completo de negócio

Já existem sinais para pagamentos/inscrições, operações administrativas e vários módulos. A operação de campeonato também possui refresh silencioso de segurança.

Antes do encerramento técnico, auditar todos os produtores de eventos para garantir sinalização imediata em:

- score/ranking alterado por atividade validada automaticamente;
- score invalidado após revisão;
- inscrição criada/checkout pendente;
- pagamento confirmado, estornado, chargeback ou conciliação;
- settlement/finalização e vencedores;
- mudanças de usuário/plano relevantes ao Admin.

O polling de segurança não substitui a obrigação de fechar os produtores de eventos server-side.

### 4. Navegação/limpeza administrativa

- O tab legado de Campeonatos já redireciona para a central nova.
- Falta a varredura final completa por textos simulados, dados de demonstração e ações sem handler em toda a árvore pública/admin, separando placeholders legítimos de campos de formulário de placeholders funcionais indevidos.

### 5. Testes ponta a ponta antes da produção

Executar com contas de teste e dados reais controlados:

1. criar/usar conta;
2. abrir uma edição pelo Admin;
3. publicar edição;
4. catálogo público atualizar;
5. aceitar regulamento;
6. gerar checkout;
7. confirmar pagamento Asaas;
8. app reconhecer a mesma inscrição;
9. registrar atividade no app;
10. score/ranking atualizar no site;
11. forçar caso antifraude/revisão;
12. auditar atividade e atleta pelo site;
13. encerrar edição;
14. homologar e confirmar vencedores/premiação;
15. testar refund/chargeback/conciliação;
16. testar saques e loja/Drops administrativos;
17. testar catálogo/compra/resgate do Drops público com `PUBLIC_STORE_ENABLED=true`;
18. testar `PUBLIC_STORE_ENABLED=false` e confirmar ausência de produtos fictícios.

### 6. Produção e merge

- Backend da PR do APP deve entrar em `main` e ser implantado antes do site depender das novas APIs do Power Lift sazonal.
- SITE PR permanece draft até E2E, auditoria funcional e, por último, assets + auditoria visual final.
- Conferir variáveis Firebase públicas, proxy `/api`, domínio oficial, CORS, robots/sitemap e ambiente Asaas correto.
- Conferir `PUBLIC_STORE_ENABLED` no ambiente correto antes de liberar Drops ao público.
- Validar Vercel preview/produção após o merge.
- Só depois remover as telas administrativas do aplicativo, em PR separada.

## Critério de conclusão

O site só deve ser chamado de finalizado quando:

- nenhuma imagem necessária estiver ausente;
- nenhum CTA visível estiver sem função;
- dados financeiros/competitivos vierem de fonte canônica;
- app e site convergirem automaticamente para o mesmo estado;
- Admin tiver paridade operacional validada;
- E2E financeiro e competitivo estiver verde;
- desktop/mobile tiverem sido aprovados visualmente;
- backend e site estiverem implantados em produção.
