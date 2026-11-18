import { strFromU8, unzipSync } from 'fflate';
import { Parser } from 'htmlparser2';

// Índice de caracteres de uma obra EPUB (RN-02.10, RN-03.2, RN-ST.8, stack.md §6).
// Função pura: recebe os bytes do arquivo e devolve um dado serializável, gerado uma vez na
// importação e persistido. A posição de leitura sai daqui sem reler o arquivo.

export type RecursoIndice = {
  /** Caminho do recurso a partir da raiz do zip, decodificado e sem fragmento. */
  href: string;
  /** Offset cumulativo, em caracteres do conteúdo principal, onde o recurso começa. */
  inicio: number;
  /** Caracteres com espaços (RN-03.2) que o recurso contribui. Zero se excluído. */
  caracteres: number;
  /** Se o recurso conta como conteúdo principal (RN-02.10). */
  incluido: boolean;
};

export type MetadadosEpub = {
  titulo: string | null;
  autor: string | null;
  idioma: string | null;
};

export type IndiceEpub = {
  metadados: MetadadosEpub;
  recursos: RecursoIndice[];
  total: number;
  /** Começo do texto contado, para conferência (ex.: a licença do Gutenberg não entra). */
  amostraInicial: string;
};

export type MotivoErroEpub = 'nao_e_zip' | 'sem_container' | 'sem_opf' | 'sem_espinha' | 'drm';

export class ErroEpub extends Error {
  constructor(
    readonly motivo: MotivoErroEpub,
    detalhe?: string
  ) {
    super(detalhe ? `${motivo}: ${detalhe}` : motivo);
    this.name = 'ErroEpub';
  }
}

// O que não é conteúdo principal (RN-02.10): capa, ficha catalográfica, sumário e créditos.
// Vocabulário do EPUB 3 (epub:type), do EPUB 2 (<guide>) e do DPUB-ARIA (role="doc-*").
const TIPOS_EXCLUIDOS = new Set([
  'cover',
  'toc',
  'copyright-page',
  'colophon',
  'credits',
  'imprint',
  'landmarks',
]);
const PAPEIS_EXCLUIDOS = new Set(['doc-cover', 'doc-toc', 'doc-colophon', 'doc-credits']);
// O Project Gutenberg marca a licença e a ficha técnica que abrem e fecham toda obra.
const CLASSES_EXCLUIDAS = new Set(['pg-boilerplate']);
const SEM_TEXTO = new Set(['script', 'style', 'head', 'title']);
const BLOCOS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'br',
  'dd',
  'div',
  'dl',
  'dt',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'td',
  'th',
  'tr',
  'ul',
]);
// Ofuscação de fonte não é DRM: o texto continua legível.
const OFUSCACAO_DE_FONTE = new Set([
  'http://www.idpf.org/2008/embedding',
  'http://ns.adobe.com/pdf/enc#RC',
]);

type Elemento = { nome: string; attrs: Record<string, string>; texto: string };

/** Lista plana de elementos de um XML, com o texto direto de cada um. */
function elementosXml(xml: string): Elemento[] {
  const todos: Elemento[] = [];
  const pilha: Elemento[] = [];
  const parser = new Parser(
    {
      onopentag(nome, attrs) {
        const el = { nome: localDe(nome), attrs, texto: '' };
        todos.push(el);
        pilha.push(el);
      },
      ontext(texto) {
        const topo = pilha[pilha.length - 1];
        if (topo) topo.texto += texto;
      },
      onclosetag() {
        pilha.pop();
      },
    },
    { xmlMode: true, decodeEntities: true }
  );
  parser.write(xml);
  parser.end();
  return todos;
}

function localDe(nome: string): string {
  const i = nome.indexOf(':');
  return (i >= 0 ? nome.slice(i + 1) : nome).toLowerCase();
}

function tokens(valor: string | undefined): string[] {
  return valor ? valor.split(/\s+/).filter(Boolean) : [];
}

function diretorioDe(caminho: string): string {
  const i = caminho.lastIndexOf('/');
  return i >= 0 ? caminho.slice(0, i + 1) : '';
}

/** Resolve um href relativo a um diretório, sem fragmento, normalizado e decodificado. */
function resolver(base: string, href: string): string {
  const semFragmento = href.split('#')[0] ?? '';
  const partes: string[] = [];
  for (const parte of `${base}${semFragmento}`.split('/')) {
    if (parte === '..') partes.pop();
    else if (parte !== '.' && parte !== '') partes.push(parte);
  }
  const caminho = partes.join('/');
  try {
    return decodeURIComponent(caminho);
  } catch {
    return caminho;
  }
}

/** Normaliza um href como vem num locator do leitor: sem barra inicial e sem fragmento. */
export function normalizarHref(href: string): string {
  return resolver('', href);
}

function descompactar(bytes: Uint8Array, quer: (nome: string) => boolean) {
  try {
    return unzipSync(bytes, { filter: (f) => quer(f.name) });
  } catch (e) {
    throw new ErroEpub('nao_e_zip', String(e));
  }
}

function lerTexto(arquivos: Record<string, Uint8Array>, caminho: string): string | undefined {
  const bytes = arquivos[caminho];
  return bytes ? strFromU8(bytes) : undefined;
}

function verificarDrm(xml: string | undefined, temRights: boolean) {
  if (temRights) throw new ErroEpub('drm', 'META-INF/rights.xml');
  if (!xml) return;
  let algoritmo = '';
  for (const el of elementosXml(xml)) {
    if (el.nome === 'encrypteddata') algoritmo = '';
    if (el.nome === 'encryptionmethod') algoritmo = el.attrs.Algorithm ?? el.attrs.algorithm ?? '';
    if (el.nome === 'cipherreference' && !OFUSCACAO_DE_FONTE.has(algoritmo)) {
      throw new ErroEpub('drm', el.attrs.URI ?? el.attrs.uri);
    }
  }
}

/** Texto do corpo de um XHTML, sem o que não é conteúdo principal, e se o body inteiro caiu. */
function textoDoCorpo(xhtml: string): string {
  let texto = '';
  let dentroDoBody = false;
  // Pilha paralela às tags abertas: true se a tag (ou um ancestral) é excluída.
  const excluida: boolean[] = [];

  const parser = new Parser(
    {
      onopentag(nome, attrs) {
        const pai = excluida[excluida.length - 1] ?? false;
        if (nome === 'body') dentroDoBody = true;
        const fora =
          pai ||
          SEM_TEXTO.has(nome) ||
          tokens(attrs['epub:type']).some((t) => TIPOS_EXCLUIDOS.has(t)) ||
          tokens(attrs.role).some((t) => PAPEIS_EXCLUIDOS.has(t)) ||
          tokens(attrs.class).some((t) => CLASSES_EXCLUIDAS.has(t));
        excluida.push(fora);
        if (BLOCOS.has(nome)) texto += ' ';
      },
      ontext(trecho) {
        if (dentroDoBody && !excluida[excluida.length - 1]) texto += trecho;
      },
      onclosetag(nome) {
        excluida.pop();
        if (BLOCOS.has(nome)) texto += ' ';
        if (nome === 'body') dentroDoBody = false;
      },
    },
    { decodeEntities: true, recognizeSelfClosing: true, lowerCaseTags: true }
  );
  parser.write(xhtml);
  parser.end();
  return texto.replace(/\s+/g, ' ').trim();
}

/** Caracteres com espaços (RN-03.2), contando pontos de código, não unidades UTF-16. */
function contar(texto: string): number {
  let n = 0;
  for (const _ of texto) n++;
  return n;
}

export function montarIndiceEpub(bytes: Uint8Array): IndiceEpub {
  // 1ª passada: só o que diz onde está o resto.
  const nomes: string[] = [];
  const meta = descompactar(bytes, (nome) => {
    nomes.push(nome);
    return nome === 'META-INF/container.xml' || nome === 'META-INF/encryption.xml';
  });
  verificarDrm(lerTexto(meta, 'META-INF/encryption.xml'), nomes.includes('META-INF/rights.xml'));

  const container = lerTexto(meta, 'META-INF/container.xml');
  if (!container) throw new ErroEpub('sem_container');
  const rootfile = elementosXml(container).find((e) => e.nome === 'rootfile');
  const caminhoOpf = rootfile?.attrs['full-path'];
  if (!caminhoOpf) throw new ErroEpub('sem_opf');

  const opfBytes = descompactar(bytes, (nome) => nome === caminhoOpf);
  const opf = lerTexto(opfBytes, caminhoOpf);
  if (!opf) throw new ErroEpub('sem_opf', caminhoOpf);
  const dirOpf = diretorioDe(caminhoOpf);
  const elementos = elementosXml(opf);

  const primeiro = (nome: string) => elementos.find((e) => e.nome === nome)?.texto.trim() || null;
  const autores = elementos
    .filter((e) => e.nome === 'creator')
    .map((e) => e.texto.trim())
    .filter(Boolean);
  const metadados: MetadadosEpub = {
    titulo: primeiro('title'),
    autor: autores.length ? autores.join(', ') : null,
    idioma: primeiro('language'),
  };

  const manifesto = new Map<string, { href: string; properties: string[] }>();
  for (const el of elementos) {
    if (el.nome === 'item' && el.attrs.id && el.attrs.href) {
      manifesto.set(el.attrs.id, {
        href: el.attrs.href,
        properties: tokens(el.attrs.properties),
      });
    }
  }

  const espinha = elementos
    .filter((e) => e.nome === 'itemref' && e.attrs.idref)
    .map((e) => ({ item: manifesto.get(e.attrs.idref ?? ''), linear: e.attrs.linear }))
    .filter(
      (r): r is { item: { href: string; properties: string[] }; linear: string | undefined } =>
        Boolean(r.item)
    );
  if (espinha.length === 0) throw new ErroEpub('sem_espinha');

  // Recursos excluídos por inteiro: <guide> do EPUB 2 e, mais abaixo, landmarks do nav.
  const excluidos = new Set<string>();
  for (const el of elementos) {
    if (el.nome === 'reference' && el.attrs.href && TIPOS_EXCLUIDOS.has(el.attrs.type ?? '')) {
      excluidos.add(resolver(dirOpf, el.attrs.href));
    }
  }

  const nav = [...manifesto.values()].find((i) => i.properties.includes('nav'));
  const caminhoNav = nav ? resolver(dirOpf, nav.href) : null;
  const caminhos = espinha.map((r) => resolver(dirOpf, r.item.href));
  const brutos = espinha.map((r) => `${dirOpf}${r.item.href}`.split('#')[0] ?? '');
  const queridos = new Set([...caminhos, ...brutos, ...(caminhoNav ? [caminhoNav] : [])]);
  const arquivos = descompactar(bytes, (nome) => queridos.has(nome));

  if (caminhoNav) {
    const xmlNav = lerTexto(arquivos, caminhoNav);
    if (xmlNav) {
      let emLandmarks = 0;
      const parser = new Parser(
        {
          onopentag(nome, attrs) {
            if (nome === 'nav') {
              emLandmarks = tokens(attrs['epub:type']).includes('landmarks')
                ? 1
                : emLandmarks
                  ? emLandmarks + 1
                  : 0;
            }
            if (emLandmarks && nome === 'a' && attrs.href) {
              if (tokens(attrs['epub:type']).some((t) => TIPOS_EXCLUIDOS.has(t))) {
                excluidos.add(resolver(diretorioDe(caminhoNav), attrs.href));
              }
            }
          },
          onclosetag(nome) {
            if (nome === 'nav' && emLandmarks) emLandmarks--;
          },
        },
        { decodeEntities: true, recognizeSelfClosing: true }
      );
      parser.write(xmlNav);
      parser.end();
    }
  }

  const recursos: RecursoIndice[] = [];
  let total = 0;
  let amostra = '';
  espinha.forEach((r, i) => {
    const href = caminhos[i] ?? '';
    const foraPorRecurso =
      r.linear === 'no' || r.item.properties.includes('nav') || excluidos.has(href);
    const xhtml = lerTexto(arquivos, href) ?? lerTexto(arquivos, brutos[i] ?? '');
    const texto = foraPorRecurso || !xhtml ? '' : textoDoCorpo(xhtml);
    const caracteres = contar(texto);
    if (caracteres > 0 && amostra.length < 280)
      amostra = `${amostra} ${texto}`.trim().slice(0, 280);
    recursos.push({ href, inicio: total, caracteres, incluido: caracteres > 0 });
    total += caracteres;
  });

  return { metadados, recursos, total, amostraInicial: amostra };
}
