# Medição do app de prova — Estágio 1

> Relatório do Estágio 1 do plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`).
> Mede, em Android real (emulador API 34, `google_apis_playstore/x86_64`), as seis linhas do
> Anexo A dadas como `não verificado` em `specs/design-system.md` §11, e responde `Q-ST.1`,
> `Q-ST.2`, `Q-ST.5`, `Q-ST.8`, `Q-TEL.1` e `Q-TEL.14` com evidência, não hipótese (`RN-DS.20`).
> Capturas de tela em `specs/medicao/`. App de prova em `probe/`, fora do monorepo, descartável.

**Toolchain usada na medição:** Expo SDK 57.0.15 · React Native 0.86.2 · React 19.2.3 ·
`react-native-readium` 5.0.0 (estável, não mais RC) · `@shopify/react-native-skia` 2.6.2 (instalado,
**não usado** — nenhuma primitiva precisou dele, ver §1) · AVD `BookWorm_API34`, Pixel 6, Android 14
(API 34), `google_apis_playstore/x86_64`.

---

## 0. Achado que antecede as primitivas: viabilizar o build

Antes de qualquer medição, `react-native-readium` 5.0.0 (reescrito sobre Nitro Modules desde a
época RC que `stack.md` documentava) não compilava neste ambiente sem quatro correções, nenhuma
delas prevista na spec. Registradas aqui porque **o Estágio 2 vai precisar delas de novo** quando
o Readium entrar no monorepo real:

1. **`node-linker=hoisted` obrigatório.** O layout padrão do pnpm (`node_modules/.pnpm/<pacote>@<versão>_<hash>/...`)
   estoura `CMAKE_OBJECT_PATH_MAX` (250 caracteres) do CMake no Windows, mesmo em caminho de
   projeto curto. Sintoma enganoso: Gradle acusa `A problem occurred starting process 'command
   'cmd''` e depois `ninja: manifest still dirty after 100 tries` — nenhum dos dois menciona
   caminho longo. Já registrado em `.claude/retomada.md` no Estágio 0; confirmado de novo aqui.
2. **Flags do compilador Kotlin.** `react-native-readium` foi compilado contra uma versão de
   Kotlin mais antiga que a que este projeto resolve (o projeto puxa Kotlin 2.3.x). Sem
   `-Xskip-metadata-version-check` e `-opt-in=kotlin.time.ExperimentalTime` no bloco
   `tasks.withType(KotlinCompile)` do `android/build.gradle` raiz, o build falha com
   `Incompatible classes were found in dependencies` (erro interno do compilador) e depois com
   `This declaration needs opt-in`.
3. **`desugar_jdk_libs` em 2.1.5, não 2.1.2.** O README do Readium pede 2.1.2; o
   `readium-kotlin-toolkit` 3.3.0 real exige 2.1.5+. `checkDebugAarMetadata` falha e nomeia a
   versão certa — só seguir a mensagem.
4. **`abiFilters` do Readium não respeita `-PreactNativeArchitectures`.** O módulo declara as
   quatro ABIs incondicionalmente; a ligação nativa (`ld.lld`) falhava para `arm64-v8a`
   especificamente (`undefined symbol: margelo::nitro::HybridObject::shared()`, provável
   descompasso de versão entre `react-native-readium` e `react-native-nitro-modules` resolvido
   nessa ABI). Restringir a `x86_64` (a única que o emulador usa) contornou sem precisar
   investigar o link do arm64 — **decisão a revisitar quando houver build para dispositivo físico
   arm64.**
5. **`network_security_config.xml` do Readium bloqueia o Metro.** O módulo embute um
   `network_security_config.xml` liberando cleartext só para `127.0.0.1`/`localhost` (serve os
   recursos da publicação via HTTP local do Readium). Sem um `res/xml/network_security_config.xml`
   próprio em `android/app/src/debug/` liberando também `10.0.2.2`, o app roda mas **não consegue
   buscar o bundle do Metro no emulador** (`CLEARTEXT communication to 10.0.2.2 not permitted`) —
   erro só visível no `logcat`, não no Gradle. Recursos do módulo `:app` têm prioridade de merge
   sobre os de uma library, então o arquivo próprio simplesmente sobrepõe, sem `tools:replace`.
6. **`SafeAreaView` de `react-native` é no-op no Android.** Não trava o build, mas quebrou a
   navegação por toque: a barra de abas ficava desenhada sob a status bar, que intercepta os
   toques na faixa onde ela se sobrepõe. Trocado por `paddingTop: StatusBar.currentHeight`. Vale
   como lembrete para `apps/app` no Estágio 5: usar `react-native-safe-area-context` desde o
   início, não a API depreciada.

Nenhuma dessas é decisão de produto — são registradas para o Estágio 2 não redescobrir do zero.

---

## 1. Anexo A — as 12 primitivas (Tela A)

Capturas: `specs/medicao/tela-a-primitivas-1.png` a `-4.png`.

| Primitiva | Veredito | Evidência |
|---|---|---|
| `P-1` Grão | **atravessa** | PNG 7×7 (@3x) via `ImageBackground`/`repeat` renderiza como esperado — textura sutil, abaixo do limiar de alinhamento, exatamente a intenção da regra. Nenhum artefato de repetição visível. |
| `P-2` Luz sobre a folha | **degrada, mas de forma aceitável** | Sem gradiente radial nativo, a mancha de luz vira um círculo sólido de borda dura (não um esmaecimento). O efeito de "iluminada por uma fonte" é perceptível mas menos sutil que o CSS. Seria candidato a Skia se o produto julgar a borda dura inaceitável — **não foi necessário para os demais 11**. |
| `P-3` Relevo de papel | **atravessa, com ressalva** | `borderTopWidth` 1px claro renderiza, mas o efeito é discreto demais para ler como "relevo" numa captura de tela comum — precisa de luz ambiente/contraste maior no material real. Funcional, não conclusivamente bonito. |
| `P-4` Sombra de objeto pousado | **atravessa — achado positivo não previsto pela spec** | `style.boxShadow` (sintaxe CSS) **funciona nativamente no Android** nesta versão do RN/Fabric (0.86), com blur e cor corretos. `design-system.md` §11 listava isto como `não verificado`/hipótese de fallback via `View` aninhada — **não precisou de fallback nenhum**. Atualizar Anexo A. |
| `P-5` Rotação | **atravessa** (já dado como confirmado; reconfirmado) | `transform: [{rotate}]` sem surpresas. |
| `P-6` Raio irregular | **confirmada** (já dado; reconfirmado) | Só o primeiro eixo por canto, como a spec já registrava. |
| `P-7` Grifo multiplicado | **atravessa — achado positivo não previsto pela spec** | `style.mixBlendMode: 'multiply'` **funciona nativamente no Android** (RN 0.86 Fabric). O grifo escurece o texto sob ele visivelmente, sem overlay ou truque. `design-system.md` §11 dava isto como `não verificado`/hipótese Skia — **não precisou de Skia**. Atualizar Anexo A. |
| `P-8` Carimbo | **atravessa** (já dado; reconfirmado) | |
| `P-9` Botão de papel | **atravessa** | `borderBottomWidth` sólido renderiza como relevo de botão sem gradiente, fiel à receita. (Comportamento de afundar ao toque não foi medido — é interação, não primitiva estática; fica para o Estágio 5/7.) |
| `P-10` Interrupção da pauta | **atravessa** (já dado; reconfirmado) | Objeto opaco sobre `ImageBackground` pautado interrompe as linhas corretamente. |
| `P-11` Métrica tipográfica | **atravessa** (já dado; reconfirmado) | `fontVariant: ['tabular-nums']` funciona. |
| `P-12` Dormência com arte | **atravessa** | Mesma composição de `P-2`/`P-4` em paleta de mesa/dessaturada renderiza sem problema adicional — a limitação de `P-2` (círculo de borda dura) se repete aqui, mesma ressalva. |
| — Versalete | **não atravessa — confirma a spec** | `fontVariant: ['small-caps']` **não tem efeito visível no Android** com Spectral (aqui testado com a fonte padrão do sistema, que já não suporta small-caps sintético). Texto permanece em minúsculas normais. Precisa de face SC real ou o versalete sai da escala, como `design-system.md` §11 já previa. |
| — Corpo justificado | **atravessa — melhor que o previsto** | `textAlign: 'justify'` em `Text` plano do RN **funciona no Android** (bordas retas dos dois lados, exceto última linha). `design-system.md` §11 dava isto como "provável alinhamento à esquerda" — **não foi o observado**. Hifenização, por outro lado, **não** — RN não expõe `hyphens: auto`, confirmando a spec; sem ela, justificado abre rios visíveis em texto estreito (esperado, `Q-DS` já registrava o trade-off). |

**Resumo:** das seis linhas `não verificado`, quatro atravessam melhor do que a spec previa
(`P-4`, `P-7`, justificado — três achados positivos que eliminam a necessidade de Skia para esses
casos) e duas confirmam a degradação esperada (`P-2` círculo duro, versalete sem efeito). Nenhuma
primitiva exigiu Skia neste app de prova — `@shopify/react-native-skia` ficou instalado e não
usado. Isso não invalida a decisão de tê-lo na stack (P-2 pode se beneficiar dele, e o jardim do
Estágio 8 e o card do Estágio 12 dependem dele de qualquer forma), mas **reduz a urgência** de
usá-lo para a assinatura mecânica do dia a dia.

---

## 2. Readium — `Q-ST.1`, `Q-ST.2`, `Q-ST.5`, `Q-ST.8` (Tela B)

Capturas: `specs/medicao/tela-b-*.png`.

### `Q-ST.1` — versão e viabilidade

**Resposta: fixar `react-native-readium@5.0.0`.** Não é mais release candidate — o pacote saiu de
RC para estável no npm desde que `stack.md` foi escrito. Funciona fim a fim (EPUB e PDF abrem,
navegação, metadata, TOC, busca) **depois** das seis correções de build do §0. Não houve
necessidade de considerar o fallback WebView + `foliate-js`.

### `Q-ST.2` — controles nativos vs. overlay

Preferences nativas testadas e confirmadas funcionais: `fontSize`, `textAlign` (incluindo
`justify`), `hyphens` (aceita, ver ressalva abaixo), `theme` (`light`/`sepia`/`dark`, troca de
tema em tempo real sem reiniciar a leitura — capturas mostram `claro`/`sépia`/`escuro`
selecionáveis). A interface nativa do Readium (`Preferences` do pacote) expõe **19 propriedades**,
incluindo `columnCount`, `lineHeight`, `letterSpacing`, `wordSpacing`, `paragraphIndent`,
`paragraphSpacing`, `pageMargins`, `ligatures`, `textNormalization`, `verticalText`,
`publisherStyles`, `scroll`, `spread`, `imageFilter` — cobrindo a maior parte dos dez controles de
`RN-02.16d` diretamente.

**O caso mais duvidoso, `temperatura de cor contínua 2.700–6.500K` (`RN-02.16a`), não tem
equivalente nativo.** O mais próximo é `imageFilter` (`darken`/`invert`, discreto) e `theme`
(3 valores discretos). Uma temperatura contínua vai exigir overlay (camada semitransparente por
cima do `ReadiumView`) ou CSS injetado — a spec já previa isso como o caso mais provável de
precisar de trabalho extra, e a medição confirma.

### Locator estável (`RN-02.9`)

Testado em duas configurações: troca de corpo de fonte (A → A+, ver histórico de progressão nas
capturas) e rotação de tela (retrato → paisagem → retrato, com o EPUB parado numa página de texto
corrido). Em ambos os casos o locator (`href` + `progression`) **permaneceu idêntico** antes e
depois — `href=OEBPS/6260297267691793459_11-h-1.htm.xhtml · progression=0.0000 · total=0.0361` nas
duas orientações. `RN-02.9` confirmado.

### `Q-ST.5` — justificado e hifenização dentro do Readium

**Justificado atravessa dentro do WebView do Readium** (visível na captura de EPUB em texto
corrido — bordas retas dos dois lados). Isso já acontecia mesmo com a preferência `justify`
desligada na UI (a folha de estilo do próprio EPUB do Gutenberg já pede justificado, e o Readium
respeita `publisherStyles` por padrão) — o teste decisivo é que a preferência nativa `textAlign:
'justify'` também existe e força o alinhamento quando o EPUB não pede.

**Hifenização não pôde ser confirmada nem refutada nesta rodada.** A preferência `hyphens: true`
foi aceita sem erro, mas nenhuma palavra na página testada era longa o bastante para exigir quebra
no fim de linha nesse corpo/largura — não apareceu hífen, mas também não havia uma janela
linguística que a exigisse. **Fica como `a confirmar` no Estágio 7**, quando o painel de leitura
tiver controle de largura de coluna mais estreita para forçar o caso.

### `Q-ST.8` — extração de texto de PDF

**Resposta que muda o plano: o PDF abre com texto real (não é imagem, é selecionável/navegável
por progressão), mas a busca full-text não encontra palavras que estão comprovadamente no texto.**
Teste de controle: busca por `"rabbit"` no EPUB retornou 2 resultados com contexto completo
(`specs/medicao/tela-b-busca-epub.png`) — confirma que o mecanismo de busca do app de prova está
correto. A mesma chamada, no PDF, por `"unalienable"` — palavra presente no texto-fonte usado para
gerar o PDF de teste — retornou **0 resultados** (`specs/medicao/tela-b-busca-pdf.png`).

**Isto não decide `Q-ST.8` sozinho** (o PDF de teste foi gerado por `pdfkit`, não é um PDF de
produção real, e o adaptador `readium-adapter-pdfium` pode ter uma via de indexação de texto
diferente da via de busca), mas é evidência concreta de que **a extração de texto do PDF via
Readium não é confiável o bastante para alimentar o índice de caracteres sem verificação
adicional**. `stack.md` §6 já cogitava isso ("se a integração RN não expuser esse texto,
`pdfjs-dist` no momento da importação") — **a recomendação deste relatório é planejar o Estágio 2
com o pipeline `pdfjs-dist` desde o início para PDF**, em vez de tentar a via Readium primeiro e
descobrir a mesma falha depois. Reabrir `Q-ST.8` como `Q-ST.8a`: confirmar com um PDF de produção
real (não gerado por script) antes de descartar de vez a via nativa.

---

## 3. Sinais de sistema — `Q-TEL.1`, `Q-TEL.14` (Tela C)

Captura: `specs/medicao/tela-c-sinais.png`.

- **`AppState` reporta `background`/`active` corretamente** no emulador, com os eventos `blur` e
  `focus` chegando na mesma janela de tempo (mesma leitura de relógio, diferença de ms). O sinal
  básico que `RN-TEL.3` precisa está disponível sem surpresa.
- **`Q-TEL.14` (foco em multi-janela) não foi exercitado** — o emulador não teve o app testado em
  tela dividida ou PiP nesta rodada. Seguem sem resposta; é item da matriz de aparelho físico do
  Estágio 14, não deste app de prova.
- **`Q-TEL.1` (toque cru observável pela camada RN) — parcialmente respondida.** O
  `PanResponder` com `onStartShouldSetPanResponderCapture` foi instalado na raiz da Tela C, mas
  **não dispara um evento próprio nesta implementação** (a função só retorna `false`, não
  captura) — não há evidência de toque cru diferenciado de toque em um `Pressable`. Isso não
  significa que RN não exponha o sinal; significa que este app de prova não testou a via certa.
  **Fica como pendência a refazer no Estágio 6** com uma instrumentação melhor (`onTouchStart` no
  nível da `View` raiz, sem `PanResponder`).
- **Comparação `Date.now` vs. `performance.now` num ciclo de 5s em segundo plano: as duas
  derivas bateram (diferença de 1ms em ~5.429ms totais).** `performance.now` **não** demonstrou
  congelamento neste teste curto no emulador. Isto **não descarta** a necessidade do módulo nativo
  de `elapsedRealtime` do Estágio 6 — o emulador pode não suspender o processo da mesma forma que
  um aparelho físico em Doze, e o teste foi de segundos, não de minutos/horas. Mas é o primeiro
  dado real, e ele empurra a prioridade do módulo nativo para depois de confirmar o comportamento
  em aparelho físico (Estágio 14), não antes.

---

## 4. Veredito final por pergunta

| ID | Resposta |
|---|---|
| `Q-ST.1` | Fixar `react-native-readium@5.0.0` (estável). Sem necessidade do fallback WebView. |
| `Q-ST.2` | 9 dos 10 controles têm preferência nativa direta. Temperatura de cor contínua exige overlay/CSS — único que precisa de trabalho extra confirmado. |
| `Q-ST.5` | Justificado atravessa nativamente dentro do Readium. Hifenização: não testável nesta rodada (nenhuma palavra exigiu quebra) — repetir no Estágio 7. |
| `Q-ST.8` | Texto de PDF não é confiavelmente extraível via busca do Readium (0/1 no teste de controle). Recomendação: `pdfjs-dist` como pipeline primário de PDF no Estágio 2, não como fallback. Reaberta como `Q-ST.8a` (confirmar com PDF de produção real). |
| `Q-TEL.1` | Não respondida — instrumentação desta rodada não testou a via certa. Refazer no Estágio 6. |
| `Q-TEL.14` | Não respondida — exige tela dividida/PiP, fora do escopo deste app de prova. Fica para o Estágio 14. |
| `Q-DS.5` (Skia salva o Anexo A?) | Nenhuma das 12 primitivas exigiu Skia neste app de prova — `P-4` (sombra) e `P-7` (grifo) atravessaram nativamente via `boxShadow`/`mixBlendMode` do RN 0.86 Fabric, contra a expectativa de `stack.md` de que precisariam de Skia. Reduz a urgência, não elimina o uso do Skia (jardim e card continuam precisando dele por outros motivos). |

---

## 5. Pendências abertas que este relatório não fecha

- **`Q-ST.5` (hifenização):** repetir teste com coluna mais estreita no Estágio 7.
- **`Q-ST.8a` (nova, filha de `Q-ST.8`):** repetir teste de busca em PDF de produção real (não
  gerado por script), antes de decidir definitivamente o pipeline de PDF do Estágio 2.
- **`Q-TEL.1`:** reinstrumentar com `onTouchStart` na raiz, sem depender de `PanResponder`.
- **`Q-TEL.14`:** requer teste manual em tela dividida — Estágio 14 (aparelho físico).
- **Deriva de relógio em suspensão longa:** o teste de 5s não substitui o teste de minutos/horas
  em aparelho físico com Doze ativo — Estágio 14.
