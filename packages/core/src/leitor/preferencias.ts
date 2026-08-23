// Estágio 7 passo 5 — painel de leitura (`02` §5, RN-02.16–RN-02.16g). `CATALOGO_FACES` é a
// tradução em dado do catálogo obrigatório de 5 faces (§119 do spec); `PREFERENCIAS_LEITURA_PADRAO`
// é a única fonte de verdade dos valores default, para o schema de `packages/db` e a UI de
// `apps/app` nunca divergirem. `paraPreferenciasDeNavegador` traduz nosso domínio para o formato
// que o Readium Navigator espera — corpo, entrelinha e margem são escalas unitárias no Readium
// (1.0 = padrão dele), não px (RN-02.16e depende disso: o ajuste nunca precisa saber o tamanho
// real do texto renderizado, só a escala).
export type FaceLeitura =
  | 'spectral'
  | 'eb_garamond'
  | 'public_sans'
  | 'atkinson_hyperlegible'
  | 'courier_prime';

export type TemaLeitura = 'claro' | 'sepia' | 'escuro' | 'preto_puro';
export type AlinhamentoLeitura = 'start' | 'justify';

export type FaceCatalogada = {
  chave: FaceLeitura;
  rotulo: string;
  papel: string;
  /** RN-02.16g — só para exibição na UI; o corpo de verdade é `corpoEscala` (unitário). */
  corpoInicialPx: number;
  entrelinhaInicialPx: number;
};

/** RN-02.16g — pelo menos uma serifada, uma sans e uma de alta legibilidade; a tabela do spec. */
export const CATALOGO_FACES: readonly FaceCatalogada[] = [
  {
    chave: 'spectral',
    rotulo: 'Spectral',
    papel: 'padrão',
    corpoInicialPx: 16,
    entrelinhaInicialPx: 27,
  },
  {
    chave: 'eb_garamond',
    rotulo: 'EB Garamond',
    papel: 'old-style alternativa',
    corpoInicialPx: 17,
    entrelinhaInicialPx: 27,
  },
  {
    chave: 'public_sans',
    rotulo: 'Public Sans',
    papel: 'sans — obrigatória',
    corpoInicialPx: 15.5,
    entrelinhaInicialPx: 26,
  },
  {
    chave: 'atkinson_hyperlegible',
    rotulo: 'Atkinson Hyperlegible',
    papel: 'alta legibilidade — obrigatória',
    corpoInicialPx: 17,
    entrelinhaInicialPx: 28,
  },
  {
    chave: 'courier_prime',
    rotulo: 'Courier Prime',
    papel: 'monoespaço',
    corpoInicialPx: 13.5,
    entrelinhaInicialPx: 24,
  },
] as const;

// glossario.md §2 — RN-02.16a.
export const TEMPERATURA_LUZ_MIN = 2700;
export const TEMPERATURA_LUZ_MAX = 6500;
export const TEMPERATURA_LUZ_PADRAO = 4200;

export type PreferenciasDeLeitura = {
  fonteChave: FaceLeitura;
  corpoEscala: number;
  entrelinhaEscala: number;
  margemEscala: number;
  alinhamento: AlinhamentoLeitura;
  tema: TemaLeitura;
  temperaturaLuzK: number;
  brilho: number;
  retornoSensorialAtivo: boolean;
};

export const PREFERENCIAS_LEITURA_PADRAO: PreferenciasDeLeitura = {
  fonteChave: 'spectral',
  corpoEscala: 1,
  entrelinhaEscala: 1,
  margemEscala: 1,
  alinhamento: 'start',
  tema: 'claro',
  temperaturaLuzK: TEMPERATURA_LUZ_PADRAO,
  brilho: 1,
  retornoSensorialAtivo: true,
};

/** Estágio 7 — o WebView do Readium não tem as 5 faces reais embarcadas (exigiria registrar
 * @font-face nativo, fora do escopo desta rodada); cada face cai na família genérica mais
 * próxima da sua categoria. Spectral/EB Garamond (serifadas) e Public Sans/Atkinson Hyperlegible
 * (sans) renderizam iguais entre si por ora — a escolha na UI já existe e persiste, só a
 * renderização real das 5 faces distintas fica pendente. */
type FamiliaReadium = 'serif' | 'sans-serif' | 'monospace';

const FAMILIA_READIUM_POR_FACE: Record<FaceLeitura, FamiliaReadium> = {
  spectral: 'serif',
  eb_garamond: 'serif',
  public_sans: 'sans-serif',
  atkinson_hyperlegible: 'sans-serif',
  courier_prime: 'monospace',
};

const TEMA_READIUM: Record<
  TemaLeitura,
  { theme: 'light' | 'dark' | 'sepia'; backgroundColor?: string; textColor?: string }
> = {
  claro: { theme: 'light' },
  sepia: { theme: 'sepia' },
  escuro: { theme: 'dark' },
  // RN-02.17 — "preto puro (OLED)" não é um tema nativo do Readium; sobrepõe cores no tema escuro.
  preto_puro: { theme: 'dark', backgroundColor: '#000000', textColor: '#ffffff' },
};

export type PreferenciasDeNavegador = {
  theme: 'light' | 'dark' | 'sepia';
  backgroundColor?: string;
  textColor?: string;
  fontFamily: FamiliaReadium;
  fontSize: number;
  lineHeight: number;
  pageMargins: number;
  textAlign: AlinhamentoLeitura;
};

export function paraPreferenciasDeNavegador(prefs: PreferenciasDeLeitura): PreferenciasDeNavegador {
  return {
    ...TEMA_READIUM[prefs.tema],
    fontFamily: FAMILIA_READIUM_POR_FACE[prefs.fonteChave],
    fontSize: prefs.corpoEscala,
    lineHeight: prefs.entrelinhaEscala,
    pageMargins: prefs.margemEscala,
    textAlign: prefs.alinhamento,
  };
}
