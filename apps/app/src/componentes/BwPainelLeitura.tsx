import {
  type Aba,
  aplicar,
  CORPO,
  corpoEfetivo,
  entrelinhaEfetiva,
  FACES,
  type Face,
  type PreferenciasLeitura,
  restaurarAba,
  restaurarTudo,
  TEMPERATURA_LUZ,
} from '@bookworm/core';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BwBotao } from './BwBotao';
import { BwDeslizante } from './BwDeslizante';
import { BwEscolha } from './BwEscolha';

type Props = {
  preferencias: PreferenciasLeitura;
  onMudar: (p: PreferenciasLeitura) => void;
};

const ABAS: { valor: Aba; rotulo: string }[] = [
  { valor: 'luz', rotulo: 'Luz' },
  { valor: 'letra', rotulo: 'Letra' },
  { valor: 'pagina', rotulo: 'Página' },
];

/** A face de cada amostra no próprio painel: a fonte carregada no app com o mesmo desenho. */
const AMOSTRA: Record<Face, string> = {
  spectral: 'Spectral_400Regular',
  eb_garamond: 'EBGaramond_400Regular',
  public_sans: 'PublicSans_400Regular',
  atkinson: 'AtkinsonHyperlegible_400Regular',
  courier_prime: 'CourierPrime_400Regular',
};

const kelvin = (k: number) => `${k.toLocaleString('pt-BR')} K`;
const px = (v: number) => `${v.toLocaleString('pt-BR')} px`;

/**
 * bw-painel-leitura: os 10 controles de RN-02.16d em três instrumentos (direcao-visual.md §9),
 * em meia tela, com o texto real à vista e cada ajuste aplicado na hora (RN-02.16e).
 */
export function BwPainelLeitura({ preferencias: p, onMudar }: Props) {
  const { theme } = useUnistyles();
  const { bottom } = useSafeAreaInsets();
  const [aba, setAba] = useState<Aba>('luz');
  const mudar = (m: Partial<PreferenciasLeitura>) => onMudar(aplicar(p, m));
  const corpo = corpoEfetivo(p);
  const entrelinha = entrelinhaEfetiva(p);
  const face = FACES[p.face];

  return (
    <View style={[estilos.painel, { paddingBottom: bottom }]} accessibilityViewIsModal>
      <View style={estilos.abas}>
        <BwEscolha rotulo="Painel de leitura" opcoes={ABAS} valor={aba} onMudar={setAba} />
      </View>

      <ScrollView key={aba} contentContainerStyle={estilos.controles}>
        {aba === 'luz' && (
          <>
            <BwDeslizante
              rotulo="Temperatura da luz"
              valorFalado={kelvin(p.temperatura)}
              valor={p.temperatura}
              min={TEMPERATURA_LUZ.min}
              max={TEMPERATURA_LUZ.max}
              passo={50}
              grande
              fundoDoTrilho={theme.leituraTrilho}
              onMudar={(temperatura) => mudar({ temperatura })}
            />
            <BwDeslizante
              rotulo="Brilho"
              valorFalado={`${Math.round(p.brilho * 100)}%`}
              valor={p.brilho}
              min={0.2}
              max={1}
              passo={0.05}
              onMudar={(brilho) => mudar({ brilho })}
            />
            <BwEscolha
              rotulo="Tema"
              valor={p.tema}
              onMudar={(tema) => mudar({ tema })}
              opcoes={[
                { valor: 'claro', rotulo: 'Claro' },
                { valor: 'sepia', rotulo: 'Sépia' },
                { valor: 'escuro', rotulo: 'Escuro' },
                { valor: 'preto', rotulo: 'Preto' },
              ]}
            />
          </>
        )}

        {aba === 'letra' && (
          <>
            <BwEscolha
              rotulo="Face"
              empilhado
              valor={p.face}
              onMudar={(f) => mudar({ face: f })}
              opcoes={(Object.keys(FACES) as Face[]).map((f) => ({
                valor: f,
                rotulo: FACES[f].familia,
                estiloRotulo: {
                  fontFamily: AMOSTRA[f],
                  fontSize: 17,
                  lineHeight: 24,
                  letterSpacing: 0,
                  textTransform: 'none',
                },
              }))}
            />
            <BwDeslizante
              rotulo="Corpo"
              valorFalado={px(corpo)}
              valor={corpo}
              min={CORPO.min}
              max={CORPO.max}
              passo={0.5}
              onMudar={(c) => mudar({ ajusteCorpo: c - face.corpo })}
            />
            <BwDeslizante
              rotulo="Entrelinha"
              valorFalado={px(entrelinha)}
              valor={entrelinha}
              min={Math.ceil(corpo * 1.2)}
              max={Math.floor(corpo * 2.2)}
              passo={1}
              onMudar={(e) => mudar({ ajusteEntrelinha: p.ajusteEntrelinha + (e - entrelinha) })}
            />
          </>
        )}

        {aba === 'pagina' && (
          <>
            <BwEscolha
              rotulo="Margens"
              valor={p.margem}
              onMudar={(margem) => mudar({ margem })}
              opcoes={[
                { valor: 'estreita', rotulo: 'Estreitas' },
                { valor: 'media', rotulo: 'Médias' },
                { valor: 'larga', rotulo: 'Largas' },
              ]}
            />
            <BwEscolha
              rotulo="Alinhamento"
              valor={p.alinhamento}
              onMudar={(alinhamento) => mudar({ alinhamento })}
              opcoes={[
                { valor: 'justificado', rotulo: 'Justificado' },
                { valor: 'esquerda', rotulo: 'À esquerda' },
              ]}
            />
            <BwEscolha
              rotulo="Onde estou na obra"
              valor={p.ancora}
              onMudar={(ancora) => mudar({ ancora })}
              opcoes={[
                { valor: 'nenhuma', rotulo: 'Nada' },
                { valor: 'posicao', rotulo: 'Só o fio' },
                { valor: 'posicao_numero', rotulo: 'Fio e página' },
              ]}
            />
            <BwEscolha
              rotulo="Retorno sensorial"
              valor={p.retornoSensorial ? 'ligado' : 'silencio'}
              onMudar={(v) => mudar({ retornoSensorial: v === 'ligado' })}
              opcoes={[
                { valor: 'ligado', rotulo: 'Ligado' },
                { valor: 'silencio', rotulo: 'Silêncio' },
              ]}
            />
          </>
        )}
      </ScrollView>

      <View style={estilos.rodape}>
        <View style={estilos.botao}>
          <BwBotao rotulo="↺ esta aba" onPress={() => onMudar(restaurarAba(p, aba))} />
        </View>
        <View style={estilos.botao}>
          <BwBotao rotulo="↺ tudo ao padrão" onPress={() => onMudar(restaurarTudo())} />
        </View>
      </View>
      <Text style={estilos.colofao}>
        Composta em {face.familia}, corpo {corpo.toLocaleString('pt-BR')} sobre {entrelinha}.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  painel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '52%',
    backgroundColor: theme.sup.papel.fundo,
    borderTopWidth: 1,
    borderTopColor: theme.sup.papel.borda,
    boxShadow: theme.sup.papel.sombra.flutuante,
  },
  abas: {
    paddingHorizontal: theme.esp[5],
    paddingTop: theme.esp[4],
  },
  controles: {
    paddingHorizontal: theme.esp[5],
    paddingVertical: theme.esp[4],
    gap: theme.esp[5],
  },
  rodape: {
    flexDirection: 'row',
    gap: theme.esp[3],
    paddingHorizontal: theme.esp[5],
  },
  botao: {
    flex: 1,
  },
  colofao: {
    fontFamily: 'Spectral_400Regular_Italic',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    color: theme.sup.papel.tintaFraca,
    paddingVertical: theme.esp[2],
  },
}));
