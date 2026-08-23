// Estágio 4 — meta, ofensiva, congelamento, jardim e agregados (`04-streaks-e-jardim.md`,
// `03` §5.7). `Eixo` existe nos dois valores desde a primeira linha (RN-04.12, R-5): o MVP só
// expõe `leitura` (`mvp.md` §4.3), mas a modelagem nasce com os dois para a fase 1 não migrar
// nada.
// `EstiloDeLeitura` não é redeclarado aqui — vem de `../sessao/tipos.js` para não colidir com o
// export dela na raiz do pacote (`packages/core/src/index.ts` reexporta os dois módulos).
import type { EstiloDeLeitura } from '../sessao/tipos.js';

export type Eixo = 'leitura' | 'escrita';

export type UnidadeMeta = 'paginas' | 'minutos' | 'palavras';

export type MetaDiaria = {
  eixo: Eixo;
  unidade: UnidadeMeta;
  valor: number;
  /** Dia local, `YYYY-MM-DD`, a partir do qual esta meta vale (RN-04.7). */
  vigenteDesde: string;
  direcaoAlteracao: 'aumento' | 'reducao' | 'inicial';
  /** `null` quando a última alteração foi redução (RN-04.6a — sem atrito de intervalo). */
  proximaAlteracaoPermitidaEm: string | null;
};

export type PedidoAlteracaoMeta = {
  unidade: UnidadeMeta;
  valor: number;
};

export type ResultadoAlteracaoMeta =
  | { permitida: true; metaResultante: MetaDiaria }
  | { permitida: false; motivo: 'fora_da_faixa' }
  | { permitida: false; motivo: 'intervalo_minimo'; podeAlterarEm: string };

export type CelebracaoEstado = 'nao_aplicavel' | 'pendente' | 'exibida';

export type AgregadoDoDia = {
  eixo: Eixo;
  tempoAtivoS: number;
  paginasCanonicas: number;
};

/**
 * Estado já registrado do dia, se houver (RN-04.10f) — quando presente e já celebrado, o
 * cumprimento é **pegajoso**: não recua mesmo que o agregado de hoje, recalculado depois de uma
 * invalidação de sessão, mostrasse menos que a meta.
 */
export type DiaJaRegistrado = {
  cumprido: boolean;
  celebracaoEstado: CelebracaoEstado;
};

export type AvaliacaoMeta = {
  cumprida: boolean;
  realizado: number;
  meta: number;
  restante: number;
};

export type DiaParaOfensiva = {
  /** `YYYY-MM-DD` local — um registro por dia civil, sem buracos (RN-04.1). */
  dia: string;
  cumprido: boolean;
  protegidoPorCongelamento: boolean;
};

export type Ofensiva = {
  eixo: Eixo;
  contagemAtual: number;
  melhorMarca: number;
  /** Só tem sentido quando `estado === 'dormente'` (RN-04.14a). */
  contagemEncerrada: number;
  encerradaEm: string | null;
  ultimoDiaCumprido: string | null;
  estado: 'ativa' | 'dormente';
  acervoDiasCumpridos: number;
};

export type EstoqueCongelamento = {
  quantidade: number;
  /** `YYYY-MM` do último mês em que a concessão automática rodou (idempotência de A-1). */
  ultimaConcessaoMes: string | null;
};

export type DecisaoProtecaoDia =
  | { protegido: false; estoqueResultante: number }
  | { protegido: true; estoqueResultante: number };

export type EstagioJardim = 'broto' | 'muda' | 'planta_florida' | 'arvore' | 'bosque';

export type EstadoJardim = {
  estado: 'vivo' | 'dormente';
  estagio: EstagioJardim;
  /** RN-04.27 — acervo, nunca decresce; é o que decide o tamanho permanente do jardim. */
  tamanhoPermanente: number;
  melhorMarca: number;
  /** Presente só em dormência (RN-04.14a): a sequência que terminou, apresentada no passado. */
  contagemEncerrada: number | null;
};

export type SessaoParaAgregado = {
  /** Dia civil local já resolvido (Estágio 3, `dividirNaViradaDoDia`). */
  dia: string;
  eixo: Eixo;
  status: 'valida' | 'curta' | 'suspeita';
  tempoAtivoS: number;
  caracteres: number;
  interacoesQualitativas: number;
  maiorBlocoContinuoS: number;
  scoreLeituraConsciente: number;
  estilo: EstiloDeLeitura;
  obraConcluida: boolean;
};

export type AgregadoDiario = {
  dia: string;
  eixo: Eixo;
  tempoAtivoS: number;
  paginasCanonicas: number;
  sessoesValidas: number;
  sessoesCurtas: number;
  interacoesQualitativas: number;
  maiorBlocoContinuoS: number;
  /** Soma dos scores — a média é `somaLeituraConsciente / (sessoesValidas + sessoesCurtas)`. */
  somaLeituraConsciente: number;
  distribuicaoEstilo: Record<EstiloDeLeitura, number>;
  obrasConcluidas: number;
};

export type DiaDaSemana = {
  cumprido: boolean;
  agregado: AgregadoDiario;
};

export type FechamentoSemanal = {
  diasCumpridos: number;
  tempoTotalS: number;
  estiloPredominante: EstiloDeLeitura | null;
  /** Diferença de tempo ativo contra a semana anterior, em segundos; `null` sem semana anterior. */
  comparacaoTempoAnteriorS: number | null;
};
