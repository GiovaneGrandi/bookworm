// RN-TEL.1/RN-TEL.2 — testa o núcleo puro da máquina de estados (`src/sessao/transicoes.ts`) sem
// SQLite: este ambiente de desenvolvimento não tem `better-sqlite3` compilado (Visual Studio
// Build Tools ausentes — mesma limitação documentada em `packages/db/test/schema.test.ts`), então
// a integração real com `expo-sqlite` só é validada nos 7 cenários manuais do Estágio 6 no
// emulador Android. Aqui, o traço que as transições emitem é comparado contra o mesmo formato
// (`EventoTraco`/`TracoDeEventos`) que `apurarTempoAtivo` do Estágio 3 consome — a costura entre
// os dois estágios é o que este arquivo garante.
import {
  apurarTempoAtivo,
  type EventoTraco,
  type TracoDeEventos,
} from '@bookworm/core/src/sessao/index.js';
import type { Carimbo } from '../../src/sessao/relogio.js';
import {
  decidirIdle,
  decidirParaBackground,
  decidirParaForeground,
} from '../../src/sessao/transicoes.js';

const c = (parede: number, mono: number): Carimbo => ({ parede, mono });

describe('RN-TEL.3/RN-TEL.4 — decidirParaBackground', () => {
  it('emite pausa_iniciada "sistema" e muda para pausada_sistema, imediato', () => {
    const resultado = decidirParaBackground('ativa', c(1_000, 1_000));
    expect(resultado?.estado).toBe('pausada_sistema');
    expect(resultado?.evento).toEqual({
      tipo: 'pausa_iniciada',
      parede: 1_000,
      mono: 1_000,
      pausa: 'sistema',
    });
  });

  it('é no-op se já está pausada_sistema (RN-TEL.2 — sem transição redundante)', () => {
    expect(decidirParaBackground('pausada_sistema', c(1_000, 1_000))).toBeNull();
  });
});

describe('RN-TEL.5/RN-03.11 — decidirParaForeground', () => {
  it('retomada rápida: emite pausa_encerrada e volta a ativa', () => {
    const resultado = decidirParaForeground('pausada_sistema', c(0, 0), c(0, 0), c(5_000, 5_000));
    expect(resultado?.estado).toBe('ativa');
    expect(resultado?.encerrar).toBe(false);
    expect(resultado?.evento).toEqual({ tipo: 'pausa_encerrada', parede: 5_000, mono: 5_000 });
  });

  it('segundo plano >= SESSAO_TIMEOUT_MINUTOS: encerra usando o instante em que começou, não "agora"', () => {
    const inicioPausa = c(0, 0);
    const trintaEUmMinutosDepois = c(31 * 60_000, 31 * 60_000);
    const resultado = decidirParaForeground(
      'pausada_sistema',
      inicioPausa,
      inicioPausa,
      trintaEUmMinutosDepois
    );
    expect(resultado?.estado).toBe('encerrada');
    expect(resultado?.encerrar).toBe(true);
    expect(resultado?.evento).toEqual({
      tipo: 'sessao_encerrada',
      parede: 0,
      mono: 0,
      motivo: 'timeout_segundo_plano',
    });
  });

  it('é no-op fora de pausada_sistema', () => {
    expect(decidirParaForeground('ativa', null, c(0, 0), c(1, 1))).toBeNull();
  });
});

describe('RN-TEL.9/RN-TEL.12/RN-TEL.13 — decidirIdle', () => {
  it('detecta silêncio >= IDLE_TIMEOUT_SEGUNDOS sem emitir evento (inferido, não explícito)', () => {
    const ultimoSinal = c(0, 0);
    const noventaEUmSegundosDepois = c(91_000, 91_000);
    expect(decidirIdle('ativa', ultimoSinal, noventaEUmSegundosDepois)).toBe(true);
  });

  it('não detecta idle abaixo do timeout', () => {
    expect(decidirIdle('ativa', c(0, 0), c(89_000, 89_000))).toBe(false);
  });

  it('só se aplica em estado ativa', () => {
    expect(decidirIdle('pausada_sistema', c(0, 0), c(200_000, 200_000))).toBe(false);
  });
});

describe('costura com o Estágio 3 — traço emitido pela máquina é o traço que apurarTempoAtivo lê', () => {
  it('sessão com uma pausa de sistema curta (graça) e uma pausa idle produz o tempo ativo esperado', () => {
    // Roteiro: abre a 0s, lê até 10s, vai a segundo plano por 2s (< PAUSA_GRACA_SEGUNDOS — graça,
    // descartada), volta, fica em silêncio 100s (idle, descoberto pela apuração), lê de novo aos
    // 130s, encerra aos 140s.
    const eventos: EventoTraco[] = [
      { tipo: 'sessao_iniciada', parede: 0, mono: 0, caracteres: 0 },
      { tipo: 'posicao_alterada', parede: 10_000, mono: 10_000, caracteres: 1_000 },
    ];

    const paraBackground = decidirParaBackground('ativa', c(10_000, 10_000));
    eventos.push(paraBackground!.evento!);

    const paraForeground = decidirParaForeground(
      'pausada_sistema',
      paraBackground!.pausaSistemaDesde,
      c(10_000, 10_000),
      c(12_000, 12_000)
    );
    eventos.push(paraForeground!.evento!);

    eventos.push({
      tipo: 'posicao_alterada',
      parede: 112_000,
      mono: 112_000,
      caracteres: 2_000,
    });
    eventos.push({ tipo: 'sessao_encerrada', parede: 140_000, mono: 140_000 });

    const traco: TracoDeEventos = { fuso: 'America/Sao_Paulo', eventos };
    const apuracao = apurarTempoAtivo(traco);

    // 140s brutos - graça descartada (não conta como pausa) - 100s de idle = 40s ativos.
    expect(apuracao.tempoBrutoS).toBe(140);
    expect(apuracao.pausas).toHaveLength(1);
    expect(apuracao.pausas[0]?.tipo).toBe('idle');
    expect(apuracao.tempoAtivoS).toBe(40);
  });
});
