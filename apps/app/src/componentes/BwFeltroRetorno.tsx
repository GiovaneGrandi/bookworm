import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO } from '../tema/geometria';
import { tipo } from '../tema/tipografia';

/** Quanto puxar a folha para baixo até ela pousar na mesa (mockup v2: 90 px). */
const PUXAR_ATE = 90;

type Props = {
  onPousar: () => void;
  rotulo?: string;
  /** Com ele, a alça também pode ser puxada para baixo, arrastando a folha (v2). */
  puxao?: SharedValue<number>;
};

/**
 * A faixa de feltro que sobra no alto de toda folha erguida (RN-DV.2): tocá-la devolve a folha
 * à mesa, e na v2 também dá para puxá-la pela alça. A borda lateral é o gesto de voltar do
 * sistema, que faz o mesmo (usePousarNaMesa). Substitui barra de abas e seta de voltar.
 */
export function BwFeltroRetorno({ onPousar, rotulo = 'pousar na mesa', puxao }: Props) {
  const reduzir = useReducedMotion();
  const faixa = (
    <Pressable
      onPress={onPousar}
      accessibilityRole="button"
      accessibilityLabel="Voltar à mesa"
      accessibilityHint={puxao ? 'Ou puxe a alça para baixo' : undefined}
      style={({ pressed }) => [estilos.faixa, pressed && estilos.pressionada]}
    >
      <View style={estilos.alca} />
      <Text style={estilos.rotulo}>▴ {rotulo}</Text>
    </Pressable>
  );
  if (!puxao || reduzir) return faixa;

  const puxar = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetX([-24, 24])
    .onUpdate((e) => {
      puxao.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > PUXAR_ATE) runOnJS(onPousar)();
      puxao.value = withTiming(0, { duration: 200 });
    });

  return <GestureDetector gesture={puxar}>{faixa}</GestureDetector>;
}

/** O puxão da alça e o estilo da folha que acompanha o dedo, encolhendo um pouco. */
export function usePuxao() {
  const puxao = useSharedValue(0);
  const estilo = useAnimatedStyle(() => {
    const p = Math.min(1, puxao.value / 300);
    return {
      borderRadius: p * 18,
      transform: [{ translateY: puxao.value }, { scale: 1 - p * 0.14 }],
    };
  });
  return { puxao, estilo };
}

const estilos = StyleSheet.create((theme) => ({
  faixa: {
    minHeight: ALVO_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.esp[1],
  },
  pressionada: {
    backgroundColor: theme.semantico.mesa.selecionadoFundo,
  },
  alca: {
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: theme.sup.mesa.borda,
  },
  rotulo: {
    ...tipo.kicker,
    color: theme.sup.mesa.tinta,
  },
}));
