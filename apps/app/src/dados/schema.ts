import type { EstadoObra, Formato } from '@bookworm/core';
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Tudo local, em SQLite (Q8). A forma das tabelas acompanha `migracoes.ts`; mudar uma exige
// uma migração nova, nunca editar uma antiga.

export const obra = sqliteTable('obra', {
  id: text('id').primaryKey(), // ULID
  titulo: text('titulo').notNull(),
  autor: text('autor'),
  idioma: text('idioma'),
  formato: text('formato').$type<Formato>().notNull(),
  origem: text('origem').$type<'importada' | 'dominio_publico'>().notNull(),
  /** Qual livro do acervo embutido; null para arquivo importado. */
  chaveAcervo: text('chave_acervo').unique(),
  nomeArquivo: text('nome_arquivo').notNull(),
  /** URI do arquivo copiado para o diretório do app. */
  caminho: text('caminho').notNull(),
  tamanho: integer('tamanho').notNull(),
  estado: text('estado').$type<EstadoObra>().notNull().default('quero_ler'),
  importadoEm: integer('importado_em').notNull(),
  abertoEm: integer('aberto_em'),
  /** Locator do Readium, serializado (E3). */
  locator: text('locator'),
  progresso: real('progresso').notNull().default(0),
  /** Total de caracteres do conteúdo principal (RN-02.10); null para PDF (Q5). */
  totalCaracteres: integer('total_caracteres'),
});

/** Índice de caracteres por recurso da espinha, gerado uma vez na importação (RN-ST.8). */
export const indiceCaracteres = sqliteTable(
  'indice_caracteres',
  {
    obraId: text('obra_id')
      .notNull()
      .references(() => obra.id, { onDelete: 'cascade' }),
    ordem: integer('ordem').notNull(),
    href: text('href').notNull(),
    inicio: integer('inicio').notNull(),
    caracteres: integer('caracteres').notNull(),
    incluido: integer('incluido', { mode: 'boolean' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.obraId, t.ordem] })]
);

export type Obra = typeof obra.$inferSelect;
export type NovaObra = typeof obra.$inferInsert;
