// RN-TEL.50 — invariantes verificados por teste de propriedade, com traços gerados
// aleatoriamente. Um traço aleatório aqui é uma sequência de movimentos de posição e pausas de
// sistema com durações e lacunas arbitrárias — não precisa fazer sentido como leitura real, só
// obedecer à forma do traço (mono crescente, pausas bem formadas).
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { apurarTempoAtivo } from '../src/sessao/apurarTempoAtivo.js';
import { apurarVolume } from '../src/sessao/apurarVolume.js';
import { CONSTANTES_SESSAO_PADRAO } from '../src/sessao/constantes.js';
import { apurarTempoAtivoDividido } from '../src/sessao/dividirNaViradaDoDia.js';
import type { EventoTraco, TracoDeEventos } from '../src/sessao/tipos.js';

const NUM_EXECUCOES = 1000;

/**
 * Gera um traço válido: `sessao_iniciada`, uma sequência de passos (avanço de posição, ou pausa
 * de sistema completa), e `sessao_encerrada`. `mono` sempre crescente; `parede` acompanha `mono`
 * a partir de uma origem aleatória, sem deriva — a deriva de relógio é assunto de `RN-TEL.10`,
 * fora do que este teste verifica.
 */
const arbitrarioDeTraco = fc
  .record({
    paredeOrigem: fc.integer({ min: 1_700_000_000_000, max: 1_800_000_000_000 }),
    passos: fc.array(
      fc.oneof(
        fc.record({
          tipo: fc.constant('movimento' as const),
          deltaMono: fc.integer({ min: 1, max: 10 * 60 * 1000 }),
          deltaCaracteres: fc.integer({ min: 0, max: 5000 }),
        }),
        fc.record({
          tipo: fc.constant('pausaSistema' as const),
          deltaAteInicio: fc.integer({ min: 1, max: 60_000 }),
          duracaoPausa: fc.integer({ min: 1, max: 40 * 60 * 1000 }),
        })
      ),
      { minLength: 0, maxLength: 12 }
    ),
  })
  .map(({ paredeOrigem, passos }): TracoDeEventos => {
    const eventos: EventoTraco[] = [];
    let mono = 0;
    let caracteres = 0;
    eventos.push({ tipo: 'sessao_iniciada', parede: paredeOrigem, mono, caracteres });

    for (const passo of passos) {
      if (passo.tipo === 'movimento') {
        mono += passo.deltaMono;
        caracteres += passo.deltaCaracteres;
        eventos.push({
          tipo: 'posicao_alterada',
          parede: paredeOrigem + mono,
          mono,
          caracteres,
        });
      } else {
        mono += passo.deltaAteInicio;
        eventos.push({
          tipo: 'pausa_iniciada',
          parede: paredeOrigem + mono,
          mono,
          pausa: 'sistema',
        });
        mono += passo.duracaoPausa;
        eventos.push({ tipo: 'pausa_encerrada', parede: paredeOrigem + mono, mono });
      }
    }

    mono += 1000;
    eventos.push({ tipo: 'sessao_encerrada', parede: paredeOrigem + mono, mono });
    return { fuso: 'America/Sao_Paulo', eventos };
  });

describe('RN-TEL.50 — invariantes de propriedade', () => {
  it('tempo_ativo ≤ tempo_bruto, sempre', () => {
    fc.assert(
      fc.property(arbitrarioDeTraco, (traco) => {
        const { tempoAtivoS, tempoBrutoS } = apurarTempoAtivo(traco);
        expect(tempoAtivoS).toBeLessThanOrEqual(tempoBrutoS);
      }),
      { numRuns: NUM_EXECUCOES }
    );
  });

  it('tempo_ativo + soma(pausas) = tempo_bruto, tolerância zero', () => {
    fc.assert(
      fc.property(arbitrarioDeTraco, (traco) => {
        const { tempoAtivoS, tempoBrutoS, pausas } = apurarTempoAtivo(traco);
        const somaPausas = Math.round(pausas.reduce((soma, p) => soma + p.duracaoS, 0));
        expect(tempoAtivoS + somaPausas).toBe(tempoBrutoS);
      }),
      { numRuns: NUM_EXECUCOES }
    );
  });

  it('volume ≤ RITMO_MAXIMO_FISICO × tempo_ativo, no total', () => {
    fc.assert(
      fc.property(arbitrarioDeTraco, (traco) => {
        const { tempoAtivoS } = apurarTempoAtivo(traco);
        const { caracteres } = apurarVolume(traco);
        const teto = CONSTANTES_SESSAO_PADRAO.RITMO_MAXIMO_FISICO * (tempoAtivoS / 60);
        // +1 de folga para o arredondamento de `caracteres` (RN-TEL.21 arredonda só na borda).
        expect(caracteres).toBeLessThanOrEqual(teto + 1);
      }),
      { numRuns: NUM_EXECUCOES }
    );
  });

  it('reprocessar o mesmo traço duas vezes dá o mesmo resultado', () => {
    fc.assert(
      fc.property(arbitrarioDeTraco, (traco) => {
        const primeira = apurarTempoAtivo(traco);
        const segunda = apurarTempoAtivo(traco);
        expect(segunda).toEqual(primeira);

        const volumePrimeiro = apurarVolume(traco);
        const volumeSegundo = apurarVolume(traco);
        expect(volumeSegundo).toEqual(volumePrimeiro);
      }),
      { numRuns: NUM_EXECUCOES }
    );
  });

  it('sessão dividida na virada do dia não perde nem ganha um segundo', () => {
    fc.assert(
      fc.property(arbitrarioDeTraco, (traco) => {
        const original = apurarTempoAtivo(traco);
        const partes = apurarTempoAtivoDividido(traco);

        const somaBruto = partes.reduce((s, p) => s + p.tempoBrutoS, 0);
        const somaAtivo = partes.reduce((s, p) => s + p.tempoAtivoS, 0);

        expect(somaBruto).toBe(original.tempoBrutoS);
        expect(somaAtivo).toBe(original.tempoAtivoS);
      }),
      { numRuns: NUM_EXECUCOES }
    );
  });
});
