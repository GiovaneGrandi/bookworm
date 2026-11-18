// Escala tônica (design-system.md §3). Espaçamento só destes valores (RN-DS.4);
// 27px é o ancoradouro: entrelinha do corpo e passo da pauta (RN-DS.5).
export const esp = {
  0: 0,
  1: 3,
  2: 6,
  3: 9,
  4: 12,
  5: 18,
  6: 27,
  7: 36,
  8: 54,
  9: 81,
} as const;

export const ESCALA_TONICA: readonly number[] = Object.values(esp);
