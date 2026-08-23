import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mesclarAgregados, recalcularAgregados } from '../../src/ofensiva/recalcularAgregados.js';
import type { AgregadoDiario, SessaoParaAgregado } from '../../src/ofensiva/tipos.js';

function normalizarPrecisao(agregados: AgregadoDiario[]): AgregadoDiario[] {
  return agregados.map((a) => ({
    ...a,
    paginasCanonicas: Math.round(a.paginasCanonicas * 1e6) / 1e6,
  }));
}

const sessao = (overrides: Partial<SessaoParaAgregado> = {}): SessaoParaAgregado => ({
  dia: '2026-08-15',
  eixo: 'leitura',
  status: 'valida',
  tempoAtivoS: 600,
  caracteres: 3000,
  interacoesQualitativas: 2,
  maiorBlocoContinuoS: 500,
  scoreLeituraConsciente: 80,
  estilo: 'focado',
  obraConcluida: false,
  ...overrides,
});

describe('RN-03.30, RN-03.31 — agregado por dia e por eixo', () => {
  it('soma tempo ativo, páginas e interações de duas sessões no mesmo dia', () => {
    const [agregado] = recalcularAgregados([
      sessao({ tempoAtivoS: 600, caracteres: 1500, interacoesQualitativas: 1 }),
      sessao({ tempoAtivoS: 300, caracteres: 750, interacoesQualitativas: 2 }),
    ]);

    expect(agregado!.tempoAtivoS).toBe(900);
    expect(agregado!.paginasCanonicas).toBe(1.5);
    expect(agregado!.interacoesQualitativas).toBe(3);
  });

  it('mantém dias e eixos diferentes em agregados separados', () => {
    const agregados = recalcularAgregados([
      sessao({ dia: '2026-08-15' }),
      sessao({ dia: '2026-08-16' }),
      sessao({ dia: '2026-08-15', eixo: 'escrita' }),
    ]);
    expect(agregados).toHaveLength(3);
  });

  it('conta sessões válidas e curtas separadamente, e distribui por estilo', () => {
    const agregados = recalcularAgregados([
      sessao({ status: 'valida', estilo: 'focado' }),
      sessao({ status: 'curta', estilo: 'metodico' }),
      sessao({ status: 'suspeita', estilo: 'equilibrado' }),
    ]);
    const [agregado] = agregados;
    expect(agregado!.sessoesValidas).toBe(1);
    expect(agregado!.sessoesCurtas).toBe(1);
    expect(agregado!.distribuicaoEstilo).toEqual({ focado: 1, metodico: 1, equilibrado: 1 });
  });

  it('maiorBlocoContinuoS é o maior entre as sessões do dia, não a soma', () => {
    const [agregado] = recalcularAgregados([
      sessao({ maiorBlocoContinuoS: 300 }),
      sessao({ maiorBlocoContinuoS: 900 }),
      sessao({ maiorBlocoContinuoS: 500 }),
    ]);
    expect(agregado!.maiorBlocoContinuoS).toBe(900);
  });
});

describe('RN-03.32 — agregado recalculado do zero ≡ agregado incremental', () => {
  const arbitrarioDeSessao = fc
    .record({
      dia: fc.constantFrom('2026-08-15', '2026-08-16', '2026-08-17'),
      status: fc.constantFrom('valida' as const, 'curta' as const, 'suspeita' as const),
      tempoAtivoS: fc.integer({ min: 0, max: 3600 }),
      caracteres: fc.integer({ min: 0, max: 20000 }),
      interacoesQualitativas: fc.integer({ min: 0, max: 20 }),
      maiorBlocoContinuoS: fc.integer({ min: 0, max: 3600 }),
      scoreLeituraConsciente: fc.integer({ min: 0, max: 100 }),
      estilo: fc.constantFrom('focado' as const, 'metodico' as const, 'equilibrado' as const),
      obraConcluida: fc.boolean(),
    })
    .map((s): SessaoParaAgregado => ({ ...s, eixo: 'leitura' }));

  it('recalcular tudo de uma vez dá o mesmo total que recalcular em dois lotes e mesclar', () => {
    fc.assert(
      fc.property(
        fc.array(arbitrarioDeSessao, { minLength: 0, maxLength: 30 }),
        fc.array(arbitrarioDeSessao, { minLength: 0, maxLength: 30 }),
        (loteA, loteB) => {
          const tudoDeUmaVez = recalcularAgregados([...loteA, ...loteB]);
          const porLotesEMesclado = mesclarAgregados(
            recalcularAgregados(loteA),
            recalcularAgregados(loteB)
          );

          // `paginasCanonicas` soma ponto flutuante em ordens diferentes nos dois caminhos — o
          // ruído de precisão (ex.: ...665 vs ...667 na 15ª casa) não é uma divergência real.
          expect(normalizarPrecisao(porLotesEMesclado)).toEqual(normalizarPrecisao(tudoDeUmaVez));
        }
      ),
      { numRuns: 500 }
    );
  });
});
