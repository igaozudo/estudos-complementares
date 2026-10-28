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

  const iniciarDesenho = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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

  const desenhar = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">
            Lousa de Trabalho #{id}
          </span>
          <button
            onClick={() => setModo('desenho')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'desenho'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ✏️ Rabiscar / Equações
          </button>
          <button
            onClick={() => setModo('texto')}
            className={`px-2.5 py-1 rounded transition-colors ${
              modo === 'texto'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⌨️ Anotações em Texto
          </button>
        </div>

        <button
          onClick={
            modo === 'desenho' ? limparLousa : () => setRascunhoTexto('')
          }
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
              Desenhe raízes, potências e passagens com o mouse ou dedo
            </span>
          </div>
        ) : (
          <textarea
            value={rascunhoTexto}
            onChange={(e) => setRascunhoTexto(e.target.value)}
            placeholder="Rascunhe aqui suas contas e simplificações antes de marcar a alternativa..."
            rows={5}
            className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// DOCUMENTO PRINCIPAL: DOC 03 - POTENCIAÇÃO, RADICIAÇÃO E ÁLGEBRA ELEMENTAR
// =========================================================================
export default function Doc03Matematica() {
  // Simulador Interativo da Escala de Potências (Base 2)
  const [expoente, setExpoente] = useState(3);

  const valoresBase2: {
    [key: number]: { resultado: string; explicacao: string };
  } = {
    [-3]: { resultado: '1/8 (0,125)', explicacao: '1 ÷ 2 ÷ 2 ÷ 2 = 1 / 2³' },
    [-2]: { resultado: '1/4 (0,25)', explicacao: '1 ÷ 2 ÷ 2 = 1 / 2²' },
    [-1]: { resultado: '1/2 (0,5)', explicacao: '1 ÷ 2 = 1 / 2¹' },
    [0]: {
      resultado: '1',
      explicacao: 'O ponto de equilíbrio neutro da multiplicação',
    },
    [1]: { resultado: '2', explicacao: '1 × 2' },
    [2]: { resultado: '4', explicacao: '1 × 2 × 2' },
    [3]: { resultado: '8', explicacao: '1 × 2 × 2 × 2' },
    [4]: { resultado: '16', explicacao: '1 × 2 × 2 × 2 × 2' },
  };

  // Exercícios
  const [selecao, setSelecao] = useState<{ [key: number]: number | null }>({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [confirmadas, setConfirmadas] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [abrirResolucao, setAbrirResolucao] = useState<{
    [key: number]: boolean;
  }>({ 1: false, 2: false, 3: false, 4: false });
  const [lousaAberta, setLousaAberta] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: false,
    4: false,
  });

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
      tema: 'Expoente Zero e Negativo',
      pergunta:
        'Qual é o valor exato da expressão aritmética: (3⁰ + 3⁻¹) ÷ 3⁻²?',
      opcoes: [
        { idx: 0, texto: 'A) 4', correta: false },
        { idx: 1, texto: 'B) 12', correta: true },
        { idx: 2, texto: 'C) 36', correta: false },
        { idx: 3, texto: 'D) 4/27', correta: false },
      ],
      explicacao: [
        'Vamos desarmar a expressão peça por peça:',
        '1. Primeiro termo: 3⁰ = 1 (qualquer base diferente de zero elevada a zero vale 1).',
        '2. Segundo termo: 3⁻¹ = 1/3 (o expoente negativo inverte a base).',
        '3. Somando o numerador: 1 + 1/3 = 3/3 + 1/3 = 4/3.',
        '4. O denominador: 3⁻² = 1 / (3²) = 1/9.',
        '5. Divisão final de frações: (4/3) ÷ (1/9) = (4/3) × 9 = 36/3 = 12.',
        'Alternativa B correta!',
      ],
    },
    {
      id: 2,
      tema: 'Expoente Fracionário (Regra do Sol e da Sombra)',
      pergunta:
        'Ao simplificar a potência de expoente fracionário 16^(3/4), que número real obtemos?',
      opcoes: [
        { idx: 0, texto: 'A) 8', correta: true },
        { idx: 1, texto: 'B) 12', correta: false },
        { idx: 2, texto: 'C) 6', correta: false },
        { idx: 3, texto: 'D) 64', correta: false },
      ],
      explicacao: [
        'A regra do expoente fracionário transforma potência em raiz:',
        '1. Na fração 3/4: o 3 está "por cima" (no sol) e o 4 está "por baixo" (na sombra).',
        '2. Convertendo para raiz: quem está na sombra vai para o índice da raiz (√⁴), e quem está no sol vai para o expoente interno (16³).',
        '3. Fica: ⁴√(16³). É muito mais fácil extrair a raiz primeiro e elevar depois!',
        '4. Qual número multiplicado por si mesmo 4 vezes dá 16? É o 2, pois 2 × 2 × 2 × 2 = 16. Então ⁴√16 = 2.',
        '5. Agora elevamos ao cubo: 2³ = 2 × 2 × 2 = 8. Alternativa A correta!',
      ],
    },
    {
      id: 3,
      tema: 'A Grande Pegadinha da Raiz Quadrada',
      pergunta:
        'Muitos estudantes cortam a raiz quadrada com o expoente 2 de forma mecânica e afirmam que √((-7)²) = -7. Qual é o valor real da expressão e por que a resposta anterior está errada?',
      opcoes: [
        {
          idx: 0,
          texto:
            'A) O resultado é -7, porque a operação inversa da potência de 2 é a raiz quadrada.',
          correta: false,
        },
        {
          idx: 1,
          texto:
            'B) O resultado é +7, porque (-7)² é +49, e a raiz quadrada principal de um número positivo é sempre positiva.',
          correta: true,
        },
        {
          idx: 2,
          texto: 'C) O resultado não existe no conjunto dos números reais.',
          correta: false,
        },
        {
          idx: 3,
          texto: 'D) O resultado é ±7 obrigatoriamente.',
          correta: false,
        },
      ],
      explicacao: [
        'Essa pegadinha cai em peso no ENEM, na Fuvest e no Cálculo 1:',
        '1. Ordem de precedência: primeiro você resolve o que está dentro da raiz. (-7)² = (-7) × (-7) = +49.',
        '2. Agora extraímos a raiz: √49. Por definição matemática universal, o símbolo de raiz (√) representa a raiz aritmética PRINCIPAL, que é estritamente não-negativa. Logo, √49 = +7.',
        '3. A propriedade rigorosa que conecta tudo: √(x²) = |x| (o módulo de x).',
        'Cortar a raiz direto com o expoente sem passar pelo módulo faz você perder o sinal positivo! Alternativa B.',
      ],
    },
    {
      id: 4,
      tema: 'Álgebra Elementar e a Balança de Dois Pratos',
      pergunta:
        'Em uma balança de pratos perfeitamente em equilíbrio: no prato esquerdo há 3 caixas idênticas de parafusos (peso x) mais um peso sólido de 4 kg. No prato direito há 1 caixa idêntica mais um peso sólido de 16 kg. Qual é o peso exato de cada caixa x?',
      opcoes: [
        { idx: 0, texto: 'A) x = 12 kg', correta: false },
        { idx: 1, texto: 'B) x = 4 kg', correta: false },
        { idx: 2, texto: 'C) x = 6 kg', correta: true },
        { idx: 3, texto: 'D) x = 10 kg', correta: false },
      ],
      explicacao: [
        'Essa é a fundação da Álgebra: manter a balança sempre em equilíbrio!',
        '1. Montando a equação da balança: 3x + 4 = x + 16.',
        '2. Tire 1 caixa (x) dos dois pratos para simplificar: (3x - x) + 4 = 16 → 2x + 4 = 16.',
        '3. Agora tire 4 kg de chumbo dos dois pratos: 2x = 16 - 4 → 2x = 12.',
        '4. Se 2 caixas pesam 12 kg juntas, quanto pesa 1 caixa? Divida os dois pratos por 2: x = 12 ÷ 2 = 6 kg.',
        'Você não "passou para o outro lado trocando de sinal" por mágica: você simplesmente removeu pesos iguais de ambos os pratos! Alternativa C correta.',
      ],
    },
  ];

  return (
    <article className="space-y-20 text-neutral-300 font-light text-base leading-relaxed pb-28 font-sans">
      {/* 1. CABEÇALHO */}
      <section className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12 rounded-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-3">
          Doc 03 • Módulo 1: Aritmética e Teoria dos Números
        </span>
        <h1 className="text-3xl md:text-5xl font-normal text-white tracking-tight mb-6 leading-tight">
          Potências, Raízes e Álgebra: <br />
          <span className="text-cyan-400 font-light">
            A aceleração do cálculo e a entrada das letras
          </span>
        </h1>
        <p className="text-base md:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl mb-4">
          Nos cadernos anteriores, você aprendeu a se mover na reta
          (soma/subtração), a calcular áreas planas (multiplicação) e a
          desmontar números em fatores primos. Agora, nós vamos colocar um{' '}
          <strong>motor turbo</strong> na matemática: entenderemos como
          multiplicar repetidamente cria potências explosivas, como a raiz faz o
          caminho reverso e por que as letras da álgebra são apenas caixas
          transparentes esperando por um valor.
        </p>
      </section>

      {/* 2. PILAR 01: POTENCIAÇÃO COMO DIMENSÃO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">
            Pilar 01
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Potenciação: A Geometria das Dimensões (Linha, Área e Volume)
          </h2>
        </div>

        <p>
          Por que chamamos x² de <em>"x ao quadrado"</em> e x³ de{' '}
          <em>"x ao cubo"</em>? Porque potências não são truques abstratos: são{' '}
          <strong>dimensões no espaço</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">
              1ª Dimensão: x¹
            </span>
            <h4 className="text-white font-medium text-base">
              A Linha (Comprimento)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Uma corda esticada no chão de 3 metros. Você só anda para a frente
              ou para trás. Tem apenas uma dimensão (1D).
              <br />
              <br />
              <code className="text-cyan-300 font-mono">3¹ = 3 metros</code>
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">
              2ª Dimensão: x²
            </span>
            <h4 className="text-white font-medium text-base">
              O Quadrado (Área Plana)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Um piso de cerâmica com 3 metros de largura por 3 metros de
              altura. Preenche uma superfície de 9 metros quadrados.
              <br />
              <br />
              <code className="text-sky-300 font-mono">3² = 3 × 3 = 9 m²</code>
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-5 rounded-sm space-y-2">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold block">
              3ª Dimensão: x³
            </span>
            <h4 className="text-white font-medium text-base">
              O Cubo (Volume Espacial)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Uma caixa d'água cúbica com 3 metros de largura, 3 de altura e 3
              de profundidade. Comporta 27 metros cúbicos de água!
              <br />
              <br />
              <code className="text-amber-300 font-mono">
                3³ = 3 × 3 × 3 = 27 m³
              </code>
            </p>
          </div>
        </div>
      </section>

      {/* 3. PILAR 02: O ELEVADOR DOS EXPOENTES E POR QUE x⁰ = 1 */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">
            Pilar 02
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Por Que Qualquer Número Elevado a Zero é Igual a 1?
          </h2>
        </div>

        <p>
          Quase todo mundo decora que <em>"número elevado a zero dá 1"</em> sem
          entender a razão. Vamos matar essa dúvida observando o padrão de um
          elevador:
        </p>

        {/* SIMULADOR INTERATIVO DE POTÊNCIAS */}
        <div className="border border-neutral-800 bg-[#060606] p-6 md:p-8 rounded-sm space-y-6 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                Simulador do Elevador de Potências (Base 2)
              </span>
              <p className="text-sm text-neutral-300 font-light mt-1">
                Subir um degrau multiplica por 2. Descer um degrau divide por 2.
              </p>
            </div>

            {/* Seletor de Expoentes */}
            <div className="flex items-center gap-2">
              {[-3, -2, -1, 0, 1, 2, 3, 4].map((exp) => (
                <button
                  key={exp}
                  onClick={() => setExpoente(exp)}
                  className={`w-8 h-8 font-mono text-xs rounded transition-all border ${
                    expoente === exp
                      ? 'border-cyan-400 bg-cyan-950 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-black border border-neutral-800 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase block mb-1">
                Conta:
              </span>
              <div className="text-3xl font-mono text-white font-bold">
                <span>2</span>
                <sup className="text-cyan-400 text-xl font-mono">
                  {expoente}
                </sup>{' '}
                = {valoresBase2[expoente].resultado}
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-2">
                Mecanismo Físico:{' '}
                <span className="text-cyan-300">
                  {valoresBase2[expoente].explicacao}
                </span>
              </p>
            </div>

            <div className="text-xs text-neutral-400 max-w-xs font-light leading-relaxed border-l border-neutral-800 pl-4">
              {expoente > 0 &&
                'Você está no andar de cima: multiplicando o ponto neutro (1) por 2 sucessivas vezes.'}
              {expoente === 0 &&
                'O marco zero! Não multiplicou nem dividiu nada ainda. Resta o elemento neutro da multiplicação: o número 1!'}
              {expoente < 0 &&
                'Expoente negativo é o elevador descendo para o subsolo: você está pegando o 1 e DIVIDINDO por 2 sucessivas vezes!'}
            </div>
          </div>
        </div>

        <div className="p-4 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-xs md:text-sm text-neutral-300 font-mono leading-relaxed">
          <strong className="text-cyan-400 uppercase block mb-1">
            A Regra do Expoente Negativo:
          </strong>
          O sinal de menos no expoente NÃO deixa o número negativo! Ele apenas
          diz: <em>"mande o número para o andar de baixo da fração"</em>.
          <br />
          Exemplo: 5⁻² = 1 / (5²) = 1/25.
        </div>
      </section>

      {/* 4. PILAR 03: RADICIAÇÃO E A REGRA DO SOL E DA SOMBRA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">
            Pilar 03
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Radiciação: O Caminho Inverso e o Macete do Sol e da Sombra
          </h2>
        </div>

        <p>
          A radiciação não é uma operação nova e assustadora: é simplesmente{' '}
          <strong>uma investigação detetive reversa</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-cyan-400 font-mono text-xs uppercase font-bold block">
              1. A Pergunta da Raiz Quadrada
            </span>
            <div className="text-xl font-mono text-white">√36 = 6</div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              A raiz quadrada pergunta:{' '}
              <em>
                "Qual é o tamanho do lado de um piso quadrado que tem área total
                de 36 m²?"
              </em>
              <br />
              <br />
              Como 6 × 6 = 36, o lado do quadrado mede exatamente{' '}
              <strong>6 metros</strong>!
            </p>
          </div>

          <div className="border border-neutral-800 bg-[#070707] p-6 rounded-sm space-y-3">
            <span className="text-sky-400 font-mono text-xs uppercase font-bold block">
              2. A Regra do Sol e da Sombra (Expoente Fracionário)
            </span>
            <div className="text-xl font-mono text-white">x^(a/b) = ᵇ√(xᵃ)</div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Quando o expoente é uma fração, imagine uma cerca:
              <br />• O número de cima (a) está <strong>no sol</strong>: ele vai
              para dentro da raiz, ficando <strong>na sombra</strong> do telhado
              da raiz!
              <br />• O número de baixo (b) está <strong>na sombra</strong>: ele
              vai para fora, ficando <strong>no sol</strong> como o índice da
              raiz!
            </p>
          </div>
        </div>

        <div className="p-4 border border-amber-900/40 bg-amber-950/10 rounded-sm text-xs md:text-sm text-neutral-300 font-light space-y-2">
          <strong className="text-amber-400 font-mono uppercase block text-xs">
            Atenção: Por Que Não Existe Raiz Quadrada de Número Negativo nos
            Reais?
          </strong>
          <p className="leading-relaxed">
            Se alguém perguntar quanto é √(-25), você não pode responder -5.
            Faça o teste: (-5) × (-5) dá +25! E (+5) × (+5) também dá +25! Não
            existe nenhum número real que multiplicado por si mesmo resulte em
            sinal negativo. É desse beco sem saída que nascerão mais à frente os{' '}
            <strong>Números Complexos</strong> (com o número imaginário i² =
            -1).
          </p>
        </div>
      </section>

      {/* 5. PILAR 04: ÁLGEBRA ELEMENTAR E A BALANÇA */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">
            Pilar 04
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
            Álgebra Elementar: Letras São Apenas Caixas Vazias
          </h2>
        </div>

        <p>
          O maior trauma de quem estuda matemática acontece no dia em que{' '}
          <strong>"as letras se misturam com os números"</strong>. Mas uma letra
          na matemática nunca foi um enigma de português: é apenas uma{' '}
          <strong>caixa com etiqueta</strong>.
        </p>

        <p className="text-neutral-300">
          Quando escrevemos{' '}
          <code className="text-cyan-300 font-mono font-bold">2x + 3 = 11</code>
          , isso significa exatamente:
        </p>

        <div className="p-5 border border-neutral-800 bg-[#070707] rounded-sm space-y-4 my-6">
          <div className="text-sm font-mono text-neutral-200">
            "Tenho 2 caixas fechadas de peso idêntico (x) mais 3 kg de chumbo
            soltos. No total, tudo isso pesa 11 kg."
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-400 font-light">
            <div className="p-3 bg-black border border-neutral-900">
              <strong className="text-white block font-mono mb-1">
                O que a escola ensina:
              </strong>
              "Passa o 3 para o outro lado diminuindo, depois passa o 2
              dividindo." (Parece um manual de mágicas sem sentido).
            </div>

            <div className="p-3 bg-black border border-neutral-900">
              <strong className="text-cyan-400 block font-mono mb-1">
                O que você está fazendo na balança:
              </strong>
              1. Tire 3 kg de chumbo dos dois pratos: sobram 2 caixas pesando 8
              kg (11 - 3).
              <br />
              2. Se 2 caixas pesam 8 kg, divida os dois lados ao meio: cada
              caixa pesa 4 kg (8 ÷ 2)!
            </div>
          </div>
        </div>

        <div className="p-4 border border-cyan-900/40 bg-cyan-950/10 rounded-sm text-xs md:text-sm text-neutral-300 font-mono leading-relaxed">
          <strong className="text-cyan-400 uppercase block mb-1">
            O Princípio da Balança:
          </strong>
          Uma equação é uma balança de dois pratos em equilíbrio. Você pode
          fazer o que quiser nela (somar, subtrair, multiplicar ou extrair
          raiz), desde que faça{' '}
          <strong>
            exatamente a mesma coisa em ambos os lados ao mesmo tempo
          </strong>
          !
        </div>
      </section>

      {/* 6. BANCO DE TREINAMENTO ATIVO: PRÁTICA NA LOUSA */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">
            Prática Ativa
          </span>
          <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
            Treinamento Ativo: Rabisque na Lousa e Prove Seu Raciocínio
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Use a lousa de rascunho de cada questão para simplificar as
            potências, montar a balança da equação, escolher sua opção e validar
            a resposta.
          </p>
        </div>

        <div className="space-y-12">
          {questoes.map((q) => {
            const escolheu = selecao[q.id];
            const confirmou = confirmadas[q.id];
            const acertou =
              confirmou && escolheu !== null && q.opcoes[escolheu].correta;
            const lousaVisivel = lousaAberta[q.id];
            const resolucaoVisivel = abrirResolucao[q.id];

            return (
              <div
                key={q.id}
                className="border border-neutral-800 bg-[#080808] p-6 md:p-8 rounded-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    Desafio 0{q.id} • {q.tema}
                  </span>
                  <button
                    onClick={() =>
                      setLousaAberta((prev) => ({
                        ...prev,
                        [q.id]: !prev[q.id],
                      }))
                    }
                    className="text-xs font-mono text-neutral-400 hover:text-white transition-colors underline underline-offset-4 text-left"
                  >
                    {lousaVisivel
                      ? 'Ocultar Lousa ▲'
                      : 'Abrir Lousa de Trabalho ✏️ ▼'}
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
                    let visual =
                      'border-neutral-800 bg-black text-neutral-400 hover:border-neutral-600';

                    if (isSelected && !confirmou) {
                      visual =
                        'border-cyan-500 bg-cyan-950/20 text-white shadow-[0_0_10px_rgba(6,182,212,0.15)]';
                    } else if (confirmou) {
                      if (opt.correta) {
                        visual =
                          'border-emerald-500 bg-emerald-950/30 text-emerald-200 font-medium';
                      } else if (isSelected && !opt.correta) {
                        visual = 'border-red-500 bg-red-950/30 text-red-200';
                      } else {
                        visual =
                          'border-neutral-900 bg-black text-neutral-600 opacity-50';
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
                          <span className="text-xs uppercase font-bold text-emerald-400">
                            Resposta Certa ✓
                          </span>
                        )}
                        {confirmou && isSelected && !opt.correta && (
                          <span className="text-xs uppercase font-bold text-red-400">
                            Incorreto ✗
                          </span>
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
                      <span
                        className={`text-xs font-mono font-medium ${
                          acertou ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {acertou
                          ? 'Raciocínio algébrico impecável!'
                          : 'Quase lá! Veja o passo a passo mastigado abaixo:'}
                      </span>
                    )}
                  </div>

                  {confirmou && (
                    <button
                      onClick={() =>
                        setAbrirResolucao((prev) => ({
                          ...prev,
                          [q.id]: !prev[q.id],
                        }))
                      }
                      className="text-xs font-mono tracking-wider uppercase text-neutral-400 hover:text-white transition-colors"
                    >
                      {resolucaoVisivel
                        ? '▲ Fechar Explicação'
                        : '▼ Ver Resolução Passo a Passo'}
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
        <p className="font-mono text-neutral-400 uppercase tracking-wider mb-2">
          Conclusão do Doc 03:
        </p>
        <p className="leading-relaxed">
          Agora você domina a aceleração da aritmética: sabe por que potências
          crescem em dimensões, por que expoentes negativos invertem a base,
          como transformar raízes em frações e como manipular letras usando a
          balança do equilíbrio. No próximo caderno (
          <strong>
            Doc 04: Proporcionalidade, Regra de Três e Matemática Financeira
          </strong>
          ), fecharemos o Módulo 1 aplicando toda essa base em problemas de
          juros, porcentagens e variações do mundo real.
        </p>
      </footer>
    </article>
  );
}
