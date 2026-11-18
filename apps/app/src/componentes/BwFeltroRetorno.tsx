import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO } from '../tema/geometria';
import { tipo } from '../tema/tipografia';

type Props = {
  onPousar: () => void;
  rotulo?: string;
};

/**
 * A faixa de feltro que sobra no alto de toda folha erguida (RN-DV.2): tocá-la devolve a folha
 * à mesa. Substitui barra de abas e seta de voltar.
 */
export function BwFeltroRetorno({ onPousar, rotulo = 'pousar na mesa' }: Props) {
  return (
    <Pressable
      onPress={onPousar}
      accessibilityRole="button"
      accessibilityLabel="Voltar à mesa"
      style={({ pressed }) => [estilos.faixa, pressed && estilos.pressionada]}
    >
      <Text style={estilos.rotulo}>▴ {rotulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create((theme) => ({
  faixa: {
    minHeight: ALVO_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionada: {
    backgroundColor: theme.semantico.mesa.selecionadoFundo,
  },
  rotulo: {
    ...tipo.kicker,
    color: theme.sup.mesa.tinta,
  },
}));
