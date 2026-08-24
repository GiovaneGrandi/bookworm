// Estágio 8 — tela de meta (RN-04.4–RN-04.9, `04-streaks-e-jardim.md` §4). Definição e alteração
// da meta diária. RN-04.5: alterar é sempre gratuito, sem moeda — o atrito é só de tempo
// (RN-04.6/RN-04.7: a nova meta vale a partir de amanhã, mais um intervalo mínimo de dias entre
// dois aumentos). RN-04.6a: reduzir é sempre livre, sem intervalo e sem cerimônia — por isso a
// mensagem de sucesso é a mesma frase discreta para aumento e redução, nunca um alarme.
import { FAIXAS_META, type PedidoAlteracaoMeta } from '@bookworm/core/src/ofensiva/index.js';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import {
  BwBotao,
  BwCabeca,
  BwControleContinuo,
  BwFolha,
  BwSeletorDeOpcoes,
} from '../src/componentes/index.js';
import { useSuperficie } from '../src/componentes/useSuperficie.js';
import { alterarMetaVigente, obterMetaVigente } from '../src/ofensiva/servico.js';
import { fontFamilyPara } from '../src/tema/fontes.js';

// RN-04.4 — só as unidades expostas para o eixo de leitura no MVP; `FAIXAS_META.escrita` (palavras)
// não tem tela ainda (mvp.md §4.3: só leitura é exposta).
type UnidadeLeitura = 'minutos' | 'paginas';

const OPCOES_UNIDADE: { valor: UnidadeLeitura; rotulo: string }[] = [
  { valor: 'minutos', rotulo: 'Minutos' },
  { valor: 'paginas', rotulo: 'Páginas' },
];

export default function TelaMeta() {
  const sup = useSuperficie('mesa');
  const [carregado, setCarregado] = useState(false);
  const [metaOriginal, setMetaOriginal] = useState<PedidoAlteracaoMeta>({
    unidade: 'minutos',
    valor: 20,
  });
  const [unidade, setUnidade] = useState<UnidadeLeitura>('minutos');
  const [valor, setValor] = useState(20);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    void (async () => {
      const meta = await obterMetaVigente('leitura');
      setMetaOriginal({ unidade: meta.unidade, valor: meta.valor });
      // RN-04.4 — eixo leitura só usa páginas/minutos; `palavras` é exclusivo de escrita
      // (`FAIXAS_META.escrita`), sem tela ainda.
      setUnidade(meta.unidade === 'paginas' ? 'paginas' : 'minutos');
      setValor(meta.valor);
      setCarregado(true);
    })();
  }, []);

  if (!carregado) {
    return <BwFolha superficie="mesa" anuncio="Meta diária" />;
  }

  const faixa = FAIXAS_META.leitura[unidade];
  const padrao = metaOriginal.unidade === unidade ? metaOriginal.valor : faixa.min;

  async function salvar() {
    setSalvando(true);
    setMensagem(null);
    const resultado = await alterarMetaVigente('leitura', { unidade, valor: Math.round(valor) });
    setSalvando(false);

    if (resultado.permitida) {
      setMetaOriginal({
        unidade: resultado.metaResultante.unidade,
        valor: resultado.metaResultante.valor,
      });
      setMensagem('Nova meta vale a partir de amanhã.');
      return;
    }
    if (resultado.motivo === 'fora_da_faixa') {
      setMensagem(`Escolha um valor entre ${faixa.min} e ${faixa.max}.`);
      return;
    }
    setMensagem(`Você pode aumentar a meta de novo a partir de ${resultado.podeAlterarEm}.`);
  }

  return (
    <BwFolha superficie="mesa" anuncio="Meta diária">
      <BwCabeca superficie="mesa" titulo="Meta diária" aoVoltar={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 27, gap: 27 }}>
        <BwSeletorDeOpcoes
          superficie="mesa"
          rotulo="Unidade"
          opcoes={OPCOES_UNIDADE}
          valorSelecionado={unidade}
          aoSelecionar={(novaUnidade) => {
            setUnidade(novaUnidade);
            setValor(FAIXAS_META.leitura[novaUnidade].min);
            setMensagem(null);
          }}
        />

        <BwControleContinuo
          superficie="mesa"
          rotulo={unidade === 'minutos' ? 'Minutos por dia' : 'Páginas por dia'}
          valor={valor}
          minimo={faixa.min}
          maximo={faixa.max}
          padrao={padrao}
          formatarValor={(v) => `${Math.round(v)}`}
          aoMudarAoVivo={setValor}
          aoSoltar={setValor}
        />

        {mensagem && (
          <Text
            accessibilityRole="text"
            style={{
              color: sup.tintaFraca,
              fontFamily: fontFamilyPara('spectral', '400'),
              fontSize: 14,
              lineHeight: 21,
            }}
          >
            {mensagem}
          </Text>
        )}

        <BwBotao superficie="mesa" rotulo="Salvar" aoTocar={salvar} carregando={salvando} />
      </ScrollView>
    </BwFolha>
  );
}
