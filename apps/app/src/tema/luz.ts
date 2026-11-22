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

/** O latão da luminária vista de cima (mockup B v2, `.luminaria`), acesa e apagada. */
const LATAO = {
  brilho: '#fffbe8',
  claro: '#f5d87e',
  escuro: '#a68232',
  meio: '#c9a24a',
  fundo: '#8a6a24',
  sombra: '#5e4718',
};
const LATAO_APAGADO = { centro: '#7a6638', meio: '#6d5524', borda: '#4a3816' };

export const luz = {
  /** Gradiente da cúpula acesa: [cor, posição de 0 a 1] a partir do centro da lâmpada. */
  cupula: [
    [LATAO.brilho, 0],
    [LATAO.brilho, 0.1],
    [LATAO.claro, 0.11],
    [LATAO.claro, 0.18],
    [LATAO.escuro, 0.19],
    [LATAO.escuro, 0.23],
    [LATAO.meio, 0.24],
    [LATAO.meio, 0.56],
    [LATAO.fundo, 0.62],
    [LATAO.sombra, 0.7],
  ] as [string, number][],
  /** A cúpula apagada: o latão sem o brilho da lâmpada. */
  cupulaApagada: [
    [LATAO_APAGADO.centro, 0],
    [LATAO_APAGADO.centro, 0.18],
    [LATAO_APAGADO.meio, 0.24],
    [LATAO_APAGADO.meio, 0.56],
    [LATAO_APAGADO.borda, 0.7],
  ] as [string, number][],
  sombraDaCupula: comAlfa('#000000', 0.62),
  sombraDaCupulaApagada: comAlfa('#000000', 0.55),
  /** Com a luz acesa, o resto da mesa fica em penumbra: [cor, posição] do centro para fora. */
  penumbra: [
    [comAlfa('#080a09', 0), 0],
    [comAlfa('#080a09', 0.14), 0.48],
    [comAlfa('#080a09', 0.42), 0.8],
    [comAlfa('#080a09', 0.56), 1],
  ] as [string, number][],
  /** Com a luz apagada, a mesa fica uniformemente mais clara (a luz do cômodo). */
  mesaApagada: [comAlfa('#f3ead9', 0.11), comAlfa('#f3ead9', 0.04)] as [string, string],
  /** O grão do feltro (mockup B, `--feltro`): pontos claros a cada 5 px e escuros a cada 7 px. */
  feltroClaro: comAlfa('#ffffff', 0.025),
  feltroEscuro: comAlfa('#000000', 0.18),
} as const;
