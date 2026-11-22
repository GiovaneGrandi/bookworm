import { describe, expect, it } from 'vitest';
import {
  encaixarComposicao,
  mesaEmLista,
  textosDaBandeja,
  textosDaBiblioteca,
  textosDoLivro,
  textosDoSegundoLivro,
} from '../src/mesa';
import { corDaPoca } from '../src/tema/luz';

describe('RN-DV.6 · a temperatura da leitora tinge a poça de luz da mesa', () => {
  it('nos extremos, a cor do mockup B (âmbar quente a 2.700 K, quase branca a 6.500 K)', () => {
    expect(corDaPoca(2700)).toEqual({ r: 255, g: 170, b: 90, a: 0.34 });
    expect(corDaPoca(6500)).toEqual({ r: 255, g: 230, b: 210, a: 0.16 });
  });

  it('quanto mais quente, mais âmbar e mais forte', () => {
    const quente = corDaPoca(3000);
    const neutra = corDaPoca(4200);
    expect(quente.b).toBeLessThan(neutra.b);
    expect(quente.a).toBeGreaterThan(neutra.a);
  });

  it('fora da faixa do painel, fica no limite', () => {
    expect(corDaPoca(1000)).toEqual(corDaPoca(2700));
    expect(corDaPoca(9000)).toEqual(corDaPoca(6500));
  });
});

const domCasmurro = {
  titulo: 'Dom Casmurro',
  formato: 'epub' as const,
  progresso: 0.27,
  locator: null,
};

describe('RN-DV.3 · o livro aberto mostra título e página corrente', () => {
  it('EPUB: a página canônica sai do índice de caracteres (RN-02.12)', () => {
    const t = textosDoLivro(domCasmurro, 375_549);
    expect(t.pagina).toBe(68);
    expect(t.folios).toEqual({ esquerda: 67, direita: 68 });
    expect(t.etiqueta).toBe('Continuar · Dom Casmurro · p. 68');
    expect(t.rotulo).toBe('Continuar lendo Dom Casmurro, página 68 de 251');
  });

  it('na primeira página, a página da esquerda fica sem número', () => {
    const t = textosDoLivro({ ...domCasmurro, progresso: 0 }, 375_549);
    expect(t.folios).toEqual({ esquerda: null, direita: 1 });
  });

  it('título longo entra curto na etiqueta e inteiro no leitor de tela', () => {
    const t = textosDoLivro({ ...domCasmurro, titulo: 'Iracema\nLenda do Ceará' }, 100_000);
    expect(t.etiqueta).toMatch(/^Continuar · Iracema · p\. /);
    expect(t.rotulo).toMatch(/^Continuar lendo Iracema Lenda do Ceará, página /);
  });

  it('PDF: sem índice, a página vem da posição do Readium', () => {
    const locator = JSON.stringify({
      href: 'p',
      type: 'application/pdf',
      locations: { position: 3 },
    });
    const t = textosDoLivro({ ...domCasmurro, formato: 'pdf', locator }, null);
    expect(t.etiqueta).toBe('Continuar · Dom Casmurro · p. 3');
    expect(t.rotulo).toBe('Continuar lendo Dom Casmurro, página 3');
  });

  it('PDF sem posição: o percentual lido', () => {
    const t = textosDoLivro({ ...domCasmurro, formato: 'pdf', progresso: 0.12 }, null);
    expect(t.pagina).toBeNull();
    expect(t.etiqueta).toBe('Continuar · Dom Casmurro · 12%');
    expect(t.rotulo).toBe('Continuar lendo Dom Casmurro, 12% lido');
  });
});

describe('RN-DV.10 · o leitor de tela anuncia a etiqueta, seguida do estado', () => {
  const casos = [
    textosDoLivro(domCasmurro, 375_549),
    textosDoSegundoLivro({ titulo: 'O cortiço', progresso: 0.12 }),
    textosDaBiblioteca({ lendo: 2, em_pausa: 1, quero_ler: 3, total: 6 }),
    textosDaBiblioteca({ lendo: 0, em_pausa: 0, quero_ler: 0, total: 0 }),
    textosDaBandeja(true),
    textosDaBandeja(false),
  ];

  for (const t of casos) {
    it(`"${t.etiqueta}"`, () => {
      const primeira = (s: string) => s.split(/[\s·,:]+/)[0]?.toLowerCase();
      expect(primeira(t.rotulo)).toBe(primeira(t.etiqueta));
    });
  }

  it('biblioteca: o total na etiqueta, as três contagens para o leitor de tela (RN-DV.4)', () => {
    const t = textosDaBiblioteca({ lendo: 2, em_pausa: 1, quero_ler: 3, total: 6 });
    expect(t.etiqueta).toBe('Biblioteca · 6 livros');
    expect(t.rotulo).toBe('Biblioteca: 2 lendo, 1 em pausa, 3 quero ler');
  });

  it('biblioteca com um livro: singular', () => {
    expect(textosDaBiblioteca({ lendo: 1, em_pausa: 0, quero_ler: 0, total: 1 }).etiqueta).toBe(
      'Biblioteca · 1 livro'
    );
  });

  it('biblioteca vazia (Q13)', () => {
    const t = textosDaBiblioteca({ lendo: 0, em_pausa: 0, quero_ler: 0, total: 0 });
    expect(t.etiqueta).toBe('Biblioteca · vazia');
    expect(t.rotulo).toBe('Biblioteca, vazia');
  });
});

describe('v2 · a composição da mesa cabe entre as áreas seguras', () => {
  it('390 × 844 com barras do Android: encolhe pela altura e centraliza na largura', () => {
    const c = encaixarComposicao({ largura: 390, altura: 844 }, { topo: 32, baixo: 24 });
    expect(c.escala).toBeCloseTo(788 / 836, 4);
    expect(c.x).toBeCloseTo((390 - 390 * c.escala) / 2, 4);
    expect(c.y).toBe(32);
  });

  it('tela mais larga do que alta: encolhe pela largura e centraliza na altura', () => {
    const c = encaixarComposicao({ largura: 360, altura: 1000 }, { topo: 24, baixo: 48 });
    expect(c.escala).toBeCloseTo(360 / 390, 4);
    expect(c.x).toBeCloseTo(0, 4);
    expect(c.y).toBeCloseTo(24 + (928 - 836 * c.escala) / 2, 4);
  });
});

describe('v2 · o segundo livro convida a abrir direto no leitor', () => {
  it('a etiqueta ganha a seta', () => {
    expect(textosDoSegundoLivro({ titulo: 'O médico e o monstro', progresso: 0.12 }).etiqueta).toBe(
      'lendo · 12% ▸'
    );
  });
});

describe('v2 · texto grande: a mesa vira lista', () => {
  it('a partir de 150% de fonte', () => {
    expect(mesaEmLista(1)).toBe(false);
    expect(mesaEmLista(1.3)).toBe(false);
    expect(mesaEmLista(1.5)).toBe(true);
    expect(mesaEmLista(2)).toBe(true);
  });
});
