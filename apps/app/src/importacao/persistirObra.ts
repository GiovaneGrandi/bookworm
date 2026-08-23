// Núcleo compartilhado entre a importação do usuário (`importarObra.ts`) e a adição de uma obra
// do acervo embarcado (`catalogo.ts`): as duas terminam no mesmo par de linhas (`obra` +
// `item_biblioteca`), só a origem e a privacidade mudam (RN-02.1d). RN-ST.8: o índice de
// caracteres é montado aqui, uma vez, e persistido.
import { type IndiceDeCaracteres, montarIndiceEpub } from '@bookworm/core/src/indice/index.js';
import { criarUlid } from '@bookworm/core/src/ulid.js';
import { itemBiblioteca, obra as tabelaObra, USUARIO_LOCAL } from '@bookworm/db';
import { Directory, File, Paths } from 'expo-file-system';
import { abrirBanco } from '../persistencia/db.js';

export async function persistirObraEpub(params: {
  bytes: Uint8Array;
  titulo: string;
  autor?: string;
  origem: 'importada' | 'dominio_publico';
  /** RN-02.1d — obra importada é sempre privada; obra do acervo embarcado nunca é. */
  privada: boolean;
}): Promise<string> {
  const indice: IndiceDeCaracteres = montarIndiceEpub(params.bytes);

  const id = criarUlid();
  const diretorioObras = new Directory(Paths.document, 'obras');
  if (!diretorioObras.exists) diretorioObras.create({ intermediates: true });
  const destino = new File(diretorioObras, `${id}.epub`);
  destino.write(params.bytes);

  const agora = new Date();
  const db = abrirBanco();
  await db.insert(tabelaObra).values({
    id,
    titulo: params.titulo,
    autor: params.autor,
    formato: 'epub',
    origem: params.origem,
    privada: params.privada,
    caminhoArquivo: destino.uri,
    indiceCaracteres: indice,
    criadaEm: agora,
  });
  await db.insert(itemBiblioteca).values({
    id: criarUlid(),
    usuarioId: USUARIO_LOCAL,
    obraId: id,
    // RN-02.6 — a transição para "lendo" é automática só na primeira sessão; a obra recém
    // adicionada começa como intenção de leitura, não leitura em curso.
    estado: 'quero_ler',
    estanteDesde: null,
    adicionadoEm: agora,
    atualizadoEm: agora,
  });

  return id;
}
