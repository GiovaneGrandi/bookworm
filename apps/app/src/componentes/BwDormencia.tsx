// `bw-dormencia` — ofensiva quebrada (P-12, design-system.md §6.6; RN-04.25, RN-04.14a). Mesma
// composição de P-2/P-4 em paleta de mesa (Anexo A: "atravessa", mesma ressalva de P-2). Anuncia
// os três números: zero corrente, marca encerrada, recorde — nunca omite a sequência encerrada,
// nunca a mostra como se ainda estivesse correndo (RN-04.14a).
import { StyleSheet, Text, View } from 'react-native';
import { LuzSobreAFolha } from '../primitivas/LuzSobreAFolha.js';
import { fontFamilyPara } from '../tema/fontes.js';
import { useSuperficie } from './useSuperficie.js';

type Props = {
  contagemEncerrada: number;
  melhorMarca: number;
  mensagem: string;
};

export function BwDormencia({ contagemEncerrada, melhorMarca, mensagem }: Props) {
  // A dormência é sempre sobre a mesa, dessaturada — não é uma superfície escolhível por prop.
  const sup = useSuperficie('mesa');

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Ofensiva em dormência. Corrente: zero. Sequência encerrada: ${contagemEncerrada} dias. Recorde: ${melhorMarca} dias. ${mensagem}`}
      style={[styles.raiz, { backgroundColor: sup.fundo }]}
    >
      <View style={styles.palcoDaArte}>
        <LuzSobreAFolha intensidade={0.12} />
      </View>
      <View style={styles.numeros}>
        <NumeroPequeno sup={sup} rotulo="corrente" valor={0} />
        <NumeroPequeno sup={sup} rotulo="encerrada" valor={contagemEncerrada} />
        <NumeroPequeno sup={sup} rotulo="recorde" valor={melhorMarca} />
      </View>
      <Text
        style={[
          styles.mensagem,
          { color: sup.tintaFraca, fontFamily: fontFamilyPara('spectral', '400') },
        ]}
      >
        {mensagem}
      </Text>
    </View>
  );
}

function NumeroPequeno({
  sup,
  rotulo,
  valor,
}: {
  sup: { tinta: string; tintaFraca: string };
  rotulo: string;
  valor: number;
}) {
  return (
    <View style={styles.numeroPequeno}>
      <Text
        style={[styles.valor, { color: sup.tinta, fontFamily: fontFamilyPara('spectral', '600') }]}
      >
        {valor}
      </Text>
      <Text
        style={[
          styles.rotulo,
          { color: sup.tintaFraca, fontFamily: fontFamilyPara('mono', '400') },
        ]}
      >
        {rotulo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { alignItems: 'center', gap: 18, padding: 27 },
  palcoDaArte: { width: 160, height: 100, overflow: 'hidden', borderRadius: 4 },
  numeros: { flexDirection: 'row', gap: 27 },
  numeroPequeno: { alignItems: 'center', gap: 3 },
  valor: { fontSize: 34, fontVariant: ['tabular-nums'] },
  rotulo: { fontSize: 7.5, letterSpacing: 0.2, textTransform: 'uppercase' },
  mensagem: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
