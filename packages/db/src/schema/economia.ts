// `Carteira`, `LancamentoLedger` — mvp.md §7 "Previstas mas vazias": a cadeia financeira nasce
// modelada e sem movimento (nenhum lançamento é gravado no MVP), para a fase 1 não exigir
// migração. `RN-ST.5` — todo lançamento é idempotente por chave única, nunca um UPDATE
// incremental: por isso o saldo em `carteira` é só uma projeção, e `RN-07.28` (fonte de verdade é
// o ledger) já vale por desenho, mesmo hoje sem nenhuma linha.
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { colunaId, colunaUsuarioId } from './colunas.js';

export const carteira = sqliteTable('carteira', {
  usuarioId: colunaUsuarioId().primaryKey(),
  saldo: integer('saldo').notNull().default(0),
  atualizadaEm: integer('atualizada_em', { mode: 'timestamp_ms' }).notNull(),
});

export const lancamentoLedger = sqliteTable('lancamento_ledger', {
  // Chave única de idempotência (RN-ST.5) — o próprio id, gerado no cliente, cumpre o papel.
  id: colunaId(),
  usuarioId: colunaUsuarioId(),
  tipo: text('tipo', { enum: ['credito', 'debito'] }).notNull(),
  valor: integer('valor').notNull(),
  motivo: text('motivo').notNull(),
  criadoEm: integer('criado_em', { mode: 'timestamp_ms' }).notNull(),
});
