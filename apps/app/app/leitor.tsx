// O leitor é modo, não destino (RN-DS.18) — por isso vive fora de `(tabs)`, como rota irmã
// apresentada em tela cheia. Estágio 7: react-native-readium ligado à máquina de estados do
// Estágio 6 — abrir a rota inicia a sessão, cada mudança de locator vira `sinalPosicao`, fechar
// encerra a sessão. RN-02.6 (passo 3): ao fechar perto do fim da obra, sugere marcar como
// concluída — a transição em si é sempre confirmada pelo usuário, nunca automática.
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
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Locator } from 'react-native-readium';
import { ReadiumView } from 'react-native-readium';
import { marcarComoConcluido, marcarComoLendo } from '../src/biblioteca/consultas.js';
import { useCarregarObra } from '../src/leitor/useCarregarObra.js';
import { avaliarEAtualizarHoje } from '../src/ofensiva/servico.js';
import { useMaquinaSessao } from '../src/sessao/maquina.js';
import { iniciarSinaisDeSessao } from '../src/sessao/sinais.js';

/** RN-02.6 — "sugerido ao atingir 100% de progresso". O índice indexa todo o spine, inclusive
 * capa e ficha catalográfica (RN-02.10 excluiria esses recursos do progresso "de verdade", mas o
 * índice não os separa ainda) — por isso a margem prática de 98%, não 100% exato. */
const LIMIAR_SUGESTAO_CONCLUSAO = 0.98;

function perguntarSeConcluiu(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      'Você concluiu esta obra?',
      'Parece que você chegou ao fim da leitura.',
      [
        { text: 'Agora não', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Marcar como concluída', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}

export default function Leitor() {
  const { obraId } = useLocalSearchParams<{ obraId: string }>();
  const { obra, carregando } = useCarregarObra(obraId);
  const sinalPosicao = useMaquinaSessao((s) => s.sinalPosicao);
  const abriuSessaoPara = useRef<string | null>(null);
  const progressoRef = useRef(0);

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
    // RN-03.6 — fechar o leitor é a fronteira natural de encerramento da sessão. Rede de
    // segurança para saídas que não passam pelo botão "Fechar" (ex.: botão físico de voltar do
    // Android) — a ofensiva ainda é recalculada, só não há tela de resumo/celebração neste
    // caminho (limitação conhecida desta rodada, ver .claude/retomada.md).
    return () => {
      void (async () => {
        const tinhaSessao = useMaquinaSessao.getState().sessaoId !== null;
        await useMaquinaSessao.getState().encerrar('fechado_pelo_leitor');
        if (tinhaSessao) await avaliarEAtualizarHoje('leitura');
      })();
    };
  }, []);

  const aoFecharComResumo = useCallback(async () => {
    const tinhaSessao = useMaquinaSessao.getState().sessaoId !== null;
    await useMaquinaSessao.getState().encerrar('fechado_pelo_leitor');
    if (obraId && progressoRef.current >= LIMIAR_SUGESTAO_CONCLUSAO) {
      const confirmou = await perguntarSeConcluiu();
      if (confirmou) await marcarComoConcluido(obraId);
    }
    const { pendente } = tinhaSessao ? await avaliarEAtualizarHoje('leitura') : { pendente: false };
    router.replace({
      pathname: '/resumo',
      params: { obraId: obraId ?? '', celebracaoPendente: pendente ? '1' : '0' },
    });
  }, [obraId]);

  const aoMudarLocalizacao = useCallback(
    (locator: Locator) => {
      if (!obra || !locator.locations) return;
      const indice = obra.indiceCaracteres as IndiceDeCaracteres;
      try {
        const caracteres = posicaoEmCaracteres(indice, locator.href, locator.locations.progression);
        progressoRef.current = indice.total > 0 ? caracteres / indice.total : 0;
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
        onPress={() => void aoFecharComResumo()}
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
