import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BwFolha } from '../src/componentes/BwFolha';
import { tipo } from '../src/tema/tipografia';

/** A bandeja de entrada: importar EPUB ou PDF. Casca da E1; a importação entra na E2. */
export default function Bandeja() {
  return (
    <BwFolha kicker="Bandeja de entrada" titulo="Pôr um livro na mesa">
      <Text style={estilos.texto}>EPUB ou PDF do seu aparelho, ou um livro do acervo.</Text>
    </BwFolha>
  );
}

const estilos = StyleSheet.create((theme) => ({
  texto: {
    ...tipo.microcopy,
    color: theme.sup.papel.tintaFraca,
  },
}));
