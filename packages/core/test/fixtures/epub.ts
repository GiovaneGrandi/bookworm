import { strToU8, zipSync } from 'fflate';

// Monta EPUBs pequenos em memória para os testes do índice. Cada recurso é um XHTML com o
// corpo dado; o OPF declara a espinha na ordem recebida.

export type RecursoFixture = {
  id: string;
  href: string;
  corpo: string;
  linear?: 'no';
  properties?: string;
  /** Se ausente da espinha (ex.: o nav). */
  foraDaEspinha?: boolean;
  atributosBody?: string;
};

export type OpcoesFixture = {
  titulo?: string;
  autores?: string[];
  idioma?: string;
  recursos: RecursoFixture[];
  guide?: string;
  /** Diretório do OPF dentro do zip. */
  dirOpf?: string;
  extras?: Record<string, string>;
  semContainer?: boolean;
};

export function xhtml(corpo: string, atributosBody = ''): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>t</title><style>p { margin: 0 }</style></head>
<body ${atributosBody}>${corpo}</body>
</html>`;
}

export function criarEpub(op: OpcoesFixture): Uint8Array {
  const dir = op.dirOpf ?? 'OEBPS';
  const prefixo = dir ? `${dir}/` : '';
  const metadados = [
    op.titulo !== undefined ? `<dc:title>${op.titulo}</dc:title>` : '',
    ...(op.autores ?? []).map((a) => `<dc:creator>${a}</dc:creator>`),
    op.idioma ? `<dc:language>${op.idioma}</dc:language>` : '',
  ].join('\n');
  const manifesto = op.recursos
    .map(
      (r) =>
        `<item id="${r.id}" href="${r.href}" media-type="application/xhtml+xml"${
          r.properties ? ` properties="${r.properties}"` : ''
        }/>`
    )
    .join('\n');
  const espinha = op.recursos
    .filter((r) => !r.foraDaEspinha)
    .map((r) => `<itemref idref="${r.id}"${r.linear ? ` linear="${r.linear}"` : ''}/>`)
    .join('\n');
  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">${metadados}</metadata>
<manifest>${manifesto}</manifest>
<spine>${espinha}</spine>
${op.guide ?? ''}
</package>`;

  const arquivos: Record<string, Uint8Array> = {
    mimetype: strToU8('application/epub+zip'),
    [`${prefixo}content.opf`]: strToU8(opf),
  };
  if (!op.semContainer) {
    arquivos['META-INF/container.xml'] = strToU8(`<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="${prefixo}content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`);
  }
  for (const r of op.recursos) {
    arquivos[`${prefixo}${r.href}`] = strToU8(xhtml(r.corpo, r.atributosBody));
  }
  for (const [nome, conteudo] of Object.entries(op.extras ?? {})) {
    arquivos[nome] = strToU8(conteudo);
  }
  return zipSync(arquivos);
}
