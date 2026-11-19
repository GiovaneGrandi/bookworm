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
  /** Na cor de ação da superfície, com a tinta do papel (mockup B: "Continuar · Alice · p. 68"). */
  destaque?: boolean;
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
  destaque = false,
}: Props) {
  return (
    <Text
      importantForAccessibility="no"
      style={[
        estilos.etiqueta(superficie, sobre),
        destaque && estilos.destaque(superficie),
        { transform: [{ rotate: rotacao }] },
      ]}
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
  destaque: (superficie: NomeSuperficie) => ({
    color: theme.semantico[superficie].acaoPrimariaTinta,
    backgroundColor: theme.semantico[superficie].acaoPrimaria,
  }),
}));
