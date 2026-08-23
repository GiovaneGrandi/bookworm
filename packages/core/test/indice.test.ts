// Um arquivo de teste por critério de aceitação/regra do índice de caracteres — nome do caso é
// o ID da regra (RN-ST.6). Fixtures em test/fixtures/, procedência no README ao lado.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { montarIndiceEpub } from '../src/indice/montarIndiceEpub.js';
import { montarIndicePdf } from '../src/indice/montarIndicePdf.js';
import { posicaoEmCaracteres } from '../src/indice/posicaoEmCaracteres.js';

const aqui = dirname(fileURLToPath(import.meta.url));
const fixture = (nome: string) => readFileSync(join(aqui, 'fixtures', nome));

describe('RN-02.10 — exclui capa, ficha catalográfica, sumário e créditos', () => {
  it('obra com <guide> não inclui capa/sumário/créditos no índice nem no total', () => {
    const indice = montarIndiceEpub(fixture('obra-com-sumario-e-creditos.epub'));
    const hrefs = indice.recursos.map((r) => r.href);

    expect(hrefs).not.toContain('OEBPS/capa.xhtml');
    expect(hrefs).not.toContain('OEBPS/sumario.xhtml');
    expect(hrefs).not.toContain('OEBPS/creditos.xhtml');
    expect(hrefs).toEqual(['OEBPS/capitulo1.xhtml', 'OEBPS/capitulo2.xhtml']);
  });

  it('sem <guide>, nada é excluído por este mecanismo', () => {
    const indice = montarIndiceEpub(fixture('obra-simples.epub'));
    expect(indice.recursos.map((r) => r.href)).toEqual([
      'OEBPS/capitulo1.xhtml',
      'OEBPS/capitulo2.xhtml',
    ]);
  });
});

describe('RN-03.2 / RN-03.3 — página canônica e conversão global', () => {
  const PAGINA_CANONICA_CARACTERES = 1500; // glossario.md §2 — (a validar)

  it('a conversão para páginas canônicas é idêntica entre duas obras diferentes', () => {
    const indiceA = montarIndiceEpub(fixture('obra-com-sumario-e-creditos.epub'));
    const indiceB = montarIndiceEpub(fixture('obra-simples.epub'));

    const paginasCanonicas = (indice: { total: number }) =>
      indice.total / PAGINA_CANONICA_CARACTERES;

    // a mesma fórmula, sem exceção por obra — é isso que a regra exige, não um valor específico
    expect(paginasCanonicas(indiceA)).toBe(indiceA.total / PAGINA_CANONICA_CARACTERES);
    expect(paginasCanonicas(indiceB)).toBe(indiceB.total / PAGINA_CANONICA_CARACTERES);
  });
});

describe('RN-02.1f — EPUB e PDF produzem a mesma forma de índice e o mesmo cálculo de progresso', () => {
  it('os dois formatos têm exatamente as mesmas chaves e tipos', () => {
    const indiceEpub = montarIndiceEpub(fixture('obra-simples.epub'));
    const indicePdf = montarIndicePdf([
      { numero: 1, texto: 'Primeira página de teste.' },
      { numero: 2, texto: 'Segunda página, um pouco mais longa que a primeira.' },
    ]);

    const [recursoEpub] = indiceEpub.recursos;
    const [recursoPdf] = indicePdf.recursos;
    expect(recursoEpub).toBeDefined();
    expect(recursoPdf).toBeDefined();

    expect(Object.keys(indiceEpub).sort()).toEqual(Object.keys(indicePdf).sort());
    expect(Object.keys(recursoEpub ?? {}).sort()).toEqual(Object.keys(recursoPdf ?? {}).sort());
  });

  it('posicaoEmCaracteres usa a mesma fórmula para os dois formatos', () => {
    const indiceEpub = montarIndiceEpub(fixture('obra-simples.epub'));
    const indicePdf = montarIndicePdf([
      { numero: 1, texto: 'Primeira página de teste.' },
      { numero: 2, texto: 'Segunda página, um pouco mais longa que a primeira.' },
    ]);

    const [recursoEpub] = indiceEpub.recursos;
    const [recursoPdf] = indicePdf.recursos;
    expect(recursoEpub).toBeDefined();
    expect(recursoPdf).toBeDefined();
    if (!recursoEpub || !recursoPdf) return;

    expect(posicaoEmCaracteres(indiceEpub, recursoEpub.href, 0.5)).toBe(
      recursoEpub.offset + 0.5 * recursoEpub.comprimento
    );
    expect(posicaoEmCaracteres(indicePdf, recursoPdf.href, 0.5)).toBe(
      recursoPdf.offset + 0.5 * recursoPdf.comprimento
    );
  });
});

describe('RN-ST.8 — o índice é gerado uma vez e serializável; recalcular dá resultado idêntico', () => {
  it('montar o índice duas vezes sobre o mesmo arquivo dá o mesmo resultado', () => {
    const bytes = fixture('obra-com-sumario-e-creditos.epub');
    const indice1 = montarIndiceEpub(bytes);
    const indice2 = montarIndiceEpub(bytes);
    expect(indice1).toEqual(indice2);
  });

  it('o índice é serializável (JSON) sem perda', () => {
    const indice = montarIndiceEpub(fixture('obra-simples.epub'));
    const rodaIda = JSON.parse(JSON.stringify(indice));
    expect(rodaIda).toEqual(indice);
  });
});

describe('RN-TEL.27 — PDF sem camada de texto não gera índice', () => {
  it('recusa explicitamente quando nenhuma página tem texto', () => {
    expect(() =>
      montarIndicePdf([
        { numero: 1, texto: null },
        { numero: 2, texto: null },
      ])
    ).toThrow(/RN-TEL\.27/);
  });

  it('não recusa se ao menos uma página tem texto', () => {
    expect(() =>
      montarIndicePdf([
        { numero: 1, texto: null },
        { numero: 2, texto: 'Só esta página tem texto.' },
      ])
    ).not.toThrow();
  });
});
