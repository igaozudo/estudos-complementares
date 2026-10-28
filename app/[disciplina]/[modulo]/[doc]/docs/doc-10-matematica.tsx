'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID CARTESIANO/GEOMÉTRICO)
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
            ✏️ Traçar Ângulos / Triângulos
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotações / Demonstrações
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
          <div className="relative w-full h-44 md:h-56 touch-none overflow-hidden"
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                   linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
                 `,
                 backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
                 backgroundPosition: 'center center'
               }}>
            {/* Linhas de Mira Suaves */}
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
              Use a grade para desenhar transversais e caçar ângulos
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Anote as relações de ângulos alternos internos, a soma de 180° ou a desigualdade triangular..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 10 - FUNDAMENTOS DA GEOMETRIA PLANA
// =========================================================================
export default function Doc10Matematica() {
  // Simulador 1: Retas Paralelas Cortadas por Transversal (O Zorro do Paralelismo)
  const [anguloTransversal, setAnguloTransversal] = useState<number>(65); // em graus
  const anguloObtuso = 180 - anguloTransversal;

  // Simulador 2: A Rigidez do Triângulo e a Soma Invariante de 180°
  const [verticeX, setVerticeX] = useState<number>(100);
  const [verticeY, setVerticeY] = useState<number>(35);

  // Vértices da base fixa: A = (30, 150), B = (170, 150), C = (verticeX, verticeY)
  const ax = 30, ay = 150;
  const bx = 170, by = 150;
  const cx = verticeX, cy = verticeY;

  // Cálculo dos comprimentos dos lados
  const ladoC = Math.hypot(bx - ax, by - ay); // Base = 140
  const ladoA = Math.hypot(cx - bx, cy - by); // Lado BC
  const ladoB = Math.hypot(cx - ax, cy - ay); // Lado AC

  // Lei dos Cossenos para ângulos exatos
  const calcAnguloA = Math.acos(Math.max(-1, Math.min(1, (ladoB * ladoB + ladoC * ladoC - ladoA * ladoA) / (2 * ladoB * ladoC)))) * (180 / Math.PI);
  const calcAnguloB = Math.acos(Math.max(-1, Math.min(1, (ladoA * ladoA + ladoC * ladoC - ladoB * ladoB) / (2 * ladoA * ladoC)))) * (180 / Math.PI);
  const calcAnguloC = 180 - (calcAnguloA + calcAnguloB);

  // Exercícios
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

  const questoes = [
    {
      id: 1,
      tema: 'Retas Paralelas e o Teorema do Bico',
      pergunta: 'Duas retas paralelas r e s são cortadas por duas transversais que se encontram formando um "bico" apontado para a direita. O ângulo superior interno mede 35° e o ângulo inferior interno mede 45°. Qual é o valor do ângulo x formado na ponta do bico?',
      opcoes: [
        { idx: 0, texto: 'A) 70°', correta: false },
        { idx: 1, texto: 'B) 80°', correta: true },
        { idx: 2, texto: 'C) 90°', correta: false },
        { idx: 3, texto: 'D) 100°', correta: false },
      ],
      explicacao: [
        'A técnica do "Teorema do Bico" (Construção Auxiliar):',
        '1. Truque de mestre da geometria: trace uma terceira reta paralela imaginária (reta t) passando exatamente pela ponta do bico.',
        '2. O ângulo x fica fatiado em duas metades (uma parte de cima e uma de baixo).',
        '3. Pelo "Z do Zorro" (ângulos alternos internos):',
        '   - A fatia superior de x é alterno interno ao ângulo de 35°. Logo, mede 35°.',
        '   - A fatia inferior de x é alterno interno ao ângulo de 45°. Logo, mede 45°.',
        '4. Somando as duas fatias: x = 35° + 45° = 80°.',
        'Regra prática: A soma dos ângulos apontados para a esquerda é igual à soma dos ângulos apontados para a direita. Alternativa B correta!',
      ],
    },
    {
      id: 2,
      tema: 'Teorema do Ângulo Externo do Triângulo',
      pergunta: 'Em um triângulo qualquer ABC, o ângulo externo relativo ao vértice C mede 115°. Sabendo que o ângulo interno no vértice A mede 45°, qual é a medida do ângulo interno no vértice B?',
      opcoes: [
        { idx: 0, texto: 'A) 65°', correta: false },
        { idx: 1, texto: 'B) 70°', correta: true },
        { idx: 2, texto: 'C) 75°', correta: false },
        { idx: 3, texto: 'D) 80°', correta: false },
      ],
      explicacao: [
        'O Teorema do Ângulo Externo sem rodeios:',
        '1. O ângulo externo de qualquer triângulo é SEMPRE igual à soma dos dois ângulos internos não vizinhos a ele.',
        '2. Portanto: Ângulo Externo em C = Ângulo Interno em A + Ângulo Interno em B.',
        '3. Montando a igualdade simples: 115° = 45° + B.',
        '4. Isolando B: B = 115° - 45° = 70°.',
        'Você também poderia calcular o suplementar interno de C (180° - 115° = 65°) e depois subtrair de 180°: 180° - (45° + 65°) = 70°. O teorema do ângulo externo faz isso em um passo só! Alternativa B!',
      ],
    },
    {
      id: 3,
      tema: 'Condição de Existência (Desigualdade Triangular)',
      pergunta: 'Um marceneiro possui duas ripas de madeira com comprimentos de 7 cm e 11 cm. Ele precisa cortar uma terceira ripa de comprimento inteiro x (em centímetros) para formar uma moldura triangular. Quantas medidas inteiras diferentes existem para o comprimento da terceira ripa?',
      opcoes: [
        { idx: 0, texto: 'A) 11 possibilidades inteiras (de 4 a 14 cm)', correta: false },
        { idx: 1, texto: 'B) 13 possibilidades inteiras (de 5 a 17 cm)', correta: true },
        { idx: 2, texto: 'C) 14 possibilidades inteiras (de 4 a 17 cm)', correta: false },
        { idx: 3, texto: 'D) 7 possibilidades inteiras', correta: false },
      ],
      explicacao: [
        'A barreira física da Desigualdade Triangular:',
        '1. Lei fundamental: Em qualquer triângulo, o terceiro lado precisa ser MAIOR que a diferença dos outros dois e MENOR que a soma deles.',
        '   |11 - 7| < x < (11 + 7)',
        '   4 < x < 18.',
        '2. O lado x precisa ser estritamente maior que 4 (se for 4, as duas ripas menores deitam perfeitamente sobre a de 11 e não formam triângulo) e estritamente menor que 18.',
        '3. Valores inteiros permitidos: 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17.',
        '4. Total de valores: 17 - 5 + 1 = 13 possibilidades inteiras. Alternativa B!',
      ],
    },
    {
      id: 4,
      tema: 'Triângulo Isósceles e Dedução em Cadeia',
      pergunta: 'No triângulo ABC, o lado AB é congruente ao lado AC (triângulo isósceles com base BC). O ângulo do vértice A mede 40°. Traça-se a bissetriz interna do ângulo B, que intercepta o lado AC no ponto D. Qual é a medida do ângulo BDC?',
      opcoes: [
        { idx: 0, texto: 'A) 65°', correta: false },
        { idx: 1, texto: 'B) 70°', correta: false },
        { idx: 2, texto: 'C) 75°', correta: true },
        { idx: 3, texto: 'D) 80°', correta: false },
      ],
      explicacao: [
        'Dedução geométrica encadeada (caça aos ângulos):',
        '1. Como o triângulo ABC é isósceles com AB = AC, os ângulos da base (B e C) são idênticos.',
        '2. A soma dos três ângulos é 180°: 40° + 2 · B = 180° → 2 · B = 140° → Ângulo B = 70° e Ângulo C = 70°.',
        '3. A bissetriz interna divide o ângulo B exatamente ao meio: cada metade mede 70° ÷ 2 = 35°.',
        '4. Agora olhe para o triângulo menor BDC formado na parte de baixo:',
        '   - O ângulo DBC mede 35°.',
        '   - O ângulo DCB (que é o C original) mede 70°.',
        '   - A soma interna no triângulo BDC tem que dar 180°: 35° + 70° + BDC = 180°.',
        '   - 105° + BDC = 180° → BDC = 75°. Alternativa C perfeita!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO COM AVISO PEDAGÓGICO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 10 • Início do Módulo 03: Geometria Plana
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Fundamentos da Geometria Plana: <br />
          <span className="text-cyan-400 font-light">Ângulos, Paralelismo e o Átomo Triangular</span>
        </h1>
        
        {/* MANIFESTO PEDAGÓGICO: MUDANÇA TOTAL DE LENTE */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            Aviso Pedagógico: Mude a Sua Lente de Estudo (Chega de Álgebra Cega)
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Se você tentar estudar <strong>Geometria Plana</strong> decorando fórmulas de equações como fazia na Álgebra, você vai travar no primeiro desenho torto.
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>• Na <strong>Álgebra</strong>, você operava símbolos abstratos isolando letras em uma balança.</li>
            <li>• Na <strong>Geometria</strong>, você treina o olho para <strong>ENXERGAR INVARIANTES ESPACIAIS</strong>: o que não muda quando uma reta gira, quando duas retas paralelas são cortadas ou quando um triângulo é deformado.</li>
            <li>• Você não decora fórmulas: você aprende a <strong>caçar ângulos</strong> usando rotação, simetria e linhas auxiliares.</li>
          </ul>
        </div>

        <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed max-w-3xl">
          A Geometria Plana Euclidiana é o código-fonte da arquitetura, do design visual, da mecânica estrutural e da cartografia espacial. Tudo começa no encontro de duas retas e se consolida na figura geométrica mais resistente do universo: o triângulo.
        </p>
      </section>

      {/* 2. PILAR 01: ÂNGULOS E O EFEITO TESOURA (OPV) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Ângulos: O Giro no Espaço e o Efeito Tesoura
          </h2>
        </div>

        <p>
          Um <strong>ângulo</strong> não é uma fórmula: é a medida de uma <strong>abertura de giro</strong>. Uma volta completa tem 360° porque os astrônomos babilônios observavam que o Sol levava aproximadamente 360 dias para completar um ciclo zodiacal no céu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. Ângulo Reto (90°)</span>
            <h4 className="text-white font-medium text-base">O Canto da Parede</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Dois ângulos que juntos formam um canto de 90° são chamados de <strong>complementares</strong> (α + β = 90°).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">2. Ângulo Raso (180°)</span>
            <h4 className="text-white font-medium text-base">A Linha do Horizonte</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Uma reta esticada no chão forma meia-volta completa (180°). Dois ângulos sobre uma reta são <strong>suplementares</strong> (α + β = 180°).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">3. Opostos pelo Vértice (OPV)</span>
            <h4 className="text-white font-medium text-base">O Efeito Tesoura</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Quando duas retas se cruzam em X, o ângulo aberto na frente é <strong>rigorosamente idêntico</strong> ao ângulo aberto nas costas: <strong>ângulos OPV são congruentes</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PILAR 02: RETAS PARALELAS E O "Z DO ZORRO" COM SIMULADOR */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Retas Paralelas Cortadas por Transversal: O "Z do Zorro"
          </h2>
        </div>

        <p>
          Muitos alunos entram em pânico tentando decorar nomes antigos: <em>"alternos internos, alternos externos, colaterais internos, correspondentes..."</em>.
        </p>

        <p className="text-neutral-300">
          <strong>A verdade libertadora da Geometria:</strong> Quando duas retas paralelas são cortadas por uma transversal, surgem 8 ângulos no papel, mas <strong>SÓ EXISTEM DOIS VALORES DE ÂNGULO NO DESENHO INTEIRO</strong>!
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 pl-4 border-l border-neutral-800">
          <li>• Todos os ângulos <strong>agudos</strong> (fechadinhos) têm o mesmo valor (α).</li>
          <li>• Todos os ângulos <strong>obtusos</strong> (abertões) têm o mesmo valor (β).</li>
          <li>• Qualquer agudo somado com qualquer obtuso dá sempre <strong>180°</strong> (α + β = 180°)!</li>
        </ul>

        {/* SIMULADOR INTERATIVO: PARALELAS E TRANSVERSAL */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico de Paralelismo
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Gire a reta transversal e veja os 8 ângulos se reorganizarem instantaneamente:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Inclinação:</span>
              <input
                type="range"
                min="30"
                max="85"
                step="1"
                value={anguloTransversal}
                onChange={(e) => setAnguloTransversal(parseInt(e.target.value))}
                className="w-28 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold w-12 text-center">{anguloTransversal}°</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* Gráfico SVG das Paralelas */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[420px] mx-auto overflow-hidden">
              <svg viewBox="0 0 300 200" className="w-full h-full">
                {/* Linhas Paralelas r e s */}
                <line x1="20" y1="60" x2="280" y2="60" stroke="#555" strokeWidth="1.5" />
                <line x1="20" y1="140" x2="280" y2="140" stroke="#555" strokeWidth="1.5" />
                
                {/* Reta Transversal t inclinada */}
                {(() => {
                  const rad = (anguloTransversal * Math.PI) / 180;
                  const dx = 80 / Math.tan(rad);
                  const xCentro = 150;
                  const xTop = xCentro + dx;
                  const xBottom = xCentro - dx;
                  return (
                    <>
                      <line x1={xBottom - 20} y1="180" x2={xTop + 20} y2="20" stroke="#06b6d4" strokeWidth="2" />
                      
                      {/* Vértice Superior (xCentro, 60) e Inferior (xCentro - dx, 140)... */}
                      {/* Pontos de Interseção */}
                      <circle cx={xCentro + (dx/2)} cy="60" r="3" fill="#06b6d4" />
                      <circle cx={xCentro - (dx/2)} cy="140" r="3" fill="#06b6d4" />
                    </>
                  );
                })()}

                <text x="25" y="52" fill="#888" fontSize="10" fontFamily="monospace">reta r</text>
                <text x="25" y="132" fill="#888" fontSize="10" fontFamily="monospace">reta s (r // s)</text>
              </svg>
              
              <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400 font-bold">Agudo (α): {anguloTransversal}°</span> | <span className="text-amber-400 font-bold">Obtuso (β): {anguloObtuso}°</span>
              </div>
            </div>

            {/* Painel Explicativo do Z do Zorro */}
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-cyan-950/20 border border-cyan-900/50 rounded space-y-2">
                <span className="text-cyan-400 font-bold uppercase block">O "Z do Zorro" (Alternos Internos):</span>
                <p className="text-neutral-300 font-sans font-light leading-relaxed">
                  Se você contornar a letra <strong>Z</strong> entre as retas paralelas, os dois cantos internos de dentro da dobra são obrigatoriamente <strong>IGUAIS</strong>: ambos medem exatos <strong className="text-cyan-300">{anguloTransversal}°</strong>.
                </p>
              </div>

              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded space-y-2">
                <span className="text-amber-400 font-bold uppercase block">A Relação Suplementar (Linha Reta):</span>
                <p className="text-neutral-300 font-sans font-light leading-relaxed">
                  Basta olhar para qualquer um dos vértices: o ângulo fechado somado com o ângulo aberto forma a reta inteira (180°):
                  <br />
                  <strong className="text-white">{anguloTransversal}° + {anguloObtuso}° = 180°</strong>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 03: O TRIÂNGULO COMO O ÁTOMO RÍGIDO DO UNIVERSO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Triângulo: O Átomo Rígido e os Invariantes 180°
          </h2>
        </div>

        <p>
          Por que guindastes de obras, pontes de ferro e treliças de telhado são feitos exclusivamente de triângulos e nunca de quadrados?
        </p>

        <p className="text-neutral-300">
          Se você montar quatro ripas de madeira em forma de quadrado com pregos nas pontas e empurrar um dos cantos, ele tomba e vira um losango mole. <strong>Mas se você montar três ripas em forma de triângulo, ele não deforma nem 1 milímetro!</strong> O triângulo é a única figura geometricamente rígida da natureza. Se os três lados forem fixados, os três ângulos estão automaticamente travados.
        </p>

        {/* SIMULADOR INTERATIVO: A SOMA INVARIANTE DOS ÂNGULOS */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador da Soma Invariante de 180°
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Arraste o vértice superior C no espaço e observe: os ângulos se adaptam, mas a soma JAMAIS sai de 180°!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Posição de C:</span>
              <input
                type="range"
                min="50"
                max="150"
                step="2"
                value={verticeX}
                onChange={(e) => setVerticeX(parseInt(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold w-10 text-center">{verticeX}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Triângulo Dinâmico */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[420px] mx-auto overflow-hidden">
              <svg viewBox="0 0 200 180" className="w-full h-full">
                {/* Malha sutil de fundo */}
                {renderizarMalhaSutil()}

                {/* Linha paralela ao topo demonstrando o teorema de Tales */}
                <line x1="10" y1={cy} x2="190" y2={cy} stroke="#333" strokeDasharray="2" strokeWidth="1" />

                {/* O Triângulo preenchido com gradiente */}
                <polygon
                  points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
                  fill="rgba(6, 182, 212, 0.08)"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />

                {/* Vértices */}
                <circle cx={ax} cy={ay} r="4" fill="#ffffff" />
                <circle cx={bx} cy={by} r="4" fill="#ffffff" />
                <circle cx={cx} cy={cy} r="5" fill="#06b6d4" className="animate-pulse" />

                {/* Rótulos de Vértices */}
                <text x={ax - 15} y={ay + 5} fill="#aaa" fontSize="11" fontFamily="monospace">A</text>
                <text x={bx + 8} y={by + 5} fill="#aaa" fontSize="11" fontFamily="monospace">B</text>
                <text x={cx - 4} y={cy - 10} fill="#06b6d4" fontSize="12" fontWeight="bold" fontFamily="monospace">C</text>
              </svg>
            </div>

            {/* Marcadores dos Três Ângulos */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3 bg-black border border-neutral-800 rounded">
                  <span className="text-[10px] text-neutral-500 uppercase block mb-1">Ângulo Â</span>
                  <span className="text-lg font-bold text-cyan-400">{calcAnguloA.toFixed(1)}°</span>
                </div>
                <div className="p-3 bg-black border border-neutral-800 rounded">
                  <span className="text-[10px] text-neutral-500 uppercase block mb-1">Ângulo B̂</span>
                  <span className="text-lg font-bold text-sky-400">{calcAnguloB.toFixed(1)}°</span>
                </div>
                <div className="p-3 bg-black border border-neutral-800 rounded">
                  <span className="text-[10px] text-neutral-500 uppercase block mb-1">Ângulo Ĉ</span>
                  <span className="text-lg font-bold text-emerald-400">{calcAnguloC.toFixed(1)}°</span>
                </div>
              </div>

              {/* A Soma Mágica Travada em 180° */}
              <div className="p-4 bg-cyan-950/30 border border-cyan-800 rounded text-center">
                <span className="text-xs font-mono text-cyan-300 uppercase block mb-1 font-bold">
                  Soma dos Ângulos Internos (Invariante Universal):
                </span>
                <div className="text-2xl font-mono font-bold text-white tracking-widest">
                  {calcAnguloA.toFixed(1)}° + {calcAnguloB.toFixed(1)}° + {calcAnguloC.toFixed(1)}° = <span className="text-emerald-400">180.0°</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans mt-2">
                  Não importa se o triângulo é acutângulo, retângulo ou obtusângulo: rasgue as três pontas de qualquer triângulo no papel e junte-as; elas formam exatamente uma linha reta perfeita.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PILAR 04: CONDIÇÃO DE EXISTÊNCIA (A DESIGUALDADE TRIANGULAR) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Condição de Existência: Quando o Triângulo Falha em Fechar?
          </h2>
        </div>

        <p>
          Se eu te der três varetas de madeira com medidas <strong>10 cm, 3 cm e 4 cm</strong>, você consegue construir um triângulo?
        </p>

        <p className="text-neutral-300">
          <strong>A resposta física é NÃO!</strong> Coloque a vareta de 10 cm no chão. Se você prender a de 3 cm em uma ponta e a de 4 cm na outra ponta e tentar abaixá-las para fechar o bico, a soma delas dá apenas 7 cm (3 + 4). Elas deitam no chão e ainda sobra um buraco de 3 cm entre elas! Elas nunca se tocam no ar.
        </p>

        <div className="p-6 border border-amber-900/40 bg-amber-950/10 rounded-sm my-6 text-center space-y-3">
          <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider block">
            A Regra de Ouro da Desigualdade Triangular
          </span>
          <div className="text-xl md:text-2xl font-mono text-white font-bold">
            |b - c| &lt; a &lt; b + c
          </div>
          <p className="text-xs text-neutral-300 font-sans font-light max-w-xl mx-auto leading-relaxed">
            Em qualquer triângulo real do universo, qualquer lado escolhido tem que ser <strong>estritamente menor que a soma dos outros dois</strong> e <strong>estritamente maior que a diferença deles</strong>.
          </p>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine a Visão Espacial
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para traçar as retas auxiliares imaginárias e caçar os ângulos antes de bater o martelo na alternativa!
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
                        {acertou ? 'Visão espacial impecável!' : 'Atenção aos ângulos alternos e às somas! Veja a dedução:'}
                      </span>
                    )}
                  </div>

                  {confirmou && (
                    <div className="flex items-center gap-4">
                      {/* BOTAO PARA ENVIAR PRO CADERNO GLOBAL */}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 10:</p>
        <p className="leading-relaxed">
          Você deu o primeiro passo na Geometria Plana compreendendo a rigidez dos triângulos e o segredo do paralelismo. Saber que retas paralelas contêm apenas dois ângulos complementares a 180° e que o triângulo é o bloco de construção indeformável da natureza permite encarar qualquer desafio geométrico sem medo. No próximo caderno (<strong>Doc 11: Congruência, Semelhança de Triângulos e Teorema de Tales</strong>), aprenderemos como a luz projeta sombras e como medir pirâmides usando apenas um bastão no chão!
        </p>
      </footer>

    </article>
  );
}

// Função auxiliar para desenhar malha sem gerar erros de renderização no Next.js
function renderizarMalhaSutil() {
  const linhas = [];
  for (let i = 20; i < 200; i += 20) {
    linhas.push(
      <g key={i}>
        <line x1={i} y1="0" x2={i} y2="180" stroke="#222" strokeWidth="0.5" />
        <line x1="0" y1={i} x2="200" y2={i} stroke="#222" strokeWidth="0.5" />
      </g>
    );
  }
  return linhas;
}