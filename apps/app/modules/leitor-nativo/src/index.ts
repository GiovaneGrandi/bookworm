import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

export type DirecaoDoVolume = 'avancar' | 'voltar';

type Assinatura = { remove(): void };

type Eventos = { onVolume: (e: { direcao: DirecaoDoVolume }) => void };

type LeitorNativo = {
  definirViradaAnimada(animada: boolean): void;
  ouvirVolume(ligado: boolean): void;
  addListener<K extends keyof Eventos>(evento: K, ouvinte: Eventos[K]): Assinatura;
};

// Opcional: no iOS (e em testes) o módulo não existe, e o leitor segue sem estes ajustes.
const nativo =
  Platform.OS === 'android' ? requireOptionalNativeModule<LeitorNativo>('LeitorNativo') : null;

/** A virada do Readium desliza ou passa de uma vez (vale para toque, volume e arrasto curto). */
export function definirViradaAnimada(animada: boolean): void {
  nativo?.definirViradaAnimada(animada);
}

/**
 * Enquanto houver um ouvinte, os botões de volume viram a página em vez de mudar o volume.
 * Devolve a função que solta os botões.
 */
export function ouvirVolume(aoApertar: (direcao: DirecaoDoVolume) => void): () => void {
  if (!nativo) return () => {};
  const assinatura = nativo.addListener('onVolume', (e) => aoApertar(e.direcao));
  nativo.ouvirVolume(true);
  return () => {
    assinatura.remove();
    nativo.ouvirVolume(false);
  };
}
