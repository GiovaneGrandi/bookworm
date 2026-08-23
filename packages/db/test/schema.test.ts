// Sem `better-sqlite3` disponível nesta máquina (exige Visual Studio Build Tools, ausentes —
// ver .claude/retomada.md), este teste verifica a **forma** do schema via introspecção do
// Drizzle (`getTableConfig`), não uma migração real. A migração real (`drizzle/0000_*.sql`,
// gerada por `drizzle-kit generate`) roda contra `expo-sqlite` de verdade em `apps/app`, onde o
// driver nativo já vem compilado pelo Expo — a lacuna é só do ambiente de teste em Node.
import { getTableConfig } from 'drizzle-orm/sqlite-core';
import { describe, expect, it } from 'vitest';
import { CRIAR_TABELAS_SQLITE } from '../src/ddl.js';
import * as schema from '../src/schema/index.js';

const TABELAS_ESPERADAS = [
  'obra',
  'item_biblioteca',
  'progresso_leitura',
  'preferencia_leitura',
  'sessao_leitura',
  'intervalo_inatividade',
  'destaque',
  'anotacao',
  'consulta_dicionario',
  'agregado_diario',
  'meta_diaria',
  'dia_ofensiva',
  'ofensiva',
  'congelamento',
  'carteira',
  'lancamento_ledger',
  'item_outbox',
  'sessao_em_curso',
  'evento_bruto_sessao',
] as const;

// `schema/index.ts` reexporta `colunas.js` também (helpers de coluna, não tabelas) — só os
// valores `object` são candidatos a `SQLiteTable`; `getTableConfig` é chamado só sobre eles.
function tabelasDoSchema() {
  return Object.values(schema)
    .filter((v): v is object => typeof v === 'object' && v !== null)
    .map((v) => getTableConfig(v as Parameters<typeof getTableConfig>[0]));
}

describe('mvp.md §7 — as 17 entidades do núcleo mínimo (as desta etapa: Estágio 6 do plano)', () => {
  it('todas as tabelas esperadas existem no schema', () => {
    const nomes = tabelasDoSchema().map((t) => t.name);
    for (const esperado of TABELAS_ESPERADAS) {
      expect(nomes).toContain(esperado);
    }
  });

  it('não existe tabela fora da lista esperada (evita crescimento silencioso do schema)', () => {
    const nomes = tabelasDoSchema().map((t) => t.name);
    expect(nomes.sort()).toEqual([...TABELAS_ESPERADAS].sort());
  });
});

describe('RN-04.11, RN-03.32 — chaves compostas das tabelas derivadas', () => {
  it('dia_ofensiva é PK (usuario_id, eixo, dia) — um registro por dia civil e por eixo', () => {
    const config = getTableConfig(schema.diaOfensiva);
    expect(config.primaryKeys[0]?.columns.map((c) => c.name).sort()).toEqual(
      ['dia', 'eixo', 'usuario_id'].sort()
    );
  });

  it('ofensiva é PK (usuario_id, eixo) — cache materializado, nunca fonte (RN-04.11)', () => {
    const config = getTableConfig(schema.ofensiva);
    expect(config.primaryKeys[0]?.columns.map((c) => c.name).sort()).toEqual(
      ['eixo', 'usuario_id'].sort()
    );
  });

  it('agregado_diario é PK (usuario_id, eixo, dia) — recalculável, nunca incremental (RN-03.32)', () => {
    const config = getTableConfig(schema.agregadoDiario);
    expect(config.primaryKeys[0]?.columns.map((c) => c.name).sort()).toEqual(
      ['dia', 'eixo', 'usuario_id'].sort()
    );
  });
});

describe('RN-TEL.33, RN-TEL.40 — outbox substitui, nunca empilha', () => {
  it('item_outbox é PK (usuario_id, tipo, referencia_id) — upsert natural por sessão', () => {
    const config = getTableConfig(schema.itemOutbox);
    expect(config.primaryKeys[0]?.columns.map((c) => c.name).sort()).toEqual(
      ['referencia_id', 'tipo', 'usuario_id'].sort()
    );
  });
});

describe('mvp.md §7 — "Previstas mas vazias" nascem modeladas', () => {
  it('carteira e lancamento_ledger existem no schema (nenhum lançamento é gravado ainda)', () => {
    expect(getTableConfig(schema.carteira).name).toBe('carteira');
    expect(getTableConfig(schema.lancamentoLedger).name).toBe('lancamento_ledger');
  });

  it('ofensiva e dia_ofensiva aceitam eixo "escrita" — dois eixos modelados, um exposto (RN-04.12)', () => {
    const colunaEixo = getTableConfig(schema.ofensiva).columns.find((c) => c.name === 'eixo');
    expect(colunaEixo?.enumValues).toContain('escrita');
    expect(colunaEixo?.enumValues).toContain('leitura');
  });
});

describe('RN-02.6/RN-02.6b — item_biblioteca tem estado e o fato permanente da estante', () => {
  it('tem as cinco colunas: estado (5 valores), estante_desde e os dois carimbos', () => {
    const config = getTableConfig(schema.itemBiblioteca);
    const nomes = config.columns.map((c) => c.name);
    expect(nomes).toEqual(
      expect.arrayContaining([
        'id',
        'usuario_id',
        'obra_id',
        'estado',
        'estante_desde',
        'adicionado_em',
        'atualizado_em',
      ])
    );
  });

  it('estado aceita os cinco valores de RN-02.6', () => {
    const colunaEstado = getTableConfig(schema.itemBiblioteca).columns.find(
      (c) => c.name === 'estado'
    );
    expect(colunaEstado?.enumValues?.sort()).toEqual(
      ['abandonado', 'concluido', 'em_pausa', 'lendo', 'quero_ler'].sort()
    );
  });

  it('estante_desde é opcional — nasce nulo, nunca obrigatório na criação (RN-02.6b)', () => {
    const colunaEstanteDesde = getTableConfig(schema.itemBiblioteca).columns.find(
      (c) => c.name === 'estante_desde'
    );
    expect(colunaEstanteDesde?.notNull).toBe(false);
  });
});

describe('RN-02.1d — obra importada é privada desde a primeira linha', () => {
  it('obra tem as colunas origem e privada, não um campo a acrescentar depois', () => {
    const nomes = getTableConfig(schema.obra).columns.map((c) => c.name);
    expect(nomes).toContain('origem');
    expect(nomes).toContain('privada');
  });
});

describe('ddl.ts — o DDL aplicado em apps/app na abertura do banco', () => {
  it('tem uma instrução por tabela do schema, todas idempotentes (IF NOT EXISTS)', () => {
    expect(CRIAR_TABELAS_SQLITE).toHaveLength(TABELAS_ESPERADAS.length);
    for (const instrucao of CRIAR_TABELAS_SQLITE) {
      expect(instrucao).toMatch(/^CREATE TABLE IF NOT EXISTS `\w+`/);
    }
  });

  it('cobre exatamente as mesmas tabelas do schema TypeScript, sem faltar nem sobrar', () => {
    const tabelasNoDdl = CRIAR_TABELAS_SQLITE.map((s) => s.match(/`(\w+)`/)?.[1]).sort();
    const tabelasNoSchema = tabelasDoSchema()
      .map((t) => t.name)
      .sort();
    expect(tabelasNoDdl).toEqual(tabelasNoSchema);
  });
});
