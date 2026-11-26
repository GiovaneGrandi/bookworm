import { pigmento } from './pigmentos';
import { comAlfa } from './semantico';

// A arte dos objetos da mesa (direcao-visual.md §9, mockup B). São materiais de objeto, não
// superfícies onde vive texto: a madeira do fichário, o couro da capa, o latão, a fita verde e a
// grade de arame da bandeja. Ficam no tema, para nenhum componente escrever cor crua (RN-DS.1).

export const arte = {
  /** O véu do menu rápido (v2): escurece a mesa por trás da ficha. */
  veu: comAlfa('#0a0c0b', 0.5),
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

  /** A barra de navegação (régua de feltro): uma faixa do feltro, com a tela atual em latão. */
  barra: {
    fundo: '#272d29',
    filete: 'rgba(0,0,0,0.5)',
    ativo: '#e2c06a',
    latao: ['#e2c06a', '#a88334'] as [string, string],
    sombra: '0 -6px 12px rgba(0,0,0,0.35)',
  },
  /** A biblioteca na mesa: três lombadas em pé, cada uma com uma faixa (rodada de ícones, 22/11). */
  lombadas: {
    livros: [
      { capa: pigmento.verdeTinta, faixa: '#c9a650' },
      { capa: '#5a2b25', faixa: '#c9a650' },
      { capa: '#e8dcc4', faixa: pigmento.verdeTinta },
    ],
    /** O volume de cada lombada: luz à esquerda, sombra à direita. */
    volume: [comAlfa('#ffffff', 0.16), comAlfa('#ffffff', 0), comAlfa('#000000', 0.28)] as [
      string,
      string,
      string,
    ],
    sombra: [comAlfa('#000000', 0.55), comAlfa('#000000', 0)] as [string, string],
  },
  /** A estante expositora da v2: madeira clara, ripas e as capas de frente. */
  estante: {
    fundo: { claro: '#cbb89b', escuro: '#b9a382' },
    topo: '#e6d9c3',
    lateral: { esquerda: '#e6d9c3', direita: '#d8c7ab' },
    vao: {
      claro: 'rgba(48,32,16,0.14)',
      meio: 'rgba(48,32,16,0.04)',
      escuro: 'rgba(48,32,16,0.12)',
    },
    ripa: { claro: '#f5ecdc', meio: '#e5d7be', escuro: '#cbb797', filete: '#9d8563' },
    sombra: 'rgba(48,32,16,0.28)',
    rodape: 'rgba(243,234,217,0.35)',
    rodapeTinta: '#2f2419',
    sombraCapa: 'rgba(20,14,8,0.38)',
    /** Pares fundo/tinta das capas do mockup; cada obra fica sempre com o mesmo par. */
    capas: [
      { fundo: '#3b3a36', tinta: pigmento.papel },
      { fundo: '#c6a575', tinta: pigmento.tinta },
      { fundo: '#7a6a52', tinta: pigmento.papel },
      { fundo: '#2f5d3a', tinta: pigmento.papel },
      { fundo: '#b2603f', tinta: pigmento.papel },
      { fundo: '#4b4060', tinta: pigmento.papel },
      { fundo: '#8a4428', tinta: pigmento.papel },
      { fundo: '#3c1f1b', tinta: pigmento.papel },
      { fundo: '#2f4a36', tinta: pigmento.papel },
      { fundo: '#3f5a68', tinta: pigmento.papel },
      { fundo: '#d9c08c', tinta: pigmento.tinta },
      { fundo: '#5e4718', tinta: pigmento.papel },
      { fundo: '#93a9c0', tinta: '#1f1a16' },
      { fundo: '#553a23', tinta: pigmento.papel },
      { fundo: '#5a2b25', tinta: pigmento.papel },
      { fundo: '#c39d43', tinta: pigmento.tinta },
      { fundo: '#e6c15c', tinta: pigmento.tinta },
      { fundo: '#6b3b3b', tinta: pigmento.papel },
      { fundo: '#5f5949', tinta: pigmento.papel },
      { fundo: '#6e4a2e', tinta: pigmento.papel },
      { fundo: '#a9854f', tinta: pigmento.tinta },
    ],
  },
} as const;
