// Estágio 7 passo 6 — sobreposição das três ações de seleção (RN-02.18–RN-02.20). RN-02.20:
// "a consulta nunca navega para fora do leitor" — por isso os três modos vivem na mesma folha
// sobreposta que o painel de preferências (Estágio 7 passo 5), nunca uma rota nova.
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { BwBotao } from '../componentes/index.js';
import { useSuperficie } from '../componentes/useSuperficie.js';
import type { NomePigmentoDeGrifo } from '../primitivas/Grifo.js';
import { fontFamilyPara } from '../tema/fontes.js';
import { raio } from '../tema/geometria.js';
import type { ResultadoDicionario } from './dicionario.js';

export type ModoInteracao = 'grifar' | 'anotar' | 'dicionario';

const PIGMENTOS: readonly { chave: NomePigmentoDeGrifo; rotulo: string }[] = [
  { chave: 'ambar', rotulo: 'Âmbar' },
  { chave: 'oliva', rotulo: 'Oliva' },
  { chave: 'tinta', rotulo: 'Tinta' },
  { chave: 'carmim', rotulo: 'Carmim' },
];

/** RN-02.19 — até 2.000 caracteres (a validar). */
const ANOTACAO_MAXIMO_CARACTERES = 2000;

type Props = {
  modo: ModoInteracao;
  textoSelecionado: string;
  aoEscolherPigmento: (pigmento: NomePigmentoDeGrifo) => void;
  aoSalvarNota: (texto: string) => void;
  aoFechar: () => void;
  resultadoDicionario: ResultadoDicionario | null;
};

export function PainelInteracoes({
  modo,
  textoSelecionado,
  aoEscolherPigmento,
  aoSalvarNota,
  aoFechar,
  resultadoDicionario,
}: Props) {
  const sup = useSuperficie('papel');
  const [textoDaNota, setTextoDaNota] = useState('');

  return (
    <View style={[styles.raiz, { backgroundColor: sup.fundo, borderColor: sup.borda }]}>
      <Text
        numberOfLines={2}
        style={[
          styles.trecho,
          { color: sup.tintaFraca, fontFamily: fontFamilyPara('spectral', '400') },
        ]}
      >
        “{textoSelecionado}”
      </Text>

      {modo === 'grifar' && (
        <View style={styles.linhaPigmentos}>
          {PIGMENTOS.map((p) => (
            <PastilhaDePigmento
              key={p.chave}
              chave={p.chave}
              rotulo={p.rotulo}
              aoTocar={() => aoEscolherPigmento(p.chave)}
            />
          ))}
        </View>
      )}

      {modo === 'anotar' && (
        <View style={styles.blocoNota}>
          <TextInput
            multiline
            autoFocus
            maxLength={ANOTACAO_MAXIMO_CARACTERES}
            value={textoDaNota}
            onChangeText={setTextoDaNota}
            placeholder="Escreva sua anotação"
            placeholderTextColor={sup.tintaFraca}
            style={[
              styles.campoDeNota,
              {
                color: sup.tinta,
                borderColor: sup.borda,
                fontFamily: fontFamilyPara('spectral', '400'),
              },
            ]}
          />
          <BwBotao
            superficie="papel"
            rotulo="Salvar anotação"
            desabilitado={textoDaNota.trim().length === 0}
            aoTocar={() => aoSalvarNota(textoDaNota.trim())}
          />
        </View>
      )}

      {modo === 'dicionario' && (
        <View style={styles.blocoDicionario}>
          {resultadoDicionario === null ? (
            <ActivityIndicator color={sup.acento} />
          ) : 'erro' in resultadoDicionario ? (
            <Text
              style={[
                styles.erroDicionario,
                { color: sup.tintaFraca, fontFamily: fontFamilyPara('spectral', '400') },
              ]}
            >
              {resultadoDicionario.erro}
            </Text>
          ) : (
            resultadoDicionario.definicoes.map((definicao, indice) => (
              <Text
                key={definicao}
                style={[
                  styles.definicao,
                  { color: sup.tinta, fontFamily: fontFamilyPara('spectral', '400') },
                ]}
              >
                {indice + 1}. {definicao}
              </Text>
            ))
          )}
        </View>
      )}

      <BwBotao superficie="papel" variante="texto" rotulo="Fechar" aoTocar={aoFechar} />
    </View>
  );
}

function PastilhaDePigmento({
  chave,
  rotulo,
  aoTocar,
}: {
  chave: NomePigmentoDeGrifo;
  rotulo: string;
  aoTocar: () => void;
}) {
  const sup = useSuperficie('papel');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Grifar em ${rotulo.toLowerCase()}`}
      onPress={aoTocar}
      style={styles.pastilha}
    >
      <GrifoSwatch chave={chave} />
      <Text
        style={[
          styles.rotuloPastilha,
          { color: sup.tinta, fontFamily: fontFamilyPara('mono', '400') },
        ]}
      >
        {rotulo}
      </Text>
    </Pressable>
  );
}

// Lê `theme.grifo` (não `pigmento` de `@bookworm/design` — RN-DS.1) via o mesmo hook que o
// primitivo `Grifo` usa; aqui só a cor da pastilha, sem o `mixBlendMode` de texto sobreposto.
function GrifoSwatch({ chave }: { chave: NomePigmentoDeGrifo }) {
  const { theme } = useUnistyles();
  return <View style={[styles.swatch, { backgroundColor: theme.grifo[chave] }]} />;
}

const styles = StyleSheet.create({
  raiz: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    padding: 18,
    gap: 18,
  },
  trecho: { fontSize: 16, fontStyle: 'italic' },
  linhaPigmentos: { flexDirection: 'row', gap: 18, justifyContent: 'center' },
  pastilha: { alignItems: 'center', gap: 6, minHeight: 48, minWidth: 48, justifyContent: 'center' },
  swatch: {
    width: 36,
    height: 36,
    borderTopLeftRadius: raio.irregularP.topLeft,
    borderTopRightRadius: raio.irregularP.topRight,
    borderBottomRightRadius: raio.irregularP.bottomRight,
    borderBottomLeftRadius: raio.irregularP.bottomLeft,
  },
  rotuloPastilha: { fontSize: 9, letterSpacing: 0.2, textTransform: 'uppercase' },
  blocoNota: { gap: 12 },
  campoDeNota: {
    minHeight: 108,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  blocoDicionario: { gap: 9 },
  definicao: { fontSize: 16, lineHeight: 24 },
  erroDicionario: { fontSize: 16 },
});
