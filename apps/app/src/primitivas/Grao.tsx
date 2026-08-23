// P-1 — grão de papel. Anexo A: "atravessa" sem ressalva — PNG 7×7 @3x via ImageBackground +
// resizeMode: repeat, migrado direto da receita medida no Estágio 1 (probe/src/TelaPrimitivas.tsx).
import type { PropsWithChildren } from 'react';
import { ImageBackground, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

const grao = require('@bookworm/design/assets/grao-7.png') as number;

type Props = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export function Grao({ style, children }: Props) {
  return (
    <ImageBackground source={grao} resizeMode="repeat" style={[styles.preenche, style]}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({ preenche: { flex: 1 } });
