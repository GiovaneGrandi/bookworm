// Casca do app (`bw-shell`, design-system.md §6.2). Configura o Unistyles antes de qualquer
// `StyleSheet.create` do resto da árvore (import por efeito colateral, primeira linha), carrega
// as fontes da marca (stack.md §3) e só então monta a navegação. O leitor fica fora do grupo de
// abas — RN-DS.18: é modo, não destino — por isso é uma rota irmã de `(tabs)`, não filha.
//
// `react-native-get-random-values` precisa ser importado antes de qualquer uso de `criarUlid`
// (RN-ST.9) — `ulidx` resolve para o build "browser" no Metro e espera `crypto.getRandomValues`
// global, que o Hermes não tem sem este polyfill instalado como efeito colateral.
import 'react-native-get-random-values';

import '../src/tema/unistyles.js';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSuperficie } from '../src/componentes/useSuperficie.js';
import { useFontesDaMarca } from '../src/tema/fontes.js';

export default function LayoutRaiz() {
  const [fontesCarregadas] = useFontesDaMarca();
  const sup = useSuperficie('mesa');

  if (!fontesCarregadas) {
    return <View style={{ flex: 1, backgroundColor: sup.fundo }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="leitor" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="resumo" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="meta" options={{ presentation: 'fullScreenModal' }} />
          {/* Arnês de validação manual da máquina de estados do Estágio 6 — remover quando o
              leitor real (acima) tiver cobertura equivalente nos 7 cenários do plano. */}
          <Stack.Screen name="leitor-debug" options={{ presentation: 'fullScreenModal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
