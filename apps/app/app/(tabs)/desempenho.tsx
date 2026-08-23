// Desempenho — sessões, métricas, Ghost Reader, fechamento semanal (design-system.md §10).
// Estado vazio.
import { BwFolha, BwVazio } from '../../src/componentes/index.js';

export default function TelaDesempenho() {
  return (
    <BwFolha anuncio="Desempenho">
      <BwVazio
        titulo="Ainda sem sessões de leitura"
        explicacao="Suas métricas de tempo ativo, ritmo e Leitura Consciente aparecem aqui depois da primeira sessão."
      />
    </BwFolha>
  );
}
