// RN-TEL.3/RN-TEL.4 — liga o ciclo de vida do SO à máquina de estados. Só `background` conta como
// perda de foco; `inactive` (transitório do iOS — central de notificações, troca de app) não
// dispara pausa própria — um blip curto já é descartado pela apuração (RN-TEL.14), então tratar
// `inactive` também como pausa gravaria um evento a mais sem necessidade.
import { AppState, type AppStateStatus } from 'react-native';
import { useMaquinaSessao } from './maquina.js';
import { resetarHeartbeat, tentarGravarHeartbeat } from './outbox.js';

const INTERVALO_CHECADOR_IDLE_MS = 15_000;
const INTERVALO_CHECADOR_HEARTBEAT_MS = 30_000;

function aoMudarAppState(proximoEstado: AppStateStatus) {
  const { paraBackground, paraForeground } = useMaquinaSessao.getState();
  if (proximoEstado === 'active') {
    void paraForeground();
  } else if (proximoEstado === 'background') {
    void paraBackground();
    resetarHeartbeat();
  }
}

/** Chamar uma vez na raiz do app (depois de `useMaquinaSessao.getState().inicializar()`).
 * Retorna a função de limpeza — chamar no unmount. */
export function iniciarSinaisDeSessao(): () => void {
  const assinatura = AppState.addEventListener('change', aoMudarAppState);

  // RN-TEL.9 — checadores, não acumuladores: cada tick só pergunta "o relógio já passou do
  // limiar?" (idle) ou dispara um recálculo de duração de verdade (heartbeat); nenhum dos dois
  // soma tempo por conta própria.
  const temporizadorIdle = setInterval(() => {
    void useMaquinaSessao.getState().verificarIdle();
  }, INTERVALO_CHECADOR_IDLE_MS);

  const temporizadorHeartbeat = setInterval(() => {
    void tentarGravarHeartbeat();
  }, INTERVALO_CHECADOR_HEARTBEAT_MS);

  // Uma sessão nova (ou nenhuma) sempre parte de um heartbeat zerado — nunca do total acumulado
  // da sessão anterior. Assinar `sessaoId` em vez de chamar `resetarHeartbeat` de dentro de
  // `maquina.ts` evita um import circular entre os dois módulos.
  let sessaoIdAnterior = useMaquinaSessao.getState().sessaoId;
  const cancelarAssinatura = useMaquinaSessao.subscribe((estado) => {
    if (estado.sessaoId !== sessaoIdAnterior) {
      sessaoIdAnterior = estado.sessaoId;
      resetarHeartbeat();
    }
  });

  return () => {
    assinatura.remove();
    clearInterval(temporizadorIdle);
    clearInterval(temporizadorHeartbeat);
    cancelarAssinatura();
  };
}
