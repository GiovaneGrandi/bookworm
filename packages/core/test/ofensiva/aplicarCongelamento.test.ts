import { describe, expect, it } from 'vitest';
import {
  aplicarCongelamento,
  concederCongelamentoMensal,
} from '../../src/ofensiva/aplicarCongelamento.js';
import type { EstoqueCongelamento } from '../../src/ofensiva/tipos.js';

describe('GAM-08 + RN-04.17 — congelamento automático', () => {
  it('consome um congelamento quando o dia não foi cumprido e há estoque', () => {
    const decisao = aplicarCongelamento(0, 2);
    expect(decisao).toEqual({ protegido: true, estoqueResultante: 1 });
  });

  it('sem estoque, o dia não é protegido', () => {
    const decisao = aplicarCongelamento(0, 0);
    expect(decisao).toEqual({ protegido: false, estoqueResultante: 0 });
  });
});

describe('RN-04.18 — limite de proteção consecutiva', () => {
  it('com 2 dias já protegidos seguidos, o terceiro quebra a ofensiva mesmo com estoque', () => {
    const decisao = aplicarCongelamento(2, 3);
    expect(decisao).toEqual({ protegido: false, estoqueResultante: 3 });
  });

  it('o segundo dia consecutivo ainda é protegido (limite é 2)', () => {
    const decisao = aplicarCongelamento(1, 3);
    expect(decisao.protegido).toBe(true);
  });
});

describe('Idempotência do job diário — rodar duas vezes não consome dois congelamentos', () => {
  it('passar a decisão já tomada devolve exatamente a mesma decisão, sem tocar no estoque de novo', () => {
    const primeiraRodada = aplicarCongelamento(0, 2);
    expect(primeiraRodada).toEqual({ protegido: true, estoqueResultante: 1 });

    // o job de virada roda de novo no mesmo dia (falha e reprocessa, por exemplo) — desta vez
    // passando a decisão que já tomou antes.
    const segundaRodada = aplicarCongelamento(0, 2, primeiraRodada);
    expect(segundaRodada).toBe(primeiraRodada);
  });
});

describe('`mvp.md` §5 A-1 — concessão mensal automática', () => {
  const estoqueVazio: EstoqueCongelamento = { quantidade: 0, ultimaConcessaoMes: null };

  it('concede 1 no primeiro processamento do mês', () => {
    const resultado = concederCongelamentoMensal(estoqueVazio, '2026-08');
    expect(resultado).toEqual({ quantidade: 1, ultimaConcessaoMes: '2026-08' });
  });

  it('idempotente: rodar de novo no mesmo mês não concede duas vezes', () => {
    const primeira = concederCongelamentoMensal(estoqueVazio, '2026-08');
    const segunda = concederCongelamentoMensal(primeira, '2026-08');
    expect(segunda).toEqual(primeira);
  });

  it('nunca ultrapassa o estoque máximo do MVP (2, A-1)', () => {
    const quaseCheio: EstoqueCongelamento = { quantidade: 2, ultimaConcessaoMes: '2026-07' };
    const resultado = concederCongelamentoMensal(quaseCheio, '2026-08');
    expect(resultado.quantidade).toBe(2);
  });

  it('concede de novo no mês seguinte', () => {
    const depoisDeAgosto = concederCongelamentoMensal(
      { quantidade: 0, ultimaConcessaoMes: '2026-08' },
      '2026-09'
    );
    expect(depoisDeAgosto).toEqual({ quantidade: 1, ultimaConcessaoMes: '2026-09' });
  });
});
