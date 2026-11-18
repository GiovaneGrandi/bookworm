/** RN-02.12, RN-03.2: 1 página canônica = 1.500 caracteres com espaços (a validar). */
export const PAGINA_CANONICA_CARACTERES = 1500;

/** Página canônica em que cai uma posição em caracteres; a primeira é a 1. */
export function paginaCanonica(posicao: number): number {
  return Math.floor(Math.max(0, posicao) / PAGINA_CANONICA_CARACTERES) + 1;
}

/** Quantas páginas canônicas tem uma obra. */
export function totalDePaginas(totalCaracteres: number): number {
  return Math.max(1, Math.ceil(totalCaracteres / PAGINA_CANONICA_CARACTERES));
}
