import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Medidas do marcador do carrossel: uma fitinha de 6 × 11 com o rabo cortado em "V" embaixo,
// o corte subindo um quarto da altura.
const LARGURA = 6;
const ALTURA = 11;
const CORTE = ALTURA / 4;

/**
 * Um marcador do carrossel da mesa: uma fitinha de pano com o rabo em "V", como as fitas dos
 * livros. A do livro aberto é de latão; as outras, do creme apagado do feltro.
 */
export function BwMarcadorDeFita({ atual }: { atual: boolean }) {
  const { theme } = useUnistyles();
  const cor = atual ? theme.arte.carrossel.atual : theme.arte.carrossel.apagado;
  return (
    <View style={estilos.fita}>
      <View style={[estilos.corpo, { backgroundColor: cor }]} />
      <View style={estilos.rabo}>
        <View style={[estilos.pontaEsquerda, { borderTopColor: cor }]} />
        <View style={[estilos.pontaDireita, { borderTopColor: cor }]} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fita: { width: LARGURA, height: ALTURA },
  corpo: { width: LARGURA, height: ALTURA - CORTE },
  rabo: { flexDirection: 'row' },
  // Cada ponta é um triângulo feito de borda: a de cima pinta, a do lado é transparente.
  pontaEsquerda: {
    width: 0,
    height: 0,
    borderTopWidth: CORTE,
    borderRightWidth: LARGURA / 2,
    borderRightColor: 'transparent',
  },
  pontaDireita: {
    width: 0,
    height: 0,
    borderTopWidth: CORTE,
    borderLeftWidth: LARGURA / 2,
    borderLeftColor: 'transparent',
  },
});
