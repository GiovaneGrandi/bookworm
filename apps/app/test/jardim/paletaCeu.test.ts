import { describe, expect, it } from '@jest/globals';
import { faixaHoraria, paletaCeuPara } from '../../src/jardim/paletaCeu.js';

describe('J-11 — a luz do céu acompanha a hora real', () => {
  it('classifica as cinco faixas do dia', () => {
    expect(faixaHoraria(3)).toBe('madrugada');
    expect(faixaHoraria(9)).toBe('manha');
    expect(faixaHoraria(14)).toBe('tarde');
    expect(faixaHoraria(18)).toBe('entardecer');
    expect(faixaHoraria(22)).toBe('noite');
  });

  it('limites de faixa não se sobrepõem', () => {
    expect(faixaHoraria(0)).toBe('madrugada');
    expect(faixaHoraria(6)).toBe('manha');
    expect(faixaHoraria(12)).toBe('tarde');
    expect(faixaHoraria(17)).toBe('entardecer');
    expect(faixaHoraria(20)).toBe('noite');
    expect(faixaHoraria(23)).toBe('noite');
  });

  it('vivo e dormente têm paletas diferentes para a mesma hora (RN-04.25)', () => {
    const viva = paletaCeuPara(14, 'vivo');
    const dormente = paletaCeuPara(14, 'dormente');
    expect(viva).not.toEqual(dormente);
  });

  it('toda paleta tem as três cores', () => {
    for (const estado of ['vivo', 'dormente'] as const) {
      for (let hora = 0; hora < 24; hora++) {
        const paleta = paletaCeuPara(hora, estado);
        expect(paleta.topo).toMatch(/^#/);
        expect(paleta.base).toMatch(/^#/);
        expect(paleta.luz).toMatch(/^#/);
      }
    }
  });
});
