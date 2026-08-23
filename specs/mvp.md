# BookWorm — Escopo do MVP

> Documento de **corte de escopo**, não de especificação. Ele não redefine nem contraria as specs de módulo: decide o que da spec existente entra na primeira versão, o que espera, e por quê.
> Ponto de entrada das specs: [`00-overview.md`](00-overview.md). Toda regra citada aqui vive no módulo de origem.

---

## 1. O que o MVP prova

**Hipótese:** uma pessoa que parou de ler volta a ler com regularidade se o app medir o esforço dela, celebrar no instante em que a meta é batida e mostrar o resultado crescendo — mesmo sem loja, sem moeda, sem feed e sem outras pessoas.

Isso é o produto inteiro reduzido ao seu núcleo: o loop de hábito do **lado leitor**, sozinho.

### O que o MVP não prova, e é preciso dizer

| Não se prova | Onde isso é decidido depois |
|---|---|
| Que autores querem publicar aqui | Fase 2 |
| Que alguém paga por algo | Fase 2 (assinatura de autor) e fase 3 |
| Que o marketplace funciona | Fase 3 — e a spec já o rebaixou a camada secundária (`RN-10.5a`) |
| Que a moeda motiva | Fase 1 |
| Que o feed converte curiosidade em leitura | Fase 2 |

O MVP não é uma versão pequena do BookWorm. É a **aposta central do BookWorm isolada de tudo que a acompanha** — para que, se ela falhar, falhe barato, e se acertar, o resto tenha em cima de que crescer.

---

## 2. Premissas de execução

| Eixo | Valor |
|---|---|
| Equipe | Solo ou dupla |
| Superfície | React Native, **Android primeiro**. iOS na fase 1, web na fase 3 |
| Operação contínua | **Nenhuma.** Sem moderação, sem curadoria diária, sem suporte financeiro, sem revisão de publicação |
| Receita | Zero. O MVP não cobra de ninguém |

A premissa de equipe é a que mais aperta o corte. Uma dupla não opera economia, moderação e pagamento ao mesmo tempo em que constrói um renderer de EPUB e PDF — e cada uma dessas três é uma obrigação que, uma vez assumida, não pode ser pausada.

---

## 3. Os três filtros

Aplicados nesta ordem a cada funcionalidade da spec. Estão escritos aqui para que decisões futuras de escopo sejam tomadas sem reabrir a discussão.

1. **O loop de hábito sobrevive sem isso?** Se não sobrevive, é MVP.
2. **Isso depende de outra pessoa — autor, moderador, curador, pagador — para ter valor?** Se sim, sai: não há a outra pessoa no dia 1.
3. **Isso cria obrigação operacional, financeira ou regulatória contínua?** Se sim, sai.

O que sobra: **um leitor de EPUB e PDF que transforma leitura em hábito medido.**

### Ordem de dependência

```
02 (renderer EPUB/PDF + locator estável)
  └→ 03 (sessão, tempo ativo, Leitura Consciente)
       └→ 04 (meta, ofensiva, jardim)
            └→ 01 (o onboarding É o leitor — RN-01.5)
                 └→ 06 (Ghost Reader)  +  08 (card e heat map)
```

`02` é a raiz. O passo 1 do onboarding (`RN-01.5a`, ler em menos de 60 s) é o leitor real funcionando — o onboarding não é entregável antes dele.

---

## 4. Escopo do MVP, módulo a módulo

### 4.1 `02` — Biblioteca e leitor

Ver [`02-biblioteca-e-leitor.md`](02-biblioteca-e-leitor.md).

| | |
|---|---|
| **Entra** | **Leitor aberto** `RN-02.1`, `RN-02.1a` (EPUB 3 e PDF), `RN-02.1d`, `RN-02.1e`, `RN-02.1f` — com **duas** das três origens: EPUB ou PDF importado pelo usuário e acervo curado de domínio público<br>Leitor imersivo `RN-02.13`–`RN-02.15`, com a âncora de posição `RN-02.13a`–`RN-02.13c`<br>Locator e página canônica `RN-02.9`–`RN-02.12`<br>Preferências e temas de leitura `RN-02.16`, `RN-02.17`<br>Iluminação e conforto `RN-02.16a`, `RN-02.16b`, `RN-02.16d`–`RN-02.16g`<br>Destaques e anotações `RN-02.18`, `RN-02.19`, `RN-02.21`, `RN-02.22`<br>Dicionário `RN-02.20`<br>Biblioteca e estados `RN-02.6`–`RN-02.8`, com a separação Biblioteca/Estante `RN-02.6a`, `RN-02.6b`<br>Offline `RN-02.27`, `RN-02.28`<br>Resposta ao gesto `RN-02.17a`–`RN-02.17d`, `RN-02.17f`<br>Estante `RN-02.22a`, `RN-02.22b`, `RN-02.22f`<br>Stories: `LEI-05`–`LEI-14`, `LEI-16`, `LEI-18`, `LEI-21`–`LEI-24` |
| **Sai** | Catálogo e busca `LEI-01`<br>Página da obra e amostra `LEI-02`, `LEI-03`, `RN-02.2`<br>Aquisição `LEI-04`, `RN-02.3`–`RN-02.5`<br>Resenhas `LEI-15`, `RN-02.23`–`RN-02.26`<br>Gorjeta `LEI-17`<br>Citações colecionáveis e conjuntos `LEI-19`, `LEI-20`, `RN-02.22c`–`RN-02.22e`<br>DRM (`Q-02.2` segue adiada)<br>`RN-02.17e` — é regra declaradamente condicional e reversível; não se constrói o que a própria spec prevê derrubar no teste<br>`RN-02.16c` — ajuste automático de temperatura por hora local; a faixa manual já entrega o valor |

**Nota sobre o painel de leitura.** `RN-02.16d` torna obrigatórios dez controles, e o MVP entrega todos — nenhum deles é recurso de plano pago (`RN-10.2`), e o público-alvo declarado em `P7` é o que mais depende de conforto de leitura. Mas `Q-02.8` registra o risco oposto: um painel de dez controles é um cockpit para quem tem pouca paciência com configuração. O MVP é a primeira oportunidade de medir isso, e a medição faz parte do escopo — não se corta controle antes dela.

`RN-02.16g` fixa o conteúdo do controle de fonte em cinco faces e traz, com a face de alta legibilidade, **o primeiro requisito de acessibilidade tipográfica do produto** — até aqui não havia nenhum, em spec nenhuma. Ele entra no MVP: é uma opção dentro de um controle já obrigatório, não um controle a mais, e portanto não agrava `Q-02.8`. Cortá-lo depois seria remover acessibilidade já entregue, que é uma classe de decisão diferente de adiar um recurso.

**Nota sobre o dicionário.** `RN-02.20` exige dicionário offline embarcado e `Q-02.4` (licença, idiomas, tamanho do app) segue aberta. O MVP mantém o painel com uma fonte PT-BR de licença livre. Se a qualidade não servir, a consulta pode cair sem quebrar a Leitura Consciente: `RN-03.21` garante que a via do foco chega ao topo do score sozinha.

### 4.2 `03` — Sessões e métricas

Ver [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md).

| | |
|---|---|
| **Entra** | Página canônica `RN-03.1`–`RN-03.4`<br>Ciclo de vida da sessão `RN-03.5`–`RN-03.7`<br>Tempo ativo `RN-03.9`–`RN-03.13`, com destaque para `RN-03.12a` (avaliação contínua da meta)<br>Reconciliação offline `RN-03.14`–`RN-03.16`<br>Leitura Consciente e estilos `RN-03.17`–`RN-03.22c`<br>Descarte de sessão `RN-03.29`<br>Agregações recalculáveis `RN-03.30`–`RN-03.32`<br>Integridade: `RN-03.15` (sobreposição) e `RN-03.26` (teto físico de ritmo)<br>Stories: `SES-01`–`SES-09` |
| **Sai** | Antifraude `RN-03.23`, `RN-03.24`, `RN-03.27`, `RN-03.28`<br>Tipos de sessão `amostra` e `pilula` `RN-03.8`, `RN-03.8a` |

**O antifraude sai quase inteiro, e essa é a maior economia de esforço do corte.** `RN-03.24` diz textualmente que *o antifraude defende a economia, não o hábito*. Sem economia, ele não tem o que defender.

Ficam apenas as duas regras que protegem a **integridade do dado**, não a economia: `RN-03.15`, porque sessões sobrepostas corrompem o agregado; e `RN-03.26`, porque sem teto físico a rolagem rápida vira página lida e a própria métrica perde sentido.

Isso resolve de quebra uma tensão que a spec carrega: `RN-03.23` exige que o servidor verifique locators contra o conteúdo real da obra, mas `RN-02.1d` guarda da obra importada (EPUB ou PDF) apenas o mínimo para sincronizar. Sem `RN-03.23`, a contradição desaparece — e volta a ser tratável na fase 1, quando o catálogo próprio existir e a moeda justificar o custo.

### 4.3 `04` — Ofensiva, meta e jardim

Ver [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md).

| | |
|---|---|
| **Entra** | Meta diária, **só o eixo leitura**: `RN-04.1`, `RN-04.2`, `RN-04.4`–`RN-04.8`<br>Cumprimento e celebração instantânea `RN-04.10`–`RN-04.10f`<br>Ofensiva recalculada `RN-04.11`<br>Marcos `RN-04.13`, recorde `RN-04.14`, **ofensiva encerrada preservada `RN-04.14a`**, fuso `RN-04.15`<br>Congelamento `RN-04.17`–`RN-04.21` (ver adaptação em §5)<br>Jardim `RN-04.22` (só o canteiro de leitura), `RN-04.23`–`RN-04.29`<br>**Fechamento semanal** `RN-04.39`<br>Notificações `RN-04.30`–`RN-04.34`<br>Stories: `GAM-01`–`GAM-04`, `GAM-06`, `GAM-07`, `GAM-09`–`GAM-12`, `GAM-14` |
| **Sai** | Eixo de escrita: `RN-04.3`, `RN-04.9`, `RN-04.12`, `RN-04.20`, segundo canteiro, `GAM-05`<br>Desafio semanal sorteado `RN-04.35`–`RN-04.38`, `GAM-13`<br>Sementes e raridade `RN-04.40`–`RN-04.45`, `GAM-15`<br>Compra de congelamento `RN-04.16`, `GAM-08` |

**O eixo de escrita sai porque o autor não existe no MVP** — mas `RN-04.12` (dois eixos independentes) continua valendo como regra de arquitetura: a modelagem nasce com dois eixos, apenas um é exposto. Ver §7.

**O horizonte semanal entra pela metade.** O vazio da semana é o segundo achado mais grave do diagnóstico de game design ([`../analise-game-design/00-diagnostico.md`](../analise-game-design/00-diagnostico.md) §4). Mas `RN-04.35`–`RN-04.38` exigem `CatalogoDesafio` no servidor, sorteio por perfil e avaliação de critério por tipo de desafio. O MVP entrega só `RN-04.39` — o fechamento de domingo, que é cálculo sobre agregados que já existem. O desafio sorteado vai para a fase 1.

### 4.4 `06` — Ghost Reader

Ver [`06-ghost-reader.md`](06-ghost-reader.md).

| | |
|---|---|
| **Entra** | Baseline `RN-06.1`–`RN-06.5`, `RN-06.7`<br>Proibição de comparação social `RN-06.8`–`RN-06.11`<br>Comparação por sessão `RN-06.12`–`RN-06.17`<br>Tom `RN-06.18`–`RN-06.22`<br>Controle do usuário `RN-06.23`–`RN-06.25`<br>Stories: `GHO-01`–`GHO-04`, `GHO-06`–`GHO-08` |
| **Sai** | Baseline segmentada por gênero `RN-06.6`<br>"Minha evolução" `RN-06.26`, `GHO-05` |

Módulo barato — não depende de ranqueamento, imagem, pagamento nem moderação — e é o que sustenta o posicionamento contra ligas e leaderboards. Entra quase inteiro pelo mesmo motivo: **o custo real dele é de redação, não de engenharia.**

`RN-06.6` sai porque, sem catálogo próprio, o gênero vem do metadado do arquivo (EPUB ou PDF) e é pouco confiável (`Q-06.3` sem resposta). `RN-06.26` sai porque uma série mensal precisa de meses de dado para existir — ela nasce naturalmente na fase 1.

### 4.5 `01` — Contas e onboarding

Ver [`01-contas-e-onboarding.md`](01-contas-e-onboarding.md).

| | |
|---|---|
| **Entra** | Onboarding que começa lendo `RN-01.5`–`RN-01.5c`, `RN-01.6`, `RN-01.7`<br>Baseline derivada `RN-01.8`–`RN-01.11`<br>Identidade `RN-01.1`, `RN-01.3`, `RN-01.4`<br>Fuso horário `RN-01.14`<br>Notificações `RN-01.15`–`RN-01.17`<br>LGPD: exportação `RN-01.20` e exclusão com carência `RN-01.18`<br>Stories: `CON-01`, `CON-03`–`CON-05`, `CON-09`–`CON-13` |
| **Sai** | Papel de autor `CON-06`, `RN-01.2`<br>Perfil público `CON-07`, `CON-08`, `RN-01.12`<br>Feed sem conta `CON-02`<br>Crédito de autor pendente `RN-01.19` |

**Exportação e exclusão de dados não são funcionalidade: são obrigação legal.** Entram no MVP em versão simples — exportação em JSON legível por máquina, exclusão com carência de 30 dias.

No MVP **não existe perfil público**: tudo é privado. É mais barato e elimina toda uma superfície de risco. `RN-01.13` (nenhuma superfície ordena usuários por desempenho) continua valendo como restrição herdada de `RN-06.8`.

Autenticação: e-mail/senha e Google. `Q-01.2` (Apple obrigatório no iOS quando há login social) não bloqueia enquanto a superfície for Android.

### 4.6 `08` — Card de sessão e mapa de constância

Ver [`08-social-sharing.md`](08-social-sharing.md).

O princípio P6 diz que o card é o motor de aquisição orgânica. Para uma dupla sem verba de mídia, é a **única** alavanca de crescimento do MVP — por isso entra, em versão reduzida.

| | |
|---|---|
| **Entra** | Card de sessão `RN-08.1`–`RN-08.4`, `RN-08.6`<br>Geração **só no cliente** `RN-08.7`<br>Marca e atribuição `RN-08.13`, `RN-08.14`<br>Mapa de constância `RN-08.17`–`RN-08.22`, só o eixo leitura<br>Exportação `RN-08.24`, `RN-08.26`<br>Cards de marco `RN-08.27`, versão mínima<br>Jardim compartilhável `RN-08.28`<br>Privacidade `RN-08.29`–`RN-08.32`<br>Stories: `SOC-01`, `SOC-03`–`SOC-08`, `SOC-10` |
| **Reduz** | **2 temas, ambos gratuitos** — Minimalista e Dark (`RN-08.10`)<br>**Só o formato 9:16** (`RN-08.22`) |
| **A decidir** | O **adesivo sobre foto** (`RN-08.22a`) é posterior a este corte e ainda não foi alocado a uma fase. `08` §5.7 o trata como a peça de maior circulação esperada, e o MVP tem no compartilhamento sua única alavanca de crescimento — mas ele não estava no escopo quando o corte foi feito. **Não é decisão de mockup**; precisa ser tomada explicitamente antes de a fase começar |
| **Sai** | Cyberpunk e Papel Antigo (fase 1)<br>Temas sazonais `RN-08.11`<br>Tema comprado com moeda<br>Renderer server-side<br>Deep link com atribuição `RN-08.25`<br>Card animado (`Q-08.3`)<br>Restrição de citação e direitos de capa `RN-08.15`, `RN-08.16`, `SOC-09` — vêm do cadastro em `09`, que não existe |

**`Q-08.1` deixa de bloquear no MVP.** A questão — quanto de citação é lícito compartilhar — só existe porque a spec previa obras de terceiros. No MVP, domínio público é livre de restrição, e o EPUB ou PDF importado só sai do dispositivo se o próprio usuário decidir compartilhar. `RN-08.5` (400 caracteres) fica como limite de legibilidade, não como fronteira jurídica.

---

## 5. Adaptações declaradas

Cinco pontos em que o MVP **altera** uma regra vigente. Registrados aqui, com a regra afetada nomeada, para que nenhuma seja confundida com esquecimento.

| # | Regra afetada | O que a spec diz | O que o MVP faz | Por quê |
|---|---|---|---|---|
| A-1 | `RN-04.16`, `GAM-08` | Congelamento é comprado por `CUSTO_STREAK_FREEZE` (200 Sementes) | **Concedido automaticamente: 1 por mês, estoque máximo 2.** `RN-04.17`–`RN-04.19` seguem intactos | Não há moeda no MVP, mas o congelamento é o amortecedor de P2. Uma ofensiva sem ele é cruel, e `RN-04.21` já proíbe vender a reversão |
| A-2 | `RN-04.28` | Cosméticos vêm de moeda **ou** de marco | **Só de marco** (`RN-04.13`): 4 itens, um por marco | Mesma razão. A via da moeda reabre na fase 1 sem alterar a regra |
| A-3 | `RN-04.35`–`RN-04.38` | Toda semana tem desafio sorteado de um catálogo | **Só o fechamento semanal** (`RN-04.39`) | O sorteio exige catálogo server-side e avaliação por tipo de critério. O fechamento é cálculo sobre agregados existentes |
| A-4 | `RN-01.5` passo 5 | "Primeira obra", com recomendação derivada dos interesses e da meta | **"Escolha do acervo de domínio público ou importe um EPUB/PDF"** | Não há catálogo nem motor de recomendação. A intenção do passo — sair do onboarding com uma obra na biblioteca — é preservada |
| A-5 | `RN-03.23`, `RN-03.24`, `RN-03.27`, `RN-03.28` | Antifraude valida a sessão no servidor antes de creditar | **Suspensos.** Permanecem `RN-03.15` e `RN-03.26` | Sem economia não há o que proteger. Ver §4.2 |

**Nenhuma dessas adaptações altera um ID.** As regras continuam existindo nas specs de módulo, com a redação vigente; o MVP declara que não as implementa ainda, ou que as implementa por outra via. Quando a fase 1 chegar, `RN-04.16` volta como está escrita.

---

## 6. Fora do escopo, por fase

| Fase | O que entra | Por que nesta ordem |
|---|---|---|
| **Fase 1 — aprofundar o leitor** | Semente e catálogo cosmético (`07`: `RN-07.1`–`RN-07.1d`, `RN-07.3`–`RN-07.14`, `RN-07.25`–`RN-07.31`); congelamento comprável (`RN-04.16`); sementes e raridade (`RN-04.40`–`RN-04.45`); desafio semanal (`RN-04.35`–`RN-04.38`); citações e conjuntos (`RN-02.22c`–`RN-02.22e`); os 4 temas de card; "Minha evolução" (`RN-06.26`); baseline por gênero (`RN-06.6`); antifraude completo (`RN-03.23`, `RN-03.24`, `RN-03.27`, `RN-03.28`); **iOS** | A moeda só existe se houver onde gastá-la. `RN-07.2` já faz disso condição explícita, e `Q-04.5` é a pergunta que a responde. Antes de um catálogo cosmético real, a Semente é um ledger sem função — com todo o custo de ledger e nenhum do benefício |
| **Fase 2 — abrir o lado autor** | `09` publicação, quests, sprints, marcos de manuscrito, analytics com k-anonimato; **`13` moderação, classificação e controle de conteúdo**; `10` assinatura de autor e tiered limits (`RN-10.3`); catálogo e busca (`LEI-01`); resenhas (`RN-02.23`–`RN-02.26`); eixo de escrita (`RN-04.3`, `RN-04.12`); `05` feed de pílulas | É aqui que a receita começa — o que [`../analise-monetizacao/04-recomendacao.md`](../analise-monetizacao/04-recomendacao.md) §4 chama de "Lançamento". O feed depende de autores publicando: `Q-05.3` registra que, sem eles, ele nasce vazio. **`13` não é opcional nesta fase**: abrir publicação sem política de conteúdo, classificação e processo de denúncia é o que produz a terra de ninguém |
| **Fase 3 — comércio e social** | Venda de obras a 25% (`RN-10.6`); checkout web + Pix (`RN-10.7`–`RN-10.7c`); gorjeta a 10% (`RN-07.15`–`RN-07.22`); BookWorm Plus (`RN-10.2a`); leitura em dupla (`12`); web responsivo | Pagamento traz KYC, obrigação fiscal (`Q-09.1`), anti-steering das lojas (`Q-10.9`) e suporte financeiro. Tudo operação contínua, e nada disso pode ser pausado depois de assumido |
| **Fase 4 — expansão** | IA de audiência para o autor (`RN-09.20a`–`RN-09.20f`); ARC (`RN-09.30`–`RN-09.37`); clubes (`12`); licença institucional (`RN-10.26`–`RN-10.30`); Saldo comprável (`RN-07.2`, `RN-07.23`) | É o "ano 2" já sequenciado em [`../analise-monetizacao/04-recomendacao.md`](../analise-monetizacao/04-recomendacao.md) §4 |

### Recusado, não adiado

Registrado para que nenhuma dessas decisões volte por engano quando o escopo for reaberto:

| Item | Regra |
|---|---|
| Obra seriada com capítulo pago | `RN-10.31` |
| Anúncios no feed | `RN-10.32` |
| Venda de dado individual | `RN-10.33` |
| Leitura ilimitada por assinatura | `RN-10.34` |
| Publicação paga / selo de vaidade | `RN-10.35` |
| Leaderboard público | `RN-06.8` |
| Comprar a ofensiva de volta | `RN-04.21` |
| Loot box paga | `RN-04.42` |
| Notificação de culpa | `RN-01.16` |

### Uma tensão a declarar

`RN-10.2` lista duplas e clubes (`12`) como parte do **núcleo gratuito** do plano Leitor — ou seja, como proposta de valor, não como extra. O MVP os adia mesmo assim, e por uma razão estrutural: `Q-12.2` aponta que **o grafo social não existe em lugar nenhum da spec**. Hoje só há `Seguidor`, que liga leitor a autor. Sem uma resposta para "como duas pessoas viram amigas", `SOC-11` a `SOC-17` não têm por onde começar.

Isto é adiamento consciente, não contradição de `RN-10.2`.

---

## 7. Modelo de dados mínimo

[`modelo-de-dados.md`](modelo-de-dados.md) cataloga cerca de 90 entidades em 14 domínios. O MVP precisa de **17 no núcleo**:

`Usuario` · `Perfil` · `PreferenciasPrivacidade` · `PreferenciasNotificacao` · `PreferenciasLeitura` · `Obra` · `Capitulo` · `ItemBiblioteca` · `ProgressoLeitura` · `SessaoLeitura` · `Destaque` · `Anotacao` · `ConsultaDicionario` · `AgregadoDiario` · `MetaDiaria` · `DiaOfensiva` · `Ofensiva`

Mais dez que sustentam o restante do corte:

`Congelamento` · `JardimUsuario` · `ItemJardim` · `Baseline` · `DesafioGhost` · `ItemEstante` · `TemaCard` · `TemaDesbloqueado` · `PreferenciasCard` · `CardGerado`

### Previstas mas vazias

Nascem modeladas e sem movimento, para que a fase 1 não exija migração:

- `Carteira` e `LancamentoLedger` — a cadeia financeira existe no esquema; nenhum lançamento é gravado.
- A **segunda `Ofensiva`**, do eixo escrita. O relacionamento `Usuario 1──2 Ofensiva` do §2 do modelo de dados permanece válido; o MVP expõe apenas uma.

### Invariantes que precisam valer desde a primeira linha de código

De [`modelo-de-dados.md`](modelo-de-dados.md) §4. Violá-las depois custa migração:

| Invariante | Regra |
|---|---|
| Locator é a posição canônica | `RN-02.9` |
| Página canônica derivada de caracteres, global e imutável entre obras | `RN-03.2`, `RN-03.3` |
| Sessões não se sobrepõem; cada uma pertence a exatamente um dia no fuso do usuário | `RN-03.15`, `RN-03.6` |
| Ofensiva é **derivada** de `DiaOfensiva`, nunca contador incremental | `RN-04.11` |
| Agregados recalculáveis a partir de `SessaoLeitura` bruta | `RN-03.32` |
| Conquista celebrada nunca é revertida | `RN-04.10f` |
| Nenhuma entidade permite ordenar usuários por desempenho | `RN-06.8` |
| Obra importada é privada e não alimenta analytics | `RN-02.1d` |

E a nota de implementação que mais importa aqui: **o job diário por fuso horário precisa ser idempotente.** Rodar duas vezes não pode consumir dois congelamentos nem recelebrar um dia.

---

## 8. Constantes do MVP

De [`glossario.md`](glossario.md). Todas mantêm a marcação `(a validar)` e todas vivem em configuração de servidor — para um MVP que vai calibrar em campo, isso é requisito de arquitetura, não preferência.

**Em uso:**

`PAGINA_CANONICA_CARACTERES` (1.500) · `IDLE_TIMEOUT_SEGUNDOS` (90) · `SESSAO_TIMEOUT_MINUTOS` (30) · `SESSAO_MINIMA_SEGUNDOS` (60) · `RITMO_MAXIMO_FISICO` (2.500 c/min) · `MR_PESO_TEMPO` (60) · `MR_PESO_PROFUNDIDADE` (40) · `MR_INTERACAO_ESPERADA` (10 min) · `MR_FOCO_ESPERADO` (20 min) · `META_EXEMPLO_PAGINAS` (15) · `META_EXEMPLO_MINUTOS` (20) · `INTERVALO_ALTERACAO_META` (7 dias) · `MARCOS_OFENSIVA` (7/30/100/365) · `FREEZE_MAX_ESTOQUE` · `FREEZE_MAX_CONSECUTIVOS` (2) · `BASELINE_JANELA_RECALCULO` (mediana das últimas 20, mínimo 3)

**Sem uso no MVP**, por não haver economia, feed, resenha nem autor:

`TETO_MOEDAS_DIARIO` · `CUSTO_STREAK_FREEZE` · `RECOMPENSA_CONCLUSAO_BASE` · `RECOMPENSA_DESAFIO_SEMANAL` · `SEMENTE_DIAS_BROTAR` · `PILULA_TETO_META` · `FEED_LIMITE_SUGESTAO` · `RESENHA_MINIMA_CARACTERES` · `RESENHA_PROGRESSO_MINIMO` · `TAKE_RATE_WEB` · `TAKE_RATE_APP` · `TAKE_RATE_GORJETA` · `K_ANONIMATO` · `CLUBE_MAX_MEMBROS` · `LIMITE_OBRAS_PLANO_FREE` · `DIAS_SEM_ESCREVER` · `QUEST_EXEMPLO_PALAVRAS` · `SPRINT_EXEMPLO_MINUTOS` · `PILULA_PARAGRAFOS`

**Lacuna a preencher.** A carência de 30 dias para exclusão de conta aparece apenas em [`modelo-de-dados.md`](modelo-de-dados.md) §5, sem constante no glossário — e é MVP, por ser obrigação legal. Proposta: `CARENCIA_EXCLUSAO_CONTA` = **30 dias** *(a validar com `Q-01.1`)*.

Duas adaptações de §5 introduzem valores novos, também *(a validar)*:

- `FREEZE_CONCESSAO_MENSAL` = **1** — congelamentos concedidos por mês (A-1).
- `FREEZE_MAX_ESTOQUE` no MVP = **2**, em vez dos 3 de `RN-04.18`, porque a via de acúmulo é a concessão e não a compra.

---

## 9. O jardim

É a única parte do MVP que não é código, e por isso o maior risco de custo. Este documento **responde** `Q-04.4` e `Q-04.5` em vez de deixá-las abertas.

### `Q-04.4` — 2D ilustrado

Não 3D, não isométrico. O 3D multiplica o custo de produção, complica a renderização do card (`RN-08.28`) e não compra nada que `RN-04.23`–`RN-04.27` peçam.

### `Q-04.5` — inventário fechado, dimensionado antes de começar

Toda a tabela é *(a validar)*:

| Item | Quantidade | Regra |
|---|---|---|
| Estágios de canteiro — a cena inteira, não a planta isolada | 5 (broto, muda, planta florida, árvore, bosque) | `RN-04.23` |
| Paleta de dormência, aplicada por filtro sobre os mesmos assets | 1 | `RN-04.25` |
| Elementos diários, posicionados proceduralmente conforme o acervo cresce | conjunto pequeno e reutilizável | `RN-04.24`, `RN-04.27` |
| Cosméticos desbloqueados por marco | 4, um por marco | `RN-04.13`, `RN-04.28` |
| Vida ambiente: vento, luz que acompanha a hora real | animação sobre os assets existentes | `J-11` |

Duas exigências qualitativas que não são detalhe de arte:

**A dormência precisa ser deslumbrante, não apagada.** `RN-04.25` acerta ao não matar o jardim, mas "paleta de outono e menos movimento" vira facilmente "tela cinza e triste", que produz o efeito oposto ao pretendido. Uma dormência feia pune; uma dormência linda convida.

**A vida ambiente é o que faz alguém abrir o app sem ter sido chamado** — e sai barato, porque é animação sobre assets que já existem. Ver `J-11` em [`../analise-game-design/02-juiciness.md`](../analise-game-design/02-juiciness.md).

---

## 10. Questões bloqueantes que restam

O corte dissolve a maior parte dos bloqueios listados hoje no `README.md`, porque quase todos pertencem a camadas que o MVP não constrói:

| Questão | Estado no MVP |
|---|---|
| `Q-02.1` — catálogo | Já resolvida pelo leitor aberto. **Resta curar o acervo inicial de domínio público** — trabalho do MVP, não bloqueio |
| `Q-07.1` — compliance da economia | Não se aplica: não há moeda |
| `Q-10.2` — comissão das lojas | Não se aplica: nada é vendido |
| `Q-09.1` — responsabilidade fiscal do repasse | Não se aplica: não há repasse |
| `Q-11.1` — consentimento de IA | Não se aplica: não há IA |
| `Q-10.1`, `Q-10.3` — limites e preços de plano | Não se aplicam: não há plano |
| `Q-08.1` — limite de citação | Não bloqueia: ver §4.6 |
| `Q-04.4`, `Q-04.5` — jardim | Respondidas em §9 |

**Restam quatro, e nenhuma é regulatória ou financeira:**

| ID | O que trava |
|---|---|
| `Q-03.1` | A página canônica de 1.500 caracteres. Toda métrica, meta, ofensiva e comparação depende dela. **É o único bloqueio verdadeiramente estrutural do MVP** |
| `Q-01.1` | Jurisdição, LGPD/ECA e idade mínima. Define a exportação, a exclusão e o tratamento de menores |
| `Q-01.3` | Qual obra de domínio público abre o passo 1 do onboarding. A spec sugere testar três candidatas e medir conclusão |
| `Q-02.4` | Qual dicionário embarcar — licença, idiomas e impacto no tamanho do app |
| `Q-02.5` | PDF sem camada de texto (digitalizado por imagem) não tem como gerar o índice de caracteres que sustenta locator e progresso (`RN-02.1f`). Recusar na importação ou degradar a métrica? |

Mais um item que não é questão em aberto, e sim trabalho: **a curadoria do acervo inicial de domínio público.** Sem ele o app não tem o que oferecer a quem não traz EPUB ou PDF próprio, e o passo 5 do onboarding (A-4) fica vazio.

---

## 11. Riscos

**R-1 — O renderer EPUB e PDF é o item mais caro, e não deve ser escrito do zero.** `RN-02.9` exige locators estáveis, independentes de tipografia e dispositivo; `RN-02.10` exige progresso por caracteres do conteúdo principal — em PDF, obtido por extração de texto (`stack.md` §6). Paginação, seleção de texto, busca no texto e locator são meses de trabalho. Partir de uma base existente (Readium, `epub.js`, `foliate-js`) em vez de construir do zero é a decisão de maior impacto no cronograma.

**R-2 — A arte do jardim e a camada de juice são o produto, não o acabamento.** `RN-02.17a`–`RN-02.17d`, `RN-04.24` e a coreografia do resumo de sessão (`J-06`, em [`../analise-game-design/02-juiciness.md`](../analise-game-design/02-juiciness.md)) são o que separa este MVP de um app de métricas — e são exatamente o que uma equipe pequena tende a deixar por último e entregar mal. Por isso o inventário de §9 nasce fechado.

**R-3 — Três regras precisam ser implementadas juntas ou nenhuma funciona.** `RN-03.12a` (avaliação contínua da meta no cliente) → `RN-02.14a` (silêncio até a fronteira natural) → `RN-04.10a`–`RN-04.10f` (celebração e ofensiva otimista). É a correção do achado mais caro do diagnóstico de game design: a meta batida às 20h que só era celebrada à meia-noite. Qualquer uma das três sozinha quebra o comportamento.

**R-4 — `RN-06.8` é restrição de arquitetura, não de tela.** Nenhuma superfície — perfil, busca, card, e-mail, push — pode ordenar usuários por desempenho. Custo zero se respeitada desde o início; retrabalho caro se violada e descoberta depois.

**R-5 — A modelagem precisa antecipar a fase 1.** Dois eixos de ofensiva mesmo com um exposto (`RN-04.12`), e a cadeia financeira modelada mesmo sem movimento. Ver §7.

---

## 12. Métricas de sucesso

O MVP é um teste de retenção. As metas de conclusão já estão declaradas em `01` §10 e são reaproveitadas:

| Métrica | Alvo |
|---|---|
| Conclusão do onboarding completo | ≥ 70% *(a validar)* |
| Conclusão do passo 2 — ler e vencer | ≥ 85% *(a validar)* |
| Tempo até a primeira leitura | < 60 s (`RN-01.5a`) |
| Retenção D1 / D7 / D30 | a definir com a primeira coorte |
| Contas com ofensiva ≥ 7 dias | a definir |
| Sessões por semana, por conta ativa | a definir |
| Tempo ativo mediano por semana | a definir |
| Taxa de geração de card por sessão válida | a definir |
| Taxa de compartilhamento sobre cards gerados | a definir |
| Uso de cada controle do painel de leitura, individualmente | instrumentar desde o dia 1 — é o que responde `Q-02.8` |
| Distribuição dos três níveis da âncora de posição (`RN-02.13a`) | instrumentar desde o dia 1 |

As quatro últimas não têm alvo porque não há referência para calibrá-las. A primeira coorte estabelece a linha de base; a segunda passa a ser medida contra ela — que é, aliás, exatamente o que o Ghost Reader faz com o usuário.

**Métrica-canário, herdada de `06`:** a ausência de pedidos de leaderboard na pesquisa com usuários. Se as pessoas pedirem ranking, o produto comunicou mal o que ele é.

---

## 13. Errata das specs

Três inconsistências encontradas na leitura integral e corrigidas nos arquivos de origem. Nenhum ID de regra ou de story foi alterado, conforme a convenção de [`00-overview.md`](00-overview.md) §7.

| Arquivo | Correção |
|---|---|
| [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md) | Duas seções numeradas §5.5 (Horizonte semanal e Notificações). A segunda passou a §5.7, após a §5.6 já existente (Sementes) |
| [`06-ghost-reader.md`](06-ghost-reader.md) | O campo `Baseline.origem` ainda admitia o valor `onboarding`, revogado por `RN-06.2` e `RN-01.8`. Valor removido |
| [`10-monetizacao-planos.md`](10-monetizacao-planos.md) | §5.1 dizia "quatro planos" e listava cinco. Corrigido |

---

## 14. Rastreabilidade — funcionalidade do rascunho → fase

Mesma tabela de [`00-overview.md`](00-overview.md) §6, agora com a coluna de fase.

| # | Funcionalidade | Spec | Fase |
|---|---|---|---|
| 1 | Cards dinâmicos de sessão (Reading Wrap-Up) | `08` | **MVP**, com 2 dos 4 temas |
| 2 | Métricas do card | `03`, `08` | **MVP** |
| 3 | Heat map de constância | `08` | **MVP**, só eixo leitura |
| 4 | Ofensiva de leitura e de escrita | `04` | **MVP** (leitura) · Fase 2 (escrita) |
| 5 | Meta base customizável | `04`, `07` | **MVP** — e alterá-la é gratuito (`RN-04.5`) |
| 6 | Jardim de progresso | `04` | **MVP** |
| 7 | Streak Freeze comprável | `04`, `07` | **MVP** como concessão (A-1) · Fase 1 comprável |
| 8 | Feed vertical de Pílulas Literárias | `05` | Fase 2 |
| 9 | Botão "Continuar Lendo" | `05`, `02` | Fase 2 |
| 10 | Ausência de leaderboard | `06` | **MVP** — é restrição, vale desde o dia 1 |
| 11 | Ghost Reader | `06`, `01` | **MVP** |
| 12 | Indicador de Leitura Consciente | `03`, `06` | **MVP** |
| 13 | Ganho de moedas | `07` | Fase 1 |
| 14 | Gasto de moedas | `07` | Fase 1 |
| 15 | Gorjetas para autores | `07`, `09` | Fase 3 |
| 16 | Missões de escrita (quests) | `09` | Fase 2 |
| 17 | Sprints de foco (Pomodoro) | `09` | Fase 2 |
| 18 | Marketplace com take rate | `10` | Fase 3 |
| 19 | Venda de pacotes de moedas | `07`, `10` | Fase 4 (já adiada por `RN-07.23`) |
| 20 | Analytics do autor: Mapa de Evasão | `09` | Fase 2 |
| 21 | Analytics: frases grifadas, gorjetas | `09` | Fase 2 |
| 22 | Tiered limits | `10`, `09` | Fase 2 |
| 23–26 | IA no leitor | `11` | Fase 4, e reposicionada para o lado autor (`RN-10.2b`) |
| 27 | Brand persona e tom de voz | `00` §2 | **MVP** |
| 28 | Anti-frustração e recusa de competição tóxica | `00` §2, `04`, `06` | **MVP** |
| 29 | Ambientes de troca entre leitores | `12` | Fase 3 (duplas) · Fase 4 (clubes) |

### Funcionalidades derivadas

| Funcionalidade | Spec | Fase |
|---|---|---|
| Contas, autenticação e papéis | `01` | **MVP** (só o papel Leitor) |
| Catálogo e aquisição de obras | `02`, `10` | Fase 2 |
| Leitor de EPUB e PDF, destaques, anotações, dicionário | `02` | **MVP** |
| Publicação de obras pelo autor | `09` | Fase 2 |
| Resenhas | `02` | Fase 2 |
| Notificações | `04`, `06` | **MVP** |
| Social interno: duplas e clubes | `12` | Fase 3 e 4 |
| Coleção e estante | `02` | **MVP** (estante) · Fase 1 (citações e conjuntos) |
| Horizonte semanal | `04` | **MVP** (fechamento) · Fase 1 (desafio) |
| Leitor aberto | `02` | **MVP** — é a fundação |
| ARC e ferramentas de lançamento | `09` | Fase 4 |
| Licença institucional | `10` | Fase 4 |
| Moderação, classificação e controle de conteúdo | `13` | Fase 2 — junto com a publicação, nunca depois |
