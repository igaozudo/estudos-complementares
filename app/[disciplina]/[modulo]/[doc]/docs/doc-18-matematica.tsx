'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID DISCRETO)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Discreta #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Traçar Degraus / Padrões
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Termos / Fórmulas
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
              Esboce a progressão de barras, pares simétricos de Gauss ou partições
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Calcule a_n = a₁ + (n - 1)r, monte a soma S_n = (a₁ + a_n)n / 2 ou a PG infinita S = a₁ / (1 - q)..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 18 - SEQUÊNCIAS, PA E PG
// =========================================================================
export default function Doc18Matematica() {
  // Simulador 1: A Escada da PA vs O Foguete da PG
  const [tipoSeq, setTipoSeq] = useState<'PA' | 'PG'>('PA');
  const [a1, setA1] = useState<number>(2);
  const [razao, setRazao] = useState<number>(3);
  const totalPassos = 6;

  // Geração determinística dos termos
  const gerarTermos = () => {
    const termos: number[] = [];
    let atual = a1;
    for (let i = 0; i < totalPassos; i++) {
      termos.push(atual);
      if (tipoSeq === 'PA') {
        atual += razao;
      } else {
        atual *= razao;
      }
    }
    return termos;
  };

  const listaTermos = gerarTermos();
  const termoMaximo = Math.max(...listaTermos, 1);
  const somaTermos = listaTermos.reduce((acc, curr) => acc + curr, 0);

  // Simulador 2: O Quebra-Cabeça da PG Infinita (Fatiamento de Zenão)
  const [fatiasZenao, setFatiasZenao] = useState<number>(3); // 1 a 6 fatias
  // Termos: 1/2, 1/4, 1/8, 1/16, 1/32, 1/64
  const fracoes = [
    { denom: 2, valor: 0.5, label: '1/2', cor: 'rgba(6, 182, 212, 0.45)', stroke: '#06b6d4', x: 0, y: 0, w: 100, h: 200 },
    { denom: 4, valor: 0.25, label: '1/4', cor: 'rgba(16, 185, 129, 0.45)', stroke: '#10b981', x: 100, y: 0, w: 100, h: 100 },
    { denom: 8, valor: 0.125, label: '1/8', cor: 'rgba(245, 158, 11, 0.45)', stroke: '#f59e0b', x: 100, y: 100, w: 50, h: 100 },
    { denom: 16, valor: 0.0625, label: '1/16', cor: 'rgba(168, 85, 247, 0.45)', stroke: '#a855f7', x: 150, y: 100, w: 50, h: 50 },
    { denom: 32, valor: 0.03125, label: '1/32', cor: 'rgba(239, 68, 68, 0.45)', stroke: '#ef4444', x: 150, y: 150, w: 25, h: 50 },
    { denom: 64, valor: 0.015625, label: '1/64', cor: 'rgba(59, 130, 246, 0.45)', stroke: '#3b82f6', x: 175, y: 150, w: 25, h: 25 },
  ];

  const fatiasAtivas = fracoes.slice(0, fatiasZenao);
  const somaAcumuladaZenao = fatiasAtivas.reduce((acc, f) => acc + f.valor, 0);

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

  // Renderização segura de malha de fundo
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
      tema: 'Termo Geral da PA: O Anfiteatro e a Disposição de Fileiras',
      pergunta: 'Em um anfiteatro acadêmico, a primeira fileira de cadeiras próxima ao palco tem 18 assentos. A segunda fileira possui 22 assentos, a terceira tem 26, e assim sucessivamente, com cada fileira adicionando exatamente 4 cadeiras a mais que a anterior. Se o teatro tem 15 fileiras no total, quantas cadeiras existem exatamente na última fileira (fileira 15)?',
      opcoes: [
        { idx: 0, texto: 'A) 74 cadeiras', correta: true },
        { idx: 1, texto: 'B) 78 cadeiras', correta: false },
        { idx: 2, texto: 'C) 60 cadeiras', correta: false },
        { idx: 3, texto: 'D) 70 cadeiras', correta: false },
      ],
      explicacao: [
        'A estrutura do termo geral da Progressão Aritmética:',
        '1. Identificação dos parâmetros: Primeiro termo a₁ = 18 cadeiras. Razão r = 4 cadeiras (o acréscimo constante a cada degrau). Número da fileira n = 15.',
        '2. Fórmula do termo geral: a_n = a₁ + (n - 1) · r.',
        '3. Por que (n - 1)? Porque da 1ª fileira até a 15ª fileira você dá exatamente 14 passos de crescimento (15 - 1 = 14 intervalos):',
        '   a₁₅ = 18 + (15 - 1) · 4',
        '   a₁₅ = 18 + 14 · 4 = 18 + 56 = 74 cadeiras.',
        'A última fileira conta com exatamente 74 assentos. Alternativa A correta!',
      ],
    },
    {
      id: 2,
      tema: 'A Soma de Gauss: O Desafio da Poupança Progressiva',
      pergunta: 'Um estudante decide fazer o "desafio das 50 semanas de economia". Na semana 1, ele guarda R$ 5,00 no cofrinho. Na semana 2, guarda R$ 10,00. Na semana 3, guarda R$ 15,00, aumentando sempre R$ 5,00 semanais de forma aritmética até a semana 50 (onde guardará R$ 250,00). Ao final das 50 semanas completas, qual será o valor total acumulado no cofrinho?',
      opcoes: [
        { idx: 0, texto: 'A) R$ 12.500,00', correta: false },
        { idx: 1, texto: 'B) R$ 6.375,00', correta: true },
        { idx: 2, texto: 'C) R$ 5.000,00', correta: false },
        { idx: 3, texto: 'D) R$ 6.125,00', correta: false },
      ],
      explicacao: [
        'A elegância da Soma de Gauss sem somar termo a termo:',
        '1. Primeiro termo guardado: a₁ = 5. Último termo na semana 50: a₅₀ = 250. Número total de depósitos: n = 50.',
        '2. O raciocínio do jovem Gauss: some o primeiro com o último (5 + 250 = 255). Se você somar o segundo com o penúltimo (10 + 245 = 255), a soma é idêntica!',
        '3. Como temos 50 depósitos, formamos exatamente 25 pares de R$ 255,00 (n / 2 pares):',
        '   S_n = (a₁ + a_n) · n / 2',
        '   S₅₀ = (5 + 250) · 50 / 2 = 255 · 25 = R$ 6.375,00.',
        'O estudante acumulou exatamente R$ 6.375,00. Alternativa B impecável!',
      ],
    },
    {
      id: 3,
      tema: 'Termo Geral da PG: A Desvalorização Anual de um Veículo',
      pergunta: 'Uma transportadora adquire um caminhão zero quilômetro por R$ 200.000,00. Devido ao uso severo e à depreciação contábil do mercado, o veículo desvaloriza 20% a cada ano que passa (ou seja, seu valor ao final de cada ano passa a ser 80% do valor do ano anterior). Qual será o valor desse caminhão após exatamente 3 anos de uso contínuo?',
      opcoes: [
        { idx: 0, texto: 'A) R$ 80.000,00 (desvalorização linear)', correta: false },
        { idx: 1, texto: 'B) R$ 102.400,00', correta: true },
        { idx: 2, texto: 'C) R$ 128.000,00', correta: false },
        { idx: 3, texto: 'D) R$ 115.200,00', correta: false },
      ],
      explicacao: [
        'O decaimento geométrico com razão percentual:',
        '1. Valor inicial (ano 0): V₀ = 200.000.',
        '2. Se desvaloriza 20%, sobra 80% (fator multiplicativo q = 0,8). Isso é uma PG estrita!',
        '   - Fim do Ano 1: 200.000 · 0,8 = 160.000.',
        '   - Fim do Ano 2: 160.000 · 0,8 = 128.000.',
        '   - Fim do Ano 3: 128.000 · 0,8 = 102.400.',
        '3. Pelo termo geral: V(3) = V₀ · q³ = 200.000 · (0,8)³ = 200.000 · 0,512 = R$ 102.400,00.',
        'Cuidado: jamais subtraia 20% + 20% + 20% = 60%! Na PG, o desconto sucessivo incide sempre sobre o saldo residual anterior. Alternativa B correta!',
      ],
    },
    {
      id: 4,
      tema: 'Soma da PG Infinita e Dízimas Periódicas',
      pergunta: 'A dízima periódica simples 0,777... pode ser expressa como a soma infinita da PG: 7/10 + 7/100 + 7/1000 + ... Utilizando a fórmula da soma dos infinitos termos de uma PG convergente (S_∞ = a₁ / (1 - q)), qual é a fração geratriz irredutível dessa dízima?',
      opcoes: [
        { idx: 0, texto: 'A) 7/9', correta: true },
        { idx: 1, texto: 'B) 7/10', correta: false },
        { idx: 2, texto: 'C) 77/100', correta: false },
        { idx: 3, texto: 'D) 8/9', correta: false },
      ],
      explicacao: [
        'A prova rigorosa da fração geratriz via limite da PG:',
        '1. Primeiro termo: a₁ = 7/10 (ou 0,7).',
        '2. Razão da PG: dividindo o segundo termo pelo primeiro, temos q = (7/100) / (7/10) = 1/10 (ou 0,1).',
        '3. Como |q| = 1/10 < 1, os termos encolhem em direção a zero e a soma infinita converge para um número real exato:',
        '   S_∞ = a₁ / (1 - q)',
        '   S_∞ = (7/10) / (1 - 1/10) = (7/10) / (9/10).',
        '4. Divisão de frações: conserve a primeira e multiplique pelo inverso da segunda:',
        '   S_∞ = (7/10) · (10/9) = 7/9.',
        'A dízima 0,777... equivale com rigor matemático absoluto à fração 7/9. Alternativa A!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 18 • Módulo 05: Álgebra Discreta e Padrões Numéricos
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Sequências, PA e PG: <br />
          <span className="text-cyan-400 font-light">A Rampa Discreta, a Dobra Exponencial e o Truque de Gauss</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Metodológica: Do Fluxo Contínuo aos Passos Inteiros
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Até o Módulo 04, a nossa variável <span className="text-white font-mono font-bold">x</span> era contínua (números reais, frações microscópicas, linhas lisas e ininterruptas no plano cartesiano). Agora, nós entramos na <strong>Matemática Discreta</strong>:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • O índice <span className="text-cyan-300 font-bold">n</span> dá apenas <strong>passos inteiros</strong> (<span className="text-white">n = 1, 2, 3, 4...</span>). É a matemática dos anos fiscais, dos degraus de uma escada, das batidas de um relógio e das gerações biológicas.
            </li>
            <li>
              • A <strong>Progressão Aritmética (PA)</strong> é o irmão gêmeo discreto da <strong>Função Afim (Reta)</strong>: a cada passo inteiro você <em>soma</em> um degrau fixo chamado razão <span className="text-cyan-300 font-bold">r</span>.
            </li>
            <li>
              • A <strong>Progressão Geométrica (PG)</strong> é o irmão gêmeo discreto da <strong>Função Exponencial</strong>: a cada passo você <em>multiplica</em> por um fator chamado razão <span className="text-emerald-400 font-bold">q</span>.
            </li>
            <li>
              • A <strong>Soma de Gauss</strong> e o <strong>Quadrado de Zenão</strong> provam que somar milhares (ou infinitos) números não exige esforço braçal: exige enxergar simetrias de pares e convergência geométrica.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: PA VS PG — A RAMPA CONTRA O FOGUETE */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            PA versus PG: A Diferença Física Entre Somar e Multiplicar
          </h2>
        </div>

        <p>
          A intuição humana é naturalmente <strong>linear (aritmética)</strong>. Quando ouvimos que algo cresce com razão constante, nosso cérebro imagina uma escada com degraus de mesma altura.
        </p>

        <p className="text-neutral-300">
          Por isso somos frequentemente surpreendidos por progressões geométricas: na PG, cada novo termo carrega o produto acumulado de todos os anteriores. Observe o contraste matemático direto:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 font-mono text-xs">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-bold uppercase text-sm block">1. Progressão Aritmética (Soma: + r)</span>
            <div className="text-white font-bold text-base py-1">
              a_n = a₁ + (n - 1) · r
            </div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              Exemplo (a₁ = 2, r = 3): 2, 5, 8, 11, 14, 17...
              <br />
              O crescimento é uniforme e previsível. A taxa de variação é constante.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-bold uppercase text-sm block">2. Progressão Geométrica (Produto: · q)</span>
            <div className="text-white font-bold text-base py-1">
              a_n = a₁ · q<sup>(n - 1)</sup>
            </div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              Exemplo (a₁ = 2, q = 3): 2, 6, 18, 54, 162, 486...
              <br />
              O crescimento acelera vertiginosamente. Cada passo é uma multiplicação do estado atual.
            </p>
          </div>
        </div>

        {/* SIMULADOR INTERATIVO: O COMPARADOR PA vs PG */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Laboratório Comparativo: Rampa Linear vs Salto Multiplicativo
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Alterne entre PA e PG, ajuste o ponto de partida (a₁) e a razão para ver as barras discretas:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setTipoSeq('PA')}
                  className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                    tipoSeq === 'PA'
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  PA (+ r)
                </button>
                <button
                  onClick={() => setTipoSeq('PG')}
                  className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                    tipoSeq === 'PG'
                      ? 'border-emerald-400 bg-emerald-950 text-emerald-200 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  PG (· q)
                </button>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-neutral-400">a₁:</span>
                <input
                  type="range" min="1" max="5" step="1"
                  value={a1}
                  onChange={(e) => setA1(parseInt(e.target.value))}
                  className="w-14 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold">{a1}</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-neutral-400">Razão:</span>
                <input
                  type="range" min="2" max="4" step="1"
                  value={razao}
                  onChange={(e) => setRazao(parseInt(e.target.value))}
                  className="w-14 accent-emerald-400 cursor-pointer"
                />
                <span className="text-white font-bold">{razao}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG das Barras Discretas de Crescimento */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[420px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 260 200" className="w-full h-full">
                {renderizarMalhaSegura(260, 200)}

                {/* Eixo de base dos termos */}
                <line x1="20" y1="170" x2="240" y2="170" stroke="#666" strokeWidth="1.5" />

                {listaTermos.map((val, idx) => {
                  const x = 35 + idx * 34;
                  // Altura proporcional normalizada em 140px máximo
                  const hBarra = Math.min(145, Math.max(8, (val / termoMaximo) * 140));
                  const y = 170 - hBarra;
                  const isPA = tipoSeq === 'PA';

                  return (
                    <g key={idx}>
                      {/* Barra do termo */}
                      <rect
                        x={x}
                        y={y}
                        width="24"
                        height={hBarra}
                        fill={isPA ? 'rgba(6, 182, 212, 0.25)' : 'rgba(16, 185, 129, 0.25)'}
                        stroke={isPA ? '#06b6d4' : '#10b981'}
                        strokeWidth="1.5"
                        rx="2"
                      />
                      {/* Valor numérico no topo */}
                      <text
                        x={x + 12}
                        y={Math.max(16, y - 6)}
                        fill={isPA ? '#06b6d4' : '#10b981'}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {val}
                      </text>
                      {/* Índice n embaixo */}
                      <text
                        x={x + 12}
                        y="185"
                        fill="#888"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        a_{idx + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className={tipoSeq === 'PA' ? 'text-cyan-400' : 'text-emerald-400'}>
                  {tipoSeq === 'PA' ? `Degrau constante +${razao}` : `Multiplicador constante ×${razao}`}
                </span>
              </div>
            </div>

            {/* Painel Numérico dos Termos */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">Sequência Gerada ({totalPassos} primeiros termos):</div>
                <div className="text-white font-bold text-sm tracking-wider">
                  ({listaTermos.join(', ')})
                </div>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Último Termo Calculado (a₆):</span>
                <span className={tipoSeq === 'PA' ? 'text-cyan-400 font-bold text-sm' : 'text-emerald-400 font-bold text-sm'}>
                  {listaTermos[totalPassos - 1]}
                </span>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Soma de Todos os Termos (S₆):</span>
                <span className="text-white font-bold text-sm">{somaTermos}</span>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800 rounded text-[11px] text-neutral-300 font-sans leading-relaxed">
                <strong className="text-white font-mono">Veja a discrepância:</strong> Com a₁ = 2 e razão = 3, na PA o 6º termo atinge modestos <strong className="text-cyan-300 font-mono">17</strong>. Na PG, esse mesmo 6º termo decola para astronômicos <strong className="text-emerald-300 font-mono">486</strong>!
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: A SOMA DE GAUSS E A FITA MÉTRICA DOBRADA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Soma dos Termos da PA: A História do Jovem Gauss
          </h2>
        </div>

        <p>
          Em 1787, na Alemanha, um professor querendo silenciar a turma por horas pediu que os alunos somassem todos os números inteiros de 1 até 100:
          <br />
          <code className="text-neutral-400 font-mono text-xs">1 + 2 + 3 + 4 + ... + 97 + 98 + 99 + 100</code>.
        </p>

        <p className="text-neutral-300">
          Para o espanto de todos, o menino Carl Friedrich Gauss (com apenas 10 anos) entregou a resposta exata em menos de um minuto: <strong>5.050</strong>. O que Gauss enxergou que os outros não viram?
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-center my-6 space-y-3">
          <div className="text-xl md:text-2xl font-mono text-white font-bold">
            S_n = (a₁ + a_n) · n / 2
          </div>
          <p className="text-xs text-neutral-300 font-mono">
            Some as duas pontas da fita e multiplique pelo número de pares!
          </p>
        </div>

        <div className="p-5 border border-neutral-800 bg-[#070707] rounded-sm space-y-3 text-xs font-mono">
          <span className="text-cyan-400 uppercase font-bold block">A Simetria Oculta dos Pares Opostos:</span>
          <ul className="text-neutral-300 font-sans space-y-2 font-light leading-relaxed">
            <li>• Junte a primeira ponta com a última: <strong className="text-white font-mono">1 + 100 = 101</strong>.</li>
            <li>• Junte a segunda com a penúltima: <strong className="text-white font-mono">2 + 99 = 101</strong>.</li>
            <li>• Junte a terceira com a antepenúltima: <strong className="text-white font-mono">3 + 98 = 101</strong>.</li>
            <li>• Em 100 números, nós temos exatamente <strong>50 pares idênticos de 101</strong>!</li>
            <li>• Conta final: <strong className="text-emerald-400 font-mono">50 · 101 = 5.050</strong>. Nenhuma soma braçal foi necessária.</li>
          </ul>
        </div>
      </section>

      {/* 4. PILAR 03: SOMA DA PG INFINITA E O QUADRADO DE ZENÃO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Soma da PG Infinita (|q| &lt; 1): O Paradoxo de Zenão no Quadrado
          </h2>
        </div>

        <p>
          O filósofo grego Zenão de Eleia propôs um paradoxo intrigante: <em>para atravessar uma sala de 1 metro, você primeiro precisa percorrer a metade (1/2 m). Depois precisa percorrer a metade do que sobrou (1/4 m), depois a metade restante (1/8 m), e assim infinitamente. Como é possível chegar ao outro lado se há infinitas etapas para cumprir?</em>
        </p>

        <p className="text-neutral-300">
          A matemática moderna responde com o conceito de <strong>série convergente</strong>: quando a razão da PG está estritamente entre -1 e 1 (<code className="text-cyan-300 font-mono font-bold">|q| &lt; 1</code>), cada novo termo é tão microscopicamente menor que a soma de <strong>infinitos termos nunca ultrapassa um limite finito</strong>!
        </p>

        <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-sm text-center font-mono text-lg text-emerald-300 font-bold my-4">
          S_∞ = a₁ / (1 - q)  (Válido exclusivamente para |q| &lt; 1)
        </div>

        {/* SIMULADOR INTERATIVO: O FATIAMENTO DO QUADRADO DE ZENÃO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: O Fatiamento Fractal de Zenão
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Adicione fatias de 1/2, 1/4, 1/8... e veja que todas cabem dentro de um único quadrado de área 1:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Fatias Somadas:</span>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={fatiasZenao}
                onChange={(e) => setFatiasZenao(parseInt(e.target.value))}
                className="w-24 accent-emerald-400 cursor-pointer"
              />
              <span className="font-mono text-emerald-400 font-bold w-6 text-center">{fatiasZenao}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Quadrado 200x200 Sendo Preenchido */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Moldura do Quadrado Unitário (Área = 1) */}
                <rect x="0" y="0" width="200" height="200" fill="none" stroke="#555" strokeWidth="2" />

                {/* Fatias ativas renderizadas */}
                {fatiasAtivas.map((f, idx) => (
                  <g key={idx}>
                    <rect
                      x={f.x}
                      y={f.y}
                      width={f.w}
                      height={f.h}
                      fill={f.cor}
                      stroke={f.stroke}
                      strokeWidth="1.5"
                    />
                    <text
                      x={f.x + f.w / 2}
                      y={f.y + f.h / 2 + 4}
                      fill="#ffffff"
                      fontSize={f.w < 30 ? '8' : '10'}
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {f.label}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-white">Área Total do Quadrado = 1,00</span>
              </div>
            </div>

            {/* Painel Acumulador da Soma */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">Expressão da Soma Parcial ({fatiasZenao} termos):</div>
                <div className="text-emerald-400 font-bold text-sm">
                  {fatiasAtivas.map(f => f.label).join(' + ')}
                </div>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Total Decimal Acumulado:</span>
                <span className="text-white font-bold text-base">{somaAcumuladaZenao.toFixed(5)}...</span>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-800 rounded space-y-1 text-center">
                <div className="text-neutral-400 uppercase text-[10px]">Limite Teórico no Infinito (S_∞):</div>
                <div className="text-2xl font-bold text-emerald-300">
                  S_∞ = (1/2) / (1 - 1/2) = <span className="text-white">1,000</span>
                </div>
                <div className="text-[11px] text-neutral-400 font-sans pt-1">
                  Não importa quantas bilhões de fatias você adicione: a soma se aproxima de 1 sem jamais transbordar a moldura do quadrado!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PILAR 04: PROPRIEDADES MÉTRICAS DOS TERMOS VIZINHOS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Propriedades dos Vizinhos: A Média Aritmética e a Média Geométrica
          </h2>
        </div>

        <p>
          Em qualquer terna de termos consecutivos <code className="text-white font-mono">(a, b, c)</code>, o termo central <strong>b</strong> guarda uma relação perfeita com seus dois vizinhos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 font-mono text-xs">
          <div className="border border-cyan-800 bg-cyan-950/20 p-5 rounded-sm space-y-2">
            <span className="text-cyan-400 font-bold uppercase text-sm block">1. Em Qualquer PA (Média Aritmética)</span>
            <div className="text-white font-bold text-base py-1">
              b = (a + c) / 2  →  2b = a + c
            </div>
            <p className="text-neutral-300 font-sans text-xs leading-relaxed font-light">
              O dobro do termo do meio é sempre rigorosamente igual à soma dos vizinhos das pontas.
            </p>
          </div>

          <div className="border border-emerald-800 bg-emerald-950/20 p-5 rounded-sm space-y-2">
            <span className="text-emerald-400 font-bold uppercase text-sm block">2. Em Qualquer PG (Média Geométrica)</span>
            <div className="text-white font-bold text-base py-1">
              b² = a · c  →  b = √(a · c)
            </div>
            <p className="text-neutral-300 font-sans text-xs leading-relaxed font-light">
              O quadrado do termo do meio é sempre rigorosamente igual ao produto dos vizinhos das pontas.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine os Padrões Numéricos
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para listar os primeiros termos, montar as frações geratrizes e calcular as somas de Gauss antes de validar sua resposta!
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
                        {acertou ? 'Padrão numérico decifrado com perfeição!' : 'Atenção às razões e fórmulas de soma! Veja a dedução:'}
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
                      O Pulo do Gato Discreto:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 18:</p>
        <p className="leading-relaxed">
          Você deu o primeiro passo na Álgebra Discreta dominando o comportamento de passos inteiros. Entender que a PA é a reta somada, que a PG é o salto exponencial e que somas infinitas convergem em molduras finitas permite modelar desde juros bancários e empréstimos até algoritmos de computação. No próximo caderno (<strong>Doc 19: Análise Combinatória - Princípio Fundamental, Permutações e Combinações</strong>), aprenderemos a contar possibilidades gigantescas sem jamais listar elemento por elemento na mão!
        </p>
      </footer>

    </article>
  );
}