import { apurarTempoAtivo } from './apurarTempoAtivo.js';
import { CONSTANTES_SESSAO_PADRAO, type ConstantesSessao } from './constantes.js';
import type { ApuracaoTempoAtivo, EventoTraco, TracoDeEventos } from './tipos.js';

export type ParteDoDia = {
  traco: TracoDeEventos;
  /** Dia civil local, `YYYY-MM-DD`, no fuso do traço (RN-TEL.46). */
  dia: string;
};

/**
 * RN-03.6, RN-TEL.44–RN-TEL.47 — divide um traço nas fronteiras de meia-noite **local** (dia
 * civil, não bloco de 24h — RN-TEL.46) que caem estritamente entre o primeiro e o último evento.
 * O fuso é o vigente no início da sessão e vale para o traço inteiro (RN-TEL.47: viagem no meio
 * da sessão não muda o dia da sessão em curso).
 *
 * A fronteira é o instante da meia-noite em si: a parte anterior ganha um `sessao_encerrada`
 * sintético e a seguinte um `sessao_iniciada` sintético, ambos no mesmo `mono` interpolado — não
 * se perde nem se ganha um milissegundo (RN-TEL.50), porque não há gap: o fim de uma parte e o
 * início da outra são o mesmo instante.
 */
export function dividirNaViradaDoDia(traco: TracoDeEventos): ParteDoDia[] {
  const eventos = traco.eventos;
  if (eventos.length === 0) return [];

  const fuso = traco.fuso;
  const inicio = eventos[0]!;
  const fim = eventos[eventos.length - 1]!;

  const fronteiras = meiasNoitesEntre(inicio.parede, fim.parede, fuso);
  if (fronteiras.length === 0) {
    return [{ traco, dia: diaLocal(inicio.parede, fuso) }];
  }

  const partes: ParteDoDia[] = [];
  let restantes = eventos;
  let paredeInicioParte = inicio.parede;

  for (const fronteiraParede of fronteiras) {
    const monoNaFronteira = interpolarMono(restantes, fronteiraParede);
    const antesDaFronteira = restantes.filter((e) => e.parede < fronteiraParede);
    const eventoEncerramento: EventoTraco = {
      tipo: 'sessao_encerrada',
      parede: fronteiraParede,
      mono: monoNaFronteira,
      motivo: 'virada_do_dia',
    };
    partes.push({
      traco: { fuso, eventos: [...antesDaFronteira, eventoEncerramento] },
      dia: diaLocal(paredeInicioParte, fuso),
    });

    const eventoAbertura: EventoTraco = {
      tipo: 'sessao_iniciada',
      parede: fronteiraParede,
      mono: monoNaFronteira,
    };
    restantes = [eventoAbertura, ...restantes.filter((e) => e.parede >= fronteiraParede)];
    paredeInicioParte = fronteiraParede;
  }

  partes.push({ traco: { fuso, eventos: restantes }, dia: diaLocal(paredeInicioParte, fuso) });
  return partes;
}

export type ParteApurada = ParteDoDia & ApuracaoTempoAtivo;

/**
 * `dividirNaViradaDoDia` + `apurarTempoAtivo` por parte, com uma correção: arredondar cada parte
 * de forma independente (RN-TEL.11, um arredondamento por apuração) não garante que a soma bata
 * com o arredondamento do traço inteiro — erro de até ±1s por fronteira, inevitável ao arredondar
 * pedaços separadamente. RN-TEL.50 exige soma exata, então a diferença é absorvida pela última
 * parte, o mesmo método de "maior resto" usado para fechar centavos de arredondamento em totais
 * financeiros.
 */
export function apurarTempoAtivoDividido(
  traco: TracoDeEventos,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): ParteApurada[] {
  const total = apurarTempoAtivo(traco, constantes);
  const partes = dividirNaViradaDoDia(traco);
  const apuracoes = partes.map((p) => apurarTempoAtivo(p.traco, constantes));

  if (apuracoes.length > 0) {
    const ultima = apuracoes[apuracoes.length - 1]!;
    const somaBruto = apuracoes.reduce((s, a) => s + a.tempoBrutoS, 0);
    const somaAtivo = apuracoes.reduce((s, a) => s + a.tempoAtivoS, 0);
    ultima.tempoBrutoS += total.tempoBrutoS - somaBruto;
    ultima.tempoAtivoS += total.tempoAtivoS - somaAtivo;
  }

  return partes.map((p, i) => ({ ...p, ...apuracoes[i]! }));
}

function diaLocal(paredeMs: number, fuso: string): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: fuso,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(paredeMs));
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '';
  return `${valor('year')}-${valor('month')}-${valor('day')}`;
}

/** Instante epoch (ms) da meia-noite local que abre o dia civil que contém `paredeMs`. */
function meiaNoiteDoDia(paredeMs: number, fuso: string): number {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: fuso,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(paredeMs));
  const valor = (tipo: string) => Number(partes.find((p) => p.type === tipo)?.value ?? '0');

  // O offset local no instante `paredeMs` é a diferença entre o que o relógio de parede local
  // mostra e o UTC — usado para achar o epoch da meia-noite sem depender de biblioteca externa.
  const local = Date.UTC(
    valor('year'),
    valor('month') - 1,
    valor('day'),
    valor('hour'),
    valor('minute'),
    valor('second')
  );
  const offsetMs = local - paredeMs;
  const meiaNoiteLocalComoUtc = Date.UTC(valor('year'), valor('month') - 1, valor('day'));
  return meiaNoiteLocalComoUtc - offsetMs;
}

function meiasNoitesEntre(inicioParede: number, fimParede: number, fuso: string): number[] {
  const fronteiras: number[] = [];
  let meiaNoiteAtual = meiaNoiteDoDia(inicioParede, fuso);
  for (;;) {
    // +25h garante cair dentro do próximo dia civil mesmo num dia de 23h de horário de verão;
    // `meiaNoiteDoDia` então recua para a meia-noite real desse dia, sem acumular erro.
    const proxima = meiaNoiteDoDia(meiaNoiteAtual + 25 * 60 * 60 * 1000, fuso);
    if (proxima <= meiaNoiteAtual || proxima > fimParede) break;
    fronteiras.push(proxima);
    meiaNoiteAtual = proxima;
  }
  return fronteiras;
}

function interpolarMono(eventos: EventoTraco[], fronteiraParede: number): number {
  let anterior: EventoTraco | undefined;
  let posterior: EventoTraco | undefined;
  for (const evento of eventos) {
    if (evento.parede <= fronteiraParede) anterior = evento;
    if (evento.parede >= fronteiraParede && !posterior) posterior = evento;
  }
  if (!anterior) return eventos[0]!.mono;
  if (!posterior || posterior.parede === anterior.parede) return anterior.mono;

  const fracao = (fronteiraParede - anterior.parede) / (posterior.parede - anterior.parede);
  return anterior.mono + fracao * (posterior.mono - anterior.mono);
}
