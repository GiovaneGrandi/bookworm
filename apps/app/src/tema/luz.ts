import { comAlfa } from './semantico';

// A luz da mesa (RN-DV.6, RN-DV.7). Provisória até a E4, quando a mesa vira Skia: por ora são
// gradientes nativos do React Native (`experimental_backgroundImage`).

/** Cor da luz no padrão de 4.200 K. Na E3 ela passa a vir da temperatura do painel. */
const LUZ_PADRAO = '#ffc478';
const LATAO = { brilho: '#fff6d8', claro: '#e9c66f', meio: '#c9a24a', sombra: '#5e4718' };

export const luz = {
  poca: `radial-gradient(closest-side, ${comAlfa(LUZ_PADRAO, 0.2)}, transparent 72%)`,
  luminaria: `radial-gradient(circle at 40% 62%, ${LATAO.brilho} 0%, ${LATAO.brilho} 9%, ${LATAO.claro} 10%, ${LATAO.claro} 16%, ${LATAO.meio} 23%, ${LATAO.meio} 56%, ${LATAO.sombra} 70%)`,
  luminariaSombra: '-14px 20px 30px rgba(0,0,0,0.55)',
} as const;
