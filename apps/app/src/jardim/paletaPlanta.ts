// Paleta da planta e do solo — local à cena (design-system.md §6.5: a cena não lê `--sup-*`).
// `vivo` deriva de `--verde-tinta` (pigmento.ts); `dormente` é outono deslumbrante, não cinza
// (RN-04.25, J-13): dourado e terracota, nunca uma dessaturação lisa do verde.
export type PaletaPlanta = {
  solo: string;
  soloClaro: string;
  tronco: string;
  folhaEscura: string;
  folha: string;
  folhaClara: string;
  flor: string;
  flor2: string;
};

export const PALETA_PLANTA: Record<'vivo' | 'dormente', PaletaPlanta> = {
  vivo: {
    solo: '#3a2e1f',
    soloClaro: '#4f4028',
    tronco: '#4b3a25',
    folhaEscura: '#22432a',
    folha: '#2f5d3a',
    folhaClara: '#5c8a5f',
    flor: '#e7c25e',
    flor2: '#d79aa2',
  },
  dormente: {
    solo: '#3e3020',
    soloClaro: '#54402a',
    tronco: '#5a4632',
    folhaEscura: '#8a4f28',
    folha: '#b5762f',
    folhaClara: '#d99a4e',
    flor: '#c2703f',
    flor2: '#a85536',
  },
};
