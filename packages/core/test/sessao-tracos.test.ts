// RN-TEL.49 — um traço por critério de aceitação de `03` §6. Runner único: lê cada arquivo de
// `tracos/`, roda a apuração e compara com `esperado`. Traço novo = arquivo novo, sem código novo
// — nenhuma lógica específica de regra vive aqui, só a comparação genérica descrita no `esperado`.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { apurarBlocosDeFoco } from '../src/sessao/apurarBlocosDeFoco.js';
import { apurarVolume } from '../src/sessao/apurarVolume.js';
import { calcularLeituraConsciente } from '../src/sessao/calcularLeituraConsciente.js';
import { classificarEstilo } from '../src/sessao/classificarEstilo.js';
import { classificarSessao } from '../src/sessao/classificarSessao.js';
import { apurarTempoAtivoDividido } from '../src/sessao/dividirNaViradaDoDia.js';
import type { SessaoApurada, TracoDeEventos } from '../src/sessao/tipos.js';

const dirTracos = join(dirname(fileURLToPath(import.meta.url)), 'tracos');

type EsperadoParticao = {
  dia?: string;
  tempoAtivoS?: number;
  tempoBrutoS?: number;
  pausas?: Array<{ tipo: string; duracaoS: number }>;
  volumeCaracteres?: number;
  volumeSuspeita?: boolean;
  status?: string;
  estilo?: string;
  scoreLeituraConsciente?: number;
  interacoesContadas?: number;
  blocos?: { quantidade?: number; maiorS?: number; medianaS?: number };
};

type ArquivoDeTraco = {
  fuso: string;
  descricao: string;
  eventos: TracoDeEventos['eventos'];
  esperado: {
    particoes: EsperadoParticao[];
    sobreposta?: boolean;
    interacoesQualitativasBrutas?: number;
  };
};

const arquivos = readdirSync(dirTracos).filter((f) => f.endsWith('.json'));

describe.each(arquivos)('traço %s', (arquivo) => {
  const conteudo: ArquivoDeTraco = JSON.parse(readFileSync(join(dirTracos, arquivo), 'utf-8'));
  const traco: TracoDeEventos = { fuso: conteudo.fuso, eventos: conteudo.eventos };

  it(conteudo.descricao, () => {
    const partes = apurarTempoAtivoDividido(traco);
    expect(partes).toHaveLength(conteudo.esperado.particoes.length);

    partes.forEach((parte, i) => {
      const esperado = conteudo.esperado.particoes[i]!;
      const tempoAtivo = parte;
      const volume = apurarVolume(parte.traco);
      const blocos = apurarBlocosDeFoco(parte.traco);

      if (esperado.dia !== undefined) expect(parte.dia).toBe(esperado.dia);
      if (esperado.tempoAtivoS !== undefined)
        expect(tempoAtivo.tempoAtivoS).toBe(esperado.tempoAtivoS);
      if (esperado.tempoBrutoS !== undefined)
        expect(tempoAtivo.tempoBrutoS).toBe(esperado.tempoBrutoS);
      if (esperado.pausas !== undefined) {
        expect(tempoAtivo.pausas).toHaveLength(esperado.pausas.length);
        esperado.pausas.forEach((p, j) => {
          expect(tempoAtivo.pausas[j]!.tipo).toBe(p.tipo);
          expect(tempoAtivo.pausas[j]!.duracaoS).toBeCloseTo(p.duracaoS, 3);
        });
      }
      if (esperado.volumeCaracteres !== undefined)
        expect(volume.caracteres).toBe(esperado.volumeCaracteres);
      if (esperado.volumeSuspeita !== undefined)
        expect(volume.suspeita).toBe(esperado.volumeSuspeita);
      if (esperado.blocos?.quantidade !== undefined)
        expect(blocos.quantidade).toBe(esperado.blocos.quantidade);
      if (esperado.blocos?.maiorS !== undefined) expect(blocos.maiorS).toBe(esperado.blocos.maiorS);
      if (esperado.blocos?.medianaS !== undefined)
        expect(blocos.medianaS).toBe(esperado.blocos.medianaS);

      if (
        esperado.status !== undefined ||
        esperado.estilo !== undefined ||
        esperado.scoreLeituraConsciente !== undefined ||
        esperado.interacoesContadas !== undefined
      ) {
        const sessaoApurada: SessaoApurada = {
          tempoAtivoS: tempoAtivo.tempoAtivoS,
          tempoBrutoS: tempoAtivo.tempoBrutoS,
          maiorBlocoContinuoS: blocos.maiorS,
          interacoesQualitativasBrutas: conteudo.esperado.interacoesQualitativasBrutas ?? 0,
          caracteresLidos: volume.caracteres,
          volumeSuspeita: volume.suspeita,
          sobreposta: conteudo.esperado.sobreposta ?? false,
        };

        if (esperado.status !== undefined)
          expect(classificarSessao(sessaoApurada)).toBe(esperado.status);
        if (esperado.estilo !== undefined)
          expect(classificarEstilo(sessaoApurada)).toBe(esperado.estilo);
        if (
          esperado.scoreLeituraConsciente !== undefined ||
          esperado.interacoesContadas !== undefined
        ) {
          const leitura = calcularLeituraConsciente(sessaoApurada);
          if (esperado.scoreLeituraConsciente !== undefined)
            expect(leitura.score).toBe(esperado.scoreLeituraConsciente);
          if (esperado.interacoesContadas !== undefined)
            expect(leitura.interacoesContadas).toBe(esperado.interacoesContadas);
        }
      }
    });
  });
});
