// Estágio 3 — formato do traço de eventos (RN-TEL.49). Cada evento carrega os dois carimbos
// (RN-TEL.10): `parede` é epoch em milissegundos (relógio ajustável, só usado para calendário —
// RN-TEL.8); `mono` é um monotônico com suspensão em milissegundos, referência arbitrária mas
// estável dentro do traço (RN-TEL.6/RN-TEL.7) — é dele, nunca de `parede`, que toda duração sai.
export type CarimboEvento = {
  parede: number;
  mono: number;
};

export type EventoSessaoIniciada = CarimboEvento & {
  tipo: 'sessao_iniciada';
  /** Posição inicial em caracteres no índice da obra, se conhecida (RN-TEL.21). */
  caracteres?: number;
};

export type EventoPosicaoAlterada = CarimboEvento & {
  tipo: 'posicao_alterada';
  /** Posição absoluta no índice de caracteres da obra (RN-ST.8). */
  caracteres: number;
  /** RN-TEL.22 — navegação explícita (sumário, busca, link interno): não gera volume. */
  salto?: boolean;
};

export type EventoInteracaoQualitativa = CarimboEvento & {
  tipo: 'interacao_qualitativa';
  subtipo: 'destaque' | 'nota' | 'dicionario';
};

/** RN-TEL.12 — taxonomia fechada. `idle` não é emitido: é derivado pela apuração (RN-03.10). */
export type EventoPausaIniciada = CarimboEvento & {
  tipo: 'pausa_iniciada';
  pausa: 'sistema';
};

export type EventoPausaEncerrada = CarimboEvento & {
  tipo: 'pausa_encerrada';
};

export type EventoSessaoEncerrada = CarimboEvento & {
  tipo: 'sessao_encerrada';
  motivo?: string;
};

export type EventoTraco =
  | EventoSessaoIniciada
  | EventoPosicaoAlterada
  | EventoInteracaoQualitativa
  | EventoPausaIniciada
  | EventoPausaEncerrada
  | EventoSessaoEncerrada;

export type TracoDeEventos = {
  /** IANA, vigente no início da sessão (RN-TEL.44). */
  fuso: string;
  /** Ordenados por `mono` crescente. */
  eventos: EventoTraco[];
};

/** RN-TEL.12 — tipo de pausa e classificação de retomada (RN-TEL.16). */
export type Pausa = {
  tipo: 'sistema' | 'idle';
  inicioMono: number;
  fimMono: number;
  duracaoS: number;
  classificacao: 'interrupcao' | 'pausa_longa';
};

export type ApuracaoTempoAtivo = {
  tempoBrutoS: number;
  tempoAtivoS: number;
  pausas: Pausa[];
};

export type ApuracaoBlocosDeFoco = {
  /** Duração de cada bloco de foco, em segundos, na ordem em que ocorreram. */
  blocos: number[];
  quantidade: number;
  maiorS: number;
  medianaS: number;
};

export type ApuracaoVolume = {
  caracteres: number;
  paginas: number;
  /** RN-03.26 — algum trecho excedeu o teto físico e foi limitado. */
  suspeita: boolean;
};

/**
 * Agregado mínimo de uma sessão já apurada, entrada de `calcularLeituraConsciente`,
 * `classificarEstilo` e `classificarSessao` (RN-TEL.48). Ao contrário das demais funções, estas
 * não recebem o traço bruto — recebem o resultado já combinado das apurações anteriores.
 */
export type SessaoApurada = {
  tempoAtivoS: number;
  tempoBrutoS: number;
  maiorBlocoContinuoS: number;
  /** Contagem bruta, sem o teto de RN-03.19 — a função aplica o teto internamente. */
  interacoesQualitativasBrutas: number;
  caracteresLidos: number;
  volumeSuspeita: boolean;
  sobreposta: boolean;
};

export type LeituraConsciente = {
  score: number;
  viaInteracao: number;
  viaFoco: number;
  /** RN-03.19 — contagem já com o teto de 1 por minuto de tempo ativo aplicado. */
  interacoesContadas: number;
};

export type EstiloDeLeitura = 'focado' | 'metodico' | 'equilibrado';

export type StatusSessao = 'valida' | 'curta' | 'suspeita';
