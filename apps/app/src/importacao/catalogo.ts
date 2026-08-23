// Estágio 7 passo 2 — acervo de domínio público embarcado (`specs/acervo-inicial.md`). Cada
// entrada aponta para um asset do Metro (`require`, ver `metro.config.js` — `.epub` precisou
// entrar em `assetExts`); `Asset.fromModule(...).downloadAsync()` copia o asset para um arquivo
// local de verdade, que é então lido como bytes e passa pelo mesmo `persistirObraEpub` da
// importação do usuário — só a origem e a privacidade mudam (RN-02.1, RN-02.1d).
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { persistirObraEpub } from './persistirObra.js';

export type ObraDoCatalogo = {
  chave: string;
  titulo: string;
  autor: string;
  modulo: number;
};

export const ACERVO_INICIAL: ObraDoCatalogo[] = [
  {
    chave: 'alice',
    titulo: "Alice's Adventures in Wonderland",
    autor: 'Lewis Carroll',
    modulo: require('../../assets/acervo/alice.epub'),
  },
  {
    chave: 'christmas-carol',
    titulo: 'A Christmas Carol',
    autor: 'Charles Dickens',
    modulo: require('../../assets/acervo/christmas-carol.epub'),
  },
  {
    chave: 'jekyll-hyde',
    titulo: 'The Strange Case of Dr Jekyll and Mr Hyde',
    autor: 'Robert Louis Stevenson',
    modulo: require('../../assets/acervo/jekyll-hyde.epub'),
  },
  {
    chave: 'yellow-wallpaper',
    titulo: 'The Yellow Wallpaper',
    autor: 'Charlotte Perkins Gilman',
    modulo: require('../../assets/acervo/yellow-wallpaper.epub'),
  },
  {
    chave: 'flatland',
    titulo: 'Flatland: A Romance of Many Dimensions',
    autor: 'Edwin A. Abbott',
    modulo: require('../../assets/acervo/flatland.epub'),
  },
];

/** RN-02.3 — obra gratuita entra na biblioteca em um toque. */
export async function adicionarDoCatalogo(entrada: ObraDoCatalogo): Promise<string> {
  const asset = await Asset.fromModule(entrada.modulo).downloadAsync();
  if (!asset.localUri) {
    throw new Error(`Asset do acervo "${entrada.chave}" não baixou (localUri ausente).`);
  }
  const bytes = await new File(asset.localUri).bytes();

  return persistirObraEpub({
    bytes,
    titulo: entrada.titulo,
    autor: entrada.autor,
    origem: 'dominio_publico',
    privada: false,
  });
}
