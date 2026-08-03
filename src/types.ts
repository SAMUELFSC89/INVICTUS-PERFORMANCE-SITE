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
    question: "O que é a plataforma INVICTUS?",
    answer: "O INVICTUS é uma plataforma inteligente de acompanhamento da saúde, desempenho esportivo e evolução pessoal baseada em dados reais, integrações nativas e inteligência artificial. Nosso objetivo é transformar dados de atividade física em conhecimento acionável, promovendo longevidade, consistência e evolução contínua através de métricas validadas e do nosso Centro de Performance."
  },
  {
    id: "faq-2",
    question: "O que é e como funciona a Invictus IA?",
    answer: "A Invictus IA é uma assistente de saúde e desempenho integrada a toda a plataforma. Com autorização do usuário, ela interpreta métricas corporais e esportivas, analisa tendências do seu Centro de Performance, responde a dúvidas sobre treinos e conceitos científicos por texto e comandos por voz, e gera projeções personalizadas baseadas nos seus dados reais."
  },
  {
    id: "faq-3",
    question: "A Invictus IA substitui profissionais da saúde?",
    answer: "Não. A Invictus IA possui finalidade exclusivamente educativa e informativa para apoiar a compreensão de dados e métricas. Ela não realiza diagnósticos e não substitui o acompanhamento individualizado de médicos, nutricionistas, fisioterapeutas ou profissionais de Educação Física. Sempre encorajamos e recomendamos o suporte profissional qualificado."
  },
  {
    id: "faq-4",
    question: "O que é o Centro de Performance?",
    answer: "O Centro de Performance é o painel analítico do usuário no aplicativo. Ele oferece um acompanhamento longitudinal abrangente com históricos diário, semanal, mensal, anual e de longo prazo. Inclui gráficos de tendência, comparações de períodos, metas, recordes, indicadores cardiovasculares (frequência cardíaca, variabilidade), indicadores de consistência, nível de recuperação e projeções estatísticas."
  },
  {
    id: "faq-5",
    question: "Como funciona o novo sistema de pontuação e o IGA?",
    answer: "Utilizamos a metodologia atual do IGA (Índice de Desempenho / Performance). O IGA é um índice equilibrado que pondera múltiplos fatores do desempenho físico do usuário, incluindo regularidade, volume biomecânico, intensidade e métricas de recuperação. O sistema avalia a evolução individual de forma justa sem expor algoritmos internos sensíveis."
  },
  {
    id: "faq-6",
    question: "Quais aplicativos e dispositivos vestíveis são integrados ao Invictus?",
    answer: "O Invictus integra-se nativamente a ecossistemas como Apple Health, Health Connect, Strava, GPS do dispositivo, monitores de frequência cardíaca e wearables compatíveis. Toda coleta de dados depende estritamente das permissões explícitas concedidas pelo usuário."
  },
  {
    id: "faq-7",
    question: "Os dados e métricas exibi-los são fictícios?",
    answer: "Não. O pilar fundamental do Invictus é a utilização de dados 100% reais, provenientes dos sensores do celular ou vestíveis pareados. Nenhuma análise ou estatística é gerada com base em valores fictícios ou simulados. Caso não existam dados suficientes em determinado período, algumas análises ficarão temporariamente limitadas até que novos registros sejam disponibilizados."
  }
];

export const TERMS_DOCUMENT: LegalDocument = {
  title: "Termos de Uso e Serviço - INVICTUS",
  lastUpdated: "3 de Agosto de 2026",
  introduction: "Bem-vindo ao INVICTUS. Estes Termos de Uso regem o acesso e a utilização da plataforma inteligente de saúde, desempenho esportivo e evolução pessoal. Ao criar uma conta ou utilizar a plataforma, você concorda expressamente com os termos estabelecidos.",
  sections: [
    {
      title: "1. Natureza da Plataforma",
      content: [
        "O Invictus é uma plataforma tecnológica de inteligência em saúde, acompanhamento esportivo e motivação baseada em dados reais.",
        "Não oferecemos, promovemos ou hospedamos quaisquer modalidades de apostas, jogos de azar ou transações financeiras vinculadas a resultados esportivos. A progressão no aplicativo dá-se exclusivamente através do registro autêntico de hábitos saudáveis e dados esportivos."
      ]
    },
    {
      title: "2. Uso da Invictus IA e Limitações",
      content: [
        "A Invictus IA é uma ferramenta de apoio analítico para interpretação de dados e esclarecimento de conceitos genéricos de saúde e treino.",
        "A Invictus IA não emite diagnósticos médicos, prescrições de dietas ou programas de reabilitação. O usuário reconhece que suas respostas são educativas e não substituem a consulta a profissionais de saúde e educação física qualificados."
      ]
    },
    {
      title: "3. Integrações de Dados e Permissões",
      content: [
        "O usuário autoriza voluntariamente o acesso aos dados fornecidos por integrações de terceiros (Apple Health, Health Connect, Strava, relógios inteligentes e sensores de GPS) para alimentar seu Centro de Performance e a Invictus IA.",
        "O usuário pode revogar tais permissões a qualquer momento através das configurações do seu dispositivo ou aplicativo."
      ]
    },
    {
      title: "4. Propriedade Intelectual e Algoritmos",
      content: [
        "A arquitetura da plataforma, a metodologia do IGA, os modelos de IA, a interface visual e os elementos proprietários do Invictus são protegidos pelas leis de propriedade intelectual e direitos autorais.",
        "É expressamente vedada a engenharia reversa, extração não autorizada de dados ou clonagem de componentes da plataforma."
      ]
    }
  ]
};

export const PRIVACY_DOCUMENT: LegalDocument = {
  title: "Política de Privacidade e Proteção de Dados - INVICTUS",
  lastUpdated: "3 de Agosto de 2026",
  introduction: "A transparência e a segurança dos seus dados de saúde são compromissos inegociáveis do INVICTUS. Esta Política descreve como tratamos e protegemos suas informações de acordo com a Lei Geral de Proteção de Dados (LGPD) e normativas internacionais.",
  sections: [
    {
      title: "1. Coleta e Finalidade dos Dados",
      content: [
        "Dados Pessoais Basais: Nome, e-mail e foto de perfil, utilizados estritamente para identificação da conta.",
        "Métricas de Saúde e Esporte: Frequência cardíaca, variabilidade cardíaca, treinos, distância de GPS e caloria estimada obtidos com autorização explícita via Apple Health, Health Connect, Strava ou sensores vestíveis. Esses dados alimentam exclusivamente o seu Centro de Performance e personalizam a experiência da Invictus IA.",
        "Controle do Usuário: Nenhum dado de saúde é compartilhado com terceiros, parceiros de publicidade ou seguradoras. O usuário detém controle total sobre quais integrações manter ativas."
      ]
    },
    {
      title: "2. Segurança e Criptografia",
      content: [
        "Todas as transmissões de dados são protegidas por protocolos de criptografia TLS/HTTPS de última geração.",
        "Os registros biométricos são armazenados em infraestrutura segura com acesso restrito e protegido por autenticação em camadas."
      ]
    },
    {
      title: "3. Transparência na Utilização da Inteligência Artificial",
      content: [
        "Os dados do usuário são processados pela Invictus IA única e exclusivamente para gerar respostas personalizadas e insights dentro da sessão do próprio usuário.",
        "Os dados de saúde individuais não são comercializados ou utilizados para fins publicitários."
      ]
    }
  ]
};

export const RULES_DOCUMENT: LegalDocument = {
  title: "Código de Conduta e Regras da Plataforma - INVICTUS",
  lastUpdated: "3 de Agosto de 2026",
  introduction: "O INVICTUS promove um ambiente de evolução real, integridade de dados e incentivo mútuo. Todos os membros devem seguir as diretrizes abaixo:",
  sections: [
    {
      title: "1. Autenticidade dos Dados",
      content: [
        "Apenas dados reais originados de atividades físicas genuínas executadas pelo próprio usuário e validados por sensores são aceitos na plataforma.",
        "Tentativas de simulação de trajetos, adulteração de arquivos de telemetria ou compartilhamento indevido de vestíveis resultarão na desqualificação das análises e possível bloqueio da conta."
      ]
    },
    {
      title: "2. Respeito na Comunidade",
      content: [
        "Interações no aplicativo devem ser pautadas pelo respeito, ética e incentivo à prática de hábitos saudáveis.",
        "Não serão toleradas condutas ofensivas, discriminatórias ou antidesportivas."
      ]
    },
    {
      title: "3. Provimento e Titularidade de Vagas (Caso Geovani Augusto)",
      content: [
        "Conforme deliberação técnica oficial mantida continuamente desde 2024: o participante Geovani Augusto obteve a vaga de direito, porém não integra a listagem na condição de titular.",
        "Esta disposição aplica-se estritamente ao referido participante, não alterando as diretrizes gerais de classificação dos demais usuários."
      ]
    }
  ]
};

export const REWARDS_DOCUMENT: LegalDocument = {
  title: "Diretrizes de Reconhecimento e Conquistas - INVICTUS",
  lastUpdated: "3 de Agosto de 2026",
  introduction: "O INVICTUS valoriza a consistência e a dedicação física comprovada através de um sistema meritocrático de conquistas digitais e insígnias.",
  sections: [
    {
      title: "1. Insígnias e Marcos de Evolução",
      content: [
        "Ao alcançar marcos consistentes no seu Centro de Performance (ex: 30, 60 ou 90 dias de consistência validada no IGA), o usuário desbloqueia conquistas e selos em sua galeria de evolução.",
        "Toda conquista é fundamentada em dados reais e auditoria algorítmica de integridade."
      ]
    },
    {
      title: "2. Isenção de Mecânicas de Azar",
      content: [
        "A plataforma não possui roletas, sorteios especulativos ou elementos de azar.",
        "A evolução do usuário depende estritamente do seu esforço pessoal e da regularidade de suas atividades físicas."
      ]
    }
  ]
};

export const INCENTIVES_DOCUMENT: LegalDocument = {
  title: "Política de Campanhas e Programas de Reconhecimento - INVICTUS",
  lastUpdated: "3 de Agosto de 2026",
  introduction: "Diretrizes regulatórias das campanhas institucionais e programas de incentivo à saúde promovidos pelo INVICTUS e parceiros homologados.",
  sections: [
    {
      title: "1. Elegibilidade e Mérito",
      content: [
        "As campanhas de reconhecimento visam incentivar a regularidade esportiva de forma ética e transparente.",
        "Apenas usuários com dados atestados por integrações válidas e que estejam em conformidade com o Código de Conduta qualificam-se para programas de reconhecimento."
      ]
    },
    {
      title: "2. Auditoria e Validação IGA",
      content: [
        "A plataforma realiza auditorias automatizadas contínuas nos registros de telemetria.",
        "O Índice de Desempenho (IGA) serve como parâmetro técnico de acompanhamento de consistência durante o ciclo."
      ]
    }
  ]
};

export const VALIDATION_DOCUMENT: LegalDocument = {
  title: "Metodologia de Validação de Dados e Sensores - INVICTUS",
  lastUpdated: "3 de Agosto de 2026",
  introduction: "Como asseguramos que o movimento e os dados de saúde são autênticos? Esta política detalha a validação por hardware e telemetria.",
  sections: [
    {
      title: "1. Validação Multisensores",
      content: [
        "Musculação e Treino Presencial: Validação de presença espacial por cerca geográfica (Geofencing) e biometria no dispositivo durante a permanência no local homologado.",
        "Cardio e Atividades de Deslocamento: Verificação telemétrica de cadência, curva de aceleração humana, variação de altimetria de GPS e zonas de frequência cardíaca."
      ]
    },
    {
      title: "2. Limitação por Insuficiência de Dados",
      content: [
        "Para garantir o rigor científico, a plataforma não gera gráficos nem estimativas baseados em números fictícios.",
        "Em caso de dados incompletos ou falta de sinal de sensores, o sistema sinalizará a limitação até a sincronização de novos dados autênticos."
      ]
    }
  ]
};
