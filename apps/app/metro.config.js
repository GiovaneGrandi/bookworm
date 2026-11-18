// O Expo detecta o monorepo pnpm sozinho (watchFolders e node_modules da raiz).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// O acervo embutido (assets/acervo/*.epub) é lido como bytes via expo-asset.
config.resolver.assetExts.push('epub');

module.exports = config;
