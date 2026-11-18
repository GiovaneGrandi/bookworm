import { describe, expect, it } from 'vitest';
import { contarLivros, formatarTamanho } from '../src/formatar';

describe('formatarTamanho', () => {
  it('KB abaixo de 1 MB, MB com uma casa e vírgula acima', () => {
    expect(formatarTamanho(421_888)).toBe('412 KB');
    expect(formatarTamanho(200)).toBe('1 KB');
    expect(formatarTamanho(2.3 * 1024 * 1024)).toBe('2,3 MB');
  });
});

describe('contarLivros', () => {
  it('por extenso até dez, singular e plural', () => {
    expect(contarLivros(1)).toBe('Um livro');
    expect(contarLivros(3)).toBe('Três livros');
    expect(contarLivros(0)).toBe('Nenhum livro');
    expect(contarLivros(12)).toBe('12 livros');
  });
});
