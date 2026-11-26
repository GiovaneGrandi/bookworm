import { objetosNaMesa } from '@bookworm/core';
import { PaintStyle, Skia, StrokeCap, StrokeJoin } from '@shopify/react-native-skia';
import { useRouter } from 'expo-router';
import { Image, PixelRatio, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { marcarAberta, useObras } from '../dados/obras';
import { type Destino, itensDaBarra, type Tela } from '../navegacao';
import { ALVO_MINIMO } from '../tema/geometria';
import { tipo } from '../tema/tipografia';
import { useTransicaoDaMesa } from './BwTransicaoDaMesa';

// Os ícones de traço da régua, desenhados numa grade de 24 (protótipo da barra, estilo A).
const ICONES: Record<Destino, string> = {
  mesa: 'M4.5 7h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-9A1.5 1.5 0 0 1 4.5 7z M19.5 5a2 2 0 1 1-4 0a2 2 0 1 1 4 0z M7 11h5v4H7z',
  ler: 'M3 6.5c3-1.2 6-1 9 .8 3-1.8 6-2 9-.8v12c-3-1.2-6-1-9 .8-3-1.8-6-2-9-.8z M12 7.3v12',
  biblioteca: 'M4 7h4.2v13H4z M9.6 9.5h4v10.5h-4z M15 4.5h4.6v15.5H15z M4 10h4.2 M15 7.5h4.6',
  jardim:
    'M7 14h10l-1.5 6h-7z M12 14V8.5 M12 10.5c-3 0-4.5-1.8-4.5-4.3 3 0 4.5 1.8 4.5 4.3z M12 9c0-2.8 1.7-4.3 4.4-4.3 0 2.8-1.7 4.3-4.4 4.3z',
};
const LADO = 22;

/**
 * Os ícones viram imagem (PNG) desenhada pela Skia na CPU, uma vez por ícone e cor, e não um
 * componente Canvas. Cada Canvas é uma superfície GL; no leitor, a barra fica por cima da WebView do
 * Readium e sai de cena quando o painel de leitura abre. Destruir aquela superfície no meio de
 * um quadro derrubava o emulador inteiro (24/11/2026: 3 quedas com Canvas, 0 em 25 aberturas
 * do painel sem ele). Imagem não tem superfície para destruir.
 */
const cacheDeIcones = new Map<string, string>();
function iconeEmImagem(destino: Destino, cor: string): string | null {
  const chave = `${destino}|${cor}`;
  const pronto = cacheDeIcones.get(chave);
  if (pronto) return pronto;
  const escala = PixelRatio.get();
  const px = Math.round(LADO * escala);
  const superficie = Skia.Surface.Make(px, px); // CPU, nunca GPU
  const caminho = Skia.Path.MakeFromSVGString(ICONES[destino]);
  if (!superficie || !caminho) return null;
  const tinta = Skia.Paint();
  tinta.setAntiAlias(true);
  tinta.setStyle(PaintStyle.Stroke);
  tinta.setStrokeWidth(1.6);
  tinta.setStrokeCap(StrokeCap.Round);
  tinta.setStrokeJoin(StrokeJoin.Round);
  tinta.setColor(Skia.Color(cor));
  const tela = superficie.getCanvas();
  tela.scale(px / 24, px / 24);
  tela.drawPath(caminho, tinta);
  superficie.flush();
  const uri = `data:image/png;base64,${superficie.makeImageSnapshot().encodeToBase64()}`;
  cacheDeIcones.set(chave, uri);
  return uri;
}

type Props = {
  /** A tela em que a barra está. */
  atual: Exclude<Tela, 'mesa'>;
  /** Como esta tela volta à mesa (a mesma saída do voltar do sistema). */
  onMesa: () => void;
};

/**
 * A barra de navegação, estilo régua de feltro (RN-DV.11): qualquer tela a um toque. Trocar de
 * tela substitui a atual em vez de empilhar, então o voltar do sistema leva sempre à mesa.
 */
export function BwBarraDeNavegacao({ atual, onMesa }: Props) {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { bottom } = useSafeAreaInsets();
  const [livro] = objetosNaMesa(useObras()).livros;
  const itens = itensDaBarra(atual, livro ?? null);
  const { giro } = useTransicaoDaMesa();

  function ir(destino: Destino) {
    if (destino === atual) return;
    if (destino === 'mesa') return onMesa();
    // Aberta pela virada de câmera, a estante fica sobre a mesa girada em 3D. A mesa está
    // escondida, então volta de frente na hora, antes da troca: a transição nunca desenha uma
    // mesa girada por baixo da tela nova. O item Mesa continua desvirando com animação.
    giro.value = 0;
    if (destino === 'ler' && livro) {
      marcarAberta(livro.id);
      router.replace({ pathname: '/leitor/[id]', params: { id: livro.id, via: 'barra' } });
    } else if (destino === 'biblioteca') {
      router.replace({ pathname: '/gaveta', params: { via: 'barra' } });
    }
  }

  return (
    <View accessibilityRole="tablist" style={[estilos.barra, { paddingBottom: bottom }]}>
      {itens.map((item) => {
        const cor = item.atual
          ? theme.arte.barra.ativo
          : item.disponivel
            ? theme.sup.mesa.tintaFraca
            : theme.sup.mesa.borda;
        return (
          <Pressable
            key={item.destino}
            onPress={() => ir(item.destino)}
            disabled={!item.disponivel}
            accessibilityRole="tab"
            accessibilityLabel={item.rotuloAcessivel}
            accessibilityState={{ selected: item.atual, disabled: !item.disponivel }}
            style={({ pressed }) => [estilos.item, pressed && estilos.pressionado]}
          >
            {item.atual && <View style={estilos.filete} />}
            <IconeDaBarra destino={item.destino} cor={cor} />
            <Text style={[estilos.rotulo, { color: cor }]}>{item.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function IconeDaBarra({ destino, cor }: { destino: Destino; cor: string }) {
  const uri = iconeEmImagem(destino, cor);
  return uri ? <Image source={{ uri }} style={estilos.icone} /> : <View style={estilos.icone} />;
}

const estilos = StyleSheet.create((theme) => ({
  barra: {
    flexDirection: 'row',
    backgroundColor: theme.arte.barra.fundo,
    borderTopWidth: 1,
    borderTopColor: theme.arte.barra.filete,
    boxShadow: theme.arte.barra.sombra,
  },
  item: {
    flex: 1,
    minHeight: ALVO_MINIMO + 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.esp[1],
  },
  pressionado: {
    backgroundColor: theme.semantico.mesa.selecionadoFundo,
  },
  filete: {
    position: 'absolute',
    top: 0,
    left: '30%',
    right: '30%',
    height: 2,
    experimental_backgroundImage: `linear-gradient(90deg, ${theme.arte.barra.latao[0]}, ${theme.arte.barra.latao[1]})`,
  },
  icone: { width: LADO, height: LADO },
  rotulo: {
    ...tipo.kickerMicro,
  },
}));
