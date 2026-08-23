// Caderno — destaques e anotações de todas as obras (design-system.md §10). Estado vazio.
import { BwFolha, BwVazio } from '../../src/componentes/index.js';

export default function TelaCaderno() {
  return (
    <BwFolha anuncio="Caderno">
      <BwVazio
        titulo="Nenhum destaque ainda"
        explicacao="Grife um trecho durante a leitura para vê-lo aqui, junto das suas anotações."
      />
    </BwFolha>
  );
}
