// Estágio 8 — notificações de engajamento locais (`stack.md` §notificações, `01` §5, `04` §5.7).
// `expo-notifications`, agendadas localmente — sem FCM no MVP (`RN-ST` decisão de stack). Toda a
// regra de negócio (quando cada notificação deve existir) é pura e vive em
// `@bookworm/core/src/notificacoes`; este arquivo só resolve o estado atual e chama a API nativa.
import {
  deveAgendarLembreteDiario,
  deveAgendarOfensivaEmRisco,
} from '@bookworm/core/src/notificacoes/index.js';
import type { Eixo } from '@bookworm/core/src/ofensiva/index.js';
import * as Notifications from 'expo-notifications';
import { obterOfensivaAtual, obterProgressoDeHoje } from '../ofensiva/servico.js';

const ID_LEMBRETE_DIARIO = 'bw-lembrete-diario';
const ID_OFENSIVA_EM_RISCO = 'bw-ofensiva-em-risco';

/** RN-01.15 (a validar) — horário padrão de leitura. Sem tela de preferência de notificação nesta
 * rodada (fica para o Estágio 9, quando existir onboarding/conta): fixo, mesmo tratamento de
 * `META_PADRAO_MINUTOS` em `ofensiva/servico.ts`. */
const HORARIO_LEMBRETE_PADRAO = { hora: 20, minuto: 0 };
/** RN-04.31 (a validar) — 2h antes da virada do dia civil (meia-noite local). */
const HORARIO_OFENSIVA_EM_RISCO = { hora: 22, minuto: 0 };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function garantirPermissao(): Promise<boolean> {
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) return true;
  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.granted;
}

function proximoDisparo(hora: number, minuto: number): Date {
  const agora = new Date();
  const disparo = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
    hora,
    minuto,
    0,
    0
  );
  if (disparo.getTime() <= agora.getTime()) {
    disparo.setDate(disparo.getDate() + 1);
  }
  return disparo;
}

async function cancelar(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => {
    // nunca agendado — cancelar um id inexistente não é erro para quem chama.
  });
}

/** RN-02.14 — chamado ao abrir uma obra para leitura: suprime as notificações de engajamento
 * enquanto a sessão estiver ativa. `sincronizarNotificacoesDeEngajamento` reagenda ao encerrar. */
export async function suprimirNotificacoesDeEngajamento(): Promise<void> {
  await cancelar(ID_LEMBRETE_DIARIO);
  await cancelar(ID_OFENSIVA_EM_RISCO);
}

/**
 * RN-04.30/RN-04.31 — chamado ao encerrar uma sessão (RN-02.14: reagenda depois do encerramento) e
 * a cada abertura do Jardim: decide, a partir do estado atual, se cada notificação de engajamento
 * deve existir hoje, e agenda/cancela para bater com a decisão.
 *
 * RN-01.16 (convite, nunca cobrança) está embutido na copy fixa abaixo; RN-01.17 (teto de 2/dia)
 * é satisfeito por construção — só existem estas duas notificações de engajamento no MVP, cada
 * uma no máximo uma vez por dia.
 */
export async function sincronizarNotificacoesDeEngajamento(eixo: Eixo = 'leitura'): Promise<void> {
  const permitido = await garantirPermissao();
  if (!permitido) return;

  const [ofensiva, progresso] = await Promise.all([
    obterOfensivaAtual(eixo),
    obterProgressoDeHoje(eixo),
  ]);
  const metaCumpridaHoje = progresso !== null && progresso.realizado >= progresso.meta;
  const ofensivaAtivaDias = ofensiva?.estado === 'ativa' ? ofensiva.contagemAtual : 0;

  await cancelar(ID_LEMBRETE_DIARIO);
  if (deveAgendarLembreteDiario(metaCumpridaHoje)) {
    await Notifications.scheduleNotificationAsync({
      identifier: ID_LEMBRETE_DIARIO,
      content: {
        title: 'Um convite para ler',
        body: 'Sua leitura de hoje está esperando, sem pressa.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: proximoDisparo(HORARIO_LEMBRETE_PADRAO.hora, HORARIO_LEMBRETE_PADRAO.minuto),
      },
    });
  }

  await cancelar(ID_OFENSIVA_EM_RISCO);
  if (deveAgendarOfensivaEmRisco(metaCumpridaHoje, ofensivaAtivaDias)) {
    const disparo = proximoDisparo(
      HORARIO_OFENSIVA_EM_RISCO.hora,
      HORARIO_OFENSIVA_EM_RISCO.minuto
    );
    const hoje = new Date();
    // Só faz sentido para hoje — se o horário de risco já passou, não há mais o que proteger
    // agora (o disparo caiu para amanhã); amanhã a decisão é recalculada do zero a partir do
    // estado daquele dia, não deste alerta adiado.
    if (disparo.toDateString() === hoje.toDateString()) {
      await Notifications.scheduleNotificationAsync({
        identifier: ID_OFENSIVA_EM_RISCO,
        content: {
          title: 'Sua ofensiva está esperando por hoje',
          body: `Ainda dá tempo de manter seus ${ofensivaAtivaDias} dias.`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: disparo,
        },
      });
    }
  }
}
