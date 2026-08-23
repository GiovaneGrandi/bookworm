# Fixtures do app de prova (Estágio 1)

Ambos de domínio público, baixados/gerados nesta sessão para medir o Readium.

- **`alice.epub`** — *Alice's Adventures in Wonderland*, Lewis Carroll. Project Gutenberg
  eBook #11, formato EPUB3 com imagens (`https://www.gutenberg.org/ebooks/11.epub3.images`).
  Domínio público nos EUA e no Brasil (autor falecido há mais de 70 anos).
- **`declaracao.pdf`** — *The Declaration of Independence of the United States of America*,
  Thomas Jefferson. Texto-fonte de Project Gutenberg eBook #1
  (`https://www.gutenberg.org/cache/epub/1/pg1.txt`, salvo em `declaracao-fonte.txt`),
  convertido para PDF com texto real (não digitalizado) via `scripts/gerar-pdf-fixture.js`
  (`pdfkit`), A5, corpo justificado, 46 parágrafos. Documento público do governo dos EUA —
  domínio público.

Nenhum dos dois é usado em produto; existem só para o app de prova (`probe/`) medir o
comportamento do `react-native-readium` (Estágio 1 do plano do primeiro protótipo).
