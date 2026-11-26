import { useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/** Para onde o livro vai: 1 é o próximo (desliza para a esquerda), -1 o anterior. */
export type Direcao = 1 | -1;

// Quanto o livro anda ao sair e ao entrar, na escala da prancha da mesa (390 de largura).
const PERCURSO = 220;
/** Arrastar além disso, ou soltar rápido, troca o livro; menos que isso, ele volta. */
const LIMIAR = 64;
const VELOCIDADE = 650;
/** Sem vizinho daquele lado, o livro resiste ao arrasto. */
const RESISTENCIA = 0.25;
const SAIR = { duration: 170, easing: Easing.in(Easing.quad) };
const ENTRAR = { duration: 260, easing: Easing.bezier(0.2, 0.75, 0.2, 1) };
/** Um respiro para a mesa redesenhar o livro novo antes de ele aparecer. */
const ESPERA_DO_DESENHO = 34;
/** Inclinação do livro enquanto anda, em graus por percurso inteiro. */
const INCLINACAO = 5;

/**
 * Deslizar o livro aberto para os lados, como um carrossel. O livro acompanha o dedo; soltando
 * longe o bastante, sai pelo lado, `onPassar` troca o livro e o novo entra pelo outro lado.
 * Tocar e segurar continuam com o livro: o arrasto só começa com movimento na horizontal.
 */
export function useDeslizarOLivro(
  pode: { anterior: boolean; proximo: boolean },
  onPassar: (direcao: Direcao) => void
) {
  const reduzir = useReducedMotion();
  const dx = useSharedValue(0);
  const opacidade = useSharedValue(1);
  // O gesto roda na thread de UI: ele lê o estado mais novo por aqui.
  const atual = useRef({ pode, onPassar });
  atual.current = { pode, onPassar };

  const trocar = (direcao: Direcao) => atual.current.onPassar(direcao);

  function passar(direcao: Direcao) {
    const { pode: p } = atual.current;
    if (!(direcao === 1 ? p.proximo : p.anterior)) return;
    if (reduzir) return trocar(direcao);
    dx.value = withTiming(-direcao * PERCURSO, SAIR);
    opacidade.value = withTiming(0, SAIR, (terminou) => {
      if (!terminou) return;
      runOnJS(trocar)(direcao);
      dx.value = direcao * PERCURSO;
      dx.value = withDelay(ESPERA_DO_DESENHO, withTiming(0, ENTRAR));
      opacidade.value = withDelay(ESPERA_DO_DESENHO, withTiming(1, ENTRAR));
    });
  }

  const podeProximo = pode.proximo;
  const podeAnterior = pode.anterior;
  const gesto = Gesture.Pan()
    .enabled(podeProximo || podeAnterior)
    .activeOffsetX([-16, 16])
    .failOffsetY([-14, 14])
    .onUpdate((e) => {
      const livre = e.translationX < 0 ? podeProximo : podeAnterior;
      dx.value = e.translationX * (livre ? 1 : RESISTENCIA);
    })
    .onEnd((e) => {
      const direcao: Direcao = e.translationX < 0 ? 1 : -1;
      const livre = direcao === 1 ? podeProximo : podeAnterior;
      const longe = Math.abs(e.translationX) > LIMIAR || Math.abs(e.velocityX) > VELOCIDADE;
      if (livre && longe) runOnJS(passar)(direcao);
      else dx.value = withSpring(0, { damping: 18, stiffness: 220 });
    });

  const estilo = useAnimatedStyle(() => ({
    opacity: opacidade.value,
    transform: [{ translateX: dx.value }, { rotate: `${(dx.value / PERCURSO) * INCLINACAO}deg` }],
  }));

  return { gesto, estilo, passar };
}
