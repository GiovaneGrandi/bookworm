import { Skia } from '@shopify/react-native-skia';

// Texturas da mesa em SkSL (stack.md, "Skia é o que salva o Anexo A"). São os mesmos padrões de
// pontos do mockup B, desenhados por pixel em vez de repetidos como imagem.

/** Distância ao centro de cada célula de uma grade de pontos. */
const PONTO = `
float ponto(float2 xy, float passo, float2 desloc, float r0, float r1) {
  float2 q = mod(xy - desloc, passo) - passo * 0.5;
  return 1.0 - smoothstep(r0, r1, length(q));
}`;

/** O feltro (`--feltro`): pontos escuros a cada 7 px e claros a cada 5 px sobre a mesa. */
const feltro = Skia.RuntimeEffect.Make(`
uniform half4 base;
uniform half4 claro;
uniform half4 escuro;
${PONTO}
half4 main(float2 xy) {
  half3 c = base.rgb;
  c = mix(c, escuro.rgb, half(escuro.a * ponto(xy, 7.0, float2(2.0, 3.0), 0.7, 0.9)));
  c = mix(c, claro.rgb, half(claro.a * ponto(xy, 5.0, float2(0.0), 0.6, 0.8)));
  return half4(c, 1.0);
}`);

/** O grão de papel 7×7 (P-1, `--grao`), como camada transparente por cima do papel. */
const grao = Skia.RuntimeEffect.Make(`
uniform half4 grao;
${PONTO}
half4 main(float2 xy) {
  half k = half(grao.a * ponto(xy, 7.0, float2(0.0), 0.5, 0.6));
  return half4(grao.rgb * k, k);
}`);

if (!feltro || !grao) throw new Error('Shader da mesa não compilou');

export const shaders = { feltro, grao };

/** Cor do tema como uniforme de shader: [r, g, b, a] de 0 a 1. */
export const uniforme = (cor: string) => Array.from(Skia.Color(cor));
