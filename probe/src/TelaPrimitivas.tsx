// Tela A do Estágio 1 — as 12 primitivas de specs/design-system.md §5, cada uma primeiro em
// View nativa (StyleSheet), só recorrendo a artifícios quando a receita CSS não tem
// equivalente direto. Cada cartão traz o ID e a receita RN tentada, para a captura de tela
// servir de evidência ao Anexo A (specs/design-system.md §11).
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { supPapel, pigmento } from './tokens';

function Cartao({
  id,
  titulo,
  receita,
  children,
}: {
  id: string;
  titulo: string;
  receita: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.cartao}>
      <Text style={styles.cartaoId}>
        {id} · {titulo}
      </Text>
      <View style={styles.palco}>{children}</View>
      <Text style={styles.receita}>{receita}</Text>
    </View>
  );
}

export function TelaPrimitivas() {
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>As 12 primitivas — Anexo A</Text>

      <Cartao id="P-1" titulo="Grão de papel" receita="ImageBackground + resizeMode: repeat, PNG 7×7 @3x">
        <ImageBackground
          source={require('../assets/grao-7.png')}
          resizeMode="repeat"
          style={[styles.amostra, { backgroundColor: supPapel.fundo }]}
        />
      </Cartao>

      <Cartao id="P-2" titulo="Luz sobre a folha" receita="RN puro: LinearGradient não existe em View nativa — tentativa via background sólido mais claro no canto">
        <View style={[styles.amostra, { backgroundColor: supPapel.fundo }]}>
          <View style={styles.p2Luz} />
        </View>
      </Cartao>

      <Cartao id="P-3" titulo="Relevo de papel" receita="borderTopWidth 1px + borderTopColor claro (fallback de inset)">
        <View style={[styles.amostra, styles.p3Relevo, { backgroundColor: supPapel.fundo }]} />
      </Cartao>

      <Cartao id="P-4" titulo="Sombra de objeto pousado" receita="style.boxShadow (CSS-like, RN 0.86 Fabric)">
        <View style={styles.palcoClaro}>
          <View style={styles.p4Objeto} />
        </View>
      </Cartao>

      <Cartao id="P-5" titulo="Rotação de imperfeição" receita="transform: [{ rotate }]">
        <View style={styles.palcoClaro}>
          <View style={[styles.chip, { transform: [{ rotate: '-2.4deg' }] }]}>
            <Text style={styles.chipTexto}>etiqueta</Text>
          </View>
        </View>
      </Cartao>

      <Cartao id="P-6" titulo="Raio irregular" receita="borderTopLeftRadius/... por canto (eixo único, confirmado pelo Anexo A)">
        <View style={styles.palcoClaro}>
          <View
            style={[
              styles.chip,
              {
                borderTopLeftRadius: 4,
                borderTopRightRadius: 7,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 8,
              },
            ]}
          >
            <Text style={styles.chipTexto}>ficha</Text>
          </View>
        </View>
      </Cartao>

      <Cartao id="P-7" titulo="Grifo multiplicado" receita="style.mixBlendMode: 'multiply' (RN 0.86 Fabric, experimental)">
        <View style={styles.palcoClaro}>
          <Text style={styles.p7Texto}>
            um trecho <Text style={styles.p7Grifo}>marcado com grifo</Text> no meio da frase
          </Text>
        </View>
      </Cartao>

      <Cartao id="P-8" titulo="Carimbo" receita="rotate + opacity + borderRadius 50%">
        <View style={styles.palcoClaro}>
          <View style={styles.p8Carimbo}>
            <Text style={styles.p8CarimboTexto}>LIDO</Text>
          </View>
        </View>
      </Cartao>

      <Cartao id="P-9" titulo="Botão de papel" receita="borderBottomWidth 2px sólido (sem gradiente) — afunda ao toque não medido aqui (estático)">
        <View style={styles.palcoClaro}>
          <View style={styles.p9Botao}>
            <Text style={styles.p9BotaoTexto}>continuar</Text>
          </View>
        </View>
      </Cartao>

      <Cartao id="P-10" titulo="Interrupção da pauta" receita="fundo opaco sobre ImageBackground pautado">
        <ImageBackground
          source={require('../assets/pauta.png')}
          resizeMode="repeat"
          style={[styles.amostra, { backgroundColor: supPapel.fundo }]}
        >
          <View style={styles.p10Objeto} />
        </ImageBackground>
      </Cartao>

      <Cartao id="P-11" titulo="Métrica como tipografia" receita="fontVariant: ['tabular-nums']">
        <View style={styles.palcoClaro}>
          <Text style={styles.p11Numero}>1.247</Text>
        </View>
      </Cartao>

      <Cartao id="P-12" titulo="Dormência com arte" receita="paleta dessaturada sobre a mesma composição (mesmo teste de P-2/P-4 em tons de mesa)">
        <View style={[styles.amostra, { backgroundColor: pigmento.mesa }]}>
          <View style={styles.p12Dormencia} />
        </View>
      </Cartao>

      <Text style={styles.titulo}>Extras do Anexo A</Text>

      <Cartao id="—" titulo="Versalete" receita="fontVariant: ['small-caps']">
        <View style={styles.palcoClaro}>
          <Text style={styles.versalete}>capítulo primeiro</Text>
        </View>
      </Cartao>

      <Cartao id="—" titulo="Corpo justificado + hifenização" receita="textAlign: 'justify' (RN não expõe hyphens: auto)">
        <View style={styles.palcoClaro}>
          <Text style={styles.justificado}>
            Era uma vez, num entardecer de verão muito comprido, uma leitora que abriu um livro
            velho encontrado sobre a mesa da sala e não parou mais de lê-lo até altas horas da
            noite, esquecendo completamente do relógio.
          </Text>
        </View>
      </Cartao>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: pigmento.mesa },
  conteudo: { padding: 16, gap: 12 },
  titulo: { color: pigmento.ambar, fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 4 },
  cartao: {
    backgroundColor: '#2a2f2b',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  cartaoId: { color: '#dce8f2', fontSize: 13, fontWeight: '600' },
  palco: { minHeight: 90, borderRadius: 4, overflow: 'hidden' },
  palcoClaro: {
    minHeight: 90,
    borderRadius: 4,
    backgroundColor: supPapel.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  amostra: { flex: 1, minHeight: 90 },
  receita: { color: '#8a9089', fontSize: 11, fontFamily: 'monospace' },

  p2Luz: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  p3Relevo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.6)',
  },

  p4Objeto: {
    width: 100,
    height: 60,
    backgroundColor: pigmento.papel,
    borderRadius: 6,
    boxShadow: `0px 4px 8px ${supPapel.sombra}`,
  } as any,

  chip: {
    backgroundColor: pigmento.papel,
    borderWidth: 1,
    borderColor: supPapel.borda,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipTexto: { color: pigmento.tinta, fontSize: 14 },

  p7Texto: { color: pigmento.tinta, fontSize: 15, lineHeight: 22 },
  p7Grifo: {
    backgroundColor: pigmento.pigAmbar,
    mixBlendMode: 'multiply',
  } as any,

  p8Carimbo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#8e2f26',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-14deg' }],
    opacity: 0.75,
  },
  p8CarimboTexto: { color: '#8e2f26', fontWeight: '700', fontSize: 14, letterSpacing: 2 },

  p9Botao: {
    backgroundColor: supPapel.acento,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#1c3b24',
  },
  p9BotaoTexto: { color: '#f3ead9', fontWeight: '600' },

  p10Objeto: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 90,
    height: 40,
    backgroundColor: pigmento.papel,
    borderRadius: 4,
  },

  p11Numero: { fontSize: 32, fontWeight: '700', color: pigmento.tinta, fontVariant: ['tabular-nums'] },

  p12Dormencia: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(230,193,92,0.12)',
  },

  versalete: { fontSize: 18, color: pigmento.tinta, fontVariant: ['small-caps'] },

  justificado: { fontSize: 15, lineHeight: 22, color: pigmento.tinta, textAlign: 'justify' },
});
