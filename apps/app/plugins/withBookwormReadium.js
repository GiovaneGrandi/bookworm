// Ajustes nativos que o react-native-readium exige, como config plugin: `android/` é gerado pelo
// `expo prebuild` e não é versionado, então uma edição direta se perderia.
//
// 1-3. Configuração herdada do protótipo descartado (`git show 1b903e5:apps/app/plugins/…`),
//      reaproveitada só como configuração de build (decisão Q11 do plano das primeiras telas):
//      flags do Kotlin, desugaring da JDK e o network_security_config de debug.
// 4.   As 5 faces do painel de leitura (RN-02.16g) copiadas para `assets/fonts`, de onde o
//      navegador EPUB do Readium as serve à WebView (ver o patch em `patches/`).
const {
  withAppBuildGradle,
  withDangerousMod,
  withProjectBuildGradle,
} = require('@expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');

const MARCADOR_KOTLIN = 'BookWorm: flags do Kotlin para react-native-readium';
const BLOCO_KOTLIN = `
  // ${MARCADOR_KOTLIN}: o pacote foi compilado com outra versão de Kotlin; sem estas flags o
  // módulo e o :app falham ("Incompatible classes were found in dependencies" e "needs opt-in").
  tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions {
      freeCompilerArgs += ["-Xskip-metadata-version-check", "-opt-in=kotlin.time.ExperimentalTime"]
    }
  }
`;

function comFlagsDoKotlin(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    if (config.modResults.contents.includes(MARCADOR_KOTLIN)) return config;
    config.modResults.contents = config.modResults.contents.replace(
      /allprojects\s*\{/,
      (abertura) => `${abertura}\n${BLOCO_KOTLIN}`
    );
    return config;
  });
}

const MARCADOR_DESUGAR = 'BookWorm: desugaring para react-native-readium';

function comDesugaring(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    if (config.modResults.contents.includes(MARCADOR_DESUGAR)) return config;
    let conteudo = config.modResults.contents;

    if (/compileOptions\s*\{/.test(conteudo)) {
      conteudo = conteudo.replace(
        /compileOptions\s*\{/,
        (abertura) =>
          `${abertura}\n        coreLibraryDesugaringEnabled true // ${MARCADOR_DESUGAR}`
      );
    } else {
      conteudo = conteudo.replace(
        /android\s*\{/,
        (abertura) =>
          `${abertura}\n    compileOptions {\n        coreLibraryDesugaringEnabled true // ${MARCADOR_DESUGAR}\n    }\n`
      );
    }
    // O readium-kotlin-toolkit 3.x exige desugar_jdk_libs 2.1.5 ou mais.
    conteudo = conteudo.replace(
      /dependencies\s*\{/,
      (abertura) =>
        `${abertura}\n    coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.1.5"`
    );
    config.modResults.contents = conteudo;
    return config;
  });
}

// O Readium embute um network_security_config que só libera 127.0.0.1/localhost. Em debug, o
// Metro também pode vir de 10.0.2.2 (emulador). A variante release mantém o padrão do Readium.
const SEGURANCA_DE_REDE = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="false">127.0.0.1</domain>
        <domain includeSubdomains="false">localhost</domain>
        <domain includeSubdomains="false">10.0.2.2</domain>
    </domain-config>
</network-security-config>
`;

// As 5 faces de RN-02.16g, nos pesos que o texto de uma obra usa (regular, itálico, negrito e
// negrito itálico). Os nomes precisam bater com a declaração no patch do EpubReaderFragment.
const FACES = [
  ['spectral', 'Spectral'],
  ['eb-garamond', 'EBGaramond'],
  ['public-sans', 'PublicSans'],
  ['atkinson-hyperlegible', 'AtkinsonHyperlegible'],
  ['courier-prime', 'CourierPrime'],
];
const PESOS = ['400Regular', '400Regular_Italic', '700Bold', '700Bold_Italic'];

function comArquivosDeRede(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const raiz = config.modRequest.platformProjectRoot;
      const xml = path.join(
        raiz,
        'app',
        'src',
        'debug',
        'res',
        'xml',
        'network_security_config.xml'
      );
      fs.mkdirSync(path.dirname(xml), { recursive: true });
      fs.writeFileSync(xml, SEGURANCA_DE_REDE);

      const destino = path.join(raiz, 'app', 'src', 'main', 'assets', 'fonts');
      fs.mkdirSync(destino, { recursive: true });
      for (const [pacote, prefixo] of FACES) {
        const base = path.dirname(require.resolve(`@expo-google-fonts/${pacote}/package.json`));
        for (const peso of PESOS) {
          const arquivo = `${prefixo}_${peso}.ttf`;
          fs.copyFileSync(path.join(base, peso, arquivo), path.join(destino, arquivo));
        }
      }
      return config;
    },
  ]);
}

module.exports = function withBookwormReadium(config) {
  config = comFlagsDoKotlin(config);
  config = comDesugaring(config);
  config = comArquivosDeRede(config);
  return config;
};
