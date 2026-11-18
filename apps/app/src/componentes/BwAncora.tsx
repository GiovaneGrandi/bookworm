import type { Ancora, TemaLeitura } from '@bookworm/core';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { tipo } from '../tema/tipografia';

type Props = {
  nivel: Ancora;
  tema: TemaLeitura;
  /** Fração lida da obra, de 0 a 1. */
  fracao: number;
  /** "p. 12 de 250 · Um chá maluco": só no nível `posicao_numero`. */
  rotulo: string;
};

/** Altura da faixa marginal que a âncora ocupa, fora da mancha do texto (RN-02.13a). */
export const ALTURA_DA_ANCORA = 27;

/**
 * bw-ancora-posicao (RN-02.13a): onde estou na obra, e nada mais (RN-02.13b). `posicao` é o
 * fio sem dígito; `posicao_numero` soma a página canônica e o capítulo. Nunca é a peça de maior
 * peso da página.
 */
export function BwAncora({ nivel, tema, fracao, rotulo }: Props) {
  if (nivel === 'nenhuma') return null;
  const pct = Math.round(Math.min(1, Math.max(0, fracao)) * 100);
  return (
    <View
      style={estilos.faixa}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Posição na obra"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: pct,
        text: nivel === 'posicao_numero' ? rotulo : `${pct}%`,
      }}
    >
      <View style={estilos.fio(tema)}>
        <View style={[estilos.lido(tema), { width: `${pct}%` }]} />
      </View>
      {nivel === 'posicao_numero' && (
        <Text style={estilos.rotulo(tema)} numberOfLines={1}>
          {rotulo}
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  faixa: {
    height: ALTURA_DA_ANCORA,
    paddingHorizontal: theme.esp[7],
    justifyContent: 'center',
    gap: theme.esp[1],
  },
  fio: (tema: TemaLeitura) => ({
    height: 1,
    backgroundColor: theme.leitura[tema].tintaFraca,
    opacity: 0.5,
  }),
  lido: (tema: TemaLeitura) => ({
    height: 1,
    backgroundColor: theme.leitura[tema].tinta,
  }),
  rotulo: (tema: TemaLeitura) => ({
    ...tipo.kickerMicro,
    textAlign: 'center',
    color: theme.leitura[tema].tintaFraca,
  }),
}));
