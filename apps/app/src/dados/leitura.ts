import {
  normalizarPreferencias,
  type PreferenciasLeitura,
  progressoPercentual,
  type RecursoIndice,
} from '@bookworm/core';
import { asc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import type { Locator } from 'react-native-readium';
import { db } from './banco';
import { indiceCaracteres, obra, preferenciasLeitura } from './schema';

/** As preferências de leitura, ao vivo: o leitor e a mesa (RN-DV.6) leem o mesmo registro. */
export function usePreferencias(): PreferenciasLeitura {
  const { data } = useLiveQuery(
    db.select().from(preferenciasLeitura).where(eq(preferenciasLeitura.id, 1))
  );
  const linha = data?.[0];
  return normalizarPreferencias(linha ? lerJson(linha.dados) : null);
}

function lerJson(texto: string): unknown {
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

export function salvarPreferencias(p: PreferenciasLeitura): void {
  const dados = JSON.stringify(p);
  const agora = Date.now();
  db.insert(preferenciasLeitura)
    .values({ id: 1, dados, atualizadoEm: agora })
    .onConflictDoUpdate({ target: preferenciasLeitura.id, set: { dados, atualizadoEm: agora } })
    .run();
}

/** O índice de caracteres da obra, como foi gravado na importação (RN-ST.8). */
export function carregarIndice(obraId: string): { recursos: RecursoIndice[]; total: number } {
  const recursos = db
    .select()
    .from(indiceCaracteres)
    .where(eq(indiceCaracteres.obraId, obraId))
    .orderBy(asc(indiceCaracteres.ordem))
    .all()
    .map(({ href, inicio, caracteres, incluido }) => ({ href, inicio, caracteres, incluido }));
  const ultimo = recursos[recursos.length - 1];
  return { recursos, total: ultimo ? ultimo.inicio + ultimo.caracteres : 0 };
}

export function lerLocator(texto: string | null): Locator | undefined {
  const bruto = texto ? lerJson(texto) : null;
  return bruto && typeof bruto === 'object' && 'href' in bruto ? (bruto as Locator) : undefined;
}

/**
 * Guarda a posição a cada mudança (RN-02.9) e o progresso: no EPUB, pelo índice de caracteres
 * (RN-02.10); no PDF, que entra como fotocópia sem índice (Q5), pela fração do próprio Readium.
 */
export function salvarPosicao(
  obraId: string,
  locator: Locator,
  indice: { recursos: RecursoIndice[]; total: number } | null
): number {
  const progresso =
    indice && indice.total > 0
      ? progressoPercentual(indice, locator.href, locator.locations?.progression ?? 0)
      : (locator.locations?.totalProgression ?? 0);
  db.update(obra)
    .set({ locator: JSON.stringify(locator), progresso })
    .where(eq(obra.id, obraId))
    .run();
  return progresso;
}
