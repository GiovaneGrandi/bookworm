// `AgregadoDiario` — 03-sessoes-e-metricas.md §5.7 (RN-03.30–RN-03.32). Cache materializado e
// **recalculável** a partir de `SessaoLeitura` bruta (`recalcularAgregados`, @bookworm/core) —
// nunca um contador incremental sem lastro.
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { colunaUsuarioId } from './colunas.js';

export const agregadoDiario = sqliteTable(
  'agregado_diario',
  {
    usuarioId: colunaUsuarioId(),
    eixo: text('eixo', { enum: ['leitura', 'escrita'] }).notNull(),
    dia: text('dia').notNull(), // YYYY-MM-DD
    tempoAtivoS: integer('tempo_ativo_s').notNull().default(0),
    // REAL — `paginasCanonicas` de @bookworm/core é `caracteres / PAGINA_CANONICA_CARACTERES`,
    // fracionário por natureza (RN-TEL.21: caractere é a unidade real; página é só apresentação).
    paginasCanonicas: real('paginas_canonicas').notNull().default(0),
    sessoesValidas: integer('sessoes_validas').notNull().default(0),
    sessoesCurtas: integer('sessoes_curtas').notNull().default(0),
    interacoesQualitativas: integer('interacoes_qualitativas').notNull().default(0),
    maiorBlocoContinuoS: integer('maior_bloco_continuo_s').notNull().default(0),
    somaLeituraConsciente: integer('soma_leitura_consciente').notNull().default(0),
    // { focado, metodico, equilibrado } — RN-03.31.
    distribuicaoEstilo: text('distribuicao_estilo', { mode: 'json' }).notNull(),
    obrasConcluidas: integer('obras_concluidas').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.usuarioId, t.eixo, t.dia] })]
);
