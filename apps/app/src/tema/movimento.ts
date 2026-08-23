// `specs/design-system.md` §9 — durações, curvas e háptico. RN-DS.15: papel não quica; só o
// carimbo (`--curva-carimbo`) tem overshoot.
export const duracaoMs = {
  instantaneo: 90,
  curto: 160,
  medio: 260,
  longo: 420,
  cerimonia: 900,
} as const;

// Easing.bezier(x1, y1, x2, y2) — mesmos quatro números da spec, sem tradução.
export const curvaBezier = {
  assentar: [0.2, 0.7, 0.3, 1] as const,
  carimbo: [0.3, 1.6, 0.5, 1] as const, // única com overshoot (RN-DS.15)
  sair: [0.5, 0, 0.85, 0.3] as const,
};

export type GestoHaptico = 'leve' | 'seco' | 'duplo';

/**
 * §9 — fronteira herdada de `02-juiciness.md`: nada de háptico em rolagem, virada de página
 * comum, ou estado ocioso. Cada chamador decide QUANDO disparar; este módulo só nomeia o gesto.
 */
export const gestoParaHaptics = {
  leve: 'leve',
  seco: 'seco',
  duplo: 'duplo',
} as const satisfies Record<GestoHaptico, GestoHaptico>;

/** RN-DS.14 — com a preferência de reduzir movimento ativa, duração vai a zero (nunca pula o estado). */
export function duracaoComReduceMotion(ms: number, reduceMotion: boolean): number {
  return reduceMotion ? 0 : ms;
}
