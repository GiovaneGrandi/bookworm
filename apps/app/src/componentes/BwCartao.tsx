// `bw-cartao` — cartão solto sobre a mesa (design-system.md §6.1). Estados: repouso, pressionado.
// P-4 sombra de objeto pousado (atravessa nativo via `style.boxShadow`, Anexo A) + P-5 rotação de
// imperfeição + P-6 raio irregular (só o primeiro eixo por canto, confirmado pelo Anexo A).
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { raio } from '../tema/geometria.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = PropsWithChildren<
  ComSuperficie & {
    aoTocar?: () => void;
    /** Graus — RN-DS.9: só rotações do conjunto nomeado (`tema/geometria.ts`), sinal alternado entre vizinhos. */
    rotacaoDeg?: number;
  }
>;

export function BwCartao({ superficie = 'papel', aoTocar, rotacaoDeg = 0, children }: Props) {
  const sup = useSuperficie(superficie);

  const conteudo = (
    <View
      style={[
        styles.raiz,
        {
          backgroundColor: sup.fundo,
          borderColor: sup.borda,
          transform: [{ rotate: `${rotacaoDeg}deg` }],
          // biome-ignore lint/suspicious/noExplicitAny: boxShadow (CSS-like) atravessa nativo no RN 0.86/Fabric (Anexo A, P-4) mas ainda não está no tipo ViewStyle.
          boxShadow: `0px 2px 5px ${sup.sombra}` as any,
        },
        {
          borderTopLeftRadius: raio.irregularP.topLeft,
          borderTopRightRadius: raio.irregularP.topRight,
          borderBottomRightRadius: raio.irregularP.bottomRight,
          borderBottomLeftRadius: raio.irregularP.bottomLeft,
        },
      ]}
    >
      {children}
    </View>
  );

  if (!aoTocar) return conteudo;

  return (
    <Pressable accessibilityRole="button" onPress={aoTocar} hitSlop={12}>
      {conteudo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: { padding: 18, borderWidth: 1 },
});
