import { type ReactNode, useEffect, useState } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { CHEGADA, restanteDaChegada } from '../../chegada';

// O encaixe com peso: o livro cai inclinado, bate primeiro com o canto, balança para o outro
// lado e assenta reto. Os graus são do movimento, não de repouso: a capa sempre termina em 0.
const INCLINADO = -14;
const NO_CANTO = -6;
const NO_BALANCO = 3;
const QUEDA = CHEGADA.duracao * CHEGADA.canto;
const BALANCO = CHEGADA.duracao * (CHEGADA.assentar - CHEGADA.canto);
const ASSENTO = CHEGADA.duracao * (1 - CHEGADA.assentar);
const CAINDO = Easing.bezier(0.55, 0, 1, 0.45);
const BATENDO = Easing.bezier(0.3, 0.6, 0.4, 1);
const ASSENTANDO = Easing.inOut(Easing.ease);

/**
 * Envolve uma capa da estante para ela chegar caindo. `hora` é quando a queda começa (do
 * relógio de `Date.now()`); sem hora, ou com a hora já passada, a capa já está no lugar.
 * `queda` é quanto ela sobe para começar fora de vista, acima do alto da estante.
 */
export function BwChegada({
  hora,
  queda,
  children,
}: {
  hora: number | undefined;
  queda: number;
  children: ReactNode;
}) {
  // Decidido uma vez, ao montar: uma capa que volta depois da chegada não cai de novo.
  const [atraso] = useState(() => restanteDaChegada(hora, Date.now()));
  const caiu = useSharedValue(atraso === null ? 1 : 0);
  const inclinacao = useSharedValue(atraso === null ? 0 : INCLINADO);

  useEffect(() => {
    if (atraso === null) return;
    caiu.value = withDelay(atraso, withTiming(1, { duration: QUEDA, easing: CAINDO }));
    inclinacao.value = withDelay(
      atraso,
      withSequence(
        withTiming(NO_CANTO, { duration: QUEDA, easing: CAINDO }),
        withTiming(NO_BALANCO, { duration: BALANCO, easing: BATENDO }),
        withTiming(0, { duration: ASSENTO, easing: ASSENTANDO })
      )
    );
    return () => {
      cancelAnimation(caiu);
      cancelAnimation(inclinacao);
    };
  }, [atraso, caiu, inclinacao]);

  const estilo = useAnimatedStyle(() => ({
    transform: [{ translateY: -queda * (1 - caiu.value) }, { rotate: `${inclinacao.value}deg` }],
  }));

  return <Animated.View style={[estilos.pe, estilo]}>{children}</Animated.View>;
}

// Gira em torno do pé da capa, que é onde ela encosta na tábua.
const estilos = { pe: { transformOrigin: '50% 100%' } } as const;
