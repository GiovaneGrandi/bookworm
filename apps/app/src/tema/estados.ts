// `specs/design-system.md` §7 — contrato de estados (RN-DS.16). Um componente do inventário
// declara quais dos oito se aplicam, e nenhum deles fica sem desenho. Tipo compartilhado — cada
// componente define seu próprio subconjunto com `Extract<EstadoContrato, ...>` em vez de
// inventar nomes de estado novos.
export type EstadoContrato =
  | 'repouso'
  | 'pressionado'
  | 'selecionado'
  | 'desabilitado'
  | 'carregando'
  | 'vazio'
  | 'erro'
  | 'offline';
