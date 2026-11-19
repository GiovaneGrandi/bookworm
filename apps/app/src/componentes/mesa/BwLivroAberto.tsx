import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Rect,
  RoundedRect,
  Shader,
  Shadow,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { tipo, tipoMiniatura } from '../../tema/tipografia';
import { shaders, uniforme } from './shaders';

type Props = {
  autor: string;
  titulo: string;
  folios: { esquerda: number | null; direita: number | null };
};

// O livro aberto do mockup B (`.o-livro`): 330 × 236, duas páginas, pauta em miniatura e a fita.
export const LIVRO = { largura: 330, altura: 236 } as const;
const PAGINA = LIVRO.largura / 2;
// Folga da tela de Skia para a sombra (à esquerda e embaixo) e para a fita, que passa da página.
const FOLGA = { x: 40, y: 10, direita: 10, baixo: 50 };
const FITA = { x: 0.62 * LIVRO.largura, topo: -6, largura: 9, altura: 266 };

/** A pauta: um traço de 1 px a cada 9 px (`.linhas`), abaixo do cabeçalho na página da esquerda. */
function pauta() {
  const p = Skia.Path.Make();
  const tracos = (x0: number, x1: number, y0: number, y1: number) => {
    for (let y = y0 + 6.5; y < y1; y += 9) {
      p.moveTo(x0, y);
      p.lineTo(x1, y);
    }
  };
  tracos(18, PAGINA - 18, 64, LIVRO.altura - 27);
  tracos(PAGINA + 18, LIVRO.largura - 18, 18, LIVRO.altura - 27);
  return p;
}

/** A fita marcadora, com o corte em V na ponta (`clip-path` do mockup). */
function fita() {
  const { x, topo, largura, altura } = FITA;
  const p = Skia.Path.Make();
  p.moveTo(x, topo);
  p.lineTo(x + largura, topo);
  p.lineTo(x + largura, topo + altura);
  p.lineTo(x + largura / 2, topo + altura * 0.94);
  p.lineTo(x, topo + altura);
  p.close();
  return p;
}

/** O livro em leitura, aberto na página corrente (RN-DV.3, §9.4). */
export function BwLivroAberto({ autor, titulo, folios }: Props) {
  const { theme } = useUnistyles();
  const a = theme.arte.livro;
  const papel = theme.sup.papel.fundo;
  const caminhos = useMemo(() => ({ pauta: pauta(), fita: fita() }), []);
  const grao = useMemo(() => ({ grao: uniforme(a.grao) }), [a.grao]);

  return (
    <View style={estilos.livro}>
      <Canvas style={estilos.arte}>
        <Group transform={[{ translateX: FOLGA.x }, { translateY: FOLGA.y }]}>
          <RoundedRect x={0} y={0} width={PAGINA} height={LIVRO.altura} r={4} color={papel}>
            <Shadow dx={-8} dy={14} blur={11} color={a.sombraPagina} />
          </RoundedRect>
          <RoundedRect x={PAGINA} y={0} width={PAGINA} height={LIVRO.altura} r={4} color={papel}>
            <Shadow dx={-2} dy={14} blur={11} color={a.sombraPagina} />
          </RoundedRect>
          <Rect x={0} y={0} width={PAGINA} height={LIVRO.altura}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(PAGINA, 0)}
              colors={['transparent', 'transparent', a.dobra]}
              positions={[0, 0.8, 1]}
            />
          </Rect>
          <Rect x={PAGINA} y={0} width={PAGINA} height={LIVRO.altura}>
            <LinearGradient
              start={vec(LIVRO.largura, 0)}
              end={vec(PAGINA, 0)}
              colors={['transparent', 'transparent', a.dobra]}
              positions={[0, 0.82, 1]}
            />
          </Rect>
          <Rect x={0} y={0} width={LIVRO.largura} height={LIVRO.altura}>
            <Shader source={shaders.grao} uniforms={grao} />
          </Rect>
          <Path path={caminhos.pauta} style="stroke" strokeWidth={1} color={a.linha} />
          <Path path={caminhos.fita}>
            <LinearGradient
              start={vec(FITA.x, 0)}
              end={vec(FITA.x + FITA.largura, 0)}
              colors={[a.fita.borda, a.fita.meio, a.fita.borda]}
            />
            <Shadow dx={-3} dy={4} blur={3} color={a.sombraFita} />
          </Path>
        </Group>
      </Canvas>

      <View style={estilos.cabecalho}>
        <Text style={estilos.kicker} numberOfLines={1}>
          {autor}
        </Text>
        <Text style={estilos.titulo} numberOfLines={2}>
          {titulo}
        </Text>
      </View>
      {folios.esquerda !== null && (
        <Text style={[estilos.folio, estilos.folioEsquerda]}>{folios.esquerda}</Text>
      )}
      {folios.direita !== null && (
        <Text style={[estilos.folio, estilos.folioDireita]}>{folios.direita}</Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  livro: {
    width: LIVRO.largura,
    height: LIVRO.altura,
  },
  arte: {
    position: 'absolute',
    left: -FOLGA.x,
    top: -FOLGA.y,
    width: LIVRO.largura + FOLGA.x + FOLGA.direita,
    height: LIVRO.altura + FOLGA.y + FOLGA.baixo,
  },
  cabecalho: {
    position: 'absolute',
    left: theme.esp[5],
    top: theme.esp[5],
    width: PAGINA - 2 * theme.esp[5],
    alignItems: 'center',
  },
  kicker: {
    ...tipo.kickerMicro,
    color: theme.sup.papel.tinta,
    textAlign: 'center',
  },
  titulo: {
    ...tipoMiniatura.tituloPagina,
    color: theme.sup.papel.tinta,
    textAlign: 'center',
  },
  folio: {
    ...tipoMiniatura.folio,
    position: 'absolute',
    bottom: theme.esp[3],
    color: theme.arte.livro.folio,
  },
  folioEsquerda: { left: theme.esp[5] },
  folioDireita: { right: theme.esp[5] },
}));
