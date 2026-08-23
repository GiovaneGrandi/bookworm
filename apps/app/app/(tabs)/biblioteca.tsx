// Biblioteca — backlog em leitura (RN-02.6a: lendo, quero_ler, em_pausa) + acervo de domínio
// público embarcado (RN-02.3: obra gratuita entra na biblioteca em um toque). Estante (obras
// concluídas) é tela própria (RN-02.22a), ainda não construída nesta rodada.
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  type ItemDaBiblioteca,
  listarBiblioteca,
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

const MENSAGENS_DE_ERRO: Record<Exclude<ResultadoImportacao, { ok: true }>['motivo'], string> = {
  cancelado: '',
  formato_nao_suportado: 'Só EPUB é aceito nesta versão.',
  pdf_nao_suportado: 'PDF ainda não é aceito nesta versão.',
  epub_invalido: 'Este arquivo não é um EPUB válido.',
};

export default function TelaBiblioteca() {
  const sup = useSuperficie('papel');
  const [itens, setItens] = useState<ItemDaBiblioteca[] | null>(null);
  const [acervoDisponivel, setAcervoDisponivel] = useState<ObraDoCatalogo[]>([]);
  const [importando, setImportando] = useState(false);
  const [adicionandoChave, setAdicionandoChave] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    void Promise.all([listarBiblioteca(), tituloJaNoAcervoDaBiblioteca()]).then(
      ([lista, jaAdicionados]) => {
        setItens(lista);
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

  if (itens === null) {
    return <BwFolha anuncio="Biblioteca" />;
  }

  return (
    <BwFolha anuncio="Biblioteca">
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
              aoTocar={() => router.push({ pathname: '/leitor', params: { obraId: item.obraId } })}
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
                adicionandoChave === entrada.chave ? 'Adicionando…' : `${entrada.autor} · grátis`
              }
              aoTocar={() => {
                if (!adicionandoChave) void aoTocarObraDoAcervo(entrada);
              }}
            />
          ))}
        </View>
      )}
    </BwFolha>
  );
}

const styles = StyleSheet.create({
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
