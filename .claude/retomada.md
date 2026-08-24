# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 24/08/2026 (sessão da tarde — Estágio 8, itens 6/7 do plano)

---

## Operação em curso — Plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`)

**Estágio 7 fecha por completo (exceto `RN-02.13a`, adiado por decisão do usuário — indicador
nativo do react-native-readium sem prop para desligar/trocar nível, exigiria patch Android).
Estágio 8: fundação + `R-3` já commitados (`913ec66`); esta sessão implementou e smoke-testou dois
dos cinco itens restantes de `mvp.md` §11 item 8/`planos/...` linha 638-649:
`bw-dormencia` **já existia** (fundação cobriu, `BwDormencia.tsx` + wiring em `(tabs)/index.tsx` —
`.claude/pendencias-2026-08-24.md` §2 item 2 estava desatualizado nesse ponto). Ainda não
commitado — `git status` mostra as mudanças abaixo.**

### Congelamento automático (RN-04.17, item 4 da lista de pendências)
`packages/db/src/schema/ofensiva.ts` ganhou `ultimo_dia_processado_congelamento` (cursor, nullable
— migração `0002_bouncy_the_santerians.sql`, `ddl.ts` atualizado à mão como o padrão do projeto
exige). `apps/app/src/ofensiva/servico.ts` ganhou `processarCongelamentoAutomatico(eixo)`: concede
o congelamento mensal (`concederCongelamentoMensal`), anda dia a dia desde o cursor até ontem
decidindo proteção via `aplicarCongelamento` (ambas já existiam em `@bookworm/core`, só faltava a
orquestração com I/O). **Decisão de design não escrita em nenhuma spec**: o cursor existe
especificamente para nunca proteger retroativamente um dia já quebrado com estoque que só chegou
depois (mesmo espírito de RN-04.21, mas para a concessão automática, não a compra) — sem ele, um
recálculo completo do histórico a cada abertura correria esse risco. Na primeira execução (cursor
nulo) o cursor nasce em "ontem" sem decidir nada — não processa retroativamente dias anteriores a
esta funcionalidade existir. Chamado no `useFocusEffect` do Jardim (`(tabs)/index.tsx`), antes de
ler a ofensiva; se protegeu algo nesta rodada, mostra um `BwCartao` dispensável com a copy de
`RN-04.17` ("usamos N congelamento(s) para proteger seus N dias. Restam N").
**Validado:** typecheck/lint/test limpos, smoke no emulador (fresh install, sem crash, estado
"nunca_leu" renderiza certo). **Não validado ainda**: o caminho de proteção de fato disparando —
exige um histórico de ofensiva real com um dia perdido no meio, que não existe neste device limpo.
Para testar sem simular sessões de leitura reais, a rota mais barata é popular `dia_ofensiva` +
`ofensiva` + `congelamento` direto no banco puxado via `adb exec-out run-as ... cat
.../bookworm.db{,-wal,-shm}` (as três, por causa do WAL — só o `.db` sozinho vem com 4096 bytes e
sem as tabelas) e reabrir o Jardim.

### Tela de meta (RN-04.4–RN-04.9, item 7 da lista de pendências)
Núcleo (`alterarMeta`, `FAIXAS_META`) **já existia e já tinha teste** em `@bookworm/core` — só
faltava tela e wiring. Novo `apps/app/app/meta.tsx` (rota `fullScreenModal`, registrada em
`_layout.tsx`): seletor de unidade (`BwSeletorDeOpcoes`, só páginas/minutos — palavras é exclusivo
de escrita, sem tela ainda) + `BwControleContinuo` para o valor + `BwBotao` "Salvar". Duas novas
funções em `servico.ts`: `obterMetaVigente` e `alterarMetaVigente` (esta grava a linha nova em
`meta_diaria` quando `alterarMeta` permite). Link "Ajustar meta" (`BwBotao variante="texto"`)
adicionado nos estados `vivo` e `dormente` do Jardim.
**Validado ao vivo**: deep link `adb shell am start -a android.intent.action.VIEW -d
"bookworm://meta" com.bookworm.app` abriu a tela, toque real em "Salvar" (botão de nível superior,
não overlaid em `ReadiumView` — sem a limitação de toque via `adb` documentada abaixo) gravou a
segunda linha em `meta_diaria` com `vigente_desde` amanhã e `proxima_alteracao_permitida_em` +7
dias — confirmado lendo o banco puxado do device. **Não validado**: motivo `fora_da_faixa` e
`intervalo_minimo` (a segunda alteração dentro dos 7 dias) — só o caminho feliz foi exercitado.

### Notificações locais (RN-01.15–17, RN-02.14, RN-04.30/31 — item 5 da lista de pendências)
`expo-notifications` instalado (`~57.0.14`) + plugin em `app.json` — isso exigiu `npx expo
prebuild --platform android` (o projeto usa CNG, `android/` é gitignored) e portanto um rebuild
nativo completo, não incremental. Decisão pura em `@bookworm/core/src/notificacoes` (testada:
`deveAgendarLembreteDiario`, `deveAgendarOfensivaEmRisco`), orquestração com I/O em
`apps/app/src/notificacoes/servico.ts`. Escopo **deliberadamente cortado** frente a `04-streaks-
e-jardim.md` §5.7: só RN-04.30 (lembrete diário) e RN-04.31 (ofensiva em risco) — RN-04.32 (convite
pós-quebra) e RN-04.33 (ausência prolongada) ficaram de fora porque o plano (`planos/2026-08-23-
...md` linha 643-646) só pede essas duas para o Estágio 8. Horário fixo (20h lembrete, 22h risco,
ambos "a validar") — sem tela de preferência, que é Estágio 9 (onboarding/conta). Sem toggle
individual (RN-01.15 pede "desativáveis" — não implementado, mesma razão).
Wiring: `suprimirNotificacoesDeEngajamento()` ao abrir uma obra (RN-02.14), `sincronizarNotifi
cacoesDeEngajamento()` nos dois pontos de encerramento de sessão em `leitor.tsx` e no
`useFocusEffect` do Jardim.
**Validado ao vivo, de ponta a ponta, incluindo o SO**: rebuild nativo limpo → app pede permissão
de notificação ao focar o Jardim → toque real em "Allow" → `adb shell dumpsys alarm` mostra o
alarme `RTC_WAKEUP` real, no horário exato (20:00 hoje), tag
`expo.modules.notifications.NOTIFICATION_EVENT` — e **nenhum** alarme de "ofensiva em risco"
(correto: ofensiva ainda não existe, `ofensivaAtivaDias` = 0 < 3). Esta foi a validação mais forte
das três desta sessão porque `dumpsys alarm` prova o agendamento real no SO, não só ausência de
crash. **Disparo de fato confirmado** numa checagem seguinte, sem intervenção: o relógio real do
emulador chegou às 20h, o alarme disparou de verdade e a notificação "Um convite para ler" / "Sua
leitura de hoje está esperando, sem pressa." apareceu na cortina do Android com a cópia exata —
visto tanto por `dumpsys notification` quanto por screenshot. `expo-notifications` logou "will not
trigger in the future, removing" ao processá-la. **Ainda não validado**: a supressão durante
sessão ativa (RN-02.14) e o cancelamento quando a meta é cumprida no meio do dia.

### Achado de ambiente — instalar um módulo nativo novo exige `expo prebuild`
Diferente de código JS/TS puro, adicionar uma dependência com módulo nativo (`expo-notifications`)
não é só `pnpm add` + rebuild: como `android/` é gerado por CNG e já existia fisicamente de builds
anteriores, o plugin novo em `app.json` só é aplicado rodando `npx expo prebuild --platform
android` primeiro (que recria `android/` do zero). Depois disso o próximo `pnpm run android` é um
build nativo completo (~2min, não incremental) na primeira vez. Nesta sessão o primeiro rebuild
pós-prebuild falhou uma vez com `Unable to delete directory ... obj\x86_64` (lock de arquivo
transitório do Windows/Gradle em `.so` de build anterior) — resolvido só rodando `pnpm run android`
de novo, sem nenhuma limpeza manual.

### Ainda falta do Estágio 8
1. **Arte completa do Jardim** (5 estágios ilustrados, paleta de dormência, vida ambiente,
   cosméticos) — não implementado, é o item de maior escopo (produção de asset, não só código) e
   o único item restante da lista original de 5 em `.claude/pendencias-2026-08-24.md` §2.

Depois disso: os testes formais do Estágio 8 (E2E Maestro, `RN-04.10d/e/f`, contra-teste de
silêncio) e o percurso de ponta a ponta de 10 passos do plano (avançar o relógio do emulador por
vários dias simulados) — nenhum dos dois foi feito ainda nesta sessão nem na anterior.

### Próxima ação concreta
Pedir confirmação e commitar as três mudanças desta sessão (congelamento automático, tela de meta,
notificações locais — `git status` mostra tudo pendente, nada commitado ainda). Depois: decidir com
o usuário como abordar a arte do Jardim antes de começar — é grande o suficiente (produção de
asset, `Q-ST.6` em aberto sobre se Skia se sustenta sem ilustrador) para merecer uma conversa de
escopo própria, não apenas seguir a lista.

### O que foi construído (passo 7 — resposta a gesto, RN-02.17)

Decisão do usuário via `AskUserQuestion`: "Adiar o que exige patch, fazer o resto". Ficaram de fora
— exigem patch nativo no Readium/WebView, sem hook exposto em `ReadiumView.nitro.ts` (grep
confirmou ausência de config de animação/transição/duração antes de propor o escopo):
- RN-02.17b — curva de desaceleração da virada de página (e o som de página, escopo cortado por
  mim à parte: não há asset de áudio nem `expo-av`/`expo-audio` instalado).
- RN-02.17c — preenchimento progressivo ("absorção de tinta") do grifo.

O que foi implementado:
- **`apps/app/src/leitor/interacoes.ts`** — `criarConsultaDicionario` passou a retornar
  `ConsultaSalva` (antes `void`); novo `listarConsultasDaObra(obraId)` alimenta o vestígio
  permanente (RN-02.17d) do mesmo jeito que `listarDestaquesDaObra` já fazia para os destaques.
- **`apps/app/app/leitor.tsx`** — `hapticoSeAtivo` (usa `expo-haptics`, já era dependência, sem
  rebuild) centraliza todo háptico do arquivo atrás da chave única `prefs.retornoSensorialAtivo`
  (RN-02.17f, já existia desde o passo 5 mas não era lida por nada até agora). Chamado em: virada
  de página (`aoMudarLocalizacao`, pula a primeira localização — é abertura da obra, não virada),
  grifo salvo, anotação salva, consulta ao dicionário concluída. `grupoDeDecoracoes` ganhou um
  segundo `DecorationGroup` ("consultas-dicionario") com `type: 'underline'`, tint
  `theme.sup.papel.tintaFraca` — o vestígio do RN-02.17d.

### Validado ao vivo (passo 7)

Fluxo de fumaça no emulador: relançar o app limpo → abrir "alice" pela Biblioteca (sem crash com o
segundo `DecorationGroup` presente) → 3 swipes de página (`adb shell input swipe 800 1200 200 1200
150`) para exercitar o caminho do háptico em `aoMudarLocalizacao` → `logcat` sem
FATAL/Exception/erro no fluxo, avanço de página confirmado por screenshot (3/83) → `KEYCODE_BACK` →
screenshot confirma volta limpa para a Biblioteca, nenhum estado preso. **Não confirmado** (mesma
limitação de toque via `adb` em painel sobreposto ao `ReadiumView`, documentada abaixo): se o
háptico realmente dispara (não é observável por `adb`/screenshot); se o sublinhado de vestígio do
dicionário renderiza certo — nenhuma consulta foi de fato concluída ao vivo nesta rodada para
produzir uma decoração real.

### Pendências de teste com toque real (acumuladas — passos 5, 6 e 7)

Nenhuma etapa de toque *dentro* de um painel sobreposto ao `ReadiumView` foi confirmada com toque
real ainda (só a barra de seleção nativa, que não é um painel nosso). Antes de considerar o
Estágio 7 validado de ponta a ponta, falta testar com toque real (mouse na janela do emulador ou
aparelho físico):
- Passo 5: os 9 controles do painel de preferências realmente mudam o texto renderizado.
- Passo 6: tocar uma pastilha de pigmento grava o destaque e ele aparece como grifo; salvar
  anotação persiste; consulta ao dicionário busca online e mostra definição/erro.
- Passo 7: sentir o retorno háptico de fato (virada de página, grifo, nota, dicionário); ver o
  sublinhado de vestígio do dicionário aparecer após uma consulta real.

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

Pedir confirmação e commitar o Estágio 7 passo 7 (`interacoes.ts` + `leitor.tsx`, ver acima) —
`git status` mostra as duas mudanças pendentes. Isso fecha o Estágio 7 por completo (exceto
RN-02.13a, adiado). Depois: retomar o Estágio 8 (fundação já commitada em `913ec66`; falta ver no
plano o que ficou de fora — arte do Jardim, notificações, congelamento automático, edição de meta),
conforme pedido original do usuário "depois concluímos o 8" — mas confirmar com o usuário antes de
assumir isso como próximo passo automático. As pendências de teste com toque real (seção acima)
seguem em aberto independente do que vier a seguir. Ainda pendente, não decidido: se
`leitor-debug.tsx` deve ganhar uma entrada de UI de volta (perdeu a que tinha na rescrita do
Jardim, Estágio 8 fundação) ou ficar sem uma por enquanto.

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
