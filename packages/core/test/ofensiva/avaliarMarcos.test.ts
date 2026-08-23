import { describe, expect, it } from 'vitest';
import { avaliarMarcos } from '../../src/ofensiva/avaliarMarcos.js';
import { recalcularOfensiva } from '../../src/ofensiva/recalcularOfensiva.js';
import type { DiaParaOfensiva, Ofensiva } from '../../src/ofensiva/tipos.js';

const ofensivaComRecorde = (melhorMarca: number): Ofensiva => ({
  eixo: 'leitura',
  contagemAtual: 0,
  melhorMarca,
  contagemEncerrada: 0,
  encerradaEm: null,
  ultimoDiaCumprido: null,
  estado: 'dormente',
  acervoDiasCumpridos: melhorMarca,
});

describe('RN-04.13 — marcos de ofensiva', () => {
  it('nenhum marco antes de 7 dias', () => {
    expect(avaliarMarcos(ofensivaComRecorde(6))).toEqual([]);
  });

  it('7, 30 e 100 alcançados com recorde de 100', () => {
    expect(avaliarMarcos(ofensivaComRecorde(100))).toEqual([7, 30, 100]);
  });

  it('todos os quatro marcos com recorde de 365+', () => {
    expect(avaliarMarcos(ofensivaComRecorde(400))).toEqual([7, 30, 100, 365]);
  });
});

describe('RN-04.14 — o recorde nunca regride', () => {
  it('marcos permanecem conquistados mesmo com a ofensiva corrente quebrada e zerada', () => {
    const ofensiva: Ofensiva = { ...ofensivaComRecorde(100), contagemAtual: 0, estado: 'dormente' };
    expect(avaliarMarcos(ofensiva)).toEqual([7, 30, 100]);
  });
});

describe('RN-04.19 — dia protegido não conta como cumprido para marco', () => {
  it('6 dias cumpridos + 1 protegido não desbloqueiam o marco de 7 dias', () => {
    const dias: DiaParaOfensiva[] = [
      ...Array.from({ length: 6 }, (_, i) => ({
        dia: `2026-08-0${i + 1}`,
        cumprido: true,
        protegidoPorCongelamento: false,
      })),
      { dia: '2026-08-07', cumprido: false, protegidoPorCongelamento: true },
    ];

    const ofensiva = recalcularOfensiva('leitura', dias);
    // a proteção preserva os 6 dias (RN-04.19: preserva, não incrementa) — não chega a 7.
    expect(ofensiva.contagemAtual).toBe(6);
    expect(avaliarMarcos(ofensiva)).toEqual([]);
  });

  it('o 7º dia realmente cumprido (não protegido) é o que desbloqueia o marco', () => {
    const dias: DiaParaOfensiva[] = Array.from({ length: 7 }, (_, i) => ({
      dia: `2026-08-0${i + 1}`,
      cumprido: true,
      protegidoPorCongelamento: false,
    }));

    const ofensiva = recalcularOfensiva('leitura', dias);
    expect(avaliarMarcos(ofensiva)).toEqual([7]);
  });
});
