// J-11 — vento como leve balanço periódico. Atualiza um número simples via `setInterval`, não
// Reanimated/worklets: a cena tem poucas formas e não precisa de 60fps para parecer viva, e isso
// evita depender da integração Skia+Reanimated (versão nova de ambos, nunca exercitada neste
// projeto) logo na primeira cena real.
import { useEffect, useState } from 'react';

const INTERVALO_MS = 90;

/** Devolve um valor senoidal em [-1, 1] que completa um ciclo a cada `periodoMs`. */
export function useOscilacaoSuave(periodoMs: number): number {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const inicio = Date.now();
    const id = setInterval(() => {
      const t = ((Date.now() - inicio) % periodoMs) / periodoMs;
      setValor(Math.sin(t * Math.PI * 2));
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [periodoMs]);

  return valor;
}
