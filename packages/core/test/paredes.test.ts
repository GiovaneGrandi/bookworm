import { describe, expect, it } from 'vitest';
import {
  alternarNaEscolha,
  CORES_DE_PAREDE,
  limparNomeDeParede,
  NOME_DE_PAREDE_MAX,
  paredeAoEntrar,
} from '../src/index';

describe('Parede própria · nome', () => {
  it('apara as pontas e junta espaços repetidos', () => {
    expect(limparNomeDeParede('  Machado,   inteiro ')).toBe('Machado, inteiro');
  });

  it('nome em branco não serve', () => {
    expect(limparNomeDeParede('')).toBeNull();
    expect(limparNomeDeParede('   ')).toBeNull();
  });

  it(`até ${NOME_DE_PAREDE_MAX} caracteres; mais que isso não serve`, () => {
    expect(limparNomeDeParede('a'.repeat(NOME_DE_PAREDE_MAX))).toHaveLength(NOME_DE_PAREDE_MAX);
    expect(limparNomeDeParede('a'.repeat(NOME_DE_PAREDE_MAX + 1))).toBeNull();
  });
});

describe('Parede própria · cor e escolha dos livros', () => {
  it('as cinco tintas, com a da mesa primeiro', () => {
    expect(CORES_DE_PAREDE).toEqual(['mesa', 'vinho', 'prussia', 'terra', 'grafite']);
  });

  it('tocar num livro marca; tocar de novo desmarca, sem mexer no resto', () => {
    const uma = alternarNaEscolha([], 'a');
    expect(uma).toEqual(['a']);
    const duas = alternarNaEscolha(uma, 'b');
    expect(duas).toEqual(['a', 'b']);
    expect(alternarNaEscolha(duas, 'a')).toEqual(['b']);
    expect(uma).toEqual(['a']);
  });
});

describe('Parede própria · a favorita é a que abre', () => {
  const paredes = [
    { id: 'a', favorita: false },
    { id: 'b', favorita: true },
  ];

  it('entrar na estante abre a parede favorita', () => {
    expect(paredeAoEntrar(paredes)).toBe('b');
  });

  it('sem favorita, abre a estante inteira', () => {
    expect(paredeAoEntrar([{ id: 'a', favorita: false }])).toBeNull();
    expect(paredeAoEntrar([])).toBeNull();
  });
});
