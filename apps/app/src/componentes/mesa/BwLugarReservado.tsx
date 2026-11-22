import { Text, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { type Giro, giro, raio } from '../../tema/geometria';
import { tipo } from '../../tema/tipografia';
import { BwEtiqueta } from '../BwEtiqueta';

type Props = {
  /** O nome do objeto que vai ocupar o lugar (v2: Jardim, Desempenho, Ajustes). */
  etiqueta: string;
  /** O que a função vai ser, para o leitor de tela. */
  descricao: string;
  forma: 'circulo' | 'retangulo';
  posicao: ViewStyle;
  largura: number;
  altura: number;
  camada: number;
  rotacao?: string;
  etiquetaEm: ViewStyle;
  rotacaoEtiqueta?: Giro | string;
};

/**
 * O lugar de um objeto da v2 cuja tela ainda não existe: o contorno dele riscado no feltro, com
 * a etiqueta. Não inventa estado (nada de "23 dias" de um jardim que não há) nem abre nada.
 */
export function BwLugarReservado({
  etiqueta,
  descricao,
  forma,
  posicao,
  largura,
  altura,
  camada,
  rotacao = '0deg',
  etiquetaEm,
  rotacaoEtiqueta,
}: Props) {
  return (
    <View
      accessible
      accessibilityLabel={`${etiqueta}: ${descricao}. Em breve`}
      accessibilityState={{ disabled: true }}
      style={[estilos.lugar, posicao, { width: largura, height: altura, zIndex: camada }]}
    >
      <View style={[estilos.giro, { transform: [{ rotate: rotacao }] }]}>
        <View style={[estilos.contorno, forma === 'circulo' && estilos.circulo]}>
          <Text style={estilos.lapis}>em breve</Text>
        </View>
        <View style={[estilos.etiqueta, etiquetaEm]}>
          <BwEtiqueta rotacao={rotacaoEtiqueta}>{etiqueta}</BwEtiqueta>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  lugar: { position: 'absolute' },
  giro: { flex: 1 },
  contorno: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.sup.mesa.borda,
    ...raio.irregularM,
  },
  // O vaso visto de cima é redondo.
  circulo: {
    borderTopLeftRadius: raio.circulo,
    borderTopRightRadius: raio.circulo,
    borderBottomRightRadius: raio.circulo,
    borderBottomLeftRadius: raio.circulo,
  },
  lapis: {
    ...tipo.marginalia,
    color: theme.sup.mesa.tintaFraca,
    transform: [{ rotate: giro.marginalia }],
  },
  etiqueta: { position: 'absolute' },
}));
