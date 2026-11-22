import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO, raio } from '../../tema/geometria';
import { tipo } from '../../tema/tipografia';

export type ItemDaLista = {
  titulo: string;
  sub: string;
  primario?: boolean;
  /** Sem ação: um objeto da v2 cuja tela ainda não existe. */
  aoTocar?: () => void;
};

type Props = { data: string; saudacao: string; itens: ItemDaLista[] };

/**
 * A mesa em lista (v2, "Texto grande"): com a fonte do sistema acima de 150%, os objetos viram
 * fichas grandes numa coluna só, na mesma ordem de leitura da mesa.
 */
export function BwMesaEmLista({ data, saudacao, itens }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[estilos.miolo, { paddingTop: top + 12, paddingBottom: bottom + 27 }]}
    >
      <Text style={estilos.data}>{data}</Text>
      <Text accessibilityRole="header" style={estilos.saudacao}>
        {saudacao}
      </Text>
      {itens.map((item) =>
        item.aoTocar ? (
          <Pressable
            key={item.titulo}
            onPress={item.aoTocar}
            accessibilityRole="button"
            accessibilityLabel={`${item.titulo}. ${item.sub}`}
            style={({ pressed }) => [
              estilos.item,
              item.primario && estilos.primario,
              pressed && estilos.pressionado,
            ]}
          >
            <Text style={[estilos.titulo, item.primario && estilos.tintaPrimaria]}>
              {item.titulo}
            </Text>
            <Text style={[estilos.sub, item.primario && estilos.tintaPrimaria]}>{item.sub}</Text>
          </Pressable>
        ) : (
          <View
            key={item.titulo}
            accessible
            accessibilityLabel={`${item.titulo}. ${item.sub}`}
            accessibilityState={{ disabled: true }}
            style={[estilos.item, estilos.reservado]}
          >
            <Text style={[estilos.titulo, estilos.tintaReservada]}>{item.titulo}</Text>
            <Text style={[estilos.sub, estilos.tintaReservada]}>{item.sub}</Text>
          </View>
        )
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create((theme) => ({
  miolo: {
    paddingHorizontal: theme.esp[5],
  },
  data: {
    ...tipo.kickerAbertura,
    color: theme.sup.mesa.tintaFraca,
  },
  saudacao: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.mesa.tinta,
    marginTop: theme.esp[1],
    marginBottom: theme.esp[5],
  },
  item: {
    minHeight: ALVO_MINIMO,
    backgroundColor: theme.sup.papel.fundo,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: theme.sup.papel.borda,
    ...raio.irregularM,
    paddingVertical: theme.esp[4],
    paddingHorizontal: theme.esp[5],
    marginBottom: theme.esp[3],
    boxShadow: theme.sup.mesa.sombra.erguido,
  },
  primario: {
    backgroundColor: theme.semantico.papel.acaoPrimaria,
    borderColor: theme.semantico.papel.acaoPrimaria,
  },
  pressionado: { transform: [{ translateY: 2 }] },
  reservado: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderColor: theme.sup.mesa.borda,
    boxShadow: 'none',
  },
  titulo: {
    ...tipo.corpo,
    color: theme.sup.papel.tinta,
  },
  sub: {
    ...tipo.corpoPequeno,
    color: theme.sup.papel.tintaFraca,
  },
  tintaPrimaria: { color: theme.semantico.papel.acaoPrimariaTinta },
  tintaReservada: { color: theme.sup.mesa.tintaFraca },
}));
