import { describe, expect, it } from '@jest/globals';
import { posicionarElementosDiarios } from '../../src/jardim/elementosDiarios.js';

describe('RN-04.24/RN-04.27 — elementos diários regam o jardim, um por dia cumprido', () => {
  it('zero dias no acervo não produz nenhum elemento', () => {
    expect(posicionarElementosDiarios(0, 300, 100)).toHaveLength(0);
  });

  it('um elemento por dia do acervo, até o teto visual', () => {
    expect(posicionarElementosDiarios(5, 300, 100)).toHaveLength(5);
    expect(posicionarElementosDiarios(20, 300, 100)).toHaveLength(20);
  });

  it('acima do teto visual, a quantidade não cresce mais (canteiro não fica poluído)', () => {
    const noTeto = posicionarElementosDiarios(36, 300, 100);
    const bemAcima = posicionarElementosDiarios(5000, 300, 100);
    expect(bemAcima).toHaveLength(noTeto.length);
  });

  it('é determinístico: os mesmos parâmetros sempre produzem as mesmas posições', () => {
    const a = posicionarElementosDiarios(10, 300, 100);
    const b = posicionarElementosDiarios(10, 300, 100);
    expect(a).toEqual(b);
  });

  it('todo elemento cai dentro dos limites da faixa dada', () => {
    const elementos = posicionarElementosDiarios(30, 300, 100);
    for (const el of elementos) {
      expect(el.x).toBeGreaterThanOrEqual(0);
      expect(el.x).toBeLessThanOrEqual(300);
      expect(el.y).toBeGreaterThanOrEqual(0);
      expect(el.y).toBeLessThanOrEqual(100);
      expect(el.raio).toBeGreaterThan(0);
    }
  });

  it('crescer o acervo preserva as posições já existentes (RN-04.25 — nada é removido/reordenado)', () => {
    const dez = posicionarElementosDiarios(10, 300, 100);
    const vinte = posicionarElementosDiarios(20, 300, 100);
    expect(vinte.slice(0, 10)).toEqual(dez);
  });
});
