import { describe, expect, it } from 'vitest';
import { barraVisivel, itensDaBarra } from '../src/navegacao';

describe('Barra de navegação · onde aparece', () => {
  it('nunca na mesa: a mesa já é o índice', () => {
    expect(barraVisivel('mesa', false)).toBe(false);
    expect(barraVisivel('mesa', true)).toBe(false);
  });

  it('fixa nas outras telas', () => {
    expect(barraVisivel('biblioteca', false)).toBe(true);
    expect(barraVisivel('importar', false)).toBe(true);
  });

  it('no leitor, escondida por padrão; só aparece junto do menu (toque no meio da página)', () => {
    expect(barraVisivel('ler', false)).toBe(false);
    expect(barraVisivel('ler', true)).toBe(true);
  });
});

describe('Barra de navegação · os itens', () => {
  const livro = { titulo: 'O cortiço' };

  it('cinco destinos, na ordem da régua', () => {
    expect(itensDaBarra('biblioteca', livro).map((i) => i.rotulo)).toEqual([
      'Mesa',
      'Ler',
      'Biblioteca',
      'Importar',
      'Jardim',
    ]);
  });

  it('marca a tela atual', () => {
    const itens = itensDaBarra('importar', livro);
    expect(itens.filter((i) => i.atual).map((i) => i.destino)).toEqual(['importar']);
  });

  it('"Ler" continua o livro em leitura e diz qual é', () => {
    const ler = itensDaBarra('biblioteca', livro).find((i) => i.destino === 'ler');
    expect(ler?.disponivel).toBe(true);
    expect(ler?.rotuloAcessivel).toBe('Ler: continuar O cortiço');
  });

  it('"Ler" sem livro em leitura fica indisponível', () => {
    const ler = itensDaBarra('biblioteca', null).find((i) => i.destino === 'ler');
    expect(ler?.disponivel).toBe(false);
    expect(ler?.rotuloAcessivel).toBe('Ler: nenhum livro em leitura');
  });

  it('o jardim ainda não existe: indisponível, "em breve"', () => {
    const jardim = itensDaBarra('biblioteca', livro).find((i) => i.destino === 'jardim');
    expect(jardim?.disponivel).toBe(false);
    expect(jardim?.rotuloAcessivel).toBe('Jardim: em breve');
  });
});
