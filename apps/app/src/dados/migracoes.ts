import type { SQLiteDatabase } from 'expo-sqlite';

// Migrações em SQL, aplicadas em ordem e marcadas em `PRAGMA user_version`. Uma migração
// publicada nunca é editada: mudança de esquema entra como item novo no fim da lista.
export const MIGRACOES: readonly string[] = [
  `
  CREATE TABLE obra (
    id TEXT PRIMARY KEY NOT NULL,
    titulo TEXT NOT NULL,
    autor TEXT,
    idioma TEXT,
    formato TEXT NOT NULL CHECK (formato IN ('epub', 'pdf')),
    origem TEXT NOT NULL CHECK (origem IN ('importada', 'dominio_publico')),
    chave_acervo TEXT UNIQUE,
    nome_arquivo TEXT NOT NULL,
    caminho TEXT NOT NULL,
    tamanho INTEGER NOT NULL,
    estado TEXT NOT NULL DEFAULT 'quero_ler'
      CHECK (estado IN ('quero_ler', 'lendo', 'em_pausa', 'concluido', 'abandonado')),
    importado_em INTEGER NOT NULL,
    aberto_em INTEGER,
    locator TEXT,
    progresso REAL NOT NULL DEFAULT 0,
    total_caracteres INTEGER
  );
  CREATE TABLE indice_caracteres (
    obra_id TEXT NOT NULL REFERENCES obra(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL,
    href TEXT NOT NULL,
    inicio INTEGER NOT NULL,
    caracteres INTEGER NOT NULL,
    incluido INTEGER NOT NULL,
    PRIMARY KEY (obra_id, ordem)
  );
  `,
];

export function migrar(banco: SQLiteDatabase): void {
  const linha = banco.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  const atual = linha?.user_version ?? 0;
  for (let versao = atual; versao < MIGRACOES.length; versao++) {
    banco.withTransactionSync(() => {
      banco.execSync(MIGRACOES[versao] ?? '');
      banco.execSync(`PRAGMA user_version = ${versao + 1}`);
    });
  }
}
