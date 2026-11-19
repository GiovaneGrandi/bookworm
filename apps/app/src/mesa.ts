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

/** O segundo livro em leitura, fechado sobre a mesa (RN-DV.4). */
export function textosDoSegundoLivro(obra: { titulo: string; progresso: number }): Textos {
  return {
    etiqueta: `lendo · ${pct(obra.progresso)}%`,
    rotulo: `Lendo ${umaLinha(obra.titulo)}, ${pct(obra.progresso)}% lido. Continuar lendo`,
  };
}

type Contagens = { lendo: number; em_pausa: number; quero_ler: number; total: number };

/** A gaveta do fichário: as abas mostram as três contagens da biblioteca (RN-DV.4, §9.4). */
export function textosDaGaveta(c: Contagens): Textos & { abas: { rotulo: string; n: number }[] } {
  if (c.total === 0) {
    return { etiqueta: 'Gaveta · vazia', rotulo: 'Gaveta do fichário, vazia', abas: [] };
  }
  const abas = [
    { rotulo: 'LENDO', n: c.lendo },
    { rotulo: 'PAUSA', n: c.em_pausa },
    { rotulo: 'QUERO', n: c.quero_ler },
  ].filter((a) => a.n > 0);
  return {
    etiqueta: 'Gaveta',
    rotulo: `Gaveta do fichário: ${c.lendo} lendo, ${c.em_pausa} em pausa, ${c.quero_ler} quero ler`,
    abas,
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
