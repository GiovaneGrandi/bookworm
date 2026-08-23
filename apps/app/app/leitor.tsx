// O leitor é modo, não destino (RN-DS.18) — por isso vive fora de `(tabs)`, como rota irmã
// apresentada em tela cheia (ver `app/_layout.tsx`). Corpo real entra no Estágio 7
// (`react-native-readium`, specs/02-biblioteca-e-leitor.md); aqui só a casca, para provar que
// entrar/sair do modo esconde e devolve as abas corretamente.
import { router } from 'expo-router';
import { BwBotao, BwFolha } from '../src/componentes/index.js';

export default function Leitor() {
  return (
    <BwFolha superficie="mesa" anuncio="Leitor">
      <BwBotao superficie="mesa" rotulo="Fechar" aoTocar={() => router.back()} />
    </BwFolha>
  );
}
