import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

/**
 * Devolve a folha à mesa (RN-DV.1, RN-DV.2). Toda tela volta para a mesa, não para a tela
 * anterior, e o gesto de voltar do sistema faz o mesmo que a faixa de feltro.
 */
export function usePousarNaMesa(): () => void {
  const router = useRouter();

  const pousar = useCallback(() => {
    if (router.canDismiss()) router.dismissAll();
    else router.replace('/');
  }, [router]);

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
