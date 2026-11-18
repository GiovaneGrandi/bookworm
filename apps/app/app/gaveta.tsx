import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BwFolha } from '../src/componentes/BwFolha';
import { tipo } from '../src/tema/tipografia';

/** A gaveta do fichário: lendo, em pausa e quero ler. Casca da E1; os grupos entram na E2. */
export default function Gaveta() {
  return (
    <BwFolha kicker="Gaveta do fichário" titulo="Lendo, em pausa, quero ler">
      <Text style={estilos.texto}>A gaveta ainda está vazia.</Text>
    </BwFolha>
  );
}

const estilos = StyleSheet.create((theme) => ({
  texto: {
    ...tipo.microcopy,
    color: theme.sup.papel.tintaFraca,
  },
}));
