// Gera os dois EPUBs de teste (autoria própria — texto placeholder trivial, sem conteúdo de
// terceiros) versionados nesta pasta. Roda uma vez, offline; ver README.md para a procedência.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { strToU8, zipSync } from 'fflate';

const aqui = dirname(fileURLToPath(import.meta.url));

const CONTAINER_XML = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

function xhtml(titulo: string, corpo: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${titulo}</title></head>
<body>${corpo}</body>
</html>`;
}

// --- Fixture 1: com capa, sumário e página de créditos (exercita RN-02.10) ---
function gerarObraComSumarioECreditos() {
  const capa = xhtml('Capa', '<h1>Obra de Teste</h1>');
  const sumario = xhtml('Sumário', '<h1>Sumário</h1><p>Capítulo 1 ... Capítulo 2</p>');
  const capitulo1 = xhtml(
    'Capítulo 1',
    `<h1>Capítulo 1</h1><p>${'Texto do primeiro capítulo. '.repeat(20)}</p>`
  );
  const capitulo2 = xhtml(
    'Capítulo 2',
    '<h1>Capítulo 2</h1><p>' +
      'Texto do segundo capítulo, mais longo que o anterior. '.repeat(20) +
      '</p>'
  );
  const creditos = xhtml(
    'Créditos',
    '<h1>Créditos</h1><p>Ficção de teste, sem direitos de terceiros.</p>'
  );

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Obra de Teste — com sumário e créditos</dc:title>
    <dc:language>pt-BR</dc:language>
    <dc:identifier id="bookid">bookworm-fixture-1</dc:identifier>
  </metadata>
  <manifest>
    <item id="capa" href="capa.xhtml" media-type="application/xhtml+xml"/>
    <item id="sumario" href="sumario.xhtml" media-type="application/xhtml+xml"/>
    <item id="cap1" href="capitulo1.xhtml" media-type="application/xhtml+xml"/>
    <item id="cap2" href="capitulo2.xhtml" media-type="application/xhtml+xml"/>
    <item id="creditos" href="creditos.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="capa"/>
    <itemref idref="sumario"/>
    <itemref idref="cap1"/>
    <itemref idref="cap2"/>
    <itemref idref="creditos"/>
  </spine>
  <guide>
    <reference type="cover" title="Capa" href="capa.xhtml"/>
    <reference type="toc" title="Sumário" href="sumario.xhtml"/>
    <reference type="copyright-page" title="Créditos" href="creditos.xhtml"/>
  </guide>
</package>`;

  const arquivos = {
    mimetype: strToU8('application/epub+zip'),
    'META-INF/container.xml': strToU8(CONTAINER_XML),
    'OEBPS/content.opf': strToU8(opf),
    'OEBPS/capa.xhtml': strToU8(capa),
    'OEBPS/sumario.xhtml': strToU8(sumario),
    'OEBPS/capitulo1.xhtml': strToU8(capitulo1),
    'OEBPS/capitulo2.xhtml': strToU8(capitulo2),
    'OEBPS/creditos.xhtml': strToU8(creditos),
  };

  return zipSync(arquivos, { level: 0 });
}

// --- Fixture 2: obra simples, sem guide, dois capítulos só ---
function gerarObraSimples() {
  const capitulo1 = xhtml(
    'Capítulo 1',
    `<h1>Capítulo 1</h1><p>${'Uma frase simples de teste. '.repeat(15)}</p>`
  );
  const capitulo2 = xhtml(
    'Capítulo 2',
    `<h1>Capítulo 2</h1><p>${'Outra frase simples, um pouco diferente. '.repeat(15)}</p>`
  );

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Obra de Teste — simples</dc:title>
    <dc:language>pt-BR</dc:language>
    <dc:identifier id="bookid">bookworm-fixture-2</dc:identifier>
  </metadata>
  <manifest>
    <item id="cap1" href="capitulo1.xhtml" media-type="application/xhtml+xml"/>
    <item id="cap2" href="capitulo2.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="cap1"/>
    <itemref idref="cap2"/>
  </spine>
</package>`;

  const arquivos = {
    mimetype: strToU8('application/epub+zip'),
    'META-INF/container.xml': strToU8(CONTAINER_XML),
    'OEBPS/content.opf': strToU8(opf),
    'OEBPS/capitulo1.xhtml': strToU8(capitulo1),
    'OEBPS/capitulo2.xhtml': strToU8(capitulo2),
  };

  return zipSync(arquivos, { level: 0 });
}

writeFileSync(join(aqui, 'obra-com-sumario-e-creditos.epub'), gerarObraComSumarioECreditos());
writeFileSync(join(aqui, 'obra-simples.epub'), gerarObraSimples());
console.log('fixtures geradas em', aqui);
