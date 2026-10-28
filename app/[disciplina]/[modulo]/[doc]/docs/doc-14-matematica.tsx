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
            ✏️ Desenhar Triângulos / Vetores
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Contas / Cossenos
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
              Esboce triângulos oblíquos ou o raio circunscrito
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Aplique a² = b² + c² - 2bc·cos(A), monte a razão a/sen(A) = 2R ou calcule a área por sen..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 14 - LEIS DOS SENOS E COSSENOS
// =========================================================================
export default function Doc14Matematica() {
  // Simulador 1: Deformador de Pitágoras (Lei dos Cossenos Dinâmica)
  const [anguloA, setAnguloA] = useState<number>(60); // Ângulo em graus
  const ladoB = 6;
  const ladoC = 8;
  const radA = (anguloA * Math.PI) / 180;
  const cosA = Math.cos(radA);
  // a² = b² + c² - 2bc*cos(A)
  const termoPit = ladoB * ladoB + ladoC * ladoC; // 36 + 64 = 100
  const termoAjuste = 2 * ladoB * ladoC * cosA;   // 96 * cos(A)
  const ladoAQuadrado = Math.max(0.1, termoPit - termoAjuste);
  const ladoA = Math.sqrt(ladoAQuadrado);

  // Coordenadas para renderização SVG do Simulador 1 (Vértice A em 40, 160)
  const ax = 40;
  const ay = 160;
  // Lado c (8 unidades) fica na horizontal
  const bx = ax + ladoC * 18;
  const by = ay;
  // Lado b (6 unidades) gira de acordo com o ângulo A
  const cx = ax + ladoB * 18 * Math.cos(radA);
  const cy = ay - ladoB * 18 * Math.sin(radA);

  // Simulador 2: Radar da Lei dos Senos e Círculo Circunscrito (Raio R fixo = 5 u)
  const raioCircunscrito = 5;
  const [anguloSeno, setAnguloSeno] = useState<number>(45);
  const radSeno = (anguloSeno * Math.PI) / 180;
  const valorSen = Math.sin(radSeno);
  // Pela lei dos senos: lado = 2R * sen(θ)
  const cordaLado = 2 * raioCircunscrito * valorSen;

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
  const renderizarMalhaSegura = (largura: number, altura: number) => {
    const linhas = [];
    const step = 20;
    for (let x = 0; x <= largura; x += step) {
      linhas.push(<line key={`v-${x}`} x1={x} y1={0} x2={x} y2={altura} stroke="#222" strokeWidth="0.5" />);
    }
    for (let y = 0; y <= altura; y += step) {
      linhas.push(<line key={`h-${y}`} x1={0} y1={y} x2={largura} y2={y} stroke="#222" strokeWidth="0.5" />);
    }
    return linhas;
  };

  const questoes = [
    {
      id: 1,
      tema: 'Lei dos Cossenos: Navegação Naval',
      pergunta: 'Dois barcos de resgate partem juntos do mesmo porto. O barco Alfa navega 5 milhas náuticas em linha reta, enquanto o barco Bravo navega 8 milhas náuticas por outra rota retilínea. O ângulo formado entre as trajetórias dos dois barcos é de exatamente 60°. Qual é a distância em linha reta que separa os dois barcos no final desse trajeto?',
      opcoes: [
        { idx: 0, texto: 'A) 6 milhas náuticas', correta: false },
        { idx: 1, texto: 'B) 7 milhas náuticas', correta: true },
        { idx: 2, texto: 'C) √89 milhas náuticas (aprox. 9,4 milhas)', correta: false },
        { idx: 3, texto: 'D) 8 milhas náuticas', correta: false },
      ],
      explicacao: [
        'Identificação do padrão Lado-Ângulo-Lado (LAL) para a Lei dos Cossenos:',
        '1. Temos dois lados conhecidos (b = 5 e c = 8) e o ângulo formado entre eles (A = 60°). Queremos o lado oposto d.',
        '2. Aplicando a Lei dos Cossenos: d² = b² + c² - 2·b·c·cos(A).',
        '3. Substituindo os valores: d² = 5² + 8² - 2·(5)·(8)·cos(60°).',
        '   d² = 25 + 64 - 80·(1/2)',
        '   d² = 89 - 40 = 49.',
        '4. Extraindo a raiz quadrada exata: d = √49 = 7 milhas náuticas.',
        'Repare que se o ângulo fosse de 90°, a distância seria √89 ≈ 9,4 milhas. Como o ângulo é de 60° (agudo), o termo corretivo -40 encolhe a distância para 7 milhas! Alternativa B correta.',
      ],
    },
    {
      id: 2,
      tema: 'Lei dos Senos e o Círculo Circunscrito (2R)',
      pergunta: 'Um triângulo possui um lado medindo 12 cm que fica exatamente oposto a um ângulo interno de 30°. Se traçarmos uma circunferência que passa pelos três vértices desse triângulo (circunferência circunscrita), qual é a medida do RAIO dessa circunferência?',
      opcoes: [
        { idx: 0, texto: 'A) 6 cm', correta: false },
        { idx: 1, texto: 'B) 12 cm', correta: true },
        { idx: 2, texto: 'C) 24 cm', correta: false },
        { idx: 3, texto: 'D) 12√3 cm', correta: false },
      ],
      explicacao: [
        'A elegância da Lei dos Senos com o diâmetro circunscrito:',
        '1. Lei Fundamental dos Senos: a / sen(A) = 2R (onde R é o raio do círculo circunscrito).',
        '2. O lado oposto mede a = 12 cm e o ângulo mede A = 30°.',
        '3. Substituindo: 12 / sen(30°) = 2R.',
        '   Como sen(30°) = 1/2 = 0,5: 12 / 0,5 = 2R → 24 = 2R.',
        '4. Isolando o raio: R = 24 / 2 = 12 cm.',
        'O raio do círculo circunscrito mede exatamente os mesmos 12 cm do lado oposto ao ângulo de 30°! Alternativa B perfeita.',
      ],
    },
    {
      id: 3,
      tema: 'Cálculo de Área sem Altura (Fórmula do Seno)',
      pergunta: 'Um fazendeiro deseja cercar um piquete de pastagem em formato triangular. As duas cercas principais medem 40 metros e 50 metros de comprimento e se encontram formando uma porteira com ângulo de 30° entre elas. Qual é a área exata desse piquete de pastagem em metros quadrados?',
      opcoes: [
        { idx: 0, texto: 'A) 1.000 m²', correta: false },
        { idx: 1, texto: 'B) 500 m²', correta: true },
        { idx: 2, texto: 'C) 500√3 m² (aprox. 866 m²)', correta: false },
        { idx: 3, texto: 'D) 250 m²', correta: false },
      ],
      explicacao: [
        'A fórmula trigonométrica da área para triângulos quaisquer:',
        '1. Tradicionalmente, área de triângulo é (Base · Altura) / 2. Mas não conhecemos a altura desse terreno!',
        '2. Como a altura relativa é dada por h = b · sen(θ), a área de qualquer triângulo pode ser calculada diretamente por: Área = (a · b · sen(θ)) / 2.',
        '3. Dados: a = 40 m, b = 50 m e θ = 30°.',
        '   Área = (40 · 50 · sen(30°)) / 2',
        '   Área = (2.000 · 0,5) / 2 = 1.000 / 2 = 500 m².',
        'Não foi necessário traçar nenhuma reta auxiliar nem calcular alturas. Alternativa B correta!',
      ],
    },
    {
      id: 4,
      tema: 'Estratégia de Decisão: LAL vs LLL vs ALA',
      pergunta: 'Em um projeto topográfico, você recebe a medição dos três lados de um triângulo qualquer: a = 7 m, b = 8 m e c = 9 m (caso Lado-Lado-Lado). Qual ferramenta você deve utilizar obrigatoriamente como primeiro passo para encontrar a medida dos ângulos desse triângulo, e por que a outra ferramenta falharia de imediato?',
      opcoes: [
        { idx: 0, texto: 'A) Deve usar a Lei dos Senos, pois ela é algebricamente mais rápida que a dos Cossenos.', correta: false },
        { idx: 1, texto: 'B) Deve usar a Lei dos Cossenos, pois a Lei dos Senos exige conhecer previamente pelo menos um par lado-ângulo correspondente para montar a proporção.', correta: true },
        { idx: 2, texto: 'C) Deve usar o Teorema de Pitágoras, pois a soma dos quadrados sempre revela o ângulo.', correta: false },
        { idx: 3, texto: 'D) Qualquer uma das duas leis funciona com o mesmo número de passos quando se conhecem os três lados.', correta: false },
      ],
      explicacao: [
        'O mapa mental de tomada de decisão em geometria oblíqua:',
        '1. Na Lei dos Senos, cada fração é do tipo: lado / sen(ângulo). Para resolver uma proporção a/sen(A) = b/sen(B), precisamos conhecer pelo menos três grandezas. Se não temos NENHUM ângulo, teremos duas incógnitas na mesma equação, o que trava a conta!',
        '2. Já na Lei dos Cossenos: a² = b² + c² - 2bc·cos(A). Conhecendo os três lados (a, b, c), a ÚNICA letra desconhecida na equação inteira é o cos(A).',
        '3. Portanto, para casos LLL (três lados conhecidos) ou LAL (dois lados e o ângulo entre eles), a Lei dos Cossenos é a chave mestra obrigatória de entrada! Alternativa B!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO COM AVISO PEDAGÓGICO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 14 • Módulo 04: Trigonometria Avançada e Triângulos Quaisquer
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Leis dos Senos e Cossenos: <br />
          <span className="text-cyan-400 font-light">Navegação e Resolução de Triângulos Quaisquer</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO: A QUEBRA DA PRISÃO DOS 90 GRAUS */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Metodológica: Libertando a Geometria do Ângulo Reto
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Até o Doc 13, estávamos presos à gaiola confortável do triângulo retângulo (com seu canto de 90° e hipotenusa evidente). No mundo real da topografia, do GPS e da navegação naval, <strong>quase nenhum triângulo possui ângulo reto</strong>.
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • A <strong>Lei dos Cossenos</strong> não é uma fórmula nova para decorar: ela é o <strong>Teorema de Pitágoras com um amortecedor de ajuste</strong> (<span className="text-cyan-300">- 2bc · cos(A)</span>). Se o ângulo for reto, o ajuste zera e vira Pitágoras clássico.
            </li>
            <li>
              • A <strong>Lei dos Senos</strong> revela uma harmonia cósmica: a razão entre qualquer lado e o seno do seu ângulo oposto é uma constante imutável igual ao <strong>diâmetro do círculo circunscrito (2R)</strong>.
            </li>
            <li>
              • Você nunca mais precisará desenhar alturas com linhas pontilhadas para calcular áreas de terrenos: o produto de dois lados pelo seno do ângulo entre eles resolve a superfície em uma linha.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: A LEI DOS COSSENOS COMO O PITÁGORAS GENERALIZADO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Lei dos Cossenos: O Teorema de Pitágoras com Freio e Acelerador
          </h2>
        </div>

        <p>
          Imagine que você tem dois lados fixos de madeira ligados por uma dobradiça: lado <code className="text-cyan-300 font-mono font-bold">b = 6</code> e lado <code className="text-emerald-400 font-mono font-bold">c = 8</code>.
        </p>

        <p className="text-neutral-300">
          Se a dobradiça formar um ângulo reto perfeito de <strong>90°</strong>, o Teorema de Pitágoras garante que a hipotenusa oposta medirá <code className="text-white font-mono font-bold">a = √(6² + 8²) = 10</code>. Mas e se você fechar a dobradiça para <strong>60°</strong>? O lado oposto encolhe! E se abrir a dobradiça para <strong>120°</strong>? O lado oposto estica além de 10!
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-center my-6 space-y-3">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold tracking-wider">
            a² = b² + c² <span className="text-cyan-400">- 2·b·c·cos(A)</span>
          </div>
          <p className="text-xs text-neutral-300 font-mono">
            Pitágoras Base (b² + c²) com o termo corretivo elástico (- 2bc · cos A)
          </p>
        </div>

        {/* SIMULADOR INTERATIVO: O DEFORMADOR DE PITÁGORAS */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: A Dobradiça da Lei dos Cossenos
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Lados fixos: b = 6 e c = 8. Abra e feche o ângulo A e veja o lado &quot;a&quot; se adaptar:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Ângulo Â:</span>
              <input
                type="range"
                min="20"
                max="160"
                step="5"
                value={anguloA}
                onChange={(e) => setAnguloA(parseInt(e.target.value))}
                className="w-28 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold w-12 text-center">{anguloA}°</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Triângulo Deformável */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[420px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 240 190" className="w-full h-full">
                {renderizarMalhaSegura(240, 190)}

                {/* Triângulo dinâmico */}
                <polygon
                  points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
                  fill="rgba(6, 182, 212, 0.12)"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />

                {/* Lado a (o lado que se ajusta em Esmeralda brilhante) */}
                <line x1={bx} y1={by} x2={cx} y2={cy} stroke="#10b981" strokeWidth="2.5" />

                {/* Pontos nos vértices */}
                <circle cx={ax} cy={ay} r="4" fill="#ffffff" />
                <circle cx={bx} cy={by} r="4" fill="#ffffff" />
                <circle cx={cx} cy={cy} r="5" fill="#06b6d4" />

                {/* Rótulos dos lados */}
                <text x={(ax + bx) / 2} y={ay + 18} fill="#888" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  c = 8
                </text>
                <text x={(ax + cx) / 2 - 12} y={(ay + cy) / 2} fill="#888" fontSize="10" fontFamily="monospace">
                  b = 6
                </text>
                <text x={(bx + cx) / 2 + 8} y={(by + cy) / 2} fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  a = {ladoA.toFixed(2)}
                </text>

                {/* Indicação do Ângulo no Vértice A */}
                <text x={ax + 12} y={ay - 8} fill="#06b6d4" fontSize="10" fontFamily="monospace">
                  {anguloA}°
                </text>
              </svg>

              <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-neutral-400">Tipo: </span>
                <span className={anguloA === 90 ? 'text-white font-bold' : anguloA < 90 ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                  {anguloA === 90 ? 'Retângulo (Pitágoras puro)' : anguloA < 90 ? 'Acutângulo (Lado a encolhido)' : 'Obtusângulo (Lado a esticado)'}
                </span>
              </div>
            </div>

            {/* Painel do Freio de Ajuste */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">1. Termo Base de Pitágoras (b² + c²):</div>
                <div className="text-white font-bold text-sm">6² + 8² = 36 + 64 = 100</div>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">2. Termo de Ajuste (- 2bc · cos Â):</div>
                <div className="text-cyan-300 font-bold text-sm">
                  - 2 · (6) · (8) · ({cosA.toFixed(3)}) = {termoAjuste >= 0 ? `- ${termoAjuste.toFixed(1)}` : `+ ${Math.abs(termoAjuste).toFixed(1)}`}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {cosA > 0 ? 'cos > 0: o termo subtrai energia do lado a' : cosA < 0 ? 'cos < 0: menos com menos vira mais, o lado a cresce' : 'cos(90°) = 0: termo nulo (Pitágoras exato)'}
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded flex justify-between items-center">
                <span className="text-neutral-400">Comprimento do Lado a:</span>
                <span className="text-emerald-400 font-bold text-base">a = {ladoA.toFixed(2)} u</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: A LEI DOS SENOS E A CONSTANTE CIRCUNSCRITA (2R) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Lei dos Senos: A Harmonia do Diâmetro Circunscrito (2R)
          </h2>
        </div>

        <p>
          Enquanto a Lei dos Cossenos relaciona <strong>três lados e um ângulo</strong> (foco na dobradiça), a <strong>Lei dos Senos</strong> relaciona <strong>pares opostos (lado e seu respectivo ângulo)</strong>.
        </p>

        <p className="text-neutral-300">
          Existe um círculo perfeito que sempre consegue abraçar os três vértices de qualquer triângulo (o círculo circunscrito). O astrônomo Ptolomeu descobriu que a razão entre a medida de qualquer lado e o seno do ângulo oposto é <strong>rigorosamente constante e igual ao diâmetro desse círculo (2R)</strong>:
        </p>

        <div className="p-6 border border-emerald-900/40 bg-emerald-950/10 rounded-sm text-center my-6 space-y-2">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold tracking-wider">
            <span className="text-cyan-400">a / sen(Â)</span> = <span className="text-emerald-400">b / sen(B̂)</span> = <span className="text-amber-400">c / sen(Ĉ)</span> = <span className="text-white">2R</span>
          </div>
          <p className="text-xs text-neutral-300 font-mono">
            Onde R é o raio da circunferência que circunscreve o triângulo
          </p>
        </div>

        {/* SIMULADOR INTERATIVO: A CORDA E O DIÂMETRO 2R */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: A Corda no Círculo de Raio R = 5
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere o ângulo oposto θ e veja como a corda (lado) cresce em proporção exata ao seno:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Ângulo θ:</span>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={anguloSeno}
                onChange={(e) => setAnguloSeno(parseInt(e.target.value))}
                className="w-24 accent-emerald-400 cursor-pointer"
              />
              <span className="font-mono text-emerald-400 font-bold w-10 text-center">{anguloSeno}°</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Círculo Circunscrito */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="0 0 220 220" className="w-full h-full">
                {/* Círculo Circunscrito Raio = 80 px (simbolizando R = 5) */}
                <circle cx="110" cy="110" r="80" fill="none" stroke="#444" strokeWidth="1.5" />
                
                {/* Diâmetro de referência 2R */}
                <line x1="30" y1="110" x2="190" y2="110" stroke="#333" strokeDasharray="3" strokeWidth="1" />
                
                {/* Triângulo inscrito onde a base é a corda calculada */}
                {(() => {
                  // A corda tem comprimento proporcional a sen(θ)
                  const halfChordPx = 80 * valorSen;
                  const cordaX1 = 110 - halfChordPx;
                  const cordaX2 = 110 + halfChordPx;
                  const cordaY = 110 + Math.sqrt(Math.max(0, 80 * 80 - halfChordPx * halfChordPx));
                  const topoX = 110;
                  const topoY = 30;

                  return (
                    <>
                      <polygon
                        points={`${topoX},${topoY} ${cordaX1},${cordaY} ${cordaX2},${cordaY}`}
                        fill="rgba(16, 185, 129, 0.15)"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                      {/* A corda (lado do triângulo) destacada em Ciano */}
                      <line x1={cordaX1} y1={cordaY} x2={cordaX2} y2={cordaY} stroke="#06b6d4" strokeWidth="3" />
                      
                      <circle cx={topoX} cy={topoY} r="3.5" fill="#fff" />
                      <circle cx={cordaX1} cy={cordaY} r="3.5" fill="#fff" />
                      <circle cx={cordaX2} cy={cordaY} r="3.5" fill="#fff" />
                    </>
                  );
                })()}

                {/* Centro do círculo */}
                <circle cx="110" cy="110" r="3" fill="#888" />
                <text x="115" y="105" fill="#888" fontSize="10" fontFamily="monospace">R = 5</text>
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-white">Diâmetro 2R = 10 u</span>
              </div>
            </div>

            {/* Painel da Razão Imutável */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Seno do Ângulo oposto:</span>
                <span className="text-emerald-400 font-bold text-sm">sen({anguloSeno}°) = {valorSen.toFixed(3)}</span>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Comprimento da Corda (Lado a):</span>
                <span className="text-cyan-400 font-bold text-sm">a = 2R · sen(θ) = {cordaLado.toFixed(2)} u</span>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-900/50 rounded text-center space-y-1">
                <div className="text-neutral-400">A Razão Sagrada da Lei dos Senos:</div>
                <div className="text-white font-bold text-base">
                  {cordaLado.toFixed(2)} / {valorSen.toFixed(3)} = <span className="text-emerald-300">10.00 (2R)</span>
                </div>
                <div className="text-[10px] text-neutral-500 pt-1">
                  Não importa o ângulo: a divisão do lado pelo seu seno sempre crava no diâmetro 2R!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 03: ÁREA DE TRIÂNGULOS QUAISQUER COM SENO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Área de Triângulos Oblíquos: Adeus à Linha de Altura
          </h2>
        </div>

        <p>
          Calcular a área de um triângulo sempre exigiu saber a sua base e a sua altura perpendicular (<code className="text-white font-mono">A = b · h / 2</code>). Mas em topografia e no mundo prático, quase nunca temos como entrar no meio de uma floresta ou lago para medir a altura interna perpendicular!
        </p>

        <p className="text-neutral-300">
          Como vimos no Doc 13, a altura vertical é simplesmente a projeção trigonométrica: <code className="text-cyan-300 font-mono font-bold">h = lado · sen(θ)</code>. Substituindo na fórmula tradicional da área:
        </p>

        <div className="p-6 border border-neutral-800 bg-[#070707] rounded-sm text-center my-6 space-y-2">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold">
            Área = (a · b · sen θ) / 2
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Multiplique dois lados quaisquer, multiplique pelo seno do ângulo entre eles e divida por 2!
          </p>
        </div>
      </section>

      {/* 5. PILAR 04: O GUIA DEFINITIVO DE DECISÃO (COSSENOS VS SENOS) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Bússola de Decisão: Qual Lei Devo Escolher na Prova?
          </h2>
        </div>

        <p>
          Para nunca hesitar na hora de resolver um problema com triângulos oblíquos, memorize este diagrama mental binário:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 font-mono text-xs">
          <div className="border border-cyan-800 bg-cyan-950/20 p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-bold uppercase text-sm block">Quando Usar a Lei dos Cossenos:</span>
            <ul className="text-neutral-300 space-y-2 font-sans font-light leading-relaxed">
              <li>• <strong>Caso LAL (Lado - Ângulo - Lado):</strong> Você tem dois lados e o ângulo prensado entre eles. Quer descobrir o terceiro lado.</li>
              <li>• <strong>Caso LLL (Três Lados Conhecidos):</strong> Você tem as três medidas numéricas dos lados e quer descobrir qualquer um dos ângulos.</li>
              <li>• <em>Dica de ouro:</em> Envolveu 3 lados e apenas 1 ângulo? Vá de <strong>Cossenos</strong>!</li>
            </ul>
          </div>

          <div className="border border-emerald-800 bg-emerald-950/20 p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-bold uppercase text-sm block">Quando Usar a Lei dos Senos:</span>
            <ul className="text-neutral-300 space-y-2 font-sans font-light leading-relaxed">
              <li>• <strong>Caso ALA ou LAA (Dois Ângulos e Um Lado):</strong> Você conhece dois ângulos (o que automaticamente te dá o terceiro, já que somam 180°) e pelo menos um lado.</li>
              <li>• <strong>Par Oposto Conhecido:</strong> Você tem um lado e o ângulo exatamente oposto a ele.</li>
              <li>• <strong>Raio Circunscrito (R):</strong> O problema citou o círculo que passa pelos três vértices? É 100% certeza de <strong>Lei dos Senos (= 2R)</strong>!</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine a Navegação e os Triângulos Oblíquos
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para identificar os casos (LAL, LLL ou ALA), esboçar os vetores e calcular os senos/cossenos antes de confirmar sua resposta!
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
                        {acertou ? 'Resolução geométrica precisa!' : 'Atenção aos sinais do cosseno e ao diâmetro 2R! Veja a dedução:'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 14:</p>
        <p className="leading-relaxed">
          Você libertou a trigonometria das limitações do triângulo retângulo. Saber utilizar a Lei dos Cossenos como a extensão viva de Pitágoras e enxergar a Lei dos Senos como a ponte direta para o círculo circunscrito (2R) permite que você resolva qualquer desafio de navegação espacial, cálculo de forças vetoriais na física ou triangulação de antenas no solo. No próximo caderno (<strong>Doc 15: Geometria Espacial - Poliedros, Prismas e Pirâmides</strong>), adicionaremos a terceira dimensão (Z) para calcular volumes, capacidades em litros e áreas totais de sólidos tridimensionais!
        </p>
      </footer>

    </article>
  );
}