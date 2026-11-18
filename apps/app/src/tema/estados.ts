// O contrato de oito estados (design-system.md §7, RN-DS.16). Um componente declara quais
// se aplicam com `Extract<EstadoContrato, ...>` e nunca inventa nome novo.
export type EstadoContrato =
  | 'repouso'
  | 'pressionado'
  | 'selecionado'
  | 'desabilitado'
  | 'carregando'
  | 'vazio'
  | 'erro'
  | 'offline';
