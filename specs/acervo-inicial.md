# Acervo inicial de domínio público

> Etapa E2 do plano `planos/2026-11-17-primeiras-telas.md` (decisão `Q7`). Três obras brasileiras
> embarcadas no app (`apps/app/assets/acervo/`), de domínio público no Brasil e nos EUA (autores
> falecidos há mais de 70 anos), baixadas do Project Gutenberg em 18/11/2026 no formato EPUB 3
> com imagens, pelo espelho oficial `gutenberg.pglaf.org/cache/epub/<id>/pg<id>-images-3.epub`
> (o `www.gutenberg.org` respondia 503 no dia). As três foram conferidas contra
> `montarIndiceEpub` (`packages/core`) antes de entrar no repositório, e o teste
> `RN-02.10 · acervo embutido` repete a conferência a cada rodada da suíte.

| Arquivo | Obra | Autor | Gutenberg # | Tamanho | Caracteres (índice) |
|---|---|---|---|---|---|
| `dom-casmurro.epub` | Dom Casmurro | Machado de Assis | 55752 | 222 KB | 375.549 |
| `o-cortico.epub` | O cortiço | Aluísio Azevedo | 69187 | 370 KB | 469.393 |
| `iracema.epub` | Iracema | José de Alencar | 67740 | 295 KB | 177.635 |

A substituição do acervo anterior (cinco obras em inglês do protótipo descartado) resolve a
pendência "acervo em português" que ele deixava aberta.

## O que o índice conta, e o que fica de fora

`RN-02.10` exclui capa, ficha catalográfica, sumário e créditos. Nestes três arquivos isso se
traduz assim:

- **Capa** (`wrap0000.xhtml`, só a imagem): 0 caracteres.
- **Sumário** (`toc.xhtml`, documento `nav`): fora da espinha, não conta.
- **Licença e ficha técnica do Gutenberg** (`<header>` e `<footer>` com a classe
  `pg-boilerplate`, no primeiro e no último arquivo do texto): excluídas por elemento. O rodapé
  inteiro dá 0 caracteres. O cabeçalho sai do arquivo que também traz o começo da obra.
- **Folha de rosto da edição original** ("DOM CASMURRO POR MACHADO DE ASSIS… B. L. GARNIER,
  LIVREIRO-EDITOR"): **conta**. `RN-02.10` não lista a folha de rosto entre as exclusões, e
  estes arquivos não a marcam com `epub:type`. São algumas centenas de caracteres, menos de
  0,2% de cada obra. Se a folha de rosto também tiver de sair, a regra precisa dizer isso.

A regra genérica, para qualquer EPUB, está nos testes de `packages/core/test/indice.test.ts`:
`linear="no"`, documento `nav`, `<guide>` do EPUB 2 (`cover`, `toc`, `copyright-page`,
`colophon`), landmarks do nav, `epub:type` (`cover`, `toc`, `copyright-page`, `colophon`,
`credits`, `imprint`), papéis DPUB-ARIA (`doc-cover`, `doc-toc`, `doc-colophon`, `doc-credits`)
e a classe `pg-boilerplate` do Gutenberg.

## Observações sobre os arquivos

- **Ortografia de época.** As edições digitalizadas seguem a grafia do século XIX ("Academia
  Brazileira", "seminario", "auctor"). É o texto da edição-fonte, não erro de conversão.
- **Título com subtítulo.** O `dc:title` de Iracema é "Iracema / com uma noticia biographica do
  auctor". A interface usa `tituloCurto` (`packages/core`), que fica com "Iracema".
- **Ordem na bandeja.** A lista do acervo segue a tabela acima, e a obra já pega aparece como
  "na gaveta" (a chave do acervo é única no banco).

## Onboarding (`Q-01.3`, `RN-01.5b`)

As três candidatas propostas antes (The Yellow Wallpaper, Alice, Flatland) saíram com o acervo em
inglês. `RN-01.5b` continua pedindo uma obra "leve, curta, abertura envolvente, neutra em
gênero", testada com usuários. Nenhuma das três obras atuais foi escolhida para esse papel.
Iracema é a mais curta, mas tem a prosa poética e a grafia mais distantes da leitora de hoje, e
isso pesa contra "leve". A questão segue aberta.

## O que falta

- Capa e sinopse: o título e o autor já vêm do OPF, mas a imagem de capa (`cover-image` no
  manifesto) ainda não é extraída nem mostrada.
- Fluxo de "adicionar à biblioteca em um toque" (`RN-02.3`) a partir de um Catálogo: hoje o
  acervo só existe como lista na bandeja.
