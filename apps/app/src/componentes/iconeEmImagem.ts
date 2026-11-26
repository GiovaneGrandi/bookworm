import { PaintStyle, Skia, StrokeCap, StrokeJoin } from '@shopify/react-native-skia';
import { PixelRatio } from 'react-native';

/**
 * Um ícone de traço (caminho SVG numa grade de 24) virado imagem PNG, desenhado pela Skia na CPU
 * uma vez por ícone, cor e tamanho. Nunca um componente Canvas: cada Canvas é uma superfície GL,
 * e no leitor ela fica por cima da WebView do Readium; destruir uma delas no meio de um quadro
 * derrubava o emulador inteiro (24/11/2026). Imagem não tem superfície para destruir.
 */
const cache = new Map<string, string>();

export function iconeEmImagem(caminhoSvg: string, cor: string, lado: number): string | null {
  const chave = `${caminhoSvg}|${cor}|${lado}`;
  const pronto = cache.get(chave);
  if (pronto) return pronto;
  const px = Math.round(lado * PixelRatio.get());
  const superficie = Skia.Surface.Make(px, px); // CPU, nunca GPU
  const caminho = Skia.Path.MakeFromSVGString(caminhoSvg);
  if (!superficie || !caminho) return null;
  const tinta = Skia.Paint();
  tinta.setAntiAlias(true);
  tinta.setStyle(PaintStyle.Stroke);
  tinta.setStrokeWidth(1.6);
  tinta.setStrokeCap(StrokeCap.Round);
  tinta.setStrokeJoin(StrokeJoin.Round);
  tinta.setColor(Skia.Color(cor));
  const tela = superficie.getCanvas();
  tela.scale(px / 24, px / 24);
  tela.drawPath(caminho, tinta);
  superficie.flush();
  const uri = `data:image/png;base64,${superficie.makeImageSnapshot().encodeToBase64()}`;
  cache.set(chave, uri);
  return uri;
}
