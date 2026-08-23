// Estágio 5 — carrega as vozes da marca (Spectral, EB Garamond, Courier Prime, Caveat) e as faces
// oferecidas à leitora (Public Sans, Atkinson Hyperlegible) via `expo-font` +
// `@expo-google-fonts/*` (stack.md §3). `fontFamilyPara` traduz `{ voz, peso }` da escala de
// `@bookworm/design` (`direcao-visual.md` §3.2) para o nome exato que `useFonts` registrou —
// nenhum componente escreve um nome de fonte literal.

import type { Voz } from '@bookworm/design';
import {
  AtkinsonHyperlegibleNext_400Regular,
  AtkinsonHyperlegibleNext_700Bold,
} from '@expo-google-fonts/atkinson-hyperlegible-next';
import { Caveat_400Regular, Caveat_600SemiBold } from '@expo-google-fonts/caveat';
import { CourierPrime_400Regular, CourierPrime_700Bold } from '@expo-google-fonts/courier-prime';
import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
} from '@expo-google-fonts/eb-garamond';
import { PublicSans_400Regular } from '@expo-google-fonts/public-sans';
import {
  Spectral_300Light_Italic,
  Spectral_400Regular,
  Spectral_500Medium,
  Spectral_600SemiBold,
} from '@expo-google-fonts/spectral';
import { useFonts } from 'expo-font';

export const fontesParaCarregar = {
  Spectral_400Regular,
  Spectral_500Medium,
  Spectral_600SemiBold,
  Spectral_300Light_Italic,
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  CourierPrime_400Regular,
  CourierPrime_700Bold,
  Caveat_400Regular,
  Caveat_600SemiBold,
  PublicSans_400Regular,
  AtkinsonHyperlegibleNext_400Regular,
  AtkinsonHyperlegibleNext_700Bold,
};

export function useFontesDaMarca() {
  return useFonts(fontesParaCarregar);
}

/** Traduz `{ voz, peso }` de `escalaTipografica` para o nome exato registrado por `useFonts`. */
export function fontFamilyPara(voz: Voz, peso: string): string {
  switch (voz) {
    case 'spectral':
      if (peso.includes('300')) return 'Spectral_300Light_Italic';
      if (peso.startsWith('600')) return 'Spectral_600SemiBold';
      if (peso.startsWith('500')) return 'Spectral_500Medium';
      return 'Spectral_400Regular';
    case 'garamond':
      return peso.includes('italico') ? 'EBGaramond_400Regular_Italic' : 'EBGaramond_400Regular';
    case 'mono':
      return peso.startsWith('700') ? 'CourierPrime_700Bold' : 'CourierPrime_400Regular';
    case 'lapis':
      return peso.startsWith('600') ? 'Caveat_600SemiBold' : 'Caveat_400Regular';
    default:
      return 'Spectral_400Regular';
  }
}

/** `direcao-visual.md` §3.3 — faces da leitora, decisão dela sobre o próprio texto (RN-02.16g). */
export const facesDaLeitora = {
  spectral: 'Spectral_400Regular',
  garamond: 'EBGaramond_400Regular',
  sans: 'PublicSans_400Regular',
  acessivel: 'AtkinsonHyperlegibleNext_400Regular',
  mono: 'CourierPrime_400Regular',
} as const;
