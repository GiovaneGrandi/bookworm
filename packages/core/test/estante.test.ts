import { describe, expect, it } from 'vitest';
import { type EstadoObra, obrasNaEstante } from '../src/index';

type Obra = {
  id: string;
  titulo: string;
  autor: string | null;
  estado: EstadoObra;
  abertoEm: number | null;
  importadoEm: number;
};

const obra = (
  id: string,
  titulo: string,
  autor: string | null,
  estado: EstadoObra = 'quero_ler',
  abertoEm: number | null = null,
  importadoEm = 0
): Obra => ({ id, titulo, autor, estado, abertoEm, importadoEm });

const acervo = [
  obra('a', 'O cortiço', 'Aluísio Azevedo', 'lendo', 30),
  obra('b', 'Dom Casmurro', 'Machado de Assis', 'concluido', 10),
  obra('c', 'Iracema', 'José de Alencar', 'em_pausa', null, 20),
  obra('d', 'Árvore do mundo', null, 'quero_ler', null, 5),
  obra('e', 'Memórias póstumas', 'Machado de Assis', 'abandonado', 40),
];

const ids = (obras: Obra[]) => obras.map((o) => o.id);

describe('Estante única da v2 · o que entra', () => {
  it('lendo, em pausa, quero ler e lidos ficam juntos; abandonada só por filtro (RN-02.6)', () => {
    expect(ids(obrasNaEstante(acervo, 'az')).sort()).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('Estante · ordenar', () => {
  it('A–Z pelo título, sem tropeçar em acento nem em maiúscula', () => {
    expect(ids(obrasNaEstante(acervo, 'az'))).toEqual(['d', 'b', 'c', 'a']);
  });

  it('Recentes: a última aberta primeiro; nunca aberta conta pela importação', () => {
    expect(ids(obrasNaEstante(acervo, 'recentes'))).toEqual(['a', 'c', 'b', 'd']);
  });

  it('Autor: pelo autor e, no mesmo autor, pelo título; sem autor vai para o fim', () => {
    const mais = [...acervo, obra('f', 'Helena', 'Machado de Assis')];
    expect(ids(obrasNaEstante(mais, 'autor'))).toEqual(['a', 'c', 'b', 'f', 'd']);
  });

  it('não altera a lista recebida', () => {
    const copia = [...acervo];
    obrasNaEstante(acervo, 'recentes');
    expect(acervo).toEqual(copia);
  });
});

describe('Estante · buscar', () => {
  it('acha pelo título ou pelo autor, ignorando acento e caixa', () => {
    expect(ids(obrasNaEstante(acervo, 'az', 'cortico'))).toEqual(['a']);
    expect(ids(obrasNaEstante(acervo, 'az', 'MACHADO'))).toEqual(['b']);
    expect(ids(obrasNaEstante(acervo, 'az', 'alencar'))).toEqual(['c']);
  });

  it('busca em branco mostra tudo; busca sem resultado, nada', () => {
    expect(obrasNaEstante(acervo, 'az', '   ')).toHaveLength(4);
    expect(obrasNaEstante(acervo, 'az', 'xyz')).toEqual([]);
  });
});
