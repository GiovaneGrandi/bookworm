import type { ReactNode } from 'react';
import { type GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { Obra } from '../../dados/schema';
import { corDaCapa, marcaDaCapa, rotuloDaCapa } from '../../estante';
import { ALVO_MINIMO, espelhar, giro } from '../../tema/geometria';
import { tipo, tipoMiniatura } from '../../tema/tipografia';

export const POR_PRATELEIRA = 3;
/** Os lugares vazios da última prateleira, para as capas não esticarem. */
const VAOS = ['vao-1', 'vao-2'] as const;

/**
 * As prateleiras presas na parede (direção B): três capas de frente por prateleira, cada fileira
 * apoiada numa tábua de madeira. Quem desenha a capa é quem chama.
 */
export function BwPrateleiras({
  obras,
  capa,
}: {
  obras: readonly Obra[];
  capa: (obra: Obra) => ReactNode;
}) {
  const fileiras: Obra[][] = [];
  for (let i = 0; i < obras.length; i += POR_PRATELEIRA) {
    fileiras.push(obras.slice(i, i + POR_PRATELEIRA));
  }
  return (
    <View style={estilos.prateleiras}>
      {fileiras.map((livros) => (
        <View key={livros.map((o) => o.id).join()}>
          <View style={estilos.fileira}>
            {livros.map((o) => (
              <View key={o.id} style={estilos.lugar}>
                {capa(o)}
              </View>
            ))}
            {VAOS.slice(0, POR_PRATELEIRA - livros.length).map((v) => (
              <View key={v} style={estilos.lugar} />
            ))}
          </View>
          <View style={estilos.tabua} />
        </View>
      ))}
    </View>
  );
}

/**
 * A capa na parede. O estado se vê no objeto, sem selo: quem está sendo lido tem a fita verde
 * pendurada, quem está em pausa leva uma tira de papel, quem já foi lido tem uma folha prensada.
 * Na escolha de uma parede nova, a capa marcada sobe e ganha um marcador de papel.
 */
export function BwCapaNaParede({
  obra,
  onAbrir,
  onSegurar,
  marcada,
}: {
  obra: Obra;
  onAbrir: () => void;
  onSegurar?: (e: GestureResponderEvent) => void;
  /** Só na escolha de livros: undefined fora dela. */
  marcada?: boolean;
}) {
  const cor = corDaCapa(obra.id);
  const autor = obra.autor ?? (obra.formato === 'pdf' ? 'PDF' : '');
  const escolhendo = marcada !== undefined;
  return (
    <Pressable
      onPress={onAbrir}
      onLongPress={onSegurar}
      delayLongPress={420}
      accessibilityRole={escolhendo ? 'checkbox' : 'button'}
      accessibilityState={escolhendo ? { checked: marcada } : undefined}
      accessibilityLabel={
        escolhendo
          ? `${obra.titulo.replace(/\s+/g, ' ').trim()}${autor ? `, de ${autor}` : ''}`
          : rotuloDaCapa(obra)
      }
      accessibilityHint={escolhendo ? undefined : 'Segure para mais opções'}
      style={({ pressed }) => [
        estilos.capa,
        { backgroundColor: cor.fundo },
        (pressed || marcada) && estilos.erguida,
        escolhendo && !marcada && estilos.desmarcada,
      ]}
    >
      <Text numberOfLines={3} style={[estilos.titulo, { color: cor.tinta }]}>
        {obra.titulo}
      </Text>
      <View style={estilos.pe}>
        <Text numberOfLines={1} style={[estilos.autor, { color: cor.tinta }]}>
          {autor}
        </Text>
        <Text style={[estilos.marca, { color: cor.tinta }]}>{marcaDaCapa(obra)}</Text>
      </View>

      {!escolhendo && obra.estado === 'lendo' && <View style={estilos.fita} />}
      {!escolhendo && obra.estado === 'em_pausa' && (
        <View style={estilos.tira}>
          <Text style={estilos.tiraTexto}>pausa</Text>
        </View>
      )}
      {!escolhendo && obra.estado === 'concluido' && <View style={estilos.folha} />}
      {marcada && (
        <View style={estilos.marcador}>
          <Text style={estilos.visto}>✓</Text>
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create((theme) => ({
  prateleiras: {
    gap: theme.esp[7],
  },
  fileira: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.esp[4],
    paddingHorizontal: theme.esp[2],
  },
  lugar: { flex: 1 },
  tabua: {
    height: 12,
    backgroundColor: theme.arte.parede.prateleira,
    borderTopWidth: 3,
    borderTopColor: theme.arte.parede.filete,
    boxShadow: `0 12px 18px ${theme.arte.parede.sombra}`,
  },
  capa: {
    aspectRatio: 2 / 3,
    minHeight: ALVO_MINIMO,
    justifyContent: 'space-between',
    paddingTop: theme.esp[3],
    paddingHorizontal: theme.esp[2],
    paddingBottom: theme.esp[3],
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    boxShadow: `inset 4px 0 0 ${theme.arte.estante.sombraCapa}, 3px 6px 9px ${theme.arte.parede.sombra}`,
  },
  erguida: { transform: [{ translateY: -6 }] },
  desmarcada: { opacity: 0.72 },
  titulo: {
    ...tipoMiniatura.tituloEstante,
  },
  pe: { gap: theme.esp[1] },
  autor: {
    ...tipoMiniatura.rodapeCapa,
    opacity: 0.85,
  },
  marca: {
    ...tipoMiniatura.rodapeCapa,
    opacity: 0.75,
  },
  fita: {
    position: 'absolute',
    right: 12,
    bottom: -36,
    width: 7,
    height: 42,
    zIndex: 3,
    backgroundColor: theme.arte.livro.fita.meio,
    borderBottomWidth: 4,
    borderBottomColor: theme.arte.livro.fita.borda,
  },
  tira: {
    position: 'absolute',
    right: -6,
    top: 18,
    paddingHorizontal: theme.esp[2],
    backgroundColor: theme.arte.parede.marcador,
    transform: [{ rotate: espelhar(giro.carimbo) }],
    boxShadow: `0 2px 4px ${theme.arte.parede.sombra}`,
  },
  tiraTexto: {
    ...tipo.marginalia,
    color: theme.sup.papel.tinta,
  },
  folha: {
    position: 'absolute',
    right: 9,
    top: -15,
    width: 13,
    height: 24,
    borderTopLeftRadius: 13,
    borderBottomRightRadius: 13,
    backgroundColor: theme.arte.parede.folhaPrensada,
    transform: [{ rotate: espelhar(giro.carimbo) }],
  },
  marcador: {
    position: 'absolute',
    left: '35%',
    top: -24,
    width: 24,
    height: 36,
    alignItems: 'center',
    backgroundColor: theme.arte.parede.marcador,
    boxShadow: `0 2px 4px ${theme.arte.parede.sombra}`,
  },
  visto: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.papel.acento,
  },
}));
