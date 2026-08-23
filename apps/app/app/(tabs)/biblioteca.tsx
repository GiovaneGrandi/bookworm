// Biblioteca — backlog em leitura (RN-02.6a: lendo, quero_ler, em_pausa). Estante (obras
// concluídas) é tela própria (RN-02.22a), ainda não construída nesta rodada.
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { type ItemDaBiblioteca, listarBiblioteca } from '../../src/biblioteca/consultas.js';
import { BwFolha, BwImportar, BwItem, BwVazio } from '../../src/componentes/index.js';
import { importarObra, type ResultadoImportacao } from '../../src/importacao/importarObra.js';

const MENSAGENS_DE_ERRO: Record<Exclude<ResultadoImportacao, { ok: true }>['motivo'], string> = {
  cancelado: '',
  formato_nao_suportado: 'Só EPUB é aceito nesta versão.',
  pdf_nao_suportado: 'PDF ainda não é aceito nesta versão.',
  epub_invalido: 'Este arquivo não é um EPUB válido.',
};

export default function TelaBiblioteca() {
  const [itens, setItens] = useState<ItemDaBiblioteca[] | null>(null);
  const [importando, setImportando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    void listarBiblioteca().then(setItens);
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

  if (itens === null) {
    return <BwFolha anuncio="Biblioteca" />;
  }

  if (itens.length === 0) {
    return (
      <BwFolha anuncio="Biblioteca">
        <View style={styles.vazio}>
          <BwVazio
            titulo="Sua biblioteca está vazia"
            explicacao="Importe um EPUB para começar. O acervo de domínio público entra numa rodada seguinte."
          />
          <BwImportar
            estado={importando ? 'carregando' : erro ? 'erro' : 'repouso'}
            mensagemDeErro={erro ?? undefined}
            aoTocar={aoTocarImportar}
          />
        </View>
      </BwFolha>
    );
  }

  return (
    <BwFolha anuncio="Biblioteca">
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
    </BwFolha>
  );
}

const styles = StyleSheet.create({
  vazio: { padding: 18, gap: 18 },
});
