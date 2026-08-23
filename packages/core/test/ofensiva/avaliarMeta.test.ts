import { describe, expect, it } from 'vitest';
import { avaliarMeta } from '../../src/ofensiva/avaliarMeta.js';
import type { AgregadoDoDia, MetaDiaria } from '../../src/ofensiva/tipos.js';

const metaPaginas = (valor: number): MetaDiaria => ({
  eixo: 'leitura',
  unidade: 'paginas',
  valor,
  vigenteDesde: '2026-08-01',
  direcaoAlteracao: 'inicial',
  proximaAlteracaoPermitidaEm: null,
});

const metaMinutos = (valor: number): MetaDiaria => ({ ...metaPaginas(valor), unidade: 'minutos' });

describe('RN-04.1, RN-04.2 — avaliação da meta na unidade escolhida', () => {
  it('meta em páginas compara contra paginasCanonicas do agregado', () => {
    const agregado: AgregadoDoDia = { eixo: 'leitura', tempoAtivoS: 0, paginasCanonicas: 15 };
    expect(avaliarMeta(agregado, metaPaginas(15)).cumprida).toBe(true);
    expect(avaliarMeta(agregado, metaPaginas(16)).cumprida).toBe(false);
  });

  it('meta em minutos compara contra tempoAtivoS/60 do agregado', () => {
    const agregado: AgregadoDoDia = { eixo: 'leitura', tempoAtivoS: 20 * 60, paginasCanonicas: 0 };
    expect(avaliarMeta(agregado, metaMinutos(20)).cumprida).toBe(true);
    expect(avaliarMeta(agregado, metaMinutos(21)).cumprida).toBe(false);
  });

  it('restante nunca fica negativo mesmo superando a meta', () => {
    const agregado: AgregadoDoDia = { eixo: 'leitura', tempoAtivoS: 0, paginasCanonicas: 30 };
    expect(avaliarMeta(agregado, metaPaginas(15)).restante).toBe(0);
  });
});

describe('GAM-04 + RN-04.10 — sessão suspeita cumpre meta', () => {
  it('o agregado de uma sessão suspeita entra na mesma soma de uma válida — cumpre a meta normalmente', () => {
    // RN-04.10 já resolvido a montante: quem monta o AgregadoDoDia decide o que soma (só exclui
    // rejeitada_sobreposicao e descartada). Aqui só se prova que avaliarMeta não distingue origem.
    const agregado: AgregadoDoDia = { eixo: 'leitura', tempoAtivoS: 0, paginasCanonicas: 20 };
    const resultado = avaliarMeta(agregado, metaPaginas(15));
    expect(resultado.cumprida).toBe(true);
  });
});

describe('RN-04.10f — dia já celebrado não é revertido', () => {
  it('mantém cumprida mesmo quando o agregado recalculado (sessão invalidada) já não bate a meta', () => {
    const agregadoDepoisDaInvalidacao: AgregadoDoDia = {
      eixo: 'leitura',
      tempoAtivoS: 0,
      paginasCanonicas: 3, // bem abaixo da meta de 15 — a sessão que sustentava o dia foi descontada
    };

    const resultado = avaliarMeta(agregadoDepoisDaInvalidacao, metaPaginas(15), {
      cumprido: true,
      celebracaoEstado: 'exibida',
    });

    expect(resultado.cumprida).toBe(true);
  });

  it('enquanto a celebração está só pendente (nunca exibida), o recálculo ainda vale', () => {
    const agregado: AgregadoDoDia = { eixo: 'leitura', tempoAtivoS: 0, paginasCanonicas: 3 };
    const resultado = avaliarMeta(agregado, metaPaginas(15), {
      cumprido: true,
      celebracaoEstado: 'pendente',
    });
    expect(resultado.cumprida).toBe(false);
  });
});
