import { describe, expect, it } from '@jest/globals';
import { misturarCores, pseudoAleatorio } from '../../src/jardim/cores.js';

describe('pseudoAleatorio — jitter determinístico da cena do jardim', () => {
  it('é determinístico: a mesma semente sempre devolve o mesmo valor', () => {
    expect(pseudoAleatorio(42)).toBe(pseudoAleatorio(42));
  });

  it('sementes diferentes tendem a devolver valores diferentes', () => {
    expect(pseudoAleatorio(1)).not.toBe(pseudoAleatorio(2));
  });

  it('sempre no intervalo [0, 1)', () => {
    for (const semente of [0, 1, 7, 100, 999999, -5]) {
      const valor = pseudoAleatorio(semente);
      expect(valor).toBeGreaterThanOrEqual(0);
      expect(valor).toBeLessThan(1);
    }
  });
});

describe('misturarCores — interpolação linear entre duas cores hex', () => {
  it('t=0 devolve a primeira cor', () => {
    expect(misturarCores('#000000', '#ffffff', 0)).toBe('rgb(0,0,0)');
  });

  it('t=1 devolve a segunda cor', () => {
    expect(misturarCores('#000000', '#ffffff', 1)).toBe('rgb(255,255,255)');
  });

  it('t=0.5 fica a meio caminho', () => {
    expect(misturarCores('#000000', '#ffffff', 0.5)).toBe('rgb(128,128,128)');
  });
});
