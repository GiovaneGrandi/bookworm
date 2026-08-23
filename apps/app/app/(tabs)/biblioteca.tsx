// Biblioteca — backlog em leitura e Estante de concluídas (design-system.md §10, RN-02.6a).
// Estado vazio: convite a importar a primeira obra (`mvp.md` §5 A-4).
import { router } from 'expo-router';
import { BwFolha, BwVazio } from '../../src/componentes/index.js';

export default function TelaBiblioteca() {
  return (
    <BwFolha anuncio="Biblioteca">
      <BwVazio
        titulo="Sua biblioteca está vazia"
        explicacao="Escolha uma obra de domínio público ou importe um EPUB ou PDF para começar."
        saida={{ rotulo: 'Importar obra', aoTocar: () => router.push('/leitor') }}
      />
    </BwFolha>
  );
}
