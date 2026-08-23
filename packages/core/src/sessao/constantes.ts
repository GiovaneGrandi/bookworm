// Estágio 3 — constantes da apuração de sessão (glossario.md §2.2, telemetria §17). Todas
// *(a validar)*: o default fica aqui só até o Estágio 9 ter servidor com configuração própria
// (mvp.md §8); a assinatura de toda função de `sessao/` aceita override para essa migração não
// exigir refatoração. Nunca ler de singleton — RN-TEL.48.
export const CONSTANTES_SESSAO_PADRAO = {
  /** RN-03.2 — 1 página canônica, em caracteres com espaços. */
  PAGINA_CANONICA_CARACTERES: 1500,
  /** RN-03.10, RN-TEL.12 — silêncio de interação que vira pausa `idle`. */
  IDLE_TIMEOUT_SEGUNDOS: 90,
  /** RN-03.6 — segundo plano contínuo que encerra a sessão. */
  SESSAO_TIMEOUT_MINUTOS: 30,
  /** RN-03.7 — abaixo disso a sessão é `curta`. */
  SESSAO_MINIMA_SEGUNDOS: 60,
  /** RN-03.26, RN-TEL.25 — teto físico de leitura, em caracteres por minuto de tempo ativo. */
  RITMO_MAXIMO_FISICO: 2500,
  /** RN-03.8 — teto diário de tempo de pílula que conta para a meta, em segundos. */
  PILULA_TETO_META_SEGUNDOS: 5 * 60,
  /** RN-03.17 — peso do componente de tempo do score de Leitura Consciente. */
  MR_PESO_TEMPO: 60,
  /** RN-03.17 — peso do componente de profundidade. */
  MR_PESO_PROFUNDIDADE: 40,
  /** RN-03.17 — densidade esperada de interação qualitativa, em minutos de tempo ativo por interação. */
  MR_INTERACAO_ESPERADA_MINUTOS: 10,
  /** RN-03.17 — bloco contínuo que satura a via do foco, em minutos. */
  MR_FOCO_ESPERADO_MINUTOS: 20,
  /** RN-03.22 — diferença relativa máxima entre as duas vias para o estilo ser "equilibrado". */
  MR_LIMIAR_EQUILIBRIO: 0.2,
  /** RN-TEL.3, RN-TEL.14 — sinal transitório abaixo disso não vira pausa nem quebra bloco de foco. */
  PAUSA_GRACA_SEGUNDOS: 3,
  /** RN-TEL.16 — fronteira entre pausa `interrupcao` e `pausa_longa`. */
  RETOMADA_RAPIDA_SEGUNDOS: 300,
  /** RN-TEL.25 — janela de aplicação do teto físico de ritmo. */
  JANELA_TETO_FISICO_SEGUNDOS: 60,
  /** RN-TEL.28 — divisor único de caracteres para palavras. */
  CARACTERES_POR_PALAVRA: 6,
} as const;

export type ConstantesSessao = typeof CONSTANTES_SESSAO_PADRAO;
