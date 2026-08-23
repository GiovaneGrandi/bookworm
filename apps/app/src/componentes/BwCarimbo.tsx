// `bw-carimbo` — marca de sessão, meta, marco (P-8, design-system.md §6.4). Tinta seca,
// irregular, rotacionada, opaca. Usa o acento da própria superfície — CLAUDE.md: a identidade é
// verde, o oxblood do rascunho não sobrevive nesta versão. RN-DS.12: anuncia o dado, nunca
// "imagem". Estados: repouso, batendo.
import { StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { giro } from '../tema/geometria.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = ComSuperficie & {
  texto: string;
  batendo?: boolean;
};

export function BwCarimbo({ superficie = 'papel', texto, batendo = false }: Props) {
  const sup = useSuperficie(superficie);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={texto}
      style={[
        styles.raiz,
        {
          borderColor: sup.acento,
          transform: [{ rotate: `${giro.carimbo}deg` }, { scale: batendo ? 1.06 : 1 }],
          opacity: 0.8,
        },
      ]}
    >
      <Text
        style={[styles.texto, { color: sup.acento, fontFamily: fontFamilyPara('mono', '700') }]}
      >
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: {
    width: 88,
    height: 88,
    borderRadius: 9999, // RN-DS.8 — círculo é exclusivo de carimbo e selo
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { fontSize: 12, letterSpacing: 0.2, textTransform: 'uppercase', textAlign: 'center' },
});
