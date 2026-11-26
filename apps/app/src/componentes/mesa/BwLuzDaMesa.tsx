import {
  Blur,
  Canvas,
  Group,
  Oval,
  Path,
  RadialGradient,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { COMPOSICAO } from '../../mesa';
import { corDaPoca, rgbaCss } from '../../tema/luz';
import { TROCA_DE_LUZ_MS } from './BwFeltro';

// A luz da luminária acesa (v2): uma penumbra em volta, por baixo do livro aberto, e por cima
// dele o feixe que sai da luminária e a poça de luz, em "screen". Tudo nas coordenadas da prancha
// de 390 × 836 (COMPOSICAO), como `.penumbra`, `.feixe` e `.poca` do mockup.

type Props = { acesa: boolean };

function useAcender(acesa: boolean) {
  const luz = useSharedValue(acesa ? 1 : 0);
  useEffect(() => {
    luz.value = withTiming(acesa ? 1 : 0, { duration: TROCA_DE_LUZ_MS });
  }, [acesa, luz]);
  return useAnimatedStyle(() => ({ opacity: luz.value }));
}

/** Folga em volta da prancha, para a penumbra cobrir a mesa toda quando a prancha encolhe. */
const FOLGA = 400;
// `inset:-40px` com `ellipse 46% 32% at 50% 38%`.
const CAIXA = { x: -40, y: -40, w: COMPOSICAO.largura + 80, h: COMPOSICAO.altura + 80 };
const PENUMBRA = {
  c: vec(FOLGA + CAIXA.x + CAIXA.w * 0.5, FOLGA + CAIXA.y + CAIXA.h * 0.38),
  rx: CAIXA.w * 0.46,
  ry: CAIXA.h * 0.32,
};

export function BwPenumbra({ acesa }: Props) {
  const { theme } = useUnistyles();
  const estilo = useAcender(acesa);
  return (
    <Animated.View pointerEvents="none" style={[estilos.penumbra, estilo]}>
      <Canvas style={estilos.tela}>
        <Rect
          x={0}
          y={0}
          width={COMPOSICAO.largura + 2 * FOLGA}
          height={COMPOSICAO.altura + 2 * FOLGA}
        >
          <RadialGradient
            c={PENUMBRA.c}
            r={PENUMBRA.rx}
            origin={PENUMBRA.c}
            transform={[{ scaleY: PENUMBRA.ry / PENUMBRA.rx }]}
            colors={theme.luz.penumbra.map(([cor]) => cor)}
            positions={theme.luz.penumbra.map(([, p]) => p)}
          />
        </Rect>
      </Canvas>
    </Animated.View>
  );
}

// O feixe: caixa de 420 × 440 a (direita 8, topo 4), recortada no polígono do mockup, com o
// gradiente `ellipse 75% 42% at 52% 48%` e desfoque de 16 px.
const TELA_DA_LUZ = { x: -90, y: -50, w: 520, h: 620 };
const FEIXE = { x: COMPOSICAO.largura - 8 - 420, y: 4, w: 420, h: 440 };
const pt = (fx: number, fy: number) =>
  `${FEIXE.x + FEIXE.w * fx - TELA_DA_LUZ.x} ${FEIXE.y + FEIXE.h * fy - TELA_DA_LUZ.y}`;
const RECORTE_DO_FEIXE = `M${pt(0.92, 0)} L${pt(1, 0.1)} L${pt(0.42, 1)} L${pt(0, 0.56)} Z`;
const CENTRO_DO_FEIXE = vec(
  FEIXE.x + FEIXE.w * 0.52 - TELA_DA_LUZ.x,
  FEIXE.y + FEIXE.h * 0.48 - TELA_DA_LUZ.y
);
// A poça: elipse de 450 × 440 a (-30, 76), `closest-side`, apagando em 74%.
const POCA = { x: -30 - TELA_DA_LUZ.x, y: 76 - TELA_DA_LUZ.y, w: 450, h: 440 };
const CENTRO_DA_POCA = vec(POCA.x + POCA.w / 2, POCA.y + POCA.h / 2);

type PropsDoFeixe = Props & { temperatura: number };

export function BwFeixe({ acesa, temperatura }: PropsDoFeixe) {
  const estilo = useAcender(acesa);
  const cor = corDaPoca(temperatura);
  const cores = [rgbaCss(cor), rgbaCss({ ...cor, a: 0 })];

  return (
    <Animated.View pointerEvents="none" style={[estilos.feixe, estilo]}>
      <Canvas style={estilos.tela}>
        <Group opacity={0.92}>
          <Path path={RECORTE_DO_FEIXE}>
            <RadialGradient
              c={CENTRO_DO_FEIXE}
              r={FEIXE.w * 0.75}
              origin={CENTRO_DO_FEIXE}
              transform={[{ scaleY: (FEIXE.h * 0.42) / (FEIXE.w * 0.75) }]}
              colors={cores}
              positions={[0, 0.72]}
            />
            <Blur blur={16} />
          </Path>
        </Group>
        <Oval x={POCA.x} y={POCA.y} width={POCA.w} height={POCA.h}>
          <RadialGradient
            c={CENTRO_DA_POCA}
            r={POCA.w / 2}
            origin={CENTRO_DA_POCA}
            transform={[{ scaleY: POCA.h / POCA.w }]}
            colors={cores}
            positions={[0, 0.74]}
          />
        </Oval>
      </Canvas>
    </Animated.View>
  );
}

/** O lugar da luz no mockup: z-index 8 para a penumbra, 11 para o feixe e a poça. */
export const CAMADA_DA_PENUMBRA = 8;
export const CAMADA_DO_FEIXE = 11;

const estilos = StyleSheet.create({
  penumbra: {
    position: 'absolute',
    left: -FOLGA,
    top: -FOLGA,
    width: COMPOSICAO.largura + 2 * FOLGA,
    height: COMPOSICAO.altura + 2 * FOLGA,
    zIndex: CAMADA_DA_PENUMBRA,
  },
  feixe: {
    position: 'absolute',
    left: TELA_DA_LUZ.x,
    top: TELA_DA_LUZ.y,
    width: TELA_DA_LUZ.w,
    height: TELA_DA_LUZ.h,
    zIndex: CAMADA_DO_FEIXE,
    mixBlendMode: 'screen',
  },
  tela: { flex: 1 },
});
