import { abrirParaLer, type IndiceEpub, obraComMesmoArquivo, porEmPausa } from '@bookworm/core';
import { desc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { File } from 'expo-file-system';
import { db } from './banco';
import { indiceCaracteres, type NovaObra, type Obra, obra } from './schema';

/** Todas as obras, ao vivo: a mesa e a gaveta re-renderizam quando o banco muda. */
export function useObras(): Obra[] {
  const { data } = useLiveQuery(db.select().from(obra).orderBy(desc(obra.importadoEm)));
  return data ?? [];
}

export function useObra(id: string): Obra | undefined {
  const { data } = useLiveQuery(db.select().from(obra).where(eq(obra.id, id)), [id]);
  return data?.[0];
}

/** Grava a obra e o seu índice numa transação só (RN-ST.8: o índice nasce na importação). */
export function inserirObra(nova: NovaObra, indice: IndiceEpub | null): void {
  db.transaction((tx) => {
    tx.insert(obra).values(nova).run();
    if (indice) {
      const linhas = indice.recursos.map((r, ordem) => ({ obraId: nova.id, ordem, ...r }));
      // Em lotes, para não estourar o limite de variáveis do SQLite.
      for (let i = 0; i < linhas.length; i += 100) {
        tx.insert(indiceCaracteres)
          .values(linhas.slice(i, i + 100))
          .run();
      }
    }
  });
}

/** A obra que já tem um arquivo com este nome e extensão, se houver (sem cópias repetidas). */
export function obraComArquivo(nomeArquivo: string): Obra | undefined {
  return obraComMesmoArquivo(db.select().from(obra).all(), nomeArquivo);
}

export function obraDoAcervo(chave: string): Obra | undefined {
  return db.select().from(obra).where(eq(obra.chaveAcervo, chave)).get();
}

function salvar(o: Obra) {
  db.update(obra).set({ estado: o.estado, abertoEm: o.abertoEm }).where(eq(obra.id, o.id)).run();
}

function buscar(id: string): Obra {
  const o = db.select().from(obra).where(eq(obra.id, id)).get();
  if (!o) throw new Error(`Obra ${id} não existe.`);
  return o;
}

/** Abrir no leitor: a obra vai a "lendo" e pousa na mesa (RN-02.6, RN-DV.4). */
export function marcarAberta(id: string): void {
  salvar(abrirParaLer(buscar(id), Date.now()));
}

export function pausar(id: string): void {
  salvar(porEmPausa(buscar(id)));
}

/** Tirar da gaveta: some a obra, o índice (em cascata) e o arquivo copiado. */
export function tirarDaGaveta(id: string): void {
  const o = buscar(id);
  db.delete(obra).where(eq(obra.id, id)).run();
  try {
    const arquivo = new File(o.caminho);
    if (arquivo.exists) arquivo.delete();
  } catch {
    // O registro já saiu; um arquivo órfão não impede a remoção.
  }
}
