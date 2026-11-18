import {
  type AcaoDaGaveta,
  acoesDaGaveta,
  agruparGaveta,
  type EstadoDaGaveta,
} from '@bookworm/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BwBotao } from '../src/componentes/BwBotao';
import { BwFolha } from '../src/componentes/BwFolha';
import { marcarAberta, pausar, tirarDaGaveta, useObras } from '../src/dados/obras';
import type { Obra } from '../src/dados/schema';
import { contarLivros } from '../src/formatar';
import { ALVO_MINIMO, giro } from '../src/tema/geometria';
import { tipo } from '../src/tema/tipografia';

const NOME_DO_GRUPO: Record<EstadoDaGaveta, string> = {
  lendo: 'Lendo',
  em_pausa: 'Em pausa',
  quero_ler: 'Quero ler',
};

const ROTULO_DA_ACAO: Record<AcaoDaGaveta, string> = {
  pausar: 'Pôr em pausa',
  tirar: 'Tirar da gaveta',
};

/** A gaveta do fichário: o que ainda não terminou, em três grupos (RN-02.6a, Q2, Q15). */
export default function Gaveta() {
  const router = useRouter();
  const obras = useObras();
  const grupos = agruparGaveta(obras);
  const total = grupos.reduce((n, g) => n + g.obras.length, 0);
  const [aberta, setAberta] = useState<string | null>(null);

  function abrir(o: Obra) {
    marcarAberta(o.id);
    router.push(`/leitor/${o.id}`);
  }

  return (
    <BwFolha
      kicker="A gaveta · o que ainda não terminou"
      titulo={total === 0 ? 'A gaveta está vazia.' : `${contarLivros(total)} na gaveta.`}
    >
      {total === 0 ? (
        <View style={estilos.vazia}>
          <Text style={estilos.lapis}>
            Os livros entram pela bandeja, e os que você começa vão para a mesa.
          </Text>
          <BwBotao onPress={() => router.push('/bandeja')} rotulo="Ir à bandeja" />
        </View>
      ) : (
        <>
          <Text style={estilos.dica}>Segure o dedo num livro para pausar ou tirar da gaveta.</Text>
          {grupos.map((g) => (
            <View key={g.estado} style={estilos.grupo}>
              <Text style={estilos.divisoria}>
                {NOME_DO_GRUPO[g.estado]} · {g.obras.length}
              </Text>
              {g.obras.length === 0 && <Text style={estilos.grupoVazio}>nenhum por aqui</Text>}
              {g.obras.map((o) => (
                <Cartao
                  key={o.id}
                  obra={o}
                  aberto={aberta === o.id}
                  onAbrir={() => abrir(o)}
                  onSegurar={() => setAberta(aberta === o.id ? null : o.id)}
                  onFechar={() => setAberta(null)}
                />
              ))}
            </View>
          ))}
        </>
      )}
    </BwFolha>
  );
}

function Cartao({
  obra,
  aberto,
  onAbrir,
  onSegurar,
  onFechar,
}: {
  obra: Obra;
  aberto: boolean;
  onAbrir: () => void;
  onSegurar: () => void;
  onFechar: () => void;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const pdf = obra.formato === 'pdf';
  const autoria = [
    obra.autor ?? (pdf ? 'importado' : null),
    obra.origem === 'dominio_publico' ? 'acervo' : null,
    pdf ? 'fotocópia' : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const comProgresso = obra.estado !== 'quero_ler';
  const pct = Math.round(obra.progresso * 100);

  function agir(acao: AcaoDaGaveta) {
    if (acao === 'pausar') {
      pausar(obra.id);
      onFechar();
    } else if (!confirmando) {
      setConfirmando(true);
    } else {
      tirarDaGaveta(obra.id);
    }
  }

  return (
    <View>
      <Pressable
        onPress={onAbrir}
        onLongPress={onSegurar}
        accessibilityRole="button"
        accessibilityLabel={`${obra.titulo}${obra.autor ? `, de ${obra.autor}` : ''}${comProgresso ? `, ${pct}% lido` : ''}. Abrir no leitor`}
        accessibilityHint="Segure para pausar ou tirar da gaveta"
        accessibilityActions={acoesDaGaveta(obra.estado).map((a) => ({
          name: a,
          label: ROTULO_DA_ACAO[a],
        }))}
        onAccessibilityAction={(e) => agir(e.nativeEvent.actionName as AcaoDaGaveta)}
        style={({ pressed }) => [estilos.cartao, (pressed || aberto) && estilos.cartaoSelecionado]}
      >
        <View style={estilos.tituloLinha}>
          <Text style={estilos.titulo}>{obra.titulo}</Text>
          {pdf && <Text style={estilos.etiquetaPdf}>PDF</Text>}
        </View>
        {autoria !== '' && <Text style={estilos.autor}>{autoria}</Text>}
        {comProgresso && (
          <View style={estilos.progresso}>
            <View style={estilos.regua}>
              <View style={[estilos.reguaFeita, { width: `${pct}%` }]} />
            </View>
            <Text style={estilos.pct}>{pct}%</Text>
          </View>
        )}
      </Pressable>
      {aberto && (
        <View style={estilos.acoes}>
          {acoesDaGaveta(obra.estado).map((a) => (
            <View key={a} style={estilos.acao}>
              <BwBotao
                onPress={() => agir(a)}
                rotulo={a === 'tirar' && confirmando ? 'Tirar mesmo' : ROTULO_DA_ACAO[a]}
              />
            </View>
          ))}
        </View>
      )}
      {aberto && confirmando && (
        <Text style={estilos.aviso}>
          O arquivo sai do aparelho junto. Toque de novo para confirmar.
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  dica: {
    ...tipo.microcopy,
    color: theme.sup.papel.tintaFraca,
  },
  vazia: {
    marginTop: theme.esp[5],
    gap: theme.esp[6],
  },
  lapis: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.papel.tintaFraca,
    transform: [{ rotate: giro.etiqueta }],
  },
  grupo: {
    marginTop: theme.esp[4],
  },
  divisoria: {
    ...tipo.kicker,
    alignSelf: 'flex-start',
    color: theme.sup.kraft.tinta,
    backgroundColor: theme.sup.kraft.fundo,
    paddingVertical: theme.esp[1],
    paddingHorizontal: theme.esp[4],
    borderTopLeftRadius: 6,
    borderTopRightRadius: 9,
  },
  grupoVazio: {
    ...tipo.marginalia,
    color: theme.sup.papel.tintaFraca,
    paddingVertical: theme.esp[3],
    paddingHorizontal: theme.esp[4],
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.sup.papel.borda,
  },
  cartao: {
    minHeight: ALVO_MINIMO + 6,
    backgroundColor: theme.sup.papel.fundo,
    borderWidth: 1,
    borderColor: theme.sup.papel.borda,
    paddingVertical: theme.esp[3],
    paddingHorizontal: theme.esp[4],
    // A borda de cima é a de baixo do vizinho: as fichas se empilham sem filete duplo.
    borderTopWidth: 0,
  },
  cartaoSelecionado: {
    borderColor: theme.semantico.papel.selecionadoBorda,
    backgroundColor: theme.semantico.papel.selecionadoFundo,
  },
  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[3],
  },
  titulo: {
    ...tipo.corpo,
    flexShrink: 1,
    color: theme.sup.papel.tinta,
  },
  etiquetaPdf: {
    ...tipo.kickerMicro,
    color: theme.sup.papel.tinta,
    borderWidth: 1,
    borderColor: theme.sup.papel.tintaFraca,
    paddingHorizontal: theme.esp[2],
  },
  autor: {
    ...tipo.corpoPequeno,
    color: theme.sup.papel.tintaFraca,
  },
  progresso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.esp[3],
    marginTop: theme.esp[2],
  },
  regua: {
    flex: 1,
    height: 1,
    backgroundColor: theme.sup.papel.borda,
  },
  reguaFeita: {
    position: 'absolute',
    left: 0,
    top: -1,
    height: 3,
    backgroundColor: theme.sup.papel.acento,
  },
  pct: {
    ...tipo.kicker,
    fontVariant: ['tabular-nums'],
    color: theme.sup.papel.tinta,
  },
  acoes: {
    flexDirection: 'row',
    gap: theme.esp[3],
    paddingVertical: theme.esp[3],
  },
  acao: {
    flex: 1,
  },
  aviso: {
    ...tipo.marginalia,
    color: theme.sup.papel.tinta,
    marginBottom: theme.esp[3],
  },
}));
