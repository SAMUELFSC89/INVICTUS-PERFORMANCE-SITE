# Finalização do site Invictus Performance

Este checklist registra o estado real da reconstrução e evita considerar o site concluído antes de todos os fluxos públicos, administrativos, visuais e de produção estarem validados.

## Já implementado

- Nova base visual e responsiva preto/grafite/dourado.
- Home, Campeonatos, Entre Amigos, Power Lift, Drops e Minha Conta como rotas públicas.
- Catálogo oficial de campeonatos ligado ao backend canônico do app.
- Detalhes de Cardio e Musculação ligados ao runtime publicado da edição.
- Login Firebase compartilhado entre app e site.
- Aceite de regulamento e checkout oficial de campeonato pelo site.
- Confirmação financeira server-authoritative via Asaas/webhook.
- Minha Conta sincronizada com as inscrições reais do atleta.
- Central Admin com visão geral, faturamento, saques, pendências, atividades, antifraude, usuários, academias, produtos, Drops, pedidos, Power Lift e configurações.
- Central forense de antifraude/IGA por atividade e por atleta.
- Administração de campeonatos: rascunho, publicação imutável, Edition ID, digest, regras, datas, preço, premiação e antifraude.
- Operação de campeonatos: resumo canônico sem limite da tabela, inscrições, ranking, conciliação, vencedores e homologação.
- Realtime administrativo pelo documento de revisão central, com refresh silencioso de segurança na operação de campeonatos.
- CI do SITE com TypeScript + build de produção.

## Bloqueadores para chamar o SITE inteiro de finalizado

### 1. Assets visuais finais — BLOQUEADOR CRÍTICO

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

### 2. Fluxos públicos que ainda são apenas apresentação

- Entre Amigos: os CTAs ainda precisam apontar para um fluxo real (criação no site ou deep-link/conta conforme decisão de produto).
- Power Lift público: CTA de participação/regulamento precisa abrir uma ação real; a revisão administrativa já existe.
- Drops público: a página atual ainda não consome o catálogo real nem cria carrinho/pedido; os botões de compra não podem permanecer decorativos.
- Busca do cabeçalho: definir e implementar comportamento real ou remover.

### 3. Conta e aquisição de usuário

- Hoje o site aceita login da conta Firebase existente.
- Para o fluxo site-first completo, ainda precisa decidir/implementar criação de conta no site, recuperação de senha e continuidade das verificações exigidas pelo ecossistema (e-mail/telefone/CPF) sem duplicar regras do app.
- Checkout não deve criar atalhos que contornem validações de identidade exigidas pelo backend.

### 4. Realtime completo de negócio

Já existem sinais para pagamentos/inscrições, operações administrativas e vários módulos. A operação de campeonato também possui refresh silencioso de segurança.

Antes do encerramento técnico, auditar todos os produtores de eventos para garantir sinalização imediata em:

- score/ranking alterado por atividade validada automaticamente;
- score invalidado após revisão;
- inscrição criada/checkout pendente;
- pagamento confirmado, estornado, chargeback ou conciliação;
- settlement/finalização e vencedores;
- mudanças de usuário/plano relevantes ao Admin.

O polling de segurança não substitui a obrigação de fechar os produtores de eventos server-side.

### 5. Navegação/limpeza administrativa

- O atalho avançado de Campeonatos já abre a central nova, porém o tab legado `Campeonatos` dentro do `AdminPanel` ainda contém texto de placeholder. Ele deve ser removido ou redirecionar para `/admin/championships`.
- Fazer varredura final de placeholders, textos simulados e ações sem handler em toda a árvore pública/admin.

### 6. Testes ponta a ponta antes da produção

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
16. testar saques e loja/Drops administrativos.

### 7. Produção e merge

- Backend da PR do APP deve entrar em `main` e ser implantado antes do site depender das novas APIs.
- SITE PR permanece draft até assets, E2E e auditoria visual final.
- Conferir variáveis Firebase públicas, proxy `/api`, domínio oficial, CORS, robots/sitemap e ambiente Asaas correto.
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
