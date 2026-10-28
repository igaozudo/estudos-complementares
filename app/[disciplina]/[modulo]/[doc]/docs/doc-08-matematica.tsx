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
            ✏️ Traçar Parábolas e Vértices
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Bhaskara / Xv, Yv
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
              Esboce a concavidade, as raízes e o eixo de simetria
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Calcule o Delta (Δ = b² - 4ac), o X do Vértice (-b/2a) ou a Fatoração..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 08 - FUNÇÕES QUADRÁTICAS
// =========================================================================
export default function Doc08Matematica() {
  // Simulador 1: Laboratório Cartesiano da Parábola
  const [coefA, setCoefA] = useState<number>(-1);
  const [coefB, setCoefB] = useState<number>(4);
  const [coefC, setCoefC] = useState<number>(0);

  // Cálculos da Parábola em Tempo Real
  const delta = coefB * coefB - 4 * coefA * coefC;
  const xv = coefA !== 0 ? -coefB / (2 * coefA) : 0;
  const yv = coefA !== 0 ? -delta / (4 * coefA) : 0;
  
  const temRaizes = delta >= 0 && coefA !== 0;
  const x1 = temRaizes ? (-coefB + Math.sqrt(delta)) / (2 * coefA) : null;
  const x2 = temRaizes ? (-coefB - Math.sqrt(delta)) / (2 * coefA) : null;

  // Função segura para renderizar a malha do SVG
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

  // Traçado da parábola em SVG Polyline (calculando pontos)
  const renderizarParabola = () => {
    if (coefA === 0) return null; // Previne reta caso tentemos a=0
    let points = "";
    for (let x = -10; x <= 10; x += 0.2) {
      const y = -(coefA * x * x + coefB * x + coefC);
      points += `${x},${y} `;
    }
    return <polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="0.4" />;
  };

  // Simulador 2: Dilema de Precificação (Vértice de Lucro)
  const [descontoReais, setDescontoReais] = useState<number>(5);
  // Lógica: Preço Base = R$ 50 (Vende 100 un). Cada R$ 1 a menos = +10 clientes.
  const precoIngresso = 50 - descontoReais;
  const publicoPresente = 100 + descontoReais * 10;
  const faturamentoTotal = precoIngresso * publicoPresente;

  // Controle dos Exercícios
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
      tema: 'Otimização Econômica (O Ponto de Lucro Máximo)',
      pergunta: 'Uma fábrica de calçados calculou que o lucro mensal L(x), em milhares de reais, obtido pela venda de x centenas de pares, é dado pela função quadrática L(x) = -2x² + 20x - 32. Quantas centenas de pares a fábrica precisa produzir por mês para atingir o LUCRO MÁXIMO, e qual é esse lucro em reais?',
      opcoes: [
        { idx: 0, texto: 'A) Produzir 5 centenas de pares para obter um lucro de R$ 18.000,00', correta: true },
        { idx: 1, texto: 'B) Produzir 10 centenas de pares para obter um lucro de R$ 20.000,00', correta: false },
        { idx: 2, texto: 'C) Produzir 5 centenas de pares para obter um lucro de R$ 32.000,00', correta: false },
        { idx: 3, texto: 'D) Produzir 2 centenas de pares para obter um lucro de R$ 16.000,00', correta: false },
      ],
      explicacao: [
        'A anatomia do Vértice na vida real:',
        '1. Concavidade para baixo (a = -2). A curva tem um pico no topo (Ponto de Máximo). O lucro sobe, atinge o topo e depois cai.',
        '2. Quantidade ótima (X do vértice): Xv = -b / (2a) = -20 / (2 × -2) = -20 / -4 = 5 centenas de pares.',
        '3. Lucro máximo obtido (Y do vértice): Basta aplicar x = 5 na máquina da função:',
        '   L(5) = -2(5)² + 20(5) - 32',
        '   L(5) = -2(25) + 100 - 32 = -50 + 100 - 32 = 18.',
        '4. Como L(x) está em "milhares de reais": 18 × R$ 1.000 = R$ 18.000,00.',
        'Produzir 500 pares gera o lucro cravado de 18 mil. Alternativa A correta!',
      ],
    },
    {
      id: 2,
      tema: 'Raio-X Gráfico dos Coeficientes',
      pergunta: 'Ao analisar o gráfico de uma parábola y = ax² + bx + c no plano cartesiano, você nota três detalhes: a concavidade é um "sorriso triste" (para baixo), a curva corta o eixo Y em um ponto ACIMA da origem (y > 0) e, no momento exato em que cruza esse eixo Y, a curva está SUBINDO. Quais são os sinais de a, b e c?',
      opcoes: [
        { idx: 0, texto: 'A) a < 0, b < 0, c > 0', correta: false },
        { idx: 1, texto: 'B) a < 0, b > 0, c > 0', correta: true },
        { idx: 2, texto: 'C) a > 0, b > 0, c > 0', correta: false },
        { idx: 3, texto: 'D) a < 0, b = 0, c > 0', correta: false },
      ],
      explicacao: [
        'Lendo o DNA da parábola sem fazer conta:',
        '1. Sinal de "a": É a gravidade (concavidade). Sorriso triste (para baixo) significa que a aceleração é negativa: a < 0.',
        '2. Sinal de "c": É a altura exata do impacto no Eixo Y (onde x = 0). Cortou acima do chão? c > 0.',
        '3. O segredo de "b": O coeficiente "b" dita o RITMO DE SUBIDA no momento exato em que o Eixo Y é cortado!',
        '   - Se corta o eixo Y subindo: b > 0.',
        '   - Se corta o eixo Y descendo: b < 0.',
        'Como a curva cruza subindo, b > 0. Portanto: a < 0, b > 0, c > 0. Alternativa B!',
      ],
    },
    {
      id: 3,
      tema: 'A Desconstrução da Bhaskara (Simetria)',
      pergunta: 'Um projétil tem sua altitude h(t) após t segundos dada por h(t) = -5t² + 40t. Usando a lógica da simetria do vértice (sem precisar usar Bhaskara inteira), em qual segundo ele atinge a altura máxima e quanto tempo o voo dura no total?',
      opcoes: [
        { idx: 0, texto: 'A) Altura máxima em 4 segundos | Voo completo dura 8 segundos', correta: true },
        { idx: 1, texto: 'B) Altura máxima em 8 segundos | Voo completo dura 16 segundos', correta: false },
        { idx: 2, texto: 'C) Altura máxima em 4 segundos | Voo completo dura 4 segundos', correta: false },
        { idx: 3, texto: 'D) Altura máxima em 5 segundos | Voo completo dura 10 segundos', correta: false },
      ],
      explicacao: [
        'A geometria balística destrói a decoreba:',
        '1. Raízes (tempo no solo, h = 0): -5t² + 40t = 0. Fatorando o t comum: 5t(-t + 8) = 0.',
        '   t1 = 0 segundos (momento do disparo).',
        '   t2 = 8 segundos (bate no chão). Voo total: 8 segundos.',
        '2. Onde fica o pico? Por pura simetria, o vértice de uma parábola fica EXATAMENTE no ponto médio entre as duas raízes.',
        '   Vértice = (0 + 8) / 2 = 4 segundos.',
        'A matemática garante que o projétil sobe por 4 segundos e desce por 4 segundos. Alternativa A!',
      ],
    },
    {
      id: 4,
      tema: 'Estudo do Sinal da Quadrática',
      pergunta: 'Dada a função quadrática f(x) = x² - 6x + 8. Para quais valores de X o gráfico dessa função mergulha para a região negativa do plano cartesiano (f(x) < 0)?',
      opcoes: [
        { idx: 0, texto: 'A) x < 2 ou x > 4 (Asas externas)', correta: false },
        { idx: 1, texto: 'B) 2 < x < 4 (O buraco interno)', correta: true },
        { idx: 2, texto: 'C) x = 3 (Apenas o vértice)', correta: false },
        { idx: 3, texto: 'D) O gráfico nunca fica negativo.', correta: false },
      ],
      explicacao: [
        'Visão geométrica no Plano Cartesiano:',
        '1. Quem são as raízes (onde a curva fura o chão)? x² - 6x + 8 = 0. (Soma=6, Produto=8). As raízes são x=2 e x=4.',
        '2. Qual a direção da curva? O "a" é +1 (positivo). Logo, a curva é um "Sorriso Feliz" (concavidade para cima).',
        '3. Desenho mental: Ela vem voando do céu, fura o chão na marca x=2, faz a barriga lá no subsolo (negativo) e volta a furar o chão pra subir na marca x=4.',
        '4. Onde está o "Subterrâneo" (y < 0)? Exatamente no espaço ENTRINCHEIRADO entre as duas raízes! Portanto, 2 < x < 4. Alternativa B.',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 08 • Módulo 2: Álgebra e Modelagem
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Funções Quadráticas: <br />
          <span className="text-cyan-400 font-light">Aceleração, Parábolas e o Ponto de Otimização</span>
        </h1>
        
        {/* O MANIFESTO PEDAGÓGICO */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            Aviso Pedagógico: Mude a Sua Lente de Estudo Mais Uma Vez
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            No Doc 07, nós estudamos a <strong>Retidão</strong> (velocidade fixa, degraus iguais). Agora, a <strong>Função Quadrática (2º Grau)</strong> exige uma chave mental totalmente diferente:
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>• Na <strong>Função Afim (Reta)</strong>, o ritmo nunca muda (cada quilômetro custa sempre os mesmos R$ 3).</li>
            <li>• Na <strong>Função Quadrática</strong>, o ritmo <strong>ACELERA OU FREIA CONTINUAMENTE</strong>. O expoente 2 introduz o efeito da gravidade física e das forças de mercado.</li>
            <li>• A parábola não segue em linha reta até o infinito: ela sobe até esgotar o fôlego, atinge um <strong>pico de máxima eficiência (o Vértice)</strong> e inverte violentamente de sentido!</li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: POR QUE O GRAU 2 CURVA O ESPAÇO? */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Salto da Aceleração: Por Que o x² Entorta a Linha?
          </h2>
        </div>

        <p>
          Observe a diferença entre somar passos constantes (Reta) e elevar os passos ao quadrado (Parábola):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-neutral-400 font-mono text-xs uppercase font-bold block">
              1. Mundo Linear: f(x) = 2x (Velocidade Cruzeiro)
            </span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-neutral-300 space-y-1">
              <div>x = 1 → y = 2  <span className="text-neutral-500">(+2)</span></div>
              <div>x = 2 → y = 4  <span className="text-neutral-500">(+2)</span></div>
              <div>x = 3 → y = 6  <span className="text-neutral-500">(+2)</span></div>
              <div>x = 4 → y = 8  <span className="text-neutral-500">(+2)</span></div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O degrau de crescimento é <strong>sempre igual a 2</strong>. O gráfico é uma rampa rígida e perfeita.
            </p>
          </div>

          <div className="border border-cyan-900/40 bg-cyan-950/10 p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">
              2. Mundo Quadrático: f(x) = x² (Aceleração Física)
            </span>
            <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-cyan-300 space-y-1">
              <div>x = 1 → y = 1   <span className="text-cyan-500">(+1)</span></div>
              <div>x = 2 → y = 4   <span className="text-cyan-500">(+3)</span></div>
              <div>x = 3 → y = 9   <span className="text-cyan-500">(+5)</span></div>
              <div>x = 4 → y = 16  <span className="text-cyan-500">(+7)</span></div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O degrau fica <strong>cada vez maior a cada segundo</strong> (+1, +3, +5, +7)! Como o ritmo de subida cresce agressivamente, o gráfico é entortado em uma curva.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PILAR 02: A TRINDADE DOS COEFICIENTES COM SIMULADOR */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Laboratório Cartesiano: Lendo os Coeficientes (a, b, c)
          </h2>
        </div>

        <p>
          Você não precisa de tabela e dezenas de cálculos para esboçar uma parábola. A equação <code className="text-cyan-300 font-mono">f(x) = ax² + bx + c</code> conta toda a história visual da curva se você souber o que cada letra significa.
        </p>

        {/* SIMULADOR INTERATIVO: LABORATÓRIO BALÍSTICO SVG */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Balístico da Parábola
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere os coeficientes e veja o Vértice e o Eixo de Simetria se moverem:
              </p>
            </div>
            <div className="text-xl font-mono text-cyan-300 font-bold bg-neutral-950 px-4 py-2 border border-neutral-800 rounded">
              y = {coefA}x² {coefB >= 0 ? `+ ${coefB}x` : `- ${Math.abs(coefB)}x`} {coefC >= 0 ? `+ ${coefC}` : `- ${Math.abs(coefC)}`}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
            
            {/* Controles de Coeficientes */}
            <div className="space-y-4">
              <div className="bg-black border border-neutral-800 p-4 rounded space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400 uppercase">O Fator "a" (Concavidade):</span>
                  <span className="text-cyan-400 font-bold">{coefA}</span>
                </div>
                <input
                  type="range" min="-3" max="3" step="1"
                  value={coefA}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val !== 0) setCoefA(val);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] font-mono text-neutral-500 h-4">
                  {coefA > 0 ? 'Sorriso Feliz ∪ (Fundo Mínimo)' : 'Sorriso Triste ∩ (Topo Máximo)'}
                </p>
              </div>

              <div className="bg-black border border-neutral-800 p-4 rounded space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400 uppercase">O Fator "b" (Leme de Direção):</span>
                  <span className="text-sky-400 font-bold">{coefB}</span>
                </div>
                <input
                  type="range" min="-6" max="6" step="1"
                  value={coefB}
                  onChange={(e) => setCoefB(parseInt(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <p className="text-[11px] font-mono text-neutral-500 h-4">
                  Define a inclinação EXATA ao cruzar o Eixo Y
                </p>
              </div>

              <div className="bg-black border border-neutral-800 p-4 rounded space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400 uppercase">O Fator "c" (Altura de Saída):</span>
                  <span className="text-emerald-400 font-bold">{coefC}</span>
                </div>
                <input
                  type="range" min="-8" max="8" step="1"
                  value={coefC}
                  onChange={(e) => setCoefC(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <p className="text-[11px] font-mono text-neutral-500 h-4">
                  Corta o mastro Y na coordenada (0, {coefC})
                </p>
              </div>

              {/* Informações Visuais (Vértice e Eixo) */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded">
                  <span className="text-neutral-500 block mb-1">VÉRTICE (Xv, Yv):</span>
                  <span className="text-cyan-400 font-bold">({xv.toFixed(1)}, {yv.toFixed(1)})</span>
                </div>
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded">
                  <span className="text-neutral-500 block mb-1">DISCRIMINANTE (Δ):</span>
                  <span className={`font-bold ${delta > 0 ? 'text-emerald-400' : delta === 0 ? 'text-amber-400' : 'text-red-400'}`}>Δ = {delta}</span>
                </div>
              </div>
            </div>

            {/* O Gráfico SVG (Plano Cartesiano 3D-like) */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-square w-full max-w-[400px] mx-auto overflow-hidden">
              <svg viewBox="-10 -10 20 20" className="w-full h-full">
                {/* Grid interno */}
                {renderizarMalha()}
                {/* Eixos X e Y */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#666" strokeWidth="0.3" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#666" strokeWidth="0.3" />
                
                {/* Linha Tracejada do Eixo de Simetria (Xv) */}
                <line x1={xv} y1="-10" x2={xv} y2="10" stroke="#06b6d4" strokeWidth="0.2" strokeDasharray="0.5" />
                
                {/* A Curva da Parábola */}
                {renderizarParabola()}

                {/* Pontos Chave */}
                <circle cx="0" cy={-coefC} r="0.5" fill="#10b981" /> {/* Ponto C (Eixo Y) */}
                <circle cx={xv} cy={-yv} r="0.6" fill="#06b6d4" /> {/* Vértice */}
                
                {/* Raízes (Se houver) */}
                {temRaizes && (
                  <>
                    <circle cx={x1!} cy="0" r="0.5" fill="#f59e0b" />
                    <circle cx={x2!} cy="0" r="0.5" fill="#f59e0b" />
                  </>
                )}
              </svg>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1 rounded">● Vértice</div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-400 bg-black/70 px-1 rounded">● Ponto C (Eixo Y)</div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 03: A DECONSTRUÇÃO DE BHASKARA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Bhaskara Desmistificada: O Vértice e as Asas de Simetria
          </h2>
        </div>

        <p>
          As escolas ensinam a decorar a fórmula de Bhaskara como um bloco único assustador: <code className="text-cyan-300 font-mono">x = (-b ± √Δ) / 2a</code>.
        </p>
        <p className="text-neutral-300">
          Mas se você quebrar a fórmula no meio, você descobre a coisa mais linda da simetria visual geométrica:
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm my-6 text-center space-y-4">
          <div className="text-2xl md:text-3xl font-mono text-white tracking-wider">
            x = <span className="text-cyan-400 font-bold">(-b / 2a)</span> ± <span className="text-emerald-400 font-bold">(√Δ / 2a)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2 max-w-2xl mx-auto text-left">
            <div className="p-4 bg-black border border-neutral-800 rounded shadow-md">
              <span className="text-cyan-400 block font-bold mb-1">Parte 1: A Espinha Dorsal (X do Vértice)</span>
              A conta <strong>-b / 2a</strong> não é aleatória! Ela calcula a localização exata da linha tracejada que divide a parábola no meio.
            </div>
            <div className="p-4 bg-black border border-neutral-800 rounded shadow-md">
              <span className="text-emerald-400 block font-bold mb-1">Parte 2: A Distância dos Passos (Desvio)</span>
              A conta <strong>√Δ / 2a</strong> é a distância. Você fica no Eixo Central e dá esse passo para a frente (+) e para trás (-) para pisar nas duas raízes.
            </div>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: A OTIMIZAÇÃO (O VÉRTICE DOS NEGÓCIOS) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Otimização: Por Que o Vértice Comanda a Economia?
          </h2>
        </div>

        <p>
          Na vida real, faturamento (lucro bruto) é uma multiplicação de duas coisas que se odeiam: <strong>Preço × Quantidade</strong>. Se você cobra muito caro, a quantidade despenca. Se você cobra muito barato, a margem de lucro some.
        </p>

        {/* SIMULADOR INTERATIVO: MÁQUINA DE PRECIFICAÇÃO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador de Vértice Econômico
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Ingresso Base = R$ 50 (Público de 100). Cada R$ 1 de desconto traz +10 pessoas extras:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Desconto Oferecido:</span>
              <input
                type="range" min="0" max="30" step="1"
                value={descontoReais}
                onChange={(e) => setDescontoReais(parseInt(e.target.value))}
                className="w-24 accent-emerald-400 cursor-pointer"
              />
              <span className="font-mono text-emerald-400 font-bold w-12 text-center">R$ {descontoReais}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center pt-2">
            <div className="border border-neutral-800 bg-black p-4 rounded shadow">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Preço Final (P)</span>
              <div className="text-2xl font-mono text-white font-bold">R$ {precoIngresso}</div>
            </div>

            <div className="border border-neutral-800 bg-black p-4 rounded shadow">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Público Total (Q)</span>
              <div className="text-2xl font-mono text-white font-bold">{publicoPresente} un</div>
            </div>

            <div className={`border p-4 rounded transition-all duration-300 shadow ${
              faturamentoTotal === 9000 // O vértice ocorre em Desconto=20 (Preço 30 x Público 300)
                ? 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'border-neutral-800 bg-[#0a0a0a]'
            }`}>
              <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Faturamento (P × Q)</span>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                R$ {faturamentoTotal.toLocaleString('pt-BR')}
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                {faturamentoTotal === 9000 ? '⭐ TOPO DA PARÁBOLA!' : 'Mova o desconto para o Ponto Ideal'}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-neutral-400 leading-relaxed font-light text-center max-w-xl mx-auto pt-2">
            O faturamento forma uma Parábola Perfeita (<code className="text-cyan-400">y = -10x² + 400x + 5000</code>). Deslize até dar R$ 20 de desconto. O preço cai para R$ 30, o público sobre para 300 pessoas e o faturamento crava <strong>R$ 9.000,00 (O Y do Vértice)!</strong> Descontos maiores destroem seu lucro (a parábola começa a descer).
          </p>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine o Vértice
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas milimetradas para desenhar a concavidade e o eixo de simetria (-b/2a) antes de responder!
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
                        {acertou ? 'Belo raciocínio otimizado!' : 'Cuidado com a posição do Vértice! Veja a explicação:'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 08:</p>
        <p className="leading-relaxed">
          A parábola deixou de ser um pesadelo desenhado no quadro negro e se tornou a principal aliada de empresas e físicos. Entender que o Vértice (-b/2a) governa o Ponto de Lucro Máximo e divide a fórmula de Bhaskara perfeitamente ao meio muda completamente a forma como você enxerga problemas complexos. No próximo caderno (<strong>Doc 09: Funções Exponenciais e Logaritmos</strong>), o crescimento deixará de ser polinomial e assumirá o formato de epidemias virais e juros avassaladores. 
        </p>
      </footer>

    </article>
  );
}