import {
  alternarNaEscolha,
  CORES_DE_PAREDE,
  type CorDeParede,
  limparNomeDeParede,
  NOME_DE_PAREDE_MAX,
  obrasNaEstante,
} from '@bookworm/core';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { criarParede, editarParede, type ParedePropria } from '../../dados/paredes';
import type { Obra } from '../../dados/schema';
import { ALVO_MINIMO, raio } from '../../tema/geometria';
import { tipo } from '../../tema/tipografia';
import { BwBotao } from '../BwBotao';
import { BwCapaNaParede, BwPrateleiras } from './BwPrateleiras';

const NOME_DA_TINTA: Record<CorDeParede, string> = {
  mesa: 'Verde-mesa',
  vinho: 'Vinho',
  prussia: 'Azul-da-prússia',
  terra: 'Terra',
  grafite: 'Grafite',
};

/**
 * Pendurar uma parede nova, em dois passos: o nome numa placa e a tinta da parede; depois, a
 * estante inteira para marcar os livros que vão nela. A parede pintada aparece desde o começo.
 * Com `editando`, é só o primeiro passo, já preenchido: trocar o nome e a tinta e salvar.
 * Quem usa dá uma `key` por parede, para o estado nascer dela.
 */
export function BwParedeNova({
  aberta,
  obras,
  editando = null,
  onCancelar,
  onPendurada,
}: {
  aberta: boolean;
  obras: readonly Obra[];
  editando?: ParedePropria | null;
  onCancelar: () => void;
  onPendurada: (id: string) => void;
}) {
  const { theme } = useUnistyles();
  const { top, bottom } = useSafeAreaInsets();
  const [passo, setPasso] = useState<'nome' | 'livros'>('nome');
  const [nome, setNome] = useState(editando?.nome ?? '');
  const [cor, setCor] = useState<CorDeParede>(editando?.cor ?? 'vinho');
  const [termo, setTermo] = useState('');
  const [escolha, setEscolha] = useState<string[]>([]);

  const nomeLimpo = limparNomeDeParede(nome);
  const naEstante = obrasNaEstante(obras, 'az', termo);

  function recomecar() {
    setPasso('nome');
    setNome('');
    setCor('vinho');
    setTermo('');
    setEscolha([]);
  }

  function cancelar() {
    recomecar();
    onCancelar();
  }

  function salvar() {
    if (!nomeLimpo || !editando) return;
    editarParede(editando.id, nomeLimpo, cor);
    onPendurada(editando.id);
  }

  function pendurar() {
    if (!nomeLimpo) return;
    const id = criarParede(nomeLimpo, cor, escolha);
    recomecar();
    onPendurada(id);
  }

  return (
    <Modal
      visible={aberta}
      statusBarTranslucent
      navigationBarTranslucent
      animationType="slide"
      onRequestClose={passo === 'livros' ? () => setPasso('nome') : cancelar}
    >
      <View style={[estilos.parede(cor), { paddingTop: top }]}>
        <View style={estilos.topo}>
          <Pressable
            onPress={passo === 'livros' ? () => setPasso('nome') : cancelar}
            accessibilityRole="button"
            style={estilos.voltar}
          >
            <Text style={estilos.kicker}>{passo === 'livros' ? '← Voltar' : 'Cancelar'}</Text>
          </Pressable>
          <Text style={estilos.kickerFraco}>
            {editando ? 'Editar parede' : `Nova parede · ${passo === 'nome' ? 1 : 2} de 2`}
          </Text>
        </View>

        {passo === 'nome' ? (
          <ScrollView contentContainerStyle={estilos.passoNome}>
            <View style={estilos.placa}>
              <Text nativeID="rotulo-nome" style={estilos.kickerPapel}>
                Nome da parede
              </Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="ex.: Machado, inteiro"
                placeholderTextColor={theme.sup.papel.tintaFraca}
                accessibilityLabelledBy="rotulo-nome"
                accessibilityLabel="Nome da parede"
                maxLength={NOME_DE_PAREDE_MAX}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => {
                  if (!nomeLimpo) return;
                  if (editando) salvar();
                  else setPasso('livros');
                }}
                style={estilos.campoNome}
              />
            </View>

            <View style={estilos.giz}>
              <View style={estilos.prateleiraDeGiz} />
              <View style={estilos.prateleiraDeGiz} />
              <Text style={estilos.lapis}>
                {editando
                  ? 'os livros continuam; para trocá-los, segure um livro na estante'
                  : 'os livros entram no próximo passo'}
              </Text>
            </View>

            <Text style={estilos.kicker}>Cor da parede</Text>
            <View accessibilityRole="radiogroup" style={estilos.tintas}>
              {CORES_DE_PAREDE.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCor(c)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: cor === c }}
                  accessibilityLabel={NOME_DA_TINTA[c]}
                  style={[estilos.lata(c), cor === c && estilos.lataEscolhida]}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <>
            <View style={estilos.cabecaLivros}>
              <View style={estilos.placaPequena}>
                <Text numberOfLines={1} style={estilos.nomeNaPlaca}>
                  {nomeLimpo}
                </Text>
              </View>
              <TextInput
                value={termo}
                onChangeText={setTermo}
                placeholder="filtrar…"
                placeholderTextColor={theme.sup.papel.tintaFraca}
                accessibilityLabel="Filtrar por título ou autor"
                returnKeyType="search"
                style={estilos.filtrar}
              />
            </View>
            <Text style={estilos.lapis}>toque nas capas para pôr um marcador</Text>
            <ScrollView contentContainerStyle={estilos.trilho}>
              {naEstante.length === 0 ? (
                <Text style={estilos.lapis}>Nenhum livro encontrado.</Text>
              ) : (
                <BwPrateleiras
                  obras={naEstante}
                  capa={(o) => (
                    <BwCapaNaParede
                      obra={o}
                      marcada={escolha.includes(o.id)}
                      onAbrir={() => setEscolha((e) => alternarNaEscolha(e, o.id))}
                    />
                  )}
                />
              )}
            </ScrollView>
          </>
        )}

        <View style={[estilos.chao, { paddingBottom: bottom + 18 }]}>
          {editando ? (
            <BwBotao
              variante="primario"
              rotulo="Salvar a parede"
              estado={nomeLimpo ? 'repouso' : 'desabilitado'}
              onPress={salvar}
            />
          ) : passo === 'nome' ? (
            <BwBotao
              variante="primario"
              rotulo="Escolher os livros →"
              estado={nomeLimpo ? 'repouso' : 'desabilitado'}
              onPress={() => setPasso('livros')}
            />
          ) : (
            <View style={estilos.rodapeLivros}>
              <Text style={estilos.marcados}>
                {escolha.length} {escolha.length === 1 ? 'marcado' : 'marcados'}
              </Text>
              <View style={estilos.botaoPendurar}>
                <BwBotao variante="primario" rotulo="Pendurar a parede" onPress={pendurar} />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create((theme) => ({
  parede: (cor: CorDeParede) => ({
    flex: 1,
    backgroundColor: theme.arte.parede.tintas[cor],
  }),
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.esp[6],
  },
  voltar: {
    minHeight: ALVO_MINIMO,
    justifyContent: 'center',
  },
  kicker: {
    ...tipo.kicker,
    color: theme.sup.mesa.tinta,
  },
  kickerFraco: {
    ...tipo.kicker,
    color: theme.sup.mesa.tintaFraca,
  },
  passoNome: {
    paddingHorizontal: theme.esp[6],
    paddingTop: theme.esp[6],
    paddingBottom: theme.esp[6],
    gap: theme.esp[5],
  },
  placa: {
    paddingTop: theme.esp[4],
    paddingHorizontal: theme.esp[5],
    paddingBottom: theme.esp[3],
    backgroundColor: theme.sup.papel.fundo,
    borderWidth: 3,
    borderColor: theme.arte.fichario.latao,
    boxShadow: `0 9px 18px ${theme.arte.parede.sombra}`,
  },
  kickerPapel: {
    ...tipo.kicker,
    color: theme.sup.papel.acento,
  },
  campoNome: {
    ...tipo.tituloCapitulo,
    minHeight: ALVO_MINIMO,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.sup.papel.borda,
    color: theme.sup.papel.tinta,
  },
  giz: {
    gap: theme.esp[6],
    paddingVertical: theme.esp[3],
  },
  prateleiraDeGiz: {
    height: 81,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderStyle: 'dashed',
    borderColor: theme.sup.mesa.borda,
  },
  lapis: {
    ...tipo.marginalia,
    color: theme.sup.mesa.tinta,
    paddingHorizontal: theme.esp[6],
  },
  tintas: {
    flexDirection: 'row',
    gap: theme.esp[5],
  },
  lata: (c: CorDeParede) => ({
    width: ALVO_MINIMO,
    height: ALVO_MINIMO,
    ...raio.irregularM,
    borderWidth: 3,
    borderColor: theme.arte.fichario.filete,
    backgroundColor: theme.arte.parede.tintas[c],
  }),
  lataEscolhida: {
    borderColor: theme.arte.barra.ativo,
    transform: [{ translateY: -6 }],
  },
  cabecaLivros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[4],
    paddingHorizontal: theme.esp[6],
    paddingTop: theme.esp[3],
    paddingBottom: theme.esp[2],
  },
  placaPequena: {
    maxWidth: '50%',
    paddingHorizontal: theme.esp[4],
    paddingVertical: theme.esp[1],
    borderWidth: 2,
    borderColor: theme.arte.fichario.latao,
  },
  nomeNaPlaca: {
    ...tipo.microcopy,
    color: theme.sup.mesa.tinta,
  },
  filtrar: {
    ...tipo.corpoPequeno,
    flex: 1,
    minHeight: 36,
    paddingVertical: 0,
    paddingHorizontal: theme.esp[3],
    backgroundColor: theme.sup.papelFundo.fundo,
    color: theme.sup.papelFundo.tinta,
  },
  trilho: {
    paddingTop: theme.esp[7],
    paddingHorizontal: theme.esp[5],
    paddingBottom: theme.esp[7],
  },
  chao: {
    paddingTop: theme.esp[5],
    paddingHorizontal: theme.esp[6],
    backgroundColor: theme.arte.parede.chao,
    borderTopWidth: 9,
    borderTopColor: theme.arte.parede.rodape,
  },
  rodapeLivros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[5],
  },
  marcados: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.mesa.tinta,
  },
  botaoPendurar: { flex: 1 },
}));
