import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { BwObjetoMesa } from '../src/componentes/BwObjetoMesa';
import { espelhar, giro, raio } from '../src/tema/geometria';
import { tipo } from '../src/tema/tipografia';

/**
 * A mesa — tela inicial e único hub (RN-DV.1). Provisória na E1: os objetos só têm a forma
 * grosseira e levam às suas folhas. O estado real (gaveta com contagens, livro na página
 * corrente) entra na E2, e a arte em Skia na E4.
 */
export default function Mesa() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View style={estilos.mesa}>
      <View pointerEvents="none" style={estilos.poca} />

      <View style={[estilos.cabeca, { top: top + 27 }]}>
        <Text style={estilos.slip}>{hoje()}</Text>
        <Text style={estilos.saudacao}>{saudacao()}</Text>
      </View>

      <BwObjetoMesa
        etiqueta="Leitor · prova da E1"
        rotuloAcessivel="Abrir o leitor de prova"
        onAbrir={() => router.push('/leitor/prova')}
        posicao={{ left: 30, top: top + 160 }}
        rotacao="-2deg"
        rotacaoEtiqueta={giro.rotulo}
      >
        <View style={estilos.livro}>
          <View style={estilos.pagina} />
          <View style={estilos.pagina} />
        </View>
      </BwObjetoMesa>

      <BwObjetoMesa
        etiqueta="Importar"
        rotuloAcessivel="Bandeja de entrada: adicionar EPUB ou PDF"
        onAbrir={() => router.push('/bandeja')}
        posicao={{ left: 24, bottom: 120 }}
        rotacaoEtiqueta={espelhar(giro.plaqueta)}
      >
        <View style={estilos.bandeja}>
          <View style={estilos.envelope} />
        </View>
      </BwObjetoMesa>

      <BwObjetoMesa
        etiqueta="Gaveta"
        rotuloAcessivel="Gaveta do fichário: livros lendo, em pausa e quero ler"
        onAbrir={() => router.push('/gaveta')}
        posicao={{ right: 30, bottom: 108 }}
        rotacao="1deg"
        rotacaoEtiqueta={giro.plaqueta}
      >
        <View style={estilos.gaveta}>
          <View style={estilos.puxador} />
        </View>
      </BwObjetoMesa>

      <View pointerEvents="none" style={estilos.luminaria} />
    </View>
  );
}

function hoje(): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
    .format(new Date())
    .replace(/\./g, '')
    .replace(',', ' ·');
}

function saudacao(): string {
  const hora = new Date().getHours();
  if (hora < 5 || hora >= 18) return 'boa noite';
  return hora < 12 ? 'bom dia' : 'boa tarde';
}

const estilos = StyleSheet.create((theme) => ({
  mesa: {
    flex: 1,
    backgroundColor: theme.sup.mesa.fundo,
    overflow: 'hidden',
  },
  poca: {
    position: 'absolute',
    left: -60,
    top: 40,
    width: 520,
    height: 520,
    experimental_backgroundImage: theme.luz.poca,
  },
  cabeca: {
    position: 'absolute',
    left: 18,
    right: 120,
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: theme.esp[4],
  },
  slip: {
    ...tipo.kicker,
    color: theme.sup.papelFundo.tinta,
    backgroundColor: theme.sup.papelFundo.fundo,
    paddingVertical: theme.esp[1],
    paddingHorizontal: theme.esp[3],
    transform: [{ rotate: giro.rotulo }],
    boxShadow: theme.sup.mesa.sombra.pousado,
  },
  saudacao: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.mesa.tinta,
    transform: [{ rotate: espelhar(giro.etiqueta) }],
  },
  livro: {
    flexDirection: 'row',
    width: 300,
    height: 210,
    boxShadow: theme.sup.mesa.sombra.erguido,
  },
  pagina: {
    flex: 1,
    backgroundColor: theme.sup.papel.fundo,
    borderWidth: 1,
    borderColor: theme.sup.papel.borda,
  },
  bandeja: {
    width: 156,
    height: 104,
    borderWidth: 3,
    borderColor: theme.sup.mesa.tintaFraca,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envelope: {
    width: 112,
    height: 66,
    backgroundColor: theme.sup.papel.fundo,
    transform: [{ rotate: '5deg' }],
    boxShadow: theme.sup.mesa.sombra.pousado,
  },
  gaveta: {
    width: 150,
    height: 96,
    backgroundColor: theme.sup.kraft.fundo,
    borderWidth: 1,
    borderColor: theme.sup.kraft.borda,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.sup.mesa.sombra.erguido,
  },
  puxador: {
    width: 54,
    height: 12,
    backgroundColor: theme.sup.carvao.fundo,
    borderRadius: raio.minimo,
  },
  luminaria: {
    position: 'absolute',
    right: -58,
    top: -46,
    width: 176,
    height: 176,
    borderRadius: 88,
    experimental_backgroundImage: theme.luz.luminaria,
    boxShadow: theme.luz.luminariaSombra,
  },
}));
