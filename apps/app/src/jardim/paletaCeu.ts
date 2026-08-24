// J-11 (`analise-game-design/02-juiciness.md`) — luz que acompanha a hora real do dia, mesmo sem
// nenhuma sessão de leitura ter acontecido: abrir o Jardim em horários diferentes mostra uma cena
// diferente. `mvp.md` §9 pede isso como parte fechada do inventário, não como ideia solta.
export type FaixaHoraria = 'madrugada' | 'manha' | 'tarde' | 'entardecer' | 'noite';

export type PaletaCeu = {
  /** Topo do gradiente do céu. */
  topo: string;
  /** Base do gradiente, perto da linha do canteiro. */
  base: string;
  /** Cor da luz ambiente que banha a planta e o solo. */
  luz: string;
};

export function faixaHoraria(hora: number): FaixaHoraria {
  if (hora < 6) return 'madrugada';
  if (hora < 12) return 'manha';
  if (hora < 17) return 'tarde';
  if (hora < 20) return 'entardecer';
  return 'noite';
}

const CEU_VIVO: Record<FaixaHoraria, PaletaCeu> = {
  madrugada: { topo: '#101a22', base: '#22343a', luz: '#5c7a86' },
  manha: { topo: '#7fa9c4', base: '#cfe3d6', luz: '#f5eecb' },
  tarde: { topo: '#5f95b8', base: '#dcead7', luz: '#fff3d0' },
  entardecer: { topo: '#a8577a', base: '#e8a45c', luz: '#ffd68a' },
  noite: { topo: '#0c1420', base: '#1c2a38', luz: '#3a4a5c' },
};

/** RN-04.25 — dormência é outono, não cinza: a mesma progressão horária, recolorida em tons
 * quentes e baixo contraste (`J-13` — "uma dormência feia pune, uma dormência linda convida"). */
const CEU_DORMENTE: Record<FaixaHoraria, PaletaCeu> = {
  madrugada: { topo: '#1c1712', base: '#332821', luz: '#5c4a3a' },
  manha: { topo: '#8a6a4a', base: '#c9a06a', luz: '#e8c68a' },
  tarde: { topo: '#96703f', base: '#d9ab6a', luz: '#f0cf8f' },
  entardecer: { topo: '#7a4530', base: '#c06a3a', luz: '#e8985a' },
  noite: { topo: '#140f0c', base: '#2a201a', luz: '#4a3a2c' },
};

export function paletaCeuPara(hora: number, estado: 'vivo' | 'dormente'): PaletaCeu {
  const faixa = faixaHoraria(hora);
  return estado === 'vivo' ? CEU_VIVO[faixa] : CEU_DORMENTE[faixa];
}
