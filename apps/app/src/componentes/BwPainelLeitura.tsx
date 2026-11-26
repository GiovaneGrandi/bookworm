import {
  type Aba,
  aplicar,
  CORPO,
  corpoEfetivo,
  entrelinhaEfetiva,
  FACES,
  type Face,
  limparNomeDePredefinicao,
  NOME_DE_PREDEFINICAO_MAX,
  PREDEFINICOES_DE_FABRICA,
  type Predefinicao,
  type PreferenciasLeitura,
  restaurarAba,
  restaurarTudo,
  TEMPERATURA_LUZ,
} from '@bookworm/core';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { guardarPredefinicao, tirarPredefinicao, usePredefinicoes } from '../dados/leitura';
import { ALVO_MINIMO } from '../tema/geometria';
import { tipo } from '../tema/tipografia';
import { BwBotao } from './BwBotao';
import { BwDeslizante } from './BwDeslizante';
import { BwEscolha } from './BwEscolha';

type Props = {
  /** O grupo que o ícone do cabeçalho abriu. */
  aba: Aba;
  preferencias: PreferenciasLeitura;
  onMudar: (p: PreferenciasLeitura) => void;
  /** A temperatura que está valendo: a do horário, quando ele manda (RN-02.16c). */
  temperaturaAgora: number;
};

/** A persiana ocupa no máximo esta fração da altura: o texto continua à vista embaixo. */
const ALTURA_MAXIMA = 0.62;

/** A face de cada amostra no próprio painel: a fonte carregada no app com o mesmo desenho. */
const AMOSTRA: Record<Face, string> = {
  spectral: 'Spectral_400Regular',
  eb_garamond: 'EBGaramond_400Regular',
  public_sans: 'PublicSans_400Regular',
  atkinson: 'AtkinsonHyperlegible_400Regular',
  courier_prime: 'CourierPrime_400Regular',
};

const LIGADO = [
  { valor: 'sim', rotulo: 'Ligado' },
  { valor: 'nao', rotulo: 'Desligado' },
] as const;
const ESPACOS = [
  { valor: 'normal', rotulo: 'Normal' },
  { valor: 'aberto', rotulo: 'Aberto' },
  { valor: 'largo', rotulo: 'Largo' },
] as const;

const kelvin = (k: number) => `${k.toLocaleString('pt-BR')} K`;
const px = (v: number) => `${v.toLocaleString('pt-BR')} px`;

/**
 * bw-painel-leitura: os 10 controles de RN-02.16d em três instrumentos (direcao-visual.md §9).
 * Cada ícone do cabeçalho abre um deles numa persiana que desce de baixo do título, com o texto
 * real à vista embaixo e cada ajuste aplicado na hora (RN-02.16e). O que vai além do inventário
 * mínimo mora numa segunda camada, "Mais ajustes", para o painel não virar cabine (Q-02.8).
 */
export function BwPainelLeitura({ aba, preferencias: p, onMudar, temperaturaAgora }: Props) {
  const { theme } = useUnistyles();
  const { height } = useWindowDimensions();
  const [mais, setMais] = useState(false);
  const mudar = (m: Partial<PreferenciasLeitura>) => onMudar(aplicar(p, m));
  const chave = (campo: keyof PreferenciasLeitura, rotulo: string) => (
    <BwEscolha
      rotulo={rotulo}
      opcoes={LIGADO}
      valor={p[campo] ? 'sim' : 'nao'}
      onMudar={(v) => mudar({ [campo]: v === 'sim' })}
    />
  );
  const corpo = corpoEfetivo(p);
  const entrelinha = entrelinhaEfetiva(p);
  const face = FACES[p.face];

  return (
    <View style={[estilos.painel, { maxHeight: height * ALTURA_MAXIMA }]} accessibilityViewIsModal>
      <ScrollView contentContainerStyle={estilos.controles}>
        {aba === 'luz' && (
          <>
            <BwPredefinicoes preferencias={p} onMudar={onMudar} />
            <BwDeslizante
              rotulo="Temperatura da luz"
              valorFalado={kelvin(temperaturaAgora)}
              valor={temperaturaAgora}
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
            {mais && (
              <>
                {chave('temperaturaPeloHorario', 'Temperatura acompanha o horário')}
                {chave('temaSegueCelular', 'Tema segue o celular')}
                {chave('imagensSuaves', 'Imagens suavizadas no escuro')}
                {chave('grao', 'Grão do papel')}
              </>
            )}
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
            {mais && (
              <>
                <BwEscolha
                  rotulo="Peso da letra"
                  valor={p.peso}
                  onMudar={(peso) => mudar({ peso })}
                  opcoes={[
                    { valor: 'fina', rotulo: 'Fina' },
                    { valor: 'normal', rotulo: 'Normal' },
                    { valor: 'grossa', rotulo: 'Grossa' },
                  ]}
                />
                <BwEscolha
                  rotulo="Espaço entre letras"
                  valor={p.espacoLetras}
                  onMudar={(espacoLetras) => mudar({ espacoLetras })}
                  opcoes={ESPACOS}
                />
                <BwEscolha
                  rotulo="Espaço entre palavras"
                  valor={p.espacoPalavras}
                  onMudar={(espacoPalavras) => mudar({ espacoPalavras })}
                  opcoes={ESPACOS}
                />
              </>
            )}
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
            {mais && (
              <>
                <BwEscolha
                  rotulo="Espaço entre parágrafos"
                  valor={p.espacoParagrafos}
                  onMudar={(espacoParagrafos) => mudar({ espacoParagrafos })}
                  opcoes={[
                    { valor: 'colados', rotulo: 'Colados' },
                    { valor: 'meia', rotulo: 'Meia linha' },
                    { valor: 'linha', rotulo: 'Uma linha' },
                  ]}
                />
                <BwEscolha
                  rotulo="Recuo do parágrafo"
                  valor={p.recuo}
                  onMudar={(recuo) => mudar({ recuo })}
                  opcoes={[
                    { valor: 'nenhum', rotulo: 'Sem recuo' },
                    { valor: 'curto', rotulo: 'Curto' },
                    { valor: 'longo', rotulo: 'Longo' },
                  ]}
                />
                <BwEscolha
                  rotulo="Como passar o texto"
                  valor={p.rolagem ? 'rolar' : 'paginas'}
                  onMudar={(v) => mudar({ rolagem: v === 'rolar' })}
                  opcoes={[
                    { valor: 'paginas', rotulo: 'Virar páginas' },
                    { valor: 'rolar', rotulo: 'Rolar' },
                  ]}
                />
                {/* Rolando não há página a virar: o jeito e as zonas somem até voltar às páginas. */}
                {!p.rolagem && (
                  <>
                    <BwEscolha
                      rotulo="Jeito de virar"
                      valor={p.virada}
                      onMudar={(virada) => mudar({ virada })}
                      opcoes={[
                        { valor: 'deslizar', rotulo: 'Deslizando' },
                        { valor: 'instantanea', rotulo: 'De uma vez' },
                      ]}
                    />
                    <BwEscolha
                      rotulo="Toque nas bordas"
                      valor={p.zonasDeToque}
                      onMudar={(zonasDeToque) => mudar({ zonasDeToque })}
                      opcoes={[
                        { valor: 'bordas', rotulo: 'Volta e avança' },
                        { valor: 'dois_lados', rotulo: 'Só avança' },
                        { valor: 'nenhuma', rotulo: 'Só arrastando' },
                      ]}
                    />
                  </>
                )}
                {chave('viraComVolume', 'Botões de volume viram a página')}
                {chave('somDoPapel', 'Som do papel')}
                {chave('telaAcesa', 'Manter a tela acesa')}
              </>
            )}
          </>
        )}

        <Pressable
          onPress={() => setMais((m) => !m)}
          accessibilityRole="button"
          accessibilityState={{ expanded: mais }}
          style={({ pressed }) => [estilos.mais, pressed && estilos.pressionado]}
        >
          <Text style={estilos.maisTexto}>{mais ? 'Menos ajustes ▴' : 'Mais ajustes ▾'}</Text>
        </Pressable>
      </ScrollView>

      <View style={estilos.rodape}>
        <View style={estilos.botao}>
          <BwBotao rotulo="↺ só esta parte" onPress={() => onMudar(restaurarAba(p, aba))} />
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

/**
 * As predefinições no alto da luz: as de fábrica (Dia, Noite) e as guardadas pela leitora. Um
 * toque aplica; segurar uma guardada pede para tirar, e um segundo toque confirma.
 */
function BwPredefinicoes({
  preferencias: p,
  onMudar,
}: {
  preferencias: PreferenciasLeitura;
  onMudar: (p: PreferenciasLeitura) => void;
}) {
  const { theme } = useUnistyles();
  const guardadas = usePredefinicoes();
  const [nomeando, setNomeando] = useState(false);
  const [nome, setNome] = useState('');
  const [tirando, setTirando] = useState<string | null>(null);

  function aplicarPredefinicao(pre: Predefinicao) {
    if (tirando === pre.id) {
      tirarPredefinicao(guardadas, pre.id);
      setTirando(null);
      return;
    }
    setTirando(null);
    onMudar(aplicar(p, pre.ajustes));
  }

  function guardar() {
    if (guardarPredefinicao(guardadas, nome, p)) {
      setNome('');
      setNomeando(false);
    }
  }

  return (
    <View style={estilos.predefinicoes}>
      <Text style={estilos.rotulo}>Predefinições</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.fichas}
      >
        {[...PREDEFINICOES_DE_FABRICA, ...guardadas].map((pre) => {
          const daLeitora = !PREDEFINICOES_DE_FABRICA.includes(pre);
          const confirmando = tirando === pre.id;
          return (
            <Pressable
              key={pre.id}
              onPress={() => aplicarPredefinicao(pre)}
              onLongPress={daLeitora ? () => setTirando(pre.id) : undefined}
              accessibilityRole="button"
              accessibilityLabel={
                confirmando ? `Tirar a predefinição ${pre.nome}` : `Aplicar ${pre.nome}`
              }
              accessibilityHint={daLeitora && !confirmando ? 'Segure para tirar' : undefined}
              style={({ pressed }) => [
                estilos.ficha,
                confirmando && estilos.fichaTirando,
                pressed && estilos.pressionado,
              ]}
            >
              <Text style={[estilos.fichaTexto, confirmando && estilos.fichaTextoTirando]}>
                {confirmando ? `Tirar “${pre.nome}”?` : pre.nome}
              </Text>
            </Pressable>
          );
        })}
        {!nomeando && (
          <Pressable
            onPress={() => setNomeando(true)}
            accessibilityRole="button"
            accessibilityLabel="Guardar os ajustes de agora como predefinição"
            style={({ pressed }) => [
              estilos.ficha,
              estilos.fichaNova,
              pressed && estilos.pressionado,
            ]}
          >
            <Text style={estilos.fichaTexto}>+ Guardar estes</Text>
          </Pressable>
        )}
      </ScrollView>
      {nomeando && (
        <View style={estilos.nomear}>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="ex.: Noite na cama"
            placeholderTextColor={theme.sup.papel.tintaFraca}
            accessibilityLabel="Nome da predefinição"
            maxLength={NOME_DE_PREDEFINICAO_MAX}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={guardar}
            style={estilos.campo}
          />
          <View style={estilos.botaoGuardar}>
            <BwBotao
              rotulo="Guardar"
              variante="primario"
              estado={limparNomeDePredefinicao(nome) ? 'repouso' : 'desabilitado'}
              onPress={guardar}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  painel: {
    backgroundColor: theme.sup.papel.fundo,
    borderBottomWidth: 1,
    borderBottomColor: theme.sup.papel.borda,
    borderBottomLeftRadius: theme.esp[3],
    borderBottomRightRadius: theme.esp[3],
    boxShadow: theme.sup.papel.sombra.flutuante,
    paddingBottom: theme.esp[2],
  },
  controles: {
    paddingHorizontal: theme.esp[5],
    paddingVertical: theme.esp[4],
    gap: theme.esp[5],
  },
  mais: {
    minHeight: ALVO_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.sup.papel.borda,
    borderStyle: 'dashed',
  },
  maisTexto: {
    ...tipo.kicker,
    color: theme.sup.papel.acento,
  },
  pressionado: {
    opacity: 0.7,
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
  predefinicoes: {
    gap: theme.esp[2],
  },
  rotulo: {
    ...tipo.kicker,
    color: theme.sup.papel.tintaFraca,
  },
  fichas: {
    gap: theme.esp[2],
  },
  ficha: {
    minHeight: ALVO_MINIMO - 9,
    justifyContent: 'center',
    paddingHorizontal: theme.esp[4],
    borderWidth: 1.5,
    borderColor: theme.sup.papel.borda,
    backgroundColor: theme.sup.papelFundo.fundo,
  },
  fichaNova: {
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  fichaTirando: {
    borderColor: theme.sup.papel.acento,
  },
  fichaTexto: {
    ...tipo.microcopy,
    color: theme.sup.papel.tinta,
  },
  fichaTextoTirando: {
    color: theme.sup.papel.acento,
  },
  nomear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[3],
  },
  campo: {
    ...tipo.corpoPequeno,
    flex: 1,
    minHeight: ALVO_MINIMO - 9,
    paddingVertical: 0,
    paddingHorizontal: theme.esp[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.sup.papel.borda,
    color: theme.sup.papel.tinta,
  },
  botaoGuardar: {
    width: 117,
  },
}));
