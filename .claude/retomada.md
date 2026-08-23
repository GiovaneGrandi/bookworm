# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 23/08/2026

---

## Operação em curso — Plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`)

**Estágios 0–7-fundação, Estágio 7 passo 2, Estágio 8-fundação e Estágio 7 passo 3 commitados**
(`git log`: até `9e93a2c`). Usuário pediu, em sequência: voltar ao que faltava do Estágio 7 antes
de fechar o 8 → "Estante primeiro, sozinha" (passo 3, commitado) → "Pode seguir com o passo 5".

**Estágio 7 passo 5 (painel de leitura, 9 dos 10 controles de `RN-02.16d`) implementado, testes e
lint/typecheck limpos, validado parcialmente ao vivo — ver limitação de teste abaixo. Ainda não
commitado.** Escopo decidido com o usuário via `AskUserQuestion` **antes** de começar: `RN-02.13a`
(nível da âncora de posição) ficou de fora desta rodada — o indicador nativo do
react-native-readium (`PositionLabelManager.kt`, sempre ligado, sem prop pra desligar/trocar)
exigiria patch na lib Android, à parte dos outros nove controles. Faltam do Estágio 7: esse
controle (se algum dia for feito), passo 6 (destaques/anotações/dicionário), passo 7 (resposta a
gesto — `R-2` avisa que isso **é** o produto, não pode ser apressado).

### O que foi construído (passo 5 — painel de leitura)

- **`packages/db/src/schema/leitor.ts`** (nova tabela `preferencia_leitura`, linha única por
  usuário — RN-02.16: "por conta, não por obra") + `packages/db/src/ddl.ts` regerado
  (`drizzle-kit generate`, migração `0001_tough_zaran.sql`) + `packages/db/test/schema.test.ts`
  atualizado com a tabela nova na lista esperada.
- **`packages/core/src/leitor/preferencias.ts`** (novo, testado) — `CATALOGO_FACES` (as 5 faces
  de `RN-02.16g`), `PREFERENCIAS_LEITURA_PADRAO`, e `paraPreferenciasDeNavegador` — o mapeador
  puro entre nosso domínio e o formato que o Readium Navigator espera. **Achado que limita o
  resultado real**: corpo/entrelinha/margem no Readium são **escalas unitárias** (1.0 = padrão
  dele), não px — por isso o schema guarda `corpoEscala` etc., não `corpoPx` como a primeira
  versão tentou. E mais sério: o WebView do Readium **não tem as 5 faces reais embarcadas**
  (exigiria registrar `@font-face` nativo apontando pros `.ttf` do Expo Google Fonts, que hoje só
  existem para o lado RN, não para dentro do WebView) — cada face cai na família genérica mais
  próxima (serif/sans-serif/monospace), documentado no código. A escolha na UI existe e persiste;
  a renderização das 5 faces distintas fica pendente de um patch nativo futuro.
- **Três primitivas novas do design system**: `BwSeletorDeOpcoes` (chips de opção única — fonte,
  alinhamento, tema), `BwControleContinuo` (slider — corpo, entrelinha, margem, temperatura,
  brilho; `PanResponder`, sem lib externa), `BwInterruptor` (toggle — retorno sensorial,
  `RN-02.17f`). Nenhum usa círculo (`RN-DS.8` — cursor/corrediça usam o raio irregular padrão, não
  `borderRadius: 9999`).
- **`apps/app/src/leitor/PainelDeLeitura.tsx`** — os 9 controles, mais "Restaurar tudo ao padrão"
  (`RN-02.16f`, em bloco; cada `BwControleContinuo` também tem restauração individual embutida,
  só aparece quando o valor diverge do padrão).
- **`apps/app/app/leitor.tsx`** — botão "Aa" novo na faixa superior (ao lado do "✕"), abre/fecha o
  painel. Preferências carregadas uma vez do banco, aplicadas ao vivo via
  `preferences={paraPreferenciasDeNavegador(prefs)}` do `ReadiumView` a cada mudança (`RN-02.16e`
  — nunca reinicia a leitura nem mexe em posição/sessão, confirmado pelo código: o handler só
  chama `setPrefs`). Brilho (`RN-02.16b`) é um véu preto `pointerEvents="none"` sobre o leitor,
  opacidade `1 - brilho` — nunca sobe acima do brilho do sistema, só escurece por cima.

### Limitação de validação — interação com o painel não confirmada via `adb`

O painel **abre e fecha** corretamente (confirmado ao vivo), renderiza os 9 controles com os
valores default certos, e o scroll do `ScrollView` funciona com gesto real de arraste. Mas
**nenhuma interação dentro do painel** — toque num chip, arrastar um slider — registrou via `adb`,
mesmo com coordenada corrigida pela densidade de tela (ver achado abaixo) e usando arraste real
(não só toque parado). Isso é consistente com o padrão já visto nesta sessão para telas atrás do
`ReadiumView`/`fullScreenModal` (toque não instantâneo funciona nos botões de nível superior tipo
"Aa"/"✕", mas nada dentro do `ScrollView` aninhado respondeu a nenhuma tentativa). **Não testado,
portanto**: se selecionar uma fonte/tema/alinhamento ou arrastar um slider de fato muda a
pré-visualização ao vivo no texto. A lógica (`setPrefs` chamado nos handlers, prop `preferences`
recalculada via `useMemo`) foi revisada e parece correta, e os componentes usam os mesmos padrões
(`Pressable`, `useState`) já provados em outras telas — mas isso é inferência de código, não
confirmação ao vivo. **Testar com toque real antes de considerar o passo 5 fechado.**

### Achado — coordenada de toque em `apps/app` também precisa do fator de densidade da tela (420dpi), não só da escala de exibição do chat

Achado novo, mais fundamental que o da rodada anterior (escala de exibição do chat, 900×2000 vs.
1080×2400 nativo — esse continua valendo à parte). Estilos RN (`width: 54`, `right: 54` etc.) são
**dp**, não pixel físico. Neste AVD (420dpi), 1dp ≈ 2.625px físicos (`420/160`). Uma screenshot
nativa tem 1080px de largura física, que equivalem a só ~411dp lógicos — então um botão com
`right: 54, width: 54` ocupa a faixa `[357dp, 411dp]`, que em pixels físicos da screenshot é
`[938px, 1080px]`, não `[1026px, 1080px]` (o que se obteria tratando os números do style como se
já fossem pixel físico). Confirmado batendo essa conta contra uma medição por crop/PIL do glifo
"Aa" de um botão com `right: 54`: a fórmula bateu exatamente. **Lição**: ao converter um valor de
`style` de `apps/app` para coordenada de toque numa screenshot deste AVD, multiplicar por
`420/160 = 2.625`, não usar o número do style direto nem só o fator de exibição do chat (que é
outra conversão, sobre a screenshot já física).

### Achado — `BwFolha` não tinha inset de área segura; ninguém tinha notado porque nada mais tocava o topo da tela

Nenhuma tela de `(tabs)/` usa `SafeAreaView`, e o `Tabs` do expo-router (`headerShown: false`)
não aplica inset de status bar sozinho. Isso ficou invisível até agora porque `BwImportar` (o
primeiro elemento da Biblioteca) tem padding próprio grande o bastante para nunca ter colidido
visivelmente com a status bar — mas o toggle Biblioteca/Estante, sendo o novo primeiro elemento,
renderizou por baixo dela. **Fix (não é gambiarra local, é infraestrutura compartilhada)**:
`<SafeAreaProvider>` acrescentado em `app/_layout.tsx` (envolvendo o `GestureHandlerRootView`
existente) e `BwFolha` passou a aplicar `paddingTop: useSafeAreaInsets().top` — conserta a classe
inteira de tela, não só a Biblioteca. Precisou de `jest.mock('react-native-safe-area-context', …)`
em `jest.setup.js` (o mock oficial do pacote só expõe `export default {...}`, não exports
nomeados — a factory do `jest.mock` precisa desembrulhar `.default` manualmente ou
`useSafeAreaInsets` some do módulo mockado com `TypeError: ... is not a function`). Snapshot de
`bw-folha` foi atualizado (`paddingTop: 0` a mais, insets zerados no mock).

### Achado (2) — toques via `adb` continuam não confiáveis em telas `fullScreenModal`, mesmo com coordenada certa

Confirmado de novo nesta sessão, agora também no botão "Continuar" de `resumo.tsx` (não só no
"Fechar" do leitor, achado de sessão anterior): coordenada calculada via PIL na screenshot nativa,
exatamente sobre o centro do alvo, e o toque simplesmente não registra — sem erro, tela
inalterada. **O que funciona de forma confiável nessas telas**: `adb shell input swipe X Y X Y
150` (toque parado, ~150ms de duração) no lugar de `input tap`. Em telas normais (Tabs, Stack sem
`fullScreenModal`) `input tap` funciona sem problema. Não investigado a fundo — suspeita é que o
`ReadiumView` ou a apresentação modal interceptam o toque instantâneo em algum nível nativo; não
vale o tempo de diagnosticar, já que toque real de usuário nunca teve esse problema (achado já
registrado para o rodapé de abas numa sessão anterior).

### Validado ao vivo no emulador — fluxo completo do passo 3

Leitura de `alice.epub` do início ao fim (83/83 páginas, ~130 swipes) → fechar → prompt "Você
concluiu esta obra?" apareceu exatamente no limiar → confirmado → resumo (sem celebração pendente
desta vez) → Biblioteca não lista mais "alice" → Estante lista "alice — concluída em 23 de ago.
de 2026" → reabrir pela Estante → fechar sem confirmar conclusão de novo (progresso zerado, abaixo
do limiar) → Biblioteca volta a listar "alice" **e** Estante continua listando — confirma
`RN-02.6a`/`RN-02.6b` de ponta a ponta.

### Achado — coordenada de toque via `adb shell input tap` não é a mesma escala da imagem "mostrada"

Uma captura salva por `adb exec-out screencap -p` já vem em pixels nativos do aparelho (aqui,
1080×2400) — usá-la em Python/PIL (crop, medir glifo) dá coordenadas prontas para `input tap`,
sem conversão. Mas a **mesma imagem, quando exibida de volta nesta conversa**, chega redimensionada
(aqui, 900×2000) com a nota "multiply by 1.20" — essa multiplicação só se aplica a coordenadas
lidas *visualmente* da versão exibida, nunca a coordenadas calculadas programaticamente a partir do
arquivo original. Misturar as duas escalas (o que aconteceu nesta sessão, por several tentativas)
faz o toque cair sistematicamente fora do alvo sem nenhum erro visível — a tela simplesmente não
muda. **Lição**: ao calcular coordenada de toque a partir de uma screenshot, preferir sempre medir
programaticamente (PIL) no arquivo original e usar esse número direto; se for medir "a olho" na
imagem renderizada no chat, aplicar o fator informado antes de montar o `adb shell input tap`.

### Próxima ação concreta

Pedir confirmação e commitar o Estágio 7 passo 5 (painel de leitura). **Antes de dar o passo 5 por
fechado de verdade**, testar com toque real (não `adb`) se os controles do painel de fato mudam a
pré-visualização ao vivo — ver "Limitação de validação" acima. Depois: passo 6
(destaques/anotações/dicionário) ou passo 7 (resposta a gesto), na ordem que o usuário escolher.
Ainda pendente, não decidido: se `leitor-debug.tsx` deve ganhar uma entrada de UI de volta (perdeu
a que tinha na rescrita do Jardim, Estágio 8 fundação) ou ficar sem uma por enquanto.

### O que já foi verificado — não repetir

- `pnpm test`, `pnpm lint`, `pnpm typecheck` rodam limpos na raiz (Turborepo). `pnpm lint` só
  reporta os warnings `noNonNullAssertion` já aceitos de `test/sessao/transicoes.test.ts`.
- Biome (`useExhaustiveDependencies`): o comentário `biome-ignore` precisa ser **uma única linha
  física** imediatamente antes da linha sinalizada — um bloco de comentário multi-linha antes do
  `useEffect(` não é reconhecido, o erro persiste. Comentário no estilo ESLint
  (`eslint-disable-next-line`) também não funciona — Biome não lê diretivas do ESLint.
- AVD `BookWorm_API34` (Pixel 6, API 34) segue funcional. **Cai sozinho depois de ~1h ocioso** — se
  `adb devices` vier vazio, religar com
  `emulator.exe -avd BookWorm_API34 -no-snapshot -gpu swiftshader_indirect`. `adb`/`emulator`
  precisam de `export PATH="$PATH:$LOCALAPPDATA/Android/Sdk/platform-tools"` numa sub-shell nova
  do Bash tool (não herda o PATH do perfil do usuário automaticamente nesse ambiente).
- Puxar o banco SQLite do app (`adb exec-out run-as com.bookworm.app cat .../bookworm.db`) só
  produz um arquivo íntegro com `MSYS_NO_PATHCONV=1` exportado antes — sem isso o path é reescrito
  pelo Git Bash e o pull sai truncado/corrompido sem erro visível.
- `uiautomator dump` não é confiável neste ambiente (path do MSYS quebra o comando silenciosamente,
  ver achado de sessão anterior) — usar sempre `adb exec-out screencap -p` e medir visualmente.

---

## Artefatos publicados — URLs

Prefixo `https://claude.ai/code/artifact/`.

| Peça | Arquivo | UUID |
|---|---|---|
| **Design system (catálogo)** | `mockups/design-system.html` | `3e2ebd2b-9420-4a3f-9c82-a166a9dd67aa` |
| Tipografia A — adotada | `mockups/tipografia-quatro-vozes.html` | `2abc8814-2d01-425f-8441-776841b1d7c5` |
| Tipografia B — descartada | `mockups/tipografia-duas-vozes.html` | `ca59f313-48b1-4b0f-9ba9-357e7e31cbb0` |
| Tipografia C — descartada | `mockups/tipografia-uma-voz.html` | `77c37f32-3edc-4d3d-ad8f-d1700b95b6de` |
| Telas Papel | `mockups/telas-papel.html` | `2a147217-2816-427d-b25f-a27cb6653f63` |
| Telas Noturno (descartada) | `mockups/telas-noturno.html` | `0ee8e368-e1af-47a0-ad33-f69cf0d5e3c9` |
| Widgets de story | `mockups/widgets-story.html` | `b987d745-9b03-4822-9c0e-ffd6d259fb1c` |

Local e publicado estão idênticos em todas as sete. Republicar de sessão nova cobra uma
leitura do fonte vivo (~20k tokens/arquivo) — só pagar isso se houver edição real a fazer.

---

## Versões fixadas nesta máquina

| Ferramenta | Versão | Observação |
|---|---|---|
| Node | v20.17.0 | `corepack` falha nesta máquina (EPERM + falha de assinatura); pnpm instalado via `npm install -g pnpm` |
| pnpm | 10.34.5 | `.npmrc` da raiz fixa `node-linker=hoisted` — obrigatório (ver `CLAUDE.md`) |
| JDK | 17.0.9 | `C:\Development\Tools\Java` — usar como `JAVA_HOME`, não o do Android Studio |
| Expo SDK | 57.0.15 | diverge de "SDK 55" em `stack.md` §3 — não decidido se o MVP acompanha ou fixa |
| RN / React | 0.86.2 / 19.2.3 | diverge de "RN 0.83/React 19.2" em `stack.md` §3 |
| `react-native-readium` | 5.0.0 | precisa de 4 patches de build nativo, ver `specs/medicao-app-de-prova.md` §0 e `apps/app/plugins/withReadiumAndroidBuildFixes.js` + `patches/react-native-readium.patch` |
| Vitest | 3.2.7 fixado | `vitest@4.x` quebra nesta máquina (`rolldown-vite`, `Cannot find native binding`) |

## Pendências abertas fora da operação em curso

- `AJ-13` (migrar as três peças de mockup ao catálogo, absorve `AJ-11`) segue aberta.
- `AJ-11` e `AJ-12` seguem **não pedidos** — não começar sem o usuário pedir.
- `Q-DV.7` a `Q-DV.10`, `AJ-1` a `AJ-10` seguem como estavam.
- `Q-ST.8a` (extração de texto de PDF com arquivo de produção real — PDF é recusado no Estágio 7,
  `motivo: 'pdf_nao_suportado'`), `Q-ST.5` (hifenização, repetir com coluna estreita quando o
  painel de leitura existir), `Q-TEL.1` (reinstrumentar sem `PanResponder`), `Q-TEL.14` (exige
  tela dividida/PiP — Estágio 14).
- `Q-ST.1`/divergência de versão do Expo SDK (57 vs. 55 do `stack.md`) — decisão do usuário, não
  tomada.
