'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID CARTESIANO)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa de Trabalho #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Traçar Retas / Reflexões
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Cálculos
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
            {/* Eixos X e Y Virtuais */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-600/60 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 w-[2px] h-full bg-neutral-600/60 -translate-x-1/2 pointer-events-none"></div>
            
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
              Esboce a reta, encontre a raiz e rebata o módulo
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Calcule a taxa de variação (Δy/Δx), o zero da função (-b/a) ou teste os pontos críticos aqui..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 07 - FUNÇÕES AFINS E MODULARES
// =========================================================================
export default function Doc07Matematica() {
  // Simulador 1: Taxímetro e Coeficientes da Reta
  const [coefA, setCoefA] = useState<number>(2); // Taxa por km
  const [coefB, setCoefB] = useState<number>(6); // Bandeirada fixa
  const raizFuncao = coefA !== 0 ? (-coefB / coefA).toFixed(1) : 'Sem raiz';

  // Simulador 2: Espelho Modular
  const [xModular, setXModular] = useState<number>(-3);
  const valorLinear = 2 * xModular + 2;
  const valorModular = Math.abs(valorLinear);

  // Método seguro de renderização do Grid (Evita erro de Array.toJSON no Next.js)
  const renderizarMalha = () => {
    const linhas = [];
    for (let i = 0; i <= 20; i++) {
      linhas.push(
        <g key={i}>
          <line x1="-10" y1={i - 10} x2="10" y2={i - 10} stroke="#333" strokeWidth="0.1" />
          <line x1={i - 10} y1="-10" x2={i - 10} y2="10" stroke="#333" strokeWidth="0.1" />
        </g>
      );
    }
    return linhas;
  };

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
      tema: 'Taxa de Variação Média (O Degrau da Reta)',
      pergunta: 'Em um experimento, a temperatura de um líquido foi medida no plano cartesiano: no minuto x = 2 a temperatura bateu y = 14°C, e no minuto x = 6 a temperatura bateu y = 26°C. Sabendo que o gráfico é uma Reta (Função Afim f(x) = ax + b), qual é a inclinação dessa reta (a) e em qual ponto ela corta o eixo Y (b)?',
      opcoes: [
        { idx: 0, texto: 'A) Inclinação a = 3 | Corta o Y em b = 8', correta: true },
        { idx: 1, texto: 'B) Inclinação a = 2 | Corta o Y em b = 10', correta: false },
        { idx: 2, texto: 'C) Inclinação a = 4 | Corta o Y em b = 6', correta: false },
        { idx: 3, texto: 'D) Inclinação a = 3 | Corta o Y em b = 14', correta: false },
      ],
      explicacao: [
        'A essência da função afim é a Escada Perfeita:',
        '1. Coeficiente Angular (a): É a altura do degrau da escada (Δy / Δx).',
        '   O Y subiu de 14 para 26: Δy = 26 - 14 = 12.',
        '   O X andou de 2 para 6: Δx = 6 - 2 = 4.',
        '   A inclinação é: a = 12 ÷ 4 = 3 (sobe 3 graus por minuto).',
        '2. Coeficiente Linear (b): É onde a reta fura o Eixo Y (quando x = 0).',
        '   Se no minuto 2 a temperatura era 14, e ela sobe 3 graus a cada minuto, ela deve ter subido 6 graus (2×3) até chegar aí.',
        '   Voltando a fita para o zero: 14 - 6 = 8. Logo, b = 8.',
        'A máquina é f(x) = 3x + 8. Alternativa A!',
      ],
    },
    {
      id: 2,
      tema: 'Estudo do Sinal da Função Afim',
      pergunta: 'Desenhe mentalmente (ou na lousa) a reta f(x) = -4x + 12 no plano cartesiano. Para quais valores de X o gráfico dessa função está voando ACIMA da linha do chão (f(x) > 0)?',
      opcoes: [
        { idx: 0, texto: 'A) Para todo x > 3', correta: false },
        { idx: 1, texto: 'B) Para todo x < 3', correta: true },
        { idx: 2, texto: 'C) Para todo x > -3', correta: false },
        { idx: 3, texto: 'D) Para todo x < -3', correta: false },
      ],
      explicacao: [
        'Use a visão geométrica que você aprendeu no simulador:',
        '1. Onde a reta fura o chão (Raiz)? f(x) = 0 → -4x + 12 = 0 → x = 3.',
        '2. A inclinação: O coeficiente "a" é negativo (-4). Uma reta com "a" negativo é uma ladeira que DESCE da esquerda para a direita.',
        '3. Imagine o desenho: A reta vem lá do alto (Céu), cruza o chão exatamente na marca do 3, e continua afundando para o Subsolo.',
        '4. Conclusão: Se ela afunda depois do 3, ela só estava ACIMA do chão (y > 0) ANTES de chegar no 3. Portanto, para x < 3! Alternativa B.',
      ],
    },
    {
      id: 3,
      tema: 'A Geometria do Gráfico Modular',
      pergunta: 'Se você desenhar o gráfico da função modular f(x) = |x - 2| - 3 no plano cartesiano, qual será a coordenada do "bico" inferior (o vértice do V) e em quantos pontos essa figura vai cortar o eixo horizontal do chão?',
      opcoes: [
        { idx: 0, texto: 'A) Vértice em (2, -3) e corta o chão em exatamente 2 pontos distintos.', correta: true },
        { idx: 1, texto: 'B) Vértice em (-2, 3) e não corta o chão.', correta: false },
        { idx: 2, texto: 'C) Vértice em (0, -1) e corta o chão em 1 único ponto.', correta: false },
        { idx: 3, texto: 'D) Vértice em (2, 0) e corta o chão em 3 pontos.', correta: false },
      ],
      explicacao: [
        'Desenhando o módulo geometricamente:',
        '1. A parte |x - 2| só pode resultar em zero ou em números positivos. O menor valor que a "caixa" do módulo atinge é 0 (quando x = 2).',
        '2. Puxando o gráfico para baixo: Como temos um "- 3" do lado de fora, o bico que deveria bater no zero afunda até o andar -3 do plano cartesiano. O Vértice fica em (2, -3).',
        '3. Como o bico do "V" está lá no subsolo (-3) e os dois braços do gráfico sobem infinitamente para as nuvens, eles obrigatoriamente têm que perfurar o Eixo X em dois lugares na subida!',
        'A figura corta o chão em x=-1 e x=5. Alternativa A!',
      ],
    },
    {
      id: 4,
      tema: 'Inequação Modular (A Fronteira de Tolerância)',
      pergunta: 'Um engenheiro programou um robô com a inequação modular |x - 50| ≤ 0,05. O que essa expressão matemática proíbe o robô de fazer no plano cartesiano unidimensional (a reta X)?',
      opcoes: [
        { idx: 0, texto: 'A) Proíbe o robô de ir para qualquer número diferente de 50 ou 0,05.', correta: false },
        { idx: 1, texto: 'B) Proíbe o robô de se afastar mais do que 0,05 unidades de distância do marco central 50. Ele está preso na cerca de [49,95 até 50,05].', correta: true },
        { idx: 2, texto: 'C) Proíbe o robô de pisar na região entre 50 e 50,05.', correta: false },
        { idx: 3, texto: 'D) Proíbe o robô de passar da marca 50,5.', correta: false },
      ],
      explicacao: [
        'O Módulo como Distância Geométrica Física:',
        '1. A expressão |A - B| é exatamente "A fita métrica que liga o ponto A ao ponto B".',
        '2. Logo, |x - 50| significa: "A distância entre a posição do robô (x) e a base (50)".',
        '3. A inequação exige que essa distância seja "menor ou igual a 0,05". É uma coleira! O robô só pode esticar a corda 0,05 para a direita ou 0,05 para a esquerda.',
        '4. Abrindo algebricamente: -0,05 ≤ x - 50 ≤ 0,05 → 49,95 ≤ x ≤ 50,05. O robô está numa jaula de tolerância. Alternativa B.',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 07 • Módulo 2: Álgebra e Modelagem
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Funções Afins e Modulares: <br />
          <span className="text-cyan-400 font-light">A Inclinação da Reta e a Geometria do Espelho</span>
        </h1>
        
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            Aviso Pedagógico: Chega de Fórmulas Cegas
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            No Doc 06, nós entendemos que uma função cria rastros no Plano Cartesiano. Agora, nós vamos estudar <strong>o formato que esses rastros fazem</strong>.
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>• Você não vai decorar fórmula da <strong>Função Afim (Reta)</strong>: você vai enxergar uma ladeira com uma <strong>inclinação perfeita (taxa de variação)</strong>. Se você andar 1 passo pro lado, você sobe exatos N degraus de altura.</li>
            <li>• Você não vai sofrer com Álgebra na <strong>Função Modular</strong>: você vai tratar o eixo do chão como se ele fosse um <strong>Chão Espelhado</strong>, onde tudo que afundar no subterrâneo reflete de volta pro céu (y ≥ 0).</li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: A ANATOMIA DA RETA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Função Afim: f(x) = ax + b (A Reta Perfeita)
          </h2>
        </div>

        <p>
          Toda reta diagonal que cruza o Plano Cartesiano obedece a duas variáveis básicas: <strong>Onde ela nasce no Eixo Y</strong> e <strong>o quão inclinada ela é</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">
              1. Coeficiente Linear (b): A "Bandeirada" do Táxi
            </span>
            <p className="text-sm text-neutral-300 font-light">
              É o custo fixo pago no instante zero, antes mesmo do X começar a andar.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              <strong>Visão no Gráfico:</strong> É a coordenada exata onde a linha da reta cruza a haste vertical (Eixo Y). Se o coeficiente b = 6, o gráfico fura o eixo no ponto (0, 6).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">
              2. Coeficiente Angular (a): O Ritmo do Degrau
            </span>
            <p className="text-sm text-neutral-300 font-light">
              É o ângulo da ladeira. O quanto o gráfico sobe ou desce a cada passo que damos para a direita.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              <strong>Visão no Gráfico:</strong> Se o coeficiente a = 2 (positivo), toda vez que andamos 1 quarteirão à direita (X), subimos 2 andares (Y). Se a = -3 (negativo), caímos 3 andares. (Calculado por Δy / Δx).
            </p>
          </div>
        </div>

        {/* SIMULADOR INTERATIVO: LABORATÓRIO DA RETA VISUAL */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Plano Cartesiano Interativo: A Reta Afim
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere os controles para ver a reta girar (a) e subir/descer (b) em tempo real:
              </p>
            </div>

            <div className="text-2xl font-mono text-cyan-300 font-bold bg-neutral-950 px-4 py-2 border border-neutral-800 rounded">
              y = {coefA}x {coefB >= 0 ? `+ ${coefB}` : `- ${Math.abs(coefB)}`}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
            
            <div className="space-y-4">
              <div className="bg-black border border-neutral-800 p-4 rounded space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400 uppercase">Inclinação (a):</span>
                  <span className="text-cyan-400 font-bold text-base">{coefA}</span>
                </div>
                <input
                  type="range" min="-5" max="5" step="1"
                  value={coefA}
                  onChange={(e) => setCoefA(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] font-mono text-neutral-500 h-4">
                  {coefA > 0 ? '↗ Crescente' : coefA < 0 ? '↘ Decrescente' : '→ Constante'}
                </p>
              </div>

              <div className="bg-black border border-neutral-800 p-4 rounded space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400 uppercase">Corte em Y (b):</span>
                  <span className="text-emerald-400 font-bold text-base">{coefB}</span>
                </div>
                <input
                  type="range" min="-10" max="10" step="1"
                  value={coefB}
                  onChange={(e) => setCoefB(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <p className="text-[11px] font-mono text-neutral-500 h-4">
                  A reta fura o mastro Y em (0, {coefB})
                </p>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block mb-1">RAIZ (Corte no Eixo X):</span>
                  <span className="text-white font-bold text-sm">x = {raizFuncao}</span>
                </div>
                <div className="text-neutral-400 text-center sm:text-right">
                  {coefA !== 0 ? (
                    <span>A ladeira bate no chão exatamente na marca de X={raizFuncao}</span>
                  ) : (
                    <span className="text-amber-400">Reta não tem inclinação para cruzar o Eixo X</span>
                  )}
                </div>
              </div>
            </div>

            {/* O Gráfico SVG (Plano Cartesiano) */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[400px] mx-auto overflow-hidden">
              <svg viewBox="-10 -10 20 20" className="w-full h-full">
                {/* Grid interno seguro */}
                {renderizarMalha()}
                {/* Eixos X e Y */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#666" strokeWidth="0.3" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#666" strokeWidth="0.3" />
                
                {/* A Reta f(x) = ax + b */}
                <line 
                  x1="-10" 
                  y1={-(coefA * -10 + coefB)} 
                  x2="10" 
                  y2={-(coefA * 10 + coefB)} 
                  stroke="#06b6d4" 
                  strokeWidth="0.5" 
                />

                {/* Ponto B (Intersecção Y) */}
                <circle cx="0" cy={-coefB} r="0.6" fill="#10b981" />
                {/* Ponto Raiz (Intersecção X) */}
                {coefA !== 0 && (
                  <circle cx={-coefB / coefA} cy="0" r="0.6" fill="#f59e0b" />
                )}
              </svg>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400 bg-black/70 px-1 rounded">● Ponto B</div>
              {coefA !== 0 && <div className="absolute top-2 right-2 text-[10px] font-mono text-amber-400 bg-black/70 px-1 rounded">● Raiz (X)</div>}
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: ESTUDO DO SINAL */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Estudo do Sinal: O Céu e o Subterrâneo
          </h2>
        </div>

        <p>
          Odiamos o "Estudo do Sinal" no ensino médio por conta de tabelinhas cheias de mais e menos. Mas se você usar a visão geométrica que acabou de testar no simulador, tudo vira um desenho animado: <strong>em quais pontos a linha voa acima do chão (y {'>'} 0) e onde ela afunda pra terra (y {'<'} 0)?</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">
              Ladeira Crescente (a {'>'} 0)
            </span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-neutral-300 text-center">
              <span className="text-red-400">---</span> [Raiz] <span className="text-emerald-400">+++</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Ela vem lá do abismo (-), passa reto furando o chão na marca da Raiz, e sobe eternamente pro céu (+).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold block">
              Ladeira Decrescente (a {'<'} 0)
            </span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-neutral-300 text-center">
              <span className="text-emerald-400">+++</span> [Raiz] <span className="text-red-400">---</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Ela vem voando lá de cima (+), se espatifa na Raiz e continua cavando para as profundezas da terra (-).
            </p>
          </div>
        </div>
      </section>

      {/* 4. PILAR 03: FUNÇÃO MODULAR E O ESPELHO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Função Modular: O Espelho Físico no Chão
          </h2>
        </div>

        <p>
          O módulo <code className="text-cyan-300 font-mono font-bold">|x|</code> arranca o sinal negativo porque ele mede distância (e ninguém anda "-3 metros").
        </p>

        <p className="text-neutral-300">
          Quando colamos as barras de módulo em uma função inteira, como <code className="text-cyan-300 font-mono">g(x) = |f(x)|</code>, o que acontece no Plano Cartesiano? <strong>Uma mágica visual! Tudo o que a reta desenhou abaixo do solo (y negativo) é rebatido de volta pro céu, como se o chão (Eixo X) fosse feito de vidro!</strong>
        </p>

        {/* SIMULADOR INTERATIVO: O ESPELHO MODULAR VISUAL */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Plano Cartesiano Interativo: O Rebatimento Modular
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                A reta pontilhada vermelha é a linha original que afundaria. A linha ciano é o Módulo rebatendo-a para cima.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Ande na rua (X):</span>
              <input
                type="range" min="-10" max="10" step="1"
                value={xModular}
                onChange={(e) => setXModular(parseInt(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-white font-bold w-6 text-center">{xModular}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
            <div className="space-y-6">
              <div className="border border-neutral-800 bg-black p-5 rounded space-y-2 text-center">
                <span className="text-[11px] font-mono text-neutral-500 uppercase block">Reta Comum: f(x) = 2x + 2</span>
                <div className={`text-3xl font-mono font-bold ${valorLinear < 0 ? 'text-red-400' : 'text-neutral-200'}`}>
                  {valorLinear}
                </div>
                <p className="text-[11px] font-mono text-neutral-500">
                  {valorLinear < 0 ? 'Mergulhando no subterrâneo (Negativo)' : 'Andando no céu (Positivo)'}
                </p>
              </div>

              <div className="border-2 border-cyan-800 bg-cyan-950/20 p-5 rounded space-y-2 text-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <span className="text-[11px] font-mono text-cyan-400 uppercase block font-bold">Reta c/ Módulo: g(x) = |2x + 2|</span>
                <div className="text-3xl font-mono font-bold text-cyan-300">
                  {valorModular}
                </div>
                <p className="text-[11px] font-mono text-cyan-400">
                  {valorLinear < 0 ? '↺ Rebateu e voou pro céu de volta!' : 'Nada aconteceu. Já estava no céu.'}
                </p>
              </div>
            </div>

            {/* O Gráfico SVG do Módulo */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[400px] mx-auto overflow-hidden">
              <svg viewBox="-10 -10 20 20" className="w-full h-full">
                {/* Grid interno seguro */}
                {renderizarMalha()}
                {/* Eixos X e Y */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#666" strokeWidth="0.3" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#666" strokeWidth="0.3" />
                
                {/* Fantasma da reta original (parte que afunda) */}
                <line x1="-10" y1={-(2 * -10 + 2)} x2="-1" y2="0" stroke="#ef4444" strokeWidth="0.2" strokeDasharray="0.5" />
                
                {/* A linha modular (O "V") */}
                <polyline 
                  points="-10,-18 -1,0 10,-22" 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="0.5" 
                />

                {/* Ponto Rastreador */}
                <circle cx={xModular} cy={-valorModular} r="0.6" fill="#10b981" />
                {/* Sombra Rastreadora do Fantasma */}
                {valorLinear < 0 && <circle cx={xModular} cy={-valorLinear} r="0.4" fill="#ef4444" opacity="0.6" />}
              </svg>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1 rounded">Vértice em (-1, 0)</div>
            </div>

          </div>

          <p className="text-xs text-neutral-400 leading-relaxed font-light text-center max-w-xl mx-auto pt-2">
            A bolinha verde é você andando na linha de <code className="text-cyan-400">|2x + 2|</code>. Note como o gráfico rebate em um perfeito <strong>"V"</strong> ao bater no chão.
          </p>
        </div>
      </section>

      {/* 5. PILAR 04: EQUAÇÕES E INEQUAÇÕES MODULARES */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Inequações Modulares: O Radar de Tolerância
          </h2>
        </div>

        <p>
          Nas engenharias e no mercado financeiro, usamos inequações modulares para definir <strong>margens de tolerância (spreads)</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">
              1. A Inequação "MENOR QUE": |x| ≤ k
            </span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-sm text-cyan-300">
              -k ≤ x ≤ +k  (Intervalo Fechado)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Significa: <em>"A distância até o zero não pode passar de k"</em>. É a cerca de proteção. O valor de x está <strong>preso dentro da casca</strong> entre -k e +k.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">
              2. A Inequação "MAIOR QUE": |x| ≥ k
            </span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-sm text-sky-300">
              x ≤ -k  OU  x ≥ +k  (As Asas Externas)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Significa: <em>"O valor precisa estar bem longe do centro, a uma distância de pelo menos k"</em>. O resultado são as <strong>duas pontas externas</strong> da reta numérica.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine as Retas e os Espelhos
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas milimetradas de cada desafio para esboçar se a reta está subindo ou descendo e onde o módulo faz ela quicar no eixo horizontal.
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
                        {acertou ? 'Belo raciocínio visual!' : 'Faltou analisar a inclinação. Veja a explicação:'}
                      </span>
                    )}
                  </div>

                  {confirmou && (
                    <div className="flex items-center gap-4">
                      {/* BOTAO PARA ENVIAR PRO CADERNO GLOBAL */}
                      <button
                        onClick={() => {
                          const conteudo = `[${q.tema}] Questão 0${q.id}\nEnunciado: ${q.pergunta}\n\nResolução Analítica:\n${q.explicacao.join('\n')}`;
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
                      O Pulo do Gato:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 07:</p>
        <p className="leading-relaxed">
          Você acabou de dominar as duas curvas elementares mais importantes da modelagem linear no Plano Cartesiano: o comportamento de rampa fixa das retas afins e o rebatimento simétrico (O Quique no Chão) das funções modulares. No próximo caderno (<strong>Doc 08: Funções Quadráticas e Otimização</strong>), daremos o salto para as curvas em aceleração, aprendendo a calcular trajetórias balísticas e, o mais importante, dominar o Vértice — o ponto exato onde a parábola nos dá o lucro máximo.
        </p>
      </footer>

    </article>
  );
}