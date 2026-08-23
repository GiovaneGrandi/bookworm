// Jardim — casa do hábito: ofensiva, meta do dia, canteiro, congelamentos (design-system.md §10).
// Tela de entrada. Ainda sem dado real (Estágio 6+); hoje é o estado vazio, com arte (RN-DS.16).
import { router } from 'expo-router';
import { BwFolha, BwVazio } from '../../src/componentes/index.js';

export default function TelaJardim() {
  return (
    <BwFolha superficie="mesa" anuncio="Jardim">
      <BwVazio
        superficie="mesa"
        titulo="Seu jardim ainda não brotou"
        explicacao="Leia hoje para plantar o primeiro dia da sua ofensiva."
        // Arnês de validação manual do Estágio 6 — abre o painel de debug da máquina de estados,
        // não o leitor de verdade (esse mora na Biblioteca, `RN-02.8`). Remover junto do resto do
        // arnês quando os 7 cenários do plano tiverem cobertura equivalente pelo leitor real.
        saida={{
          rotulo: 'Abrir leitor (debug Estágio 6)',
          aoTocar: () => router.push('/leitor-debug'),
        }}
      />
    </BwFolha>
  );
}
