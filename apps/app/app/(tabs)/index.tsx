// Jardim — casa do hábito: ofensiva, meta do dia, canteiro (design-system.md §10). Estágio 8: o
// canteiro é arte ilustrada de verdade (`CenaDoJardim`, Skia) — os 5 estágios, o acervo que rega o
// jardim, os 4 cosméticos de marco e a vida ambiente (`mvp.md` §9, `J-11`).
import { avaliarMarcos, estadoDoJardim } from '@bookworm/core/src/ofensiva/index.js';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import {
  BwBotao,
  BwCarimbo,
  BwCartao,
  BwDormencia,
  BwFolha,
  BwNumeroCelebracao,
  BwProgressoDia,
  BwVazio,
} from '../../src/componentes/index.js';
import { useSuperficie } from '../../src/componentes/useSuperficie.js';
import { CenaDoJardim } from '../../src/jardim/CenaDoJardim.js';
import { sincronizarNotificacoesDeEngajamento } from '../../src/notificacoes/servico.js';
import {
  haCelebracaoPendenteHoje,
  obterOfensivaAtual,
  obterProgressoDeHoje,
  processarCongelamentoAutomatico,
} from '../../src/ofensiva/servico.js';
import { fontFamilyPara } from '../../src/tema/fontes.js';

const ROTULO_ESTAGIO: Record<string, string> = {
  broto: 'Broto',
  muda: 'Muda',
  planta_florida: 'Planta florida',
  arvore: 'Árvore',
  bosque: 'Bosque',
};

const ROTULO_UNIDADE: Record<string, string> = {
  minutos: 'min',
  paginas: 'páginas',
  palavras: 'palavras',
};

type EstadoTela =
  | { tipo: 'carregando' }
  | { tipo: 'nunca_leu' }
  | {
      tipo: 'dormente';
      contagemEncerrada: number;
      melhorMarca: number;
      tamanhoPermanente: number;
      marcosAlcancados: number[];
    }
  | {
      tipo: 'vivo';
      contagemAtual: number;
      estagio: 'broto' | 'muda' | 'planta_florida' | 'arvore' | 'bosque';
      tamanhoPermanente: number;
      marcosAlcancados: number[];
      progresso: { realizado: number; meta: number; unidade: string } | null;
    };

export default function TelaJardim() {
  const [estado, setEstado] = useState<EstadoTela>({ tipo: 'carregando' });
  const [avisoCongelamento, setAvisoCongelamento] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        // RN-04.10d — a conquista pendente sobrevive a quantos fechamentos de app forem
        // necessários: mora no banco, não em memória de uma tela. O Jardim é a tela de entrada,
        // então é aqui que ela ressurge se o resumo nunca chegou a ser visto.
        if (await haCelebracaoPendenteHoje('leitura')) {
          router.replace({ pathname: '/resumo', params: { celebracaoPendente: '1' } });
          return;
        }

        const congelamento = await processarCongelamentoAutomatico('leitura');
        const [ofensiva, progresso] = await Promise.all([
          obterOfensivaAtual('leitura'),
          obterProgressoDeHoje('leitura'),
        ]);
        void sincronizarNotificacoesDeEngajamento('leitura');

        // GAM-08/RN-04.17 — aviso claro, não-punitivo: só aparece na rodada que de fato protegeu
        // um dia, nunca de novo depois (o job é idempotente por dia).
        if (congelamento.diasProtegidosNestaRodada.length > 0 && ofensiva) {
          const plural = congelamento.diasProtegidosNestaRodada.length > 1 ? 's' : '';
          setAvisoCongelamento(
            `Usamos ${congelamento.diasProtegidosNestaRodada.length} congelamento${plural} para proteger seus ${ofensiva.contagemAtual} dias. Restam ${congelamento.estoqueRestante}.`
          );
        }

        if (!ofensiva) {
          setEstado({ tipo: 'nunca_leu' });
          return;
        }
        const jardim = estadoDoJardim(ofensiva);
        const marcosAlcancados = avaliarMarcos(ofensiva);
        if (jardim.estado === 'dormente') {
          setEstado({
            tipo: 'dormente',
            contagemEncerrada: jardim.contagemEncerrada ?? 0,
            melhorMarca: jardim.melhorMarca,
            tamanhoPermanente: jardim.tamanhoPermanente,
            marcosAlcancados,
          });
        } else {
          setEstado({
            tipo: 'vivo',
            contagemAtual: ofensiva.contagemAtual,
            estagio: jardim.estagio,
            tamanhoPermanente: jardim.tamanhoPermanente,
            marcosAlcancados,
            progresso,
          });
        }
      })();
    }, [])
  );

  if (estado.tipo === 'carregando') {
    return <BwFolha superficie="mesa" anuncio="Jardim" />;
  }

  if (estado.tipo === 'nunca_leu') {
    return (
      <BwFolha superficie="mesa" anuncio="Jardim">
        <BwVazio
          superficie="mesa"
          titulo="Seu jardim ainda não brotou"
          explicacao="Leia hoje para plantar o primeiro dia da sua ofensiva."
          saida={{ rotulo: 'Ir para a Biblioteca', aoTocar: () => router.push('/biblioteca') }}
        />
      </BwFolha>
    );
  }

  if (estado.tipo === 'dormente') {
    return (
      <BwFolha superficie="mesa" anuncio="Jardim">
        <BwDormencia
          contagemEncerrada={estado.contagemEncerrada}
          melhorMarca={estado.melhorMarca}
          mensagem="Ler hoje replanta a ofensiva, com a paleta viva de volta na hora."
          tamanhoPermanente={estado.tamanhoPermanente}
          marcosAlcancados={estado.marcosAlcancados}
        />
        <BwBotao
          superficie="mesa"
          variante="texto"
          rotulo="Ajustar meta"
          aoTocar={() => router.push('/meta')}
        />
      </BwFolha>
    );
  }

  return (
    <BwFolha superficie="mesa" anuncio="Jardim">
      <View style={{ alignItems: 'center', gap: 27, padding: 27 }}>
        {avisoCongelamento && (
          <AvisoCongelamento
            mensagem={avisoCongelamento}
            aoDispensar={() => setAvisoCongelamento(null)}
          />
        )}
        <View style={{ width: 280, height: 160, borderRadius: 4, overflow: 'hidden' }}>
          <CenaDoJardim
            estagio={estado.estagio}
            estado="vivo"
            tamanhoPermanente={estado.tamanhoPermanente}
            marcosAlcancados={estado.marcosAlcancados}
            largura={280}
            altura={160}
          />
        </View>
        <BwNumeroCelebracao
          superficie="mesa"
          numero={estado.contagemAtual}
          oQueMede="dias de ofensiva"
        />
        <BwCarimbo superficie="mesa" texto={ROTULO_ESTAGIO[estado.estagio] ?? estado.estagio} />
        {estado.progresso && (
          <BwProgressoDia
            superficie="mesa"
            realizado={estado.progresso.realizado}
            meta={estado.progresso.meta}
            unidade={ROTULO_UNIDADE[estado.progresso.unidade] ?? estado.progresso.unidade}
          />
        )}
        <BwBotao
          superficie="mesa"
          variante="texto"
          rotulo="Ajustar meta"
          aoTocar={() => router.push('/meta')}
        />
      </View>
    </BwFolha>
  );
}

/** GAM-08/RN-04.17 — convite, nunca cobrança (mesma disciplina de copy de `RN-01.16`): informa o
 * que aconteceu e quanto resta, sem alarme. Tocar dispensa — não é modal, é uma ficha a mais sobre
 * a mesa. */
function AvisoCongelamento({
  mensagem,
  aoDispensar,
}: {
  mensagem: string;
  aoDispensar: () => void;
}) {
  const sup = useSuperficie('mesa');
  return (
    <BwCartao superficie="mesa" aoTocar={aoDispensar}>
      <Text
        accessibilityRole="text"
        style={{
          color: sup.tinta,
          fontFamily: fontFamilyPara('spectral', '400'),
          fontSize: 14,
          lineHeight: 21,
          maxWidth: 260,
        }}
      >
        {mensagem}
      </Text>
    </BwCartao>
  );
}
