# BookWorm

Plataforma gamificada de leitura e escrita — "fitness para a mente": métricas, metas, constância e conquistas compartilháveis, para leitores e para autores.

## Como rodar

O app é só **Android** por enquanto (Expo SDK 55, React Native 0.83). Roda num dev build local, nunca no Expo Go, porque Readium, Skia e SQLite são nativos. **iOS ainda não é suportado**: nunca foi compilado.

### O que instalar

| | Windows | macOS |
|---|---|---|
| **Node 22** | Instalador `.msi` de [nodejs.org](https://nodejs.org) (22 LTS) | `brew install node@22` e siga a instrução do `brew` para pôr no `PATH` |
| **pnpm 10.34.5** | `corepack enable` (num terminal como administrador) | `corepack enable` |
| **JDK 17** | [Microsoft OpenJDK 17](https://learn.microsoft.com/java/openjdk/download) ou Temurin 17; defina `JAVA_HOME` | `brew install --cask zulu@17` e `export JAVA_HOME=$(/usr/libexec/java_home -v 17)` no `~/.zshrc` |
| **Android Studio** | [developer.android.com/studio](https://developer.android.com/studio) | Idem (versão Apple Silicon ou Intel) |
| **Git** | [git-scm.com](https://git-scm.com), depois `git config --global core.longpaths true` | Já vem com as ferramentas do Xcode (`xcode-select --install`) |

No Android Studio, em **SDK Manager**, instale o **Android SDK Platform 34** e o **Android SDK Platform-Tools**. Depois defina a variável do SDK:

- **Windows:** `ANDROID_HOME = %LOCALAPPDATA%\Android\Sdk` (Configurações → Sistema → Variáveis de ambiente).
- **macOS:** no `~/.zshrc`, `export ANDROID_HOME=$HOME/Library/Android/sdk` e `export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH`.

### O emulador

No Android Studio, em **Device Manager → Create Virtual Device**: um Pixel qualquer, imagem **API 34** (Google APIs; no Mac com Apple Silicon, a imagem **arm64-v8a**). Dê a ele o nome exato **`BookWorm_API34`**: é por esse nome que o script abaixo o liga.

### Primeira vez

```sh
git clone https://github.com/GiovaneGrandi/bookworm.git
cd bookworm
pnpm install
```

O `pnpm install` baixa os binários do Skia (cerca de 700 MB depois de descompactados) e aplica o patch do Readium em `patches/`.

Depois, com o emulador fechado ou aberto:

- **Windows:** `testar-no-emulador.bat build`
- **macOS:** `./testar-no-emulador.sh build`

O `build` compila e instala o app (a primeira vez leva de 5 a 15 minutos). O script liga o emulador, espera o Android, sobe o Metro e abre o app.

### No dia a dia

- **Windows:** `testar-no-emulador.bat` · **macOS:** `./testar-no-emulador.sh`
- Sem `build`, ele só abre o app já instalado e carrega o código pelo Metro. Na janela do Metro, `r` recarrega depois de mudar o código.
- Use `build` de novo depois de mudar código nativo: um plugin em `apps/app/plugins/`, o `app.json`, um patch ou uma dependência nativa.

### Testes e qualidade

```sh
pnpm lint        # Biome
pnpm typecheck   # TypeScript, no core e no app
pnpm test        # Vitest, no core e no app
```

São os mesmos três checks que o CI exige em todo PR.

### Problemas conhecidos (Windows)

- **`pnpm install` falha com `ENOENT`:** pare o Metro e o daemon do Gradle (`cd apps/app/android && gradlew --stop`) e rode de novo.
- **`:app:packageDebug` falha sem causa:** apague `apps/app/android/app/build/intermediates/incremental/packageDebug` e rode o `build` de novo.

## Como contribuir

A `main` é protegida e ninguém faz push direto nela, nem o dono do repositório.

1. Crie uma branch a partir da `main` atualizada: `git switch main && git pull && git switch -c minha-mudanca`.
2. Faça os commits e suba a branch: `git push -u origin minha-mudanca`.
3. Abra o PR (`gh pr create` ou pelo site).
4. O CI roda `lint`, `typecheck` e `test`. Os três precisam passar.
5. A outra pessoa revisa e aprova. Cada push novo derruba a aprovação anterior, e todas as conversas da revisão precisam estar resolvidas.
6. Com a branch atualizada com a `main`, o merge é por **squash**, e a branch é apagada sozinha.

O Claude Code deste repositório segue as mesmas regras (`CLAUDE.md`, "Fluxo de trabalho a dois"). As skills do projeto ficam em `.claude/skills/`. Regras pessoais vão num `CLAUDE.local.md`, que fica fora do git.

## Documentação

| Documento | O que é |
|---|---|
| [`BookWorm.md`](BookWorm.md) | Rascunho original do projeto (pitch). Documento-fonte histórico, mantido intocado. |
| [`specs/00-overview.md`](specs/00-overview.md) | **Ponto de entrada das especificações.** Visão, princípios, personas, mapa dos módulos e tabela de rastreabilidade rascunho → spec. |
| [`specs/mvp.md`](specs/mvp.md) | **Corte de escopo da primeira versão.** O que entra no MVP, o que espera e em que fase, com as adaptações declaradas. Ponto de partida para construir. |
| [`specs/stack.md`](specs/stack.md) | **Decisão de stack vinculante.** Cliente (Expo, Unistyles, Skia, `react-native-readium`), servidor (Fastify, Postgres, Fly.io), `packages/core` compartilhado, sincronização offline e o que foi recusado. |
| [`specs/telemetria-e-instrumentacao.md`](specs/telemetria-e-instrumentacao.md) | **Instrumentação vinculante.** A camada operacional de `03`: como cada métrica é medida na prática (máquina de estados da sessão, três relógios, taxonomia de pausa, catálogo de eventos, trilho de domínio × trilho de produto) e o veredito sobre cada métrica candidata — adotar, medir em silêncio ou recusar. |
| [`specs/stack-plano.md`](specs/stack-plano.md) | Plano que originou `specs/stack.md`: pesquisa feita e estrutura do documento a escrever. Histórico do processo, não vinculante. |
| [`specs/direcao-visual.md`](specs/direcao-visual.md) | **Identidade visual vinculante.** O pilar de design (estética "Papel"), tokens canônicos, assinatura mecânica, backlog de ajustes e questões em aberto. |
| [`specs/design-system.md`](specs/design-system.md) | **Design system vinculante.** Camada operacional da direção visual: três camadas de token, escala de espaçamento, doze primitivas da assinatura, inventário de componentes do MVP, contrato de estados, acessibilidade, movimento, navegação global e a tradução para React Native. |
| [`specs/`](specs/) | Especificações funcionais por módulo, mais modelo de dados e glossário. |
| [`mockups/`](mockups/) | Protótipos visuais estáticos. `design-system.html` é o catálogo e a referência normativa; `ideacao/direcao-b-escrivaninha.html` é a referência da direção de interface adotada; as demais peças são evidência histórica ou direções descartadas. |
| [`analise-game-design/00-diagnostico.md`](analise-game-design/00-diagnostico.md) | Análise crítica das specs sob a ótica de design de jogo: o que segura um usuário, onde a experiência quebra e o que propor. Termina em uma folha de decisão. |
| [`analise-monetizacao/00-diagnostico.md`](analise-monetizacao/00-diagnostico.md) | Análise crítica do modelo de receita, com unit economics: a moeda virtual, as oportunidades por lado, precificação e o que corrigir. Termina em uma folha de decisão. |

## Estado do projeto

As primeiras telas estão construídas e rodam no emulador Android: a mesa (*A Escrivaninha*), a bandeja de entrada para importar EPUB e PDF, a gaveta da biblioteca e o leitor com o painel de 10 controles. O plano está em [`planos/2026-11-17-primeiras-telas.md`](planos/2026-11-17-primeiras-telas.md).

Um primeiro protótipo (Estágios 0–8 de [`planos/2026-08-23-primeiro-prototipo-mvp.md`](planos/2026-08-23-primeiro-prototipo-mvp.md)) chegou a ser construído e foi **descartado em 17/11/2026** para recomeçar a partir destas specs. O código dele fica só no histórico do git (último commit: `1b903e5`).

A **direção visual está decidida**: a estética "Papel" é o pilar de design do produto, com identidade em verde. Ver [`specs/direcao-visual.md`](specs/direcao-visual.md).

A **direção de interface está decidida**: *A Escrivaninha*. A tela inicial é a mesa vista de cima, e cada função é um objeto pousado nela (o livro aberto, o vaso do jardim, a gaveta, a pilha de lidos, a bandeja de entrada), sem barra de abas. Foi escolhida em 17/11/2026 entre três direções prototipadas em paralelo. Ver [`specs/direcao-visual.md`](specs/direcao-visual.md) §9 e [`mockups/ideacao/`](mockups/ideacao/).

O **design system está escrito** e traduz essa direção em tokens, componentes e estados que uma tela nova consome sem reabrir decisão. Ver [`specs/design-system.md`](specs/design-system.md) e o catálogo em [`mockups/design-system.html`](mockups/design-system.html).

As specs cobrem as 29 funcionalidades descritas no rascunho e as funcionalidades derivadas que elas pressupõem. Elas já incorporam as decisões tomadas nas revisões de game design e de monetização (folhas em [`analise-game-design/04-decisoes.md`](analise-game-design/04-decisoes.md) e [`analise-monetizacao/04-recomendacao.md`](analise-monetizacao/04-recomendacao.md)).

O escopo da primeira versão está decidido em [`specs/mvp.md`](specs/mvp.md): **o loop de hábito do lado leitor, isolado.** Um leitor de EPUB e PDF que transforma leitura em hábito medido — sem loja, sem moeda, sem feed, sem autores, sem IA.

### O que bloqueia o quê

O corte do MVP separa os bloqueios em dois grupos.

**Bloqueiam o MVP** — quatro, nenhuma regulatória ou financeira:

| ID | Questão |
|---|---|
| `Q-03.1` | A página canônica de 1.500 caracteres é aceitável? Toda métrica depende dela |
| `Q-01.1` | Jurisdição, LGPD/ECA e idade mínima |
| `Q-01.3` | Qual obra de domínio público abre o passo 1 do onboarding |
| `Q-02.4` | Qual dicionário embarcar |

Mais um item que é trabalho e não questão: **curar o acervo inicial de domínio público**.

**Bloqueiam o produto completo, não o MVP** — porque pertencem a camadas que a primeira versão não constrói: compliance da economia (`Q-07.1`), comissão das lojas (`Q-10.2`), responsabilidade fiscal do repasse (`Q-09.1`), consentimento de IA (`Q-11.1`), limites e preços de plano (`Q-10.1`, `Q-10.3`). O consolidado está em [`specs/00-overview.md`](specs/00-overview.md) §8; `Q-02.1` (catálogo) já foi resolvida pelo leitor aberto.

## Convenções

- Idioma: PT-BR.
- IDs de user story: `PREFIXO-NN` (`CON`, `LEI`, `SES`, `GAM`, `FEE`, `GHO`, `ECO`, `SOC`, `AUT`, `MON`, `IA`).
- IDs de regra de negócio: `RN-<módulo>.<n>`. IDs de questão em aberto: `Q-<módulo>.<n>`.
- Valores marcados `(a validar)` são propostas desta especificação, não do rascunho, e devem ser calibrados com dados.

## Direitos

Todos os direitos reservados. O código é público para leitura; não há licença de uso, cópia ou redistribuição. Os livros em `apps/app/assets/acervo/` são de domínio público, do Project Gutenberg.
