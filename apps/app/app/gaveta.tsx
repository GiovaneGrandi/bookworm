import {
  acoesDaGaveta,
  type CorDeParede,
  contarPorEstado,
  type FiltroDeEstado,
  type OrdemDaEstante,
  obrasNaEstante,
  paredeAoEntrar,
} from '@bookworm/core';
import { Canvas, Circle, Line, vec } from '@shopify/react-native-skia';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { type GestureResponderEvent, ScrollView, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BwBarraDeNavegacao } from '../src/componentes/BwBarraDeNavegacao';
import { BwBotao } from '../src/componentes/BwBotao';
import { BwMenuRapido, type ItemDoMenu, type MenuRapido } from '../src/componentes/BwMenuRapido';
import { useParedeDaCamera, useTransicaoDaMesa } from '../src/componentes/BwTransicaoDaMesa';
import { BwFichario, BwGavetaDoFichario } from '../src/componentes/estante/BwFichario';
import { ALTURA_DA_JIBOIA, BwJiboia, LARGURA_DA_JIBOIA } from '../src/componentes/estante/BwJiboia';
import { BwParedeNova } from '../src/componentes/estante/BwParedeNova';
import { BwCapaNaParede, BwPrateleiras } from '../src/componentes/estante/BwPrateleiras';
import { usePousarNaMesa } from '../src/componentes/usePousarNaMesa';
import { marcarAberta, pausar, tirarDaGaveta, useObras } from '../src/dados/obras';
import {
  favoritarParede,
  porNaParede,
  tirarDaParede,
  tirarParede,
  useParedes,
} from '../src/dados/paredes';
import type { Obra } from '../src/dados/schema';
import { fichaDaFrente, marcaDaCapa, rodapeDaEstante } from '../src/estante';
import { espelhar, giro } from '../src/tema/geometria';
import { tipo } from '../src/tema/tipografia';

type Segurada = {
  obra: Obra;
  x: number;
  y: number;
  confirmando: boolean;
  escolhendoParede: boolean;
};

/**
 * A estante como parede (direção B, 26/11/2026): as capas de frente em prateleiras presas na
 * parede, a busca numa tira de papel e, no chão, o fichário (jeito 2) e a jiboia no vaso. O
 * fichário guarda o estado, a ordem e as paredes próprias; a parede escolhida pinta o fundo.
 * Segurar uma capa pausa, põe numa parede, tira da parede ou tira da estante (Q15).
 */
export default function Gaveta() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { top } = useSafeAreaInsets();
  const { erguido, buscar } = useLocalSearchParams<{ erguido?: string; buscar?: string }>();
  const virada = erguido === 'virada';
  const { chegou, desvirar } = useTransicaoDaMesa();
  const obras = useObras();
  const paredes = useParedes();
  const [ordem, setOrdem] = useState<OrdemDaEstante>('az');
  const [estado, setEstado] = useState<FiltroDeEstado>('todos');
  // undefined: a leitora ainda não escolheu parede nesta visita, então vale a favorita.
  const [paredeId, setParedeId] = useState<string | null | undefined>(undefined);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [termo, setTermo] = useState('');
  const [fichario, setFichario] = useState(false);
  const [criando, setCriando] = useState(false);
  const [segurada, setSegurada] = useState<Segurada | null>(null);
  const estiloDaParede = useParedeDaCamera('estante');

  // Aberta pela mesa, a estante é a parede da esquerda e volta com a câmera girando de volta.
  const pousar = usePousarNaMesa(theme.sup.papel.fundo, virada ? desvirar : undefined);

  const escolhida = paredeId === undefined ? paredeAoEntrar(paredes) : paredeId;
  const parede = paredes.find((p) => p.id === escolhida) ?? null;
  const editando = paredes.find((p) => p.id === editandoId) ?? null;
  const naParede = parede?.obras ?? null;
  const naEstante = obrasNaEstante(obras, ordem, termo, { estado, naParede });
  const contagem = contarPorEstado(parede ? obras.filter((o) => naParede?.includes(o.id)) : obras);
  const vazia = obras.every((o) => o.estado === 'abandonado');

  function abrir(o: Obra) {
    marcarAberta(o.id);
    router.push(`/leitor/${o.id}`);
  }

  const segurar = (obra: Obra) => (e: GestureResponderEvent) =>
    setSegurada({
      obra,
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      confirmando: false,
      escolhendoParede: false,
    });

  const itensDe = (s: Segurada): ItemDoMenu[] => {
    const outras = paredes.filter((p) => !p.obras.includes(s.obra.id));
    if (s.escolhendoParede) {
      return outras.map((p) => ({
        rotulo: `Pôr em “${p.nome}”`,
        aoTocar: () => porNaParede(p.id, s.obra.id),
      }));
    }
    return [
      { rotulo: 'Abrir no leitor', primario: true, aoTocar: () => abrir(s.obra) },
      ...(acoesDaGaveta(s.obra.estado).includes('pausar')
        ? [{ rotulo: 'Pôr em pausa', aoTocar: () => pausar(s.obra.id) }]
        : []),
      ...(outras.length > 0
        ? [
            {
              rotulo: 'Pôr numa parede',
              manterAberto: true,
              aoTocar: () => setSegurada({ ...s, escolhendoParede: true }),
            },
          ]
        : []),
      ...(parede
        ? [{ rotulo: 'Tirar desta parede', aoTocar: () => tirarDaParede(parede.id, s.obra.id) }]
        : []),
      s.confirmando
        ? { rotulo: 'Tirar mesmo', aoTocar: () => tirarDaGaveta(s.obra.id) }
        : {
            rotulo: 'Tirar da estante',
            manterAberto: true,
            aoTocar: () => setSegurada({ ...s, confirmando: true }),
          },
    ];
  };

  const menu: MenuRapido | null = segurada && {
    titulo: segurada.obra.titulo.replace(/\s+/g, ' ').trim(),
    sub: segurada.escolhendoParede ? 'Pôr numa parede' : marcaDaCapa(segurada.obra),
    itens: itensDe(segurada),
    aviso: segurada.confirmando
      ? 'O arquivo sai do aparelho junto. Toque de novo para confirmar.'
      : parede && !segurada.escolhendoParede
        ? 'Tirar desta parede não tira da estante.'
        : undefined,
    x: segurada.x,
    y: segurada.y,
  };

  const recado = vazia
    ? null
    : parede && parede.obras.length === 0
      ? 'Esta parede ainda está vazia. Em “Toda a estante”, segure um livro para pendurá-lo aqui.'
      : naEstante.length === 0
        ? 'Nenhum livro aqui.'
        : null;

  return (
    <Animated.View
      onLayout={chegou}
      style={[estilos.parede(parede?.cor ?? 'mesa'), virada && estiloDaParede]}
    >
      <View style={[estilos.cabeca, { paddingTop: top + theme.esp[5] }]}>
        <View style={estilos.tira}>
          <View style={[estilos.fita, estilos.fitaEsquerda]} />
          <View style={[estilos.fita, estilos.fitaDireita]} />
          <Lupa />
          <TextInput
            value={termo}
            onChangeText={setTermo}
            placeholder="buscar título ou autor…"
            placeholderTextColor={theme.sup.papelFundo.tintaFraca}
            accessibilityLabel="Buscar na estante, por título ou autor"
            autoFocus={buscar === '1'}
            returnKeyType="search"
            style={estilos.campo}
          />
        </View>
        {parede && (
          <Text numberOfLines={1} style={estilos.placa}>
            {parede.nome}
          </Text>
        )}
      </View>

      <View style={estilos.vao}>
        <ScrollView
          accessibilityLabel="Prateleiras da estante"
          contentContainerStyle={estilos.trilho}
        >
          {vazia ? (
            <View style={estilos.convite}>
              <Text style={estilos.lapis}>
                A estante está vazia. Os livros entram pela bandeja.
              </Text>
              <BwBotao onPress={() => router.push('/bandeja')} rotulo="Ir à bandeja" />
            </View>
          ) : recado ? (
            <Text style={estilos.lapis}>{recado}</Text>
          ) : (
            <>
              <BwPrateleiras
                obras={naEstante}
                capa={(o) => (
                  <BwCapaNaParede obra={o} onAbrir={() => abrir(o)} onSegurar={segurar(o)} />
                )}
              />
              <Text style={estilos.contagem}>
                {rodapeDaEstante(naEstante.length, parede !== null)}
              </Text>
            </>
          )}
        </ScrollView>

        <View pointerEvents="box-none" style={estilos.pe}>
          <View style={estilos.chao} />
          <View style={estilos.lugarDaJiboia}>
            <BwJiboia />
          </View>
          <View style={estilos.lugarDoFichario}>
            <BwFichario
              ficha={fichaDaFrente({ estado, ordem, parede: parede?.nome ?? null })}
              onAbrir={() => setFichario(true)}
            />
          </View>
        </View>
      </View>

      <BwBarraDeNavegacao atual="biblioteca" onMesa={pousar} />

      <BwMenuRapido menu={menu} onFechar={() => setSegurada(null)} />
      <BwGavetaDoFichario
        aberta={fichario}
        onFechar={() => setFichario(false)}
        estado={estado}
        onEstado={setEstado}
        contagem={contagem}
        ordem={ordem}
        onOrdem={setOrdem}
        paredes={paredes}
        paredeId={escolhida}
        onParede={(id) => {
          setParedeId(id);
          setFichario(false);
        }}
        onNovaParede={() => {
          setFichario(false);
          setCriando(true);
        }}
        onEditarParede={(id) => {
          setFichario(false);
          setEditandoId(id);
        }}
        onFavoritarParede={favoritarParede}
        onTirarParede={(id) => {
          if (id === escolhida) setParedeId(null);
          tirarParede(id);
        }}
      />
      <BwParedeNova
        aberta={criando}
        obras={obras}
        onCancelar={() => setCriando(false)}
        onPendurada={(id) => {
          setCriando(false);
          setEstado('todos');
          setParedeId(id);
        }}
      />
      {editando && (
        <BwParedeNova
          key={editando.id}
          aberta
          obras={obras}
          editando={editando}
          onCancelar={() => setEditandoId(null)}
          onPendurada={() => setEditandoId(null)}
        />
      )}
    </Animated.View>
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

/** Quanto do pé da parede o fichário ocupa: a última prateleira rola até acima dele. */
const ALTURA_DO_PE = 162;

const estilos = StyleSheet.create((theme) => ({
  parede: (cor: CorDeParede) => ({
    flex: 1,
    backgroundColor: theme.arte.parede.tintas[cor],
  }),
  cabeca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[4],
    paddingHorizontal: theme.esp[6],
    paddingBottom: theme.esp[4],
  },
  tira: {
    flex: 1,
    minWidth: 0,
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[2],
    paddingHorizontal: theme.esp[4],
    backgroundColor: theme.sup.papelFundo.fundo,
    transform: [{ rotate: espelhar(giro.plaqueta) }],
    boxShadow: `0 6px 12px ${theme.arte.parede.sombra}`,
  },
  fita: {
    position: 'absolute',
    top: -6,
    width: 32,
    height: 12,
    backgroundColor: theme.arte.parede.fita,
  },
  fitaEsquerda: { left: -9, transform: [{ rotate: giro.carimbo }] },
  fitaDireita: { right: -9, transform: [{ rotate: espelhar(giro.carimbo) }] },
  lupa: { width: 12, height: 12 },
  campo: {
    ...tipo.corpoPequeno,
    flex: 1,
    minHeight: 36,
    paddingVertical: 0,
    color: theme.sup.papelFundo.tinta,
  },
  placa: {
    ...tipo.microcopy,
    maxWidth: '40%',
    paddingHorizontal: theme.esp[3],
    borderWidth: 2,
    borderColor: theme.arte.fichario.latao,
    color: theme.sup.mesa.tinta,
  },
  vao: { flex: 1 },
  trilho: {
    paddingTop: theme.esp[7],
    paddingLeft: theme.esp[5],
    paddingRight: LARGURA_DA_JIBOIA,
    paddingBottom: ALTURA_DO_PE,
    gap: theme.esp[6],
  },
  pe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: ALTURA_DA_JIBOIA,
  },
  chao: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 27,
    backgroundColor: theme.arte.parede.chao,
    borderTopWidth: 9,
    borderTopColor: theme.arte.parede.rodape,
  },
  lugarDaJiboia: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  lugarDoFichario: {
    position: 'absolute',
    left: 18,
    bottom: 9,
  },
  convite: {
    gap: theme.esp[5],
    paddingVertical: theme.esp[5],
  },
  lapis: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.mesa.tinta,
  },
  contagem: {
    ...tipo.kicker,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.esp[3],
    paddingVertical: theme.esp[1],
    backgroundColor: theme.arte.parede.chao,
    color: theme.sup.mesa.tinta,
    transform: [{ rotate: giro.rotulo }],
  },
}));
