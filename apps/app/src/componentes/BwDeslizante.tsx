import { useRef, useState } from 'react';
import { type GestureResponderEvent, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO } from '../tema/geometria';
import type { NomeSuperficie } from '../tema/superficies';
import { tipo } from '../tema/tipografia';

type Props = {
  rotulo: string;
  /** Como o valor é dito e escrito: "4.200 K", "17 px". Falado pelo leitor de tela. */
  valorFalado: string;
  valor: number;
  min: number;
  max: number;
  passo: number;
  onMudar: (valor: number) => void;
  superficie?: NomeSuperficie;
  /** O controle de maior peso do painel (RN-02.16a: a temperatura). */
  grande?: boolean;
  /** Pinta o trilho: a régua de temperatura vai do âmbar ao azulado. */
  fundoDoTrilho?: string;
};

/**
 * bw-deslizante (design-system.md §6.3): arrastar ou tocar no trilho ajusta o valor; para o
 * leitor de tela é um controle "adjustable", com o valor falado (RN-DS.12).
 */
export function BwDeslizante({
  rotulo,
  valorFalado,
  valor,
  min,
  max,
  passo,
  onMudar,
  superficie = 'papel',
  grande = false,
  fundoDoTrilho,
}: Props) {
  const largura = useRef(1);
  const [arrastando, setArrastando] = useState(false);
  const fracao = (valor - min) / (max - min || 1);

  function emX(e: GestureResponderEvent) {
    const x = Math.min(largura.current, Math.max(0, e.nativeEvent.locationX));
    const bruto = min + (x / largura.current) * (max - min);
    onMudar(Math.round(bruto / passo) * passo);
  }

  return (
    <View style={estilos.bloco}>
      <View style={estilos.cabeca}>
        <Text style={estilos.rotulo(superficie)}>{rotulo}</Text>
        <Text style={estilos.valor(superficie, grande)}>{valorFalado}</Text>
      </View>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={rotulo}
        accessibilityValue={{ text: valorFalado }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) =>
          onMudar(
            Math.min(
              max,
              Math.max(min, valor + (e.nativeEvent.actionName === 'increment' ? passo : -passo))
            )
          )
        }
        onLayout={(e) => {
          largura.current = e.nativeEvent.layout.width;
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(e) => {
          setArrastando(true);
          emX(e);
        }}
        onResponderMove={emX}
        onResponderRelease={() => setArrastando(false)}
        onResponderTerminate={() => setArrastando(false)}
        style={estilos.area}
      >
        <View
          pointerEvents="none"
          style={[
            estilos.trilho(superficie, grande),
            fundoDoTrilho ? { experimental_backgroundImage: fundoDoTrilho } : null,
          ]}
        />
        <View
          pointerEvents="none"
          style={[estilos.marca(superficie, grande, arrastando), { left: `${fracao * 100}%` }]}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  bloco: {
    gap: theme.esp[1],
  },
  cabeca: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  rotulo: (superficie: NomeSuperficie) => ({
    ...tipo.kicker,
    color: theme.sup[superficie].tinta,
  }),
  valor: (superficie: NomeSuperficie, grande: boolean) => ({
    ...(grande ? tipo.dadoTabular : tipo.kicker),
    fontVariant: ['tabular-nums'],
    color: theme.sup[superficie].tinta,
  }),
  area: {
    minHeight: ALVO_MINIMO,
    justifyContent: 'center',
  },
  trilho: (superficie: NomeSuperficie, grande: boolean) => ({
    height: grande ? 12 : 2,
    backgroundColor: theme.sup[superficie].borda,
  }),
  marca: (superficie: NomeSuperficie, grande: boolean, arrastando: boolean) => ({
    position: 'absolute',
    width: grande ? 6 : 4,
    height: grande ? 36 : 24,
    transform: [{ translateX: grande ? -3 : -2 }],
    backgroundColor: theme.sup[superficie].acento,
    boxShadow: arrastando
      ? theme.sup[superficie].sombra.erguido
      : theme.sup[superficie].sombra.pousado,
  }),
}));
