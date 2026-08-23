import { apurarTempoAtivo } from './apurarTempoAtivo.js';
import { CONSTANTES_SESSAO_PADRAO, type ConstantesSessao } from './constantes.js';
import type { ApuracaoBlocosDeFoco, Pausa, TracoDeEventos } from './tipos.js';

/**
 * RN-TEL.15, RN-03.17b — o intervalo entre duas pausas é um bloco de foco. As pausas já
 * particionam `[início, fim]` em segmentos contíguos e disjuntos (`apurarTempoAtivo`); cada
 * segmento *é* um bloco, sem precisar de nova subtração — o único tempo removido de um segmento
 * já é o das pausas que o delimitam.
 */
export function apurarBlocosDeFoco(
  traco: TracoDeEventos,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): ApuracaoBlocosDeFoco {
  const eventos = traco.eventos;
  if (eventos.length === 0) {
    return { blocos: [], quantidade: 0, maiorS: 0, medianaS: 0 };
  }

  const inicioMono = eventos[0]!.mono;
  const fimMono = eventos[eventos.length - 1]!.mono;
  const { pausas } = apurarTempoAtivo(traco, constantes);

  const blocos = segmentar(inicioMono, fimMono, pausas)
    .map((s) => (s.fim - s.inicio) / 1000)
    .filter((duracaoS) => duracaoS > 0);

  return {
    blocos,
    quantidade: blocos.length,
    maiorS: blocos.length > 0 ? Math.max(...blocos) : 0,
    medianaS: mediana(blocos),
  };
}

function segmentar(
  inicioMono: number,
  fimMono: number,
  pausas: Pausa[]
): Array<{ inicio: number; fim: number }> {
  const segmentos: Array<{ inicio: number; fim: number }> = [];
  let cursor = inicioMono;
  for (const pausa of pausas) {
    segmentos.push({ inicio: cursor, fim: pausa.inicioMono });
    cursor = pausa.fimMono;
  }
  segmentos.push({ inicio: cursor, fim: fimMono });
  return segmentos;
}

function mediana(valores: number[]): number {
  if (valores.length === 0) return 0;
  const ordenados = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 === 0
    ? (ordenados[meio - 1]! + ordenados[meio]!) / 2
    : ordenados[meio]!;
}
