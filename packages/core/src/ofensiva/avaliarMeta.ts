import type { AgregadoDoDia, AvaliacaoMeta, DiaJaRegistrado, MetaDiaria } from './tipos.js';

/**
 * RN-04.1, RN-04.2, RN-04.10 — soma do que conta para a meta hoje contra o valor vigente, na
 * unidade escolhida pelo usuário (páginas canônicas ou minutos de tempo ativo).
 *
 * RN-04.10f — se o dia **já foi celebrado** (`diaJaRegistrado.celebracaoEstado === 'exibida'`),
 * o cumprimento é pegajoso: continua `true` mesmo que o agregado de hoje, recalculado depois de
 * uma sessão invalidada ou descartada, já não alcance a meta. Retirar uma conquista que o usuário
 * já viu custa mais do que manter um dia indevido — a checagem "ainda bate a meta?" só roda
 * enquanto ninguém viu a celebração.
 */
export function avaliarMeta(
  agregado: AgregadoDoDia,
  meta: MetaDiaria,
  diaJaRegistrado?: DiaJaRegistrado
): AvaliacaoMeta {
  // `palavras` (eixo escrita) cairia aqui também, mas o MVP só expõe leitura (mvp.md §4.3) — a
  // via de agregado de palavras chega junto com o eixo de escrita.
  const realizado =
    meta.unidade === 'paginas' ? agregado.paginasCanonicas : agregado.tempoAtivoS / 60;

  if (diaJaRegistrado?.celebracaoEstado === 'exibida' && diaJaRegistrado.cumprido) {
    return { cumprida: true, realizado, meta: meta.valor, restante: 0 };
  }

  const cumprida = realizado >= meta.valor;
  return {
    cumprida,
    realizado,
    meta: meta.valor,
    restante: Math.max(0, meta.valor - realizado),
  };
}
