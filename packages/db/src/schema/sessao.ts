// `SessaoLeitura`, `IntervaloInatividade`, `Destaque`, `Anotacao`, `ConsultaDicionario` —
// mvp.md §7, com a errata de telemetria-e-instrumentacao.md §18.1 aplicada desde a primeira
// linha (client_ulid, fuso/offset, blocos_foco, deriva_relogio_ms, origem "recuperada").
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { obra } from './biblioteca.js';
import { colunaId, colunaUsuarioId } from './colunas.js';

export const sessaoLeitura = sqliteTable('sessao_leitura', {
  // RN-TEL.32, RN-ST.9 — o próprio `id` é o `client_ulid`: gerado na criação, não no envio.
  id: colunaId(),
  usuarioId: colunaUsuarioId(),
  obraId: text('obra_id')
    .notNull()
    .references(() => obra.id),
  tipo: text('tipo', { enum: ['normal'] })
    .notNull()
    .default('normal'), // amostra/pilula ficam para quando `05`/`06` entrarem
  iniciadaEm: integer('iniciada_em', { mode: 'timestamp_ms' }).notNull(),
  encerradaEm: integer('encerrada_em', { mode: 'timestamp_ms' }),
  // RN-TEL.44 — fuso IANA e offset (minutos) vigentes no início; RN-TEL.47: sessão inteira usa o
  // fuso do início, mesmo em viagem.
  fuso: text('fuso').notNull(),
  offsetUtcMinutos: integer('offset_utc_minutos').notNull(),
  tempoBrutoS: integer('tempo_bruto_s').notNull(),
  tempoAtivoS: integer('tempo_ativo_s').notNull(),
  caracteresLidos: integer('caracteres_lidos').notNull(),
  volumeSuspeita: integer('volume_suspeita', { mode: 'boolean' }).notNull().default(false),
  maiorBlocoContinuoS: integer('maior_bloco_continuo_s').notNull(),
  // RN-TEL.15 — distribuição completa, não só o maior: { quantidade, medianaS, maiorS }.
  blocosFoco: text('blocos_foco', { mode: 'json' }),
  interacoesQualitativas: integer('interacoes_qualitativas').notNull().default(0),
  scoreLeituraConsciente: integer('score_leitura_consciente'),
  estilo: text('estilo', { enum: ['focado', 'metodico', 'equilibrado'] }),
  status: text('status', {
    enum: ['valida', 'curta', 'suspeita', 'rejeitada_sobreposicao', 'descartada'],
  }).notNull(),
  // RN-TEL.41 — "recuperada": sessão órfã fechada pelo servidor/cliente no último batimento.
  origem: text('origem', { enum: ['online', 'offline', 'recuperada'] }).notNull(),
  // RN-TEL.10 — divergência entre intervalo de parede e monotônico; sinal, não descarte.
  derivaRelogioMs: integer('deriva_relogio_ms').notNull().default(0),
  criadaEm: integer('criada_em', { mode: 'timestamp_ms' }).notNull(),
});

export const intervaloInatividade = sqliteTable('intervalo_inatividade', {
  id: colunaId(),
  sessaoId: text('sessao_id')
    .notNull()
    .references(() => sessaoLeitura.id),
  // RN-TEL.12 — taxonomia fechada.
  tipo: text('tipo', { enum: ['sistema', 'idle', 'encerradora'] }).notNull(),
  // RN-TEL.16 — pausa curta vs. longa; não muda número exibido, é insumo de produto.
  classificacao: text('classificacao', { enum: ['interrupcao', 'pausa_longa'] }).notNull(),
  inicioMono: integer('inicio_mono').notNull(),
  fimMono: integer('fim_mono').notNull(),
  duracaoS: integer('duracao_s').notNull(),
});

export const destaque = sqliteTable('destaque', {
  id: colunaId(),
  sessaoId: text('sessao_id')
    .notNull()
    .references(() => sessaoLeitura.id),
  obraId: text('obra_id')
    .notNull()
    .references(() => obra.id),
  locator: text('locator', { mode: 'json' }).notNull(),
  // Os 4 pigmentos de grifo são ferramenta da leitora (direcao-visual.md §2) — nunca da marca.
  pigmento: text('pigmento', { enum: ['ambar', 'oliva', 'tinta', 'carmim'] }).notNull(),
  criadoEm: integer('criado_em', { mode: 'timestamp_ms' }).notNull(),
});

export const anotacao = sqliteTable('anotacao', {
  id: colunaId(),
  sessaoId: text('sessao_id')
    .notNull()
    .references(() => sessaoLeitura.id),
  obraId: text('obra_id')
    .notNull()
    .references(() => obra.id),
  locator: text('locator', { mode: 'json' }).notNull(),
  texto: text('texto').notNull(),
  criadaEm: integer('criada_em', { mode: 'timestamp_ms' }).notNull(),
});

export const consultaDicionario = sqliteTable('consulta_dicionario', {
  id: colunaId(),
  sessaoId: text('sessao_id')
    .notNull()
    .references(() => sessaoLeitura.id),
  obraId: text('obra_id')
    .notNull()
    .references(() => obra.id),
  locator: text('locator', { mode: 'json' }).notNull(),
  termo: text('termo').notNull(),
  criadaEm: integer('criada_em', { mode: 'timestamp_ms' }).notNull(),
});
