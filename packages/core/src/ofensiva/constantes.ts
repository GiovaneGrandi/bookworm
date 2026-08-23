// Estágio 4 — constantes de meta, ofensiva, congelamento e jardim (glossario.md §2.2,
// `04-streaks-e-jardim.md`, `mvp.md` §5 e §8). Mesma disciplina do Estágio 3: tipadas e
// injetáveis, nunca lidas de singleton — o default é o que o MVP usa hoje, sem servidor.
export const CONSTANTES_OFENSIVA_PADRAO = {
  /** RN-04.6 — intervalo mínimo entre dois aumentos (ou trocas de unidade) do mesmo eixo, em dias. */
  INTERVALO_ALTERACAO_META_DIAS: 7,
  /** RN-04.13 — dias consecutivos que disparam marco, recompensa e item de jardim. */
  MARCOS_OFENSIVA: [7, 30, 100, 365] as const,
  /**
   * `mvp.md` §5 A-1, §8 — no MVP o congelamento é concedido, não comprado: estoque máximo 2 (não
   * os 3 de `RN-04.18`, que valem quando a compra existir).
   */
  FREEZE_MAX_ESTOQUE: 2,
  /** RN-04.18 — dias consecutivos que o estoque ainda protege; depois disso a ofensiva quebra. */
  FREEZE_MAX_CONSECUTIVOS: 2,
  /** `mvp.md` §5 A-1 — congelamentos concedidos automaticamente por mês corrido. */
  FREEZE_CONCESSAO_MENSAL: 1,
  /** RN-04.23 — limiares de dias consecutivos que definem o estágio do canteiro ativo. */
  JARDIM_ESTAGIOS: {
    broto: 1,
    muda: 7,
    plantaFlorida: 30,
    arvore: 100,
    bosque: 365,
  },
} as const;

export type ConstantesOfensiva = typeof CONSTANTES_OFENSIVA_PADRAO;

/** RN-04.4 — faixas permitidas por eixo e unidade. */
export const FAIXAS_META = {
  leitura: {
    paginas: { min: 5, max: 200 },
    minutos: { min: 5, max: 480 },
  },
  escrita: {
    palavras: { min: 50, max: 5000 },
    minutos: { min: 5, max: 480 },
  },
} as const;
