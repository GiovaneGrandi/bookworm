// `bw-abas-fichario` — navegação de primeiro nível (design-system.md §10). Quatro abas na borda
// inferior, opacas — interrompem a mesa (P-10), não flutuam sobre ela. Rotação mínima alternada
// (RN-DS.9). A ativa avança para a frente; as inativas ficam recuadas em tinta fraca, nunca
// abaixo do piso de contraste (RN-DS.11: tinta fraca aqui é texto grande o bastante para o piso
// de 3,27:1 valer — rótulo de aba não é corpo de leitura).
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { giro } from '../tema/geometria.js';
import { useSuperficie } from './useSuperficie.js';

export type ItemAbaFichario = {
  chave: string;
  rotulo: string;
};

type Props = {
  itens: ItemAbaFichario[];
  chaveAtiva: string;
  aoSelecionar: (chave: string) => void;
};

// RN-DS.9 — sinais alternados entre vizinhas, dentro do conjunto nomeado de rotações.
const ROTACOES = [giro.plaqueta, -giro.plaqueta, giro.rotulo, -giro.rotulo];

export function BwAbasFichario({ itens, chaveAtiva, aoSelecionar }: Props) {
  // As abas interrompem a mesa (P-10): superfície própria, opaca, não a superfície do conteúdo.
  const sup = useSuperficie('mesa');

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.raiz, { backgroundColor: sup.fundo, borderTopColor: sup.borda }]}
    >
      {itens.map((item, i) => {
        const ativo = item.chave === chaveAtiva;
        return (
          <Pressable
            key={item.chave}
            accessibilityRole="tab"
            accessibilityLabel={item.rotulo}
            accessibilityState={{ selected: ativo }}
            onPress={() => aoSelecionar(item.chave)}
            style={styles.aba}
          >
            <View
              style={[
                styles.plaqueta,
                {
                  backgroundColor: ativo ? sup.acento : 'transparent',
                  transform: [
                    { rotate: `${ROTACOES[i % ROTACOES.length]}deg` },
                    { translateY: ativo ? -3 : 0 },
                  ],
                },
              ]}
            >
              <Text
                style={[
                  styles.rotulo,
                  { color: ativo ? sup.fundo : sup.tintaFraca, fontWeight: ativo ? '700' : '400' },
                ]}
              >
                {item.rotulo}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 6 },
  aba: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  plaqueta: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 2 },
  rotulo: { fontSize: 10.5, letterSpacing: 0.2, textTransform: 'uppercase' },
});
