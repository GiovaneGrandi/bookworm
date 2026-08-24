// Estágio 8 — R-3: as três regras que andam juntas (mvp.md §11). O cliente avalia a meta na
// fronteira natural de cada sessão (RN-03.12a — versão simplificada desta rodada: só no
// encerramento, não a cada sinal de posição durante a leitura; a fronteira de fim-de-capítulo de
// RN-04.10b fica para uma rodada futura, quando o painel de leitura entrar), fica pegajoso
// (RN-04.10f) e nunca mostra nada aqui — quem decide o que aparece na tela é `resumo.tsx`.
import {
  type AgregadoDiario,
  alterarMeta,
  aplicarCongelamento,
  avaliarMeta,
  CONSTANTES_OFENSIVA_PADRAO,
  concederCongelamentoMensal,
  type DiaParaOfensiva,
  type Eixo,
  type MetaDiaria,
  type Ofensiva,
  type PedidoAlteracaoMeta,
  type ResultadoAlteracaoMeta,
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
  congelamento as tabelaCongelamento,
  ofensiva as tabelaOfensiva,
  USUARIO_LOCAL,
} from '@bookworm/db';
import { and, asc, eq, gte, isNull, lt } from 'drizzle-orm';
import { abrirBanco } from '../persistencia/db.js';

/** RN-04.4 — dentro da faixa permitida (5–480 min); valor de partida antes de qualquer alteração
 * pela tela de meta (`app/meta.tsx`). */
const META_PADRAO_MINUTOS = 20;

function diaLocalDe(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function diaLocalDeHoje(): string {
  return diaLocalDe(new Date());
}

function somarDias(dia: string, delta: number): string {
  const [ano, mes, d] = dia.split('-').map(Number);
  return diaLocalDe(new Date(ano!, mes! - 1, d! + delta));
}

function proximoDia(dia: string): string {
  return somarDias(dia, 1);
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

/** Leitura pela tela de meta (`app/meta.tsx`) — a meta vigente hoje, criando a padrão (RN-04.4) se
 * o usuário nunca definiu nenhuma. */
export async function obterMetaVigente(eixo: Eixo = 'leitura'): Promise<MetaDiaria> {
  return obterOuCriarMetaVigente(eixo, diaLocalDeHoje());
}

/** RN-04.4–RN-04.9 — decide e, se permitida, persiste a alteração de meta pedida pela tela de
 * meta. Toda a regra de negócio (faixa, atrito de tempo, vigência de amanhã) vive em
 * `alterarMeta` (`@bookworm/core`); esta função só resolve a meta atual e grava o resultado. */
export async function alterarMetaVigente(
  eixo: Eixo,
  pedido: PedidoAlteracaoMeta
): Promise<ResultadoAlteracaoMeta> {
  const db = abrirBanco();
  const hoje = diaLocalDeHoje();
  const metaAtual = await obterOuCriarMetaVigente(eixo, hoje);
  const resultado = alterarMeta(metaAtual, pedido, hoje);

  if (resultado.permitida) {
    const { metaResultante } = resultado;
    await db.insert(metaDiaria).values({
      id: criarUlid(),
      usuarioId: USUARIO_LOCAL,
      eixo,
      unidade: metaResultante.unidade,
      valor: metaResultante.valor,
      vigenteDesde: metaResultante.vigenteDesde,
      direcaoAlteracao: metaResultante.direcaoAlteracao,
      proximaAlteracaoPermitidaEm: metaResultante.proximaAlteracaoPermitidaEm,
      criadaEm: new Date(),
    });
  }

  return resultado;
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

async function obterLinhaDiaOfensiva(eixo: Eixo, dia: string) {
  const db = abrirBanco();
  const [linha] = await db
    .select()
    .from(diaOfensiva)
    .where(
      and(
        eq(diaOfensiva.usuarioId, USUARIO_LOCAL),
        eq(diaOfensiva.eixo, eixo),
        eq(diaOfensiva.dia, dia)
      )
    )
    .limit(1);
  return linha ?? null;
}

/** Só olha para trás até `maximo` dias (RN-04.18 nunca passa de 2) — barato mesmo lendo linha a
 * linha. Para no primeiro dia cumprido, não protegido, ou sem registro. */
async function contarProtegidosConsecutivosTerminandoEm(
  eixo: Eixo,
  diaFinal: string,
  maximo: number
): Promise<number> {
  let contador = 0;
  let dia = diaFinal;
  while (contador < maximo) {
    const linha = await obterLinhaDiaOfensiva(eixo, dia);
    if (!linha || linha.cumprido || !linha.protegidoPorCongelamento) break;
    contador += 1;
    dia = somarDias(dia, -1);
  }
  return contador;
}

async function consumirTokenCongelamento(eixo: Eixo, diaProtegido: string): Promise<void> {
  const db = abrirBanco();
  const [token] = await db
    .select()
    .from(tabelaCongelamento)
    .where(
      and(
        eq(tabelaCongelamento.usuarioId, USUARIO_LOCAL),
        eq(tabelaCongelamento.eixo, eixo),
        isNull(tabelaCongelamento.consumidoEm)
      )
    )
    .orderBy(asc(tabelaCongelamento.adquiridoEm))
    .limit(1);
  if (!token) return;
  await db
    .update(tabelaCongelamento)
    .set({ consumidoEm: new Date(), diaProtegido })
    .where(eq(tabelaCongelamento.id, token.id));
}

/** `mvp.md` §5 A-1 — concessão automática mensal, substituindo a compra de RN-04.16 enquanto não
 * há economia. Devolve o estoque (não consumido) já incluindo a concessão desta chamada, se
 * houve. */
async function concederCongelamentoDoMesSeNecessario(eixo: Eixo, hoje: string): Promise<number> {
  const db = abrirBanco();
  const tokens = await db
    .select()
    .from(tabelaCongelamento)
    .where(and(eq(tabelaCongelamento.usuarioId, USUARIO_LOCAL), eq(tabelaCongelamento.eixo, eixo)));

  const estoqueAtual = tokens.filter((t) => t.consumidoEm === null).length;
  const ultimaConcessaoMes = tokens
    .filter((t) => t.origem === 'concessao')
    .reduce<string | null>((max, t) => {
      const mes = diaLocalDe(t.adquiridoEm).slice(0, 7);
      return !max || mes > max ? mes : max;
    }, null);

  const resultado = concederCongelamentoMensal(
    { quantidade: estoqueAtual, ultimaConcessaoMes },
    hoje.slice(0, 7)
  );

  for (let i = 0; i < resultado.quantidade - estoqueAtual; i++) {
    await db.insert(tabelaCongelamento).values({
      id: criarUlid(),
      usuarioId: USUARIO_LOCAL,
      eixo,
      origem: 'concessao',
      adquiridoEm: new Date(),
      consumidoEm: null,
      diaProtegido: null,
    });
  }
  return resultado.quantidade;
}

export type ResultadoCongelamentoAutomatico = {
  /** Dias decididos como protegidos **nesta chamada** — vazio em qualquer rodada que não seja a
   * primeira a ver aquele dia já passado (idempotência via `ultimoDiaProcessadoCongelamento`). Só
   * quando não-vazio o chamador deve mostrar o aviso de GAM-08. */
  diasProtegidosNestaRodada: string[];
  estoqueRestante: number;
};

/**
 * RN-04.17 — job de virada do congelamento. Sem cron de servidor no MVP (Estágio 9), roda a cada
 * vez que o Jardim é aberto: concede o congelamento mensal e decide, dia a dia em ordem
 * cronológica, se cada dia não cumprido desde a última rodada foi protegido.
 *
 * **Nunca retroativo (mesmo espírito de RN-04.21):** o cursor `ultimoDiaProcessadoCongelamento`
 * garante que um dia só é decidido uma vez, com o estoque que existia *naquele* momento — um
 * congelamento concedido depois não pode "salvar" um dia que já quebrou. Na primeira execução
 * (cursor nulo) o cursor nasce em ontem sem decidir nada: o job só olha para a frente a partir daí,
 * nunca para o histórico anterior a esta funcionalidade existir.
 */
export async function processarCongelamentoAutomatico(
  eixo: Eixo = 'leitura'
): Promise<ResultadoCongelamentoAutomatico> {
  const db = abrirBanco();
  const hoje = diaLocalDeHoje();
  const diaAnteriorHoje = somarDias(hoje, -1);

  let estoqueAtual = await concederCongelamentoDoMesSeNecessario(eixo, hoje);

  const [linhaOfensiva] = await db
    .select()
    .from(tabelaOfensiva)
    .where(and(eq(tabelaOfensiva.usuarioId, USUARIO_LOCAL), eq(tabelaOfensiva.eixo, eixo)))
    .limit(1);
  if (!linhaOfensiva) {
    return { diasProtegidosNestaRodada: [], estoqueRestante: estoqueAtual };
  }

  if (linhaOfensiva.ultimoDiaProcessadoCongelamento === null) {
    await db
      .update(tabelaOfensiva)
      .set({ ultimoDiaProcessadoCongelamento: diaAnteriorHoje })
      .where(and(eq(tabelaOfensiva.usuarioId, USUARIO_LOCAL), eq(tabelaOfensiva.eixo, eixo)));
    return { diasProtegidosNestaRodada: [], estoqueRestante: estoqueAtual };
  }

  if (linhaOfensiva.ultimoDiaProcessadoCongelamento >= diaAnteriorHoje) {
    return { diasProtegidosNestaRodada: [], estoqueRestante: estoqueAtual };
  }

  let contadorConsecutivos = await contarProtegidosConsecutivosTerminandoEm(
    eixo,
    linhaOfensiva.ultimoDiaProcessadoCongelamento,
    CONSTANTES_OFENSIVA_PADRAO.FREEZE_MAX_CONSECUTIVOS
  );

  const diasProtegidos: string[] = [];
  let dia = proximoDia(linhaOfensiva.ultimoDiaProcessadoCongelamento);
  while (dia <= diaAnteriorHoje) {
    const linhaDia = await obterLinhaDiaOfensiva(eixo, dia);

    if (linhaDia?.cumprido) {
      contadorConsecutivos = 0;
    } else {
      const decisao = aplicarCongelamento(contadorConsecutivos, estoqueAtual);
      if (decisao.protegido) {
        await consumirTokenCongelamento(eixo, dia);
        estoqueAtual = decisao.estoqueResultante;
        contadorConsecutivos += 1;
        diasProtegidos.push(dia);

        let metaValor: number;
        let metaUnidade: MetaDiaria['unidade'];
        if (linhaDia) {
          metaValor = linhaDia.metaValor;
          metaUnidade = linhaDia.metaUnidade;
        } else {
          const meta = await obterOuCriarMetaVigente(eixo, dia);
          metaValor = meta.valor;
          metaUnidade = meta.unidade;
        }

        await db
          .insert(diaOfensiva)
          .values({
            usuarioId: USUARIO_LOCAL,
            eixo,
            dia,
            metaValor,
            metaUnidade,
            realizado: linhaDia?.realizado ?? 0,
            cumprido: false,
            cumpridoEm: null,
            protegidoPorCongelamento: true,
            celebracaoEstado: linhaDia?.celebracaoEstado ?? 'nao_aplicavel',
            celebradaEm: linhaDia?.celebradaEm ?? null,
          })
          .onConflictDoUpdate({
            target: [diaOfensiva.usuarioId, diaOfensiva.eixo, diaOfensiva.dia],
            set: { protegidoPorCongelamento: true },
          });
      } else {
        contadorConsecutivos = 0;
      }
    }
    dia = proximoDia(dia);
  }

  await db
    .update(tabelaOfensiva)
    .set({ ultimoDiaProcessadoCongelamento: diaAnteriorHoje })
    .where(and(eq(tabelaOfensiva.usuarioId, USUARIO_LOCAL), eq(tabelaOfensiva.eixo, eixo)));

  if (diasProtegidos.length > 0) {
    const dias = await todosOsDiasParaOfensiva(eixo, hoje);
    const ofensivaRecalculada = recalcularOfensiva(eixo, dias);
    await persistirOfensiva(ofensivaRecalculada);
  }

  return { diasProtegidosNestaRodada: diasProtegidos, estoqueRestante: estoqueAtual };
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

/** RN-04.10d — se o app morrer antes de exibir a celebração, ela precisa aparecer na próxima
 * abertura. Chamado pelo Jardim a cada foco: uma pendência sobrevive a quantos fechamentos de app
 * forem necessários, porque mora no banco (`dia_ofensiva.celebracao_estado`), não em memória de
 * uma tela específica. */
export async function haCelebracaoPendenteHoje(eixo: Eixo = 'leitura'): Promise<boolean> {
  const db = abrirBanco();
  const hoje = diaLocalDeHoje();
  const [linha] = await db
    .select({ celebracaoEstado: diaOfensiva.celebracaoEstado })
    .from(diaOfensiva)
    .where(
      and(
        eq(diaOfensiva.usuarioId, USUARIO_LOCAL),
        eq(diaOfensiva.eixo, eixo),
        eq(diaOfensiva.dia, hoje)
      )
    )
    .limit(1);
  return linha?.celebracaoEstado === 'pendente';
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
