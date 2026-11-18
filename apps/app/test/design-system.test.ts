import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ESCALA_TONICA } from '../src/tema/espacamento';
import { temasDeLeitura } from '../src/tema/leitura';
import { superficies } from '../src/tema/superficies';

const RAIZ = join(import.meta.dirname, '..');

function fontes(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return fontes(caminho);
    return /\.tsx?$/.test(caminho) ? [caminho] : [];
  });
}

const arquivosDeTela = [...fontes(join(RAIZ, 'app')), ...fontes(join(RAIZ, 'src'))];
const foraDoTema = arquivosDeTela.filter(
  (a) => !relative(RAIZ, a).startsWith(`src${sep}tema${sep}`)
);

describe('varreduras do design system', () => {
  it('há telas e componentes para varrer', () => {
    expect(foraDoTema.some((a) => a.includes(`${sep}componentes${sep}`))).toBe(true);
    expect(foraDoTema.some((a) => a.endsWith(`app${sep}index.tsx`))).toBe(true);
  });

  it('RN-DS.1 / RN-ST.3 · nenhum componente importa pigmento nem escreve cor crua', () => {
    const violacoes = foraDoTema.flatMap((arquivo) => {
      const texto = readFileSync(arquivo, 'utf8');
      const achados: string[] = [];
      if (/from\s+['"][^'"]*tema\/pigmentos['"]/.test(texto)) achados.push('importa pigmentos');
      for (const m of texto.matchAll(/#[0-9a-fA-F]{6}\b|rgba?\(/g)) achados.push(m[0]);
      return achados.map((a) => `${relative(RAIZ, arquivo)}: ${a}`);
    });
    expect(violacoes).toEqual([]);
  });

  it('RN-DS.4 · padding, margin e gap numéricos só da escala tônica', () => {
    const violacoes = foraDoTema.flatMap((arquivo) => {
      const texto = readFileSync(arquivo, 'utf8');
      const re = /\b(padding|margin|gap|rowGap|columnGap)\w*\s*:\s*(-?\d+(?:\.\d+)?)\b/g;
      return [...texto.matchAll(re)]
        .filter((m) => !ESCALA_TONICA.includes(Math.abs(Number(m[2]))))
        .map((m) => `${relative(RAIZ, arquivo)}: ${m[0]}`);
    });
    expect(violacoes).toEqual([]);
  });

  it('RN-DS.10 · todo Pressable declara alvo de toque mínimo', () => {
    const violacoes = foraDoTema.filter((arquivo) => {
      const texto = readFileSync(arquivo, 'utf8');
      return texto.includes('<Pressable') && !/ALVO_MINIMO|minHeight|hitSlop/.test(texto);
    });
    expect(violacoes.map((a) => relative(RAIZ, a))).toEqual([]);
  });
});

// WCAG 2.1 — luminância relativa e razão de contraste, com alfa composto sobre o fundo.
function rgba(cor: string): [number, number, number, number] {
  if (cor.startsWith('#')) {
    const n = Number.parseInt(cor.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const [r = 0, g = 0, b = 0, a = 1] = (cor.match(/[\d.]+/g) ?? []).map(Number);
  return [r, g, b, a];
}
function luminancia([r, g, b]: number[]): number {
  const [R = 0, G = 0, B = 0] = [r, g, b].map((v = 0) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contraste(frente: string, fundo: string): number {
  const f = rgba(fundo);
  const [r, g, b, a] = rgba(frente);
  const composta = [r, g, b].map((v, i) => v * a + (f[i] ?? 0) * (1 - a));
  const [l1, l2] = [luminancia(composta), luminancia(f)].sort((x, y) => y - x);
  return ((l1 ?? 0) + 0.05) / ((l2 ?? 0) + 0.05);
}

describe('RN-DS.11 · texto nunca abaixo de 4,5:1', () => {
  for (const [nome, sup] of Object.entries(superficies)) {
    it(`${nome}: tinta e tinta fraca sobre o próprio fundo`, () => {
      expect(contraste(sup.tinta, sup.fundo)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(sup.tintaFraca, sup.fundo)).toBeGreaterThanOrEqual(4.5);
    });
  }

  for (const [nome, t] of Object.entries(temasDeLeitura)) {
    it(`tema de leitura ${nome} (RN-02.17): tinta e tinta fraca sobre o fundo`, () => {
      expect(contraste(t.tinta, t.fundo)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(t.tintaFraca, t.fundo)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it('confere a tabela da spec (papel: tinta 13,68 e acento 6,40)', () => {
    expect(contraste(superficies.papel.tinta, superficies.papel.fundo)).toBeCloseTo(13.68, 1);
    expect(contraste(superficies.papel.acento, superficies.papel.fundo)).toBeCloseTo(6.4, 1);
  });
});
