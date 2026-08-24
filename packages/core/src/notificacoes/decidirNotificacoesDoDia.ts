// Estágio 8 — notificações de engajamento locais (`01` §RN-01.15–17, `04` §5.7). Decisões puras,
// sem I/O: quem agenda de fato (`expo-notifications`) fica em `apps/app/src/notificacoes/servico.ts`.

/** RN-04.30 — o lembrete diário só faz sentido enquanto a meta do dia ainda não foi cumprida. */
export function deveAgendarLembreteDiario(metaCumpridaHoje: boolean): boolean {
  return !metaCumpridaHoje;
}

/** RN-04.31 — o alerta de ofensiva em risco é só para quem já tem algo em jogo: ofensiva ativa de
 * 3 dias ou mais e meta do dia ainda não cumprida. Sem o piso de 3 dias, o alerta soaria como
 * cobrança para quem acabou de começar — contraria RN-01.16 (convite, nunca cobrança). */
export function deveAgendarOfensivaEmRisco(
  metaCumpridaHoje: boolean,
  ofensivaAtivaDias: number
): boolean {
  return !metaCumpridaHoje && ofensivaAtivaDias >= 3;
}
