import { CONSTANTES_SESSAO_PADRAO, type ConstantesSessao } from './constantes.js';
import type { ApuracaoTempoAtivo, EventoTraco, Pausa, TracoDeEventos } from './tipos.js';

const SINAIS = new Set<EventoTraco['tipo']>(['posicao_alterada', 'interacao_qualitativa']);

/**
 * RN-TEL.48 — função pura, relógio como parâmetro (aqui, os carimbos do próprio traço). Percorre
 * os eventos em ordem e mantém duas noções de "última atividade" que nunca se confundem
 * (RN-TEL.13):
 *
 * - pausa `sistema`: começa no instante do sinal (`pausa_iniciada`) e termina no instante do
 *   sinal de retorno (`pausa_encerrada`) — sem espera, sem retroatividade.
 * - pausa `idle`: não tem evento próprio. É descoberta ao ver o próximo sinal (`posicao_alterada`
 *   ou `interacao_qualitativa`) chegar tarde demais, e nesse caso o intervalo inteiro desde a
 *   última interação vira pausa — não só a parte além do timeout (RN-03.10, RN-TEL.13: implementar
 *   como `sistema`, subtraindo só a partir da detecção, devolveria os 90s de graça como tempo
 *   ativo indevido).
 *
 * Uma pausa `sistema` mais curta que `PAUSA_GRACA_SEGUNDOS` é descartada (RN-TEL.14): não
 * interrompe o bloco de foco, e por isso não reinicia o relógio de idle.
 */
export function apurarTempoAtivo(
  traco: TracoDeEventos,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): ApuracaoTempoAtivo {
  const eventos = traco.eventos;
  if (eventos.length === 0) {
    return { tempoBrutoS: 0, tempoAtivoS: 0, pausas: [] };
  }

  const idleTimeoutMs = constantes.IDLE_TIMEOUT_SEGUNDOS * 1000;
  const gracaMs = constantes.PAUSA_GRACA_SEGUNDOS * 1000;

  const inicioMono = eventos[0]!.mono;
  let fimMono = eventos[eventos.length - 1]!.mono;

  const pausas: Pausa[] = [];
  let ultimaInteracaoMono = inicioMono;
  let sistemaAbertaEmMono: number | null = null;

  const registrarIdleSeNecessario = (ateMono: number) => {
    const gap = ateMono - ultimaInteracaoMono;
    if (gap > idleTimeoutMs) {
      pausas.push(construirPausa('idle', ultimaInteracaoMono, ateMono, constantes));
    }
  };

  for (const evento of eventos) {
    if (evento.tipo === 'pausa_iniciada' && evento.pausa === 'sistema') {
      // Fecha primeiro qualquer idle pendente até o instante do sinal — a pausa de sistema
      // assume a partir daqui (RN-TEL.13: sistema é imediata, não retroativa).
      registrarIdleSeNecessario(evento.mono);
      sistemaAbertaEmMono = evento.mono;
      continue;
    }

    if (evento.tipo === 'pausa_encerrada') {
      if (sistemaAbertaEmMono !== null) {
        const duracaoMs = evento.mono - sistemaAbertaEmMono;
        if (duracaoMs >= gracaMs) {
          pausas.push(construirPausa('sistema', sistemaAbertaEmMono, evento.mono, constantes));
        }
        // Graça ou não, a retomada reinicia o relógio de idle a partir daqui: o app voltou ao
        // primeiro plano e o silêncio anterior já está contabilizado (ou foi graça, e RN-TEL.14
        // manda não quebrar nada).
        ultimaInteracaoMono = evento.mono;
        sistemaAbertaEmMono = null;
      }
      continue;
    }

    if (SINAIS.has(evento.tipo) && sistemaAbertaEmMono === null) {
      registrarIdleSeNecessario(evento.mono);
      ultimaInteracaoMono = evento.mono;
      continue;
    }

    if (evento.tipo === 'sessao_encerrada') {
      fimMono = evento.mono;
    }
  }

  // Sessão terminou com uma pausa de sistema ainda aberta (ex.: `orfa`, RN-TEL.41) — fecha no
  // último carimbo conhecido, e uma idle pendente até o fim também precisa entrar.
  if (sistemaAbertaEmMono !== null) {
    const duracaoMs = fimMono - sistemaAbertaEmMono;
    if (duracaoMs >= gracaMs) {
      pausas.push(construirPausa('sistema', sistemaAbertaEmMono, fimMono, constantes));
    }
  } else {
    registrarIdleSeNecessario(fimMono);
  }

  pausas.sort((a, b) => a.inicioMono - b.inicioMono);

  const tempoBrutoMs = fimMono - inicioMono;
  const somaPausasMs = pausas.reduce((soma, p) => soma + (p.fimMono - p.inicioMono), 0);

  // RN-TEL.11 — arredondamento uma única vez: os dois totais (bruto e soma de pausas) são
  // arredondados aqui, juntos, e o tempo ativo sai da subtração entre eles — nunca de um
  // arredondamento próprio. É o que garante `tempo_ativo + soma(pausas) = tempo_bruto` com
  // tolerância zero (RN-TEL.50), mesmo quando o número de pausas varia.
  const tempoBrutoS = arredondarSegundos(tempoBrutoMs);
  const somaPausasS = arredondarSegundos(somaPausasMs);

  return {
    tempoBrutoS,
    tempoAtivoS: tempoBrutoS - somaPausasS,
    pausas,
  };
}

function construirPausa(
  tipo: Pausa['tipo'],
  inicioMono: number,
  fimMono: number,
  constantes: ConstantesSessao
): Pausa {
  const duracaoMs = fimMono - inicioMono;
  const duracaoS = duracaoMs / 1000;
  return {
    tipo,
    inicioMono,
    fimMono,
    duracaoS,
    classificacao: duracaoS < constantes.RETOMADA_RAPIDA_SEGUNDOS ? 'interrupcao' : 'pausa_longa',
  };
}

// RN-TEL.11 — arredondamento uma única vez, aqui, na apuração final. Nenhuma outra função deste
// pacote arredonda milissegundos.
function arredondarSegundos(ms: number): number {
  return Math.round(ms / 1000);
}
