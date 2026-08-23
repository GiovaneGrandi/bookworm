// Estágio 5 — camada 3 (design-system.md §2.3). `selecionadoBorda`/`selecionadoFundo` implementam
// a regra 7 de direcao-visual.md §4: borda de acento a 70% + fundo âmbar a 16%, resolvendo por
// superfície (RN-DS.1: nunca lê pigmento direto fora deste pacote).
import { describe, expect, it } from 'vitest';
import { corComAlfa } from '../src/corComAlfa.js';
import { papelSemantico } from '../src/papelSemantico.js';
import { pigmento } from '../src/pigmentos.js';
import { superficie } from '../src/superficies.js';

describe('corComAlfa', () => {
  it('converte hex + alfa em rgba', () => {
    expect(corComAlfa('#2f5d3a', 0.7)).toBe('rgba(47,93,58,0.7)');
    expect(corComAlfa('#e6c15c', 0.16)).toBe('rgba(230,193,92,0.16)');
  });
});

describe('papelSemantico — regra 7 de direcao-visual.md §4', () => {
  it('acaoPrimaria resolve para o acento da própria superfície, nunca um pigmento fixo', () => {
    expect(papelSemantico.papel.acaoPrimaria).toBe(superficie.papel.acento);
    expect(papelSemantico.mesa.acaoPrimaria).toBe(superficie.mesa.acento);
    expect(papelSemantico.papel.acaoPrimaria).not.toBe(papelSemantico.mesa.acaoPrimaria);
  });

  it('selecionadoBorda é o acento da superfície a 70%, variando por superfície', () => {
    expect(papelSemantico.papel.selecionadoBorda).toBe(corComAlfa(superficie.papel.acento, 0.7));
    expect(papelSemantico.mesa.selecionadoBorda).toBe(corComAlfa(superficie.mesa.acento, 0.7));
  });

  it('selecionadoFundo é sempre o âmbar de marca a 16%, igual em toda superfície', () => {
    const esperado = corComAlfa(pigmento.ambar, 0.16);
    for (const nome of Object.keys(superficie) as Array<keyof typeof superficie>) {
      expect(papelSemantico[nome].selecionadoFundo).toBe(esperado);
    }
  });

  it('todas as oito superfícies têm papel semântico derivado', () => {
    expect(Object.keys(papelSemantico).sort()).toEqual(Object.keys(superficie).sort());
  });
});
