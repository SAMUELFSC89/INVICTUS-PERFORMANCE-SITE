# Invictus Performance Site

Reconstrução total do site oficial a partir das referências aprovadas em setembro de 2026.

## Experiência pública
- Home
- Campeonatos
- Campeonato de Cardio
- Entre Amigos
- Power Lift
- Drops
- Minha Conta

## Administração
`/admin` é uma ferramenta operacional privada, não uma peça de marketing. Usa a mesma autenticação Firebase do ecossistema Invictus e chama o backend administrativo existente por `/api/admin`.

Módulos já conectados na nova base: visão geral, saques/Asaas, fila anti-fraude, usuários e papéis, Drops/itens da loja, logs e parâmetros de economia/premiação.

Power Lift e gestão completa de campeonatos permanecem preparados na interface, mas ações que alteram dados sensíveis só serão ligadas quando houver endpoints administrativos dedicados e auditados no backend — nunca por escrita insegura direta do navegador.

## Assets
Assets aprovados ficam em `public/assets/invictus/`. A regra é não substituir arte aprovada por stock ou aproximação silenciosa. Marca em roupas, produtos e equipamentos deve manter a identidade Invictus aprovada.
