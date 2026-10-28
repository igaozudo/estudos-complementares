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
            ✏️ Traçar Curvas e Assíntotas
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Propriedades de Log
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
              Esboce a decolagem exponencial e o espelho do logaritmo
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Isole o expoente com logaritmos, aplique a regra do tombo ou teste a condição de existência..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 09 - EXPONENCIAIS E LOGARITMOS
// =========================================================================
export default function Doc09Matematica() {
  // Simulador 1: Laboratório Exponencial (a^x)
  const [baseExp, setBaseExp] = useState<number>(2);
  const [xEntrada, setXEntrada] = useState<number>(3);
  const resultadoExp = Math.pow(baseExp, xEntrada);

  // Simulador 2: A Máquina de Inversão Simétrica (y = a^x vs y = log_a(x))
  const [baseInversa, setBaseInversa] = useState<number>(2);

  // Renderização segura da malha milimetrada
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

  // Traçado SVG da curva Exponencial
  const renderizarCurvaExp = (base: number) => {
    let points = '';
    for (let x = -10; x <= 10; x += 0.2) {
      const y = Math.pow(base, x);
      if (y <= 10 && y >= -10) {
        points += `${x},${-y} `;
      }
    }
    return <polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="0.5" />;
  };

  // Traçado SVG da curva Logarítmica
  const renderizarCurvaLog = (base: number) => {
    let points = '';
    for (let x = 0.05; x <= 10; x += 0.1) {
      const y = Math.log(x) / Math.log(base);
      if (y <= 10 && y >= -10) {
        points += `${x},${-y} `;
      }
    }
    return <polyline points={points} fill="none" stroke="#10b981" strokeWidth="0.5" />;
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
      tema: 'Crescimento Exponencial e Equação Básica',
      pergunta: 'Em um laboratório de biologia, uma cultura de bactérias começa com 1.000 microrganismos e sua população dobra a cada hora, seguindo a função P(t) = 1000 · 2ᵗ, onde t é o tempo em horas. Após quantas horas a população atingirá exatamente 16.000 bactérias?',
      opcoes: [
        { idx: 0, texto: 'A) 4 horas', correta: true },
        { idx: 1, texto: 'B) 8 horas', correta: false },
        { idx: 2, texto: 'C) 16 horas', correta: false },
        { idx: 3, texto: 'D) 3 horas', correta: false },
      ],
      explicacao: [
        'A estrutura do crescimento exponencial:',
        '1. Montando a igualdade da máquina: 1000 · 2ᵗ = 16000.',
        '2. Simplificando os dois pratos da balança (dividindo tudo por 1000): 2ᵗ = 16.',
        '3. Igualando as bases: O número 16 fatorado em números primos é 2 · 2 · 2 · 2 = 2⁴.',
        '4. Como as bases são idênticas (2 = 2), os expoentes obrigatoriamente se igualam: t = 4 horas.',
        'Em 4 horas a colônia dobrou 4 vezes seguidas (1k → 2k → 4k → 8k → 16k). Alternativa A correta!',
      ],
    },
    {
      id: 2,
      tema: 'Decaimento Radioativo e Meia-Vida (Base entre 0 e 1)',
      pergunta: 'Uma amostra de 80 gramas de um isótopo radioativo sofre decaimento exponencial com meia-vida de 30 anos. A massa restante após t anos obedece à equação M(t) = 80 · (1/2)^(t/30). Quantas gramas dessa substância restarão após 90 anos?',
      opcoes: [
        { idx: 0, texto: 'A) 20 gramas', correta: false },
        { idx: 1, texto: 'B) 10 gramas', correta: true },
        { idx: 2, texto: 'C) 5 gramas', correta: false },
        { idx: 3, texto: 'D) 0 gramas (desaparece completamente)', correta: false },
      ],
      explicacao: [
        'A beleza da base fracionária (0 < a < 1):',
        '1. Meia-vida significa: o tempo necessário para a massa cair pela METADE.',
        '2. Se o tempo total é de 90 anos e a meia-vida é de 30 anos, passaram-se exatamente 90 ÷ 30 = 3 ciclos de meia-vida.',
        '3. Aplicando na equação: M(90) = 80 · (1/2)³ = 80 · (1/8) = 10 gramas.',
        '4. Visualmente na curva: A massa nunca chega a zero absoluto no plano cartesiano; ela se aproxima do eixo X infinitamente (a assíntota horizontal). Alternativa B!',
      ],
    },
    {
      id: 3,
      tema: 'Propriedades Operatórias dos Logaritmos',
      pergunta: 'Sabendo que log(2) ≈ 0,30 e log(3) ≈ 0,48 na base 10, qual é o valor aproximado de log(72)?',
      opcoes: [
        { idx: 0, texto: 'A) 1,86', correta: true },
        { idx: 1, texto: 'B) 1,56', correta: false },
        { idx: 2, texto: 'C) 2,16', correta: false },
        { idx: 3, texto: 'D) 0,78', correta: false },
      ],
      explicacao: [
        'Desmembrando o número com as Leis dos Logaritmos:',
        '1. Fatore o número 72 em fatores primos: 72 = 8 · 9 = 2³ · 3².',
        '2. Propriedade do Produto: log(A · B) = log(A) + log(B). Logo: log(72) = log(2³ · 3²) = log(2³) + log(3²).',
        '3. Regra do Tombo (Expoente cai multiplicando): log(2³) = 3 · log(2) e log(3²) = 2 · log(3).',
        '4. Substituindo os valores conhecidos:',
        '   log(72) = 3 · (0,30) + 2 · (0,48) = 0,90 + 0,96 = 1,86. Alternativa A perfeita!',
      ],
    },
    {
      id: 4,
      tema: 'Condição de Existência do Logaritmo',
      pergunta: 'No campo dos números reais, para quais valores de x a expressão log_(x - 2)(10 - x) existe e representa uma função matemática válida?',
      opcoes: [
        { idx: 0, texto: 'A) 2 < x < 10 com x ≠ 3', correta: true },
        { idx: 1, texto: 'B) x > 2 e x < 10', correta: false },
        { idx: 2, texto: 'C) x > 3 apenas', correta: false },
        { idx: 3, texto: 'D) x ≠ 2 e x ≠ 10', correta: false },
      ],
      explicacao: [
        'As regras de segurança que blindam o logaritmo:',
        'Para log_b(N) existir no campo real, três barreiras são obrigatórias:',
        '1. O Logaritmando (N) deve ser estritamente positivo: 10 - x > 0 → x < 10.',
        '2. A Base (b) deve ser estritamente positiva: x - 2 > 0 → x > 2.',
        '3. A Base (b) NUNCA pode ser igual a 1 (pois 1 elevado a qualquer coisa continuaria 1, quebrando a inversão): x - 2 ≠ 1 → x ≠ 3.',
        'Cruzando as 3 condições na reta numérica: O x precisa estar no intervalo aberto de 2 até 10, com um buraco no número 3: 2 < x < 10 e x ≠ 3. Alternativa A!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 09 • Módulo 2: Álgebra e Modelagem
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Funções Exponenciais e Logaritmos: <br />
          <span className="text-cyan-400 font-light">A Dobra do Espaço e a Máquina do Tempo</span>
        </h1>
        
        {/* O MANIFESTO PEDAGÓGICO COM FORMATAÇÃO VISUAL NATIVA */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            Aviso Pedagógico: A Maior Virada de Escala da Matemática
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Até aqui, nós estudamos funções onde o passo era somado (Afim) ou multiplicado por passos fixos (Quadrática). Agora, nós entramos no <strong>Crescimento Exponencial</strong>:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • Na <strong>Função Exponencial (<span className="text-cyan-300 font-bold">a<sup>x</sup></span>)</strong>, o valor se multiplica por si mesmo a cada unidade de tempo. É a matemática das epidemias virais, dos reatores nucleares e da riqueza dos juros compostos.
            </li>
            <li>
              • No <strong>Logaritmo (<span className="text-emerald-400 font-bold">log<sub>a</sub>(x)</span>)</strong>, nós construímos a Máquina do Tempo: ele responde à pergunta inversa: <em>&quot;Quantas vezes precisei dobrar para chegar neste número astronômico?&quot;</em>.
            </li>
            <li>
              • No Plano Cartesiano, o Logaritmo é a reflexão espelhada perfeita da Exponencial através da linha <span className="text-white font-bold">y = x</span>.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O PODER DA DOBRA (A FUNÇÃO EXPONENCIAL) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Física da Dobra: f(x) = a<sup>x</sup> e a Assíntota Horizontal
          </h2>
        </div>

        <p>
          Se você pegar uma folha de papel sulfite comum (com 0,1 milímetro de espessura) e conseguir dobrá-la ao meio 42 vezes seguidas, a espessura da folha ultrapassa a distância da Terra até a Lua (mais de 384.000 quilômetros). Esse é o poder assustador da <strong>Função Exponencial</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">
              1. Base Maior que 1 (a &gt; 1): Explosão de Crescimento
            </span>
            <p className="text-sm text-neutral-300 font-light">
              Exemplo: f(x) = 2<sup>x</sup>. O número dobra a cada instante.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              <strong>Visão no Gráfico:</strong> A curva vem rastejando colada ao chão pela esquerda e, de repente, decola quase na vertical em direção ao infinito positivo.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">
              2. Base entre 0 e 1 (0 &lt; a &lt; 1): Decaimento Contínuo
            </span>
            <p className="text-sm text-neutral-300 font-light">
              Exemplo: f(x) = (0.5)<sup>x</sup>. O valor cai pela metade a cada passo.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              <strong>Visão no Gráfico:</strong> Modela remédios saindo do sangue e resfriamento térmico. Vem caindo vertiginosamente do alto e vai rastejando cada vez mais perto do chão, sem nunca tocar nele.
            </p>
          </div>
        </div>

        {/* SIMULADOR INTERATIVO: LABORATÓRIO EXPONENCIAL */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Plano Cartesiano Dinâmico: A Curva Exponencial
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere a base e o expoente para ver a decolagem ou o amortecimento da curva:
              </p>
            </div>
            <div className="text-2xl font-mono text-cyan-300 font-bold bg-neutral-950 px-4 py-2 border border-neutral-800 rounded">
              f(x) = {baseExp}<sup>x</sup>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
            
            <div className="space-y-4">
              <div className="bg-black border border-neutral-800 p-4 rounded space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400 uppercase">Base da Potência (a):</span>
                  <span className="text-cyan-400 font-bold text-base">{baseExp}</span>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1.5, 2, 3].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBaseExp(b)}
                      className={`flex-1 py-1.5 font-mono text-xs rounded border transition-all ${
                        baseExp === b
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      a = {b}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-mono text-neutral-500">
                  {baseExp > 1 ? '↗ Curva Crescente (Decolagem)' : '↘ Curva Decrescente (Decaimento)'}
                </p>
              </div>

              <div className="bg-black border border-neutral-800 p-4 rounded space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400 uppercase">Expoente de Entrada (x):</span>
                  <span className="text-emerald-400 font-bold text-base">{xEntrada}</span>
                </div>
                <input
                  type="range" min="-3" max="4" step="1"
                  value={xEntrada}
                  onChange={(e) => setXEntrada(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <p className="text-[11px] font-mono text-neutral-500">
                  Cálculo atual: {baseExp}<sup>{xEntrada}</sup> = <strong className="text-white">{resultadoExp.toFixed(3)}</strong>
                </p>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded text-xs font-mono space-y-1">
                <div className="text-neutral-400">Ponto Universal Obrigatório:</div>
                <div className="text-white font-bold">Corta o Eixo Y sempre em (0, 1)</div>
                <div className="text-neutral-500 text-[10px]">
                  Pois qualquer base elevada a zero resulta em 1 (a⁰ = 1).
                </div>
              </div>
            </div>

            {/* O Gráfico SVG da Exponencial */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[400px] mx-auto overflow-hidden">
              <svg viewBox="-10 -10 20 20" className="w-full h-full">
                {renderizarMalha()}
                {/* Eixos X e Y */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#666" strokeWidth="0.3" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#666" strokeWidth="0.3" />
                
                {/* Linha tracejada da Assíntota Horizontal (y = 0) */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#ef4444" strokeWidth="0.3" strokeDasharray="0.5" />
                
                {/* Curva Exponencial */}
                {renderizarCurvaExp(baseExp)}

                {/* Ponto Universal (0, 1) */}
                <circle cx="0" cy="-1" r="0.5" fill="#10b981" />

                {/* Ponto Dinâmico Ativo */}
                {resultadoExp <= 10 && resultadoExp >= -10 && (
                  <circle cx={xEntrada} cy={-resultadoExp} r="0.6" fill="#06b6d4" />
                )}
              </svg>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400 bg-black/70 px-1 rounded">● Ponto Fixo (0, 1)</div>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-red-400 bg-black/70 px-1 rounded">Assíntota: y = 0</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: O LOGARITMO COMO MÁQUINA DO TEMPO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Logaritmo: A Pergunta Inversa e a Escala de Compressão
          </h2>
        </div>

        <p>
          O logaritmo foi inventado para responder a uma dor de cabeça: se você sabe que uma colônia de bactérias começou com 100 e agora tem 100.000, <strong>quantas horas se passaram?</strong>
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-center my-6 space-y-3">
          <div className="text-xl md:text-2xl font-mono text-white">
            <span className="text-cyan-400 font-bold">log<sub>b</sub>(N) = x</span> ⟺ <span className="text-emerald-400 font-bold">b<sup>x</sup> = N</span>
          </div>
          <p className="text-xs text-neutral-300 font-mono">
            &quot;A que expoente <strong>x</strong> devo elevar a base <strong>b</strong> para que ela se transforme no número <strong>N</strong>?&quot;
          </p>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed font-light">
          Além de ser a inversa da potência, o logaritmo funciona como uma <strong>lente de compressão</strong>: ele transforma números monstruosos e incomensuráveis em números pequenos e gerenciáveis (como na Escala Richter de terremotos, no pH químico e nos Decibéis de som).
        </p>
      </section>

      {/* 4. PILAR 03: O ESPELHO CARTESIANO (A INVERSÃO PERFEITA) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Simetria Cartesiana: y = a<sup>x</sup> vs y = log<sub>a</sub>(x)
          </h2>
        </div>

        <p>
          Lembre-se do que aprendemos no Doc 06 sobre <strong>Funções Inversas (f⁻¹)</strong>: quando invertemos uma função, nós trocamos o papel de X e Y. No plano cartesiano, isso gera uma <strong>reflexão geométrica espelhada perfeita sobre a reta diagonal y = x</strong>!
        </p>

        {/* SIMULADOR INTERATIVO: O ESPELHO DA INVERSÃO SVG */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                O Espelho da Inversão: Exponencial (Ciano) e Logaritmo (Verde)
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                A reta pontilhada branca (y = x) funciona como o espelho entre as duas funções:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Base:</span>
              {[2, 3].map((b) => (
                <button
                  key={b}
                  onClick={() => setBaseInversa(b)}
                  className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                    baseInversa === b
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  a = {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-black border border-neutral-800 rounded space-y-2">
                <span className="text-cyan-400 uppercase font-bold block">1. A Função Exponencial: y = {baseInversa}<sup>x</sup></span>
                <p className="text-neutral-400 font-sans leading-relaxed">
                  • Domínio: Todos os reais (x pode ser qualquer valor).<br />
                  • Imagem: Apenas números positivos (y &gt; 0). O chão é a barreira horizontal.<br />
                  • Ponto fixo de corte: Corta o Eixo Y no ponto <strong>(0, 1)</strong>.
                </p>
              </div>

              <div className="p-4 bg-black border border-neutral-800 rounded space-y-2">
                <span className="text-emerald-400 uppercase font-bold block">2. A Função Logarítmica: y = log<sub>{baseInversa}</sub>(x)</span>
                <p className="text-neutral-400 font-sans leading-relaxed">
                  • Domínio: Apenas números positivos (x &gt; 0). Não existe logaritmo de zero ou de negativo!<br />
                  • Imagem: Todos os reais (o y sobe e desce para o infinito).<br />
                  • Ponto fixo de corte: Corta o Eixo X no ponto <strong>(1, 0)</strong>.
                </p>
              </div>
            </div>

            {/* Gráfico do Espelho SVG */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[400px] mx-auto overflow-hidden">
              <svg viewBox="-10 -10 20 20" className="w-full h-full">
                {renderizarMalha()}
                {/* Eixos */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#666" strokeWidth="0.3" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#666" strokeWidth="0.3" />

                {/* O Espelho: Reta y = x */}
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="0.6" opacity="0.6" />

                {/* Curva Exponencial (Ciano) */}
                {renderizarCurvaExp(baseInversa)}

                {/* Curva Logarítmica (Verde) */}
                {renderizarCurvaLog(baseInversa)}

                {/* Pontos Espelhados: (0, 1) e (1, 0) */}
                <circle cx="0" cy="-1" r="0.5" fill="#06b6d4" />
                <circle cx="1" cy="0" r="0.5" fill="#10b981" />
              </svg>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1 rounded">f(x) = {baseInversa}<sup>x</sup></div>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-emerald-400 bg-black/70 px-1 rounded">g(x) = log<sub>{baseInversa}</sub>(x)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: AS LEIS OPERATÓRIAS DOS LOGARITMOS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            As Três Leis Operatórias: Destravando Equações
          </h2>
        </div>

        <p>
          Como os logaritmos são expoentes disfarçados, eles herdam todas as propriedades da potenciação de forma inversa:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. Regra do Produto</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-cyan-300">
              log(A · B) = log(A) + log(B)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              A multiplicação interna se transforma em uma simples soma de expoentes.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">2. Regra da Divisão</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-sky-300">
              log(A / B) = log(A) - log(B)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              A fração interna se transforma na subtração dos logaritmos.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">3. Regra do Tombo</span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-emerald-300">
              log(A<sup>k</sup>) = k · log(A)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O expoente &quot;k&quot; escorrega do telhado e cai na frente multiplicando o logaritmo inteiro.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine o Crescimento e o Tempo
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas milimetradas integradas para desmembrar os fatores primos e verificar as condições de existência antes de confirmar sua resposta!
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
                        {acertou ? 'Raciocínio exponencial brilhante!' : 'Atenção às regras operatórias! Veja a explicação:'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 09:</p>
        <p className="leading-relaxed">
          Você acaba de dominar as duas maiores forças da modelagem transcendental: a decolagem irrefreável das exponenciais e o poder de compressão temporal dos logaritmos. Ver que ambos são reflexos exatos de um mesmo espelho através da reta diagonal y = x fecha com chave de ouro a sua visão de funções do Módulo 2. No próximo caderno (<strong>Doc 10: Progressões Aritméticas e Geométricas - PA e PG</strong>), veremos como as sequências discretas conversam intimamente com as retas e as exponenciais que acabamos de desbravar!
        </p>
      </footer>

    </article>
  );
}