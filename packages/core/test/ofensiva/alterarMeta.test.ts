import { describe, expect, it } from 'vitest';
import { alterarMeta } from '../../src/ofensiva/alterarMeta.js';
import type { MetaDiaria } from '../../src/ofensiva/tipos.js';

const metaVigente = (overrides: Partial<MetaDiaria> = {}): MetaDiaria => ({
  eixo: 'leitura',
  unidade: 'minutos',
  valor: 20,
  vigenteDesde: '2026-08-01',
  direcaoAlteracao: 'inicial',
  proximaAlteracaoPermitidaEm: null,
  ...overrides,
});

describe('GAM-01 + RN-04.7 — alteração vale a partir de amanhã', () => {
  it('a meta resultante vige a partir do dia seguinte, nunca hoje', () => {
    const resultado = alterarMeta(metaVigente(), { unidade: 'minutos', valor: 30 }, '2026-08-15');
    expect(resultado.permitida).toBe(true);
    if (resultado.permitida) {
      expect(resultado.metaResultante.vigenteDesde).toBe('2026-08-16');
    }
  });
});

describe('RN-04.6 — atrito de tempo bloqueia um segundo aumento antes do intervalo', () => {
  it('bloqueia e informa a data em que poderá alterar de novo', () => {
    const ontem = alterarMeta(metaVigente(), { unidade: 'minutos', valor: 30 }, '2026-08-14');
    expect(ontem.permitida).toBe(true);
    const metaAposOntem = ontem.permitida ? ontem.metaResultante : metaVigente();

    const hoje = alterarMeta(metaAposOntem, { unidade: 'minutos', valor: 40 }, '2026-08-15');
    expect(hoje).toEqual({
      permitida: false,
      motivo: 'intervalo_minimo',
      podeAlterarEm: metaAposOntem.proximaAlteracaoPermitidaEm,
    });
  });

  it('libera exatamente no dia do intervalo mínimo', () => {
    const meta = metaVigente({ proximaAlteracaoPermitidaEm: '2026-08-22' });
    const resultado = alterarMeta(meta, { unidade: 'minutos', valor: 25 }, '2026-08-22');
    expect(resultado.permitida).toBe(true);
  });
});

describe('RN-04.6a — reduzir é sempre livre', () => {
  it('aceita imediatamente mesmo dentro do intervalo mínimo de um aumento recente', () => {
    const meta = metaVigente({ proximaAlteracaoPermitidaEm: '2026-08-30' });
    const resultado = alterarMeta(meta, { unidade: 'minutos', valor: 10 }, '2026-08-15');
    expect(resultado.permitida).toBe(true);
    if (resultado.permitida) {
      expect(resultado.metaResultante.direcaoAlteracao).toBe('reducao');
      // a redução não abre nem fecha janela — o intervalo pendente do aumento anterior persiste.
      expect(resultado.metaResultante.proximaAlteracaoPermitidaEm).toBe('2026-08-30');
    }
  });

  it('uma redução não bloqueia a redução seguinte', () => {
    const primeira = alterarMeta(metaVigente(), { unidade: 'minutos', valor: 10 }, '2026-08-15');
    expect(primeira.permitida).toBe(true);
    const metaReduzida = primeira.permitida ? primeira.metaResultante : metaVigente();

    const segunda = alterarMeta(metaReduzida, { unidade: 'minutos', valor: 5 }, '2026-08-16');
    expect(segunda.permitida).toBe(true);
  });
});

describe('RN-04.4 — faixas permitidas', () => {
  it('rejeita minutos de leitura fora de 5–480', () => {
    expect(alterarMeta(null, { unidade: 'minutos', valor: 4 }, '2026-08-15')).toEqual({
      permitida: false,
      motivo: 'fora_da_faixa',
    });
    expect(alterarMeta(null, { unidade: 'minutos', valor: 481 }, '2026-08-15').permitida).toBe(
      false
    );
  });

  it('aceita os limites inclusive', () => {
    expect(alterarMeta(null, { unidade: 'paginas', valor: 5 }, '2026-08-15').permitida).toBe(true);
    expect(alterarMeta(null, { unidade: 'paginas', valor: 200 }, '2026-08-15').permitida).toBe(
      true
    );
  });
});

describe('RN-04.8 — trocar de unidade segue as mesmas regras de atrito', () => {
  it('troca de páginas para minutos exige o mesmo intervalo mínimo de um aumento', () => {
    const meta = metaVigente({
      unidade: 'paginas',
      valor: 15,
      proximaAlteracaoPermitidaEm: '2026-08-20',
    });
    const resultado = alterarMeta(meta, { unidade: 'minutos', valor: 15 }, '2026-08-15');
    expect(resultado).toEqual({
      permitida: false,
      motivo: 'intervalo_minimo',
      podeAlterarEm: '2026-08-20',
    });
  });
});

describe('RN-04.9 — primeira meta do usuário não tem meta anterior', () => {
  it('aceita sem checar intervalo quando metaAtual é null', () => {
    const resultado = alterarMeta(null, { unidade: 'paginas', valor: 15 }, '2026-08-15');
    expect(resultado.permitida).toBe(true);
    if (resultado.permitida) expect(resultado.metaResultante.direcaoAlteracao).toBe('inicial');
  });
});
