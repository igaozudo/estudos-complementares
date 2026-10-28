'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO (CANVAS LIVRE + BLOCO DE TEXTO)
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

  const pararDesenho = () => {
    setDesenhando(false);
  };

  const limparLousa = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="border border-neutral-800 bg-[#040404] rounded-sm overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa de Trabalho #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Rabiscar Livre
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Escrever Raciocínio
          </button>
        </div>

        <button
          onClick={modo === 'desenho' ? limparLousa : () => setRascunhoTexto('')}
          className="text-[11px] text-neutral-500 hover:text-red-400 transition-colors uppercase"
        >
          Limpar
        </button>
      </div>

      <div className="relative bg-[#020202]">
        {modo === 'desenho' ? (
          <div className="relative w-full h-44 md:h-56 touch-none">
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
              className="w-full h-full cursor-crosshair block"
            />
            <span className="absolute bottom-2 right-3 text-[10px] font-mono text-neutral-700 pointer-events-none select-none">
              Rabisque suas contas com o mouse ou dedo
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Use este espaço para rascunhar seus passos antes de responder..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 00 - NIVELAMENTO DIRETO E INTUITIVO
// =========================================================================
export default function Doc00Matematica() {
  // Simulador de Saldo (Dívida x Cancelamento de Boleto)
  const [saldo, setSaldo] = useState(100);
  const [historicoAcao, setHistoricoAcao] = useState('Você começou com R$ 100 na conta.');

  const adicionarBoleto = () => {
    setSaldo((prev) => prev - 50);
    setHistoricoAcao('Chegou uma conta de R$ 50 para pagar: você perdeu 50 (-50).');
  };

  const cancelarBoleto = () => {
    setSaldo((prev) => prev + 50);
    setHistoricoAcao('O banco CANCELOU (-) a dívida de R$ 50 (-50). Tirar uma dívida = ganhar saldo (+50)!');
  };

  // Exercícios
  const [selecao, setSelecao] = useState<{ [key: number]: number | null }>({ 1: null, 2: null, 3: null, 4: null });
  const [confirmadas, setConfirmadas] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false, 4: false });
  const [abrirResolucao, setAbrirResolucao] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false, 4: false });
  const [lousaAberta, setLousaAberta] = useState<{ [key: number]: boolean }>({ 1: true, 2: false, 3: false, 4: false });

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
      tema: 'Entendendo o Módulo na Vida Real',
      pergunta: 'Você tira o carro da garagem e anda 40 metros para a frente (+40 m). Depois, você engata a marcha ré e volta 30 metros para trás (-30 m). Se olharmos apenas a DISTÂNCIA TOTAL que o pneu do carro rodou no chão (o módulo |trajeto|), quantos metros o carro percorreu?',
      opcoes: [
        { idx: 0, texto: 'A) 10 metros, pois 40 menos 30 dá 10.', correta: false },
        { idx: 1, texto: 'B) 70 metros, pois o pneu gastou borracha tanto indo para a frente quanto dando ré.', correta: true },
        { idx: 2, texto: 'C) -10 metros, pois ele terminou dando ré.', correta: false },
        { idx: 3, texto: 'D) 0 metros, porque ele voltou em direção à garagem.', correta: false },
      ],
      explicacao: [
        'Essa é a diferença exata entre POSIÇÃO e MÓDULO:',
        '• Se alguém perguntar: "Onde o carro parou em relação à garagem?", a resposta é: a 10 metros de distância (40 - 30 = 10).',
        '• Mas se perguntarem: "Quanto o carro andou de verdade? Quanto combustível gastou?", a resposta é: 40 metros indo + 30 metros voltando = 70 metros!',
        'O odômetro do carro não gira para trás quando você dá ré. É isso que o MÓDULO faz: ele ignora o sinal de menos e soma o esforço real: |40| + |-30| = 40 + 30 = 70 metros. Alternativa B!',
      ],
    },
    {
      id: 2,
      tema: 'A Regra do "Menos com Menos"',
      pergunta: 'Você abre o aplicativo do seu banco e vê que há uma cobrança indevida de R$ 80 (-R$ 80). Você liga para o suporte, o gerente pede desculpas e diz: "Estou estornando (retirando) essa cobrança da sua fatura". Na linguagem da matemática, essa ação equivale a:',
      opcoes: [
        { idx: 0, texto: 'A) Somar uma nova dívida: + (-80) = -80.', correta: false },
        { idx: 1, texto: 'B) Retirar uma dívida: - (-80) = +80 (seu saldo aumentou em R$ 80).', correta: true },
        { idx: 2, texto: 'C) Multiplicar a dívida por zero.', correta: false },
        { idx: 3, texto: 'D) Manter o saldo inalterado.', correta: false },
      ],
      explicacao: [
        'Pense com calma no que aconteceu na conta:',
        '1. A dívida era algo negativo: -80.',
        '2. O gerente usou o botão de RETIRAR (que é a operação de MENOS): - (-80).',
        '3. Quando alguém arranca uma dívida das suas costas, você ficou mais rico ou mais pobre? Ficou R$ 80 mais rico!',
        'Tirar um valor negativo é a mesmíssima coisa que somar saldo positivo. Por isso: - (-80) = +80. Alternativa B!',
      ],
    },
    {
      id: 3,
      tema: 'Multiplicação de Números Menores que 1',
      pergunta: 'Se você tem uma garrafa com 500 ml de suco (meio litro = 0,5 L) e decide beber exatamente a METADE desse conteúdo (0,5 × 0,5), quanto suco você bebeu?',
      opcoes: [
        { idx: 0, texto: 'A) 1 litro inteiro (1,0 L).', correta: false },
        { idx: 1, texto: 'B) 250 ml (0,25 L), porque a metade de meio litro é um quarto de litro.', correta: true },
        { idx: 2, texto: 'C) 500 ml (0,5 L).', correta: false },
        { idx: 3, texto: 'D) 125 ml (0,125 L).', correta: false },
      ],
      explicacao: [
        'Multiplicação com números quebrados é simplesmente pegar uma fatia de outra fatia:',
        '1. Você tinha meio litro (500 ml = 0,5 L).',
        '2. Bebeu a metade disso: qual é a metade de 500 ml? 250 ml.',
        '3. Em litros, 250 ml é 0,25 L (ou 1/4 de litro).',
        'A conta matemática é: 0,5 × 0,5 = 0,25. Multiplicar números menores que 1 diminui o valor porque você está fatiando algo que já era um pedaço! Alternativa B!',
      ],
    },
    {
      id: 4,
      tema: 'A Lógica da Divisão e o Zero',
      pergunta: 'Você tem R$ 10 na carteira. Se você quiser trocar essa nota por moedas de 50 centavos (R$ 0,50), quantas moedas você vai receber? E o que essa conta ensina sobre a divisão?',
      opcoes: [
        { idx: 0, texto: 'A) 5 moedas; porque dividir diminui o número.', correta: false },
        { idx: 1, texto: 'B) 20 moedas; porque cada 1 real precisa de 2 moedas, logo 10 reais precisam de 20 moedas. Dividir por número menor que 1 faz a quantidade aumentar.', correta: true },
        { idx: 2, texto: 'C) 2 moedas; porque 10 vezes 0,5 dá 5.', correta: false },
        { idx: 3, texto: 'D) Nenhuma moeda, pois 10 não divide por número decimal.', correta: false },
      ],
      explicacao: [
        'Essa é a regra prática para nunca mais se enrolar com divisão:',
        '1. A pergunta da divisão 10 ÷ 0,5 é: "Quantas moedas de R$ 0,50 cabem dentro de R$ 10?"',
        '2. Em cada R$ 1 cabem duas moedas de 50 centavos. Em R$ 10, cabem 10 × 2 = 20 moedas!',
        '3. Logo, 10 ÷ 0,5 = 20.',
        'Quando a moeda é pequena, cabem MUITAS moedas no montante total. É por isso que dividir por números pequenos faz o resultado crescer! Alternativa B!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 00 • Nivelamento Fundamental
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          As 4 Operações na Vida Real: <br />
          <span className="text-cyan-400 font-light">O que as contas fazem de verdade</span>
        </h1>
        <p className="text-base md:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl mb-4">
          Esqueça as regras decoradas que te jogaram na escola sem explicar o motivo. Se você quer dominar matemática avançada nos próximos cadernos, você precisa olhar para uma conta e <strong>enxergar a cena física</strong> acontecendo na sua frente.
        </p>
      </section>

      {/* 2. PILAR 01: SOMA, SUBTRAÇÃO E O FAMOSO MÓDULO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Soma, Subtração e o que raios é "Módulo" (|x|)
          </h2>
        </div>

        <p>
          Em vez de pensar em contas abstratas, pense em uma calçada reta. O <strong>Zero</strong> é onde você está parado agora.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-2">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">Somar (+)</span>
            <p className="text-sm text-neutral-300">
              É dar passos <strong>para a frente</strong>. Se você anda 3 passos, você está na marca <strong>+3</strong>.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-2">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold block">Subtrair (−)</span>
            <p className="text-sm text-neutral-300">
              É dar passos <strong>de marcha ré</strong>. Se você der 5 passos para trás a partir do zero, você vai parar na marca <strong>-5</strong>.
            </p>
          </div>
        </div>

        {/* EXPLICAÇÃO CRISTALINA DO MÓDULO */}
        <div className="border border-cyan-900/40 bg-cyan-950/10 p-6 rounded-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h3 className="text-lg font-medium text-white font-mono">
              O que significa MÓDULO (|x|)? A Metáfora da Fita Métrica
            </h3>
          </div>
          
          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            Todo mundo se assusta quando vê duas barras verticais na matemática, como <code className="text-cyan-300 font-mono text-base font-bold">|-5| = 5</code>. Mas isso é a coisa mais simples do mundo.
          </p>

          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            Pegue uma <strong>fita métrica</strong> de pedreiro. Puxe a fita. Existe algum número escrito com sinal de menos na fita métrica? <strong>Não!</strong> A fita métrica só mede comprimento, distância real.
          </p>

          <div className="bg-black/80 border border-neutral-800 p-4 font-mono text-xs md:text-sm text-neutral-300 space-y-2">
            <p>• Se você anda 5 metros para a frente: a fita métrica mede <strong>5 metros</strong>.</p>
            <p>• Se você anda 5 metros de ré (para trás): a fita métrica mede <strong>5 metros</strong> do mesmo jeito!</p>
          </div>

          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-light">
            <strong>Resumo definitivo:</strong> O sinal de menos só serve para dizer a <em>direção</em> (frente ou ré, subida ou descida). Quando você coloca o número dentro das barrinhas de <strong>Módulo (|x|)</strong>, você está dizendo: <em>"Esqueça se foi para a frente ou de ré; me diga apenas o tamanho do caminho na fita métrica!"</em>. Por isso o módulo sempre sai positivo: <code className="text-cyan-300">|-8| = 8</code> e <code className="text-cyan-300">|+8| = 8</code>.
          </p>
        </div>
      </section>

      {/* 3. PILAR 02: MENOS COM MENOS DÁ MAIS (O BOLETO CANCELADO) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Por Que "Menos com Menos Dá Mais"? (O Exemplo do Boleto)
          </h2>
        </div>

        <p>
          Em vez de decoreba, pense na sua conta do banco no aplicativo do celular:
        </p>

        <ul className="space-y-2 text-sm text-neutral-300 font-light pl-4 border-l border-neutral-800">
          <li>• <strong>Ter dinheiro no banco:</strong> É algo positivo (+).</li>
          <li>• <strong>Receber uma conta/dívida para pagar:</strong> É algo negativo (−).</li>
        </ul>

        {/* Simulador Interativo do Boleto */}
        <div className="border border-neutral-800 bg-[#060606] p-6 rounded-sm space-y-5 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Simulador de Saldo</span>
              <div className="text-3xl font-mono font-bold text-white mt-1">
                Saldo Atual: <span className={saldo >= 100 ? 'text-emerald-400' : 'text-amber-400'}>R$ {saldo}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={adicionarBoleto}
                className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-white rounded transition-colors"
              >
                + Adicionar Dívida (−R$ 50)
              </button>
              <button
                onClick={cancelarBoleto}
                className="px-3 py-2 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-700 text-xs font-mono text-cyan-300 rounded transition-colors"
              >
                − Tirar / Cancelar Dívida (−R$ 50)
              </button>
            </div>
          </div>

          <div className="p-4 bg-black border border-neutral-800 font-mono text-xs md:text-sm text-cyan-300">
            {historicoAcao}
          </div>

          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            <strong>O Segredo:</strong> Quando o banco lança uma conta indevida de R$ 50 na sua fatura, isso é <code className="text-white">-50</code>. Quando você liga lá e eles <strong>REMOVEM (−)</strong> essa <strong>DÍVIDA (−50)</strong>, o seu saldo sobe R$ 50 na hora!
            <br />
            Retirar uma dívida é exatamente o mesmo que ganhar dinheiro: <code className="text-white font-bold">− (−50) = +50</code>.
          </p>
        </div>
      </section>

      {/* 4. PILAR 03: MULTIPLICAÇÃO SEM BUG */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Multiplicação: Por Que Multiplicar Frações Diminui o Valor?
          </h2>
        </div>

        <p>
          A escola nos ensina: <em>"Multiplicar é somar o mesmo número várias vezes: 3 × 4 é 4 + 4 + 4 = 12"</em>. Isso é verdade com números inteiros[cite: 6]. Mas aí você cresce e vê esta conta:
        </p>

        <div className="p-4 bg-neutral-950 border border-neutral-800 font-mono text-sm text-cyan-300 text-center my-4">
          Quanto é 0,5 × 0,5?
        </div>

        <p className="text-neutral-300 font-light">
          Como você soma 0,5 "meia vez"? Não dá! Porque a multiplicação na vida real não é soma repetida; <strong>multiplicação é o cálculo de uma ÁREA</strong> ou uma <strong>FATIA DE OUTRA FATIA</strong>[cite: 6]:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. A Tabuada do Dinheiro</span>
            <p className="text-sm text-neutral-300">
              Pense em moedas: 0,5 é <strong>50 centavos</strong>.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Quanto é a <strong>METADE (0,5)</strong> de <strong>50 centavos (0,5)</strong>? É exatamente <strong>25 centavos (0,25)</strong>!
              <br /><br />
              Portanto: <code className="text-cyan-300 font-bold">0,5 × 0,5 = 0,25</code>.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">2. A Barra de Chocolate</span>
            <p className="text-sm text-neutral-300">
              Imagine uma barra quadrada inteira.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Corte a barra na metade da largura (1/2). Depois corte na metade da altura (1/2)[cite: 6]. O quadradinho que você pegou na mão é 1 pedaço de 4 possíveis (1/4 da barra)[cite: 6]!
              <br /><br />
              Portanto: <code className="text-sky-300 font-bold">(1/2) × (1/2) = 1/4</code>.
            </p>
          </div>
        </div>

        <div className="p-4 border border-neutral-800 bg-neutral-950 text-xs md:text-sm text-neutral-400">
          <strong className="text-white block font-mono uppercase text-xs mb-1">
            Ponte para o Ensino Médio: A Ordem dos Fatores Altera o Produto?
          </strong>
          Chamavam isso de <em>Propriedade Comutativa</em> (A × B = B × A)[cite: 6]. O motivo é simples: se você tem um piso de cerâmica de <strong>3 metros de largura por 4 metros de comprimento</strong>, a área é de 12 m²[cite: 6]. Se você olhar para o piso pelo outro lado da sala (4 de largura por 3 de comprimento), a área continua sendo 12 m²[cite: 6]! Girar a folha não muda o tamanho dela[cite: 6].
        </div>
      </section>

      {/* 5. PILAR 04: A DIVISÃO E POR QUE O ZERO É PROIBIDO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Divisão: "Quantas Moedas Precisamos?" e o Buraco Negro do Zero
          </h2>
        </div>

        <p>
          Toda vez que você vir uma conta de divisão, faça a seguinte pergunta em voz alta[cite: 7]:
        </p>

        <div className="p-4 bg-neutral-900 border-l-4 border-cyan-400 text-white font-mono text-sm">
          A conta "10 ÷ B" pergunta: "Quantas moedas de valor B eu preciso juntar para pagar R$ 10?"
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. Por que dividir por 0,5 faz o número DOBRAR?</span>
            <div className="text-2xl font-mono text-white">10 ÷ 0,5 = 20</div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Quantas moedas de 50 centavos (R$ 0,50) você precisa para ter R$ 10[cite: 7]?
              Como cada real precisa de 2 moedas, você precisa de <strong>20 moedas</strong>[cite: 7]!
              Dividir por números menores que 1 faz o resultado aumentar porque a moeda é miúda, então você precisa de um monte delas[cite: 7].
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-red-400 font-mono text-xs uppercase font-bold block">2. Por que é PROIBIDO dividir por zero?</span>
            <div className="text-2xl font-mono text-white">10 ÷ 0 = IMPOSSÍVEL</div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Quantas moedas de 0 centavos você precisa para pagar uma conta de R$ 10[cite: 7]?
              Se você juntar 10 moedas de zero, você tem R$ 0[cite: 7]. Se juntar 1 milhão de moedas de zero, você continua com R$ 0[cite: 7]! Você NUNCA vai pagar a conta de 10 reais.
            </p>
          </div>
        </div>

        <div className="p-5 border border-amber-900/40 bg-amber-950/10 rounded-sm text-xs md:text-sm text-neutral-300 space-y-2">
          <strong className="text-amber-400 font-mono uppercase block text-xs">
            Ponte para a Faculdade: O que é "Indeterminação" (0 ÷ 0)?
          </strong>
          <p className="font-light leading-relaxed">
            • <strong>10 ÷ 0 é IMPOSSÍVEL:</strong> Não existe nenhum número que multiplicado por zero resulte em 10[cite: 7]. A conta não tem resposta[cite: 7].
            <br />
            • <strong>0 ÷ 0 é uma INDETERMINAÇÃO:</strong> Se você tem uma dívida de 0 reais e quer pagar com moedas de 0 centavos, quantas moedas servem? 1 moeda serve (1 × 0 = 0), 5 moedas servem (5 × 0 = 0), 1000 moedas servem[cite: 7]! Qualquer resposta serve[cite: 7]. Como tem infinitas respostas possíveis, o resultado fica indeterminado[cite: 7]. É por isso que no primeiro semestre da faculdade existe uma matéria chamada <strong>Cálculo 1 (Limites)</strong> só para desempatar esse jogo[cite: 7]!
          </p>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Hora de Praticar</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Rabisque na Lousa e Responda
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Não tente adivinhar rápido. Abra a lousa de cada questão, rabisque com a caneta ou faça anotações, escolha sua opção e valide.
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

                {/* Lousa Integrada */}
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
                        {acertou ? 'Você pegou o espírito da coisa!' : 'Não desanime! Leia a explicação mastigada abaixo:'}
                      </span>
                    )}
                  </div>

                  {confirmou && (
                    <button
                      onClick={() => setAbrirResolucao((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs font-mono tracking-wider uppercase text-neutral-400 hover:text-white transition-colors"
                    >
                      {resolucaoVisivel ? '▲ Fechar Explicação' : '▼ Ver Explicação Sem Enrolação'}
                    </button>
                  )}
                </div>

                {/* Explicação Mastigada */}
                {confirmou && resolucaoVisivel && (
                  <div className="p-5 border border-neutral-800 bg-[#040404] text-xs md:text-sm text-neutral-300 font-light space-y-2 leading-relaxed border-l-2 border-l-cyan-400">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-bold mb-1">
                      O Sentido Real do Problema:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Nivelamento:</p>
        <p className="leading-relaxed">
          Agora as contas fazem sentido na sua cabeça. Você sabe que somar e subtrair é andar na calçada, que o módulo é a fita métrica que mede a distância real, que multiplicar frações é pegar pedaços de moedas e que dividir por zero é impossível. Com essa base intuitiva clara, avançar para o <strong>Doc 01</strong> será um processo direto e descomplicado.
        </p>
      </footer>

    </article>
  );
}