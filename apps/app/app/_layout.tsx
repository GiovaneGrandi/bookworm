import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { BwTransicaoDaMesa } from '../src/componentes/BwTransicaoDaMesa';
import { arquivosDeFonte } from '../src/tema/fontes';

SplashScreen.preventAutoHideAsync();

/**
 * Quem já se ergueu da mesa pela folha que cresce do objeto (BwTransicaoDaMesa) entra sem a
 * animação do sistema; quem vem de outra folha (o livro aberto da gaveta) entra com ela.
 */
const entrada =
  (padrao: 'slide_from_bottom' | 'fade') =>
  ({ route }: { route: { params?: object } }) =>
    ({
      animation: (route.params as { erguido?: string } | undefined)?.erguido ? 'none' : padrao,
    }) as const;

/**
 * Raiz: Stack sem abas (RN-DV.2). A mesa é a primeira tela e o único hub (RN-DV.1); bandeja e
 * gaveta são folhas erguidas dela, e o leitor é modo, não destino (RN-DS.18, RN-DV.9).
 */
export default function Raiz() {
  const { theme } = useUnistyles();
  const [carregadas, erro] = useFonts(arquivosDeFonte);

  useEffect(() => {
    if (carregadas || erro) SplashScreen.hideAsync();
  }, [carregadas, erro]);

  if (!carregadas && !erro) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <BwTransicaoDaMesa>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.sup.mesa.fundo },
              animation: 'slide_from_bottom',
            }}
          >
            <Stack.Screen name="index" options={{ animation: 'fade' }} />
            <Stack.Screen name="bandeja" options={entrada('slide_from_bottom')} />
            <Stack.Screen
              name="gaveta"
              options={({ route }) =>
                (route.params as { erguido?: string } | undefined)?.erguido === 'virada'
                  ? {
                      // A virada de câmera: a estante abre por cima da mesa, que segue à vista
                      // enquanto a câmera gira (BwTransicaoDaMesa).
                      presentation: 'transparentModal',
                      animation: 'none',
                      contentStyle: { backgroundColor: 'transparent' },
                    }
                  : entrada('slide_from_bottom')({ route })
              }
            />
            <Stack.Screen name="leitor/[id]" options={entrada('fade')} />
          </Stack>
        </BwTransicaoDaMesa>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
