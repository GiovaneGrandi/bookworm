// App de prova do Estágio 1 (plano/2026-08-23-primeiro-prototipo-mvp.md). Três telas, sem
// navegação de produto: A = as 12 primitivas, B = Readium (EPUB/PDF), C = sinais de sistema.
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, StatusBar as RNStatusBar, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TelaPrimitivas } from './src/TelaPrimitivas';
import { TelaReadium } from './src/TelaReadium';
import { TelaSinais } from './src/TelaSinais';
import { pigmento } from './src/tokens';

type Aba = 'A' | 'B' | 'C';

export default function App() {
  const [aba, setAba] = useState<Aba>('A');

  return (
    <SafeAreaView style={styles.raiz}>
      <StatusBar style="light" />
      <View style={styles.abas}>
        <AbaBotao label="A · Primitivas" ativo={aba === 'A'} onPress={() => setAba('A')} />
        <AbaBotao label="B · Readium" ativo={aba === 'B'} onPress={() => setAba('B')} />
        <AbaBotao label="C · Sinais" ativo={aba === 'C'} onPress={() => setAba('C')} />
      </View>
      <View style={styles.conteudo}>
        {aba === 'A' && <TelaPrimitivas />}
        {aba === 'B' && <TelaReadium />}
        {aba === 'C' && <TelaSinais />}
      </View>
    </SafeAreaView>
  );
}

function AbaBotao({ label, ativo, onPress }: { label: string; ativo: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.abaBotao, ativo && styles.abaBotaoAtivo]}
      onPress={() => {
        console.log('TAP RECEBIDO', label);
        onPress();
      }}
    >
      <Text style={[styles.abaTexto, ativo && styles.abaTextoAtivo]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: pigmento.mesa,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  abas: { flexDirection: 'row', backgroundColor: pigmento.mesa, borderBottomWidth: 1, borderBottomColor: '#3a413b' },
  abaBotao: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  abaBotaoAtivo: { borderBottomWidth: 2, borderBottomColor: pigmento.ambar },
  abaTexto: { color: '#8a9089', fontSize: 12, fontWeight: '600' },
  abaTextoAtivo: { color: pigmento.ambar },
  conteudo: { flex: 1 },
});
