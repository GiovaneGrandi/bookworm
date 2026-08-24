// RN-04.24/RN-04.27 — cada dia cumprido "rega" o jardim, um elemento visual permanente a mais no
// canteiro; o acervo nunca decresce, então a posição de um elemento já plantado nunca muda quando
// o acervo cresce (testado: os primeiros N elementos são um prefixo estável de N+K elementos).
import { pseudoAleatorio } from './cores.js';

export type ElementoDiario = {
  x: number;
  y: number;
  raio: number;
  anguloBase: number;
};

/** Teto visual — RN-04.24 diz "cresce", não "cresce sem limite". Depois disso o canteiro já está
 * cheio; um acervo de anos não deveria virar uma parede de pontos ilegível. */
const MAX_ELEMENTOS_VISIVEIS = 36;

export function posicionarElementosDiarios(
  tamanhoPermanente: number,
  largura: number,
  altura: number
): ElementoDiario[] {
  const quantidade = Math.min(Math.max(tamanhoPermanente, 0), MAX_ELEMENTOS_VISIVEIS);
  const elementos: ElementoDiario[] = [];
  for (let i = 0; i < quantidade; i++) {
    const semente = i * 2654435761;
    elementos.push({
      x: pseudoAleatorio(semente) * largura,
      // concentrados na metade inferior da faixa — é o solo do canteiro, não o céu.
      y: altura - pseudoAleatorio(semente + 1) * altura * 0.6,
      raio: 2 + pseudoAleatorio(semente + 2) * 3,
      anguloBase: pseudoAleatorio(semente + 3) * 360,
    });
  }
  return elementos;
}
