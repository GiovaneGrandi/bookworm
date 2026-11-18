// A biblioteca não aceita duas cópias do mesmo arquivo: mesmo nome e mesma extensão é a mesma
// obra, venha ela do aparelho ou do acervo (RN-02.1g).

/** Forma comparável do nome: sem espaço nas pontas, acentos em NFC, sem diferenciar caixa. */
export function chaveDeArquivo(nome: string): string {
  return nome.trim().normalize('NFC').toLocaleLowerCase('pt-BR');
}

export function mesmoArquivo(a: string, b: string): boolean {
  return chaveDeArquivo(a) === chaveDeArquivo(b);
}

export function obraComMesmoArquivo<T extends { nomeArquivo: string }>(
  obras: readonly T[],
  nome: string
): T | undefined {
  const chave = chaveDeArquivo(nome);
  return obras.find((o) => chaveDeArquivo(o.nomeArquivo) === chave);
}
