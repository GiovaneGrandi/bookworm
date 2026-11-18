import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { BwFeltroRetorno } from '../../src/componentes/BwFeltroRetorno';
import { usePousarNaMesa } from '../../src/componentes/usePousarNaMesa';
import { ALVO_MINIMO } from '../../src/tema/geometria';
import { tipo } from '../../src/tema/tipografia';

// Machado de Assis, Dom Casmurro (1899), cap. I — domínio público. Só texto de prova da E1;
// o Readium entra na E3.
const PROVA =
  'Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz ' +
  'aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, ' +
  'falou da lua e dos ministros, e acabou recitando-me versos.';

/**
 * O leitor é modo, não destino (RN-DS.18, RN-DV.9): sem chrome durante a leitura. Um toque no
 * meio revela os controles, e só então aparece "pousar na mesa".
 */
export default function Leitor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pousar = usePousarNaMesa();
  const [controles, setControles] = useState(false);
  const { top } = useSafeAreaInsets();

  return (
    <View style={estilos.folha}>
      <StatusBar style={controles ? 'light' : 'dark'} />
      <Pressable
        style={estilos.toque}
        onPress={() => setControles((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={controles ? 'Esconder os controles' : 'Mostrar os controles'}
      >
        <ScrollView contentContainerStyle={[estilos.miolo, { paddingTop: top + 54 }]}>
          <Text style={estilos.capitulo}>Do título</Text>
          <Text style={estilos.corpo}>{PROVA}</Text>
          <Text style={estilos.nota}>obra: {id}</Text>
        </ScrollView>
      </Pressable>

      {controles && (
        <View style={[estilos.controles, { paddingTop: top }]}>
          <BwFeltroRetorno onPousar={pousar} />
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  folha: {
    flex: 1,
    backgroundColor: theme.sup.papel.fundo,
  },
  toque: {
    flex: 1,
    minHeight: ALVO_MINIMO,
  },
  miolo: {
    paddingHorizontal: theme.esp[7],
    gap: theme.esp[6],
  },
  capitulo: {
    ...tipo.tituloCapitulo,
    color: theme.sup.papel.tinta,
  },
  corpo: {
    ...tipo.corpo,
    color: theme.sup.papel.tinta,
    textAlign: 'justify',
  },
  nota: {
    ...tipo.kickerMicro,
    color: theme.sup.papel.tintaFraca,
  },
  controles: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.sup.mesa.fundo,
    boxShadow: theme.sup.papel.sombra.erguido,
  },
}));
