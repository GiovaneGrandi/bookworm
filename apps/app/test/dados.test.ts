import { getTableConfig } from 'drizzle-orm/sqlite-core';
import { describe, expect, it } from 'vitest';
import { MIGRACOES } from '../src/dados/migracoes';
import {
  indiceCaracteres,
  obra,
  parede,
  paredeObra,
  preferenciasLeitura,
} from '../src/dados/schema';

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

  for (const tabela of [obra, indiceCaracteres, preferenciasLeitura, parede, paredeObra]) {
    const { name, columns } = getTableConfig(tabela);
    it(`${name}: mesmas colunas`, () => {
      expect(migradas.get(name)?.sort()).toEqual(columns.map((c) => c.name).sort());
    });
  }
});

describe('paredes próprias (fichário)', () => {
  const sql = MIGRACOES.join('\n');
  it('a cor da parede só aceita as tintas do núcleo', () => {
    expect(sql).toMatch(
      /cor TEXT NOT NULL[\s\S]*CHECK \(cor IN \('mesa', 'vinho', 'prussia', 'terra', 'grafite'\)\)/
    );
  });
  it('tirar a obra ou a parede leva junto o vínculo, nunca o livro', () => {
    expect(sql).toMatch(/parede_id TEXT NOT NULL REFERENCES parede\(id\) ON DELETE CASCADE/);
    expect(sql).toMatch(/obra_id TEXT NOT NULL REFERENCES obra\(id\) ON DELETE CASCADE/);
  });
});
