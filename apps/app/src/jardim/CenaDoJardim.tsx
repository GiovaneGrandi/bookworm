// Estágio 8 — a cena do jardim (`mvp.md` §9, `04-streaks-e-jardim.md` §5.4). Primeiro uso real de
// Skia no produto (`stack.md`, `Q-DS.5`/`Q-ST.6`): as 12 primitivas do app de prova atravessaram
// nativamente sem ele, mas a cena ilustrada — céu por hora real, planta procedural, canteiro que
// acumula — não é um `Pressable` com sombra, é desenho de verdade.
//
// `estagio` é o canteiro **ativo** (RN-04.23, recua a broto quando a ofensiva quebra) — camada
// visual independente de `tamanhoPermanente` (RN-04.27, o acervo, nunca decresce): na dormência a
// planta em primeiro plano volta a ser um broto, mas o campo de elementos diários ao redor e os
// cosméticos de marco continuam inteiros. É a mesma decisão de "nada desaparece" (RN-04.25) em
// forma de composição, não de regra de negócio.
import type { EstagioJardim } from '@bookworm/core/src/ofensiva/index.js';
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Oval,
  Path,
  Rect,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { posicionarElementosDiarios } from './elementosDiarios.js';
import { paletaCeuPara } from './paletaCeu.js';
import { PALETA_PLANTA, type PaletaPlanta } from './paletaPlanta.js';
import { useOscilacaoSuave } from './useOscilacaoSuave.js';

type Props = {
  estagio: EstagioJardim;
  estado: 'vivo' | 'dormente';
  tamanhoPermanente: number;
  marcosAlcancados: number[];
  largura?: number;
  altura?: number;
};

export function CenaDoJardim({
  estagio,
  estado,
  tamanhoPermanente,
  marcosAlcancados,
  largura = 320,
  altura = 200,
}: Props) {
  const hora = useMemo(() => new Date().getHours(), []);
  const ceu = paletaCeuPara(hora, estado);
  const paleta = PALETA_PLANTA[estado];
  // RN-04.25 — a dormência reduz o movimento da cena, não a extingue: metade da amplitude.
  const amplitudeVento = estado === 'vivo' ? 5 : 2;
  const oscilacao = useOscilacaoSuave(estado === 'vivo' ? 3200 : 4600);
  const anguloVento = oscilacao * amplitudeVento;

  const baseY = altura * 0.72;
  const cx = largura / 2;

  const elementos = useMemo(
    () => posicionarElementosDiarios(tamanhoPermanente, largura, altura * 0.24),
    [tamanhoPermanente, largura, altura]
  );

  const caminhoMonte = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(0, baseY);
    p.quadTo(largura * 0.25, baseY - altura * 0.06, largura * 0.5, baseY - altura * 0.015);
    p.quadTo(largura * 0.75, baseY + altura * 0.05, largura, baseY - altura * 0.02);
    p.lineTo(largura, altura);
    p.lineTo(0, altura);
    p.close();
    return p;
  }, [largura, altura, baseY]);

  // O sol/lua percorre a largura da cena com a hora do dia — o mesmo horário nunca cai no mesmo
  // lugar duas vezes exatamente, mas a posição é sempre coerente com a hora real (J-11).
  const posicaoLuz = vec((hora / 24) * largura, altura * 0.16 + Math.abs(hora - 12) * 1.1);

  return (
    <Canvas style={{ width: largura, height: altura }}>
      <Rect x={0} y={0} width={largura} height={altura}>
        <LinearGradient start={vec(0, 0)} end={vec(0, altura)} colors={[ceu.topo, ceu.base]} />
      </Rect>

      <Circle cx={posicaoLuz.x} cy={posicaoLuz.y} r={34} color={ceu.luz} opacity={0.55}>
        <BlurMask blur={22} style="normal" />
      </Circle>

      <Path path={caminhoMonte} color={paleta.solo} />

      {elementos.map((el, i) => (
        <Circle
          // biome-ignore lint/suspicious/noArrayIndexKey: posição é determinística por índice (ver elementosDiarios.ts) — o índice É a identidade estável do dia.
          key={i}
          cx={el.x}
          cy={baseY + altura * 0.06 - el.y}
          r={el.raio}
          color={i % 3 === 0 ? paleta.flor : i % 3 === 1 ? paleta.folhaClara : paleta.folha}
          opacity={0.85}
        />
      ))}

      <PlantaDoEstagio
        estagio={estagio}
        cx={cx}
        baseY={baseY}
        paleta={paleta}
        anguloVento={anguloVento}
      />

      <Cosmeticos
        marcosAlcancados={marcosAlcancados}
        largura={largura}
        altura={altura}
        baseY={baseY}
        paleta={paleta}
        ceu={ceu}
      />
    </Canvas>
  );
}

function PlantaDoEstagio({
  estagio,
  cx,
  baseY,
  paleta,
  anguloVento,
}: {
  estagio: EstagioJardim;
  cx: number;
  baseY: number;
  paleta: PaletaPlanta;
  anguloVento: number;
}) {
  switch (estagio) {
    case 'broto':
      return <Broto cx={cx} baseY={baseY} paleta={paleta} anguloVento={anguloVento} />;
    case 'muda':
      return <Muda cx={cx} baseY={baseY} paleta={paleta} anguloVento={anguloVento} />;
    case 'planta_florida':
      return <PlantaFlorida cx={cx} baseY={baseY} paleta={paleta} anguloVento={anguloVento} />;
    case 'arvore':
      return <Arvore cx={cx} baseY={baseY} paleta={paleta} anguloVento={anguloVento} escala={1} />;
    case 'bosque':
      return <Bosque cx={cx} baseY={baseY} paleta={paleta} anguloVento={anguloVento} />;
  }
}

type ParteProps = { cx: number; baseY: number; paleta: PaletaPlanta; anguloVento: number };

function Broto({ cx, baseY, paleta, anguloVento }: ParteProps) {
  const caule = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(cx, baseY);
    p.quadTo(cx - 3, baseY - 14, cx, baseY - 22);
    return p;
  }, [cx, baseY]);

  return (
    <Group transform={[{ rotate: (anguloVento * Math.PI) / 180 }]} origin={vec(cx, baseY)}>
      <Path path={caule} color={paleta.folha} style="stroke" strokeWidth={2.5} strokeCap="round" />
      <Oval
        x={cx - 9}
        y={baseY - 27}
        width={16}
        height={8}
        color={paleta.folhaClara}
        transform={[{ rotate: -0.4 }]}
        origin={vec(cx, baseY - 23)}
      />
    </Group>
  );
}

function Muda({ cx, baseY, paleta, anguloVento }: ParteProps) {
  const caule = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(cx, baseY);
    p.quadTo(cx + 4, baseY - 24, cx, baseY - 44);
    return p;
  }, [cx, baseY]);

  return (
    <Group transform={[{ rotate: (anguloVento * Math.PI) / 180 }]} origin={vec(cx, baseY)}>
      <Path path={caule} color={paleta.folha} style="stroke" strokeWidth={3} strokeCap="round" />
      <Oval
        x={cx - 16}
        y={baseY - 30}
        width={18}
        height={9}
        color={paleta.folhaClara}
        transform={[{ rotate: 0.5 }]}
        origin={vec(cx - 7, baseY - 25)}
      />
      <Oval
        x={cx + 1}
        y={baseY - 46}
        width={18}
        height={9}
        color={paleta.folha}
        transform={[{ rotate: -0.5 }]}
        origin={vec(cx + 10, baseY - 41)}
      />
    </Group>
  );
}

function PlantaFlorida({ cx, baseY, paleta, anguloVento }: ParteProps) {
  const caule = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(cx, baseY);
    p.quadTo(cx - 5, baseY - 30, cx, baseY - 58);
    return p;
  }, [cx, baseY]);

  const topoX = cx;
  const topoY = baseY - 58;
  const petalas = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const angulo = (i / 6) * Math.PI * 2;
        return { x: topoX + Math.cos(angulo) * 11, y: topoY + Math.sin(angulo) * 11, angulo };
      }),
    [topoX, topoY]
  );

  return (
    <Group transform={[{ rotate: (anguloVento * Math.PI) / 180 }]} origin={vec(cx, baseY)}>
      <Path path={caule} color={paleta.folha} style="stroke" strokeWidth={3} strokeCap="round" />
      <Oval
        x={cx - 18}
        y={baseY - 22}
        width={18}
        height={9}
        color={paleta.folhaClara}
        transform={[{ rotate: 0.5 }]}
        origin={vec(cx - 9, baseY - 17)}
      />
      <Oval
        x={cx + 2}
        y={baseY - 40}
        width={16}
        height={8}
        color={paleta.folha}
        transform={[{ rotate: -0.4 }]}
        origin={vec(cx + 10, baseY - 36)}
      />
      {petalas.map((p, i) => (
        <Oval
          // biome-ignore lint/suspicious/noArrayIndexKey: seis pétalas fixas, ordem nunca muda.
          key={i}
          x={p.x - 4}
          y={p.y - 6}
          width={8}
          height={11}
          color={paleta.flor2}
          transform={[{ rotate: p.angulo }]}
          origin={vec(p.x, p.y)}
        />
      ))}
      <Circle cx={topoX} cy={topoY} r={6} color={paleta.flor} />
    </Group>
  );
}

function Arvore({ cx, baseY, paleta, anguloVento, escala }: ParteProps & { escala: number }) {
  const alturaTronco = 62 * escala;
  const tronco = useMemo(() => {
    const p = Skia.Path.Make();
    const largo = 5 * escala;
    p.moveTo(cx - largo, baseY);
    p.lineTo(cx - largo * 0.5, baseY - alturaTronco);
    p.lineTo(cx + largo * 0.5, baseY - alturaTronco);
    p.lineTo(cx + largo, baseY);
    p.close();
    return p;
  }, [cx, baseY, alturaTronco, escala]);

  const topoY = baseY - alturaTronco - 4;

  return (
    <Group transform={[{ rotate: (anguloVento * Math.PI) / 180 }]} origin={vec(cx, baseY)}>
      <Path path={tronco} color={paleta.tronco} />
      <Circle
        cx={cx - 16 * escala}
        cy={topoY + 6 * escala}
        r={20 * escala}
        color={paleta.folhaEscura}
      />
      <Circle cx={cx + 14 * escala} cy={topoY + 4 * escala} r={22 * escala} color={paleta.folha} />
      <Circle cx={cx} cy={topoY - 14 * escala} r={20 * escala} color={paleta.folhaClara} />
    </Group>
  );
}

function Bosque({ cx, baseY, paleta, anguloVento }: ParteProps) {
  // Três árvores, alturas e posições levemente irregulares — mas sempre as mesmas (RN-DS.9, a
  // imperfeição é intencional e fixa, não um novo sorteio a cada render).
  const arvores = [
    { dx: -78, escala: 0.72 },
    { dx: 0, escala: 1 },
    { dx: 72, escala: 0.8 },
  ];
  return (
    <>
      {arvores.map((a) => (
        <Arvore
          key={a.dx}
          cx={cx + a.dx}
          baseY={baseY}
          paleta={paleta}
          anguloVento={anguloVento}
          escala={a.escala}
        />
      ))}
    </>
  );
}

function Cosmeticos({
  marcosAlcancados,
  largura,
  altura,
  baseY,
  paleta,
  ceu,
}: {
  marcosAlcancados: number[];
  largura: number;
  altura: number;
  baseY: number;
  paleta: PaletaPlanta;
  ceu: { luz: string };
}) {
  const tem = (marco: number) => marcosAlcancados.includes(marco);
  return (
    <>
      {/* RN-04.13/RN-04.28 — marco de 7 dias: um vaso de barro, o primeiro cosmético. */}
      {tem(7) && <Vaso x={largura * 0.13} baseY={baseY} paleta={paleta} />}
      {/* Marco de 30 dias: uma luminária pendurada, com brilho de verdade (Skia resolve o que o
          Anexo A registrou como limite do RN puro em `LuzSobreAFolha`). */}
      {tem(30) && <Luminaria x={largura * 0.86} altura={altura} corLuz={ceu.luz} />}
      {/* Marco de 100 dias: um pássaro pousado no canteiro. */}
      {tem(100) && <Passaro x={largura * 0.68} y={baseY - 4} paleta={paleta} />}
      {/* Marco de 365 dias: um banco — o jardim já é lugar de ficar, não só de passar. */}
      {tem(365) && <Banco x={largura * 0.82} baseY={baseY} paleta={paleta} />}
    </>
  );
}

function Vaso({ x, baseY, paleta }: { x: number; baseY: number; paleta: PaletaPlanta }) {
  const corpo = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(x - 8, baseY);
    p.lineTo(x - 6, baseY - 14);
    p.lineTo(x + 6, baseY - 14);
    p.lineTo(x + 8, baseY);
    p.close();
    return p;
  }, [x, baseY]);
  return (
    <>
      <Path path={corpo} color={paleta.tronco} />
      <Rect x={x - 7} y={baseY - 17} width={14} height={4} color={paleta.folhaEscura} />
    </>
  );
}

function Luminaria({ x, altura, corLuz }: { x: number; altura: number; corLuz: string }) {
  const y = altura * 0.24;
  return (
    <>
      <Rect x={x - 0.5} y={0} width={1} height={y} color="#2a2018" />
      <Rect x={x - 6} y={y} width={12} height={10} color="#3a2e20" />
      <Circle cx={x} cy={y + 5} r={9} color={corLuz} opacity={0.75}>
        <BlurMask blur={10} style="normal" />
      </Circle>
    </>
  );
}

function Passaro({ x, y, paleta }: { x: number; y: number; paleta: PaletaPlanta }) {
  const corpo = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(x - 7, y);
    p.quadTo(x, y - 5, x + 7, y);
    p.quadTo(x, y - 2, x - 7, y);
    p.close();
    return p;
  }, [x, y]);
  return <Path path={corpo} color={paleta.tronco} />;
}

function Banco({ x, baseY, paleta }: { x: number; baseY: number; paleta: PaletaPlanta }) {
  return (
    <>
      <Rect x={x - 12} y={baseY - 10} width={24} height={4} color={paleta.tronco} />
      <Rect x={x - 10} y={baseY - 6} width={3} height={6} color={paleta.tronco} />
      <Rect x={x + 7} y={baseY - 6} width={3} height={6} color={paleta.tronco} />
    </>
  );
}
