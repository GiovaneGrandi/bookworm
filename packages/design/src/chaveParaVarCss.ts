// Converte uma chave camelCase (tinta70, papelFundo) em variável CSS kebab-case
// (--tinta-70, --papel-fundo) — usado pelo gerador de tokens.css e testado isoladamente.
export function chaveParaVarCss(chave: string): string {
  return (
    '--' +
    chave
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
      .toLowerCase()
  );
}
