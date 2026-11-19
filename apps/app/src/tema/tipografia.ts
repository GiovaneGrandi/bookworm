import type { TextStyle } from 'react-native';
import type { NomeDeFonte } from './fontes';

// A escala vinculante de direcao-visual.md §3.2. Entrelinha sempre em pixel inteiro.
// O tracking da tabela vem em em; aqui vira pixel (em × corpo).
type Estilo = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform'> & {
  fontFamily: NomeDeFonte;
  fontVariant?: TextStyle['fontVariant'];
};

function voz(
  fontFamily: NomeDeFonte,
  fontSize: number,
  lineHeight: number,
  trackingEm = 0,
  extra: Partial<Estilo> = {}
): Estilo {
  return { fontFamily, fontSize, lineHeight, letterSpacing: trackingEm * fontSize, ...extra };
}

export const tipo = {
  corpo: voz('Spectral_400Regular', 16, 27),
  corpoPequeno: voz('Spectral_400Regular', 12, 20),
  tituloCapitulo: voz('Spectral_300Light_Italic', 27, 32, 0.01),
  dadoTabular: voz('Spectral_600SemiBold', 22, 27, 0, { fontVariant: ['tabular-nums'] }),
  microcopy: voz('Spectral_300Light_Italic', 17, 24),
  cartaEditorial: voz('EBGaramond_400Regular_Italic', 17, 27),
  kickerMicro: voz('CourierPrime_400Regular', 7.5, 12, 0.2, { textTransform: 'uppercase' }),
  kicker: voz('CourierPrime_700Bold', 8.5, 13, 0.26, { textTransform: 'uppercase' }),
  kickerAbertura: voz('CourierPrime_700Bold', 10.5, 16, 0.34, { textTransform: 'uppercase' }),
  marginalia: voz('Caveat_400Regular', 16, 18),
  etiquetaManuscrita: voz('Caveat_600SemiBold', 22, 24, 0.01),
  manuscritoDestaque: voz('Caveat_600SemiBold', 34, 36, 0.01),
} satisfies Record<string, Estilo>;

/**
 * A letra dentro dos objetos em miniatura da mesa (mockup B: a página aberta, a capa, as abas
 * do fichário). É desenho do objeto, não texto de leitura: fica fora da escala de §3.2, como a
 * composição sobre o feltro fica fora da escala tônica (RN-DV.8).
 */
export const tipoMiniatura = {
  tituloPagina: voz('Spectral_300Light_Italic', 12, 16),
  folio: voz('Spectral_400Regular', 9, 12, 0, { fontVariant: ['tabular-nums'] }),
  tituloCapa: voz('Spectral_400Regular_Italic', 10, 13),
  aba: voz('CourierPrime_700Bold', 7.5, 15, 0.12, { textTransform: 'uppercase' }),
  placa: voz('CourierPrime_700Bold', 7.5, 12, 0.2, { textTransform: 'uppercase' }),
} satisfies Record<string, Estilo>;
