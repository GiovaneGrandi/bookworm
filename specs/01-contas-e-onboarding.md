# 01 — Contas, Papéis e Onboarding

## 1. Objetivo

Estabelecer identidade, papéis e preferências iniciais do usuário, e conduzir o primeiro uso de modo que **a pessoa esteja lendo em menos de 60 segundos** e já tenha conquistado algo antes de configurar qualquer coisa. O onboarding entrega uma vitória primeiro e pede decisões depois; ao final, o usuário sai com ofensiva ativa, jardim plantado, meta definida e uma obra na biblioteca.

Módulo derivado: o rascunho o pressupõe (L95–96 exige "período de onboarding") sem descrevê-lo.

## 2. Escopo

**Dentro:** cadastro e autenticação, papéis Leitor e Autor, perfil público e privado, configurações de conta, fluxo de onboarding, preferências de notificação, exclusão de conta.

**Fora:** cálculo e uso da baseline → [`06-ghost-reader.md`](06-ghost-reader.md). Definição e alteração da meta diária → [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md). Cadastro fiscal e dados bancários do autor → [`09-autores-e-analytics.md`](09-autores-e-analytics.md).

## 3. Personas

Leitor, Autor, Leitor-autor.

---

## 4. User stories

| ID | Story |
|---|---|
| `CON-01` | Como visitante, quero criar conta com e-mail e senha ou provedor social (Apple, Google) para começar a usar o app rapidamente. |
| `CON-02` | Como visitante, quero explorar o feed antes de criar conta para avaliar o produto sem compromisso. |
| `CON-03` | Como novo leitor, quero um onboarding curto que descubra meus gostos para receber recomendações relevantes. |
| `CON-13` | Como novo leitor, quero entender o leitor usando ele, sem tutorial explicativo na tela. |
| `CON-04` | Como novo leitor, quero definir minha meta diária de leitura para que o app saiba o que é sucesso para mim. |
| `CON-05` | Como novo leitor, quero começar lendo imediatamente e conquistar algo antes de configurar qualquer coisa. |
| `CON-06` | Como leitor, quero ativar o papel de autor na mesma conta para publicar sem gerenciar dois logins. |
| `CON-07` | Como usuário, quero editar meu perfil (nome de exibição, avatar, bio) para me apresentar à comunidade. |
| `CON-08` | Como usuário, quero controlar a privacidade das minhas estatísticas para decidir o que é público. |
| `CON-09` | Como usuário, quero configurar horário e tipo de lembrete para manter meu hábito sem me sentir perseguido. |
| `CON-10` | Como usuário, quero exportar e excluir minha conta e meus dados para exercer meus direitos sobre eles. |
| `CON-11` | Como usuário, quero recuperar acesso por e-mail se esquecer a senha. |
| `CON-12` | Como usuário, quero definir meu fuso horário para que a virada do dia da ofensiva faça sentido para mim. |

---

## 5. Regras de negócio

**Identidade e papéis**

- `RN-01.1` Toda conta nasce com o papel **Leitor** ativo. O papel **Autor** é aditivo e ativável a qualquer momento; nunca substitui o de Leitor.
- `RN-01.2` A ativação do papel Autor exige: perfil com nome de exibição e bio preenchidos, e-mail verificado, e aceite dos termos de publicação. Não exige dados bancários — estes só são exigidos no primeiro saque (ver `09`).
- `RN-01.3` E-mail é o identificador único da conta. Um e-mail não pode ter duas contas, independentemente do provedor de login usado; provedores diferentes com o mesmo e-mail verificado são vinculados à mesma conta.
- `RN-01.4` Idade mínima de 13 anos (a validar, conforme jurisdição). Contas entre 13 e 18 anos têm compra de moedas e saque desabilitados, e perfil privado por padrão.

**Onboarding**

- `RN-01.5` **O onboarding começa lendo, não configurando.** A ordem é deliberada: entregar uma vitória antes de pedir qualquer decisão. Cinco passos:
  1. **Ler** — um trecho curto abre direto no leitor imersivo, sem configuração prévia.
  2. **Vencer** — ao terminar o trecho: jardim plantado, ofensiva em 1, primeira recompensa, com a celebração de `RN-04.10b`.
  3. **Interesses** — mínimo 3 gêneros, agora com contexto do que acabou de acontecer.
  4. **Meta diária** — páginas ou minutos (`04`). O usuário já sabe o que "20 minutos" significa, porque acabou de ler.
  5. **Primeira obra** — escolha entre recomendações geradas pelos passos 3 e 4.
- `RN-01.5a` O passo 1 deve levar o usuário a estar lendo em **menos de 60 segundos** após abrir o app (a validar). Qualquer coisa que atrase isso — permissão, tutorial, cadastro completo — vem depois.
- `RN-01.5b` O trecho do passo 1 é **obra em domínio público**, embarcada no aplicativo. Critérios de escolha: leve, curto, de abertura envolvente e neutro em gênero, para não enviesar as recomendações nem exigir esforço de um usuário que ainda não tem vínculo com o produto. Ele funciona também como tutorial silencioso do leitor: virar página, grifar, consultar o dicionário — aprendidos fazendo, sem instrução na tela.
- `RN-01.5c` O cadastro pode ser adiado até o fim do passo 2. O usuário pode **ler e vencer antes de criar conta**; o cadastro é solicitado para preservar o que ele acabou de conquistar, que é o argumento mais forte possível (`CON-02`).
- `RN-01.6` Nenhum passo é obrigatório a partir do 3. Passos pulados usam padrões: gêneros inferidos do feed, meta padrão de 20 minutos.
- `RN-01.7` A meta diária deixa de ser bloqueante. Se o usuário pular o passo 4, a meta padrão vale e ele pode ajustá-la a qualquer momento sem custo (`RN-04.5`) — a ofensiva já existe desde o passo 2 e não pode ficar refém de uma decisão que ele ainda não tem repertório para tomar.

**Baseline**

- `RN-01.8` **Não existe passo de baseline no onboarding.** A leitura do passo 1 é leitura de verdade, medida como qualquer outra (`03`), e alimenta o histórico normalmente.
- `RN-01.9` A baseline é **derivada das 3 primeiras sessões reais** (`RN-06.2`). É mais precisa que a medida de teste — mede leitura genuína, não desempenho sob observação — e devolve ao usuário os 5 minutos que o teste consumia.
- `RN-01.10` Até acumular 3 sessões válidas, a conta fica *não calibrada*.
- `RN-01.11` Conta *não calibrada* tem o Ghost Reader silencioso (`RN-06.2`, `RN-06.11`).

**Perfil e privacidade**

- `RN-01.12` Perfil público exibe, por padrão: nome de exibição, avatar, bio, obras publicadas (se autor) e resenhas públicas. Estatísticas de leitura são **privadas por padrão** e cada bloco (ofensiva, total lido, jardim) pode ser tornado público individualmente.
- `RN-01.13` Não existe exibição pública que permita ordenar usuários por desempenho — nem no perfil, nem em busca, nem em nenhuma superfície (P1, ver `RN-06.8`).
- `RN-01.14` O fuso horário é capturado do dispositivo no cadastro e persistido na conta. Alterá-lo é livre, mas a alteração só passa a valer para o cálculo de ofensiva a partir do dia seguinte, evitando manipulação da virada do dia.

**Notificações**

- `RN-01.15` Padrões de notificação após o onboarding: lembrete diário de leitura no horário escolhido (padrão 20h, a validar) e alerta de ofensiva em risco. Ambos desativáveis individualmente.
- `RN-01.16` Toda notificação segue o tom da persona (`00` §2): convite, nunca cobrança. Copy proibido: culpa, contagem regressiva ameaçadora, comparação com outros usuários.
- `RN-01.17` Máximo de 2 notificações de engajamento por dia (a validar), somando todos os módulos.

**Ciclo de vida da conta**

- `RN-01.18` Exclusão de conta é solicitada no app e executada após 30 dias de carência, período em que o login restaura a conta. Após a execução: dados pessoais são apagados, obras publicadas são despublicadas, resenhas são anonimizadas e o ledger financeiro é retido pelo prazo legal (ver `RN-07.16`).
- `RN-01.19` Autor com saldo de Crédito de Autor pendente não pode concluir a exclusão antes de sacar ou renunciar formalmente ao saldo.
- `RN-01.20` Exportação de dados retorna, em formato legível por máquina: perfil, biblioteca, sessões, destaques, anotações, resenhas e extrato do ledger.

---

## 6. Critérios de aceitação

**`CON-01` — Cadastro**
```
Dado que sou visitante sem conta
Quando concluo o cadastro com e-mail válido e senha
Então recebo e-mail de verificação
E acesso o app já no primeiro passo do onboarding
E meu papel é Leitor com fuso horário capturado do dispositivo
```

**`CON-02` — Exploração sem conta**
```
Dado que abro o app pela primeira vez
Quando escolho "explorar antes de entrar"
Então navego o feed de pílulas em modo somente leitura
E ao tentar salvar, curtir, seguir ou abrir uma obra completa
Então o app pede cadastro explicando o que aquela ação desbloqueia
```

**`CON-05` + `RN-01.5a` — Ler antes de configurar**
```
Dado que abro o aplicativo pela primeira vez
Quando toco na ação principal da tela de boas-vindas
Então estou lendo um trecho no leitor imersivo em menos de 60 segundos
E nenhuma configuração, permissão ou cadastro me foi pedida antes disso
```

**`RN-01.5` passo 2 — Vencer antes de decidir**
```
Dado que terminei de ler o trecho do passo 1
Quando a leitura é concluída
Então vejo a celebração da conquista, com jardim plantado e ofensiva em 1
E só depois disso o app me pede interesses e meta
```

**`CON-04` + `RN-01.7` — Meta não bloqueia**
```
Dado que estou no passo de definição de meta
Quando escolho pular
Então a meta padrão de 20 minutos passa a valer
E minha ofensiva conquistada no passo 2 permanece intacta
E posso alterar a meta depois sem qualquer custo
```

**`RN-01.9` — Baseline sem passo dedicado**
```
Dado que concluí o onboarding
Quando consulto meu perfil
Então não houve nenhum teste de leitura cronometrado
E minha conta está marcada como não calibrada
E após 3 sessões válidas a baseline é derivada do meu histórico real
```

**`CON-06` — Ativação de autor**
```
Dado que sou Leitor com e-mail verificado
Quando ativo o papel Autor e aceito os termos de publicação
Então ganho acesso ao painel do autor na mesma conta
E continuo com acesso integral às funcionalidades de leitor
E nenhum dado bancário me é exigido neste momento
```

**`CON-08` — Privacidade de estatísticas**
```
Dado que sou usuário com ofensiva ativa
Quando não altero nenhuma configuração de privacidade
Então minhas estatísticas de leitura não aparecem no meu perfil público
E ao tornar a ofensiva pública, apenas ela passa a aparecer
```

**`CON-12` — Alteração de fuso**
```
Dado que tenho ofensiva ativa e altero meu fuso horário
Quando o dia corrente ainda está em andamento
Então o cálculo do dia corrente permanece no fuso anterior
E o novo fuso vale a partir da próxima virada de dia
```

**`CON-10` — Exclusão com saldo**
```
Dado que sou Autor com Crédito de Autor maior que zero
Quando solicito exclusão de conta
Então o app bloqueia a solicitação
E oferece sacar o saldo ou renunciar formalmente a ele antes de prosseguir
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Boas-vindas** | Proposta de valor em uma frase, entrar, criar conta, explorar sem conta | Erro (provedor social indisponível) |
| **Cadastro / Login** | E-mail e senha, Apple, Google, recuperação de senha | Carregando, Erro (credencial inválida, e-mail já usado), Offline (bloqueia e explica) |
| **Onboarding 1 — Ler** | Trecho de domínio público no leitor imersivo real, sem cronômetro, sem instrução na tela. Funciona como tutorial silencioso | Offline (o trecho é embarcado no app e sempre funciona) |
| **Onboarding 2 — Vencer** | Celebração: jardim plantado, ofensiva em 1, primeira recompensa. Cadastro solicitado aqui, para preservar o que foi conquistado | Erro (falha de cadastro não pode apagar a conquista: ela é preservada localmente) |
| **Onboarding 3 — Interesses** | Grade de gêneros, seleção múltipla, mínimo 3 | Pulável |
| **Onboarding 4 — Meta** | Alternador páginas/minutos, seletor de valor, sugestão padrão ancorada no que a pessoa acabou de ler | Pulável (assume padrão), Erro (valor fora da faixa) |
| **Onboarding 5 — Primeira obra** | Recomendações derivadas dos passos 3 e 4, ação "adicionar à biblioteca" | Vazio (sem recomendação → catálogo geral), Carregando |
| **Perfil (próprio)** | Avatar, nome, bio, papéis, blocos de estatística com controle de visibilidade | Vazio (sem estatística ainda) |
| **Perfil (público de terceiro)** | Avatar, nome, bio, obras, resenhas públicas, blocos que o dono tornou públicos | Vazio |
| **Configurações** | Conta, privacidade, notificações, fuso, assinatura, dados e exclusão | — |

**Comportamento offline:** cadastro e login exigem conexão. Onboarding iniciado e interrompido por queda de rede retoma do último passo concluído; o trecho de baseline é embarcado no app justamente para funcionar offline.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `Usuario` | id, email, email_verificado, senha_hash, provedores_vinculados[], criado_em, fuso_horario, data_nascimento, status (ativo, exclusão_pendente, excluído) | Identidade |
| `Perfil` | usuario_id, nome_exibicao, avatar_url, bio, papeis[] (leitor, autor), interesses[], intencao | Apresentação e recomendação |
| `PreferenciasPrivacidade` | usuario_id, estatisticas_publicas{ofensiva, total_lido, jardim, resenhas}, perfil_indexavel | Controle do usuário sobre exposição |
| `PreferenciasNotificacao` | usuario_id, lembrete_diario_ativo, lembrete_horario, alerta_ofensiva_ativo, novidades_ativo | Cadência de lembretes |
| `Baseline` | usuario_id, origem (derivada), caracteres_por_minuto, foco_continuo_segundos, interacoes_por_10min, sessoes_consideradas, calibrada_em, status (calibrada, não_calibrada) | Insumo do Ghost Reader, derivado das 3 primeiras sessões reais (`RN-01.9`) |
| `SolicitacaoExclusao` | usuario_id, solicitada_em, executar_em, status | Carência de 30 dias |

Detalhamento consolidado em [`modelo-de-dados.md`](modelo-de-dados.md).

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Criar conta | Cadastro com e-mail/senha ou token de provedor social |
| Autenticar | Emite sessão; retorna estado de onboarding pendente |
| Verificar e-mail | Confirma endereço via token |
| Solicitar redefinição de senha | Envia link por e-mail |
| Obter estado de onboarding | Passos concluídos e próximo passo |
| Registrar passo de onboarding | Persiste interesses, intenção, meta, baseline ou primeira obra |
| Obter trecho de onboarding | Devolve o trecho de domínio público embarcado (`RN-01.5b`) |
| Ativar papel autor | Valida pré-requisitos de `RN-01.2` e ativa o papel |
| Ler / atualizar perfil | Dados de apresentação |
| Ler / atualizar preferências | Privacidade, notificações, fuso |
| Solicitar exportação de dados | Gera pacote assíncrono e notifica quando pronto |
| Solicitar / cancelar exclusão | Inicia ou reverte a carência de 30 dias |

---

## 10. Métricas de sucesso

- Taxa de conclusão integral do onboarding (todos os 5 passos) — alvo ≥ 70% (a validar).
- **Tempo até a primeira página lida** — alvo < 60 s (`RN-01.5a`). É a métrica-mãe do módulo.
- Percentual de contas que concluem o passo 2 (a primeira vitória) — alvo ≥ 85%.
- Percentual de contas que iniciam a primeira sessão de leitura em até 24h do cadastro.
- Retenção D1 / D7 / D30 segmentada por gênero de interesse.
- Taxa de ativação do papel Autor entre contas existentes.
- Taxa de desativação de notificações nos primeiros 7 dias (indicador de cadência abusiva — deve permanecer baixa).

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-01.1` | Idade mínima e tratamento de contas de menores variam por jurisdição. Qual mercado é o alvo inicial (Brasil apenas?) e que regime se aplica (ECA, LGPD, COPPA, GDPR)? |
| `Q-01.2` | Login social: Apple e Google bastam, ou há demanda por outros provedores? Apple é obrigatório se houver qualquer login social no iOS. |
| `Q-01.3` | Qual obra de domínio público será usada no passo 1? Precisa ser leve, curta, de abertura envolvente e neutra em gênero (`RN-01.5b`). Sugestão: testar 3 candidatas e medir a taxa de conclusão do trecho. |
| `Q-01.4` | O produto exige verificação de identidade do autor antes da primeira publicação (para coibir plágio e falsa autoria), ou apenas no saque? |
| `Q-01.5` | Perfis devem ser indexáveis por buscadores na web? Impacta aquisição orgânica e privacidade. |
| `Q-01.6` | Até onde vai o modo convidado? `RN-01.5c` permite ler e vencer antes do cadastro; falta decidir se a conquista sobrevive à desinstalação e por quanto tempo o uso sem conta é tolerado. |
