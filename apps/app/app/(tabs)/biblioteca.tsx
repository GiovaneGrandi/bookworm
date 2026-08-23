// Biblioteca e Estante — duas divisórias da mesma aba (RN-02.6a): Biblioteca mostra o que ainda
// vai ser lido (lendo, quero_ler, em_pausa) + acervo de domínio público embarcado (RN-02.3);
// Estante mostra o que já foi lido (concluido), e só cresce (RN-02.22a). Reler uma obra da Estante
// a devolve à Biblioteca sem tirá-la da Estante (RN-02.6b) — já garantido por `marcarComoLendo`,
// chamado incondicionalmente na abertura do leitor desde o Estágio 7 fundação.
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  type ItemDaBiblioteca,
  type ItemDaEstante,
  listarBiblioteca,
  listarEstante,
  tituloJaNoAcervoDaBiblioteca,
} from '../../src/biblioteca/consultas.js';
import { BwFolha, BwImportar, BwItem, BwVazio } from '../../src/componentes/index.js';
import { useSuperficie } from '../../src/componentes/useSuperficie.js';
import {
  ACERVO_INICIAL,
  adicionarDoCatalogo,
  type ObraDoCatalogo,
} from '../../src/importacao/catalogo.js';
import { importarObra, type ResultadoImportacao } from '../../src/importacao/importarObra.js';
import { fontFamilyPara } from '../../src/tema/fontes.js';

type Divisao = 'biblioteca' | 'estante';

const FORMATADOR_DATA = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

const MENSAGENS_DE_ERRO: Record<Exclude<ResultadoImportacao, { ok: true }>['motivo'], string> = {
  cancelado: '',
  formato_nao_suportado: 'Só EPUB é aceito nesta versão.',
  pdf_nao_suportado: 'PDF ainda não é aceito nesta versão.',
  epub_invalido: 'Este arquivo não é um EPUB válido.',
};

export default function TelaBiblioteca() {
  const sup = useSuperficie('papel');
  const [divisao, setDivisao] = useState<Divisao>('biblioteca');
  const [itens, setItens] = useState<ItemDaBiblioteca[] | null>(null);
  const [estante, setEstante] = useState<ItemDaEstante[] | null>(null);
  const [acervoDisponivel, setAcervoDisponivel] = useState<ObraDoCatalogo[]>([]);
  const [importando, setImportando] = useState(false);
  const [adicionandoChave, setAdicionandoChave] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    void Promise.all([listarBiblioteca(), listarEstante(), tituloJaNoAcervoDaBiblioteca()]).then(
      ([lista, itensDaEstante, jaAdicionados]) => {
        setItens(lista);
        setEstante(itensDaEstante);
        setAcervoDisponivel(ACERVO_INICIAL.filter((obra) => !jaAdicionados.has(obra.titulo)));
      }
    );
  }, []);

  useFocusEffect(recarregar);

  const aoTocarImportar = async () => {
    setErro(null);
    setImportando(true);
    const resultado = await importarObra();
    setImportando(false);
    if (!resultado.ok) {
      const mensagem = MENSAGENS_DE_ERRO[resultado.motivo];
      if (mensagem) setErro(mensagem);
      return;
    }
    recarregar();
    router.push({ pathname: '/leitor', params: { obraId: resultado.obraId } });
  };

  const aoTocarObraDoAcervo = async (entrada: ObraDoCatalogo) => {
    setAdicionandoChave(entrada.chave);
    try {
      const obraId = await adicionarDoCatalogo(entrada);
      recarregar();
      router.push({ pathname: '/leitor', params: { obraId } });
    } finally {
      setAdicionandoChave(null);
    }
  };

  if (itens === null || estante === null) {
    return <BwFolha anuncio="Biblioteca" />;
  }

  return (
    <BwFolha anuncio={divisao === 'biblioteca' ? 'Biblioteca' : 'Estante'}>
      <View accessibilityRole="tablist" style={styles.divisorias}>
        {(['biblioteca', 'estante'] as const).map((chave) => {
          const ativo = divisao === chave;
          return (
            <Pressable
              key={chave}
              accessibilityRole="tab"
              accessibilityLabel={chave === 'biblioteca' ? 'Biblioteca' : 'Estante'}
              accessibilityState={{ selected: ativo }}
              onPress={() => setDivisao(chave)}
              style={[styles.divisoria, { borderBottomColor: ativo ? sup.acento : 'transparent' }]}
            >
              <Text
                style={[
                  styles.rotuloDivisoria,
                  {
                    color: ativo ? sup.tinta : sup.tintaFraca,
                    fontFamily: fontFamilyPara('mono', ativo ? '700' : '400'),
                  },
                ]}
              >
                {chave === 'biblioteca' ? 'Biblioteca' : 'Estante'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {divisao === 'biblioteca' ? (
        <>
          {itens.length === 0 ? (
            <View style={styles.vazio}>
              <BwVazio
                titulo="Sua biblioteca está vazia"
                explicacao="Importe um EPUB ou escolha uma obra do acervo abaixo para começar."
              />
              <BwImportar
                estado={importando ? 'carregando' : erro ? 'erro' : 'repouso'}
                mensagemDeErro={erro ?? undefined}
                aoTocar={aoTocarImportar}
              />
            </View>
          ) : (
            <>
              <BwImportar
                estado={importando ? 'carregando' : erro ? 'erro' : 'repouso'}
                mensagemDeErro={erro ?? undefined}
                aoTocar={aoTocarImportar}
              />
              {itens.map((item) => (
                <BwItem
                  key={item.itemId}
                  titulo={item.titulo}
                  subtitulo={item.autor ?? undefined}
                  aoTocar={() =>
                    router.push({ pathname: '/leitor', params: { obraId: item.obraId } })
                  }
                />
              ))}
            </>
          )}

          {acervoDisponivel.length > 0 && (
            <View style={styles.secaoAcervo}>
              <Text style={[styles.tituloSecao, { color: sup.tintaFraca }]}>
                Acervo de domínio público
              </Text>
              {acervoDisponivel.map((entrada) => (
                <BwItem
                  key={entrada.chave}
                  titulo={entrada.titulo}
                  subtitulo={
                    adicionandoChave === entrada.chave
                      ? 'Adicionando…'
                      : `${entrada.autor} · grátis`
                  }
                  aoTocar={() => {
                    if (!adicionandoChave) void aoTocarObraDoAcervo(entrada);
                  }}
                />
              ))}
            </View>
          )}
        </>
      ) : estante.length === 0 ? (
        <View style={styles.vazio}>
          <BwVazio
            titulo="Sua estante ainda não tem nenhum livro"
            explicacao="Termine uma leitura na Biblioteca para começar a preenchê-la."
          />
        </View>
      ) : (
        estante.map((item) => (
          <BwItem
            key={item.itemId}
            titulo={item.titulo}
            subtitulo={`${item.autor ? `${item.autor} · ` : ''}concluída em ${FORMATADOR_DATA.format(item.estanteDesde)}`}
            aoTocar={() => router.push({ pathname: '/leitor', params: { obraId: item.obraId } })}
          />
        ))
      )}
    </BwFolha>
  );
}

const styles = StyleSheet.create({
  divisorias: { flexDirection: 'row', marginBottom: 9 },
  divisoria: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
  },
  rotuloDivisoria: { fontSize: 10.5, letterSpacing: 0.2, textTransform: 'uppercase' },
  vazio: { padding: 18, gap: 18 },
  secaoAcervo: { marginTop: 27 },
  tituloSecao: {
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    paddingHorizontal: 18,
    paddingBottom: 9,
    fontFamily: fontFamilyPara('mono', '400'),
  },
});
