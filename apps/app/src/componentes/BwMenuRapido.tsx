import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO, raio } from '../tema/geometria';
import { tipo } from '../tema/tipografia';

export type ItemDoMenu = {
  rotulo: string;
  primario?: boolean;
  /** O item muda o próprio menu (um passo de confirmação) em vez de fechá-lo. */
  manterAberto?: boolean;
  aoTocar: () => void;
};

export type MenuRapido = {
  titulo: string;
  sub: string;
  itens: ItemDoMenu[];
  /** Uma linha a lápis embaixo dos itens, para avisar do que vem a seguir. */
  aviso?: string;
  /** Onde o dedo segurou, em coordenadas da janela. */
  x: number;
  y: number;
};

const LARGURA = 240;
const MARGEM = 12;

/**
 * O menu de toque longo (v2): uma ficha de papel pousada perto do dedo, sobre um véu que escurece
 * a mesa. Tocar fora fecha, como o gesto de voltar.
 */
export function BwMenuRapido({
  menu,
  onFechar,
}: {
  menu: MenuRapido | null;
  onFechar: () => void;
}) {
  const { width, height } = useWindowDimensions();
  if (!menu) return null;

  const alturaEstimada = 60 + menu.itens.length * ALVO_MINIMO + (menu.aviso ? 48 : 0);
  const left = Math.max(MARGEM, Math.min(width - LARGURA - MARGEM, menu.x + MARGEM));
  const top = Math.max(60, Math.min(height - alturaEstimada - 27, menu.y + MARGEM));

  return (
    <Modal
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <Pressable
        onPress={onFechar}
        accessibilityRole="button"
        accessibilityLabel="Fechar o menu"
        style={estilos.veu}
      />
      <Animated.View
        entering={FadeIn.duration(180)}
        accessibilityViewIsModal
        style={[estilos.ficha, { left, top }]}
      >
        <View style={estilos.cabeca}>
          <Text style={estilos.sub}>{menu.sub}</Text>
          <Text accessibilityRole="header" style={estilos.titulo}>
            {menu.titulo}
          </Text>
        </View>
        {menu.itens.map((item, i) => (
          <Pressable
            key={item.rotulo}
            onPress={() => {
              item.aoTocar();
              if (!item.manterAberto) onFechar();
            }}
            accessibilityRole="menuitem"
            style={({ pressed }) => [
              estilos.item,
              i === menu.itens.length - 1 && estilos.ultimo,
              pressed && estilos.pressionado,
            ]}
          >
            <Text style={[estilos.rotulo, item.primario && estilos.primario]}>{item.rotulo}</Text>
          </Pressable>
        ))}
        {menu.aviso && <Text style={estilos.aviso}>{menu.aviso}</Text>}
      </Animated.View>
    </Modal>
  );
}

const estilos = StyleSheet.create((theme) => ({
  veu: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.arte.veu,
  },
  ficha: {
    position: 'absolute',
    width: LARGURA,
    backgroundColor: theme.sup.papel.fundo,
    borderWidth: 1,
    borderColor: theme.sup.papelFundo.borda,
    ...raio.irregularM,
    boxShadow: theme.sup.mesa.sombra.erguido,
    overflow: 'hidden',
  },
  cabeca: {
    paddingTop: theme.esp[3],
    paddingBottom: theme.esp[2],
    paddingHorizontal: theme.esp[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.sup.papel.borda,
  },
  sub: {
    ...tipo.kickerMicro,
    color: theme.sup.papel.acento,
  },
  titulo: {
    ...tipo.microcopy,
    color: theme.sup.papel.tinta,
  },
  item: {
    minHeight: ALVO_MINIMO,
    justifyContent: 'center',
    paddingHorizontal: theme.esp[4],
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderBottomColor: theme.sup.papelFundo.borda,
  },
  ultimo: { borderBottomWidth: 0 },
  pressionado: { backgroundColor: theme.semantico.papel.selecionadoFundo },
  rotulo: {
    ...tipo.corpo,
    color: theme.sup.papel.tinta,
  },
  primario: {
    fontFamily: tipo.dadoTabular.fontFamily,
    color: theme.sup.papel.acento,
  },
  aviso: {
    ...tipo.marginalia,
    color: theme.sup.papel.tinta,
    paddingHorizontal: theme.esp[4],
    paddingBottom: theme.esp[3],
  },
}));
