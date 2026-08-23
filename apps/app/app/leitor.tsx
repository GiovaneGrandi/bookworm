// O leitor é modo, não destino (RN-DS.18) — por isso vive fora de `(tabs)`, como rota irmã
// apresentada em tela cheia. Estágio 7: react-native-readium ligado à máquina de estados do
// Estágio 6 — abrir a rota inicia a sessão, cada mudança de locator vira `sinalPosicao`, fechar
// encerra a sessão.
//
// RN-02.13 (modo imersivo) — implementado parcialmente nesta rodada: o "Fechar" fica atrás de um
// toque na faixa superior da tela em vez de cobrir toda a área central, para não competir com os
// gestos de virar página do próprio Readium (a biblioteca não expõe um evento de toque bruto
// separado do de navegação). A âncora de posição permanente (`RN-02.13a`) e a ocultação
// automática após 3s continuam pendentes — entram com o painel de leitura (Estágio 7, rodada
// seguinte), quando o resto do modo imersivo for construído junto.
import { type IndiceDeCaracteres, posicaoEmCaracteres } from '@bookworm/core/src/indice/index.js';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Locator } from 'react-native-readium';
import { ReadiumView } from 'react-native-readium';
import { marcarComoLendo } from '../src/biblioteca/consultas.js';
import { useCarregarObra } from '../src/leitor/useCarregarObra.js';
import { useMaquinaSessao } from '../src/sessao/maquina.js';
import { iniciarSinaisDeSessao } from '../src/sessao/sinais.js';

export default function Leitor() {
  const { obraId } = useLocalSearchParams<{ obraId: string }>();
  const { obra, carregando } = useCarregarObra(obraId);
  const sinalPosicao = useMaquinaSessao((s) => s.sinalPosicao);
  const abriuSessaoPara = useRef<string | null>(null);

  useEffect(() => {
    let pararSinais: (() => void) | null = null;
    void (async () => {
      await useMaquinaSessao.getState().inicializar();
      pararSinais = iniciarSinaisDeSessao();
    })();
    return () => pararSinais?.();
  }, []);

  useEffect(() => {
    if (!obraId || abriuSessaoPara.current === obraId) return;
    abriuSessaoPara.current = obraId;
    void marcarComoLendo(obraId);
    void useMaquinaSessao.getState().abrirObra(obraId);
  }, [obraId]);

  useEffect(() => {
    // RN-03.6 — fechar o leitor é a fronteira natural de encerramento da sessão.
    return () => {
      void useMaquinaSessao.getState().encerrar('fechado_pelo_leitor');
    };
  }, []);

  const aoMudarLocalizacao = useCallback(
    (locator: Locator) => {
      if (!obra || !locator.locations) return;
      const indice = obra.indiceCaracteres as IndiceDeCaracteres;
      try {
        const caracteres = posicaoEmCaracteres(indice, locator.href, locator.locations.progression);
        void sinalPosicao(Math.round(caracteres));
      } catch {
        // href fora do índice (ex.: recurso não-linear do spine) — sem posição de caracteres
        // correspondente, não há o que sinalizar.
      }
    },
    [obra, sinalPosicao]
  );

  if (carregando || !obra) {
    return <View style={styles.raiz} />;
  }

  return (
    <View style={styles.raiz}>
      <ReadiumView
        file={{ url: obra.caminhoArquivo }}
        preferences={{ theme: 'light' }}
        onLocationChange={aoMudarLocalizacao}
        style={styles.leitor}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar leitor"
        style={styles.faixaSuperior}
        onPress={() => router.back()}
        hitSlop={8}
      >
        <Text style={styles.fechar}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#ffffff' },
  leitor: { flex: 1 },
  faixaSuperior: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fechar: { fontSize: 18, color: 'rgba(0,0,0,0.55)' },
});
