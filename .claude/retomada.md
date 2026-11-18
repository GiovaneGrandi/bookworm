# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 18/11/2026

---

## Operação em curso — recomeço a partir das specs

Em 17/11/2026 o usuário pediu para remover **todo** o código e recomeçar a partir das docs.
Removidos: `apps/`, `packages/`, `probe/`, `patches/`, `node_modules/`, `.turbo/` e a config do
monorepo (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`, `biome.json`,
`tsconfig.base.json`, `.npmrc`), mais os não versionados `docs/como-rodar-para-testar.md` e
`.claude/pendencias-2026-08-24.md`. Mantidos: specs, análises, `mockups/`, `planos/`, `.claude/skills/`.

Decisões do usuário nesta conversa:
- **Remoção não commitada** — fica no working tree para ele revisar/commitar.
- **Lições do protótipo descartadas de propósito** (pins de versão, quirks de build no Windows,
  coordenadas do emulador) — não recriar doc de lições sem ele pedir.
- O código antigo (até `1b903e5`) **não é base** para o recomeço.

### Execução do plano `planos/2026-11-17-primeiras-telas.md`
- **E0 feita** (18/11): commit `b9aac2d` em `master`; trabalho no branch `recomeco/primeiras-telas`.
- **E1 feita** (18/11): core 3 testes, app 13 testes (varreduras de design system), `tsc` e
  Biome limpos; build local instalado no `BookWorm_API34`; as 4 rotas verificadas por screenshot
  (faixa de feltro e voltar do Android devolvem à mesa; leitor revela "pousar na mesa" ao toque).
  Correções que o build exigiu: plugin `expo-splash-screen` com imagem (sem ela o tema nativo
  referencia `splashscreen_logo` e o `processDebugResources` falha).
- **Node 22.23.4 instalado no sistema** (18/11, MSI oficial, a pedido do usuário) no lugar do 20.17;
  a cópia portátil foi apagada. O Expo SDK 55 exige ≥ 20.19.4.
- **Versões:** Expo `55.0.32` (o SDK 55 da stack, mesmo com o 58 publicado), RN 0.83.10,
  Unistyles **3.7.0** (a última que aceita RN < 0.85) + Nitro 0.37.1. `minimumReleaseAge: 20160`
  no `pnpm-workspace.yaml` garante os 14 dias em toda a árvore.
- O plugin `withReadiumAndroidBuildFixes.js` do `1b903e5` **não** entrou na E1: só faz sentido
  junto com o `react-native-readium`, na E3 (o protótipo também usava um patch do pacote).
- `biome migrate --write` foi retido pela trava de segurança — não repetir sem o usuário pedir.
- **E2 feita** (18/11): core 42 testes (índice EPUB, estados, mesa, ULID, `tituloCurto`), app 17
  (varreduras + esquema Drizzle × migração SQL). Verificado no emulador, com screenshot: mesa vazia
  (Q13); importar EPUB (Brás Cubas, #54829) e PDF de 2 páginas por `Download`; arquivo falso
  recusado; acervo Dom Casmurro e Iracema; "Abrir agora" e "Guardar em Quero ler"; gaveta com os 3
  grupos, pausar e tirar (com confirmação, apaga o arquivo); mesa com 2 livros; app morto e reaberto
  com tudo persistido. Índice no Hermes = índice no Node (375.549 caracteres no Dom Casmurro).
- Decisões da E2 que ainda não viraram spec: migrações SQL à mão com `PRAGMA user_version` (sem
  drizzle-kit); o texto do envelope de PDF tirou "contar o tempo de leitura" (não existe ainda);
  BwBotao recebe `rotulo`, não `children` (regra `noReactNativeRawText` do Biome).
- `www.gutenberg.org` respondeu 503 em 18/11; o espelho `gutenberg.pglaf.org` funcionou.
- Para testar no emulador: `MSYS_NO_PATHCONV=1` no Git Bash antes de `adb push ... /sdcard/...`.
- Próxima ação: **o usuário testa a E2**. Depois, a E3 (leitor com `react-native-readium` e o
  painel), começando por fixar a versão do Readium e trazer o plugin de build do `1b903e5`.

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
| **Ideação: 3 direções (B adotada)** | `mockups/ideacao/index.html` + 3 direções em `files` | `https://claude.ai/artifact/4wEAmxgGmJdKkySTKqsayh` (formato de URL diferente das demais) |

Local e publicado estão idênticos em todas as sete. Republicar de sessão nova cobra uma
leitura do fonte vivo (~20k tokens/arquivo) — só pagar isso se houver edição real a fazer.

---

## Pendências abertas fora da operação em curso

- `AJ-13` (migrar as três peças de mockup ao catálogo, absorve `AJ-11`) segue aberta.
- `AJ-11` e `AJ-12` seguem **não pedidos** — não começar sem o usuário pedir.
- `Q-DV.7` a `Q-DV.10`, `AJ-1` a `AJ-10` seguem como estavam.
- `Q-ST.8a` (extração de texto de PDF com arquivo de produção real — PDF é recusado no Estágio 7,
  `motivo: 'pdf_nao_suportado'`), `Q-ST.5` (hifenização, repetir com coluna estreita quando o
  painel de leitura existir), `Q-TEL.1` (reinstrumentar sem `PanResponder`), `Q-TEL.14` (exige
  tela dividida/PiP — Estágio 14).
- `Q-ST.6` (Skia se sustenta com dupla, ou precisa de ilustrador + Rive?) — agora tem um dado
  empírico parcial: a arte do Jardim ficou pronta numa sessão de código, sem asset externo, com
  animação e paleta procedurais. Ainda não é resposta definitiva (é a primeira peça, não uma prova
  de sustentação de longo prazo), mas pesa a favor de "sustenta".
