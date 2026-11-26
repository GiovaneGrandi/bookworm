import {
  FILTROS_DE_ESTADO,
  type FiltroDeEstado,
  ORDENS_DA_ESTANTE,
  type OrdemDaEstante,
} from '@bookworm/core';
import { type ReactNode, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import type { ParedePropria } from '../../dados/paredes';
import { ROTULO_DA_ORDEM, ROTULO_DO_ESTADO } from '../../estante';
import { ALVO_MINIMO, espelhar, giro, raio } from '../../tema/geometria';
import { tipo, tipoMiniatura } from '../../tema/tipografia';
import { BwBotao } from '../BwBotao';

/**
 * O fichário no chão, ao lado da estante (jeito 2, 26/11/2026). A ficha da frente diz o que está
 * na parede; tocar abre a gaveta com o estado, a ordem e as paredes.
 */
export function BwFichario({ ficha, onAbrir }: { ficha: string; onAbrir: () => void }) {
  return (
    <Pressable
      onPress={onAbrir}
      accessibilityRole="button"
      accessibilityLabel={`Fichário: estado, ordem e paredes. Agora: ${ficha}`}
      hitSlop={{ top: 9, bottom: 9, left: 9, right: 9 }}
      style={({ pressed }) => [estilos.fichario, pressed && estilos.puxado]}
    >
      <View style={[estilos.fichaAtras, estilos.fichaAtrasUm]} />
      <View style={[estilos.fichaAtras, estilos.fichaAtrasDois]} />
      <View style={estilos.fichaDaFrente}>
        <Text numberOfLines={1} style={estilos.textoDaFicha}>
          {ficha}
        </Text>
      </View>
      <View style={estilos.caixa}>
        <View style={estilos.frente}>
          <View style={estilos.portaEtiqueta}>
            <Text style={estilos.etiqueta}>Filtros</Text>
          </View>
          <View style={estilos.puxador} />
        </View>
      </View>
    </Pressable>
  );
}

type Gaveta = {
  aberta: boolean;
  onFechar: () => void;
  estado: FiltroDeEstado;
  onEstado: (e: FiltroDeEstado) => void;
  contagem: Record<FiltroDeEstado, number>;
  ordem: OrdemDaEstante;
  onOrdem: (o: OrdemDaEstante) => void;
  paredes: readonly ParedePropria[];
  paredeId: string | null;
  onParede: (id: string | null) => void;
  onNovaParede: () => void;
  onTirarParede: (id: string) => void;
};

/** A gaveta puxada: três fichas, uma atrás da outra, cada uma com a sua aba. */
export function BwGavetaDoFichario(g: Gaveta) {
  const { bottom } = useSafeAreaInsets();
  const [tirando, setTirando] = useState<string | null>(null);

  function fechar() {
    setTirando(null);
    g.onFechar();
  }

  return (
    <Modal
      visible={g.aberta}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="slide"
      onRequestClose={fechar}
    >
      <Pressable
        onPress={fechar}
        accessibilityRole="button"
        accessibilityLabel="Fechar o fichário"
        style={estilos.veu}
      />
      <View accessibilityViewIsModal style={[estilos.gaveta, { paddingBottom: bottom }]}>
        <View style={estilos.alca} />
        <ScrollView style={estilos.miolo} contentContainerStyle={estilos.fichas}>
          <Ficha aba="Estado" posicao={0}>
            <View accessibilityRole="radiogroup" style={estilos.carimbos}>
              {FILTROS_DE_ESTADO.map((e) => {
                const escolhido = g.estado === e;
                return (
                  <Pressable
                    key={e}
                    onPress={() => g.onEstado(e)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: escolhido }}
                    accessibilityLabel={`${ROTULO_DO_ESTADO[e]}, ${g.contagem[e]}`}
                    style={[estilos.carimbo, escolhido && estilos.carimboEscolhido]}
                  >
                    <Text style={[estilos.textoCarimbo, escolhido && estilos.textoEscolhido]}>
                      {ROTULO_DO_ESTADO[e]} · {g.contagem[e]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Ficha>

          <Ficha aba="Ordem" posicao={1}>
            <View accessibilityRole="radiogroup" style={estilos.ordens}>
              {ORDENS_DA_ESTANTE.map((o) => {
                const escolhida = g.ordem === o;
                return (
                  <Pressable
                    key={o}
                    onPress={() => g.onOrdem(o)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: escolhida }}
                    style={[estilos.ordem, escolhida && estilos.ordemEscolhida]}
                  >
                    <Text style={estilos.textoOrdem}>{ROTULO_DA_ORDEM[o]}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Ficha>

          <Ficha aba="Paredes" posicao={2}>
            <LinhaDeParede
              nome="Toda a estante"
              escolhida={g.paredeId === null}
              onEscolher={() => g.onParede(null)}
            />
            {g.paredes.map((p) =>
              tirando === p.id ? (
                <View key={p.id} style={estilos.confirmar}>
                  <Text style={estilos.aviso}>
                    Tirar a parede “{p.nome}”? Os livros ficam na estante.
                  </Text>
                  <View style={estilos.botoes}>
                    <BwBotao rotulo="Manter" onPress={() => setTirando(null)} />
                    <BwBotao
                      variante="primario"
                      rotulo="Tirar"
                      onPress={() => {
                        setTirando(null);
                        g.onTirarParede(p.id);
                      }}
                    />
                  </View>
                </View>
              ) : (
                <LinhaDeParede
                  key={p.id}
                  nome={p.nome}
                  cor={p.cor}
                  conta={p.obras.length}
                  escolhida={g.paredeId === p.id}
                  onEscolher={() => g.onParede(p.id)}
                  onSegurar={() => setTirando(p.id)}
                />
              )
            )}
            <Pressable
              onPress={g.onNovaParede}
              accessibilityRole="button"
              style={({ pressed }) => [estilos.linha, estilos.ultima, pressed && estilos.tocada]}
            >
              <Text style={estilos.nova}>+ pendurar uma parede nova</Text>
            </Pressable>
          </Ficha>

          {g.paredes.length > 0 && <Text style={estilos.dica}>segure uma parede para tirá-la</Text>}
          <BwBotao rotulo="Fechar a gaveta" onPress={fechar} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function Ficha({ aba, posicao, children }: { aba: string; posicao: number; children: ReactNode }) {
  return (
    <View style={estilos.ficha(posicao)}>
      <View style={estilos.aba(posicao)}>
        <Text accessibilityRole="header" style={estilos.textoAba}>
          {aba}
        </Text>
      </View>
      {children}
    </View>
  );
}

function LinhaDeParede({
  nome,
  cor,
  conta,
  escolhida,
  onEscolher,
  onSegurar,
}: {
  nome: string;
  cor?: ParedePropria['cor'];
  conta?: number;
  escolhida: boolean;
  onEscolher: () => void;
  onSegurar?: () => void;
}) {
  return (
    <Pressable
      onPress={onEscolher}
      onLongPress={onSegurar}
      delayLongPress={420}
      accessibilityRole="radio"
      accessibilityState={{ checked: escolhida }}
      accessibilityLabel={conta === undefined ? nome : `${nome}, ${conta} livros`}
      accessibilityHint={onSegurar ? 'Segure para tirar a parede' : undefined}
      style={({ pressed }) => [estilos.linha, pressed && estilos.tocada]}
    >
      <View style={estilos.nomeDaParede}>
        {cor && <View style={estilos.amostra(cor)} />}
        <Text numberOfLines={1} style={estilos.textoLinha}>
          {nome}
        </Text>
      </View>
      <Text style={[estilos.conta, escolhida && estilos.aqui]}>
        {escolhida ? 'aqui' : (conta ?? '')}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create((theme) => ({
  fichario: {
    width: 132,
    height: 126,
    minHeight: ALVO_MINIMO,
  },
  puxado: { transform: [{ translateY: -3 }] },
  fichaAtras: {
    position: 'absolute',
    top: 0,
    width: 98,
    height: 40,
  },
  fichaAtrasUm: {
    left: 14,
    backgroundColor: theme.arte.fichario.fichas[0],
    transform: [{ rotate: giro.fita }],
  },
  fichaAtrasDois: {
    left: 22,
    top: 6,
    backgroundColor: theme.arte.fichario.fichas[1],
    transform: [{ rotate: espelhar(giro.etiqueta) }],
  },
  fichaDaFrente: {
    position: 'absolute',
    left: 12,
    top: 9,
    width: 108,
    height: 36,
    paddingTop: theme.esp[2],
    paddingHorizontal: theme.esp[3],
    backgroundColor: theme.sup.papel.fundo,
  },
  textoDaFicha: {
    ...tipoMiniatura.placa,
    color: theme.sup.papel.tinta,
  },
  caixa: {
    position: 'absolute',
    left: 0,
    top: 36,
    width: 132,
    height: 90,
    paddingTop: theme.esp[4],
    paddingHorizontal: theme.esp[3],
    backgroundColor: theme.arte.fichario.caixa,
    borderTopWidth: 3,
    borderTopColor: theme.arte.fichario.filete,
    boxShadow: `6px 9px 18px ${theme.arte.parede.sombra}`,
  },
  frente: {
    height: 63,
    alignItems: 'center',
    paddingTop: theme.esp[3],
    gap: theme.esp[3],
    backgroundColor: theme.arte.fichario.frente,
  },
  portaEtiqueta: {
    paddingHorizontal: theme.esp[3],
    borderWidth: 2,
    borderColor: theme.arte.fichario.latao,
    backgroundColor: theme.arte.fichario.fichas[0],
  },
  etiqueta: {
    ...tipoMiniatura.placa,
    color: theme.sup.papel.tinta,
  },
  puxador: {
    width: 24,
    height: 12,
    borderWidth: 3,
    borderTopWidth: 0,
    borderColor: theme.arte.fichario.latao,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  veu: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.arte.veu,
  },
  gaveta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '78%',
    paddingTop: theme.esp[5],
    paddingHorizontal: theme.esp[5],
    backgroundColor: theme.arte.fichario.caixa,
    borderTopWidth: 3,
    borderTopColor: theme.arte.fichario.filete,
    boxShadow: `0 -12px 27px ${theme.arte.parede.sombra}`,
  },
  alca: {
    position: 'absolute',
    top: 6,
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.arte.fichario.filete,
  },
  miolo: {
    backgroundColor: theme.arte.fichario.fundo,
  },
  fichas: {
    paddingTop: theme.esp[7],
    paddingHorizontal: theme.esp[4],
    paddingBottom: theme.esp[5],
    gap: theme.esp[7],
  },
  ficha: (posicao: number) => ({
    padding: theme.esp[4],
    gap: theme.esp[2],
    backgroundColor: posicao === 0 ? theme.sup.papel.fundo : theme.sup.papelFundo.fundo,
    boxShadow: `0 3px 6px ${theme.arte.parede.sombra}`,
  }),
  aba: (posicao: number) => ({
    position: 'absolute',
    top: -21,
    left: 12 + posicao * 96,
    paddingHorizontal: theme.esp[3],
    paddingTop: theme.esp[1],
    backgroundColor: posicao === 0 ? theme.sup.papel.fundo : theme.sup.papelFundo.fundo,
  }),
  textoAba: {
    ...tipo.kicker,
    color: theme.sup.papel.acento,
  },
  carimbos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.esp[2],
  },
  carimbo: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: theme.esp[3],
    borderWidth: 1.5,
    borderColor: theme.sup.papel.tintaFraca,
  },
  carimboEscolhido: {
    backgroundColor: theme.semantico.papel.acaoPrimaria,
    borderColor: theme.semantico.papel.acaoPrimaria,
  },
  textoCarimbo: {
    ...tipo.kicker,
    color: theme.sup.papel.tinta,
  },
  textoEscolhido: { color: theme.semantico.papel.acaoPrimariaTinta },
  ordens: {
    flexDirection: 'row',
    gap: theme.esp[5],
  },
  ordem: {
    minHeight: ALVO_MINIMO,
    justifyContent: 'center',
    paddingHorizontal: theme.esp[2],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  ordemEscolhida: { borderBottomColor: theme.sup.papel.acento },
  textoOrdem: {
    ...tipo.corpo,
    color: theme.sup.papel.tinta,
  },
  linha: {
    minHeight: ALVO_MINIMO,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.esp[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.sup.papelFundo.borda,
  },
  ultima: { borderBottomWidth: 0 },
  tocada: { backgroundColor: theme.semantico.papel.selecionadoFundo },
  nomeDaParede: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[3],
  },
  amostra: (cor: ParedePropria['cor']) => ({
    width: 14,
    height: 14,
    ...raio.irregularP,
    backgroundColor: theme.arte.parede.tintas[cor],
  }),
  textoLinha: {
    ...tipo.corpo,
    flexShrink: 1,
    color: theme.sup.papel.tinta,
  },
  conta: {
    ...tipo.kicker,
    color: theme.sup.papel.tintaFraca,
  },
  aqui: { color: theme.sup.papel.acento },
  nova: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.papel.acento,
  },
  confirmar: {
    paddingVertical: theme.esp[3],
    gap: theme.esp[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.sup.papelFundo.borda,
  },
  aviso: {
    ...tipo.microcopy,
    color: theme.sup.papel.tinta,
  },
  botoes: {
    flexDirection: 'row',
    gap: theme.esp[3],
  },
  dica: {
    ...tipo.marginalia,
    color: theme.sup.mesa.tinta,
  },
}));
