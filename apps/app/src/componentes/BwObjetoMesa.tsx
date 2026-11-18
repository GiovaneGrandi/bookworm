import type { ReactNode } from 'react';
import { Pressable, type StyleProp, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO, type Giro } from '../tema/geometria';
import { BwEtiqueta } from './BwEtiqueta';

type Props = {
  /** Etiqueta datilografada: parte do objeto (RN-DV.10). */
  etiqueta: string;
  /** O que o leitor de tela anuncia: o estado da função, não a forma (RN-DS.12, RN-DV.3). */
  rotuloAcessivel: string;
  onAbrir: () => void;
  /** Posição sobre o feltro: composição livre, fora da escala tônica (RN-DV.8). */
  posicao: StyleProp<ViewStyle>;
  rotacao?: Giro | string;
  rotacaoEtiqueta?: Giro | string;
  children: ReactNode;
};

/** Um objeto pousado na mesa, que é porta para uma função (RN-DV.3). */
export function BwObjetoMesa({
  etiqueta,
  rotuloAcessivel,
  onAbrir,
  posicao,
  rotacao = '0deg',
  rotacaoEtiqueta,
  children,
}: Props) {
  return (
    <Pressable
      onPress={onAbrir}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      style={[estilos.objeto, posicao]}
    >
      {({ pressed }) => (
        <>
          <View
            style={{
              transform: pressed
                ? [{ rotate: rotacao }, { translateY: 2 }, { scale: 0.99 }]
                : [{ rotate: rotacao }],
            }}
          >
            {children}
          </View>
          <View style={estilos.etiqueta}>
            <BwEtiqueta rotacao={rotacaoEtiqueta}>{etiqueta}</BwEtiqueta>
          </View>
        </>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create((theme) => ({
  objeto: {
    position: 'absolute',
    minHeight: ALVO_MINIMO,
    minWidth: ALVO_MINIMO,
  },
  etiqueta: {
    marginTop: theme.esp[2],
  },
}));
