import { acoesDaGaveta, type OrdemDaEstante, obrasNaEstante } from '@bookworm/core';
import { Canvas, Circle, Line, vec } from '@shopify/react-native-skia';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { type ReactNode, useState } from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BwBarraDeNavegacao } from '../src/componentes/BwBarraDeNavegacao';
import { BwBotao } from '../src/componentes/BwBotao';
import { BwMenuRapido, type ItemDoMenu, type MenuRapido } from '../src/componentes/BwMenuRapido';
import { useParedeDaCamera, useTransicaoDaMesa } from '../src/componentes/BwTransicaoDaMesa';
import { usePousarNaMesa } from '../src/componentes/usePousarNaMesa';
import { marcarAberta, pausar, tirarDaGaveta, useObras } from '../src/dados/obras';
import type { Obra } from '../src/dados/schema';
import { corDaCapa, marcaDaCapa, rodapeDaEstante, rotuloDaCapa } from '../src/estante';
import { ALVO_MINIMO, raio } from '../src/tema/geometria';
import { tipo, tipoMiniatura } from '../src/tema/tipografia';

const ORDENS: { ordem: OrdemDaEstante; rotulo: string; falado: string }[] = [
  { ordem: 'az', rotulo: 'A–Z', falado: 'Ordenar de A a Z' },
  { ordem: 'recentes', rotulo: 'Recentes', falado: 'Ordenar pelos mais recentes' },
  { ordem: 'autor', rotulo: 'Autor', falado: 'Ordenar por autor' },
];
const POR_PRATELEIRA = 3;
/** Os lugares vazios da última prateleira, para as capas não esticarem. */
const VAOS = ['vao-1', 'vao-2'] as const;

type Segurada = { obra: Obra; x: number; y: number; confirmando: boolean };

/**
 * A estante (v2): o fichário abre uma estante expositora, com as capas de frente atrás de ripas,
 * busca e ordem no alto e a contagem no rodapé. Junta lendo, em pausa, quero ler e lidos por
 * decisão de 22/11/2026, contra RN-02.6a (a spec muda depois). Segurar uma capa pausa ou tira
 * o livro (Q15).
 */
export default function Gaveta() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { top } = useSafeAreaInsets();
  const { erguido, buscar } = useLocalSearchParams<{ erguido?: string; buscar?: string }>();
  const virada = erguido === 'virada';
  const { chegou, desvirar } = useTransicaoDaMesa();
  const obras = useObras();
  const [ordem, setOrdem] = useState<OrdemDaEstante>('az');
  const [termo, setTermo] = useState('');
  const [segurada, setSegurada] = useState<Segurada | null>(null);
  const estiloDaParede = useParedeDaCamera('estante');

  // Aberta pela mesa, a estante é a parede da esquerda e volta com a câmera girando de volta.
  const pousar = usePousarNaMesa(theme.sup.papel.fundo, virada ? desvirar : undefined);

  const naEstante = obrasNaEstante(obras, ordem, termo);
  const vazia = obras.every((o) => o.estado === 'abandonado');
  const prateleiras: Obra[][] = [];
  for (let i = 0; i < naEstante.length; i += POR_PRATELEIRA) {
    prateleiras.push(naEstante.slice(i, i + POR_PRATELEIRA));
  }

  function abrir(o: Obra) {
    marcarAberta(o.id);
    router.push(`/leitor/${o.id}`);
  }

  const segurar = (obra: Obra) => (e: GestureResponderEvent) =>
    setSegurada({ obra, x: e.nativeEvent.pageX, y: e.nativeEvent.pageY, confirmando: false });

  const itensDe = (s: Segurada): ItemDoMenu[] => [
    { rotulo: 'Abrir no leitor', primario: true, aoTocar: () => abrir(s.obra) },
    ...(acoesDaGaveta(s.obra.estado).includes('pausar')
      ? [{ rotulo: 'Pôr em pausa', aoTocar: () => pausar(s.obra.id) }]
      : []),
    s.confirmando
      ? { rotulo: 'Tirar mesmo', aoTocar: () => tirarDaGaveta(s.obra.id) }
      : {
          rotulo: 'Tirar da estante',
          manterAberto: true,
          aoTocar: () => setSegurada({ ...s, confirmando: true }),
        },
  ];

  const menu: MenuRapido | null = segurada && {
    titulo: segurada.obra.titulo.replace(/\s+/g, ' ').trim(),
    sub: marcaDaCapa(segurada.obra),
    itens: itensDe(segurada),
    aviso: segurada.confirmando
      ? 'O arquivo sai do aparelho junto. Toque de novo para confirmar.'
      : undefined,
    x: segurada.x,
    y: segurada.y,
  };

  return (
    <Animated.View onLayout={chegou} style={[estilos.feltro, virada && estiloDaParede]}>
      <View style={[estilos.folha, { paddingTop: top + theme.esp[3] }]}>
        <View style={estilos.cabeca}>
          <View style={estilos.busca}>
            <Lupa />
            <TextInput
              value={termo}
              onChangeText={setTermo}
              placeholder="buscar…"
              placeholderTextColor={theme.sup.papelFundo.tintaFraca}
              accessibilityLabel="Buscar na estante, por título ou autor"
              autoFocus={buscar === '1'}
              returnKeyType="search"
              style={estilos.campo}
            />
          </View>
          <View accessibilityRole="radiogroup" style={estilos.filtros}>
            {ORDENS.map((o) => {
              const escolhida = ordem === o.ordem;
              return (
                <Pressable
                  key={o.ordem}
                  onPress={() => setOrdem(o.ordem)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: escolhida }}
                  accessibilityLabel={o.falado}
                  hitSlop={{ top: 11, bottom: 11 }}
                  style={[estilos.filtro, escolhida && estilos.filtroEscolhido]}
                >
                  <Text style={[estilos.textoFiltro, escolhida && estilos.textoEscolhido]}>
                    {o.rotulo}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={estilos.expositora}>
          <ScrollView
            accessibilityLabel="Prateleiras da estante"
            contentContainerStyle={estilos.trilho}
          >
            {vazia ? (
              <Prateleira>
                <View style={estilos.convite}>
                  <Text style={estilos.lapis}>
                    A estante está vazia. Os livros entram pela bandeja.
                  </Text>
                  <BwBotao onPress={() => router.push('/bandeja')} rotulo="Ir à bandeja" />
                </View>
              </Prateleira>
            ) : prateleiras.length === 0 ? (
              <Prateleira>
                <Text style={estilos.nenhum}>Nenhum livro encontrado.</Text>
              </Prateleira>
            ) : (
              prateleiras.map((livros) => (
                <Prateleira key={livros.map((o) => o.id).join()}>
                  <View style={estilos.grade}>
                    {livros.map((o) => (
                      <Capa key={o.id} obra={o} onAbrir={() => abrir(o)} onSegurar={segurar(o)} />
                    ))}
                    {VAOS.slice(0, POR_PRATELEIRA - livros.length).map((v) => (
                      <View key={v} style={estilos.vao} />
                    ))}
                  </View>
                </Prateleira>
              ))
            )}
          </ScrollView>
          <View style={estilos.rodape}>
            <Text style={estilos.contagem}>{rodapeDaEstante(naEstante.length)}</Text>
          </View>
        </View>
        <BwBarraDeNavegacao atual="biblioteca" onMesa={pousar} />
      </View>
      <BwMenuRapido menu={menu} onFechar={() => setSegurada(null)} />
    </Animated.View>
  );
}

function Prateleira({ children }: { children: ReactNode }) {
  return (
    <View>
      <View style={estilos.prateleira}>{children}</View>
      <View style={estilos.ripa} />
    </View>
  );
}

function Capa({
  obra,
  onAbrir,
  onSegurar,
}: {
  obra: Obra;
  onAbrir: () => void;
  onSegurar: (e: GestureResponderEvent) => void;
}) {
  const cor = corDaCapa(obra.id);
  const autor = obra.autor ?? (obra.formato === 'pdf' ? 'PDF' : '');
  return (
    <View style={estilos.lugarDaCapa}>
      <Pressable
        onPress={onAbrir}
        onLongPress={onSegurar}
        delayLongPress={420}
        accessibilityRole="button"
        accessibilityLabel={rotuloDaCapa(obra)}
        accessibilityHint="Segure para pausar ou tirar da estante"
        style={({ pressed }) => [
          estilos.capa,
          { backgroundColor: cor.fundo },
          pressed && estilos.capaErguida,
        ]}
      >
        <Text numberOfLines={3} style={[estilos.tituloCapa, { color: cor.tinta }]}>
          {obra.titulo}
        </Text>
        <View style={estilos.peDaCapa}>
          <Text numberOfLines={1} style={[estilos.autorCapa, { color: cor.tinta }]}>
            {autor}
          </Text>
          <Text style={[estilos.marcaCapa, { color: cor.tinta }]}>{marcaDaCapa(obra)}</Text>
        </View>
      </Pressable>
    </View>
  );
}

function Lupa() {
  const { theme } = useUnistyles();
  const cor = theme.sup.papelFundo.tintaFraca;
  return (
    <Canvas style={estilos.lupa}>
      <Circle c={vec(4.9, 4.9)} r={3.75} style="stroke" strokeWidth={1.1} color={cor} />
      <Line p1={vec(7.9, 7.9)} p2={vec(11.25, 11.25)} strokeWidth={1.1} color={cor} />
    </Canvas>
  );
}

const estilos = StyleSheet.create((theme) => ({
  feltro: {
    flex: 1,
    backgroundColor: theme.sup.mesa.fundo,
  },
  folha: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: theme.sup.papel.fundo,
    boxShadow: theme.sup.mesa.sombra.flutuante,
  },
  cabeca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[2],
    paddingHorizontal: theme.esp[3],
    marginBottom: theme.esp[3],
  },
  busca: {
    flex: 1,
    minWidth: 0,
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[2],
    paddingHorizontal: theme.esp[3],
    borderWidth: 1,
    borderColor: theme.sup.papelFundo.borda,
    ...raio.irregularP,
    backgroundColor: theme.sup.papelFundo.fundo,
  },
  lupa: { width: 12, height: 12 },
  campo: {
    ...tipo.corpoPequeno,
    flex: 1,
    minHeight: 30,
    paddingVertical: 0,
    color: theme.sup.papelFundo.tinta,
  },
  filtros: {
    flexDirection: 'row',
    gap: theme.esp[1],
  },
  filtro: {
    minHeight: 27,
    justifyContent: 'center',
    paddingHorizontal: theme.esp[2],
    borderWidth: 1,
    borderColor: theme.sup.papelFundo.borda,
    ...raio.irregularP,
    backgroundColor: theme.sup.papelFundo.fundo,
  },
  filtroEscolhido: {
    backgroundColor: theme.semantico.papel.acaoPrimaria,
    borderColor: theme.semantico.papel.acaoPrimaria,
  },
  textoFiltro: {
    ...tipoMiniatura.aba,
    color: theme.sup.papelFundo.tinta,
  },
  textoEscolhido: { color: theme.semantico.papel.acaoPrimariaTinta },
  expositora: {
    flex: 1,
    experimental_backgroundImage: `linear-gradient(180deg, ${theme.arte.estante.fundo.claro}, ${theme.arte.estante.fundo.escuro})`,
    borderTopWidth: 6,
    borderTopColor: theme.arte.estante.topo,
    boxShadow: `inset 0 10px 20px ${theme.arte.estante.sombra}`,
  },
  trilho: {
    paddingTop: theme.esp[3],
    paddingHorizontal: theme.esp[4],
    paddingBottom: theme.esp[3],
    gap: theme.esp[4],
  },
  prateleira: {
    paddingTop: theme.esp[3],
    paddingHorizontal: theme.esp[2],
    paddingBottom: theme.esp[3],
    experimental_backgroundImage: `linear-gradient(180deg, ${theme.arte.estante.vao.claro}, ${theme.arte.estante.vao.meio} 65%, ${theme.arte.estante.vao.escuro})`,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderLeftColor: theme.arte.estante.lateral.esquerda,
    borderRightColor: theme.arte.estante.lateral.direita,
  },
  ripa: {
    zIndex: 3,
    height: 18,
    experimental_backgroundImage: `linear-gradient(180deg, ${theme.arte.estante.ripa.claro}, ${theme.arte.estante.ripa.meio} 72%, ${theme.arte.estante.ripa.escuro})`,
    borderBottomWidth: 2,
    borderBottomColor: theme.arte.estante.ripa.filete,
    boxShadow: `0 4px 8px ${theme.arte.estante.sombra}`,
  },
  grade: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.esp[3],
  },
  lugarDaCapa: { flex: 1 },
  vao: { flex: 1 },
  capa: {
    aspectRatio: 3 / 4,
    minHeight: ALVO_MINIMO,
    justifyContent: 'space-between',
    paddingTop: theme.esp[3],
    paddingHorizontal: theme.esp[2],
    paddingBottom: theme.esp[4],
    borderTopLeftRadius: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: theme.arte.estante.sombraCapa,
    boxShadow: `-3px 4px 8px ${theme.arte.estante.sombraCapa}`,
    overflow: 'hidden',
  },
  capaErguida: { transform: [{ translateY: -4 }] },
  tituloCapa: {
    ...tipoMiniatura.tituloEstante,
  },
  peDaCapa: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.esp[1],
  },
  autorCapa: {
    ...tipoMiniatura.rodapeCapa,
    flex: 1,
    minWidth: 0,
    opacity: 0.82,
  },
  marcaCapa: {
    ...tipoMiniatura.rodapeCapa,
    opacity: 0.75,
  },
  convite: {
    gap: theme.esp[5],
    paddingVertical: theme.esp[5],
    paddingHorizontal: theme.esp[3],
  },
  lapis: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.kraft.tinta,
  },
  nenhum: {
    ...tipo.microcopy,
    color: theme.sup.kraft.tinta,
    paddingVertical: theme.esp[5],
    paddingHorizontal: theme.esp[2],
  },
  rodape: {
    alignItems: 'center',
    paddingTop: theme.esp[3],
    paddingHorizontal: theme.esp[5],
    borderTopWidth: 1,
    borderTopColor: theme.arte.estante.vao.escuro,
    backgroundColor: theme.arte.estante.rodape,
  },
  contagem: {
    ...tipo.kicker,
    color: theme.arte.estante.rodapeTinta,
  },
}));
