// Camada 2 — superfícies. `specs/design-system.md` §2.2: cada material rebinda fundo/tinta/acento
// (RN-DS.3 — os cinco: fundo, tinta, acento, borda, sombra; a spec só fixa valor exato de
// fundo/tinta/acento por material na tabela de §2.2). Componente nunca lê pigmento direto
// (RN-DS.1); só a superfície resolve para a camada 1.
//
// `borda`, `sombra`, `tintaFraca` e `grao` — Estágio 5, para o Unistyles ter os cinco completos
// mais os dois extras que §2.2 lista (`--sup-tinta-fraca`, `--sup-grao`). A spec não fixa valor
// exato por material para esses quatro; decisão de implementação, não de design, registrada aqui
// em vez de virar `Q-DS` porque cada um já deriva de uma regra existente:
// - `borda`: RN-DS.7 fixa um único valor concreto (tinta marrom translúcida, sem variar por
//   material) — usado igual nas oito superfícies.
// - `sombra`: RN-DS.6/§4.3 já dão a régua — marrom-quente sobre papel, neutra profunda sobre
//   superfície escura. Aqui usa-se a altura "pousado" (a mais comum, cartão em repouso); as
//   outras duas alturas vivem em `movimento.ts` de `apps/app`, não aqui, por não serem
//   por-material.
// - `tintaFraca`: derivada como a própria `tinta` do material a 72% (o mesmo fator de
//   `--tinta-70`/`tinta70` que §2.2 já mede para `papel` — 5,89:1, "texto de qualquer corpo").
//   Precisa ser derivada de `tinta`, nunca de um valor fixo: um `tintaFraca` sempre escuro
//   quebraria silenciosamente em qualquer superfície de fundo escuro (`mesa`, `carvao`,
//   `cianotipo`), onde a tinta em si é clara — achado real desta rodada, visto ao renderizar
//   `bw-abas-fichario` sobre `mesa` com o valor fixo antigo (texto quase invisível).
// - `grao`: mesmo asset PNG 7×7 (`P-1`) em todas — a textura não muda por material, só a base
//   sobre a qual ela é composta.
import { corComAlfa } from './corComAlfa.js';
import { pigmento } from './pigmentos.js';

export type Superficie = {
  fundo: string;
  tinta: string;
  tintaFraca: string;
  acento: string;
  borda: string;
  sombra: string;
};

const BORDA_PADRAO = 'rgba(124,98,58,0.32)'; // RN-DS.7 — tinta marrom translúcida, nunca cinza/preta
const SOMBRA_SOBRE_PAPEL = 'rgba(48,32,16,0.22)'; // §4.3 --sombra-pousado, sobre papel
const SOMBRA_SOBRE_ESCURO = 'rgba(0,0,0,0.38)'; // §4.3 --sombra-pousado, sobre superfície escura
const ALFA_TINTA_FRACA = 0.72; // mesmo fator de pigmento.tinta70 (§2.2)

type SuperficieSemTintaFraca = Omit<Superficie, 'tintaFraca'>;

function comTintaFracaDerivada(sup: SuperficieSemTintaFraca): Superficie {
  return { ...sup, tintaFraca: corComAlfa(sup.tinta, ALFA_TINTA_FRACA) };
}

const superficiesSemTintaFraca = {
  mesa: {
    fundo: pigmento.mesa,
    tinta: pigmento.papel,
    acento: pigmento.ambar,
    borda: BORDA_PADRAO,
    sombra: SOMBRA_SOBRE_ESCURO,
  },
  papel: {
    fundo: pigmento.papel,
    tinta: pigmento.tinta,
    acento: pigmento.verdeTinta,
    borda: BORDA_PADRAO,
    sombra: SOMBRA_SOBRE_PAPEL,
  },
  papelFundo: {
    fundo: pigmento.papelFundo,
    tinta: pigmento.tinta,
    acento: pigmento.verdeTinta,
    borda: BORDA_PADRAO,
    sombra: SOMBRA_SOBRE_PAPEL,
  },
  sepia: {
    fundo: '#e7d5b4',
    tinta: '#3a2e20',
    acento: pigmento.verdeTinta,
    borda: BORDA_PADRAO,
    sombra: SOMBRA_SOBRE_PAPEL,
  },
  kraft: {
    fundo: '#c8a97e',
    tinta: '#2b2117',
    acento: '#8a5a12',
    borda: BORDA_PADRAO,
    sombra: SOMBRA_SOBRE_PAPEL,
  },
  // `vegetal` é "translúcido" na tabela da spec, não um hex — `transparent` é a aproximação mais
  // honesta em CSS/RN; revisar quando a spec fixar um valor de opacidade real.
  vegetal: {
    fundo: 'transparent',
    tinta: pigmento.tinta,
    acento: pigmento.verdeTinta,
    borda: BORDA_PADRAO,
    sombra: SOMBRA_SOBRE_PAPEL,
  },
  carvao: {
    fundo: '#221f1b',
    tinta: '#e8dcc4',
    acento: pigmento.ambar,
    borda: BORDA_PADRAO,
    sombra: SOMBRA_SOBRE_ESCURO,
  },
  cianotipo: {
    fundo: '#1d3a56',
    tinta: '#dce8f2',
    acento: '#dce8f2',
    borda: BORDA_PADRAO,
    sombra: SOMBRA_SOBRE_ESCURO,
  },
} as const satisfies Record<string, SuperficieSemTintaFraca>;

export const superficie = Object.fromEntries(
  Object.entries(superficiesSemTintaFraca).map(([nome, sup]) => [nome, comTintaFracaDerivada(sup)])
) as Record<keyof typeof superficiesSemTintaFraca, Superficie>;

export type NomeSuperficie = keyof typeof superficie;
