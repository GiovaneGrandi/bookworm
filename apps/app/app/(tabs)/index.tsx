// Jardim — casa do hábito: ofensiva, meta do dia, canteiro (design-system.md §10). Esta rodada
// (Estágio 8, fundação): estado real de ofensiva/meta, sem a arte completa do canteiro em Skia —
// o estágio (broto/muda/planta florida/árvore/bosque) aparece como rótulo, não ilustração; vida
// ambiente (J-11) e os 4 cosméticos de marco ficam para a rodada que trouxer a arte.
import { estadoDoJardim } from '@bookworm/core/src/ofensiva/index.js';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import {
  BwCarimbo,
  BwDormencia,
  BwFolha,
  BwNumeroCelebracao,
  BwProgressoDia,
  BwVazio,
} from '../../src/componentes/index.js';
import { obterOfensivaAtual, obterProgressoDeHoje } from '../../src/ofensiva/servico.js';

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
  | { tipo: 'dormente'; contagemEncerrada: number; melhorMarca: number }
  | {
      tipo: 'vivo';
      contagemAtual: number;
      estagio: string;
      progresso: { realizado: number; meta: number; unidade: string } | null;
    };

export default function TelaJardim() {
  const [estado, setEstado] = useState<EstadoTela>({ tipo: 'carregando' });

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const [ofensiva, progresso] = await Promise.all([
          obterOfensivaAtual('leitura'),
          obterProgressoDeHoje('leitura'),
        ]);
        if (!ofensiva) {
          setEstado({ tipo: 'nunca_leu' });
          return;
        }
        const jardim = estadoDoJardim(ofensiva);
        if (jardim.estado === 'dormente') {
          setEstado({
            tipo: 'dormente',
            contagemEncerrada: jardim.contagemEncerrada ?? 0,
            melhorMarca: jardim.melhorMarca,
          });
        } else {
          setEstado({
            tipo: 'vivo',
            contagemAtual: ofensiva.contagemAtual,
            estagio: jardim.estagio,
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
        />
      </BwFolha>
    );
  }

  return (
    <BwFolha superficie="mesa" anuncio="Jardim">
      <View style={{ alignItems: 'center', gap: 27, padding: 27 }}>
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
      </View>
    </BwFolha>
  );
}
