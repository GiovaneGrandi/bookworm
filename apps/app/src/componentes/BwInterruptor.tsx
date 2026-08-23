// `bw-interruptor` — chave única liga/desliga (RN-02.17f: retorno sensorial do leitor, um só
// interruptor para toda a resposta a gesto). Trilho + corrediça, sem círculo (RN-DS.8): raio
// irregular padrão, como o cursor de `BwControleContinuo`.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { raio } from '../tema/geometria.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = ComSuperficie & {
  rotulo: string;
  ativo: boolean;
  aoAlternar: (ativo: boolean) => void;
};

export function BwInterruptor({ superficie = 'papel', rotulo, ativo, aoAlternar }: Props) {
  const sup = useSuperficie(superficie);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={rotulo}
      accessibilityState={{ checked: ativo }}
      onPress={() => aoAlternar(!ativo)}
      style={styles.linha}
    >
      <Text
        style={[styles.rotulo, { color: sup.tinta, fontFamily: fontFamilyPara('spectral', '400') }]}
      >
        {rotulo}
      </Text>
      <View style={[styles.trilho, { backgroundColor: ativo ? sup.acento : sup.borda }]}>
        <View
          style={[
            styles.corredica,
            { backgroundColor: sup.fundo, transform: [{ translateX: ativo ? 18 : 0 }] },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rotulo: { fontSize: 16 },
  trilho: {
    width: 42,
    height: 24,
    borderRadius: raio.minimo,
    padding: 3,
    justifyContent: 'center',
  },
  corredica: {
    width: 18,
    height: 18,
    borderTopLeftRadius: raio.irregularP.topLeft,
    borderTopRightRadius: raio.irregularP.topRight,
    borderBottomRightRadius: raio.irregularP.bottomRight,
    borderBottomLeftRadius: raio.irregularP.bottomLeft,
  },
});
