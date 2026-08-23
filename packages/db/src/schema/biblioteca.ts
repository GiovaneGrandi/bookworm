// `Obra`, `ItemBiblioteca`, `ProgressoLeitura` — mvp.md §7 (núcleo de 17 entidades),
// modelo-de-dados.md §2. `RN-02.1d`: obra importada é privada e não alimenta analytics — por
// isso `origem`/`privada` existem desde a primeira linha, não como campo a acrescentar depois.
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { colunaId, colunaUsuarioId } from './colunas.js';

export const obra = sqliteTable('obra', {
  id: colunaId(),
  titulo: text('titulo').notNull(),
  autor: text('autor'),
  formato: text('formato', { enum: ['epub', 'pdf'] }).notNull(),
  origem: text('origem', { enum: ['dominio_publico', 'importada'] }).notNull(),
  // RN-02.1d — obra importada é privada e não alimenta analytics (RN-09.14 herda essa fronteira).
  privada: integer('privada', { mode: 'boolean' }).notNull(),
  caminhoArquivo: text('caminho_arquivo').notNull(),
  // RN-ST.8 — índice de caracteres montado uma única vez na importação, nunca recalculado.
  // `IndiceDeCaracteres` de @bookworm/core serializado (JSON) — sem índice próprio de coluna
  // porque nunca é filtrado por SQL, só lido inteiro por obra.
  indiceCaracteres: text('indice_caracteres', { mode: 'json' }),
  criadaEm: integer('criada_em', { mode: 'timestamp_ms' }).notNull(),
});

export const itemBiblioteca = sqliteTable('item_biblioteca', {
  id: colunaId(),
  usuarioId: colunaUsuarioId(),
  obraId: text('obra_id')
    .notNull()
    .references(() => obra.id),
  // RN-02.6 — os cinco estados. A transição para `lendo` é automática na primeira sessão; as
  // demais são manuais, exceto `concluido`, sugerido a 100% de progresso e confirmado pelo
  // usuário. Biblioteca (RN-02.6a) é a consulta `estado IN (lendo, quero_ler, em_pausa)`
  // — `abandonado` fica de fora da visão padrão (alcançável só por filtro explícito) e
  // `concluido` não aparece aqui: quem mostra obra concluída é `estanteDesde`, não este campo.
  estado: text('estado', {
    enum: ['quero_ler', 'lendo', 'concluido', 'abandonado', 'em_pausa'],
  }).notNull(),
  // RN-02.6b — fato permanente, nunca apagado: a obra entrou na Estante quando foi concluída
  // pela primeira vez. Reler muda `estado` de volta para `lendo` (e a obra volta à Biblioteca)
  // sem tocar aqui — "a estante só cresce; nada sai dela" (RN-02.22a). Superfície derivada,
  // nunca a fonte: Estante é a consulta `estanteDesde IS NOT NULL`.
  estanteDesde: integer('estante_desde', { mode: 'timestamp_ms' }),
  adicionadoEm: integer('adicionado_em', { mode: 'timestamp_ms' }).notNull(),
  atualizadoEm: integer('atualizado_em', { mode: 'timestamp_ms' }).notNull(),
});

export const progressoLeitura = sqliteTable(
  'progresso_leitura',
  {
    usuarioId: colunaUsuarioId(),
    obraId: text('obra_id')
      .notNull()
      .references(() => obra.id),
    // RN-02.9 — locator é a posição canônica, nunca uma página de tela.
    locator: text('locator', { mode: 'json' }).notNull(),
    // RN-TEL.24 — marca d'água: a maior posição já atingida, monotônica, nunca decresce ao
    // reler. Grandeza diferente do volume de sessão (`SessaoLeitura.caracteresLidos`).
    caracteresProgresso: integer('caracteres_progresso').notNull(),
    atualizadoEm: integer('atualizado_em', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.usuarioId, t.obraId] })]
);
