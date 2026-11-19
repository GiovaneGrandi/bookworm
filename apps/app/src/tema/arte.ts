import { pigmento } from './pigmentos';
import { comAlfa } from './semantico';

// A arte dos objetos da mesa (direcao-visual.md §9, mockup B). São materiais de objeto, não
// superfícies onde vive texto: a madeira do fichário, o couro da capa, o latão, a fita verde e a
// grade de arame da bandeja. Ficam no tema, para nenhum componente escrever cor crua (RN-DS.1).

export const arte = {
  livro: {
    /** Pauta das páginas em miniatura: um traço de 1 px a cada 9 px. */
    linha: comAlfa(pigmento.tinta, 0.26),
    /** Sombra da dobra, para a lombada, no lado de dentro de cada página. */
    dobra: 'rgba(48,32,16,0.18)',
    /** Grão de papel 7×7 (P-1). */
    grao: 'rgba(96,74,46,0.075)',
    folio: pigmento.tinta70,
    /** A fita marcadora é a cor da marca. */
    fita: { borda: '#24492d', meio: '#3a6e46' },
    sombraFita: 'rgba(0,0,0,0.4)',
    sombraPagina: 'rgba(5,4,2,0.6)',
  },
  capa: {
    couro: '#5a2b25',
    lombada: '#3c1f1b',
    filete: 'rgba(214,180,120,0.55)',
    titulo: '#e8cf9f',
  },
  bandeja: {
    aro: '#8d877a',
    grade: '#6d685d',
    envelope: pigmento.papel,
    vinco: 'rgba(124,98,58,0.55)',
    selo: pigmento.verdeTinta,
    lapis: '#5f5949',
  },
  fichario: {
    claro: '#8a6040',
    escuro: '#6e4a2e',
    moldura: '#5e3f26',
    fundo: '#3b2818',
    ficha: '#efe3ce',
    aba: '#c6a575',
    placa: { claro: '#e2c06a', escuro: '#a88334', tinta: '#2b220f' },
  },
} as const;
