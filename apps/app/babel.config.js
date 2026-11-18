// O plugin do Unistyles 3 reescreve os StyleSheet em tempo de build. O plugin dos worklets
// (Reanimated 4) é adicionado sozinho pelo babel-preset-expo quando o pacote está instalado.
module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [['react-native-unistyles/plugin', { root: 'src', autoProcessPaths: ['app'] }]],
  };
};
