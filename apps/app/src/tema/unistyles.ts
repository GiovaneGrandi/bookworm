import { StyleSheet } from 'react-native-unistyles';
import { esp } from './espacamento';
import { luz } from './luz';
import { pigmento } from './pigmentos';
import { semantico } from './semantico';
import { superficies } from './superficies';

// Pigmento → superfície → papel semântico (design-system.md §2, RN-ST.3). O tema expõe só as
// superfícies, os papéis e os 4 pigmentos de grifo (que são da leitora e não rebindam).
const papel = {
  sup: superficies,
  semantico,
  grifo: {
    ambar: pigmento.pigAmbar,
    oliva: pigmento.pigOliva,
    tinta: pigmento.pigTinta,
    carmim: pigmento.pigCarmim,
  },
  esp,
  luz,
} as const;

type Temas = { papel: typeof papel };

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends Temas {}
}

StyleSheet.configure({
  themes: { papel },
  settings: { initialTheme: 'papel' },
});
