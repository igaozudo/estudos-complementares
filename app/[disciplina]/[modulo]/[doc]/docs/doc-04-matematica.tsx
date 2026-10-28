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

  const pararDesenho = () => setDesenhando(false);

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
            ✏️ Linhas / Contas
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotações
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
              Desenhe os cruzamentos da regra de três aqui
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Anote os dados do problema, separe causas e efeitos..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 04 - PROPORÇÃO, REGRA DE TRÊS E FINANCEIRA
// =========================================================================
export default function Doc04Matematica() {
  // Simulador de Juros (A Bola de Neve)
  const [anos, setAnos] = useState(1);
  const capitalInicial = 1000;
  const taxa = 0.10; // 10% ao ano

  const jurosSimples = capitalInicial + (capitalInicial * taxa * anos);
  const jurosCompostos = capitalInicial * Math.pow(1 + taxa, anos);
  const diferenca = jurosCompostos - jurosSimples;

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
      tema: 'Proporcionalidade Inversa (A Armadilha do Cérebro)',
      pergunta: 'Uma equipe de 4 pedreiros constrói um muro em 12 dias. O dono da obra quer acelerar o processo e contrata mais 2 pedreiros (totalizando 6). O mestre de obras, pensando rápido, diz: "Se aumentamos os pedreiros em 50%, o tempo vai aumentar em 50% também, ou seja, 18 dias!". Por que o mestre está errado e qual é o tempo real?',
      opcoes: [
        { idx: 0, texto: 'A) Ele está errado porque o tempo cai pela metade: 6 dias.', correta: false },
        { idx: 1, texto: 'B) Ele está errado porque grandezas de trabalho são INVERSAMENTE proporcionais. Mais gente = menos tempo. O correto é 8 dias.', correta: true },
        { idx: 2, texto: 'C) Ele está errado porque a matemática de obras é exponencial, o tempo cai para 4 dias.', correta: false },
        { idx: 3, texto: 'D) Ele está certo. A proporção é direta.', correta: false },
      ],
      explicacao: [
        'Essa é a clássica armadilha da proporção inversa!',
        '1. Regra de ouro: Toda vez que você aumenta a força de trabalho (pessoas, máquinas, velocidade), o tempo necessário para acabar a tarefa CAI. A relação é uma gangorra.',
        '2. Montando a conta (mantendo o volume total de trabalho igual):',
        '   4 pedreiros × 12 dias = 48 "diárias" de trabalho no total.',
        '   6 pedreiros × X dias = 48 "diárias" totais.',
        '   6X = 48  →  X = 48 ÷ 6 = 8 dias.',
        'Se você usar regra de três direta, vai achar que mais pedreiros demoram mais tempo. Alternativa B!',
      ],
    },
    {
      id: 2,
      tema: 'Regra de Três Composta (Método Causa e Efeito)',
      pergunta: 'Em uma fábrica, 5 impressoras (Causa) trabalhando 6 horas por dia (Causa) imprimem 3.000 livros (Efeito) em 4 dias (Causa). Quantas impressoras idênticas serão necessárias para imprimir 6.000 livros trabalhando 8 horas por dia durante 3 dias?',
      opcoes: [
        { idx: 0, texto: 'A) 10 impressoras.', correta: true },
        { idx: 1, texto: 'B) 8 impressoras.', correta: false },
        { idx: 2, texto: 'C) 12 impressoras.', correta: false },
        { idx: 3, texto: 'D) 15 impressoras.', correta: false },
      ],
      explicacao: [
        'Esqueça as setinhas! Use o Método Causas e Efeitos:',
        '1. CAUSAS (O que trabalha): Impressoras, Horas/dia, Dias.',
        '2. EFEITO (O produto gerado): Livros.',
        'Linha 1: 5 (imp) × 6 (h/d) × 4 (dias) ----cruzamento----> 3000 (livros)',
        'Linha 2: X (imp) × 8 (h/d) × 3 (dias) ----cruzamento----> 6000 (livros)',
        '3. Siga a linha cruzando o efeito: (X × 8 × 3) × 3000 = (5 × 6 × 4) × 6000.',
        '4. Simplificando tudo: X × 24 × 3000 = 120 × 6000.',
        '   X × 72.000 = 720.000.',
        '   X = 10. Você resolve qualquer problema gigantesco em uma única linha! Alternativa A.',
      ],
    },
    {
      id: 3,
      tema: 'Porcentagem (O Golpe do Desconto Sucessivo)',
      pergunta: 'Na Black Friday, uma loja anuncia: "Super Promoção! 50% de desconto hoje, e mais 50% de desconto extra no caixa!". Um cliente corre para o caixa achando que o produto sairá de graça (100% de desconto). O que acontece na realidade?',
      opcoes: [
        { idx: 0, texto: 'A) O cliente está certo, os descontos se somam (50 + 50 = 100).', correta: false },
        { idx: 1, texto: 'B) O cliente paga 25% do valor original, pois os descontos são multiplicados em cascata.', correta: true },
        { idx: 2, texto: 'C) O cliente paga 50% do valor original, pois o sistema anula descontos repetidos.', correta: false },
        { idx: 3, texto: 'D) O cliente paga 75% do valor original.', correta: false },
      ],
      explicacao: [
        'Nunca some porcentagens de eventos sucessivos! Porcentagem é o "Fator de Multiplicação":',
        '1. Um desconto de 50% significa que você vai pagar 0,50 (fator) do preço.',
        '2. Imagine um tênis de R$ 100.',
        '3. Primeiro desconto (50%): R$ 100 × 0,50 = R$ 50.',
        '4. Segundo desconto "extra" no caixa incide SOBRE OS R$ 50 restantes! R$ 50 × 0,50 = R$ 25.',
        '5. No fim, o tênis custa R$ 25. O desconto real total foi de 75%, e não de 100%. Porcentagem sucessiva multiplica fatores: 0,50 × 0,50 = 0,25 (25% do preço final). Alternativa B!',
      ],
    },
    {
      id: 4,
      tema: 'A Matriz do Enriquecimento (Juros Compostos)',
      pergunta: 'Se você investir R$ 1.000,00 a uma taxa de juros de 100% ao ano, quanto dinheiro você terá após 3 anos usando Juros Simples e usando Juros Compostos?',
      opcoes: [
        { idx: 0, texto: 'A) Simples: R$ 4.000 / Compostos: R$ 8.000.', correta: true },
        { idx: 1, texto: 'B) Simples: R$ 3.000 / Compostos: R$ 4.000.', correta: false },
        { idx: 2, texto: 'C) Simples: R$ 4.000 / Compostos: R$ 4.000.', correta: false },
        { idx: 3, texto: 'D) Simples: R$ 8.000 / Compostos: R$ 8.000.', correta: false },
      ],
      explicacao: [
        'A diferença brutal da Matemática Financeira:',
        '1. Juros Simples (A mesada fixa): 100% de R$ 1.000 é R$ 1.000. Todo ano você ganha exatos R$ 1.000, não importa quanto tempo passe. Ano 1: 1k + 1k = 2k. Ano 2: 2k + 1k = 3k. Ano 3: 3k + 1k = R$ 4.000.',
        '2. Juros Compostos (A Bola de Neve): O juro bate em cima do bolo todo acumulado!',
        '   - Ano 1: 1k + 1k = R$ 2.000.',
        '   - Ano 2 (100% em cima de 2k): 2k + 2k = R$ 4.000.',
        '   - Ano 3 (100% em cima de 4k): 4k + 4k = R$ 8.000!',
        'A fórmula do composto é Fator Acumulado: Montante = Capital × (Fator)³. Montante = 1000 × (2)³ = 1000 × 8 = R$ 8.000. Alternativa A!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 04 • O Encerramento do Módulo 1
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Escalas, Trocas e Dinheiro: <br />
          <span className="text-cyan-400 font-light">O Código Fonte do Mundo Real</span>
        </h1>
        <p className="text-base md:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl mb-4">
          Nos cadernos anteriores, criamos a base de todas as contas. Agora, vamos aplicar isso na sociedade. A civilização humana é baseada em três coisas: <strong>proporções</strong> (receitas de construção e comida), <strong>trocas/descontos</strong> (comércio) e o <strong>valor do tempo</strong> (juros e empréstimos). Se você entender as engrenagens deste caderno, não apenas passará em qualquer prova, mas entenderá o fluxo invisível do dinheiro e da produtividade à sua volta.
        </p>
      </section>

      {/* 2. PILAR 01: PROPORCIONALIDADE (A GANGORRA VS A BALANÇA) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Proporção Direta e Inversa: A Balança e a Gangorra
          </h2>
        </div>

        <p>
          Muitos alunos perdem questões ridículas porque acham que "matemática é sempre multiplicar cruzado". Regra de três não é mágica, é uma constatação física do universo. Você só tem dois cenários possíveis no mundo:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">1. A Balança (Diretamente Proporcional)</span>
            <p className="text-sm text-neutral-300">
              <strong>Se uma sobe, a outra Sobe.</strong>
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Pense em <strong>Receitas e Combustível</strong>. Se você quer fazer bolo para o dobro de pessoas, precisa do dobro de farinha. Se você dirige o dobro da distância, gasta o dobro de gasolina. 
              <br /><br />
              <strong className="text-white">A Lógica Matemática:</strong> A divisão entre as duas grandezas é constante.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold block">2. A Gangorra (Inversamente Proporcional)</span>
            <p className="text-sm text-neutral-300">
              <strong>Se uma sobe, a outra Desce.</strong>
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Pense em <strong>Velocidade, Tempo e Trabalhadores</strong>. Se você dobra a velocidade do carro, o tempo da viagem cai pela metade. Se você dobra os pedreiros na obra, o tempo da reforma desaba.
              <br /><br />
              <strong className="text-white">A Lógica Matemática:</strong> A multiplicação entre as duas grandezas é constante (Velocidade × Tempo = Distância fixa).
            </p>
          </div>
        </div>
      </section>

      {/* 3. PILAR 02: O FIM DA REGRA DE TRÊS COM SETINHAS */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Revolução: O Método "Causas e Efeitos" (Processo x Produto)
          </h2>
        </div>

        <p>
          No Ensino Médio, ensinam a resolver Regra de Três Composta analisando quem é inversamente proporcional a quem, botando setinha para cima, setinha para baixo, e invertendo frações. <strong>ESQUEÇA ISSO.</strong> É o pior método didático já inventado.
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm space-y-5">
          <h3 className="text-lg font-mono text-cyan-400 font-bold">O Método Supremo das Linhas Cruzadas</h3>
          <p className="text-sm text-neutral-300 font-light leading-relaxed">
            Numa fábrica do universo, tudo se divide em duas colunas:
            <br/>
            <strong>1. AS CAUSAS (O Processo):</strong> Quem trabalha? Qual a dificuldade? Quanto tempo leva? (Ex: Pedreiros, Máquinas, Horas, Dias).
            <br/>
            <strong>2. OS EFEITOS (O Produto Final):</strong> O que foi fabricado no final do dia? (Ex: Muros construídos, Livros impressos, Metros de asfalto).
          </p>

          <div className="border border-neutral-800 bg-black p-6 rounded text-center text-xs md:text-sm font-mono text-white relative overflow-hidden">
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="col-span-2 text-cyan-300 border-b border-cyan-900 pb-2">CAUSAS (Processo)</div>
              <div className="col-span-1"></div>
              <div className="col-span-2 text-emerald-300 border-b border-emerald-900 pb-2">EFEITOS (Produto Final)</div>
              
              {/* Linha 1 */}
              <div className="col-span-2 text-neutral-400">5 impressoras × 4 dias</div>
              <div className="col-span-1 relative h-full w-full flex items-center justify-center">
                <svg width="100%" height="40" className="absolute">
                  <line x1="0" y1="10" x2="100%" y2="30" stroke="#06b6d4" strokeWidth="2" />
                  <line x1="0" y1="30" x2="100%" y2="10" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4" />
                </svg>
              </div>
              <div className="col-span-2 text-neutral-400">3.000 livros</div>
              
              {/* Linha 2 */}
              <div className="col-span-2 text-neutral-400">X impressoras × 3 dias</div>
              <div className="col-span-1"></div>
              <div className="col-span-2 text-neutral-400">6.000 livros</div>
            </div>
            
            <p className="mt-6 text-neutral-300 bg-neutral-900 p-3 rounded text-left">
              <strong>Como calcular sem errar nunca:</strong> Escreva as duas linhas. Na hora de igualar a equação, siga a linha reta pelas Causas, mas <strong>CRUZE A LINHA X</strong> na hora de pegar o Efeito!
              <br /><br />
              <code className="text-cyan-400">Linha de Cima (Cruza pra Baixo):</code> 5 × 4 × <strong className="text-emerald-400">6000</strong>
              <br />
              <code className="text-cyan-400">Linha de Baixo (Cruza pra Cima):</code> X × 3 × <strong className="text-emerald-400">3000</strong>
              <br /><br />
              <strong>Conta final:</strong> (X) × 3 × 3000 = 5 × 4 × 6000. Fim. Zero setas, zero inversões confusas.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PILAR 03: PORCENTAGEM (A LENTE DE AUMENTO) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Porcentagem é Apenas uma Lupa de Multiplicar
          </h2>
        </div>

        <p>
          Por cento (%) literalmente significa <strong>"dividido por cem"</strong>. 20% é a fração 20/100, que em decimais é <strong>0,20</strong>. Se você entender a porcentagem como um <strong>Fator de Multiplicação</strong>, você nunca mais vai fazer contas em três passos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-red-400 font-mono text-xs uppercase font-bold block">1. Dar Desconto (Fator de Redução)</span>
            <p className="text-sm text-neutral-300 font-light">
              Se uma blusa de R$ 200 tem 30% de desconto, você não precisa calcular os 30% e depois subtrair!
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              <strong>Pense logicamente:</strong> Se tiraram 30%, você vai pagar apenas 70% do produto. 70% é 0,70.
              <br />
              <strong>Conta direta num golpe só:</strong> 200 × 0,70 = R$ 140!
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-emerald-400 font-mono text-xs uppercase font-bold block">2. Dar Aumento (Fator de Crescimento)</span>
            <p className="text-sm text-neutral-300 font-light">
              Se a conta de luz de R$ 150 sofreu um reajuste de 15%, não calcule os 15% para depois somar.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              <strong>Pense logicamente:</strong> A conta inteira original é 100%. Com mais 15%, ela vira 115%. Em fator decimal, isso é 1,15.
              <br />
              <strong>Conta direta num golpe só:</strong> 150 × 1,15 = R$ 172,50!
            </p>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: A BOLA DE NEVE FINANCEIRA (JUROS) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Oitava Maravilha do Mundo: Juros Compostos
          </h2>
        </div>

        <p>
          Albert Einstein teria dito que os juros compostos são a força mais poderosa do universo. E aqui está a prova matemática do porquê o dinheiro de quem investe explode no longo prazo, enquanto as dívidas de quem não paga o cartão de crédito destroem vidas.
        </p>

        {/* SIMULADOR INTERATIVO FINANCEIRO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-900">
            <div className="space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Máquina do Tempo Financeira
              </span>
              <p className="text-sm text-neutral-300 font-light">
                Capital inicial: <strong>R$ 1.000,00</strong> | Rentabilidade/Juros: <strong>10% ao ano</strong>
              </p>
            </div>

            <div className="w-full md:w-auto bg-black border border-neutral-800 p-4 rounded text-center">
              <label className="text-[10px] font-mono text-cyan-400 uppercase block mb-3">Tempo decorrido (Anos)</label>
              <input 
                type="range" 
                min="1" max="40" 
                value={anos} 
                onChange={(e) => setAnos(parseInt(e.target.value))}
                className="w-full md:w-48 accent-cyan-500 cursor-pointer"
              />
              <div className="font-mono text-white text-lg font-bold mt-2">{anos} {anos === 1 ? 'Ano' : 'Anos'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center pt-2">
            <div className="space-y-2">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">Juros Simples (Mesada)</span>
              <div className="text-2xl font-mono text-white">
                R$ {jurosSimples.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="w-full bg-neutral-900 h-2 rounded overflow-hidden mt-4">
                <div 
                  className="bg-neutral-600 h-full transition-all duration-300"
                  style={{ width: `${(jurosSimples / jurosCompostos) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono pt-2">O juro é sempre R$ 100 por ano e ponto final. Crescimento Linear.</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">Juros Compostos (Bola de Neve)</span>
              <div className="text-2xl font-mono text-cyan-300 font-bold">
                R$ {jurosCompostos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="w-full bg-neutral-900 h-2 rounded overflow-hidden mt-4">
                <div className="bg-cyan-500 h-full w-full"></div>
              </div>
              <p className="text-[10px] text-cyan-600 font-mono pt-2">O juro bate sobre o bolo total que cresceu. Crescimento Exponencial!</p>
            </div>
          </div>

          {anos > 10 && (
            <div className="mt-4 p-3 border border-amber-900/50 bg-amber-950/20 text-xs md:text-sm text-amber-200 font-light text-center rounded">
              <strong>Olhe o descolamento!</strong> A diferença de riqueza gerada entre o método composto e o simples em {anos} anos é de absurdos <strong>R$ {diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>! O tempo (expoente) é a variável mais agressiva da matemática.
            </div>
          )}
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine o Código Fonte
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Não passe para o próximo módulo sem destruir essas questões. Use a lousa para desenhar a cruzeta das causas e efeitos e testar os fatores de porcentagem.
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
                        {acertou ? 'Bela visão de escala e lógica!' : 'Não caia nas armadilhas! Leia o passo a passo:'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão Épica do Módulo 1:</p>
        <p className="leading-relaxed">
          Você acabou de zerar o código fonte da aritmética e da proporcionalidade. A partir de agora, você sabe que porcentagem é apenas um multiplicador invisível, que a regra de três composta é domada separando causas de efeitos e que o tempo em juros compostos explode a matemática para o infinito. Com o Módulo 1 dominado e testado através das lousas, você está com a mente perfeitamente afiada para avançar para o <strong>Módulo 2 (Álgebra)</strong> e brincar com equações, sistemas e funções com os olhos fechados.
        </p>
      </footer>

    </article>
  );
}