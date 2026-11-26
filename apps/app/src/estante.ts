import type { EstadoObra } from '@bookworm/core';
import { arte } from './tema/arte';

// Os textos e a cor das capas da estante (v2, tela 6). A capa é desenho de objeto: não há
// arte de capa importada, então cada obra recebe um par da paleta do mockup, sempre o mesmo.

type NaCapa = { estado: EstadoObra; progresso: number };

export const CAPAS = arte.estante.capas;
export type CorDeCapa = (typeof CAPAS)[number];

const pct = (progresso: number) => Math.round(progresso * 100);

const MARCA: Record<EstadoObra, string> = {
  lendo: 'lendo',
  em_pausa: 'pausa',
  quero_ler: 'quero ler',
  concluido: 'lido',
  abandonado: 'abandonado',
};

const ESTADO_FALADO: Record<EstadoObra, string> = {
  lendo: 'Lendo',
  em_pausa: 'Em pausa',
  quero_ler: 'Quero ler',
  concluido: 'Lido',
  abandonado: 'Abandonado',
};

const comPercentual = (estado: EstadoObra) => estado === 'lendo' || estado === 'em_pausa';

/** A marca no pé da capa: o estado e, para quem já começou, quanto foi lido. */
export function marcaDaCapa({ estado, progresso }: NaCapa): string {
  return comPercentual(estado) ? `${MARCA[estado]} · ${pct(progresso)}%` : MARCA[estado];
}

/** FNV-1a: a mesma obra cai sempre no mesmo par de cores. */
export function corDaCapa(id: string): CorDeCapa {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return CAPAS[h % CAPAS.length] as CorDeCapa;
}

export function rodapeDaEstante(n: number): string {
  if (n === 0) return 'Nenhum livro na estante';
  return `${n} ${n === 1 ? 'livro' : 'livros'} na estante`;
}

/** O que o leitor de tela anuncia numa capa (RN-DS.12). */
export function rotuloDaCapa(obra: NaCapa & { titulo: string; autor: string | null }): string {
  const quem = obra.autor ? `, de ${obra.autor}` : '';
  const estado = comPercentual(obra.estado)
    ? `${ESTADO_FALADO[obra.estado]}, ${pct(obra.progresso)}% lido`
    : ESTADO_FALADO[obra.estado];
  return `${obra.titulo.replace(/\s+/g, ' ').trim()}${quem}. ${estado}. Abrir no leitor`;
}
