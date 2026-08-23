// Outbox local (stack.md §7) — a fila existe e os itens se acumulam desde o Estágio 6; **nada é
// enviado ainda**, não há servidor até o Estágio 9. `RN-TEL.33`: o batimento transporta estado
// acumulado, não delta — por isso a chave é `(tipo, referenciaId)`: um novo batimento da mesma
// sessão **substitui** o pendente em vez de empilhar, e um batimento perdido não deixa buraco.
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { colunaUsuarioId } from './colunas.js';

export const itemOutbox = sqliteTable(
  'item_outbox',
  {
    usuarioId: colunaUsuarioId(),
    // Catálogo fechado (RN-TEL.31), restrito ao que este estágio produz — cresce quando o
    // servidor existir (Estágio 9) e houver mais tipos de payload a enfileirar.
    tipo: text('tipo', { enum: ['sessao_batimento', 'sessao_encerrada'] }).notNull(),
    // Id estável do que está sendo sincronizado (o `client_ulid` da sessão) — RN-ST.9: gerado na
    // criação, não no envio, para o reenvio ser idempotente.
    referenciaId: text('referencia_id').notNull(),
    payload: text('payload', { mode: 'json' }).notNull(),
    criadoEm: integer('criado_em', { mode: 'timestamp_ms' }).notNull(),
    atualizadoEm: integer('atualizado_em', { mode: 'timestamp_ms' }).notNull(),
    enviadoEm: integer('enviado_em', { mode: 'timestamp_ms' }),
    tentativas: integer('tentativas').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.usuarioId, t.tipo, t.referenciaId] })]
);
