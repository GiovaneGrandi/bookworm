// Paredes próprias da estante (fichário, 26/11/2026): a leitora pendura uma parede com nome e
// cor e escolhe quais livros vão nela. Um livro pode estar em várias paredes; tirar de uma
// parede nunca tira da estante.

export type CorDeParede = 'mesa' | 'vinho' | 'prussia' | 'terra' | 'grafite';
export const CORES_DE_PAREDE: readonly CorDeParede[] = [
  'mesa',
  'vinho',
  'prussia',
  'terra',
  'grafite',
];

export const NOME_DE_PAREDE_MAX = 40;

/** O nome como vai na placa: sem espaço sobrando; null se ficar vazio ou longo demais. */
export function limparNomeDeParede(nome: string): string | null {
  const limpo = nome.replace(/\s+/g, ' ').trim();
  if (!limpo || limpo.length > NOME_DE_PAREDE_MAX) return null;
  return limpo;
}

/** Marca ou desmarca um livro na escolha, sem alterar a lista recebida. */
export function alternarNaEscolha(escolha: readonly string[], id: string): string[] {
  return escolha.includes(id) ? escolha.filter((x) => x !== id) : [...escolha, id];
}

/**
 * A parede que a estante mostra ao ser aberta pelo menu: a favorita, se houver; senão, a estante
 * inteira (null). Só uma parede é favorita por vez.
 */
export function paredeAoEntrar(
  paredes: readonly { id: string; favorita: boolean }[]
): string | null {
  return paredes.find((p) => p.favorita)?.id ?? null;
}
