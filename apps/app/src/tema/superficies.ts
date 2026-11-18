import { pigmento } from './pigmentos';

// Camada 2 — superfícies (design-system.md §2.2; valores do catálogo mockups/design-system.html).
// Cada material rebinda os mesmos tokens. Um componente declara a superfície em que vive e lê
// só `theme.sup[superficie]` (RN-DS.2, RN-ST.3).

// Sombra com fonte (RN-DV.7): a luminária fica no canto superior da mesa, então toda sombra cai
// para baixo e para a esquerda. Desfoques e opacidades são os de design-system.md §4.3; o
// deslocamento horizontal negativo é metade do vertical.
const sombraSobrePapel = {
  pousado: '-1px 2px 5px rgba(48,32,16,0.22)',
  erguido: '-4px 8px 16px rgba(48,32,16,0.28)',
  flutuante: '-9px 18px 34px rgba(48,32,16,0.34)',
};
const sombraSobreEscuro = {
  pousado: '-1px 2px 6px rgba(0,0,0,0.38)',
  erguido: '-5px 10px 22px rgba(0,0,0,0.45)',
  flutuante: '-17px 34px 60px rgba(0,0,0,0.62)',
};

export type Superficie = {
  fundo: string;
  tinta: string;
  tintaFraca: string;
  acento: string;
  borda: string;
  grao: string;
  sombra: typeof sombraSobrePapel;
  escura: boolean;
};

export const superficies = {
  mesa: {
    fundo: pigmento.mesa,
    tinta: pigmento.creme,
    tintaFraca: 'rgba(232,220,196,.62)',
    acento: pigmento.ambar,
    borda: 'rgba(232,220,196,.20)',
    grao: 'rgba(255,255,255,.04)',
    sombra: sombraSobreEscuro,
    escura: true,
  },
  papel: {
    fundo: pigmento.papel,
    tinta: pigmento.tinta,
    tintaFraca: pigmento.tinta70,
    acento: pigmento.verdeTinta,
    borda: 'rgba(124,98,58,.34)',
    grao: 'rgba(96,74,46,.075)',
    sombra: sombraSobrePapel,
    escura: false,
  },
  papelFundo: {
    fundo: pigmento.papelFundo,
    tinta: pigmento.tinta,
    tintaFraca: pigmento.tinta70,
    acento: pigmento.verdeTinta,
    borda: 'rgba(124,98,58,.36)',
    grao: 'rgba(96,74,46,.085)',
    sombra: sombraSobrePapel,
    escura: false,
  },
  sepia: {
    fundo: '#e7d5b4',
    tinta: '#3a2e20',
    tintaFraca: 'rgba(58,46,32,.74)',
    acento: pigmento.verdeTinta,
    borda: 'rgba(110,84,46,.40)',
    grao: 'rgba(90,60,30,.09)',
    sombra: sombraSobrePapel,
    escura: false,
  },
  kraft: {
    fundo: '#c8a97e',
    tinta: '#2b2117',
    tintaFraca: 'rgba(43,33,23,.78)',
    acento: '#8a5a12', // reprova contraste (2,66:1) — Q-DS.1
    borda: 'rgba(70,48,20,.42)',
    grao: 'rgba(70,48,20,.14)',
    sombra: sombraSobrePapel,
    escura: false,
  },
  vegetal: {
    fundo: '#efe4c8',
    tinta: pigmento.tinta,
    tintaFraca: pigmento.tinta70,
    acento: pigmento.verdeTinta,
    borda: 'rgba(124,98,58,.30)',
    grao: 'rgba(96,74,46,.05)',
    sombra: sombraSobrePapel,
    escura: false,
  },
  carvao: {
    fundo: '#221f1b',
    tinta: pigmento.creme,
    tintaFraca: 'rgba(232,220,196,.76)',
    acento: pigmento.ambar,
    borda: 'rgba(232,220,196,.22)',
    grao: 'rgba(255,255,255,.045)',
    sombra: sombraSobreEscuro,
    escura: true,
  },
  cianotipo: {
    fundo: '#1d3a56',
    tinta: '#dce8f2',
    tintaFraca: 'rgba(220,232,242,.78)',
    acento: '#dce8f2',
    borda: 'rgba(220,232,242,.24)',
    grao: 'rgba(255,255,255,.05)',
    sombra: sombraSobreEscuro,
    escura: true,
  },
} satisfies Record<string, Superficie>;

export type NomeSuperficie = keyof typeof superficies;
