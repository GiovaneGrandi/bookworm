// Estágio 7 passo 5 — persistência das preferências de leitura (RN-02.16: por conta, não por
// obra — linha única, upsert). `packages/core/src/leitor/preferencias.ts` é a fonte de verdade
// dos defaults e do catálogo de faces; este módulo só lê/grava.
import {
  PREFERENCIAS_LEITURA_PADRAO,
  type PreferenciasDeLeitura,
} from '@bookworm/core/src/leitor/index.js';
import { preferenciaLeitura, USUARIO_LOCAL } from '@bookworm/db';
import { eq } from 'drizzle-orm';
import { abrirBanco } from '../persistencia/db.js';

export async function obterPreferenciasDeLeitura(): Promise<PreferenciasDeLeitura> {
  const db = abrirBanco();
  const [linha] = await db
    .select()
    .from(preferenciaLeitura)
    .where(eq(preferenciaLeitura.usuarioId, USUARIO_LOCAL))
    .limit(1);

  if (!linha) return PREFERENCIAS_LEITURA_PADRAO;

  return {
    fonteChave: linha.fonteChave as PreferenciasDeLeitura['fonteChave'],
    corpoEscala: linha.corpoEscala,
    entrelinhaEscala: linha.entrelinhaEscala,
    margemEscala: linha.margemEscala,
    alinhamento: linha.alinhamento,
    tema: linha.tema,
    temperaturaLuzK: linha.temperaturaLuzK,
    brilho: linha.brilho,
    retornoSensorialAtivo: linha.retornoSensorialAtivo,
  };
}

export async function salvarPreferenciasDeLeitura(prefs: PreferenciasDeLeitura): Promise<void> {
  const db = abrirBanco();
  await db
    .insert(preferenciaLeitura)
    .values({ usuarioId: USUARIO_LOCAL, ...prefs, atualizadoEm: new Date() })
    .onConflictDoUpdate({
      target: preferenciaLeitura.usuarioId,
      set: { ...prefs, atualizadoEm: new Date() },
    });
}
