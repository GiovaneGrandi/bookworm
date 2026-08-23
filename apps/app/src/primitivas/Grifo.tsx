// P-7 — grifo multiplicado. Anexo A: "atravessa — achado positivo não previsto pela spec":
// `style.mixBlendMode: 'multiply'` funciona nativamente no RN 0.86/Fabric, sem overlay.
// `bw-grifo` do inventário (§6.5) — marca em 1 dos 4 pigmentos da leitora, nunca da marca
// (direcao-visual.md §2), lidos de `theme.grifo.*`, nunca de `pigmento` direto (RN-DS.1).
import type { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type NomePigmentoDeGrifo = 'ambar' | 'oliva' | 'tinta' | 'carmim';

type Props = PropsWithChildren<{
  pigmento: NomePigmentoDeGrifo;
  /** `bw-grifo`: repouso, selecionado (destacado e focado pela leitora agora). */
  selecionado?: boolean;
}>;

export function Grifo({ pigmento, selecionado = false, children }: Props) {
  const { theme } = useUnistyles();
  return (
    <Text
      accessibilityLabel={
        typeof children === 'string' ? `${children}, destacado` : 'trecho destacado'
      }
      style={[
        styles.base,
        {
          backgroundColor: theme.grifo[pigmento],
          mixBlendMode: 'multiply',
        },
        selecionado && styles.selecionado,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {},
  selecionado: { textDecorationLine: 'underline' },
});
