// Monorepo pnpm: garante que o Metro observe a raiz do workspace (para `@bookworm/core` e
// `@bookworm/design`, resolvidos via symlink de `node-linker=hoisted`) e resolva `node_modules`
// tanto daqui quanto da raiz.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Todo import interno deste monorepo usa extensão `.js` sobre fonte `.ts`/`.tsx` (convenção
// TypeScript `moduleResolution: bundler`/NodeNext, a mesma que `packages/core` e
// `packages/design` já usam com Vitest). O `tsc` entende isso nativamente; o Metro não — ele
// trata uma extensão explícita como definitiva e nunca tenta `.ts`/`.tsx` no lugar dela. Sem
// este resolver, todo `import '../x.js'` que aponta para um `x.ts` real falha com
// `UnableToResolveError`.
const resolveRequestPadrao = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('.') && moduleName.endsWith('.js')) {
    try {
      return context.resolveRequest(context, moduleName.replace(/\.js$/, ''), platform);
    } catch {
      // cai para o comportamento padrão abaixo (ex.: o `.js` é mesmo um arquivo `.js` de verdade)
    }
  }
  return resolveRequestPadrao
    ? resolveRequestPadrao(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
