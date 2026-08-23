// `PreferenciaLeitura` — Estágio 7 passo 5 (`02` §5, RN-02.16–RN-02.16g). Linha única por
// usuário: RN-02.16 é explícita — "por conta e sincronizadas, não por obra". Os valores default
// vêm de `packages/core/src/leitor/preferencias.ts` (única fonte de verdade dos defaults, para o
// app e os testes nunca divergirem).
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { colunaUsuarioId } from './colunas.js';

export const preferenciaLeitura = sqliteTable('preferencia_leitura', {
  usuarioId: colunaUsuarioId().primaryKey(),
  // RN-02.16g — chave do catálogo de 5 faces (packages/core CATALOGO_FACES).
  fonteChave: text('fonte_chave').notNull(),
  // Corpo, entrelinha e margem são escalas unitárias (1.0 = padrão do Readium), não px — o
  // Readium Navigator as trata como multiplicador, não medida absoluta (RN-02.16e vive dessa
  // escala: ajustar não pode depender de conhecer o tamanho real do texto renderizado).
  corpoEscala: real('corpo_escala').notNull(),
  entrelinhaEscala: real('entrelinha_escala').notNull(),
  margemEscala: real('margem_escala').notNull(),
  alinhamento: text('alinhamento', { enum: ['start', 'justify'] }).notNull(),
  tema: text('tema', { enum: ['claro', 'sepia', 'escuro', 'preto_puro'] }).notNull(),
  // RN-02.16a — kelvin, faixa TEMPERATURA_LUZ_MIN..MAX (glossario.md).
  temperaturaLuzK: integer('temperatura_luz_k').notNull(),
  // RN-02.16b — 0 (mínimo) a 1 (brilho do sistema, nunca acima dele).
  brilho: real('brilho').notNull(),
  // RN-02.17f — chave única de retorno sensorial; passo 7 ainda não consome, mas a preferência
  // já existe para não exigir migração quando ele entrar.
  retornoSensorialAtivo: integer('retorno_sensorial_ativo', { mode: 'boolean' }).notNull(),
  atualizadoEm: integer('atualizado_em', { mode: 'timestamp_ms' }).notNull(),
});
