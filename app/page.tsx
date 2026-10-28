import Link from 'next/link';

interface Disciplina {
  id: string;
  numero: string;
  slug: string;
  titulo: string;
  descricao: string;
}

const DISCIPLINAS: Disciplina[] = [
  {
    id: '01',
    numero: '01',
    slug: '01-matematica',
    titulo: 'Matemática',
    descricao:
      'Aritmética, Álgebra, Funções, Geometria e Estruturas Avançadas.',
  },
  {
    id: '02',
    numero: '02',
    slug: '02-fisica',
    titulo: 'Física',
    descricao:
      'Mecânica Clássica, Termofísica, Óptica, Eletromagnetismo e Física Moderna.',
  },
  {
    id: '03',
    numero: '03',
    slug: '03-quimica',
    titulo: 'Química',
    descricao:
      'Química Geral, Físico-Química, Termoquímica e Química Orgânica.',
  },
  {
    id: '04',
    numero: '04',
    slug: '04-biologia',
    titulo: 'Biologia',
    descricao: 'Citologia, Fisiologia Humana, Genética, Evolução e Ecologia.',
  },
  {
    id: '05',
    numero: '05',
    slug: '05-portugues',
    titulo: 'Português',
    descricao: 'Comunicação, Morfologia, Sintaxe do Período e Norma-Padrão.',
  },
  {
    id: '06',
    numero: '06',
    slug: '06-literatura',
    titulo: 'Literatura',
    descricao:
      'Teoria Literária, Literatura Colonial, Século XIX e Modernismo.',
  },
  {
    id: '07',
    numero: '07',
    slug: '07-historia-geral',
    titulo: 'História Geral',
    descricao: 'Antiguidade Clássica, Idade Média, Era Moderna e Século XX.',
  },
  {
    id: '08',
    numero: '08',
    slug: '08-historia-do-brasil',
    titulo: 'História do Brasil',
    descricao:
      'Brasil Colônia, Império, República Velha, Era Vargas e Nova República.',
  },
  {
    id: '09',
    numero: '09',
    slug: '09-geografia',
    titulo: 'Geografia',
    descricao:
      'Geografia Física, Climatologia, Espaço Urbano, Agrário e Geopolítica.',
  },
  {
    id: '10',
    numero: '10',
    slug: '10-filosofia',
    titulo: 'Filosofia',
    descricao:
      'Filosofia Antiga, Medieval, Moderna, Iluminismo e Contemporânea.',
  },
  {
    id: '11',
    numero: '11',
    slug: '11-sociologia',
    titulo: 'Sociologia',
    descricao:
      'Teorias Clássicas, Cultura, Cidadania, Mundo do Trabalho e Pensamento Social.',
  },
  {
    id: '12',
    numero: '12',
    slug: '12-historia-da-arte',
    titulo: 'História da Arte',
    descricao:
      'Arte Antiga, Renascimento, Barroco, Vanguardas Modernas e Contemporânea.',
  },
  {
    id: '13',
    numero: '13',
    slug: '13-lingua-inglesa',
    titulo: 'Língua Inglesa',
    descricao:
      'Gramática Estrutural, Tempos Perfeitos, Sintaxe Avançada e Leitura Crítica.',
  },
  {
    id: '14',
    numero: '14',
    slug: '14-ciencia-politica',
    titulo: 'Ciência Política e Política Brasileira',
    descricao:
      'Teoria do Estado, Presidencialismo de Coalizão, Partidos e História Republicana.',
  },
  {
    id: '15',
    numero: '15',
    slug: '15-analise-de-dados',
    titulo: 'Análise de Dados (Data Analytics & Science)',
    descricao:
      'SQL Relacional, Python para Dados, Estatística Inferencial e Data Storytelling.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 md:px-16 max-w-7xl mx-auto">
      {/* Cabeçalho Minimalista Monocromático */}
      <header className="mb-16 border-b border-neutral-800 pb-12">
        <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-3">
          Arquivo Pessoal de Estudos
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
          Estudos Complementares
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl font-light leading-relaxed">
          Base de conhecimento estruturada do zero ao nível avançado. 15
          disciplinas organizadas por módulos progressivos.
        </p>
      </header>

      {/* Grid Minimalista com todas as 15 Matérias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800">
        {DISCIPLINAS.map((disciplina) => (
          <Link
            key={disciplina.id}
            href={`/${disciplina.slug}`}
            className="group bg-black p-8 flex flex-col justify-between hover:bg-neutral-950 transition-colors duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">
                  [{disciplina.numero}]
                </span>
                <span className="text-neutral-600 text-xs font-mono uppercase tracking-wider group-hover:text-neutral-300 transition-colors">
                  6 Módulos
                </span>
              </div>

              <h2 className="text-lg font-medium text-white mb-3 tracking-tight group-hover:underline underline-offset-4 decoration-neutral-600">
                {disciplina.titulo}
              </h2>

              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                {disciplina.descricao}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-500 group-hover:text-white transition-colors">
                Explorar Trilha
              </span>
              <span className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all text-sm">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-600 font-mono">
        <span>ESTUDOS COMPLEMENTARES</span>
        <span>15 DISCIPLINAS</span>
      </footer>
    </main>
  );
}
