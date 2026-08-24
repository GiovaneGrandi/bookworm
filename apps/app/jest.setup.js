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

// `CenaDoJardim` (Estágio 8) é a primeira tela a usar Skia — o mock oficial do pacote precisa de
// `global.CanvasKit` (wasm real) para funcionar de verdade, pesado demais só para um snapshot RN.
// Este mock é local e mínimo: cada componente Skia vira um passthrough que renderiza `children`
// (o suficiente para o teste de `bw-dormencia` não crashar), e `Skia.Path.Make()` devolve um stub
// com os métodos que `CenaDoJardim`/`elementosDiarios` chamam.
jest.mock('@shopify/react-native-skia', () => {
  const React = require('react');
  const Passthrough = ({ children }) => React.createElement(React.Fragment, null, children);
  const caminhoStub = () => ({
    moveTo: () => caminhoStub(),
    lineTo: () => caminhoStub(),
    quadTo: () => caminhoStub(),
    cubicTo: () => caminhoStub(),
    close: () => caminhoStub(),
    addCircle: () => caminhoStub(),
    addOval: () => caminhoStub(),
  });
  return new Proxy(
    { Skia: { Path: { Make: caminhoStub } }, vec: (x, y) => ({ x, y }) },
    { get: (alvo, propriedade) => (propriedade in alvo ? alvo[propriedade] : Passthrough) }
  );
});
