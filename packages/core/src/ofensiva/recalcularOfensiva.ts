import { CONSTANTES_OFENSIVA_PADRAO, type ConstantesOfensiva } from './constantes.js';
import type { DiaParaOfensiva, Eixo, Ofensiva } from './tipos.js';

/**
 * RN-04.11 — a ofensiva é **derivada**, nunca incrementada: recebe o histórico completo de dias
 * (um registro por dia civil, sem buracos — dias sem sessão entram como `cumprido: false`) e
 * recalcula tudo do zero. Ordem de entrada não importa (os dias são ordenados aqui) — é o que
 * torna uma sessão offline atrasada (`RN-03.16`) ou um descarte (`RN-03.29`) uma simples chamada
 * nova com o histórico corrigido, nunca uma correção manual de contador.
 *
 * `RN-04.19` — um dia **protegido** por congelamento mantém a contagem corrente (não quebra) mas
 * não a incrementa nem soma ao acervo: ele preserva, não conta como cumprido.
 */
export function recalcularOfensiva(
  eixo: Eixo,
  dias: DiaParaOfensiva[],
  constantes: ConstantesOfensiva = CONSTANTES_OFENSIVA_PADRAO
): Ofensiva {
  const ordenados = [...dias].sort((a, b) => a.dia.localeCompare(b.dia));

  let atual = 0;
  let melhor = 0;
  let acervo = 0;
  let ultimoDiaCumprido: string | null = null;
  let ultimaQuebra: { contagem: number; fim: string } | null = null;

  for (let i = 0; i < ordenados.length; i++) {
    const dia = ordenados[i]!;

    if (dia.cumprido) {
      atual += 1;
      acervo += 1;
      ultimoDiaCumprido = dia.dia;
      melhor = Math.max(melhor, atual);
    } else if (dia.protegidoPorCongelamento) {
      // Preserva a contagem corrente sem incrementá-la (RN-04.19) — se ainda não havia
      // sequência (atual === 0), não há o que proteger, e o dia segue sem efeito.
    } else {
      if (atual > 0) {
        ultimaQuebra = { contagem: atual, fim: ordenados[i - 1]!.dia };
      }
      atual = 0;
    }
  }

  const ultimoDia = ordenados[ordenados.length - 1];
  const ativa =
    ultimoDia !== undefined &&
    (ultimoDia.cumprido || ultimoDia.protegidoPorCongelamento) &&
    atual > 0;

  return {
    eixo,
    contagemAtual: ativa ? atual : 0,
    melhorMarca: melhor,
    contagemEncerrada: ativa ? 0 : (ultimaQuebra?.contagem ?? 0),
    encerradaEm: ativa ? null : (ultimaQuebra?.fim ?? null),
    ultimoDiaCumprido,
    estado: ativa ? 'ativa' : 'dormente',
    acervoDiasCumpridos: acervo,
  };
}
