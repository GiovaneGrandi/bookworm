// O leitor é modo, não destino (RN-DS.18) — por isso vive fora de `(tabs)`, como rota irmã
// apresentada em tela cheia. Estágio 7: react-native-readium ligado à máquina de estados do
// Estágio 6 — abrir a rota inicia a sessão, cada mudança de locator vira `sinalPosicao`, fechar
// encerra a sessão. RN-02.6 (passo 3): ao fechar perto do fim da obra, sugere marcar como
// concluída — a transição em si é sempre confirmada pelo usuário, nunca automática.
//
// RN-02.13 (modo imersivo) — implementado parcialmente nesta rodada: "Fechar" e "Preferências"
// ficam atrás de toques na faixa superior da tela em vez de um toque na área central, para não
// competir com os gestos de virar página do próprio Readium (a biblioteca não expõe um evento de
// toque bruto separado do de navegação). A âncora de posição permanente (`RN-02.13a`) continua
// pendente — o indicador nativo do react-native-readium não expõe prop para os 3 níveis, decisão
// do usuário via `AskUserQuestion` de adiar só esse controle (ver `.claude/retomada.md`). A
// ocultação automática após 3s do resto do modo imersivo também segue pendente.
//
// Estágio 7 passo 7 (RN-02.17, resposta a gesto): a curva de desaceleração da virada de página e
// o preenchimento progressivo do grifo (RN-02.17b/c) exigem patch nativo no Readium/WebView — sem
// hook exposto por `ReadiumView.nitro.ts` — e ficaram fora desta rodada por decisão do usuário via
// `AskUserQuestion`. O que dá para controlar por aqui foi implementado: um toque háptico leve a
// cada virada de página, a cada grifo/anotação salvos e a cada consulta ao dicionário, todos atrás
// da chave única `prefs.retornoSensorialAtivo` (RN-02.17f, painel de preferências do passo 5) via
// `hapticoSeAtivo`. RN-02.17d (vestígio do dicionário) reaproveita o mecanismo de decoração do
// passo 6: toda consulta já feita na obra reaparece como sublinhado ao reabrir a leitura.
import { type IndiceDeCaracteres, posicaoEmCaracteres } from '@bookworm/core/src/indice/index.js';
import {
  PREFERENCIAS_LEITURA_PADRAO,
  type PreferenciasDeLeitura,
  paraPreferenciasDeNavegador,
} from '@bookworm/core/src/leitor/index.js';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { DecorationGroup, Locator, SelectionActionEvent } from 'react-native-readium';
import { ReadiumView } from 'react-native-readium';
import { useUnistyles } from 'react-native-unistyles';
import { marcarComoConcluido, marcarComoLendo } from '../src/biblioteca/consultas.js';
import { consultarTermo, type ResultadoDicionario } from '../src/leitor/dicionario.js';
import {
  type ConsultaSalva,
  criarAnotacao,
  criarConsultaDicionario,
  criarDestaque,
  type DestaqueSalvo,
  listarConsultasDaObra,
  listarDestaquesDaObra,
} from '../src/leitor/interacoes.js';
import { PainelDeLeitura } from '../src/leitor/PainelDeLeitura.js';
import { type ModoInteracao, PainelInteracoes } from '../src/leitor/PainelInteracoes.js';
import {
  obterPreferenciasDeLeitura,
  salvarPreferenciasDeLeitura,
} from '../src/leitor/preferencias.js';
import { useCarregarObra } from '../src/leitor/useCarregarObra.js';
import {
  sincronizarNotificacoesDeEngajamento,
  suprimirNotificacoesDeEngajamento,
} from '../src/notificacoes/servico.js';
import { avaliarEAtualizarHoje } from '../src/ofensiva/servico.js';
import type { NomePigmentoDeGrifo } from '../src/primitivas/Grifo.js';
import { useMaquinaSessao } from '../src/sessao/maquina.js';
import { iniciarSinaisDeSessao } from '../src/sessao/sinais.js';

const ACOES_DE_SELECAO = [
  { id: 'grifar', label: 'Grifar' },
  { id: 'anotar', label: 'Anotar' },
  { id: 'dicionario', label: 'Dicionário' },
];

type InteracaoPendente = { modo: ModoInteracao; locator: Locator; texto: string };

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
  const [prefs, setPrefs] = useState<PreferenciasDeLeitura>(PREFERENCIAS_LEITURA_PADRAO);
  const [painelAberto, setPainelAberto] = useState(false);
  const [destaques, setDestaques] = useState<DestaqueSalvo[]>([]);
  const [consultas, setConsultas] = useState<ConsultaSalva[]>([]);
  const [interacao, setInteracao] = useState<InteracaoPendente | null>(null);
  const [resultadoDicionario, setResultadoDicionario] = useState<ResultadoDicionario | null>(null);
  const primeiraLocalizacao = useRef(true);
  const { theme } = useUnistyles();

  useEffect(() => {
    void obterPreferenciasDeLeitura().then(setPrefs);
  }, []);

  useEffect(() => {
    if (!obraId) return;
    void listarDestaquesDaObra(obraId).then(setDestaques);
    void listarConsultasDaObra(obraId).then(setConsultas);
  }, [obraId]);

  // RN-02.17f — a chave única de retorno sensorial (painel de preferências, passo 5) governa todo
  // háptico deste arquivo; nenhuma chamada a `expo-haptics` passa por fora dela.
  const hapticoSeAtivo = useCallback(
    (estilo: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
      if (prefs.retornoSensorialAtivo) void Haptics.impactAsync(estilo);
    },
    [prefs.retornoSensorialAtivo]
  );

  // RN-02.18/RN-02.20 — todo destaque já feito reaparece ao reabrir a obra; a cor vem só de
  // `theme.grifo` (RN-DS.1), nunca de um hex repetido aqui. RN-02.17d — a mesma reconstrução vale
  // para o vestígio do dicionário, um sublinhado tênue (`sup.papel.tintaFraca`) sobre cada termo
  // já consultado.
  const grupoDeDecoracoes = useMemo<DecorationGroup[]>(
    () => [
      {
        name: 'destaques',
        decorations: destaques.map((d) => ({
          id: d.id,
          locator: d.locator,
          style: { type: 'highlight', tint: theme.grifo[d.pigmento] },
        })),
      },
      {
        name: 'consultas-dicionario',
        decorations: consultas.map((c) => ({
          id: c.id,
          locator: c.locator,
          style: { type: 'underline', tint: theme.sup.papel.tintaFraca },
        })),
      },
    ],
    [destaques, consultas, theme]
  );

  const aoAcionarSelecao = useCallback(
    (evento: SelectionActionEvent) => {
      const modo = evento.actionId as ModoInteracao;
      setInteracao({ modo, locator: evento.locator, texto: evento.selectedText });
      if (modo !== 'dicionario') return;
      setResultadoDicionario(null);
      void (async () => {
        const resultado = await consultarTermo(evento.selectedText);
        setResultadoDicionario(resultado);
        const sessaoId = useMaquinaSessao.getState().sessaoId;
        if (sessaoId && obraId) {
          const salva = await criarConsultaDicionario(
            sessaoId,
            obraId,
            evento.locator,
            evento.selectedText
          );
          setConsultas((atuais) => [...atuais, salva]);
          hapticoSeAtivo();
          await useMaquinaSessao.getState().sinalInteracaoQualitativa('dicionario');
        }
      })();
    },
    [obraId, hapticoSeAtivo]
  );

  const aoEscolherPigmento = useCallback(
    async (pigmento: NomePigmentoDeGrifo) => {
      const sessaoId = useMaquinaSessao.getState().sessaoId;
      if (!interacao || !obraId || !sessaoId) return;
      const salvo = await criarDestaque(sessaoId, obraId, interacao.locator, pigmento);
      setDestaques((atuais) => [...atuais, salvo]);
      hapticoSeAtivo();
      await useMaquinaSessao.getState().sinalInteracaoQualitativa('destaque');
      setInteracao(null);
    },
    [interacao, obraId, hapticoSeAtivo]
  );

  const aoSalvarNota = useCallback(
    async (texto: string) => {
      const sessaoId = useMaquinaSessao.getState().sessaoId;
      if (!interacao || !obraId || !sessaoId) return;
      await criarAnotacao(sessaoId, obraId, interacao.locator, texto);
      hapticoSeAtivo();
      await useMaquinaSessao.getState().sinalInteracaoQualitativa('nota');
      setInteracao(null);
    },
    [interacao, obraId, hapticoSeAtivo]
  );

  // RN-02.16e — pré-visualização ao vivo: todo ajuste chega aqui e recalcula o objeto que a
  // Readium recebe, sem tocar em posição, sessão ou reiniciar a leitura.
  const preferenciasDeNavegador = useMemo(() => paraPreferenciasDeNavegador(prefs), [prefs]);

  const aoSoltarPreferencia = useCallback((novasPrefs: PreferenciasDeLeitura) => {
    setPrefs(novasPrefs);
    void salvarPreferenciasDeLeitura(novasPrefs);
  }, []);

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
    // RN-02.14 — sessão ativa suprime as notificações de engajamento; os dois pontos de
    // encerramento abaixo reagendam ao sair.
    void suprimirNotificacoesDeEngajamento();
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
        await sincronizarNotificacoesDeEngajamento('leitura');
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
    await sincronizarNotificacoesDeEngajamento('leitura');
    router.replace({
      pathname: '/resumo',
      params: { obraId: obraId ?? '', celebracaoPendente: pendente ? '1' : '0' },
    });
  }, [obraId]);

  const aoMudarLocalizacao = useCallback(
    (locator: Locator) => {
      if (!obra || !locator.locations) return;
      // RN-02.17a/RN-02.17b — resposta imediata à virada de página; a curva de desaceleração em
      // si é do pager nativo do Readium (sem hook exposto, ver .claude/retomada.md), então esta
      // rodada responde com o que dá para controlar daqui: um toque háptico por virada. A
      // primeira localização é a abertura da obra, não uma virada — não dispara.
      if (primeiraLocalizacao.current) {
        primeiraLocalizacao.current = false;
      } else {
        hapticoSeAtivo();
      }
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
    [obra, sinalPosicao, hapticoSeAtivo]
  );

  if (carregando || !obra) {
    return <View style={styles.raiz} />;
  }

  return (
    <View style={styles.raiz}>
      <ReadiumView
        file={{ url: obra.caminhoArquivo }}
        preferences={preferenciasDeNavegador}
        decorations={grupoDeDecoracoes}
        selectionActions={ACOES_DE_SELECAO}
        onSelectionAction={aoAcionarSelecao}
        onLocationChange={aoMudarLocalizacao}
        style={styles.leitor}
      />
      {/* RN-02.16b — brilho in-app: nunca sobe acima do que o sistema já permite, só escurece por
          cima com um véu; opacidade zero em brilho máximo. `pointerEvents="none"` para nunca
          bloquear o toque de virar página nem os botões da faixa superior por baixo dele. */}
      <View pointerEvents="none" style={[styles.veuDeBrilho, { opacity: 1 - prefs.brilho }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Preferências de leitura"
        style={styles.faixaPreferencias}
        onPress={() => setPainelAberto((aberto) => !aberto)}
        hitSlop={8}
      >
        <Text style={styles.iconeFaixa}>Aa</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar leitor"
        style={styles.faixaSuperior}
        onPress={() => void aoFecharComResumo()}
        hitSlop={8}
      >
        <Text style={styles.fechar}>✕</Text>
      </Pressable>
      {painelAberto && (
        <PainelDeLeitura prefs={prefs} aoMudarAoVivo={setPrefs} aoSoltar={aoSoltarPreferencia} />
      )}
      {interacao && (
        <PainelInteracoes
          modo={interacao.modo}
          textoSelecionado={interacao.texto}
          aoEscolherPigmento={(pigmento) => void aoEscolherPigmento(pigmento)}
          aoSalvarNota={(texto) => void aoSalvarNota(texto)}
          aoFechar={() => setInteracao(null)}
          resultadoDicionario={resultadoDicionario}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#ffffff' },
  leitor: { flex: 1 },
  veuDeBrilho: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  faixaSuperior: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faixaPreferencias: {
    position: 'absolute',
    top: 0,
    right: 54,
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeFaixa: { fontSize: 15, color: 'rgba(0,0,0,0.55)' },
  fechar: { fontSize: 18, color: 'rgba(0,0,0,0.55)' },
});
