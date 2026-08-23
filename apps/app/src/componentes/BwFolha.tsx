// `bw-folha` — superfície de conteúdo (design-system.md §6.1). Estados: repouso, carregando,
// vazio, offline. `carregando` nunca é giro genérico (RN-DS.16): a superfície permanece e o dado
// chega — este componente só monta o palco; quem preenche decide o que aparece dentro.
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Grao } from '../primitivas/Grao.js';
import type { EstadoContrato } from '../tema/estados.js';
import { type ComSuperficie, useSuperficie } from './useSuperficie.js';

export type EstadoBwFolha = Extract<EstadoContrato, 'repouso' | 'carregando' | 'vazio' | 'offline'>;

type Props = PropsWithChildren<
  ComSuperficie & {
    estado?: EstadoBwFolha;
    /** RN-DS.12 — anúncio do que a região contém, não da forma. */
    anuncio?: string;
  }
>;

export function BwFolha({ superficie = 'papel', estado = 'repouso', anuncio, children }: Props) {
  const sup = useSuperficie(superficie);

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={anuncio}
      style={[styles.raiz, { backgroundColor: sup.fundo }]}
    >
      <Grao style={styles.grao}>{children}</Grao>
      {estado === 'offline' && <AvisoOffline sup={sup} />}
    </View>
  );
}

function AvisoOffline({ sup }: { sup: { tintaFraca: string; borda: string } }) {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel="Modo offline: mostrando dados salvos localmente, sincronizando quando reconectar"
      style={[styles.avisoOffline, { borderColor: sup.borda }]}
    />
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  grao: { flex: 1 },
  avisoOffline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomWidth: 1,
  },
});
