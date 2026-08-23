// Helpers de coluna compartilhados — `packages/db` é o schema Drizzle que hoje serve o SQLite
// local (`expo-sqlite`, Estágio 6) e vai servir o Postgres depois (Estágio 9, stack.md §4): não é
// literalmente a mesma tabela Drizzle nos dois dialetos, mas o mesmo desenho de coluna.
//
// `usuarioId` carrega um valor fixo (`USUARIO_LOCAL`) enquanto não há conta (Estágio 9 — auth):
// o dispositivo pertence a um usuário só, e a coluna já existe hoje para a sincronização não
// exigir migração de schema quando a conta chegar.
import { text } from 'drizzle-orm/sqlite-core';

export const USUARIO_LOCAL = 'local';

export function colunaId() {
  return text('id').primaryKey();
}

export function colunaUsuarioId() {
  return text('usuario_id').notNull().default(USUARIO_LOCAL);
}
