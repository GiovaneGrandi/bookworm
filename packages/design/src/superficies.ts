// Camada 2 — superfícies. `specs/design-system.md` §2.2: cada material rebinda fundo/tinta/acento
// (RN-DS.3 — os cinco: fundo, tinta, acento, borda, sombra; a spec só fixa valor exato de
// fundo/tinta/acento por material na tabela de §2.2). `--sup-borda`, `--sup-sombra` e
// `--sup-tinta-fraca` por material **não têm valor fixado na spec ainda** — Q- a abrir, não
// inventar aqui (regra 9 do plano). Componente nunca lê pigmento direto (RN-DS.1); só a
// superfície resolve para a camada 1.
import { pigmento } from './pigmentos.js';

export type Superficie = {
  fundo: string;
  tinta: string;
  acento: string;
};

export const superficie = {
  mesa: { fundo: pigmento.mesa, tinta: pigmento.papel, acento: pigmento.ambar },
  papel: { fundo: pigmento.papel, tinta: pigmento.tinta, acento: pigmento.verdeTinta },
  papelFundo: { fundo: pigmento.papelFundo, tinta: pigmento.tinta, acento: pigmento.verdeTinta },
  sepia: { fundo: '#e7d5b4', tinta: '#3a2e20', acento: pigmento.verdeTinta },
  kraft: { fundo: '#c8a97e', tinta: '#2b2117', acento: '#8a5a12' },
  // `vegetal` é "translúcido" na tabela da spec, não um hex — `transparent` é a aproximação mais
  // honesta em CSS; revisar quando a spec fixar um valor de opacidade real.
  vegetal: { fundo: 'transparent', tinta: pigmento.tinta, acento: pigmento.verdeTinta },
  carvao: { fundo: '#221f1b', tinta: '#e8dcc4', acento: pigmento.ambar },
  cianotipo: { fundo: '#1d3a56', tinta: '#dce8f2', acento: '#dce8f2' },
} as const satisfies Record<string, Superficie>;

export type NomeSuperficie = keyof typeof superficie;
