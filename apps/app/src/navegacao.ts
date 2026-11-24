// A barra de navegação (régua de feltro, escolhida em 22/11/2026): de qualquer tela, qualquer
// outra fica a um toque. Ela não existe na mesa, que já é o índice, e no leitor só aparece junto
// do menu, quando a leitora toca no meio da página (RN-DV.11).

/** Os destinos da régua. */
export type Destino = 'mesa' | 'ler' | 'biblioteca' | 'jardim';

/** As telas em que a barra pode estar: os destinos e a bandeja, que tem a barra mas não é item dela. */
export type Tela = Destino | 'importar';

export type ItemDaBarra = {
  destino: Destino;
  rotulo: string;
  rotuloAcessivel: string;
  atual: boolean;
  disponivel: boolean;
};

/** Se a barra aparece nesta tela. No leitor depende do menu estar aberto. */
export function barraVisivel(tela: Tela, menuAberto: boolean): boolean {
  if (tela === 'mesa') return false;
  if (tela === 'ler') return menuAberto;
  return true;
}

export function itensDaBarra(
  atual: Tela,
  livroEmLeitura: { titulo: string } | null
): ItemDaBarra[] {
  const titulo = livroEmLeitura?.titulo.replace(/\s+/g, ' ').trim();
  const itens: Omit<ItemDaBarra, 'atual'>[] = [
    { destino: 'mesa', rotulo: 'Mesa', rotuloAcessivel: 'Mesa', disponivel: true },
    {
      destino: 'ler',
      rotulo: 'Ler',
      rotuloAcessivel: titulo ? `Ler: continuar ${titulo}` : 'Ler: nenhum livro em leitura',
      disponivel: Boolean(titulo),
    },
    {
      destino: 'biblioteca',
      rotulo: 'Biblioteca',
      rotuloAcessivel: 'Biblioteca',
      disponivel: true,
    },
    { destino: 'jardim', rotulo: 'Jardim', rotuloAcessivel: 'Jardim: em breve', disponivel: false },
  ];
  return itens.map((i) => ({ ...i, atual: i.destino === atual }));
}
