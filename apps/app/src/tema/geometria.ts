// Geometria (design-system.md §4). Raio zero é o padrão; círculo só em carimbo e selo (RN-DS.8).
export const raio = {
  nenhum: 0,
  minimo: 2,
  // React Native só aceita um eixo por canto; fica o primeiro eixo de --raio-irregular-*.
  irregularP: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 7,
  },
  irregularM: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 8,
  },
  circulo: 9999,
} as const;

/** Alvo de toque mínimo, mesmo com desenho visível menor (RN-DS.10). */
export const ALVO_MINIMO = 48;

// Só as seis rotações nomeadas, com sinais alternados entre vizinhos (RN-DS.9).
export const giro = {
  plaqueta: '-0.5deg',
  rotulo: '-0.7deg',
  etiqueta: '-1.6deg',
  fita: '-2.4deg',
  marginalia: '-3.5deg',
  carimbo: '-9deg',
} as const;

export type Giro = (typeof giro)[keyof typeof giro];

/** Inverte o sinal de uma rotação nomeada, para alternar entre vizinhos. */
export function espelhar(rotacao: Giro): string {
  return rotacao.startsWith('-') ? rotacao.slice(1) : `-${rotacao}`;
}
