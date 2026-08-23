// RN-TEL.1 — a máquina de estados da sessão: `ociosa → ativa → pausada_sistema | pausada_idle →
// encerrada | orfa`. `ociosa` nunca é persistida (§ persistenciaSessao.ts) — é a ausência de linha
// em `sessao_em_curso`. RN-TEL.2 é a regra que não se negocia: toda função aqui grava em disco
// (`await`) **antes** de chamar `set()` — o estado em memória nunca sai na frente do estado em
// disco.
import { CONSTANTES_SESSAO_PADRAO } from '@bookworm/core/src/sessao/index.js';
import { create } from 'zustand';
import { finalizarSessao } from './apuracaoEFinalizacao.js';
import {
  atualizarSessaoEmCurso,
  criarSessaoEmCurso,
  inserirEventoBruto,
  obterSessaoEmCurso,
} from './persistenciaSessao.js';
import { type Carimbo, carimboAgora } from './relogio.js';
import { decidirIdle, decidirParaBackground, decidirParaForeground } from './transicoes.js';

export type { EstadoSessao } from './transicoes.js';

import type { EstadoSessao } from './transicoes.js';

type MaquinaSessaoState = {
  sessaoId: string | null;
  obraId: string | null;
  estado: EstadoSessao;
  fuso: string;
  offsetUtcMinutos: number;
  ultimoSinal: Carimbo | null;
  /** Carimbo do instante em que a pausa `sistema` corrente começou — usado por RN-TEL.5 para
   * decidir, na volta ao primeiro plano, se o tempo fora excedeu `SESSAO_TIMEOUT_MINUTOS`. */
  pausaSistemaDesde: Carimbo | null;

  inicializar: () => Promise<void>;
  abrirObra: (obraId: string) => Promise<void>;
  sinalPosicao: (caracteres: number, salto?: boolean) => Promise<void>;
  sinalInteracaoQualitativa: (subtipo: 'destaque' | 'nota' | 'dicionario') => Promise<void>;
  paraBackground: () => Promise<void>;
  paraForeground: () => Promise<void>;
  verificarIdle: () => Promise<void>;
  encerrar: (motivo?: string) => Promise<void>;
};

const ESTADO_INICIAL = {
  sessaoId: null as string | null,
  obraId: null as string | null,
  estado: 'ociosa' as EstadoSessao,
  fuso: Intl.DateTimeFormat().resolvedOptions().timeZone,
  offsetUtcMinutos: -new Date().getTimezoneOffset(),
  ultimoSinal: null as Carimbo | null,
  pausaSistemaDesde: null as Carimbo | null,
};

function fusoEOffsetAtuais() {
  return {
    fuso: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offsetUtcMinutos: -new Date().getTimezoneOffset(),
  };
}

export const useMaquinaSessao = create<MaquinaSessaoState>((set, get) => ({
  ...ESTADO_INICIAL,

  async inicializar() {
    const existente = await obterSessaoEmCurso();
    if (!existente) {
      set({ ...ESTADO_INICIAL, ...fusoEOffsetAtuais() });
      return;
    }

    const timeoutMs = CONSTANTES_SESSAO_PADRAO.SESSAO_TIMEOUT_MINUTOS * 60 * 1000;
    const decorridoParedeMs = Date.now() - existente.ultimoSinalParedeMs;
    const retomavel =
      decorridoParedeMs < timeoutMs &&
      existente.estado !== 'encerrada' &&
      existente.estado !== 'orfa';

    if (retomavel) {
      // RN-TEL.42 — o processo morreu, a sessão não: retoma em memória a partir do snapshot.
      const ultimoSinal: Carimbo = {
        parede: existente.ultimoSinalParedeMs,
        mono: existente.ultimoSinalMonoMs,
      };
      set({
        sessaoId: existente.id,
        obraId: existente.obraId,
        estado: existente.estado,
        fuso: existente.fuso,
        offsetUtcMinutos: existente.offsetUtcMinutos,
        ultimoSinal,
        pausaSistemaDesde: existente.estado === 'pausada_sistema' ? ultimoSinal : null,
      });
      return;
    }

    // RN-TEL.41 — sessão órfã: o app morreu sem passar por `encerrar`. Fecha com o último sinal
    // conhecido, origem "recuperada", e o app volta a `ociosa`; a próxima leitura abre sessão nova.
    const paredeMs = existente.ultimoSinalParedeMs;
    const monoMs = existente.ultimoSinalMonoMs;
    await inserirEventoBruto(existente.id, {
      tipo: 'sessao_encerrada',
      parede: paredeMs,
      mono: monoMs,
      motivo: 'orfa',
    });
    await finalizarSessao({
      sessaoId: existente.id,
      obraId: existente.obraId,
      fuso: existente.fuso,
      offsetUtcMinutos: existente.offsetUtcMinutos,
      origem: 'recuperada',
    });
    set({ ...ESTADO_INICIAL, ...fusoEOffsetAtuais() });
  },

  async abrirObra(obraId) {
    const s = get();
    if (s.sessaoId && s.obraId === obraId) return;
    if (s.sessaoId) await get().encerrar('trocou_de_obra');

    const { fuso, offsetUtcMinutos } = fusoEOffsetAtuais();
    const c = carimboAgora();
    const sessaoId = await criarSessaoEmCurso({
      obraId,
      fuso,
      offsetUtcMinutos,
      paredeMs: c.parede,
      monoMs: c.mono,
    });
    await inserirEventoBruto(sessaoId, { tipo: 'sessao_iniciada', parede: c.parede, mono: c.mono });

    set({
      sessaoId,
      obraId,
      estado: 'ativa',
      fuso,
      offsetUtcMinutos,
      ultimoSinal: c,
      pausaSistemaDesde: null,
    });
  },

  async sinalPosicao(caracteres, salto = false) {
    const s = get();
    if (!s.sessaoId) return;
    const c = carimboAgora();
    await inserirEventoBruto(s.sessaoId, {
      tipo: 'posicao_alterada',
      parede: c.parede,
      mono: c.mono,
      caracteres,
      salto,
    });
    await atualizarSessaoEmCurso(s.sessaoId, {
      estado: 'ativa',
      ultimoSinalParedeMs: c.parede,
      ultimoSinalMonoMs: c.mono,
    });
    set({ estado: 'ativa', ultimoSinal: c });
  },

  async sinalInteracaoQualitativa(subtipo) {
    const s = get();
    if (!s.sessaoId) return;
    const c = carimboAgora();
    await inserirEventoBruto(s.sessaoId, {
      tipo: 'interacao_qualitativa',
      parede: c.parede,
      mono: c.mono,
      subtipo,
    });
    await atualizarSessaoEmCurso(s.sessaoId, {
      estado: 'ativa',
      ultimoSinalParedeMs: c.parede,
      ultimoSinalMonoMs: c.mono,
    });
    set({ estado: 'ativa', ultimoSinal: c });
  },

  async paraBackground() {
    const s = get();
    if (!s.sessaoId) return;
    const resultado = decidirParaBackground(s.estado, carimboAgora());
    if (!resultado) return;

    if (resultado.evento) await inserirEventoBruto(s.sessaoId, resultado.evento);
    await atualizarSessaoEmCurso(s.sessaoId, {
      estado: resultado.estado,
      ultimoSinalParedeMs: resultado.evento!.parede,
      ultimoSinalMonoMs: resultado.evento!.mono,
    });
    set({
      estado: resultado.estado,
      ultimoSinal: { parede: resultado.evento!.parede, mono: resultado.evento!.mono },
      pausaSistemaDesde: resultado.pausaSistemaDesde,
    });
  },

  async paraForeground() {
    const s = get();
    if (!s.sessaoId) return;
    const resultado = decidirParaForeground(
      s.estado,
      s.pausaSistemaDesde,
      s.ultimoSinal,
      carimboAgora()
    );
    if (!resultado) return;

    if (resultado.evento) await inserirEventoBruto(s.sessaoId, resultado.evento);

    if (resultado.encerrar) {
      // RN-03.11/RN-TEL.5 — a sessão morreu no segundo plano; uma sessão nova só nasce na próxima
      // evidência real de leitura, nunca automaticamente ao voltar ao primeiro plano.
      await finalizarSessao({
        sessaoId: s.sessaoId,
        obraId: s.obraId!,
        fuso: s.fuso,
        offsetUtcMinutos: s.offsetUtcMinutos,
        origem: 'offline',
      });
      set({ ...ESTADO_INICIAL, fuso: s.fuso, offsetUtcMinutos: s.offsetUtcMinutos });
      return;
    }

    await atualizarSessaoEmCurso(s.sessaoId, {
      estado: resultado.estado,
      ultimoSinalParedeMs: resultado.evento!.parede,
      ultimoSinalMonoMs: resultado.evento!.mono,
    });
    set({
      estado: resultado.estado,
      ultimoSinal: { parede: resultado.evento!.parede, mono: resultado.evento!.mono },
      pausaSistemaDesde: resultado.pausaSistemaDesde,
    });
  },

  async verificarIdle() {
    const s = get();
    if (!s.sessaoId) return;
    if (!decidirIdle(s.estado, s.ultimoSinal, carimboAgora())) return;

    // RN-TEL.12/13 — idle nunca vira evento explícito; só o estado em `sessao_em_curso` muda
    // (RN-TEL.2, e para a UI). A apuração final descobre a pausa sozinha pelo gap entre sinais.
    await atualizarSessaoEmCurso(s.sessaoId, { estado: 'pausada_idle' });
    set({ estado: 'pausada_idle' });
  },

  async encerrar(motivo) {
    const s = get();
    if (!s.sessaoId) return;
    const c = carimboAgora();
    await inserirEventoBruto(s.sessaoId, {
      tipo: 'sessao_encerrada',
      parede: c.parede,
      mono: c.mono,
      motivo,
    });
    await finalizarSessao({
      sessaoId: s.sessaoId,
      obraId: s.obraId!,
      fuso: s.fuso,
      offsetUtcMinutos: s.offsetUtcMinutos,
      origem: 'offline',
    });
    set({ ...ESTADO_INICIAL, fuso: s.fuso, offsetUtcMinutos: s.offsetUtcMinutos });
  },
}));
