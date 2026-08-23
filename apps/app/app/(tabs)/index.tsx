// Jardim — casa do hábito: ofensiva, meta do dia, canteiro, congelamentos (design-system.md §10).
// Tela de entrada. Ainda sem dado real (Estágio 6+); hoje é o estado vazio, com arte (RN-DS.16).
import { BwFolha, BwVazio } from '../../src/componentes/index.js';

export default function TelaJardim() {
  return (
    <BwFolha superficie="mesa" anuncio="Jardim">
      <BwVazio
        superficie="mesa"
        titulo="Seu jardim ainda não brotou"
        explicacao="Leia hoje para plantar o primeiro dia da sua ofensiva."
      />
    </BwFolha>
  );
}
