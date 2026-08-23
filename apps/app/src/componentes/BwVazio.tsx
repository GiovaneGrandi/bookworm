// `bw-vazio` — estado sem conteúdo, com arte (design-system.md §6.6, RN-DS.16: "vazio e dormência
// recebem arte"; regra 10 de direcao-visual.md: "uma dormência feia pune; uma dormência linda
// convida" — o mesmo investimento vale para o vazio comum). Composição P-2 (luz) sobre P-1 (grão):
// a mesma receita medida no Estágio 1, sem texto cinza genérico.
import { StyleSheet, Text, View } from 'react-native';
import { LuzSobreAFolha } from '../primitivas/LuzSobreAFolha.js';
import { fontFamilyPara } from '../tema/fontes.js';
import { BwBotao } from './BwBotao.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = ComSuperficie & {
  titulo: string;
  explicacao: string;
  saida?: { rotulo: string; aoTocar: () => void };
};

export function BwVazio({ superficie = 'papel', titulo, explicacao, saida }: Props) {
  const sup = useSuperficie(superficie);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${titulo}. ${explicacao}`}
      style={styles.raiz}
    >
      <View style={styles.palcoDaArte}>
        <LuzSobreAFolha intensidade={0.28} />
      </View>
      <Text
        style={[styles.titulo, { color: sup.tinta, fontFamily: fontFamilyPara('spectral', '500') }]}
      >
        {titulo}
      </Text>
      <Text
        style={[
          styles.explicacao,
          { color: sup.tintaFraca, fontFamily: fontFamilyPara('spectral', '400') },
        ]}
      >
        {explicacao}
      </Text>
      {saida && <BwBotao superficie={superficie} rotulo={saida.rotulo} aoTocar={saida.aoTocar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { alignItems: 'center', justifyContent: 'center', padding: 54, gap: 12 },
  palcoDaArte: { width: 120, height: 90, marginBottom: 12, overflow: 'hidden', borderRadius: 4 },
  titulo: { fontSize: 20, textAlign: 'center' },
  explicacao: { fontSize: 16, lineHeight: 27, textAlign: 'center' },
});
