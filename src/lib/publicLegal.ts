import type { Championship } from './championshipApi';

export const TERMS_VERSION = '5.0.0';
export const PRIVACY_POLICY_VERSION = '5.0.0';
export const COMPETITIVE_HR_ACKNOWLEDGEMENT_VERSION = 'competitive-hr-v2-zone2-fallback';
export const SUPPORT_EMAIL = 'contato@invictusperformance.app.br';
export const COMPANY = {
  legalName: 'INVICTUS PERFORMANCE E SOLUÇÕES LTDA.',
  cnpj: '67.770.822/0001-22',
  address: 'Rua Primeiro de Setembro, nº 70, Sala 301, Porto Alegre/RS',
} as const;

const HEADER = `Última atualização: 11 de setembro de 2026 | Versão: ${TERMS_VERSION}`;

export const LEGAL_TERMS_OF_USE = `TERMOS DE USO DA PLATAFORMA INVICTUS

${HEADER}

1. QUEM SOMOS E OBJETO
A plataforma INVICTUS é mantida por INVICTUS PERFORMANCE E SOLUÇÕES LTDA., CNPJ 67.770.822/0001-22, com sede na Rua Primeiro de Setembro, nº 70, Sala 301, Porto Alegre/RS. Estes Termos regulam o aplicativo, o site e os serviços digitais associados.

2. ELEGIBILIDADE E CONTA
O serviço é destinado a pessoas com 18 anos ou mais. O usuário deve fornecer dados próprios, corretos e atualizados, proteger suas credenciais e manter uma única conta pessoal. É proibido compartilhar conta, usar identidade de terceiros, automatizar ações ou manipular rankings, recompensas e limites.

3. NATUREZA DO SERVIÇO E SAÚDE
O INVICTUS oferece planejamento e registro de treinos, métricas de desempenho e saúde, rankings, desafios, campeonatos, recursos de inteligência artificial e loja de produtos físicos. Não é dispositivo médico, não diagnostica doenças, não prescreve tratamento e não substitui médico, nutricionista ou profissional de educação física. O usuário deve interromper a atividade diante de sinal de risco e buscar atendimento adequado.

4. TREINOS E INTELIGÊNCIA ARTIFICIAL
Planos e sugestões automáticas são orientações gerais baseadas nos dados disponíveis e podem conter limitações. O usuário deve adaptar exercícios à própria condição, ambiente e equipamentos. Conteúdo enviado deve ser lícito, próprio ou usado com autorização.

5. IGA, RANKINGS E CONQUISTAS
O IGA representa consistência e desempenho a partir de atividades elegíveis. A mesma regra-base vale para usuários Free e Pro; assinatura não compra pontos ou vantagem. Atividades podem ficar em análise, ser parcialmente consideradas ou ser desconsideradas por falta de dado obrigatório, duplicidade ou risco de manipulação. Ranking não garante prêmio ou renda.

6. DESAFIOS E POWER LIFT
Desafios concedem reconhecimento, XP, conquistas e, quando indicado, Invictus Coins. No Power Lift, o vídeo deve ser próprio, contínuo e compatível com a regra da modalidade. A análise pode aprovar, reprovar ou encaminhar para revisão; peso sem evidência suficiente não é homologado.

7. CAMPEONATOS
As modalidades elegíveis são musculação e cardio. Durante participação ativa em campeonato que exija comprovação presencial, o check-in poderá ser obrigatório para que a atividade seja competitivamente elegível; essa exigência deve ser informada antes do início do treino.

Os campeonatos pagos de musculação e cardio ficam disponíveis para inscrição quando há uma edição publicada com organizador, datas, preço, critérios, premiação e regulamento específico aprovados. A inscrição exige aceite separado desse regulamento.

8. INVICTUS COINS
Coins são pontos promocionais internos, cumulativos e destinados a resgates elegíveis na Loja Invictus. Não são moeda, ativo financeiro, dinheiro eletrônico ou investimento; não têm cotação fixa em reais, não rendem juros e não podem ser sacados via PIX, transferidos ou convertidos em dinheiro. Créditos obtidos por erro, duplicidade ou fraude podem ser corrigidos com registro auditável.

9. LOJA E PRODUTOS FÍSICOS
A Loja pode oferecer compra em dinheiro, resgate em Coins ou combinação expressamente indicada. Preço, quantidade, frete, prazo, pagamento e disponibilidade devem aparecer antes da confirmação. Itens EM BREVE não podem ser comprados ou resgatados. Produtos de terceiros mantêm suas marcas e informações oficiais.

10. FREE E PRO
O Free mantém as funções indicadas no app. O Pro libera apenas os recursos digitais descritos na oferta. Preço, período, renovação e eventual teste devem aparecer antes da compra. Assinatura não garante pontuação, Coins, produto, colocação ou participação em campeonato.

11. INTEGRIDADE E MODERAÇÃO
São proibidos GPS falso, veículo para simular atividade, mídia enganosa, adulteração de sensores, exploração de falhas, assédio, conteúdo ilegal e acesso a dados alheios. Podem ser aplicadas remoção da atividade, correção de pontos/Coins, limitação, suspensão ou encerramento da conta, com revisão quando cabível.

12. DISPONIBILIDADE E TERCEIROS
GPS, sensores, mapas, notificações, serviços de saúde, autenticação, pagamento, entrega e integrações dependem do aparelho, permissões, rede e provedores externos. O INVICTUS emprega esforços razoáveis, mas não garante operação ininterrupta ou recuperação de atividade não registrada ou sincronizada.

13. DIREITOS E CONTATO
Marca, software, modelos, textos e assets do INVICTUS são protegidos. O usuário mantém direitos sobre seu conteúdo e concede licença limitada para operar os recursos escolhidos. Alterações materiais serão apresentadas em nova versão. Contato: ${SUPPORT_EMAIL}. Aplicam-se as leis brasileiras e os direitos obrigatórios do consumidor e do titular de dados.

14. FREQUÊNCIA CARDÍACA EM COMPETIÇÕES
Quando a frequência cardíaca influenciar validação, intensidade, métricas, pontuação, desempate ou classificação, a participação exige ciência competitiva específica e destacada, separada das permissões e bases legais para tratamento de saúde. O uso de relógio ou sensor não é obrigatório para inscrição. Quando uma sessão válida não possuir frequência cardíaca medida e aceita, o componente de intensidade do IGA utiliza o fator fixo correspondente à Z2 da regra vigente, atualmente 75% (0,75), sem estimar ou inventar BPM. Sessões inexistentes, inválidas ou abaixo dos critérios mínimos continuam sem pontuar. Dados medidos por sensores e serviços externos podem sofrer variação, ausência, atraso e descarte legítimo de amostras. O usuário pode solicitar revisão nos casos previstos. O aceite não implica renúncia a direitos.`;

export const LEGAL_PRIVACY_POLICY = `POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS

${HEADER}

1. CONTROLADOR
INVICTUS PERFORMANCE E SOLUÇÕES LTDA., CNPJ 67.770.822/0001-22. Canal de privacidade: ${SUPPORT_EMAIL}.

2. DADOS TRATADOS
Conforme os recursos usados, podemos tratar: cadastro e contato; CPF e nascimento quando necessários à segurança ou obrigação legal; foto e perfil; atividades, exercícios, cargas e evolução; frequência cardíaca, calorias, sono, HRV e métricas autorizadas; localização e rota durante atividade; fotos, vídeos e áudio enviados; identificadores do aparelho, sinais de integridade e acessos; assinatura; endereço e dados de pedidos; suporte e preferências.

3. FINALIDADES E BASES
Usamos dados para autenticar; registrar e mostrar atividades; criar planos e análises; calcular IGA, XP, conquistas e Coins; operar rankings, desafios, Power Lift e campeonatos; sincronizar provedores autorizados; combater fraude; processar assinatura, pedido e entrega; prestar suporte; cumprir obrigações; proteger usuários e melhorar segurança. As bases podem incluir contrato, consentimento, obrigação legal, exercício de direitos, prevenção à fraude e legítimo interesse avaliado.

4. PERMISSÕES SENSÍVEIS
O aceite geral não concede automaticamente acesso a HealthKit, Health Connect, localização, câmera, microfone, fotos ou notificações. A autorização é pedida no contexto do recurso e pode ser negada ou revogada no sistema operacional ou provedor.

Treinos comuns de musculação podem ser iniciados sem localização. A localização é solicitada para check-in presencial escolhido pelo usuário ou quando a participação ativa em campeonato exigir comprovação de presença. Negar a permissão fora dessas hipóteses não impede o registro do treino comum.

5. EXIBIÇÃO E COMPARTILHAMENTO
Nome público, foto, posição, IGA, conquistas e resultados podem aparecer em recursos sociais conforme a adesão. Rotas exatas, CPF, contato, saúde bruta, endereço e sinais internos antifraude não são publicados. Compartilhamos somente o necessário com operadores de hospedagem, autenticação, segurança/IA, mapas, notificações, assinatura, pagamento, logística, suporte e integrações escolhidas. Não vendemos dados pessoais nem usamos saúde para publicidade comportamental.

6. SEGURANÇA, TRANSFERÊNCIA E RETENÇÃO
Alguns operadores podem processar dados fora do Brasil, sob mecanismos adequados ao serviço. Usamos controles de acesso e auditoria compatíveis com a arquitetura, sem prometer invulnerabilidade. Dados ficam enquanto necessários à conta, às finalidades, à segurança e às obrigações legais; backups seguem ciclo técnico.

7. DIREITOS DO TITULAR
O titular pode solicitar confirmação e acesso; correção; informação sobre compartilhamento; revisão automatizada quando aplicável; portabilidade quando regulamentada; anonimização, bloqueio ou eliminação; revogação de consentimento; oposição e exclusão, observadas retenções legais. Podemos confirmar identidade antes de atender.

8. MENORES E ATUALIZAÇÕES
O serviço não é destinado a menores de 18 anos. Mudanças relevantes serão comunicadas e a versão vigente permanecerá disponível nos canais oficiais do Invictus.`;

export const COMPETITIVE_HR_TITLE = 'CIÊNCIA SOBRE FREQUÊNCIA CARDÍACA E PONTUAÇÃO COMPETITIVA';
export const COMPETITIVE_HR_SUMMARY = 'O IGA usa frequência cardíaca para medir intensidade. Você pode participar sem relógio ou sensor, mas uma sessão válida sem FC medida recebe somente o fator padrão da Z2 e não recebe os bônus das zonas superiores.';
export const COMPETITIVE_HR_CHECKBOX = 'Entendi que, sem frequência cardíaca medida, meus treinos válidos usarão a intensidade padrão da Z2 e poderão gerar pontuação menor do que treinos equivalentes com intensidade superior medida por sensor.';
export const COMPETITIVE_HR_FULL_TEXT = `Declaro estar ciente de que o IGA utiliza a frequência cardíaca como um dos elementos do cálculo de intensidade competitiva.

A utilização de relógio, pulseira ou sensor compatível não é condição para realizar a inscrição. Quando uma sessão válida não possuir qualquer frequência cardíaca medida e aceita pelo sistema, o Invictus não inventará nem estimará um valor de BPM. Nessa situação será aplicado exclusivamente ao componente de intensidade o fator fixo correspondente à Z2 da configuração oficial vigente do IGA, atualmente 75% (0,75). A origem dessa intensidade permanecerá identificada no sistema como padrão sem sensor.

Compreendo que esse padrão permite que o treino continue pontuando por frequência e tempo quando cumprir as demais regras, mas não concede os bônus de intensidade das zonas superiores que dependem de frequência cardíaca efetivamente medida. Sessões inexistentes, inválidas, reprovadas ou abaixo dos critérios mínimos continuam sem pontuar, independentemente do fallback de intensidade.

Quando houver dados de frequência cardíaca medidos, a série validada tem prioridade e, quando ela não estiver disponível, a FC média medida poderá ser utilizada. Esses dados podem ser obtidos por relógios, pulseiras, sensores, plataformas de saúde e demais dispositivos ou serviços conectados e estão sujeitos a limitações técnicas, variações de medição, diferenças entre fabricantes, perda ou atraso de amostras e demais fatores inerentes à tecnologia utilizada.

Compreendo que tais dados podem ser utilizados pelo Invictus, conforme as Regras da Competição e os critérios publicados, para validação da atividade, determinação de intensidade, cálculo de métricas, pontuação, desempate e classificação.

Reconheço que a frequência cardíaca registrada pelo dispositivo ou recebida pela plataforma pode não corresponder de forma absolutamente exata à frequência cardíaca fisiológica real em todos os momentos e que variações legítimas de medição podem produzir diferenças nas métricas e na pontuação.

Fatores como movimento, intensidade, posição e contato do dispositivo com a pele, ajuste da pulseira, suor, características individuais, ambiente, qualidade e algoritmo do sensor, frequência de amostragem, bateria, conexão, sincronização, HealthKit, Health Connect, Strava, APIs e serviços de terceiros podem alterar a disponibilidade ou a leitura. Amostras podem chegar atrasadas, faltar ou ser descartadas de forma legítima pelos critérios publicados.

Declaro que fui informado dessa característica antes de participar e, estando de acordo com as Regras da Competição, opto voluntariamente por participar utilizando os dados efetivamente recebidos, aceitos e validados pelo sistema ou, na ausência de FC medida em sessão válida, o fallback fixo de Z2 descrito acima.

Este aceite não representa consentimento genérico para tratamento de dados de saúde, não substitui as permissões e bases legais descritas na Política de Privacidade e não representa renúncia a direitos. Posso apresentar contestação ou solicitar revisão quando houver indício de erro técnico, falha de processamento, inconsistência de dados ou aplicação incorreta das regras.`;

export type ChampionshipRuleSection = { id: string; title: string; body: string };

export function getChampionshipRuleSections(championship: Championship): ChampionshipRuleSection[] {
  const price = Number(championship.registrationPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const performance = championship.type === 'arena_musculacao'
    ? 'Treinos reais de musculação elegíveis, registrados durante a janela oficial e aprovados pelos controles de integridade do Invictus.'
    : 'Atividades reais de cardio das modalidades publicadas para a edição, registradas durante a janela oficial e aprovadas pelos controles de integridade do Invictus.';
  return [
    { id: 'organizer', title: '1. ORGANIZADOR E NATUREZA', body: `${championship.title} é promovido e patrocinado por INVICTUS PERFORMANCE E SOLUÇÕES LTDA., CNPJ 67.770.822/0001-22. É uma competição esportiva de habilidade e desempenho físico. A classificação decorre de atividades reais elegíveis e validadas; não há sorteio, roleta, número aleatório ou resultado determinado por acaso.` },
    { id: 'eligibility', title: '2. ELEGIBILIDADE', body: 'A participação é exclusiva para pessoas com 18 anos ou mais, titulares de conta própria e regular no Invictus. É proibido compartilhar conta, usar identidade de terceiros, automatizar registros, adulterar sensores, localização, fotos, vídeos ou qualquer evidência de atividade.' },
    { id: 'entry', title: '3. INSCRIÇÃO E PAGAMENTO', body: `A taxa de inscrição desta edição é ${price}. A cobrança é avulsa e não recorrente. As formas de pagamento disponíveis são apresentadas antes da confirmação. A vaga é ativada quando o pagamento da inscrição é aprovado.` },
    { id: 'performance', title: '4. DESEMPENHO E ATIVIDADES VÁLIDAS', body: `${performance} Somente atividades concluídas dentro do período oficial e compatíveis com a modalidade publicada entram na classificação. Atividades fora do período ou da modalidade da edição não pontuam.` },
    { id: 'scoring', title: '5. PONTUAÇÃO, CLASSIFICAÇÃO E DESEMPATE', body: 'A classificação considera apenas resultados validados pelo Invictus. Em igualdade de pontuação total, o desempate segue, nesta ordem: maior número de atividades válidas; maior total de minutos válidos; e, persistindo igualdade, quem atingiu a pontuação final primeiro. Se ainda existir empate técnico em posição premiada, o resultado é encaminhado para revisão antes da homologação.' },
    { id: 'integrity', title: '6. INTEGRIDADE, ANTIFRAUDE E REVISÃO', body: 'Podem ser analisados duração, distância, ritmo, GPS, frequência cardíaca, origem do registro, duplicidade, aparelho, presença, foto, vídeo e outros sinais compatíveis com a modalidade. Uma atividade pode ser aprovada, rejeitada ou enviada para revisão. Tentativa de fraude pode causar invalidação da atividade, retirada da classificação, suspensão da participação ou encerramento da conta, preservado o direito de contestação pelo suporte.' },
    { id: 'health', title: '7. SAÚDE E FREQUÊNCIA CARDÍACA', body: 'O Invictus não é dispositivo médico. Sensores e plataformas de saúde podem apresentar atraso, lacunas ou imprecisão. O uso de relógio ou sensor não é obrigatório para inscrição. Em sessão válida sem frequência cardíaca medida, o componente de intensidade do IGA utiliza o fator padrão da Z2, atualmente 75% (0,75), sem estimar BPM e sem bônus das zonas superiores. Quando houver FC medida, ela é utilizada conforme as regras vigentes. A participação não substitui avaliação médica nem orientação profissional.' },
    { id: 'prize', title: '8. PREMIAÇÃO E RESULTADO FINAL', body: 'A premiação, quantidade de posições premiadas, valores e data de homologação publicados nesta edição integram o regulamento. O resultado é homologado depois do encerramento e pode aguardar a conclusão de revisões competitivas ou financeiras pendentes.' },
    { id: 'refunds', title: '9. CANCELAMENTO, REEMBOLSO E CHARGEBACK', body: 'Cancelamentos e reembolsos seguem a legislação aplicável, o regulamento específico da edição e o estágio da competição. Reembolso ou chargeback confirmado pode cancelar a inscrição e retirar a elegibilidade competitiva daquela edição.' },
    { id: 'privacy', title: '10. PRIVACIDADE E DADOS', body: 'Dados necessários à inscrição, pagamento, atividade, saúde autorizada e prevenção à fraude são tratados conforme os Termos de Uso e a Política de Privacidade do Invictus. Dados brutos de saúde, CPF e sinais internos de segurança não são publicados no ranking. Permissões do sistema operacional continuam separadas do aceite deste regulamento.' },
    { id: 'support', title: '11. CONTESTAÇÃO E CONTATO', body: `O participante pode contestar atividade, validação, pontuação, classificação ou falha técnica pelo suporte em ${SUPPORT_EMAIL}. O pedido de revisão não altera automaticamente o resultado e poderá exigir evidências originais.` },
    { id: 'apple', title: '12. APPLE / APP STORE', body: 'A Apple Inc. e a App Store não são patrocinadoras, organizadoras, parceiras nem estão envolvidas neste campeonato ou em sua premiação.' },
  ];
}
