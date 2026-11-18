// O Expo detecta o monorepo pnpm sozinho (watchFolders e node_modules da raiz).
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
