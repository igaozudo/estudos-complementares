'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID DE ARGAND-GAUSS)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Complexa #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Vetores no Plano Complexo
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Briot-Ruffini / Girard
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
            {/* Eixos Re (Real) e Im (Imaginário) */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-600/50 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-neutral-600/50 -translate-x-1/2 pointer-events-none"></div>

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
              Eixo Horizontal: Real (Re) | Eixo Vertical: Imaginário (Im)
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Calcule potências de i, monte a forma polar z = ρ(cos θ + i sen θ) ou aplique Briot-Ruffini para abaixar o grau do polinômio..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 22 - NÚMEROS COMPLEXOS E POLINÔMIOS
// =========================================================================
export default function Doc22Matematica() {
  // -----------------------------------------------------------------------
  // SIMULADOR 1: O RADAR DE ARGAND-GAUSS (z = a + bi E O GIRO DE 90°)
  // -----------------------------------------------------------------------
  const [parteReal, setParteReal] = useState<number>(3);
  const [parteImag, setParteImag] = useState<number>(2);

  // Módulo ρ = √(a² + b²) e Argumento θ = arctan(b/a)
  const moduloZ = Math.hypot(parteReal, parteImag);
  const anguloRad = Math.atan2(parteImag, parteReal);
  const anguloGraus = ((anguloRad * 180) / Math.PI + 360) % 360;

  // Multiplicar por i equivale a girar 90°: (a + bi) * i = -b + ai
  const girarNoventaGraus = () => {
    const novoA = -parteImag;
    const novoB = parteReal;
    setParteReal(novoA);
    setParteImag(novoB);
  };

  // Conjugar: z = a - bi (reflexão no eixo real)
  const conjugarZ = () => {
    setParteImag((prev) => -prev);
  };

  // -----------------------------------------------------------------------
  // SIMULADOR 2: O POLÍGONO DAS RAÍZES DA UNIDADE (zⁿ = 1 DE MOIVRE)
  // -----------------------------------------------------------------------
  const [grauRaiz, setGrauRaiz] = useState<number>(4); // Raízes cúbicas, quartas, etc.

  // Geração das n raízes da unidade w_k = cos(2kπ/n) + i sen(2kπ/n)
  const gerarRaizesUnidade = (n: number) => {
    const raizes = [];
    for (let k = 0; k < n; k++) {
      const ang = (2 * Math.PI * k) / n;
      const x = Math.cos(ang);
      const y = Math.sin(ang);
      raizes.push({ k, ang, x, y, graus: ((ang * 180) / Math.PI).toFixed(0) });
    }
    return raizes;
  };

  const listaRaizes = gerarRaizesUnidade(grauRaiz);

  // -----------------------------------------------------------------------
  // EXERCÍCIOS INTERATIVOS
  // -----------------------------------------------------------------------
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
      tema: 'Ciclo das Potências de i e Simplificação',
      pergunta: 'Ao simplificar a expressão complexa E = i²⁰²⁶ + i²⁰²⁷ + i²⁰²⁸ + i²⁰²⁹, qual é o valor numérico final obtido?',
      opcoes: [
        { idx: 0, texto: 'A) 0 (zero)', correta: true },
        { idx: 1, texto: 'B) 1', correta: false },
        { idx: 2, texto: 'C) -1', correta: false },
        { idx: 3, texto: 'D) 2i', correta: false },
      ],
      explicacao: [
        'A periodicidade quaternária de i (giro de 360° em 4 passos):',
        '1. As potências de i repetem-se estritamente em ciclos de 4:',
        '   i⁰ = 1, i¹ = i, i² = -1, i³ = -i, i⁴ = 1...',
        '2. A soma de qualquer bloco de 4 potências inteiras consecutivas de i é SEMPRE zero:',
        '   1 + i + (-1) + (-i) = 0.',
        '3. Os expoentes 2026, 2027, 2028 e 2029 são quatro inteiros consecutivos.',
        '   i²⁰²⁶ = i² = -1',
        '   i²⁰²⁷ = i³ = -i',
        '   i²⁰²⁸ = i⁰ = 1',
        '   i²⁰²⁹ = i¹ = i',
        '4. Somando: (-1) + (-i) + 1 + i = 0. Alternativa A correta!',
      ],
    },
    {
      id: 2,
      tema: 'Potenciação de De Moivre: (1 + i√3)⁶',
      pergunta: 'O número complexo z = 1 + i√3 está escrito na forma algébrica. Utilizando a Primeira Fórmula de De Moivre na forma polar, qual é o valor exato de z⁶?',
      opcoes: [
        { idx: 0, texto: 'A) 64', correta: true },
        { idx: 1, texto: 'B) -64', correta: false },
        { idx: 2, texto: 'C) 64i', correta: false },
        { idx: 3, texto: 'D) 32 + 32i√3', correta: false },
      ],
      explicacao: [
        'A elegância da forma trigonométrica na potenciação:',
        '1. Módulo de z: ρ = √(1² + (√3)²) = √(1 + 3) = √4 = 2.',
        '2. Argumento θ: cos θ = 1/2 e sen θ = √3/2 → θ = 60° (π/3 radianos).',
        '3. Forma polar: z = 2 · (cos 60° + i sen 60°).',
        '4. Aplicando a fórmula de De Moivre para n = 6:',
        '   z⁶ = 2⁶ · [cos(6 · 60°) + i sen(6 · 60°)]',
        '   z⁶ = 64 · [cos(360°) + i sen(360°)] = 64 · (1 + 0i) = 64.',
        'O número complexo realizou 6 giros de 60°, completando uma volta de 360° exata no eixo real positivo! Alternativa A impecável.',
      ],
    },
    {
      id: 3,
      tema: 'Teorema das Raízes Conjugadas & Briot-Ruffini',
      pergunta: 'O polinômio P(x) = x³ - 5x² + 9x - 5 possui coeficientes reais. Sabe-se que o número complexo z₁ = 2 + i é uma de suas raízes. Quais são as outras duas raízes de P(x)?',
      opcoes: [
        { idx: 0, texto: 'A) z₂ = 2 - i e x₃ = 1', correta: true },
        { idx: 1, texto: 'B) z₂ = -2 + i e x₃ = 5', correta: false },
        { idx: 2, texto: 'C) z₂ = 2 - i e x₃ = -1', correta: false },
        { idx: 3, texto: 'D) z₂ = 1 - 2i e x₃ = 2', correta: false },
      ],
      explicacao: [
        'A simetria das raízes complexas em polinômios com coeficientes reais:',
        '1. Teorema Fundamental das Raízes Conjugadas: se um polinômio tem coeficientes reais e admite z₁ = 2 + i como raiz, o seu conjugado z₂ = 2 - i é OBRIGATORIAMENTE raiz também!',
        '2. Pelo Teorema Fundamental da Álgebra, um polinômio de grau 3 possui exatamente 3 raízes (duas complexas e uma real).',
        '3. Relação de Girard para a soma das raízes: z₁ + z₂ + x₃ = -(-5) / 1 = 5.',
        '4. Somando as duas raízes conhecidas: (2 + i) + (2 - i) = 4.',
        '5. Descobrindo a raiz real: 4 + x₃ = 5 → x₃ = 1.',
        'As outras duas raízes são 2 - i e 1. Alternativa A correta!',
      ],
    },
    {
      id: 4,
      tema: 'Relações de Girard: Raízes em Progressão Aritmética',
      pergunta: 'As três raízes do polinômio cúbico P(x) = x³ - 9x² + 23x - 15 = 0 estão em Progressão Aritmética (PA). Qual é o valor da raiz intermediária desse polinômio?',
      opcoes: [
        { idx: 0, texto: 'A) 3', correta: true },
        { idx: 1, texto: 'B) 5', correta: false },
        { idx: 2, texto: 'C) 1', correta: false },
        { idx: 3, texto: 'D) 4,5', correta: false },
      ],
      explicacao: [
        'A união das Relações de Girard com a Álgebra Discreta (PA):',
        '1. Como as 3 raízes formam uma PA, podemos representá-las como: (r - d), r e (r + d), onde r é a raiz média.',
        '2. Pela 1ª Relação de Girard, a soma das três raízes vale: S₁ = -b/a = -(-9)/1 = 9.',
        '3. Montando a igualdade da soma:',
        '   (r - d) + r + (r + d) = 9',
        '   3r = 9 → r = 3.',
        'A raiz intermediária é imediata: r = 3. As três raízes completas são 1, 3 e 5 (razão d = 2). Alternativa A!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 22 • Encerramento do Módulo 05 &amp; da Trilha Completa de Matemática
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Números Complexos e Polinômios: <br />
          <span className="text-cyan-400 font-light">O Giro de 90°, o Plano de Argand-Gauss e as Raízes da Álgebra</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO DE ENCERRAMENTO */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Fronteira Final: O Fechamento Supremo da Matemática
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Desde o Doc 00, percorremos aritmética, equações, plano cartesiano, trigonometria, geometria métrica e combinatória. Chegamos ao <strong>ápice da álgebra</strong>:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • <strong>A Unidade Imaginária i não é um mistério:</strong> Ela não é um número impossível criado para resolver raízes negativas. Ela é um <strong>operador geométrico de rotação de 90°</strong>. Multiplicar duas vezes por i gira 180°, caindo no lado negativo da reta real (<span className="text-cyan-400 font-bold">i² = -1</span>).
            </li>
            <li>
              • <strong>Multiplicar Complexos é Somar Ângulos:</strong> Na forma polar de De Moivre (<span className="text-emerald-400 font-bold">z = ρ(cos θ + i sen θ)</span>), a multiplicação de vetores multiplica seus módulos e soma seus argumentos geométricos.
            </li>
            <li>
              • <strong>O Teorema Fundamental da Álgebra (Gauss):</strong> Nenhum polinômio fica sem solução. Um polinômio de grau <em>n</em> possui exatamente <em>n</em> raízes no campo complexo, distribuídas com harmonia simétrica no plano.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O PLANO DE ARGAND-GAUSS E O GIRO DE 90° */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Plano de Argand-Gauss: A Geometria da Rotação
          </h2>
        </div>

        <p>
          Na reta real unidimensional, multiplicar por <strong>-1</strong> inverte o sentido do número em 180° (o 3 vira -3). Os matemáticos se perguntaram: <em>qual é a operação intermediária que realiza apenas meia rotação (90°)?</em>
        </p>

        <p className="text-neutral-300">
          Essa meia rotação é exatamente a multiplicação por <code className="text-cyan-300 font-mono font-bold">i</code>!
          <br />
          Ao representar um número complexo como <code className="text-white font-mono font-bold">z = a + bi</code>, abrimos uma segunda dimensão ortogonal: o <strong>Eixo Real (Re)</strong> no chão horizontal e o <strong>Eixo Imaginário (Im)</strong> no mastro vertical.
        </p>

        {/* SIMULADOR 1: O RADAR DE ARGAND-GAUSS */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: O Radar de Argand-Gauss
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Ajuste as partes Real e Imaginária, ou clique para aplicar operações de rotação de 90° e conjugação:
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={girarNoventaGraus}
                className="px-3 py-1.5 text-xs font-mono border border-cyan-800 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 rounded transition-colors flex items-center gap-1.5"
              >
                <span>↺</span> Multiplicar por i (+90°)
              </button>
              <button
                onClick={conjugarZ}
                className="px-3 py-1.5 text-xs font-mono border border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 rounded transition-colors"
              >
                Conjugar z̄ (Reflexão)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* Controles de Coordenadas */}
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-2">
                <span className="text-neutral-400 uppercase text-[10px] block">Coordenadas Algébricas (z = a + bi):</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-cyan-400 block">Parte Real (a): {parteReal}</span>
                    <input
                      type="range" min="-5" max="5" step="1"
                      value={parteReal}
                      onChange={(e) => setParteReal(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-emerald-400 block">Parte Imaginária (b): {parteImag}</span>
                    <input
                      type="range" min="-5" max="5" step="1"
                      value={parteImag}
                      onChange={(e) => setParteImag(parseInt(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Informações Polares */}
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">1. Módulo (Distância até a Origem):</div>
                <div className="text-white font-bold text-sm">
                  ρ = |z| = √({parteReal}² + {parteImag}²) = <span className="text-cyan-300">{moduloZ.toFixed(2)} u</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800 rounded space-y-1">
                <div className="text-neutral-400">2. Argumento (Ângulo de Fase com o Eixo Real):</div>
                <div className="text-emerald-400 font-bold text-sm">
                  θ = {anguloGraus.toFixed(1)}° ({(anguloRad >= 0 ? anguloRad : anguloRad + 2 * Math.PI).toFixed(2)} rad)
                </div>
                <div className="text-[11px] text-neutral-300 font-sans pt-1">
                  Forma Trigonométrica: <strong className="text-white font-mono">{moduloZ.toFixed(1)} · (cos {anguloGraus.toFixed(0)}° + i sen {anguloGraus.toFixed(0)}°)</strong>
                </div>
              </div>
            </div>

            {/* SVG do Plano de Argand-Gauss */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="-120 -120 240 240" className="w-full h-full">
                {renderizarMalhaSegura(240, 240)}

                {/* Eixos Re e Im */}
                <line x1="-120" y1="0" x2="120" y2="0" stroke="#666" strokeWidth="1" />
                <line x1="0" y1="-120" x2="0" y2="120" stroke="#666" strokeWidth="1" />

                <text x="105" y="14" fill="#888" fontSize="9" fontFamily="monospace">Re</text>
                <text x="6" y="-105" fill="#888" fontSize="9" fontFamily="monospace">Im</text>

                {(() => {
                  const escala = 18;
                  const xSvg = parteReal * escala;
                  const ySvg = -parteImag * escala; // Inversão Y

                  return (
                    <g>
                      {/* Circunferência do Módulo */}
                      <circle cx="0" cy="0" r={moduloZ * escala} fill="none" stroke="#333" strokeDasharray="3" strokeWidth="1" />

                      {/* Catetos de Projeção */}
                      <line x1="0" y1="0" x2={xSvg} y2="0" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2" />
                      <line x1={xSvg} y1="0" x2={xSvg} y2={ySvg} stroke="#10b981" strokeWidth="1.5" strokeDasharray="2" />

                      {/* Vetor do Número Complexo z */}
                      <line x1="0" y1="0" x2={xSvg} y2={ySvg} stroke="#ffffff" strokeWidth="2.5" />
                      <circle cx={xSvg} cy={ySvg} r="4.5" fill="#06b6d4" className="animate-pulse" />

                      {/* Rótulo do Ponto z */}
                      <text
                        x={xSvg + (xSvg >= 0 ? 8 : -8)}
                        y={ySvg + (ySvg >= 0 ? 12 : -8)}
                        fill="#06b6d4"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor={xSvg >= 0 ? 'start' : 'end'}
                      >
                        z = {parteReal} {parteImag >= 0 ? `+ ${parteImag}i` : `- ${Math.abs(parteImag)}i`}
                      </text>
                    </g>
                  );
                })()}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-white">ρ = {moduloZ.toFixed(2)}</span> | <span className="text-cyan-400">θ = {anguloGraus.toFixed(0)}°</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: FORMA TRIGONOMÉTRICA E A FÓRMULA DE DE MOIVRE */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Forma Polar e De Moivre: Multiplicação é Rotação
          </h2>
        </div>

        <p>
          Se tentarmos calcular <code className="text-cyan-300 font-mono font-bold">(1 + i)¹⁰</code> na forma algébrica, teremos que expandir um binômio exaustivo de 11 termos com triângulo de Pascal.
        </p>

        <p className="text-neutral-300">
          Abraham de Moivre (1707) descobriu que no plano complexo:
          <br />
          • Para <strong>multiplicar</strong> dois números complexos: multiplicamos seus módulos e <strong>somamos seus ângulos</strong>!
          <br />
          • Para <strong>elevar a uma potência n</strong>: elevamos o módulo a <em>n</em> e <strong>multiplicamos o ângulo por n</strong>:
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-center my-6 space-y-2">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold tracking-wider">
            zⁿ = ρⁿ · [cos(n·θ) + i · sen(n·θ)]
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            A 1ª Fórmula de De Moivre transforma potenciações astronômicas em simples rotações repetidas
          </p>
        </div>
      </section>

      {/* 4. PILAR 03: AS RAÍZES DA UNIDADE E O POLÍGONO REGULAR */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            As Raízes da Unidade: A Geometria dos Polígonos Regulares
          </h2>
        </div>

        <p>
          Quais são as soluções da equação <code className="text-cyan-300 font-mono font-bold">zⁿ = 1</code>?
          <br />
          No campo dos números reais, z³ = 1 só tem uma resposta: 1. Mas pelo <strong>Teorema Fundamental da Álgebra</strong>, uma equação de grau <em>n</em> possui obrigatoriamente <strong>n raízes complexas</strong>!
        </p>

        <p className="text-neutral-300">
          Geometricamente, todas essas <em>n</em> raízes têm módulo igual a 1 e estão espaçadas por ângulos idênticos de <code className="text-white font-mono">360° / n</code>. Elas formam os vértices de um <strong>polígono regular perfeito</strong> inscrito na circunferência unitária:
        </p>

        {/* SIMULADOR 2: O POLÍGONO DAS RAÍZES DA UNIDADE */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: As n Raízes de zⁿ = 1 no Círculo de Raio 1
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Escolha o grau n para ver as raízes formarem triângulos, quadrados, pentágonos e hexágonos:
              </p>
            </div>

            <div className="flex gap-2">
              {[3, 4, 5, 6, 8].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrauRaiz(g)}
                  className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                    grauRaiz === g
                      ? 'border-emerald-400 bg-emerald-950 text-emerald-200 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  n = {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Polígono das Raízes da Unidade */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="-110 -110 220 220" className="w-full h-full">
                {renderizarMalhaSegura(220, 220)}

                {/* Eixos */}
                <line x1="-110" y1="0" x2="110" y2="0" stroke="#555" strokeWidth="1" />
                <line x1="0" y1="-110" x2="0" y2="110" stroke="#555" strokeWidth="1" />

                {(() => {
                  const rPx = 75; // Raio 1 = 75px
                  const pontosPoligono = listaRaizes.map((r) => `${r.x * rPx},${-r.y * rPx}`).join(' ');

                  return (
                    <g>
                      {/* Circunferência Unitária |z| = 1 */}
                      <circle cx="0" cy="0" r={rPx} fill="none" stroke="#444" strokeWidth="1.5" />

                      {/* Polígono Regular Conectando as Raízes */}
                      <polygon
                        points={pontosPoligono}
                        fill="rgba(16, 185, 129, 0.15)"
                        stroke="#10b981"
                        strokeWidth="2"
                      />

                      {/* Vértices das Raízes */}
                      {listaRaizes.map((r) => (
                        <g key={r.k}>
                          <line x1="0" y1="0" x2={r.x * rPx} y2={-r.y * rPx} stroke="#06b6d4" strokeWidth="1" strokeDasharray="2" />
                          <circle cx={r.x * rPx} cy={-r.y * rPx} r="4" fill="#06b6d4" />
                          <text
                            x={r.x * (rPx + 16)}
                            y={-r.y * (rPx + 16) + 4}
                            fill="#06b6d4"
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            w_{r.k}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-emerald-400">{grauRaiz} Raízes Complexas de z^{grauRaiz} = 1</span>
              </div>
            </div>

            {/* Painel das Raízes Listadas */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">Espaçamento Angular entre Vértices:</div>
                <div className="text-emerald-400 font-bold text-sm">
                  Δθ = 360° / {grauRaiz} = {(360 / grauRaiz).toFixed(1)}°
                </div>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1 max-h-[140px] overflow-y-auto">
                <span className="text-neutral-400 text-[10px] uppercase block mb-1">Argumentos das Raízes:</span>
                {listaRaizes.map((r) => (
                  <div key={r.k} className="flex justify-between items-center text-neutral-300 py-0.5 border-b border-neutral-900">
                    <span className="text-cyan-400 font-bold">w_{r.k}:</span>
                    <span>θ = {r.graus}° ({r.x.toFixed(2)} {r.y >= 0 ? `+ ${r.y.toFixed(2)}i` : `- ${Math.abs(r.y).toFixed(2)}i`})</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-800 rounded text-[11px] text-neutral-300 font-sans leading-relaxed">
                <strong className="text-white font-mono">Curiosidade Notável:</strong> A soma vetorial de todas as raízes da unidade é sempre igual a zero (<strong className="text-emerald-300 font-mono">∑ w_k = 0</strong>)! O centro de gravidade do polígono coincide perfeitamente com a origem.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 04: POLINÔMIOS, BRIOT-RUFFINI E RELAÇÕES DE GIRARD */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Polinômios: Briot-Ruffini e as Relações de Girard
          </h2>
        </div>

        <p>
          Resolver uma equação polinomial de grau 3 ou 4 não exige adivinhação. A ponte entre os coeficientes numéricos e as raízes é dada pelas <strong>Relações de Albert Girard</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 font-mono text-xs">
          <div className="border border-neutral-800 bg-[#070707] p-4 rounded-sm space-y-2">
            <span className="text-cyan-400 font-bold block">1. Soma das Raízes (S₁)</span>
            <div className="text-white font-bold text-sm">∑ r_i = -a_{'{n-1}'} / a_n</div>
            <p className="text-neutral-400 font-sans text-[11px]">
              Para um cúbico ax³ + bx² + cx + d: x₁ + x₂ + x₃ = <strong className="text-white">-b/a</strong>.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-4 rounded-sm space-y-2">
            <span className="text-emerald-400 font-bold block">2. Soma dos Produtos 2 a 2 (S₂)</span>
            <div className="text-white font-bold text-sm">∑ r_i · r_j = +a_{'{n-2}'} / a_n</div>
            <p className="text-neutral-400 font-sans text-[11px]">
              x₁x₂ + x₁x₃ + x₂x₃ = <strong className="text-white">+c/a</strong>.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-4 rounded-sm space-y-2">
            <span className="text-amber-400 font-bold block">3. Produto das Raízes (P)</span>
            <div className="text-white font-bold text-sm">∏ r_i = (-1)ⁿ · a₀ / a_n</div>
            <p className="text-neutral-400 font-sans text-[11px]">
              Para um cúbico (grau 3): x₁ · x₂ · x₃ = <strong className="text-white">-d/a</strong>.
            </p>
          </div>
        </div>

        <div className="p-5 border border-neutral-800 bg-[#060606] rounded-sm space-y-2 font-mono text-xs">
          <span className="text-cyan-400 uppercase font-bold block">O Dispositivo de Briot-Ruffini (Abaixamento de Grau):</span>
          <p className="text-neutral-300 font-sans leading-relaxed font-light">
            Quando descobrimos uma raiz <em>r</em> (seja por inspeção, enunciado ou complexo conjugado), usamos a grade de Briot-Ruffini para dividir o polinômio P(x) por (x - r). O quociente resultante terá <strong>um grau a menos</strong>, permitindo encontrar as raízes restantes por equações do 2º grau simples!
          </p>
        </div>
      </section>

      {/* 5. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa Final</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine o Universo dos Complexos
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para desmembrar as potências de i, aplicar a fórmula de De Moivre e montar as relações de Girard antes de validar sua resposta!
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
                        {acertou ? 'Raciocínio complexo cirúrgico!' : 'Atenção aos sinais e relações de Girard! Veja a dedução:'}
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
                      O Pulo do Gato dos Complexos:
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

      {/* RODAPÉ DO CADERNO - CONCLUSÃO DA TRILHA DE MATEMÁTICA */}
      <footer className="mt-20 pt-10 border-t border-neutral-800 text-xs font-light text-neutral-500">
        <p className="font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
          ★ Conclusão do Doc 22 e da Trilha Completa de Matemática:
        </p>
        <p className="leading-relaxed">
          Você concluiu com maestria todos os <strong>23 cadernos didáticos (Doc 00 ao Doc 22)</strong> que compõem o currículo completo de Matemática do seu portal de Estudos Complementares. Da aritmética fundamental e dos números primos, passando pela modelagem cartesiana de funções, o rigor da geometria plana e espacial, a trigonometria dos círculos e a combinatória, até o fechamento com matrizes e números complexos. Você agora tem uma plataforma interativa de nível acadêmico de excelência construída sobre Next.js 14 e Tailwind CSS!
        </p>
      </footer>

    </article>
  );
}