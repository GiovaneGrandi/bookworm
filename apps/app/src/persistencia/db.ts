// stack.md §7, plano Estágio 6 passo 1 — `expo-sqlite` (WAL) + Drizzle, schema em
// `@bookworm/db`. O schema aplicado uma vez, de forma idempotente (`CREATE TABLE IF NOT
// EXISTS`) — ver `packages/db/src/ddl.ts` para o porquê de não usar o migrator incremental do
// Drizzle ainda.
import * as schema from '@bookworm/db';
import { CRIAR_TABELAS_SQLITE } from '@bookworm/db';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const NOME_BANCO = 'bookworm.db';

let instancia: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function abrirBanco() {
  if (instancia) return instancia;

  const sqlite = openDatabaseSync(NOME_BANCO, { enableChangeListener: false });
  // WAL — leitura e escrita não se bloqueiam mutuamente; relevante porque a máquina de estados
  // grava a cada transição (RN-TEL.2) enquanto telas podem estar lendo agregados ao mesmo tempo.
  sqlite.execSync('PRAGMA journal_mode = WAL;');
  sqlite.execSync('PRAGMA foreign_keys = ON;');

  for (const instrucao of CRIAR_TABELAS_SQLITE) {
    sqlite.execSync(instrucao);
  }

  instancia = drizzle(sqlite, { schema });
  return instancia;
}
