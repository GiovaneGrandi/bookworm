// Unistyles 3 processa os estilos em build time (RN-DS.2/RN-ST.3 viram erro de tipo, não runtime
// check) — precisa do plugin próprio. `react-native-reanimated/plugin` precisa ser o último da
// lista (regra do próprio pacote).
module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // `root: 'src'` é onde vive a maioria dos componentes; `app/` (rotas do Expo Router)
      // também usa `useSuperficie`/`useUnistyles`, então entra via `autoProcessPaths`.
      ['react-native-unistyles/plugin', { root: 'src', autoProcessPaths: ['app'] }],
      'react-native-reanimated/plugin',
    ],
  };
};
