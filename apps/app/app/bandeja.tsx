import { obraComMesmoArquivo } from '@bookworm/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BwBotao } from '../src/componentes/BwBotao';
import { BwEnvelope } from '../src/componentes/BwEnvelope';
import { BwFolha } from '../src/componentes/BwFolha';
import { usePousarNaMesa } from '../src/componentes/usePousarNaMesa';
import { marcarAberta, useObras } from '../src/dados/obras';
import { formatarTamanho } from '../src/formatar';
import { ACERVO, type ItemAcervo } from '../src/importacao/acervo';
import { importarDoAcervo, importarDoAparelho, type Resultado } from '../src/importacao/importar';
import { ALVO_MINIMO, raio } from '../src/tema/geometria';
import { tipo } from '../src/tema/tipografia';

const RECUSA = {
  drm: 'Este arquivo tem DRM, uma trava do vendedor. O BookWorm só abre livros sem DRM.',
  formato: 'Não parece um EPUB nem um PDF. Confira a extensão ou tente outro arquivo.',
  ilegivel: 'O EPUB está corrompido ou incompleto, e não deu para ler o texto dele.',
} as const;

/** A bandeja de entrada: pôr um livro na mesa, do aparelho ou do acervo (RN-02.1a, Q5, Q7). */
export default function Bandeja() {
  const router = useRouter();
  const pousar = usePousarNaMesa();
  const obras = useObras();
  const [carregando, setCarregando] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [falha, setFalha] = useState<string | null>(null);

  const naGaveta = (item: ItemAcervo) =>
    obras.some((o) => o.chaveAcervo === item.chave) ||
    Boolean(obraComMesmoArquivo(obras, item.arquivo));

  async function receber(chave: string, importar: () => Promise<Resultado | null>) {
    setCarregando(chave);
    setFalha(null);
    try {
      const r = await importar();
      if (r) setResultado(r);
    } catch (e) {
      setFalha(String(e instanceof Error ? e.message : e));
    } finally {
      setCarregando(null);
    }
  }

  function abrirAgora(obraId: string) {
    marcarAberta(obraId);
    router.replace(`/leitor/${obraId}`);
  }

  return (
    <BwFolha kicker="Bandeja de entrada" titulo="Pôr um livro na mesa">
      <View style={estilos.soltar}>
        <Text style={estilos.micro}>Um arquivo seu, EPUB ou PDF, sem DRM.</Text>
        <BwBotao
          variante="primario"
          estado={
            carregando === 'aparelho' ? 'carregando' : carregando ? 'desabilitado' : 'repouso'
          }
          onPress={() => receber('aparelho', importarDoAparelho)}
          rotulo="Escolher arquivo"
        />
      </View>

      {falha && <Text style={estilos.lapis}>Algo deu errado ao receber o arquivo: {falha}</Text>}
      {resultado && (
        <Envelope
          resultado={resultado}
          onAbrir={abrirAgora}
          onGuardar={pousar}
          onOutro={() => setResultado(null)}
        />
      )}

      <View style={estilos.regua} />
      <Text style={estilos.kicker}>Ou do acervo de domínio público</Text>
      <View>
        {ACERVO.map((item) => (
          <ItemDoAcervo
            key={item.chave}
            item={item}
            naGaveta={naGaveta(item)}
            carregando={carregando === item.chave}
            desabilitado={carregando !== null}
            onPegar={() => receber(item.chave, () => importarDoAcervo(item))}
          />
        ))}
      </View>
    </BwFolha>
  );
}

function Envelope({
  resultado,
  onAbrir,
  onGuardar,
  onOutro,
}: {
  resultado: Resultado;
  onAbrir: (id: string) => void;
  onGuardar: () => void;
  onOutro: () => void;
}) {
  if (resultado.tipo === 'recusada') {
    return (
      <BwEnvelope
        selo="?"
        nomeArquivo={resultado.nomeArquivo}
        meta="não entrou"
        superficie="papelFundo"
      >
        <Text style={estilos.texto}>{RECUSA[resultado.motivo]}</Text>
        <BwBotao onPress={onOutro} superficie="papelFundo" rotulo="Tentar outro" />
      </BwEnvelope>
    );
  }
  if (resultado.tipo === 'ja_na_gaveta') {
    return (
      <BwEnvelope
        selo={resultado.formato === 'pdf' ? 'PDF' : 'EPUB'}
        nomeArquivo={resultado.nomeArquivo}
        meta="não entrou de novo"
      >
        <Text style={estilos.lapis}>
          {resultado.titulo} já está na sua gaveta. Um arquivo com o mesmo nome não entra duas
          vezes.
        </Text>
        <BwBotao
          variante="primario"
          onPress={() => onAbrir(resultado.obraId)}
          rotulo="Abrir agora"
        />
      </BwEnvelope>
    );
  }

  const pdf = resultado.formato === 'pdf';
  return (
    <BwEnvelope
      selo={pdf ? 'PDF' : 'EPUB'}
      nomeArquivo={resultado.nomeArquivo}
      meta={`${formatarTamanho(resultado.tamanho)} · chegou agora`}
      superficie={pdf ? 'papelFundo' : 'papel'}
      espelhado={pdf}
    >
      {pdf ? (
        <>
          <Text style={estilos.texto}>
            <Text style={estilos.negrito}>Chega como fotocópia.</Text> Cada página é uma imagem
            fixa.
          </Text>
          <View style={estilos.honesto}>
            <Text style={estilos.texto}>Dá para ler e marcar onde parou.</Text>
            <Text style={estilos.texto}>
              Não dá para trocar a letra, a entrelinha nem a margem, porque o PDF não se reorganiza.
            </Text>
            <Text style={estilos.texto}>
              Grifo, lápis e dicionário dependem de extrair o texto do arquivo, e essa parte ainda
              não está decidida.
            </Text>
          </View>
        </>
      ) : (
        <Text style={estilos.texto}>
          <Text style={estilos.negrito}>Chega como livro.</Text> O texto se reorganiza na sua letra
          e conta páginas canônicas.
        </Text>
      )}
      <BwBotao
        variante="primario"
        superficie={pdf ? 'papelFundo' : 'papel'}
        onPress={() => onAbrir(resultado.obraId)}
        rotulo="Abrir agora"
      />
      <BwBotao
        superficie={pdf ? 'papelFundo' : 'papel'}
        onPress={onGuardar}
        rotulo="Guardar em Quero ler"
      />
    </BwEnvelope>
  );
}

function ItemDoAcervo({
  item,
  naGaveta,
  carregando,
  desabilitado,
  onPegar,
}: {
  item: ItemAcervo;
  naGaveta: boolean;
  carregando: boolean;
  desabilitado: boolean;
  onPegar: () => void;
}) {
  return (
    <Pressable
      onPress={onPegar}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={`${item.titulo}, de ${item.autor}. ${naGaveta ? 'Já está na gaveta' : 'Pegar do acervo'}`}
      accessibilityState={{ busy: carregando, disabled: desabilitado }}
      style={({ pressed }) => [estilos.itemAcervo, pressed && estilos.itemPressionado]}
    >
      <View style={estilos.itemTexto}>
        <Text style={estilos.itemTitulo}>{item.titulo}</Text>
        <Text style={estilos.itemAutor}>{item.autor}</Text>
      </View>
      <Text style={estilos.itemAcao}>
        {carregando ? 'pegando…' : naGaveta ? 'na gaveta' : 'pegar'}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create((theme) => ({
  soltar: {
    marginTop: theme.esp[4],
    padding: theme.esp[5],
    gap: theme.esp[4],
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.sup.papelFundo.borda,
    backgroundColor: theme.sup.papelFundo.fundo,
    ...raio.irregularM,
  },
  micro: {
    ...tipo.microcopy,
    color: theme.sup.papelFundo.tinta,
    textAlign: 'center',
  },
  texto: {
    ...tipo.corpo,
    color: theme.sup.papel.tinta,
  },
  negrito: {
    fontFamily: 'Spectral_600SemiBold',
  },
  honesto: {
    borderLeftWidth: 3,
    borderLeftColor: theme.sup.papel.tintaFraca,
    paddingLeft: theme.esp[4],
    gap: theme.esp[2],
  },
  lapis: {
    ...tipo.marginalia,
    color: theme.sup.papel.tintaFraca,
    transform: [{ rotate: '-1deg' }],
  },
  regua: {
    height: 1,
    backgroundColor: theme.sup.papel.borda,
    marginVertical: theme.esp[5],
  },
  kicker: {
    ...tipo.kicker,
    color: theme.sup.papel.acento,
  },
  itemAcervo: {
    minHeight: ALVO_MINIMO + 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.esp[4],
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderBottomColor: theme.sup.papel.borda,
  },
  itemPressionado: {
    backgroundColor: theme.semantico.papel.selecionadoFundo,
  },
  itemTexto: {
    flex: 1,
    paddingVertical: theme.esp[2],
  },
  itemTitulo: {
    ...tipo.corpo,
    color: theme.sup.papel.tinta,
  },
  itemAutor: {
    ...tipo.corpoPequeno,
    color: theme.sup.papel.tintaFraca,
  },
  itemAcao: {
    ...tipo.kickerMicro,
    color: theme.sup.papel.tinta,
  },
}));
