import { Canvas, Circle, Fill, RadialGradient, Shader, vec } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { corDaPoca, rgbaCss } from '../../tema/luz';
import { shaders, uniforme } from './shaders';

type Props = {
  /** Temperatura do painel de leitura, em kelvin (RN-DV.6). */
  temperatura: number;
  /** Onde começa a mesa, abaixo da barra de status. */
  topo: number;
};

// A poça do mockup B: um disco de 520 px a (-60, 40), com a luz até 72% do raio.
const POCA = { x: 200, y: 300, r: 260 };

/** O feltro da mesa e a poça de luz da luminária, tingida pela temperatura da leitora. */
export function BwFeltro({ temperatura, topo }: Props) {
  const { theme } = useUnistyles();
  const uniforms = useMemo(
    () => ({
      base: uniforme(theme.sup.mesa.fundo),
      claro: uniforme(theme.luz.feltroClaro),
      escuro: uniforme(theme.luz.feltroEscuro),
    }),
    [theme]
  );
  const luz = corDaPoca(temperatura);
  const centro = vec(POCA.x, topo + POCA.y);

  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={estilos.fundo}
    >
      <Canvas style={estilos.tela}>
        <Fill>
          <Shader source={shaders.feltro} uniforms={uniforms} />
        </Fill>
        <Circle c={centro} r={POCA.r} blendMode="screen">
          <RadialGradient
            c={centro}
            r={POCA.r}
            colors={[rgbaCss(luz), rgbaCss({ ...luz, a: 0 })]}
            positions={[0, 0.72]}
          />
        </Circle>
      </Canvas>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  tela: { flex: 1 },
});
