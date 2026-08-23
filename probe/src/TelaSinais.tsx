// Tela C do Estágio 1 — mede Q-TEL.1 e Q-TEL.14: o que a camada RN observa de AppState, e
// como Date.now/performance.now se comportam num ciclo de suspensão. Registro em lista, mais
// recente no topo, para comparar antes/depois de minimizar o app ou bloquear a tela.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, AppState, Pressable, ScrollView, PanResponder } from 'react-native';
import * as KeepAwake from 'expo-keep-awake';
import { pigmento, supPapel } from './tokens';

type Evento = {
  ts: string;
  tipo: string;
  dateNow: number;
  perfNow: number;
};

export function TelaSinais() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [manterTela, setManterTela] = useState(false);
  const inicioRef = useRef({ dateNow: Date.now(), perfNow: performance.now() });

  const registrar = (tipo: string) => {
    const agora = { dateNow: Date.now(), perfNow: performance.now() };
    setEventos((prev) => [
      { ts: new Date().toLocaleTimeString('pt-BR'), tipo, ...agora },
      ...prev.slice(0, 30),
    ]);
  };

  useEffect(() => {
    registrar('montagem');
    const sub = AppState.addEventListener('change', (estado) => registrar(`AppState → ${estado}`));
    const subFocus = AppState.addEventListener('focus', () => registrar('focus'));
    const subBlur = AppState.addEventListener('blur', () => registrar('blur'));
    return () => {
      sub.remove();
      subFocus.remove();
      subBlur.remove();
    };
  }, []);

  useEffect(() => {
    if (manterTela) {
      KeepAwake.activateKeepAwakeAsync();
      registrar('keep-awake ligado');
    } else {
      KeepAwake.deactivateKeepAwake();
      registrar('keep-awake desligado');
    }
  }, [manterTela]);

  // captura toque cru para responder Q-TEL.1: a camada RN observa o toque dentro do conteúdo?
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        registrar('toque cru capturado (onStartShouldSetPanResponderCapture)');
        return false;
      },
    })
  ).current;

  const deriva = eventos[0]
    ? eventos[0].dateNow - inicioRef.current.dateNow - (eventos[0].perfNow - inicioRef.current.perfNow)
    : 0;

  return (
    <View style={styles.tela} {...panResponder.panHandlers}>
      <View style={styles.barra}>
        <Text style={styles.tituloBarra}>Sinais de sistema — minimize, bloqueie a tela, volte</Text>
        <Pressable style={styles.botao} onPress={() => setManterTela((v) => !v)}>
          <Text style={styles.botaoTexto}>{manterTela ? 'keep-awake: ON' : 'keep-awake: OFF'}</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => registrar('marca manual')}>
          <Text style={styles.botaoTexto}>marcar agora</Text>
        </Pressable>
      </View>

      <Text style={styles.resumo}>
        Date.now − performance.now desde a montagem, no último evento: {deriva.toFixed(0)}ms
        {'\n'}
        (se isso saltar muito depois de o app voltar do segundo plano, é sinal de que
        performance.now congelou com o processo suspenso e Date.now não — a suspeita que o
        Estágio 6 precisa resolver com módulo nativo de elapsedRealtime)
      </Text>

      <ScrollView style={styles.lista}>
        {eventos.map((e, i) => (
          <View key={i} style={styles.linha}>
            <Text style={styles.linhaTs}>{e.ts}</Text>
            <Text style={styles.linhaTipo}>{e.tipo}</Text>
            <Text style={styles.linhaClocks}>
              Date.now={e.dateNow} · performance.now={e.perfNow.toFixed(0)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: pigmento.mesa },
  barra: { backgroundColor: '#2a2f2b', padding: 12, gap: 8 },
  tituloBarra: { color: '#dce8f2', fontSize: 13, fontWeight: '600' },
  botao: { backgroundColor: supPapel.acento, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, alignSelf: 'flex-start' },
  botaoTexto: { color: '#fff', fontWeight: '600', fontSize: 12 },
  resumo: { color: '#8a9089', fontSize: 11, padding: 12, fontFamily: 'monospace' },
  lista: { flex: 1, paddingHorizontal: 12 },
  linha: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#3a413b' },
  linhaTs: { color: '#8a9089', fontSize: 10 },
  linhaTipo: { color: pigmento.ambar, fontSize: 13, fontWeight: '600' },
  linhaClocks: { color: '#dce8f2', fontSize: 10, fontFamily: 'monospace' },
});
