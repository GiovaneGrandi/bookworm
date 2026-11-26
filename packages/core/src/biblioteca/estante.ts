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

/** As fichas de estado do fichário: "todos" e os quatro estados que ficam na estante. */
export type FiltroDeEstado = 'todos' | 'lendo' | 'quero_ler' | 'concluido' | 'em_pausa';
export const FILTROS_DE_ESTADO: readonly FiltroDeEstado[] = [
  'todos',
  'lendo',
  'quero_ler',
  'concluido',
  'em_pausa',
];

/** O recorte escolhido no fichário: um estado e, se houver, a parede própria. */
export type RecorteDaEstante = {
  estado?: FiltroDeEstado;
  /** Os ids pendurados na parede escolhida; null é a estante inteira. */
  naParede?: readonly string[] | null;
};

const naEstante = (o: ObraNaBiblioteca) => o.estado !== 'abandonado';

/** O que a estante mostra: o recorte do fichário, a busca por título ou autor e a ordem. */
export function obrasNaEstante<T extends ObraNaEstante>(
  obras: readonly T[],
  ordem: OrdemDaEstante,
  termo = '',
  { estado = 'todos', naParede = null }: RecorteDaEstante = {}
): T[] {
  const busca = semAcento(termo.trim());
  const parede = naParede ? new Set(naParede) : null;
  return obras
    .filter(naEstante)
    .filter((o) => estado === 'todos' || o.estado === estado)
    .filter((o) => !parede || parede.has(o.id))
    .filter((o) => !busca || semAcento(`${o.titulo} ${o.autor ?? ''}`).includes(busca))
    .sort(COMPARAR[ordem]);
}

/** Quantos livros cada ficha de estado mostra. */
export function contarPorEstado(
  obras: readonly ObraNaBiblioteca[]
): Record<FiltroDeEstado, number> {
  const conta: Record<FiltroDeEstado, number> = {
    todos: 0,
    lendo: 0,
    quero_ler: 0,
    concluido: 0,
    em_pausa: 0,
  };
  for (const o of obras.filter(naEstante)) {
    conta.todos++;
    if (o.estado !== 'abandonado') conta[o.estado]++;
  }
  return conta;
}
