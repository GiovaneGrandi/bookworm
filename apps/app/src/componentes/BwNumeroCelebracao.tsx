// `bw-numero-celebracao` — Spectral 96px, tabular-nums (P-11, design-system.md §6.4). RN-DS.12:
// anuncia o dado e o que ele mede, nunca "imagem". Estados: repouso, entrando.
import { StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = ComSuperficie & {
  numero: number;
  /** O que o número mede, falado pelo leitor de tela (RN-DS.12) — nunca só o dígito. */
  oQueMede: string;
  entrando?: boolean;
};

export function BwNumeroCelebracao({
  superficie = 'papel',
  numero,
  oQueMede,
  entrando = false,
}: Props) {
  const sup = useSuperficie(superficie);

  return (
    <View accessibilityRole="text" accessibilityLabel={`${numero} ${oQueMede}`}>
      <Text
        style={[
          styles.numero,
          { color: sup.acento, fontFamily: fontFamilyPara('spectral', '600') },
          entrando && styles.entrando,
        ]}
        allowFontScaling={false}
      >
        {numero.toLocaleString('pt-BR')}
      </Text>
      <Text
        style={[
          styles.legenda,
          { color: sup.tintaFraca, fontFamily: fontFamilyPara('mono', '400') },
        ]}
      >
        {oQueMede}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  numero: { fontSize: 96, fontVariant: ['tabular-nums'], lineHeight: 100 },
  entrando: { opacity: 0.85 },
  legenda: { fontSize: 8.5, letterSpacing: 0.26, textTransform: 'uppercase' },
});
