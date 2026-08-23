import { CONSTANTES_OFENSIVA_PADRAO, type ConstantesOfensiva } from './constantes.js';
import type { EstadoJardim, EstagioJardim, Ofensiva } from './tipos.js';

/**
 * RN-04.23, RN-04.25–RN-04.27 — duas grandezas independentes, de propósito:
 *
 * - `tamanhoPermanente` vem do **acervo** (RN-04.27): nunca decresce, é o que garante que
 *   "nenhum elemento é removido" na dormência (RN-04.25).
 * - `estagio` vem da **ofensiva atual** (RN-04.23): é o "canteiro ativo", que recua para `broto`
 *   quando a contagem quebra — a dormência já sinaliza isso com `estado: 'dormente'` e paleta de
 *   outono, sem apagar o jardim acumulado.
 *
 * `RN-04.26` sai de graça desta divisão: assim que um dia é cumprido depois da quebra,
 * `recalcularOfensiva` já marca `estado: 'ativa'` (mesmo com `contagemAtual === 1`), e aqui isso
 * vira `estado: 'vivo'` imediatamente — sem esperar o estágio crescer de novo.
 */
export function estadoDoJardim(
  ofensiva: Ofensiva,
  constantes: ConstantesOfensiva = CONSTANTES_OFENSIVA_PADRAO
): EstadoJardim {
  return {
    estado: ofensiva.estado === 'ativa' ? 'vivo' : 'dormente',
    estagio: calcularEstagio(ofensiva.contagemAtual, constantes),
    tamanhoPermanente: ofensiva.acervoDiasCumpridos,
    melhorMarca: ofensiva.melhorMarca,
    contagemEncerrada: ofensiva.estado === 'dormente' ? ofensiva.contagemEncerrada : null,
  };
}

function calcularEstagio(contagemAtual: number, constantes: ConstantesOfensiva): EstagioJardim {
  const { bosque, arvore, plantaFlorida, muda } = constantes.JARDIM_ESTAGIOS;
  if (contagemAtual >= bosque) return 'bosque';
  if (contagemAtual >= arvore) return 'arvore';
  if (contagemAtual >= plantaFlorida) return 'planta_florida';
  if (contagemAtual >= muda) return 'muda';
  return 'broto';
}
