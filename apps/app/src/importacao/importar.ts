import {
  detectarFormato,
  ErroEpub,
  type Formato,
  gerarUlid,
  type IndiceEpub,
  montarIndiceEpub,
  tituloCurto,
} from '@bookworm/core';
import { Asset } from 'expo-asset';
import { getDocumentAsync } from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { inserirObra, obraDoAcervo } from '../dados/obras';
import type { ItemAcervo } from './acervo';

export type MotivoRecusa = 'drm' | 'formato' | 'ilegivel';

export type Resultado =
  | {
      tipo: 'importada';
      obraId: string;
      titulo: string;
      formato: Formato;
      nomeArquivo: string;
      tamanho: number;
    }
  | { tipo: 'ja_na_gaveta'; obraId: string; titulo: string }
  | { tipo: 'recusada'; motivo: MotivoRecusa; nomeArquivo: string };

/** Deixa a interface desenhar o estado "carregando" antes do trabalho síncrono do índice. */
const umQuadro = () => new Promise((fim) => setTimeout(fim, 32));

function pastaDeObras(): Directory {
  const pasta = new Directory(Paths.document, 'obras');
  if (!pasta.exists) pasta.create({ intermediates: true });
  return pasta;
}

function semExtensao(nome: string): string {
  return nome.replace(/\.(epub|pdf)$/i, '');
}

async function importarBytes(
  bytes: Uint8Array,
  nomeArquivo: string,
  origem: 'importada' | 'dominio_publico',
  chaveAcervo: string | null
): Promise<Resultado> {
  await umQuadro();
  const formato = detectarFormato(bytes);
  if (!formato) return { tipo: 'recusada', motivo: 'formato', nomeArquivo };

  let indice: IndiceEpub | null = null;
  if (formato === 'epub') {
    try {
      indice = montarIndiceEpub(bytes);
    } catch (e) {
      const motivo = e instanceof ErroEpub && e.motivo === 'drm' ? 'drm' : 'ilegivel';
      return { tipo: 'recusada', motivo, nomeArquivo };
    }
  }
  // PDF entra como fotocópia, sem índice de caracteres (Q5).

  const agora = Date.now();
  const id = gerarUlid(agora, Math.random);
  const destino = new File(pastaDeObras(), `${id}.${formato}`);
  destino.write(bytes);

  const titulo = tituloCurto(indice?.metadados.titulo ?? semExtensao(nomeArquivo));
  inserirObra(
    {
      id,
      titulo,
      autor: indice?.metadados.autor ?? null,
      idioma: indice?.metadados.idioma ?? null,
      formato,
      origem,
      chaveAcervo,
      nomeArquivo,
      caminho: destino.uri,
      tamanho: bytes.byteLength,
      estado: 'quero_ler',
      importadoEm: agora,
      totalCaracteres: indice?.total ?? null,
    },
    indice
  );
  return { tipo: 'importada', obraId: id, titulo, formato, nomeArquivo, tamanho: bytes.byteLength };
}

/** Seletor de arquivos do aparelho. Devolve null se a pessoa desistir. */
export async function importarDoAparelho(): Promise<Resultado | null> {
  const escolha = await getDocumentAsync({
    type: ['application/epub+zip', 'application/pdf'],
    copyToCacheDirectory: true,
    multiple: false,
  });
  const arquivo = escolha.canceled ? undefined : escolha.assets[0];
  if (!arquivo) return null;
  const temporario = new File(arquivo.uri);
  try {
    const bytes = await temporario.bytes();
    return await importarBytes(bytes, arquivo.name, 'importada', null);
  } finally {
    if (temporario.exists) temporario.delete();
  }
}

export async function importarDoAcervo(item: ItemAcervo): Promise<Resultado> {
  const existente = obraDoAcervo(item.chave);
  if (existente) return { tipo: 'ja_na_gaveta', obraId: existente.id, titulo: existente.titulo };
  const asset = Asset.fromModule(item.modulo);
  await asset.downloadAsync();
  if (!asset.localUri) throw new Error(`Acervo sem arquivo local: ${item.arquivo}`);
  const bytes = await new File(asset.localUri).bytes();
  return importarBytes(bytes, item.arquivo, 'dominio_publico', item.chave);
}
