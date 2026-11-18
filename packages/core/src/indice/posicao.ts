import { type IndiceEpub, normalizarHref } from './epub';

type IndicePosicional = Pick<IndiceEpub, 'recursos' | 'total'>;

/**
 * Posição em caracteres do conteúdo principal (RN-02.10, RN-ST.8):
 * `inicio[href] + progression × caracteres[href]`. Lê só o índice persistido.
 * Devolve null se o href não está na espinha.
 */
export function posicaoEmCaracteres(
  indice: IndicePosicional,
  href: string,
  progression: number
): number | null {
  const alvo = normalizarHref(href);
  const recurso = indice.recursos.find((r) => r.href === alvo);
  if (!recurso) return null;
  const p = Math.min(1, Math.max(0, Number.isFinite(progression) ? progression : 0));
  return recurso.inicio + Math.round(p * recurso.caracteres);
}

/** Fração lida da obra, de 0 a 1, sobre o total do conteúdo principal. */
export function progressoPercentual(
  indice: IndicePosicional,
  href: string,
  progression: number
): number {
  if (indice.total <= 0) return 0;
  const posicao = posicaoEmCaracteres(indice, href, progression);
  return posicao === null ? 0 : posicao / indice.total;
}
