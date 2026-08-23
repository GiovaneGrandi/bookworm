// Estágio 7 — três dos quatro ajustes nativos que `react-native-readium` exige neste projeto
// (specs/medicao-app-de-prova.md §0, .claude/retomada.md achado do Estágio 2), expressos como
// config plugin porque `android/` é gerado por `expo prebuild`/`expo run:android` e não é
// versionado (.gitignore) — uma edição direta no diretório gerado se perderia no próximo
// prebuild. O quarto ajuste (abiFilters restrito a x86_64, dentro de `node_modules/react-native-
// readium`) vive em `patches/react-native-readium.patch` via `pnpm.patchedDependencies`, não
// aqui, porque fica fora da árvore que este plugin alcança.
const {
  withAppBuildGradle,
  withDangerousMod,
  withProjectBuildGradle,
} = require('@expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');

const MARCADOR_KOTLIN = 'BookWorm: flags de compatibilidade do Kotlin para react-native-readium';
const BLOCO_KOTLIN = `
  // ${MARCADOR_KOTLIN} (specs/medicao-app-de-prova.md §0.2) — o pacote foi compilado contra uma
  // versão de Kotlin mais antiga que a que este projeto resolve; sem estas duas flags, tanto o
  // próprio módulo quanto :app falham ("Incompatible classes were found in dependencies" e depois
  // "This declaration needs opt-in").
  tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions {
      freeCompilerArgs += ["-Xskip-metadata-version-check", "-opt-in=kotlin.time.ExperimentalTime"]
    }
  }
`;

function withReadiumKotlinCompilerFlags(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    if (config.modResults.contents.includes(MARCADOR_KOTLIN)) return config;

    config.modResults.contents = config.modResults.contents.replace(
      /allprojects\s*\{/,
      (linhaAbertura) => `${linhaAbertura}\n${BLOCO_KOTLIN}`
    );
    return config;
  });
}

const MARCADOR_DESUGAR = 'BookWorm: desugaring para react-native-readium';

function withReadiumDesugaring(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    if (config.modResults.contents.includes(MARCADOR_DESUGAR)) return config;

    let conteudo = config.modResults.contents;

    // specs/medicao-app-de-prova.md §0.3 — o README do Readium pede desugar_jdk_libs 2.1.2, mas
    // o readium-kotlin-toolkit real embutido no 5.0.0 exige 2.1.5+; `checkDebugAarMetadata`
    // falha e nomeia a versão certa na mensagem de erro.
    if (/coreLibraryDesugaringEnabled\s+true/.test(conteudo)) {
      conteudo = conteudo.replace(
        /coreLibraryDesugaringEnabled\s+true/,
        `coreLibraryDesugaringEnabled true // ${MARCADOR_DESUGAR}`
      );
    } else if (/compileOptions\s*\{/.test(conteudo)) {
      conteudo = conteudo.replace(
        /compileOptions\s*\{/,
        (linhaAbertura) =>
          `${linhaAbertura}\n        coreLibraryDesugaringEnabled true // ${MARCADOR_DESUGAR}`
      );
    } else {
      // O template do SDK 57 não vem com `compileOptions` nenhum — cria o bloco do zero, logo
      // depois de `android {`.
      conteudo = conteudo.replace(
        /android\s*\{/,
        (linhaAbertura) =>
          `${linhaAbertura}\n    compileOptions {\n        coreLibraryDesugaringEnabled true // ${MARCADOR_DESUGAR}\n    }\n`
      );
    }

    if (/coreLibraryDesugaring\s+"com\.android\.tools:desugar_jdk_libs/.test(conteudo)) {
      conteudo = conteudo.replace(
        /coreLibraryDesugaring\s+"com\.android\.tools:desugar_jdk_libs:[^"]+"/,
        'coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.1.5"'
      );
    } else {
      conteudo = conteudo.replace(
        /dependencies\s*\{/,
        (linhaAbertura) =>
          `${linhaAbertura}\n    coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.1.5"`
      );
    }

    config.modResults.contents = conteudo;
    return config;
  });
}

const NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<!-- BookWorm (Estágio 7, specs/medicao-app-de-prova.md §0.5) — sobrepõe o
     network_security_config.xml que react-native-readium embute (liberado só para
     127.0.0.1/localhost) para também liberar 10.0.2.2, o Metro do emulador Android. Recursos do
     módulo :app têm prioridade de merge sobre os de uma library, então este arquivo resolve sem
     precisar de tools:replace no manifesto. Só entra na variante debug — a release mantém o
     padrão restrito do Readium. -->
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="false">127.0.0.1</domain>
        <domain includeSubdomains="false">localhost</domain>
        <domain includeSubdomains="false">10.0.2.2</domain>
    </domain-config>
</network-security-config>
`;

function withReadiumDebugNetworkSecurityConfig(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const destino = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'debug',
        'res',
        'xml',
        'network_security_config.xml'
      );
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.writeFileSync(destino, NETWORK_SECURITY_CONFIG);
      return config;
    },
  ]);
}

module.exports = function withReadiumAndroidBuildFixes(config) {
  config = withReadiumKotlinCompilerFlags(config);
  config = withReadiumDesugaring(config);
  config = withReadiumDebugNetworkSecurityConfig(config);
  return config;
};
