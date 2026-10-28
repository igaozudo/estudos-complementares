export interface Documento {
  codigo: string;
  titulo: string;
  slug: string;
  descricao?: string;
}

export interface Modulo {
  id: string;
  numero: number;
  tag: string;
  titulo: string;
  slug: string;
  descricao: string;
  docs: Documento[];
}

export interface Disciplina {
  id: string;
  numero: string;
  slug: string;
  titulo: string;
  descricao: string;
  modulos: Modulo[];
}

export const DISCIPLINAS: Disciplina[] = [
  // 01 - MATEMÁTICA
  {
    id: '01',
    numero: '01',
    slug: '01-matematica',
    titulo: 'Matemática',
    descricao: 'Aritmética, Álgebra, Funções, Geometria e Estruturas Avançadas.',
    modulos: [
      {
        id: 'mat-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'Nivelamento e Fundamentos da Matemática e Operações Intuitivas.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: Fundamentos da Matemática e Operações Intuitivas' }
        ]
      },
      {
        id: 'mat-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Aritmética e Teoria dos Números',
        slug: 'modulo-1',
        descricao: 'Conjuntos numéricos, divisibilidade, primos e proporcionalidade.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Conjuntos Numéricos e Lógica Matemática' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Fundamentos Aritméticos, Primos e Divisibilidade' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Potenciação, Radiciação e Álgebra Elementar' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Proporcionalidade, Regra de Três e Matemática Financeira' }
        ]
      },
      {
        id: 'mat-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Álgebra, Equações e Funções',
        slug: 'modulo-2',
        descricao: 'Equações algébricas, teoria geral das funções e famílias funcionais.',
        docs: [
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Equações, Inequações e Sistemas Lineares Básicos' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Teoria Geral das Funções' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Funções Afins e Modulares' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Funções Quadráticas e Otimização da Parábola' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Funções Exponenciais e Logarítmicas' }
        ]
      },
      {
        id: 'mat-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Geometria Plana e Trigonometria',
        slug: 'modulo-3',
        descricao: 'Axiomática euclidiana, figuras planas, áreas e círculo trigonométrico.',
        docs: [
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Fundamentos da Geometria Plana, Ângulos e Triângulos' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Semelhança, Teorema de Pitágoras e Polígonos' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Círculos e Áreas de Figuras Planas' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Trigonometria: Do Triângulo Retângulo ao Ciclo Trigonométrico' }
        ]
      },
      {
        id: 'mat-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Geometria Espacial e Analítica',
        slug: 'modulo-4',
        descricao: 'Posições relativas, poliedros, métrica espacial e curvas cônicas.',
        docs: [
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'Geometria de Posição e Poliedros' },
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'Geometria Métrica Espacial: Prismas, Pirâmides e Corpos Redondos' },
          { codigo: 'Doc 16', slug: 'doc-16', titulo: 'Geometria Analítica: Ponto e Reta' },
          { codigo: 'Doc 17', slug: 'doc-17', titulo: 'Cônicas: Circunferência, Elipse, Hipérbole e Parábola' }
        ]
      },
      {
        id: 'mat-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Combinatória, Probabilidade e Estruturas Avançadas',
        slug: 'modulo-5',
        descricao: 'Análise combinatória, cálculo de probabilidades, matrizes e polinômios.',
        docs: [
          { codigo: 'Doc 18', slug: 'doc-18', titulo: 'Sequências, Progressões Aritméticas (PA) e Geométricas (PG)' },
          { codigo: 'Doc 19', slug: 'doc-19', titulo: 'Análise Combinatória e Binômio de Newton' },
          { codigo: 'Doc 20', slug: 'doc-20', titulo: 'Teoria das Probabilidades e Estatística Descritiva' },
          { codigo: 'Doc 21', slug: 'doc-21', titulo: 'Matrizes, Determinantes e Sistemas Lineares Avançados' },
          { codigo: 'Doc 22', slug: 'doc-22', titulo: 'Números Complexos e Polinômios' }
        ]
      }
    ]
  },

  // 02 - FÍSICA
  {
    id: '02',
    numero: '02',
    slug: '02-fisica',
    titulo: 'Física',
    descricao: 'Mecânica Clássica, Termofísica, Óptica, Eletromagnetismo e Física Moderna.',
    modulos: [
      {
        id: 'fis-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'Grandezas escalares e vetoriais, Sistema Internacional (SI) e ordens de grandeza.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: Grandezas Físicas, Unidades SI e Notação Científica' }
        ]
      },
      {
        id: 'fis-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Mecânica Clássica',
        slug: 'modulo-1',
        descricao: 'Cinemática, Leis de Newton, Conservação de Energia e Fluidos.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Cinemática Escalar e Vetorial: MRU, MRUV e Movimento Circular' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Dinâmica e as Três Leis de Newton' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Trabalho, Energia Mecânica e Sistemas Conservativos' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Quantidade de Movimento, Impulso e Colisões' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Estática de Corpos Rígidos e Gravitação Universal' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Hidrostática: Teorema de Stevin, Pascal e Arquimedes' }
        ]
      },
      {
        id: 'fis-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Termofísica e Ondulatória',
        slug: 'modulo-2',
        descricao: 'Termometria, Leis da Termodinâmica, Movimento Harmônico e Acústica.',
        docs: [
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Termometria e Calorimetria: Calor Sensível e Latente' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Gases Ideais e as Leis da Termodinâmica' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Movimento Harmônico Simples (MHS)' },
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Ondulatória, Fenômenos Ondulatórios e Acústica' }
        ]
      },
      {
        id: 'fis-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Óptica Geométrica e Física',
        slug: 'modulo-3',
        descricao: 'Reflexão, espelhos planos e esféricos, refração e lentes delgadas.',
        docs: [
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Princípios da Óptica, Reflexão e Espelhos' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Refração da Luz, Lentes Esféricas e Instrumentos Ópticos' }
        ]
      },
      {
        id: 'fis-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Eletromagnetismo',
        slug: 'modulo-4',
        descricao: 'Eletrostática, análise de circuitos e fenômenos de indução magnética.',
        docs: [
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Eletrostática: Cargas, Força Elétrica, Campo e Potencial' },
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'Eletrodinâmica: Corrente, Leis de Ohm, Circuitos e Potência' },
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'Eletromagnetismo: Campo Magnético, Força Magnética e Indução' }
        ]
      },
      {
        id: 'fis-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Física Moderna',
        slug: 'modulo-5',
        descricao: 'Relatividade especial, teoria quântica inicial e estrutura nuclear.',
        docs: [
          { codigo: 'Doc 16', slug: 'doc-16', titulo: 'Relatividade Restrita, Efeito Fotoelétrico e Dualidade Onda-Partícula' }
        ]
      }
    ]
  },

  // 03 - QUÍMICA
  {
    id: '03',
    numero: '03',
    slug: '03-quimica',
    titulo: 'Química',
    descricao: 'Química Geral, Físico-Química, Termoquímica e Química Orgânica.',
    modulos: [
      {
        id: 'qui-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'Linguagem química fundamental, estados da matéria e transformações.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: Matéria, Estados Físicos e Linguagem Química' }
        ]
      },
      {
        id: 'qui-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Química Geral e Atômica',
        slug: 'modulo-1',
        descricao: 'Modelos atômicos, tabela periódica, ligações químicas e estequiometria.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Substâncias, Misturas e Métodos de Separação' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Modelos Atômicos, Distribuição Eletrônica e Tabela Periódica' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Ligações Químicas, Geometria Molecular e Polaridade' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Funções Inorgânicas: Ácidos, Bases, Sais e Óxidos' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Grandezas Químicas, Mol e Cálculo Estequiométrico' }
        ]
      },
      {
        id: 'qui-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Físico-Química I: Soluções e Termodinâmica',
        slug: 'modulo-2',
        descricao: 'Dispersões, propriedades coligativas e trocas térmicas nas reações.',
        docs: [
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Estudo das Soluções, Concentrações e Titulação' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Propriedades Coligativas' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Termoquímica e Lei de Hess' }
        ]
      },
      {
        id: 'qui-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Físico-Química II: Cinética e Equilíbrios',
        slug: 'modulo-3',
        descricao: 'Taxas de reação, equilíbrio químico, pH e eletroquímica de pilhas.',
        docs: [
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Cinética Química e Velocidade das Reações' },
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Equilíbrio Químico, Deslocamento e pH/pOH' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Eletroquímica: Pilhas, Eletrólise e Radioatividade' }
        ]
      },
      {
        id: 'qui-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Química Orgânica I: Estruturas e Funções',
        slug: 'modulo-4',
        descricao: 'Postulados de Kekulé, hibridização e nomenclatura das funções orgânicas.',
        docs: [
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'O Átomo de Carbono, Cadeias e Hibridização' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Hidrocarbonetos e Funções Oxigenadas' },
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'Funções Nitrogenadas e Haletos Orgânicos' }
        ]
      },
      {
        id: 'qui-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Química Orgânica II: Isomeria e Reações',
        slug: 'modulo-5',
        descricao: 'Estereoquímica, quiralidade, mecanismos de reação e síntese de polímeros.',
        docs: [
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'Isomeria Plana e Espacial (Geométrica e Óptica)' },
          { codigo: 'Doc 16', slug: 'doc-16', titulo: 'Principais Reações Orgânicas e Polímeros' }
        ]
      }
    ]
  },

  // 04 - BIOLOGIA
  {
    id: '04',
    numero: '04',
    slug: '04-biologia',
    titulo: 'Biologia',
    descricao: 'Citologia, Fisiologia Humana, Genética, Evolução e Ecologia.',
    modulos: [
      {
        id: 'bio-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'O método científico na biologia e os níveis fundamentais de organização.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: Níveis de Organização da Vida e o Método Científico' }
        ]
      },
      {
        id: 'bio-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Bioquímica Celular e Citologia',
        slug: 'modulo-1',
        descricao: 'Moléculas da vida, arquitetura celular, bioenergética e divisão celular.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Bioquímica Celular: Da Água aos Ácidos Nucleicos' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Membrana Plasmática e Organelas Citoplasmáticas' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Bioenergética: Fotossíntese, Fermentação e Respiração Celular' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Núcleo Celular, Mitose e Meiose' }
        ]
      },
      {
        id: 'bio-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Histologia, Botânica e Zoologia',
        slug: 'modulo-2',
        descricao: 'Tecidos biológicos, a evolução do reino vegetal e zoologia comparada.',
        docs: [
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Embriologia e Histologia Animal' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Sistemática, Vírus, Bactérias, Protozoários e Fungos' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Reino Vegetal: Anatomia e Fisiologia das Plantas' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Zoologia Comparada: Dos Invertebrados aos Cordados' }
        ]
      },
      {
        id: 'bio-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Fisiologia Humana',
        slug: 'modulo-3',
        descricao: 'Sistemas biológicos de sustentação, integração neural e defesa imune.',
        docs: [
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Sistemas de Manutenção: Digestão, Respiração, Circulação e Excreção' },
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Sistemas de Controle e Defesa: Nervoso, Endócrino e Imunológico' }
        ]
      },
      {
        id: 'bio-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Genética, Biotecnologia e Evolução',
        slug: 'modulo-4',
        descricao: 'Herança mendeliana, engenharia genética e a teoria sintética da evolução.',
        docs: [
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Genética Clássica: 1ª e 2ª Leis de Mendel e Grupos Sanguíneos' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Genética Molecular e Biotecnologia (CRISPR, Clonagem, PCR)' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Teorias Evolutivas, Neodarwinismo e Mecanismos de Especiação' }
        ]
      },
      {
        id: 'bio-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Ecologia e Meio Ambiente',
        slug: 'modulo-5',
        descricao: 'Dinâmicas populacionais, ciclos globais da matéria e preservação de biomas.',
        docs: [
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'Fundamentos Ecológicos, Cadeias Alimentares e Dinâmica de Populações' },
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'Biomas Mundiais e Brasileiros, Ciclos Biogeoquímicos e Impactos Ambientais' }
        ]
      }
    ]
  },

  // 05 - PORTUGUÊS
  {
    id: '05',
    numero: '05',
    slug: '05-portugues',
    titulo: 'Português',
    descricao: 'Comunicação, Morfologia, Sintaxe do Período e Norma-Padrão.',
    modulos: [
      {
        id: 'por-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'A língua como sistema discursivo vivo e as variações linguísticas.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: O Que É Texto, Gramática e Variação Linguística' }
        ]
      },
      {
        id: 'por-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Comunicação, Tipologia e Semântica',
        slug: 'modulo-1',
        descricao: 'Funções da linguagem, coesão, coerência e figuras de linguagem.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Funções da Linguagem e Níveis de Registro' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Tipologias e Gêneros Textuais' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Mecanismos de Coesão e Coerência Textual' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Semântica: Significação das Palavras e Figuras de Linguagem' }
        ]
      },
      {
        id: 'por-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Morfologia I: O Sistema Nominal',
        slug: 'modulo-2',
        descricao: 'Estrutura das palavras, substantivos, adjetivos e classes associadas.',
        docs: [
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Estrutura e Processos de Formação de Palavras' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Substantivos, Adjetivos, Artigos e Numerais' }
        ]
      },
      {
        id: 'por-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Morfologia II: O Sistema Verbal e Conectivos',
        slug: 'modulo-3',
        descricao: 'Pronomes, flexões verbais e a lógica semântica dos conectivos.',
        docs: [
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Pronomes e Colocação Pronominal (Próclise, Ênclise, Mesóclise)' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Verbos: Tempos, Modos, Vozes e Irregularidades' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Advérbios, Preposições e Conjunções Coordenativas e Subordinativas' }
        ]
      },
      {
        id: 'por-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Sintaxe do Período Simples e Composto',
        slug: 'modulo-4',
        descricao: 'Termos da oração, coordenação e subordinação de orações.',
        docs: [
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Sintaxe do Período Simples: Termos Essenciais, Integrantes e Acessórios' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Sintaxe do Período Composto: Coordenação e Subordinação' }
        ]
      },
      {
        id: 'por-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Norma-Padrão: Regência, Concordância e Pontuação',
        slug: 'modulo-5',
        descricao: 'Regência nominal e verbal, crase, concordância gramatical e pontuação expressiva.',
        docs: [
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Regência Verbal, Regência Nominal e o Uso da Crase' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Concordância Verbal, Concordância Nominal e Pontuação' }
        ]
      }
    ]
  },

  // 06 - LITERATURA
  {
    id: '06',
    numero: '06',
    slug: '06-literatura',
    titulo: 'Literatura',
    descricao: 'Teoria Literária, Literatura Colonial, Século XIX e Modernismo.',
    modulos: [
      {
        id: 'lit-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'O pacto ficcional e a distinção entre texto literário e utilitário.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: O Que É Literatura e Como Ler Poesia e Prosa' }
        ]
      },
      {
        id: 'lit-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Literatura Medieval e Renascentista',
        slug: 'modulo-1',
        descricao: 'Trovadorismo, Teatro Humanista e o Classicismo camoniano.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Teoria da Literatura, Gêneros Literários e Versificação' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Trovadorismo, Humanismo e o Teatro de Gil Vicente' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Classicismo Renascentista e Camões' }
        ]
      },
      {
        id: 'lit-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'A Era Colonial Brasileira',
        slug: 'modulo-2',
        descricao: 'O Quinhentismo da terra, o Barroco baiano e o Arcadismo mineiro.',
        docs: [
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Quinhentismo e a Literatura de Informação' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Barroco: Gregório de Matos e Padre Antônio Vieira' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Arcadismo e Neoclassicismo: O Ciclo do Ouro' }
        ]
      },
      {
        id: 'lit-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'O Século XIX: Do Romantismo ao Simbolismo',
        slug: 'modulo-3',
        descricao: 'Nacionalismo romântico, a ironia de Machado de Assis e o Parnasianismo.',
        docs: [
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Romantismo: Gerações Poéticas e a Prosa Nacionalista' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Realismo (Machado de Assis) e Naturalismo (Aluísio Azevedo)' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Parnasianismo e Simbolismo' }
        ]
      },
      {
        id: 'lit-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'O Modernismo Brasileiro',
        slug: 'modulo-4',
        descricao: 'A Semana de 22, o romance de 30 e as revoluções linguísticas pós-45.',
        docs: [
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Pré-Modernismo e as Vanguardas Europeias' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Modernismo: 1ª Fase (1922–1930 - Ruptura)' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Modernismo: 2ª Fase (1930–1945 - Denúncia Social e Drummond)' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Modernismo: 3ª Fase (Pós-1945 - Rosa, Clarice e Cabral)' }
        ]
      },
      {
        id: 'lit-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Literatura Contemporânea',
        slug: 'modulo-5',
        descricao: 'Narrativas de resistência, crônica contemporânea e vozes plurais.',
        docs: [
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'Literatura de Resistência e Crônica Urbana' },
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'Tendências da Literatura Brasileira Contemporânea' }
        ]
      }
    ]
  },

  // 07 - HISTÓRIA GERAL
  {
    id: '07',
    numero: '07',
    slug: '07-historia-geral',
    titulo: 'História Geral',
    descricao: 'Antiguidade Clássica, Idade Média, Era Moderna e Século XX.',
    modulos: [
      {
        id: 'hg-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'Crítica documental, o ofício do historiador e convenções de periodização.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: O Trabalho do Historiador e a Periodização Histórica' }
        ]
      },
      {
        id: 'hg-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Antiguidade Oriental e Clássica',
        slug: 'modulo-1',
        descricao: 'Sociedades de regadio, democracia em Atenas e o Império Romano.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Pré-História e a Revolução Agrícola do Neolítico' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Sociedades Hidráulicas: Mesopotâmia e Egito Antigo' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Grécia Antiga: Democracia Ateniense, Esparta e Helenismo' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Roma Antiga: Monarquia, República e Império' }
        ]
      },
      {
        id: 'hg-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Idade Média Ocidental e Oriental',
        slug: 'modulo-2',
        descricao: 'A formação do feudalismo, expansão islâmica e o renascimento comercial.',
        docs: [
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Alta Idade Média, Reinos Bárbaros e a Sociedade Feudal' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Baixa Idade Média, Cruzadas, Peste Negra e Renascimento Urbano' }
        ]
      },
      {
        id: 'hg-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Idade Moderna e Iluminismo',
        slug: 'modulo-3',
        descricao: 'Grandes Navegações, absolutismo régio e as revoluções burguesas.',
        docs: [
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Renascimento Cultural e as Grandes Navegações' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Reformas Religiosas, Absolutismo e Mercantilismo' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Iluminismo e as Revoluções Burguesas (Inglesa e Francesa)' }
        ]
      },
      {
        id: 'hg-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'O Século XIX: Indústria e Imperialismo',
        slug: 'modulo-4',
        descricao: 'Revolução Industrial, movimentos operários e a partilha colonial.',
        docs: [
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Revoluções Industriais e as Doutrinas Sociais do Século XIX' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Nacionalismos, Unificações Tardia e Imperialismo/Neocolonialismo' }
        ]
      },
      {
        id: 'hg-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'O Século XX e o Mundo Contemporâneo',
        slug: 'modulo-5',
        descricao: 'Guerras mundiais, totalitarismos, Guerra Fria e a nova ordem global.',
        docs: [
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Primeira Guerra Mundial e a Revolução Russa de 1917' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Crise de 1929, Totalitarismos (Nazifascismo) e Segunda Guerra Mundial' },
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'Guerra Fria e a Nova Ordem Multipolar' }
        ]
      }
    ]
  },

  // 08 - HISTÓRIA DO BRASIL
  {
    id: '08',
    numero: '08',
    slug: '08-historia-do-brasil',
    titulo: 'História do Brasil',
    descricao: 'Brasil Colônia, Império, República Velha, Era Vargas e Nova República.',
    modulos: [
      {
        id: 'hb-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'A desconstrução dos mitos de origem e a historiografia nacional.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: O Método Histórico e as Fontes do Brasil' }
        ]
      },
      {
        id: 'hb-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'O Brasil Colonial (1500–1808)',
        slug: 'modulo-1',
        descricao: 'Economia agroexportadora açucareira, mineração e revoltas coloniais.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Período Pré-Colonial e Povos Originários' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Administração Colonial e a Economia Açucareira' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Expansão Territorial e o Século do Ouro' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Crise do Sistema Colonial e Revoltas Nativistas e Emancipacionistas' }
        ]
      },
      {
        id: 'hb-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'O Brasil Império (1808–1889)',
        slug: 'modulo-2',
        descricao: 'A corte no Rio, o primeiro e segundo reinados e o colapso monárquico.',
        docs: [
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'O Período Joanino e a Independência de 1822' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Primeiro Reinado e a Constituição de 1824' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Período Regencial e as Rebeliões Provinciais' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Segundo Reinado: Economia Cafeeira, Política e Guerra do Paraguai' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'O Processo Abolicionista e o Fim do Império' }
        ]
      },
      {
        id: 'hb-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'A República Velha e a Era Vargas (1889–1945)',
        slug: 'modulo-3',
        descricao: 'O coronelismo da República da Espada e a centralização do Estado Novo.',
        docs: [
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Primeira República: Coronelismo, Café com Leite e Revoltas' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'A Revolução de 1930 e a Revolução Constitucionalista de 1932' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Estado Novo, Centralização Varguista e a CLT' }
        ]
      },
      {
        id: 'hb-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Experiência Democrática e Ditadura Militar (1945–1985)',
        slug: 'modulo-4',
        descricao: 'O desenvolvimentismo de JK, a ruptura autoritária e a lenta reabertura.',
        docs: [
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'República Populista: De Dutra às Reformas de Base de Jango' },
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'O Golpe de 1964, Atos Institucionais (AI-5) e Repressão' },
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'O Milagre Econômico, Crise da Ditadura e Diretas Já' }
        ]
      },
      {
        id: 'hb-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'A Nova República (1985 até Hoje)',
        slug: 'modulo-5',
        descricao: 'Constituição de 1988, estabilização monetária e as tensões recentes.',
        docs: [
          { codigo: 'Doc 16', slug: 'doc-16', titulo: 'A Transição Democrática e a Constituição de 1988' },
          { codigo: 'Doc 17', slug: 'doc-17', titulo: 'Década de 1990: Impeachment de Collor e o Plano Real' },
          { codigo: 'Doc 18', slug: 'doc-18', titulo: 'O Brasil no Século XXI: Governos Recentes e Tensões Políticas' }
        ]
      }
    ]
  },

  // 09 - GEOGRAFIA
  {
    id: '09',
    numero: '09',
    slug: '09-geografia',
    titulo: 'Geografia',
    descricao: 'Geografia Física, Climatologia, Espaço Urbano, Agrário e Geopolítica.',
    modulos: [
      {
        id: 'geo-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'As categorias fundamentais da análise espacial e geográfica.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: Espaço Geográfico, Paisagem, Território e Lugar' }
        ]
      },
      {
        id: 'geo-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Geografia Física e Dinâmica da Terra',
        slug: 'modulo-1',
        descricao: 'Projeções cartográficas, relevo terrestre e os tipos de solo.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Cartografia, Projeções e Geotecnologias' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Geologia, Tectônica de Placas e Geomorfologia' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Pedologia (Solos) e Impactos Ambientais do Manejo' }
        ]
      },
      {
        id: 'geo-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Sistemas Naturais: Clima e Água',
        slug: 'modulo-2',
        descricao: 'Dinâmica das massas de ar, bacias hidrográficas e biomas terrestres.',
        docs: [
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Climatologia Dinâmica e Fenômenos Climáticos Globais' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Hidrografia: Bacias Hidrográficas e Recursos Hídricos' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Biogeografia e os Grandes Domínios Morfoclimáticos' }
        ]
      },
      {
        id: 'geo-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Demografia e Espaço Urbano',
        slug: 'modulo-3',
        descricao: 'Pirâmides etárias, fluxos migratórios e o fenômeno da metropolização.',
        docs: [
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Demografia: Teorias Populacionais, Transição e Pirâmides Etárias' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Migrações Mundiais e Dinâmicas Populacionais no Brasil' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'O Espaço Urbano: Metropolização, Gentrificação e Desafios Urbanos' }
        ]
      },
      {
        id: 'geo-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Espaço Econômico: Campo e Indústria',
        slug: 'modulo-4',
        descricao: 'Modelos agrários, desconcentração industrial e matrizes de energia.',
        docs: [
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'O Espaço Agrário: Modernização Agrícola e Estrutura Fundiária' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Indústria, Modelos Produtivos e Matrizes Energéticas' }
        ]
      },
      {
        id: 'geo-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Geopolítica e Globalização',
        slug: 'modulo-5',
        descricao: 'A circulação do capital mundial, blocos regionais e conflitos de poder.',
        docs: [
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Globalização, Redes e a Divisão Internacional do Trabalho' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Tensões Geopolíticas Contemporâneas e Blocos Econômicos' }
        ]
      }
    ]
  },

  // 10 - FILOSOFIA
  {
    id: '10',
    numero: '10',
    slug: '10-filosofia',
    titulo: 'Filosofia',
    descricao: 'Filosofia Antiga, Medieval, Moderna, Iluminismo e Contemporânea.',
    modulos: [
      {
        id: 'fil-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'Conceitos centrais de ontologia, epistemologia e ética.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: O Sentido da Filosofia e Glossário Epistemológico' }
        ]
      },
      {
        id: 'fil-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Filosofia Antiga',
        slug: 'modulo-1',
        descricao: 'A cosmologia pré-socrática, a tríade ateniense e as escolas helenísticas.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Do Mito ao Logos e os Filósofos Pré-Socráticos' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Sócrates e a Maiêutica vs. O Relativismo Sofista' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Platão: O Mundo das Ideias e a Política Ideal' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Aristóteles: Metafísica, Lógica e Ética da Justa Medida' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Filosofias Helenísticas: Estoicismo, Epicurismo e Ceticismo' }
        ]
      },
      {
        id: 'fil-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Filosofia Medieval e Renascentista',
        slug: 'modulo-2',
        descricao: 'O concílio da fé com a razão e a autonomia do poder político.',
        docs: [
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Patrística (Santo Agostinho) e Escolástica (São Tomás de Aquino)' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'O Renascimento e o Realismo Político de Maquiavel' }
        ]
      },
      {
        id: 'fil-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Filosofia Moderna e Iluminismo',
        slug: 'modulo-3',
        descricao: 'O debate epistêmico moderno, o contrato social e a ética kantiana.',
        docs: [
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Racionalismo (Descartes) vs. Empirismo (Locke e Hume)' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Os Filósofos Contratualistas: Hobbes, Locke e Rousseau' },
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'O Criticismo e a Ética do Dever em Immanuel Kant' }
        ]
      },
      {
        id: 'fil-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'O Século XIX e a Crise da Razão',
        slug: 'modulo-4',
        descricao: 'O idealismo hegeliano, o materialismo e as filosofias da vontade.',
        docs: [
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Hegel e a Dialética Idealista' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Marx e o Materialismo Histórico-Dialético' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Schopenhauer, Kierkegaard e as Filosofias da Vontade' },
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'Friedrich Nietzsche: Niilismo, Vontade de Poder e Além-do-Homem' }
        ]
      },
      {
        id: 'fil-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Filosofia Contemporânea',
        slug: 'modulo-5',
        descricao: 'Existencialismo, Teoria Crítica e a microfísica das relações de poder.',
        docs: [
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'Fenomenologia e Existencialismo: Sartre e Camus' },
          { codigo: 'Doc 16', slug: 'doc-16', titulo: 'A Teoria Crítica da Escola de Frankfurt' },
          { codigo: 'Doc 17', slug: 'doc-17', titulo: 'Foucault e as Microrrelações de Poder e Biopolítica' },
          { codigo: 'Doc 18', slug: 'doc-18', titulo: 'Ética Contemporânea, Justiça (Rawls) e Hannah Arendt' }
        ]
      }
    ]
  },

  // 11 - SOCIOLOGIA
  {
    id: '11',
    numero: '11',
    slug: '11-sociologia',
    titulo: 'Sociologia',
    descricao: 'Teorias Clássicas, Cultura, Cidadania, Mundo do Trabalho e Pensamento Social.',
    modulos: [
      {
        id: 'soc-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'A imaginação sociológica e a superação do senso comum.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: A Imaginação Sociológica e o Olhar Crítico' }
        ]
      },
      {
        id: 'soc-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'O Surgimento da Ciência Social e os Clássicos',
        slug: 'modulo-1',
        descricao: 'O positivismo fundacional e as matrizes de Durkheim, Weber e Marx.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Positivismo e a Física Social de Auguste Comte' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Émile Durkheim: O Fato Social e a Coesão' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Max Weber: Ação Social, Burocracia e Dominação' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Karl Marx: Luta de Classes, Alienação e Mais-Valia' }
        ]
      },
      {
        id: 'soc-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Cultura, Identidade e Socialização',
        slug: 'modulo-2',
        descricao: 'O conceito antropológico de cultura, instituições e relações étnico-raciais.',
        docs: [
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Antropologia e Conceito de Cultura: Etnocentrismo vs. Relativismo' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Instituições Sociais e Processos de Socialização' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Estruturas de Gênero, Etnia e Racismo Estrutural' }
        ]
      },
      {
        id: 'soc-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Poder, Estado e Cidadania',
        slug: 'modulo-3',
        descricao: 'Teorias do poder legítimo, direitos de cidadania e movimentos sociais.',
        docs: [
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'O Estado Moderno, Cidadania e Movimentos Sociais' }
        ]
      },
      {
        id: 'soc-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Mundo do Trabalho e Desigualdades',
        slug: 'modulo-4',
        descricao: 'Os modelos industriais, a precarização do trabalho e o modelo de plataformas.',
        docs: [
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'As Mutações no Mundo do Trabalho: Do Fordismo à Uberização' }
        ]
      },
      {
        id: 'soc-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Pensamento Social Brasileiro e Sociologia Recente',
        slug: 'modulo-5',
        descricao: 'Os fundadores do pensamento brasileiro e as teorias da fluidez social.',
        docs: [
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Pensamento Social Brasileiro: Freyre, Sérgio Buarque e Florestan' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Sociologia Contemporânea: Bauman, Bourdieu e a Sociedade em Rede' }
        ]
      }
    ]
  },

  // 12 - HISTÓRIA DA ARTE
  {
    id: '12',
    numero: '12',
    slug: '12-historia-da-arte',
    titulo: 'História da Arte',
    descricao: 'Arte Antiga, Renascimento, Barroco, Vanguardas Modernas e Contemporânea.',
    modulos: [
      {
        id: 'art-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'Gramática visual básica, elementos compositivos e hermenêutica da imagem.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: O Que É Arte, Elementos Visuais e Leitura de Imagem' }
        ]
      },
      {
        id: 'art-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Da Pré-História à Antiguidade Clássica',
        slug: 'modulo-1',
        descricao: 'A arte parietal, o cânone monumental egípcio e a harmonia grega.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Arte na Pré-História: Pinturas Rupestres e Esculturas Paleolíticas' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'A Rigidez Funerária Egípcia e a Arquitetura da Mesopotâmia' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Arte Grega (Harmonia e Proporção) e Engenharia Pragmática Romana' }
        ]
      },
      {
        id: 'art-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Da Idade Média ao Iluminismo',
        slug: 'modulo-2',
        descricao: 'O vitral gótico, a perspectiva renascentista e a intensidade dramática do barroco.',
        docs: [
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Arte Medieval: Mosaicos Bizantinos, Românico e Gótico' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'O Renascimento Artístico: Perspectiva Linear e os Grandes Mestres' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'O Drama Barroco Europeu e o Barroco Mineiro no Brasil' }
        ]
      },
      {
        id: 'art-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'O Século XIX: Academismo e Rupturas',
        slug: 'modulo-3',
        descricao: 'A austeridade neoclássica, o sentimento romântico e a luz dos impressionistas.',
        docs: [
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Rococó, Neoclassicismo e o Romantismo Visual' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Realismo, Impressionismo e Pós-Impressionismo' }
        ]
      },
      {
        id: 'art-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'As Vanguardas Modernas do Século XX',
        slug: 'modulo-4',
        descricao: 'A destruição da forma realista na Europa e o Modernismo de 1922 no Brasil.',
        docs: [
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'As Vanguardas Europeias: Cubismo, Fauvismo, Futurismo e Surrealismo' },
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Modernismo Visual Brasileiro e a Semana de 1922' }
        ]
      },
      {
        id: 'art-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Arte Pós-Guerra e Contemporânea',
        slug: 'modulo-5',
        descricao: 'Expressionismo abstrato, pop art, instalações e mídias digitais.',
        docs: [
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Expressionismo Abstrato e a Pop Art' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Arte Conceitual, Performances, Instalações e Arte Digital' }
        ]
      }
    ]
  },

  // 13 - LÍNGUA INGLESA
  {
    id: '13',
    numero: '13',
    slug: '13-lingua-inglesa',
    titulo: 'Língua Inglesa',
    descricao: 'Gramática Estrutural, Tempos Perfeitos, Sintaxe Avançada e Leitura Crítica.',
    modulos: [
      {
        id: 'ing-m0',
        numero: 0,
        tag: 'MODULE 0',
        titulo: 'Introduction',
        slug: 'modulo-0',
        descricao: 'A ordem canônica da frase em inglês e raciocínio direto no idioma.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Leveling: English Sentence Structure & Thinking in English' }
        ]
      },
      {
        id: 'ing-m1',
        numero: 1,
        tag: 'MODULE 1',
        titulo: 'Elementary Foundations (A1–A2)',
        slug: 'modulo-1',
        descricao: 'Pronomes, presentes simples e contínuos, verbos auxiliares e modais básicos.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Verb To Be, Personal Pronouns & Basic Descriptors' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Simple Present, Frequency Adverbs & Present Continuous' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Past Simple (Regular and Irregular Verbs) & Past Continuous' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Future Tenses: Will vs. Going To vs. Present Continuous' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Modal Verbs & Comparatives and Superlatives' }
        ]
      },
      {
        id: 'ing-m2',
        numero: 2,
        tag: 'MODULE 2',
        titulo: 'Intermediate Grammar (B1)',
        slug: 'modulo-2',
        descricao: 'A lógica dos tempos compostos com foco central no Present Perfect.',
        docs: [
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'The Present Perfect: Form, Use and Markers (For/Since/Already/Yet)' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Past Perfect & Future Perfect' }
        ]
      },
      {
        id: 'ing-m3',
        numero: 3,
        tag: 'MODULE 3',
        titulo: 'Advanced Syntax (B2)',
        slug: 'modulo-3',
        descricao: 'Orações condicionais, voz passiva e o mecanismo do discurso indireto.',
        docs: [
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Conditionals: Zero, First, Second, Third and Mixed Conditionals' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'The Passive Voice and Causative Forms' },
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'Reported Speech: Direct to Indirect Discourse' }
        ]
      },
      {
        id: 'ing-m4',
        numero: 4,
        tag: 'MODULE 4',
        titulo: 'Phrasal Verbs & Idiomatic Mastery',
        slug: 'modulo-4',
        descricao: 'A geometria das partículas preposicionais e colocações linguísticas.',
        docs: [
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Phrasal Verbs & Prepositions Logic' },
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'False Friends, Collocations and Semantic Nuances' }
        ]
      },
      {
        id: 'ing-m5',
        numero: 5,
        tag: 'MODULE 5',
        titulo: 'Academic Fluency & Critical Reading (C1)',
        slug: 'modulo-5',
        descricao: 'Conectivos formais, inversões enfáticas e análise crítica de textos.',
        docs: [
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'Formal Discourse Markers & Connectors' },
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Advanced Inversion and Cleft Sentences' },
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'Academic Reading, Essay Analysis & Critical Thinking' }
        ]
      }
    ]
  },

  // 14 - CIÊNCIA POLÍTICA E POLÍTICA BRASILEIRA
  {
    id: '14',
    numero: '14',
    slug: '14-ciencia-politica',
    titulo: 'Ciência Política e Política Brasileira',
    descricao: 'Teoria do Estado, Presidencialismo de Coalizão, Partidos e História Republicana.',
    modulos: [
      {
        id: 'pol-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'As definições institucionais de poder, soberania e a máquina governamental.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: O Conceito de Poder, Estado e as Regras do Jogo Político' }
        ]
      },
      {
        id: 'pol-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Teoria Política, Modelos de Estado e Ideologias',
        slug: 'modulo-1',
        descricao: 'Sistemas de governo, separação de poderes e as matrizes ideológicas.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Fundamentos do Estado e Formas de Governo' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Separação de Poderes e o Sistema de Freios e Contrapesos' },
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'As Grandes Matrizes Ideológicas: Liberalismo, Socialismo e Conservadorismo' }
        ]
      },
      {
        id: 'pol-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'As Engrenagens do Poder no Brasil',
        slug: 'modulo-2',
        descricao: 'Presidencialismo de coalizão, orçamento público, emendas e o STF.',
        docs: [
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'O Presidencialismo de Coalizão e a Dinâmica do Centrão' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'O Congresso Nacional e o Processo Legislativo Real' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'O Sistema Eleitoral, Partidos e Financiamento Público de Campanhas' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Orçamento Público, LDO/LOA e a Disputa das Emendas Parlamentares' },
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'O Judiciário e o Papel Constitucional do STF' }
        ]
      },
      {
        id: 'pol-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Da Redemocratização à Era PT (1985–2014)',
        slug: 'modulo-3',
        descricao: 'A Constituinte de 1987, impeachment de Collor, Plano Real e o Mensalão.',
        docs: [
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'Transição Democrática, a Constituinte de 1987 e a Constituição de 1988' },
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'A Era Collor, o Plano Econômico e o Primeiro Impeachment' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'Governo FHC, o Plano Real e as Reformas Estruturais' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'A Chegada do PT ao Poder, Políticas Sociais e o Mensalão' }
        ]
      },
      {
        id: 'pol-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Rupturas, Crises e a Nova Ordem Política (2013 em Diante)',
        slug: 'modulo-4',
        descricao: 'Jornadas de 2013, a Operação Lava Jato, impeachment de Dilma e polarização.',
        docs: [
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'As Jornadas de Junho de 2013 e a Crise de Representatividade' },
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'A Operação Lava Jato e os Impactos nas Elites Políticas e Econômicas' },
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'A Crise Econômica e o Impeachment de Dilma Rousseff' },
          { codigo: 'Doc 16', slug: 'doc-16', titulo: 'Governo Temer, Reformas e Tensões Políticas' },
          { codigo: 'Doc 17', slug: 'doc-17', titulo: 'A Ascensão do Bolsonarismo e a Nova Direita Brasileira' },
          { codigo: 'Doc 18', slug: 'doc-18', titulo: 'A Eleição de 2022, o 8 de Janeiro e os Desafios Democráticos Recentes' }
        ]
      },
      {
        id: 'pol-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Grupos de Pressão e Bastidores do Poder',
        slug: 'modulo-5',
        descricao: 'Frentes parlamentares, corporações estatais, militares e regulação da mídia.',
        docs: [
          { codigo: 'Doc 19', slug: 'doc-19', titulo: 'Bancadas Temáticas: Agronegócio, Segurança e Evangélica' },
          { codigo: 'Doc 20', slug: 'doc-20', titulo: 'Os Militares e as Forças de Segurança na Política' },
          { codigo: 'Doc 21', slug: 'doc-21', titulo: 'Mídia Tradicional, Big Techs e o Ecossistema das Redes Sociais' }
        ]
      }
    ]
  },

  // 15 - ANÁLISE DE DADOS
  {
    id: '15',
    numero: '15',
    slug: '15-analise-de-dados',
    titulo: 'Análise de Dados (Data Analytics & Science)',
    descricao: 'SQL Relacional, Python para Dados, Estatística Inferencial e Data Storytelling.',
    modulos: [
      {
        id: 'da-m0',
        numero: 0,
        tag: 'MÓDULO 0',
        titulo: 'Introdução',
        slug: 'modulo-0',
        descricao: 'O ciclo analítico, pensamento estruturado e a lógica de negócios orientada a dados.',
        docs: [
          { codigo: 'Doc 00', slug: 'doc-00', titulo: 'Nivelamento: O Ciclo de Vida do Dado e Pensamento Analítico' }
        ]
      },
      {
        id: 'da-m1',
        numero: 1,
        tag: 'MÓDULO 1',
        titulo: 'Fundamentos de Dados e Planilhas Avançadas',
        slug: 'modulo-1',
        descricao: 'Anatomia dos dados estruturados, princípios de Tidy Data e modelagem tabular.',
        docs: [
          { codigo: 'Doc 01', slug: 'doc-01', titulo: 'Anatomia do Dado, Tipologias e Paradigma Tidy Data' },
          { codigo: 'Doc 02', slug: 'doc-02', titulo: 'Planilhas Avançadas: Manipulação de Dados, Fórmulas Lógicas e Tabelas Dinâmicas' }
        ]
      },
      {
        id: 'da-m2',
        numero: 2,
        tag: 'MÓDULO 2',
        titulo: 'Estatística e Probabilidade para Analistas',
        slug: 'modulo-2',
        descricao: 'Medidas de dispersão, distribuições teóricas, intervalos de confiança e testes A/B.',
        docs: [
          { codigo: 'Doc 03', slug: 'doc-03', titulo: 'Estatística Descritiva: Tendência Central, Variabilidade e Detecção de Outliers' },
          { codigo: 'Doc 04', slug: 'doc-04', titulo: 'Teoria das Probabilidades e Distribuições Contínuas e Discretas' },
          { codigo: 'Doc 05', slug: 'doc-05', titulo: 'Amostragem e Inferência Estatística: Intervalos de Confiança' },
          { codigo: 'Doc 06', slug: 'doc-06', titulo: 'Testes de Hipóteses, p-Valor e Desenho de Testes A/B' },
          { codigo: 'Doc 07', slug: 'doc-07', titulo: 'Análise de Correlação e Modelos de Regressão Linear Simples' }
        ]
      },
      {
        id: 'da-m3',
        numero: 3,
        tag: 'MÓDULO 3',
        titulo: 'Bancos de Dados Relacionais e SQL',
        slug: 'modulo-3',
        descricao: 'Modelagem relacional, agregações, filtros, junções complexas e Window Functions.',
        docs: [
          { codigo: 'Doc 08', slug: 'doc-08', titulo: 'Modelagem Relacional, Chaves Primárias/Estrangeiras e Data Warehousing' },
          { codigo: 'Doc 09', slug: 'doc-09', titulo: 'SQL Básico: Consultas, Filtros e Ordenação (SELECT, WHERE, ORDER BY)' },
          { codigo: 'Doc 10', slug: 'doc-10', titulo: 'SQL Intermediário: Agregações e Agrupamentos (GROUP BY, HAVING, CASE WHEN)' },
          { codigo: 'Doc 11', slug: 'doc-11', titulo: 'SQL Avançado I: Cruzamento de Dados com Todos os Tipos de JOINs' },
          { codigo: 'Doc 12', slug: 'doc-12', titulo: 'SQL Avançado II: CTEs (WITH) e Funções de Janela (Window Functions)' }
        ]
      },
      {
        id: 'da-m4',
        numero: 4,
        tag: 'MÓDULO 4',
        titulo: 'Programação e Análise com Python',
        slug: 'modulo-4',
        descricao: 'Vetorização numérica com NumPy, DataFrames com Pandas e análise exploratória.',
        docs: [
          { codigo: 'Doc 13', slug: 'doc-13', titulo: 'Fundamentos da Linguagem Python para Manipulação de Dados' },
          { codigo: 'Doc 14', slug: 'doc-14', titulo: 'Vetorização e Álgebra Computacional com a Biblioteca NumPy' },
          { codigo: 'Doc 15', slug: 'doc-15', titulo: 'Manipulação Estruturada de Dados com Pandas (Series e DataFrames)' },
          { codigo: 'Doc 16', slug: 'doc-16', titulo: 'Transformação, Limpeza, Tratamento de Nulos e Junções no Pandas' },
          { codigo: 'Doc 17', slug: 'doc-17', titulo: 'Estratégias de Análise Exploratória de Dados (EDA)' }
        ]
      },
      {
        id: 'da-m5',
        numero: 5,
        tag: 'MÓDULO 5',
        titulo: 'Visualização, BI e Métricas de Negócio',
        slug: 'modulo-5',
        descricao: 'Princípios visuais de Gestalt, visualização programática, KPIs de negócio e Machine Learning básico.',
        docs: [
          { codigo: 'Doc 18', slug: 'doc-18', titulo: 'Teoria da Visualização, Percepção Humana e Princípios de Gestalt' },
          { codigo: 'Doc 19', slug: 'doc-19', titulo: 'Visualização Programática com Matplotlib e Seaborn' },
          { codigo: 'Doc 20', slug: 'doc-20', titulo: 'Ferramentas de BI (Power BI/Tableau): Modelagem Dimensional e DAX' },
          { codigo: 'Doc 21', slug: 'doc-21', titulo: 'Data Storytelling e Comunicação Estratégica para Decisores' },
          { codigo: 'Doc 22', slug: 'doc-22', titulo: 'Principais KPIs e Métricas de Negócios (LTV, CAC, Churn, Cohorts)' },
          { codigo: 'Doc 23', slug: 'doc-23', titulo: 'Noções Básicas de Aprendizado de Máquina Supervisionado e Não Supervisionado' }
        ]
      }
    ]
  }
];

export function getDisciplinaBySlug(slug: string): Disciplina | undefined {
  return DISCIPLINAS.find((d) => d.slug === slug);
}

export function getModuloBySlugs(disciplinaSlug: string, moduloSlug: string): { disciplina: Disciplina; modulo: Modulo } | undefined {
  const disciplina = getDisciplinaBySlug(disciplinaSlug);
  if (!disciplina) return undefined;
  const modulo = disciplina.modulos.find((m) => m.slug === moduloSlug);
  if (!modulo) return undefined;
  return { disciplina, modulo };
}