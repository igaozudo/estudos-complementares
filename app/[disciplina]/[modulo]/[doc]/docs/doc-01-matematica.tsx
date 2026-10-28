'use client';

import { useState, useRef, useEffect } from 'react';

// =========================================================================
// LOUSA DE RASCUNHO (CANVAS TOUCH/MOUSE + BLOCO DE NOTAS)
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
            ✏️ Rabiscar / Círculos de Venn
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotações em Texto
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
              Desenhe os círculos de conjuntos e teste as hipóteses livremente
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Monte sua tabela-verdade ou separe os grupos em texto antes de confirmar a alternativa..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 01 - CONJUNTOS NUMÉRICOS E LÓGICA MATEMÁTICA
// =========================================================================
export default function Doc01Matematica() {
  // Simulador de Filtros de Conjuntos
  const [filtroAtivo, setFiltroAtivo] = useState<'interseccao' | 'uniao' | 'diferenca'>('interseccao');

  // Teste de Wason
  const [cartasViradas, setCartasViradas] = useState<{ [key: string]: boolean }>({
    A: false,
    B: false,
    '4': false,
    '7': false,
  });

  const toggleCarta = (id: string) => {
    setCartasViradas((prev) => ({ ...prev, [id]: !prev[id] }));
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
      tema: 'Pertinência (∈) versus Inclusão (⊂)',
      pergunta: 'Você organiza uma caixa A de ferramentas. Dentro dela há duas coisas soltas: uma chave de fenda (fenda) e um estojo lacrado contendo dois parafusos ({p1, p2}). Matematicamente: A = { fenda, {p1, p2} }. Qual afirmação abaixo é 100% CORRETA?',
      opcoes: [
        { idx: 0, texto: 'A) O parafuso p1 pertence diretamente à caixa A (p1 ∈ A).', correta: false },
        { idx: 1, texto: 'B) O estojo lacrado pertence à caixa A ({p1, p2} ∈ A).', correta: true },
        { idx: 2, texto: 'C) A chave de fenda é um subconjunto da caixa A (fenda ⊂ A).', correta: false },
        { idx: 3, texto: 'D) A caixa A possui 3 elementos.', correta: false },
      ],
      explicacao: [
        'Essa pegadinha derruba 90% dos vestibulandos e alunos de primeiro ano!',
        '1. Conte os elementos: Abra a caixa A. O que você pega com a mão? A chave de fenda e o estojo fechado. São apenas 2 itens.',
        '2. O parafuso p1 NÃO está solto na caixa A; ele está preso dentro do estojo. Logo, p1 NÃO pertence a A (p1 ∉ A).',
        '3. O estojo como um bloco único pertence à caixa A: {p1, p2} ∈ A. Alternativa B correta!',
        '4. Um objeto solto nunca "está contido" (⊂); objetos "pertencem" (∈). Para estar contido, ele precisaria ser uma caixa com chaves: {fenda} ⊂ A.',
      ],
    },
    {
      id: 2,
      tema: 'A Fronteira dos Conjuntos Numéricos',
      pergunta: 'Se pegarmos o número 0,333... (uma dízima periódica infinita) e multiplicarmos pelo número √2 (uma dízima infinita que nunca se repete, irracional), o resultado será:',
      opcoes: [
        { idx: 0, texto: 'A) Um número Inteiro (Z), pois as dízimas se cancelam.', correta: false },
        { idx: 1, texto: 'B) Um número Racional (Q), pois pode ser escrito como fração pura.', correta: false },
        { idx: 2, texto: 'C) Um número Irracional (I), pois é a divisão de um irracional por um número inteiro.', correta: true },
        { idx: 3, texto: 'D) Um número impossível de ser localizado na reta real.', correta: false },
      ],
      explicacao: [
        'Vamos dissecar cada parte sem decoreba:',
        '1. O número 0,333... parece esquisito, mas é uma fração limpa: 1/3 (ele é RACIONAL).',
        '2. O número √2 é IRRACIONAL puro (1,4142135... sem nenhum padrão repetitivo).',
        '3. A conta é: (1/3) × √2 = (√2) / 3.',
        '4. Pegar um número que tem infinitas casas desordenadas e dividir por 3 não cria ordem mágica nele; ele continua infinito e sem padrão! Portanto, o resultado permanece IRRACIONAL (I). Alternativa C!',
      ],
    },
    {
      id: 3,
      tema: 'Lógica Proposicional: A Promessa Condicional',
      pergunta: 'Uma empresa de tecnologia coloca uma regra no contrato: "Se o servidor atingir 95% de uso de memória (P), então um alerta vermelho será emitido para a equipe (Q)". Em qual cenário a regra foi DESRESPEITADA (ou seja, a afirmação P → Q foi falsa)?',
      opcoes: [
        { idx: 0, texto: 'A) O servidor bateu 95% de memória, e o alerta vermelho tocou na hora.', correta: false },
        { idx: 1, texto: 'B) O servidor estava em 40% de memória, mas o alerta vermelho tocou por engano.', correta: false },
        { idx: 2, texto: 'C) O servidor bateu 95% de memória, mas o alerta NÃO tocou e ficou em silêncio.', correta: true },
        { idx: 3, texto: 'D) O servidor estava em 50% de memória e o alerta ficou quieto.', correta: false },
      ],
      explicacao: [
        'Lembre-se da metáfora do contrato de promessa:',
        '• A promessa foi: "Se acontecer P, garanto que vai acontecer Q".',
        '• Se o gatilho disparou (bateu 95%) e o sistema falhou em tocar o alerta, o contrato foi quebrado na hora! Esse é o único caso falso da condicional: Verdadeiro levando a Falso (V → F = F).',
        '• E se o servidor estiver calmo (40%) e o alerta tocar mesmo assim? A regra não foi violada! O contrato não dizia que 95% de memória era a ÚNICA razão para tocar um alerta (podia ser um ataque hacker ou pane de disco). F → V continua sendo logicamente verdadeiro! Alternativa C.',
      ],
    },
    {
      id: 4,
      tema: 'Problema Prático de Conjuntos (Estilo ENEM/Vestibular)',
      pergunta: 'Em uma sala com 50 estudantes de computação: 30 gostam de programar em Python, 25 gostam de SQL e 10 gostam de ambas as ferramentas. Quantos estudantes NÃO gostam de nenhuma dessas duas linguagens?',
      opcoes: [
        { idx: 0, texto: 'A) 5 estudantes.', correta: true },
        { idx: 1, texto: 'B) 15 estudantes.', correta: false },
        { idx: 2, texto: 'C) 0 estudantes (todos gostam de ao menos uma).', correta: false },
        { idx: 3, texto: 'D) 10 estudantes.', correta: false },
      ],
      explicacao: [
        'A regra de ouro de problemas de conjuntos: NUNCA SOME DIRETO sem tirar quem está duplicado!',
        '1. Comece SEMPRE pelo meio (a intersecção): 10 alunos gostam de Python E SQL.',
        '2. Quem gosta APENAS de Python? Dos 30 no total, tiramos os 10 do meio: 30 - 10 = 20 alunos.',
        '3. Quem gosta APENAS de SQL? Dos 25 no total, tiramos os 10 do meio: 25 - 10 = 15 alunos.',
        '4. Total de alunos que gostam de algo: 20 (só Python) + 10 (os dois) + 15 (só SQL) = 45 alunos.',
        '5. Como a sala tem 50 pessoas: 50 - 45 = sobram 5 estudantes que não gostam de nenhuma das duas! Alternativa A.',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 01 • O Alicerce das Categorias
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Conjuntos e Lógica: <br />
          <span className="text-cyan-400 font-light">Como a mente separa as coisas do mundo</span>
        </h1>
        <p className="text-base md:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl mb-4">
          No Doc 00, você entendeu o que os números fazem quando se movem na reta e no plano. Agora vamos dar o passo seguinte: <strong>como organizar esses números em caixas fechadas (Conjuntos)</strong> e <strong>como raciocinar sobre eles sem cair em mentiras ou contradições (Lógica)</strong>.
        </p>
      </section>

      {/* 2. PILAR 01: O QUE É UM CONJUNTO? (PERTENCER VS ESTAR CONTIDO) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Gaveta de Meias: A Diferença Entre Pertencer (∈) e Estar Contido (⊂)
          </h2>
        </div>

        <p>
          Antes de qualquer conta avançada, a primeira coisa que a mente humana faz é <strong>agrupar</strong>. Se você jogar meias, garfos e ferramentas na mesma gaveta, você não encontra nada. Um <strong>Conjunto</strong> é simplesmente uma caixa com uma etiqueta dizendo quem tem permissão para entrar.
        </p>

        <p className="text-neutral-200">
          A confusão clássica que faz todo mundo perder pontos em provas é misturar dois símbolos fundamentais:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">
              1. Pertence (∈): Relação OBJETO → CAIXA
            </span>
            <p className="text-sm text-neutral-300">
              Pense em um <strong>jogador solto</strong> e no <strong>time</strong>.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O jogador é um indivíduo de carne e osso. Ele <strong>pertence</strong> ao time: <code className="text-cyan-300">Neymar ∈ Seleção</code>. Você usa o símbolo ∈ quando compara uma coisa individual solta com o grupo onde ela está.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">
              2. Está Contido (⊂): Relação CAIXA MENOR → CAIXA MAIOR
            </span>
            <p className="text-sm text-neutral-300">
              Pense no <strong>banco de reservas</strong> dentro da <strong>Seleção</strong>.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              O banco de reservas não é um jogador solto; é um subgrupo inteiro de pessoas. Uma caixa menor <strong>está contida</strong> na caixa maior: <code className="text-sky-300">Reservas ⊂ Seleção</code>.
            </p>
          </div>
        </div>

        <div className="p-4 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-xs md:text-sm text-neutral-300 font-mono leading-relaxed">
          <strong className="text-cyan-400 uppercase block mb-1">A Regra Prática para Nunca Errar:</strong>
          • O número solto (sem chaves) <strong>pertence</strong>: 2 ∈ {'{ 2, 4, 6 }'}<br />
          • O número embrulhado em chaves (uma caixinha) <strong>está contido</strong>: {'{ 2 }'} ⊂ {'{ 2, 4, 6 }'}
        </div>
      </section>

      {/* 3. PILAR 02: A LINHAGEM DOS CONJUNTOS NUMÉRICOS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Família dos Números: De Onde Cada Conjunto Nasceu?
          </h2>
        </div>

        <p>
          Nenhum conjunto numérico caiu pronto do céu. Cada um foi criado quando uma conta simples bateu em um muro de impossibilidade física no cotidiano:
        </p>

        <div className="space-y-4 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-white font-medium text-base">1. Naturais (N): A Contagem dos Dedos</h3>
              <span className="font-mono text-xs text-cyan-400">N = {'{ 0, 1, 2, 3, 4... }'}</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Serve para contar ovelhas, pedras e árvores. 
              <br />
              <strong className="text-neutral-300">Onde a conta travou?</strong> Você tem 2 ovelhas e deve 5. A conta <strong>2 − 5</strong> não tem resposta dentro de N, porque não existem "menos três ovelhas" no pasto.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-white font-medium text-base">2. Inteiros (Z): O Termômetro e o Extrato</h3>
              <span className="font-mono text-xs text-sky-400">Z = {'{ ... -2, -1, 0, 1, 2 ... }'}</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Do alemão <em>Zahlen</em> ("números"). Permite registrar dívidas bancárias e temperaturas de congelamento.
              <br />
              <strong className="text-neutral-300">Onde a conta travou?</strong> Divida 5 barras de ouro entre 2 pessoas. A conta <strong>5 ÷ 2 = 2,5</strong> não existe em Z, pois Z só conhece números inteiros de pedra bruta.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-white font-medium text-base">3. Racionais (Q): As Fatias de Pizza</h3>
              <span className="font-mono text-xs text-amber-400">Q = Qualquer número da forma a/b (b ≠ 0)</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Do latim <em>ratio</em> (divisão, proporção, fração). São as frações limpas (1/2, 3/4) e as dízimas periódicas que têm padrão repetitivo (como 0,333... que é 1/3).
              <br />
              <strong className="text-neutral-300">Onde a conta travou?</strong> Pegue um quadrado de lado 1 e meça a diagonal com uma régua. Por Pitágoras, a diagonal mede <strong>√2</strong> (1,4142135...). Quando tentaram escrever esse tamanho como uma fração de dois inteiros, descobriram que era IMPOSSÍVEL.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-white font-medium text-base">4. Irracionais (I) e Reais (R): O Espaço Contínuo</h3>
              <span className="font-mono text-xs text-emerald-400">R = Q ∪ I (Reta Contínua Completa)</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Os <strong>Irracionais (I)</strong> são os rebeldes: números com infinitas casas decimais que NUNCA se repetem (como √2, o número π = 3,14159... e o número e = 2,71828...). 
              <br />
              Quando você junta todas as fatias limpas (Q) com todos os números rebeldes contínuos (I), você ganha a <strong>Reta Real (R)</strong>: uma régua maciça sem nenhum buraquinho invisível no meio.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PILAR 03: OPERAÇÕES COM CONJUNTOS COMO FILTROS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Operações com Conjuntos: Pense em Filtros de Loja Virtual
          </h2>
        </div>

        <p>
          Não decore símbolos cegamente. Pense em como você faz compras em um site: você aplica filtros de cor, tamanho e marca. Na matemática, é a exata mesma coisa:
        </p>

        {/* Simulador Interativo */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltroAtivo('interseccao')}
              className={`px-4 py-2 text-xs font-mono tracking-wider transition-all border ${
                filtroAtivo === 'interseccao'
                  ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              Filtro Duplo: Intersecção (A ∩ B)
            </button>
            <button
              onClick={() => setFiltroAtivo('uniao')}
              className={`px-4 py-2 text-xs font-mono tracking-wider transition-all border ${
                filtroAtivo === 'uniao'
                  ? 'border-sky-400 bg-sky-950/40 text-white shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              Festa Completa: União (A ∪ B)
            </button>
            <button
              onClick={() => setFiltroAtivo('diferenca')}
              className={`px-4 py-2 text-xs font-mono tracking-wider transition-all border ${
                filtroAtivo === 'diferenca'
                  ? 'border-amber-400 bg-amber-950/40 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              Expurgo: Diferença (A − B)
            </button>
          </div>

          <div className="border border-neutral-800/80 bg-black p-6 rounded-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-900 text-center md:text-left">
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase block">Grupo A (Números Primos até 10)</span>
                <span className="text-sm font-mono text-neutral-200">{'{ 2, 3, 5, 7 }'}</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase block">Grupo B (Números Ímpares até 10)</span>
                <span className="text-sm font-mono text-neutral-200">{'{ 1, 3, 5, 7, 9 }'}</span>
              </div>
            </div>

            <div className="pt-6 text-center space-y-3">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                O que passou pelo filtro:
              </span>
              <div className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tight">
                {filtroAtivo === 'interseccao' && <span className="text-cyan-400">{'{ 3, 5, 7 }'}</span>}
                {filtroAtivo === 'uniao' && <span className="text-sky-400">{'{ 1, 2, 3, 5, 7, 9 }'}</span>}
                {filtroAtivo === 'diferenca' && <span className="text-amber-400">{'{ 2 }'}</span>}
              </div>
              <div className="text-xs md:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed pt-2">
                {filtroAtivo === 'interseccao' && (
                  <p><strong>A Intersecção (∩) é exigente:</strong> Só passa quem está nas DUAS listas ao mesmo tempo (primo E ímpar). O 2 foi barrado por ser par; o 1 e o 9 foram barrados por não serem primos.</p>
                )}
                {filtroAtivo === 'uniao' && (
                  <p><strong>A União (∪) junta todo mundo:</strong> Quem estiver em qualquer uma das listas tem passe livre. O número 3 está nos dois, mas na lista unificada a gente só escreve ele uma vez!</p>
                )}
                {filtroAtivo === 'diferenca' && (
                  <p><strong>A Diferença (A − B) expulsa os intrusos:</strong> Pegue os números de A e arranque qualquer um que também apareça em B. Sobrou unicamente o 2 (o único primo par)!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: LÓGICA PROPOSICIONAL (COMO PENSAR SEM CONTRADIÇÃO) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Lógica: O Detector de Mentiras e a Promessa da Condicional
          </h2>
        </div>

        <p>
          Para a lógica matemática, nem toda frase serve. Frases como <em>"esse café está gostoso"</em> não têm valor lógico porque são questão de opinião. 
          Uma <strong>Proposição</strong> é uma afirmação fechada sobre a qual o universo só pode dar duas respostas: <strong>Verdadeiro (V)</strong> ou <strong>Falso (F)</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-2">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase block">1. Conectivo "E" (∧)</span>
            <h4 className="text-white font-medium text-base">A Exigência Rígida</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              "Para entrar no site você precisa de <strong>E-mail E Senha corretos</strong>."
              <br /><br />
              Se você acertar o e-mail mas errar a senha, o site bloqueia. <strong>Só dá Verdadeiro se AMBOS forem verdadeiros</strong>.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-2">
            <span className="font-mono text-xs text-sky-400 font-bold uppercase block">2. Conectivo "OU" (∨)</span>
            <h4 className="text-white font-medium text-base">O Passe Livre</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              "Você pode pagar com <strong>Pix OU Dinheiro em espécie</strong>."
              <br /><br />
              Se tiver Pix, deu certo. Se tiver dinheiro, deu certo. Se tiver os dois, excelente. <strong>Só dá Falso se você não tiver NENHUM dos dois</strong>.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-2">
            <span className="font-mono text-xs text-amber-400 font-bold uppercase block">3. "SE... ENTÃO" (→)</span>
            <h4 className="text-white font-medium text-base">O Contrato da Promessa</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              "Se chover amanhã (P), então eu levo o guarda-chuva (Q)."
              <br /><br />
              Quando foi que eu quebrei minha palavra? <strong>Apenas se chover e eu NÃO levar o guarda-chuva (V → F)</strong>. Se fizer sol e eu levar o guarda-chuva por precaução, eu não menti!
            </p>
          </div>
        </div>

        {/* O TESTE DE WASON */}
        <div className="border border-neutral-800 bg-[#080808] p-6 md:p-8 rounded-sm space-y-6">
          <div className="border-b border-neutral-800 pb-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              Desafio Mental Interativo
            </span>
            <h3 className="text-lg font-medium text-white">O Teste de Wason: Onde Nosso Cérebro Costuma Falhar</h3>
          </div>

          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light">
            Existem 4 cartas na sua frente. Toda carta tem uma <strong>letra</strong> na frente e um <strong>número</strong> atrás.
            <br />
            <strong>A Regra Oficial é:</strong> <em>"Se uma carta tem uma VOGAL na frente, então tem um NÚMERO PAR atrás."</em>
          </p>

          <p className="text-xs text-neutral-500 font-mono">
            Clique nas cartas para virar o verso e veja o que tem atrás de cada uma:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto py-2">
            {[
              { id: 'A', frente: 'A', verso: '4', tipo: 'Vogal' },
              { id: 'B', frente: 'B', verso: '7', tipo: 'Consoante' },
              { id: '4', frente: '4', verso: 'B', tipo: 'Número Par' },
              { id: '7', frente: '7', verso: 'A', tipo: 'Número Ímpar' },
            ].map((carta) => {
              const estaVirada = cartasViradas[carta.id];
              return (
                <button
                  key={carta.id}
                  onClick={() => toggleCarta(carta.id)}
                  className={`h-24 border flex flex-col items-center justify-center transition-all duration-300 rounded-sm cursor-pointer ${
                    estaVirada
                      ? 'border-cyan-500 bg-neutral-900 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'border-neutral-700 bg-neutral-950 hover:border-neutral-500'
                  }`}
                >
                  <span className="text-2xl font-mono font-bold text-white">
                    {estaVirada ? carta.verso : carta.frente}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 mt-1">
                    {estaVirada ? 'VERSO' : carta.tipo}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-neutral-800 pt-4 text-xs md:text-sm text-neutral-400 font-light space-y-2">
            <p className="text-white font-medium">Quais cartas você OBRIGATORIAMENTE precisa virar para checar a regra?</p>
            <p>
              • <strong>A carta A:</strong> Sim! É vogal. Se atrás tiver um número ímpar, a regra cai no chão na hora.
            </p>
            <p>
              • <strong>A carta 4: NÃO PRECISA VIRAR!</strong> A regra nunca disse que consoantes são proibidas de ter números pares atrás! Se atrás do 4 tiver a letra B, a regra continua de pé.
            </p>
            <p>
              • <strong>A carta 7: PRECISA VIRAR!</strong> Porque se atrás do 7 tiver uma vogal (como a letra A), você encontrou uma vogal acompanhada de número ímpar, quebrando a regra!
            </p>
            <span className="text-cyan-400 font-mono text-xs block pt-2">
              → Cartas corretas: A e 7. (No Ensino Médio, chamam isso de <em>Contrapositiva</em>: Se P → Q, então não-Q → não-P).
            </span>
          </div>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Rabisque na Lousa e Responda
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Não tente adivinhar no chute. Abra a lousa de cada questão, faça seus diagramas de círculos ou anotações, escolha a melhor alternativa e clique em "Validar Resposta".
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
                        {acertou ? 'Excelente raciocínio!' : 'Não se preocupe! Veja a resolução mastigada abaixo:'}
                      </span>
                    )}
                  </div>

                  {confirmou && (
                    <button
                      onClick={() => setAbrirResolucao((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs font-mono tracking-wider uppercase text-neutral-400 hover:text-white transition-colors"
                    >
                      {resolucaoVisivel ? '▲ Fechar Explicação' : '▼ Ver Resolução Passo a Passo'}
                    </button>
                  )}
                </div>

                {/* Explicação Mastigada */}
                {confirmou && resolucaoVisivel && (
                  <div className="p-5 border border-neutral-800 bg-[#040404] text-xs md:text-sm text-neutral-300 font-light space-y-2 leading-relaxed border-l-2 border-l-cyan-400">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-bold mb-1">
                      Resolução Passo a Passo:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 01:</p>
        <p className="leading-relaxed">
          Com a lógica proposicional e os conjuntos numéricos sedimentados na sua intuição, você dominou a linguagem sobre a qual toda a álgebra superior é construída. No próximo caderno (<strong>Doc 02: Fundamentos Aritméticos, Primos e Divisibilidade</strong>), vamos descer nos blocos atômicos que constroem todos os números do universo.
        </p>
      </footer>

    </article>
  );
}