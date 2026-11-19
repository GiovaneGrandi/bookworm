import {
  Canvas,
  Group,
  Line,
  Path,
  Rect,
  RoundedRect,
  Text as TextoSkia,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import { useUnistyles } from 'react-native-unistyles';
import { arquivosDeFonte } from '../../tema/fontes';

// A bandeja de entrada do mockup B (`.o-bandeja`, um SVG de 156 × 104): aro e grade de arame,
// e um envelope com selo verde, inclinado 5°, com "+ EPUB · PDF" a lápis.
export const BANDEJA = { largura: 156, altura: 104 } as const;
const GRADE_H = [27, 52, 77];
const GRADE_V = [40, 78, 116];

export function BwBandejaDeArame() {
  const { theme } = useUnistyles();
  const b = theme.arte.bandeja;
  // O lápis é a face da marginália (§3.2): Caveat.
  const lapis = useFont(arquivosDeFonte.Caveat_400Regular, 15);

  return (
    <Canvas style={{ width: BANDEJA.largura, height: BANDEJA.altura }}>
      <RoundedRect
        x={3}
        y={3}
        width={150}
        height={98}
        r={4}
        style="stroke"
        strokeWidth={3}
        color={b.aro}
      />
      {GRADE_H.map((y) => (
        <Line key={`h${y}`} p1={vec(3, y)} p2={vec(153, y)} strokeWidth={1.4} color={b.grade} />
      ))}
      {GRADE_V.map((x) => (
        <Line key={`v${x}`} p1={vec(x, 3)} p2={vec(x, 101)} strokeWidth={1.4} color={b.grade} />
      ))}
      <Group transform={[{ rotate: (5 * Math.PI) / 180 }]} origin={vec(80, 52)}>
        <Rect x={22} y={20} width={112} height={66} color={b.envelope} />
        <Rect
          x={22}
          y={20}
          width={112}
          height={66}
          style="stroke"
          strokeWidth={1}
          color={b.vinco}
        />
        <Path path="M22 20 L78 58 L134 20" style="stroke" strokeWidth={1} color={b.vinco} />
        <Rect x={110} y={26} width={18} height={21} color={b.selo} />
        {lapis && <TextoSkia x={30} y={80} text="+ EPUB · PDF" font={lapis} color={b.lapis} />}
      </Group>
    </Canvas>
  );
}
