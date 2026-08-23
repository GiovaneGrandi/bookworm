// A máquina de estados da sessão (RN-TEL.1) e o traço bruto que a alimenta. `RN-TEL.2` — toda
// transição é gravada em disco **antes** de valer: por isso `sessaoEmCurso` é uma linha só por
// sessão (o snapshot do estado atual, sobrescrito a cada transição) e `eventoBrutoSessao` é o
// traço completo, append-only — o mesmo formato de `TracoDeEventos` de @bookworm/core
// (RN-TEL.48/RN-TEL.49): o traço persistido aqui é literalmente o traço que `apurarTempoAtivo` /
// `apurarVolume` / `apurarBlocosDeFoco` consomem, sem tradução.
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { obra } from './biblioteca.js';
import { colunaId, colunaUsuarioId } from './colunas.js';

export const sessaoEmCurso = sqliteTable('sessao_em_curso', {
  // O mesmo `client_ulid` que, ao encerrar, vira `SessaoLeitura.id` (RN-ST.9).
  id: colunaId(),
  usuarioId: colunaUsuarioId(),
  obraId: text('obra_id')
    .notNull()
    .references(() => obra.id),
  // RN-TEL.1 — os cinco estados canônicos, mais `encerrada` (a sessão já apurada some desta
  // tabela; enquanto o encerramento ainda não foi totalmente processado, fica aqui como
  // `encerrada` até a apuração gravar em `sessao_leitura` e remover a linha).
  estado: text('estado', {
    enum: ['ociosa', 'ativa', 'pausada_sistema', 'pausada_idle', 'encerrada', 'orfa'],
  }).notNull(),
  fuso: text('fuso').notNull(),
  offsetUtcMinutos: integer('offset_utc_minutos').notNull(),
  // Último carimbo de qualquer sinal recebido — RN-TEL.42 usa isso para decidir retomar ou abrir
  // sessão nova ao reabrir o app.
  ultimoSinalParedeMs: integer('ultimo_sinal_parede_ms').notNull(),
  ultimoSinalMonoMs: integer('ultimo_sinal_mono_ms').notNull(),
  atualizadaEm: integer('atualizada_em', { mode: 'timestamp_ms' }).notNull(),
});

export const eventoBrutoSessao = sqliteTable('evento_bruto_sessao', {
  id: colunaId(),
  sessaoId: text('sessao_id')
    .notNull()
    .references(() => sessaoEmCurso.id),
  // Catálogo fechado (RN-TEL.31) — mesmo vocabulário de `EventoTraco['tipo']` em
  // @bookworm/core/src/sessao/tipos.ts. Não redeclarar os tipos aqui: este texto é validado
  // contra aquele union type na camada de persistência de `apps/app`, não em SQL.
  tipo: text('tipo').notNull(),
  paredeMs: integer('parede_ms').notNull(),
  monoMs: integer('mono_ms').notNull(),
  // Campos que variam por tipo de evento (`caracteres`, `pausa`, `subtipo`, `salto`, `motivo`) —
  // guardados como JSON em vez de uma coluna por campo, porque a forma já está travada pelo tipo
  // TS de `EventoTraco` (a fonte de verdade), e uma tabela larga com metade das colunas sempre
  // nulas não adiciona nada que o tipo já não garanta.
  payload: text('payload', { mode: 'json' }).notNull(),
});
