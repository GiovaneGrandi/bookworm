import { TEMPERATURA_LUZ } from '@bookworm/core';
import { comAlfa } from './semantico';

// A luz da mesa (RN-DV.6, RN-DV.7). A luminária fica no canto superior direito; a poça de luz
// que ela faz no feltro é tingida pela temperatura que a leitora escolheu no painel.

type Rgba = { r: number; g: number; b: number; a: number };

/**
 * A cor da poça para uma temperatura, composta em "screen" sobre o feltro. É a fórmula do
 * mockup B (`corPoca`): âmbar e forte no quente, quase branca e fraca no frio.
 */
export function corDaPoca(kelvin: number): Rgba {
  const k = Math.min(TEMPERATURA_LUZ.max, Math.max(TEMPERATURA_LUZ.min, kelvin));
  const t = (TEMPERATURA_LUZ.max - k) / (TEMPERATURA_LUZ.max - TEMPERATURA_LUZ.min);
  return {
    r: 255,
    g: Math.round(230 - t * 60),
    b: Math.round(210 - t * 120),
    a: Math.round((0.16 + t * 0.18) * 1000) / 1000,
  };
}

export const rgbaCss = ({ r, g, b, a }: Rgba) => `rgba(${r},${g},${b},${a})`;

/** O latão da luminária vista de cima (mockup B, `.luminaria`). */
const LATAO = {
  brilho: '#fff6d8',
  claro: '#e9c66f',
  escuro: '#9b7a2e',
  meio: '#c9a24a',
  fundo: '#8a6a24',
  sombra: '#5e4718',
};

export const luz = {
  /** Gradiente da cúpula: [cor, posição de 0 a 1] a partir do centro da lâmpada. */
  cupula: [
    [LATAO.brilho, 0],
    [LATAO.brilho, 0.09],
    [LATAO.claro, 0.1],
    [LATAO.claro, 0.16],
    [LATAO.escuro, 0.17],
    [LATAO.escuro, 0.22],
    [LATAO.meio, 0.23],
    [LATAO.meio, 0.56],
    [LATAO.fundo, 0.62],
    [LATAO.sombra, 0.7],
  ] as [string, number][],
  sombraDaCupula: comAlfa('#000000', 0.55),
  /** O grão do feltro (mockup B, `--feltro`): pontos claros a cada 5 px e escuros a cada 7 px. */
  feltroClaro: comAlfa('#ffffff', 0.025),
  feltroEscuro: comAlfa('#000000', 0.18),
} as const;
