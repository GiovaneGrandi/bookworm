import { strFromU8, unzipSync } from 'fflate';
import { Parser } from 'htmlparser2';
import { extrairTextoXhtml } from './extrairTextoXhtml.js';
import type { IndiceDeCaracteres, RecursoIndexado } from './tipos.js';

// RN-02.10: o total exclui capa, ficha catalográfica, sumário e páginas de crédito. O EPUB
// identifica essas páginas pelo <guide> do OPF (mecanismo padrão EPUB2/3-compat) — os tipos
// abaixo são os que a regra nomeia explicitamente. Sem <guide>, nada é excluído por este
// mecanismo (não inventar exclusão que a spec não pediu).
const TIPOS_DE_GUIA_EXCLUIDOS = new Set([
  'cover',
  'title-page',
  'toc',
  'copyright-page',
  'acknowledgements',
  'colophon',
]);

type ItemManifesto = { href: string; mediaType: string };

function juntarCaminho(base: string, relativo: string): string {
  if (relativo.startsWith('/')) return relativo.slice(1);
  const partesBase = base ? base.split('/') : [];
  partesBase.pop(); // remove o nome do próprio arquivo OPF
  const partesRelativas = relativo.split('/');
  for (const parte of partesRelativas) {
    if (parte === '.' || parte === '') continue;
    if (parte === '..') partesBase.pop();
    else partesBase.push(parte);
  }
  return partesBase.join('/');
}

function semFragmento(href: string): string {
  const indice = href.indexOf('#');
  return indice === -1 ? href : href.slice(0, indice);
}

function lerAtributos(xml: string, tag: string): Record<string, string>[] {
  const resultado: Record<string, string>[] = [];
  const parser = new Parser(
    {
      onopentag(nome, atributos) {
        if (nome === tag) resultado.push({ ...atributos });
      },
    },
    { xmlMode: true }
  );
  parser.write(xml);
  parser.end();
  return resultado;
}

// Assinatura pura: recebe os bytes do .epub já lidos, devolve o índice. Nenhum I/O aqui —
// quem chama decide de onde vêm os bytes (RN-ST.8: uma vez, na importação).
export function montarIndiceEpub(arquivo: Uint8Array): IndiceDeCaracteres {
  const arquivos = unzipSync(arquivo);

  const bytesContainer = arquivos['META-INF/container.xml'];
  if (!bytesContainer) throw new Error('EPUB inválido: META-INF/container.xml ausente');
  const containerXml = strFromU8(bytesContainer);
  const rootfiles = lerAtributos(containerXml, 'rootfile');
  const caminhoOpf = rootfiles[0]?.['full-path'];
  if (!caminhoOpf) throw new Error('EPUB inválido: container.xml sem rootfile');

  const bytesOpf = arquivos[caminhoOpf];
  if (!bytesOpf)
    throw new Error(`EPUB inválido: OPF "${caminhoOpf}" referenciado, mas ausente do zip`);
  const opfXml = strFromU8(bytesOpf);

  const itensManifesto = lerAtributos(opfXml, 'item');
  const manifesto = new Map<string, ItemManifesto>();
  for (const item of itensManifesto) {
    if (item.id && item.href) {
      manifesto.set(item.id, {
        href: juntarCaminho(caminhoOpf, item.href),
        mediaType: item['media-type'] ?? '',
      });
    }
  }

  const itensSpine = lerAtributos(opfXml, 'itemref');
  const referenciasGuia = lerAtributos(opfXml, 'reference');

  const hrefsExcluidosPelaGuia = new Set(
    referenciasGuia
      .filter((r) => r.type && TIPOS_DE_GUIA_EXCLUIDOS.has(r.type))
      .map((r) => semFragmento(juntarCaminho(caminhoOpf, r.href ?? '')))
  );

  const recursos: RecursoIndexado[] = [];
  let offset = 0;

  for (const itemref of itensSpine) {
    if (itemref.linear === 'no') continue;
    const item = itemref.idref ? manifesto.get(itemref.idref) : undefined;
    if (!item) continue;
    if (!/xhtml|html/.test(item.mediaType)) continue;
    if (hrefsExcluidosPelaGuia.has(semFragmento(item.href))) continue;

    const conteudo = arquivos[item.href];
    if (!conteudo) continue;
    const texto = extrairTextoXhtml(strFromU8(conteudo));
    const comprimento = texto.length;

    recursos.push({ href: item.href, offset, comprimento });
    offset += comprimento;
  }

  return { recursos, total: offset };
}
