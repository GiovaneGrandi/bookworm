// `bw-botao` — ação (design-system.md §6.3). Variantes primário/secundário/texto; P-9 botão de
// papel — relevo sólido de 2px, sem gradiente, afunda ao toque (RN-DS.8: raio zero é o padrão).
// Estados: repouso, pressionado, desabilitado, carregando.
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { duracaoMs } from '../tema/movimento.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

export type VarianteBotao = 'primario' | 'secundario' | 'texto';

type Props = ComSuperficie & {
  rotulo: string;
  aoTocar: () => void;
  variante?: VarianteBotao;
  desabilitado?: boolean;
  carregando?: boolean;
};

export function BwBotao({
  superficie = 'papel',
  rotulo,
  aoTocar,
  variante = 'primario',
  desabilitado = false,
  carregando = false,
}: Props) {
  const sup = useSuperficie(superficie);
  const [pressionado, setPressionado] = useState(false);
  const bloqueado = desabilitado || carregando;

  const corDeFundo =
    variante === 'primario' ? sup.acento : variante === 'secundario' ? sup.fundo : 'transparent';
  const corDoTexto = variante === 'primario' ? sup.fundo : bloqueado ? sup.tintaFraca : sup.acento;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
      disabled={bloqueado}
      onPressIn={() => setPressionado(true)}
      onPressOut={() => setPressionado(false)}
      onPress={aoTocar}
      style={[
        styles.base,
        variante !== 'texto' && {
          backgroundColor: corDeFundo,
          borderBottomWidth: pressionado ? 0 : 2,
          borderBottomColor: 'rgba(0,0,0,0.28)',
          transform: [{ translateY: pressionado ? 2 : 0 }],
        },
        variante === 'secundario' && { borderWidth: 1, borderColor: sup.borda },
        // RN-DS.16 — desabilitado é tinta fraca E ausência de sombra, nunca só opacidade.
        bloqueado && { opacity: variante === 'texto' ? 0.6 : 1 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corDoTexto} size="small" />
      ) : (
        <Text
          style={[styles.rotulo, { color: corDoTexto, fontFamily: fontFamilyPara('mono', '700') }]}
        >
          {rotulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotulo: { fontSize: 13, letterSpacing: 0.1, textTransform: 'uppercase' },
});

// `duracaoMs` importado para a transição de `pressionado` — hoje aplicada via mudança de estilo
// direta (sem Reanimated), mantém `--mov-instantaneo` documentado como o alvo quando a transição
// ganhar animação real no Estágio 6+.
export const DURACAO_PRESSIONADO_MS = duracaoMs.instantaneo;
