// Carrega os dados que o leitor precisa para abrir uma obra: caminho do arquivo local e o índice
// de caracteres montado na importação (RN-ST.8 — nunca remontado aqui).
import { obra as tabelaObra } from '@bookworm/db';
import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { abrirBanco } from '../persistencia/db.js';

export type ObraParaLeitura = {
  id: string;
  titulo: string;
  caminhoArquivo: string;
  indiceCaracteres: unknown;
};

export function useCarregarObra(obraId: string | undefined) {
  const [obra, setObra] = useState<ObraParaLeitura | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!obraId) {
      setCarregando(false);
      return;
    }
    let cancelado = false;
    setCarregando(true);
    void (async () => {
      const db = abrirBanco();
      const [linha] = await db
        .select({
          id: tabelaObra.id,
          titulo: tabelaObra.titulo,
          caminhoArquivo: tabelaObra.caminhoArquivo,
          indiceCaracteres: tabelaObra.indiceCaracteres,
        })
        .from(tabelaObra)
        .where(eq(tabelaObra.id, obraId))
        .limit(1);
      if (cancelado) return;
      setObra(linha ?? null);
      setCarregando(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [obraId]);

  return { obra, carregando };
}
