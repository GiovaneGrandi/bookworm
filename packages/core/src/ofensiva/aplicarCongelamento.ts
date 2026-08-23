import { CONSTANTES_OFENSIVA_PADRAO, type ConstantesOfensiva } from './constantes.js';
import type { DecisaoProtecaoDia, EstoqueCongelamento } from './tipos.js';

/**
 * `mvp.md` §5 A-1 — concessão automática mensal (substitui a compra de `RN-04.16` enquanto não há
 * economia). Idempotente por construção: `mesReferencia` (`YYYY-MM`) só concede se for diferente
 * de `estoque.ultimaConcessaoMes` — rodar o job de virada duas vezes no mesmo mês não concede duas
 * vezes. Nunca ultrapassa `FREEZE_MAX_ESTOQUE`.
 */
export function concederCongelamentoMensal(
  estoque: EstoqueCongelamento,
  mesReferencia: string,
  constantes: ConstantesOfensiva = CONSTANTES_OFENSIVA_PADRAO
): EstoqueCongelamento {
  if (estoque.ultimaConcessaoMes === mesReferencia) return estoque;

  const quantidade = Math.min(
    constantes.FREEZE_MAX_ESTOQUE,
    estoque.quantidade + constantes.FREEZE_CONCESSAO_MENSAL
  );
  return { quantidade, ultimaConcessaoMes: mesReferencia };
}

/**
 * RN-04.17–RN-04.19 — decide se um dia não cumprido é protegido por congelamento na virada. Exige
 * estoque e respeita `FREEZE_MAX_CONSECUTIVOS`: passado o limite, a ofensiva quebra mesmo com
 * congelamento disponível (RN-04.18) — o produto existe para gerar hábito, não vender imunidade
 * indefinida.
 *
 * **Idempotente**: se `diaJaProcessado` diz que este dia específico já foi decidido antes (o job
 * de virada rodou duas vezes), devolve a mesma decisão sem consumir estoque de novo.
 */
export function aplicarCongelamento(
  diasConsecutivosProtegidosAntes: number,
  estoque: number,
  diaJaProcessado?: DecisaoProtecaoDia,
  constantes: ConstantesOfensiva = CONSTANTES_OFENSIVA_PADRAO
): DecisaoProtecaoDia {
  if (diaJaProcessado) return diaJaProcessado;

  if (estoque <= 0 || diasConsecutivosProtegidosAntes >= constantes.FREEZE_MAX_CONSECUTIVOS) {
    return { protegido: false, estoqueResultante: estoque };
  }

  return { protegido: true, estoqueResultante: estoque - 1 };
}
