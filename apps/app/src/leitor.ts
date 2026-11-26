import type { Aba } from '@bookworm/core';

/**
 * Os ícones do cabeçalho do leitor, cada um com um grupo do painel: o sol abre a luz, o "Aa" só a
 * fonte e os tamanhos, a folha a formatação da página. O painel desce de baixo do título, como
 * uma persiana, e o rodapé fica só com a navegação.
 */
export const ICONES_DO_LEITOR: readonly { aba: Aba; rotulo: string }[] = [
  { aba: 'luz', rotulo: 'Luz: temperatura, brilho e tema' },
  { aba: 'letra', rotulo: 'Letra: fonte, corpo e entrelinha' },
  { aba: 'pagina', rotulo: 'Página: margens, alinhamento e o que aparece no pé' },
];

/** Tocar num ícone abre o grupo dele; tocar de novo no mesmo fecha o painel. */
export function tocarIcone(aberta: Aba | null, tocada: Aba): Aba | null {
  return aberta === tocada ? null : tocada;
}
