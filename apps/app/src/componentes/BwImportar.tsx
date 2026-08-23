// `bw-importar` — área de importação de EPUB/PDF (design-system.md §6.3, RN-02.1d). Estados:
// repouso, arrastando, carregando, erro. "Arrastar" em mobile é a área de toque para abrir o
// seletor de arquivo, não drag-and-drop de desktop — o estado existe para o feedback visual do
// gesto de toque prolongado / picker aberto, não para um drop-zone que Android não tem.
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { fontFamilyPara } from '../tema/fontes.js';
import { borda } from '../tema/geometria.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

export type EstadoBwImportar = 'repouso' | 'arrastando' | 'carregando' | 'erro';

type Props = ComSuperficie & {
  estado?: EstadoBwImportar;
  mensagemDeErro?: string;
  aoTocar: () => void;
};

export function BwImportar({
  superficie = 'papel',
  estado = 'repouso',
  mensagemDeErro,
  aoTocar,
}: Props) {
  const sup = useSuperficie(superficie);
  const emErro = estado === 'erro';
  const carregando = estado === 'carregando';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        emErro
          ? `Erro ao importar: ${mensagemDeErro}`
          : 'Importar EPUB ou PDF. Formatos aceitos: EPUB, PDF'
      }
      accessibilityState={{ busy: carregando, disabled: carregando }}
      onPress={aoTocar}
      disabled={carregando}
      style={[
        styles.raiz,
        {
          borderColor: emErro ? sup.acento : sup.borda,
          borderWidth: emErro ? borda.marcada : borda.provisoriaTracejada,
          borderStyle: emErro ? 'solid' : 'dashed',
          backgroundColor: estado === 'arrastando' ? sup.tintaFraca : 'transparent',
        },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={sup.acento} />
      ) : (
        <>
          <Text
            style={[
              styles.rotulo,
              {
                color: emErro ? sup.tinta : sup.tinta,
                fontFamily: fontFamilyPara('spectral', '500'),
              },
            ]}
          >
            {emErro ? 'Não foi possível importar' : 'Toque para importar um EPUB ou PDF'}
          </Text>
          <Text
            style={[
              styles.formato,
              { color: sup.tintaFraca, fontFamily: fontFamilyPara('mono', '400') },
            ]}
          >
            {emErro ? mensagemDeErro : 'EPUB · PDF'}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: { minHeight: 108, alignItems: 'center', justifyContent: 'center', padding: 18, gap: 6 },
  rotulo: { fontSize: 16, textAlign: 'center' },
  formato: { fontSize: 8.5, letterSpacing: 0.26, textTransform: 'uppercase' },
});
