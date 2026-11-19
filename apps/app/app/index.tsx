import { objetosNaMesa } from '@bookworm/core';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BwObjetoMesa } from '../src/componentes/BwObjetoMesa';
import { useTransicaoDaMesa } from '../src/componentes/BwTransicaoDaMesa';
import { BANDEJA, BwBandejaDeArame } from '../src/componentes/mesa/BwBandejaDeArame';
import { BwCapaFechada, CAPA } from '../src/componentes/mesa/BwCapaFechada';
import { BwFeltro } from '../src/componentes/mesa/BwFeltro';
import { BwFichario, FICHARIO } from '../src/componentes/mesa/BwFichario';
import { BwLivroAberto, LIVRO } from '../src/componentes/mesa/BwLivroAberto';
import { BwLuminaria } from '../src/componentes/mesa/BwLuminaria';
import { carregarIndice, usePreferencias } from '../src/dados/leitura';
import { marcarAberta, useObras } from '../src/dados/obras';
import type { Obra } from '../src/dados/schema';
import { textosDaBandeja, textosDaGaveta, textosDoLivro, textosDoSegundoLivro } from '../src/mesa';
import { espelhar, giro } from '../src/tema/geometria';
import { tipo } from '../src/tema/tipografia';

/** Na mesa vazia, a bandeja cresce e é o convite (Q13); o lugar do livro fica livre. */
const BANDEJA_EM_DESTAQUE = 1.35;

/**
 * A mesa: tela inicial e único hub (RN-DV.1), na composição do mockup B. Cada objeto é porta e
 * mostra o estado da função (RN-DV.3); só os 2 livros em leitura mais recentes ficam pousados
 * (RN-DV.4). A ordem dos objetos na árvore é a ordem de leitura do TalkBack, de cima para baixo;
 * quem fica por cima de quem é a `camada`.
 */
export default function Mesa() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { top } = useSafeAreaInsets();
  const { erguer } = useTransicaoDaMesa();
  const preferencias = usePreferencias();
  const mesa = objetosNaMesa(useObras());
  const [principal, segundo] = mesa.livros;
  const corDaLeitura = theme.leitura[preferencias.tema].fundo;
  const papel = theme.sup.papel.fundo;

  const totalDoPrincipal = useMemo(
    () => (principal?.formato === 'epub' ? carregarIndice(principal.id).total : null),
    [principal?.id, principal?.formato]
  );

  function continuar(o: Obra) {
    erguer(`/leitor/${o.id}`, corDaLeitura, 'tela', () => {
      marcarAberta(o.id);
      router.push({ pathname: '/leitor/[id]', params: { id: o.id, erguido: '1' } });
    });
  }

  function abrirFolha(rota: '/bandeja' | '/gaveta') {
    erguer(rota, papel, 'folha', () => router.push({ pathname: rota, params: { erguido: '1' } }));
  }

  const bandeja = textosDaBandeja(mesa.vazia);
  const gaveta = textosDaGaveta(mesa.gaveta);
  const escalaBandeja = mesa.vazia ? BANDEJA_EM_DESTAQUE : 1;
  const livro = principal ? textosDoLivro(principal, totalDoPrincipal) : null;
  const fechado = segundo ? textosDoSegundoLivro(segundo) : null;

  return (
    <View style={estilos.mesa}>
      <BwFeltro temperatura={preferencias.temperatura} topo={top} />

      <View
        accessible
        accessibilityLabel={`${hojePorExtenso()}. ${saudacao()}`}
        style={[estilos.cabeca, { top: top + 27 }]}
      >
        <Text style={estilos.slip}>{hoje()}</Text>
        <Text style={estilos.saudacao}>{saudacao()}</Text>
      </View>

      <BwObjetoMesa
        chave="/bandeja"
        etiqueta={bandeja.etiqueta}
        etiquetaEmDestaque={mesa.vazia}
        rotuloAcessivel={bandeja.rotulo}
        onAbrir={() => abrirFolha('/bandeja')}
        posicao={{ left: 18, top: top + 94 }}
        largura={BANDEJA.largura * escalaBandeja}
        altura={BANDEJA.altura * escalaBandeja}
        camada={7}
        rotacao="-3deg"
        etiquetaEm={{ left: 12, bottom: -12 }}
        rotacaoEtiqueta={espelhar(giro.etiqueta)}
      >
        <View style={{ transform: [{ scale: escalaBandeja }], transformOrigin: 'left top' }}>
          <BwBandejaDeArame />
        </View>
      </BwObjetoMesa>

      {segundo && fechado && (
        <BwObjetoMesa
          chave={`/leitor/${segundo.id}`}
          etiqueta={fechado.etiqueta}
          rotuloAcessivel={fechado.rotulo}
          onAbrir={() => continuar(segundo)}
          posicao={{ left: 190, top: top + 96 }}
          largura={CAPA.largura}
          altura={CAPA.altura}
          camada={4}
          rotacao="9deg"
          etiquetaEm={{ left: -14, top: -12 }}
          rotacaoEtiqueta={giro.carimbo}
        >
          <BwCapaFechada titulo={segundo.titulo} />
        </BwObjetoMesa>
      )}

      {principal && livro && (
        <BwObjetoMesa
          chave={`/leitor/${principal.id}`}
          etiqueta={livro.etiqueta}
          etiquetaEmDestaque
          rotuloAcessivel={livro.rotulo}
          onAbrir={() => continuar(principal)}
          posicao={{ left: 30, top: top + 198 }}
          largura={LIVRO.largura}
          altura={LIVRO.altura}
          camada={6}
          rotacao="-2deg"
          etiquetaEm={{ left: 18, bottom: -14 }}
          rotacaoEtiqueta={espelhar(giro.rotulo)}
        >
          <BwLivroAberto
            autor={principal.autor ?? 'lendo'}
            titulo={principal.titulo}
            folios={livro.folios}
          />
        </BwObjetoMesa>
      )}

      <BwObjetoMesa
        chave="/gaveta"
        etiqueta={gaveta.etiqueta}
        rotuloAcessivel={gaveta.rotulo}
        onAbrir={() => abrirFolha('/gaveta')}
        posicao={{ left: 16, top: top + 640 }}
        largura={FICHARIO.largura}
        altura={FICHARIO.altura}
        camada={5}
        rotacao="-1.5deg"
        etiquetaEm={{ left: 9, top: -14 }}
        rotacaoEtiqueta={giro.etiqueta}
      >
        <BwFichario abas={gaveta.abas} />
      </BwObjetoMesa>

      <BwLuminaria />
    </View>
  );
}

function hoje(): string {
  const agora = new Date();
  const data = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
    .format(agora)
    .replace(/\./g, '')
    .replace(',', ' ·')
    .replace(' de ', ' ');
  const hora = `${agora.getHours()}h${String(agora.getMinutes()).padStart(2, '0')}`;
  return `${data} · ${hora}`;
}

function hojePorExtenso(): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}

function saudacao(): string {
  const hora = new Date().getHours();
  if (hora < 5 || hora >= 18) return 'boa noite';
  return hora < 12 ? 'bom dia' : 'boa tarde';
}

const estilos = StyleSheet.create((theme) => ({
  mesa: {
    flex: 1,
    backgroundColor: theme.sup.mesa.fundo,
    overflow: 'hidden',
  },
  cabeca: {
    position: 'absolute',
    left: 18,
    right: 120,
    zIndex: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: theme.esp[4],
  },
  slip: {
    ...tipo.kicker,
    color: theme.sup.papelFundo.tinta,
    backgroundColor: theme.sup.papelFundo.fundo,
    paddingVertical: theme.esp[1],
    paddingHorizontal: theme.esp[3],
    transform: [{ rotate: giro.rotulo }],
    boxShadow: theme.sup.mesa.sombra.pousado,
  },
  saudacao: {
    ...tipo.etiquetaManuscrita,
    color: theme.sup.mesa.tinta,
    transform: [{ rotate: giro.etiqueta }],
  },
}));
