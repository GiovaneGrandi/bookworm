// Scaffold do Estágio 2 — vazio de propósito. Navegação, abas e o design system entram no
// Estágio 5 (specs/design-system.md), o leitor no Estágio 7.
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.raiz}>
      <Text>BookWorm — apps/app (scaffold do Estágio 2)</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
