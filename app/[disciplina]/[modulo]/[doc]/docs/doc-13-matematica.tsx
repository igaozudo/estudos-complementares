'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID TRIGONOMÉTRICO)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Trigonométrica #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Traçar Círculos / Projeções
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Razões / Relações
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
              Esboce triângulos retângulos ou os quatro quadrantes do ciclo
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Anote as relações seno/cosseno/tangente, reduções de quadrante ou sen²(x) + cos²(x) = 1..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 13 - TRIGONOMETRIA
// =========================================================================
export default function Doc13Matematica() {
  // Simulador 1: O Ciclo Trigonométrico Dinâmico (O Radar de Raio 1)
  const [anguloGraus, setAnguloGraus] = useState<number>(45);
  const anguloRad = (anguloGraus * Math.PI) / 180;
  const valorSeno = Math.sin(anguloRad);
  const valorCosseno = Math.cos(anguloRad);
  const valorTangente = Math.abs(valorCosseno) > 0.0001 ? Math.tan(anguloRad) : null;

  // Coordenadas visuais no SVG do Ciclo (Centro em 130, 130; Raio = 80)
  const cx = 130;
  const cy = 130;
  const rRaio = 80;
  const px = cx + rRaio * valorCosseno;
  const py = cy - rRaio * valorSeno; // No SVG o eixo Y cresce para baixo

  // Ponto de projeção da tangente na reta x = cx + rRaio
  const tx = cx + rRaio;
  const ty = valorTangente !== null ? cy - rRaio * valorTangente : null;

  // Identificação do quadrante
  const getQuadrante = (graus: number) => {
    const mod = ((graus % 360) + 360) % 360;
    if (mod === 0 || mod === 90 || mod === 180 || mod === 270) return 'Sobre o Eixo';
    if (mod > 0 && mod < 90) return '1º Quadrante (+, +)';
    if (mod > 90 && mod < 180) return '2º Quadrante (-, +)';
    if (mod > 180 && mod < 270) return '3º Quadrante (-, -)';
    return '4º Quadrante (+, -)';
  };

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

  // Renderização segura de malha milimetrada SVG sem Array(n) dinâmico
  const renderizarMalhaCiclo = () => {
    const linhas = [];
    for (let i = 0; i <= 13; i++) {
      linhas.push(
        <g key={i}>
          <line x1="0" y1={i * 20} x2="260" y2={i * 20} stroke="#222" strokeWidth="0.5" />
          <line x1={i * 20} y1="0" x2={i * 20} y2="260" stroke="#222" strokeWidth="0.5" />
        </g>
      );
    }
    return linhas;
  };

  const questoes = [
    {
      id: 1,
      tema: 'Trigonometria no Triângulo Retângulo: A Rampa de Acesso',
      pergunta: 'Um arquiteto projeta uma rampa de acessibilidade de 12 metros de comprimento ligando o chão a uma plataforma elevada. A inclinação da rampa com o solo horizontal é de 30°. Qual é a altura vertical h dessa plataforma em relação ao solo?',
      opcoes: [
        { idx: 0, texto: 'A) 6 metros', correta: true },
        { idx: 1, texto: 'B) 6√3 metros (aprox. 10,4 m)', correta: false },
        { idx: 2, texto: 'C) 4 metros', correta: false },
        { idx: 3, texto: 'D) 8 metros', correta: false },
      ],
      explicacao: [
        'A aplicação direta da razão Seno (Cateto Oposto sobre Hipotenusa):',
        '1. Identificação geométrica: o comprimento da rampa é a hipotenusa (12 m). A altura vertical procurada é o cateto oposto ao ângulo de 30°.',
        '2. Pela definição: sen(30°) = Cateto Oposto / Hipotenusa = h / 12.',
        '3. Como sen(30°) = 1/2: 1/2 = h / 12 → 2h = 12 → h = 6 metros.',
        'O seno mede exatamente a porcentagem de altitude que você ganha em relação ao comprimento percorrido. Em 30°, você sobe exatamente 50% do trajeto! Alternativa A correta.',
      ],
    },
    {
      id: 2,
      tema: 'Redução de Quadrante e Simetria no Ciclo',
      pergunta: 'No ciclo trigonométrico, qual é o valor exato de sen(150°) e de cos(150°), e como esses valores se relacionam geometricamente com o ângulo notável de 30° no 1º quadrante?',
      opcoes: [
        { idx: 0, texto: 'A) sen(150°) = -1/2 e cos(150°) = √3/2', correta: false },
        { idx: 1, texto: 'B) sen(150°) = 1/2 e cos(150°) = -√3/2', correta: true },
        { idx: 2, texto: 'C) sen(150°) = √3/2 e cos(150°) = -1/2', correta: false },
        { idx: 3, texto: 'D) sen(150°) = -√3/2 e cos(150°) = -1/2', correta: false },
      ],
      explicacao: [
        'A geometria dos espelhos nos quatro quadrantes:',
        '1. O ângulo de 150° está no 2º quadrante. A distância angular que falta para ele bater na linha horizontal de 180° é: 180° - 150° = 30°.',
        '2. Eixo vertical (Seno): No 2º quadrante, o ponto está acima do solo, exatamente na mesma altura do 30° no 1º quadrante. Logo: sen(150°) = +sen(30°) = 1/2.',
        '3. Eixo horizontal (Cosseno): No 2º quadrante, a sombra horizontal está à esquerda da origem (lado negativo). Logo: cos(150°) = -cos(30°) = -√3/2.',
        'O seno preserva o sinal positivo e o cosseno inverte para negativo. Alternativa B impecável!',
      ],
    },
    {
      id: 3,
      tema: 'Relação Fundamental da Trigonometria',
      pergunta: 'Sabendo que um arco x pertence ao 2º quadrante (π/2 < x < π) e que sen(x) = 4/5, qual é o valor de cos(x) e de tg(x)?',
      opcoes: [
        { idx: 0, texto: 'A) cos(x) = 3/5 e tg(x) = 4/3', correta: false },
        { idx: 1, texto: 'B) cos(x) = -3/5 e tg(x) = -4/3', correta: true },
        { idx: 2, texto: 'C) cos(x) = -4/5 e tg(x) = -1', correta: false },
        { idx: 3, texto: 'D) cos(x) = -3/5 e tg(x) = 3/4', correta: false },
      ],
      explicacao: [
        'A Relação Fundamental como o Teorema de Pitágoras no ciclo:',
        '1. Lei Fundamental: sen²(x) + cos²(x) = 1.',
        '2. Substituindo sen(x) = 4/5: (4/5)² + cos²(x) = 1 → 16/25 + cos²(x) = 1 → cos²(x) = 1 - 16/25 = 9/25.',
        '3. Extraindo a raiz: cos(x) = ±√(9/25) = ±3/5.',
        '4. Escolha do sinal pelo quadrante: no 2º quadrante o cosseno é estritamente negativo. Logo: cos(x) = -3/5.',
        '5. Cálculo da tangente: tg(x) = sen(x) / cos(x) = (4/5) / (-3/5) = -4/3.',
        'Ambos os sinais obedecem à geografia do 2º quadrante. Alternativa B correta!',
      ],
    },
    {
      id: 4,
      tema: 'Tangente e Valores Notáveis',
      pergunta: 'Um topógrafo mira o topo de um edifício a partir de uma distância horizontal de 50 metros da base. O teodolito mede um ângulo de elevação de 60°. Desconsiderando a altura do aparelho, qual é a altura h do edifício em metros?',
      opcoes: [
        { idx: 0, texto: 'A) 50/√3 metros (aprox. 28,8 m)', correta: false },
        { idx: 1, texto: 'B) 50√3 metros (aprox. 86,6 m)', correta: true },
        { idx: 2, texto: 'C) 100 metros', correta: false },
        { idx: 3, texto: 'D) 25√3 metros', correta: false },
      ],
      explicacao: [
        'A razão Tangente como a taxa de inclinação da rampa:',
        '1. Temos o cateto adjacente (distância horizontal = 50 m) e queremos o cateto oposto (altura h).',
        '2. Pela definição: tg(60°) = Cateto Oposto / Cateto Adjacente = h / 50.',
        '3. Como tg(60°) = sen(60°)/cos(60°) = (√3/2)/(1/2) = √3:',
        '   √3 = h / 50 → h = 50√3 metros (aprox. 86,6 metros).',
        'A tangente mede diretamente a proporção de crescimento vertical por metro andado para frente. Alternativa B!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO COM AVISO PEDAGÓGICO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 13 • Módulo 03: Geometria Plana e Trigonometria
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Trigonometria: <br />
          <span className="text-cyan-400 font-light">Do Triângulo Retângulo ao Radar do Ciclo</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO: A MUDANÇA DA TABELA PARA A ROTAÇÃO */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Conceitual Deste Caderno: A Morte da Decoreba Cega
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Se te ensinaram trigonometria mandando você cantar musiquinhas de &quot;1, 2, 3 sobre 2&quot; sem explicar o que aquelas frações significam no mundo físico, você foi enganado:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • <strong>Seno e Cosseno</strong> não são fórmulas: são <strong>projeções de sombra</strong>. Ao girar um ponteiro de tamanho 1, o <strong className="text-cyan-400 font-bold">Cosseno</strong> é a sombra projetada no chão horizontal, e o <strong className="text-emerald-400 font-bold">Seno</strong> é a altura vertical que ele alcança no mastro.
            </li>
            <li>
              • O <strong>Ciclo Trigonométrico</strong> foi inventado para resolver um problema insolúvel do triângulo retângulo: no triângulo retângulo não existem ângulos maiores que 90°. No ciclo de raio 1, o ponteiro dá voltas completas (de 0° a 360° e além).
            </li>
            <li>
              • A fórmula <strong className="text-white font-bold">sen²(θ) + cos²(θ) = 1</strong> nada mais é do que o bom e velho <strong>Teorema de Pitágoras</strong> aplicado a um triângulo cuja hipotenusa vale exatamente 1.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O TRIÂNGULO RETÂNGULO E AS RAZÕES FUNDAMENTAIS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            As Três Razões Fundamentais: SOH - CAH - TOA
          </h2>
        </div>

        <p>
          Em qualquer triângulo retângulo, a forma geométrica é fixada exclusivamente pelos seus ângulos. Não importa se o triângulo tem o tamanho de uma folha de papel ou de uma montanha: <strong>a proporção entre seus lados é rigorosamente a mesma</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">1. Seno (SOH)</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-emerald-300 text-center">
              sen(θ) = Cateto Oposto / Hipotenusa
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Mede a <strong>fração vertical</strong>: qual porcentagem da hipotenusa foi convertida em altitude.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">2. Cosseno (CAH)</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-cyan-300 text-center">
              cos(θ) = Cateto Adjacente / Hipotenusa
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Mede a <strong>fração horizontal</strong>: qual porcentagem da hipotenusa foi convertida em avanço no chão.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold block">3. Tangente (TOA)</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-amber-300 text-center">
              tg(θ) = Cateto Oposto / Cateto Adjacente
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Mede a <strong>taxa de inclinação</strong> (subida por metro andado = sen/cos).
            </p>
          </div>
        </div>

        {/* DEDUÇÃO GEOMÉTRICA DOS NOTÁVEIS */}
        <div className="p-5 border border-neutral-800 bg-[#060606] rounded-sm space-y-3 text-xs font-mono">
          <span className="text-cyan-400 uppercase font-bold block">De Onde Nascem 30°, 45° e 60°? (Zero Decoreba)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-300 font-sans font-light">
            <div className="p-3 bg-black border border-neutral-800 rounded">
              <strong className="text-white font-mono block mb-1">O Ângulo de 45° (Quadrado ao Meio):</strong>
              Corte um quadrado de lado 1 na diagonal. A diagonal vale √2 pelo Teorema de Pitágoras. Logo, sen(45°) = 1/√2 = <strong className="text-cyan-300 font-mono">√2/2</strong>.
            </div>
            <div className="p-3 bg-black border border-neutral-800 rounded">
              <strong className="text-white font-mono block mb-1">Os Ângulos de 30° e 60° (Equilátero ao Meio):</strong>
              Corte um triângulo equilátero de lado 1 ao meio pela altura. A base vira 1/2 e a altura vira √3/2. Daí nascem instantaneamente <strong className="text-emerald-300 font-mono">sen(30°) = 1/2</strong> e <strong className="text-emerald-300 font-mono">sen(60°) = √3/2</strong>.
            </div>
          </div>
        </div>
      </section>

      {/* 3. PILAR 02: O CICLO TRIGONOMÉTRICO COM SIMULADOR DINÂMICO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Ciclo Trigonométrico: O Radar de Raio 1
          </h2>
        </div>

        <p>
          Por que os matemáticos desenharam um círculo de raio <strong>R = 1</strong> para estudar trigonometria?
        </p>

        <p className="text-neutral-300">
          Porque quando a hipotenusa vale 1, a divisão da fração desaparece!
          <br />
          • <code className="text-emerald-400 font-mono font-bold">sen(θ) = Altura / 1 = Altura exata (Eixo Vertical Y)</code>.
          <br />
          • <code className="text-cyan-400 font-mono font-bold">cos(θ) = Base / 1 = Base exata (Eixo Horizontal X)</code>.
        </p>

        {/* SIMULADOR INTERATIVO: O RADAR TRIGONOMÉTRICO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: O Ciclo Trigonométrico (R = 1)
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Gire o ponteiro do radar e veja as projeções de Seno (Vertical), Cosseno (Horizontal) e Tangente:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Ângulo θ:</span>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={anguloGraus}
                onChange={(e) => setAnguloGraus(parseInt(e.target.value))}
                className="w-28 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold w-12 text-center">{anguloGraus}°</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Ciclo Trigonométrico */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[360px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="0 0 260 260" className="w-full h-full">
                {renderizarMalhaCiclo()}

                {/* Eixos Cartesianos Principais */}
                <line x1="10" y1={cy} x2="250" y2={cy} stroke="#666" strokeWidth="1" />
                <line x1={cx} y1="10" x2={cx} y2="250" stroke="#666" strokeWidth="1" />

                {/* Reta Tangente Vertical (x = cx + rRaio) */}
                <line x1={tx} y1="10" x2={tx} y2="250" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" opacity="0.6" />

                {/* Círculo Unitário de Raio 80 */}
                <circle cx={cx} cy={cy} r={rRaio} fill="none" stroke="#444" strokeWidth="1.5" />

                {/* Projeção do Cosseno no Eixo X (Ciano) */}
                <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#06b6d4" strokeWidth="3" />
                
                {/* Projeção do Seno no Eixo Y (Esmeralda) */}
                <line x1={cx} y1={cy} x2={cx} y2={py} stroke="#10b981" strokeWidth="3" />

                {/* Linhas auxiliares tracejadas completando o retângulo */}
                <line x1={px} y1={cy} x2={px} y2={py} stroke="#555" strokeWidth="1" strokeDasharray="2" />
                <line x1={cx} y1={py} x2={px} y2={py} stroke="#555" strokeWidth="1" strokeDasharray="2" />

                {/* O Ponteiro Hipotenusa = 1 */}
                <line x1={cx} y1={cy} x2={px} y2={py} stroke="#ffffff" strokeWidth="2" />

                {/* Projeção da Tangente (Amarelo) caso visível */}
                {ty !== null && ty >= 10 && ty <= 250 && (
                  <>
                    <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2" opacity="0.5" />
                    <line x1={tx} y1={cy} x2={tx} y2={ty} stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx={tx} cy={ty} r="3" fill="#f59e0b" />
                  </>
                )}

                {/* Vértice Central e Ponto P na Borda */}
                <circle cx={cx} cy={cy} r="3" fill="#ffffff" />
                <circle cx={px} cy={py} r="4" fill="#06b6d4" />
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-white font-bold">{getQuadrante(anguloGraus)}</span>
              </div>
            </div>

            {/* Raio-X dos Valores em Tempo Real */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-cyan-900/50 rounded flex justify-between items-center">
                <span className="text-neutral-400">Cosseno (Chão X):</span>
                <span className="text-cyan-400 font-bold text-sm">cos({anguloGraus}°) = {valorCosseno.toFixed(3)}</span>
              </div>

              <div className="p-3 bg-black border border-emerald-900/50 rounded flex justify-between items-center">
                <span className="text-neutral-400">Seno (Altura Y):</span>
                <span className="text-emerald-400 font-bold text-sm">sen({anguloGraus}°) = {valorSeno.toFixed(3)}</span>
              </div>

              <div className="p-3 bg-black border border-amber-900/50 rounded flex justify-between items-center">
                <span className="text-neutral-400">Tangente (Reta T):</span>
                <span className="text-amber-400 font-bold text-sm">
                  {valorTangente !== null ? `tg(${anguloGraus}°) = ${valorTangente.toFixed(3)}` : 'Indefinida (±∞)'}
                </span>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-neutral-400 leading-relaxed font-sans">
                <strong className="text-white font-mono">Dica do Professor:</strong> Quem está com sono fica deitado (<strong>Cosseno = Eixo Horizontal</strong>). Quem está sem sono fica em pé (<strong>Seno = Eixo Vertical</strong>)!
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 03: OS QUATRO QUADRANTES E A REDUÇÃO SIMÉTRICA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Os Quatro Quadrantes e a Redução ao 1º Quadrante
          </h2>
        </div>

        <p>
          Você nunca precisa calcular ângulos gigantes como 150°, 210° ou 330° do zero. Todos eles são <strong>reflexos espelhados de ângulos do 1º quadrante</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6 text-xs font-mono">
          <div className="border border-neutral-800 bg-[#070707] p-4 rounded-sm space-y-2">
            <span className="text-cyan-400 font-bold block">1º Quadrante (0° a 90°)</span>
            <p className="text-neutral-400 font-sans">Todos positivos.</p>
            <div className="text-emerald-400">sen &gt; 0 | cos &gt; 0 | tg &gt; 0</div>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-4 rounded-sm space-y-2">
            <span className="text-cyan-400 font-bold block">2º Quadrante (90° a 180°)</span>
            <p className="text-neutral-400 font-sans">Redução: 180° - θ</p>
            <div className="text-emerald-400">sen &gt; 0</div>
            <div className="text-red-400">cos &lt; 0 | tg &lt; 0</div>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-4 rounded-sm space-y-2">
            <span className="text-cyan-400 font-bold block">3º Quadrante (180° a 270°)</span>
            <p className="text-neutral-400 font-sans">Redução: θ - 180°</p>
            <div className="text-red-400">sen &lt; 0 | cos &lt; 0</div>
            <div className="text-emerald-400">tg &gt; 0 (menos/menos)</div>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-4 rounded-sm space-y-2">
            <span className="text-cyan-400 font-bold block">4º Quadrante (270° a 360°)</span>
            <p className="text-neutral-400 font-sans">Redução: 360° - θ</p>
            <div className="text-cyan-400">cos &gt; 0</div>
            <div className="text-red-400">sen &lt; 0 | tg &lt; 0</div>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: A RELAÇÃO FUNDAMENTAL DA TRIGONOMETRIA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Relação Fundamental: O Pitágoras do Círculo
          </h2>
        </div>

        <p>
          Olhe atentamente para o triângulo retângulo desenhado dentro do ciclo trigonométrico:
          <br />
          • O cateto horizontal vale <strong>cos(θ)</strong>.
          <br />
          • O cateto vertical vale <strong>sen(θ)</strong>.
          <br />
          • A hipotenusa é o raio do ciclo, que vale rigorosamente <strong>1</strong>.
        </p>

        <p className="text-neutral-300">
          Aplicando o Teorema de Pitágoras (Cateto² + Cateto² = Hipotenusa²):
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm my-4 text-center space-y-2">
          <div className="text-2xl md:text-3xl font-mono text-white font-bold">
            sen²(θ) + cos²(θ) = 1
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Válido para QUALQUER ângulo no universo (de -10.000° a +10.000°).
          </p>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine o Radar e as Razões
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para desenhar os quadrantes, traçar as projeções e verificar os sinais antes de confirmar sua resposta!
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
                        {acertou ? 'Visão trigonométrica cirúrgica!' : 'Atenção aos quadrantes e sinais! Veja a dedução:'}
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
                      O Pulo do Gato Trigonométrico:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 13:</p>
        <p className="leading-relaxed">
          Você acaba de unir a rigidez dos triângulos com a rotação contínua dos círculos. Compreender que o Seno e o Cosseno são apenas projeções ortogonais de um ponteiro unitário e que a Relação Fundamental é o próprio Teorema de Pitágoras rodando no plano liberta você de decorar tabelas cegas. No próximo caderno (<strong>Doc 14: Leis dos Senos e Cossenos e Triângulos Quaisquer</strong>), quebraremos a restrição do ângulo reto de 90° e aprenderemos a navegar em qualquer triângulo oblíquo no mapa!
        </p>
      </footer>

    </article>
  );
}