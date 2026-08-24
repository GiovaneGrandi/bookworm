// Estágio 7 passo 6 — destaques, anotações e consultas ao dicionário (RN-02.18–RN-02.21). Cada
// inserção é local ao dispositivo; a instrumentação de uso (RN-TEL.19: nunca com o conteúdo) já
// existe desde o Estágio 3/6 em `useMaquinaSessao.sinalInteracaoQualitativa` — este módulo só
// persiste o dado de domínio, quem chama a sinalização é `leitor.tsx`.
import { criarUlid } from '@bookworm/core/src/ulid.js';
import { anotacao, consultaDicionario, destaque } from '@bookworm/db';
import { eq } from 'drizzle-orm';
import type { Locator } from 'react-native-readium';
import { abrirBanco } from '../persistencia/db.js';
import type { NomePigmentoDeGrifo } from '../primitivas/Grifo.js';

export type DestaqueSalvo = {
  id: string;
  locator: Locator;
  pigmento: NomePigmentoDeGrifo;
};

export async function criarDestaque(
  sessaoId: string,
  obraId: string,
  locator: Locator,
  pigmento: NomePigmentoDeGrifo
): Promise<DestaqueSalvo> {
  const db = abrirBanco();
  const id = criarUlid();
  await db
    .insert(destaque)
    .values({ id, sessaoId, obraId, locator, pigmento, criadoEm: new Date() });
  return { id, locator, pigmento };
}

/** RN-02.19 — anotação vinculada a uma posição; até 2.000 caracteres (a validar). */
export async function criarAnotacao(
  sessaoId: string,
  obraId: string,
  locator: Locator,
  texto: string
): Promise<void> {
  const db = abrirBanco();
  await db
    .insert(anotacao)
    .values({ id: criarUlid(), sessaoId, obraId, locator, texto, criadaEm: new Date() });
}

export type ConsultaSalva = { id: string; locator: Locator; termo: string };

export async function criarConsultaDicionario(
  sessaoId: string,
  obraId: string,
  locator: Locator,
  termo: string
): Promise<ConsultaSalva> {
  const db = abrirBanco();
  const id = criarUlid();
  await db
    .insert(consultaDicionario)
    .values({ id, sessaoId, obraId, locator, termo, criadaEm: new Date() });
  return { id, locator, termo };
}

/** RN-02.17d — vestígio permanente: toda consulta já feita na obra reaparece como sublinhado ao
 * reabrir a leitura, do mesmo jeito que os destaques (RN-02.18) já fazem. */
export async function listarConsultasDaObra(obraId: string): Promise<ConsultaSalva[]> {
  const db = abrirBanco();
  const linhas = await db
    .select()
    .from(consultaDicionario)
    .where(eq(consultaDicionario.obraId, obraId));
  return linhas.map((l) => ({ id: l.id, locator: l.locator as Locator, termo: l.termo }));
}

/** Alimenta os `decorations` do `ReadiumView` — todo destaque já feito na obra, para reabrir a
 * leitura já mostrando o que foi grifado antes (destaque não é efêmero por sessão). */
export async function listarDestaquesDaObra(obraId: string): Promise<DestaqueSalvo[]> {
  const db = abrirBanco();
  const linhas = await db.select().from(destaque).where(eq(destaque.obraId, obraId));
  return linhas.map((l) => ({
    id: l.id,
    locator: l.locator as Locator,
    pigmento: l.pigmento as NomePigmentoDeGrifo,
  }));
}
