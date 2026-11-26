/**
 * A chegada dos livros ao abrir a estante: cada capa cai do alto inclinada, bate o canto na
 * tábua, balança e assenta reta. Aqui fica só o relógio (quem cai, quando); o desenho do
 * movimento está em `componentes/estante/BwChegada.tsx`.
 */
export const CHEGADA = {
  /** Da saída do alto até assentar, por livro. */
  duracao: 640,
  /** Fração da duração em que o canto bate na tábua, e em que o livro assenta. */
  canto: 0.62,
  assentar: 0.8,
  /** Só os primeiros caem: os de baixo, fora da tela, já estão no lugar quando se rola. */
  livrosQueCaem: 12,
  /** Intervalo entre um livro e o seguinte, no máximo… */
  passoMaximo: 90,
  /** …e a janela em que todos começam a cair, para a estante chegar inteira em até 1 s. */
  janela: 360,
  /** Pela mesa, a câmera gira até a estante: os livros começam a cair perto do fim do giro. */
  esperaDoGiro: 480,
  /** Pela barra, a folha some em ~180 ms: os livros esperam ela sair da frente. */
  esperaDaFolha: 120,
  /**
   * Se os primeiros livros só aparecem depois disto (a estante abriu vazia de propósito, numa
   * parede sem livros, e a leitora trocou de filtro), não é mais abertura: chegam sem cair.
   */
  prazo: 1500,
} as const;

/** Para cada livro que cai, a hora (em ms, no relógio de `inicio`) em que ele começa a cair. */
export function horariosDaChegada(ids: readonly string[], inicio: number): Map<string, number> {
  const caem = ids.slice(0, CHEGADA.livrosQueCaem);
  const passo =
    caem.length > 1 ? Math.min(CHEGADA.passoMaximo, CHEGADA.janela / (caem.length - 1)) : 0;
  return new Map(caem.map((id, i) => [id, inicio + Math.round(i * passo)]));
}

/**
 * Quanto falta para uma capa que acabou de montar começar a cair. Null quando ela não cai, ou
 * quando a hora dela já passou: aí aparece no lugar, em vez de cair pela metade.
 */
export function restanteDaChegada(hora: number | undefined, agora: number): number | null {
  if (hora === undefined || agora > hora) return null;
  return hora - agora;
}
