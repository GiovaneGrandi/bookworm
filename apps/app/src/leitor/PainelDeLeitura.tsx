// Estágio 7 passo 5 — painel de leitura (`02` §5, RN-02.16d: inventário mínimo de dez controles).
// RN-02.13a (nível da âncora de posição) fica de fora desta rodada — decisão do usuário via
// `AskUserQuestion`: o indicador nativo do react-native-readium não expõe prop para desligar/
// trocar, exigiria patch na lib Android, à parte dos outros nove controles (ver
// `.claude/retomada.md`). RN-02.16e (pré-visualização ao vivo) e RN-02.16f (restauração
// individual e em bloco) vivem em `BwControleContinuo`/`BwSeletorDeOpcoes` e no botão final.
import {
  CATALOGO_FACES,
  PREFERENCIAS_LEITURA_PADRAO,
  type PreferenciasDeLeitura,
  TEMPERATURA_LUZ_MAX,
  TEMPERATURA_LUZ_MIN,
} from '@bookworm/core/src/leitor/index.js';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  BwBotao,
  BwControleContinuo,
  BwInterruptor,
  BwSeletorDeOpcoes,
} from '../componentes/index.js';
import { useSuperficie } from '../componentes/useSuperficie.js';
import { fontFamilyPara } from '../tema/fontes.js';

const OPCOES_FONTE = CATALOGO_FACES.map((f) => ({ valor: f.chave, rotulo: f.rotulo }));
const OPCOES_ALINHAMENTO = [
  { valor: 'start' as const, rotulo: 'Início' },
  { valor: 'justify' as const, rotulo: 'Justificado' },
];
const OPCOES_TEMA = [
  { valor: 'claro' as const, rotulo: 'Claro' },
  { valor: 'sepia' as const, rotulo: 'Sépia' },
  { valor: 'escuro' as const, rotulo: 'Escuro' },
  { valor: 'preto_puro' as const, rotulo: 'Preto puro' },
];

type Props = {
  prefs: PreferenciasDeLeitura;
  aoMudarAoVivo: (prefs: PreferenciasDeLeitura) => void;
  aoSoltar: (prefs: PreferenciasDeLeitura) => void;
};

export function PainelDeLeitura({ prefs, aoMudarAoVivo, aoSoltar }: Props) {
  const sup = useSuperficie('papel');

  return (
    <View style={[styles.raiz, { backgroundColor: sup.fundo, borderColor: sup.borda }]}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.titulo,
            { color: sup.tinta, fontFamily: fontFamilyPara('spectral', '500') },
          ]}
        >
          Preferências de leitura
        </Text>

        <BwSeletorDeOpcoes
          superficie="papel"
          rotulo="Família de fonte"
          opcoes={OPCOES_FONTE}
          valorSelecionado={prefs.fonteChave}
          aoSelecionar={(fonteChave) => aoSoltar({ ...prefs, fonteChave })}
        />

        <BwControleContinuo
          superficie="papel"
          rotulo="Corpo"
          valor={prefs.corpoEscala}
          minimo={0.7}
          maximo={2}
          padrao={PREFERENCIAS_LEITURA_PADRAO.corpoEscala}
          formatarValor={(v) => `${Math.round(v * 100)}%`}
          aoMudarAoVivo={(corpoEscala) => aoMudarAoVivo({ ...prefs, corpoEscala })}
          aoSoltar={(corpoEscala) => aoSoltar({ ...prefs, corpoEscala })}
        />

        <BwControleContinuo
          superficie="papel"
          rotulo="Entrelinha"
          valor={prefs.entrelinhaEscala}
          minimo={0.8}
          maximo={2}
          padrao={PREFERENCIAS_LEITURA_PADRAO.entrelinhaEscala}
          formatarValor={(v) => `${Math.round(v * 100)}%`}
          aoMudarAoVivo={(entrelinhaEscala) => aoMudarAoVivo({ ...prefs, entrelinhaEscala })}
          aoSoltar={(entrelinhaEscala) => aoSoltar({ ...prefs, entrelinhaEscala })}
        />

        <BwControleContinuo
          superficie="papel"
          rotulo="Margens"
          valor={prefs.margemEscala}
          minimo={0.5}
          maximo={2}
          padrao={PREFERENCIAS_LEITURA_PADRAO.margemEscala}
          formatarValor={(v) => `${Math.round(v * 100)}%`}
          aoMudarAoVivo={(margemEscala) => aoMudarAoVivo({ ...prefs, margemEscala })}
          aoSoltar={(margemEscala) => aoSoltar({ ...prefs, margemEscala })}
        />

        <BwSeletorDeOpcoes
          superficie="papel"
          rotulo="Alinhamento"
          opcoes={OPCOES_ALINHAMENTO}
          valorSelecionado={prefs.alinhamento}
          aoSelecionar={(alinhamento) => aoSoltar({ ...prefs, alinhamento })}
        />

        <BwSeletorDeOpcoes
          superficie="papel"
          rotulo="Tema"
          opcoes={OPCOES_TEMA}
          valorSelecionado={prefs.tema}
          aoSelecionar={(tema) => aoSoltar({ ...prefs, tema })}
        />

        <BwControleContinuo
          superficie="papel"
          rotulo="Temperatura de luz"
          valor={prefs.temperaturaLuzK}
          minimo={TEMPERATURA_LUZ_MIN}
          maximo={TEMPERATURA_LUZ_MAX}
          padrao={PREFERENCIAS_LEITURA_PADRAO.temperaturaLuzK}
          formatarValor={(v) => `${Math.round(v)} K`}
          aoMudarAoVivo={(temperaturaLuzK) => aoMudarAoVivo({ ...prefs, temperaturaLuzK })}
          aoSoltar={(temperaturaLuzK) => aoSoltar({ ...prefs, temperaturaLuzK })}
        />

        <BwControleContinuo
          superficie="papel"
          rotulo="Brilho"
          valor={prefs.brilho}
          minimo={0.1}
          maximo={1}
          padrao={PREFERENCIAS_LEITURA_PADRAO.brilho}
          formatarValor={(v) => `${Math.round(v * 100)}%`}
          aoMudarAoVivo={(brilho) => aoMudarAoVivo({ ...prefs, brilho })}
          aoSoltar={(brilho) => aoSoltar({ ...prefs, brilho })}
        />

        <BwInterruptor
          superficie="papel"
          rotulo="Retorno sensorial ao virar página, grifar e consultar"
          ativo={prefs.retornoSensorialAtivo}
          aoAlternar={(retornoSensorialAtivo) => aoSoltar({ ...prefs, retornoSensorialAtivo })}
        />

        <BwBotao
          superficie="papel"
          variante="texto"
          rotulo="Restaurar tudo ao padrão"
          aoTocar={() => {
            aoMudarAoVivo(PREFERENCIAS_LEITURA_PADRAO);
            aoSoltar(PREFERENCIAS_LEITURA_PADRAO);
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '72%',
    borderTopWidth: 1,
  },
  conteudo: { padding: 18, gap: 18 },
  titulo: { fontSize: 18, marginBottom: 6 },
});
