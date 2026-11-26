import type { ObraNaBiblioteca } from './estados';

// A estante da v2 (protótipo Direção B v2, tela 6): uma estante só, com as capas de frente, que
// junta o que está sendo lido e o que já foi lido. Contraria RN-02.6a por decisão de 22/11/2026;
// a spec muda depois. A obra abandonada continua só por filtro explícito (RN-02.6).

export type OrdemDaEstante = 'az' | 'recentes' | 'autor';
export const ORDENS_DA_ESTANTE: readonly OrdemDaEstante[] = ['az', 'recentes', 'autor'];

export type ObraNaEstante = ObraNaBiblioteca & { titulo: string; autor: string | null };

const colacao = new Intl.Collator('pt-BR', { sensitivity: 'base' });
const semAcento = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
const maisRecente = (o: ObraNaBiblioteca) => o.abertoEm ?? o.importadoEm;

const porTitulo = (a: ObraNaEstante, b: ObraNaEstante) => colacao.compare(a.titulo, b.titulo);

const COMPARAR: Record<OrdemDaEstante, (a: ObraNaEstante, b: ObraNaEstante) => number> = {
  az: porTitulo,
  recentes: (a, b) => maisRecente(b) - maisRecente(a),
  autor: (a, b) => {
    if (a.autor === null || b.autor === null) {
      return a.autor === b.autor ? porTitulo(a, b) : a.autor === null ? 1 : -1;
    }
    return colacao.compare(a.autor, b.autor) || porTitulo(a, b);
  },
};

/** O que a estante mostra, na ordem escolhida e filtrado pela busca por título ou autor. */
export function obrasNaEstante<T extends ObraNaEstante>(
  obras: readonly T[],
  ordem: OrdemDaEstante,
  termo = ''
): T[] {
  const busca = semAcento(termo.trim());
  return obras
    .filter((o) => o.estado !== 'abandonado')
    .filter((o) => !busca || semAcento(`${o.titulo} ${o.autor ?? ''}`).includes(busca))
    .sort(COMPARAR[ordem]);
}
