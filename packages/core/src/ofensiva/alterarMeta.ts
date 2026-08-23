import { CONSTANTES_OFENSIVA_PADRAO, type ConstantesOfensiva, FAIXAS_META } from './constantes.js';
import type { MetaDiaria, PedidoAlteracaoMeta, ResultadoAlteracaoMeta } from './tipos.js';

/**
 * RN-04.4–RN-04.9. Duas decisões independentes:
 *
 * 1. **Faixa** (RN-04.4) — sempre verificada, para qualquer direção.
 * 2. **Atrito de tempo** (RN-04.6) — só se aplica a aumento ou troca de unidade (RN-04.8 trata
 *    troca de unidade como alteração comum). Redução na mesma unidade é sempre livre (RN-04.6a):
 *    sem intervalo mínimo, e sem mexer no relógio do intervalo (uma redução não abre nem fecha
 *    janela para o próximo aumento).
 *
 * `RN-04.7` — a alteração vale **a partir de amanhã**, redução inclusa: é essa vigência futura
 * que impede o abuso de rebaixar a meta ao fim do dia para salvar a corrente, não a existência ou
 * não de atrito. `hoje` é `YYYY-MM-DD` local; `metaAtual` é `null` na primeira meta do usuário.
 */
export function alterarMeta(
  metaAtual: MetaDiaria | null,
  pedido: PedidoAlteracaoMeta,
  hoje: string,
  constantes: ConstantesOfensiva = CONSTANTES_OFENSIVA_PADRAO
): ResultadoAlteracaoMeta {
  const eixo = metaAtual?.eixo ?? 'leitura';
  if (!dentroDaFaixa(eixo, pedido)) {
    return { permitida: false, motivo: 'fora_da_faixa' };
  }

  const ehReducao =
    metaAtual !== null && metaAtual.unidade === pedido.unidade && pedido.valor < metaAtual.valor;

  if (
    !ehReducao &&
    metaAtual?.proximaAlteracaoPermitidaEm &&
    hoje < metaAtual.proximaAlteracaoPermitidaEm
  ) {
    return {
      permitida: false,
      motivo: 'intervalo_minimo',
      podeAlterarEm: metaAtual.proximaAlteracaoPermitidaEm,
    };
  }

  const vigenteDesde = diaSeguinte(hoje);
  return {
    permitida: true,
    metaResultante: {
      eixo,
      unidade: pedido.unidade,
      valor: pedido.valor,
      vigenteDesde,
      direcaoAlteracao: metaAtual === null ? 'inicial' : ehReducao ? 'reducao' : 'aumento',
      proximaAlteracaoPermitidaEm: ehReducao
        ? (metaAtual?.proximaAlteracaoPermitidaEm ?? null)
        : somarDias(vigenteDesde, constantes.INTERVALO_ALTERACAO_META_DIAS),
    },
  };
}

function dentroDaFaixa(eixo: 'leitura' | 'escrita', pedido: PedidoAlteracaoMeta): boolean {
  const faixasDoEixo = FAIXAS_META[eixo] as Record<string, { min: number; max: number }>;
  const faixa = faixasDoEixo[pedido.unidade];
  if (!faixa) return false;
  return pedido.valor >= faixa.min && pedido.valor <= faixa.max;
}

function diaSeguinte(dia: string): string {
  return somarDias(dia, 1);
}

function somarDias(dia: string, dias: number): string {
  const [ano, mes, diaDoMes] = dia.split('-').map(Number);
  const data = new Date(Date.UTC(ano!, mes! - 1, diaDoMes!));
  data.setUTCDate(data.getUTCDate() + dias);
  return data.toISOString().slice(0, 10);
}
