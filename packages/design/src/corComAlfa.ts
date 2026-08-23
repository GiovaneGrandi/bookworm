// Composição de alfa sobre uma cor hex `#rrggbb` — usado pela camada 3 (papel semântico) para
// derivar tokens como "acento a 70%" sem duplicar os hex em rgba manualmente.
export function corComAlfa(hex: string, alfa: number): string {
  const limpo = hex.replace('#', '');
  const r = Number.parseInt(limpo.slice(0, 2), 16);
  const g = Number.parseInt(limpo.slice(2, 4), 16);
  const b = Number.parseInt(limpo.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alfa})`;
}
