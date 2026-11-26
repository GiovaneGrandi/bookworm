import { type PreferenciasLeitura, tocaSomDoPapel, viradaAnimada } from '@bookworm/core';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useFocusEffect } from 'expo-router';
import { type RefObject, useCallback, useEffect } from 'react';
import type { ReadiumViewRef } from 'react-native-readium';
import { definirViradaAnimada, ouvirVolume } from '../../modules/leitor-nativo/src';

/** O som de papel (RN-02.17b): um "fsst" curto, sintetizado para o BookWorm. */
const PAPEL = require('../../assets/leitor/papel.wav');
/** Baixo o bastante para não competir com o texto: confirmação, não efeito. */
const VOLUME_DO_PAPEL = 0.35;
const ETIQUETA_DA_TELA = 'bookworm-leitor';

/**
 * O que o leitor pede do aparelho, cada coisa só enquanto o livro está aberto e na frente:
 * tela acesa, botões de volume virando a página, o jeito de virar e o som do papel. Devolve a
 * função que toca o som numa virada; ela já respeita a escolha e a chave única (RN-02.17f).
 */
export function useAparelhoDoLeitor(
  p: PreferenciasLeitura,
  readium: RefObject<ReadiumViewRef | null>
) {
  const papel = useAudioPlayer(PAPEL);

  useEffect(() => {
    // O som de papel se mistura ao que já toca (um audiolivro, uma música) em vez de pausá-lo.
    setAudioModeAsync({ interruptionMode: 'mixWithOthers', shouldPlayInBackground: false });
  }, []);
  useEffect(() => {
    papel.volume = VOLUME_DO_PAPEL;
  }, [papel]);

  const animada = viradaAnimada(p);
  useEffect(() => definirViradaAnimada(animada), [animada]);

  useFocusEffect(
    useCallback(() => {
      if (!p.telaAcesa) return undefined;
      activateKeepAwakeAsync(ETIQUETA_DA_TELA);
      return () => {
        deactivateKeepAwake(ETIQUETA_DA_TELA);
      };
    }, [p.telaAcesa])
  );

  useFocusEffect(
    useCallback(() => {
      if (!p.viraComVolume) return undefined;
      return ouvirVolume((direcao) => {
        if (direcao === 'avancar') readium.current?.goForward();
        else readium.current?.goBackward();
      });
    }, [p.viraComVolume, readium])
  );

  const tocar = tocaSomDoPapel(p);
  return useCallback(() => {
    if (!tocar) return;
    papel.seekTo(0);
    papel.play();
  }, [tocar, papel]);
}
