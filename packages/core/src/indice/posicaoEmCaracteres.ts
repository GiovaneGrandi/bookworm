import type { IndiceDeCaracteres } from './tipos.js';

// posição = offset[recurso] + progressão × tamanho[recurso] (stack.md §6) — mesma fórmula para
// EPUB e PDF, porque os dois produzem o mesmo formato de índice.
export function posicaoEmCaracteres(
  indice: IndiceDeCaracteres,
  href: string,
  progressao: number
): number {
  const recurso = indice.recursos.find((r) => r.href === href);
  if (!recurso) {
    throw new Error(`posicaoEmCaracteres: recurso "${href}" não existe no índice.`);
  }
  return recurso.offset + progressao * recurso.comprimento;
}
