// Estágio 2 — índice de caracteres (stack.md §6, RN-ST.8). Contrato de saída único para EPUB e
// PDF (RN-02.1f): a posição em caracteres nunca depende do formato de origem.
export type RecursoIndexado = {
  href: string;
  offset: number;
  comprimento: number;
};

export type IndiceDeCaracteres = {
  recursos: RecursoIndexado[];
  total: number;
};

// PDF entra pelo mesmo contrato de saída (stack.md §6); a única variação é a fonte do texto
// bruto — cada página já chega com o texto extraído (via Readium/PDFium ou pdfjs-dist, decisão
// de `apps/app`, não deste pacote puro).
export type TextoDePagina = {
  numero: number;
  texto: string | null; // null = página sem camada de texto (RN-TEL.27)
};
