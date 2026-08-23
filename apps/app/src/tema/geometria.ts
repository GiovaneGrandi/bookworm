// `specs/design-system.md` §4 — raio e rotação. Quase nenhum raio (RN-DS.8); onde houver, é
// irregular. React Native não tem eixo duplo de raio (`4px 7px / 6px 4px`) — só o primeiro eixo
// atravessa (Anexo A, `P-6` "confirmada"), então os valores aqui já são só o eixo que sobra.
export const raio = {
  nenhum: 0,
  minimo: 2,
  // P-6 — só o primeiro eixo por canto atravessa para RN; a imperfeição migra para a rotação.
  irregularP: { topLeft: 3, topRight: 6, bottomRight: 4, bottomLeft: 7 },
  irregularM: { topLeft: 4, topRight: 7, bottomRight: 5, bottomLeft: 8 },
  circulo: 9999, // RN-DS.8 — só carimbo e selo
} as const;

/** RN-DS.9 — só rotações deste conjunto nomeado, com sinais alternados entre vizinhos. */
export const giro = {
  plaqueta: -0.5,
  rotulo: -0.7,
  etiqueta: -1.6,
  fita: -2.4,
  marginalia: -3.5,
  carimbo: -9,
} as const;

/** §4.2 — borda nunca cinza/preta (RN-DS.7); os três traços do sistema. */
export const borda = {
  fina: 1,
  marcada: 2,
  provisoriaTracejada: 1.5,
} as const;
