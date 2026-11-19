import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { tipoMiniatura } from '../../tema/tipografia';

// O segundo livro em leitura, fechado (mockup B, `.o-medico`): capa de couro com lombada escura
// e filete dourado em volta do título.
export const CAPA = { largura: 118, altura: 150 } as const;

/** Nome de arquivo ("capitulo-teste") pode quebrar depois do hífen, não no meio da palavra. */
const quebravel = (titulo: string) => titulo.replace(/([-_.])/g, '$1​');

export function BwCapaFechada({ titulo }: { titulo: string }) {
  return (
    <View style={estilos.capa}>
      <View style={estilos.lombada} />
      <View style={estilos.filete} />
      <Text style={estilos.titulo} numberOfLines={2}>
        {quebravel(titulo)}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  capa: {
    width: CAPA.largura,
    height: CAPA.altura,
    backgroundColor: theme.arte.capa.couro,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    boxShadow: theme.sup.mesa.sombra.erguido,
  },
  lombada: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: theme.esp[3],
    backgroundColor: theme.arte.capa.lombada,
  },
  filete: {
    position: 'absolute',
    left: 24,
    right: theme.esp[4],
    top: theme.esp[5],
    height: 36,
    borderWidth: 1,
    borderColor: theme.arte.capa.filete,
  },
  titulo: {
    ...tipoMiniatura.tituloCapa,
    position: 'absolute',
    left: 28,
    right: 14,
    top: 22,
    color: theme.arte.capa.titulo,
  },
}));
