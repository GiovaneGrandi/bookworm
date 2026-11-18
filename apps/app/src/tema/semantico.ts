import { pigmento } from './pigmentos';
import { type NomeSuperficie, type Superficie, superficies } from './superficies';

// Camada 3 — papéis semânticos (design-system.md §2.3), resolvidos por superfície.

/** Aplica opacidade a uma cor #rrggbb. */
export function comAlfa(hex: string, alfa: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alfa})`;
}

function papeis(sup: Superficie) {
  return {
    acaoPrimaria: sup.acento,
    acaoPrimariaTinta: sup.fundo,
    selecionadoBorda: comAlfa(sup.acento, 0.7),
    selecionadoFundo: comAlfa(pigmento.ambar, 0.16),
    dormenciaTinta: sup.tintaFraca,
    focoAnel: sup.acento,
  };
}

export type PapeisSemanticos = ReturnType<typeof papeis>;

export const semantico = Object.fromEntries(
  Object.entries(superficies).map(([nome, sup]) => [nome, papeis(sup)])
) as Record<NomeSuperficie, PapeisSemanticos>;
