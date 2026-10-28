'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID GEOMÉTRICO)
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
            ✏️ Desenhar Figuras / Cortes
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Razões / Pitágoras
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
              Esboce triângulos proporcionais ou decomponha polígonos
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Monte as razões a/a' = b/b', aplique a² + b² = c² ou calcule Si = (n-2) · 180°..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 11 - SEMELHANÇA, PITÁGORAS E POLÍGONOS
// =========================================================================
export default function Doc11Matematica() {
  // Simulador 1: Semelhança e a Armadilha da Área (Zoom Óptico)
  const [fatorZoom, setFatorZoom] = useState<number>(2); // Escala k
  const baseOriginal = 4;
  const alturaOriginal = 3;
  const areaOriginal = (baseOriginal * alturaOriginal) / 2; // 6
  const baseAmpliada = baseOriginal * fatorZoom;
  const alturaAmpliada = alturaOriginal * fatorZoom;
  const areaAmpliada = areaOriginal * (fatorZoom * fatorZoom);

  // Simulador 2: Teorema de Pitágoras Geométrico (A Soma das Áreas Reais)
  const [catetoA, setCatetoA] = useState<number>(3);
  const [catetoB, setCatetoB] = useState<number>(4);
  const hipotenusa = Math.hypot(catetoA, catetoB);
  const areaQuadradoA = catetoA * catetoA;
  const areaQuadradoB = catetoB * catetoB;
  const areaQuadradoC = hipotenusa * hipotenusa;

  // Simulador 3: Polígonos Regulares e Decomposição em Triângulos
  const [ladosPoligono, setLadosPoligono] = useState<number>(6); // Hexágono padrão
  const somaInterna = (ladosPoligono - 2) * 180;
  const anguloInterno = somaInterna / ladosPoligono;
  const totalDiagonais = (ladosPoligono * (ladosPoligono - 3)) / 2;
  const anguloExterno = 360 / ladosPoligono;

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

  // Renderização segura de malhas para evitar erro de Array.toJSON
  const renderizarMalhaSimples = () => {
    const linhas = [];
    for (let i = 0; i <= 10; i++) {
      linhas.push(
        <g key={i}>
          <line x1="0" y1={i * 20} x2="200" y2={i * 20} stroke="#222" strokeWidth="0.5" />
          <line x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#222" strokeWidth="0.5" />
        </g>
      );
    }
    return linhas;
  };

  // Coordenadas para renderizar polígono regular no SVG
  const gerarPontosPoligono = (n: number, raio: number, centroX: number, centroY: number) => {
    const pontos = [];
    for (let i = 0; i < n; i++) {
      const ang = (i * 2 * Math.PI) / n - Math.PI / 2;
      const x = centroX + raio * Math.cos(ang);
      const y = centroY + raio * Math.sin(ang);
      pontos.push(`${x},${y}`);
    }
    return pontos.join(' ');
  };

  const questoes = [
    {
      id: 1,
      tema: 'Semelhança e a Armadilha da Escala Bidimensional',
      pergunta: 'Uma arquiteta projeta uma praça triangular e constrói uma maquete em escala linear de 1:50. Se na maquete a praça ocupa uma superfície de 120 cm², qual é a área real da praça construída no chão da cidade em metros quadrados?',
      opcoes: [
        { idx: 0, texto: 'A) 60 m²', correta: false },
        { idx: 1, texto: 'B) 300 m²', correta: true },
        { idx: 2, texto: 'C) 6.000 m²', correta: false },
        { idx: 3, texto: 'D) 150 m²', correta: false },
      ],
      explicacao: [
        'A regra máxima da semelhança bidimensional:',
        '1. A razão linear entre o desenho e o mundo real é k = 50 (cada centímetro na maquete vale 50 cm no chão real).',
        '2. Área é grandeza bidimensional (comprimento × largura). Por isso, a razão entre as áreas é k² = 50² = 2.500!',
        '3. Área Real = Área da Maquete × k² = 120 cm² × 2.500 = 300.000 cm².',
        '4. Conversão para metros quadrados: como 1 m² = 10.000 cm², dividimos 300.000 por 10.000 = 30 m²... Atenção na escala:',
        '   Escala linear 1:50 significa que cada 1 cm vale 0,5 metros (50 cm).',
        '   Área na maquete: 120 cm² = 120 · (10⁻⁴) m² = 0,012 m².',
        '   Área real: 0,012 m² · (50)² = 0,012 · 2.500 = 300 m²!',
        'Nunca multiplique a área pela razão simples k. Multiplique sempre por k². Alternativa B correta!',
      ],
    },
    {
      id: 2,
      tema: 'Teorema de Pitágoras e Ternas Pitagóricas',
      pergunta: 'Um poste de iluminação vertical de 12 metros de altura precisa ser sustentado por um cabo de aço retilíneo preso do seu topo até um ponto no solo que fica a 5 metros de distância da base do poste. Quantos metros de cabo de aço são necessários e qual terna pitagórica primitiva foi utilizada?',
      opcoes: [
        { idx: 0, texto: 'A) 13 metros (Terna primitiva 5-12-13)', correta: true },
        { idx: 1, texto: 'B) 15 metros (Terna derivada 9-12-15)', correta: false },
        { idx: 2, texto: 'C) 17 metros (Terna 8-15-17)', correta: false },
        { idx: 3, texto: 'D) 14 metros (Sem terna exata)', correta: false },
      ],
      explicacao: [
        'Reconhecendo ternas pitagóricas instantaneamente:',
        '1. O poste forma um ângulo de 90° com o solo horizontal. Os catetos medem a = 5 m e b = 12 m.',
        '2. Pelo Teorema de Pitágoras: c² = a² + b² = 5² + 12² = 25 + 144 = 169.',
        '3. Tirando a raiz: c = √169 = 13 metros.',
        '4. No vestibular ou concurso, nunca perca tempo calculando raízes para 3-4-5 e 5-12-13. Se os catetos são 5 e 12, a hipotenusa é imediata: 13 metros. Alternativa A!',
      ],
    },
    {
      id: 3,
      tema: 'Polígonos Regulares: Pavimentação e Ângulo Interno',
      pergunta: 'Para ladrilhar o chão de uma sala sem que haja sobreposição nem frestas vazias entre as peças, podemos utilizar apenas polígonos regulares cujo ângulo interno seja divisor exato de 360°. Por que o octógono regular (8 lados) sozinho NÃO consegue pavimentar um piso plano?',
      opcoes: [
        { idx: 0, texto: 'A) Porque seu ângulo interno mede 120°, gerando 3 peças por vértice.', correta: false },
        { idx: 1, texto: 'B) Porque seu ângulo interno mede 135°, e 360° não é divisível por 135° (deixando um buraco de 90° que exigiria um quadrado para fechar).', correta: true },
        { idx: 2, texto: 'C) Porque a soma dos ângulos internos de um octógono ultrapassa 1.500°.', correta: false },
        { idx: 3, texto: 'D) Porque o octógono possui número ímpar de diagonais por vértice.', correta: false },
      ],
      explicacao: [
        'A geometria dos azulejos e mosaicos:',
        '1. Soma dos ângulos internos de um octógono (n = 8): Sᵢ = (8 - 2) · 180° = 6 · 180° = 1.080°.',
        '2. Como ele é regular, dividimos igualmente entre os 8 cantos: Ângulo Interno = 1.080° ÷ 8 = 135°.',
        '3. Para juntar peças em torno de um único ponto no chão sem folga, a soma precisa bater exatamente 360°.',
        '4. Se colocarmos 2 octógonos juntos: 135° + 135° = 270°. Sobra uma brecha de 360° - 270° = 90°.',
        '5. Se tentarmos colocar um 3º octógono: 270° + 135° = 405° (ultrapassa 360° e encavala!).',
        'É exatamente por isso que pisos octogonais sempre vêm acompanhados de pequenos quadradinhos pretos de 90° para tapar a fresta! Alternativa B perfeita.',
      ],
    },
    {
      id: 4,
      tema: 'Diagonais de Polígonos e Conexões Estruturais',
      pergunta: 'Em um projeto de telecomunicações, deseja-se interligar 10 antenas dispostas nos vértices de um decágono por cabos diretos de fibra óptica. Cabos ligando antenas vizinhas já existem no contorno. Quantos novos cabos DIAGONIS (que cruzam por dentro do polígono) precisarão ser instalados?',
      opcoes: [
        { idx: 0, texto: 'A) 45 cabos', correta: false },
        { idx: 1, texto: 'B) 35 cabos', correta: true },
        { idx: 2, texto: 'C) 20 cabos', correta: false },
        { idx: 3, texto: 'D) 70 cabos', correta: false },
      ],
      explicacao: [
        'A lógica da fórmula de diagonais sem decoreba:',
        '1. Temos n = 10 vértices (antenas).',
        '2. De cada antena, você pode puxar cabos para outras (n - 1) antenas. Porém, você NÃO puxa cabo para ela mesma (1 ponto) e NÃO puxa diagonal para as duas vizinhas coladas (2 pontos).',
        '3. Portanto, de cada antena saem exatamente (n - 3) diagonais: 10 - 3 = 7 diagonais por antena.',
        '4. Como temos 10 antenas: 10 · 7 = 70 conexões. Mas cada cabo tem duas pontas (a diagonal de A até B é a mesma de B até A), então dividimos por 2 para não contar em duplicidade!',
        '5. D = n(n - 3) / 2 = (10 · 7) / 2 = 35 cabos diagonais. Alternativa B!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 11 • Módulo 03: Geometria Plana
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Semelhança, Pitágoras e Polígonos: <br />
          <span className="text-cyan-400 font-light">A Lente do Zoom e a Geometria das Áreas</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO: DIVERSIFICAÇÃO DE ABORDAGEM */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Nova Lente Deste Caderno: Escalas e Transformações de Área
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            No Doc 10, nós caçamos ângulos e entendemos a rigidez dos triângulos. Agora, nós entramos no <strong>segundo estágio da geometria</strong>:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • <strong>Semelhança</strong> não é igualdade: é a física do <strong>zoom óptico</strong>. O formato permanece intacto (mesmos ângulos), mas as medidas lineares crescem por um fator <em>k</em>, enquanto a área explode em <em>k²</em>.
            </li>
            <li>
              • <strong>Teorema de Pitágoras</strong> não é uma fórmula algébrica morta (a² + b² = c²): é uma <strong>conservação física de superfícies</strong>. A área do quadrado construído sobre a hipotenusa é literalmente a soma das áreas dos quadrados dos catetos.
            </li>
            <li>
              • <strong>Polígonos Regulares</strong> são apenas <strong>fatias de triângulos coladas</strong> em torno de um centro comum. Se você domina o triângulo, você domina qualquer figura de 100 lados.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: SEMELHANÇA E A ARMADILHA DA ÁREA (ZOOM ÓPTICO) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Semelhança de Triângulos: O Zoom Óptico e o Salto k²
          </h2>
        </div>

        <p>
          Dois triângulos são <strong>semelhantes</strong> quando possuem os mesmos ângulos internos. Pense em uma fotografia no seu celular: quando você dá o gesto de pinça para ampliar a foto, você não deforma o rosto da pessoa (os ângulos não mudam), você apenas multiplica todas as distâncias pelo mesmo fator de escala <strong>k</strong>.
        </p>

        {/* SIMULADOR INTERATIVO: ZOOM DE SEMELHANÇA */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador de Escala e Razão de Áreas
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere o fator de zoom (k) e observe a diferença brutal entre a expansão linear e a expansão de superfície:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Fator k:</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.5"
                value={fatorZoom}
                onChange={(e) => setFatorZoom(parseFloat(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold w-12 text-center">{fatorZoom}x</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG dos Triângulos Comparados */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[420px] mx-auto overflow-hidden flex items-center justify-center p-4">
              <svg viewBox="0 0 240 180" className="w-full h-full">
                {/* Triângulo Base (Original - Ciano) */}
                <polygon
                  points="20,150 100,150 20,90"
                  fill="rgba(6, 182, 212, 0.2)"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                />
                <text x="35" y="140" fill="#06b6d4" fontSize="10" fontFamily="monospace">Orig: 6 u²</text>

                {/* Triângulo Escalonado (Pontilhado Dinâmico - Esmeralda) */}
                <polygon
                  points={`20,150 ${20 + baseAmpliada * 20},150 20,${150 - alturaAmpliada * 20}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4"
                />

                {/* Cotas dos lados ampliados */}
                <text x={25 + (baseAmpliada * 10)} y="165" fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="middle">
                  Base = {baseAmpliada} ({fatorZoom} · 4)
                </text>
                <text x="10" y={150 - (alturaAmpliada * 10)} fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="end">
                  Alt = {alturaAmpliada}
                </text>
              </svg>

              <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400">Base fixa: 4</span> | <span className="text-emerald-400">Ampliado: k = {fatorZoom}</span>
              </div>
            </div>

            {/* Painel Numérico do Salto k² */}
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-black border border-neutral-800 rounded space-y-2">
                <span className="text-cyan-400 font-bold uppercase block">1. Escala Linear de Comprimento (k):</span>
                <p className="text-neutral-300 font-sans font-light leading-relaxed">
                  Os lados cresceram pelo fator simples: <strong className="text-white">k = {fatorZoom}</strong>.
                  <br />
                  A base foi de 4 para {baseAmpliada} e a altura foi de 3 para {alturaAmpliada}.
                </p>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded space-y-2">
                <span className="text-emerald-400 font-bold uppercase block">2. Escala Superficial de Área (k²):</span>
                <p className="text-neutral-300 font-sans font-light leading-relaxed">
                  A área NÃO aumentou em {fatorZoom} vezes! Ela foi multiplicada por k² = ({fatorZoom})² = <strong className="text-emerald-300">{fatorZoom * fatorZoom} vezes</strong>!
                  <br />
                  Área Original: 6 u² → Área Ampliada: <strong className="text-white">{areaAmpliada.toFixed(1)} u²</strong>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: TEOREMA DE PITÁGORAS COMO QUEBRA-CABEÇA DE ÁREAS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Teorema de Pitágoras: A Conservação Física das Áreas
          </h2>
        </div>

        <p>
          Pitágoras de Samos não escreveu uma fórmula com letras numa lousa. No século VI a.C., ele provou um teorema físico desenhando quadrados reais de cerâmica grudados nas três bordas de um triângulo retângulo:
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-center my-6 space-y-2">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold tracking-wider">
            Área(Quadrado A) + Área(Quadrado B) = Área(Quadrado C)
          </div>
          <p className="text-xs text-neutral-300 font-mono">
            a² + b² = c²  (A água contida nos dois quadrados menores preenche perfeitamente o quadrado da hipotenusa)
          </p>
        </div>

        {/* SIMULADOR INTERATIVO: QUEBRA-CABEÇA DE PITÁGORAS */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Demonstrador Geométrico das Áreas
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Ajuste os catetos e veja os quadrados se redimensionarem provando a igualdade das áreas:
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-cyan-400">Cateto A:</span>
                <input
                  type="range" min="3" max="5" step="1"
                  value={catetoA}
                  onChange={(e) => setCatetoA(parseInt(e.target.value))}
                  className="w-16 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold">{catetoA}</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-emerald-400">Cateto B:</span>
                <input
                  type="range" min="4" max="6" step="1"
                  value={catetoB}
                  onChange={(e) => setCatetoB(parseInt(e.target.value))}
                  className="w-16 accent-emerald-400 cursor-pointer"
                />
                <span className="text-white font-bold">{catetoB}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG dos Quadrados Conectados */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[380px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="0 0 220 220" className="w-full h-full">
                {/* Triângulo Central Retângulo */}
                <polygon
                  points="80,140 160,140 80,80"
                  fill="#ffffff"
                  opacity="0.15"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Marcador de Ângulo Reto 90° */}
                <rect x="80" y="125" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1" />
                <circle cx="87.5" cy="132.5" r="1.5" fill="#fff" />

                {/* Quadrado do Cateto A (Vertical - Ciano) */}
                <rect
                  x={80 - (catetoA * 12)}
                  y="80"
                  width={catetoA * 12}
                  height={catetoA * 12}
                  fill="rgba(6, 182, 212, 0.25)"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                />
                <text x={80 - (catetoA * 6)} y={80 + (catetoA * 6)} fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {areaQuadradoA}
                </text>

                {/* Quadrado do Cateto B (Horizontal - Esmeralda) */}
                <rect
                  x="80"
                  y="140"
                  width={catetoB * 12}
                  height={catetoB * 12}
                  fill="rgba(16, 185, 129, 0.25)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <text x={80 + (catetoB * 6)} y={140 + (catetoB * 7)} fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {areaQuadradoB}
                </text>

                {/* Rótulo da Hipotenusa */}
                <text x="130" y="100" fill="#a855f7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  c = {hipotenusa.toFixed(1)}
                </text>
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-neutral-400 bg-black/80 px-2 py-1 rounded">
                Catetos: {catetoA} e {catetoB} | Hipotenusa: {hipotenusa.toFixed(2)}
              </div>
            </div>

            {/* Balanço Matemático das Áreas */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-3 bg-black border border-cyan-900/50 rounded">
                  <span className="text-[10px] text-cyan-400 uppercase block mb-1">Área A (a²)</span>
                  <span className="text-xl font-bold text-white">{areaQuadradoA} u²</span>
                </div>
                <div className="p-3 bg-black border border-emerald-900/50 rounded">
                  <span className="text-[10px] text-emerald-400 uppercase block mb-1">Área B (b²)</span>
                  <span className="text-xl font-bold text-white">{areaQuadradoB} u²</span>
                </div>
                <div className="p-3 bg-black border border-purple-900/50 rounded">
                  <span className="text-[10px] text-purple-400 uppercase block mb-1">Área C (c²)</span>
                  <span className="text-xl font-bold text-white">{areaQuadradoC.toFixed(0)} u²</span>
                </div>
              </div>

              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded font-mono text-center text-xs space-y-1">
                <div className="text-neutral-400">Verificação da Igualdade de Superfícies:</div>
                <div className="text-base text-white font-bold">
                  <span className="text-cyan-400">{areaQuadradoA}</span> + <span className="text-emerald-400">{areaQuadradoB}</span> = <span className="text-purple-400">{areaQuadradoC.toFixed(0)}</span>
                </div>
                <div className="text-[11px] text-emerald-400 pt-1">
                  Conservação exata de área garantida pela geometria plana!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 03: POLÍGONOS REGULARES E FATIAMENTO TRIANGULAR */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Polígonos Regulares: O Fatiamento em Triângulos
          </h2>
        </div>

        <p>
          Qualquer polígono do universo (seja um pentágono, um decágono ou uma figura de 50 lados) pode ser <strong>fatiado em triângulos</strong> a partir de um único vértice.
        </p>

        <p className="text-neutral-300">
          Se você fixar um vértice e puxar todas as diagonais possíveis para os outros cantos, você sempre divide um polígono de <strong>n lados</strong> em exatamente <strong>(n - 2) triângulos</strong>. Como cada triângulo guarda internamente 180°, a soma total dos ângulos internos é inevitavelmente:
        </p>

        <div className="p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-sm text-center font-mono text-lg text-cyan-300 font-bold my-4">
          Sᵢ = (n - 2) · 180°
        </div>

        {/* SIMULADOR INTERATIVO: EXPLORADOR DE POLÍGONOS REGULARES */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Explorador de Polígonos Regulares
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere o número de lados e veja os triângulos internos, as diagonais e os ângulos calculados:
              </p>
            </div>

            <div className="flex gap-2">
              {[5, 6, 8, 10, 12].map((n) => (
                <button
                  key={n}
                  onClick={() => setLadosPoligono(n)}
                  className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                    ladosPoligono === n
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  n = {n}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Polígono Regular */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {renderizarMalhaSimples()}

                {/* Polígono preenchido */}
                <polygon
                  points={gerarPontosPoligono(ladosPoligono, 75, 100, 100)}
                  fill="rgba(6, 182, 212, 0.1)"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />

                {/* Vértice Central */}
                <circle cx="100" cy="100" r="3" fill="#ffffff" opacity="0.6" />

                {/* Linhas radiais até os vértices simulando as fatias */}
                {(() => {
                  const linhas = [];
                  for (let i = 0; i < ladosPoligono; i++) {
                    const ang = (i * 2 * Math.PI) / ladosPoligono - Math.PI / 2;
                    const x = 100 + 75 * Math.cos(ang);
                    const y = 100 + 75 * Math.sin(ang);
                    linhas.push(
                      <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="#333" strokeDasharray="2" strokeWidth="1" />
                    );
                  }
                  return linhas;
                })()}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/80 px-2 py-1 rounded">
                Polígono Regular de {ladosPoligono} Lados
              </div>
            </div>

            {/* Raio-X do Polígono */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Triângulos Formados (n - 2):</span>
                <span className="text-cyan-400 font-bold text-sm">{ladosPoligono - 2} triângulos</span>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Soma dos Ângulos Internos (Sᵢ):</span>
                <span className="text-white font-bold text-sm">{somaInterna}°</span>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Cada Ângulo Interno (Regular):</span>
                <span className="text-emerald-400 font-bold text-sm">{anguloInterno.toFixed(1)}°</span>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Total de Diagonais n(n-3)/2:</span>
                <span className="text-purple-400 font-bold text-sm">{totalDiagonais} diagonais</span>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-neutral-400 leading-relaxed font-sans">
                <strong className="text-white font-mono">Curiosidade Universal:</strong> A soma dos ângulos <em>externos</em> de qualquer polígono convexo é SEMPRE rigorosamente <strong>360°</strong>, não importando se ele tem 3 ou 1.000 lados!
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine as Razões e os Polígonos
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para esboçar a proporcionalidade k², aplicar ternas pitagóricas ou fatiar polígonos antes de validar sua resposta!
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
                        {acertou ? 'Raciocínio proporcional impecável!' : 'Atenção às escalas quadráticas e decomposições! Veja a dedução:'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 11:</p>
        <p className="leading-relaxed">
          Você dominou o salto entre o comprimento e a área (a escala k²), desmistificou o Teorema de Pitágoras como uma conservação real de superfícies e entendeu por que todo polígono é apenas um conjunto de triângulos articulados. No próximo caderno (<strong>Doc 12: Círculos, Circunferências e Áreas de Figuras Planas</strong>), encerraremos o Módulo 03 explorando a constante mais famosa do universo (o número π), o cálculo de setores circulares e as técnicas de decomposição de áreas complexas!
        </p>
      </footer>

    </article>
  );
}