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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Lousa Combinatória #{id}</span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Árvore de Decisão / Traços
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotar Fatoriais / Combinações
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
              Esboce os tracinhos do PFC ou a árvore de ramos de decisão
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Monte os tracinhos _ × _ × _, simplifique n! / p!(n-p)! ou calcule o termo geral do binômio..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 19 - COMBINATÓRIA E BINÔMIO DE NEWTON
// =========================================================================
export default function Doc19Matematica() {
  // Simulador 1: A Pergunta de Ouro (Arranjo vs Combinação com 4 elementos escolhendo 2)
  const [cenarioOrdem, setCenarioOrdem] = useState<'arranjo' | 'combinacao'>('arranjo');
  const elementosBase = ['A', 'B', 'C', 'D'];

  // Arranjos possíveis (12 pares ordenados)
  const todosArranjos = [
    { p1: 'A', p2: 'B', parKey: 'AB' },
    { p1: 'B', p2: 'A', parKey: 'AB' },
    { p1: 'A', p2: 'C', parKey: 'AC' },
    { p1: 'C', p2: 'A', parKey: 'AC' },
    { p1: 'A', p2: 'D', parKey: 'AD' },
    { p1: 'D', p2: 'A', parKey: 'AD' },
    { p1: 'B', p2: 'C', parKey: 'BC' },
    { p1: 'C', p2: 'B', parKey: 'BC' },
    { p1: 'B', p2: 'D', parKey: 'BD' },
    { p1: 'D', p2: 'B', parKey: 'BD' },
    { p1: 'C', p2: 'D', parKey: 'CD' },
    { p1: 'D', p2: 'C', parKey: 'CD' },
  ];

  // Combinações únicas (6 pares não ordenados)
  const combinacoesUnicas = ['AB', 'AC', 'AD', 'BC', 'BD', 'CD'];

  // Simulador 2: Triângulo de Pascal & Expansão Binomial
  const [expoenteN, setExpoenteN] = useState<number>(3); // n de 0 a 5

  // Gerador determinístico de linhas de Pascal
  const gerarLinhasPascal = () => {
    const triangulo: number[][] = [];
    for (let r = 0; r <= 5; r++) {
      const linha: number[] = [1];
      for (let c = 1; c < r; c++) {
        linha.push(triangulo[r - 1][c - 1] + triangulo[r - 1][c]);
      }
      if (r > 0) linha.push(1);
      triangulo.push(linha);
    }
    return triangulo;
  };

  const trianguloCompleto = gerarLinhasPascal();
  const coeficientesAtivos = trianguloCompleto[expoenteN];
  const somaLinha = Math.pow(2, expoenteN);

  // Formatação em texto da expansão binomial (x + y)^n
  const formatarExpansao = (n: number, coefs: number[]) => {
    if (n === 0) return '1';
    return coefs.map((c, k) => {
      const potX = n - k;
      const potY = k;
      const termoCoef = c > 1 ? `${c}` : '';
      const termoX = potX > 1 ? `x${potX}` : potX === 1 ? 'x' : '';
      const termoY = potY > 1 ? `y${potY}` : potY === 1 ? 'y' : '';
      return `${termoCoef}${termoX}${termoY}`;
    }).join(' + ');
  };

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

  const questoes = [
    {
      id: 1,
      tema: 'PFC com Restrições: Senhas Seguras',
      pergunta: 'Deseja-se criar um código de acesso bancário com exatamente 4 dígitos distintos escolhidos entre os algarismos de 0 a 9. Por razões de segurança do sistema, o primeiro dígito não pode ser 0 e o código deve ser obrigatoriamente um número ímpar. Quantos códigos válidos diferentes podem ser formados?',
      opcoes: [
        { idx: 0, texto: 'A) 2.240 códigos', correta: true },
        { idx: 1, texto: 'B) 2.520 códigos', correta: false },
        { idx: 2, texto: 'C) 1.800 códigos', correta: false },
        { idx: 3, texto: 'D) 2.016 códigos', correta: false },
      ],
      explicacao: [
        'A regra de ouro do PFC: resolva primeiro as restrições mais exigentes!',
        '1. Restrição 1 (Ímpar): o último dígito (4º) deve ser 1, 3, 5, 7 ou 9. Temos 5 opções de escolha.',
        '2. Restrição 2 (Não começar com zero): o 1º dígito não pode ser 0 e nem pode ser o número ímpar já escolhido no final.',
        '   Total de algarismos: 10 (de 0 a 9). Tirando o zero e o ímpar escolhido: sobram exatamente 8 opções para o 1º dígito.',
        '3. 2º Dígito (Livre): dos 10 algarismos totais, já gastamos 2 (o 1º e o 4º). O zero agora pode ser usado. Sobram 8 opções.',
        '4. 3º Dígito (Livre): dos 10 algarismos totais, já gastamos 3. Sobram 7 opções.',
        '5. Pelo PFC (multiplicação das etapas independentes):',
        '   Total = (8 opções) × (8 opções) × (7 opções) × (5 opções)',
        '   Total = 8 × 8 × 7 × 5 = 64 × 35 = 2.240 códigos válidos.',
        'Sempre ataque as posições restritas antes das livres! Alternativa A correta.',
      ],
    },
    {
      id: 2,
      tema: 'Comissão Mista: O Filtro da Combinação Simples',
      pergunta: 'Um hospital dispõe de 6 médicos e 5 enfermeiros de plantão. Para atender a uma emergência de campo, deve-se formar uma equipe multidisciplinar composta por exatamente 3 médicos e 2 enfermeiros. De quantas maneiras diferentes essa equipe pode ser escalada?',
      opcoes: [
        { idx: 0, texto: 'A) 120 maneiras', correta: false },
        { idx: 1, texto: 'B) 200 maneiras', correta: true },
        { idx: 2, texto: 'C) 60 maneiras', correta: false },
        { idx: 3, texto: 'D) 462 maneiras', correta: false },
      ],
      explicacao: [
        'A ordem das pessoas na equipe não importa (João, Maria e Pedro é a mesma equipe que Pedro, Maria e João). Logo, usamos Combinações:',
        '1. Escolha dos 3 médicos entre os 6 disponíveis: C(6, 3) = 6! / (3! · 3!) = (6 · 5 · 4) / (3 · 2 · 1) = 20 maneiras.',
        '2. Escolha dos 2 enfermeiros entre os 5 disponíveis: C(5, 2) = 5! / (2! · 3!) = (5 · 4) / (2 · 1) = 10 maneiras.',
        '3. Princípio Multiplicativo: queremos 3 médicos E 2 enfermeiros. Multiplicamos as decisões:',
        '   Total = C(6, 3) × C(5, 2) = 20 × 10 = 200 equipes distintas.',
        'Alternativa B correta!',
      ],
    },
    {
      id: 3,
      tema: 'Permutação com Repetição: Anagramas com Bloqueio',
      pergunta: 'Quantos anagramas da palavra BANANA começam e terminam obrigatoriamente com a letra A?',
      opcoes: [
        { idx: 0, texto: 'A) 12 anagramas', correta: true },
        { idx: 1, texto: 'B) 24 anagramas', correta: false },
        { idx: 2, texto: 'C) 60 anagramas', correta: false },
        { idx: 3, texto: 'D) 6 anagramas', correta: false },
      ],
      explicacao: [
        'A técnica de congelar elementos restritos nas pontas:',
        '1. A palavra BANANA tem 6 letras: B (1), A (3), N (2).',
        '2. Fixando as pontas: colocamos uma letra A na primeira posição e outra letra A na última posição: A _ _ _ _ A.',
        '3. As 4 posições internas vazias devem ser preenchidas pelas 4 letras restantes: B (1), A (1 restante), N (2).',
        '4. Permutação das 4 letras internas com 2 repetições da letra N:',
        '   P₄² = 4! / 2! = (4 · 3 · 2 · 1) / 2 = 12 anagramas.',
        'Fixando as pontas restritas, restam apenas 12 configurações internas distintas. Alternativa A!',
      ],
    },
    {
      id: 4,
      tema: 'Binômio de Newton: O Termo Independente de x',
      pergunta: 'No desenvolvimento do binômio (x² + 1/x)⁶ segundo as potências decrescentes de x, qual é o valor numérico do termo independente de x (aquele em que o expoente de x é zero)?',
      opcoes: [
        { idx: 0, texto: 'A) 20', correta: false },
        { idx: 1, texto: 'B) 15', correta: true },
        { idx: 2, texto: 'C) 6', correta: false },
        { idx: 3, texto: 'D) 1', correta: false },
      ],
      explicacao: [
        'A busca cirúrgica pelo termo independente no Binômio de Newton:',
        '1. Fórmula do termo geral: T_{k+1} = C(n, k) · a^(n - k) · b^k.',
        '2. Dados: n = 6, primeiro termo a = x², segundo termo b = 1/x = x^(-1).',
        '3. Montando a expressão com k genérico:',
        '   T_{k+1} = C(6, k) · (x²)^(6 - k) · (x^(-1))^k',
        '   T_{k+1} = C(6, k) · x^(12 - 2k) · x^(-k) = C(6, k) · x^(12 - 3k).',
        '4. Para ser independente de x, o expoente resultante deve ser zero: 12 - 3k = 0 → 3k = 12 → k = 4.',
        '5. Calculando o coeficiente binomial para k = 4:',
        '   C(6, 4) = C(6, 2) = (6 · 5) / (2 · 1) = 15.',
        'O termo independente é uma constante pura igual a 15. Alternativa B impecável!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 19 • Módulo 05: Análise Combinatória e Álgebra Superior
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Análise Combinatória: <br />
          <span className="text-cyan-400 font-light">Contagens Inteligentes, Permutações e o Triângulo de Pascal</span>
        </h1>

        {/* MANIFESTO PEDAGÓGICO */}
        <div className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5 rounded-r my-6 space-y-3">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider block">
            A Virada Metodológica: Chega de Fórmulas Cegas de Fatorial
          </span>
          <p className="text-sm text-neutral-200 font-light leading-relaxed">
            Se te ensinaram Análise Combinatória jogando fórmulas de arranjo e combinação antes de ensinar a <strong>ler o problema</strong>, você travou na primeira questão de concurso ou vestibular.
          </p>
          <ul className="text-xs text-neutral-300 space-y-2 font-mono">
            <li>
              • <strong>A Arte da Contagem Inteligente:</strong> Combinatória não existe para você contar nos dedos. Ela existe para calcular milhões de possibilidades sem listar nenhuma manualmente.
            </li>
            <li>
              • <strong>A Pergunta de Ouro: A Ordem dos Elementos Importa?</strong>
              <br />
              - Se mudar a ordem muda o resultado (pódio 1º e 2º lugar, senha bancária 1234 vs 4321, cargos de Presidente e Vice) &rarr; <span className="text-cyan-300 font-bold">Arranjo / Permutação</span>.
              <br />
              - Se mudar a ordem dá rigorosamente a mesma coisa (comissão de amigos, salada de frutas, aperto de mão entre duas pessoas) &rarr; <span className="text-emerald-400 font-bold">Combinação</span>.
            </li>
            <li>
              • <strong>O Segredo da Divisão por p!:</strong> A fórmula de combinação divide por p! por um motivo físico: é a <strong>taxa de limpeza</strong> para queimar os clones gerados pela troca de posição que não criam grupos novos.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PILAR 01: O PRINCÍPIO FUNDAMENTAL DA CONTAGEM (PFC) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Princípio Fundamental da Contagem: A Regra do &quot;E&quot; e do &quot;OU&quot;
          </h2>
        </div>

        <p>
          Toda a combinatória mundial deriva de duas palavras do português: <strong>&quot;E&quot;</strong> e <strong>&quot;OU&quot;</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 font-mono text-xs">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-cyan-400 font-bold uppercase text-sm block">1. Regra do &quot;E&quot; (Multiplicação)</span>
            <div className="text-white font-bold text-base py-1">
              Etapa 1 × Etapa 2 × Etapa 3...
            </div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              Usada quando você precisa tomar <strong>decisões consecutivas e simultâneas</strong>.
              <br />
              Exemplo: Escolher uma calça (3 opções) <strong>E</strong> uma camisa (4 opções) &rarr; <strong className="text-white">3 × 4 = 12 visuais</strong>. Cada calça abre 4 ramificações de camisa.
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-3">
            <span className="text-emerald-400 font-bold uppercase text-sm block">2. Regra do &quot;OU&quot; (Adição)</span>
            <div className="text-white font-bold text-base py-1">
              Caso 1 + Caso 2 + Caso 3...
            </div>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed font-light">
              Usada quando os <strong>caminhos são mutuamente excludentes</strong> (ou acontece um, ou acontece o outro).
              <br />
              Exemplo: Viajar de avião (2 voos) <strong>OU</strong> de ônibus (5 linhas) &rarr; <strong className="text-white">2 + 5 = 7 escolhas</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PILAR 02: O CLASSIFICADOR INTERATIVO "A ORDEM IMPORTA?" */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Arranjo vs Combinação: O Filtro da Ordem
          </h2>
        </div>

        <p>
          Considere 4 amigos: <code className="text-cyan-300 font-mono font-bold">A, B, C e D</code>. Queremos selecionar 2 deles.
          <br />
          Veja no simulador abaixo o que acontece quando a ordem gera cargos distintos (Pódio de 1º e 2º lugar) versus quando a ordem gera uma comissão comum de 2 pessoas:
        </p>

        {/* SIMULADOR INTERATIVO: O FILTRO DA ORDEM */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: O Testador de Pódio vs Comissão
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Conjunto: &#123; A, B, C, D &#125;. Selecionando 2 elementos:
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCenarioOrdem('arranjo')}
                className={`px-3 py-1.5 font-mono text-xs rounded border transition-all ${
                  cenarioOrdem === 'arranjo'
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                1. A Ordem Importa (Pódio: 1º e 2º)
              </button>
              <button
                onClick={() => setCenarioOrdem('combinacao')}
                className={`px-3 py-1.5 font-mono text-xs rounded border transition-all ${
                  cenarioOrdem === 'combinacao'
                    ? 'border-emerald-400 bg-emerald-950 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                2. A Ordem NÃO Importa (Comissão de 2)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* Visualização dos Grupos Gerados */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded min-h-[200px]">
              <span className="text-[11px] font-mono text-neutral-500 uppercase block mb-3">
                {cenarioOrdem === 'arranjo'
                  ? 'Todos os 12 Resultados Ordenados (Arranjo A(4,2)):'
                  : 'Os 6 Grupos Únicos (Combinação C(4,2) = 12 / 2!):'}
              </span>

              {cenarioOrdem === 'arranjo' ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 font-mono text-xs">
                  {todosArranjos.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-black border border-cyan-900/60 rounded text-center text-cyan-300"
                    >
                      ({item.p1}, {item.p2})
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {combinacoesUnicas.map((par, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-black border border-emerald-900/60 rounded text-center text-emerald-300 flex flex-col justify-center"
                    >
                      <span className="text-white font-bold">&#123; {par[0]}, {par[1]} &#125;</span>
                      <span className="text-[10px] text-neutral-500 mt-1">Fundiu ({par[0]},{par[1]}) e ({par[1]},{par[0]})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Painel Algébrico Explicativo */}
            <div className="space-y-3 font-mono text-xs">
              {cenarioOrdem === 'arranjo' ? (
                <>
                  <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                    <div className="text-neutral-400">1º Passo (1º Lugar): 4 candidatos disponíveis.</div>
                    <div className="text-neutral-400">2º Passo (2º Lugar): 3 candidatos restantes.</div>
                    <div className="text-cyan-400 font-bold text-sm pt-1">
                      Total = 4 × 3 = 12 arranjos diferentes.
                    </div>
                  </div>
                  <div className="p-3 bg-cyan-950/20 border border-cyan-800 rounded text-[11px] text-neutral-300 font-sans leading-relaxed">
                    Aqui, (A em 1º, B em 2º) é uma realidade completamente diferente de (B em 1º, A em 2º). Como os papéis são distintos, cada permutação conta!
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                    <div className="text-neutral-400">Cálculo inicial (como se houvesse ordem): 4 × 3 = 12.</div>
                    <div className="text-neutral-400">Permutações internas entre 2 pessoas: 2! = 2 × 1 = 2.</div>
                    <div className="text-emerald-400 font-bold text-sm pt-1">
                      C(4, 2) = 12 / 2! = 6 comissões únicas.
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-950/20 border border-emerald-800 rounded text-[11px] text-neutral-300 font-sans leading-relaxed">
                    A comissão formada por Alice e Bob é rigorosamente idêntica à comissão formada por Bob e Alice. Dividimos por <strong>2!</strong> para queimar os clones que contavam duas vezes!
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 4. PILAR 03: PERMUTAÇÃO COM REPETIÇÃO (ANAGRAMAS) */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Permutação com Repetição: O Cancelamento de Elementos Gêmeos
          </h2>
        </div>

        <p>
          Quantos anagramas possui a palavra <strong>BATATA</strong>?
          <br />
          Se todas as letras fossem diferentes (como B, A₁, T₁, A₂, T₂, A₃), teríamos <code className="text-white font-mono">6! = 720</code> anagramas. Mas as letras &quot;A&quot; são idênticas entre si, e as letras &quot;T&quot; também são idênticas.
        </p>

        <p className="text-neutral-300">
          Se você trocar de posição a letra A₁ com a letra A₂, a palavra final continua sendo exatamente a mesma. Por isso, <strong>dividimos pelo fatorial de cada repetição</strong> para cancelar essas permutações invisíveis:
        </p>

        <div className="p-6 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-center my-6 space-y-2">
          <div className="text-2xl font-mono text-white font-bold tracking-wider">
            P<sub>n</sub><sup>(α, β, γ...)</sup> = n! / (α! · β! · γ!...)
          </div>
          <p className="text-xs text-neutral-300 font-mono">
            BATATA (6 letras: 3 As e 2 Ts) &rarr; P₆^(3,2) = 6! / (3! · 2!) = 720 / (6 · 2) = 60 anagramas reais.
          </p>
        </div>
      </section>

      {/* 5. PILAR 04: TRIÂNGULO DE PASCAL E BINÔMIO DE NEWTON COM SIMULADOR */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            O Triângulo de Pascal e o Binômio de Newton
          </h2>
        </div>

        <p>
          Como expandir potências gigantes como <code className="text-cyan-300 font-mono font-bold">(x + y)⁵</code> sem passar horas multiplicando polinômios na mão?
          <br />
          Isaac Newton e Blaise Pascal demonstraram que os coeficientes numéricos dessa multiplicação são exatamente as combinações dispostas no <strong>Triângulo de Pascal</strong>:
        </p>

        {/* SIMULADOR INTERATIVO: O TRIÂNGULO DE PASCAL E NEWTON */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador Dinâmico: A Pirâmide de Coeficientes de Newton
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Altere o expoente n do binômio (x + y)ⁿ para ver a linha correspondente acender:
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black border border-neutral-800 p-2 px-3 rounded">
              <span className="text-xs font-mono text-neutral-400 uppercase">Expoente n:</span>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={expoenteN}
                onChange={(e) => setExpoenteN(parseInt(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold w-6 text-center">{expoenteN}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            
            {/* SVG do Triângulo de Pascal Piramidal */}
            <div className="bg-neutral-950 border border-neutral-800 rounded relative aspect-[4/3] w-full max-w-[380px] mx-auto overflow-hidden p-3 flex items-center justify-center">
              <svg viewBox="0 0 240 180" className="w-full h-full">
                {trianguloCompleto.map((linha, rIdx) => {
                  const totalElems = linha.length;
                  const isLinhaAtiva = rIdx === expoenteN;
                  const yPos = 25 + rIdx * 26;

                  return (
                    <g key={rIdx}>
                      {linha.map((val, cIdx) => {
                        // Centralização piramidal
                        const startX = 120 - ((totalElems - 1) * 32) / 2;
                        const xPos = startX + cIdx * 32;

                        return (
                          <g key={cIdx}>
                            <circle
                              cx={xPos}
                              cy={yPos}
                              r="11"
                              fill={isLinhaAtiva ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.03)'}
                              stroke={isLinhaAtiva ? '#06b6d4' : '#333'}
                              strokeWidth={isLinhaAtiva ? '1.5' : '1'}
                            />
                            <text
                              x={xPos}
                              y={yPos + 4}
                              fill={isLinhaAtiva ? '#ffffff' : '#777'}
                              fontSize="9"
                              fontFamily="monospace"
                              textAnchor="middle"
                              fontWeight={isLinhaAtiva ? 'bold' : 'normal'}
                            >
                              {val}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-1 rounded border border-neutral-800">
                <span className="text-cyan-400">Linha ativa: n = {expoenteN}</span>
              </div>
            </div>

            {/* Painel da Expansão Algébrica de Newton */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400">Coeficientes Binomiais da Linha {expoenteN}:</div>
                <div className="text-cyan-400 font-bold text-sm tracking-wider">
                  [ {coeficientesAtivos.join(', ')} ]
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800 rounded space-y-1">
                <div className="text-neutral-400">Desenvolvimento de (x + y)<sup>{expoenteN}</sup>:</div>
                <div className="text-white font-bold text-sm py-1">
                  {formatarExpansao(expoenteN, coeficientesAtivos)}
                </div>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded flex justify-between items-center">
                <span className="text-neutral-400">Soma de Todos os Elementos da Linha:</span>
                <span className="text-emerald-400 font-bold text-base">2<sup>{expoenteN}</sup> = {somaLinha}</span>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-neutral-400 leading-relaxed font-sans">
                <strong className="text-white font-mono">Relação de Stifel:</strong> Repare no triângulo: a soma de dois números vizinhos de uma linha gera exatamente o número posicionado logo abaixo deles! Exemplo: 1 + 2 = 3; 3 + 3 = 6.
              </div>
            </div>

          </div>
        </div>

        {/* FÓRMULA DO TERMO GERAL */}
        <div className="p-5 border border-neutral-800 bg-[#070707] rounded-sm space-y-2 text-center font-mono">
          <div className="text-xl text-white font-bold">
            T<sub>k+1</sub> = C(n, k) · a<sup>(n - k)</sup> · b<sup>k</sup>
          </div>
          <p className="text-xs text-neutral-400 font-sans font-light">
            Permite caçar qualquer termo específico da expansão sem precisar escrever todos os outros!
          </p>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Domine as Escolhas e Permutações
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use as lousas de trabalho integradas para montar os tracinhos do PFC, verificar se a ordem importa e cancelar repetições antes de validar sua resposta!
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
                        {acertou ? 'Raciocínio combinatório cirúrgico!' : 'Atenção às restrições e repetições! Veja a dedução:'}
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
                      O Pulo do Gato Combinatório:
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 19:</p>
        <p className="leading-relaxed">
          Você dominou as técnicas de contagem lógica e a expansão binomial. Entender o filtro que diferencia arranjos de combinações e enxergar o Triângulo de Pascal como um mapa geométrico de coeficientes prepara você com máxima maturidade analítica. No próximo caderno (<strong>Doc 20: Probabilidade - Espaço Amostral, Eventos e Probabilidade Condicional</strong>), usaremos exatamente essa infraestrutura combinatória para calcular a probabilidade de eventos, testes médicos e tomada de decisão sob incerteza!
        </p>
      </footer>

    </article>
  );
}