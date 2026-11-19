import {
  Canvas,
  Group,
  LinearGradient,
  Rect,
  RoundedRect,
  Shadow,
  vec,
} from '@shopify/react-native-skia';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { tipoMiniatura } from '../../tema/tipografia';

// A gaveta do fichário do mockup B (`.o-fichario`): caixa de madeira de 206 × 150 com moldura de
// 9 px, fichas vistas de cima e uma aba de papel kraft por grupo da biblioteca, mais a placa de
// latão. Com a gaveta vazia, sobra o fundo da caixa (Q13).
export const FICHARIO = { largura: 206, altura: 150 } as const;
const MOLDURA = 9;
const FOLGA = { x: 30, y: 6, baixo: 36 };

/** Os três lugares de aba do mockup, cada um precedido pelas fichas do grupo. */
const LUGARES = [
  { fichas: [14, 24], aba: { left: 14, top: 30 } },
  { fichas: [50, 58, 66], aba: { left: 70, top: 72 } },
  { fichas: [92, 100], aba: { left: 118, top: 104 } },
];

type Props = { abas: { rotulo: string; n: number }[] };

export function BwFichario({ abas }: Props) {
  const { theme } = useUnistyles();
  const f = theme.arte.fichario;
  const lugares = LUGARES.slice(0, abas.length);
  const larguraFundo = FICHARIO.largura - 2 * MOLDURA;
  const alturaFundo = FICHARIO.altura - 2 * MOLDURA;

  return (
    <View style={estilos.caixa}>
      <Canvas style={estilos.arte}>
        <Group transform={[{ translateX: FOLGA.x }, { translateY: FOLGA.y }]}>
          <RoundedRect x={0} y={0} width={FICHARIO.largura} height={FICHARIO.altura} r={3}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, FICHARIO.altura)}
              colors={[f.claro, f.escuro]}
            />
            <Shadow dx={-8} dy={14} blur={10} color={theme.arte.livro.sombraPagina} />
          </RoundedRect>
          <Rect
            x={MOLDURA / 2}
            y={MOLDURA / 2}
            width={FICHARIO.largura - MOLDURA}
            height={FICHARIO.altura - MOLDURA}
            style="stroke"
            strokeWidth={MOLDURA}
            color={f.moldura}
          />
          <Group clip={{ x: MOLDURA, y: MOLDURA, width: larguraFundo, height: alturaFundo }}>
            <Rect
              x={MOLDURA}
              y={MOLDURA}
              width={larguraFundo}
              height={alturaFundo}
              color={f.fundo}
            />
            {lugares.flatMap((l) =>
              l.fichas.map((y) => (
                <Rect
                  key={y}
                  x={MOLDURA + 6}
                  y={MOLDURA + y}
                  width={larguraFundo - 12}
                  height={3}
                  color={f.ficha}
                >
                  <Shadow dx={0} dy={2} blur={1} color={theme.arte.livro.sombraFita} />
                </Rect>
              ))
            )}
          </Group>
        </Group>
      </Canvas>

      {abas.map((a, i) => (
        <View key={a.rotulo} style={[estilos.aba, posicaoDaAba(i)]}>
          <Text style={estilos.textoAba}>
            {a.rotulo} {a.n}
          </Text>
        </View>
      ))}
      <View style={estilos.placaLugar}>
        <View style={estilos.placa}>
          <Text style={estilos.textoPlaca}>Biblioteca</Text>
        </View>
      </View>
    </View>
  );
}

function posicaoDaAba(i: number) {
  const { left, top } = LUGARES[i]?.aba ?? { left: 0, top: 0 };
  return { left: MOLDURA + left, top: MOLDURA + top };
}

const estilos = StyleSheet.create((theme) => ({
  caixa: {
    width: FICHARIO.largura,
    height: FICHARIO.altura,
  },
  arte: {
    position: 'absolute',
    left: -FOLGA.x,
    top: -FOLGA.y,
    width: FICHARIO.largura + FOLGA.x,
    height: FICHARIO.altura + FOLGA.y + FOLGA.baixo,
  },
  aba: {
    position: 'absolute',
    height: 15,
    paddingHorizontal: theme.esp[2],
    backgroundColor: theme.arte.fichario.aba,
  },
  textoAba: {
    ...tipoMiniatura.aba,
    color: theme.sup.kraft.tinta,
  },
  placaLugar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -3,
    alignItems: 'center',
  },
  placa: {
    paddingHorizontal: theme.esp[3],
    borderRadius: 2,
    experimental_backgroundImage: `linear-gradient(${theme.arte.fichario.placa.claro}, ${theme.arte.fichario.placa.escuro})`,
  },
  textoPlaca: {
    ...tipoMiniatura.placa,
    color: theme.arte.fichario.placa.tinta,
  },
}));
