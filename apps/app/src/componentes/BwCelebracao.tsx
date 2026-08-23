// `bw-celebracao` — meta, marco, obra concluída (design-system.md §6.6). Exibida na fronteira
// natural (RN-04.10b), nunca durante a leitura. RN-DS.14: reduzir movimento não pula a cerimônia
// — vira estado composto estático, não uma tela que passa. Estados: pendente, exibida.
import { StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { BwNumeroCelebracao } from './BwNumeroCelebracao.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = ComSuperficie & {
  estado: 'pendente' | 'exibida';
  novoNumero: number;
  oQueMede: string;
  mensagem: string;
};

export function BwCelebracao({
  superficie = 'papel',
  estado,
  novoNumero,
  oQueMede,
  mensagem,
}: Props) {
  const sup = useSuperficie(superficie);

  // Pendente = ainda não chegou à fronteira natural (RN-04.10c): não renderiza nada visível.
  if (estado === 'pendente') return null;

  return (
    <View accessibilityRole="alert" style={[styles.raiz, { backgroundColor: sup.fundo }]}>
      <BwNumeroCelebracao
        superficie={superficie}
        numero={novoNumero}
        oQueMede={oQueMede}
        entrando
      />
      <Text
        style={[
          styles.mensagem,
          { color: sup.tinta, fontFamily: fontFamilyPara('garamond', '400-italico') },
        ]}
      >
        {mensagem}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { alignItems: 'center', gap: 12, padding: 27 },
  mensagem: { fontSize: 19, fontStyle: 'italic', textAlign: 'center', lineHeight: 30 },
});
