// Estágio 7 passo 1 — importação (`bw-importar`). RN-ST.8: o índice de caracteres é montado uma
// única vez, aqui, e persistido — nunca recalculado a cada leitura. RN-02.1d: obra importada é
// sempre privada. RN-02.1e: não gera moeda por conclusão (decisão de `07`, não deste arquivo).
//
// PDF (`Q-ST.8`/`Q-ST.8a`, specs/medicao-app-de-prova.md §2): a extração de texto via Readium não
// se mostrou confiável, e `stack.md` §6 recomenda `pdfjs-dist` como pipeline primário — mas
// `pdfjs-dist` espera um ambiente com `DOMMatrix`/Web Worker que o Hermes não tem prontos, e
// resolver isso é trabalho de integração próprio, não coberto nesta rodada (fundação:
// Readium + import + leitor mínimo). Por ora, PDF é recusado explicitamente na importação — a
// própria RN-TEL.27 já prevê essa saída ("a importação recusa o arquivo") — em vez de fingir
// suporte e falhar silenciosamente depois. Reabrir junto de `Q-ST.8a`.
import { type IndiceDeCaracteres, montarIndiceEpub } from '@bookworm/core/src/indice/index.js';
import { criarUlid } from '@bookworm/core/src/ulid.js';
import { itemBiblioteca, obra as tabelaObra, USUARIO_LOCAL } from '@bookworm/db';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { abrirBanco } from '../persistencia/db.js';

export type ResultadoImportacao =
  | { ok: true; obraId: string }
  | {
      ok: false;
      motivo: 'cancelado' | 'formato_nao_suportado' | 'pdf_nao_suportado' | 'epub_invalido';
      detalhe?: string;
    };

const TIPOS_ACEITOS = ['application/epub+zip', 'application/pdf'];

function detectarFormato(nome: string, mimeType: string | undefined | null): 'epub' | 'pdf' | null {
  if (mimeType === 'application/epub+zip' || /\.epub$/i.test(nome)) return 'epub';
  if (mimeType === 'application/pdf' || /\.pdf$/i.test(nome)) return 'pdf';
  return null;
}

/** RN-02.10 — título de exibição a partir do nome do arquivo, até a obra ganhar metadados reais
 * extraídos do EPUB (Estágio 7, rodada seguinte — capa/ficha/autor). */
function tituloAPartirDoNomeDoArquivo(nome: string): string {
  return nome.replace(/\.(epub|pdf)$/i, '').trim() || 'Sem título';
}

export async function importarObra(): Promise<ResultadoImportacao> {
  const escolha = await DocumentPicker.getDocumentAsync({
    type: TIPOS_ACEITOS,
    copyToCacheDirectory: true,
  });
  if (escolha.canceled) return { ok: false, motivo: 'cancelado' };

  const asset = escolha.assets[0];
  if (!asset) return { ok: false, motivo: 'cancelado' };

  const formato = detectarFormato(asset.name, asset.mimeType);
  if (formato === 'pdf') return { ok: false, motivo: 'pdf_nao_suportado' };
  if (formato !== 'epub') return { ok: false, motivo: 'formato_nao_suportado' };

  const origem = new File(asset.uri);
  const bytes = await origem.bytes();

  let indice: IndiceDeCaracteres;
  try {
    indice = montarIndiceEpub(bytes);
  } catch (erro) {
    return { ok: false, motivo: 'epub_invalido', detalhe: String(erro) };
  }

  const id = criarUlid();
  const diretorioObras = new Directory(Paths.document, 'obras');
  if (!diretorioObras.exists) diretorioObras.create({ intermediates: true });
  const destino = new File(diretorioObras, `${id}.epub`);
  destino.write(bytes);

  const agora = new Date();
  const db = abrirBanco();
  await db.insert(tabelaObra).values({
    id,
    titulo: tituloAPartirDoNomeDoArquivo(asset.name),
    formato: 'epub',
    // RN-02.1 — toda obra importada pelo usuário é origem "importada"; o acervo de domínio
    // público embarcado (passo 2 do plano) entra por um caminho de importação próprio, ainda não
    // construído nesta rodada.
    origem: 'importada',
    // RN-02.1d — obra importada é privada por definição, não uma escolha do usuário.
    privada: true,
    caminhoArquivo: destino.uri,
    indiceCaracteres: indice,
    criadaEm: agora,
  });
  await db.insert(itemBiblioteca).values({
    id: criarUlid(),
    usuarioId: USUARIO_LOCAL,
    obraId: id,
    // RN-02.6 — a transição para "lendo" é automática só na primeira sessão; a obra recém
    // importada começa como intenção de leitura, não leitura em curso.
    estado: 'quero_ler',
    estanteDesde: null,
    adicionadoEm: agora,
    atualizadoEm: agora,
  });

  return { ok: true, obraId: id };
}
