import { Canvas, Fill, RadialGradient, Shader, vec } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { shaders, uniforme } from './shaders';

type Props = {
  /** A luminária acesa ou apagada (v2). Apagada, a mesa fica uniformemente mais clara. */
  acesa: boolean;
};

/** Quanto dura a troca de luz, como no mockup (`transition: opacity .35s`). */
export const TROCA_DE_LUZ_MS = 350;

/** O feltro da mesa. A luz da luminária fica por cima dos objetos, em BwLuzDaMesa. */
export function BwFeltro({ acesa }: Props) {
  const { theme } = useUnistyles();
  const { width, height } = useWindowDimensions();
  const uniforms = useMemo(
    () => ({
      base: uniforme(theme.sup.mesa.fundo),
      claro: uniforme(theme.luz.feltroClaro),
      escuro: uniforme(theme.luz.feltroEscuro),
    }),
    [theme]
  );

  const apagada = useSharedValue(acesa ? 0 : 1);
  useEffect(() => {
    apagada.value = withTiming(acesa ? 0 : 1, { duration: TROCA_DE_LUZ_MS });
  }, [acesa, apagada]);
  const estiloApagada = useAnimatedStyle(() => ({ opacity: apagada.value }));

  // `circle at 50% 42%`, até o canto mais distante.
  const centro = vec(width / 2, height * 0.42);
  const raio = Math.hypot(width / 2, height * 0.58);

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
      </Canvas>
      <Animated.View style={[estilos.fundo, estiloApagada]}>
        <Canvas style={estilos.tela}>
          <Fill>
            <RadialGradient
              c={centro}
              r={raio}
              colors={theme.luz.mesaApagada}
              positions={[0, 0.75]}
            />
          </Fill>
        </Canvas>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  tela: { flex: 1 },
});
