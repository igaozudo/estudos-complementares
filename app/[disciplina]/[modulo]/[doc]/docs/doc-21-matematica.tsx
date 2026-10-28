'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO MILIMETRADA (CANVAS + GRID ESPACIAL/MATRICIAL)
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Matricial #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Vetores e Transformações
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Escalonamento e Determinantes
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
              Esboce os vetores de base transformados ou os sistemas escalonados
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Calcule det(M) = ad - bc, aplique a Regra de Cramer D_x/D ou monte a matriz inversa A⁻¹ = (1/det) · adj(A)..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 21 - MATRIZES E SISTEMAS LINEARES
// =========================================================================
export default function Doc21Matematica() {
  // -----------------------------------------------------------------------
  // SIMULADOR 1: O DEFORMADOR DE ESPAÇO 2D (TRANSFORMAÇÃO MATRICIAL)
  // Matriz M = [ [a, b], [c, d] ] onde:
  // Coluna 1 = (a, c) é o destino do vetor i = (1, 0)
  // Coluna 2 = (b, d) é o destino do vetor j = (0, 1)
  // -----------------------------------------------------------------------
  const [matA, setMatA] = useState<number>(1);
  const [matB, setMatB] = useState<number>(1);
  const [matC, setMatC] = useState<number>(0);
  const [matD, setMatD] = useState<number>(1);

  // Determinante 2x2 = ad - bc
  const detMatriz = matA * matD - matB * matC;
  const areaDeformada = Math.abs(detMatriz);

  // Predefinições pedagógicas
  const aplicarPreset = (tipo: 'identidade' | 'cisalhamento' | 'escala' | 'colapso' | 'reflexao') => {
    switch (tipo) {
      case 'identidade':
        setMatA(1); setMatB(0); setMatC(0); setMatD(1);
        break;
      case 'cisalhamento':
        setMatA(1); setMatB(1); setMatC(0); setMatD(1);
        break;
      case 'escala':
        setMatA(2); setMatB(0); setMatC(0); setMatD(1.5);
        break;
      case 'colapso':
        setMatA(1); setMatB(2); setMatC(1); setMatD(2); // det = 2 - 2 = 0
        break;
      case 'reflexao':
        setMatA(-1); setMatB(0); setMatC(0); setMatD(1); // det = -1
        break;
    }
  };

  // -----------------------------------------------------------------------
  // SIMULADOR 2: LABORATÓRIO GEOMÉTRICO DE SISTEMAS LINEARES 2x2
  // Reta 1: a1·x + b1·y = c1 -> y = (c1 - a1·x) / b1
  // Reta 2: a2·x + b2·y = c2 -> y = (c2 - a2·x) / b2
  // -----------------------------------------------------------------------
  const [m1, setM1] = useState<number>(1);
  const [k1, setK1] = useState<number>(1);
  const [m2, setM2] = useState<number>(-1);
  const [k2, setK2] = useState<number>(3);

  // Determinante do sistema: D = m1 - m2
  const detSistema = m1 - m2;
  const isParalelo = Math.abs(detSistema) < 0.001;
  const isCoincidente = isParalelo && Math.abs(k1 - k2) < 0.001;

  // Ponto de interseção
  const interX = !isParalelo ? (k2 - k1) / (m1 - m2) : null;
  const interY = !isParalelo && interX !== null ? m1 * interX + k1 : null;

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
      tema: 'Determinante como Fator de Escala Geométrica',
      pergunta: 'Um polígono plano de área exatamente igual a 12 cm² sofre uma transformação linear bidimensional regida pela matriz M = [[3, -1], [2, 4]]. Qual é a área da nova figura geométrica resultante no plano após essa transformação e como o sinal do determinante se comporta?',
      opcoes: [
        { idx: 0, texto: 'A) Área = 168 cm²; det(M) = 14 e preserva a orientação espacial do polígono.', correta: true },
        { idx: 1, texto: 'B) Área = 120 cm²; det(M) = 10 e contrai os eixos ortogonais.', correta: false },
        { idx: 2, texto: 'C) Área = 144 cm²; det(M) = 12 e mantém a área inalterada.', correta: false },
        { idx: 3, texto: 'D) Área = 24 cm²; det(M) = 2 com reflexão de eixos.', correta: false },
      ],
      explicacao: [
        'A essência geométrica do determinante como multiplicador de área:',
        '1. Cálculo do determinante da matriz M: det(M) = (3 · 4) - (-1 · 2) = 12 - (-2) = 12 + 2 = 14.',
        '2. O determinante representa a taxa de ampliação de superfícies no plano: Nova Área = Área Original · |det(M)|.',
        '3. Calculando: Nova Área = 12 cm² · 14 = 168 cm².',
        '4. Interpretação do sinal: como det(M) = +14 > 0, o plano foi esticado preservando a orientação horária/anti-horária das arestas. Se fosse negativo, o polígono teria sofrido um espelhamento. Alternativa A correta!',
      ],
    },
    {
      id: 2,
      tema: 'Discussão de Sistemas Lineares com Parâmetro',
      pergunta: 'Considere o sistema linear nas incógnitas x e y: { kx + 2y = 4 ; 3x + 6y = 12 }. Para qual valor de k o sistema passa a admitir infinitas soluções distintas (Sistema Possível e Indeterminado - SPI)?',
      opcoes: [
        { idx: 0, texto: 'A) k = 1', correta: true },
        { idx: 1, texto: 'B) k = 3', correta: false },
        { idx: 2, texto: 'C) k = 6', correta: false },
        { idx: 3, texto: 'D) Para nenhum valor de k, pois é impossível.', correta: false },
      ],
      explicacao: [
        'Análise da proporcionalidade entre as equações:',
        '1. Para que duas equações lineares 2x2 representem um SPI, as retas associadas no plano cartesiano devem ser COINCIDENTES (a mesma reta com coeficientes proporcionais).',
        '2. Razão entre os termos da 2ª e da 1ª equação: nos coeficientes de y temos 6 / 2 = 3. Nos termos independentes temos 12 / 4 = 3.',
        '3. Para que a 2ª equação seja exatamente o triplo da 1ª em toda a sua extensão: 3 / k = 3 → 3k = 3 → k = 1.',
        '4. Verificando o determinante principal D: D = (1 · 6) - (2 · 3) = 6 - 6 = 0, e os determinantes D_x e D_y também se anulam. Com k = 1, as duas retas se sobrepõem perfeitamente. Alternativa A!',
      ],
    },
    {
      id: 3,
      tema: 'Não-Comutatividade e Produto de Matrizes',
      pergunta: 'Sejam as matrizes A (que realiza um cisalhamento horizontal no plano) e B (que realiza uma rotação de 90°). Por que, na álgebra matricial, a igualdade A · B = B · A quase nunca é verdadeira no mundo prático da computação gráfica?',
      opcoes: [
        { idx: 0, texto: 'A) Porque a multiplicação matricial representa composições de transformações espaciais sucessivas, e a ordem cronológica em que aplicamos movimentos no espaço altera o resultado final.', correta: true },
        { idx: 1, texto: 'B) Porque matrizes com determinantes diferentes não podem ser multiplicadas em ordem inversa.', correta: false },
        { idx: 2, texto: 'C) Porque os elementos da diagonal secundária invertem o sinal quando a ordem é trocada.', correta: false },
        { idx: 3, texto: 'D) Porque a matriz inversa só existe para o produto efetuado da esquerda para a direita.', correta: false },
      ],
      explicacao: [
        'A geometria da composição de operadores:',
        '1. Cada multiplicação matricial M · v aplica uma deformação ou rotação no vetor v.',
        '2. A expressão (A · B) · v significa: aplique primeiro a transformação B e, em seguida, aplique a transformação A sobre o resultado.',
        '3. Teste mental simples: pegue um livro. Gire-o 90° no ar e depois incline-o 45° para a frente. Agora tente o inverso: incline 45° para a frente e depois gire 90°. A orientação final do livro no espaço é totalmente diferente!',
        'A multiplicação de matrizes herda a não-comutatividade das rotações e cisalhamentos físicos no espaço. Alternativa A!',
      ],
    },
    {
      id: 4,
      tema: 'Inversibilidade e o Colapso da Dimensão (det = 0)',
      pergunta: 'Uma matriz quadrada de ordem 2 possui determinante nulo: det(M) = 0. Sob a ótica geométrica das transformações no plano cartesiano, por que é IMPOSSÍVEL calcular a matriz inversa M⁻¹?',
      opcoes: [
        { idx: 0, texto: 'A) Porque a transformação achatou o plano bidimensional sobre uma reta unidimensional (ou sobre a origem), perdendo informação irrecuperável e tornando impossível desfazer o movimento de volta ao plano.', correta: true },
        { idx: 1, texto: 'B) Porque a matriz inversa teria todos os seus coeficientes com valor zero.', correta: false },
        { idx: 2, texto: 'C) Porque o traço da matriz se torna estritamente negativo quando o determinante se anula.', correta: false },
        { idx: 3, texto: 'D) Porque matrizes com det = 0 só admitem inversas fracionárias imaginárias.', correta: false },
      ],
      explicacao: [
        'O colapso dimensional de área:',
        '1. Se det(M) = 0, qualquer figura que possuía área positiva (como um quadrado de área 1) é esmagada em uma linha reta de área zero.',
        '2. Para que uma matriz inversa M⁻¹ existisse, ela deveria ser uma função matemática capaz de pegar cada ponto daquela reta e restaurá-lo à sua posição original única no plano 2D.',
        '3. Porém, infinitos pontos do plano original caíram exatamente sobre o mesmíssimo ponto da reta. Reverter isso violaria a definição de função (um único ponto de entrada geraria infinitas saídas).',
        'det = 0 é sinônimo de colapso de dimensão e perda definitiva de informação geométrica. Alternativa A impecável!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO COM AVISO PEDAGÓGICO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 21 • Módulo 05: Álgebra Linear, Matrizes e Sistemas
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Matrizes, Determinantes e Sistemas: <br />
          <span className="text-cyan-400 font-light">A Geometria das Transformações e o Colapso do Espaço</span>
        </h1>

        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            Aviso Pedagógico: Mude a Sua Lente de Estudo (Chega de Tabelas Mortas)
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Se te ensinaram Matrizes como um amontoado de números entre colchetes e Determinantes como uma fórmula mecânica de multiplicar diagonais, você perdeu toda a beleza da Álgebra Linear:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • Uma <strong>Matriz 2×2</strong> é uma <strong>máquina de dobrar o espaço 2D</strong>. As colunas da matriz dizem exatamente para onde os vetores unitários de base <span className="text-cyan-300 font-bold">&#238; = (1, 0)</span> e <span className="text-emerald-400 font-bold">&#309; = (0, 1)</span> foram parar após a transformação.
            </li>
            <li>
              • O <strong>Determinante (det M)</strong> é o <strong>fator de ampliação de área</strong>. Se det = 3, o espaço esticou e triplicou qualquer figura. Se <span className="text-amber-400 font-bold">det = 0</span>, o espaço sofreu um <strong>colapso dimensional</strong> e foi achatado em uma linha reta.
            </li>
            <li>
              • Um <strong>Sistema Linear</strong> é o cruzamento geométrico de hiperplanos: o sistema só tem solução única (SPD) quando as retas se cruzam em um ponto bem comportado sem colapso de determinante.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: A MATRIZ COMO TRANSFORMADORA ESPACIAL */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Alma da Matriz: Para Onde Vão os Vetores de Base?
          </h2>
        </div>

        <p>
          No plano cartesiano convencional, todo ponto e vetor é construído a partir de dois blocos fundamentais de Lego: o vetor unitário horizontal <code className="text-cyan-300 font-mono font-bold">&#238; = (1, 0)</code> e o vetor unitário vertical <code className="text-emerald-400 font-mono font-bold">&#309; = (0, 1)</code>.
        </p>

        <p className="text-neutral-300">
          Quando aplicamos uma matriz quadrada <code className="text-white font-mono">M = [[a, b], [c, d]]</code>, estamos simplesmente redefinindo o destino desses dois vetores:
          <br />
          • A <strong>primeira coluna (a, c)</strong> é a nova posição do vetor <span className="text-cyan-400 font-bold">&#238;</span>.
          <br />
          • A <strong>segunda coluna (b, d)</strong> é a nova posição do vetor <span className="text-emerald-400 font-bold">&#309;</span>.
        </p>

        {/* SIMULADOR 1: O DEFORMADOR DE ESPAÇO 2D */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: A Geometria da Matriz e o Fator de Área
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere os coeficientes da matriz ou clique nos presets para ver o espaço e a área se transformarem:
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => aplicarPreset('identidade')}
                className="px-2.5 py-1 text-[11px] font-mono border border-neutral-700 bg-black hover:border-cyan-400 rounded transition-colors"
              >
                Identidade (det=1)
              </button>
              <button
                onClick={() => aplicarPreset('cisalhamento')}
                className="px-2.5 py-1 text-[11px] font-mono border border-neutral-700 bg-black hover:border-cyan-400 rounded transition-colors"
              >
                Cisalhamento (det=1)
              </button>
              <button
                onClick={() => aplicarPreset('escala')}
                className="px-2.5 py-1 text-[11px] font-mono border border-neutral-700 bg-black hover:border-cyan-400 rounded transition-colors"
              >
                Escala (det=3)
              </button>
              <button
                onClick={() => aplicarPreset('colapso')}
                className="px-2.5 py-1 text-[11px] font-mono border border-amber-800 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 rounded transition-colors"
              >
                Colapso 1D (det=0)
              </button>
              <button
                onClick={() => aplicarPreset('reflexao')}
                className="px-2.5 py-1 text-[11px] font-mono border border-purple-800 bg-purple-950/40 text-purple-300 hover:bg-purple-900/60 rounded transition-colors"
              >
                Espelhamento (det=-1)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* Controles de Matriz 2x2 */}
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-black border border-neutral-800 rounded space-y-3">
                <span className="text-neutral-400 uppercase text-[10px] block">Matriz de Transformação M:</span>
                
                <div className="grid grid-cols-2 gap-4 max-w-[280px] mx-auto p-3 bg-neutral-950 border border-neutral-800 rounded">
                  <div>
                    <span className="text-cyan-400 text-[10px] block">a (x de &#238;): {matA}</span>
                    <input
                      type="range" min="-2" max="3" step="0.5"
                      value={matA}
                      onChange={(e) => setMatA(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-emerald-400 text-[10px] block">b (x de &#309;): {matB}</span>
                    <input
                      type="range" min="-2" max="3" step="0.5"
                      value={matB}
                      onChange={(e) => setMatB(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-cyan-400 text-[10px] block">c (y de &#238;): {matC}</span>
                    <input
                      type="range" min="-2" max="3" step="0.5"
                      value={matC}
                      onChange={(e) => setMatC(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-emerald-400 text-[10px] block">d (y de &#309;): {matD}</span>
                    <input
                      type="range" min="-2" max="3" step="0.5"
                      value={matD}
                      onChange={(e) => setMatD(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Informações Numéricas de Área e Determinante */}
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">Cálculo do Determinante (ad - bc):</div>
                <div className="text-white font-bold text-sm">
                  ({matA} · {matD}) - ({matB} · {matC}) = <span className={detMatriz === 0 ? 'text-amber-400' : detMatriz < 0 ? 'text-purple-400' : 'text-cyan-300'}>{detMatriz.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Área do Quadrado Unitário Deformado:</span>
                <span className="text-white font-bold text-base">{areaDeformada.toFixed(2)} u²</span>
              </div>
            </div>

            {/* SVG da Malha Deformada */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="-110 -110 220 220" className="w-full h-full">
                {renderizarMalhaSegura(220, 220)}

                {/* Eixos Centrais */}
                <line x1="-110" y1="0" x2="110" y2="0" stroke="#444" strokeWidth="1" />
                <line x1="0" y1="-110" x2="0" y2="110" stroke="#444" strokeWidth="1" />

                {(() => {
                  const escala = 30; // 1 unidade = 30 pixels
                  // Origem
                  const ox = 0, oy = 0;
                  // Destino de i = (a, c)
                  const ix = matA * escala;
                  const iy = -matC * escala; // Inversão SVG Y
                  // Destino de j = (b, d)
                  const jx = matB * escala;
                  const jy = -matD * escala;
                  // Vértice oposto do paralelogramo = i + j = (a+b, c+d)
                  const px = (matA + matB) * escala;
                  const py = -(matC + matD) * escala;

                  return (
                    <g>
                      {/* Quadrado Unitário Original Transparente */}
                      <polygon
                        points={`0,0 ${1*escala},0 ${1*escala},${-1*escala} 0,${-1*escala}`}
                        fill="none"
                        stroke="#444"
                        strokeWidth="1"
                        strokeDasharray="2"
                      />

                      {/* Paralelogramo Deformado pela Matriz */}
                      <polygon
                        points={`${ox},${oy} ${ix},${iy} ${px},${py} ${jx},${jy}`}
                        fill={detMatriz === 0 ? 'rgba(245, 158, 11, 0.4)' : detMatriz < 0 ? 'rgba(168, 85, 247, 0.25)' : 'rgba(6, 182, 212, 0.25)'}
                        stroke={detMatriz === 0 ? '#f59e0b' : detMatriz < 0 ? '#a855f7' : '#06b6d4'}
                        strokeWidth="2"
                      />

                      {/* Vetor i transformado (Ciano) */}
                      <line x1="0" y1="0" x2={ix} y2={iy} stroke="#06b6d4" strokeWidth="3" />
                      <circle cx={ix} cy={iy} r="3.5" fill="#06b6d4" />

                      {/* Vetor j transformado (Esmeralda) */}
                      <line x1="0" y1="0" x2={jx} y2={jy} stroke="#10b981" strokeWidth="3" />
                      <circle cx={jx} cy={jy} r="3.5" fill="#10b981" />
                    </g>
                  );
                })()}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400">&#238; transformado</span> | <span className="text-emerald-400">&#309; transformado</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PILAR 02: O QUE SIGNIFICA O DETERMINANTE ZERO? */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Determinante: A Métrica de Área e o Colapso Dimensional
          </h2>
        </div>

        <p>
          O determinante de uma matriz não é um truque de álgebra decorado. Ele responde a uma pergunta visual: <strong>quantas vezes a área de uma figura é multiplicada quando o espaço é submetido a essa transformação?</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 font-mono text-xs">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-bold uppercase text-sm block">1. det(M) &gt; 0 (Expansão)</span>
            <div className="text-white font-bold text-base py-1">Área × |det|</div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              O espaço foi esticado ou cisalhado, mas <strong>preservou a orientação</strong> do plano (o vetor &#238; continua à direita relativa do vetor &#309;).
            </p>
          </div>

          <div className="border border-purple-900/40 bg-purple-950/20 p-5 rounded-sm space-y-3">
            <span className="text-purple-400 font-bold uppercase text-sm block">2. det(M) &lt; 0 (Espelhamento)</span>
            <div className="text-white font-bold text-base py-1">Inversão de Lado</div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              O espaço sofreu uma <strong>reflexão em espelho</strong>. A área resultante ainda é positiva (|det|), mas o plano foi virado do avesso como uma folha de papel.
            </p>
          </div>

          <div className="border border-amber-900/40 bg-amber-950/20 p-5 rounded-sm space-y-3">
            <span className="text-amber-400 font-bold uppercase text-sm block">3. det(M) = 0 (Colapso 1D)</span>
            <div className="text-white font-bold text-base py-1">Área Resultante = 0</div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              O plano bidimensional inteiro foi <strong>esmagado em uma linha reta</strong> (ou em um ponto). Perdeu-se informação: é impossível inverter a matriz!
            </p>
          </div>
        </div>
      </section>

      {/* 4. PILAR 03: SISTEMAS LINEARES SOB A ÓTICA DOS HIPERPLANOS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Sistemas Lineares: O Cruzamento Geométrico de Retas
          </h2>
        </div>

        <p>
          Resolver um sistema linear como <code className="text-cyan-300 font-mono font-bold">&#123; y = m₁x + k₁ ; y = m₂x + k₂ &#125;</code> não é apenas isolar letras. Geometricamente, significa <strong>encontrar onde duas retas se encontram no mapa cartesiano</strong>:
        </p>

        {/* SIMULADOR 2: LABORATÓRIO GEOMÉTRICO DE SISTEMAS LINEARES */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: Classificação de Sistemas Lineares
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere a inclinação e a altura das retas para verificar o determinante D e a interseção:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-cyan-400">Reta 1 (m₁):</span>
                <input
                  type="range" min="-2" max="2" step="0.5"
                  value={m1}
                  onChange={(e) => setM1(parseFloat(e.target.value))}
                  className="w-16 accent-cyan-400 cursor-pointer"
                />
                <span className="text-white font-bold">{m1}</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-emerald-400">Reta 2 (m₂):</span>
                <input
                  type="range" min="-2" max="2" step="0.5"
                  value={m2}
                  onChange={(e) => setM2(parseFloat(e.target.value))}
                  className="w-16 accent-emerald-400 cursor-pointer"
                />
                <span className="text-white font-bold">{m2}</span>
              </div>

              <div className="flex items-center gap-2 bg-black border border-neutral-800 p-2 rounded text-xs font-mono">
                <span className="text-amber-400">Altura k₂:</span>
                <input
                  type="range" min="-3" max="5" step="1"
                  value={k2}
                  onChange={(e) => setK2(parseInt(e.target.value))}
                  className="w-16 accent-amber-400 cursor-pointer"
                />
                <span className="text-white font-bold">{k2}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Cruzamento de Retas */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden p-2 flex items-center justify-center">
              <svg viewBox="-100 -100 200 200" className="w-full h-full">
                {renderizarMalhaSegura(200, 200)}

                {/* Eixos */}
                <line x1="-100" y1="0" x2="100" y2="0" stroke="#444" strokeWidth="1" />
                <line x1="0" y1="-100" x2="0" y2="100" stroke="#444" strokeWidth="1" />

                {(() => {
                  const escala = 18;
                  // Reta 1 (Ciano): y = m1 * x + k1
                  const r1_x1 = -80, r1_y1 = -(m1 * (-80 / escala) + k1) * escala;
                  const r1_x2 = 80, r1_y2 = -(m1 * (80 / escala) + k1) * escala;

                  // Reta 2 (Esmeralda): y = m2 * x + k2
                  const r2_x1 = -80, r2_y1 = -(m2 * (-80 / escala) + k2) * escala;
                  const r2_x2 = 80, r2_y2 = -(m2 * (80 / escala) + k2) * escala;

                  return (
                    <g>
                      <line x1={r1_x1} y1={r1_y1} x2={r1_x2} y2={r1_y2} stroke="#06b6d4" strokeWidth="2.5" />
                      <line x1={r2_x1} y1={r2_y1} x2={r2_x2} y2={r2_y2} stroke="#10b981" strokeWidth="2.5" />

                      {/* Ponto de interseção caso concorrentes */}
                      {!isParalelo && interX !== null && interY !== null && (
                        <circle
                          cx={interX * escala}
                          cy={-interY * escala}
                          r="5"
                          fill="#ffffff"
                          className="animate-pulse"
                        />
                      )}
                    </g>
                  );
                })()}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400">Reta 1: y = {m1}x + {k1}</span>
                <br />
                <span className="text-emerald-400">Reta 2: y = {m2}x + {k2}</span>
              </div>
            </div>

            {/* Painel de Classificação de Sistema */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">Determinante Principal D (m₁ - m₂):</div>
                <div className="text-white font-bold text-sm">
                  D = {m1} - ({m2}) = <span className={isParalelo ? 'text-amber-400' : 'text-cyan-400'}>{detSistema.toFixed(2)}</span>
                </div>
              </div>

              {/* Classificação formal do sistema */}
              <div className={`p-4 rounded border space-y-1 ${
                !isParalelo
                  ? 'bg-cyan-950/20 border-cyan-800'
                  : isCoincidente
                  ? 'bg-emerald-950/20 border-emerald-800'
                  : 'bg-amber-950/20 border-amber-800'
              }`}>
                <div className="text-neutral-400 text-[10px] uppercase font-bold">Classificação do Sistema:</div>
                <div className="text-base font-bold text-white">
                  {!isParalelo && (
                    <span className="text-cyan-300">SPD — Sistema Possível e Determinado</span>
                  )}
                  {isParalelo && isCoincidente && (
                    <span className="text-emerald-300">SPI — Sistema Possível e Indeterminado</span>
                  )}
                  {isParalelo && !isCoincidente && (
                    <span className="text-amber-300">SI — Sistema Impossível (Sem Solução)</span>
                  )}
                </div>

                <div className="text-[11px] text-neutral-300 font-sans pt-1">
                  {!isParalelo && interX !== null && interY !== null && (
                    <span>As retas se cruzam em um ponto único: <strong>({interX.toFixed(2)}, {interY.toFixed(2)})</strong>.</span>
                  )}
                  {isParalelo && isCoincidente && (
                    <span>As retas são idênticas e sobrepostas: existem <strong>infinitas soluções comuns</strong> ao longo da reta.</span>
                  )}
                  {isParalelo && !isCoincidente && (
                    <span>As retas são estritamente paralelas e nunca se tocam: <strong>nenhum par (x, y)</strong> satisfaz as duas equações ao mesmo tempo.</span>
                  )}
                </div>
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
            Treinamento Ativo: Domine as Matrizes e os Sistemas
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para escalonar equações, calcular produtos de linha por coluna e checar se o determinante zera antes de validar sua resposta!
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
                        {acertou ? 'Raciocínio algébrico impecável!' : 'Atenção ao determinante e ao escalonamento! Veja a dedução:'}
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
                      O Pulo do Gato Matricial:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 21:</p>
        <p className="leading-relaxed">
          Você deu o salto definitivo para a Álgebra Linear multidimensional. Enxergar as matrizes como deformadoras de vetores de base e o determinante como a taxa geométrica de preservação de área confere a você uma clareza que conecta diretamente a matemática pura à renderização de computação gráfica, machine learning e física teórica. No próximo caderno (<strong>Doc 22: Polinômios, Raízes Complexas e Equações Algébricas</strong>), exploraremos o Teorema Fundamental da Álgebra, o dispositivo prático de Briot-Ruffini e as relações de Girard!
        </p>
      </footer>

    </article>
  );
}