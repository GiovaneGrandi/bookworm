import { objetosNaMesa, totalDePaginas } from '@bookworm/core';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { type GestureResponderEvent, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BwMenuRapido, type ItemDoMenu, type MenuRapido } from '../src/componentes/BwMenuRapido';
import { BwObjetoMesa } from '../src/componentes/BwObjetoMesa';
import { useGiroDaMesa, useTransicaoDaMesa } from '../src/componentes/BwTransicaoDaMesa';
import { BANDEJA, BwBandejaDeArame } from '../src/componentes/mesa/BwBandejaDeArame';
import { BwCapaFechada, CAPA } from '../src/componentes/mesa/BwCapaFechada';
import { BwFeltro } from '../src/componentes/mesa/BwFeltro';
import { BwFichario, FICHARIO } from '../src/componentes/mesa/BwFichario';
import { BwLivroAberto, LIVRO } from '../src/componentes/mesa/BwLivroAberto';
import { BwLugarReservado } from '../src/componentes/mesa/BwLugarReservado';
import { BwLuminaria } from '../src/componentes/mesa/BwLuminaria';
import { BwFeixe, BwPenumbra } from '../src/componentes/mesa/BwLuzDaMesa';
import { BwMesaEmLista, type ItemDaLista } from '../src/componentes/mesa/BwMesaEmLista';
import { carregarIndice, usePreferencias } from '../src/dados/leitura';
import { marcarAberta, pausar, useObras } from '../src/dados/obras';
import type { Obra } from '../src/dados/schema';
import {
  COMPOSICAO,
  encaixarComposicao,
  mesaEmLista,
  textosDaBandeja,
  textosDaGaveta,
  textosDoLivro,
  textosDoSegundoLivro,
} from '../src/mesa';
import { espelhar, giro } from '../src/tema/geometria';
import { tipo } from '../src/tema/tipografia';

/** Na mesa vazia, a bandeja cresce, vai para o lugar do livro, sob a luz, e é o convite (Q13). */
const BANDEJA_EM_DESTAQUE = 1.35;
/** A v2 encolhe a bandeja e o fichário para os dois caberem embaixo, ao alcance do polegar. */
const ESCALA_DA_BANDEJA = 0.94;
const ESCALA_DO_FICHARIO = 0.9;

type Abertura = { menu: Omit<MenuRapido, 'x' | 'y'> };

/**
 * A mesa: tela inicial e único hub (RN-DV.1), na composição da Direção B v2. Cada objeto é porta
 * e mostra o estado da função (RN-DV.3); só os 2 livros em leitura mais recentes ficam pousados
 * (RN-DV.4). A mesa é desenhada numa prancha de 390 × 836 escalada entre as áreas seguras. A
 * ordem dos objetos na árvore é a ordem de leitura do TalkBack; quem fica por cima é a `camada`.
 */
export default function Mesa() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { width, height, fontScale } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { erguer, virar } = useTransicaoDaMesa();
  const { estilo: estiloDoGiro, desvirar } = useGiroDaMesa();
  const preferencias = usePreferencias();
  const mesa = objetosNaMesa(useObras());
  const [principal, segundo] = mesa.livros;
  const [acesa, setAcesa] = useState(true);
  const [menu, setMenu] = useState<MenuRapido | null>(null);
  const corDaLeitura = theme.leitura[preferencias.tema].fundo;
  const papel = theme.sup.papel.fundo;
  const prancha = encaixarComposicao(
    { largura: width, altura: height },
    { topo: top, baixo: bottom }
  );

  useFocusEffect(desvirar);

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

  function abrirBandeja(escolher = false) {
    erguer('/bandeja', papel, 'folha', () =>
      router.push({
        pathname: '/bandeja',
        params: escolher ? { erguido: '1', escolher: '1' } : { erguido: '1' },
      })
    );
  }

  function abrirEstante(buscar = false) {
    virar(() =>
      router.push({
        pathname: '/gaveta',
        params: buscar ? { erguido: 'virada', buscar: '1' } : { erguido: 'virada' },
      })
    );
  }

  const alternarLuz = useCallback(() => setAcesa((a) => !a), []);

  const bandeja = textosDaBandeja(mesa.vazia);
  const gaveta = textosDaGaveta(mesa.gaveta);
  const livro = principal ? textosDoLivro(principal, totalDoPrincipal) : null;
  const fechado = segundo ? textosDoSegundoLivro(segundo) : null;
  const pct = (o: Obra) => `${Math.round(o.progresso * 100)}% lido`;
  const paginaDoPrincipal =
    livro?.pagina != null
      ? `p. ${livro.pagina}${totalDoPrincipal ? ` de ${totalDePaginas(totalDoPrincipal)}` : ''}`
      : null;

  // Os menus de toque longo (v2): só atalhos que já levam a algum lugar.
  const menuDoLivro = (o: Obra, sub: string, abrir: string): Abertura['menu'] => ({
    titulo: o.titulo.replace(/\s+/g, ' ').trim(),
    sub,
    itens: [
      { rotulo: abrir, primario: true, aoTocar: () => continuar(o) },
      { rotulo: 'Pôr em pausa', aoTocar: () => pausar(o.id) },
      { rotulo: 'Ver na estante', aoTocar: () => abrirEstante() },
    ],
  });
  const menus = {
    principal: principal
      ? menuDoLivro(
          principal,
          `${paginaDoPrincipal ?? pct(principal)} · na mesa`,
          'Continuar lendo'
        )
      : null,
    segundo: segundo ? menuDoLivro(segundo, `${pct(segundo)} · na mesa`, 'Abrir no leitor') : null,
    gaveta: {
      titulo: 'Gaveta e estante',
      sub: `${mesa.gaveta.lendo} lendo · ${mesa.gaveta.em_pausa} em pausa · ${mesa.gaveta.quero_ler} quero ler`,
      itens: [
        { rotulo: 'Abrir a estante', primario: true, aoTocar: () => abrirEstante() },
        { rotulo: 'Buscar livro', aoTocar: () => abrirEstante(true) },
      ],
    },
    bandeja: {
      titulo: 'Bandeja de entrada',
      sub: 'EPUB ou PDF sem DRM',
      itens: [
        { rotulo: 'Escolher arquivo', primario: true, aoTocar: () => abrirBandeja(true) },
        { rotulo: 'Acervo de domínio público', aoTocar: () => abrirBandeja() },
      ],
    },
    luminaria: {
      titulo: 'Luminária da mesa',
      sub: acesa
        ? `luz acesa · ${preferencias.temperatura.toLocaleString('pt-BR')} K`
        : 'luz apagada',
      itens: [
        { rotulo: acesa ? 'Apagar a luz' : 'Acender a luz', primario: true, aoTocar: alternarLuz },
        ...(principal
          ? [{ rotulo: 'Ajustar a temperatura no leitor', aoTocar: () => continuar(principal) }]
          : []),
      ] as ItemDoMenu[],
    },
  } satisfies Record<string, Abertura['menu'] | null>;

  const segurar = (m: Abertura['menu']) => (e: GestureResponderEvent) =>
    setMenu({ ...m, x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
  const acoesDe = (m: Abertura['menu']) => ({
    acoes: m.itens.map((it, i) => ({ nome: `atalho${i}`, rotulo: it.rotulo })),
    onAcao: (nome: string) => m.itens[Number(nome.replace('atalho', ''))]?.aoTocar(),
  });

  if (mesaEmLista(fontScale)) {
    const itens: ItemDaLista[] = [
      ...(principal && livro
        ? [
            {
              titulo: `Continuar ${principal.titulo.replace(/\s+/g, ' ').trim()}`,
              sub: paginaDoPrincipal ?? pct(principal),
              primario: true,
              aoTocar: () => continuar(principal),
            },
          ]
        : []),
      ...(segundo
        ? [
            {
              titulo: segundo.titulo,
              sub: `lendo · ${pct(segundo)}`,
              aoTocar: () => continuar(segundo),
            },
          ]
        : []),
      { titulo: 'Jardim', sub: 'em breve' },
      { titulo: 'Meu desempenho', sub: 'em breve' },
      {
        titulo: 'Gaveta e estante',
        sub: mesa.gaveta.total === 0 ? 'vazia' : menus.gaveta.sub,
        aoTocar: () => router.push('/gaveta'),
      },
      {
        titulo: 'Pôr um livro na mesa',
        sub: 'EPUB ou PDF',
        aoTocar: () => router.push('/bandeja'),
      },
      { titulo: 'Ajustes', sub: 'em breve' },
    ];
    return (
      <View style={estilos.mesa}>
        <BwFeltro acesa={false} />
        <BwMesaEmLista data={hoje()} saudacao={saudacao()} itens={itens} />
      </View>
    );
  }

  return (
    <View style={estilos.mesa}>
      <Animated.View style={[estilos.mesa, estiloDoGiro]}>
        <BwFeltro acesa={acesa} />

        <View
          style={[
            estilos.prancha,
            { left: prancha.x, top: prancha.y, transform: [{ scale: prancha.escala }] },
          ]}
        >
          <BwPenumbra acesa={acesa} />
          <BwFeixe acesa={acesa} temperatura={preferencias.temperatura} />

          <View
            accessible
            accessibilityLabel={`${hojePorExtenso()}. ${saudacao()}`}
            style={estilos.cabeca}
          >
            <Text style={estilos.slip}>{hoje()}</Text>
            <Text style={estilos.saudacao}>{saudacao()}</Text>
          </View>

          <BwLugarReservado
            etiqueta="Ajustes"
            descricao="meta diária, lembrete e conta"
            forma="retangulo"
            posicao={{ left: 20, top: 88 }}
            largura={138}
            altura={52}
            camada={6}
            rotacao="-2deg"
            etiquetaEm={{ left: -10, bottom: -10 }}
            rotacaoEtiqueta={espelhar(giro.fita)}
          />

          {segundo && fechado && (
            <BwObjetoMesa
              chave={`/leitor/${segundo.id}`}
              etiqueta={fechado.etiqueta}
              rotuloAcessivel={fechado.rotulo}
              onAbrir={() => continuar(segundo)}
              onSegurar={segurar(menus.segundo as Abertura['menu'])}
              {...acoesDe(menus.segundo as Abertura['menu'])}
              posicao={{ left: 190, top: 96 }}
              largura={CAPA.largura}
              altura={CAPA.altura}
              camada={4}
              rotacao="9deg"
              etiquetaEm={{ left: -28, top: -14 }}
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
              onSegurar={segurar(menus.principal as Abertura['menu'])}
              {...acoesDe(menus.principal as Abertura['menu'])}
              posicao={{ left: 30, top: 198 }}
              largura={LIVRO.largura}
              altura={LIVRO.altura}
              camada={10}
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

          <BwLugarReservado
            etiqueta="Jardim"
            descricao="a sequência de dias de leitura"
            forma="circulo"
            posicao={{ left: 24, top: 452 }}
            largura={156}
            altura={156}
            camada={5}
            etiquetaEm={{ left: 84, top: 118 }}
            rotacaoEtiqueta={giro.marginalia}
          />

          <BwLugarReservado
            etiqueta="Desempenho"
            descricao="a semana e o mapa de constância"
            forma="retangulo"
            posicao={{ left: 214, top: 454 }}
            largura={146}
            altura={176}
            camada={5}
            rotacao="2deg"
            etiquetaEm={{ left: -6, bottom: 2 }}
            rotacaoEtiqueta={giro.marginalia}
          />

          <BwObjetoMesa
            chave="/gaveta"
            etiqueta={gaveta.etiqueta}
            rotuloAcessivel={gaveta.rotulo}
            onAbrir={() => abrirEstante()}
            onSegurar={segurar(menus.gaveta)}
            {...acoesDe(menus.gaveta)}
            posicao={{ left: 16, top: 642 }}
            largura={FICHARIO.largura}
            altura={FICHARIO.altura}
            escala={ESCALA_DO_FICHARIO}
            camada={5}
            rotacao="-1.5deg"
            etiquetaEm={{ left: 9, top: -14 }}
            rotacaoEtiqueta={giro.etiqueta}
          >
            <BwFichario abas={gaveta.abas} />
          </BwObjetoMesa>

          <BwObjetoMesa
            chave="/bandeja"
            etiqueta={bandeja.etiqueta}
            etiquetaEmDestaque={mesa.vazia}
            rotuloAcessivel={bandeja.rotulo}
            onAbrir={() => abrirBandeja()}
            onSegurar={segurar(menus.bandeja)}
            {...acoesDe(menus.bandeja)}
            posicao={
              mesa.vazia
                ? {
                    left: (COMPOSICAO.largura - BANDEJA.largura * BANDEJA_EM_DESTAQUE) / 2,
                    top: 230,
                  }
                : { left: 212, top: 654 }
            }
            largura={BANDEJA.largura}
            altura={BANDEJA.altura}
            escala={mesa.vazia ? BANDEJA_EM_DESTAQUE : ESCALA_DA_BANDEJA}
            camada={mesa.vazia ? 10 : 7}
            rotacao={mesa.vazia ? '-2deg' : '2deg'}
            etiquetaEm={{ left: 12, bottom: -12 }}
            rotacaoEtiqueta={giro.etiqueta}
          >
            <BwBandejaDeArame />
          </BwObjetoMesa>

          <BwLuminaria
            acesa={acesa}
            temperatura={preferencias.temperatura}
            onAlternar={alternarLuz}
            onSegurar={segurar(menus.luminaria)}
          />
        </View>
      </Animated.View>

      <BwMenuRapido menu={menu} onFechar={() => setMenu(null)} />
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
  prancha: {
    position: 'absolute',
    width: COMPOSICAO.largura,
    height: COMPOSICAO.altura,
    transformOrigin: 'left top',
  },
  cabeca: {
    position: 'absolute',
    left: 18,
    top: 18,
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
