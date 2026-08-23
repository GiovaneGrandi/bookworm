// Estágio 6 passo 6/8 — a cola entre o traço local (`evento_bruto_sessao`) e as funções puras do
// Estágio 3 (`@bookworm/core`). Roda inteiramente no cliente: sem servidor até o Estágio 9, é este
// código que produz a única `sessao_leitura` que existe. `sobreposta` (RN-TEL.34) fica sempre
// `false` aqui — detectar sobreposição exige comparar contra outras sessões já enviadas, o que só
// existe do lado do servidor.
// Import direto em `sessao/`/`ulid.js`, não no barrel `@bookworm/core` — evita puxar `indice/`
// (`htmlparser2`/`fflate`, ESM que o preset `jest-expo` não transforma) por uma dependência que
// este módulo nunca usa.
import {
  apurarBlocosDeFoco,
  apurarTempoAtivoDividido,
  apurarVolume,
  calcularLeituraConsciente,
  classificarEstilo,
  classificarSessao,
  type SessaoApurada,
  type TracoDeEventos,
} from '@bookworm/core/src/sessao/index.js';
import { criarUlid } from '@bookworm/core/src/ulid.js';
import { sessaoLeitura, USUARIO_LOCAL } from '@bookworm/db';
import { abrirBanco } from '../persistencia/db.js';
import { listarEventosBrutos, removerSessaoEmCurso } from './persistenciaSessao.js';

export type OrigemSessao = 'online' | 'offline' | 'recuperada';

export async function finalizarSessao(params: {
  sessaoId: string;
  obraId: string;
  fuso: string;
  offsetUtcMinutos: number;
  origem: OrigemSessao;
}): Promise<void> {
  const eventos = await listarEventosBrutos(params.sessaoId);

  if (eventos.length === 0) {
    await removerSessaoEmCurso(params.sessaoId);
    return;
  }

  const traco: TracoDeEventos = { fuso: params.fuso, eventos };

  // RN-TEL.10 — divergência entre o intervalo de parede e o monotônico da sessão inteira; sinal
  // de que o relógio do aparelho mudou no meio do caminho (viagem, ajuste manual), não motivo de
  // descarte. Um único valor para a sessão inteira, replicado em cada parte da virada do dia — a
  // divergência não "pertence" a uma parte mais que a outra.
  const primeiroDoTraco = eventos[0]!;
  const ultimoDoTraco = eventos[eventos.length - 1]!;
  const derivaRelogioMs =
    ultimoDoTraco.parede - primeiroDoTraco.parede - (ultimoDoTraco.mono - primeiroDoTraco.mono);
  // RN-03.6, RN-TEL.44–47 — uma sessão pode virar o dia civil; cada parte apurada vira uma linha
  // própria de `sessao_leitura`, com a soma dos totais garantida por `apurarTempoAtivoDividido`.
  const partes = apurarTempoAtivoDividido(traco);
  const db = abrirBanco();

  for (const parte of partes) {
    const volume = apurarVolume(parte.traco);
    const blocosFoco = apurarBlocosDeFoco(parte.traco);

    const sessaoApurada: SessaoApurada = {
      tempoAtivoS: parte.tempoAtivoS,
      tempoBrutoS: parte.tempoBrutoS,
      maiorBlocoContinuoS: blocosFoco.maiorS,
      interacoesQualitativasBrutas: contarInteracoesQualitativas(parte.traco),
      caracteresLidos: volume.caracteres,
      volumeSuspeita: volume.suspeita,
      sobreposta: false,
    };

    const leituraConsciente = calcularLeituraConsciente(sessaoApurada);
    const estilo = classificarEstilo(sessaoApurada);
    const status = classificarSessao(sessaoApurada);

    const primeiro = parte.traco.eventos[0]!;
    const ultimo = parte.traco.eventos[parte.traco.eventos.length - 1]!;

    await db.insert(sessaoLeitura).values({
      // A primeira (ou única) parte herda o client_ulid original — as demais, geradas pela
      // virada do dia, nunca existiram no cliente antes de agora e precisam de um id próprio.
      id: partes.indexOf(parte) === 0 ? params.sessaoId : criarUlid(),
      usuarioId: USUARIO_LOCAL,
      obraId: params.obraId,
      iniciadaEm: new Date(primeiro.parede),
      encerradaEm: new Date(ultimo.parede),
      fuso: params.fuso,
      offsetUtcMinutos: params.offsetUtcMinutos,
      tempoBrutoS: parte.tempoBrutoS,
      tempoAtivoS: parte.tempoAtivoS,
      caracteresLidos: volume.caracteres,
      volumeSuspeita: volume.suspeita,
      maiorBlocoContinuoS: blocosFoco.maiorS,
      blocosFoco,
      interacoesQualitativas: leituraConsciente.interacoesContadas,
      scoreLeituraConsciente: leituraConsciente.score,
      estilo,
      status,
      origem: params.origem,
      derivaRelogioMs,
      criadaEm: new Date(),
    });
  }

  await removerSessaoEmCurso(params.sessaoId);
}

function contarInteracoesQualitativas(traco: TracoDeEventos): number {
  return traco.eventos.filter((e) => e.tipo === 'interacao_qualitativa').length;
}
