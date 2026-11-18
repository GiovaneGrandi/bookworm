import { corDaTemperatura, TEMPERATURA_LUZ, type TemaLeitura } from '@bookworm/core';
import { comAlfa } from './semantico';
import { superficies } from './superficies';

// Os quatro temas de leitura (RN-02.17): decisão da leitora sobre a página, não superfícies da
// marca. Claro, sépia e escuro reaproveitam papel, sépia e carvão; o preto puro (OLED) é o
// único valor que nenhuma superfície tinha.
const PRETO_PURO = '#000000';

export const temasDeLeitura: Record<
  TemaLeitura,
  { fundo: string; tinta: string; tintaFraca: string; acento: string; escuro: boolean }
> = {
  claro: { ...pick(superficies.papel), escuro: false },
  sepia: { ...pick(superficies.sepia), escuro: false },
  escuro: { ...pick(superficies.carvao), escuro: true },
  preto: {
    fundo: PRETO_PURO,
    tinta: superficies.carvao.tinta,
    tintaFraca: superficies.carvao.tintaFraca,
    acento: superficies.carvao.acento,
    escuro: true,
  },
};

function pick(s: { fundo: string; tinta: string; tintaFraca: string; acento: string }) {
  return { fundo: s.fundo, tinta: s.tinta, tintaFraca: s.tintaFraca, acento: s.acento };
}

/** A camada de temperatura sobre a página, composta em "multiply" (RN-02.16a). */
export function corDaCamadaDeLuz({ r, g, b }: { r: number; g: number; b: number }): string {
  return `rgb(${r},${g},${b})`;
}

/** A camada que escurece abaixo do brilho do sistema (RN-02.16b). */
export function corDaCamadaDeBrilho(brilho: number): string {
  return comAlfa(PRETO_PURO, Math.round((1 - brilho) * 100) / 100);
}

/** O trilho do controle de temperatura: do âmbar de 2.700 K ao azulado de 6.500 K. */
export const trilhoDeTemperatura = (() => {
  const paradas = [TEMPERATURA_LUZ.min, 3450, TEMPERATURA_LUZ.padrao, 5350, TEMPERATURA_LUZ.max];
  const cores = paradas.map((k) => corDaCamadaDeLuz(corDaTemperatura(k)));
  return `linear-gradient(to right, ${cores.join(', ')})`;
})();
