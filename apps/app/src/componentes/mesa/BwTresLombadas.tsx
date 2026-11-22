import {
  Canvas,
  Group,
  LinearGradient,
  Oval,
  RadialGradient,
  Rect,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia';
import { useUnistyles } from 'react-native-unistyles';

// A biblioteca na mesa: três lombadas em pé, de alturas diferentes, cada uma com uma faixa só
// (escolhida na rodada de ícones de 22/11, variação "Três lombadas"). Desenho de 200 × 150.
export const LOMBADAS = { largura: 200, altura: 150 } as const;

const BASE = 128;
const VOLUMES = [
  { x: 60, largura: 27, altura: 88, faixa: 16 },
  { x: 89, largura: 22, altura: 74, faixa: 14 },
  { x: 113, largura: 28, altura: 98, faixa: 16 },
];

export function BwTresLombadas() {
  const { theme } = useUnistyles();
  const l = theme.arte.lombadas;

  return (
    <Canvas style={{ width: LOMBADAS.largura, height: LOMBADAS.altura }}>
      <Oval x={42} y={121} width={116} height={16}>
        <RadialGradient
          c={vec(100, 129)}
          r={58}
          colors={l.sombra}
          transform={[{ scaleY: 8 / 58 }]}
          origin={vec(100, 129)}
        />
      </Oval>
      {VOLUMES.map((v, i) => {
        const livro = l.livros[i] ?? l.livros[0];
        const topo = BASE - v.altura;
        return (
          <Group key={v.x}>
            <RoundedRect
              x={v.x}
              y={topo}
              width={v.largura}
              height={v.altura}
              r={3}
              color={livro.capa}
            />
            <RoundedRect x={v.x} y={topo} width={v.largura} height={v.altura} r={3}>
              <LinearGradient
                start={vec(v.x, 0)}
                end={vec(v.x + v.largura, 0)}
                colors={l.volume}
                positions={[0, 0.35, 1]}
              />
            </RoundedRect>
            <Rect x={v.x} y={topo + v.faixa} width={v.largura} height={5} color={livro.faixa} />
          </Group>
        );
      })}
    </Canvas>
  );
}
