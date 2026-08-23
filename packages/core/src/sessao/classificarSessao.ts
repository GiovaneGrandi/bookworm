import { CONSTANTES_SESSAO_PADRAO, type ConstantesSessao } from './constantes.js';
import type { SessaoApurada, StatusSessao } from './tipos.js';

/**
 * RN-03.7 (curta), RN-03.26/RN-03.15 (suspeita). `curta` tem prioridade sobre `suspeita`: uma
 * sessão minúscula não é onde o antifraude atua — não há volume suficiente para um teto físico
 * fazer sentido, e a regra de negócio que existe para ela é outra (RN-03.7).
 */
export function classificarSessao(
  sessao: SessaoApurada,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): StatusSessao {
  if (sessao.tempoAtivoS < constantes.SESSAO_MINIMA_SEGUNDOS) return 'curta';
  if (sessao.volumeSuspeita || sessao.sobreposta) return 'suspeita';
  return 'valida';
}
