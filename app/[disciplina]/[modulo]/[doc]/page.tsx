import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModuloBySlugs, DISCIPLINAS } from '../../../data/disciplinas';
import { CADERNOS_REGISTRADOS } from './docs';

interface PageProps {
  params: Promise<{ disciplina: string; modulo: string; doc: string }>;
}

export async function generateStaticParams() {
  const paths: { disciplina: string; modulo: string; doc: string }[] = [];
  
  DISCIPLINAS.forEach((d) => {
    d.modulos.forEach((m) => {
      m.docs.forEach((doc) => {
        paths.push({
          disciplina: d.slug,
          modulo: m.slug,
          doc: doc.slug,
        });
      });
    });
  });

  return paths;
}

export default async function DocumentoPage({ params }: PageProps) {
  const { disciplina: dSlug, modulo: mSlug, doc: docSlug } = await params;
  const data = getModuloBySlugs(dSlug, mSlug);

  if (!data) {
    notFound();
  }

  const { disciplina, modulo } = data;
  const documento = modulo.docs.find((item) => item.slug === docSlug);

  if (!documento) {
    notFound();
  }

  // Chave única para buscar no registro central
  const chaveDoc = `${dSlug}/${mSlug}/${docSlug}`;
  const ComponenteCaderno = CADERNOS_REGISTRADOS[chaveDoc];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 md:px-20 max-w-4xl mx-auto font-sans">
      
      {/* Navegação Topo (Breadcrumbs) */}
      <nav className="mb-12 text-xs font-mono text-neutral-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">ESTUDOS</Link>
        <span>/</span>
        <Link href={`/${disciplina.slug}`} className="hover:text-white transition-colors uppercase">
          {disciplina.numero} - {disciplina.titulo}
        </Link>
        <span>/</span>
        <Link href={`/${disciplina.slug}/${modulo.slug}`} className="hover:text-white transition-colors uppercase">
          {modulo.tag}
        </Link>
        <span>/</span>
        <span className="text-white uppercase">{documento.codigo}</span>
      </nav>

      {/* Cabeçalho do Documento */}
      <header className="mb-14 border-b border-neutral-800 pb-10">
        <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">
          {documento.codigo} • Caderno de Estudos Avançados
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4 leading-tight">
          {documento.titulo}
        </h1>
        <p className="text-neutral-400 text-sm font-light">
          {disciplina.titulo} • {modulo.tag}: {modulo.titulo}
        </p>
      </header>

      {/* Renderização Inteligente: Se existir componente registrado, exibe; senão, exibe em estruturação */}
      {ComponenteCaderno ? (
        <ComponenteCaderno />
      ) : (
        <div className="border border-neutral-800 bg-[#080808] p-12 text-center my-12 rounded-sm space-y-4">
          <span className="font-mono text-xs text-cyan-500 uppercase tracking-widest block">
            Caderno em Estruturação
          </span>
          <h2 className="text-lg text-white font-normal">
            {documento.titulo}
          </h2>
          <p className="text-neutral-400 text-sm font-light max-w-lg mx-auto leading-relaxed">
            A estrutura curricular e os objetivos pedagógicos deste caderno já estão mapeados na árvore de estudos. O conteúdo conceitual e a lousa interativa serão adicionados em breve.
          </p>
          <div className="pt-4">
            <span className="inline-block text-[11px] font-mono px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-500">
              ROTA: {chaveDoc}
            </span>
          </div>
        </div>
      )}

      {/* Navegação Inferior */}
      <footer className="mt-20 pt-8 border-t border-neutral-800 flex justify-between items-center text-xs font-mono text-neutral-500">
        <Link href={`/${disciplina.slug}/${modulo.slug}`} className="hover:text-white transition-colors">
          ← VOLTAR AO {modulo.tag}
        </Link>
        <span>{documento.codigo}</span>
      </footer>

    </main>
  );
}