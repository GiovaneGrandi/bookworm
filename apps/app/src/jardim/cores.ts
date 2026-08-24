// Estágio 8 — cena do jardim (`mvp.md` §9, `design-system.md` §6.5: "a cena do jardim não é
// componente", então as cores daqui não vêm da camada de superfícies — são locais à ilustração.

/** Hash determinístico de 32 bits (variante splitmix) — mesma semente sempre produz o mesmo
 * valor em [0, 1), o que faz a posição de cada elemento do canteiro ser estável entre renders
 * sem precisar guardar nada em disco (RN-04.24: a posição de um dia já regado nunca muda). */
export function pseudoAleatorio(semente: number): number {
  let x = semente | 0;
  x = Math.imul(x ^ (x >>> 16), 2246822507);
  x = Math.imul(x ^ (x >>> 13), 3266489909);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

function paraRgb(hex: string): [number, number, number] {
  const limpo = hex.replace('#', '');
  const inteiro = Number.parseInt(limpo, 16);
  return [(inteiro >> 16) & 255, (inteiro >> 8) & 255, inteiro & 255];
}

/** Interpolação linear entre duas cores hex — usada no gradiente do céu e nas sombras da planta. */
export function misturarCores(hexA: string, hexB: string, t: number): string {
  const [r1, g1, b1] = paraRgb(hexA);
  const [r2, g2, b2] = paraRgb(hexB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}
