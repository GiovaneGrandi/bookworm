// Tela B do Estágio 1 — mede Q-ST.1, Q-ST.2, Q-ST.5 e Q-ST.8 com o react-native-readium
// real, abrindo o EPUB e o PDF de assets/livros/.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { ReadiumView } from 'react-native-readium';
import type { ReadiumViewRef, Locator, Preferences, PublicationReadyEvent } from 'react-native-readium';
import { Asset } from 'expo-asset';
import { pigmento, supPapel } from './tokens';

const EPUB_MODULE = require('../assets/livros/alice.epub');
const PDF_MODULE = require('../assets/livros/declaracao.pdf');

type Obra = 'epub' | 'pdf';

export function TelaReadium() {
  const [obra, setObra] = useState<Obra>('epub');
  const [url, setUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(100);
  const [justificado, setJustificado] = useState(false);
  const [hyphens, setHyphens] = useState(false);
  const [tema, setTema] = useState<'light' | 'sepia' | 'dark'>('light');
  const [locator, setLocator] = useState<Locator | null>(null);
  const [ultimaProgressao, setUltimaProgressao] = useState<number[]>([]);
  const [meta, setMeta] = useState<PublicationReadyEvent | null>(null);
  const [buscaResultado, setBuscaResultado] = useState<string>('(nenhuma busca ainda)');
  const ref = useRef<ReadiumViewRef>(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);
    setUrl(null);
    setMeta(null);
    setLocator(null);
    const mod = obra === 'epub' ? EPUB_MODULE : PDF_MODULE;
    Asset.fromModule(mod)
      .downloadAsync()
      .then((asset) => {
        if (!asset.localUri) throw new Error('sem localUri');
        setUrl(asset.localUri);
      })
      .catch((e) => setErro(String(e)))
      .finally(() => setCarregando(false));
  }, [obra]);

  const preferences: Preferences = useMemo(
    () => ({
      fontSize,
      textAlign: justificado ? 'justify' : 'start',
      hyphens,
      theme: tema,
      scroll: false,
    }),
    [fontSize, justificado, hyphens, tema]
  );

  const buscar = async (q: string) => {
    if (!ref.current) return;
    try {
      const pagina = await ref.current.search(q);
      const n = pagina.results?.length ?? 0;
      const primeiro = pagina.results?.[0];
      const trecho = primeiro
        ? `"${primeiro.locator.text?.before ?? ''}[${primeiro.locator.text?.highlight ?? ''}]${primeiro.locator.text?.after ?? ''}"`
        : '';
      setBuscaResultado(`"${q}" → ${n} resultado(s) nesta página. ${trecho}`);
    } catch (e) {
      setBuscaResultado(`"${q}" → erro na busca: ${String(e)}`);
    }
  };

  return (
    <View style={styles.tela}>
      <ScrollView horizontal style={styles.barra} contentContainerStyle={styles.barraConteudo}>
        <Botao ativo={obra === 'epub'} onPress={() => setObra('epub')} label="EPUB" />
        <Botao ativo={obra === 'pdf'} onPress={() => setObra('pdf')} label="PDF" />
        <Botao ativo={fontSize === 80} onPress={() => setFontSize(80)} label="A-" />
        <Botao ativo={fontSize === 100} onPress={() => setFontSize(100)} label="A" />
        <Botao ativo={fontSize === 160} onPress={() => setFontSize(160)} label="A+" />
        <View style={styles.switchLinha}>
          <Text style={styles.switchLabel}>justify</Text>
          <Switch value={justificado} onValueChange={setJustificado} />
        </View>
        <View style={styles.switchLinha}>
          <Text style={styles.switchLabel}>hyphens</Text>
          <Switch value={hyphens} onValueChange={setHyphens} />
        </View>
        <Botao ativo={tema === 'light'} onPress={() => setTema('light')} label="claro" />
        <Botao ativo={tema === 'sepia'} onPress={() => setTema('sepia')} label="sépia" />
        <Botao ativo={tema === 'dark'} onPress={() => setTema('dark')} label="escuro" />
        <Botao ativo={false} onPress={() => buscar(obra === 'epub' ? 'rabbit' : 'unalienable')} label="buscar" />
      </ScrollView>

      <View style={styles.leitorContainer}>
        {carregando && <Text style={styles.status}>carregando…</Text>}
        {erro && <Text style={[styles.status, styles.erro]}>erro: {erro}</Text>}
        {url && (
          <ReadiumView
            ref={ref}
            style={styles.leitor}
            file={{ url }}
            preferences={preferences}
            onLocationChange={(l) => {
              setLocator(l);
              const p = l.locations?.progression;
              if (typeof p === 'number') {
                setUltimaProgressao((prev) => [...prev.slice(-4), p]);
              }
            }}
            onPublicationReady={(e) => setMeta(e)}
          />
        )}
      </View>

      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>
          locator: href={locator?.href ?? '—'} · progression=
          {locator?.locations?.progression?.toFixed(4) ?? '—'} · total=
          {locator?.locations?.totalProgression?.toFixed(4) ?? '—'}
        </Text>
        <Text style={styles.rodapeTexto}>
          histórico de progression (trocar A-/A+/rotação e comparar): [{ultimaProgressao.map((p) => p.toFixed(4)).join(', ')}]
        </Text>
        <Text style={styles.rodapeTexto}>busca: {buscaResultado}</Text>
        <Text style={styles.rodapeTexto}>
          metadata: título={meta?.metadata?.title ?? '—'} · TOC={meta?.tableOfContents?.length ?? '—'} itens
        </Text>
      </View>
    </View>
  );
}

function Botao({ ativo, onPress, label }: { ativo: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} style={[styles.botao, ativo && styles.botaoAtivo]}>
      <Text style={[styles.botaoTexto, ativo && styles.botaoTextoAtivo]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: pigmento.mesa },
  barra: { maxHeight: 56, flexGrow: 0, backgroundColor: '#2a2f2b' },
  barraConteudo: { paddingHorizontal: 8, paddingVertical: 8, gap: 6, alignItems: 'center' },
  botao: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, backgroundColor: '#3a413b' },
  botaoAtivo: { backgroundColor: supPapel.acento },
  botaoTexto: { color: '#dce8f2', fontSize: 12 },
  botaoTextoAtivo: { color: '#fff', fontWeight: '700' },
  switchLinha: { flexDirection: 'row', alignItems: 'center', gap: 4, marginHorizontal: 4 },
  switchLabel: { color: '#dce8f2', fontSize: 11 },
  leitorContainer: { flex: 1, backgroundColor: supPapel.fundo },
  leitor: { flex: 1 },
  status: { color: pigmento.tinta, padding: 16 },
  erro: { color: '#8e2f26' },
  rodape: { backgroundColor: '#2a2f2b', padding: 8, gap: 2 },
  rodapeTexto: { color: '#8a9089', fontSize: 10, fontFamily: 'monospace' },
});
