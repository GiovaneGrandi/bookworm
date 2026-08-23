// `bw-item` — linha tocável de lista: obra, sessão, marco, destaque (design-system.md §6.1).
// Achado pela verificação de cobertura, não pelo levantamento original — o componente mais usado
// de qualquer app. Estados: repouso, pressionado, selecionado, vazio.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

type Props = ComSuperficie & {
  titulo: string;
  subtitulo?: string;
  aoTocar: () => void;
  selecionado?: boolean;
};

export function BwItem({
  superficie = 'papel',
  titulo,
  subtitulo,
  aoTocar,
  selecionado = false,
}: Props) {
  const sup = useSuperficie(superficie);
  const [pressionado, setPressionado] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitulo ? `${titulo}, ${subtitulo}` : titulo}
      accessibilityState={{ selected: selecionado }}
      onPressIn={() => setPressionado(true)}
      onPressOut={() => setPressionado(false)}
      onPress={aoTocar}
      style={[
        styles.raiz,
        { borderBottomColor: sup.borda },
        pressionado && { backgroundColor: sup.tintaFraca },
      ]}
    >
      <Text
        style={[styles.titulo, { color: sup.tinta, fontFamily: fontFamilyPara('spectral', '400') }]}
      >
        {titulo}
      </Text>
      {subtitulo && (
        <Text
          style={[
            styles.subtitulo,
            { color: sup.tintaFraca, fontFamily: fontFamilyPara('mono', '400') },
          ]}
        >
          {subtitulo}
        </Text>
      )}
      {selecionado && <View style={[styles.marcaSelecionado, { backgroundColor: sup.acento }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: { minHeight: 48, paddingVertical: 12, paddingHorizontal: 18, borderBottomWidth: 1, gap: 3 },
  titulo: { fontSize: 16, lineHeight: 20 },
  subtitulo: { fontSize: 12 },
  marcaSelecionado: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
});
