// Estágio 7 passo 6 — RN-02.20: "consulta offline por dicionário embarcado, com queda para
// consulta online quando o verbete não existir localmente." O dicionário embarcado é o próprio
// `Q-02.4`/`Q-ST.7` do plano — questão em aberto que a spec marca explicitamente como "não
// bloqueia" (RN-03.21 garante que a Leitura Consciente chega ao topo sem dicionário nenhum).
// Esta rodada implementa só a consulta online (dictionaryapi.dev, gratuita, sem chave) — o
// verbete embarcado fica para quando a fonte for decidida (Wikcionário PT ou Dicionário Aberto,
// candidatos já listados no plano).
export type ResultadoDicionario =
  | { termo: string; definicoes: string[] }
  | { termo: string; erro: string };

export async function consultarTermo(termoBruto: string): Promise<ResultadoDicionario> {
  const termo = termoBruto.trim().toLowerCase().split(/\s+/)[0] ?? '';
  if (!termo) return { termo: termoBruto, erro: 'Nenhum termo selecionado.' };

  try {
    const resposta = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(termo)}`
    );
    if (!resposta.ok) return { termo, erro: 'Verbete não encontrado.' };

    const dados = (await resposta.json()) as Array<{
      meanings?: Array<{ definitions?: Array<{ definition?: string }> }>;
    }>;
    const definicoes = (dados[0]?.meanings ?? [])
      .flatMap((m) => m.definitions ?? [])
      .map((d) => d.definition)
      .filter((d): d is string => Boolean(d))
      .slice(0, 3);

    if (definicoes.length === 0) return { termo, erro: 'Verbete não encontrado.' };
    return { termo, definicoes };
  } catch {
    return { termo, erro: 'Sem conexão para consultar o dicionário.' };
  }
}
