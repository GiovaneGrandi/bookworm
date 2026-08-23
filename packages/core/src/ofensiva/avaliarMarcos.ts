import { CONSTANTES_OFENSIVA_PADRAO, type ConstantesOfensiva } from './constantes.js';
import type { Ofensiva } from './tipos.js';

/**
 * RN-04.13, RN-04.14 — marcos conquistados são medidos contra o **recorde** (`melhorMarca`), não
 * contra a contagem corrente: uma vez alcançados, permanecem alcançados para sempre, mesmo que a
 * ofensiva quebre depois (RN-04.14a — o recorde nunca regride).
 */
export function avaliarMarcos(
  ofensiva: Ofensiva,
  constantes: ConstantesOfensiva = CONSTANTES_OFENSIVA_PADRAO
): number[] {
  return constantes.MARCOS_OFENSIVA.filter((marco) => ofensiva.melhorMarca >= marco);
}
