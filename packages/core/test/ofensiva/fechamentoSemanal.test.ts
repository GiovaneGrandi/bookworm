import { describe, expect, it } from 'vitest';
import { fechamentoSemanal } from '../../src/ofensiva/fechamentoSemanal.js';
import type { AgregadoDiario, DiaDaSemana } from '../../src/ofensiva/tipos.js';

const agregadoVazio = (overrides: Partial<AgregadoDiario> = {}): AgregadoDiario => ({
  dia: '2026-08-10',
  eixo: 'leitura',
  tempoAtivoS: 0,
  paginasCanonicas: 0,
  sessoesValidas: 0,
  sessoesCurtas: 0,
  interacoesQualitativas: 0,
  maiorBlocoContinuoS: 0,
  somaLeituraConsciente: 0,
  distribuicaoEstilo: { focado: 0, metodico: 0, equilibrado: 0 },
  obrasConcluidas: 0,
  ...overrides,
});

describe('RN-04.39 — fechamento semanal', () => {
  it('conta dias cumpridos e soma o tempo total da semana', () => {
    const semana: DiaDaSemana[] = [
      { cumprido: true, agregado: agregadoVazio({ tempoAtivoS: 600 }) },
      { cumprido: true, agregado: agregadoVazio({ tempoAtivoS: 900 }) },
      { cumprido: false, agregado: agregadoVazio({ tempoAtivoS: 0 }) },
    ];
    const fechamento = fechamentoSemanal(semana);
    expect(fechamento.diasCumpridos).toBe(2);
    expect(fechamento.tempoTotalS).toBe(1500);
  });

  it('estilo predominante é o de maior soma na semana', () => {
    const semana: DiaDaSemana[] = [
      {
        cumprido: true,
        agregado: agregadoVazio({ distribuicaoEstilo: { focado: 3, metodico: 1, equilibrado: 0 } }),
      },
      {
        cumprido: true,
        agregado: agregadoVazio({ distribuicaoEstilo: { focado: 1, metodico: 0, equilibrado: 0 } }),
      },
    ];
    expect(fechamentoSemanal(semana).estiloPredominante).toBe('focado');
  });

  it('sem nenhuma sessão na semana, estilo predominante é null', () => {
    const semana: DiaDaSemana[] = [{ cumprido: false, agregado: agregadoVazio() }];
    expect(fechamentoSemanal(semana).estiloPredominante).toBeNull();
  });

  it('comparação com a semana anterior — nunca com outros usuários (P1)', () => {
    const semanaAtual: DiaDaSemana[] = [
      { cumprido: true, agregado: agregadoVazio({ tempoAtivoS: 1000 }) },
    ];
    const semanaAnterior: DiaDaSemana[] = [
      { cumprido: true, agregado: agregadoVazio({ tempoAtivoS: 400 }) },
    ];
    expect(fechamentoSemanal(semanaAtual, semanaAnterior).comparacaoTempoAnteriorS).toBe(600);
  });

  it('primeira semana do usuário: comparação é null, nunca zero (não minta dizendo "igual")', () => {
    const semanaAtual: DiaDaSemana[] = [
      { cumprido: true, agregado: agregadoVazio({ tempoAtivoS: 1000 }) },
    ];
    expect(fechamentoSemanal(semanaAtual, []).comparacaoTempoAnteriorS).toBeNull();
  });
});
