// Núcleo puro da máquina de estados (RN-TEL.1) — decide o que muda, nunca grava nada. `maquina.ts`
// é a casca fina que chama estas funções e depois `await`a a persistência (RN-TEL.2) antes de
// aplicar o resultado em memória. Separado assim porque é a única forma de testar as transições
// sem depender de SQLite de verdade — algo que este ambiente de desenvolvimento não tem
// (`better-sqlite3` exige Visual Studio Build Tools, ausentes; ver `packages/db/test/schema.test.ts`
// para o mesmo problema documentado do outro lado do monorepo).
// Import direto em `sessao/`, não no barrel `@bookworm/core` — o barrel reexporta `indice/`, que
// traz `htmlparser2`/`fflate` (ESM puro que o preset `jest-expo` não transforma); `sessao/` não
// depende de nenhum dos dois, e o import direto evita mexer na config de teste padrão do Expo.
import {
  CONSTANTES_SESSAO_PADRAO,
  type ConstantesSessao,
  type EventoTraco,
} from '@bookworm/core/src/sessao/index.js';
import type { Carimbo } from './relogio.js';

export type EstadoSessao =
  | 'ociosa'
  | 'ativa'
  | 'pausada_sistema'
  | 'pausada_idle'
  | 'encerrada'
  | 'orfa';

export type ResultadoTransicao = {
  estado: EstadoSessao;
  evento: EventoTraco | null;
  pausaSistemaDesde: Carimbo | null;
  /** true — a sessão corrente deve ser finalizada (`finalizarSessao`) e a máquina volta a `ociosa`. */
  encerrar: boolean;
};

/** RN-TEL.3/RN-TEL.4 — perda de foco pausa na hora, sem espera. Blips menores que
 * `PAUSA_GRACA_SEGUNDOS` são descartados pela apuração (RN-TEL.14), nunca aqui: a máquina não
 * sabe, no instante em que o sinal chega, se ele vai durar mais ou menos que a graça. */
export function decidirParaBackground(
  estado: EstadoSessao,
  agora: Carimbo
): ResultadoTransicao | null {
  if (estado === 'pausada_sistema') return null;
  return {
    estado: 'pausada_sistema',
    evento: { tipo: 'pausa_iniciada', parede: agora.parede, mono: agora.mono, pausa: 'sistema' },
    pausaSistemaDesde: agora,
    encerrar: false,
  };
}

/** RN-03.11/RN-TEL.5 — se o segundo plano durou `SESSAO_TIMEOUT_MINUTOS` ou mais, a sessão morreu
 * lá: encerra usando o instante em que o segundo plano começou (`desde`), nunca "agora". Caso
 * contrário, é uma pausa normal e a sessão retoma. */
export function decidirParaForeground(
  estado: EstadoSessao,
  pausaSistemaDesde: Carimbo | null,
  ultimoSinal: Carimbo | null,
  agora: Carimbo,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): ResultadoTransicao | null {
  if (estado !== 'pausada_sistema') return null;

  const desde = pausaSistemaDesde ?? ultimoSinal;
  const timeoutMs = constantes.SESSAO_TIMEOUT_MINUTOS * 60 * 1000;
  const decorridoMs = desde ? agora.mono - desde.mono : 0;

  if (desde && decorridoMs >= timeoutMs) {
    return {
      estado: 'encerrada',
      evento: {
        tipo: 'sessao_encerrada',
        parede: desde.parede,
        mono: desde.mono,
        motivo: 'timeout_segundo_plano',
      },
      pausaSistemaDesde: null,
      encerrar: true,
    };
  }

  return {
    estado: 'ativa',
    evento: { tipo: 'pausa_encerrada', parede: agora.parede, mono: agora.mono },
    pausaSistemaDesde: null,
    encerrar: false,
  };
}

/**
 * RN-TEL.9 — checador, não acumulador: só compara dois carimbos, nunca soma tempo por tick de
 * timer. RN-TEL.12/13 — idle nunca vira evento explícito (`evento: null`): é a apuração
 * (`apurarTempoAtivo`, `@bookworm/core`) que descobre a pausa sozinha pelo gap entre sinais. Esta
 * função só diz se o estado em `sessao_em_curso` deve mudar para refletir isso (RN-TEL.2, e a UI).
 */
export function decidirIdle(
  estado: EstadoSessao,
  ultimoSinal: Carimbo | null,
  agora: Carimbo,
  constantes: ConstantesSessao = CONSTANTES_SESSAO_PADRAO
): boolean {
  if (estado !== 'ativa' || !ultimoSinal) return false;
  const idleMs = constantes.IDLE_TIMEOUT_SEGUNDOS * 1000;
  return agora.mono - ultimoSinal.mono >= idleMs;
}
