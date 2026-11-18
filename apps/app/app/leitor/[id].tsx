import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { BwFeltroRetorno } from '../../src/componentes/BwFeltroRetorno';
import { usePousarNaMesa } from '../../src/componentes/usePousarNaMesa';
import { useObra } from '../../src/dados/obras';
import { ALVO_MINIMO } from '../../src/tema/geometria';
import { tipo } from '../../src/tema/tipografia';

/**
 * O leitor é modo, não destino (RN-DS.18, RN-DV.9): sem chrome durante a leitura. Um toque no
 * meio revela os controles, e só então aparece "pousar na mesa". Na E2 ele só mostra qual obra
 * abriu; o texto, pelo Readium, entra na E3.
 */
export default function Leitor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const obra = useObra(id);
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
          <Text style={estilos.kicker}>
            {obra?.autor ?? (obra?.formato === 'pdf' ? 'fotocópia' : '')}
          </Text>
          <Text style={estilos.titulo}>{obra?.titulo ?? 'Obra não encontrada'}</Text>
          <Text style={estilos.corpo}>
            {obra?.formato === 'pdf'
              ? 'Este PDF vai abrir como fotocópia, página por página, quando o leitor chegar.'
              : `O texto deste livro chega na próxima etapa, com o leitor de verdade.${
                  obra?.totalCaracteres
                    ? ` Ele tem ${obra.totalCaracteres.toLocaleString('pt-BR')} caracteres de conteúdo principal.`
                    : ''
                }`}
          </Text>
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
    gap: theme.esp[4],
  },
  kicker: {
    ...tipo.kicker,
    color: theme.sup.papel.acento,
  },
  titulo: {
    ...tipo.tituloCapitulo,
    color: theme.sup.papel.tinta,
  },
  corpo: {
    ...tipo.corpo,
    color: theme.sup.papel.tinta,
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
