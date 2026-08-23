// Camada 1 — pigmentos. Valores crus de `specs/design-system.md` §2.1, herdados de
// `specs/direcao-visual.md` §3 sem alteração. Nunca lido por um componente (RN-DS.1) — só uma
// superfície pode ler daqui.
export const pigmento = {
  tinta: '#241f19',
  tinta70: 'rgba(36,31,25,.72)',
  tinta50: 'rgba(36,31,25,.52)',
  tinta32: 'rgba(36,31,25,.34)',
  tinta16: 'rgba(36,31,25,.16)',
  papel: '#f3ead9',
  papelFundo: '#efe3ce',
  grafite: '#6f6858',

  verdeTinta: '#2f5d3a',
  ambar: '#e6c15c',
  mesa: '#1e2320',

  pigAmbar: '#e7c25e',
  pigOliva: '#a8b07a',
  pigTinta: '#93a9c0',
  pigCarmim: '#d79aa2',
} as const;

export type NomePigmento = keyof typeof pigmento;
