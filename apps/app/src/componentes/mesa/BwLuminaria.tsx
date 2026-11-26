import { Canvas, Circle, RadialGradient, Shadow, vec } from '@shopify/react-native-skia';
import { type GestureResponderEvent, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { COMPOSICAO } from '../../mesa';
import { corDaPoca, rgbaCss } from '../../tema/luz';

// A luminária vista de cima (mockup B v2, `.luminaria`): um disco de 176 px a (direita -64,
// topo -52) na prancha da mesa. A tela dela tem folga à esquerda e embaixo para a sombra, que
// cai para baixo e para a esquerda (RN-DV.7).
const DISCO_R = 88;
const DISCO_NA_MESA = { x: COMPOSICAO.largura + 64 - DISCO_R, y: -52 + DISCO_R };
const TELA = { x: 150, y: -60, w: 304, h: 280 };
const DISCO = { x: DISCO_NA_MESA.x - TELA.x, y: DISCO_NA_MESA.y - TELA.y };
// O brilho fica a 38% × 64% da caixa do disco; o raio vai até o canto mais longe.
const LAMPADA = {
  x: DISCO.x - DISCO_R + 0.38 * 176,
  y: DISCO.y - DISCO_R + 0.64 * 176,
  r: Math.hypot(176 * 0.62, 176 * 0.64),
};
/** A parte do disco que aparece na tela, e que recebe o toque. */
const ALVO = {
  x: DISCO_NA_MESA.x - DISCO_R,
  y: 0,
  w: COMPOSICAO.largura - (DISCO_NA_MESA.x - DISCO_R),
  h: 124,
};

type Props = {
  acesa: boolean;
  /** Temperatura do painel de leitura (RN-DV.6): tinge o halo da lâmpada acesa. */
  temperatura: number;
  onAlternar: () => void;
  onSegurar?: (e: GestureResponderEvent) => void;
};

/** A luminária (v2): tocar acende e apaga a luz da mesa. */
export function BwLuminaria({ acesa, temperatura, onAlternar, onSegurar }: Props) {
  const { theme } = useUnistyles();
  const cupula = acesa ? theme.luz.cupula : theme.luz.cupulaApagada;

  return (
    <>
      <View
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        style={estilos.tela}
      >
        <Canvas style={estilos.arte}>
          <Circle c={vec(DISCO.x, DISCO.y)} r={DISCO_R}>
            <RadialGradient
              c={vec(LAMPADA.x, LAMPADA.y)}
              r={LAMPADA.r}
              colors={cupula.map(([cor]) => cor)}
              positions={cupula.map(([, p]) => p)}
            />
            {acesa ? (
              <>
                <Shadow dx={-16} dy={24} blur={18} color={theme.luz.sombraDaCupula} />
                <Shadow dx={-14} dy={18} blur={23} color={rgbaCss(corDaPoca(temperatura))} />
              </>
            ) : (
              <Shadow dx={-12} dy={18} blur={13} color={theme.luz.sombraDaCupulaApagada} />
            )}
          </Circle>
        </Canvas>
      </View>
      <Pressable
        onPress={onAlternar}
        onLongPress={onSegurar}
        delayLongPress={420}
        accessibilityRole="switch"
        accessibilityState={{ checked: acesa }}
        accessibilityLabel="Luminária: acender ou apagar a luz da mesa"
        style={estilos.alvo}
      />
    </>
  );
}

const estilos = StyleSheet.create({
  tela: {
    position: 'absolute',
    left: TELA.x,
    top: TELA.y,
    width: TELA.w,
    height: TELA.h,
    zIndex: 12,
  },
  arte: { flex: 1 },
  alvo: {
    position: 'absolute',
    left: ALVO.x,
    top: ALVO.y,
    width: ALVO.w,
    height: ALVO.h,
    minHeight: 48,
    zIndex: 12,
  },
});
