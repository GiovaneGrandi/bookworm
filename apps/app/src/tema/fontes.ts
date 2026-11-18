import { AtkinsonHyperlegible_400Regular } from '@expo-google-fonts/atkinson-hyperlegible';
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
  Spectral_400Regular_Italic,
  Spectral_500Medium,
  Spectral_600SemiBold,
} from '@expo-google-fonts/spectral';

// As quatro vozes da marca (direcao-visual.md §3.1) e as duas faces do painel que não são vozes
// da marca (RN-02.16g): Public Sans e Atkinson Hyperlegible. Só os pesos que a escala usa.
export const arquivosDeFonte = {
  Spectral_300Light_Italic,
  Spectral_400Regular,
  Spectral_400Regular_Italic,
  Spectral_500Medium,
  Spectral_600SemiBold,
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  CourierPrime_400Regular,
  CourierPrime_700Bold,
  Caveat_400Regular,
  Caveat_600SemiBold,
  PublicSans_400Regular,
  AtkinsonHyperlegible_400Regular,
};

export type NomeDeFonte = keyof typeof arquivosDeFonte;
