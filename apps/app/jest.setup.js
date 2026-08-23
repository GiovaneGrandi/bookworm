// Unistyles 3 roda sobre Nitro Modules (nativo) — sem binário nativo disponível em Jest, o mock
// oficial do próprio pacote substitui `react-native-unistyles` e `react-native-nitro-modules` por
// uma implementação em JS puro. Precisa carregar antes de qualquer import de `src/tema/unistyles`.
require('react-native-unistyles/mocks');
