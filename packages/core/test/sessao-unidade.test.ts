// Casos que não cabem no formato de traço/esperado do runner genérico (RN-TEL.49): comparações
// diretas entre duas apurações, não a verificação de uma só.
import { describe, expect, it } from 'vitest';
import { apurarTempoAtivo } from '../src/sessao/apurarTempoAtivo.js';
import type { TracoDeEventos } from '../src/sessao/tipos.js';

describe('RN-TEL.13 — idle é retroativo, sistema é imediato', () => {
  it('mesmo silêncio de 5 minutos: idle subtrai tudo, sistema só a partir do sinal', () => {
    const inicio = 1_700_000_000_000;

    // idle: nenhum sinal por 5 minutos após a última interação em mono=1000.
    const tracoIdle: TracoDeEventos = {
      fuso: 'America/Sao_Paulo',
      eventos: [
        { tipo: 'sessao_iniciada', parede: inicio, mono: 0, caracteres: 0 },
        { tipo: 'posicao_alterada', parede: inicio + 1000, mono: 1000, caracteres: 100 },
        { tipo: 'sessao_encerrada', parede: inicio + 301_000, mono: 301_000 },
      ],
    };

    // sistema: o mesmo silêncio de 5 minutos, mas anunciado por um sinal explícito de segundo
    // plano no mesmo instante (mono=1000) em que a última interação do caso idle ocorreu.
    const tracoSistema: TracoDeEventos = {
      fuso: 'America/Sao_Paulo',
      eventos: [
        { tipo: 'sessao_iniciada', parede: inicio, mono: 0, caracteres: 0 },
        { tipo: 'posicao_alterada', parede: inicio + 1000, mono: 1000, caracteres: 100 },
        { tipo: 'pausa_iniciada', parede: inicio + 1000, mono: 1000, pausa: 'sistema' },
        { tipo: 'pausa_encerrada', parede: inicio + 301_000, mono: 301_000 },
        { tipo: 'sessao_encerrada', parede: inicio + 301_000, mono: 301_000 },
      ],
    };

    const idle = apurarTempoAtivo(tracoIdle);
    const sistema = apurarTempoAtivo(tracoSistema);

    // Nos dois casos o traço bruto é idêntico (301s) e a pausa dura os mesmos 300s — a diferença
    // está em onde ela é contada a partir, e isso não muda a duração da pausa neste caso
    // controlado (os dois sinais coincidem em mono=1000). O teste que prova a diferença de
    // verdade é RN-03.11.json vs SES-02.json: mesma duração de silêncio, tempo ativo diferente,
    // porque nesses dois traços a última interação e o sinal de sistema **não** coincidem.
    expect(idle.tempoBrutoS).toBe(sistema.tempoBrutoS);
    expect(idle.pausas).toHaveLength(1);
    expect(sistema.pausas).toHaveLength(1);
    expect(idle.pausas[0]!.tipo).toBe('idle');
    expect(sistema.pausas[0]!.tipo).toBe('sistema');
    expect(idle.tempoAtivoS).toBe(sistema.tempoAtivoS);
  });

  it('quando o sinal de sistema chega antes do que o idle teria detectado, sistema preserva mais tempo ativo', () => {
    const inicio = 1_700_000_000_000;
    // Última interação em mono=1000, sessão termina em mono=121000 sem mais nenhum sinal. Sem
    // sinal de sistema, isso é um único silêncio de 120s — inteiramente subtraído, retroativo à
    // última interação (RN-03.10). Um sinal de sistema chegando bem antes, em mono=50000 (49s
    // depois da última interação — a pessoa ainda estava lendo até então), faz a pausa começar
    // dali: só os 71s finais viram pausa, e os 49s entre a interação e o sinal ficam ativos.
    const tracoIdle: TracoDeEventos = {
      fuso: 'America/Sao_Paulo',
      eventos: [
        { tipo: 'sessao_iniciada', parede: inicio, mono: 0, caracteres: 0 },
        { tipo: 'posicao_alterada', parede: inicio + 1000, mono: 1000, caracteres: 100 },
        { tipo: 'sessao_encerrada', parede: inicio + 121_000, mono: 121_000 },
      ],
    };
    const tracoSistema: TracoDeEventos = {
      fuso: 'America/Sao_Paulo',
      eventos: [
        { tipo: 'sessao_iniciada', parede: inicio, mono: 0, caracteres: 0 },
        { tipo: 'posicao_alterada', parede: inicio + 1000, mono: 1000, caracteres: 100 },
        { tipo: 'pausa_iniciada', parede: inicio + 50_000, mono: 50_000, pausa: 'sistema' },
        { tipo: 'pausa_encerrada', parede: inicio + 121_000, mono: 121_000 },
        { tipo: 'sessao_encerrada', parede: inicio + 121_000, mono: 121_000 },
      ],
    };

    const idle = apurarTempoAtivo(tracoIdle);
    const sistema = apurarTempoAtivo(tracoSistema);

    // idle: silêncio de 120s desde a última interação, subtraído por completo → tempo ativo = 1s.
    expect(idle.tempoAtivoS).toBe(1);
    // sistema: só os 71s finais (desde o sinal) viram pausa → tempo ativo = 50s — se a pausa
    // fosse tratada como idle (retroativa), teria devolvido os 49s intermediários como ativos por
    // engano no sentido oposto (RN-TEL.13: implementar idle como sistema devolveria tempo que não
    // existiu; aqui é o inverso — implementar sistema como idle apagaria tempo que existiu de
    // verdade).
    expect(sistema.tempoAtivoS).toBe(50);
    expect(sistema.tempoAtivoS).toBeGreaterThan(idle.tempoAtivoS);
  });
});
