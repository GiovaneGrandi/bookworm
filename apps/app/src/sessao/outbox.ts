// RN-TEL.33/39/40 — batimento a cada 30s de tempo *ativo* (RN-TEL.9: nunca de relógio de parede
// nem de contagem de ticks). O checador (`sinais.ts`) dispara isto periodicamente, mas quem decide
// se um batimento é gravado é `apurarTempoAtivo` — a mesma função pura do Estágio 3, rodando sobre
// o traço local até agora — comparando contra o último total gravado, nunca contando ticks.
import { apurarTempoAtivo } from '@bookworm/core/src/sessao/index.js';
import { itemOutbox, USUARIO_LOCAL } from '@bookworm/db';
import { abrirBanco } from '../persistencia/db.js';
import { useMaquinaSessao } from './maquina.js';
import { listarEventosBrutos } from './persistenciaSessao.js';

const HEARTBEAT_INTERVALO_S = 30;

let ultimoTempoAtivoGravadoS = 0;

export async function tentarGravarHeartbeat(): Promise<void> {
  const { sessaoId, obraId, fuso } = useMaquinaSessao.getState();
  if (!sessaoId || !obraId) {
    ultimoTempoAtivoGravadoS = 0;
    return;
  }

  const eventos = await listarEventosBrutos(sessaoId);
  if (eventos.length === 0) return;

  const { tempoAtivoS } = apurarTempoAtivo({ fuso, eventos });
  if (tempoAtivoS - ultimoTempoAtivoGravadoS < HEARTBEAT_INTERVALO_S) return;

  ultimoTempoAtivoGravadoS = tempoAtivoS;

  const db = abrirBanco();
  const agora = new Date();
  // RN-TEL.33 — payload carrega o estado acumulado da sessão até agora, nunca um delta desde o
  // último batimento; RN-TEL.40 — a chave composta (usuário, tipo, sessão) faz este insert
  // substituir o batimento pendente anterior em vez de empilhar um novo item na fila.
  const payload = { sessaoId, obraId, tempoAtivoS };

  await db
    .insert(itemOutbox)
    .values({
      usuarioId: USUARIO_LOCAL,
      tipo: 'sessao_batimento',
      referenciaId: sessaoId,
      payload,
      criadoEm: agora,
      atualizadoEm: agora,
    })
    .onConflictDoUpdate({
      target: [itemOutbox.usuarioId, itemOutbox.tipo, itemOutbox.referenciaId],
      set: { payload, atualizadoEm: agora },
    });
}

/** Chamado ao encerrar/trocar de sessão — o próximo batimento parte de zero, não do total da sessão anterior. */
export function resetarHeartbeat(): void {
  ultimoTempoAtivoGravadoS = 0;
}
