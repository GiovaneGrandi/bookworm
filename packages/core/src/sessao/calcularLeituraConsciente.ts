import { CONSTANTES_SESSAO_PADRAO, type ConstantesSessao } from './constantes.js';
import type { LeituraConsciente, SessaoApurada } from './tipos.js';

/**
 * RN-03.17 — duas vias independentes para a profundidade, e `max` entre elas: ficção lida sem
 * interrupção vale tanto quanto estudo anotado (RN-03.17a). RN-03.19 aplica o teto de 1 interação
 * por minuto de tempo ativo **aqui**, não na captura — o dado bruto é do chamador, o teto é regra
 * de score.
 */
export function calcularLeituraConsciente(
  sessao: SessaoApurada,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): LeituraConsciente {
  const { viaInteracao, viaFoco } = calcularVias(sessao, constantes);

  const componenteTempo =
    sessao.tempoBrutoS > 0
      ? constantes.MR_PESO_TEMPO * (sessao.tempoAtivoS / sessao.tempoBrutoS)
      : 0;
  const componenteProfundidade = constantes.MR_PESO_PROFUNDIDADE * Math.max(viaInteracao, viaFoco);

  return {
    score: Math.round(componenteTempo + componenteProfundidade),
    viaInteracao,
    viaFoco,
    interacoesContadas: interacoesComTeto(sessao),
  };
}

function interacoesComTeto(sessao: SessaoApurada): number {
  return Math.min(sessao.interacoesQualitativasBrutas, Math.floor(sessao.tempoAtivoS / 60));
}

/** Compartilhado com `classificarEstilo` — as duas vias vêm sempre da mesma fórmula. */
export function calcularVias(
  sessao: SessaoApurada,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): { viaInteracao: number; viaFoco: number } {
  const tempoAtivoMinutos = sessao.tempoAtivoS / 60;

  const densidadeEsperada = tempoAtivoMinutos / constantes.MR_INTERACAO_ESPERADA_MINUTOS;
  const viaInteracao = Math.min(1, interacoesComTeto(sessao) / Math.max(1, densidadeEsperada));
  const viaFoco = Math.min(
    1,
    sessao.maiorBlocoContinuoS / (constantes.MR_FOCO_ESPERADO_MINUTOS * 60)
  );

  return { viaInteracao, viaFoco };
}
