// O leitor é modo, não destino (RN-DS.18) — por isso vive fora de `(tabs)`, como rota irmã
// apresentada em tela cheia (ver `app/_layout.tsx`). Corpo real (react-native-readium) entra no
// Estágio 7. O painel abaixo é o arnês de validação manual do Estágio 6 (specs/telemetria §16,
// planos/2026-08-23-primeiro-prototipo-mvp.md — os 7 cenários de dispositivo real): dispara
// sinais na máquina de estados diretamente, sem esperar o leitor de verdade existir. **Remover no
// Estágio 7**, quando o leitor real passar a chamar `sinalPosicao`/`sinalInteracaoQualitativa` a
// partir de eventos do Readium em vez de um botão.
import { obra as tabelaObra } from '@bookworm/db';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BwBotao, BwDadoTabular, BwFolha } from '../src/componentes/index.js';
import { abrirBanco } from '../src/persistencia/db.js';
import { useMaquinaSessao } from '../src/sessao/maquina.js';
import { iniciarSinaisDeSessao } from '../src/sessao/sinais.js';

const OBRA_TESTE_ID = 'obra-teste-estagio-6';

async function garantirObraTeste(): Promise<void> {
  const db = abrirBanco();
  const existente = await db.select().from(tabelaObra).limit(1);
  if (existente.some((o) => o.id === OBRA_TESTE_ID)) return;
  await db.insert(tabelaObra).values({
    id: OBRA_TESTE_ID,
    titulo: 'Obra de teste — Estágio 6',
    formato: 'epub',
    origem: 'dominio_publico',
    privada: false,
    caminhoArquivo: 'memoria://teste',
    criadaEm: new Date(),
  });
}

export default function Leitor() {
  const maquina = useMaquinaSessao();
  const [posicao, setPosicao] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const registrar = useCallback(
    (linha: string) =>
      setLog((l) => [`${new Date().toLocaleTimeString()} ${linha}`, ...l].slice(0, 12)),
    []
  );

  useEffect(() => {
    let pararSinais: (() => void) | null = null;
    void (async () => {
      await useMaquinaSessao.getState().inicializar();
      pararSinais = iniciarSinaisDeSessao();
      registrar('inicializado');
    })();
    return () => pararSinais?.();
  }, [registrar]);

  return (
    <BwFolha superficie="mesa" anuncio="Leitor — arnês de validação do Estágio 6">
      <ScrollView contentContainerStyle={{ padding: 18, gap: 12 }}>
        <BwBotao superficie="mesa" rotulo="Fechar" aoTocar={() => router.back()} />

        <View style={{ flexDirection: 'row', gap: 18, flexWrap: 'wrap' }}>
          <BwDadoTabular superficie="mesa" rotulo="estado" valor={maquina.estado} />
          <BwDadoTabular
            superficie="mesa"
            rotulo="sessão"
            valor={maquina.sessaoId ? maquina.sessaoId.slice(-8) : '—'}
          />
          <BwDadoTabular
            superficie="mesa"
            rotulo="último sinal"
            valor={maquina.ultimoSinal ? String(maquina.ultimoSinal.mono) : '—'}
          />
        </View>

        <BwBotao
          superficie="mesa"
          rotulo="Abrir sessão de teste"
          aoTocar={async () => {
            await garantirObraTeste();
            await maquina.abrirObra(OBRA_TESTE_ID);
            registrar('abrirObra');
          }}
        />
        <BwBotao
          superficie="mesa"
          rotulo="Sinal de posição (+500)"
          aoTocar={async () => {
            const proxima = posicao + 500;
            setPosicao(proxima);
            await maquina.sinalPosicao(proxima);
            registrar(`sinalPosicao(${proxima})`);
          }}
        />
        <BwBotao
          superficie="mesa"
          rotulo="Sinal de interação (destaque)"
          aoTocar={async () => {
            await maquina.sinalInteracaoQualitativa('destaque');
            registrar('sinalInteracaoQualitativa(destaque)');
          }}
        />
        <BwBotao
          superficie="mesa"
          rotulo="Forçar verificação de idle"
          aoTocar={async () => {
            await maquina.verificarIdle();
            registrar('verificarIdle');
          }}
        />
        <BwBotao
          superficie="mesa"
          rotulo="Simular ida a segundo plano"
          aoTocar={async () => {
            await maquina.paraBackground();
            registrar('paraBackground');
          }}
        />
        <BwBotao
          superficie="mesa"
          rotulo="Simular volta ao primeiro plano"
          aoTocar={async () => {
            await maquina.paraForeground();
            registrar('paraForeground');
          }}
        />
        <BwBotao
          superficie="mesa"
          rotulo="Encerrar sessão"
          aoTocar={async () => {
            await maquina.encerrar('manual');
            setPosicao(0);
            registrar('encerrar');
          }}
        />

        <View style={{ gap: 3 }}>
          {log.map((linha) => (
            <Text key={linha} style={{ color: '#cfd8cf', fontSize: 11 }}>
              {linha}
            </Text>
          ))}
        </View>
      </ScrollView>
    </BwFolha>
  );
}
