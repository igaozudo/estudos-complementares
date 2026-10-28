import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDisciplinaBySlug, DISCIPLINAS } from '../data/disciplinas';

interface PageProps {
  params: Promise<{ disciplina: string }>;
}

export async function generateStaticParams() {
  return DISCIPLINAS.map((d) => ({
    disciplina: d.slug,
  }));
}

export default async function DisciplinaPage({ params }: PageProps) {
  const { disciplina: slug } = await params;
  const disciplina = getDisciplinaBySlug(slug);

  if (!disciplina) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 md:px-16 max-w-6xl mx-auto font-sans">
      
      {/* Navegação Breadcrumbs */}
      <nav className="mb-12 text-xs font-mono text-neutral-500 flex items-center gap-2 tracking-wider">
        <Link href="/" className="hover:text-white transition-colors">ESTUDOS</Link>
        <span>/</span>
        <span className="text-white uppercase">{disciplina.numero} - {disciplina.titulo}</span>
      </nav>

      {/* Cabeçalho */}
      <header className="mb-16 border-b border-neutral-800 pb-10">
        <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">
          Disciplina {disciplina.numero}
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
          {disciplina.titulo}
        </h1>
        <p className="text-neutral-400 text-sm md:text-base font-light max-w-2xl leading-relaxed">
          {disciplina.descricao}
        </p>
      </header>

      {/* Grid / Lista dos 6 Módulos */}
      <div className="space-y-6">
        {disciplina.modulos.map((mod) => (
          <div 
            key={mod.id} 
            className="border border-neutral-800 bg-[#080808] p-8 hover:border-neutral-600 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4 border-b border-neutral-900 pb-4">
              <div>
                <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase block mb-1">
                  {mod.tag}
                </span>
                <h2 className="text-xl font-medium text-white tracking-tight">
                  {mod.titulo}
                </h2>
              </div>
              <Link 
                href={`/${disciplina.slug}/${mod.slug}`}
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-400 hover:text-white transition-colors"
              >
                Abrir Módulo →
              </Link>
            </div>

            <p className="text-neutral-400 text-xs md:text-sm font-light mb-6 leading-relaxed">
              {mod.descricao}
            </p>

            {/* Lista dos Documentos planejados neste módulo */}
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-600 block mb-3">
                Cadernos Programados ({mod.docs.length}):
              </span>
              <ul className="space-y-2">
                {mod.docs.map((doc) => (
                  <li key={doc.codigo} className="flex items-baseline gap-3 text-xs font-light">
                    <span className="font-mono text-neutral-500 shrink-0">{doc.codigo}</span>
                    <span className="text-neutral-300">{doc.titulo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé da Matéria */}
      <footer className="mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-600 font-mono">
        <Link href="/" className="hover:text-white transition-colors">← RETORNAR AO ÍNDICE GERAL</Link>
        <span>{disciplina.modulos.length} MÓDULOS CADASTRADOS</span>
      </footer>

    </main>
  );
}