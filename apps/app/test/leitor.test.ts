import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ABAS_DO_PAINEL } from '@bookworm/core';
import { describe, expect, it } from 'vitest';
import { ICONES_DO_LEITOR, tocarIcone } from '../src/leitor';

describe('Leitor · o painel abre pelos ícones do cabeçalho', () => {
  it('três ícones, na ordem: luz, letra, página', () => {
    expect(ICONES_DO_LEITOR.map((i) => i.aba)).toEqual(['luz', 'letra', 'pagina']);
  });

  it('cada ícone cobre um grupo do painel, e juntos cobrem todos os controles', () => {
    const cobertos = ICONES_DO_LEITOR.flatMap((i) => ABAS_DO_PAINEL[i.aba]);
    expect(new Set(cobertos).size).toBe(Object.values(ABAS_DO_PAINEL).flat().length);
  });

  it('a letra fica só com fonte e tamanhos; a página, com a formatação', () => {
    expect(ABAS_DO_PAINEL.letra).toEqual(['face', 'ajusteCorpo', 'ajusteEntrelinha']);
    expect(ABAS_DO_PAINEL.pagina).toEqual(['margem', 'alinhamento', 'ancora', 'retornoSensorial']);
  });

  it('tocar num ícone abre o grupo dele', () => {
    expect(tocarIcone(null, 'luz')).toBe('luz');
  });

  it('tocar em outro troca de grupo, sem fechar', () => {
    expect(tocarIcone('luz', 'pagina')).toBe('pagina');
  });

  it('tocar de novo no mesmo fecha o painel', () => {
    expect(tocarIcone('letra', 'letra')).toBeNull();
  });

  it('o leitor de tela ouve o que cada ícone guarda', () => {
    for (const i of ICONES_DO_LEITOR) expect(i.rotulo.length).toBeGreaterThan(8);
  });
});

describe('Leitor · sem a barra "Aa · luz, letra e página"', () => {
  it('o leitor não monta mais a barra de texto', () => {
    const fonte = readFileSync(join(__dirname, '..', 'app/leitor/[id].tsx'), 'utf-8');
    expect(fonte).not.toMatch(/luz, letra e página/i);
  });
});
