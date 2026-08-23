// Pigmentos e superfícies de specs/design-system.md §2, copiados como constantes para medir
// as primitivas. Não é o pacote packages/design (que só nasce no Estágio 2) — é só o
// suficiente para este app de prova renderizar com as cores reais do sistema.
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
};

export const supPapel = {
  fundo: pigmento.papel,
  tinta: pigmento.tinta,
  tintaFraca: pigmento.tinta70,
  acento: pigmento.verdeTinta,
  borda: pigmento.tinta32,
  sombra: 'rgba(36,31,25,.28)',
};
