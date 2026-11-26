import type { Formato } from '@bookworm/core';
import { paginaCanonica, tituloCurto, totalDePaginas } from '@bookworm/core';

// Os textos dos objetos da mesa. Cada objeto mostra o estado da função (RN-DV.3), e o leitor de
// tela anuncia a etiqueta datilografada seguida desse estado (RN-DV.10, RN-DS.12).

type Textos = { etiqueta: string; rotulo: string };

type LivroNaMesa = {
  titulo: string;
  formato: Formato;
  progresso: number;
  locator: string | null;
};

const pct = (progresso: number) => Math.round(progresso * 100);
const umaLinha = (titulo: string) => titulo.replace(/\s+/g, ' ').trim();

function posicaoDoPdf(locator: string | null): number | null {
  if (!locator) return null;
  try {
    const p = JSON.parse(locator)?.locations?.position;
    return typeof p === 'number' && p > 0 ? p : null;
  } catch {
    return null;
  }
}

/**
 * O livro aberto: página corrente pela página canônica do índice (RN-02.12) no EPUB, ou pela
 * posição do Readium no PDF, que entra sem índice (Q5).
 */
export function textosDoLivro(
  obra: LivroNaMesa,
  totalCaracteres: number | null
): Textos & { pagina: number | null; folios: { esquerda: number | null; direita: number | null } } {
  const curto = tituloCurto(obra.titulo);
  const inteiro = umaLinha(obra.titulo);
  const indexado = obra.formato === 'epub' && totalCaracteres && totalCaracteres > 0;
  const pagina = indexado
    ? paginaCanonica(Math.round(obra.progresso * totalCaracteres))
    : posicaoDoPdf(obra.locator);

  if (pagina === null) {
    return {
      etiqueta: `Continuar · ${curto} · ${pct(obra.progresso)}%`,
      rotulo: `Continuar lendo ${inteiro}, ${pct(obra.progresso)}% lido`,
      pagina,
      folios: { esquerda: null, direita: null },
    };
  }

  const de = indexado ? ` de ${totalDePaginas(totalCaracteres)}` : '';
  return {
    etiqueta: `Continuar · ${curto} · p. ${pagina}`,
    rotulo: `Continuar lendo ${inteiro}, página ${pagina}${de}`,
    pagina,
    folios: { esquerda: pagina > 1 ? pagina - 1 : null, direita: pagina },
  };
}

/**
 * Deslizar o livro: entre os livros em leitura, qual fica aberto na mesa e quem aparece pela
 * metade em cada borda. Com 3 ou mais, as pontas se encontram; com 2, o outro fica de um lado só.
 * Se o escolhido saiu da leitura, volta ao lido mais recentemente.
 */
export function carrosselDaMesa<T extends { id: string }>(
  livros: readonly T[],
  escolhido: string | null
): { atual: T | null; indice: number; total: number; anterior: T | null; proximo: T | null } {
  const total = livros.length;
  const achado = livros.findIndex((o) => o.id === escolhido);
  const indice = Math.max(achado, 0);
  const em = (i: number) => livros[(i + total) % total] ?? null;
  const daVolta = total >= 3;
  return {
    atual: livros[indice] ?? null,
    indice,
    total,
    anterior: total < 2 || (!daVolta && indice === 0) ? null : em(indice - 1),
    proximo: total < 2 || (!daVolta && indice === total - 1) ? null : em(indice + 1),
  };
}

export const textosDaPosicao = (indice: number, total: number) =>
  `Livro ${indice + 1} de ${total} em leitura`;

/** A capa que aparece pela metade na borda da mesa, e o atalho no menu do livro aberto. */
export function textosDoVizinho(
  obra: { titulo: string; progresso: number },
  lado: 'anterior' | 'proximo'
): { menu: string; rotulo: string } {
  const titulo = umaLinha(obra.titulo);
  const nome = lado === 'proximo' ? 'Próximo' : 'Anterior';
  return {
    menu: `${nome}: ${titulo}`,
    rotulo: `${nome} livro em leitura: ${titulo}, ${pct(obra.progresso)}% lido. Toque para pôr na mesa`,
  };
}

type Contagens = { lendo: number; em_pausa: number; quero_ler: number; total: number };

/**
 * A biblioteca, desenhada como três lombadas: o total de livros vai na etiqueta, e o leitor de
 * tela ouve as três contagens (RN-DV.3, RN-DV.4).
 */
export function textosDaBiblioteca(c: Contagens): Textos {
  if (c.total === 0) {
    return { etiqueta: 'Biblioteca · vazia', rotulo: 'Biblioteca, vazia' };
  }
  return {
    etiqueta: `Biblioteca · ${c.total} ${c.total === 1 ? 'livro' : 'livros'}`,
    rotulo: `Biblioteca: ${c.lendo} lendo, ${c.em_pausa} em pausa, ${c.quero_ler} quero ler`,
  };
}

/** A bandeja de entrada. Na mesa vazia ela é o convite (Q13). */
export function textosDaBandeja(mesaVazia: boolean): Textos {
  return mesaVazia
    ? {
        etiqueta: 'Ponha um livro na mesa',
        rotulo: 'Ponha um livro na mesa: importar EPUB, PDF ou um livro do acervo',
      }
    : {
        etiqueta: 'Importar',
        rotulo: 'Importar: adicionar EPUB, PDF ou um livro do acervo',
      };
}

/**
 * A composição da mesa (v2): o mockup desenha a mesa numa prancha de 390 × 836, e ela é escalada
 * para caber entre a barra de status e a de gestos, centrada na sobra.
 */
export const COMPOSICAO = { largura: 390, altura: 836 } as const;

export function encaixarComposicao(
  tela: { largura: number; altura: number },
  seguro: { topo: number; baixo: number }
): { escala: number; x: number; y: number } {
  const util = tela.altura - seguro.topo - seguro.baixo;
  const escala = Math.min(tela.largura / COMPOSICAO.largura, util / COMPOSICAO.altura);
  return {
    escala,
    x: (tela.largura - COMPOSICAO.largura * escala) / 2,
    y: seguro.topo + (util - COMPOSICAO.altura * escala) / 2,
  };
}

/** Texto grande (v2): acima de 150% de fonte, a mesa vira uma lista ordenada. */
export const FONTE_DA_MESA_EM_LISTA = 1.5;
export const mesaEmLista = (escalaDaFonte: number) => escalaDaFonte >= FONTE_DA_MESA_EM_LISTA;
