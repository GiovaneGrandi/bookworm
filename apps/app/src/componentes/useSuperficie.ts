// RN-DS.2/RN-ST.3 — todo componente declara a superfície em que vive via prop, e só enxerga
// `theme.sup.*` — nunca um pigmento. Este hook é o único ponto de leitura de `theme.sup` do
// inventário, para que a regra vire um lugar só de manter, não uma convenção repetida.
import type { NomeSuperficie, Superficie } from '@bookworm/design';
import { useUnistyles } from 'react-native-unistyles';

export type ComSuperficie = { superficie?: NomeSuperficie };

export function useSuperficie(nome: NomeSuperficie = 'papel'): Superficie {
  const { theme } = useUnistyles();
  return theme.sup[nome];
}
