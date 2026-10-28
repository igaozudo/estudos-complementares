'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID CIRCULAR/CARTESIANO)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Geométrica #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Desenhar Círculos e Setores
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Decomposições
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
              Esboce coroas circulares, arcos e figuras compostas
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Subtraia áreas (Total - Vazia), use C = 2πR ou monte fatias de pizza com regra de três..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 12 - CÍRCULOS E ÁREAS DE FIGURAS PLANAS
// =========================================================================
export default function Doc12Matematica() {
  // Simulador 1: O Desenrolar da Roda (O DNA físico de Pi)
  const [raioRoda, setRaioRoda] = useState<number>(3); // Raio em unidades
  const circunferenciaRoda = 2 * Math.PI * raioRoda;
  const diametroRoda = 2 * raioRoda;

  // Simulador 2: Setor Circular e Coroa (A Fatiadora de Pizza)
  const [anguloSetor, setAnguloSetor] = useState<number>(60);
  const [raioExterno, setRaioExterno] = useState<number>(5);
  const [raioInterno, setRaioInterno] = useState<number>(2);

  // Cálculos Setor e Coroa
  const fracaoSetor = anguloSetor / 360;
  const areaCirculoCompleto = Math.PI * raioExterno * raioExterno;
  const areaSetor = fracaoSetor * areaCirculoCompleto;
  const comprimentoArco = fracaoSetor * (2 * Math.PI * raioExterno);
  const areaCoroa = Math.PI * (raioExterno * raioExterno - raioInterno * raioInterno);

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

  // Renderização segura de malha milimetrada SVG
  const renderizarMalhaSegura = () => {
    const linhas = [];
    for (let i = 0; i <= 10; i++) {
      linhas.push(
        <g key={i}>
          <line x1="0" y1={i * 20} x2="260" y2={i * 20} stroke="#222" strokeWidth="0.5" />
          <line x1={i * 26} y1="0" x2={i * 26} y2="200" stroke="#222" strokeWidth="0.5" />
        </g>
      );
    }
    return linhas;
  };

  const questoes = [
    {
      id: 1,
      tema: 'A Roda da Bicicleta e o Comprimento C = 2πR',
      pergunta: 'A roda de uma bicicleta urbana possui raio de 35 cm. Durante um percurso retilíneo, o velocímetro registra exatamente 1.000 voltas completas dessa roda no solo, sem derrapagem. Adotando π ≈ 3,14, qual foi a distância aproximada percorrida pelo ciclista?',
      opcoes: [
        { idx: 0, texto: 'A) 1.100 metros', correta: false },
        { idx: 1, texto: 'B) 2.198 metros (aprox. 2,2 km)', correta: true },
        { idx: 2, texto: 'C) 3.500 metros', correta: false },
        { idx: 3, texto: 'D) 700 metros', correta: false },
      ],
      explicacao: [
        'A física do giro da roda:',
        '1. Uma volta completa desenrola no chão exatamente o comprimento da sua circunferência: C = 2 · π · R.',
        '2. O raio é R = 35 cm = 0,35 m. Logo, o diâmetro é D = 0,70 m.',
        '3. Distância em 1 volta: C = 2 · 3,14 · 0,35 = 2,198 metros.',
        '4. Distância total em 1.000 voltas: 1.000 · 2,198 m = 2.198 metros (cerca de 2,2 km).',
        'Cada volta completa equivale a esticar uma fita métrica de 2,2 metros no asfalto. Alternativa B correta!',
      ],
    },
    {
      id: 2,
      tema: 'O Paradoxo da Corda ao Redor do Planeta',
      pergunta: 'Imagine que você envolveu todo o equador da Terra (raio R ≈ 6.400 km) com uma corda ajustada. Em seguida, você decide suspender essa corda a exatamente 1 metro de altura do chão em toda a volta do planeta, formando um anel concêntrico. Quantos metros adicionais de corda você precisará emendar para fechar o anel?',
      opcoes: [
        { idx: 0, texto: 'A) Vários quilômetros de corda, pois o planeta é gigantesco.', correta: false },
        { idx: 1, texto: 'B) Exatamente 2π metros (apenas cerca de 6,28 metros de corda a mais).', correta: true },
        { idx: 2, texto: 'C) Cerca de 64 metros de corda.', correta: false },
        { idx: 3, texto: 'D) Depende do valor exato do raio da Terra medido em satélite.', correta: false },
      ],
      explicacao: [
        'O contra-intuitivo e espetacular paradoxo da circunferência:',
        '1. Comprimento inicial da corda no solo: C₁ = 2 · π · R.',
        '2. Comprimento da corda elevada a 1 metro de altura: o novo raio é (R + 1). Logo: C₂ = 2 · π · (R + 1).',
        '3. A diferença de corda necessária é ΔC = C₂ - C₁:',
        '   ΔC = 2π(R + 1) - 2πR = 2πR + 2π(1) - 2πR = 2π · 1 ≈ 6,28 metros!',
        '4. O raio da Terra (R) se cancela completamente na álgebra! Seja amarrando uma bola de basquete, a Terra ou o Sol, elevar a cerca em 1 metro SEMPRE exige apenas 6,28 metros de material extra. Alternativa B!',
      ],
    },
    {
      id: 3,
      tema: 'Setor Circular: A Fatia de Pizza Proporcional',
      pergunta: 'Em uma pizzaria artesanal, uma pizza gigante circular de 60 cm de diâmetro (raio de 30 cm) é fatiada com cortes centrais exatos de 45° cada. Qual é a área exata de uma única fatia de pizza?',
      opcoes: [
        { idx: 0, texto: 'A) 112,5π cm²', correta: true },
        { idx: 1, texto: 'B) 225π cm²', correta: false },
        { idx: 2, texto: 'C) 45π cm²', correta: false },
        { idx: 3, texto: 'D) 900π cm²', correta: false },
      ],
      explicacao: [
        'Setor circular é proporcionalidade pura:',
        '1. Uma pizza inteira tem 360°. A fatia de 45° representa uma fração exata: 45° / 360° = 1/8 da pizza (ela foi cortada em 8 pedaços iguais).',
        '2. A área total da pizza inteira é: A_total = π · R² = π · (30)² = 900π cm².',
        '3. A área de uma fatia é 1/8 desse total: A_fatia = 900π ÷ 8 = 112,5π cm².',
        'Se usarmos π ≈ 3,14, isso dá cerca de 353 cm² de superfície por pedaço. Alternativa A correta!',
      ],
    },
    {
      id: 4,
      tema: 'O Método do Cortador de Biscoito (Áreas Hachuradas)',
      pergunta: 'Uma placa quadrada de aço com lado medindo 20 cm tem um furo circular cortado a laser perfeitamente no centro, de modo que o círculo tangencia os 4 lados do quadrado. O retalho restante que sobra nos 4 cantos da placa é descartado. Adotando π ≈ 3,14, qual é a área desse retalho descartado?',
      opcoes: [
        { idx: 0, texto: 'A) 400 cm²', correta: false },
        { idx: 1, texto: 'B) 86 cm²', correta: true },
        { idx: 2, texto: 'C) 124 cm²', correta: false },
        { idx: 3, texto: 'D) 43 cm²', correta: false },
      ],
      explicacao: [
        'A técnica universal de decomposição por subtração (O Cortador de Biscoito):',
        '1. Área total original (Quadrado): A_quadrado = L² = 20² = 400 cm².',
        '2. Dimensões do furo circular: como ele tangencia os lados, o diâmetro do círculo é igual ao lado do quadrado (20 cm). Logo, o raio é R = 10 cm.',
        '3. Área da peça retirada (Círculo): A_círculo = π · R² = 3,14 · 10² = 3,14 · 100 = 314 cm².',
        '4. Área do retalho que sobrou nos 4 cantos: A_retalho = A_quadrado - A_círculo = 400 - 314 = 86 cm².',
        'O círculo sempre ocupa cerca de 78,5% da área do quadrado circunscrito, sobrando exatamente 21,5% nos cantos (400 · 0,215 = 86 cm²). Alternativa B!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 12 • Encerramento do Módulo 03: Geometria Plana
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Círculos e Áreas Planas: <br />
          <span className="text-cyan-400 font-light">A Curvatura Contínua e o Cortador de Biscoito</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO: DA RETA À CURVA INFINITA */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Conceitual Deste Caderno: O Infinito sem Vértices
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Nos cadernos 10 e 11, lidamos com figuras de cantos afiados (triângulos, retângulos, polígonos). Agora entramos no <strong>domínio da curva contínua</strong>:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • O número <strong className="text-cyan-300 font-bold">π (Pi)</strong> não é um número mágico decorado (3,1415...): ele é uma <strong>constante física universal de proporção</strong>. Se você desenrolar qualquer aro no chão, o comprimento sempre terá exatamente pouco mais de 3 diâmetros.
            </li>
            <li>
              • A fórmula <strong className="text-emerald-400 font-bold">A = πR²</strong> não surgiu por decreto: é o resultado de fatiar uma pizza em infinitos pedacinhos e remontá-la como um paralelogramo de base πR e altura R.
            </li>
            <li>
              • O cálculo de áreas complexas não exige fórmulas complicadas: usa o <strong>Método do Cortador de Biscoito</strong> (Área Total Maior - Áreas Vazias Subtraídas).
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O DESENROLAR DA RODA E O DNA DE PI */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Circunferência vs Círculo: O Que Significa o Número π?
          </h2>
        </div>

        <p>
          Primeiro, a distinção que quase todos confundem: <strong>Circunferência</strong> é apenas a linha do contorno (o bambolê oco, que mede comprimento). <strong>Círculo</strong> é a região interna preenchida (a moeda sólida, que mede superfície/área).
        </p>

        <p className="text-neutral-300">
          O número <strong>π</strong> é a resposta à pergunta: <em>&quot;Quantos diâmetros cabem no contorno de uma roda?&quot;</em>. Em qualquer círculo do cosmos, seja uma célula microscópica ou a órbita de Júpiter:
        </p>

        <div className="p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-sm text-center font-mono text-lg text-cyan-300 font-bold my-4">
          π = Comprimento / Diâmetro = C / (2R) ≈ 3,14159...
        </div>

        {/* SIMULADOR INTERATIVO: O ODÔMETRO DA RODA */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: O Desenrolar da Roda
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere o raio da roda e veja o diâmetro se desdobrar exatamente 3,14 vezes no asfalto:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Raio (R):</span>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={raioRoda}
                onChange={(e) => setRaioRoda(parseFloat(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold w-12 text-center">{raioRoda} u</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG da Roda e Trilha no Solo */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[420px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 280 200" className="w-full h-full">
                {/* Linha do solo */}
                <line x1="10" y1="160" x2="270" y2="160" stroke="#555" strokeWidth="2" />
                
                {/* A Roda */}
                <circle
                  cx={40 + raioRoda * 12}
                  cy={160 - raioRoda * 12}
                  r={raioRoda * 12}
                  fill="rgba(6, 182, 212, 0.15)"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />

                {/* Raio e Centro */}
                <circle cx={40 + raioRoda * 12} cy={160 - raioRoda * 12} r="3" fill="#fff" />
                <line
                  x1={40 + raioRoda * 12}
                  y1={160 - raioRoda * 12}
                  x2={40 + raioRoda * 12}
                  y2={160}
                  stroke="#fff"
                  strokeWidth="1.5"
                />

                {/* Fita desenrolada no chão (C = 2*pi*R) proporcional */}
                <line
                  x1="20"
                  y1="168"
                  x2={Math.min(260, 20 + circunferenciaRoda * 7)}
                  y2="168"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                {/* Marcadores dos 3 Diâmetros desenrolados */}
                <circle cx="20" cy="168" r="3" fill="#10b981" />
                <circle cx={20 + diametroRoda * 7} cy="168" r="2.5" fill="#f59e0b" />
                <circle cx={20 + diametroRoda * 14} cy="168" r="2.5" fill="#f59e0b" />
                <circle cx={20 + diametroRoda * 21} cy="168" r="2.5" fill="#f59e0b" />

                <text x="25" y="185" fill="#10b981" fontSize="10" fontFamily="monospace">
                  Fita esticada: {circunferenciaRoda.toFixed(2)} unidades
                </text>
              </svg>

              <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400">Diâmetro: {diametroRoda} u</span> | <span className="text-emerald-400">1 volta = {circunferenciaRoda.toFixed(2)} u</span>
              </div>
            </div>

            {/* Painel do Significado Físico */}
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-black border border-neutral-800 rounded space-y-2">
                <span className="text-cyan-400 font-bold uppercase block">1. A Prova dos Três Diâmetros e Uns Quebrados:</span>
                <p className="text-neutral-300 font-sans font-light leading-relaxed">
                  Repare nos pontinhos amarelos na linha verde: ao esticar o pneu no chão, você consegue colocar exatamente <strong>3 diâmetros inteiros</strong> lado a lado, e ainda sobra uma beiradinha de <strong>0,1415...</strong> de diâmetro.
                </p>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded space-y-2">
                <span className="text-emerald-400 font-bold uppercase block">2. Fórmula do Contorno (Perímetro):</span>
                <p className="text-neutral-300 font-sans font-light leading-relaxed">
                  <strong className="text-white text-sm">C = 2 · π · R</strong>
                  <br />
                  Raio atual = {raioRoda} u → Perímetro exato = 2 · π · {raioRoda} = <strong className="text-emerald-300">{circunferenciaRoda.toFixed(2)} unidades de pista</strong>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: A FATIADORA DE PIZZA DE ARQUIMEDES (A = πR²) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Demonstração de Arquimedes: Por Que a Área é πR²?
          </h2>
        </div>

        <p>
          Por que a área do círculo leva o raio ao quadrado multiplicado por π? Arquimedes de Siracusa (287 a.C.) provou isso sem usar cálculo diferencial através da <strong>Fatiadora de Pizza</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. Fatiando o Círculo</span>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Corte uma pizza circular em 16 fatias triangulares muito finas. Desprenda as fatias do centro.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O perímetro de borda com queijo ao redor da pizza inteira é <strong className="text-white">2πR</strong>.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">2. Encaixando as Fatias</span>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Encaixe as fatias intercaladas: uma com a ponta apontada para cima, a vizinha apontada para baixo.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              A figura resultante vira quase um <strong>retângulo perfeito</strong>:
              <br />
              • A base do retângulo é metade da borda com queijo: <strong className="text-emerald-400">πR</strong>.
              <br />
              • A altura do retângulo é o comprimento da fatia (o raio): <strong className="text-cyan-400">R</strong>.
              <br />
              • Área do Retângulo = Base · Altura = (πR) · R = <strong className="text-white">πR²</strong>!
            </p>
          </div>
        </div>
      </section>

      {/* 4. PILAR 03: SETOR CIRCULAR E COROA (EXPLORADOR DINÂMICO) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Setores, Arcos e Coroas Circulares
          </h2>
        </div>

        <p>
          Você nunca precisa decorar as fórmulas de setor circular. Um setor nada mais é do que uma <strong>fatia proporcional de pizza</strong> governada pelo ângulo central θ:
        </p>

        {/* SIMULADOR INTERATIVO: SETOR E COROA CIRCULAR */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Laboratório de Setores e Coroas
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Ajuste o ângulo da fatia e os raios externo e interno:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-cyan-400">Ângulo θ:</span>
                <input
                  type="range" min="15" max="360" step="15"
                  value={anguloSetor}
                  onChange={(e) => setAnguloSetor(parseInt(e.target.value))}
                  className="w-20 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold w-10 text-center">{anguloSetor}°</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-emerald-400">Raio Ext (R):</span>
                <input
                  type="range" min="3" max="6" step="1"
                  value={raioExterno}
                  onChange={(e) => setRaioExterno(parseInt(e.target.value))}
                  className="w-14 accent-emerald-400 cursor-pointer"
                />
                <span className="text-white font-bold">{raioExterno}</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-amber-400">Raio Int (r):</span>
                <input
                  type="range" min="1" max={raioExterno - 1} step="1"
                  value={raioInterno}
                  onChange={(e) => setRaioInterno(parseInt(e.target.value))}
                  className="w-14 accent-amber-400 cursor-pointer"
                />
                <span className="text-white font-bold">{raioInterno}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Setor e da Coroa */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[360px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 240 240" className="w-full h-full">
                {renderizarMalhaSegura()}

                {/* Círculo Maior de Contorno */}
                <circle cx="120" cy="120" r={raioExterno * 18} fill="none" stroke="#444" strokeWidth="1" strokeDasharray="3" />
                {/* Círculo Menor de Contorno (Furo da Coroa) */}
                <circle cx="120" cy="120" r={raioInterno * 18} fill="#0d0d0d" stroke="#555" strokeWidth="1" />

                {/* Setor Circular Preenchido (Fatia) */}
                {(() => {
                  const r = raioExterno * 18;
                  const rad = (anguloSetor * Math.PI) / 180;
                  const xFim = 120 + r * Math.cos(rad);
                  const yFim = 120 + r * Math.sin(rad);
                  const largeArc = anguloSetor > 180 ? 1 : 0;
                  const pathData = anguloSetor === 360
                    ? `M 120,120 m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
                    : `M 120,120 L ${120 + r},120 A ${r},${r} 0 ${largeArc},1 ${xFim},${yFim} Z`;

                  return (
                    <path
                      d={pathData}
                      fill="rgba(6, 182, 212, 0.25)"
                      stroke="#06b6d4"
                      strokeWidth="2"
                    />
                  );
                })()}

                {/* Vértice Central */}
                <circle cx="120" cy="120" r="3" fill="#ffffff" />
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/80 px-2 py-1 rounded">
                Fatia de {anguloSetor}° ({(fracaoSetor * 100).toFixed(1)}% do círculo)
              </div>
            </div>

            {/* Raio-X das Medidas */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Comprimento do Arco (ℓ):</span>
                <span className="text-cyan-400 font-bold text-sm">
                  {comprimentoArco.toFixed(2)} u ({(fracaoSetor).toFixed(2)} · 2πR)
                </span>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Área do Setor (Fatia):</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {areaSetor.toFixed(2)} u² ({(fracaoSetor).toFixed(2)} · πR²)
                </span>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Área da Coroa (Arruela):</span>
                <span className="text-amber-400 font-bold text-sm">
                  {areaCoroa.toFixed(2)} u² (π(R² - r²))
                </span>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-neutral-400 leading-relaxed font-sans">
                <strong className="text-white font-mono">Regra Prática do Setor:</strong> Não decore fórmulas com frações estranhas. Faça sempre a proporção: se 360° geram a pizza inteira (πR²), quantos graus θ geram a sua fatia? Multiplique cruzado!
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PILAR 04: A ESTRATÉGIA DO CORTADOR DE BISCOITO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Áreas Compostas: O Método do Cortador de Biscoito
          </h2>
        </div>

        <p>
          Em vestibulares e concursos, quase nenhuma questão pede a área de um círculo puro. Eles colocam figuras hachuradas estranhas (cantos sobressalentes, folhas, meias-luas).
        </p>

        <p className="text-neutral-300">
          Você não calcula a forma estranha diretamente. Você pensa como alguém cortando biscoito em uma massa aberta:
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm my-4 text-center space-y-2">
          <div className="text-xl md:text-2xl font-mono text-white font-bold">
            Área Sombreada = Área da Moldura Total - Área das Faltas (Vazios)
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Exemplo: Quadrado (L²) menos Círculo Inscrito (πR²) = Quatro cantos descartados
          </p>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine o Contínuo e as Áreas Curvas
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para desenhar os cortes, calcular as frações de pizza e subtrair as molduras antes de validar sua resposta!
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
                        {acertou ? 'Cálculo circular cirúrgico!' : 'Atenção aos raios e frações de volta! Veja a dedução:'}
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
                      O Pulo do Gato Geométrico:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 12 e do Módulo 03:</p>
        <p className="leading-relaxed">
          Você concluiu com maestria todo o <strong>Módulo 03: Geometria Plana</strong>. Desde o alinhamento de ângulos e a rigidez estrutural do triângulo, passando pelas razões de semelhança k² e o quebra-cabeça de áreas de Pitágoras, até o fechamento curvo de π e as técnicas de subtração de figuras compostas. Agora você tem uma visão espacial completa e sem decoreba. No próximo módulo (<strong>Módulo 04: Geometria Espacial</strong>), adicionaremos a terceira dimensão (Z) para calcular volumes, diagonais espaciais e a capacidade cúbica do mundo real!
        </p>
      </footer>

    </article>
  );
}