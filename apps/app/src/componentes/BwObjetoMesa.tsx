import { type ReactNode, useCallback } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO, type Giro } from '../tema/geometria';
import { BwEtiqueta } from './BwEtiqueta';
import { useTransicaoDaMesa } from './BwTransicaoDaMesa';

type Props = {
  /** A rota que o objeto abre. É por ela que a folha, ao pousar, acha o lugar de volta. */
  chave: string;
  /** Etiqueta datilografada: parte do objeto (RN-DV.10). */
  etiqueta: string;
  /** Etiqueta na cor de ação, para o objeto que convida (o livro em leitura, a bandeja vazia). */
  etiquetaEmDestaque?: boolean;
  /** O que o leitor de tela anuncia: a etiqueta e o estado da função (RN-DS.12, RN-DV.3). */
  rotuloAcessivel: string;
  onAbrir: () => void;
  /** Posição e tamanho sobre o feltro: composição livre, fora da escala tônica (RN-DV.8). */
  posicao: ViewStyle;
  largura: number;
  altura: number;
  /** Ordem de empilhamento do mockup B: quem fica por cima de quem. */
  camada: number;
  rotacao?: string;
  /** Onde a etiqueta fica presa ao objeto, como no mockup B. */
  etiquetaEm: ViewStyle;
  rotacaoEtiqueta?: Giro | string;
  children: ReactNode;
};

/** Um objeto pousado na mesa, que é porta para uma função (RN-DV.3). */
export function BwObjetoMesa({
  chave,
  etiqueta,
  etiquetaEmDestaque = false,
  rotuloAcessivel,
  onAbrir,
  posicao,
  largura,
  altura,
  camada,
  rotacao = '0deg',
  etiquetaEm,
  rotacaoEtiqueta,
  children,
}: Props) {
  const { registrar } = useTransicaoDaMesa();
  const lugar = useCallback((v: View | null) => registrar(chave, v), [registrar, chave]);

  return (
    <Pressable
      ref={lugar}
      onPress={onAbrir}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      style={[estilos.objeto, posicao, { width: largura, height: altura, zIndex: camada }]}
    >
      {({ pressed }) => (
        <View style={[estilos.giro, { transform: [{ rotate: rotacao }] }]}>
          <View style={pressed ? estilos.pressionado : undefined}>{children}</View>
          <View style={[estilos.etiqueta, etiquetaEm]}>
            <BwEtiqueta rotacao={rotacaoEtiqueta} destaque={etiquetaEmDestaque}>
              {etiqueta}
            </BwEtiqueta>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  objeto: {
    position: 'absolute',
    minHeight: ALVO_MINIMO,
    minWidth: ALVO_MINIMO,
  },
  giro: { flex: 1 },
  pressionado: { transform: [{ translateY: 2 }, { scale: 0.99 }] },
  etiqueta: { position: 'absolute' },
});
