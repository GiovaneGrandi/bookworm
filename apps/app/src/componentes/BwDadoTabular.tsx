// `bw-dado-tabular` — Spectral 22px, célula de largura fixa (P-11, design-system.md §6.4).
// Estados: repouso, carregando, vazio.
import { StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

export type EstadoBwDadoTabular = 'repouso' | 'carregando' | 'vazio';

type Props = ComSuperficie & {
  rotulo: string;
  valor: string;
  estado?: EstadoBwDadoTabular;
};

export function BwDadoTabular({ superficie = 'papel', rotulo, valor, estado = 'repouso' }: Props) {
  const sup = useSuperficie(superficie);
  const mostrarValor = estado === 'repouso';

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${rotulo}: ${mostrarValor ? valor : estado === 'vazio' ? 'sem dado' : 'carregando'}`}
      style={styles.raiz}
    >
      <Text
        style={[
          styles.rotulo,
          { color: sup.tintaFraca, fontFamily: fontFamilyPara('mono', '400') },
        ]}
      >
        {rotulo}
      </Text>
      <Text
        style={[
          styles.valor,
          {
            color: mostrarValor ? sup.tinta : sup.tintaFraca,
            fontFamily: fontFamilyPara('spectral', '600'),
          },
        ]}
      >
        {mostrarValor ? valor : '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { minWidth: 72, gap: 3 },
  rotulo: { fontSize: 7.5, letterSpacing: 0.2, textTransform: 'uppercase' },
  valor: { fontSize: 22, lineHeight: 27, fontVariant: ['tabular-nums'] },
});
