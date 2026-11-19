# Repositório compartilhado do BookWorm no GitHub

## Contexto
O BookWorm só existe localmente: não há remoto, a branch principal é a `master` (na E0), e a E1–E3 está em
`recomeco/primeiras-telas`. O usuário vai trabalhar com o amigo **guitobia** a partir de agora. O amigo precisa
receber os docs de referência, o código e as skills do Claude.

A `main` precisa ficar travada: só entra PR aprovado pelo outro e com lint, typecheck e testes verdes.

No plano Free, o GitHub só aplica rulesets em repositório público. Por isso o repositório será **público**. Todo o
endurecimento abaixo parte dessa escolha: email fora dos commits, sem licença, scanner de segredos nativo e
aprovação manual para PRs de estranhos.

## Decisões (fechadas no grilling)
| # | Decisão |
|---|---|
| Q1 | Público e gratuito, em `GiovaneGrandi/bookworm` (conta pessoal; guitobia como colaborador com escrita) |
| Q2 | Manter os 28 commits. A varredura não achou segredos, e o repositório tem cerca de 28 MB |
| Q3/Q15 | A E4 entra **direto na `main`** antes de publicar. O primeiro PR fica para depois |
| Q4 | Ruleset na `main` **sem bypass**: PR com 1 aprovação, aprovação cai a cada push e precisa ser de quem não fez o último push, conversas resolvidas, checks obrigatórios com branch atualizada, histórico linear, sem force push e sem apagar a `main` |
| Q5/Q12 | CI com os jobs `lint`, `typecheck` e `test`. Actions fixadas por SHA, token só de leitura, Dependabot com cooldown de 14 dias. Scanner de segredos nativo com bloqueio no push. Aprovação manual para PR de quem não é colaborador. Só `pull_request`. Sem build Android e sem gitleaks |
| Q6 | No repositório ficam só as skills `bookworm-design-system`, `brainstorming` e `frontend-design`. As outras vão para a pasta pessoal do usuário |
| Q7 | Regra do vault em `CLAUDE.local.md`. `retomada.md` local. `.gitignore` com as entradas pessoais. `.claude/settings.json` com regras de deny |
| Q8 | Sem exigir 2FA e sem commits assinados |
| Q9 | Reescrever autor e committer dos commits para `113128462+GiovaneGrandi@users.noreply.github.com` antes do primeiro push |
| Q10 | Sem `LICENSE`. O README declara "Todos os direitos reservados" |
| Q13 | README reorganizado em: o que é → como rodar (Windows e macOS; iOS "ainda não suportado") → como contribuir → mapa da documentação. Mais o `testar-no-emulador.sh` |

## Passos

**0. Registrar o plano.** Copiar este plano para `planos/2026-11-18-repositorio-compartilhado.md` e para o vault,
conforme a memória `planos-no-vault-para-repassar`. Anotar a próxima ação em `.claude/retomada.md`.

**1. E4.** Executar a E4 de `planos/2026-11-17-primeiras-telas.md` na branch atual: arte da mesa em Skia, luminária
com a temperatura da leitura (RN-DV.6), transição do objeto para a folha com Reanimated respeitando reduzir
movimento, e TalkBack. Ao final, fazer o commit e **parar para o usuário testar**. Os passos seguintes só começam
depois que ele aprovar. O `testar-no-emulador.bat` e o `.gitattributes` entram nesse commit.

**2. A branch entra na `main`.**
```
git checkout master
git merge --ff-only recomeco/primeiras-telas
git branch -m master main
git branch -d recomeco/primeiras-telas
```

**3. Arrumação para publicar** (commits direto na `main`, antes das regras existirem):
- **`.gitignore`:** acrescentar `.claude/retomada.md`, `.claude/*.lock`, `.claude/settings.local.json` e
  `CLAUDE.local.md`. Rodar `git rm --cached .claude/retomada.md`; o arquivo continua no disco.
- **Skills:** mover `shadcn`, `web-design-guidelines`, `webapp-testing`, `find-skills` e `.agents/skills/*` para
  `C:\Users\Giovane\.claude-projeto\skills\`, sem sobrescrever nada que já esteja lá. Depois, `git rm` das cópias
  no repositório.
- **`CLAUDE.md`:**
  - Mover a seção "Sincronização com o Obsidian" para um `CLAUDE.local.md` novo.
  - Atualizar "Estado atual: só documentação" e "Não há código no repositório".
  - Acrescentar a regra de trabalho: nunca fazer commit na `main`; toda mudança vai por branch e PR.
  - Marcar o `retomada.md` como local de cada pessoa.
- **`.claude/settings.json`:** regras de `permissions.deny` para `Read(./.env)`, `Read(./.env.*)`,
  `Read(**/*.keystore)`, `Bash(git push --force*)`, `Bash(git push -f*)` e `Bash(git push origin main*)`.
- **`README.md`:** reorganizar conforme a Q13.
  - **Windows:**
    - Node 22, corepack com pnpm 10.34.5 e JDK 17.
    - Android Studio com `ANDROID_HOME` e o AVD com o nome exato `BookWorm_API34` (API 34).
    - `git config core.longpaths true`.
    - `pnpm install` e `testar-no-emulador.bat build`.
  - **macOS:**
    - Homebrew, `node@22`, corepack e `zulu@17`.
    - Android Studio, com as variáveis de ambiente no `~/.zshrc`.
    - AVD arm64 no Apple Silicon.
    - `./testar-no-emulador.sh build`.
  - **Como contribuir:** branch → PR → revisão do outro → CI verde → squash.
  - Corrigir "Não há código ainda" e acrescentar "Todos os direitos reservados".
  - Replicar o README no vault.
- **`testar-no-emulador.sh`:** o par em bash do `.bat` (`testar-no-emulador.bat`, na raiz). Mesmos 4 passos e
  mesmo argumento `build`. SDK em `~/Library/Android/sdk` como padrão. Executável via
  `git update-index --chmod=+x`, e `*.sh text eol=lf` no `.gitattributes`.
- **`.github/workflows/ci.yml`:**
  - `on: pull_request` e `push` na `main`.
  - `permissions: contents: read` e `concurrency` por ref.
  - Jobs `lint` (`pnpm biome ci .`), `typecheck` (`pnpm typecheck`) e `test` (`pnpm test`).
  - Cada job usa `actions/checkout` com `persist-credentials: false`, `pnpm/action-setup`, `actions/setup-node`
    (Node 22, cache pnpm) e `pnpm install --frozen-lockfile`.
  - Fixar as actions pelo SHA de tags com mais de 14 dias, resolvidas via `gh api`.
- **`.github/dependabot.yml`:** ecossistemas `github-actions` e `npm` em `/`, semanal, com `cooldown` de 14 dias e
  atualizações de versão agrupadas.

**4. Reescrever o email.** Com a árvore limpa:
```
git filter-branch --env-filter '<autor e committer → noreply>' -- --all
git for-each-ref refs/original | xargs git update-ref -d   # apaga os backups do filter-branch
git config user.email 113128462+GiovaneGrandi@users.noreply.github.com
```
Pedir ao usuário que ligue no GitHub a opção que bloqueia pushes que exponham o email
(Settings → Emails → "Block command line pushes that expose my email").

**5. Publicar.** `gh repo create GiovaneGrandi/bookworm --public --source . --remote origin`, seguido de
`git push -u origin main`. Esperar o CI do push. Se um teste falhar no Linux (por exemplo, por caminhos), corrigir e
subir de novo antes de ligar as regras: os nomes dos checks precisam ter rodado verdes uma vez.

**6. Configuração do repositório**, via `gh api`:
- **`PATCH /repos/…`:** só squash merge (`allow_merge_commit` e `allow_rebase_merge` falsos),
  `delete_branch_on_merge` verdadeiro, e `security_and_analysis` com `secret_scanning` e
  `secret_scanning_push_protection` ligados.
- **Dependabot:** `PUT …/vulnerability-alerts` e `PUT …/automated-security-fixes`.
- **Actions:**
  - `PUT …/actions/permissions`: só actions de autores verificados ou da própria GitHub, mais `pnpm/action-setup`.
  - `PUT …/actions/permissions/workflow`: `default_workflow_permissions: read` e
    `can_approve_pull_request_reviews: false`.
  - `PUT …/actions/permissions/fork-pr-contributor-approval`: `all_external_contributors`.
- **Ruleset:** `POST …/rulesets`, com target `branch`, include `~DEFAULT_BRANCH`, `enforcement: active` e
  `bypass_actors: []`. Regras:
  - `deletion` e `non_fast_forward`.
  - `required_linear_history`.
  - `pull_request`: 1 aprovação, `dismiss_stale_reviews_on_push`, `require_last_push_approval`,
    `required_review_thread_resolution` e `allowed_merge_methods: [squash]`.
  - `required_status_checks`: `lint`, `typecheck` e `test`, com `strict_required_status_checks_policy: true`.

**7. Convidar o amigo.** `gh api -X PUT repos/GiovaneGrandi/bookworm/collaborators/guitobia -f permission=push`.
Depois, apagar a seção da operação no `retomada.md`.

## Verificação
- **Antes do push:** `git log --all --format='%ae%n%ce' | sort -u` devolve só o endereço noreply.
  `git log --all -p | grep -c <email antigo>` devolve 0.
- **Repositório autossuficiente:** clone novo numa pasta temporária, seguido de
  `pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm test`. O clone precisa ter as 3 skills,
  não ter o `retomada.md` nem caminhos do vault no `CLAUDE.md`, e o `.sh` precisa estar executável.
- **CI:** os 3 jobs verdes no push inicial (`gh run list`, `gh run view`).
- **Trava real:**
  - Um commit de teste local com `git push origin main` precisa ser **recusado**. Depois, `git reset` local.
  - `gh api repos/GiovaneGrandi/bookworm/rules/branches/main` precisa listar as regras.
  - Abrir um PR de teste a partir de uma branch: o botão de merge precisa ficar bloqueado sem a aprovação do outro.
    Depois, fechar o PR e apagar a branch.
- **Configuração:** `gh api repos/GiovaneGrandi/bookworm` mostra squash only e o scanner com bloqueio no push
  ligados.
- **macOS:** não dá para testar daqui. O guitobia valida o tutorial na primeira vez que rodar, se usar Mac.
