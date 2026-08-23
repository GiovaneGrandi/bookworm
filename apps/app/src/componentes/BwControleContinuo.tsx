// `bw-controle-continuo` — ajuste contínuo (corpo, entrelinha, margem, temperatura de luz,
// brilho — RN-02.16d). Trilho fino como um fio (P-1 companion, não pauta) com carimbo pequeno de
// cursor; preenchimento até o cursor no acento da superfície. RN-02.16e — todo movimento chama
// `aoMudarAoVivo` (pré-visualização imediata); só o toque solto persiste, via `aoSoltar`.
// RN-02.16f — "restaurar" individual embutido, sempre visível quando o valor difere do padrão.
import { useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { raio } from '../tema/geometria.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

function grampear(valor: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, valor));
}

type Props = ComSuperficie & {
  rotulo: string;
  valor: number;
  minimo: number;
  maximo: number;
  padrao: number;
  formatarValor: (valor: number) => string;
  aoMudarAoVivo: (valor: number) => void;
  aoSoltar: (valor: number) => void;
};

export function BwControleContinuo({
  superficie = 'papel',
  rotulo,
  valor,
  minimo,
  maximo,
  padrao,
  formatarValor,
  aoMudarAoVivo,
  aoSoltar,
}: Props) {
  const sup = useSuperficie(superficie);
  const [larguraTrilho, setLarguraTrilho] = useState(0);
  const valorRef = useRef(valor);
  valorRef.current = valor;

  const valorNaPosicao = (x: number): number => {
    if (larguraTrilho <= 0) return valorRef.current;
    const razao = grampear(x, 0, larguraTrilho) / larguraTrilho;
    return grampear(minimo + razao * (maximo - minimo), minimo, maximo);
  };

  const respondedor = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evento) => aoMudarAoVivo(valorNaPosicao(evento.nativeEvent.locationX)),
      onPanResponderRelease: (evento) => aoSoltar(valorNaPosicao(evento.nativeEvent.locationX)),
    })
  ).current;

  const razaoAtual = grampear((valor - minimo) / (maximo - minimo), 0, 1);
  const forceDoPadrao = Math.abs(valor - padrao) > 0.001;

  return (
    <View>
      <View style={styles.cabecalho}>
        <Text
          style={[
            styles.rotulo,
            { color: sup.tintaFraca, fontFamily: fontFamilyPara('mono', '400') },
          ]}
        >
          {rotulo}
        </Text>
        <View style={styles.cabecalhoDireita}>
          <Text
            style={[styles.valor, { color: sup.tinta, fontFamily: fontFamilyPara('mono', '400') }]}
          >
            {formatarValor(valor)}
          </Text>
          {forceDoPadrao && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Restaurar ${rotulo.toLowerCase()} ao padrão`}
              hitSlop={12}
              onPress={() => {
                aoMudarAoVivo(padrao);
                aoSoltar(padrao);
              }}
            >
              <Text
                style={[
                  styles.restaurar,
                  { color: sup.acento, fontFamily: fontFamilyPara('mono', '700') },
                ]}
              >
                padrão
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel={rotulo}
        accessibilityValue={{ min: minimo, max: maximo, now: valor }}
        style={styles.trilhoToque}
        onLayout={(evento) => setLarguraTrilho(evento.nativeEvent.layout.width)}
        {...respondedor.panHandlers}
      >
        <View style={[styles.trilho, { backgroundColor: sup.borda }]}>
          <View
            style={[
              styles.preenchido,
              { backgroundColor: sup.acento, width: `${razaoAtual * 100}%` },
            ]}
          />
        </View>
        <View
          style={[styles.cursor, { backgroundColor: sup.acento, left: `${razaoAtual * 100}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cabecalhoDireita: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  rotulo: { fontSize: 10.5, letterSpacing: 0.2, textTransform: 'uppercase' },
  valor: { fontSize: 12 },
  restaurar: { fontSize: 10.5, letterSpacing: 0.2, textTransform: 'uppercase' },
  trilhoToque: { minHeight: 48, justifyContent: 'center' },
  trilho: { height: 2, borderRadius: 1 },
  preenchido: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 1 },
  cursor: {
    position: 'absolute',
    width: 18,
    height: 18,
    // RN-DS.8 — círculo é exclusivo de carimbo e selo; o cursor usa o raio irregular padrão.
    borderTopLeftRadius: raio.irregularP.topLeft,
    borderTopRightRadius: raio.irregularP.topRight,
    borderBottomRightRadius: raio.irregularP.bottomRight,
    borderBottomLeftRadius: raio.irregularP.bottomLeft,
    marginLeft: -9,
    top: '50%',
    marginTop: -9,
  },
});
