'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID CARTESIANO DE CÔNICAS)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Cônica #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Traçar Focos e Cônicas
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Relações Focais
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
              Esboce elipses, hipérboles e complete os quadrados da circunferência
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Complete os quadrados (x - x₀)² + (y - y₀)² = R², monte a² = b² + c² ou calcule a excentricidade e = c/a..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 17 - CÔNICAS
// =========================================================================
export default function Doc17Matematica() {
  // Simulador 1: O Fatiador de Cones de Apolônio
  const [conicaAtiva, setConicaAtiva] = useState<'circunferencia' | 'elipse' | 'parabola' | 'hiperbole'>('elipse');

  // Simulador 2: O Laboratório da Elipse (O Método do Jardineiro)
  const [semiEixoA, setSemiEixoA] = useState<number>(5); // a (semi-eixo maior)
  const [semiEixoB, setSemiEixoB] = useState<number>(3); // b (semi-eixo menor)

  // Relação fundamental da elipse: a² = b² + c² -> c = √(a² - b²)
  const semiDistanciaFocalC = Math.sqrt(Math.max(0, semiEixoA * semiEixoA - semiEixoB * semiEixoB));
  const excentricidadeElipse = semiEixoA > 0 ? semiDistanciaFocalC / semiEixoA : 0;
  const comprimentoFio2a = 2 * semiEixoA;

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

  // Renderização segura de grade sem arrays dinâmicos vazios
  const renderizarGradeSegura = () => {
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
      tema: 'Circunferência: Completando Quadrados da Equação Geral',
      pergunta: 'A equação geral de uma circunferência no plano cartesiano é dada por x² + y² - 6x + 8y + 9 = 0. Quais são, respectivamente, as coordenadas do centro C(x₀, y₀) e a medida do raio R dessa circunferência?',
      opcoes: [
        { idx: 0, texto: 'A) Centro C(3, -4) e Raio R = 4', correta: true },
        { idx: 1, texto: 'B) Centro C(-3, 4) e Raio R = 16', correta: false },
        { idx: 2, texto: 'C) Centro C(3, -4) e Raio R = 3', correta: false },
        { idx: 3, texto: 'D) Centro C(-6, 8) e Raio R = 5', correta: false },
      ],
      explicacao: [
        'A técnica infalível de completar quadrados perfeitos:',
        '1. Agrupe os termos de x e de y: (x² - 6x) + (y² + 8y) = -9.',
        '2. Complete o quadrado perfeito pegando a metade do termo do meio e elevando ao quadrado:',
        '   - Para x: metade de -6 é -3, e (-3)² = 9. Somamos 9 dos dois lados.',
        '   - Para y: metade de +8 é +4, e (+4)² = 16. Somamos 16 dos dois lados.',
        '3. Reescrevendo a equação: (x² - 6x + 9) + (y² + 8y + 16) = -9 + 9 + 16.',
        '   (x - 3)² + (y + 4)² = 16.',
        '4. Comparando com a equação canônica (x - x₀)² + (y - y₀)² = R²:',
        '   x₀ = 3, y₀ = -4 e R² = 16 → R = √16 = 4.',
        'Centro C(3, -4) e Raio R = 4. Alternativa A correta!',
      ],
    },
    {
      id: 2,
      tema: 'Elipse: Relação Fundamental e Distância Focal',
      pergunta: 'Uma elipse com centro na origem e focos sobre o eixo horizontal x possui equação canônica x²/25 + y²/9 = 1. Qual é a distância focal total (distância entre os dois focos F₁ e F₂) e qual é a sua excentricidade e?',
      opcoes: [
        { idx: 0, texto: 'A) Distância focal = 8 e Excentricidade e = 0,8', correta: true },
        { idx: 1, texto: 'B) Distância focal = 4 e Excentricidade e = 0,6', correta: false },
        { idx: 2, texto: 'C) Distância focal = 10 e Excentricidade e = 0,4', correta: false },
        { idx: 3, texto: 'D) Distância focal = 16 e Excentricidade e = 0,8', correta: false },
      ],
      explicacao: [
        'A anatomia canônica da elipse horizontal:',
        '1. Na equação x²/a² + y²/b² = 1, o maior denominador está sob o x, indicando que o semi-eixo maior é horizontal: a² = 25 → a = 5.',
        '2. O denominador sob y indica o semi-eixo menor: b² = 9 → b = 3.',
        '3. Relação fundamental pitagórica da elipse: a² = b² + c².',
        '   25 = 9 + c² → c² = 16 → c = 4 (semi-distância focal).',
        '4. A distância focal total entre os dois focos é 2c: 2 · 4 = 8 unidades.',
        '5. Excentricidade (o grau de achatamento da elipse): e = c / a = 4 / 5 = 0,8.',
        'Distância focal = 8 e excentricidade = 0,8. Alternativa A perfeita!',
      ],
    },
    {
      id: 3,
      tema: 'Hipérbole: A Inversão de Pitágoras e Assíntotas',
      pergunta: 'Dada a hipérbole de equação x²/16 - y²/9 = 1, o que podemos afirmar categoricamente sobre a posição de seus focos, a sua relação fundamental entre os parâmetros a, b, c e as equações de suas retas assíntotas?',
      opcoes: [
        { idx: 0, texto: 'A) Os focos estão no eixo x, a relação é c² = a² + b² (com c = 5), e as assíntotas são y = ±(3/4)x.', correta: true },
        { idx: 1, texto: 'B) Os focos estão no eixo y, a relação é a² = b² + c² (com c = 4), e as assíntotas são y = ±(4/3)x.', correta: false },
        { idx: 2, texto: 'C) Os focos estão no eixo x, a excentricidade é menor que 1, e não possui assíntotas reais.', correta: false },
        { idx: 3, texto: 'D) Os focos estão na origem e a curva cruza o eixo y nos pontos (0, ±3).', correta: false },
      ],
      explicacao: [
        'A estrutura essencial da hipérbole:',
        '1. O termo positivo é o de x (x²/16), o que garante que a hipérbole tem ramos que abrem para a esquerda e para a direita (eixo real horizontal no eixo x). Logo, a² = 16 → a = 4 e b² = 9 → b = 3.',
        '2. Diferença crucial com a elipse: na hipérbole, os focos estão mais distantes do centro que os vértices (c > a). A relação de Pitágoras é c² = a² + b²!',
        '   c² = 16 + 9 = 25 → c = 5 (focos em (-5, 0) e (5, 0)).',
        '3. As assíntotas são as retas diagonais que guiam os ramos no infinito: para a hipérbole horizontal, as inclinações são m = ± b/a = ± 3/4. As retas são y = ±(3/4)x.',
        '4. Como c > a, a excentricidade da hipérbole é sempre e = c/a = 5/4 = 1,25 > 1. Alternativa A correta!',
      ],
    },
    {
      id: 4,
      tema: 'Parábola como Cônica: Foco e Reta Diretriz',
      pergunta: 'Uma antena parabólica tem seção reta modelada pela equação y² = 12x. Para maximizar a captação de sinais de satélite paralelos ao eixo de simetria, em qual coordenada cartesiana exata o receptor de sinal (LNB) deve ser instalado?',
      opcoes: [
        { idx: 0, texto: 'A) No Foco F(3, 0)', correta: true },
        { idx: 1, texto: 'B) No Vértice V(0, 0)', correta: false },
        { idx: 2, texto: 'C) No Foco F(6, 0)', correta: false },
        { idx: 3, texto: 'D) Na Diretriz x = -3', correta: false },
      ],
      explicacao: [
        'A propriedade óptica fundamental da parábola:',
        '1. Equação canônica da parábola com vértice na origem e eixo horizontal: y² = 4px.',
        '2. Igualando os coeficientes: 4p = 12 → p = 3.',
        '3. O parâmetro p representa a distância exata do vértice até o foco, e também do vértice até a reta diretriz (que fica em x = -p = -3).',
        '4. Coordenadas do Foco: F(p, 0) = F(3, 0).',
        '5. Propriedade física reflexiva: todos os raios eletromagnéticos que chegam em linha reta paralelos ao eixo colidem com a curva e ricocheteiam diretamente para o FOCO F(3, 0), onde o receptor concentra toda a energia do sinal! Alternativa A!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 17 • Módulo 04: Geometria Analítica Avançada
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Cônicas: <br />
          <span className="text-cyan-400 font-light">O Fatiador de Cones, Focos e Lugares Geométricos</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Conceitual Deste Caderno: A Mesma Família sob Outro Ângulo
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Se te ensinaram Cônicas como uma lista solta de fórmulas complexas cheias de frações e sinais misturados, você viu apenas a casca.
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • <strong>A Origem Unificada:</strong> Circunferência, Elipse, Parábola e Hipérbole são a <strong>mesmíssima curva</strong> gerada pelo corte de uma lâmina plana através de uma ampulheta cônica infinita. O que muda é apenas o ângulo de inclinação da lâmina.
            </li>
            <li>
              • <strong>O DNA das Cônicas é a Excentricidade (e):</strong>
              <br />
              <span className="text-cyan-300">e = 0</span> (Circunferência redonda perfeita) &rarr; <span className="text-emerald-400">0 &lt; e &lt; 1</span> (Elipse achatada fechada) &rarr; <span className="text-amber-400">e = 1</span> (Parábola aberta no limiar) &rarr; <span className="text-purple-400">e &gt; 1</span> (Hipérbole de dois ramos divergentes).
            </li>
            <li>
              • <strong>Lugares Geométricos Reais:</strong> A elipse mantém a <em>soma</em> das distâncias aos focos constante (<strong className="text-white">d₁ + d₂ = 2a</strong>). A hipérbole mantém a <em>diferença</em> constante (<strong className="text-white">|d₁ - d₂| = 2a</strong>). A parábola equilibra a distância entre um ponto e uma reta (<strong className="text-white">d_foco = d_diretriz</strong>).
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O FATIADOR DE CONES DE APOLÔNIO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Fatiador de Cones de Apolônio: De Onde Vêm as Quatro Curvas?
          </h2>
        </div>

        <p>
          No século III a.C., Apolônio de Perga percebeu que não era necessário inventar quatro teorias separadas. Pegue um <strong>cone duplo reto</strong> (duas casquinhas de sorvete coladas pela ponta) e passe um plano afiado através dele:
        </p>

        {/* SIMULADOR INTERATIVO: O SELETOR DE CÔNICAS */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Laboratório de Seção Cônica
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Escolha a cônica para visualizar a inclinação da lâmina de corte e sua equação canônica:
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setConicaAtiva('circunferencia')}
                className={`px-3 py-1.5 font-mono text-xs rounded border transition-all ${
                  conicaAtiva === 'circunferencia'
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                1. Circunferência (e = 0)
              </button>
              <button
                onClick={() => setConicaAtiva('elipse')}
                className={`px-3 py-1.5 font-mono text-xs rounded border transition-all ${
                  conicaAtiva === 'elipse'
                    ? 'border-emerald-400 bg-emerald-950 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                2. Elipse (0 &lt; e &lt; 1)
              </button>
              <button
                onClick={() => setConicaAtiva('parabola')}
                className={`px-3 py-1.5 font-mono text-xs rounded border transition-all ${
                  conicaAtiva === 'parabola'
                    ? 'border-amber-400 bg-amber-950 text-amber-200 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                3. Parábola (e = 1)
              </button>
              <button
                onClick={() => setConicaAtiva('hiperbole')}
                className={`px-3 py-1.5 font-mono text-xs rounded border transition-all ${
                  conicaAtiva === 'hiperbole'
                    ? 'border-purple-400 bg-purple-950 text-purple-200 font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                4. Hipérbole (e &gt; 1)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Duplo Cone e Plano de Corte */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[380px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 240 220" className="w-full h-full">
                {/* Cone Superior */}
                <polygon points="120,110 50,20 190,20" fill="rgba(255,255,255,0.03)" stroke="#444" strokeWidth="1" />
                <ellipse cx="120" cy="20" rx="70" ry="12" fill="none" stroke="#444" strokeWidth="1" />

                {/* Cone Inferior */}
                <polygon points="120,110 50,200 190,200" fill="rgba(255,255,255,0.03)" stroke="#444" strokeWidth="1" />
                <ellipse cx="120" cy="200" rx="70" ry="12" fill="none" stroke="#444" strokeWidth="1" />

                {/* Vértice Compartilhado */}
                <circle cx="120" cy="110" r="3" fill="#888" />

                {/* Linha do Plano de Corte Dinâmico */}
                {conicaAtiva === 'circunferencia' && (
                  <g>
                    <line x1="30" y1="55" x2="210" y2="55" stroke="#06b6d4" strokeWidth="3" />
                    <ellipse cx="120" cy="55" rx="42" ry="7" fill="rgba(6,182,212,0.3)" stroke="#06b6d4" strokeWidth="1.5" />
                  </g>
                )}
                {conicaAtiva === 'elipse' && (
                  <g>
                    <line x1="45" y1="35" x2="195" y2="85" stroke="#10b981" strokeWidth="3" />
                    <ellipse cx="120" cy="60" rx="48" ry="14" fill="rgba(16,185,129,0.3)" stroke="#10b981" strokeWidth="1.5" transform="rotate(18, 120, 60)" />
                  </g>
                )}
                {conicaAtiva === 'parabola' && (
                  <g>
                    <line x1="50" y1="20" x2="160" y2="160" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3" />
                    <path d="M 75,52 Q 115,105 140,135" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  </g>
                )}
                {conicaAtiva === 'hiperbole' && (
                  <g>
                    <line x1="165" y1="10" x2="165" y2="210" stroke="#a855f7" strokeWidth="3" />
                    <path d="M 165,22 Q 135,20 135,50" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                    <path d="M 165,198 Q 135,200 135,170" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                  </g>
                )}
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                {conicaAtiva === 'circunferencia' && <span className="text-cyan-400">Plano estritamente horizontal</span>}
                {conicaAtiva === 'elipse' && <span className="text-emerald-400">Plano inclinado que corta todas as geratrizes</span>}
                {conicaAtiva === 'parabola' && <span className="text-amber-400">Plano paralelo à geratriz do cone</span>}
                {conicaAtiva === 'hiperbole' && <span className="text-purple-400">Plano vertical que corta os dois cones</span>}
              </div>
            </div>

            {/* Painel Descritivo da Cônica Ativa */}
            <div className="space-y-4 font-mono text-xs">
              {conicaAtiva === 'circunferencia' && (
                <div className="p-4 bg-cyan-950/20 border border-cyan-800 rounded space-y-2">
                  <span className="text-cyan-400 uppercase font-bold text-sm block">1. Circunferência (e = 0)</span>
                  <div className="text-white font-bold text-base py-1">
                    (x - x₀)² + (y - y₀)² = R²
                  </div>
                  <p className="text-neutral-300 font-sans font-light leading-relaxed">
                    Os dois focos estão fundidos no mesmíssimo ponto central (c = 0). A distância focal é nula, logo a excentricidade é zero: perfeita simetria radial.
                  </p>
                </div>
              )}

              {conicaAtiva === 'elipse' && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-800 rounded space-y-2">
                  <span className="text-emerald-400 uppercase font-bold text-sm block">2. Elipse (0 &lt; e &lt; 1)</span>
                  <div className="text-white font-bold text-base py-1">
                    (x - x₀)² / a² + (y - y₀)² / b² = 1
                  </div>
                  <p className="text-neutral-300 font-sans font-light leading-relaxed">
                    O centro se separa em dois focos distintos F₁ e F₂. É a curva das órbitas planetárias de Kepler: a soma das distâncias de qualquer ponto aos focos é constante (2a).
                  </p>
                </div>
              )}

              {conicaAtiva === 'parabola' && (
                <div className="p-4 bg-amber-950/20 border border-amber-800 rounded space-y-2">
                  <span className="text-amber-400 uppercase font-bold text-sm block">3. Parábola (e = 1)</span>
                  <div className="text-white font-bold text-base py-1">
                    y² = 4px  ou  x² = 4py
                  </div>
                  <p className="text-neutral-300 font-sans font-light leading-relaxed">
                    O segundo foco foi empurrado para o infinito. Todo ponto na parábola tem rigorosamente a mesma distância até o Foco e até a Reta Diretriz.
                  </p>
                </div>
              )}

              {conicaAtiva === 'hiperbole' && (
                <div className="p-4 bg-purple-950/20 border border-purple-800 rounded space-y-2">
                  <span className="text-purple-400 uppercase font-bold text-sm block">4. Hipérbole (e &gt; 1)</span>
                  <div className="text-white font-bold text-base py-1">
                    (x - x₀)² / a² - (y - y₀)² / b² = 1
                  </div>
                  <p className="text-neutral-300 font-sans font-light leading-relaxed">
                    O plano corta ambos os cones opostos, criando duas curvas infinitas divergentes. Modela trajetórias de cometas não periódicos e torres de resfriamento nuclear.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: A ELIPSE E O MÉTODO DO JARDINEIRO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Elipse: O Método do Jardineiro e o Triângulo de Ouro
          </h2>
        </div>

        <p>
          Como os jardineiros traçam canteiros elípticos perfeitos na grama sem réguas sofisticadas?
        </p>

        <p className="text-neutral-300">
          Eles cravam duas estacas no chão (os <strong>Focos F₁ e F₂</strong>), amarram as pontas de um barbante frouxo de comprimento fixo <code className="text-cyan-300 font-mono font-bold">2a</code> nas estacas e usam uma vara para esticar o fio. Ao deslizar a vara mantendo o barbante sempre tenso, desenha-se uma elipse perfeita:
        </p>

        <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-sm text-center font-mono text-lg text-emerald-300 font-bold my-4">
          d(P, F₁) + d(P, F₂) = 2a  (Soma das distâncias sempre constante)
        </div>

        {/* SIMULADOR INTERATIVO: O LABORATÓRIO DA ELIPSE */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: A Relação Pitagórica da Elipse
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere o semi-eixo maior (a) e o semi-eixo menor (b) para ver a distância focal c se ajustar:
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-cyan-400">Semi-eixo a:</span>
                <input
                  type="range" min="4" max="7" step="1"
                  value={semiEixoA}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > semiEixoB) setSemiEixoA(val);
                  }}
                  className="w-16 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold">{semiEixoA}</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-emerald-400">Semi-eixo b:</span>
                <input
                  type="range" min="2" max={semiEixoA - 1} step="1"
                  value={semiEixoB}
                  onChange={(e) => setSemiEixoB(parseInt(e.target.value))}
                  className="w-16 accent-emerald-400 cursor-pointer"
                />
                <span className="text-white font-bold">{semiEixoB}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG da Elipse com Triângulo Fundamental */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="-120 -120 240 240" className="w-full h-full">
                {renderizarGradeSegura()}

                {/* Eixos */}
                <line x1="-120" y1="0" x2="120" y2="0" stroke="#555" strokeWidth="1" />
                <line x1="0" y1="-120" x2="0" y2="120" stroke="#555" strokeWidth="1" />

                {(() => {
                  const scale = 14;
                  const ra = semiEixoA * scale;
                  const rb = semiEixoB * scale;
                  const rc = semiDistanciaFocalC * scale;

                  return (
                    <g>
                      {/* A curva da Elipse */}
                      <ellipse cx="0" cy="0" rx={ra} ry={rb} fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2" />

                      {/* Triângulo Retângulo Pitagórico Fundamental no Vértice B(0, b) */}
                      {/* Cateto horizontal c (origem até Foco F2) */}
                      <line x1="0" y1="0" x2={rc} y2="0" stroke="#06b6d4" strokeWidth="2.5" />
                      {/* Cateto vertical b (origem até B(0, b)) */}
                      <line x1="0" y1="0" x2="0" y2={-rb} stroke="#f59e0b" strokeWidth="2.5" />
                      {/* Hipotenusa a (de B(0, b) até F2(c, 0)) */}
                      <line x1="0" y1={-rb} x2={rc} y2="0" stroke="#ffffff" strokeWidth="2" strokeDasharray="3" />

                      {/* Focos F1 e F2 */}
                      <circle cx={-rc} cy="0" r="4" fill="#06b6d4" />
                      <circle cx={rc} cy="0" r="4" fill="#06b6d4" />
                      <text x={-rc - 10} y="15" fill="#06b6d4" fontSize="9" fontFamily="monospace">F₁</text>
                      <text x={rc + 4} y="15" fill="#06b6d4" fontSize="9" fontFamily="monospace">F₂</text>

                      {/* Vértice Superior B(0, b) */}
                      <circle cx="0" cy={-rb} r="3.5" fill="#f59e0b" />
                      <text x="6" y={-rb - 6} fill="#f59e0b" fontSize="9" fontFamily="monospace">B(0,b)</text>

                      {/* Vértice Principal A(a, 0) */}
                      <circle cx={ra} cy="0" r="3.5" fill="#10b981" />
                      <text x={ra - 10} y="-6" fill="#10b981" fontSize="9" fontFamily="monospace">A(a,0)</text>
                    </g>
                  );
                })()}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-white">Fio = 2a = {comprimentoFio2a}</span>
              </div>
            </div>

            {/* Painel Pitagórico da Elipse */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">1. A Hipotenusa é o Semi-eixo Maior (a):</div>
                <div className="text-white font-bold text-sm">
                  a² = b² + c² → {semiEixoA}² = {semiEixoB}² + c² → 25 = 9 + 16
                </div>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Semi-distância focal (c):</span>
                <span className="text-cyan-400 font-bold text-sm">c = {semiDistanciaFocalC.toFixed(2)} u</span>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded flex justify-between items-center">
                <span className="text-neutral-400">Excentricidade (e = c/a):</span>
                <span className="text-emerald-300 font-bold text-base">{excentricidadeElipse.toFixed(3)}</span>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-neutral-400 leading-relaxed font-sans">
                <strong className="text-white font-mono">Dica de Ouro:</strong> Na elipse, quem faz o papel de hipotenusa do triângulo retângulo é o próprio <strong className="text-cyan-300 font-mono">a</strong> (o maior semi-eixo). Se a elipse for quase redonda, c se aproxima de 0 e a excentricidade tende a zero!
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 03: HIPÉRBOLE E A INVERSÃO DE PITÁGORAS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Hipérbole: A Diferença Constante e as Assíntotas no Infinito
          </h2>
        </div>

        <p>
          Enquanto a elipse é o lugar geométrico da <strong>soma constante</strong>, a <strong>hipérbole</strong> é o lugar geométrico da <strong>diferença constante</strong>:
        </p>

        <div className="p-4 bg-purple-950/20 border border-purple-900/40 rounded-sm text-center font-mono text-lg text-purple-300 font-bold my-4">
          |d(P, F₁) - d(P, F₂)| = 2a  (Diferença modular fixa)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 font-mono text-xs">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-purple-400 font-bold uppercase text-sm block">1. A Inversão de Pitágoras (c² = a² + b²)</span>
            <p className="text-neutral-300 font-sans font-light leading-relaxed">
              Ao contrário da elipse, na hipérbole os focos estão <strong>do lado de fora dos vértices</strong> (c &gt; a). Por isso, quem assume o papel de hipotenusa no Teorema de Pitágoras é a distância focal:
              <br />
              <strong className="text-white font-mono text-sm block mt-1">c² = a² + b²</strong>
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-bold uppercase text-sm block">2. As Assíntotas (As Trilhas Invisíveis)</span>
            <p className="text-neutral-300 font-sans font-light leading-relaxed">
              A hipérbole não curva de volta para fechar como a elipse: ela abre até o infinito colada a duas retas diagonais guias chamadas <strong>assíntotas</strong>:
              <br />
              <strong className="text-white font-mono text-sm block mt-1">y = ± (b / a) · x</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: A PARÁBOLA E A PROPRIEDADE ÓPTICA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Parábola Cônica: O Radar que Concentra no Foco
          </h2>
        </div>

        <p>
          No Doc 08 nós estudamos a parábola como gráfico da função quadrática (<code className="text-cyan-300 font-mono">y = ax² + bx + c</code>). Na Geometria Analítica, ela ganha sua definição pura por <strong>distância focal</strong>:
        </p>

        <p className="text-neutral-300">
          A parábola é o conjunto de todos os pontos P do plano que estão exatamente à <strong>mesma distância do Foco F e da Reta Diretriz d</strong>:
        </p>

        <div className="p-6 border border-amber-900/40 bg-amber-950/10 rounded-sm text-center my-6 space-y-2 font-mono">
          <div className="text-2xl font-bold text-white">
            d(P, F) = d(P, reta diretriz)
          </div>
          <p className="text-xs text-neutral-400">
            Forma canônica horizontal com vértice na origem: y² = 4px (onde p é a distância do vértice ao foco)
          </p>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine as Cônicas e os Focos
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para completar quadrados da circunferência, calcular a² = b² + c² ou traçar as assíntotas antes de validar sua resposta!
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
                        {acertou ? 'Raciocínio cônico impecável!' : 'Atenção aos sinais e relações focais! Veja a dedução:'}
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
                      O Pulo do Gato Cônico:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 17 e do Módulo 04:</p>
        <p className="leading-relaxed">
          Você desvendou as curvas mais nobres da geometria analítica. Entender que circunferência, elipse, parábola e hipérbole são apenas cortes angulares de um duplo cone unificados pela excentricidade e pelas relações focais dá a você uma vantagem analítica extraordinária para física e cálculo diferencial. No próximo módulo (<strong>Módulo 05: Análise Combinatória e Probabilidade</strong>), abandonaremos a geometria espacial para desbravar a matemática das contagens inteligentes, permutações e cenários de incerteza!
        </p>
      </footer>

    </article>
  );
}