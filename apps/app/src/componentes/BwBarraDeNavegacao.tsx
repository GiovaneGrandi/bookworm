import { objetosNaMesa } from '@bookworm/core';
import { Canvas, Group, Path } from '@shopify/react-native-skia';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { marcarAberta, useObras } from '../dados/obras';
import { type Destino, itensDaBarra } from '../navegacao';
import { ALVO_MINIMO } from '../tema/geometria';
import { tipo } from '../tema/tipografia';

// Os ícones de traço da régua, desenhados numa grade de 24 (protótipo da barra, estilo A).
const ICONES: Record<Destino, string> = {
  mesa: 'M4.5 7h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-9A1.5 1.5 0 0 1 4.5 7z M19.5 5a2 2 0 1 1-4 0a2 2 0 1 1 4 0z M7 11h5v4H7z',
  ler: 'M3 6.5c3-1.2 6-1 9 .8 3-1.8 6-2 9-.8v12c-3-1.2-6-1-9 .8-3-1.8-6-2-9-.8z M12 7.3v12',
  biblioteca: 'M4 7h4.2v13H4z M9.6 9.5h4v10.5h-4z M15 4.5h4.6v15.5H15z M4 10h4.2 M15 7.5h4.6',
  importar: 'M3 14.5h5l1 2.5h6l1-2.5h5V20H3z M12 3.5v9 M8.5 9l3.5 3.5L15.5 9',
  jardim:
    'M7 14h10l-1.5 6h-7z M12 14V8.5 M12 10.5c-3 0-4.5-1.8-4.5-4.3 3 0 4.5 1.8 4.5 4.3z M12 9c0-2.8 1.7-4.3 4.4-4.3 0 2.8-1.7 4.3-4.4 4.3z',
};
const LADO = 22;

type Props = {
  /** A tela em que a barra está. */
  atual: Exclude<Destino, 'mesa'>;
  /** Como esta tela volta à mesa (a mesma saída da faixa de feltro). */
  onMesa: () => void;
};

/**
 * A barra de navegação, estilo régua de feltro (RN-DV.11): qualquer tela a um toque. Trocar de
 * tela substitui a atual em vez de empilhar, então o voltar do sistema leva sempre à mesa.
 */
export function BwBarraDeNavegacao({ atual, onMesa }: Props) {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { bottom } = useSafeAreaInsets();
  const [livro] = objetosNaMesa(useObras()).livros;
  const itens = itensDaBarra(atual, livro ?? null);

  function ir(destino: Destino) {
    if (destino === atual) return;
    if (destino === 'mesa') return onMesa();
    if (destino === 'ler' && livro) {
      marcarAberta(livro.id);
      router.replace({ pathname: '/leitor/[id]', params: { id: livro.id, via: 'barra' } });
    } else if (destino === 'biblioteca') {
      router.replace({ pathname: '/gaveta', params: { via: 'barra' } });
    } else if (destino === 'importar') {
      router.replace({ pathname: '/bandeja', params: { via: 'barra' } });
    }
  }

  return (
    <View accessibilityRole="tablist" style={[estilos.barra, { paddingBottom: bottom }]}>
      {itens.map((item) => {
        const cor = item.atual
          ? theme.arte.barra.ativo
          : item.disponivel
            ? theme.sup.mesa.tintaFraca
            : theme.sup.mesa.borda;
        return (
          <Pressable
            key={item.destino}
            onPress={() => ir(item.destino)}
            disabled={!item.disponivel}
            accessibilityRole="tab"
            accessibilityLabel={item.rotuloAcessivel}
            accessibilityState={{ selected: item.atual, disabled: !item.disponivel }}
            style={({ pressed }) => [estilos.item, pressed && estilos.pressionado]}
          >
            {item.atual && <View style={estilos.filete} />}
            <Canvas style={estilos.icone}>
              <Group transform={[{ scale: LADO / 24 }]}>
                <Path
                  path={ICONES[item.destino]}
                  style="stroke"
                  strokeWidth={1.6}
                  strokeCap="round"
                  strokeJoin="round"
                  color={cor}
                />
              </Group>
            </Canvas>
            <Text style={[estilos.rotulo, { color: cor }]}>{item.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  barra: {
    flexDirection: 'row',
    backgroundColor: theme.arte.barra.fundo,
    borderTopWidth: 1,
    borderTopColor: theme.arte.barra.filete,
    boxShadow: theme.arte.barra.sombra,
  },
  item: {
    flex: 1,
    minHeight: ALVO_MINIMO + 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.esp[1],
  },
  pressionado: {
    backgroundColor: theme.semantico.mesa.selecionadoFundo,
  },
  filete: {
    position: 'absolute',
    top: 0,
    left: '30%',
    right: '30%',
    height: 2,
    experimental_backgroundImage: `linear-gradient(90deg, ${theme.arte.barra.latao[0]}, ${theme.arte.barra.latao[1]})`,
  },
  icone: { width: LADO, height: LADO },
  rotulo: {
    ...tipo.kickerMicro,
  },
}));
