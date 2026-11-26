import { describe, expect, it } from 'vitest';
import { CHEGADA, horariosDaChegada, restanteDaChegada } from '../src/chegada';

const duracaoTotal = (horarios: Map<string, number>, inicio: number) =>
  Math.max(...horarios.values()) - inicio + CHEGADA.duracao;

describe('Chegada dos livros · quando cada um cai', () => {
  it('cai um de cada vez, na ordem da estante, a partir do início', () => {
    const h = horariosDaChegada(['a', 'b', 'c'], 1000);
    expect(h.get('a')).toBe(1000);
    expect(h.get('b')).toBeGreaterThan(1000);
    expect(h.get('c')).toBeGreaterThan(h.get('b') as number);
  });

  it('a estante inteira chega em no máximo 1 segundo, com poucos ou muitos livros', () => {
    for (const n of [1, 2, 3, 6, 9, 12, 40]) {
      const ids = Array.from({ length: n }, (_, i) => `o${i}`);
      expect(duracaoTotal(horariosDaChegada(ids, 0), 0)).toBeLessThanOrEqual(1000);
    }
  });

  it('com poucos livros o intervalo não fica arrastado', () => {
    const h = horariosDaChegada(['a', 'b'], 0);
    expect(h.get('b')).toBeLessThanOrEqual(CHEGADA.passoMaximo);
  });

  it('só os primeiros livros caem; os de baixo já estão no lugar', () => {
    const ids = Array.from({ length: 30 }, (_, i) => `o${i}`);
    const h = horariosDaChegada(ids, 0);
    expect(h.size).toBe(CHEGADA.livrosQueCaem);
    expect(h.has(`o${CHEGADA.livrosQueCaem}`)).toBe(false);
  });
});

describe('Chegada dos livros · uma capa que monta durante a chegada', () => {
  it('espera o que falta até a hora dela', () => {
    expect(restanteDaChegada(1500, 1200)).toBe(300);
    expect(restanteDaChegada(1500, 1500)).toBe(0);
  });

  it('se a hora dela já passou, aparece no lugar, sem cair pela metade', () => {
    expect(restanteDaChegada(1500, 1501)).toBeNull();
  });

  it('livro que não cai fica parado', () => {
    expect(restanteDaChegada(undefined, 0)).toBeNull();
  });
});
