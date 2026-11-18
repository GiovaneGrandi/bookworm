/** Tamanho de arquivo em PT-BR: "412 KB", "2,3 MB". */
export function formatarTamanho(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
}

const EXTENSO = [
  'nenhum',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
];

/** "Três livros", "Um livro", "12 livros" — número por extenso até dez, como no mockup. */
export function contarLivros(n: number): string {
  const numero = n <= 10 ? (EXTENSO[n] ?? String(n)) : String(n);
  const texto = `${numero} ${n <= 1 ? 'livro' : 'livros'}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
