---
name: bookworm-design-system
description: Design system do BookWorm (Papel) — tokens de três camadas, as 12 primitivas, contrato de estados e as regras RN-DS.*/RN-ST.3. Use ao construir ou revisar qualquer componente/tela de apps/app, para não reler design-system.md (531 linhas) nem direcao-visual.md a cada tarefa.
---

# Design system do BookWorm — Papel

Referência operacional para construir componentes em `apps/app`. Fonte vinculante:
`specs/design-system.md` (camada operacional) e `specs/direcao-visual.md` (tese e escala
tipográfica, §3.2). Onde este resumo e a spec divergirem, **manda a spec**.

## A tese, em uma frase

O livro é objeto, não aplicativo. O app é papelaria sobre uma mesa verde-escura — fichas,
herbário, carimbos, etiquetas datilografadas, marginália a lápis. A identidade é **verde**
(`--verde-tinta`), não o oxblood do rascunho original.

## Três camadas de token — nunca pular a do meio

1. **Pigmento** (`packages/design/src/pigmentos.ts`) — valores crus. **Nunca lido por um
   componente** (RN-DS.1). Só `apps/app/src/tema/unistyles.ts` importa `pigmento`.
2. **Superfície** (`packages/design/src/superficies.ts`) — 8 materiais (`mesa`, `papel`,
   `papelFundo`, `sepia`, `kraft`, `vegetal`, `carvao`, `cianotipo`), cada um com os cinco:
   `fundo`, `tinta`, `acento`, `borda`, `sombra` (+ `tintaFraca`). Todo componente declara a
   superfície via prop `superficie?: NomeSuperficie` (default `'papel'`) e lê só
   `theme.sup[superficie].*`, nunca um hex.
3. **Papel semântico** (`packages/design/src/papelSemantico.ts`) — `theme.semantico[superficie]`:
   `acaoPrimaria`, `selecionadoBorda` (acento a 70%), `selecionadoFundo` (âmbar de marca a 16%,
   igual em toda superfície), `dormenciaTinta`, `focoAnel`.

Em `apps/app`, ler o tema com `useSuperficie(nome)` (`src/componentes/useSuperficie.ts`) ou
`useUnistyles()` de `react-native-unistyles` diretamente para `theme.semantico`/`theme.grifo`.

**Os 4 pigmentos de grifo** (`theme.grifo.ambar|oliva|tinta|carmim`) são ferramenta da leitora,
não da marca — não rebindam por superfície, mas também passam pelo tema, nunca por import direto.

## As 12 primitivas — o que atravessa para React Native, o que degrada

Medido em app de prova real (Estágio 1, Expo SDK 57/RN 0.86, Android 14/API 34) —
`specs/medicao-app-de-prova.md` §1 e `design-system.md` §11 (Anexo A). **Nenhuma exigiu Skia.**

| # | Primitiva | Receita RN | Onde no código |
|---|---|---|---|
| P-1 | Grão de papel 7×7px | `ImageBackground` + `resizeMode: repeat`, PNG de `packages/design/assets/grao-7.png` | `src/primitivas/Grao.tsx` |
| P-2 | Luz sobre a folha | Círculo `rgba(255,255,255,α)` posicionado no canto — **degrada**: borda dura, sem esmaecimento radial | `src/primitivas/LuzSobreAFolha.tsx` |
| P-3 | Relevo de papel | `borderTopWidth: 1` + cor clara translúcida — degrada (discreto) | inline, style |
| P-4 | Sombra de objeto pousado | `style.boxShadow` (sintaxe CSS) — **atravessa nativo** no RN 0.86/Fabric, sem fallback | `theme.sup[x].sombra` + `boxShadow` |
| P-5 | Rotação de imperfeição | `transform: [{ rotate }]`, só valores de `src/tema/geometria.ts` (`giro.*`), sinais alternados entre vizinhos | inline |
| P-6 | Raio irregular | Só o primeiro eixo por canto (`borderTopLeftRadius` etc.) — eixo duplo não existe em RN | `src/tema/geometria.ts` (`raio.irregularP/M`) |
| P-7 | Grifo multiplicado | `style.mixBlendMode: 'multiply'` — **atravessa nativo** no RN 0.86/Fabric | `src/primitivas/Grifo.tsx` |
| P-8 | Carimbo | Rotação + opacidade + `borderRadius: 9999` — usa o **acento da superfície**, nunca oxblood | `src/componentes/BwCarimbo.tsx` |
| P-9 | Botão de papel | `borderBottomWidth` sólido, sem gradiente; afunda com `translateY` ao `pressionado` | `src/componentes/BwBotao.tsx` |
| P-10 | Interrupção da pauta | Objeto **opaco** pousado sobre `ImageBackground` pautado (`packages/design/assets/pauta.png`) — nunca deixa a pauta atravessar um cabeçalho/carimbo/ficha | `src/componentes/BwFicha.tsx` |
| P-11 | Métrica como tipografia | `fontVariant: ['tabular-nums']` — nunca gráfico de biblioteca de charts | `BwNumeroCelebracao`, `BwDadoTabular`, `BwProgressoDia` |
| P-12 | Dormência com arte | Mesma composição de P-2/P-4 sobre `mesa`, paleta dessaturada | `src/componentes/BwDormencia.tsx` |

`fontVariant: ['small-caps']` (versalete) **não tem efeito visível no Android** — não usar até
haver uma face Spectral SC real.

## Escala tipográfica — vinculante, nunca reinventar

`packages/design/src/tipografia.ts` (`escalaTipografica`) é a tradução em TS de
`direcao-visual.md` §3.2. Em `apps/app`, resolver o nome exato da fonte carregada com
`fontFamilyPara(voz, peso)` de `src/tema/fontes.ts` — nunca escrever um nome de fonte literal
(`'Spectral'` sozinho não existe; é `'Spectral_400Regular'` etc.). Entrelinha sempre em pixel
inteiro; `--esp-6` (27px) é ao mesmo tempo a entrelinha do corpo, o passo da pauta e o
ancoradouro da escala de espaçamento.

## Escala de espaçamento — só estes nove valores

`3 · 6 · 9 · 12 · 18 · 27 · 36 · 54 · 81` (`packages/design/src/espacamento.ts`). Qualquer
`padding`/`margin`/`gap` fora da lista é erro (RN-DS.4) — varredura automática em
`apps/app/test/design-system/espacamento-na-escala.test.ts`.

## Contrato de oito estados

`src/tema/estados.ts` (`EstadoContrato`): repouso, pressionado, selecionado, desabilitado,
carregando, vazio, erro, offline. Um componente do inventário declara **quais** se aplicam com
`Extract<EstadoContrato, 'a' | 'b'>` — nunca inventa nome de estado novo. **Vazio e dormência
recebem arte** (RN-DS.16, `BwVazio`/`BwDormencia`), nunca texto cinza genérico. Desabilitado é
tinta fraca **e** ausência de sombra, nunca só opacidade.

## Regras que viram erro de tipo ou teste automatizado

- **RN-DS.1 / RN-ST.3** — componente nunca lê pigmento direto; só `tema/unistyles.ts` importa
  `pigmento`. Varredura: `test/design-system/nenhum-pigmento-direto.test.ts`.
- **RN-DS.4** — espaçamento só da escala tônica. Varredura:
  `test/design-system/espacamento-na-escala.test.ts`.
- **RN-DS.7** — borda nunca cinza/preta, sempre tinta marrom translúcida (`theme.sup[x].borda`).
- **RN-DS.8** — raio zero por padrão; círculo só em carimbo e selo.
- **RN-DS.9** — só as seis rotações nomeadas de `geometria.ts` (`giro.*`), sinal alternado entre
  vizinhos.
- **RN-DS.10** — alvo de toque ≥ 48×48dp, mesmo com desenho visível menor (`minHeight: 48` ou
  `hitSlop`). Varredura: `test/design-system/contraste-e-alvo-de-toque.test.ts`.
- **RN-DS.11** — texto nunca abaixo de 4,5:1; kicker sempre tinta forte. Mesmo arquivo de teste
  recalcula o contraste de cada superfície pela fórmula WCAG.
- **RN-DS.12** — componente-metáfora anuncia o **dado**, não a forma (`accessibilityLabel` fala
  o número/texto, nunca "imagem").
- **RN-DS.14** — reduzir movimento não pula a cerimônia (celebração vira estado composto
  estático). Ver `src/tema/movimento.ts` (`duracaoComReduceMotion`).
- **RN-DS.15** — papel não quica; só a curva `curva-carimbo` tem overshoot.
- **RN-DS.16** — os oito estados são contrato.
- **RN-DS.18** — o leitor é modo, não destino: vive fora de `app/(tabs)/`, como rota irmã
  apresentada em tela cheia (`app/leitor.tsx`).

## Onde cada coisa vive

```
packages/design/src/          pigmento · superfície · papel semântico · tipografia · espaçamento
packages/design/assets/       grao-7.png (P-1) · pauta.png (P-10)
apps/app/src/tema/            unistyles.ts (config + módulo aumentado) · geometria.ts (raio/giro/borda)
                               movimento.ts (durações/curvas/háptico) · estados.ts (contrato) · fontes.ts
apps/app/src/primitivas/      Grao · LuzSobreAFolha · Grifo — peças reutilizáveis sem "estado" próprio
apps/app/src/componentes/     as 15 peças do inventário (Bw*) — cada uma com `superficie?` prop
apps/app/app/                 Expo Router: (tabs)/ com as 4 abas, leitor.tsx fora do grupo
apps/app/test/design-system/  as três varreduras automáticas (pigmento, espaçamento, toque/contraste)
apps/app/test/componentes/    snapshot por componente × estado aplicável
```

## Ao criar um componente novo

1. Decide a(s) superfície(s) em que ele pode viver — prop `superficie?: NomeSuperficie`, default
   geralmente `'papel'`.
2. Lê tokens só via `useSuperficie(superficie)` (ou `useUnistyles().theme.semantico/.grifo`) —
   nunca `@bookworm/design`'s `pigmento` nem um hex/rgba de pigmento nomeado.
3. Declara os estados aplicáveis com `Extract<EstadoContrato, ...>` — se vazio/dormência se
   aplicam, desenha arte, não texto cinza.
4. `accessibilityRole`/`accessibilityLabel` anunciam o dado (RN-DS.12).
5. Todo `Pressable` tem `minHeight`/`minWidth` ≥ 48 ou `hitSlop` suficiente.
6. Escreve o snapshot (`test/componentes/`) para cada estado.
