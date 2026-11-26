// Estados de uma obra e as transições da gaveta (RN-02.6, RN-02.6a, RN-DV.4).

/** RN-02.6. `concluido` e `abandonado` existem no domínio; a E2 só os exclui da gaveta. */
export type EstadoObra = 'quero_ler' | 'lendo' | 'em_pausa' | 'concluido' | 'abandonado';

export type ObraNaBiblioteca = {
  id: string;
  estado: EstadoObra;
  /** Última vez que foi aberta no leitor (ms desde a época), ou null se nunca. */
  abertoEm: number | null;
  importadoEm: number;
};

export type EstadoDaGaveta = 'lendo' | 'em_pausa' | 'quero_ler';
export const ORDEM_DA_GAVETA: readonly EstadoDaGaveta[] = ['lendo', 'em_pausa', 'quero_ler'];

export type AcaoDaGaveta = 'pausar' | 'tirar';

/** Abrir no leitor põe a obra em "lendo" (RN-02.6, Q14) e a pousa na mesa (RN-DV.4). */
export function abrirParaLer<T extends ObraNaBiblioteca>(obra: T, agora: number): T {
  return { ...obra, estado: 'lendo', abertoEm: agora };
}

/** Pausa é manual e só faz sentido para quem está lendo (RN-02.6, Q15). */
export function porEmPausa<T extends ObraNaBiblioteca>(obra: T): T {
  if (obra.estado !== 'lendo') {
    throw new Error(`Só se pausa uma obra em leitura (estado atual: ${obra.estado}).`);
  }
  return { ...obra, estado: 'em_pausa' };
}

/** O que aparece ao segurar o dedo sobre a obra na gaveta (Q15). */
export function acoesDaGaveta(estado: EstadoObra): AcaoDaGaveta[] {
  return estado === 'lendo' ? ['pausar', 'tirar'] : ['tirar'];
}

const maisRecente = (o: ObraNaBiblioteca) => o.abertoEm ?? o.importadoEm;

/** A gaveta mostra o que ainda vai ser lido, em três grupos (RN-02.6a). */
export function agruparGaveta<T extends ObraNaBiblioteca>(
  obras: readonly T[]
): { estado: EstadoDaGaveta; obras: T[] }[] {
  return ORDEM_DA_GAVETA.map((estado) => ({
    estado,
    obras: obras.filter((o) => o.estado === estado).sort((a, b) => maisRecente(b) - maisRecente(a)),
  }));
}

/**
 * O que está na mesa (RN-DV.4) e o que a gaveta conta. `livros` são todos os "lendo", do aberto
 * mais recentemente ao mais antigo: um fica aberto e os outros se alcançam deslizando o livro.
 */
export function objetosNaMesa<T extends ObraNaBiblioteca>(obras: readonly T[]) {
  const [lendo, emPausa, queroLer] = agruparGaveta(obras).map((g) => g.obras);
  const livros = lendo ?? [];
  return {
    livros,
    vazia: livros.length === 0,
    gaveta: {
      lendo: lendo?.length ?? 0,
      em_pausa: emPausa?.length ?? 0,
      quero_ler: queroLer?.length ?? 0,
      total: (lendo?.length ?? 0) + (emPausa?.length ?? 0) + (queroLer?.length ?? 0),
    },
  };
}
