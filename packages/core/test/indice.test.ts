import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import {
  detectarFormato,
  ErroEpub,
  montarIndiceEpub,
  posicaoEmCaracteres,
  progressoPercentual,
} from '../src/index';
import { criarEpub } from './fixtures/epub';

const simples = () =>
  criarEpub({
    titulo: 'Obra simples',
    autores: ['Fulana de Tal'],
    idioma: 'pt-BR',
    recursos: [
      { id: 'c1', href: 'cap1.xhtml', corpo: '<p>Abcde fghij.</p>' }, // 12
      { id: 'c2', href: 'cap2.xhtml', corpo: '<p>Klm.</p>' }, // 4
    ],
  });

describe('RN-02.10 · o índice conta só o conteúdo principal', () => {
  it('soma os caracteres com espaços de cada recurso da espinha, em ordem', () => {
    const indice = montarIndiceEpub(simples());
    expect(indice.recursos.map((r) => [r.href, r.inicio, r.caracteres])).toEqual([
      ['OEBPS/cap1.xhtml', 0, 12],
      ['OEBPS/cap2.xhtml', 12, 4],
    ]);
    expect(indice.total).toBe(16);
  });

  it('colapsa espaço em branco, decodifica entidades e separa blocos com um espaço', () => {
    const epub = criarEpub({
      recursos: [
        {
          id: 'c1',
          href: 'c1.xhtml',
          corpo: '<h1>Cap&iacute;tulo</h1>\n\n  <p>pala<i>vra</i>   &amp;\n outra</p><p>fim</p>',
        },
      ],
    });
    const indice = montarIndiceEpub(epub);
    // "Capítulo palavra & outra fim"
    expect(indice.total).toBe('Capítulo palavra & outra fim'.length);
  });

  it('não conta o <head> (título, estilo) nem texto fora do <body>', () => {
    const indice = montarIndiceEpub(simples());
    expect(indice.recursos[0]?.caracteres).toBe(12);
  });

  it('exclui capa marcada por epub:type, mantendo o recurso no índice com zero caracteres', () => {
    const epub = criarEpub({
      recursos: [
        {
          id: 'capa',
          href: 'capa.xhtml',
          corpo: '<p>CAPA</p>',
          atributosBody: 'epub:type="cover"',
        },
        { id: 'c1', href: 'c1.xhtml', corpo: '<p>Texto.</p>' },
      ],
    });
    const indice = montarIndiceEpub(epub);
    expect(indice.recursos[0]).toMatchObject({
      href: 'OEBPS/capa.xhtml',
      incluido: false,
      caracteres: 0,
    });
    expect(indice.total).toBe(6);
  });

  it('exclui sumário: o documento nav e seções epub:type="toc"', () => {
    const epub = criarEpub({
      recursos: [
        {
          id: 'nav',
          href: 'nav.xhtml',
          corpo: '<nav epub:type="toc"><ol><li>Um</li></ol></nav>',
          properties: 'nav',
        },
        {
          id: 'c1',
          href: 'c1.xhtml',
          corpo: '<section epub:type="toc"><p>Índice</p></section><p>Texto.</p>',
        },
      ],
    });
    const indice = montarIndiceEpub(epub);
    expect(indice.recursos[0]?.incluido).toBe(false);
    expect(indice.total).toBe(6);
  });

  it('exclui ficha catalográfica e créditos (epub:type e papéis DPUB-ARIA)', () => {
    const epub = criarEpub({
      recursos: [
        {
          id: 'c1',
          href: 'c1.xhtml',
          corpo:
            '<section epub:type="frontmatter copyright-page"><p>© 1899</p></section>' +
            '<div role="doc-credits"><p>Revisão: X</p></div>' +
            '<section epub:type="colophon"><p>Composto em Spectral</p></section>' +
            '<p>Texto.</p>',
        },
      ],
    });
    expect(montarIndiceEpub(epub).total).toBe(6);
  });

  it('exclui o cabeçalho e o rodapé de licença do Project Gutenberg (pg-boilerplate)', () => {
    const epub = criarEpub({
      recursos: [
        {
          id: 'c1',
          href: 'c1.xhtml',
          corpo:
            '<header class="pg-boilerplate pgheader" id="pg-header"><p>The Project Gutenberg eBook</p></header>' +
            '<p>Texto.</p>' +
            '<footer class="pg-boilerplate pgheader" id="pg-footer"><p>*** END ***</p></footer>',
        },
      ],
    });
    expect(montarIndiceEpub(epub).total).toBe(6);
  });

  it('exclui itens da espinha com linear="no"', () => {
    const epub = criarEpub({
      recursos: [
        { id: 'n', href: 'nota.xhtml', corpo: '<p>Nota solta</p>', linear: 'no' },
        { id: 'c1', href: 'c1.xhtml', corpo: '<p>Texto.</p>' },
      ],
    });
    const indice = montarIndiceEpub(epub);
    expect(indice.recursos[0]?.incluido).toBe(false);
    expect(indice.total).toBe(6);
  });

  it('exclui capa e sumário apontados pelo <guide> do EPUB 2', () => {
    const epub = criarEpub({
      recursos: [
        { id: 'capa', href: 'capa.xhtml', corpo: '<p>CAPA</p>' },
        { id: 'sum', href: 'sumario.xhtml', corpo: '<p>Sumário</p>' },
        { id: 'c1', href: 'c1.xhtml', corpo: '<p>Texto.</p>' },
      ],
      guide:
        '<guide><reference type="cover" href="capa.xhtml"/><reference type="toc" href="sumario.xhtml#x"/></guide>',
    });
    const indice = montarIndiceEpub(epub);
    expect(indice.recursos.map((r) => r.incluido)).toEqual([false, false, true]);
    expect(indice.total).toBe(6);
  });

  it('exclui recursos apontados pelos landmarks do nav (cover, toc, copyright-page)', () => {
    const epub = criarEpub({
      recursos: [
        {
          id: 'nav',
          href: 'nav.xhtml',
          properties: 'nav',
          foraDaEspinha: true,
          corpo:
            '<nav epub:type="landmarks"><ol>' +
            '<li><a epub:type="copyright-page" href="ficha.xhtml">Ficha</a></li>' +
            '<li><a epub:type="bodymatter" href="c1.xhtml">Início</a></li>' +
            '</ol></nav>',
        },
        { id: 'ficha', href: 'ficha.xhtml', corpo: '<p>Ficha catalográfica</p>' },
        { id: 'c1', href: 'c1.xhtml', corpo: '<p>Texto.</p>' },
      ],
    });
    const indice = montarIndiceEpub(epub);
    expect(indice.recursos.map((r) => r.incluido)).toEqual([false, true]);
  });
});

describe('RN-02.10 · metadados do OPF', () => {
  it('lê título, autores e idioma', () => {
    expect(montarIndiceEpub(simples()).metadados).toEqual({
      titulo: 'Obra simples',
      autor: 'Fulana de Tal',
      idioma: 'pt-BR',
    });
  });

  it('junta vários autores e devolve null no que faltar', () => {
    const epub = criarEpub({
      autores: ['A', 'B'],
      recursos: [{ id: 'c', href: 'c.xhtml', corpo: '<p>x</p>' }],
    });
    expect(montarIndiceEpub(epub).metadados).toEqual({ titulo: null, autor: 'A, B', idioma: null });
  });

  it('resolve o OPF na raiz do zip e hrefs com caminho relativo', () => {
    const epub = criarEpub({
      dirOpf: '',
      recursos: [{ id: 'c', href: 'texto/c%201.xhtml', corpo: '<p>abc</p>' }],
      extras: {},
    });
    // O arquivo foi gravado com o href literal; o índice guarda o caminho decodificado.
    const indice = montarIndiceEpub(epub);
    expect(indice.recursos[0]?.href).toBe('texto/c 1.xhtml');
  });
});

describe('RN-02.10 · arquivos que não são EPUB legível', () => {
  it('recusa bytes que não são zip', () => {
    expect(() => montarIndiceEpub(strToU8('%PDF-1.7 ...'))).toThrow(ErroEpub);
  });

  it('recusa EPUB sem META-INF/container.xml', () => {
    const epub = criarEpub({
      semContainer: true,
      recursos: [{ id: 'c', href: 'c.xhtml', corpo: '<p>x</p>' }],
    });
    expect(() => montarIndiceEpub(epub)).toThrow(
      expect.objectContaining({ motivo: 'sem_container' })
    );
  });

  it('recusa EPUB com DRM (META-INF/encryption.xml cifrando conteúdo)', () => {
    const epub = criarEpub({
      recursos: [{ id: 'c', href: 'c.xhtml', corpo: '<p>x</p>' }],
      extras: {
        'META-INF/encryption.xml':
          '<encryption><EncryptedData><CipherData><CipherReference URI="OEBPS/c.xhtml"/></CipherData></EncryptedData></encryption>',
      },
    });
    expect(() => montarIndiceEpub(epub)).toThrow(expect.objectContaining({ motivo: 'drm' }));
  });

  it('aceita encryption.xml que só ofusca fontes (não é DRM)', () => {
    const epub = criarEpub({
      recursos: [{ id: 'c', href: 'c.xhtml', corpo: '<p>x</p>' }],
      extras: {
        'META-INF/encryption.xml':
          '<encryption><EncryptedData><EncryptionMethod Algorithm="http://www.idpf.org/2008/embedding"/><CipherData><CipherReference URI="OEBPS/f.otf"/></CipherData></EncryptedData></encryption>',
      },
    });
    expect(montarIndiceEpub(epub).total).toBe(1);
  });
});

describe('RN-ST.8 · a posição sai só do índice persistido, sem reler o arquivo', () => {
  const indice = JSON.parse(JSON.stringify(montarIndiceEpub(simples())));

  it('o índice sobrevive a JSON (é o que vai para o banco)', () => {
    expect(indice.total).toBe(16);
  });

  it('posição = início do recurso + progression × caracteres do recurso', () => {
    expect(posicaoEmCaracteres(indice, 'OEBPS/cap1.xhtml', 0)).toBe(0);
    expect(posicaoEmCaracteres(indice, 'OEBPS/cap1.xhtml', 0.5)).toBe(6);
    expect(posicaoEmCaracteres(indice, 'OEBPS/cap2.xhtml', 1)).toBe(16);
  });

  it('aceita href com barra inicial ou fragmento, como vem num locator', () => {
    expect(posicaoEmCaracteres(indice, '/OEBPS/cap2.xhtml#p3', 0)).toBe(12);
  });

  it('prende a progression entre 0 e 1', () => {
    expect(posicaoEmCaracteres(indice, 'OEBPS/cap1.xhtml', 1.7)).toBe(12);
    expect(posicaoEmCaracteres(indice, 'OEBPS/cap1.xhtml', -1)).toBe(0);
  });

  it('href desconhecido não tem posição', () => {
    expect(posicaoEmCaracteres(indice, 'OEBPS/outro.xhtml', 0.3)).toBeNull();
  });

  it('progresso percentual sobre o total do conteúdo principal', () => {
    expect(progressoPercentual(indice, 'OEBPS/cap2.xhtml', 0)).toBeCloseTo(0.75);
    expect(progressoPercentual({ ...indice, total: 0 }, 'OEBPS/cap1.xhtml', 1)).toBe(0);
  });
});

describe('detectarFormato', () => {
  it('reconhece EPUB pelo mimetype do zip e PDF pela assinatura', () => {
    expect(detectarFormato(simples())).toBe('epub');
    expect(detectarFormato(strToU8('%PDF-1.4\n...'))).toBe('pdf');
    expect(detectarFormato(zipSync({ 'a.txt': strToU8('x') }))).toBeNull();
    expect(detectarFormato(strToU8('texto'))).toBeNull();
  });
});

describe('RN-02.10 · acervo embutido (apps/app/assets/acervo)', () => {
  const dir = join(import.meta.dirname, '..', '..', '..', 'apps', 'app', 'assets', 'acervo');
  for (const [arquivo, titulo] of [
    ['dom-casmurro.epub', 'Dom Casmurro'],
    ['o-cortico.epub', 'O Cortiço'],
    ['iracema.epub', 'Iracema'],
  ] as const) {
    it(`${arquivo}: monta o índice sem a licença do Gutenberg`, () => {
      const indice = montarIndiceEpub(new Uint8Array(readFileSync(join(dir, arquivo))));
      expect(indice.metadados.titulo).toContain(titulo);
      expect(indice.metadados.idioma).toBe('pt');
      expect(indice.total).toBeGreaterThan(50_000);
      expect(indice.amostraInicial).not.toMatch(/Project Gutenberg/i);
    });
  }
});
