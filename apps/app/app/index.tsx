import { objetosNaMesa } from '@bookworm/core';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { BwObjetoMesa } from '../src/componentes/BwObjetoMesa';
import { marcarAberta, useObras } from '../src/dados/obras';
import type { Obra } from '../src/dados/schema';
import { espelhar, giro, raio } from '../src/tema/geometria';
import { tipo } from '../src/tema/tipografia';

/**
 * A mesa — tela inicial e único hub (RN-DV.1). Cada objeto é porta e mostra o estado da
 * função (RN-DV.3); só os 2 livros em leitura mais recentes ficam pousados (RN-DV.4).
 * As formas ainda são provisórias: a arte em Skia entra na E4.
 */
export default function Mesa() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const mesa = objetosNaMesa(useObras());
  const [principal, segundo] = mesa.livros;

  function continuar(o: Obra) {
    marcarAberta(o.id);
    router.push(`/leitor/${o.id}`);
  }

  const rotuloGaveta =
    mesa.gaveta.total === 0
      ? 'Gaveta do fichário, vazia'
      : `Gaveta do fichário: ${mesa.gaveta.lendo} lendo, ${mesa.gaveta.em_pausa} em pausa, ${mesa.gaveta.quero_ler} quero ler`;

  return (
    <View style={estilos.mesa}>
      <View pointerEvents="none" style={estilos.poca} />

      <View style={[estilos.cabeca, { top: top + 27 }]}>
        <Text style={estilos.slip}>{hoje()}</Text>
        <Text style={estilos.saudacao}>{saudacao()}</Text>
      </View>

      {principal && (
        <BwObjetoMesa
          etiqueta={`Continuar · ${principal.titulo}`}
          rotuloAcessivel={`Continuar lendo ${principal.titulo}, ${pct(principal)}% lido`}
          onAbrir={() => continuar(principal)}
          posicao={{ left: 30, top: top + 150 }}
          rotacao="-2deg"
          rotacaoEtiqueta={giro.rotulo}
        >
          <View style={estilos.livro}>
            <View style={estilos.pagina}>
              <Text style={estilos.kickerPagina}>{principal.autor ?? 'lendo'}</Text>
              <Text style={estilos.tituloPagina} numberOfLines={3}>
                {principal.titulo}
              </Text>
            </View>
            <View style={[estilos.pagina, estilos.paginaDireita]}>
              <Text style={estilos.folio}>{pct(principal)}%</Text>
            </View>
          </View>
        </BwObjetoMesa>
      )}

      {segundo && (
        <BwObjetoMesa
          etiqueta={`lendo · ${pct(segundo)}%`}
          rotuloAcessivel={`${segundo.titulo}, ${pct(segundo)}% lido. Continuar lendo`}
          onAbrir={() => continuar(segundo)}
          posicao={{ right: 26, top: top + 400 }}
          rotacao="3deg"
          rotacaoEtiqueta={espelhar(giro.rotulo)}
        >
          <View style={estilos.capa}>
            <Text style={estilos.tituloCapa} numberOfLines={4}>
              {quebravel(segundo.titulo)}
            </Text>
          </View>
        </BwObjetoMesa>
      )}

      <BwObjetoMesa
        etiqueta={mesa.vazia ? 'Ponha um livro na mesa' : 'Importar'}
        rotuloAcessivel="Bandeja de entrada: adicionar EPUB, PDF ou um livro do acervo"
        onAbrir={() => router.push('/bandeja')}
        posicao={mesa.vazia ? { left: 44, top: top + 250 } : { left: 24, bottom: 120 }}
        rotacao={mesa.vazia ? '-1deg' : '0deg'}
        rotacaoEtiqueta={espelhar(giro.plaqueta)}
      >
        <View style={[estilos.bandeja, mesa.vazia && estilos.bandejaDestaque]}>
          <View style={[estilos.envelope, mesa.vazia && estilos.envelopeDestaque]}>
            <Text style={estilos.envelopeTexto}>+ EPUB · PDF</Text>
          </View>
        </View>
      </BwObjetoMesa>

      <BwObjetoMesa
        etiqueta={mesa.gaveta.total === 0 ? 'Gaveta · vazia' : `Gaveta · ${mesa.gaveta.total}`}
        rotuloAcessivel={rotuloGaveta}
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

const pct = (o: Obra) => Math.round(o.progresso * 100);

/** Nome de arquivo ("capitulo-teste") pode quebrar depois do hífen, não no meio da palavra. */
const quebravel = (titulo: string) => titulo.replace(/([-_.])/g, '$1\u200B');

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
    padding: theme.esp[4],
    gap: theme.esp[2],
  },
  paginaDireita: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  kickerPagina: {
    ...tipo.kickerMicro,
    color: theme.sup.papel.tintaFraca,
  },
  tituloPagina: {
    ...tipo.microcopy,
    color: theme.sup.papel.tinta,
  },
  folio: {
    ...tipo.kickerMicro,
    fontVariant: ['tabular-nums'],
    color: theme.sup.papel.tintaFraca,
  },
  capa: {
    width: 112,
    height: 156,
    backgroundColor: theme.sup.carvao.fundo,
    borderWidth: 1,
    borderColor: theme.sup.carvao.borda,
    padding: theme.esp[4],
    justifyContent: 'center',
    boxShadow: theme.sup.mesa.sombra.erguido,
  },
  tituloCapa: {
    ...tipo.microcopy,
    color: theme.sup.carvao.tinta,
    textAlign: 'center',
  },
  bandeja: {
    width: 156,
    height: 104,
    borderWidth: 3,
    borderColor: theme.sup.mesa.tintaFraca,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bandejaDestaque: {
    width: 300,
    height: 200,
    boxShadow: theme.sup.mesa.sombra.erguido,
  },
  envelope: {
    width: 112,
    height: 66,
    backgroundColor: theme.sup.papel.fundo,
    transform: [{ rotate: '5deg' }],
    boxShadow: theme.sup.mesa.sombra.pousado,
    justifyContent: 'flex-end',
    padding: theme.esp[2],
  },
  envelopeDestaque: {
    width: 220,
    height: 130,
    padding: theme.esp[4],
  },
  envelopeTexto: {
    ...tipo.marginalia,
    color: theme.sup.papel.tintaFraca,
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
