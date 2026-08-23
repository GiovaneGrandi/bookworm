import { describe, expect, it } from 'vitest';
import {
  CATALOGO_FACES,
  PREFERENCIAS_LEITURA_PADRAO,
  paraPreferenciasDeNavegador,
} from '../../src/leitor/preferencias.js';

describe('RN-02.16g — catálogo de 5 faces', () => {
  it('tem exatamente 5 faces, com pelo menos uma serifada, uma sans e uma de alta legibilidade', () => {
    expect(CATALOGO_FACES).toHaveLength(5);
    const chaves = CATALOGO_FACES.map((f) => f.chave);
    expect(chaves).toContain('spectral');
    expect(chaves).toContain('eb_garamond');
    expect(chaves).toContain('public_sans');
    expect(chaves).toContain('atkinson_hyperlegible');
    expect(chaves).toContain('courier_prime');
  });
});

describe('RN-02.16 — preferências default', () => {
  it('abre no tema claro, escala 1 em corpo/entrelinha/margem, e retorno sensorial ligado', () => {
    expect(PREFERENCIAS_LEITURA_PADRAO.tema).toBe('claro');
    expect(PREFERENCIAS_LEITURA_PADRAO.corpoEscala).toBe(1);
    expect(PREFERENCIAS_LEITURA_PADRAO.entrelinhaEscala).toBe(1);
    expect(PREFERENCIAS_LEITURA_PADRAO.margemEscala).toBe(1);
    expect(PREFERENCIAS_LEITURA_PADRAO.retornoSensorialAtivo).toBe(true);
  });
});

describe('paraPreferenciasDeNavegador', () => {
  it('traduz preto_puro para o tema escuro do Readium com cores sobrepostas', () => {
    const resultado = paraPreferenciasDeNavegador({
      ...PREFERENCIAS_LEITURA_PADRAO,
      tema: 'preto_puro',
    });
    expect(resultado.theme).toBe('dark');
    expect(resultado.backgroundColor).toBe('#000000');
    expect(resultado.textColor).toBe('#ffffff');
  });

  it('traduz os demais temas sem sobrepor cores', () => {
    const claro = paraPreferenciasDeNavegador({ ...PREFERENCIAS_LEITURA_PADRAO, tema: 'claro' });
    expect(claro.theme).toBe('light');
    expect(claro.backgroundColor).toBeUndefined();

    const sepia = paraPreferenciasDeNavegador({ ...PREFERENCIAS_LEITURA_PADRAO, tema: 'sepia' });
    expect(sepia.theme).toBe('sepia');

    const escuro = paraPreferenciasDeNavegador({ ...PREFERENCIAS_LEITURA_PADRAO, tema: 'escuro' });
    expect(escuro.theme).toBe('dark');
    expect(escuro.backgroundColor).toBeUndefined();
  });

  it('passa corpo, entrelinha e margem como escalas unitárias, não px', () => {
    const resultado = paraPreferenciasDeNavegador({
      ...PREFERENCIAS_LEITURA_PADRAO,
      corpoEscala: 1.3,
      entrelinhaEscala: 1.2,
      margemEscala: 0.8,
    });
    expect(resultado.fontSize).toBe(1.3);
    expect(resultado.lineHeight).toBe(1.2);
    expect(resultado.pageMargins).toBe(0.8);
  });

  it('repassa o alinhamento sem tradução', () => {
    const justificado = paraPreferenciasDeNavegador({
      ...PREFERENCIAS_LEITURA_PADRAO,
      alinhamento: 'justify',
    });
    expect(justificado.textAlign).toBe('justify');
  });
});
