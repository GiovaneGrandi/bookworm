import { describe, expect, it } from 'vitest';
import { CAPAS, corDaCapa, marcaDaCapa, rodapeDaEstante, rotuloDaCapa } from '../src/estante';

describe('Estante · a marca no pé de cada capa', () => {
  it('o estado da obra, com o percentual de quem já começou', () => {
    expect(marcaDaCapa({ estado: 'lendo', progresso: 0.123 })).toBe('lendo · 12%');
    expect(marcaDaCapa({ estado: 'em_pausa', progresso: 0.4 })).toBe('pausa · 40%');
    expect(marcaDaCapa({ estado: 'quero_ler', progresso: 0 })).toBe('quero ler');
    expect(marcaDaCapa({ estado: 'concluido', progresso: 1 })).toBe('lido');
  });
});

describe('Estante · a cor da capa', () => {
  it('sai da paleta do mockup e é sempre a mesma para a mesma obra', () => {
    const cor = corDaCapa('01JD3K8Z');
    expect(CAPAS).toContainEqual(cor);
    expect(corDaCapa('01JD3K8Z')).toEqual(cor);
  });

  it('obras diferentes se espalham pela paleta', () => {
    const ids = Array.from({ length: 40 }, (_, i) => `obra-${i}`);
    expect(new Set(ids.map((id) => corDaCapa(id).fundo)).size).toBeGreaterThan(6);
  });
});

describe('Estante · rodapé e leitor de tela', () => {
  it('a contagem do rodapé, em algarismos como no mockup', () => {
    expect(rodapeDaEstante(1)).toBe('1 livro na estante');
    expect(rodapeDaEstante(24)).toBe('24 livros na estante');
    expect(rodapeDaEstante(0)).toBe('Nenhum livro na estante');
  });

  it('a capa anuncia título, autor e estado, e o que o toque faz', () => {
    expect(
      rotuloDaCapa({
        titulo: 'O cortiço',
        autor: 'Aluísio Azevedo',
        estado: 'lendo',
        progresso: 0.3,
      })
    ).toBe('O cortiço, de Aluísio Azevedo. Lendo, 30% lido. Abrir no leitor');
    expect(rotuloDaCapa({ titulo: 'Tese', autor: null, estado: 'quero_ler', progresso: 0 })).toBe(
      'Tese. Quero ler. Abrir no leitor'
    );
  });
});
