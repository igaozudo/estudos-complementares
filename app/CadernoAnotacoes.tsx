'use client';

import { useState, useEffect, useRef } from 'react';

interface PaginaCaderno {
  id: number;
  texto: string;
  desenho: string; // Base64 do desenho desta página específica
}

export default function CadernoAnotacoes() {
  const [aberto, setAberto] = useState(false);
  const [ferramenta, setFerramenta] = useState<'texto' | 'caneta'>('texto');
  
  // Sistema de Múltiplas Páginas
  const [paginas, setPaginas] = useState<PaginaCaderno[]>([
    { id: 1, texto: '', desenho: '' },
  ]);
  const [paginaAtivaIdx, setPaginaAtivaIdx] = useState(0);

  // Lápis / Grafite
  const [corAtiva, setCorAtiva] = useState('#18181b'); // Grafite escuro
  const [espessura, setEspessura] = useState(2);
  const [isBorracha, setIsBorracha] = useState(false);
  const [desenhando, setDesenhando] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [confirmarLimpeza, setConfirmarLimpeza] = useState(false);

  // Paleta de cores para folha branca
  const cores = [
    { nome: 'Grafite Preto', hex: '#18181b' },
    { nome: 'Azul Caneta', hex: '#2563eb' },
    { nome: 'Vermelho Correção', hex: '#dc2626' },
    { nome: 'Verde Observação', hex: '#16a34a' },
    { nome: 'Amarelo Marca-texto', hex: '#ca8a04' },
  ];

  // Carrega páginas salvas do navegador
  useEffect(() => {
    const salvas = localStorage.getItem('@caderno_paginas_v3');
    if (salvas) {
      try {
        const parsed = JSON.parse(salvas);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPaginas(parsed);
        }
      } catch (err) {
        console.error('Erro ao restaurar páginas do caderno:', err);
      }
    }

    // Listener para receber questões salvas do site
    const handleAdicionarAoCaderno = (e: CustomEvent<string>) => {
      setPaginas((prev) => {
        const novas = [...prev];
        const atual = novas[paginaAtivaIdx] || novas[0];
        atual.texto = atual.texto ? `${atual.texto}\n\n---\n${e.detail}` : e.detail;
        localStorage.setItem('@caderno_paginas_v3', JSON.stringify(novas));
        return novas;
      });
      setFerramenta('texto');
      setAberto(true);
    };

    window.addEventListener('adicionar-caderno' as any, handleAdicionarAoCaderno);
    return () => {
      window.removeEventListener('adicionar-caderno' as any, handleAdicionarAoCaderno);
    };
  }, [paginaAtivaIdx]);

  // Salva o desenho atual no array da página ativa
  const salvarDesenhoPaginaAtual = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    
    setPaginas((prev) => {
      const novas = [...prev];
      if (novas[paginaAtivaIdx]) {
        novas[paginaAtivaIdx].desenho = dataUrl;
        localStorage.setItem('@caderno_paginas_v3', JSON.stringify(novas));
      }
      return novas;
    });
  };

  // Carrega o desenho da página ativa no canvas ao trocar de página ou abrir
  const carregarDesenhoPagina = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const desenho = paginas[index]?.desenho;

    if (desenho && desenho.length > 100) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = desenho;
    }
  };

  // Sincroniza dimensões do canvas 1:1 com a folha pautada
  useEffect(() => {
    if (!aberto) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;

      carregarDesenhoPagina(paginaAtivaIdx);
    }, 100);

    return () => clearTimeout(timer);
  }, [aberto, paginaAtivaIdx]);

  // Gerenciamento de Páginas
  const mudarPagina = (novoIdx: number) => {
    salvarDesenhoPaginaAtual();
    setPaginaAtivaIdx(novoIdx);
  };

  const adicionarNovaFolha = () => {
    salvarDesenhoPaginaAtual();
    const novaFolha: PaginaCaderno = {
      id: paginas.length + 1,
      texto: '',
      desenho: '',
    };
    const novas = [...paginas, novaFolha];
    setPaginas(novas);
    setPaginaAtivaIdx(novas.length - 1);
    localStorage.setItem('@caderno_paginas_v3', JSON.stringify(novas));
  };

  const excluirFolhaAtual = () => {
    if (paginas.length <= 1) {
      // Se tiver só uma, apenas limpa
      limparTudo();
      return;
    }
    const novas = paginas.filter((_, idx) => idx !== paginaAtivaIdx);
    setPaginas(novas);
    const novoIdx = Math.max(0, paginaAtivaIdx - 1);
    setPaginaAtivaIdx(novoIdx);
    localStorage.setItem('@caderno_paginas_v3', JSON.stringify(novas));
  };

  const handleTextoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valor = e.target.value;
    setPaginas((prev) => {
      const novas = [...prev];
      if (novas[paginaAtivaIdx]) {
        novas[paginaAtivaIdx].texto = valor;
        localStorage.setItem('@caderno_paginas_v3', JSON.stringify(novas));
      }
      return novas;
    });
  };

  // Coordenadas precisas de desenho
  const getCoordenadas = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const iniciarDesenho = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (ferramenta !== 'caneta') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordenadas(e);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isBorracha) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = espessura * 6;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.85; // Efeito grafite realista
      ctx.strokeStyle = corAtiva;
      ctx.lineWidth = espessura;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setDesenhando(true);
  };

  const desenhar = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!desenhando || ferramenta !== 'caneta') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordenadas(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const pararDesenho = () => {
    if (!desenhando) return;
    setDesenhando(false);
    salvarDesenhoPaginaAtual();
  };

  const limparApenasTracos = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    salvarDesenhoPaginaAtual();
    setConfirmarLimpeza(false);
  };

  const limparTudo = () => {
    setPaginas((prev) => {
      const novas = [...prev];
      if (novas[paginaAtivaIdx]) {
        novas[paginaAtivaIdx].texto = '';
        novas[paginaAtivaIdx].desenho = '';
      }
      localStorage.setItem('@caderno_paginas_v3', JSON.stringify(novas));
      return novas;
    });
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setConfirmarLimpeza(false);
  };

  // EXPORTAÇÃO COMPLETA: TODAS AS FOLHAS EM PÁGINAS A4 SEPARADAS
  const exportarPDF = () => {
    salvarDesenhoPaginaAtual(); // Garante o traço mais recente

    const janelaImpressao = window.open('', '_blank');
    if (!janelaImpressao) return;

    const dataFormatada = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const paginasHTML = paginas.map((pag, idx) => `
      <div class="folha-a4-impressao">
        <div class="cabecalho-folha">
          <div>
            <span class="cabecalho-titulo">ESTUDOS COMPLEMENTARES</span>
            <span> • FOLHA DE ANOTAÇÕES</span>
          </div>
          <div>${dataFormatada}</div>
        </div>

        <div class="conteudo-folha-pautada">
          <pre class="texto-folha">${pag.texto ? pag.texto.replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''}</pre>
          ${pag.desenho ? `<img class="desenho-folha" src="${pag.desenho}" />` : ''}
        </div>

        <div class="rodape-folha">
          <span>Arquivo Pessoal de Estudos</span>
          <span>Folha ${idx + 1} de ${paginas.length}</span>
        </div>
      </div>
    `).join('');

    janelaImpressao.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Caderno de Estudos - ${dataFormatada}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              color: #111827;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }
            .folha-a4-impressao {
              width: 100%;
              height: 1060px;
              display: flex;
              flex-direction: column;
              page-break-after: always;
              break-after: page;
              margin-bottom: 20px;
            }
            .cabecalho-folha {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #111827;
              padding-bottom: 6px;
              margin-bottom: 12px;
              font-size: 11px;
              letter-spacing: 1px;
              text-transform: uppercase;
              color: #4b5563;
            }
            .cabecalho-titulo {
              color: #111827;
              font-weight: bold;
            }
            .conteudo-folha-pautada {
              position: relative;
              width: 100%;
              flex: 1;
              background-color: #ffffff;
              border: 1px solid #d1d5db;
              border-radius: 2px;
              padding: 24px 32px;
              /* Linhas pautadas reais de caderno (32px) */
              background-image: repeating-linear-gradient(
                transparent,
                transparent 31px,
                #e5e7eb 31px,
                #e5e7eb 32px
              );
              background-size: 100% 32px;
              overflow: hidden;
            }
            .texto-folha {
              white-space: pre-wrap;
              font-family: inherit;
              font-size: 14px;
              line-height: 32px;
              color: #111827;
              margin: 0;
              padding: 0;
              position: relative;
              z-index: 1;
            }
            .desenho-folha {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 2;
              pointer-events: none;
              object-fit: fill;
            }
            .rodape-folha {
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 6px;
            }
          </style>
        </head>
        <body>
          ${paginasHTML}
        </body>
      </html>
    `);
    janelaImpressao.document.close();
    janelaImpressao.focus();

    setTimeout(() => {
      janelaImpressao.print();
    }, 300);
  };

  const paginaAtual = paginas[paginaAtivaIdx] || paginas[0];

  return (
    <>
      {/* Botão Flutuante (FAB) */}
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-6 right-6 z-40 bg-neutral-900 border border-neutral-700 hover:border-cyan-400 text-white px-4 py-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center gap-2.5 font-mono text-xs transition-all hover:scale-105 active:scale-95 group"
      >
        <span className="text-base">📓</span>
        <span className="group-hover:text-cyan-300 transition-colors">Caderno de Estudos</span>
        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-700">
          {paginas.length} {paginas.length === 1 ? 'folha' : 'folhas'}
        </span>
      </button>

      {/* Gaveta do Caderno */}
      {aberto && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0f0f0f] border-l border-neutral-800 h-full flex flex-col shadow-2xl">
            
            {/* 1. Barra Superior: Modos e Exportação */}
            <div className="p-3 border-b border-neutral-800 bg-[#141414] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-black p-1 border border-neutral-800 rounded">
                <button
                  onClick={() => setFerramenta('texto')}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    ferramenta === 'texto'
                      ? 'bg-neutral-800 text-white border border-neutral-600 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ⌨️ Digitar Texto
                </button>
                <button
                  onClick={() => setFerramenta('caneta')}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    ferramenta === 'caneta'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ✏️ Lápis & Desenho
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportarPDF}
                  className="px-2.5 py-1 text-[11px] font-mono border border-cyan-800 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors rounded"
                >
                  Exportar PDF ({paginas.length} {paginas.length === 1 ? 'pág' : 'págs'})
                </button>
                <button
                  onClick={() => setConfirmarLimpeza(true)}
                  className="px-2 py-1 text-[11px] font-mono border border-neutral-800 text-neutral-400 hover:text-red-400 transition-colors rounded"
                >
                  Limpar
                </button>
                <button
                  onClick={() => setAberto(false)}
                  className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white transition-colors text-sm font-mono ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 2. Barra de Navegação de Folhas (Página 1 de N) */}
            <div className="px-4 py-2 border-b border-neutral-800 bg-[#161616] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => mudarPagina(Math.max(0, paginaAtivaIdx - 1))}
                  disabled={paginaAtivaIdx === 0}
                  className="px-2 py-1 rounded border border-neutral-700 bg-neutral-900 text-neutral-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white"
                >
                  ◀ Anterior
                </button>
                
                <span className="font-bold text-white bg-black px-2.5 py-1 rounded border border-neutral-800">
                  Folha {paginaAtivaIdx + 1} de {paginas.length}
                </span>

                <button
                  onClick={() => mudarPagina(Math.min(paginas.length - 1, paginaAtivaIdx + 1))}
                  disabled={paginaAtivaIdx === paginas.length - 1}
                  className="px-2 py-1 rounded border border-neutral-700 bg-neutral-900 text-neutral-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white"
                >
                  Próxima ▶
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={adicionarNovaFolha}
                  className="px-2.5 py-1 rounded border border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 font-bold"
                >
                  + Nova Folha
                </button>
                {paginas.length > 1 && (
                  <button
                    onClick={excluirFolhaAtual}
                    className="px-2 py-1 rounded border border-neutral-800 text-neutral-500 hover:text-red-400"
                    title="Excluir esta folha"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>

            {/* 3. Barra de Cores do Lápis */}
            <div className={`px-4 py-2 border-b border-neutral-800 bg-[#111111] flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-opacity ${
              ferramenta === 'caneta' ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px] uppercase mr-1">Lápis:</span>
                {cores.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setCorAtiva(c.hex);
                      setIsBorracha(false);
                    }}
                    title={c.nome}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      !isBorracha && corAtiva === c.hex ? 'scale-125 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                
                <button
                  onClick={() => setIsBorracha(!isBorracha)}
                  className={`ml-2 px-2 py-0.5 rounded text-[11px] border transition-colors ${
                    isBorracha ? 'bg-amber-950 border-amber-600 text-amber-200 font-bold' : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  🧹 Borracha
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 text-[11px] uppercase">Traço:</span>
                {[
                  { label: 'Fino', val: 1.5 },
                  { label: 'Médio', val: 2.5 },
                  { label: 'Grosso', val: 5 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setEspessura(item.val)}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                      espessura === item.val ? 'border-cyan-500 bg-cyan-950 text-white font-bold' : 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aviso de Confirmação de Limpeza */}
            {confirmarLimpeza && (
              <div className="p-3 bg-red-950/40 border-b border-red-900/60 flex items-center justify-between text-xs font-mono text-red-200">
                <span>O que deseja apagar nesta folha?</span>
                <div className="flex gap-2">
                  <button onClick={limparApenasTracos} className="underline hover:text-white">Apenas Desenhos</button>
                  <button onClick={limparTudo} className="underline font-bold text-red-300 hover:text-white">Tudo (Texto + Desenhos)</button>
                  <button onClick={() => setConfirmarLimpeza(false)} className="text-neutral-400 hover:text-white ml-2">Cancelar</button>
                </div>
              </div>
            )}

            {/* 4. A FOLHA FÍSICA: O DESENHO E O TEXTO ESTÃO FIXOS NELA */}
            <div 
              className="flex-1 relative overflow-hidden bg-white shadow-inner m-3 rounded-sm border border-neutral-300"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)',
                backgroundAttachment: 'local',
              }}
            >
              <textarea
                value={paginaAtual.texto}
                onChange={handleTextoChange}
                disabled={ferramenta === 'caneta'}
                placeholder={`Folha ${paginaAtivaIdx + 1}: Digite suas anotações aqui. Quando preencher a folha, clique em "+ Nova Folha" lá em cima. As anotações com o lápis ficarão presas exatamente nesta página!`}
                className="w-full h-full p-8 bg-transparent text-neutral-900 placeholder-neutral-400 font-mono text-sm leading-[32px] focus:outline-none resize-none disabled:opacity-95"
              />

              <canvas
                ref={canvasRef}
                onMouseDown={iniciarDesenho}
                onMouseMove={desenhar}
                onMouseUp={pararDesenho}
                onMouseLeave={pararDesenho}
                onTouchStart={iniciarDesenho}
                onTouchMove={desenhar}
                onTouchEnd={pararDesenho}
                className={`absolute inset-0 w-full h-full ${
                  ferramenta === 'caneta' ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
                }`}
              />

              <div className="absolute bottom-3 right-4 text-[10px] font-mono text-neutral-600 pointer-events-none select-none bg-white/90 px-2.5 py-1 rounded border border-neutral-300 shadow-sm flex items-center gap-2">
                <span className="font-bold text-black">Folha {paginaAtivaIdx + 1}</span>
                <span>•</span>
                {ferramenta === 'caneta' ? (
                  <span className="text-cyan-700 font-bold">Lápis Ativo</span>
                ) : (
                  <span>Modo Digitação</span>
                )}
              </div>
            </div>

            {/* Rodapé com Informações */}
            <div className="p-3 border-t border-neutral-800 bg-[#141414] flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>{paginaAtual.texto.split(/\s+/).filter(Boolean).length} palavras nesta folha</span>
              <span className="text-neutral-400">Página {paginaAtivaIdx + 1} de {paginas.length} salva</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}