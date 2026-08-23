// Camada 3 — papel semântico (`specs/design-system.md` §2.3). Resolve sempre para a camada 2
// (superfície), nunca para a camada 1 (pigmento) — o "verde vive sobre papel" já virou mecânica
// na superfície; aqui só falta compor os dois papéis que dependem de mistura (seleção).
import { corComAlfa } from './corComAlfa.js';
import { pigmento } from './pigmentos.js';
import { type NomeSuperficie, superficie } from './superficies.js';

export type PapelSemantico = {
  acaoPrimaria: string;
  acaoPrimariaTinta: string;
  selecionadoBorda: string;
  selecionadoFundo: string;
  dormenciaTinta: string;
  focoAnel: string;
};

function papelSemanticoDe(nome: NomeSuperficie): PapelSemantico {
  const sup = superficie[nome];
  return {
    acaoPrimaria: sup.acento,
    acaoPrimariaTinta: sup.fundo,
    // Regra 7 de direcao-visual.md §4: borda de acento a 70% + fundo âmbar a 16% — resolve por
    // superfície (o acento muda; o âmbar de seleção é sempre o pigmento de marca, não da leitora).
    selecionadoBorda: corComAlfa(sup.acento, 0.7),
    selecionadoFundo: corComAlfa(pigmento.ambar, 0.16),
    dormenciaTinta: sup.tintaFraca,
    focoAnel: sup.acento,
  };
}

export const papelSemantico = Object.fromEntries(
  (Object.keys(superficie) as NomeSuperficie[]).map((nome) => [nome, papelSemanticoDe(nome)])
) as Record<NomeSuperficie, PapelSemantico>;
