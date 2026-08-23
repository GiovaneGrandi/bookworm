// `bw-cabeca` — cabeçalho de tela: título + retorno + ação (design-system.md §6.2). Um único
// estado (repouso); anúncio "cabeçalho" via `accessibilityRole="header"` no título.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = ComSuperficie & {
  titulo: string;
  aoVoltar?: () => void;
  acao?: { rotulo: string; aoTocar: () => void };
};

export function BwCabeca({ superficie = 'papel', titulo, aoVoltar, acao }: Props) {
  const sup = useSuperficie(superficie);

  return (
    <View style={[styles.raiz, { backgroundColor: sup.fundo, borderBottomColor: sup.borda }]}>
      {aoVoltar && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          onPress={aoVoltar}
          style={styles.alvoDeToque}
        >
          <Text style={{ color: sup.tinta, fontFamily: fontFamilyPara('mono', '700') }}>‹</Text>
        </Pressable>
      )}
      <Text
        accessibilityRole="header"
        style={[styles.titulo, { color: sup.tinta, fontFamily: fontFamilyPara('spectral', '500') }]}
      >
        {titulo}
      </Text>
      {acao && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={acao.rotulo}
          hitSlop={12}
          onPress={acao.aoTocar}
          style={styles.alvoDeToque}
        >
          <Text
            style={{
              color: sup.acento,
              fontFamily: fontFamilyPara('mono', '700'),
              fontSize: 10.5,
              letterSpacing: 0.34,
              textTransform: 'uppercase',
            }}
          >
            {acao.rotulo}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  titulo: { flex: 1, fontSize: 20 },
  // RN-DS.10 — alvo de toque mínimo 48×48dp mesmo quando o desenho visível é menor.
  alvoDeToque: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
