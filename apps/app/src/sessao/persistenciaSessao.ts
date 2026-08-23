// Leitura e escrita de `sessao_em_curso` / `evento_bruto_sessao` (@bookworm/db). RN-TEL.2: toda
// transição é gravada **antes** de valer — por isso cada função aqui é `await`ada pela máquina de
// estados antes de atualizar o estado em memória, nunca depois.

// Import direto em `sessao/`/`ulid.js`, não no barrel `@bookworm/core` — evita puxar `indice/`
// (`htmlparser2`/`fflate`, ESM que o preset `jest-expo` não transforma) por uma dependência que
// este módulo nunca usa.
import type { EventoTraco, TracoDeEventos } from '@bookworm/core/src/sessao/index.js';
import { criarUlid } from '@bookworm/core/src/ulid.js';
import { eventoBrutoSessao, sessaoEmCurso, USUARIO_LOCAL } from '@bookworm/db';
import { eq } from 'drizzle-orm';
import { abrirBanco } from '../persistencia/db.js';

export type SessaoEmCursoLinha = typeof sessaoEmCurso.$inferSelect;

/** RN-TEL.42 — no máximo uma sessão em curso por vez; se houver mais de uma linha, é bug de outro lugar. */
export async function obterSessaoEmCurso(): Promise<SessaoEmCursoLinha | null> {
  const db = abrirBanco();
  const linhas = await db.select().from(sessaoEmCurso).limit(1);
  return linhas[0] ?? null;
}

export async function criarSessaoEmCurso(params: {
  obraId: string;
  fuso: string;
  offsetUtcMinutos: number;
  paredeMs: number;
  monoMs: number;
}): Promise<string> {
  const db = abrirBanco();
  const id = criarUlid();
  await db.insert(sessaoEmCurso).values({
    id,
    usuarioId: USUARIO_LOCAL,
    obraId: params.obraId,
    // A linha só nasce quando a primeira evidência de leitura já existe (evento
    // `sessao_iniciada`, RN-TEL.1) — não há "ociosa" persistida: ociosa é a ausência de linha.
    estado: 'ativa',
    fuso: params.fuso,
    offsetUtcMinutos: params.offsetUtcMinutos,
    ultimoSinalParedeMs: params.paredeMs,
    ultimoSinalMonoMs: params.monoMs,
    atualizadaEm: new Date(),
  });
  return id;
}

export async function atualizarSessaoEmCurso(
  id: string,
  campos: Partial<{
    estado: SessaoEmCursoLinha['estado'];
    ultimoSinalParedeMs: number;
    ultimoSinalMonoMs: number;
  }>
): Promise<void> {
  const db = abrirBanco();
  await db
    .update(sessaoEmCurso)
    .set({ ...campos, atualizadaEm: new Date() })
    .where(eq(sessaoEmCurso.id, id));
}

export async function removerSessaoEmCurso(id: string): Promise<void> {
  const db = abrirBanco();
  await db.delete(eventoBrutoSessao).where(eq(eventoBrutoSessao.sessaoId, id));
  await db.delete(sessaoEmCurso).where(eq(sessaoEmCurso.id, id));
}

export async function inserirEventoBruto(sessaoId: string, evento: EventoTraco): Promise<void> {
  const db = abrirBanco();
  const { tipo, parede, mono, ...resto } = evento;
  await db.insert(eventoBrutoSessao).values({
    id: criarUlid(),
    sessaoId,
    tipo,
    paredeMs: parede,
    monoMs: mono,
    payload: resto,
  });
}

export async function listarEventosBrutos(sessaoId: string): Promise<TracoDeEventos['eventos']> {
  const db = abrirBanco();
  const linhas = await db
    .select()
    .from(eventoBrutoSessao)
    .where(eq(eventoBrutoSessao.sessaoId, sessaoId))
    .orderBy(eventoBrutoSessao.monoMs);

  return linhas.map(
    (linha) =>
      ({
        tipo: linha.tipo,
        parede: linha.paredeMs,
        mono: linha.monoMs,
        ...(linha.payload as Record<string, unknown>),
      }) as EventoTraco
  );
}
