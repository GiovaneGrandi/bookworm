// `bw-ficha` — ficha de fichário, pautada, obriga grade (design-system.md §6.1,
// direcao-visual.md §4.1). A cabeça do card é opaca e interrompe a pauta (P-10) — como um objeto
// pousado numa página real. Estados: repouso, selecionado.
import type { PropsWithChildren } from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

const pauta = require('@bookworm/design/assets/pauta.png') as number;

type Props = PropsWithChildren<
  ComSuperficie & {
    aoTocar?: () => void;
    selecionado?: boolean;
    /** Conteúdo opaco no topo — o cabeçalho interrompe a pauta (P-10), nunca deixa ela atravessar. */
    cabeca?: React.ReactNode;
  }
>;

export function BwFicha({
  superficie = 'papel',
  aoTocar,
  selecionado = false,
  cabeca,
  children,
}: Props) {
  const sup = useSuperficie(superficie);
  const { theme } = useUnistyles();
  const semantico = theme.semantico[superficie];

  return (
    <Pressable
      accessibilityRole={aoTocar ? 'button' : undefined}
      accessibilityState={aoTocar ? { selected: selecionado } : undefined}
      onPress={aoTocar}
      disabled={!aoTocar}
      hitSlop={12}
    >
      <ImageBackground
        source={pauta}
        resizeMode="repeat"
        style={[
          styles.raiz,
          {
            backgroundColor: sup.fundo,
            borderColor: selecionado ? semantico.selecionadoBorda : sup.borda,
            borderWidth: selecionado ? 2 : 1,
          },
          selecionado && { backgroundColor: semantico.selecionadoFundo },
        ]}
      >
        {cabeca && <View style={[styles.cabeca, { backgroundColor: sup.fundo }]}>{cabeca}</View>}
        {children}
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: { padding: 18, gap: 6 },
  // Opaco: esconde a pauta por baixo (P-10) em vez de deixá-la atravessar o cabeçalho.
  cabeca: { paddingBottom: 6, marginBottom: 6 },
});
