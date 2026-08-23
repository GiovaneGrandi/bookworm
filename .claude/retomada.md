# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 23/08/2026

---

## Operação em curso — Plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`)

**Estágios 0–7 commitados** (`git log`: até `88bb7d4`, Estágio 7 passo 2 — acervo embarcado).
Faltam do Estágio 7, deferidos para rodada futura: passo 3 completo (Estante — hoje só
Biblioteca existe), passo 5 (painel de 10 controles), passo 6 (destaques/anotações/dicionário),
passo 7 (resposta a gesto).

**Estágio 8 — fundação (R-3 + resumo + Jardim funcional) implementada e validada ao vivo no
emulador, ainda não commitada.** Escopo escolhido pelo usuário via `AskUserQuestion`: "Fundação
primeiro" — **excluídos desta rodada**: arte completa do Jardim em Skia (5 estágios ilustrados),
vida ambiente (J-11), 4 cosméticos de marco, notificações locais (`expo-notifications`), tela de
edição de meta, concessão/consumo automático de congelamento na virada do dia, e a fronteira de
fim-de-capítulo de RN-04.10b (celebração só dispara no fechamento da sessão, não em fim de
capítulo — painel de leitura ainda não existe).

### O que foi construído

- **`apps/app/src/ofensiva/servico.ts`** (novo) — integra `packages/core/src/ofensiva/` (Estágio
  4, já testado) com o banco local: `avaliarEAtualizarHoje` recalcula o agregado do dia, avalia a
  meta (`avaliarMeta`, pegajoso — RN-04.10f), grava `celebracaoEstado` (`pendente` só na transição
  cumprida-agora; mantém o valor anterior caso contrário) e recalcula `ofensiva` via
  `recalcularOfensiva` sobre um histórico sem lacunas sintetizado em memória (só dias com sessão
  real são persistidos em `dia_ofensiva`). `consumirCelebracaoPendente` marca `exibida`.
  `obterOfensivaAtual`/`obterProgressoDeHoje` alimentam a UI.
- **`apps/app/app/leitor.tsx`** — o botão "Fechar" agora chama `avaliarEAtualizarHoje` e navega
  para `/resumo` com `celebracaoPendente` como param. O efeito de limpeza no unmount (saída sem
  passar pelo botão — ex.: botão físico voltar) continua recalculando a ofensiva como rede de
  segurança, mas **não navega para o resumo** — limitação aceita desta rodada, não discutida com o
  usuário.
- **`apps/app/app/resumo.tsx`** (novo) — tela de resumo de sessão; se `celebracaoPendente==='1'`,
  abre pela celebração (`BwCelebracao`) antes dos números, e consome a celebração pendente uma
  única vez.
- **`apps/app/app/(tabs)/index.tsx`** (Jardim, reescrito) — estado real via `useFocusEffect`:
  `nunca_leu` (nunca leu nada), `dormente` (`BwDormencia`), `vivo` (contagem, estágio via
  `estadoDoJardim`, progresso do dia). **Removeu o link para `/leitor-debug`** que existia antes —
  essa rota ainda existe no código mas não tem mais entrada de UI (não decidido com o usuário se
  deve ganhar uma de volta).
- Lint/typecheck/test rodam limpos (`pnpm lint`/`typecheck`/`test` na raiz) — só os warnings
  `noNonNullAssertion` já aceitos de antes.

### Validado ao vivo no emulador — fluxo completo de R-3

Meta temporariamente baixada para 1 min (`META_PADRAO_MINUTOS`) só para o teste, **revertida para
20 antes deste registro** — não há vestígio da mudança temporária no working tree. Sequência
confirmada: ler `alice.epub` → fechar pelo botão ✕ → resumo mostra números corretos da sessão
(tempo ativo, páginas canônicas, estilo) → uma **segunda** sessão, mesmo dia, mesmo curta (abaixo
de `SESSAO_MINIMA_SEGUNDOS`) → resumo abre com `BwCelebracao` ("1 · dias de ofensiva · Meta do dia
cumprida.") **antes** dos números — confirma que o estado pendente sobrevive entre sessões e só é
consumido no resumo, e que a celebração independe do status da sessão que a revelou. Jardim
(`(tabs)/index.tsx`) refletiu em seguida: contagem 1, estágio "Broto", progresso do dia coerente
com o agregado.

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

Pedir confirmação e commitar a fundação do Estágio 8. Depois, perguntar ao usuário se
`leitor-debug.tsx` deve ganhar uma entrada de UI de volta ou ficar sem uma por enquanto. Rodada
seguinte: o restante do Estágio 8 (arte do Jardim, notificações, congelamento automático, edição
de meta) ou o restante do Estágio 7 — a decidir com o usuário.

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
