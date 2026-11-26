import { type CorDeParede, gerarUlid, limparNomeDeParede } from '@bookworm/core';
import { and, asc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';
import { db } from './banco';
import { parede, paredeObra } from './schema';

/** Uma parede própria, com os ids dos livros pendurados nela. */
export type ParedePropria = {
  id: string;
  nome: string;
  cor: CorDeParede;
  obras: string[];
};

/** As paredes próprias, ao vivo, na ordem em que foram penduradas. */
export function useParedes(): ParedePropria[] {
  const { data: paredes } = useLiveQuery(db.select().from(parede).orderBy(asc(parede.criadaEm)));
  const { data: vinculos } = useLiveQuery(db.select().from(paredeObra));
  return useMemo(
    () =>
      (paredes ?? []).map((p) => ({
        id: p.id,
        nome: p.nome,
        cor: p.cor,
        obras: (vinculos ?? []).filter((v) => v.paredeId === p.id).map((v) => v.obraId),
      })),
    [paredes, vinculos]
  );
}

/** Pendura uma parede nova com os livros escolhidos. Devolve o id dela. */
export function criarParede(nome: string, cor: CorDeParede, obras: readonly string[]): string {
  const limpo = limparNomeDeParede(nome);
  if (!limpo) throw new Error('A parede precisa de um nome.');
  const agora = Date.now();
  const id = gerarUlid(agora, Math.random);
  db.transaction((tx) => {
    tx.insert(parede).values({ id, nome: limpo, cor, criadaEm: agora }).run();
    if (obras.length > 0) {
      tx.insert(paredeObra)
        .values(obras.map((obraId) => ({ paredeId: id, obraId })))
        .run();
    }
  });
  return id;
}

export function porNaParede(paredeId: string, obraId: string): void {
  db.insert(paredeObra).values({ paredeId, obraId }).onConflictDoNothing().run();
}

/** Tira o livro só desta parede: ele continua na estante e nas outras paredes. */
export function tirarDaParede(paredeId: string, obraId: string): void {
  db.delete(paredeObra)
    .where(and(eq(paredeObra.paredeId, paredeId), eq(paredeObra.obraId, obraId)))
    .run();
}

/** Tira a parede inteira; os livros ficam na estante. */
export function tirarParede(paredeId: string): void {
  db.delete(parede).where(eq(parede.id, paredeId)).run();
}
