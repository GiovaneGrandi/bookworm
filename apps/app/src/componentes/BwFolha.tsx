import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { Tela } from '../navegacao';
import type { NomeSuperficie } from '../tema/superficies';
import { tipo } from '../tema/tipografia';
import { BwBarraDeNavegacao } from './BwBarraDeNavegacao';
import { useTransicaoDaMesa } from './BwTransicaoDaMesa';
import { usePousarNaMesa } from './usePousarNaMesa';

type Props = {
  kicker: string;
  titulo: string;
  children?: ReactNode;
  superficie?: NomeSuperficie;
  /** A tela na barra de navegação (RN-DV.11); sem ela, a folha não mostra a barra. */
  navegacao?: Exclude<Tela, 'mesa'>;
};

/**
 * Uma folha erguida da mesa (RN-DV.2): a folha de papel ocupa a tela, e volta-se à mesa pela
 * barra de navegação (RN-DV.11) ou pelo voltar do sistema.
 */
export function BwFolha({ kicker, titulo, children, superficie = 'papel', navegacao }: Props) {
  const { theme } = useUnistyles();
  const pousar = usePousarNaMesa(theme.sup[superficie].fundo);
  const { chegou } = useTransicaoDaMesa();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View onLayout={chegou} style={estilos.feltro}>
      <View style={[estilos.folha(superficie), { paddingTop: top }]}>
        <ScrollView
          contentContainerStyle={[estilos.miolo, { paddingBottom: navegacao ? 27 : bottom }]}
        >
          <Text style={estilos.kicker(superficie)}>{kicker}</Text>
          <Text accessibilityRole="header" style={estilos.titulo(superficie)}>
            {titulo}
          </Text>
          {children}
        </ScrollView>
        {navegacao && <BwBarraDeNavegacao atual={navegacao} onMesa={pousar} />}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  feltro: {
    flex: 1,
    backgroundColor: theme.sup.mesa.fundo,
  },
  folha: (superficie: NomeSuperficie) => ({
    flex: 1,
    backgroundColor: theme.sup[superficie].fundo,
    boxShadow: theme.sup.mesa.sombra.flutuante,
  }),
  miolo: {
    paddingHorizontal: theme.esp[7],
    paddingTop: theme.esp[6],
    gap: theme.esp[3],
  },
  kicker: (superficie: NomeSuperficie) => ({
    ...tipo.kicker,
    color: theme.sup[superficie].acento,
  }),
  titulo: (superficie: NomeSuperficie) => ({
    ...tipo.tituloCapitulo,
    color: theme.sup[superficie].tinta,
  }),
}));
