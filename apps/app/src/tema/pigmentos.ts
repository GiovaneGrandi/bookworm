// Camada 1 — pigmentos (design-system.md §2.1, direcao-visual.md §3).
// Valores crus. Só a própria pasta `src/tema/` importa este arquivo: componente nunca lê
// pigmento direto (RN-DS.1, RN-ST.3). A varredura em `test/design-system.test.ts` garante.
export const pigmento = {
  tinta: '#241f19',
  tinta70: 'rgba(36,31,25,.72)',
  tinta50: 'rgba(36,31,25,.52)',
  tinta32: 'rgba(36,31,25,.34)',
  tinta16: 'rgba(36,31,25,.16)',
  papel: '#f3ead9',
  papelFundo: '#efe3ce',
  grafite: '#6f6858',
  creme: '#e8dcc4',

  verdeTinta: '#2f5d3a',
  ambar: '#e6c15c',
  mesa: '#1e2320',

  // Os 4 pigmentos de grifo: ferramenta da leitora, não da marca.
  pigAmbar: '#e7c25e',
  pigOliva: '#a8b07a',
  pigTinta: '#93a9c0',
  pigCarmim: '#d79aa2',
} as const;
