// Estágio 8 — R-3: as três regras que andam juntas (mvp.md §11). O cliente avalia a meta na
// fronteira natural de cada sessão (RN-03.12a — versão simplificada desta rodada: só no
// encerramento, não a cada sinal de posição durante a leitura; a fronteira de fim-de-capítulo de
// RN-04.10b fica para uma rodada futura, quando o painel de leitura entrar), fica pegajoso
// (RN-04.10f) e nunca mostra nada aqui — quem decide o que aparece na tela é `resumo.tsx`.
import {
  type AgregadoDiario,
  avaliarMeta,
  type DiaParaOfensiva,
  type Eixo,
  type MetaDiaria,
  type Ofensiva,
  recalcularAgregados,
  recalcularOfensiva,
  type SessaoParaAgregado,
} from '@bookworm/core/src/ofensiva/index.js';
import { criarUlid } from '@bookworm/core/src/ulid.js';
import {
  agregadoDiario,
  diaOfensiva,
  metaDiaria,
  sessaoLeitura,
  ofensiva as tabelaOfensiva,
  USUARIO_LOCAL,
} from '@bookworm/db';
import { and, asc, eq, gte, lt } from 'drizzle-orm';
import { abrirBanco } from '../persistencia/db.js';

/** RN-04.4 — dentro da faixa permitida (5–480 min); valor de partida até a tela de meta existir. */
const META_PADRAO_MINUTOS = 20;

function diaLocalDeHoje(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function proximoDia(dia: string): string {
  const [ano, mes, d] = dia.split('-').map(Number);
  const data = new Date(ano!, mes! - 1, d! + 1);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

async function obterOuCriarMetaVigente(eixo: Eixo, hoje: string): Promise<MetaDiaria> {
  const db = abrirBanco();
  const linhas = await db
    .select()
    .from(metaDiaria)
    .where(and(eq(metaDiaria.usuarioId, USUARIO_LOCAL), eq(metaDiaria.eixo, eixo)))
    .orderBy(asc(metaDiaria.vigenteDesde));

  const vigente = [...linhas].reverse().find((l) => l.vigenteDesde <= hoje);
  if (vigente) {
    return {
      eixo,
      unidade: vigente.unidade,
      valor: vigente.valor,
      vigenteDesde: vigente.vigenteDesde,
      direcaoAlteracao: vigente.direcaoAlteracao,
      proximaAlteracaoPermitidaEm: vigente.proximaAlteracaoPermitidaEm,
    };
  }

  await db.insert(metaDiaria).values({
    id: criarUlid(),
    usuarioId: USUARIO_LOCAL,
    eixo,
    unidade: 'minutos',
    valor: META_PADRAO_MINUTOS,
    vigenteDesde: hoje,
    direcaoAlteracao: 'inicial',
    proximaAlteracaoPermitidaEm: null,
    criadaEm: new Date(),
  });
  return {
    eixo,
    unidade: 'minutos',
    valor: META_PADRAO_MINUTOS,
    vigenteDesde: hoje,
    direcaoAlteracao: 'inicial',
    proximaAlteracaoPermitidaEm: null,
  };
}

/** RN-03.32 — recalculável a partir das sessões brutas do dia, nunca incremental. Fuso do
 * dispositivo atual usado como limite do dia civil — simplificação aceitável para o usuário único
 * local do MVP (o `fuso` por sessão do Estágio 6 sustenta a correção fina quando isso importar). */
async function recalcularAgregadoDoDia(eixo: Eixo, dia: string): Promise<AgregadoDiario> {
  const db = abrirBanco();
  const inicio = new Date(`${dia}T00:00:00`);
  const fim = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);

  const linhas = await db
    .select()
    .from(sessaoLeitura)
    .where(
      and(
        eq(sessaoLeitura.usuarioId, USUARIO_LOCAL),
        gte(sessaoLeitura.iniciadaEm, inicio),
        lt(sessaoLeitura.iniciadaEm, fim)
      )
    );

  // `rejeitada_sobreposicao`/`descartada` são estados do lado do servidor (Estágio 9, RN-03.29) —
  // não existem localmente ainda, mas o enum do banco já os prevê; uma sessão nesses estados não
  // deve contar para o agregado, então fica de fora do map em vez de forçar o tipo.
  const sessoes: SessaoParaAgregado[] = linhas
    .filter(
      (l): l is typeof l & { status: 'valida' | 'curta' | 'suspeita' } =>
        l.status === 'valida' || l.status === 'curta' || l.status === 'suspeita'
    )
    .map((l) => ({
      dia,
      eixo,
      status: l.status,
      tempoAtivoS: l.tempoAtivoS,
      caracteres: l.caracteresLidos,
      interacoesQualitativas: l.interacoesQualitativas,
      maiorBlocoContinuoS: l.maiorBlocoContinuoS,
      scoreLeituraConsciente: l.scoreLeituraConsciente ?? 0,
      estilo: l.estilo ?? 'equilibrado',
      // Conclusão de obra ainda não existe no produto (Estante entra numa rodada futura do
      // Estágio 7) — nenhuma sessão fecha uma obra por enquanto.
      obraConcluida: false,
    }));

  const [agregado] = recalcularAgregados(sessoes);
  return (
    agregado ?? {
      dia,
      eixo,
      tempoAtivoS: 0,
      paginasCanonicas: 0,
      sessoesValidas: 0,
      sessoesCurtas: 0,
      interacoesQualitativas: 0,
      maiorBlocoContinuoS: 0,
      somaLeituraConsciente: 0,
      distribuicaoEstilo: { focado: 0, metodico: 0, equilibrado: 0 },
      obrasConcluidas: 0,
    }
  );
}

async function persistirAgregado(agregado: AgregadoDiario): Promise<void> {
  const db = abrirBanco();
  const valores = {
    usuarioId: USUARIO_LOCAL,
    eixo: agregado.eixo,
    dia: agregado.dia,
    tempoAtivoS: agregado.tempoAtivoS,
    paginasCanonicas: agregado.paginasCanonicas,
    sessoesValidas: agregado.sessoesValidas,
    sessoesCurtas: agregado.sessoesCurtas,
    interacoesQualitativas: agregado.interacoesQualitativas,
    maiorBlocoContinuoS: agregado.maiorBlocoContinuoS,
    somaLeituraConsciente: agregado.somaLeituraConsciente,
    distribuicaoEstilo: agregado.distribuicaoEstilo,
    obrasConcluidas: agregado.obrasConcluidas,
  };
  await db
    .insert(agregadoDiario)
    .values(valores)
    .onConflictDoUpdate({
      target: [agregadoDiario.usuarioId, agregadoDiario.eixo, agregadoDiario.dia],
      set: valores,
    });
}

/** RN-04.11 — histórico completo, sem buracos, só para alimentar `recalcularOfensiva`; dias sem
 * sessão nunca viram linha em `dia_ofensiva` (nada a dizer sobre eles), só entram aqui em memória. */
async function todosOsDiasParaOfensiva(eixo: Eixo, hoje: string): Promise<DiaParaOfensiva[]> {
  const db = abrirBanco();
  const linhas = await db
    .select()
    .from(diaOfensiva)
    .where(and(eq(diaOfensiva.usuarioId, USUARIO_LOCAL), eq(diaOfensiva.eixo, eixo)));

  const porDia = new Map(linhas.map((l) => [l.dia, l]));
  const primeiroDia = linhas.length > 0 ? [...porDia.keys()].sort()[0]! : hoje;

  const dias: DiaParaOfensiva[] = [];
  for (let d = primeiroDia; d <= hoje; d = proximoDia(d)) {
    const linha = porDia.get(d);
    dias.push({
      dia: d,
      cumprido: linha?.cumprido ?? false,
      protegidoPorCongelamento: linha?.protegidoPorCongelamento ?? false,
    });
  }
  return dias;
}

async function persistirOfensiva(ofensivaCalculada: Ofensiva): Promise<void> {
  const db = abrirBanco();
  const valores = {
    usuarioId: USUARIO_LOCAL,
    eixo: ofensivaCalculada.eixo,
    contagemAtual: ofensivaCalculada.contagemAtual,
    melhorMarca: ofensivaCalculada.melhorMarca,
    contagemEncerrada: ofensivaCalculada.contagemEncerrada,
    encerradaEm: ofensivaCalculada.encerradaEm,
    ultimoDiaCumprido: ofensivaCalculada.ultimoDiaCumprido,
    estado: ofensivaCalculada.estado,
    acervoDiasCumpridos: ofensivaCalculada.acervoDiasCumpridos,
    atualizadaEm: new Date(),
  };
  await db
    .insert(tabelaOfensiva)
    .values(valores)
    .onConflictDoUpdate({
      target: [tabelaOfensiva.usuarioId, tabelaOfensiva.eixo],
      set: valores,
    });
}

export type ResultadoAvaliacaoDoDia = { pendente: boolean };

/** Chamado ao encerrar uma sessão (RN-03.6). Recalcula o agregado do dia, avalia a meta
 * (RN-04.1/RN-04.10f), e se a meta foi cumprida agora pela primeira vez, marca a conquista como
 * pendente (RN-04.10c: fica em silêncio — só quem chama decide se/quando mostrar) e recalcula a
 * ofensiva. Devolve se há celebração pendente para este eixo hoje. */
export async function avaliarEAtualizarHoje(
  eixo: Eixo = 'leitura'
): Promise<ResultadoAvaliacaoDoDia> {
  const db = abrirBanco();
  const hoje = diaLocalDeHoje();

  const meta = await obterOuCriarMetaVigente(eixo, hoje);
  const agregado = await recalcularAgregadoDoDia(eixo, hoje);
  await persistirAgregado(agregado);

  const [linhaExistente] = await db
    .select()
    .from(diaOfensiva)
    .where(
      and(
        eq(diaOfensiva.usuarioId, USUARIO_LOCAL),
        eq(diaOfensiva.eixo, eixo),
        eq(diaOfensiva.dia, hoje)
      )
    )
    .limit(1);

  const avaliacao = avaliarMeta(
    { eixo, tempoAtivoS: agregado.tempoAtivoS, paginasCanonicas: agregado.paginasCanonicas },
    meta,
    linhaExistente
      ? { cumprido: linhaExistente.cumprido, celebracaoEstado: linhaExistente.celebracaoEstado }
      : undefined
  );

  const jaEstavaCumprida = linhaExistente?.cumprido ?? false;
  const celebracaoEstado =
    avaliacao.cumprida && !jaEstavaCumprida
      ? 'pendente'
      : (linhaExistente?.celebracaoEstado ?? 'nao_aplicavel');

  await db
    .insert(diaOfensiva)
    .values({
      usuarioId: USUARIO_LOCAL,
      eixo,
      dia: hoje,
      metaValor: meta.valor,
      metaUnidade: meta.unidade,
      realizado: Math.round(avaliacao.realizado),
      cumprido: avaliacao.cumprida,
      cumpridoEm: avaliacao.cumprida ? (linhaExistente?.cumpridoEm ?? new Date()) : null,
      protegidoPorCongelamento: linhaExistente?.protegidoPorCongelamento ?? false,
      celebracaoEstado,
      celebradaEm: linhaExistente?.celebradaEm ?? null,
    })
    .onConflictDoUpdate({
      target: [diaOfensiva.usuarioId, diaOfensiva.eixo, diaOfensiva.dia],
      set: {
        metaValor: meta.valor,
        metaUnidade: meta.unidade,
        realizado: Math.round(avaliacao.realizado),
        cumprido: avaliacao.cumprida,
        cumpridoEm: avaliacao.cumprida ? (linhaExistente?.cumpridoEm ?? new Date()) : null,
        celebracaoEstado,
      },
    });

  const dias = await todosOsDiasParaOfensiva(eixo, hoje);
  const ofensivaCalculada = recalcularOfensiva(eixo, dias);
  await persistirOfensiva(ofensivaCalculada);

  return { pendente: celebracaoEstado === 'pendente' };
}

/** RN-04.10d/e — consumida uma única vez; chamado pela tela de resumo depois de mostrar a
 * celebração. */
export async function consumirCelebracaoPendente(eixo: Eixo = 'leitura'): Promise<void> {
  const db = abrirBanco();
  const hoje = diaLocalDeHoje();
  await db
    .update(diaOfensiva)
    .set({ celebracaoEstado: 'exibida', celebradaEm: new Date() })
    .where(
      and(
        eq(diaOfensiva.usuarioId, USUARIO_LOCAL),
        eq(diaOfensiva.eixo, eixo),
        eq(diaOfensiva.dia, hoje)
      )
    );
}

export async function obterOfensivaAtual(eixo: Eixo = 'leitura'): Promise<Ofensiva | null> {
  const db = abrirBanco();
  const [linha] = await db
    .select()
    .from(tabelaOfensiva)
    .where(and(eq(tabelaOfensiva.usuarioId, USUARIO_LOCAL), eq(tabelaOfensiva.eixo, eixo)))
    .limit(1);
  if (!linha) return null;
  return {
    eixo,
    contagemAtual: linha.contagemAtual,
    melhorMarca: linha.melhorMarca,
    contagemEncerrada: linha.contagemEncerrada,
    encerradaEm: linha.encerradaEm,
    ultimoDiaCumprido: linha.ultimoDiaCumprido,
    estado: linha.estado,
    acervoDiasCumpridos: linha.acervoDiasCumpridos,
  };
}

export async function obterProgressoDeHoje(
  eixo: Eixo = 'leitura'
): Promise<{ realizado: number; meta: number; unidade: string } | null> {
  const db = abrirBanco();
  const hoje = diaLocalDeHoje();
  const [linha] = await db
    .select()
    .from(diaOfensiva)
    .where(
      and(
        eq(diaOfensiva.usuarioId, USUARIO_LOCAL),
        eq(diaOfensiva.eixo, eixo),
        eq(diaOfensiva.dia, hoje)
      )
    )
    .limit(1);
  if (!linha) return null;
  return { realizado: linha.realizado, meta: linha.metaValor, unidade: linha.metaUnidade };
}
