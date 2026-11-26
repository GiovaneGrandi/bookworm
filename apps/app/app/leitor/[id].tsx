import {
  type Aba,
  aplicar,
  corDaTemperatura,
  type PreferenciasLeitura,
  paginaCanonica,
  paraReadium,
  posicaoEmCaracteres,
  temaEfetivo,
  temperaturaDoHorario,
  totalDePaginas,
} from '@bookworm/core';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  type File as ArquivoReadium,
  type Locator,
  ReadiumView,
  type ReadiumViewRef,
} from 'react-native-readium';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BwAncora } from '../../src/componentes/BwAncora';
import { BwBarraDeNavegacao } from '../../src/componentes/BwBarraDeNavegacao';
import { BwIconesDoLeitor } from '../../src/componentes/BwIconesDoLeitor';
import { BwPainelLeitura } from '../../src/componentes/BwPainelLeitura';
import { useTransicaoDaMesa } from '../../src/componentes/BwTransicaoDaMesa';
import { usePousarNaMesa } from '../../src/componentes/usePousarNaMesa';
import {
  carregarIndice,
  lerLocator,
  salvarPosicao,
  salvarPreferencias,
  usePreferencias,
} from '../../src/dados/leitura';
import { useObra } from '../../src/dados/obras';
import type { Obra } from '../../src/dados/schema';
import { tocarIcone } from '../../src/leitor';
import { corDaCamadaDeBrilho, corDaCamadaDeLuz } from '../../src/tema/leitura';
import { tipo } from '../../src/tema/tipografia';

/** RN-02.13: sem interação por 3 segundos, os controles se recolhem. */
const RECOLHER_EM_MS = 3000;
/**
 * Depois de um ajuste do painel, o Readium repagina sem emitir posição e se reposiciona pela
 * página corrente, com desvio. Este é o tempo de esperar a repaginação antes de voltar à posição
 * da leitora; um evento de posição dentro da janela é efeito do retorno, não virada de página.
 */
const REPAGINACAO_MS = 500;
const JANELA_DO_RETORNO_MS = 1500;
/** Quanto da largura, no meio, é "área central" para revelar os controles (RN-02.13). */
const FAIXA_CENTRAL = [0.3, 0.7] as const;
/** De quanto em quanto tempo a temperatura pelo horário (RN-02.16c) se atualiza. */
const HORARIO_A_CADA_MS = 5 * 60 * 1000;
/** O grão do papel: um ladrilho de pontinhos, repetido por cima da página nos temas claros. */
const GRAO = require('../../assets/leitor/grao.png');

const horaDeAgora = () => {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
};

export default function Leitor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const obra = useObra(id);
  // A obra chega de uma live query; o leitor só monta quando ela existe, com o arquivo e a
  // posição salvos naquele instante (a posição muda a cada página e não pode reabrir o livro).
  return obra ? <LeitorDaObra obra={obra} /> : <View style={{ flex: 1 }} />;
}

function LeitorDaObra({ obra }: { obra: Obra }) {
  const { theme } = useUnistyles();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const salvas = usePreferencias();
  const [p, setP] = useState<PreferenciasLeitura>(salvas);
  // As preferências salvas chegam do banco um instante depois de o leitor montar. Até a leitora
  // mexer no painel, o leitor acompanha o que está salvo; sem isso ele ficava com o padrão e, no
  // primeiro ajuste, gravava o padrão por cima do que ela tinha escolhido.
  const mexeu = useRef(false);
  const salvasEmTexto = JSON.stringify(salvas);
  // biome-ignore lint/correctness/useExhaustiveDependencies: o texto é a identidade de `salvas`, que nasce de novo a cada render.
  useEffect(() => {
    if (!mexeu.current) setP(salvas);
  }, [salvasEmTexto]);
  // O tema que vale agora: o escolhido, ou o do celular quando a leitora pediu para seguir.
  const temaAgora = temaEfetivo(p, useColorScheme() === 'dark');
  // RN-02.16c: com o horário ligado, a temperatura acompanha a hora; mexer no controle vale
  // até o fim desta sessão de leitura.
  const [temperaturaManual, setTemperaturaManual] = useState(false);
  const [hora, setHora] = useState(horaDeAgora);
  useEffect(() => {
    if (!p.temperaturaPeloHorario) return undefined;
    const relogio = setInterval(() => setHora(horaDeAgora()), HORARIO_A_CADA_MS);
    return () => clearInterval(relogio);
  }, [p.temperaturaPeloHorario]);
  const temperaturaAgora =
    p.temperaturaPeloHorario && !temperaturaManual ? temperaturaDoHorario(hora) : p.temperatura;
  const pousar = usePousarNaMesa(theme.leitura[temaAgora].fundo);
  const { chegou } = useTransicaoDaMesa();
  const [controles, setControles] = useState(false);
  // O grupo do painel aberto pelo ícone do cabeçalho; null com a persiana recolhida.
  const [painel, setPainel] = useState<Aba | null>(null);
  const [locator, setLocator] = useState<Locator | undefined>(() => lerLocator(obra.locator));
  const [progresso, setProgresso] = useState(obra.progresso);
  const [paginasPdf, setPaginasPdf] = useState(0);
  const primeiraPosicao = useRef(true);
  const readium = useRef<ReadiumViewRef>(null);
  // A posição da leitora (RN-02.9): só muda quando ela vira a página. Um ajuste do painel
  // repagina o texto, e o Readium se reposiciona a partir da página corrente, já deslocada; em
  // vários ajustes seguidos o erro acumula. Guardar a posição de antes e voltar a ela depois de
  // cada repaginação é o que faz valer RN-02.16e: nenhum ajuste altera a posição.
  const posicaoDaLeitora = useRef<Locator | undefined>(lerLocator(obra.locator));
  const repaginandoAte = useRef(0);
  const recolher = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gravar = useRef<ReturnType<typeof setTimeout> | null>(null);

  const epub = obra.formato === 'epub';
  const indice = useMemo(() => (epub ? carregarIndice(obra.id) : null), [epub, obra.id]);
  const [arquivo] = useState<ArquivoReadium>(() => ({
    url: obra.caminho,
    initialLocation: lerLocator(obra.locator),
  }));

  // Preferências: aplicadas na hora (RN-02.16e) e gravadas um instante depois.
  function mudarPreferencias(novas: PreferenciasLeitura) {
    mexeu.current = true;
    if (novas.temperaturaPeloHorario && !p.temperaturaPeloHorario) {
      setTemperaturaManual(false);
      setHora(horaDeAgora());
    } else if (novas.temperatura !== p.temperatura) {
      setTemperaturaManual(true);
    }
    setP(novas);
    if (gravar.current) clearTimeout(gravar.current);
    gravar.current = setTimeout(() => salvarPreferencias(novas), 250);
  }
  useEffect(
    () => () => {
      if (gravar.current) clearTimeout(gravar.current);
    },
    []
  );

  // Controles revelados se recolhem sozinhos, menos com o painel aberto.
  const agendarRecolher = useCallback(() => {
    if (recolher.current) clearTimeout(recolher.current);
    recolher.current = setTimeout(() => setControles(false), RECOLHER_EM_MS);
  }, []);
  useEffect(() => {
    if (controles && !painel) agendarRecolher();
    else if (recolher.current) clearTimeout(recolher.current);
    return () => {
      if (recolher.current) clearTimeout(recolher.current);
    };
  }, [controles, painel, agendarRecolher]);

  // Com o painel aberto, o voltar do sistema fecha o painel antes de pousar o livro.
  useFocusEffect(
    useCallback(() => {
      if (!painel) return undefined;
      const assinatura = BackHandler.addEventListener('hardwareBackPress', () => {
        setPainel(null);
        return true;
      });
      return () => assinatura.remove();
    }, [painel])
  );

  // O toque no centro só é ouvido com os controles recolhidos: ele roda junto do toque nativo
  // (que vira a página nas bordas) e, se ficasse ativo com os controles à vista, cancelaria os
  // botões por cima da página. Com eles à vista, quem recolhe é a camada `fecharControles`.
  const toque = Gesture.Tap()
    .enabled(!controles && !painel)
    .maxDuration(300)
    .runOnJS(true)
    .onEnd((e, ok) => {
      if (!ok) return;
      const x = e.x / width;
      if (x < FAIXA_CENTRAL[0] || x > FAIXA_CENTRAL[1]) return; // as bordas viram a página
      setControles(true);
    });

  // Abrir ou fechar dois dedos sobre a página muda o corpo da letra, meio pixel por degrau,
  // aplicado ao soltar: repaginar a cada quadro do gesto seria pesado demais.
  const pinca = Gesture.Pinch()
    .runOnJS(true)
    .onEnd((e) => {
      const degraus = Math.round(Math.log2(e.scale) * 4);
      if (degraus !== 0) {
        mudarPreferencias(aplicar(p, { ajusteCorpo: p.ajusteCorpo + degraus * 0.5 }));
      }
    });

  // Paginado, o gesto nativo deixa o Readium virar a página por arrasto junto do toque no meio.
  // Rolando, esse mesmo gesto segura a rolagem vertical da página; o toque e a pinça bastam.
  const gestosDaPagina = p.rolagem
    ? Gesture.Simultaneous(toque, pinca, Gesture.Native().disallowInterruption(true))
    : Gesture.Simultaneous(toque, pinca, Gesture.Native());

  function fecharControles() {
    setPainel(null);
    setControles(false);
  }

  function aoMudarPosicao(novo: Locator) {
    if (Date.now() < repaginandoAte.current) return; // efeito do retorno à posição da leitora
    const virou =
      !primeiraPosicao.current &&
      (novo.href !== locator?.href || novo.locations?.position !== locator?.locations?.position);
    primeiraPosicao.current = false;
    posicaoDaLeitora.current = novo;
    setLocator(novo);
    setProgresso(salvarPosicao(obra.id, novo, indice));
    if (virou && p.retornoSensorial) Haptics.selectionAsync(); // RN-02.17a, RN-02.17f
  }

  // RN-02.16e: depois de cada ajuste, a leitora volta exatamente para onde estava.
  const primeiroAjuste = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `p` é o gatilho (roda a cada ajuste do painel), não um valor lido.
  useEffect(() => {
    if (primeiroAjuste.current) {
      primeiroAjuste.current = false;
      return undefined;
    }
    const espera = setTimeout(() => {
      const fixa = posicaoDaLeitora.current;
      if (!fixa) return;
      repaginandoAte.current = Date.now() + JANELA_DO_RETORNO_MS;
      readium.current?.goTo(fixa);
    }, REPAGINACAO_MS);
    return () => clearTimeout(espera);
  }, [p]);

  const tema = theme.leitura[temaAgora];
  const preferenciasReadium = useMemo(
    () =>
      epub
        ? {
            ...paraReadium(p, temaAgora),
            theme: tema.escuro ? ('dark' as const) : ('light' as const),
            backgroundColor: tema.fundo,
            textColor: tema.tinta,
          }
        : { backgroundColor: tema.fundo },
    [epub, p, tema, temaAgora]
  );

  const rotuloDaAncora = (() => {
    if (epub && indice && locator) {
      const pos =
        posicaoEmCaracteres(indice, locator.href, locator.locations?.progression ?? 0) ?? 0;
      const pagina = `p. ${paginaCanonica(pos)} de ${totalDePaginas(indice.total)}`;
      return locator.title ? `${pagina} · ${locator.title}` : pagina;
    }
    const n = locator?.locations?.position;
    return n ? `p. ${n}${paginasPdf ? ` de ${paginasPdf}` : ''}` : '';
  })();

  return (
    <View
      onLayout={chegou}
      style={[estilos.leitor, { backgroundColor: tema.fundo, paddingTop: top }]}
    >
      <StatusBar hidden={!controles} style={tema.escuro || controles ? 'light' : 'dark'} />

      <GestureDetector gesture={gestosDaPagina}>
        <View style={estilos.pagina} collapsable={false}>
          <ReadiumView
            ref={readium}
            file={arquivo}
            preferences={preferenciasReadium}
            onLocationChange={aoMudarPosicao}
            onPublicationReady={(e) => setPaginasPdf(e.positions.length)}
            style={estilos.readium}
          />
        </View>
      </GestureDetector>

      <View style={{ paddingBottom: bottom }}>
        <BwAncora nivel={p.ancora} tema={temaAgora} fracao={progresso} rotulo={rotuloDaAncora} />
      </View>

      {/* O grão do papel, só nos temas claros: no escuro ele viraria poeira. */}
      {p.grao && !tema.escuro && (
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={estilos.camada}
        >
          {/* No Android, repetir exige tamanho explícito: esticada por `absolute`, não desenha. */}
          <Image source={GRAO} resizeMode="repeat" style={{ width, height }} />
        </View>
      )}

      {/* A luz da leitora (RN-02.16a) e o brilho in-app (RN-02.16b): camadas sobre a página. */}
      <View
        pointerEvents="none"
        style={[
          estilos.camada,
          {
            backgroundColor: corDaCamadaDeLuz(corDaTemperatura(temperaturaAgora, 0.7)),
            mixBlendMode: 'multiply',
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[estilos.camada, { backgroundColor: corDaCamadaDeBrilho(p.brilho) }]}
      />

      {/* Toque fora dos controles volta ao texto. A camada cobre a tela inteira, então o alvo
          é sempre maior que ALVO_MINIMO. */}
      {(controles || painel) && (
        <Pressable
          style={estilos.camada}
          onPress={fecharControles}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao texto"
        />
      )}

      {controles && (
        <>
          {/* O título com os ícones; a persiana do painel desce logo abaixo dele. */}
          <View style={estilos.alto}>
            <View style={[estilos.topo, { paddingTop: top + theme.esp[1] }]}>
              <Text style={estilos.tituloObra} numberOfLines={1}>
                {obra.titulo}
              </Text>
              <BwIconesDoLeitor
                aberta={painel}
                onTocar={(aba) => setPainel((aberta) => tocarIcone(aberta, aba))}
              />
            </View>
            {painel && (
              <BwPainelLeitura
                key={painel}
                aba={painel}
                preferencias={p}
                onMudar={mudarPreferencias}
                temperaturaAgora={temperaturaAgora}
              />
            )}
          </View>
          {/* RN-DV.11: no leitor, a barra só aparece junto do menu. */}
          <View style={estilos.base}>
            <BwBarraDeNavegacao atual="ler" onMesa={pousar} />
          </View>
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  leitor: {
    flex: 1,
  },
  pagina: {
    flex: 1,
  },
  readium: {
    flex: 1,
  },
  camada: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  alto: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[3],
    paddingLeft: theme.esp[5],
    paddingRight: theme.esp[3],
    paddingBottom: theme.esp[1],
    backgroundColor: theme.sup.mesa.fundo,
    boxShadow: theme.sup.mesa.sombra.erguido,
    zIndex: 1,
  },
  tituloObra: {
    ...tipo.microcopy,
    flex: 1,
    color: theme.sup.mesa.tinta,
  },
  base: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.sup.mesa.fundo,
    boxShadow: theme.sup.mesa.sombra.erguido,
  },
}));
