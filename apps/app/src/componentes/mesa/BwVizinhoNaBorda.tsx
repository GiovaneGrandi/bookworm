import { Pressable, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO } from '../../tema/geometria';
import { BwCapaFechada, CAPA } from './BwCapaFechada';

/** Quanto da capa vizinha aparece na borda da mesa: o bastante para ver e para tocar. */
export const PONTA_NA_BORDA = 50;

/**
 * Deslizar o livro: o livro em leitura ao lado do aberto, fechado e pela metade na borda da mesa,
 * como quem diz "tem mais aqui". Tocar nele traz esse livro para a mesa.
 */
export function BwVizinhoNaBorda({
  titulo,
  rotulo,
  posicao,
  rotacao,
  onTrazer,
}: {
  titulo: string;
  rotulo: string;
  posicao: ViewStyle;
  rotacao: string;
  onTrazer: () => void;
}) {
  return (
    <Pressable
      onPress={onTrazer}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      hitSlop={ALVO_MINIMO / 4}
      style={[estilos.lugar, posicao]}
    >
      {({ pressed }) => (
        <View style={[{ transform: [{ rotate: rotacao }] }, pressed && estilos.pressionado]}>
          <BwCapaFechada titulo={titulo} />
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  lugar: {
    position: 'absolute',
    width: CAPA.largura,
    height: CAPA.altura,
    minHeight: ALVO_MINIMO,
  },
  pressionado: { transform: [{ translateY: 2 }] },
});
