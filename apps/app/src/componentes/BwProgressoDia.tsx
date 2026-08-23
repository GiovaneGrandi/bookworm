// `bw-progresso-dia` — progresso da meta diária (design-system.md §6.4). Métrica é tipografia
// (P-11), nunca gráfico de biblioteca (regra 9 de direcao-visual.md §4): uma régua desenhada com
// `View`, não um componente de charts. Estados: vazio, parcial, cumprido.
import { StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = ComSuperficie & {
  realizado: number;
  meta: number;
  unidade: string;
};

export function BwProgressoDia({ superficie = 'papel', realizado, meta, unidade }: Props) {
  const sup = useSuperficie(superficie);
  const fracao = meta > 0 ? Math.min(1, realizado / meta) : 0;
  const cumprido = realizado >= meta && meta > 0;
  const estado = meta === 0 ? 'vazio' : cumprido ? 'cumprido' : 'parcial';

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: meta, now: Math.min(realizado, meta) }}
      accessibilityLabel={`${Math.round(fracao * 100)}% da meta do dia, ${estado}`}
      style={styles.raiz}
    >
      <View style={[styles.trilho, { backgroundColor: sup.tintaFraca }]}>
        <View
          style={[
            styles.preenchido,
            { width: `${fracao * 100}%`, backgroundColor: cumprido ? sup.acento : sup.acento },
          ]}
        />
      </View>
      <Text
        style={[
          styles.legenda,
          { color: sup.tinta, fontFamily: fontFamilyPara('spectral', '600') },
        ]}
      >
        {realizado}/{meta} {unidade}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { gap: 6 },
  trilho: { height: 6, borderRadius: 0, overflow: 'hidden' },
  preenchido: { height: 6 },
  legenda: { fontSize: 16, fontVariant: ['tabular-nums'] },
});
