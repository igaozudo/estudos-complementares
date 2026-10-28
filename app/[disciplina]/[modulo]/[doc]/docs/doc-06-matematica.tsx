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
            ✏️ Gráficos e Diagramas
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Regras
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
              Esboce a reta vertical ou os domínios no plano
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Teste os valores de entrada (x), calcule a saída f(x) ou anote as restrições..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 06 - TEORIA GERAL DAS FUNÇÕES
// =========================================================================
export default function Doc06Matematica() {
  // Simulador 1: A Máquina que Desenha o Gráfico
  const [inputX, setInputX] = useState<number>(0);
  const [regraAtiva, setRegraAtiva] = useState<'dobro_mais_um' | 'quadrado_menos_quatro'>('dobro_mais_um');
  const [historicoPontos, setHistoricoPontos] = useState<{x: number, y: number}[]>([]);

  const calcularMaquina = (x: number) => {
    if (regraAtiva === 'dobro_mais_um') return { expressao: '2x + 1', y: 2 * x + 1 };
    return { expressao: 'x² - 4', y: x * x - 4 };
  };

  const resultadoAtual = calcularMaquina(inputX);

  // Limpa o rastro ao trocar de função
  useEffect(() => {
    setHistoricoPontos([]);
    setInputX(0);
  }, [regraAtiva]);

  // Registra o ponto carimbado
  const carimbarPonto = () => {
    setHistoricoPontos(prev => {
      const existe = prev.find(p => p.x === inputX);
      if (existe) return prev;
      return [...prev, { x: inputX, y: resultadoAtual.y }];
    });
  };

  // Simulador 2: A Máquina de Vendas (É Função ou Não?)
  const [cenarioBotao, setCenarioBotao] = useState<'normal' | 'quebrada' | 'vazia'>('normal');

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
      tema: 'A Máquina e a Reta Vertical',
      pergunta: 'Você tem um desenho no plano cartesiano em formato de uma circunferência (um círculo fechado). Se você tentar dizer que esse círculo é o gráfico de uma função y = f(x), o que o "Teste da Reta Vertical" vai revelar e o que isso significa fisicamente?',
      opcoes: [
        { idx: 0, texto: 'A) O círculo é uma função perfeita e a reta vertical cruza apenas no centro.', correta: false },
        { idx: 1, texto: 'B) A reta vertical cruzará o círculo em dois pontos diferentes. Fisicamente, significa que a "máquina" recebeu uma única entrada (x) e devolveu duas saídas (y) diferentes simultaneamente, quebrando a regra máxima da função.', correta: true },
        { idx: 2, texto: 'C) A reta vertical corta o gráfico em um ponto só, tornando a relação bijetora.', correta: false },
        { idx: 3, texto: 'D) Significa que o contradomínio é infinito.', correta: false },
      ],
      explicacao: [
        'A união brilhante entre a Máquina e o Mapa Cartesiano:',
        '1. Lembre-se: O Eixo Horizontal (X) é o botão que você aperta. O Eixo Vertical (Y) é o produto que cai da máquina.',
        '2. O que é traçar uma linha Reta Vertical no gráfico? É "cravar" a sua escolha em um único valor de X.',
        '3. Se essa linha vertical corta o desenho do círculo em DOIS lugares (um lá em cima e um lá embaixo), significa que, para aquele X específico, o gráfico tem dois Ys diferentes.',
        '4. Conclusão da Máquina de Refri: Você apertou UM botão (X) e a máquina cuspiu DOIS produtos diferentes (Ys) de uma vez. A máquina está maluca! Não é função. Alternativa B correta.',
      ],
    },
    {
      id: 2,
      tema: 'Definição de Função (Os Dois Pecados Capitais)',
      pergunta: 'Na linguagem dos conjuntos (Diagrama de Flechas), uma relação de A para B SÓ é aceita como Função se ela não cometer dois pecados matemáticos inegociáveis. Quais são eles?',
      opcoes: [
        { idx: 0, texto: 'A) Sobrar elementos no conjunto B (Contradomínio) e ter flechas cruzadas.', correta: false },
        { idx: 1, texto: 'B) Um elemento de A atirar mais de uma flecha (traição) OU um elemento de A não atirar flecha nenhuma (abandono).', correta: true },
        { idx: 2, texto: 'C) Dois elementos de A acertarem o mesmo alvo em B (função constante).', correta: false },
        { idx: 3, texto: 'D) O Conjunto Imagem ser menor que o Conjunto Domínio.', correta: false },
      ],
      explicacao: [
        'O detector de funções no Diagrama de Flechas (Conjunto de Partida A e Chegada B):',
        '• O Conjunto A é o seu controle remoto (os botões). Todo botão TEM a obrigação de fazer alguma coisa. Se sobrar um número em A sem disparar flecha, a máquina tem um "Botão Morto". Pecado do Abandono (quebra do Domínio).',
        '• O botão não pode ter curto-circuito. Se o número "2" em A disparar duas flechas (uma pro 5 e outra pro 8), ele vira um botão esquizofrênico. Pecado da Traição (quebra da Univocidade).',
        '• Atenção: Dois números diferentes de A podem acertar o MESMO número em B? SIM! É como duas pessoas diferentes comprarem o mesmo refrigerante. Isso não é pecado.',
        'Alternativa B identifica perfeitamente as duas únicas coisas proibidas!',
      ],
    },
    {
      id: 3,
      tema: 'Cálculo de Domínio (O Filtro de Segurança)',
      pergunta: 'Ao plugar a máquina na tomada, você se depara com a regra de processamento f(x) = 5 / √(x - 3). Como engenheiro da máquina, qual é o Domínio (o filtro de valores válidos de X) que você precisa configurar para que o processador não exploda?',
      opcoes: [
        { idx: 0, texto: 'A) x ≥ 3', correta: false },
        { idx: 1, texto: 'B) x ≠ 3', correta: false },
        { idx: 2, texto: 'C) x > 3', correta: true },
        { idx: 3, texto: 'D) Qualquer número real serve.', correta: false },
      ],
      explicacao: [
        'A Álgebra tem duas grandes "explosões no motor" que o Domínio precisa evitar:',
        '1. Proibição da Raiz Par: O que está dentro de uma raiz quadrada NUNCA pode ser negativo. Portanto, (x - 3) tem que ser maior ou igual a zero.',
        '2. Proibição da Divisão por Zero: Como essa raiz inteira está no "porão" (denominador) de uma fração, ela também está proibida de ser igual a zero! A divisão por zero rasga o tecido do espaço-tempo.',
        '3. Unindo as duas leis: O (x - 3) não pode ser negativo E não pode ser zero. Sobra apenas uma opção: ele precisa ser ESTRITAMENTE MAIOR que zero.',
        'x - 3 > 0  →  x > 3. Alternativa C é a única configuração de segurança correta!',
      ],
    },
    {
      id: 4,
      tema: 'Injetora, Sobrejetora e Bijetora',
      pergunta: 'Se uma função f: R → R faz com que TODO elemento do Contradomínio receba flechas (nenhum alvo fica sobrando) E garante que nenhum alvo seja acertado duas vezes, qual é a classificação exata dessa função e o que ela permite criar?',
      opcoes: [
        { idx: 0, texto: 'A) Ela é Constante, permitindo criar retas paralelas.', correta: false },
        { idx: 1, texto: 'B) Ela é Sobrejetora apenas.', correta: false },
        { idx: 2, texto: 'C) Ela é Bijetora (o "Casamento Perfeito"), o que garante matematicamente a existência da sua Função Inversa (f⁻¹).', correta: true },
        { idx: 3, texto: 'D) Ela é Modular, garantindo rebatimentos de simetria.', correta: false },
      ],
      explicacao: [
        'O Clube dos Arqueiros e dos Alvos:',
        '• INJETORA: Ninguém atira no mesmo alvo que o colega. (Cada Y tem apenas um X).',
        '• SOBREJETORA: Nenhum alvo fica sobrando limpo no muro. (O Conjunto Imagem engole todo o Contradomínio).',
        '• BIJETORA: É a junção de Injetora + Sobrejetora. É a monogamia matemática absoluta: cada X tem seu Y, cada Y tem seu X, e não sobra ninguém solteiro em nenhum dos conjuntos.',
        'O grande poder da Função Bijetora é que, como a correspondência é perfeita de 1 para 1, nós podemos ENGATAR A MARCHA RÉ na máquina. O eixo Y vira a entrada e o eixo X vira a saída. Isso é a criação da Função Inversa (f⁻¹)! Alternativa C.',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO COM AVISO DA PONTE EPISTEMOLÓGICA */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 06 • Módulo 2: Álgebra e Modelagem
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Teoria Geral das Funções: <br />
          <span className="text-cyan-400 font-light">Como a Álgebra Aprendeu a Desenhar</span>
        </h1>
        
        {/* O MANIFESTO: A PONTE ÁLGEBRA-GEOMETRIA */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Epifania: A Equação Deixa de ser Morta
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            No Doc 05, você conheceu o mapa do tesouro (o Plano Cartesiano). Agora, nós vamos ligar a máquina que desenha as rotas automaticamente nesse mapa: <strong>A Função</strong>.
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>• A Função não é uma equação estática. É uma <strong>máquina de transformação em tempo real</strong>.</li>
            <li>• Quando a máquina suga um número <code className="text-cyan-300 font-bold">X</code> (na entrada) e devolve um número <code className="text-emerald-400 font-bold">Y</code> (na saída), ela cria um <strong>Par Ordenado (X, Y)</strong>.</li>
            <li>• O gráfico de uma função nada mais é do que <strong>o rastro de tinta</strong> (a nuvem de pontos) deixada por essa máquina no papel milimetrado.</li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O NASCIMENTO DO GRÁFICO (O SIMULADOR) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Máquina em Funcionamento: Imprimindo o Gráfico
          </h2>
        </div>

        <p>
          Pare de olhar para <code className="text-cyan-300 font-mono font-bold">f(x)</code> como se fossem letras místicas. A letra "f" é apenas o chassi metálico da máquina. 
        </p>

        {/* SIMULADOR INTERATIVO: A MÁQUINA DE IMPRESSÃO 3D */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Impressora Cartesiana em Tempo Real
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Jogue um valor de Entrada (X), veja a engrenagem girar e o Ponto (X, Y) ser carimbado no mapa!
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRegraAtiva('dobro_mais_um')}
                className={`px-3 py-1.5 font-mono text-xs rounded transition-all border ${
                  regraAtiva === 'dobro_mais_um'
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                Máquina A: f(x) = 2x + 1
              </button>
              <button
                onClick={() => setRegraAtiva('quadrado_menos_quatro')}
                className={`px-3 py-1.5 font-mono text-xs rounded transition-all border ${
                  regraAtiva === 'quadrado_menos_quatro'
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                Máquina B: f(x) = x² - 4
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
            
            {/* O Motor Lógico */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-black border border-neutral-800 p-4 rounded relative">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Entrada (X)</span>
                  <input
                    type="range"
                    min="-4" max="4" step="1"
                    value={inputX}
                    onChange={(e) => setInputX(parseInt(e.target.value))}
                    className="w-24 accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-xl font-mono text-white font-bold">{inputX}</div>
                </div>
                
                <div className="text-xl text-neutral-600">→</div>

                <div className="flex-1 text-center bg-cyan-950/20 border border-cyan-900/50 p-3 rounded">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">Processador</span>
                  <div className="text-sm font-mono text-cyan-300">
                    {resultadoAtual.expressao.replace('x', `(${inputX})`)}
                  </div>
                </div>

                <div className="text-xl text-neutral-600">→</div>

                <div className="text-center">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Saída (Y)</span>
                  <div className="text-2xl font-mono text-emerald-400 font-bold">{resultadoAtual.y}</div>
                </div>
              </div>
              
              <button 
                onClick={carimbarPonto}
                className="w-full py-3 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 hover:border-cyan-500 text-white font-mono text-xs uppercase tracking-wider rounded transition-all active:scale-95"
              >
                Carimbar Coordenada ({inputX}, {resultadoAtual.y}) no Gráfico
              </button>

              <p className="text-[11px] text-neutral-400 font-mono">
                Pontos Carimbados: {historicoPontos.length > 0 ? historicoPontos.map(p => `(${p.x},${p.y})`).join(' | ') : 'Nenhum'}
              </p>
            </div>

            {/* O Gráfico Visual (CSS Cartesian Plane) */}
            <div className="relative bg-[#0d0d0d] h-[250px] w-full rounded border border-neutral-800 overflow-hidden shadow-inner"
                 style={{
                   backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                   backgroundSize: '25px 25px', backgroundPosition: 'center center'
                 }}>
              
              {/* Eixos X e Y Centrais */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-500/50 -translate-y-1/2"></div>
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-neutral-500/50 -translate-x-1/2"></div>
              
              {/* Ponto Atual Orbitando (Fantasma) */}
              <div className="absolute w-3 h-3 rounded-full border-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
                   style={{ 
                     left: `${50 + (inputX * 10)}%`, 
                     /* Cálculo de Top: (y ranges roughly -15 to +15). 50% is 0. 1 Y unit = 3% */
                     top: `${50 - (resultadoAtual.y * 3)}%`
                   }}>
              </div>

              {/* Rastro dos Pontos Carimbados */}
              {historicoPontos.map((p, idx) => (
                <div key={idx} className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] -translate-x-1/2 -translate-y-1/2 z-10 animate-fadeIn"
                     style={{ 
                       left: `${50 + (p.x * 10)}%`, 
                       top: `${50 - (p.y * 3)}%`
                     }}>
                </div>
              ))}
            </div>

          </div>

          <p className="text-xs text-neutral-400 leading-relaxed font-light text-center max-w-xl mx-auto pt-2">
            Mova o gatilho <strong>X</strong> de -4 até +4 e clique em "Carimbar". Você verá os pontos de luz formarem uma linha reta na Máquina A e uma curva parabólica na Máquina B. <strong>Um gráfico é a pegada digital de uma equação.</strong>
          </p>
        </div>
      </section>

      {/* 3. PILAR 02: A LEI DE OURO (A MÁQUINA DE VENDAS) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Por que o Círculo não é Função? A Máquina de Vendas
          </h2>
        </div>

        <p>
          Nos livros, a regra é fria: <em>"Dados conjuntos A e B, uma função mapeia todo elemento de A a um único elemento em B"</em>. No gráfico, eles chamam isso de <strong>Teste da Reta Vertical</strong>.
        </p>

        <p className="text-neutral-300">
          Entenda a lógica física usando uma <strong>máquina de venda de refrigerante</strong> (onde o Eixo X é o botão que você aperta, e o Eixo Y é o produto que cai). Se você traça uma linha vertical no gráfico, você está cravando o dedo em UM único botão (X).
        </p>

        {/* SIMULADOR INTERATIVO: MÁQUINA DE VENDAS E A RETA VERTICAL */}
        <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-6 my-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCenarioBotao('normal')}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${
                cenarioBotao === 'normal'
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400'
              }`}
            >
              Exemplo 1: Gráfico de Reta / Parábola
            </button>
            <button
              onClick={() => setCenarioBotao('quebrada')}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${
                cenarioBotao === 'quebrada'
                  ? 'border-red-500 bg-red-950/40 text-red-200 font-bold'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400'
              }`}
            >
              Exemplo 2: Gráfico de Círculo
            </button>
          </div>

          <div className="p-6 bg-black border border-neutral-800 rounded flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <span className="text-xs font-mono text-neutral-500 uppercase block">Tradução do Teste da Reta Vertical:</span>
              {cenarioBotao === 'normal' && (
                <div className="space-y-2">
                  <div className="text-emerald-400 font-mono font-bold text-lg">É FUNÇÃO LEGÍTIMA! ✓</div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    Você traça uma linha reta vertical e ela corta o desenho em <strong>UM único lugar</strong>. Na vida real: Você apertou o botão A e caiu uma única lata de refrigerante. A máquina é confiável.
                  </p>
                </div>
              )}
              {cenarioBotao === 'quebrada' && (
                <div className="space-y-2">
                  <div className="text-red-400 font-mono font-bold text-lg">NÃO É FUNÇÃO! (MÁQUINA QUEBRADA) ✗</div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    Você traça uma linha reta vertical e ela corta a borda do círculo <strong>em DOIS lugares</strong> (em cima e embaixo). Na vida real: Você apertou o botão A uma única vez, a máquina entrou em curto-circuito e cuspiu uma Coca e um Suco ao mesmo tempo. O Universo da Função odeia paradoxos! Um mesmo botão (X) NUNCA pode acionar duas respostas (Y).
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs space-y-1 text-center min-w-[200px]">
              <div className="text-neutral-400">Regra de Ouro:</div>
              <div className="text-white font-bold">1 entrada = 1 única saída</div>
              <div className="text-neutral-500 text-[10px] mt-1">(Linha vertical corta 1 vez)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PILAR 03: DOMÍNIO E IMAGEM (O CASAMENTO) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Domínio, Contradomínio e Imagem
          </h2>
        </div>

        <p>
          A analogia definitiva para nunca mais confundir os papéis dos conjuntos: <strong>A Festa de Casamento</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. Domínio (D)</span>
            <h4 className="text-white font-medium text-base">Os Convidados</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              É o conjunto de partida (Eixo X). São todas as pessoas que têm permissão oficial (filtro de segurança) para entrar na festa e apertar os botões.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">2. Contradomínio (CD)</span>
            <h4 className="text-white font-medium text-base">O Buffet Inteiro</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              É o conjunto de chegada (Eixo Y inteiro). São todos os pratos, doces e bebidas que o restaurante colocou nas mesas (todas as respostas teóricas).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">3. Imagem (Im)</span>
            <h4 className="text-white font-medium text-base">O Que Foi Comido</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              É o subconjunto que recebeu flechas (A altura da linha no gráfico). Se o buffet fez 50 pratos mas os convidados só comeram 10, a Imagem são apenas os 10.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: CLASSIFICAÇÃO SEM DECOREBA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Clube de Arqueiros: Injetora e Sobrejetora
          </h2>
        </div>

        <p>
          Imagine que os elementos do Domínio (X) são <strong>Arqueiros</strong> e os elementos do Contradomínio (Y) são <strong>Alvos</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">Função Injetora</span>
            <h4 className="text-white font-medium text-sm">"Alvo Exclusivo"</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Dois arqueiros diferentes NUNCA acertam o mesmo alvo. Se você atirou no 5, é só seu. (No gráfico: a reta horizontal cruza apenas 1 vez).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">Função Sobrejetora</span>
            <h4 className="text-white font-medium text-sm">"Nenhum Abandonado"</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              TODOS os alvos do muro receberam flechas. (A Imagem = Contradomínio. O gráfico sobe e desce para o infinito cobrindo todo o Eixo Y).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">Função Bijetora</span>
            <h4 className="text-white font-medium text-sm">"Casamento Perfeito"</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              É Injetora E Sobrejetora juntas. Um arqueiro por alvo, nenhum alvo sobrando. <strong>É a única condição que permite rodar a máquina de costas (Função Inversa)!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine as Máquinas e Mapas
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas milimetradas para desenhar a reta vertical ou os diagramas de balão para não cair nas armadilhas!
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
                        {acertou ? 'Visão geométrica e algébrica perfeitas!' : 'Opa, cuidado com os buracos no domínio! Veja a explicação:'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 06:</p>
        <p className="leading-relaxed">
          Você não é mais um digitador de fórmulas. Você agora enxerga <strong>o rastro da engrenagem</strong>. Ao ver o ponto orbitando e formando o desenho na Impressora Cartesiana, toda a teoria de domínio (onde a máquina não quebra) e imagem (quais andares do prédio a tinta encostou) fez sentido absoluto. No próximo caderno (<strong>Doc 07: Funções Afins e Modulares</strong>), colocaremos essas máquinas em movimento contínuo para desenhar tarifas de táxi e espelhos rebatidos!
        </p>
      </footer>

    </article>
  );
}