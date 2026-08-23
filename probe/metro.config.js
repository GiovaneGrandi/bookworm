// Registra .epub e .pdf como asset extensions do Metro para que os fixtures de
// assets/livros/ (Estágio 1, Tela B) possam ser carregados via require() + expo-asset.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('epub', 'pdf');

module.exports = config;
