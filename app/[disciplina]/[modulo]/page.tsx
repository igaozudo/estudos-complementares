import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModuloBySlugs, DISCIPLINAS } from '../../data/disciplinas';

interface PageProps {
  params: Promise<{ disciplina: string; modulo: string }>;
}

export async function generateStaticParams() {
  const paths: { disciplina: string; modulo: string }[] = [];
  
  DISCIPLINAS.forEach((d) => {
    d.modulos.forEach((m) => {
      paths.push({
        disciplina: d.slug,
        modulo: m.slug,
      });
    });
  });

  return paths;
}

export default async function ModuloPage({ params }: PageProps) {
  const { disciplina: dSlug, modulo: mSlug } = await params;
  const data = getModuloBySlugs(dSlug, mSlug);

  if (!data) {
    notFound();
  }

  const { disciplina, modulo } = data;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 md:px-16 max-w-5xl mx-auto font-sans">
      
      {/* Navegação Topo */}
      <nav className="mb-12 text-xs font-mono text-neutral-500 flex items-center gap-2 tracking-wider">
        <Link href="/" className="hover:text-white transition-colors">ESTUDOS</Link>
        <span>/</span>
        <Link href={`/${disciplina.slug}`} className="hover:text-white transition-colors uppercase">
          {disciplina.numero} - {disciplina.titulo}
        </Link>
        <span>/</span>
        <span className="text-white uppercase">{modulo.tag}</span>
      </nav>

      {/* Cabeçalho do Módulo */}
      <header className="mb-16 border-b border-neutral-800 pb-10">
        <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">
          {disciplina.titulo} • {modulo.tag}
        </span>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4">
          {modulo.titulo}
        </h1>
        <p className="text-neutral-400 text-sm md:text-base font-light max-w-2xl leading-relaxed">
          {modulo.descricao}
        </p>
      </header>

      {/* Grid de Cadernos / Documentos */}
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-6">
          Cadernos de Conteúdo Disponíveis ({modulo.docs.length})
        </span>

        {modulo.docs.map((doc) => (
          <Link
            key={doc.codigo}
            href={`/${disciplina.slug}/${modulo.slug}/${doc.slug}`}
            className="group block border border-neutral-800 bg-[#080808] p-6 hover:border-neutral-400 hover:bg-neutral-950 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-neutral-500 shrink-0 group-hover:text-white transition-colors">
                  [{doc.codigo}]
                </span>
                <h2 className="text-base font-normal text-neutral-200 group-hover:text-white transition-colors">
                  {doc.titulo}
                </h2>
              </div>
              
              <span className="text-xs font-mono tracking-wider uppercase text-neutral-500 group-hover:text-white transition-colors flex items-center gap-2">
                Acessar Caderno <span>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Rodapé do Módulo */}
      <footer className="mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-600 font-mono">
        <Link href={`/${disciplina.slug}`} className="hover:text-white transition-colors">
          ← VOLTAR PARA {disciplina.titulo.toUpperCase()}
        </Link>
        <span>{modulo.docs.length} CADERNOS PROGRAMADOS</span>
      </footer>

    </main>
  );
}