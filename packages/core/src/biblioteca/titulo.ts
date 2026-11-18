/** Só o título, sem o subtítulo ("Iracema / com uma noticia…", "Flatland: A Romance…"). */
export function tituloCurto(titulo: string): string {
  const [primeiro = ''] = titulo.split(/\s*[\r\n]+\s*|\s+\/\s+|:\s+/);
  return primeiro.replace(/\s+/g, ' ').trim();
}
