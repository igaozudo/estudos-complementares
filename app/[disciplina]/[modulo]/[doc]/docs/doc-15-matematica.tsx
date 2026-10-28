'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID ESPACIAL)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Espacial #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Esboçar Sólidos 3D
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Volumes / Litros
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
              Esboce prismas retos, pirâmides ou cilindros seccionados
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Calcule V = Ab · h, aplique Pitágoras no triângulo do apótema g² = h² + m² ou converta m³ para litros..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 15 - GEOMETRIA MÉTRICA ESPACIAL
// =========================================================================
export default function Doc15Matematica() {
  // Simulador 1: Paralelepípedo Isométrico & Capacidade em Litros
  const [comprimento, setComprimento] = useState<number>(4); // metros
  const [largura, setLargura] = useState<number>(3); // metros
  const [altura, setAltura] = useState<number>(2); // metros

  const areaBase = comprimento * largura;
  const volumeM3 = areaBase * altura;
  const capacidadeLitros = volumeM3 * 1000;
  const diagonalInterna = Math.sqrt(comprimento * comprimento + largura * largura + altura * altura);

  // Simulador 2: A Regra do 1/3 (Cilindro vs Cone de Mesma Base e Altura)
  const [raioCorpo, setRaioCorpo] = useState<number>(3); // metros
  const [alturaCorpo, setAlturaCorpo] = useState<number>(6); // metros

  const areaBaseCircular = Math.PI * raioCorpo * raioCorpo;
  const volumeCilindro = areaBaseCircular * alturaCorpo;
  const volumeCone = volumeCilindro / 3;
  const geratrizCone = Math.sqrt(raioCorpo * raioCorpo + alturaCorpo * alturaCorpo);

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

  // Renderização segura de malhas
  const renderizarMalhaSegura = (larguraSvg: number, alturaSvg: number) => {
    const linhas = [];
    const step = 20;
    for (let x = 0; x <= larguraSvg; x += step) {
      linhas.push(<line key={`v-${x}`} x1={x} y1={0} x2={x} y2={alturaSvg} stroke="#222" strokeWidth="0.5" />);
    }
    for (let y = 0; y <= alturaSvg; y += step) {
      linhas.push(<line key={`h-${y}`} x1={0} y1={y} x2={larguraSvg} y2={y} stroke="#222" strokeWidth="0.5" />);
    }
    return linhas;
  };

  const questoes = [
    {
      id: 1,
      tema: 'Prismas Retos: Dimensionamento de Reservatório de Água',
      pergunta: 'Uma escola decide construir uma cisterna subterrânea em formato de paralelepípedo retângulo reto. As dimensões internas do reservatório são 5 metros de comprimento, 4 metros de largura e 2,5 metros de profundidade. Durante uma tempestade, a água atinge 80% da capacidade volumétrica máxima da cisterna. Quantos litros de água foram armazenados?',
      opcoes: [
        { idx: 0, texto: 'A) 40.000 litros', correta: true },
        { idx: 1, texto: 'B) 50.000 litros', correta: false },
        { idx: 2, texto: 'C) 4.000 litros', correta: false },
        { idx: 3, texto: 'D) 32.000 litros', correta: false },
      ],
      explicacao: [
        'A conversão métrica de volume e capacidade:',
        '1. Volume total do paralelepípedo: V = Comprimento · Largura · Altura = 5 · 4 · 2,5 = 50 m³.',
        '2. O volume preenchido foi de 80%: V_água = 50 · 0,80 = 40 m³.',
        '3. Conversão fundamental do Sistema Internacional: 1 metro cúbico (m³) comporta exatamente 1.000 litros de água.',
        '4. Capacidade em litros: 40 m³ · 1.000 L/m³ = 40.000 litros.',
        'A cisterna reteve exatamente 40 mil litros de água de chuva. Alternativa A correta!',
      ],
    },
    {
      id: 2,
      tema: 'Pirâmides Regulares e o Triângulo do Apótema',
      pergunta: 'Uma pirâmide quadrangular regular reta possui aresta da base medindo 12 cm e altura vertical de 8 cm. Qual é a medida do apótema da pirâmide (g) e qual é a área lateral total das suas 4 faces triangulares?',
      opcoes: [
        { idx: 0, texto: 'A) Apótema g = 10 cm e Área Lateral = 240 cm²', correta: true },
        { idx: 1, texto: 'B) Apótema g = 14 cm e Área Lateral = 336 cm²', correta: false },
        { idx: 2, texto: 'C) Apótema g = 10 cm e Área Lateral = 120 cm²', correta: false },
        { idx: 3, texto: 'D) Apótema g = 8√2 cm e Área Lateral = 192 cm²', correta: false },
      ],
      explicacao: [
        'A aplicação de Pitágoras no corte transversal da pirâmide:',
        '1. O apótema da base (m) é a distância do centro da base quadrada até o ponto médio da aresta: m = 12 / 2 = 6 cm.',
        '2. No interior da pirâmide, forma-se um triângulo retângulo onde a altura h = 8 cm e o apótema da base m = 6 cm são os catetos, e o apótema da pirâmide g é a hipotenusa:',
        '   g² = h² + m² = 8² + 6² = 64 + 36 = 100 → g = √100 = 10 cm (Terna 3-4-5 duplicada: 6-8-10!).',
        '3. Cada face lateral é um triângulo de base 12 cm e altura igual ao apótema g = 10 cm:',
        '   Área de 1 face = (base · g) / 2 = (12 · 10) / 2 = 60 cm².',
        '4. Como a pirâmide tem 4 faces idênticas: Área Lateral = 4 · 60 = 240 cm².',
        'O apótema mede 10 cm e a área lateral total é 240 cm². Alternativa A perfeita!',
      ],
    },
    {
      id: 3,
      tema: 'Corpos Redondos: Cilindro Equilátero e Seção Meridiana',
      pergunta: 'Um cilindro circular reto é classificado como "cilindro equilátero" quando sua seção meridiana (o corte vertical que passa pelo centro) é um quadrado perfeito. Se um cilindro equilátero possui raio da base igual a 4 cm, qual é o seu volume exato em centímetros cúbicos?',
      opcoes: [
        { idx: 0, texto: 'A) 64π cm³', correta: false },
        { idx: 1, texto: 'B) 128π cm³', correta: true },
        { idx: 2, texto: 'C) 256π cm³', correta: false },
        { idx: 3, texto: 'D) 32π cm³', correta: false },
      ],
      explicacao: [
        'A geometria da seção meridiana do cilindro equilátero:',
        '1. Se a seção meridiana é um quadrado, a altura do cilindro é rigorosamente igual ao diâmetro da sua base: h = 2R.',
        '2. Como o raio é R = 4 cm, o diâmetro e a altura valem: h = 2 · 4 = 8 cm.',
        '3. Área da base circular: A_b = π · R² = π · 4² = 16π cm².',
        '4. Volume do cilindro: V = A_b · h = 16π · 8 = 128π cm³.',
        'Se usarmos π ≈ 3,14, o volume equivale a cerca de 402 mL de líquido. Alternativa B correta!',
      ],
    },
    {
      id: 4,
      tema: 'A Esfera de Arquimedes: Volume e Área de Superfície',
      pergunta: 'Um tanque esférico de armazenamento de gás possui raio externo de 3 metros. Deseja-se pintar toda a superfície externa com tinta epóxi e preenchê-lo totalmente com gás. Adotando π ≈ 3,14, qual é a área de superfície a ser pintada e qual é o volume interno de gás comportado?',
      opcoes: [
        { idx: 0, texto: 'A) Área = 36π m² (aprox. 113 m²) e Volume = 36π m³ (aprox. 113 m³)', correta: true },
        { idx: 1, texto: 'B) Área = 18π m² e Volume = 27π m³', correta: false },
        { idx: 2, texto: 'C) Área = 36π m² e Volume = 108π m³', correta: false },
        { idx: 3, texto: 'D) Área = 12π m² e Volume = 36π m³', correta: false },
      ],
      explicacao: [
        'A notável coincidência numérica do raio R = 3 na esfera:',
        '1. Área superficial de uma esfera: A = 4 · π · R² = 4 · π · 3² = 4 · π · 9 = 36π m² (aprox. 113,04 m²).',
        '2. Volume contido na esfera: V = (4/3) · π · R³ = (4/3) · π · 3³ = (4/3) · π · 27 = 4 · π · 9 = 36π m³ (aprox. 113,04 m³).',
        '3. Quando o raio é exatamente igual a 3 unidades, o valor numérico da área superficial em metros quadrados coincide com o valor numérico do volume em metros cúbicos, pois (4/3) · 3³ = 4 · 3² = 36.',
        'Área de 36π m² e Volume de 36π m³. Alternativa A!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO COM AVISO PEDAGÓGICO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 15 • Módulo 04: Geometria Espacial Métrica
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Geometria Espacial: <br />
          <span className="text-cyan-400 font-light">Prismas, Pirâmides e Corpos Redondos</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO: DA ÁREA PLANA AO VOLUME REAL */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Dimensional Deste Caderno: O Empilhamento no Eixo Z
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            No Módulo 03, nós calculamos áreas em duas dimensões (X e Y). Agora nós adicionamos o <strong>eixo da profundidade/altura (Z)</strong>, entrando no mundo dos sólidos com capacidade real em litros:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • <strong>Prismas e Cilindros (Sólidos Retos):</strong> Têm duas tampas idênticas e paralelas. O volume é simplesmente a <strong>área da base empilhada h vezes</strong> (<span className="text-cyan-400 font-bold">V = A<sub>b</sub> · h</span>).
            </li>
            <li>
              • <strong>Pirâmides e Cones (Sólidos de Ponta):</strong> Têm apenas uma base no solo e afunilam até um vértice pontiagudo. Todas as fatias encolhem proporcionalmente ao quadrado, resultando rigorosamente em <strong>um terço do volume</strong> (<span className="text-emerald-400 font-bold">V = (1/3) · A<sub>b</sub> · h</span>).
            </li>
            <li>
              • <strong>A Ponte com o Mundo Real:</strong> Você nunca mais errará uma questão de engenharia se memorizar a chave métrica: <strong className="text-white">1 m³ = 1.000 Litros</strong>, <strong className="text-white">1 dm³ = 1 Litro</strong> e <strong className="text-white">1 cm³ = 1 mL</strong>.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O PRINCÍPIO DE CAVALIERI E PRISMAS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Prismas e o Princípio de Cavalieri: O Baralho Deslizado
          </h2>
        </div>

        <p>
          Pegue um maço de 500 folhas de papel sulfite perfeitamente alinhadas formando um bloco reto. O volume total é a área da folha multiplicada pela altura da pilha.
        </p>

        <p className="text-neutral-300">
          Agora empurre o bloco para o lado, de modo que ele fique inclinado (oblíquo). <strong>O volume de papel mudou? Não!</strong> Cada folha individual continuou com a mesma área exata, apenas deslizada no espaço. Esse é o <strong>Princípio de Cavalieri</strong>: se dois sólidos têm a mesma altura e todas as fatias horizontais na mesma altitude possuem áreas iguais, seus volumes são rigorosamente idênticos.
        </p>

        {/* SIMULADOR INTERATIVO: PARALELEPÍPEDO ISOMÉTRICO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Isométrico 3D: Paralelepípedo e Capacidade
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Ajuste as três dimensões e veja a caixa tridimensional e a capacidade em litros calculadas em tempo real:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-cyan-400">Comp (c):</span>
                <input
                  type="range" min="2" max="6" step="1"
                  value={comprimento}
                  onChange={(e) => setComprimento(parseInt(e.target.value))}
                  className="w-16 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold">{comprimento}m</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-emerald-400">Larg (l):</span>
                <input
                  type="range" min="2" max="5" step="1"
                  value={largura}
                  onChange={(e) => setLargura(parseInt(e.target.value))}
                  className="w-16 accent-emerald-400 cursor-pointer"
                />
                <span className="text-white font-bold">{largura}m</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-amber-400">Alt (h):</span>
                <input
                  type="range" min="1" max="4" step="1"
                  value={altura}
                  onChange={(e) => setAltura(parseInt(e.target.value))}
                  className="w-16 accent-amber-400 cursor-pointer"
                />
                <span className="text-white font-bold">{altura}m</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG da Projeção Isométrica Tridimensional */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[420px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 260 200" className="w-full h-full">
                {renderizarMalhaSegura(260, 200)}

                {(() => {
                  // Projeção isométrica simplificada
                  // Origem inferior frontal
                  const ox = 70;
                  const oy = 150;
                  const scX = 14 * comprimento;
                  const scY = 9 * largura;
                  const scZ = 16 * altura;

                  // Pontos frontais: P0=(ox, oy), P1=(ox + scX, oy), P2=(ox + scX, oy - scZ), P3=(ox, oy - scZ)
                  // Pontos traseiros deslocados em perspectiva (+scY no X, -scY no Y)
                  const isoDx = scY * 0.8;
                  const isoDy = scY * 0.5;

                  const p0 = `${ox},${oy}`;
                  const p1 = `${ox + scX},${oy}`;
                  const p2 = `${ox + scX},${oy - scZ}`;
                  const p3 = `${ox},${oy - scZ}`;

                  const p4 = `${ox + isoDx},${oy - isoDy}`;
                  const p5 = `${ox + scX + isoDx},${oy - isoDy}`;
                  const p6 = `${ox + scX + isoDx},${oy - scZ - isoDy}`;
                  const p7 = `${ox + isoDx},${oy - scZ - isoDy}`;

                  return (
                    <g>
                      {/* Linhas ocultas tracejadas de trás */}
                      <line x1={ox} y1={oy} x2={ox + isoDx} y2={oy - isoDy} stroke="#444" strokeDasharray="3" strokeWidth="1" />
                      <line x1={ox + isoDx} y1={oy - isoDy} x2={ox + scX + isoDx} y2={oy - isoDy} stroke="#444" strokeDasharray="3" strokeWidth="1" />
                      <line x1={ox + isoDx} y1={oy - isoDy} x2={ox + isoDx} y2={oy - scZ - isoDy} stroke="#444" strokeDasharray="3" strokeWidth="1" />

                      {/* Face Frontal (Plano XY) */}
                      <polygon points={`${p0} ${p1} ${p2} ${p3}`} fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="1.5" />
                      
                      {/* Face Superior (Tampa da caixa) */}
                      <polygon points={`${p3} ${p2} ${p6} ${p7}`} fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />

                      {/* Face Lateral Direita */}
                      <polygon points={`${p1} ${p5} ${p6} ${p2}`} fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1.5" />

                      {/* Diagonal Interna Espacial D */}
                      <line x1={ox} y1={oy} x2={ox + scX + isoDx} y2={oy - scZ - isoDy} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2" />
                    </g>
                  );
                })()}

                <text x="10" y="25" fill="#ef4444" fontSize="10" fontFamily="monospace">
                  Diagonal Espacial: {diagonalInterna.toFixed(2)} m
                </text>
              </svg>

              <div className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400">c: {comprimento}m</span> | <span className="text-emerald-400">l: {largura}m</span> | <span className="text-amber-400">h: {altura}m</span>
              </div>
            </div>

            {/* Painel Métrico de Litragem */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Área da Base (Piso):</span>
                <span className="text-cyan-400 font-bold text-sm">A<sub>b</sub> = {comprimento} · {largura} = {areaBase} m²</span>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Volume em Metros Cúbicos:</span>
                <span className="text-emerald-400 font-bold text-sm">V = {areaBase} · {altura} = {volumeM3} m³</span>
              </div>

              <div className="p-4 bg-cyan-950/20 border border-cyan-800 rounded space-y-1 text-center">
                <div className="text-neutral-400 uppercase text-[10px]">Capacidade Real em Litros (× 1.000):</div>
                <div className="text-2xl font-bold text-white tracking-wider">
                  {capacidadeLitros.toLocaleString('pt-BR')} <span className="text-cyan-400">Litros</span>
                </div>
                <div className="text-[11px] text-neutral-400 font-sans pt-1">
                  1 m³ equivale a um cubo de 1 metro de aresta que armazena exatamente 1.000 litros de água.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: O MISTÉRIO DO FATOR 1/3 EM PIRÂMIDES E CONES */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Teorema do 1/3: Por Que Pirâmides e Cones Dividem por Três?
          </h2>
        </div>

        <p>
          Quase todo estudante decora que pirâmide e cone têm a fórmula <code className="text-cyan-300 font-mono font-bold">V = (A<sub>b</sub> · h) / 3</code>, mas quase ninguém sabe por que aparece aquele número 3 no denominador.
        </p>

        <p className="text-neutral-300">
          Existe uma demonstração prática clássica nos laboratórios de física e matemática:
          <br />
          Se você fabricar em acrílico um <strong>cone oco</strong> e um <strong>cilindro oco</strong> que tenham exatamente a mesma base circular e a mesma altura:
        </p>

        <div className="p-6 border border-emerald-900/40 bg-emerald-950/10 rounded-sm text-center my-6 space-y-2">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold tracking-wider">
            3 Cones Cheios de Água = Exatamente 1 Cilindro Transbordando
          </div>
          <p className="text-xs text-neutral-300 font-mono">
            V_cone = (1/3) · V_cilindro = (π · R² · h) / 3
          </p>
        </div>

        {/* SIMULADOR INTERATIVO: CORPOS REDONDOS (CILINDRO VS CONE) */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador de Corpos Redondos e Geratrizes
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere o raio da base e a altura para comparar o cilindro envolvente com o cone interno:
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-cyan-400">Raio (R):</span>
                <input
                  type="range" min="2" max="5" step="1"
                  value={raioCorpo}
                  onChange={(e) => setRaioCorpo(parseInt(e.target.value))}
                  className="w-16 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold">{raioCorpo}m</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-emerald-400">Altura (h):</span>
                <input
                  type="range" min="3" max="8" step="1"
                  value={alturaCorpo}
                  onChange={(e) => setAlturaCorpo(parseInt(e.target.value))}
                  className="w-16 accent-emerald-400 cursor-pointer"
                />
                <span className="text-white font-bold">{alturaCorpo}m</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Cilindro e Cone Inscritos */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[380px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 240 200" className="w-full h-full">
                {renderizarMalhaSegura(240, 200)}

                {(() => {
                  const cx = 120;
                  const baseY = 165;
                  const topY = baseY - alturaCorpo * 16;
                  const rx = raioCorpo * 16;
                  const ry = 14;

                  return (
                    <g>
                      {/* Cilindro Envolvente (Tracejado translúcido) */}
                      {/* Elipse superior do cilindro */}
                      <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill="none" stroke="#555" strokeWidth="1" strokeDasharray="3" />
                      {/* Laterais verticais do cilindro */}
                      <line x1={cx - rx} y1={topY} x2={cx - rx} y2={baseY} stroke="#444" strokeWidth="1" strokeDasharray="3" />
                      <line x1={cx + rx} y1={topY} x2={cx + rx} y2={baseY} stroke="#444" strokeWidth="1" strokeDasharray="3" />

                      {/* Cone Interno Inscrito */}
                      {/* Face lateral do cone */}
                      <polygon
                        points={`${cx},${topY} ${cx - rx},${baseY} ${cx + rx},${baseY}`}
                        fill="rgba(16, 185, 129, 0.15)"
                        stroke="#10b981"
                        strokeWidth="2"
                      />

                      {/* Geratriz g destacada em Ciano */}
                      <line x1={cx} y1={topY} x2={cx + rx} y2={baseY} stroke="#06b6d4" strokeWidth="2.5" />

                      {/* Altura h interna */}
                      <line x1={cx} y1={topY} x2={cx} y2={baseY} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2" />

                      {/* Raio R no chão da base */}
                      <line x1={cx} y1={baseY} x2={cx + rx} y2={baseY} stroke="#f59e0b" strokeWidth="2" />

                      {/* Elipse da base compartilhada */}
                      <ellipse cx={cx} cy={baseY} rx={rx} ry={ry} fill="none" stroke="#10b981" strokeWidth="1.5" />
                      
                      {/* Vértices e pontos */}
                      <circle cx={cx} cy={topY} r="4" fill="#06b6d4" />
                      <circle cx={cx} cy={baseY} r="3" fill="#ffffff" />
                      <circle cx={cx + rx} cy={baseY} r="3" fill="#f59e0b" />
                    </g>
                  );
                })()}

                <text x="15" y="25" fill="#06b6d4" fontSize="10" fontFamily="monospace">
                  Geratriz g = {geratrizCone.toFixed(2)} m
                </text>
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-emerald-400">Cone ocupa 33,3% do cilindro</span>
              </div>
            </div>

            {/* Painel Comparativo de Volumes */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">1. Pitágoras no Cone (g² = h² + R²):</div>
                <div className="text-white font-bold text-sm">
                  g² = {alturaCorpo}² + {raioCorpo}² = {alturaCorpo * alturaCorpo + raioCorpo * raioCorpo} → <span className="text-cyan-400">g = {geratrizCone.toFixed(2)} m</span>
                </div>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">2. Volume do Cilindro Inteiro (A<sub>b</sub> · h):</div>
                <div className="text-white font-bold text-sm">
                  π · {raioCorpo}² · {alturaCorpo} = <span className="text-amber-400">{volumeCilindro.toFixed(1)} m³</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded space-y-1">
                <div className="text-neutral-400">3. Volume do Cone ((1/3) · A<sub>b</sub> · h):</div>
                <div className="text-emerald-300 font-bold text-base">
                  {volumeCilindro.toFixed(1)} ÷ 3 = <span className="text-emerald-400">{volumeCone.toFixed(1)} m³</span>
                </div>
                <div className="text-[10px] text-neutral-500">
                  Exatamente 1/3 do volume do cilindro envolvente!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 03: A ESFERA DE ARQUIMEDES */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Esfera de Arquimedes: A Obra-Prima da Antiguidade
          </h2>
        </div>

        <p>
          Arquimedes considerava sua maior descoberta científica a relação entre a <strong>esfera</strong> e o <strong>cilindro equilátero circunscrito a ela</strong> (tanto que pediu para gravarem essa figura em sua lápide):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. Área da Casca Esférica</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-lg text-cyan-300 text-center font-bold">
              Área = 4 · π · R²
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              A casca de uma bola tem uma superfície exatamente igual a <strong>quatro círculos planos</strong> do mesmo raio (4 discos de sombra).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">2. Volume do Interior Esférico</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-lg text-emerald-300 text-center font-bold">
              Volume = (4/3) · π · R³
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O volume interno da esfera preenche exatamente <strong>dois terços (2/3)</strong> do volume do cilindro que a envolve perfeitamente.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: O MAPA DE CONVERSÃO MÉTRICA ESSENCIAL */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Tabela de Conversão Métrica: Adeus ao Erro de Vírgulas
          </h2>
        </div>

        <p>
          O maior motivo de notas zeradas em geometria espacial não é a fórmula de geometria, mas sim <strong>esquecer que volume anda de 3 em 3 casas decimais</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 font-mono text-xs text-center">
          <div className="border border-cyan-800 bg-cyan-950/20 p-4 rounded-sm space-y-2">
            <span className="text-cyan-400 font-bold block text-sm">1 Metro Cúbico (m³)</span>
            <div className="text-white font-bold text-base">1.000 Litros</div>
            <p className="text-neutral-400 font-sans text-[11px]">Uma caixa d&apos;água de 1m × 1m × 1m.</p>
          </div>

          <div className="border border-emerald-800 bg-emerald-950/20 p-4 rounded-sm space-y-2">
            <span className="text-emerald-400 font-bold block text-sm">1 Decímetro Cúbico (dm³)</span>
            <div className="text-white font-bold text-base">1 Litro</div>
            <p className="text-neutral-400 font-sans text-[11px]">Uma caixa de leite de 10cm × 10cm × 10cm.</p>
          </div>

          <div className="border border-amber-800 bg-amber-950/20 p-4 rounded-sm space-y-2">
            <span className="text-amber-400 font-bold block text-sm">1 Centímetro Cúbico (cm³ / mL)</span>
            <div className="text-white font-bold text-base">0,001 Litro (1 mL)</div>
            <p className="text-neutral-400 font-sans text-[11px]">Uma seringa hospitalar de 1cm × 1cm × 1cm.</p>
          </div>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine as Três Dimensões
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para desenhar os cortes transversais, aplicar Pitágoras nas geratrizes e converter m³ para litros antes de confirmar a resposta!
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
                        {acertou ? 'Visão espacial impecável!' : 'Atenção aos apótemas e conversões em litros! Veja a dedução:'}
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
                      O Pulo do Gato Espacial:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 15:</p>
        <p className="leading-relaxed">
          Você deu o salto definitivo para a terceira dimensão. Entender o volume como empilhamento de fatias paralelas de Cavalieri, dominar o fator 1/3 das pontas que afunilam e transitar com facilidade entre metros cúbicos e litros de água prepara você para qualquer problema de modelagem de recipientes e estruturas reais. No próximo caderno (<strong>Doc 16: Geometria Analítica - Ponto, Reta e Circunferência no Plano</strong>), uniremos a geometria métrica de volta com as coordenadas cartesianas para calcular distâncias entre pontos, equações de retas e tangências com precisão algébrica!
        </p>
      </footer>

    </article>
  );
}