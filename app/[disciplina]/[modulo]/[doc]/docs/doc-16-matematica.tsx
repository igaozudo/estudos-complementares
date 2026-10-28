'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID CARTESIANO ANALÍTICO)
// =========================================================================
function LousaRascunho({ id }: { id: number }) {
  const [modo, setModo] = useState<'desenho' | 'texto'>('desenho');
  const [rascunhoTexto, setRascunhoTexto] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [desenhando, setDesenhando] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
  }, [modo]);

  const iniciarDesenho = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setDesenhando(true);
  };

  const desenhar = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!desenhando) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const pararDesenho = () => setDesenhando(false);

  const limparLousa = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="border border-neutral-800 bg-[#040404] rounded-sm overflow-hidden my-4 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Analítica #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Traçar Pontos e Retas
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Equações / Determinantes
          </button>
        </div>

        <button
          onClick={modo === 'desenho' ? limparLousa : () => setRascunhoTexto('')}
          className="text-[11px] text-neutral-500 hover:text-red-400 transition-colors uppercase"
        >
          Limpar Lousa
        </button>
      </div>

      <div className="relative bg-[#020202]">
        {modo === 'desenho' ? (
          <div
            className="relative w-full h-44 md:h-56 touch-none overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
              backgroundPosition: 'center center'
            }}
          >
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-600/40 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-neutral-600/40 -translate-x-1/2 pointer-events-none"></div>

            <canvas
              ref={canvasRef}
              width={700}
              height={220}
              onMouseDown={iniciarDesenho}
              onMouseMove={desenhar}
              onMouseUp={pararDesenho}
              onMouseLeave={pararDesenho}
              onTouchStart={iniciarDesenho}
              onTouchMove={desenhar}
              onTouchEnd={pararDesenho}
              className="w-full h-full cursor-crosshair block relative z-10"
            />
            <span className="absolute bottom-2 right-3 text-[10px] font-mono text-neutral-500 pointer-events-none select-none bg-black/50 px-2 py-1 rounded">
              Use a grade para plotar coordenadas e calcular a inclinação m = Δy/Δx
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Calcule d = √((Δx)² + (Δy)²), monte y - y₀ = m(x - x₀) ou a distância ponto-reta d = |Ax₀ + By₀ + C|/√(A² + B²)..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 16 - GEOMETRIA ANALÍTICA: PONTO E RETA
// =========================================================================
export default function Doc16Matematica() {
  // Simulador 1: Radar de Distância Euclidiana e Ponto Médio
  const [pontoAx, setPontoAx] = useState<number>(-3);
  const [pontoAy, setPontoAy] = useState<number>(-2);
  const [pontoBx, setPontoBx] = useState<number>(5);
  const [pontoBy, setPontoBy] = useState<number>(4);

  const deltaX = pontoBx - pontoAx;
  const deltaY = pontoBy - pontoAy;
  const distanciaAB = Math.hypot(deltaX, deltaY);
  const pontoMedioX = (pontoAx + pontoBx) / 2;
  const pontoMedioY = (pontoAy + pontoBy) / 2;

  // Simulador 2: Laboratório de Paralelismo e Perpendicularidade (m₁ · m₂ = -1)
  const [inclinacaoM1, setInclinacaoM1] = useState<number>(1.5);
  const [modoRelacao, setModoRelacao] = useState<'perpendicular' | 'paralela'>('perpendicular');

  const inclinacaoM2 = modoRelacao === 'perpendicular'
    ? (inclinacaoM1 !== 0 ? -1 / inclinacaoM1 : 0)
    : inclinacaoM1;

  // Exercícios Interativos
  const [selecao, setSelecao] = useState<{ [key: number]: number | null }>({ 1: null, 2: null, 3: null, 4: null });
  const [confirmadas, setConfirmadas] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false, 4: false });
  const [abrirResolucao, setAbrirResolucao] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false, 4: false });
  const [lousaAberta, setLousaAberta] = useState<{ [key: number]: boolean }>({ 1: true, 2: true, 3: true, 4: true });

  const escolher = (qId: number, optIdx: number) => {
    if (confirmadas[qId]) return;
    setSelecao((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const confirmar = (qId: number) => {
    if (selecao[qId] === null) return;
    setConfirmadas((prev) => ({ ...prev, [qId]: true }));
  };

  const resetar = (qId: number) => {
    setConfirmadas((prev) => ({ ...prev, [qId]: false }));
    setSelecao((prev) => ({ ...prev, [qId]: null }));
    setAbrirResolucao((prev) => ({ ...prev, [qId]: false }));
  };

  // Renderização segura de malha cartesiana SVG
  const renderizarGradeCartesiana = () => {
    const linhas = [];
    for (let i = -10; i <= 10; i++) {
      linhas.push(
        <g key={i}>
          <line x1={i * 12} y1={-120} x2={i * 12} y2={120} stroke="#222" strokeWidth="0.5" />
          <line x1={-120} y1={i * 12} x2={120} y2={i * 12} stroke="#222" strokeWidth="0.5" />
        </g>
      );
    }
    return linhas;
  };

  const questoes = [
    {
      id: 1,
      tema: 'Ponto Médio e Propriedade dos Paralelogramos',
      pergunta: 'Três vértices consecutivos de um paralelogramo ABCD no plano cartesiano são A(1, 2), B(5, 4) e C(7, 8). Quais são as coordenadas exatas do quarto vértice D?',
      opcoes: [
        { idx: 0, texto: 'A) D(3, 6)', correta: true },
        { idx: 1, texto: 'B) D(4, 5)', correta: false },
        { idx: 2, texto: 'C) D(2, 6)', correta: false },
        { idx: 3, texto: 'D) D(3, 7)', correta: false },
      ],
      explicacao: [
        'A elegância do ponto médio no paralelogramo:',
        '1. Propriedade geométrica fundamental: em qualquer paralelogramo, as diagonais cruzam-se exatamente nos seus pontos médios. O ponto médio da diagonal AC é rigorosamente idêntico ao ponto médio da diagonal BD.',
        '2. Ponto médio de AC: M_x = (x_A + x_C) / 2 = (1 + 7) / 2 = 4; M_y = (y_A + y_C) / 2 = (2 + 8) / 2 = 5. Logo, M(4, 5).',
        '3. Como M(4, 5) também é o ponto médio de BD: (x_B + x_D) / 2 = 4 → (5 + x_D) / 2 = 4 → 5 + x_D = 8 → x_D = 3.',
        '4. Para a coordenada y: (y_B + y_D) / 2 = 5 → (4 + y_D) / 2 = 5 → 4 + y_D = 10 → y_D = 6.',
        'As coordenadas do vértice D são (3, 6). Alternativa A correta!',
      ],
    },
    {
      id: 2,
      tema: 'Equação Geral da Reta e Ponto de Impacto',
      pergunta: 'Uma reta r passa pelo ponto P(2, -1) e possui inclinação angular com o eixo horizontal positiva de 45° (ou seja, m = tan 45° = 1). Qual é a equação geral dessa reta na forma Ax + By + C = 0?',
      opcoes: [
        { idx: 0, texto: 'A) x - y - 3 = 0', correta: true },
        { idx: 1, texto: 'B) x + y - 1 = 0', correta: false },
        { idx: 2, texto: 'C) x - y + 3 = 0', correta: false },
        { idx: 3, texto: 'D) 2x - y - 5 = 0', correta: false },
      ],
      explicacao: [
        'A fórmula fundamental do Ioiô-Mixôxô (y - y₀ = m(x - x₀)):',
        '1. Dados: ponto de passagem (x₀, y₀) = (2, -1) e coeficiente angular m = 1.',
        '2. Montando a equação fundamental: y - (-1) = 1 · (x - 2) → y + 1 = x - 2.',
        '3. Igualando a zero para obter a forma geral (Ax + By + C = 0):',
        '   x - y - 2 - 1 = 0 → x - y - 3 = 0.',
        'O coeficiente A = 1, B = -1 e C = -3. Alternativa A correta!',
      ],
    },
    {
      id: 3,
      tema: 'Perpendicularidade e Mediatriz de um Segmento',
      pergunta: 'Os pontos A(2, 1) e B(6, 5) determinam um segmento de reta AB. Deseja-se encontrar a equação da reta mediatriz desse segmento (a reta que é perpendicular a AB e passa pelo seu ponto médio exato). Qual é a equação reduzida dessa mediatriz?',
      opcoes: [
        { idx: 0, texto: 'A) y = -x + 7', correta: true },
        { idx: 1, texto: 'B) y = x - 1', correta: false },
        { idx: 2, texto: 'C) y = -x + 3', correta: false },
        { idx: 3, texto: 'D) y = -2x + 11', correta: false },
      ],
      explicacao: [
        'A união do ponto médio com o teorema da ortogonalidade (m₁ · m₂ = -1):',
        '1. Coeficiente angular do segmento AB: m_AB = (5 - 1) / (6 - 2) = 4 / 4 = 1.',
        '2. Condição de perpendicularidade: a mediatriz é ortogonal a AB, logo seu coeficiente angular é m_perp = -1 / m_AB = -1 / 1 = -1.',
        '3. Ponto médio de AB (onde a mediatriz corta o segmento): M = ((2 + 6)/2, (1 + 5)/2) = (4, 3).',
        '4. Montando a equação da mediatriz passando por M(4, 3) com inclinação m = -1:',
        '   y - 3 = -1 · (x - 4) → y - 3 = -x + 4 → y = -x + 7.',
        'A mediatriz tem equação reduzida y = -x + 7. Alternativa A impecável!',
      ],
    },
    {
      id: 4,
      tema: 'Distância de Ponto a Reta (Radar e Trajetória)',
      pergunta: 'Uma torre de telecomunicações está instalada na coordenada T(3, 4). Uma rodovia retilínea obedece à equação geral 3x + 4y + 5 = 0. Qual é a menor distância em linha reta da torre até a rodovia?',
      opcoes: [
        { idx: 0, texto: 'A) 6 unidades de comprimento', correta: true },
        { idx: 1, texto: 'B) 5 unidades de comprimento', correta: false },
        { idx: 2, texto: 'C) 30 unidades de comprimento', correta: false },
        { idx: 3, texto: 'D) 4,8 unidades de comprimento', correta: false },
      ],
      explicacao: [
        'A fórmula da distância mínima de ponto a reta:',
        '1. Fórmula: d(P, r) = |A·x₀ + B·y₀ + C| / √(A² + B²).',
        '2. Identificando os termos da reta: A = 3, B = 4, C = 5. Ponto da torre: (x₀, y₀) = (3, 4).',
        '3. Calculando o numerador em módulo: |3·(3) + 4·(4) + 5| = |9 + 16 + 5| = |30| = 30.',
        '4. Calculando o denominador (módulo do vetor normal): √(3² + 4²) = √(9 + 16) = √25 = 5.',
        '5. Distância final: d = 30 / 5 = 6 unidades de comprimento.',
        'A menor distância perpendicular da torre até a pista é de exatamente 6 unidades. Alternativa A!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 16 • Módulo 04: Geometria Analítica
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Geometria Analítica: <br />
          <span className="text-cyan-400 font-light">Ponto e Reta — A Ponte Algébrica do Espaço</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Metodológica: O Casamento da Álgebra com o Espaço
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Na Geometria Plana Euclidiana (Módulo 03), nós desenhávamos com régua e compasso. Na <strong>Geometria Analítica</strong>, nós substituímos o compasso pelas <strong>coordenadas cartesianas</strong>:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • O <strong>Ponto</strong> deixa de ser um pingo no papel e vira um par de instruções de navegação <span className="text-cyan-300">(x, y)</span>.
            </li>
            <li>
              • A <strong>Distância entre dois pontos</strong> nada mais é do que o <strong>Teorema de Pitágoras</strong> vestido com coordenadas (<span className="text-emerald-400">d² = Δx² + Δy²</span>).
            </li>
            <li>
              • A <strong>Reta</strong> deixa de ser um traço estático e vira uma <strong>equação de restrição</strong>: todo ponto (x, y) que pertence àquela reta satisfaz a mesma relação de inclinação <span className="text-white">y - y₀ = m(x - x₀)</span>.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: DISTÂNCIA EUCLIDIANA E PONTO MÉDIO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Métrica do Ponto: Distância Euclidiana e Ponto Médio
          </h2>
        </div>

        <p>
          Para medir a distância em linha reta entre dois pontos quaisquer <code className="text-cyan-300 font-mono font-bold">A(x_A, y_A)</code> e <code className="text-emerald-400 font-mono font-bold">B(x_B, y_B)</code>, você nunca precisa decorar uma fórmula nova. Basta enxergar o triângulo retângulo invisível no plano cartesiano:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. Distância Euclidiana (Pitágoras)</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-cyan-300 text-center">
              d(A, B) = √((x_B - x_A)² + (y_B - y_A)²)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O cateto horizontal é a variação <strong className="text-white">Δx = x_B - x_A</strong> e o cateto vertical é a variação <strong className="text-white">Δy = y_B - y_A</strong>. A distância é a hipotenusa.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">2. Ponto Médio (Centro de Massa)</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-emerald-300 text-center">
              M = ((x_A + x_B)/2, (y_A + y_B)/2)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O ponto médio é a <strong>média aritmética simples</strong>: a média dos passos em X dá o meio da rua, e a média das alturas em Y dá o andar intermediário.
            </p>
          </div>
        </div>

        {/* SIMULADOR INTERATIVO: RADAR DE DISTÂNCIA E PONTO MÉDIO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Radar Cartesiano de Distância e Ponto Médio
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Ajuste as coordenadas de A e B e observe o triângulo retângulo de Pitágoras se formar:
              </p>
            </div>

            <div className="text-xl font-mono text-cyan-300 font-bold bg-neutral-950 px-4 py-2 border border-neutral-800 rounded">
              d(A,B) = {distanciaAB.toFixed(2)} u
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* Controles de Coordenadas */}
            <div className="space-y-4">
              <div className="p-3 bg-black border border-cyan-900/40 rounded space-y-2">
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold block">Ponto A (x_A, y_A):</span>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 block">X_A: {pontoAx}</span>
                    <input
                      type="range" min="-8" max="0" step="1"
                      value={pontoAx}
                      onChange={(e) => setPontoAx(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Y_A: {pontoAy}</span>
                    <input
                      type="range" min="-6" max="2" step="1"
                      value={pontoAy}
                      onChange={(e) => setPontoAy(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-black border border-emerald-900/40 rounded space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">Ponto B (x_B, y_B):</span>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 block">X_B: {pontoBx}</span>
                    <input
                      type="range" min="1" max="8" step="1"
                      value={pontoBx}
                      onChange={(e) => setPontoBx(parseInt(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Y_B: {pontoBy}</span>
                    <input
                      type="range" min="0" max="6" step="1"
                      value={pontoBy}
                      onChange={(e) => setPontoBy(parseInt(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs flex justify-between items-center">
                <span className="text-neutral-400">Ponto Médio M:</span>
                <span className="text-white font-bold text-sm">M({pontoMedioX.toFixed(1)}, {pontoMedioY.toFixed(1)})</span>
              </div>
            </div>

            {/* Gráfico SVG Cartesiano */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="-120 -120 240 240" className="w-full h-full">
                {renderizarGradeCartesiana()}

                {/* Eixos Centrais */}
                <line x1="-120" y1="0" x2="120" y2="0" stroke="#666" strokeWidth="1" />
                <line x1="0" y1="-120" x2="0" y2="120" stroke="#666" strokeWidth="1" />

                {(() => {
                  const axSvg = pontoAx * 12;
                  const aySvg = -pontoAy * 12; // Inversão de Y no SVG
                  const bxSvg = pontoBx * 12;
                  const bySvg = -pontoBy * 12;
                  const mxSvg = pontoMedioX * 12;
                  const mySvg = -pontoMedioY * 12;

                  return (
                    <g>
                      {/* Triângulo Retângulo Invisível (Catetos Δx e Δy) */}
                      <line x1={axSvg} y1={aySvg} x2={bxSvg} y2={aySvg} stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3" />
                      <line x1={bxSvg} y1={aySvg} x2={bxSvg} y2={bySvg} stroke="#10b981" strokeWidth="1.5" strokeDasharray="3" />

                      {/* Segmento AB (Hipotenusa) */}
                      <line x1={axSvg} y1={aySvg} x2={bxSvg} y2={bySvg} stroke="#ffffff" strokeWidth="2.5" />

                      {/* Ponto A */}
                      <circle cx={axSvg} cy={aySvg} r="4" fill="#06b6d4" />
                      <text x={axSvg - 14} y={aySvg - 6} fill="#06b6d4" fontSize="10" fontFamily="monospace">A</text>

                      {/* Ponto B */}
                      <circle cx={bxSvg} cy={bySvg} r="4" fill="#10b981" />
                      <text x={bxSvg + 6} y={bySvg - 6} fill="#10b981" fontSize="10" fontFamily="monospace">B</text>

                      {/* Ponto Médio M */}
                      <circle cx={mxSvg} cy={mySvg} r="3.5" fill="#f59e0b" />
                      <text x={mxSvg + 6} y={mySvg + 12} fill="#f59e0b" fontSize="9" fontFamily="monospace">M</text>
                    </g>
                  );
                })()}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400">Δx = {deltaX}</span> | <span className="text-emerald-400">Δy = {deltaY}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: A ANATOMIA DA RETA (IOIÔ-MIXÔXÔ) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Alma da Reta: O Coeficiente Angular m e a Equação Fundamental
          </h2>
        </div>

        <p>
          O que define uma reta no plano? Apenas duas informações: <strong>uma âncora</strong> (um ponto por onde ela passa) e <strong>uma direção</strong> (o coeficiente angular m).
        </p>

        <p className="text-neutral-300">
          O <strong>coeficiente angular m</strong> mede a velocidade de subida ou descida (a tangente trigonométrica do ângulo de inclinação):
        </p>

        <div className="p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-sm text-center font-mono text-lg text-cyan-300 font-bold my-4">
          m = tan(θ) = Δy / Δx = (y_B - y_A) / (x_B - x_A)
        </div>

        <p className="text-neutral-300">
          Multiplicando cruzado essa definição para qualquer ponto genérico (x, y) da reta, nasce a equação mais famosa da Geometria Analítica:
        </p>

        <div className="p-6 border border-neutral-800 bg-[#070707] rounded-sm text-center my-4 space-y-2">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold tracking-wider">
            y - y₀ = m · (x - x₀)
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Conhecida popularmente como &quot;Ioiô-Mixôxô&quot; (a equação fundamental da reta)
          </p>
        </div>
      </section>

      {/* 4. PILAR 03: PERPENDICULARISMO (m₁ · m₂ = -1) COM SIMULADOR */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Posições Relativas: O Teorema da Ortogonalidade (m₁ · m₂ = -1)
          </h2>
        </div>

        <p>
          Duas retas não-verticais no plano podem ser <strong>paralelas</strong> (mesma inclinação) ou se cruzar em um ponto. Quando esse cruzamento forma exatamente <strong>90°</strong> (perpendiculares), acontece uma propriedade matemática:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 font-mono text-xs">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-cyan-400 font-bold uppercase text-sm block">1. Retas Paralelas (r // s)</span>
            <div className="text-white font-bold text-base">m_r = m_s</div>
            <p className="text-neutral-400 font-sans text-[11px] leading-relaxed">
              Subida idêntica no espaço. As retas nunca se encontram (ou são coincidentes).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-emerald-400 font-bold uppercase text-sm block">2. Retas Perpendiculares (r ⊥ s)</span>
            <div className="text-white font-bold text-base">m_r · m_s = -1  →  m_s = -1 / m_r</div>
            <p className="text-neutral-400 font-sans text-[11px] leading-relaxed">
              A inclinação da reta perpendicular é o <strong>oposto do inverso</strong> (se uma sobe 2, a outra desce 1/2).
            </p>
          </div>
        </div>

        {/* SIMULADOR INTERATIVO: LABORATÓRIO DE ORTOGONALIDADE */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: Ortogonalidade e Paralelismo
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Gire a reta r (Ciano) e veja a reta s (Esmeralda) responder em 90°:
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setModoRelacao('perpendicular')}
                  className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                    modoRelacao === 'perpendicular'
                      ? 'border-emerald-400 bg-emerald-950 text-emerald-200 font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  Perpendicular (⊥)
                </button>
                <button
                  onClick={() => setModoRelacao('paralela')}
                  className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                    modoRelacao === 'paralela'
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  Paralela (//)
                </button>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-cyan-400">m₁:</span>
                <input
                  type="range" min="-3" max="3" step="0.5"
                  value={inclinacaoM1}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setInclinacaoM1(val === 0 ? 0.5 : val);
                  }}
                  className="w-16 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold">{inclinacaoM1}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG das Retas se Cruzando */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="-120 -120 240 240" className="w-full h-full">
                {renderizarGradeCartesiana()}

                {/* Eixos */}
                <line x1="-120" y1="0" x2="120" y2="0" stroke="#555" strokeWidth="1" />
                <line x1="0" y1="-120" x2="0" y2="120" stroke="#555" strokeWidth="1" />

                {(() => {
                  // Reta 1 (Ciano): y = m1 * x
                  const x1A = -100;
                  const y1A = -inclinacaoM1 * x1A;
                  const x1B = 100;
                  const y1B = -inclinacaoM1 * x1B;

                  // Reta 2 (Esmeralda): y = m2 * x + offset
                  const offset = modoRelacao === 'paralela' ? 30 : 0;
                  const x2A = -100;
                  const y2A = -(inclinacaoM2 * x2A + offset);
                  const x2B = 100;
                  const y2B = -(inclinacaoM2 * x2B + offset);

                  return (
                    <g>
                      <line x1={x1A} y1={y1A} x2={x1B} y2={y1B} stroke="#06b6d4" strokeWidth="2.5" />
                      <line x1={x2A} y1={y2A} x2={x2B} y2={y2B} stroke="#10b981" strokeWidth="2.5" />
                      {modoRelacao === 'perpendicular' && (
                        <circle cx="0" cy="0" r="4" fill="#ffffff" />
                      )}
                    </g>
                  );
                })()}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400">m₁ = {inclinacaoM1}</span> | <span className="text-emerald-400">m₂ = {inclinacaoM2.toFixed(2)}</span>
              </div>
            </div>

            {/* Painel do Teorema da Ortogonalidade */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">1. Inclinação da Reta r (m₁):</div>
                <div className="text-cyan-400 font-bold text-sm">m₁ = {inclinacaoM1}</div>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">2. Inclinação da Reta s (m₂):</div>
                <div className="text-emerald-400 font-bold text-sm">
                  {modoRelacao === 'perpendicular' ? `m₂ = -1 / (${inclinacaoM1}) = ${inclinacaoM2.toFixed(2)}` : `m₂ = m₁ = ${inclinacaoM2.toFixed(2)}`}
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800 rounded text-center space-y-1">
                <div className="text-neutral-400 uppercase text-[10px]">Produto das Inclinações:</div>
                <div className="text-white font-bold text-base">
                  {modoRelacao === 'perpendicular' ? (
                    <span>{inclinacaoM1} · ({inclinacaoM2.toFixed(2)}) = <span className="text-emerald-400">-1.00 (90° Perfeito)</span></span>
                  ) : (
                    <span>m₁ = m₂ (Retas Paralelas que Nunca se Tocam)</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PILAR 04: DISTÂNCIA DE PONTO A RETA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Distância de Ponto a Reta: O Vetor Perpendicular Direto
          </h2>
        </div>

        <p>
          Qual é a menor distância entre um ponto <code className="text-cyan-300 font-mono">P(x₀, y₀)</code> e uma estrada retilínea com equação geral <code className="text-emerald-400 font-mono">Ax + By + C = 0</code>?
        </p>

        <p className="text-neutral-300">
          Você não precisa achar o ponto de colisão nem resolver um sistema linear. Basta aplicar o teste do vetor normal:
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-center my-6 space-y-2">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold tracking-wider">
            d(P, r) = |A·x₀ + B·y₀ + C| / √(A² + B²)
          </div>
          <p className="text-xs text-neutral-300 font-mono">
            O numerador avalia a equação da reta no ponto P (em módulo), e o denominador normaliza pela hipotenusa dos coeficientes √(A² + B²)
          </p>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine as Coordenadas e as Retas
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para plotar os pontos, verificar as diagonais do paralelogramo e calcular as distâncias perpendiculares antes de confirmar sua resposta!
          </p>
        </div>

        <div className="space-y-12">
          {questoes.map((q) => {
            const escolheu = selecao[q.id];
            const confirmou = confirmadas[q.id];
            const acertou = confirmou && escolheu !== null && q.opcoes[escolheu].correta;
            const lousaVisivel = lousaAberta[q.id];
            const resolucaoVisivel = abrirResolucao[q.id];

            return (
              <div key={q.id} className="border border-neutral-800 bg-[#080808] p-6 md:p-8 rounded-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    Desafio 0{q.id} • {q.tema}
                  </span>
                  <button
                    onClick={() => setLousaAberta((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                    className="text-xs font-mono text-neutral-400 hover:text-white transition-colors underline underline-offset-4 text-left"
                  >
                    {lousaVisivel ? 'Ocultar Lousa ▲' : 'Abrir Lousa de Trabalho ✏️ ▼'}
                  </button>
                </div>

                <p className="text-sm md:text-base text-neutral-200 font-light leading-relaxed">
                  {q.pergunta}
                </p>

                {/* Lousa Milimetrada Integrada */}
                {lousaVisivel && <LousaRascunho id={q.id} />}

                {/* Alternativas */}
                <div className="space-y-2 pt-2">
                  {q.opcoes.map((opt) => {
                    const isSelected = escolheu === opt.idx;
                    let visual = 'border-neutral-800 bg-black text-neutral-400 hover:border-neutral-600';

                    if (isSelected && !confirmou) {
                      visual = 'border-cyan-500 bg-cyan-950/20 text-white shadow-[0_0_10px_rgba(6,182,212,0.15)]';
                    } else if (confirmou) {
                      if (opt.correta) {
                        visual = 'border-emerald-500 bg-emerald-950/30 text-emerald-200 font-medium';
                      } else if (isSelected && !opt.correta) {
                        visual = 'border-red-500 bg-red-950/30 text-red-200';
                      } else {
                        visual = 'border-neutral-900 bg-black text-neutral-600 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={opt.idx}
                        onClick={() => escolher(q.id, opt.idx)}
                        disabled={confirmou}
                        className={`w-full text-left p-3.5 text-xs md:text-sm font-mono border transition-all rounded-sm flex items-center justify-between cursor-pointer disabled:cursor-default ${visual}`}
                      >
                        <span>{opt.texto}</span>
                        {confirmou && opt.correta && (
                          <span className="text-xs uppercase font-bold text-emerald-400">Resposta Certa ✓</span>
                        )}
                        {confirmou && isSelected && !opt.correta && (
                          <span className="text-xs uppercase font-bold text-red-400">Incorreto ✗</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-900">
                  <div className="flex items-center gap-3">
                    {!confirmou ? (
                      <button
                        onClick={() => confirmar(q.id)}
                        disabled={escolheu === null}
                        className="px-5 py-2 text-xs font-mono tracking-wider uppercase bg-white text-black font-semibold hover:bg-neutral-200 disabled:opacity-30 disabled:pointer-events-none transition-all rounded-sm"
                      >
                        Validar Resposta
                      </button>
                    ) : (
                      <button
                        onClick={() => resetar(q.id)}
                        className="px-4 py-2 text-xs font-mono tracking-wider uppercase border border-neutral-700 text-neutral-300 hover:border-neutral-400 hover:text-white transition-all rounded-sm"
                      >
                        Tentar de Novo ↺
                      </button>
                    )}

                    {confirmou && (
                      <span className={`text-xs font-mono font-medium ${acertou ? 'text-emerald-400' : 'text-red-400'}`}>
                        {acertou ? 'Raciocínio analítico cirúrgico!' : 'Atenção aos sinais e à ortogonalidade! Veja a dedução:'}
                      </span>
                    )}
                  </div>

                  {confirmou && (
                    <div className="flex items-center gap-4">
                      {/* Botão de Envio para o Caderno Global */}
                      <button
                        onClick={() => {
                          const conteudo = `[${q.tema}] Questão 0${q.id}\nEnunciado: ${q.pergunta}\n\nResolução Dedutiva:\n${q.explicacao.join('\n')}`;
                          window.dispatchEvent(new CustomEvent('adicionar-caderno', { detail: conteudo }));
                        }}
                        className="text-[11px] font-mono border border-cyan-800 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors px-3 py-1.5 rounded flex items-center gap-1.5"
                      >
                        <span>📓</span> Salvar no Caderno
                      </button>

                      <button
                        onClick={() => setAbrirResolucao((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className="text-xs font-mono tracking-wider uppercase text-neutral-400 hover:text-white transition-colors"
                      >
                        {resolucaoVisivel ? '▲ Fechar Explicação' : '▼ Ver Resolução Exata'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Explicação Mastigada */}
                {confirmou && resolucaoVisivel && (
                  <div className="p-5 border border-neutral-800 bg-[#040404] text-xs md:text-sm text-neutral-300 font-light space-y-2 leading-relaxed border-l-2 border-l-cyan-400">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-bold mb-1">
                      O Pulo do Gato Analítico:
                    </span>
                    {q.explicacao.map((paragrafo, pIdx) => (
                      <p key={pIdx}>{paragrafo}</p>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </section>

      {/* RODAPÉ DO CADERNO */}
      <footer className="mt-20 pt-10 border-t border-neutral-800 text-xs font-light text-neutral-500">
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 16:</p>
        <p className="leading-relaxed">
          Você construiu a fundação analítica da matemática. Tratar o espaço através de coordenadas, compreender a distância como a hipotenusa de Pitágoras e dominar o jogo de inclinações perpendiculares (m₁ · m₂ = -1) capacita você para resolver qualquer problema de alinhamento e navegação vetorial. No próximo caderno (<strong>Doc 17: Geometria Analítica - A Circunferência e Posições Relativas</strong>), aprenderemos a equacionar círculos no plano, identificar centros e raios de relance e calcular tangências com precisão milimétrica!
        </p>
      </footer>

    </article>
  );
}