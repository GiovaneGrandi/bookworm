import { apurarTempoAtivo } from './apurarTempoAtivo.js';
import { CONSTANTES_SESSAO_PADRAO, type ConstantesSessao } from './constantes.js';
import type { ApuracaoVolume, Pausa, TracoDeEventos } from './tipos.js';

type Movimento = { mono: number; caracteres: number };

/**
 * RN-TEL.21–RN-TEL.25 — volume em caracteres inteiros, como **união dos intervalos percorridos**
 * (não soma de deltas: reler não infla), com o teto físico (`RITMO_MAXIMO_FISICO`) aplicado por
 * trecho contra o tempo ativo daquele trecho — não sobre o total da sessão (RN-TEL.25), para que
 * 30 minutos de leitura honesta não diluam 90 segundos de rolagem.
 *
 * Um evento com `salto: true` (RN-TEL.22 — sumário, busca, link) quebra a cadeia: nem o
 * movimento até ele nem o movimento a partir dele geram volume: o ponto de referência
 * simplesmente pula, sem virar intervalo. Uma pausa (`sistema` ou `idle`) entre dois movimentos
 * quebra a cadeia do mesmo jeito: não há como saber quando, durante a pausa, a posição avançou, e
 * comparar o delta contra o pouco (ou nenhum) tempo ativo do trecho inflaria falsamente a marca de
 * suspeita — a retomada começa uma cadeia nova, não um salto físico impossível.
 */
export function apurarVolume(
  traco: TracoDeEventos,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): ApuracaoVolume {
  const { pausas } = apurarTempoAtivo(traco, constantes);
  const cadeias = extrairCadeiasDeMovimento(traco, pausas);

  let suspeita = false;
  const intervalos: Array<[number, number]> = [];

  for (const cadeia of cadeias) {
    for (let i = 1; i < cadeia.length; i++) {
      const anterior = cadeia[i - 1]!;
      const atual = cadeia[i]!;
      const deltaBruto = Math.abs(atual.caracteres - anterior.caracteres);
      if (deltaBruto === 0) continue;

      // Dentro de uma cadeia não há pausa (elas a quebram, ver acima) — o tempo do trecho já é
      // todo tempo ativo.
      const tempoAtivoTrechoS = (atual.mono - anterior.mono) / 1000;
      const tetoTrecho = constantes.RITMO_MAXIMO_FISICO * (tempoAtivoTrechoS / 60);

      const creditado = Math.min(deltaBruto, Math.max(0, tetoTrecho));
      if (creditado < deltaBruto) suspeita = true;
      if (creditado <= 0) continue;

      const inicio = Math.min(anterior.caracteres, atual.caracteres);
      intervalos.push([inicio, inicio + creditado]);
    }
  }

  const caracteres = Math.round(uniaoDeIntervalos(intervalos));

  return {
    caracteres,
    paginas: caracteres / constantes.PAGINA_CANONICA_CARACTERES,
    suspeita,
  };
}

/**
 * RN-TEL.22 — um evento `salto: true` fecha a cadeia corrente e abre outra a partir dele: nem o
 * movimento até ele nem o movimento a partir dele geram volume, porque nenhum dos dois é leitura
 * contínua.
 */
function extrairCadeiasDeMovimento(traco: TracoDeEventos, pausas: Pausa[]): Movimento[][] {
  const cadeias: Movimento[][] = [[]];
  let ultimoMono: number | null = null;

  for (const evento of traco.eventos) {
    if (evento.tipo === 'sessao_iniciada' && evento.caracteres !== undefined) {
      cadeias[cadeias.length - 1]!.push({ mono: evento.mono, caracteres: evento.caracteres });
      ultimoMono = evento.mono;
    } else if (evento.tipo === 'posicao_alterada') {
      const cruzouPausa = ultimoMono !== null && houvePausaEntre(pausas, ultimoMono, evento.mono);
      if (evento.salto || cruzouPausa) cadeias.push([]);
      cadeias[cadeias.length - 1]!.push({ mono: evento.mono, caracteres: evento.caracteres });
      ultimoMono = evento.mono;
    }
  }
  return cadeias;
}

function houvePausaEntre(pausas: Pausa[], inicioMono: number, fimMono: number): boolean {
  return pausas.some((p) => p.inicioMono < fimMono && p.fimMono > inicioMono);
}

function uniaoDeIntervalos(intervalos: Array<[number, number]>): number {
  if (intervalos.length === 0) return 0;
  const ordenados = [...intervalos].sort((a, b) => a[0] - b[0]);
  let total = 0;
  let [inicioAtual, fimAtual] = ordenados[0]!;
  for (let i = 1; i < ordenados.length; i++) {
    const [inicio, fim] = ordenados[i]!;
    if (inicio > fimAtual) {
      total += fimAtual - inicioAtual;
      inicioAtual = inicio;
      fimAtual = fim;
    } else {
      fimAtual = Math.max(fimAtual, fim);
    }
  }
  total += fimAtual - inicioAtual;
  return total;
}
