import { describe, expect, it } from 'vitest';
import { estadoDoJardim } from '../../src/ofensiva/estadoDoJardim.js';
import type { Ofensiva } from '../../src/ofensiva/tipos.js';

const ofensivaBase = (overrides: Partial<Ofensiva> = {}): Ofensiva => ({
  eixo: 'leitura',
  contagemAtual: 0,
  melhorMarca: 0,
  contagemEncerrada: 0,
  encerradaEm: null,
  ultimoDiaCumprido: null,
  estado: 'dormente',
  acervoDiasCumpridos: 0,
  ...overrides,
});

describe('RN-04.23 — estágios do canteiro ativo', () => {
  it.each([
    [0, 'broto'],
    [1, 'broto'],
    [6, 'broto'],
    [7, 'muda'],
    [29, 'muda'],
    [30, 'planta_florida'],
    [99, 'planta_florida'],
    [100, 'arvore'],
    [364, 'arvore'],
    [365, 'bosque'],
    [1000, 'bosque'],
  ] as const)('contagemAtual=%i → %s', (contagemAtual, esperado) => {
    const jardim = estadoDoJardim(ofensivaBase({ contagemAtual, estado: 'ativa' }));
    expect(jardim.estagio).toBe(esperado);
  });
});

describe('GAM-09 + RN-04.25 — dormência preserva o jardim', () => {
  it('acervo de 60 dias cumpridos continua presente na dormência (nada é removido)', () => {
    const jardim = estadoDoJardim(
      ofensivaBase({ estado: 'dormente', acervoDiasCumpridos: 60, contagemAtual: 0 })
    );
    expect(jardim.tamanhoPermanente).toBe(60);
    expect(jardim.estado).toBe('dormente');
  });
});

describe('GAM-09 + RN-04.14a — a ofensiva encerrada aparece no passado, ao lado do zero corrente e do recorde', () => {
  it('mostra os três números: corrente zero, encerrada 23, recorde 41', () => {
    const jardim = estadoDoJardim(
      ofensivaBase({ estado: 'dormente', contagemAtual: 0, contagemEncerrada: 23, melhorMarca: 41 })
    );
    expect(jardim.estagio).toBe('broto'); // corrente é zero — nunca finge que a sequência continua
    expect(jardim.contagemEncerrada).toBe(23);
    expect(jardim.melhorMarca).toBe(41);
  });

  it('fora da dormência, contagemEncerrada não é exibida (null)', () => {
    const jardim = estadoDoJardim(ofensivaBase({ estado: 'ativa', contagemAtual: 5 }));
    expect(jardim.contagemEncerrada).toBeNull();
  });
});

describe('RN-04.26 — retomada restaura o viço mesmo com a ofensiva em 1', () => {
  it('estado vivo imediatamente, acervo histórico intacto', () => {
    const jardim = estadoDoJardim(
      ofensivaBase({ estado: 'ativa', contagemAtual: 1, acervoDiasCumpridos: 60 })
    );
    expect(jardim.estado).toBe('vivo');
    expect(jardim.tamanhoPermanente).toBe(60);
  });
});
