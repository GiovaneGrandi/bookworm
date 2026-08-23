import { describe, expect, it } from 'vitest';
import { recalcularOfensiva } from '../../src/ofensiva/recalcularOfensiva.js';
import type { DiaParaOfensiva } from '../../src/ofensiva/tipos.js';

const dia = (d: string, cumprido: boolean, protegido = false): DiaParaOfensiva => ({
  dia: d,
  cumprido,
  protegidoPorCongelamento: protegido,
});

// Gera `quantidade` datas civis sequenciais a partir de `inicioISO` — só para montar séries longas
// de teste com strings que ordenam corretamente por `localeCompare` (evita ids como 'd0'..'d40',
// que ordenariam como texto: 'd0' < 'd10' < 'd2').
function datasSequenciais(quantidade: number, inicioISO: string): string[] {
  const inicio = new Date(`${inicioISO}T00:00:00Z`);
  return Array.from({ length: quantidade }, (_, i) => {
    const d = new Date(inicio);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

describe('RN-04.11 — ofensiva é derivada, não incrementada', () => {
  const dias: DiaParaOfensiva[] = [
    dia('2026-08-01', true),
    dia('2026-08-02', true),
    dia('2026-08-03', true),
    dia('2026-08-04', false),
    dia('2026-08-05', true),
  ];

  it('o resultado independe da ordem de chegada dos dias', () => {
    const emOrdem = recalcularOfensiva('leitura', dias);
    const foraDeOrdem = recalcularOfensiva('leitura', [...dias].reverse());
    const embaralhado = recalcularOfensiva('leitura', [
      dias[2]!,
      dias[0]!,
      dias[4]!,
      dias[1]!,
      dias[3]!,
    ]);

    expect(foraDeOrdem).toEqual(emOrdem);
    expect(embaralhado).toEqual(emOrdem);
  });

  it('a contagem corrente reflete só a sequência desde a última quebra', () => {
    const ofensiva = recalcularOfensiva('leitura', dias);
    expect(ofensiva.contagemAtual).toBe(1); // só 08-05, porque 08-04 quebrou
    expect(ofensiva.melhorMarca).toBe(3); // 08-01 a 08-03
    expect(ofensiva.acervoDiasCumpridos).toBe(4);
  });
});

describe('RN-03.16 — sessão offline atrasada recompõe a ofensiva retroativamente', () => {
  it('preencher o dia que faltava une as duas sequências numa só, sem precisar corrigir nada manualmente', () => {
    const semODiaAtrasado: DiaParaOfensiva[] = [
      dia('2026-08-01', true),
      dia('2026-08-02', true),
      dia('2026-08-03', false), // ainda não chegou a sessão offline deste dia
      dia('2026-08-04', true),
    ];
    const antesDaReconciliacao = recalcularOfensiva('leitura', semODiaAtrasado);
    expect(antesDaReconciliacao.contagemAtual).toBe(1);
    expect(antesDaReconciliacao.estado).toBe('ativa');

    const comODiaReconciliado = semODiaAtrasado.map((d) =>
      d.dia === '2026-08-03' ? dia('2026-08-03', true) : d
    );
    const depoisDaReconciliacao = recalcularOfensiva('leitura', comODiaReconciliado);

    expect(depoisDaReconciliacao.contagemAtual).toBe(4);
    expect(depoisDaReconciliacao.estado).toBe('ativa');
  });
});

describe('RN-04.19 — dia protegido preserva a contagem, não a incrementa', () => {
  it('GAM-08: ofensiva de 23 dias, um dia não cumprido protegido, permanece em 23', () => {
    const vinteETresDias = Array.from({ length: 23 }, (_, i) =>
      dia(`2026-07-${String(i + 1).padStart(2, '0')}`, true)
    );
    const comDiaProtegido = [...vinteETresDias, dia('2026-08-01', false, true)];

    const ofensiva = recalcularOfensiva('leitura', comDiaProtegido);
    expect(ofensiva.contagemAtual).toBe(23);
    expect(ofensiva.estado).toBe('ativa');
  });

  it('um dia protegido não conta para o acervo (não é "cumprido")', () => {
    const dias = [dia('2026-08-01', true), dia('2026-08-02', false, true)];
    const ofensiva = recalcularOfensiva('leitura', dias);
    expect(ofensiva.acervoDiasCumpridos).toBe(1);
  });

  it('um dia protegido não estica o recorde além do que já era', () => {
    const dias = [dia('2026-08-01', true), dia('2026-08-02', true), dia('2026-08-03', false, true)];
    const ofensiva = recalcularOfensiva('leitura', dias);
    expect(ofensiva.melhorMarca).toBe(2);
    expect(ofensiva.contagemAtual).toBe(2);
  });
});

describe('RN-04.14a — dormência mostra três números: corrente (zero), encerrada e recorde', () => {
  it('GAM-09: ofensiva de 23 dias quebrada, recorde de 41 em algum momento anterior', () => {
    const datas = datasSequenciais(41 + 1 + 23 + 1, '2026-01-01');
    const construcaoAte41 = datas.slice(0, 41).map((d) => dia(d, true));
    const primeiraQuebra = dia(datas[41]!, false);
    const vinteETres = datas.slice(42, 65).map((d) => dia(d, true));
    const segundaQuebra = dia(datas[65]!, false); // é essa quebra que deixa a ofensiva dormente

    const ofensiva = recalcularOfensiva('leitura', [
      ...construcaoAte41,
      primeiraQuebra,
      ...vinteETres,
      segundaQuebra,
    ]);

    expect(ofensiva.contagemAtual).toBe(0);
    expect(ofensiva.contagemEncerrada).toBe(23);
    expect(ofensiva.melhorMarca).toBe(41);
    expect(ofensiva.estado).toBe('dormente');
  });
});

describe('RN-04.26 — retomada restaura o viço mesmo com a ofensiva em 1', () => {
  it('um único dia cumprido depois da dormência já marca estado ativa', () => {
    const dias = [dia('2026-08-01', true), dia('2026-08-02', false), dia('2026-08-03', true)];
    const ofensiva = recalcularOfensiva('leitura', dias);
    expect(ofensiva.estado).toBe('ativa');
    expect(ofensiva.contagemAtual).toBe(1);
    // o acervo histórico permanece intacto — nunca decresce (RN-04.27).
    expect(ofensiva.acervoDiasCumpridos).toBe(2);
  });
});

describe('Dois eixos modelados, um exposto (RN-04.12, R-5)', () => {
  it('o eixo escrita existe no tipo e devolve uma ofensiva vazia/dormente no MVP, sem dado', () => {
    const ofensiva = recalcularOfensiva('escrita', []);
    expect(ofensiva.eixo).toBe('escrita');
    expect(ofensiva.contagemAtual).toBe(0);
    expect(ofensiva.acervoDiasCumpridos).toBe(0);
    expect(ofensiva.estado).toBe('dormente');
  });
});
