import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { type Alvo, useTransicaoDaMesa } from './BwTransicaoDaMesa';

/**
 * Devolve a folha à mesa (RN-DV.1, RN-DV.2). Toda tela volta para a mesa, não para a tela
 * anterior, e o gesto de voltar do sistema faz o mesmo que a faixa de feltro. A folha encolhe
 * até o objeto que abre esta tela, que a mesa registra pela mesma rota.
 *
 * @param cor o papel desta tela, para a folha que encolhe ter a cor dela.
 */
export function usePousarNaMesa(cor: string, alvo: Alvo = 'folha'): () => void {
  const router = useRouter();
  const caminho = usePathname();
  const { pousar: pousarComArte } = useTransicaoDaMesa();

  const pousar = useCallback(() => {
    pousarComArte(caminho, cor, alvo, () => {
      if (router.canDismiss()) router.dismissAll();
      else router.replace('/');
    });
  }, [router, caminho, cor, alvo, pousarComArte]);

  useFocusEffect(
    useCallback(() => {
      const assinatura = BackHandler.addEventListener('hardwareBackPress', () => {
        pousar();
        return true;
      });
      return () => assinatura.remove();
    }, [pousar])
  );

  return pousar;
}
