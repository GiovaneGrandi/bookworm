import type { IndiceDeCaracteres, RecursoIndexado, TextoDePagina } from './tipos.js';

// Mesmo contrato de saída do EPUB (stack.md §6): offset acumulado, só a fonte do texto bruto
// muda. RN-TEL.27 — PDF sem camada de texto (todas as páginas com `texto: null`) não gera
// índice: a função recusa de forma explícita, nunca devolve um índice vazio silencioso.
export function montarIndicePdf(paginas: TextoDePagina[]): IndiceDeCaracteres {
  const algumaPaginaTemTexto = paginas.some((p) => p.texto !== null);
  if (!algumaPaginaTemTexto) {
    throw new Error(
      'RN-TEL.27: PDF sem camada de texto em nenhuma página — não é possível montar índice de caracteres.'
    );
  }

  const recursos: RecursoIndexado[] = [];
  let offset = 0;

  for (const pagina of paginas) {
    const texto = pagina.texto ?? '';
    const comprimento = texto.length;
    recursos.push({ href: `pagina-${pagina.numero}`, offset, comprimento });
    offset += comprimento;
  }

  return { recursos, total: offset };
}
