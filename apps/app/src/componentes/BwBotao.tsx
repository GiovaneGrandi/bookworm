import { ActivityIndicator, Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { EstadoContrato } from '../tema/estados';
import { ALVO_MINIMO } from '../tema/geometria';
import type { NomeSuperficie } from '../tema/superficies';
import { tipo } from '../tema/tipografia';

type Props = {
  rotulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario';
  superficie?: NomeSuperficie;
  estado?: Extract<EstadoContrato, 'repouso' | 'desabilitado' | 'carregando'>;
  rotuloAcessivel?: string;
};

/**
 * Botão de papel (P-9): borda inferior sólida, sem gradiente, afunda ao ser pressionado.
 * Desabilitado é tinta fraca e sem borda de relevo, nunca só opacidade (design-system.md §7).
 */
export function BwBotao({
  rotulo,
  onPress,
  variante = 'secundario',
  superficie = 'papel',
  estado = 'repouso',
  rotuloAcessivel,
}: Props) {
  const { theme } = useUnistyles();
  const inativo = estado !== 'repouso';
  const primario = variante === 'primario';
  const corTexto = primario
    ? theme.semantico[superficie].acaoPrimariaTinta
    : theme.sup[superficie].tinta;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel ?? rotulo}
      accessibilityState={{ disabled: inativo, busy: estado === 'carregando' }}
      style={({ pressed }) => [
        estilos.botao(superficie, primario),
        estado === 'desabilitado' && estilos.desabilitado(superficie),
        pressed && estilos.pressionado,
      ]}
    >
      {estado === 'carregando' ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <Text
          style={[
            estilos.rotulo,
            { color: estado === 'desabilitado' ? theme.sup[superficie].tintaFraca : corTexto },
          ]}
        >
          {rotulo}
        </Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create((theme) => ({
  botao: (superficie: NomeSuperficie, primario: boolean) => ({
    minHeight: ALVO_MINIMO,
    paddingHorizontal: theme.esp[5],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primario
      ? theme.semantico[superficie].acaoPrimaria
      : theme.sup[superficie].fundo,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: primario ? theme.sup[superficie].tinta : theme.sup[superficie].borda,
  }),
  desabilitado: (superficie: NomeSuperficie) => ({
    backgroundColor: theme.sup[superficie].fundo,
    borderColor: theme.sup[superficie].borda,
    borderBottomWidth: 1,
  }),
  pressionado: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  rotulo: {
    ...tipo.kickerAbertura,
    letterSpacing: 0.16 * 10.5,
    textAlign: 'center',
  },
}));
