import { Canvas, Group, Path, Rect } from '@shopify/react-native-skia';
import { useUnistyles } from 'react-native-unistyles';

export const LARGURA_DA_JIBOIA = 94;
export const ALTURA_DA_JIBOIA = 328;

// As folhas em coração, alternando os lados do tutor (protótipo "filtros e paredes", 26/11/2026).
const FOLHAS_CLARAS = [
  'M44 40 c -16 -6 -20 -22 -6 -26 c 6 6 10 16 6 26 z',
  'M52 76 c 16 -4 22 -20 8 -26 c -6 8 -10 16 -8 26 z',
  'M42 112 c -16 -6 -20 -22 -6 -26 c 6 6 10 16 6 26 z',
  'M54 150 c 16 -4 22 -20 8 -26 c -6 8 -10 16 -8 26 z',
  'M40 190 c -16 -6 -20 -22 -6 -26 c 6 6 10 16 6 26 z',
  'M56 226 c 16 -4 22 -20 8 -26 c -6 8 -10 16 -8 26 z',
].join(' ');
const FOLHAS_ESCURAS = [
  'M52 52 c 14 -2 18 -14 8 -18 c -6 4 -8 12 -8 18 z',
  'M42 94 c -14 -2 -18 -14 -8 -18 c 6 4 8 12 8 18 z',
  'M54 130 c 14 -2 18 -14 8 -18 c -6 4 -8 12 -8 18 z',
  'M40 170 c -14 -2 -18 -14 -8 -18 c 6 4 8 12 8 18 z',
  'M54 206 c 14 -2 18 -14 8 -18 c -6 4 -8 12 -8 18 z',
  'M40 244 c -14 -2 -18 -14 -8 -18 c 6 4 8 12 8 18 z',
].join(' ');
const CAULE = 'M48 262 C 36 230, 60 200, 46 170 C 34 140, 60 110, 48 80 C 40 60, 52 40, 48 26';
const VASO = 'M16 266 H 78 L 70.5 328 H 23.5 Z';

/**
 * A jiboia no vaso de chão, ao pé da estante: o jardim da leitora, que ainda não existe. Por ora
 * é só objeto da parede; quando o jardim chegar, a altura da planta acompanha os dias de leitura.
 */
export function BwJiboia() {
  const { theme } = useUnistyles();
  const j = theme.arte.jiboia;
  return (
    <Canvas
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{ width: LARGURA_DA_JIBOIA, height: ALTURA_DA_JIBOIA }}
    >
      <Rect x={44} y={20} width={7} height={246} color={j.tutor} />
      <Path path={CAULE} style="stroke" strokeWidth={2} color={j.caule} />
      <Group>
        <Path path={FOLHAS_CLARAS} color={j.folha} />
        <Path path={FOLHAS_ESCURAS} color={j.folhaEscura} />
      </Group>
      <Path path={VASO} color={j.vaso} />
      <Rect x={12} y={256} width={70} height={10} color={j.vasoBorda} />
    </Canvas>
  );
}
