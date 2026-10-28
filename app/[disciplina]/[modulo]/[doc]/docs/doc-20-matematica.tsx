'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID DISCRETO/ESTATÍSTICO)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Estatística #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Diagramas de Venn / Curvas
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Frações e Variâncias
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
              Esboce os conjuntos de eventos, árvores condicionais ou faixas de desvio
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Calcule P(A) = n(A)/n(Ω), monte a probabilidade condicional P(A|B) ou calcule a média ponderada e a variância σ²..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 20 - PROBABILIDADES E ESTATÍSTICA DESCRITIVA
// =========================================================================
export default function Doc20Matematica() {
  // -----------------------------------------------------------------------
  // SIMULADOR 1: DIAGRAMA DE VENN BLINDADO (n(Ω) = 100)
  // -----------------------------------------------------------------------
  const espacoTotalOmega = 100;
  const [elementosA, setElementosA] = useState<number>(50);
  const [elementosB, setElementosB] = useState<number>(40);
  const [interseccaoAB, setInterseccaoAB] = useState<number>(20);

  // Axioma: n(A ∪ B) <= 100, logo n(A ∩ B) >= n(A) + n(B) - 100
  const minInterseccaoObrigatoria = Math.max(0, elementosA + elementosB - espacoTotalOmega);
  const maxInterseccaoPossivel = Math.min(elementosA, elementosB);

  // Intersecção matematicamente segura
  const interSafe = Math.min(Math.max(interseccaoAB, minInterseccaoObrigatoria), maxInterseccaoPossivel);

  const apenasA = elementosA - interSafe;
  const apenasB = elementosB - interSafe;
  const uniaoAB = apenasA + apenasB + interSafe; // Sempre <= 100%
  const foraAB = espacoTotalOmega - uniaoAB;      // Sempre >= 0%

  const probUniao = uniaoAB / espacoTotalOmega;
  const probACondicionadoB = elementosB > 0 ? interSafe / elementosB : 0;

  // Distância visual entre círculos: se inter=0 se afastam, se cresce se aproximam
  const distCentros = Math.max(50, 115 - (interSafe / Math.max(1, maxInterseccaoPossivel)) * 60);

  // -----------------------------------------------------------------------
  // SIMULADOR 2: LABORATÓRIO DE OUTLIERS COM CARDS DE EQUIPE & RÉGUA
  // -----------------------------------------------------------------------
  const equipePadrao = [
    { id: 1, nome: 'Estagiário', salario: 2000, cargo: 'Suporte Jr' },
    { id: 2, nome: 'Ana', salario: 2200, cargo: 'Analista Jr' },
    { id: 3, nome: 'Carlos', salario: 2500, cargo: 'Analista Jr' },
    { id: 4, nome: 'Beatriz', salario: 2700, cargo: 'Analista Pleno' },
    { id: 5, nome: 'Daniel', salario: 3000, cargo: 'Analista Pleno' },
    { id: 6, nome: 'Eduarda', salario: 3200, cargo: 'Analista Sr' },
    { id: 7, nome: 'Felipe', salario: 3500, cargo: 'Tech Lead' },
  ];

  const [salarioDiretor, setSalarioDiretor] = useState<number>(4000); // R$ 3.500 a R$ 45.000

  // 8 membros
  const equipeCompleta = [
    ...equipePadrao,
    { id: 8, nome: 'Diretor (Outlier)', salario: salarioDiretor, cargo: 'C-Level / Sócio' },
  ];

  const salariosOrdenados = [...equipeCompleta].map(p => p.salario).sort((a, b) => a - b);
  const totalFolha = salariosOrdenados.reduce((acc, curr) => acc + curr, 0);
  const mediaSalarial = totalFolha / salariosOrdenados.length;
  // Mediana para n = 8: média do 4º e 5º elementos ordenados
  const medianaSalarial = (salariosOrdenados[3] + salariosOrdenados[4]) / 2;

  const totalAbaixoDaMedia = equipeCompleta.filter(p => p.salario < mediaSalarial).length;
  const porcentagemAbaixo = (totalAbaixoDaMedia / equipeCompleta.length) * 100;

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
      tema: 'Regra da Adição e Eventos Não-Mutuamente Exclusivos',
      pergunta: 'Em uma urna com 30 bolas idênticas numeradas de 1 a 30, retira-se uma única bola ao acaso. Qual é a probabilidade exata de que o número sorteado seja um múltiplo de 3 OU um múltiplo de 5?',
      opcoes: [
        { idx: 0, texto: 'A) 7/15 (aprox. 46,7%)', correta: true },
        { idx: 1, texto: 'B) 8/15 (aprox. 53,3%)', correta: false },
        { idx: 2, texto: 'C) 16/30 (aprox. 53,3%)', correta: false },
        { idx: 3, texto: 'D) 2/5 (aprox. 40,0%)', correta: false },
      ],
      explicacao: [
        'A armadilha clássica da dupla contagem (Regra da Adição de Laplace):',
        '1. Espaço Amostral total: n(Ω) = 30 bolas.',
        '2. Evento A (Múltiplos de 3): {3, 6, 9, 12, 15, 18, 21, 24, 27, 30} → n(A) = 10 bolas.',
        '3. Evento B (Múltiplos de 5): {5, 10, 15, 20, 25, 30} → n(B) = 6 bolas.',
        '4. Intersecção A ∩ B (Múltiplos de 3 E de 5, ou seja, múltiplos de 15): {15, 30} → n(A ∩ B) = 2 bolas.',
        '5. Pela Lei da Adição: P(A ∪ B) = P(A) + P(B) - P(A ∩ B):',
        '   P(A ∪ B) = (10/30) + (6/30) - (2/30) = 14/30 = 7/15 ≈ 46,67%.',
        'Se você apenas somasse 10 + 6 = 16, estaria contando as bolas 15 e 30 duas vezes! Alternativa A correta.',
      ],
    },
    {
      id: 2,
      tema: 'Probabilidade Condicional: O Encolhimento do Universo',
      pergunta: 'Em uma empresa com 100 colaboradores, realizou-se um censo sobre o uso de acessórios: 60 pessoas usam óculos, 40 usam relógio de pulso e 20 usam óculos E relógio simultaneamente. Um colaborador é sorteado ao acaso e nota-se que ele usa relógio. Dado esse fato, qual é a probabilidade de que ele TAMBÉM use óculos?',
      opcoes: [
        { idx: 0, texto: 'A) 1/2 (50%)', correta: true },
        { idx: 1, texto: 'B) 1/5 (20%)', correta: false },
        { idx: 2, texto: 'C) 1/3 (aprox. 33,3%)', correta: false },
        { idx: 3, texto: 'D) 3/5 (60%)', correta: false },
      ],
      explicacao: [
        'O poder da informação prévia na Probabilidade Condicional:',
        '1. O espaço amostral original era de 100 pessoas. Porém, recebemos a informação de que o colaborador sorteado USA RELÓGIO.',
        '2. Isso descarta imediatamente todos os outros 60 funcionários que não usam relógio. O novo universo possível encolheu para apenas n(Relógio) = 40 pessoas.',
        '3. Dentre essas 40 pessoas que compõem o novo universo, quantas usam óculos? Exatamente as 20 da intersecção.',
        '4. Pela fórmula formal: P(Óculos | Relógio) = P(Óculos ∩ Relógio) / P(Relógio) = (20/100) / (40/100) = 20/40 = 1/2 = 50%.',
        'A condição prévia encolheu o denominador de 100 para 40. Alternativa A correta!',
      ],
    },
    {
      id: 3,
      tema: 'Medidas de Tendência Central: Média vs. Mediana com Outlier',
      pergunta: 'Uma pequena agência de publicidade possui 9 funcionários. Os salários ordenados de 8 deles são: R$ 2.000, R$ 2.000, R$ 2.200, R$ 2.400, R$ 2.600, R$ 2.800, R$ 3.000 e R$ 3.000. O sócio-fundador e diretor-geral possui um pró-labore de R$ 45.000. Qual é a mediana dessa distribuição de salários e por que ela é considerada mais representativa do funcionário típico do que a média aritmética?',
      opcoes: [
        { idx: 0, texto: 'A) Mediana = R$ 2.600; ela é superior à média porque não sofre distorção pelo salário discrepante (outlier) do diretor.', correta: true },
        { idx: 1, texto: 'B) Mediana = R$ 7.222; ela coincide perfeitamente com a média de mercado.', correta: false },
        { idx: 2, texto: 'C) Mediana = R$ 2.400; pois representa o menor salário dos analistas.', correta: false },
        { idx: 3, texto: 'D) Mediana = R$ 3.000; pois é o valor mais frequente (moda) entre os sêniores.', correta: false },
      ],
      explicacao: [
        'A resistência estatística da mediana frente aos extremos:',
        '1. Rol ordenado dos 9 salários: [2.000, 2.000, 2.200, 2.400, 2.600, 2.800, 3.000, 3.000, 45.000].',
        '2. Posição da Mediana: com n = 9 (ímpar), a mediana é exatamente o elemento central da 5ª posição: Mediana = R$ 2.600,00.',
        '3. Se calcularmos a Média Aritmética: (2000 + 2000 + 2200 + 2400 + 2600 + 2800 + 3000 + 3000 + 45000) / 9 = 65.000 / 9 ≈ R$ 7.222,22.',
        '4. Conclusão prática: Dizer que o "salário médio" da agência é de R$ 7.222 é uma distorção estatística, pois 8 dos 9 funcionários ganham menos da metade desse valor! A mediana (R$ 2.600) reflete a realidade da equipe. Alternativa A!',
      ],
    },
    {
      id: 4,
      tema: 'Medidas de Dispersão: Desvio-Padrão e Volatilidade',
      pergunta: 'Dois estudantes, Lucas e Gabriel, obtiveram a mesma média aritmética final de 7,0 pontos após realizarem 5 provas de matemática. No entanto, o cálculo das notas revelou que as notas de Lucas tiveram desvio-padrão s_Lucas = 0,4 ponto, enquanto as notas de Gabriel tiveram desvio-padrão s_Gabriel = 2,8 pontos. O que essa informação revela sobre o desempenho dos dois alunos?',
      opcoes: [
        { idx: 0, texto: 'A) Lucas teve um desempenho muito mais regular e consistente em torno da média, enquanto Gabriel apresentou grande oscilação e volatilidade entre notas altas e baixas.', correta: true },
        { idx: 1, texto: 'B) Gabriel aprendeu mais conteúdos difíceis porque seu desvio-padrão foi maior.', correta: false },
        { idx: 2, texto: 'C) Como ambos obtiveram a mesma média 7,0, a dispersão é irrelevante e os desempenhos foram idênticos.', correta: false },
        { idx: 3, texto: 'D) Lucas obteve notas mais altas que Gabriel em todas as 5 provas aplicadas.', correta: false },
      ],
      explicacao: [
        'O papel do Desvio-Padrão como régua de consistência e risco:',
        '1. A média aritmética resume o centro da distribuição, mas oculta o comportamento dos dados individuais.',
        '2. O Desvio-Padrão mede o afastamento médio das notas em relação à média 7,0.',
        '3. Notas com desvio pequeno (Lucas: 0,4 ponto) significam que quase todas as notas dele orbitaram rigidamente entre 6,6 e 7,4 (alta regularidade e previsibilidade).',
        '4. Notas com desvio grande (Gabriel: 2,8 pontos) revelam oscilação acentuada, com notas extremas ao longo do ano.',
        'No mercado financeiro e na ciência, desvio-padrão é sinônimo de risco e dispersão. Alternativa A correta!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 20 • Módulo 05: Álgebra Discreta, Probabilidade e Estatística
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Probabilidade e Estatística Descritiva: <br />
          <span className="text-cyan-400 font-light">O Filtro Bayesiano, o Diagrama de Venn e a Tirania dos Outliers</span>
        </h1>

        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Metodológica: O Raciocínio sob Incerteza e a Desmistificação das Médias
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            No Doc 19, aprendemos a contar todas as combinações possíveis do universo. Agora, dividimos os casos favoráveis pelo total para <strong>tomar decisões sob incerteza</strong> e <strong>interpretar dados reais sem ilusões</strong>:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • <strong>A Probabilidade Laplaciana:</strong> É a fração entre os casos que nos interessam e o todo (<span className="text-cyan-300 font-bold">P(A) = n(A) / n(Ω)</span>). Na união de conjuntos, subtrair a intersecção (<span className="text-white font-bold">- P(A ∩ B)</span>) é obrigatório para não contar o mesmo evento duas vezes.
            </li>
            <li>
              • <strong>Probabilidade Condicional (P(A|B)):</strong> Toda nova informação restringe o espaço amostral. O denominador deixa de ser o todo e passa a ser o conjunto daquilo que já sabemos ser verdade.
            </li>
            <li>
              • <strong>A Falácia da Média Aritmética:</strong> Uma única anomalia extrema distorce a média para cima. A <strong>Mediana</strong> permanece como a medida de posição central mais resistente a valores discrepantes.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O DIAGRAMA DE VENN E A REGRA DA ADIÇÃO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Probabilidade Laplaciana e a Geometria de Venn
          </h2>
        </div>

        <p>
          Em qualquer experimento com resultados equiprováveis, a probabilidade é calculada pela razão fundamental de Pierre-Simon Laplace:
        </p>

        <div className="p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-sm text-center font-mono text-lg text-cyan-300 font-bold my-4">
          P(A) = n(A) / n(Ω) = Casos Favoráveis / Casos Possíveis Totais
        </div>

        <p className="text-neutral-300">
          Quando dois eventos A e B ocorrem simultaneamente, o diagrama de Venn ilustra por que somar apenas <code className="text-cyan-300 font-mono">P(A) + P(B)</code> duplica a região da intersecção.
        </p>

        {/* SIMULADOR 1: DIAGRAMA DE VENN BLINDADO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: Diagrama de Venn e Probabilidade Condicional
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Ajuste os conjuntos A, B e a sobreposição (A ∩ B) sobre o universo total n(Ω) = 100:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-cyan-400">n(A):</span>
                <input
                  type="range" min="15" max="65" step="5"
                  value={elementosA}
                  onChange={(e) => setElementosA(parseInt(e.target.value))}
                  className="w-16 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold">{elementosA}</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-emerald-400">n(B):</span>
                <input
                  type="range" min="15" max="60" step="5"
                  value={elementosB}
                  onChange={(e) => setElementosB(parseInt(e.target.value))}
                  className="w-16 accent-emerald-400 cursor-pointer"
                />
                <span className="text-white font-bold">{elementosB}</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-amber-400">n(A ∩ B):</span>
                <input
                  type="range"
                  min={minInterseccaoObrigatoria}
                  max={maxInterseccaoPossivel}
                  step="5"
                  value={interSafe}
                  onChange={(e) => setInterseccaoAB(parseInt(e.target.value))}
                  className="w-16 accent-amber-400 cursor-pointer"
                />
                <span className="text-white font-bold">{interSafe}</span>
              </div>
            </div>
          </div>

          {/* Alerta Didático de Kolmogorov */}
          {minInterseccaoObrigatoria > 0 && (
            <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded text-xs font-mono text-amber-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>
                <strong>Axioma de Kolmogorov:</strong> Como n(A) + n(B) = {elementosA + elementosB} &gt; 100, pelo menos {minInterseccaoObrigatoria} elementos <strong>precisam</strong> estar na intersecção para não estourar o universo de 100!
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Diagrama com Centro Dinâmico */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[400px] mx-auto overflow-hidden p-4 flex items-center justify-center">
              <svg viewBox="0 0 280 200" className="w-full h-full">
                {renderizarMalhaSegura(280, 200)}

                {/* Retângulo do Universo Amostral Ω */}
                <rect x="15" y="15" width="250" height="170" rx="4" fill="none" stroke="#444" strokeWidth="1.5" />
                <text x="25" y="32" fill="#888" fontSize="10" fontFamily="monospace" fontWeight="bold">Ω = 100</text>
                <text x="25" y="172" fill="#666" fontSize="10" fontFamily="monospace">Fora de A e B: {foraAB}</text>

                {(() => {
                  const centroX = 140;
                  const centroY = 105;
                  const cAx = centroX - distCentros / 2;
                  const cBx = centroX + distCentros / 2;

                  return (
                    <g>
                      {/* Círculo A (Ciano) */}
                      <circle
                        cx={cAx}
                        cy={centroY}
                        r="52"
                        fill="rgba(6, 182, 212, 0.25)"
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                      {/* Círculo B (Esmeralda) */}
                      <circle
                        cx={cBx}
                        cy={centroY}
                        r="48"
                        fill="rgba(16, 185, 129, 0.25)"
                        stroke="#10b981"
                        strokeWidth="2"
                      />

                      {/* Rótulos dos Conjuntos */}
                      <text x={cAx - 22} y="48" fill="#06b6d4" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        A ({elementosA})
                      </text>
                      <text x={cBx + 10} y="48" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        B ({elementosB})
                      </text>

                      {/* Quantidades em cada partição disjunta */}
                      <text x={cAx - 22} y={centroY + 4} fill="#06b6d4" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {apenasA}
                      </text>
                      <text x={cBx + 22} y={centroY + 4} fill="#10b981" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {apenasB}
                      </text>

                      {/* Quantidade na Intersecção */}
                      {interSafe > 0 && (
                        <text x={centroX} y={centroY + 4} fill="#f59e0b" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                          {interSafe}
                        </text>
                      )}
                    </g>
                  );
                })()}
              </svg>

              <div className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-amber-400">Intersecção: {interSafe}%</span> | <span className="text-cyan-400">União: {uniaoAB}%</span>
              </div>
            </div>

            {/* Painel Numérico do Venn */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">Partições Disjuntas no Espaço Amostral:</div>
                <div className="text-white text-xs space-y-0.5">
                  <div>• Somente em A: <span className="text-cyan-400 font-bold">{apenasA}</span> ({apenasA}%)</div>
                  <div>• Somente em B: <span className="text-emerald-400 font-bold">{apenasB}</span> ({apenasB}%)</div>
                  <div>• Em ambos (A ∩ B): <span className="text-amber-400 font-bold">{interSafe}</span> ({interSafe}%)</div>
                  <div>• Em nenhum dos dois: <span className="text-neutral-500 font-bold">{foraAB}</span> ({foraAB}%)</div>
                </div>
              </div>

              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">1. Probabilidade da União P(A ∪ B):</div>
                <div className="text-white font-bold text-sm">
                  P(A) + P(B) - P(A ∩ B) = {elementosA} + {elementosB} - {interSafe} = <span className="text-cyan-300">{(probUniao * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800 rounded space-y-1">
                <div className="text-neutral-400">2. Probabilidade Condicional P(A | B) [Dado que B ocorreu]:</div>
                <div className="text-emerald-400 font-bold text-base">
                  P(A ∩ B) / P(B) = {interSafe} / {elementosB} = <span className="text-white">{(probACondicionadoB * 100).toFixed(1)}%</span>
                </div>
                <div className="text-[10px] text-neutral-400 font-sans pt-0.5">
                  Sabendo que o evento B ocorreu, o espaço amostral é podado de 100 para apenas {elementosB}.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: MEDIDAS DE TENDÊNCIA CENTRAL E A TIRANIA DOS OUTLIERS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Estatística Descritiva: Média, Mediana e o Efeito Outlier
          </h2>
        </div>

        <p>
          Em conjuntos com dados assimétricos, a média aritmética pode produzir conclusões enganosas sobre a distribuição:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 font-mono text-xs">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-bold uppercase text-sm block">1. Média Aritmética (x̄)</span>
            <div className="text-white font-bold text-base py-1">x̄ = ∑x / n</div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              Representa o centro de gravidade numérico. Sua fragilidade é a <strong>alta sensibilidade a valores extremos</strong> (outliers).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-bold uppercase text-sm block">2. Mediana (Md)</span>
            <div className="text-white font-bold text-base py-1">O Centro do Rol</div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              O valor posicional que divide a amostra exatamente ao meio (50% menor, 50% maior). <strong>Permanece estável frente a outliers</strong>.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-amber-400 font-bold uppercase text-sm block">3. Moda (Mo)</span>
            <div className="text-white font-bold text-base py-1">Frequência Máxima</div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              O dado com maior contagem na amostra. Útil para verificar tendências de concentração em pesquisas categóricas.
            </p>
          </div>
        </div>

        {/* SIMULADOR 2: NOVO LABORATÓRIO DE OUTLIERS COM CARDS DE EQUIPE */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Novo Laboratório de Outliers: A Distorção da Média em Tempo Real
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                7 analistas ganham entre R$ 2.000 e R$ 3.500. Ajuste o pró-labore do Diretor (Outlier):
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Diretor:</span>
              <input
                type="range"
                min="3500"
                max="45000"
                step="1500"
                value={salarioDiretor}
                onChange={(e) => setSalarioDiretor(parseInt(e.target.value))}
                className="w-28 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold w-24 text-right">R$ {salarioDiretor.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          {/* RÉGUA VISUAL DE DISTRIBUIÇÃO EM SVG */}
          <div className="bg-neutral-950 border border-neutral-800 rounded p-4 space-y-2">
            <span className="text-[11px] font-mono text-neutral-500 uppercase block">
              Régua de Densidade Salarial (0 a R$ 45.000):
            </span>

            <div className="relative w-full aspect-[7/1] min-h-[60px] flex items-center">
              <svg viewBox="0 0 400 60" className="w-full h-full overflow-visible">
                {/* Linha da Régua com marcas */}
                <line x1="20" y1="35" x2="380" y2="35" stroke="#444" strokeWidth="2" />
                <line x1="20" y1="30" x2="20" y2="40" stroke="#666" strokeWidth="1" />
                <line x1="110" y1="30" x2="110" y2="40" stroke="#444" strokeWidth="1" />
                <line x1="200" y1="30" x2="200" y2="40" stroke="#444" strokeWidth="1" />
                <line x1="290" y1="30" x2="290" y2="40" stroke="#444" strokeWidth="1" />
                <line x1="380" y1="30" x2="380" y2="40" stroke="#666" strokeWidth="1" />

                <text x="20" y="52" fill="#666" fontSize="8" fontFamily="monospace">R$ 0</text>
                <text x="110" y="52" fill="#555" fontSize="8" fontFamily="monospace">R$ 11k</text>
                <text x="200" y="52" fill="#555" fontSize="8" fontFamily="monospace">R$ 22k</text>
                <text x="290" y="52" fill="#555" fontSize="8" fontFamily="monospace">R$ 34k</text>
                <text x="380" y="52" fill="#666" fontSize="8" fontFamily="monospace" textAnchor="end">R$ 45k</text>

                {/* Plotagem dos 7 Analistas (Bolinhas Ciano) */}
                {equipePadrao.map((p) => {
                  const xPos = 20 + (p.salario / 45000) * 360;
                  return (
                    <circle
                      key={p.id}
                      cx={xPos}
                      cy="35"
                      r="4"
                      fill="#06b6d4"
                      opacity="0.8"
                    />
                  );
                })}

                {/* Plotagem do Diretor (Bolinha Vermelha Deslizante) */}
                {(() => {
                  const xDir = 20 + (salarioDiretor / 45000) * 360;
                  return (
                    <g>
                      <circle cx={xDir} cy="35" r="6" fill="#ef4444" className="animate-pulse" />
                      <text x={xDir} y="22" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        Diretor
                      </text>
                    </g>
                  );
                })()}

                {/* Marcador Mediana (Verde - Topo) */}
                {(() => {
                  const xMed = 20 + (medianaSalarial / 45000) * 360;
                  return (
                    <g>
                      <polygon points={`${xMed},25 ${xMed - 4},17 ${xMed + 4},17`} fill="#10b981" />
                      <text x={xMed} y="13" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        Md
                      </text>
                    </g>
                  );
                })()}

                {/* Marcador Média (Amarelo - Base) */}
                {(() => {
                  const xMedia = 20 + (mediaSalarial / 45000) * 360;
                  return (
                    <g>
                      <polygon points={`${xMedia},45 ${xMedia - 4},53 ${xMedia + 4},53`} fill="#f59e0b" />
                      <text x={xMedia} y="60" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        x̄
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                7 Analistas (Cluster R$ 2k–3,5k)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                ▲ Mediana: R$ {medianaSalarial.toFixed(0)} (Estável)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                ▼ Média: R$ {mediaSalarial.toFixed(0)} (Puxada)
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                Diretor (Outlier)
              </span>
            </div>
          </div>

          {/* GRID DOS 8 CARDS DE COLABORADORES */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-neutral-500 uppercase block">
              Folha Salarial dos 8 Colaboradores (Comitê):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              {equipeCompleta.map((p) => {
                const estaAbaixo = p.salario < mediaSalarial;
                const isOutlier = p.id === 8;

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded border transition-all ${
                      isOutlier
                        ? 'border-red-500/60 bg-red-950/20'
                        : estaAbaixo
                        ? 'border-neutral-800 bg-black'
                        : 'border-emerald-500/40 bg-emerald-950/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-[11px] truncate">{p.nome}</span>
                      <span className="text-[9px] text-neutral-500">#{p.id}</span>
                    </div>

                    <div className={`text-base font-bold my-1 ${isOutlier ? 'text-red-400' : 'text-neutral-200'}`}>
                      R$ {p.salario.toLocaleString('pt-BR')}
                    </div>

                    <div className="text-[10px] text-neutral-500 mb-2 truncate">{p.cargo}</div>

                    {/* Badge Dinâmico em Relação à Média */}
                    <div className="pt-1 border-t border-neutral-900">
                      {estaAbaixo ? (
                        <span className="text-[9px] font-bold text-amber-400/90 flex items-center gap-1">
                          <span>↓</span> Abaixo da Média
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                          <span>↑</span> Acima da Média
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DIAGNÓSTICO DO EFEITO OUTLIER */}
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2">
              <span className="text-neutral-400">Diagnóstico da Média vs Mediana:</span>
              <span className="text-white font-bold">
                {totalAbaixoDaMedia} de 8 colaboradores ({porcentagemAbaixo.toFixed(0)}%) estão abaixo da média
              </span>
            </div>

            <p className="text-neutral-300 font-sans text-xs leading-relaxed font-light">
              {salarioDiretor <= 5000 ? (
                <span>
                  🟢 <strong>Distribuição Próxima da Simetria:</strong> O salário do diretor está próximo da faixa dos analistas. A média (R$ {mediaSalarial.toFixed(0)}) e a mediana (R$ {medianaSalarial.toFixed(0)}) contam quase a mesma história.
                </span>
              ) : salarioDiretor <= 15000 ? (
                <span>
                  🟡 <strong>Assimetria Moderada:</strong> A média subiu para R$ {mediaSalarial.toFixed(0)}, ultrapassando os salários de quase toda a equipe técnica. A mediana (R$ {medianaSalarial.toFixed(0)}) continua protegendo a leitura do funcionário típico.
                </span>
              ) : (
                <span className="text-amber-200">
                  🚨 <strong>Tirania Crítica do Outlier:</strong> A média disparou para R$ {mediaSalarial.toFixed(0)}, tornando-se <strong>maior do que o salário de todos os 7 analistas da empresa</strong>! Nenhum funcionário técnico ganha perto desse valor. A mediana (R$ {medianaSalarial.toFixed(0)}) segue inalterada.
                </span>
              )}
            </p>
          </div>

        </div>
      </section>

      {/* 4. PILAR 03: VARIÂNCIA E DESVIO-PADRÃO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Medidas de Dispersão: Variância e Desvio-Padrão
          </h2>
        </div>

        <p>
          Dois conjuntos com médias rigorosamente idênticas podem apresentar comportamentos de risco e estabilidade opostos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 font-mono text-xs">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-bold uppercase text-sm block">1. Variância Amostral (s²)</span>
            <div className="text-white font-bold text-base py-1">
              s² = ∑(x_i - x̄)² / (n - 1)
            </div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              Mede a média dos desvios quadráticos em relação ao centro. Elevar ao quadrado elimina sinais negativos, mas altera a unidade de medida em relação aos dados originais.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-bold uppercase text-sm block">2. Desvio-Padrão (s)</span>
            <div className="text-white font-bold text-base py-1">
              s = √(Variância)
            </div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              Retorna à mesma unidade dos dados coletados. Um desvio-padrão próximo de zero indica concentração dos dados em torno da média; um valor elevado aponta maior dispersão.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine a Incerteza e a Análise de Dados
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para descontar as intersecções, reorganizar os dados em ordem crescente e calcular desvios antes de confirmar a resposta!
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
                        {acertou ? 'Raciocínio probabilístico correto!' : 'Atenção aos denominadores reduzidos e à mediana! Veja a resolução:'}
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
                      O Pulo do Gato Estatístico:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 20 e do Módulo 05:</p>
        <p className="leading-relaxed">
          Com este caderno, concluímos o <strong>Módulo 05: Álgebra Discreta, Probabilidade e Estatística</strong>. Compreender que a probabilidade condicional restringe o universo de possibilidades e que a mediana resiste à distorção de outliers fornece as bases para interpretar cenários de incerteza em modelagem de dados e tomada de decisão.
        </p>
      </footer>

    </article>
  );
}