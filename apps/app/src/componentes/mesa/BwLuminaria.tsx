import { Canvas, Circle, RadialGradient, Shadow, vec } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// A luminária vista de cima, no canto superior direito (mockup B, `.luminaria`): um disco de
// 176 px a (direita -58, topo -46). A tela tem folga à esquerda e embaixo para a sombra, que cai
// para baixo e para a esquerda (RN-DV.7).
const TELA = 200;
const DISCO = { x: TELA - 176 + 58 + 88, y: -46 + 88, r: 88 };
// O brilho fica a 40% × 62% da caixa do disco; o raio do gradiente vai até o canto mais longe.
const LAMPADA = { x: DISCO.x - 88 + 0.4 * 176, y: DISCO.y - 88 + 0.62 * 176, r: 151.8 };

/** A luminária. Não abre tela: a temperatura dela aparece na poça de luz (RN-DV.6, §9.4). */
export function BwLuminaria() {
  const { theme } = useUnistyles();
  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={estilos.canto}
    >
      <Canvas style={estilos.tela}>
        <Circle c={vec(DISCO.x, DISCO.y)} r={DISCO.r}>
          <RadialGradient
            c={vec(LAMPADA.x, LAMPADA.y)}
            r={LAMPADA.r}
            colors={theme.luz.cupula.map(([cor]) => cor)}
            positions={theme.luz.cupula.map(([, p]) => p)}
          />
          <Shadow dx={-14} dy={20} blur={15} color={theme.luz.sombraDaCupula} />
        </Circle>
      </Canvas>
    </View>
  );
}

const estilos = StyleSheet.create({
  canto: { position: 'absolute', right: 0, top: 0, width: TELA, height: TELA, zIndex: 9 },
  tela: { flex: 1 },
});
