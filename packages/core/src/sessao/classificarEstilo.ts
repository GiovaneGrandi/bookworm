import { calcularVias } from './calcularLeituraConsciente.js';
import { CONSTANTES_SESSAO_PADRAO, type ConstantesSessao } from './constantes.js';
import type { EstiloDeLeitura, SessaoApurada } from './tipos.js';

/**
 * RN-03.22 — descrição, nunca nota (RN-03.22a): qual via predominou, não o quão bem a pessoa leu.
 */
export function classificarEstilo(
  sessao: SessaoApurada,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): EstiloDeLeitura {
  const { viaInteracao, viaFoco } = calcularVias(sessao, constantes);

  const maior = Math.max(viaInteracao, viaFoco);
  if (maior === 0) return 'equilibrado';

  const diferencaRelativa = Math.abs(viaFoco - viaInteracao) / maior;
  if (diferencaRelativa <= constantes.MR_LIMIAR_EQUILIBRIO) return 'equilibrado';

  return viaFoco > viaInteracao ? 'focado' : 'metodico';
}
