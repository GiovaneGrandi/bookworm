# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 23/08/2026

---

## Operação em curso — Plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`)

**Estágios 0–7-fundação e Estágio 8-fundação commitados** (`git log`: até `913ec66`). Por pedido
explícito do usuário ("Pode voltar ao que faltou do estágio 7, depois concluímos o 8"), a sessão
atual voltou ao Estágio 7 antes de continuar o 8.

**Estágio 7 passo 3 (Estante) implementado e validado ao vivo no emulador, ainda não commitado.**
Faltam do Estágio 7, deferidos para rodada futura (escolha do usuário via `AskUserQuestion`:
"Estante primeiro, sozinha"): passo 5 (painel de 10 controles), passo 6
(destaques/anotações/dicionário), passo 7 (resposta a gesto — `R-2` avisa que isso **é** o
produto, não pode ser apressado).

### O que foi construído (passo 3 — Estante)

- **`apps/app/app/(tabs)/biblioteca.tsx`** — Biblioteca e Estante viraram duas divisórias da
  mesma aba (`RN-02.6a`), toggle no topo da tela (não reusa `BwAbasFichario` — esse componente é
  a navegação de primeiro nível, fixa no rodapé; o toggle é local, mesmo padrão visual de rótulo
  em versalete mono). Estante lista via `listarEstante` (nova, em
  `src/biblioteca/consultas.ts`), ordenada por `estanteDesde` desc, com estado vazio próprio
  (`BwVazio`, nunca lacuna — `RN-02.22a`).
- **`apps/app/app/leitor.tsx`** — `RN-02.6`: "concluído é sugerido ao atingir 100%, confirmado
  pelo usuário". Rastreia a razão `caracteres/índice.total` a cada `onLocationChange`; ao fechar
  com progresso ≥ 98% (constante `LIMIAR_SUGESTAO_CONCLUSAO` — margem prática porque o índice
  ainda inclui capa/ficha catalográfica no total, `RN-02.10` os excluiria de verdade), pergunta
  via `Alert.alert` antes de navegar para o resumo. Só chama `marcarComoConcluido` se confirmado.
- Reler (abrir uma obra `concluido` a partir da Estante) já funcionava — `marcarComoLendo` é
  chamado incondicionalmente na abertura do leitor desde o Estágio 7 fundação, sem tocar em
  `estanteDesde`. Validado ao vivo: a obra reaparece na Biblioteca **e permanece** na Estante —
  única sobreposição admitida (`RN-02.6b`).

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

Pedir confirmação e commitar o Estágio 7 passo 3 (Estante). Usuário já indicou a ordem: terminar
o restante do Estágio 7 (passos 5, 6, 7) antes de voltar a concluir o Estágio 8. Ainda pendente,
não decidido: se `leitor-debug.tsx` deve ganhar uma entrada de UI de volta (perdeu a que tinha na
rescrita do Jardim, Estágio 8 fundação) ou ficar sem uma por enquanto.

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
