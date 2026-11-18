import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { type Giro, giro } from '../tema/geometria';
import type { NomeSuperficie } from '../tema/superficies';
import { tipo } from '../tema/tipografia';

type Props = {
  children: string;
  /** Material da etiqueta. */
  superficie?: NomeSuperficie;
  /** Onde ela está pousada: decide a sombra (RN-DS.6). */
  sobre?: NomeSuperficie;
  rotacao?: Giro | string;
};

/**
 * Etiqueta datilografada de papel (RN-DV.10). Decorativa para o leitor de tela: quem a anuncia
 * é o objeto que a carrega, pelo próprio `accessibilityLabel`.
 */
export function BwEtiqueta({
  children,
  superficie = 'papel',
  sobre = 'mesa',
  rotacao = giro.plaqueta,
}: Props) {
  return (
    <Text
      importantForAccessibility="no"
      style={[estilos.etiqueta(superficie, sobre), { transform: [{ rotate: rotacao }] }]}
    >
      {children}
    </Text>
  );
}

const estilos = StyleSheet.create((theme) => ({
  etiqueta: (superficie: NomeSuperficie, sobre: NomeSuperficie) => ({
    ...tipo.kicker,
    alignSelf: 'flex-start',
    color: theme.sup[superficie].tinta,
    backgroundColor: theme.sup[superficie].fundo,
    paddingVertical: theme.esp[1],
    paddingHorizontal: theme.esp[3],
    boxShadow: theme.sup[sobre].sombra.pousado,
  }),
}));
