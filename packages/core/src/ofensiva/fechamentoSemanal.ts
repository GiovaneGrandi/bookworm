import type { EstiloDeLeitura } from '../sessao/tipos.js';
import type { DiaDaSemana, FechamentoSemanal } from './tipos.js';

/**
 * RN-04.39 — resumo dos sete dias: cumprimento, tempo total, estilo predominante e comparação com
 * a semana anterior do **próprio** usuário (nunca com outros, P1). Comparação é `null` sem semana
 * anterior (primeira semana do usuário) — nunca vira `0`, que mentiria dizendo "igual".
 */
export function fechamentoSemanal(
  semana: DiaDaSemana[],
  semanaAnterior: DiaDaSemana[] = []
): FechamentoSemanal {
  const diasCumpridos = semana.filter((d) => d.cumprido).length;
  const tempoTotalS = semana.reduce((soma, d) => soma + d.agregado.tempoAtivoS, 0);

  return {
    diasCumpridos,
    tempoTotalS,
    estiloPredominante: estiloPredominante(semana),
    comparacaoTempoAnteriorS:
      semanaAnterior.length === 0
        ? null
        : tempoTotalS - semanaAnterior.reduce((soma, d) => soma + d.agregado.tempoAtivoS, 0),
  };
}

function estiloPredominante(semana: DiaDaSemana[]): EstiloDeLeitura | null {
  const totais: Record<EstiloDeLeitura, number> = { focado: 0, metodico: 0, equilibrado: 0 };
  for (const dia of semana) {
    for (const estilo of Object.keys(totais) as EstiloDeLeitura[]) {
      totais[estilo] += dia.agregado.distribuicaoEstilo[estilo];
    }
  }

  const entradas = Object.entries(totais) as Array<[EstiloDeLeitura, number]>;
  const [estiloTopo, contagemTopo] = entradas.reduce((maior, atual) =>
    atual[1] > maior[1] ? atual : maior
  );
  return contagemTopo > 0 ? estiloTopo : null;
}
