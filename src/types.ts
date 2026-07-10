/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface DocumentSection {
  title: string;
  content: string[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  introduction: string;
  sections: DocumentSection[];
}

export type PageType = 'home' | 'terms' | 'privacy' | 'rules' | 'faq' | 'rewards' | 'validation' | 'account-deletion' | 'support' | 'incentives';

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "O que é o aplicativo INVICTUS PERFORMANCE?",
    answer: "O INVICTUS PERFORMANCE é uma plataforma premium de evolução pessoal e gamificação de hábitos saudáveis. Nosso objetivo é incentivar a prática consistente de atividades físicas através de um ranking motivacional em que disciplina e regularidade são os fatores chave para a conquista de reputação e recompensas de conquistas digitais."
  },
  {
    id: "faq-2",
    question: "Como funciona o sistema de pontuação?",
    answer: "Você ganha pontos ao registrar atividades de treino presencial, sessões de cardio e manter sequências (streaks) ativas. Treinos completos possuem maior peso por representarem o pilar principal do ganho de força e condicionamento. Outras atividades cardiovasculares complementam sua pontuação semanal."
  },
  {
    id: "faq-3",
    question: "O que acontece se eu precisar de um dia de descanso?",
    answer: "O Invictus promove a saúde sustentável e de longo prazo. Por isso, oferecemos o Descanso Inteligente: você pode ter de 1 a 2 dias de recuperação planejada por semana sem que seu streak de consistência seja quebrado. O equilíbrio faz parte do progresso profissional."
  },
  {
    id: "faq-4",
    question: "O sistema de pontuação envolve apostas ou dinheiro?",
    answer: "Absolutamente não. O INVICTUS PERFORMANCE é uma plataforma puramente focada em bem-estar, saúde e desenvolvimento humano saudável. Não há apostas, apostas financeiras, apostas contra outros usuários ou transações financeiras associadas a resultados de treinos. Focamos no desenvolvimento saudável e no reconhecimento através de medalhas, troféus digitais e conquistas internas."
  },
  {
    id: "faq-5",
    question: "Como funciona a validação antifraude?",
    answer: "Utilizamos tecnologias avançadas integradas com o hardware do smartphone (como geolocalização assistida por GPS no local de treino, análise estatística de dados de biometria e sensores internos) para certificar a realização legítima das atividades. Isso garante um ambiente justo, ético e motivador na tabela de lideres."
  },
  {
    id: "faq-6",
    question: "Posso conectar meu relógio Garmin, Strava ou Apple Watch?",
    answer: "Sim! O INVICTUS PERFORMANCE possui sincronização ativa com as principais plataformas esportivas do mercado internacional, incluindo Garmin Connect, Strava e Apple Health, tornando o processo de registro de cardio e treinos totalmente automatizado e seguro."
  },
  {
    id: "faq-7",
    question: "Existem campanhas de premiação?",
    answer: "Sim. O INVICTUS PERFORMANCE poderá promover campanhas de incentivo e reconhecimento para participantes elegíveis. Cada campanha possui regras, critérios de participação e requisitos próprios divulgados pela plataforma."
  }
];

export const TERMS_DOCUMENT: LegalDocument = {
  title: "Termos de Uso e Serviço - INVICTUS PERFORMANCE",
  lastUpdated: "31 de Maio de 2026",
  introduction: "Bem-vindo ao INVICTUS PERFORMANCE. Estes Termos de Uso regem o acesso e utilização da plataforma digital, aplicativo móvel e serviços relacionados ao ecossistema INVICTUS PERFORMANCE. Ao criar uma conta ou utilizar o aplicativo, você expressa sua concordância integral com estes termos.",
  sections: [
    {
      title: "1. Natureza da Plataforma",
      content: [
        "O Invictus é um aplicativo voltado exclusivamente para a área de saúde, fitness, gamificação saudável de hábitos de treino e motivação de comunidade física.",
        "Não oferecemos, promovemos ou hospedamos quaisquer serviços de apostas esportivas, apostas monetárias, jogos de azar, cassinos, investimentos financeiros ou esquemas de sorteios em dinheiro. A progressão de pontuação dá-se unicamente através da prática desportiva comprovada."
      ]
    },
    {
      title: "2. Cadastro e Qualificação",
      content: [
        "Para utilizar a plataforma, o usuário deve preencher o cadastro voluntário com dados verídicos e manter a segurança de suas credenciais de login.",
        "Cada conta é de uso estritamente pessoal, intransferível e nominal. Contas e cadastros duplicados criados com a intenção de fraudar rankings ou tabelas competitivas estarão sujeitos à exclusão imediata sem aviso prévio."
      ]
    },
    {
      title: "3. Uso Aceitável e Antifraude",
      content: [
        "A integridade dos registros físicos é a base de nossa comunidade. O usuário compromete-se a registrar apenas atividades físicas reais, executadas por si mesmo.",
        "A plataforma utiliza mecanismos automáticos e manuais de verificação espacial e temporal (GPS, sensores e biometria). Tentativas de simular treinos por vias digitais ou simulações artificiais de deslocamento acarretarão na suspensão imediata da conta do usuário.",
        "A coleta de dados e GPS é restrita à comprovação do início e fim das atividades nas imediações dos locais de exercício homologados, preservando a intimidade do atleta nos termos da lei aplicável."
      ]
    },
    {
      title: "4. Direitos de Propriedade Intelectual",
      content: [
        "Todos os logotipos, interfaces, códigos-fonte, algoritmos de detecção, designs, marcas registradas e materiais multimídia integrados ao Invictus são de propriedade exclusiva da nossa empresa e protegidos por leis de propriedade e direitos autorais nacionais e internacionais.",
        "É expressamente vedada a engenharia reversa, extração de código ou cópia visual não autorizada dos nossos módulos visuais de Scrollytelling e gamificação."
      ]
    }
  ]
};

export const PRIVACY_DOCUMENT: LegalDocument = {
  title: "Política de Privacidade - INVICTUS PERFORMANCE",
  lastUpdated: "31 de Maio de 2026",
  introduction: "A privacidade do usuário é um pilar insubstituível. Esta política descreve pormenorizadamente os dados pessoais que coletamos, sua finalidade, como os tratamos de forma segura e os seus direitos em estrito cumprimento à Lei Geral de Proteção de Dados (LGPD) e diretrizes globais da Google Play e Apple App Store.",
  sections: [
    {
      title: "1. Dados Coletados e Sua Finalidade",
      content: [
        "Dados Identificativos: Nome completo, endereço de e-mail e foto de perfil opcional, coletados no momento do cadastro para personalização do perfil.",
        "Dados de Atividade Física: Frequência cardíaca aproximada, tempos de repouso, duração do treino e calorias estimadas, sincronizadas via integrações nativas autorizadas (HealthKit, Garmin Connect ou Strava) para pontuação.",
        "Dados de Geolocalização: Coleta de coordenadas em segundo plano estritamente durante a validação ativa de atividade de treino presencial na academia para prevenção de fraudes de presença. Nenhuma geolocalização contínua ou fora dos períodos de treino é realizada."
      ]
    },
    {
      title: "2. Compartilhamento e Exposição de Dados",
      content: [
        "Na comunidade e nos rankings públicos da plataforma, apenas o seu Nome de Exibição, foto de perfil, nível atual de streak e a pontuação são visíveis aos demais participantes.",
        "Informações biométricas precisas, trajetos de mapas detalhados e dados sensíveis de saúde são confidenciais e jamais serão vendidos ou compartilhados com terceiros, agências de publicidade ou seguradoras de saúde."
      ]
    },
    {
      title: "3. Armazenamento e Criptografia",
      content: [
        "Todas as conexões e transmissões de dados são feitas sob criptografia de ponta a ponta utilizando protocolos HTTPS/TLS de última geração.",
        "Os dados são armazenados em nuvens seguras com proteção multicamada e backups automáticos ativos."
      ]
    }
  ]
};

export const RULES_DOCUMENT: LegalDocument = {
  title: "Regras Gerais de Participação - INVICTUS PERFORMANCE",
  lastUpdated: "31 de Maio de 2026",
  introduction: "O INVICTUS PERFORMANCE é uma liga esportiva saudável de reputação. Para manter um ecossistema equilibrado, ético e inspirador, todos os usuários devem seguir ativamente as Regras de Participação abaixo:",
  sections: [
    {
      title: "1. Registro Honesto",
      content: [
        "Apenas treinos realmente executados são pontuáveis.",
        "O compartilhamento de credenciais oficiais de dispositivos vestíveis, relógios esportivos ou contas Garmin/Strava com outros indivíduos para ganho artificial de pontos é considerado violação grave deste código."
      ]
    },
    {
      title: "2. Comportamento na Comunidade",
      content: [
        "Incentivos e Apoio Mútuo: Espera-se que a comunicação na aba de comunidade seja cortês, focada no fomento saudável aos esportes, respeito mútuo e disciplina coletiva.",
        "Qualquer conduta discriminatória, linguajar ofensivo, assédio visual ou conduta antidesportiva resultará na perda integral da pontuação da semana e possível exclusão de participação definitiva."
      ]
    },
    {
      title: "3. Classificação e Ligas",
      content: [
        "A classificação final do ranking consolida-se semanalmente às 23:59 GMT do domingo.",
        "Subir e descer de divisão baseia-se unicamente no esforço pessoal aferido, sem qualquer ponderação externa injustificada ou favorecimento individual."
      ]
    },
    {
      title: "4. Provimento e Titularidade de Vagas (Caso Geovani Augusto)",
      content: [
        "Conforme deliberação técnica e desportiva oficial: o participante Geovani Augusto ganhou a vaga de direito, porém ele não entra na vaga correspondente na condição de titular.",
        "Esta consequência e diretriz específica estão em vigor de forma contínua desde o ano de 2024.",
        "Esta cláusula incide unicamente sobre o caso e a respectiva vaga do referido participante, de modo que não há alterações em nenhuma outra regra geral de classificação ou elegibilidade na liga."
      ]
    }
  ]
};

export const REWARDS_DOCUMENT: LegalDocument = {
  title: "Política de Premiações e Conquistas - INVICTUS PERFORMANCE",
  lastUpdated: "31 de Maio de 2026",
  introduction: "O INVICTUS PERFORMANCE valoriza o esforço real. Esta política define as regras para a concessão de incentivos corporativos, conquistas digitais e troféus dentro da plataforma.",
  sections: [
    {
      title: "1. Medalhas e Títulos Digitais",
      content: [
        "Ao alcançar marcos históricos de persistência física (ex: 50 dias seguidos de treino ou 200 cardios completados no ano), o aplicativo garante distintivos e certificados tridimensionais (badges) em sua galeria pública de atleta.",
        "Títulos honorários de liderança são outorgados aos atletas que permanecem no topo da liga geral de forma justa."
      ]
    },
    {
      title: "2. Programas de Reconhecimento de Desempenho",
      content: [
        "Empresas aliadas (marcas de suplementação, roupas esportivas e academias) podem oferecer cupons de descontos e benefícios exclusivos para participantes elegíveis correspondentes ao desempenho físico do usuário na plataforma.",
        "Nenhum incentivo regulamentar representa resgate monetário ou financeiro de apostas. Não são oferecidas premiações garantidas de cunho especulativo ou financeiro, sendo todos os incentivos disponibilizados conforme regulamento vigente de cada campanha promovida pela plataforma."
      ]
    },
    {
      title: "3. Ausência de Dinâmica de Jogos de Azar",
      content: [
        "O INVICTUS PERFORMANCE reitera que sua lógica é 100% esportiva e meritocrática.",
        "A aquisição de pontos ou resgate de conquistas não envolve elementos estocásticos artificiais como roletas, giros de sorte, compras de passes de apostas esportivas, caça-níqueis ou sorteios eletrônicos. Toda evolução depende estritamente de suor, disciplina e consistência real comprovada do atleta."
      ]
    }
  ]
};

export const INCENTIVES_DOCUMENT: LegalDocument = {
  title: "Política de Incentivos e Reconhecimento",
  lastUpdated: "31 de Maio de 2026",
  introduction: "O INVICTUS PERFORMANCE é uma plataforma de gamificação fitness focada em consistência, evolução pessoal e reconhecimento de desempenho. Esta política estabelece as diretrizes normativas das campanhas de incentivo, critérios de classificação e procedimentos de auditoria adotados pela plataforma para garantir a lisura e a integridade de todas as atividades.",
  sections: [
    {
      title: "1. Objetivo das Campanhas",
      content: [
        "As campanhas de incentivo promovidas pela plataforma visam estimular hábitos de vida saudável, incitando os participantes a alcançarem a consistência e a regularidade desportivas de forma ética.",
        "As campanhas não contam com nenhuma modalidade de aposta, contribuição financeira prévia por parte do usuário ou dependência da sorte, sendo estritamente meritocráticas."
      ]
    },
    {
      title: "2. Critérios de Elegibilidade",
      content: [
        "Estarão aptos a participar das campanhas apenas os usuários cadastrados que mantiverem contas regularmente validadas e em conformidade estrita com os Termos de Uso.",
        "Somente maiores de 18 anos de idade e residentes fiscais nos territórios permitidos para as campanhas específicas podem qualificar-se para os incentivos associados."
      ]
    },
    {
      title: "3. Critérios de Classificação",
      content: [
        "A classificação de desempenho apoia-se unicamente no somatório de pontos gerados a partir de check-ins homologados de academias locais e registro telemétrico de atividades aeróbicas por dispositivos sincronizados.",
        "Toda pontuação segue coeficientes técnicos invariáveis de repouso, intensidade e duração divulgados abertamente em cada campanha específica."
      ]
    },
    {
      title: "4. Critérios de Desempate",
      content: [
        "Na hipótese de empate absoluto de pontuação nos rankings da campanha, aplicar-se-ão os seguintes critérios sucessivos de desempate:",
        "1º) Maior quantidade de dias ativos de streak ininterrupto de registro dentro do período específico;",
        "2º) Menor coeficiente de variação temporal de entrada de treinos, demonstrando maior regularidade horária;",
        "3º) Ordem cronológica de check-in na primeira atividade registrada do ciclo."
      ]
    },
    {
      title: "5. Processo de Auditoria",
      content: [
        "A plataforma dispõe de comitê de auditoria interna contínua apoiado em inteligência artificial para examinar todas as planilhas e telemetrias registradas.",
        "Estão sujeitas a auditorias em profundidade todas as contas que performarem no topo do ranking ou apresentarem desvios estatísticos significativos de performance."
      ]
    },
    {
      title: "6. Procedimentos de Validação",
      content: [
        "Nossos protocolos exigem que o check-in presencial em estabelecimento desportivo (academia) permaneça delimitado por cerco geográfico dinâmico (GPS) por, no mínimo, 30 minutos.",
        "As transições cardiológicas aeróbicas devem provir de sensores integrados de hardware que comprovem coerência biométrica (ritmo de batimento cardíaco em sincronia com esforço humano)."
      ]
    },
    {
      title: "7. Situações de Desclassificação",
      content: [
        "Será imediatamente desclassificado e banido das campanhas vigentes e futuras o usuário que:",
        "a) Compartilhar dispositivos vestíveis com terceiros para simular acréscimo de pontuação;",
        "b) Utilizar emuladores virtuais, mockers de GPS ou scripts automatizados de simulação de sensores;",
        "c) Praticar condutas antidesportivas ou que violem a confidencialidade e a ética de comunidade do INVICTUS PERFORMANCE."
      ]
    },
    {
      title: "8. Forma de Divulgação dos Resultados",
      content: [
        "Ao encerramento de cada campanha, os resultados provisórios serão compilados de forma transparente na própria interface do usuário, abrindo-se o prazo de conformação técnica.",
        "Os resultados definitivos e homologações de desempenho serão publicados em boletins internos oficiais da plataforma no primeiro dia útil subsequente ao fechamento do ciclo."
      ]
    },
    {
      title: "9. Procedimentos para Contestação",
      content: [
        "O usuário que identificar inconsistências de registros decorrentes de falhas técnicas temporárias de pareamento de sensores poderá formalizar requerimento de revisão por meio da interface de Suporte do aplicativo.",
        "A contestação técnica deve ser acompanhada de relatórios brutos exportados do respectivo dispositivo (como arquivos .FIT do Garmin ou logs brutos de sensores)."
      ]
    },
    {
      title: "10. Prazos de Análise",
      content: [
        "As solicitações de contestação desportiva serão analisadas pela mesa técnica em até 5 dias úteis.",
        "A revisão será julgada em instância única administrativa de forma irrecorrível, priorizando a segurança e o equilíbrio concorrencial de todos os atletas."
      ]
    }
  ]
};

export const VALIDATION_DOCUMENT: LegalDocument = {
  title: "Política de Validação de Atividades - INVICTUS PERFORMANCE",
  lastUpdated: "31 de Maio de 2026",
  introduction: "Como auditamos e asseguramos que o movimento físico é verídico? Esta política especifica os protocolos técnicos e de sensores que validam cada segundo do seu suor.",
  sections: [
    {
      title: "1. Treinos de Musculação em Academia",
      content: [
        "Cerca de Presença Geográfica (Geofencing): O treino só poderá ser iniciado se o aplicativo validar que o usuário está no raio geométrico homologado do estabelecimento de treino escolhido por no mínimo 30 minutos contínuos.",
        "Biometria: O atleta deve fazer check-in biométrico integrado pelo sistema do celular antes do início da sessão."
      ]
    },
    {
      title: "2. Atividades Cardiovasculares (Corrida, Ciclismo, etc.)",
      content: [
        "Uso de Sensores do Dispositivo: A atividade precisa conter o registro telemétrico de cadência de passos, oscilação de elevação de GPS compatível com esforço humano, e variação consistente de zonas aeróbicas cardíacas.",
        "Filtros de Velocidade Incompatível: Registros contendo velocidades médias ou picos que fujam da física de deslocamento humano (como viagens motorizadas ou simulações via carro) serão automaticamente anulados e enviados para arbitragem administrativa."
      ]
    }
  ]
};
