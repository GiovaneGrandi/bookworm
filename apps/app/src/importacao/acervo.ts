// O acervo embutido: 3 obras de domínio público em PT-BR, do Project Gutenberg (Q7).
// Detalhes de origem e conferência em `specs/acervo-inicial.md`.
export type ItemAcervo = {
  chave: string;
  titulo: string;
  autor: string;
  arquivo: string;
  modulo: number;
};

export const ACERVO: readonly ItemAcervo[] = [
  {
    chave: 'dom-casmurro',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    arquivo: 'dom-casmurro.epub',
    modulo: require('../../assets/acervo/dom-casmurro.epub'),
  },
  {
    chave: 'o-cortico',
    titulo: 'O cortiço',
    autor: 'Aluísio Azevedo',
    arquivo: 'o-cortico.epub',
    modulo: require('../../assets/acervo/o-cortico.epub'),
  },
  {
    chave: 'iracema',
    titulo: 'Iracema',
    autor: 'José de Alencar',
    arquivo: 'iracema.epub',
    modulo: require('../../assets/acervo/iracema.epub'),
  },
];
