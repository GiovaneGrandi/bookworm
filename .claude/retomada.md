# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 24/08/2026 (sessão da noite — Estágio 8 fecha o código por completo)

---

## Operação em curso — Plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`)

**Estágio 7 fechado por completo (exceto `RN-02.13a`, adiado por decisão do usuário — sem patch
nativo no Readium). Estágio 8: todo o código dos 5 itens de `mvp.md` §11 item 8 está commitado**
(`git log`: `5822376` congelamento+meta+notificações, `1b68547` arte do Jardim, `4bb8512`
RN-04.10d/e + contra-teste de silêncio). `bw-dormencia` **já existia** desde a fundação
(`913ec66`) — só ganhou a arte real nesta sessão.

### O que está pronto e como foi validado
- **Congelamento automático** (RN-04.17): job de virada com cursor
  `ofensiva.ultimo_dia_processado_congelamento` — nunca protege retroativamente um dia já quebrado
  com estoque que só chegou depois (mesmo espírito de RN-04.21, aplicado à concessão automática,
  não à compra). Aviso não-punitivo no Jardim. Validado: smoke limpo; o caminho de proteção
  disparando de fato precisa de um histórico com um dia perdido no meio (não testado ao vivo,
  lógica idêntica à já testada em `@bookworm/core`).
- **Tela de meta** (RN-04.4–9): `app/meta.tsx`, usa `alterarMeta`/`FAIXAS_META` (já existiam e já
  tinham teste em `@bookworm/core`). Validado ao vivo por deep link + toque real: salvar grava a
  vigência de amanhã e o intervalo de 7 dias corretos, confirmado lendo o banco do device.
- **Notificações locais** (RN-01.15–17, RN-02.14, RN-04.30/31): `expo-notifications`, decisão pura
  testada em `@bookworm/core/notificacoes`. Só lembrete diário + ofensiva em risco (RN-04.32/33
  ficaram fora, fora do pedido do plano para o Estágio 8); horário fixo, sem tela de preferência
  (Estágio 9). **Validação mais forte da sessão**: `dumpsys alarm` mostrou o `RTC_WAKEUP` real
  agendado, e numa checagem seguinte o alarme **disparou de verdade** — a notificação apareceu na
  cortina do Android com a cópia exata, visto por `dumpsys notification` e screenshot.
- **Arte do Jardim** (`mvp.md` §9): primeiro uso real de Skia no produto. 5 estágios procedurais,
  elementos diários posicionados deterministicamente (RN-04.24/27), dormência em paleta de outono
  de verdade — não cinza (RN-04.25/J-13), 4 cosméticos por marco permanentes (RN-04.13/28), luz por
  hora real + vento contínuo (J-11). Validado semeando `ofensiva.contagem_atual`/
  `acervo_dias_cumpridos`/`melhor_marca` direto no SQLite do device (sem esperar dias reais): as 5
  fases e a dormência renderizaram certo, sem crash, cosméticos aparecendo/persistindo como devem.
- **RN-04.10d** (celebração pendente sobrevive a app morto): **não existia antes desta sessão** —
  só era mostrada pelo retorno ao vivo da sessão que fechou o leitor. Nova
  `haCelebracaoPendenteHoje()` checada no foco do Jardim resolve isso. Validado ao vivo: celebração
  pendente semeada no banco → app morto e reaberto → resumo aparece sozinho; reaberto de novo →
  não repete (RN-04.10e, que já era coberto pela lógica existente).
- **Contra-teste de silêncio** (RN-02.13b/RN-04.10c): `leitor.tsx` não é renderizável sob Jest
  (Readium nativo + `expo-sqlite` de verdade) — virou varredura estática em
  `test/arquitetura/silencio-durante-leitura.test.ts`, no espírito de
  `packages/core/test/arquitetura/*`.

### O que ficou fora, e por quê
- **RN-04.10f** (dia celebrado não reverte): já testado em `@bookworm/core`
  (`avaliarMeta.test.ts`). O cenário de integração completo do plano (descartar uma sessão e
  reconferir) depende de invalidação de sessão do lado do servidor (RN-03.29), que não existe
  localmente — Estágio 9.
- **E2E Maestro** — Maestro CLI não está instalado nesta máquina (Windows; o caminho oficial passa
  por WSL2). Não instalei sozinho porque é ferramenta nova no ambiente do usuário, decisão dele.
- **Percurso de ponta a ponta real de 10 passos** (`planos/...` "Verificação de ponta a ponta":
  abrir → importar → ler de verdade até bater a meta → ver a celebração → jardim crescer, tudo numa
  sequência contínua com toque real e avanço de dias) — cada peça foi validada isoladamente (via
  semeadura de banco) mas não como um único fluxo contínuo com leitura real. Mesma categoria de
  "exige toque real" documentada abaixo para o Estágio 7 — é trabalho para o usuário, como ele
  mesmo definiu ao pedir para fechar o Estágio 8 desta forma.

### Próxima ação concreta
Estágio 8 está pronto do lado de código. Os dois itens que restam (Maestro, percurso de ponta a
ponta real) dependem do usuário. Quando ele voltar: perguntar se quer que eu instale e escreva os
flows do Maestro, ou se prefere seguir sem E2E automatizado por enquanto; e recolher o resultado do
percurso manual dele antes de considerar o Estágio 8 encerrado de fato (checklist "Definição de
pronto" do plano). Depois disso: Estágios 9–14, hoje só esboçados no plano.

### Pendências de teste com toque real do Estágio 7 (seguem em aberto, não reavaliadas nesta sessão)
Nenhuma etapa de toque *dentro* de um painel sobreposto ao `ReadiumView` foi confirmada com toque
real (só a barra de seleção nativa do Android). Ver `.claude/pendencias-2026-08-24.md` §1 para o
checklist completo (painel de preferências, destaques/anotação/dicionário, hápticos, Estante).
Achado: **nenhum `Pressable` sobreposto ao `ReadiumView` responde a `adb shell input
tap`/`swipe`** — só botões de nível superior fora do painel, e só via `swipe`. Não vale mais
investigar isso via `adb`; exige mouse no emulador ou aparelho físico.

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
- Se `apps/app/app/leitor-debug.tsx` deve ganhar de volta uma entrada de UI (perdeu a que tinha na
  rescrita do Jardim, Estágio 8 fundação) ou seguir sem uma — não decidido.
- `Q-ST.6` (Skia se sustenta com dupla, ou precisa de ilustrador + Rive?) — agora tem um dado
  empírico parcial: a arte do Jardim ficou pronta numa sessão de código, sem asset externo, com
  animação e paleta procedurais. Ainda não é resposta definitiva (é a primeira peça, não uma prova
  de sustentação de longo prazo), mas pesa a favor de "sustenta".
