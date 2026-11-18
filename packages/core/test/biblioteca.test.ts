import { describe, expect, it } from 'vitest';
import {
  abrirParaLer,
  acoesDaGaveta,
  agruparGaveta,
  type EstadoObra,
  gerarUlid,
  mesmoArquivo,
  objetosNaMesa,
  obraComMesmoArquivo,
  porEmPausa,
  tituloCurto,
} from '../src/index';

type Obra = { id: string; estado: EstadoObra; abertoEm: number | null; importadoEm: number };
const obra = (id: string, estado: EstadoObra, abertoEm: number | null, importadoEm = 0): Obra => ({
  id,
  estado,
  abertoEm,
  importadoEm,
});

describe('RN-02.6 · transições de estado da obra', () => {
  it('abrir para ler leva qualquer obra da gaveta a "lendo" e marca quando foi aberta', () => {
    for (const estado of ['quero_ler', 'em_pausa', 'lendo'] as const) {
      expect(abrirParaLer(obra('a', estado, null), 1000)).toMatchObject({
        estado: 'lendo',
        abertoEm: 1000,
      });
    }
  });

  it('não altera a obra recebida', () => {
    const original = obra('a', 'quero_ler', null);
    abrirParaLer(original, 1000);
    expect(original.estado).toBe('quero_ler');
  });

  it('pôr em pausa vale só para quem está "lendo" e preserva o resto', () => {
    expect(porEmPausa(obra('a', 'lendo', 500))).toMatchObject({
      estado: 'em_pausa',
      abertoEm: 500,
    });
    expect(() => porEmPausa(obra('a', 'quero_ler', null))).toThrow();
  });

  it('ações ao segurar o dedo: pausar só quem está lendo; tirar da gaveta sempre (Q15)', () => {
    expect(acoesDaGaveta('lendo')).toEqual(['pausar', 'tirar']);
    expect(acoesDaGaveta('em_pausa')).toEqual(['tirar']);
    expect(acoesDaGaveta('quero_ler')).toEqual(['tirar']);
  });
});

describe('RN-02.6a · a gaveta mostra o que ainda vai ser lido', () => {
  it('agrupa em lendo, em pausa e quero ler, nesta ordem, sem concluídos', () => {
    const grupos = agruparGaveta([
      obra('q1', 'quero_ler', null, 1),
      obra('l1', 'lendo', 10),
      obra('c1', 'concluido', 50),
      obra('p1', 'em_pausa', 20),
      obra('l2', 'lendo', 30),
      obra('q2', 'quero_ler', null, 5),
    ]);
    expect(grupos.map((g) => [g.estado, g.obras.map((o) => o.id)])).toEqual([
      ['lendo', ['l2', 'l1']],
      ['em_pausa', ['p1']],
      ['quero_ler', ['q2', 'q1']],
    ]);
  });

  it('grupos vazios continuam presentes, com lista vazia', () => {
    expect(agruparGaveta([]).map((g) => g.obras.length)).toEqual([0, 0, 0]);
  });
});

describe('RN-DV.4 · a mesa guarda só o que está em uso', () => {
  it('pousa no máximo os 2 livros "lendo" abertos mais recentemente', () => {
    const mesa = objetosNaMesa([
      obra('l1', 'lendo', 10),
      obra('l2', 'lendo', 30),
      obra('l3', 'lendo', 20),
      obra('p1', 'em_pausa', 99),
    ]);
    expect(mesa.livros.map((o) => o.id)).toEqual(['l2', 'l3']);
  });

  it('conta a gaveta por grupo', () => {
    const mesa = objetosNaMesa([
      obra('l1', 'lendo', 1),
      obra('p', 'em_pausa', 2),
      obra('q', 'quero_ler', null),
    ]);
    expect(mesa.gaveta).toEqual({ lendo: 1, em_pausa: 1, quero_ler: 1, total: 3 });
  });

  it('Q13 · sem nenhum livro "lendo", a mesa está vazia: o lugar do livro fica livre', () => {
    expect(objetosNaMesa([obra('q', 'quero_ler', null)]).vazia).toBe(true);
    expect(objetosNaMesa([obra('l', 'lendo', 1)]).vazia).toBe(false);
  });
});

describe('gerarUlid', () => {
  it('tem 26 caracteres Crockford e ordena pelo tempo', () => {
    const a = gerarUlid(1_700_000_000_000, () => 0.5);
    const b = gerarUlid(1_700_000_000_001, () => 0.1);
    expect(a).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    expect(a < b).toBe(true);
  });

  it('é determinístico com o mesmo tempo e a mesma fonte de acaso', () => {
    expect(gerarUlid(5, () => 0.25)).toBe(gerarUlid(5, () => 0.25));
  });
});

describe('tituloCurto', () => {
  it('fica só com o título, sem o subtítulo que o Gutenberg anexa', () => {
    expect(tituloCurto('Iracema\ncom uma noticia biographica do auctor')).toBe('Iracema');
    expect(tituloCurto('Flatland: A Romance of Many Dimensions')).toBe('Flatland');
    expect(tituloCurto('Memórias / póstumas')).toBe('Memórias');
    expect(tituloCurto('  Dom   Casmurro ')).toBe('Dom Casmurro');
  });
});

describe('RN-02.1g · a biblioteca não guarda duas cópias do mesmo arquivo', () => {
  it('mesmo nome e extensão é o mesmo arquivo, sem diferenciar maiúsculas', () => {
    expect(mesmoArquivo('dom-casmurro.epub', 'dom-casmurro.epub')).toBe(true);
    expect(mesmoArquivo('Livro.EPUB', 'livro.epub')).toBe(true);
    expect(mesmoArquivo('  livro.epub ', 'livro.epub')).toBe(true);
  });

  it('acentos compostos e decompostos (NFC × NFD) contam como iguais', () => {
    expect(mesmoArquivo('cortiço.epub', 'cortiço.epub')).toBe(true);
  });

  it('extensão diferente ou nome diferente é outro arquivo', () => {
    expect(mesmoArquivo('livro.epub', 'livro.pdf')).toBe(false);
    expect(mesmoArquivo('livro.epub', 'livro (1).epub')).toBe(false);
  });

  it('acha a obra que já tem o arquivo', () => {
    const obras = [
      { id: 'a', nomeArquivo: 'x.pdf' },
      { id: 'b', nomeArquivo: 'Dom-Casmurro.epub' },
    ];
    expect(obraComMesmoArquivo(obras, 'dom-casmurro.EPUB')?.id).toBe('b');
    expect(obraComMesmoArquivo(obras, 'outro.epub')).toBeUndefined();
  });
});
