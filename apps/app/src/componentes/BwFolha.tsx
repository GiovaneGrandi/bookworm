import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { NomeSuperficie } from '../tema/superficies';
import { tipo } from '../tema/tipografia';
import { BwFeltroRetorno, usePuxao } from './BwFeltroRetorno';
import { useTransicaoDaMesa } from './BwTransicaoDaMesa';
import { usePousarNaMesa } from './usePousarNaMesa';

type Props = {
  kicker: string;
  titulo: string;
  children?: ReactNode;
  superficie?: NomeSuperficie;
  rotuloRetorno?: string;
};

/**
 * Uma folha erguida da mesa (RN-DV.2): o feltro aparece no alto, como faixa de retorno, e a
 * folha de papel ocupa o resto da tela.
 */
export function BwFolha({ kicker, titulo, children, superficie = 'papel', rotuloRetorno }: Props) {
  const { theme } = useUnistyles();
  const pousar = usePousarNaMesa(theme.sup[superficie].fundo);
  const { chegou } = useTransicaoDaMesa();
  const { top, bottom } = useSafeAreaInsets();
  const { puxao, estilo } = usePuxao();

  return (
    <View onLayout={chegou} style={[estilos.feltro, { paddingTop: top }]}>
      <BwFeltroRetorno onPousar={pousar} rotulo={rotuloRetorno} puxao={puxao} />
      <Animated.View style={[estilos.folha(superficie), estilo]}>
        <ScrollView contentContainerStyle={[estilos.miolo, { paddingBottom: bottom }]}>
          <Text style={estilos.kicker(superficie)}>{kicker}</Text>
          <Text accessibilityRole="header" style={estilos.titulo(superficie)}>
            {titulo}
          </Text>
          {children}
        </ScrollView>
      </Animated.View>
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
