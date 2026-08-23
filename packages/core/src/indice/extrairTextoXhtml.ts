import { Parser } from 'htmlparser2';

const TAGS_IGNORADAS = new Set(['script', 'style']);

// Extrai só o texto visível de um recurso XHTML do spine, na ordem em que aparece no documento.
// Pura: recebe a string do arquivo, devolve string — nenhum I/O.
export function extrairTextoXhtml(xhtml: string): string {
  let texto = '';
  let profundidadeIgnorada = 0;

  const parser = new Parser(
    {
      onopentag(nome) {
        if (TAGS_IGNORADAS.has(nome)) profundidadeIgnorada++;
      },
      ontext(dados) {
        if (profundidadeIgnorada === 0) texto += dados;
      },
      onclosetag(nome) {
        if (TAGS_IGNORADAS.has(nome) && profundidadeIgnorada > 0) profundidadeIgnorada--;
      },
    },
    { xmlMode: true, decodeEntities: true }
  );

  parser.write(xhtml);
  parser.end();
  return texto;
}
