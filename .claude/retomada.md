# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 23/08/2026

---

## Operação em curso — Plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`)

**Estágios 0–7-fundação, Estágio 7 passos 2/3/5 e Estágio 8-fundação commitados** (`git log`: até
`5e75764`). Usuário pediu, em sequência: voltar ao que faltava do Estágio 7 antes de fechar o 8 →
"Estante primeiro, sozinha" (passo 3) → "passo 5" (painel de leitura) → "passo 6"
(destaques/anotações/dicionário, **implementado nesta rodada, ainda não commitado**).

Falta do Estágio 7: passo 7 (resposta a gesto — `R-2` avisa que isso **é** o produto, não pode ser
apressado), e `RN-02.13a` (nível da âncora de posição) que ficou de fora do passo 5 por decisão do
usuário — o indicador nativo do react-native-readium (`PositionLabelManager.kt`) não expõe prop
para desligar/trocar, exigiria patch na lib Android.

### O que foi construído (passo 6 — destaques, anotações, dicionário)

Schema (`destaque`, `anotacao`, `consulta_dicionario`) e a sinalização de instrumentação
(`useMaquinaSessao.sinalInteracaoQualitativa`, RN-TEL.19) **já existiam desde o Estágio 3/6** —
esta rodada foi só integração:

- **`apps/app/src/leitor/interacoes.ts`** (novo) — `criarDestaque`, `criarAnotacao`,
  `criarConsultaDicionario`, `listarDestaquesDaObra`.
- **`apps/app/src/leitor/dicionario.ts`** (novo) — `consultarTermo` via `dictionaryapi.dev`
  (gratuito, sem chave). RN-02.20 pede "offline embarcado, com queda para online" — o embarcado é
  o próprio `Q-02.4`/`Q-ST.7` do plano, questão em aberto que a spec já marca como "não bloqueia";
  esta rodada implementa só a consulta online.
- **`apps/app/src/leitor/PainelInteracoes.tsx`** (novo) — três modos (grifar/anotar/dicionário)
  numa folha sobreposta, nunca uma rota nova (RN-02.20). Pastilhas de pigmento reusam
  `theme.grifo.*` (nunca `pigmento` direto — RN-DS.1, testado pelo scan estático).
- **`apps/app/app/leitor.tsx`** — `ReadiumView` ganhou `selectionActions` (3 ações nativas:
  Grifar/Anotar/Dicionário, aparecem na barra de seleção de texto **nativa** do Android) e
  `decorations` (destaques existentes da obra, recarregados a cada abertura — RN-02.18 "não é
  efêmero por sessão"). `onSelectionAction` abre `PainelInteracoes` no modo certo.

### Validado ao vivo — a seleção nativa de texto funciona de ponta a ponta

**Confirmação real, não inferência**: seleção de texto por toque-e-segure no `ReadiumView` abriu a
barra de seleção **nativa do Android** com os três rótulos certos ("Grifar", "Anotar",
"Dicionário") sobre o trecho "rabbit-hole" — prova que `selectionActions`/`onSelectionAction`
funcionam de verdade neste ambiente (isso não é um `Pressable` nosso, é UI do sistema, então não
sofre do problema de toque via `adb` descrito abaixo). Tocar "Grifar" abriu `PainelInteracoes` com
as 4 pastilhas de pigmento certas e o trecho citado. **Não confirmado**: tocar numa pastilha
efetivamente grava o destaque e ele aparece como decoração — a mesma limitação de toque via `adb`
dentro de painéis sobrepostos ao `ReadiumView` (já documentada para o passo 5) impediu testar essa
última etapa. O app não travou em nenhum momento (`logcat` limpo de fatal/exception no fluxo).

### Achado consolidado — toque via `adb` não confiável em qualquer painel sobreposto ao `ReadiumView`

Terceira confirmação nesta sessão (antes: painel de preferências do passo 5; agora: painel de
interações do passo 6) do mesmo padrão: **nenhum `Pressable` dentro de um painel sobreposto ao
`ReadiumView`** responde a `adb shell input tap` nem a `input swipe X Y X Y 150` (toque parado),
mesmo com coordenada corrigida por densidade de tela (420dpi, fator `420/160 = 2.625` entre dp de
estilo RN e pixel físico da screenshot) e mesmo em elementos que já cumprem 48dp de alvo de toque.
Só os botões de nível superior fora do painel (ex.: "Aa"/"✕" na faixa do topo) respondem, e só
via `input swipe` (nunca `input tap` puro). A barra de seleção nativa do Android (não é RN) não
tem esse problema. **Não vale mais investigar isso via `adb` nesta sessão** — testar interação
dentro de qualquer painel do leitor exige toque real (mouse na janela do emulador ou aparelho
físico), como já confirmado para o rodapé de abas em sessão anterior.

### Próxima ação concreta

Pedir confirmação e commitar o Estágio 7 passo 6. **Antes de dar o passo 6 por fechado de
verdade**, testar com toque real: tocar uma pastilha de pigmento grava o destaque e ele aparece
como grifo no texto; salvar uma anotação persiste; a consulta ao dicionário busca online e mostra
definição/erro. (O mesmo vale para o passo 5, ainda não confirmado com toque real.) Depois: passo
7 (resposta a gesto). Ainda pendente, não decidido: se `leitor-debug.tsx` deve ganhar uma entrada
de UI de volta (perdeu a que tinha na rescrita do Jardim, Estágio 8 fundação) ou ficar sem uma por
enquanto.

### O que já foi verificado — não repetir

- `pnpm test`, `pnpm lint`, `pnpm typecheck` rodam limpos na raiz (Turborepo). `pnpm lint` só
  reporta os warnings `noNonNullAssertion` já aceitos de `test/sessao/transicoes.test.ts`.
- Biome (`useExhaustiveDependencies`): o comentário `biome-ignore` precisa ser **uma única linha
  física** imediatamente antes da linha sinalizada — bloco multi-linha ou estilo ESLint
  (`eslint-disable-next-line`) não funcionam.
- AVD `BookWorm_API34` (Pixel 6, API 34) segue funcional. **Cai sozinho depois de ~1h ocioso** — se
  `adb devices` vier vazio, religar com
  `emulator.exe -avd BookWorm_API34 -no-snapshot -gpu swiftshader_indirect`, esperar
  `getprop sys.boot_completed` = 1 antes de interagir. `adb`/`emulator` precisam de
  `export PATH="$PATH:$LOCALAPPDATA/Android/Sdk/platform-tools"` numa sub-shell nova do Bash tool.
- Coordenada de toque tem **duas conversões**, não uma: (1) a imagem mostrada de volta nesta
  conversa vem redimensionada (900×2000 vs. 1080×2400 nativo — multiplicar por 1.20 se a
  coordenada foi lida "a olho" na imagem exibida, nunca se foi medida por PIL no arquivo
  original); (2) estilos RN de `apps/app` são **dp**, não pixel físico — neste AVD (420dpi),
  multiplicar por `420/160 = 2.625` para ir de um valor de `style` (ex.: `right: 54`) a pixel
  físico da screenshot. Misturar ou pular qualquer uma das duas faz o toque cair fora do alvo sem
  erro visível.
- Puxar o banco SQLite do app (`adb exec-out run-as com.bookworm.app cat .../bookworm.db`) só
  produz um arquivo íntegro com `MSYS_NO_PATHCONV=1` exportado antes.
- `uiautomator dump` não é confiável neste ambiente — usar sempre `adb exec-out screencap -p`.
- `BwFolha` aplica `paddingTop: useSafeAreaInsets().top` desde o passo 3 (conserta a classe
  inteira de tela `(tabs)/`, que não tinha inset de status bar). Jest precisa de
  `jest.mock('react-native-safe-area-context', () => require('.../jest/mock').default)` — o mock
  oficial só expõe `export default`, sem desembrulhar isso `useSafeAreaInsets` some do módulo.

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
