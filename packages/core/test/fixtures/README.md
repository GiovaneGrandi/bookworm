# Fixtures do índice de caracteres (Estágio 2)

- **`obra-com-sumario-e-creditos.epub`** e **`obra-simples.epub`** — autoria própria, gerados
  por `gerar-fixtures.ts` (roda com `npx tsx test/fixtures/gerar-fixtures.ts` na raiz de
  `packages/core`). Texto placeholder trivial, sem conteúdo de terceiros — não precisam de
  atribuição de licença. A primeira tem `<guide>` com `cover`/`toc`/`copyright-page`,
  propositalmente para exercitar `RN-02.10` (exclusão de capa/sumário/créditos); a segunda não
  tem `<guide>` nenhum, para exercitar o caminho em que nada é excluído.
- **`declaracao.pdf`** — mesma origem do Estágio 1 (`probe/assets/livros/declaracao.pdf`):
  *The Declaration of Independence of the United States of America*, texto de domínio público do
  Project Gutenberg eBook #1, convertido para PDF com texto real via `pdfkit`. Versionado aqui
  por completude do inventário de fixtures do plano; `packages/core` não lê bytes de PDF
  diretamente (a extração é responsabilidade de `apps/app`, via `pdfjs-dist` — `stack.md` §6) —
  os testes de `montarIndicePdf` usam `TextoDePagina[]` construído a partir do mesmo texto-fonte.
