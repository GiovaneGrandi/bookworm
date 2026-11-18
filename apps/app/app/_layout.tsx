import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { arquivosDeFonte } from '../src/tema/fontes';

SplashScreen.preventAutoHideAsync();

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
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.sup.mesa.fundo },
            animation: 'slide_from_bottom',
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="bandeja" />
          <Stack.Screen name="gaveta" />
          <Stack.Screen name="leitor/[id]" options={{ animation: 'fade' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
