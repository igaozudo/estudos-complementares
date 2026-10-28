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
            ✏️ Fatorar / Desenhar
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
              Monte divisões sucessivas, fatores primos e contas com o mouse ou dedo
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Rascunhe os múltiplos, divisores e fatores primos antes de marcar a opção..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 02 - PRIMOS, DIVISIBILIDADE E ARITMÉTICA REAL
// =========================================================================
export default function Doc02Matematica() {
  // Simulador do Desmontador de Primos
  const exemplosPrimos = [
    { num: 12, fatores: '2 × 2 × 3 (ou 2² × 3)', tipo: 'Composto', lego: ['2', '2', '3'] },
    { num: 30, fatores: '2 × 3 × 5', tipo: 'Composto', lego: ['2', '3', '5'] },
    { num: 45, fatores: '3 × 3 × 5 (ou 3² × 5)', tipo: 'Composto', lego: ['3', '3', '5'] },
    { num: 60, fatores: '2 × 2 × 3 × 5 (ou 2² × 3 × 5)', tipo: 'Composto', lego: ['2', '2', '3', '5'] },
    { num: 97, fatores: '97 (Não divide por ninguém além de 1 e dele mesmo)', tipo: 'Primo Puro', lego: ['97'] },
  ];
  const [exemploAtivo, setExemploAtivo] = useState(exemplosPrimos[0]);

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
      tema: 'Resto de Divisão e Calendários (Aritmética Modular)',
      pergunta: 'Se hoje é uma terça-feira, daqui a exatamente 100 dias será qual dia da semana? Como a divisão com resto resolve isso em 5 segundos?',
      opcoes: [
        { idx: 0, texto: 'A) Quinta-feira; porque 100 dividido por 7 dá resto 2.', correta: true },
        { idx: 1, texto: 'B) Terça-feira; porque 100 é um número par.', correta: false },
        { idx: 2, texto: 'C) Quarta-feira; porque 100 dividido por 7 dá resto 1.', correta: false },
        { idx: 3, texto: 'D) Domingo; porque passaram-se 14 semanas completas.', correta: false },
      ],
      explicacao: [
        'Essa é a mágica do resto na vida real (o que na faculdade chamam de Aritmética Modular):',
        '1. A semana é um ciclo fechado que se repete a cada 7 dias (terça, quarta, quinta, sexta, sábado, domingo, segunda...).',
        '2. Fazemos a divisão com resto: 100 ÷ 7 = 14 semanas completas, com RESTO 2.',
        '3. As 14 semanas inteiras não importam, pois após cada 7 dias volta a ser terça-feira.',
        '4. O que manda no futuro é apenas o RESTO: avance 2 dias a partir de terça-feira. Terça + 1 = quarta; Terça + 2 = QUINTA-FEIRA! Alternativa A.',
      ],
    },
    {
      id: 2,
      tema: 'O Teorema Fundamental da Aritmética',
      pergunta: 'Por que os matemáticos proibiram categoricamente o número 1 de ser classificado como número primo?',
      opcoes: [
        { idx: 0, texto: 'A) Porque o 1 é um número ímpar com propriedades nulas.', correta: false },
        { idx: 1, texto: 'B) Porque se 1 fosse primo, a decomposição em fatores primos deixaria de ser única (ex: 6 = 2 × 3 = 1 × 2 × 3 = 1 × 1 × 2 × 3...), quebrando toda a aritmética.', correta: true },
        { idx: 2, texto: 'C) Porque os gregos antigos não consideravam o 1 como um número.', correta: false },
        { idx: 3, texto: 'D) Porque o número 1 não tem raiz quadrada exata.', correta: false },
      ],
      explicacao: [
        'A resposta é elegante e lógica:',
        '• O Teorema Fundamental da Aritmética diz que todo número inteiro maior que 1 tem uma ÚNICA impressão digital formada por multiplicação de primos (como 6 = 2 × 3).',
        '• Se o 1 fosse considerado primo, essa impressão digital seria destruída! Você poderia escrever: 6 = 2 × 3, ou 6 = 1 × 2 × 3, ou 6 = 1 × 1 × 1 × 2 × 3... Infinitas formas diferentes para o mesmo número!',
        'Para manter a fábrica dos números organizada e com DNA único, o 1 é classificado como Elemento Neutro, e os primos começam no 2. Alternativa B!',
      ],
    },
    {
      id: 3,
      tema: 'Problema Prático de MDC (O Maior Corte Comum)',
      pergunta: 'Um marceneiro tem duas tábuas de madeira de lei: uma mede 180 cm e a outra mede 240 cm. Ele quer cortar as duas tábuas em pedaços do MESMO tamanho, no MAIOR comprimento possível, sem que sobre nenhuma lasca de madeira. Qual deve ser o tamanho de cada pedaço e quantos pedaços ele terá no total?',
      opcoes: [
        { idx: 0, texto: 'A) Cada pedaço terá 30 cm; totalizando 14 pedaços.', correta: false },
        { idx: 1, texto: 'B) Cada pedaço terá 60 cm; totalizando 7 pedaços.', correta: true },
        { idx: 2, texto: 'C) Cada pedaço terá 120 cm; totalizando 3 pedaços.', correta: false },
        { idx: 3, texto: 'D) Cada pedaço terá 20 cm; totalizando 21 pedaços.', correta: false },
      ],
      explicacao: [
        'Identificando a ferramenta: Quando o problema fala em "dividir em partes iguais", "no maior tamanho possível" e "sem sobras", trata-se de MDC (Maior Divisor Comum)!',
        '1. Fatorando 180: 180 = 2² × 3² × 5.',
        '2. Fatorando 240: 240 = 2⁴ × 3 × 5.',
        '3. Cálculo do MDC: Pegamos os fatores comuns com os MENORES expoentes: 2² × 3¹ × 5¹ = 4 × 3 × 5 = 60 cm!',
        '4. Quantos pedaços foram gerados? Da tábua de 180 cm saem 180 ÷ 60 = 3 pedaços. Da tábua de 240 cm saem 240 ÷ 60 = 4 pedaços. Total: 3 + 4 = 7 pedaços de 60 cm cada. Alternativa B!',
      ],
    },
    {
      id: 4,
      tema: 'Problema Prático de MMC (O Ponto de Encontro no Tempo)',
      pergunta: 'Em uma linha de produção, a máquina A passa por revisão a cada 12 dias, e a máquina B passa por revisão a cada 18 dias. Se hoje ambas as máquinas estão passando por revisão juntas, daqui a quantos dias esse evento voltará a acontecer simultaneamente?',
      opcoes: [
        { idx: 0, texto: 'A) Daqui a 6 dias.', correta: false },
        { idx: 1, texto: 'B) Daqui a 72 dias.', correta: false },
        { idx: 2, texto: 'C) Daqui a 36 dias.', correta: true },
        { idx: 3, texto: 'D) Daqui a 216 dias.', correta: false },
      ],
      explicacao: [
        'Identificando a ferramenta: Quando o problema fala em "eventos com ciclos diferentes que voltam a acontecer juntos no futuro", trata-se de MMC (Mínimo Múltiplo Comum)!',
        '1. Ciclos da máquina A: 12, 24, 36, 48, 60, 72...',
        '2. Ciclos da máquina B: 18, 36, 54, 72...',
        '3. O primeiro número que aparece nas duas listas ao mesmo tempo é o 36!',
        '4. Pela fatoração conjunta: 12 = 2² × 3; 18 = 2 × 3². O MMC pega os MAIORES expoentes de todos os fatores: 2² × 3² = 4 × 9 = 36 dias. Daqui a 36 dias elas sincronizam novamente. Alternativa C!',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 02 • Módulo 1: Aritmética e Teoria dos Números
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Primos e Divisibilidade: <br />
          <span className="text-cyan-400 font-light">Os átomos que constroem todos os números</span>
        </h1>
        <p className="text-base md:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl mb-4">
          Assim como toda matéria do universo físico é feita de átomos químicos combinados (hidrogênio, oxigênio, carbono), <strong>toda a matemática é construída a partir de peças fundamentais indivisíveis: os Números Primos</strong>. Quando você aprende a quebrar um número em seus primos, contas gigantescas de frações, raízes e álgebra viram uma brincadeira de montar blocos de Lego.
        </p>
      </section>

      {/* 2. PILAR 01: O QUE É DIVIDIR COM RESTO? */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 01</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            A Divisão Euclidiana: Caixas Fechadas e o que Sobra
          </h2>
        </div>

        <p>
          Na calculadora, você digita <code className="text-white">14 ÷ 4</code> e ela cospe <code className="text-cyan-300">3,5</code>. Mas no mundo real das coisas inteiras (pessoas, dias, caixas, carros), você não corta as coisas em decimais.
        </p>

        <p className="text-neutral-200">
          Pense em uma granja empacotando ovos:
        </p>

        <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-4 my-6">
          <h3 className="text-white font-medium text-base font-mono">
            Você tem 14 ovos e caixas que cabem exatamente 4 ovos cada:
          </h3>
          <ul className="space-y-2 text-sm text-neutral-300 font-light pl-4 border-l border-neutral-800">
            <li>• Você enche a 1ª caixa (usou 4 ovos, sobram 10).</li>
            <li>• Você enche a 2ª caixa (usou mais 4 ovos, sobram 6).</li>
            <li>• Você enche a 3ª caixa (usou mais 4 ovos, sobram 2 ovos na mesa).</li>
            <li>• Dá para encher uma 4ª caixa? <strong>Não!</strong> Faltam ovos. Esses 2 ovos que ficaram na mesa são o <strong>RESTO</strong>.</li>
          </ul>

          <div className="p-4 bg-black border border-neutral-800 font-mono text-xs md:text-sm text-cyan-300">
            Fórmula Real: 14 = (4 caixas × 3 ovos) + 2 de resto <br />
            No Ensino Médio chamam isso de: Dividendo = (Divisor × Quociente) + Resto
          </div>

          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            <strong>A Regra de Ouro do Resto:</strong> O resto NUNCA pode ser igual ou maior que a caixa! Se sobraram 4 ovos ou mais, significa que você foi preguiçoso e deixou de encher mais uma caixa inteira. O resto de uma divisão por 4 só pode ser 0, 1, 2 ou 3.
          </p>
        </div>
      </section>

      {/* 3. PILAR 02: CRITÉRIOS DE DIVISIBILIDADE SEM DECOREBA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 02</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Critérios de Divisibilidade: O Truque dos Algarismos Revelado
          </h2>
        </div>

        <p>
          Você já deve ter ouvido: <em>"Para saber se um número divide por 3, some os dígitos dele. Se a soma der na tabuada do 3, o número divide!"</em>. Por exemplo: 123 → 1 + 2 + 3 = 6 (divide por 3).
        </p>

        <p className="text-neutral-300">
          Mas <strong>por que</strong> isso funciona? Não é feitiçaria, é pura decomposição decimal:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">1. A Mágica do Número 3 e do 9</span>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Pense no número 100: ele é <code className="text-cyan-300">99 + 1</code>.<br />
              Pense no número 10: ele é <code className="text-cyan-300">9 + 1</code>.<br />
              Repare que 99 e 9 já são divisíveis perfeitos por 3 e por 9!
              <br /><br />
              Quando você quebra qualquer número (como 235), você está separando os blocos que já são múltiplos de 9 (200 vira 2×99 + 2; 30 vira 3×9 + 3). O que sobra no final da conta para você testar? <strong>Exatamente os algarismos soltos somados: 2 + 3 + 5!</strong>
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">2. Por Que o 2 e o 5 Só Olham o Final?</span>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Toda dezena, centena ou milhar (10, 100, 1000) é terminada em zero e é <strong>sempre divisível por 2 e por 5</strong>.
              <br /><br />
              Não importa se o número é 9.876.540: toda a parte da frente já é um múltiplo perfeito de 10. A única parte que pode estragar a festa é o <strong>último algarismo</strong>. Se o último for par, divide por 2; se for 0 ou 5, divide por 5!
            </p>
          </div>
        </div>
      </section>

      {/* 4. PILAR 03: OS NÚMEROS PRIMOS E O DESMONTADOR ATÔMICO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 03</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Números Primos: As Peças de Lego do Universo
          </h2>
        </div>

        <p>
          Um número é chamado de <strong>Primo</strong> quando ele é uma peça sólida única: ele só pode ser dividido de forma exata por <strong>1 e por ele mesmo</strong> (como 2, 3, 5, 7, 11, 13, 17, 19...).
        </p>

        <p className="text-neutral-400">
          Todos os outros números são chamados de <strong>Compostos</strong>, porque são castelos montados multiplicando esses primos. O número 12, por exemplo, não é uma coisa só: ele é o disfarce de <code className="text-cyan-300 font-mono">2 × 2 × 3</code>.
        </p>

        {/* LABORATÓRIO: O DESMONTADOR ATÔMICO */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
              Laboratório Interativo: Desmontador de Números
            </span>
            <p className="text-sm text-neutral-300 font-light">
              Clique em um número abaixo para ver seus blocos de Lego primos revelados:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {exemplosPrimos.map((item) => (
              <button
                key={item.num}
                onClick={() => setExemploAtivo(item)}
                className={`px-4 py-2 font-mono text-xs rounded transition-all border ${
                  exemploAtivo.num === item.num
                    ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                Número {item.num}
              </button>
            ))}
          </div>

          <div className="p-6 bg-black border border-neutral-800 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase block mb-1">Classificação:</span>
              <div className="text-xl font-mono text-white font-bold">{exemploAtivo.tipo}</div>
              <p className="text-xs text-neutral-400 font-mono mt-2">
                Fatoração em Primos: <span className="text-cyan-400 font-bold">{exemploAtivo.fatores}</span>
              </p>
            </div>

            {/* Peças Visuais de Lego */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs font-mono text-neutral-600 mr-2">Blocos Atômicos:</span>
              {exemploAtivo.lego.map((bloco, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 border-2 border-cyan-500/80 bg-cyan-950/30 rounded flex items-center justify-center font-mono font-bold text-lg text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                >
                  {bloco}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PILAR 04: MDC VS MMC SEM CONFUSÃO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">Pilar 04</span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            MDC e MMC: O Fatiador Comum vs. O Encontro no Futuro
          </h2>
        </div>

        <p>
          Quase todo mundo confunde as siglas MDC e MMC porque decoram o método da barrinha vertical sem saber quando usar cada um. Guarde esta distinção mental simples:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">
              MDC = O FATIADOR MÁXIMO (DIVISÃO)
            </span>
            <h4 className="text-white font-medium text-base">Palavras-chave: Cortar, Repartir, Sem Sobras</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Você usa <strong>MDC (Maior Divisor Comum)</strong> quando tem coisas de tamanhos diferentes (como duas cordas de 12 metros e 18 metros) e quer cortá-las em <strong>pedaços iguais do maior tamanho possível</strong>.
              <br /><br />
              O MDC de 12 e 18 é <strong>6 metros</strong> (ambas podem ser cortadas em pedaços exatos de 6 metros sem jogar nenhum fiapo no lixo).
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">
              MMC = O PONTO DE SINCRONIA (MULTIPLICAÇÃO)
            </span>
            <h4 className="text-white font-medium text-base">Palavras-chave: Coincidência, Ciclos, Próximo Encontro</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Você usa <strong>MMC (Mínimo Múltiplo Comum)</strong> quando tem coisas que acontecem em tempos diferentes e quer saber <strong>quando elas vão se cruzar de novo no futuro</strong>.
              <br /><br />
              Se um remédio é tomado de 4 em 4 horas e outro de 6 em 6 horas, quando você toma os dois juntos? No MMC de 4 e 6: <strong>daqui a 12 horas</strong>!
            </p>
          </div>
        </div>

        {/* PROPRIEDADE DE OURO PARA O VESTIBULAR */}
        <div className="p-4 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-xs md:text-sm text-neutral-300 font-mono leading-relaxed">
          <strong className="text-cyan-400 uppercase block mb-1">
            Propriedade Secreta do Ensino Médio:
          </strong>
          Para quaisquer dois números A e B, se você multiplicar o MDC deles pelo MMC deles, o resultado dá exatamente A × B:
          <br />
          <code className="text-white font-bold">MDC(A, B) × MMC(A, B) = A × B</code>
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">Prática Ativa</span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Rabisque na Lousa e Prove Seu Raciocínio
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Não tente fazer de cabeça. Abra a lousa de cada questão para fazer a fatoração prima, testar os múltiplos e divisores, marcar a alternativa e validar.
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
                        {acertou ? 'Excelente dedução aritmética!' : 'Ainda não foi dessa vez. Veja a resolução abaixo:'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">Conclusão do Doc 02:</p>
        <p className="leading-relaxed">
          Compreender primos, divisores, restos, MDC e MMC significa dominar o esqueleto da aritmética. No próximo caderno (<strong>Doc 03: Potenciação, Radiciação e Álgebra Elementar</strong>), usaremos essas multiplicações repetidas para entender o poder dos expoentes e a verdadeira lógica das raízes quadradas.
        </p>
      </footer>

    </article>
  );
}