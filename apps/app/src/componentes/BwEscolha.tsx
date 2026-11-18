import { Pressable, type StyleProp, Text, type TextStyle, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ALVO_MINIMO } from '../tema/geometria';
import type { NomeSuperficie } from '../tema/superficies';
import { tipo } from '../tema/tipografia';

type Opcao<T extends string> = {
  valor: T;
  rotulo: string;
  /** Estilo do rótulo, para a amostra de face mostrar a própria letra. */
  estiloRotulo?: StyleProp<TextStyle>;
};

type Props<T extends string> = {
  rotulo: string;
  opcoes: readonly Opcao<T>[];
  valor: T;
  onMudar: (valor: T) => void;
  superficie?: NomeSuperficie;
  /** Uma opção por linha (as faces), em vez de lado a lado. */
  empilhado?: boolean;
};

/** Escolha entre opções, com o estado selecionado universal (design-system.md §2.3). */
export function BwEscolha<T extends string>({
  rotulo,
  opcoes,
  valor,
  onMudar,
  superficie = 'papel',
  empilhado = false,
}: Props<T>) {
  return (
    <View style={estilos.bloco} accessibilityRole="radiogroup" accessibilityLabel={rotulo}>
      <Text style={estilos.rotulo(superficie)}>{rotulo}</Text>
      <View style={empilhado ? estilos.coluna : estilos.linha}>
        {opcoes.map((o) => {
          const selecionada = o.valor === valor;
          return (
            <Pressable
              key={o.valor}
              onPress={() => onMudar(o.valor)}
              accessibilityRole="radio"
              accessibilityLabel={o.rotulo}
              accessibilityState={{ selected: selecionada, checked: selecionada }}
              style={({ pressed }) => [
                estilos.opcao(superficie, empilhado),
                (selecionada || pressed) && estilos.selecionada(superficie),
              ]}
            >
              <Text style={[estilos.texto(superficie), o.estiloRotulo]} numberOfLines={1}>
                {o.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  bloco: {
    gap: theme.esp[2],
  },
  rotulo: (superficie: NomeSuperficie) => ({
    ...tipo.kicker,
    color: theme.sup[superficie].tinta,
  }),
  linha: {
    flexDirection: 'row',
    gap: theme.esp[2],
  },
  coluna: {
    gap: theme.esp[1],
  },
  opcao: (superficie: NomeSuperficie, empilhado: boolean) => ({
    flex: empilhado ? undefined : 1,
    minHeight: ALVO_MINIMO,
    paddingHorizontal: theme.esp[3],
    justifyContent: 'center',
    alignItems: empilhado ? 'flex-start' : 'center',
    borderWidth: 1,
    borderColor: theme.sup[superficie].borda,
    backgroundColor: theme.sup[superficie].fundo,
  }),
  selecionada: (superficie: NomeSuperficie) => ({
    borderColor: theme.semantico[superficie].selecionadoBorda,
    backgroundColor: theme.semantico[superficie].selecionadoFundo,
  }),
  texto: (superficie: NomeSuperficie) => ({
    ...tipo.kicker,
    color: theme.sup[superficie].tinta,
  }),
}));
