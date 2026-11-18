import { getTableConfig } from 'drizzle-orm/sqlite-core';
import { describe, expect, it } from 'vitest';
import { MIGRACOES } from '../src/dados/migracoes';
import { indiceCaracteres, obra } from '../src/dados/schema';

/** Colunas de cada CREATE TABLE das migrações, na ordem declarada. */
function colunasDasMigracoes(): Map<string, string[]> {
  const tabelas = new Map<string, string[]>();
  for (const sql of MIGRACOES) {
    for (const m of sql.matchAll(/CREATE TABLE (\w+) \(([\s\S]*?)\n\s*\);/g)) {
      const colunas = (m[2] ?? '')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => /^[a-z_]+ (TEXT|INTEGER|REAL)/.test(l))
        .map((l) => l.split(' ')[0] ?? '');
      tabelas.set(m[1] ?? '', colunas);
    }
  }
  return tabelas;
}

describe('o esquema Drizzle e as migrações SQL descrevem o mesmo banco', () => {
  const migradas = colunasDasMigracoes();

  for (const tabela of [obra, indiceCaracteres]) {
    const { name, columns } = getTableConfig(tabela);
    it(`${name}: mesmas colunas`, () => {
      expect(migradas.get(name)?.sort()).toEqual(columns.map((c) => c.name).sort());
    });
  }
});
