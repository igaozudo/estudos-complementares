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
    ctx.strokeStyle = '#06b6d4'; // Caneta Ciano
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Plano de Trabalho #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Marcar Pontos e Retas
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Cálculos e Equações
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
          <div className="relative w-full h-56 md:h-72 touch-none overflow-hidden" 
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
            {/* Eixos X e Y Centrais Desenhados com CSS */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-600/60 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 w-[2px] h-full bg-neutral-600/60 -translate-x-1/2 pointer-events-none"></div>
            
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
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
              A tela possui papel milimetrado e Eixos X e Y
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Monte a equação, isole o X (método da cebola) ou iguale as linhas do sistema linear aqui..."
            rows={6}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 05 - EQUAÇÕES, INEQUAÇÕES E SISTEMAS LINEARES
// =========================================================================
export default function Doc05Matematica() {
  // Simulador 1: O Plano Cartesiano (GPS da Matemática)
  const [pontoAtivo, setPontoAtivo] = useState({ x: 3, y: 2 });
  
  // Função para gerar o grid 11x11 de -5 a +5
  const gerarGridCartesiano = () => {
    const celulas = [];
    for (let y = 5; y >= -5; y--) {
      for (let x = -5; x <= 5; x++) {
        const isEixoX = y === 0;
        const isEixoY = x === 0;
        const isAtivo = pontoAtivo.x === x && pontoAtivo.y === y;
        
        let borderClass = 'border-neutral-900';
        if (isEixoX) borderClass = 'border-t-neutral-600 border-b-neutral-900 border-l-neutral-900 border-r-neutral-900';
        if (isEixoY) borderClass = 'border-l-neutral-600 border-b-neutral-900 border-t-neutral-900 border-r-neutral-900';
        if (isEixoX && isEixoY) borderClass = 'border-t-neutral-600 border-l-neutral-600 border-b-neutral-900 border-r-neutral-900';

        celulas.push(
          <div 
            key={`${x},${y}`}
            onClick={() => setPontoAtivo({ x, y })}
            className={`w-6 h-6 sm:w-8 sm:h-8 border flex items-center justify-center cursor-crosshair transition-all hover:bg-neutral-800 ${borderClass} ${isAtivo ? 'bg-cyan-900' : 'bg-black'}`}
          >
            {isAtivo && <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
          </div>
        );
      }
    }
    return celulas;
  };

  // Simulador 2: O Espelho das Inequações
  const [inequacaoEstado, setInequacaoEstado] = useState<'positivo' | 'negativo'>('positivo');

  // Simulador 3: Ponto de Colisão (Sistemas Lineares)
  const [minutosAtivos, setMinutosAtivos] = useState(0);
  const custoPlanoA = 50 + (0.50 * minutosAtivos);
  const custoPlanoB = 20 + (1.25 * minutosAtivos);
  const sistemaResolvido = minutosAtivos === 40;

  // Controle dos Exercícios
  const [selecao, setSelecao] = useState<{ [key: number]: number | null }>({ 1: null, 2: null, 3: null, 4: null });
  const [confirmadas, setConfirmadas] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false, 4: false });
  const [abrirResolucao, setAbrirResolucao] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false, 4: false });
  const [lousaAberta, setLousaAberta] = useState<{ [key: number]: boolean }>({ 1: true, 2: false, 3: true, 4: false });

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
      tema: 'Descascando a Cebola (Equações Básicas)',
      pergunta: 'Ao resolver a equação (3x + 12) / 2 = 15, qual deve ser a ordem correta das operações para "libertar" o X de forma segura, seguindo a lógica da balança?',
      opcoes: [
        { idx: 0, texto: 'A) Passar o 12 diminuindo, passar o 3 dividindo, depois o 2 multiplicando.', correta: false },
        { idx: 1, texto: 'B) Dividir o 3x por 2, depois passar o 12 subtraindo.', correta: false },
        { idx: 2, texto: 'C) Multiplicar os dois pratos da balança por 2, depois subtrair 12, e por fim dividir por 3.', correta: true },
        { idx: 3, texto: 'D) Multiplicar tudo por 3 para anular o X.', correta: false },
      ],
      explicacao: [
        'A regra máxima da Álgebra: Para isolar o X, desfazemos as camadas de fora para dentro (Método da Cebola).',
        '1. A casca mais externa: O bloco inteiro está sendo dividido por 2. Multiplicamos os dois pratos por 2 para quebrar o piso: 3x + 12 = 30.',
        '2. A segunda casca: O 12 está somando livremente. Retiramos 12 kg dos dois pratos: 3x = 30 - 12 → 3x = 18.',
        '3. O núcleo: O 3 está fundido no X (multiplicando). Dividimos o peso total por 3: x = 18 ÷ 3 → x = 6.',
        'Você não moveu números por mágica, você equilibrou pesos! Alternativa C correta.',
      ],
    },
    {
      id: 2,
      tema: 'Coordenadas no Plano Cartesiano',
      pergunta: 'Um jogador de Batalha Naval matemática marcou o ponto de coordenadas P = (-4, 3) no plano. Onde exatamente esse ponto foi parar e em qual bairro (Quadrante) ele está?',
      opcoes: [
        { idx: 0, texto: 'A) Andou 4 passos para a direita, 3 para baixo. Está no 4º Quadrante.', correta: false },
        { idx: 1, texto: 'B) Andou 4 passos de ré (esquerda), subiu 3 andares. Está no 2º Quadrante.', correta: true },
        { idx: 2, texto: 'C) Andou 3 passos para a direita, desceu 4 andares. Está no 3º Quadrante.', correta: false },
        { idx: 3, texto: 'D) Andou 4 passos para a esquerda, desceu 3 andares. Está no 3º Quadrante.', correta: false },
      ],
      explicacao: [
        'Lendo o GPS matemático do ponto (X, Y):',
        '1. O Eixo X (A Rua): O primeiro número é sempre horizontal. Como é -4, andamos 4 passos para TRÁS (esquerda).',
        '2. O Eixo Y (O Elevador): O segundo número é sempre vertical. Como é +3, pegamos o elevador e SUBIMOS 3 andares.',
        '3. Quadrantes: O 1º é a zona dos lucros (+,+). O 2º fica à esquerda e no alto (-,+). O 3º é o buraco das dívidas (-,-). O 4º fica à direita no subsolo (+,-).',
        'O ponto (-4, 3) fica na parte superior esquerda: 2º Quadrante! Alternativa B correta.',
      ],
    },
    {
      id: 3,
      tema: 'Inequações e o Efeito Espelho',
      pergunta: 'Ao resolver a inequação de velocidade -3x > 12, um aluno dividiu ambos os lados por -3 e anotou a resposta final como: x > -4. Por que a resposta dele está errada e o carro dele foi multado?',
      opcoes: [
        { idx: 0, texto: 'A) Porque a divisão de 12 por -3 é +4.', correta: false },
        { idx: 1, texto: 'B) Porque ele não pode dividir uma desigualdade por número ímpar.', correta: false },
        { idx: 2, texto: 'C) Porque ao passar a divisão negativa, a "boca do jacaré" do sinal de maior é obrigada a inverter. O correto é x < -4.', correta: true },
        { idx: 3, texto: 'D) Porque ele deveria ter somado 3 dos dois lados.', correta: false },
      ],
      explicacao: [
        'O erro letal que destrói notas no ENEM (O Efeito Espelho):',
        '1. Se 10 > 5 (Dez é maior que Cinco), ao multiplicarmos o universo por -1, entramos no mundo das dívidas.',
        '2. Dever 10 reais (-10) é PIOR (Menor) do que dever 5 reais (-5). Logo, o sinal vira: -10 < -5.',
        '3. Na conta -3x > 12, ao enviar o número negativo (-3) para dividir o outro lado, a inequação sofreu a maldição do espelho!',
        '4. O sinal (>) tem que virar de costas (<). Resposta exata: x < -4. Alternativa C.',
      ],
    },
    {
      id: 4,
      tema: 'Sistemas Lineares e o Choque de Mundos',
      pergunta: 'Você tem as equações de duas empresas. Empresa A: y = 2x + 10. Empresa B: y = x + 30. Ao resolver esse sistema linear igualando as equações (2x + 10 = x + 30), você descobre que x = 20 e y = 50. O que significa o ponto exato P(20, 50) no Plano Cartesiano?',
      opcoes: [
        { idx: 0, texto: 'A) É o ponto onde a Empresa A atinge o lucro máximo.', correta: false },
        { idx: 1, texto: 'B) É a única coordenada (x,y) do universo onde as linhas do gráfico da Empresa A e da Empresa B se cruzam perfeitamente e colidem.', correta: true },
        { idx: 2, texto: 'C) Indica que a Empresa A cobra mais caro que a B em todos os momentos.', correta: false },
        { idx: 3, texto: 'D) Significa que as duas retas são paralelas e nunca se encontram.', correta: false },
      ],
      explicacao: [
        'Essa é a maior epifania da Álgebra e da Geometria juntas:',
        '• Uma equação como y = 2x + 10 não é apenas uma conta, é uma linha reta infinita desenhada no papel milimetrado.',
        '• A outra equação y = x + 30 é outra reta cortando o espaço.',
        '• Um Sistema Linear não é apenas um truque de calcular X e Y. Ele é a resposta para a pergunta: "Em qual quarteirão e em qual andar essas duas retas batem de frente?"',
        '• O resultado x=20 e y=50 é o Ponto de Intersecção (20, 50). É o momento exato em que os dois planos empatam! Alternativa B perfeita.',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 05 • A Fronteira do Módulo 2
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Equações, Sistemas e o Plano Cartesiano: <br />
          <span className="text-cyan-400 font-light">Como a Matemática Investiga o Desconhecido</span>
        </h1>
        
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            O Pulo do Gato para Aprender Álgebra
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Ninguém aprende a resolver Sistemas Lineares e Funções sem antes entender uma coisa fundamental: <strong>Toda conta algébrica vira um desenho geométrico.</strong> 
          </p>
          <p className="text-sm text-neutral-300 font-light leading-relaxed">
            Se ensinarem a você apenas a isolar letras ("passa pra lá, passa pra cá"), a matemática será um castigo sem sentido. Mas no dia em que você entender que achar o <code className="text-cyan-300 font-bold">X e Y</code> de um sistema linear é, na verdade, <strong>achar o ponto exato no mapa onde dois mísseis batem de frente no ar</strong>, a sua mente vai explodir. E o mapa onde isso tudo acontece tem nome: o Plano Cartesiano.
          </p>
        </div>
      </section>

      {/* 2. PILAR 01: O NASCIMENTO DO PLANO CARTESIANO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Plano Cartesiano: O GPS da Matemática
          </h2>
        </div>

        <p>
          No século XVII, o filósofo René Descartes estava deitado na cama olhando para o teto do quarto quando viu uma mosca. Ele pensou: <em>"Se eu medir a distância da mosca até a parede da esquerda e até a parede de baixo, eu consigo dar a localização exata dela no teto usando apenas dois números!"</em>
        </p>
        
        <p className="text-neutral-400">
          Assim nasceu a maior invenção visual da história, que uniu as contas com os desenhos. Nós usamos o chamado <strong>Par Ordenado (X, Y)</strong>.
        </p>

        {/* SIMULADOR INTERATIVO: BATALHA NAVAL CARTESIANA */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block text-center sm:text-left">
                Simulador GPS Cartesiano
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1 text-center sm:text-left">
                Clique em qualquer quadrado do mapa para descobrir o endereço (X, Y) daquele ponto:
              </p>
            </div>
            <div className="bg-black border border-neutral-700 px-4 py-2 rounded text-center min-w-[140px]">
              <div className="text-xs font-mono text-neutral-500 mb-1 uppercase">Coordenada Atual</div>
              <div className="text-2xl font-mono font-bold text-cyan-400 tracking-wider">
                ({pontoAtivo.x}, {pontoAtivo.y})
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* O Grid (Mapa) */}
            <div className="relative bg-[#0d0d0d] p-4 rounded-lg border border-neutral-800 shadow-2xl">
              <div className="grid grid-cols-11 grid-rows-11 gap-0 bg-neutral-950">
                {gerarGridCartesiano()}
              </div>
              
              {/* Rótulos dos Eixos */}
              <div className="absolute top-2 left-1/2 ml-4 text-[10px] font-mono text-neutral-500 font-bold">Eixo Y (+ Cima)</div>
              <div className="absolute bottom-2 left-1/2 ml-4 text-[10px] font-mono text-neutral-500 font-bold">(- Baixo)</div>
              <div className="absolute top-1/2 right-2 -mt-4 text-[10px] font-mono text-neutral-500 font-bold">Eixo X (+ Direita)</div>
              <div className="absolute top-1/2 left-2 -mt-4 text-[10px] font-mono text-neutral-500 font-bold">(- Esquerda)</div>
            </div>

            {/* Painel Tradutor */}
            <div className="flex-1 w-full space-y-4">
              <div className="p-4 bg-cyan-950/20 border border-cyan-900/50 rounded-sm">
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold block mb-2">Tradução do GPS:</span>
                <p className="text-sm text-neutral-200 leading-relaxed font-light">
                  A coordenada <strong>X (Eixo Horizontal)</strong> manda você andar na rua: <br/>
                  <span className="text-cyan-300">
                    Você caminhou {Math.abs(pontoAtivo.x)} quarteirões para a {pontoAtivo.x >= 0 ? 'Direita' : 'Esquerda'}.
                  </span>
                </p>
                <div className="my-2 border-t border-cyan-900/30"></div>
                <p className="text-sm text-neutral-200 leading-relaxed font-light">
                  A coordenada <strong>Y (Eixo Vertical)</strong> manda você pegar o elevador: <br/>
                  <span className="text-emerald-400">
                    Você pegou o elevador e foi {Math.abs(pontoAtivo.y)} andares para {pontoAtivo.y >= 0 ? 'Cima (Cobertura)' : 'Baixo (Subsolo)'}.
                  </span>
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-neutral-800 rounded-sm">
                <span className="text-xs font-mono text-amber-500 uppercase font-bold block mb-1">Qual é o Quadrante?</span>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  {pontoAtivo.x > 0 && pontoAtivo.y > 0 && "1º Quadrante (O mundo perfeito: Lucro de X e de Y)."}
                  {pontoAtivo.x < 0 && pontoAtivo.y > 0 && "2º Quadrante (Recuou em X, mas subiu em Y)."}
                  {pontoAtivo.x < 0 && pontoAtivo.y < 0 && "3º Quadrante (O fundo do poço: Dívidas em X e em Y)."}
                  {pontoAtivo.x > 0 && pontoAtivo.y < 0 && "4º Quadrante (Avançou em X, mas caiu no buraco em Y)."}
                  {(pontoAtivo.x === 0 || pontoAtivo.y === 0) && "Você está cravado em cima da linha da fronteira (em cima de um dos Eixos)!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PILAR 02: A ANATOMIA DA EQUAÇÃO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Descascando a Cebola: Como Isolar Variáveis
          </h2>
        </div>

        <p>
          Agora que sabemos que $X$ e $Y$ são posições em um mapa, como calculamos essas posições quando elas estão escondidas dentro de uma equação? A equação é uma <strong>balança de pratos perfeitamente equilibrada</strong>.
        </p>

        <p className="text-neutral-400">
          Se você tem <code className="text-white font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-700">2X + 5 = 15</code>, seu objetivo é descobrir o peso da caixa <code className="text-cyan-300 font-bold">X</code>. Você não "muda o número de lado com o sinal trocado". Você usa o <strong>Método da Cebola</strong>: removendo as cascas de fora para dentro dos DOIS lados da balança ao mesmo tempo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-4">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. A Casca Externa (Soma/Subtração)</span>
            <div className="bg-black p-4 border border-neutral-800 font-mono text-sm space-y-2">
              <div className="text-neutral-500 line-through">2X + 5 = 15</div>
              <div className="text-white">2X <span className="text-red-400">- 5</span> = 15 <span className="text-red-400">- 5</span></div>
              <div className="text-cyan-300 font-bold">2X = 10</div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Nós simplesmente <strong>subtraímos 5 kg de ambos os pratos</strong> da balança. Retiramos os chumbos soltos primeiro.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-4">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">2. O Núcleo (Multiplicação/Divisão)</span>
            <div className="bg-black p-4 border border-neutral-800 font-mono text-sm space-y-2">
              <div className="text-neutral-500 line-through">2X = 10</div>
              <div className="text-white">(2X) <span className="text-emerald-400">÷ 2</span> = (10) <span className="text-emerald-400">÷ 2</span></div>
              <div className="text-emerald-300 font-bold">X = 5</div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O 2 estava grudado no X (dobrando a caixa). Nós <strong>cortamos a quantidade dos dois pratos pela metade</strong>. O mistério está resolvido.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PILAR 03: INEQUAÇÕES (O LIMITE DE VELOCIDADE) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Inequações: O Radar e o "Efeito Espelho"
          </h2>
        </div>

        <p>
          Enquanto a Equação ( = ) é uma balança cravada em um único peso, a <strong>Inequação ( {'>'}, {'<'} )</strong> é como o radar de uma rodovia: <em>"Você pode andar em qualquer velocidade que seja MENOR que 80 km/h"</em> ( <code className="text-cyan-300">V {'<'} 80</code> ). Existem infinitas respostas certas (40, 60, 79).
        </p>

        {/* SIMULADOR INTERATIVO: O ESPELHO NEGATIVO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-900">
            <div className="space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador da Maldição do (-1)
              </span>
              <p className="text-sm text-neutral-300 font-light">
                Por que a "boca do jacaré" tem que virar ao dividir por um número negativo?
              </p>
            </div>

            <button
              onClick={() => setInequacaoEstado(prev => prev === 'positivo' ? 'negativo' : 'positivo')}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all border rounded shadow-lg ${
                inequacaoEstado === 'negativo'
                  ? 'border-red-500 bg-red-950/40 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              }`}
            >
              {inequacaoEstado === 'positivo' ? 'Multiplicar Tudo por (-1) 🔄' : 'Voltar ao Normal (× -1) 🔄'}
            </button>
          </div>

          <div className="pt-4 text-center">
            {inequacaoEstado === 'positivo' ? (
              <div className="animate-fadeIn">
                <span className="text-xs font-mono text-cyan-500 block mb-2">MUNDO DO LUCRO (POSITIVO)</span>
                <div className="text-5xl font-mono text-white font-bold tracking-widest mb-6">
                  +100 <span className="text-cyan-400 mx-4">{'>'}</span> +50
                </div>
                <p className="text-sm text-neutral-400 font-light max-w-md mx-auto">
                  No mundo normal, ter 100 reais é ser MAIS rico do que ter 50 reais. O 100 está à direita no eixo da riqueza.
                </p>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <span className="text-xs font-mono text-red-500 block mb-2">MUNDO DA DÍVIDA (NEGATIVO)</span>
                <div className="text-5xl font-mono text-white font-bold tracking-widest mb-6">
                  -100 <span className="text-red-400 mx-4">{'<'}</span> -50
                </div>
                <p className="text-sm text-neutral-400 font-light max-w-md mx-auto">
                  Quando multiplicamos a linha por (-1), nós entramos no mundo das dívidas! Dever 100 reais é ser <strong>PIOR / MENOR</strong> do que dever apenas 50. O sinal de MAIOR foi obrigado a inverter para MENOR!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: SISTEMAS LINEARES COMO COLISÃO DE MUNDOS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Sistemas Lineares: A Colisão de Duas Retas no Mapa
          </h2>
        </div>

        <p>
          Agora juntamos tudo. Lembra do GPS Cartesiano? Uma equação inteira (como <code className="text-cyan-300">Y = 2X + 10</code>) cria um traço longo (uma linha de pontos) cruzando o mapa inteiro.
        </p>

        <p className="text-neutral-300">
          Um Sistema Linear não é apenas um truque de isolar X e Y. <strong>Ele é uma ferramenta para descobrir o quarteirão exato onde as duas linhas das empresas batem de frente no mapa!</strong> (O Ponto de Equilíbrio / Break-even).
        </p>

        {/* SIMULADOR INTERATIVO FINANCEIRO - PONTO DE EQUILIBRIO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-900">
            <div className="space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador: O Choque dos Planos de Celular
              </span>
              <p className="text-xs text-neutral-400 font-light max-w-md mt-2">
                <span className="text-amber-400">Plano A (Linha 1):</span> R$ 50 + R$ 0,50/min. (y = 50 + 0.50x)<br/>
                <span className="text-sky-400">Plano B (Linha 2):</span> R$ 20 + R$ 1,25/min. (y = 20 + 1.25x)
              </p>
            </div>

            <div className="w-full md:w-auto bg-black border border-neutral-800 p-4 rounded text-center min-w-[200px]">
              <label className="text-[10px] font-mono text-white uppercase block mb-3">Você ligou (Eixo X):</label>
              <input 
                type="range" 
                min="0" max="80" step="5"
                value={minutosAtivos} 
                onChange={(e) => setMinutosAtivos(parseInt(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
              <div className="font-mono text-white text-lg font-bold mt-2 bg-neutral-900 py-1 rounded">
                x = {minutosAtivos} minutos
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center pt-2">
            <div className={`p-4 border rounded transition-all duration-500 ${
              custoPlanoA < custoPlanoB ? 'border-emerald-500/50 bg-emerald-950/20' : 
              sistemaResolvido ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 
              'border-neutral-800 bg-[#0a0a0a] opacity-60'
            }`}>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">Conta Plano A (Y)</span>
              <div className="text-2xl font-mono text-white">
                R$ {custoPlanoA.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className={`p-4 border rounded transition-all duration-500 ${
              custoPlanoB < custoPlanoA ? 'border-emerald-500/50 bg-emerald-950/20' : 
              sistemaResolvido ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 
              'border-neutral-800 bg-[#0a0a0a] opacity-60'
            }`}>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-2">Conta Plano B (Y)</span>
              <div className="text-2xl font-mono text-white">
                R$ {custoPlanoB.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center">
            {sistemaResolvido ? (
              <div className="px-6 py-3 bg-cyan-950/50 border border-cyan-500 text-cyan-200 text-sm font-light rounded text-center animate-pulse">
                <strong>COLISÃO DE REALIDADES! (x=40, y=70)</strong><br/>
                No mapa cartesiano, as duas linhas se cruzaram! Aos exatos 40 minutos (X), as duas cobram exatos R$ 70,00 (Y). 
              </div>
            ) : (
              <div className="text-xs text-neutral-500 font-mono text-center">
                {custoPlanoA < custoPlanoB ? '↑ O Plano A é mais barato para quem liga muito.' : '↑ O Plano B é mais barato para quem liga pouco.'} Arraste o controle para achar o ponto de empate.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine o Espaço Cartesiano
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use a nova <strong>Lousa Milimetrada</strong> de cada questão para desenhar os pontos e testar os métodos de substituição e adição.
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
                        {acertou ? 'Visão geométrica impecável!' : 'Atenção às regras de ouro! Veja a explicação:'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 05:</p>
        <p className="leading-relaxed">
          Você não apenas resolveu equações; você abriu os olhos para o tabuleiro do jogo. Entender o Plano Cartesiano como duas ruas se cruzando, ver a inequação girar o mundo de cabeça para baixo e perceber que o sistema linear é uma colisão de veículos no mapa muda tudo. No próximo caderno (<strong>Doc 06: Teoria Geral das Funções</strong>), nós vamos ligar a máquina da fábrica: aprenderemos as regras severas que conectam o Eixo X ao Eixo Y e desenharemos nossas primeiras linhas reais no papel milimetrado!
        </p>
      </footer>

    </article>
  );
}