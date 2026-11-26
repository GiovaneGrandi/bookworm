import type { Aba } from '@bookworm/core';
import { Image, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ICONES_DO_LEITOR } from '../leitor';
import { ALVO_MINIMO } from '../tema/geometria';
import { iconeEmImagem } from './iconeEmImagem';

// Traços na grade de 24, no mesmo estilo dos ícones da barra de navegação. O "Aa" é letra de
// verdade, na face do texto: é ele mesmo o que o grupo ajusta.
const TRACOS: Record<Exclude<Aba, 'letra'>, string> = {
  luz: 'M16.2 12a4.2 4.2 0 1 1-8.4 0a4.2 4.2 0 1 1 8.4 0z M12 2.8v2.4 M12 18.8v2.4 M2.8 12h2.4 M18.8 12h2.4 M5.5 5.5l1.7 1.7 M16.8 16.8l1.7 1.7 M5.5 18.5l1.7-1.7 M16.8 7.2l1.7-1.7',
  pagina: 'M6 3.5h8.5l3.5 3.5v13.5H6z M14.5 3.5V7H18 M8.8 11h6.4 M8.8 14h6.4 M8.8 17h4.2',
};
const LADO = 22;

/**
 * Os ícones do cabeçalho do leitor: o sol abre a luz, o "Aa" a fonte e os tamanhos, a folha a
 * formatação da página. O do grupo aberto fica em latão, como a tela atual na barra.
 */
export function BwIconesDoLeitor({
  aberta,
  onTocar,
}: {
  aberta: Aba | null;
  onTocar: (aba: Aba) => void;
}) {
  const { theme } = useUnistyles();
  return (
    <View style={estilos.linha}>
      {ICONES_DO_LEITOR.map(({ aba, rotulo }) => {
        const ativo = aberta === aba;
        const cor = ativo ? theme.arte.barra.ativo : theme.sup.mesa.tinta;
        const uri = aba === 'letra' ? null : iconeEmImagem(TRACOS[aba], cor, LADO);
        return (
          <Pressable
            key={aba}
            onPress={() => onTocar(aba)}
            accessibilityRole="button"
            accessibilityLabel={rotulo}
            accessibilityState={{ expanded: ativo }}
            style={({ pressed }) => [
              estilos.icone,
              ativo && estilos.ativo,
              pressed && estilos.pressionado,
            ]}
          >
            {aba === 'letra' ? (
              <Text style={[estilos.letra, { color: cor }]}>
                A<Text style={estilos.letraMenor}>a</Text>
              </Text>
            ) : (
              uri && <Image source={{ uri }} style={estilos.imagem} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  linha: {
    flexDirection: 'row',
    gap: theme.esp[1],
  },
  icone: {
    width: ALVO_MINIMO,
    height: ALVO_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.esp[3],
  },
  ativo: {
    backgroundColor: theme.semantico.mesa.selecionadoFundo,
  },
  pressionado: {
    opacity: 0.7,
  },
  imagem: { width: LADO, height: LADO },
  letra: {
    fontFamily: 'Spectral_400Regular',
    fontSize: 20,
    lineHeight: 24,
  },
  letraMenor: {
    fontSize: 15,
  },
}));
