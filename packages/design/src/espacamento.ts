// Escala tônica de espaçamento — `specs/direcao-visual.md` §4.1 e `design-system.md` §12
// (RN-DS.4). Ancorada nos mesmos 27px da entrelinha e do passo da pauta. Nenhum valor de
// padding/margin/gap fora desta lista.
export const espacamento = [3, 6, 9, 12, 18, 27, 36, 54, 81] as const;

export type Espacamento = (typeof espacamento)[number];

export function ehEspacamentoValido(valor: number): valor is Espacamento {
  return (espacamento as readonly number[]).includes(valor);
}
