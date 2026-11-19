import { createContext, type ReactNode, useCallback, useContext, useMemo, useRef } from 'react';
import { useWindowDimensions, type View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ALVO_MINIMO } from '../tema/geometria';

/**
 * Erguer e pousar (RN-DV.2, mockup B): ao tocar um objeto da mesa, uma folha cresce do lugar
 * dele até ocupar a tela, e ao pousar ela encolhe de volta até o mesmo objeto. Com o movimento
 * reduzido (RN-DS.14) a troca é imediata, como no mockup.
 */

/** A folha ocupa a tela abaixo da faixa de feltro; o leitor, a tela inteira. */
export type Alvo = 'folha' | 'tela';
type Retangulo = { x: number; y: number; w: number; h: number };

type Transicao = {
  registrar: (chave: string, objeto: View | null) => void;
  /** A tela erguida avisa que já foi desenhada por baixo da folha: só então a folha some. */
  chegou: () => void;
  erguer: (chave: string, cor: string, alvo: Alvo, navegar: () => void) => void;
  pousar: (chave: string, cor: string, alvo: Alvo, voltar: () => void) => void;
};

const Contexto = createContext<Transicao | null>(null);

const ERGUER = { duration: 440, easing: Easing.bezier(0.2, 0.75, 0.2, 1) };
const POUSAR = { duration: 380, easing: Easing.bezier(0.4, 0, 0.6, 1) };
const SUMIR = { duration: 180 };
/** Se a tela nova não avisar que chegou, a folha some mesmo assim, para nunca ficar presa. */
const ESPERA_MAXIMA_MS = 900;

export function BwTransicaoDaMesa({ children }: { children: ReactNode }) {
  const { theme } = useUnistyles();
  const objetos = useRef(new Map<string, View>());
  const reduzir = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const w = useSharedValue(0);
  const h = useSharedValue(0);
  const opacidade = useSharedValue(0);
  const cor = useSharedValue('transparent');

  const estilo = useAnimatedStyle(() => ({
    left: x.value,
    top: y.value,
    width: w.value,
    height: h.value,
    opacity: opacidade.value,
    backgroundColor: cor.value,
  }));

  const alvoDe = useCallback(
    (alvo: Alvo): Retangulo =>
      alvo === 'tela'
        ? { x: 0, y: 0, w: width, h: height }
        : { x: 0, y: top + ALVO_MINIMO, w: width, h: height - top - ALVO_MINIMO },
    [width, height, top]
  );

  const medir = useCallback(
    (chave: string) =>
      new Promise<Retangulo | null>((resolver) => {
        const objeto = objetos.current.get(chave);
        if (!objeto) return resolver(null);
        objeto.measureInWindow((mx, my, mw, mh) =>
          resolver(mw > 0 && mh > 0 ? { x: mx, y: my, w: mw, h: mh } : null)
        );
      }),
    []
  );

  const colocar = useCallback(
    (r: Retangulo) => {
      x.value = r.x;
      y.value = r.y;
      w.value = r.w;
      h.value = r.h;
    },
    [x, y, w, h]
  );

  const esperando = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sumir = useCallback(() => {
    opacidade.value = withTiming(0, SUMIR);
  }, [opacidade]);

  const transicao = useMemo<Transicao>(() => {
    const animar = (r: Retangulo, fim: number, config: typeof ERGUER, depois: () => void) => {
      x.value = withTiming(r.x, config);
      y.value = withTiming(r.y, config);
      w.value = withTiming(r.w, config);
      h.value = withTiming(r.h, config);
      opacidade.value = withTiming(fim, config, (terminou) => {
        if (terminou) runOnJS(depois)();
      });
    };

    return {
      chegou() {
        if (!esperando.current) return;
        clearTimeout(esperando.current);
        esperando.current = null;
        // Um quadro a mais: o layout chegou, a pintura vem no quadro seguinte.
        requestAnimationFrame(() => requestAnimationFrame(sumir));
      },

      registrar(chave, objeto) {
        if (objeto) objetos.current.set(chave, objeto);
        else objetos.current.delete(chave);
      },

      erguer(chave, c, alvo, navegar) {
        if (reduzir) return navegar();
        medir(chave).then((origem) => {
          if (!origem) return navegar();
          cor.value = c;
          colocar(origem);
          opacidade.value = 0.4;
          animar(alvoDe(alvo), 1, ERGUER, () => {
            navegar();
            esperando.current = setTimeout(sumir, ESPERA_MAXIMA_MS);
          });
        });
      },

      pousar(chave, c, alvo, voltar) {
        if (reduzir) return voltar();
        cor.value = c;
        colocar(alvoDe(alvo));
        opacidade.value = 1;
        voltar();
        // A mesa volta a ser desenhada por baixo da folha; só então o objeto tem lugar na tela.
        setTimeout(() => {
          medir(chave).then((destino) => {
            if (!destino) return sumir();
            animar(destino, 0.2, POUSAR, () => {
              opacidade.value = 0;
            });
          });
        }, 0);
      },
    };
  }, [reduzir, medir, colocar, alvoDe, sumir, x, y, w, h, opacidade, cor]);

  return (
    <Contexto.Provider value={transicao}>
      {children}
      <Animated.View
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        style={[estilos.folha, { boxShadow: theme.sup.mesa.sombra.flutuante }, estilo]}
      />
    </Contexto.Provider>
  );
}

export function useTransicaoDaMesa(): Transicao {
  const t = useContext(Contexto);
  if (!t) throw new Error('useTransicaoDaMesa fora de BwTransicaoDaMesa');
  return t;
}

const estilos = StyleSheet.create({
  folha: { position: 'absolute' },
});
