// Estágio 8 — resumo de sessão (`03` §7). Quando a meta foi cumprida nesta sessão e a conquista
// está pendente, o resumo abre pela celebração, antes dos números (RN-04.10b) — e a consome uma
// única vez ao mostrar (RN-04.10d/e). J-06 (coreografia completa: contagem progressiva, destaques
// um a um, jardim crescendo em tempo real) fica para quando a arte do Jardim existir; esta rodada
// mostra os números direto, sem animação.
import { CONSTANTES_SESSAO_PADRAO } from '@bookworm/core/src/sessao/index.js';
import { sessaoLeitura, USUARIO_LOCAL } from '@bookworm/db';
import { desc, eq } from 'drizzle-orm';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { BwBotao, BwCelebracao, BwDadoTabular, BwFolha } from '../src/componentes/index.js';
import { consumirCelebracaoPendente, obterOfensivaAtual } from '../src/ofensiva/servico.js';
import { abrirBanco } from '../src/persistencia/db.js';

type NumerosDaSessao = {
  tempoAtivoS: number;
  paginasCanonicas: number;
  estilo: string | null;
  status: string;
};

const ROTULO_ESTILO: Record<string, string> = {
  focado: 'Focado',
  metodico: 'Metódico',
  equilibrado: 'Equilibrado',
};

export default function Resumo() {
  const { celebracaoPendente } = useLocalSearchParams<{
    obraId?: string;
    celebracaoPendente?: string;
  }>();
  const [numeros, setNumeros] = useState<NumerosDaSessao | null>(null);
  const [contagemOfensiva, setContagemOfensiva] = useState<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: roda uma única vez — celebracaoPendente é o param que abriu esta tela, incluí-lo repetiria o consumo da celebração a cada re-render.
  useEffect(() => {
    void (async () => {
      const db = abrirBanco();
      const [ultima] = await db
        .select()
        .from(sessaoLeitura)
        .where(eq(sessaoLeitura.usuarioId, USUARIO_LOCAL))
        .orderBy(desc(sessaoLeitura.criadaEm))
        .limit(1);

      if (ultima) {
        setNumeros({
          tempoAtivoS: ultima.tempoAtivoS,
          paginasCanonicas:
            ultima.caracteresLidos / CONSTANTES_SESSAO_PADRAO.PAGINA_CANONICA_CARACTERES,
          estilo: ultima.estilo,
          status: ultima.status,
        });
      }

      if (celebracaoPendente === '1') {
        const ofensiva = await obterOfensivaAtual('leitura');
        setContagemOfensiva(ofensiva?.contagemAtual ?? null);
        await consumirCelebracaoPendente('leitura');
      }
    })();
  }, []);

  const minutosAtivos = numeros ? Math.round(numeros.tempoAtivoS / 60) : 0;
  const paginas = numeros ? Math.round(numeros.paginasCanonicas * 10) / 10 : 0;

  return (
    <BwFolha superficie="mesa" anuncio="Resumo da sessão">
      <ScrollView contentContainerStyle={{ padding: 27, gap: 18 }}>
        {celebracaoPendente === '1' && contagemOfensiva !== null && (
          <BwCelebracao
            superficie="mesa"
            estado="exibida"
            novoNumero={contagemOfensiva}
            oQueMede="dias de ofensiva"
            mensagem="Meta do dia cumprida."
          />
        )}

        {numeros && (
          <>
            <BwDadoTabular superficie="mesa" rotulo="Tempo ativo" valor={`${minutosAtivos} min`} />
            <BwDadoTabular superficie="mesa" rotulo="Páginas canônicas" valor={`${paginas}`} />
            {numeros.estilo && (
              <BwDadoTabular
                superficie="mesa"
                rotulo="Estilo"
                valor={ROTULO_ESTILO[numeros.estilo] ?? numeros.estilo}
              />
            )}
            {numeros.status === 'curta' && (
              <BwDadoTabular
                superficie="mesa"
                rotulo="Sessão"
                valor="Curta — não conta para a meta"
              />
            )}
          </>
        )}

        <BwBotao superficie="mesa" rotulo="Continuar" aoTocar={() => router.replace('/(tabs)')} />
      </ScrollView>
    </BwFolha>
  );
}
