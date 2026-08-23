// Quatro abas de primeiro nível (design-system.md §10): Jardim, Biblioteca, Caderno, Desempenho.
// Perfil e Configurações não são destino de primeiro nível — vivem no cabeçalho do Jardim
// (entram quando a tela de Jardim ganhar conteúdo real, Estágio 6+). `tabBar` customizado troca
// a barra padrão do React Navigation por `bw-abas-fichario`.
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { BwAbasFichario, type ItemAbaFichario } from '../../src/componentes/BwAbasFichario.js';

function AbasFicharioAdaptadas({ state, descriptors, navigation }: BottomTabBarProps) {
  const itens: ItemAbaFichario[] = state.routes.map((rota: (typeof state.routes)[number]) => ({
    chave: rota.key,
    rotulo: String(descriptors[rota.key]?.options.title ?? rota.name),
  }));
  const chaveAtiva = state.routes[state.index]!.key;

  return (
    <BwAbasFichario
      itens={itens}
      chaveAtiva={chaveAtiva}
      aoSelecionar={(chave) => {
        const rota = state.routes.find((r: (typeof state.routes)[number]) => r.key === chave);
        if (!rota) return;
        const evento = navigation.emit({
          type: 'tabPress',
          target: rota.key,
          canPreventDefault: true,
        });
        if (!evento.defaultPrevented) navigation.navigate(rota.name);
      }}
    />
  );
}

export default function LayoutAbas() {
  return (
    <Tabs
      tabBar={(props) => <AbasFicharioAdaptadas {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Jardim' }} />
      <Tabs.Screen name="biblioteca" options={{ title: 'Biblioteca' }} />
      <Tabs.Screen name="caderno" options={{ title: 'Caderno' }} />
      <Tabs.Screen name="desempenho" options={{ title: 'Desempenho' }} />
    </Tabs>
  );
}
