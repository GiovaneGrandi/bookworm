// RN-02.6a/RN-02.6b — Biblioteca e Estante são duas consultas sobre a mesma tabela, não dois
// modelos de dado. Biblioteca: `estado IN (lendo, quero_ler, em_pausa)` — `abandonado` fica de
// fora da visão padrão (RN-02.6a) e `concluido` não aparece aqui, porque quem mostra "já lido" é
// `estanteDesde`, não `estado`. Estante: `estanteDesde IS NOT NULL`, fato que nunca é apagado.
import { itemBiblioteca, obra as tabelaObra, USUARIO_LOCAL } from '@bookworm/db';
import { and, eq, inArray, isNotNull } from 'drizzle-orm';
import { abrirBanco } from '../persistencia/db.js';

export type ItemDaBiblioteca = {
  itemId: string;
  obraId: string;
  titulo: string;
  autor: string | null;
  formato: 'epub' | 'pdf';
  estado: 'quero_ler' | 'lendo' | 'concluido' | 'abandonado' | 'em_pausa';
};

const ESTADOS_BIBLIOTECA = ['lendo', 'quero_ler', 'em_pausa'] as const;

export async function listarBiblioteca(): Promise<ItemDaBiblioteca[]> {
  const db = abrirBanco();
  const linhas = await db
    .select({
      itemId: itemBiblioteca.id,
      obraId: itemBiblioteca.obraId,
      estado: itemBiblioteca.estado,
      titulo: tabelaObra.titulo,
      autor: tabelaObra.autor,
      formato: tabelaObra.formato,
    })
    .from(itemBiblioteca)
    .innerJoin(tabelaObra, eq(itemBiblioteca.obraId, tabelaObra.id))
    .where(
      and(
        eq(itemBiblioteca.usuarioId, USUARIO_LOCAL),
        inArray(itemBiblioteca.estado, ESTADOS_BIBLIOTECA)
      )
    );
  return linhas;
}

export async function listarEstante(): Promise<ItemDaBiblioteca[]> {
  const db = abrirBanco();
  const linhas = await db
    .select({
      itemId: itemBiblioteca.id,
      obraId: itemBiblioteca.obraId,
      estado: itemBiblioteca.estado,
      titulo: tabelaObra.titulo,
      autor: tabelaObra.autor,
      formato: tabelaObra.formato,
    })
    .from(itemBiblioteca)
    .innerJoin(tabelaObra, eq(itemBiblioteca.obraId, tabelaObra.id))
    .where(
      and(eq(itemBiblioteca.usuarioId, USUARIO_LOCAL), isNotNull(itemBiblioteca.estanteDesde))
    );
  return linhas;
}

/** RN-02.6/RN-02.6b — chamado ao abrir uma sessão de leitura. Devolve `concluido` a `lendo` e à
 * Biblioteca sem tocar em `estanteDesde` — a entrada na Estante é permanente. */
export async function marcarComoLendo(obraId: string): Promise<void> {
  const db = abrirBanco();
  await db
    .update(itemBiblioteca)
    .set({ estado: 'lendo', atualizadoEm: new Date() })
    .where(and(eq(itemBiblioteca.usuarioId, USUARIO_LOCAL), eq(itemBiblioteca.obraId, obraId)));
}

/** Títulos já presentes na biblioteca com origem "dominio_publico" — usado para não repetir uma
 * entrada do acervo embarcado (`catalogo.ts`) que a pessoa já adicionou. */
export async function tituloJaNoAcervoDaBiblioteca(): Promise<Set<string>> {
  const db = abrirBanco();
  const linhas = await db
    .select({ titulo: tabelaObra.titulo })
    .from(tabelaObra)
    .where(eq(tabelaObra.origem, 'dominio_publico'));
  return new Set(linhas.map((l) => l.titulo));
}

/** RN-02.6/RN-02.22a — `estanteDesde` só é gravado a primeira vez; conclusões seguintes da mesma
 * obra (releitura completa) não reescrevem a data de entrada na Estante. */
export async function marcarComoConcluido(obraId: string): Promise<void> {
  const db = abrirBanco();
  const [linha] = await db
    .select({ estanteDesde: itemBiblioteca.estanteDesde })
    .from(itemBiblioteca)
    .where(and(eq(itemBiblioteca.usuarioId, USUARIO_LOCAL), eq(itemBiblioteca.obraId, obraId)))
    .limit(1);

  const agora = new Date();
  await db
    .update(itemBiblioteca)
    .set({
      estado: 'concluido',
      estanteDesde: linha?.estanteDesde ?? agora,
      atualizadoEm: agora,
    })
    .where(and(eq(itemBiblioteca.usuarioId, USUARIO_LOCAL), eq(itemBiblioteca.obraId, obraId)));
}
