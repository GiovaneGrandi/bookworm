// Unistyles 3 roda sobre Nitro Modules (nativo) — sem binário nativo disponível em Jest, o mock
// oficial do próprio pacote substitui `react-native-unistyles` e `react-native-nitro-modules` por
// uma implementação em JS puro. Precisa carregar antes de qualquer import de `src/tema/unistyles`.
require('react-native-unistyles/mocks');

// `BwFolha` lê `useSafeAreaInsets` (Estágio 7 passo 3) — sem `<SafeAreaProvider>` real em Jest,
// usa o mock oficial do próprio pacote (insets zerados, suficiente para snapshot).
jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});
