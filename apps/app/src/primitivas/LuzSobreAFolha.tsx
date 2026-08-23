// P-2 — luz sobre a folha. Anexo A: "degrada, mas de forma aceitável" — sem gradiente radial
// nativo, a mancha vira um círculo sólido de borda dura. Registrado como limite conhecido, não
// escondido atrás de um nome que prometa suavidade que a plataforma não entrega.
import { StyleSheet, View } from 'react-native';

export function LuzSobreAFolha({ intensidade = 0.35 }: { intensidade?: number }) {
  return (
    <View
      pointerEvents="none"
      style={[styles.mancha, { backgroundColor: `rgba(255,255,255,${intensidade})` }]}
    />
  );
}

const styles = StyleSheet.create({
  mancha: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});
