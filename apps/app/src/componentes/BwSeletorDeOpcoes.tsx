// `bw-seletor-de-opcoes` — escolha única entre N opções nomeadas (tema, alinhamento, família de
// fonte do painel de leitura, RN-02.16d). Chips versalete mono, mesmo tratamento visual do
// alternador Biblioteca/Estante (Estágio 7 passo 3) — ativo ganha o acento da superfície como
// fundo, os demais ficam em tinta fraca sobre borda.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

export type OpcaoSeletor<T extends string> = { valor: T; rotulo: string };

type Props<T extends string> = ComSuperficie & {
  rotulo: string;
  opcoes: readonly OpcaoSeletor<T>[];
  valorSelecionado: T;
  aoSelecionar: (valor: T) => void;
};

export function BwSeletorDeOpcoes<T extends string>({
  superficie = 'papel',
  rotulo,
  opcoes,
  valorSelecionado,
  aoSelecionar,
}: Props<T>) {
  const sup = useSuperficie(superficie);

  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={rotulo}>
      <Text
        style={[
          styles.rotulo,
          { color: sup.tintaFraca, fontFamily: fontFamilyPara('mono', '400') },
        ]}
      >
        {rotulo}
      </Text>
      <View style={styles.linha}>
        {opcoes.map((opcao) => {
          const ativo = opcao.valor === valorSelecionado;
          return (
            <Pressable
              key={opcao.valor}
              accessibilityRole="radio"
              accessibilityLabel={opcao.rotulo}
              accessibilityState={{ selected: ativo }}
              onPress={() => aoSelecionar(opcao.valor)}
              style={[
                styles.chip,
                {
                  borderColor: ativo ? sup.acento : sup.borda,
                  backgroundColor: ativo ? sup.acento : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.textoChip,
                  {
                    color: ativo ? sup.fundo : sup.tinta,
                    fontFamily: fontFamilyPara('mono', ativo ? '700' : '400'),
                  },
                ]}
              >
                {opcao.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: {
    fontSize: 10.5,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoChip: { fontSize: 12, letterSpacing: 0.1 },
});
