// Estágio 5 — configuração única do Unistyles 3 (stack.md §3: "Unistyles mapeia as três camadas
// de token literalmente"). Um único tema `bookworm`, sem troca de claro/escuro do sistema — a
// identidade de Papel não segue o tema do SO. Import por efeito colateral, uma vez, no layout
// raiz (`app/_layout.tsx`), antes de qualquer `StyleSheet.create`.
//
// `theme.sup` é o namespace que RN-ST.3 descreve: "o componente recebe uma prop `superficie` e
// só enxerga `theme.sup.*`". Nenhum componente importa `pigmento` de `@bookworm/design`
// diretamente — só esta configuração lê a camada 1, para montar a camada 2 (RN-DS.1).
import { espacamento, papelSemantico, pigmento, superficie } from '@bookworm/design';
import { StyleSheet } from 'react-native-unistyles';

const bookworm = {
  sup: superficie,
  esp: espacamento,
  // Camada 3 — design-system.md §2.3. `theme.semantico[superficie].acaoPrimaria` em vez de
  // `theme.sup[superficie].acento` sempre que o significado é "ação primária", não "acento cru".
  semantico: papelSemantico,
  // Os 4 pigmentos de grifo são ferramenta da leitora, não da marca (direcao-visual.md §2): não
  // rebindam por superfície como `sup.*`, mas ainda passam pelo tema — nunca por import direto de
  // `pigmento` num componente (RN-DS.1) — para que o grep de "nenhum componente lê pigmento
  // direto" continue verdadeiro sem precisar de exceção especial.
  grifo: {
    ambar: pigmento.pigAmbar,
    oliva: pigmento.pigOliva,
    tinta: pigmento.pigTinta,
    carmim: pigmento.pigCarmim,
  },
};

const themes = { bookworm };
const breakpoints = { xs: 0 };

type AppThemes = typeof themes;
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes,
  breakpoints,
  settings: { initialTheme: 'bookworm' },
});
