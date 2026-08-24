// `MetaDiaria`, `DiaOfensiva`, `Ofensiva`, `Congelamento` — 04-streaks-e-jardim.md §8. `Eixo`
// existe nos dois valores desde a primeira linha (RN-04.12) — o MVP só popula `leitura`
// (mvp.md §4.3), mas a segunda `Ofensiva` (eixo escrita) nasce vazia, sem migração na fase 1.
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { colunaId, colunaUsuarioId } from './colunas.js';

const colunaEixo = () => text('eixo', { enum: ['leitura', 'escrita'] }).notNull();

export const metaDiaria = sqliteTable('meta_diaria', {
  id: colunaId(),
  usuarioId: colunaUsuarioId(),
  eixo: colunaEixo(),
  unidade: text('unidade', { enum: ['paginas', 'minutos', 'palavras'] }).notNull(),
  valor: integer('valor').notNull(),
  vigenteDesde: text('vigente_desde').notNull(), // dia civil local, YYYY-MM-DD
  direcaoAlteracao: text('direcao_alteracao', {
    enum: ['aumento', 'reducao', 'inicial'],
  }).notNull(),
  proximaAlteracaoPermitidaEm: text('proxima_alteracao_permitida_em'),
  criadaEm: integer('criada_em', { mode: 'timestamp_ms' }).notNull(),
});

export const diaOfensiva = sqliteTable(
  'dia_ofensiva',
  {
    usuarioId: colunaUsuarioId(),
    eixo: colunaEixo(),
    dia: text('dia').notNull(), // YYYY-MM-DD, dia civil local (RN-TEL.46)
    metaValor: integer('meta_valor').notNull(),
    metaUnidade: text('meta_unidade', { enum: ['paginas', 'minutos', 'palavras'] }).notNull(),
    realizado: integer('realizado').notNull(),
    cumprido: integer('cumprido', { mode: 'boolean' }).notNull(),
    cumpridoEm: integer('cumprido_em', { mode: 'timestamp_ms' }),
    protegidoPorCongelamento: integer('protegido_por_congelamento', { mode: 'boolean' })
      .notNull()
      .default(false),
    // RN-04.10d/e — pegajoso: uma vez "exibida", `avaliarMeta` (@bookworm/core) não reavalia.
    celebracaoEstado: text('celebracao_estado', {
      enum: ['nao_aplicavel', 'pendente', 'exibida'],
    })
      .notNull()
      .default('nao_aplicavel'),
    celebradaEm: integer('celebrada_em', { mode: 'timestamp_ms' }),
  },
  (t) => [primaryKey({ columns: [t.usuarioId, t.eixo, t.dia] })]
);

export const ofensiva = sqliteTable(
  'ofensiva',
  {
    usuarioId: colunaUsuarioId(),
    eixo: colunaEixo(),
    // RN-04.11 — todo o resto desta linha é **derivado** de `dia_ofensiva` via
    // `recalcularOfensiva` (@bookworm/core); a tabela é cache materializado, nunca a fonte.
    contagemAtual: integer('contagem_atual').notNull().default(0),
    melhorMarca: integer('melhor_marca').notNull().default(0),
    contagemEncerrada: integer('contagem_encerrada').notNull().default(0),
    encerradaEm: text('encerrada_em'),
    ultimoDiaCumprido: text('ultimo_dia_cumprido'),
    estado: text('estado', { enum: ['ativa', 'dormente'] })
      .notNull()
      .default('dormente'),
    acervoDiasCumpridos: integer('acervo_dias_cumpridos').notNull().default(0),
    // Estágio 8 — RN-04.17: cursor do job de virada de congelamento (`ofensiva/servico.ts`).
    // `null` até a primeira rodada do job; a partir daí, o último dia já decidido (protegido ou
    // não) — nunca reprocessado, para não proteger retroativamente um dia com estoque que só
    // chegou depois (mesmo espírito de RN-04.21, aplicado à concessão automática).
    ultimoDiaProcessadoCongelamento: text('ultimo_dia_processado_congelamento'),
    atualizadaEm: integer('atualizada_em', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.usuarioId, t.eixo] })]
);

export const congelamento = sqliteTable('congelamento', {
  id: colunaId(),
  usuarioId: colunaUsuarioId(),
  eixo: colunaEixo(),
  // `mvp.md` §5 A-1 — só `concessao` (mensal automática) existe no MVP; `compra` volta na fase 1.
  origem: text('origem', { enum: ['compra', 'marco', 'concessao'] }).notNull(),
  adquiridoEm: integer('adquirido_em', { mode: 'timestamp_ms' }).notNull(),
  consumidoEm: integer('consumido_em', { mode: 'timestamp_ms' }),
  diaProtegido: text('dia_protegido'), // YYYY-MM-DD, preenchido só quando consumido
});
