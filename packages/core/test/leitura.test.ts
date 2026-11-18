import { describe, expect, it } from 'vitest';
import {
  ABAS_DO_PAINEL,
  aplicar,
  corDaTemperatura,
  corpoEfetivo,
  entrelinhaEfetiva,
  FACES,
  normalizarPreferencias,
  PADRAO_LEITURA,
  PAGINA_CANONICA_CARACTERES,
  paginaCanonica,
  paraReadium,
  restaurarAba,
  restaurarTudo,
  TEMPERATURA_LUZ,
} from '../src/index';

describe('RN-02.16d · inventário mínimo do painel', () => {
  it('são 10 controles em três instrumentos, no máximo 4 por vez', () => {
    const todos = Object.values(ABAS_DO_PAINEL).flat();
    expect(todos).toHaveLength(10);
    expect(new Set(todos).size).toBe(10);
    expect(ABAS_DO_PAINEL).toEqual({
      luz: ['temperatura', 'brilho', 'tema'],
      letra: ['face', 'ajusteCorpo', 'ajusteEntrelinha'],
      pagina: ['margem', 'alinhamento', 'ancora', 'retornoSensorial'],
    });
  });

  it('cada controle é um campo das preferências', () => {
    for (const campo of Object.values(ABAS_DO_PAINEL).flat()) {
      expect(PADRAO_LEITURA).toHaveProperty(campo);
    }
  });
});

describe('RN-02.16a · temperatura de luz é um eixo próprio', () => {
  it('vai de 2.700 K a 6.500 K, com padrão de 4.200 K', () => {
    expect(TEMPERATURA_LUZ).toEqual({ min: 2700, max: 6500, padrao: 4200 });
    expect(PADRAO_LEITURA.temperatura).toBe(4200);
    expect(aplicar(PADRAO_LEITURA, { temperatura: 1000 }).temperatura).toBe(2700);
    expect(aplicar(PADRAO_LEITURA, { temperatura: 9000 }).temperatura).toBe(6500);
  });

  it('é independente do tema: mudar um não mexe no outro', () => {
    const p = aplicar(PADRAO_LEITURA, { tema: 'preto' });
    expect(p.temperatura).toBe(4200);
    expect(aplicar(p, { temperatura: 3000 }).tema).toBe('preto');
  });

  it('4.200 K é neutro; abaixo esquenta (menos azul), acima esfria (menos vermelho)', () => {
    expect(corDaTemperatura(4200)).toEqual({ r: 255, g: 255, b: 255 });
    const quente = corDaTemperatura(2700);
    const fria = corDaTemperatura(6500);
    expect(quente.r).toBe(255);
    expect(quente.b).toBeLessThan(quente.g);
    expect(quente.g).toBeLessThan(255);
    expect(fria.b).toBe(255);
    expect(fria.r).toBeLessThan(255);
  });

  it('a cor varia de forma contínua e monótona no azul, do quente ao neutro', () => {
    const azuis = [2700, 3200, 3700, 4200].map((k) => corDaTemperatura(k).b);
    expect([...azuis].sort((a, b) => a - b)).toEqual(azuis);
  });
});

describe('RN-02.16b · brilho in-app só escurece', () => {
  it('nunca passa de 1 (o brilho do sistema) e tem um piso legível', () => {
    expect(PADRAO_LEITURA.brilho).toBe(1);
    expect(aplicar(PADRAO_LEITURA, { brilho: 1.5 }).brilho).toBe(1);
    expect(aplicar(PADRAO_LEITURA, { brilho: 0 }).brilho).toBe(0.2);
  });
});

describe('RN-02.16f · reversibilidade', () => {
  const mexido = aplicar(PADRAO_LEITURA, {
    temperatura: 3000,
    tema: 'sepia',
    face: 'atkinson',
    ajusteCorpo: 2,
    margem: 'larga',
    ancora: 'nenhuma',
  });

  it('↺ esta aba restaura só os controles daquela aba', () => {
    const p = restaurarAba(mexido, 'luz');
    expect(p.temperatura).toBe(4200);
    expect(p.tema).toBe('claro');
    expect(p.face).toBe('atkinson');
    expect(p.margem).toBe('larga');
  });

  it('↺ tudo ao padrão restaura os 10', () => {
    expect(restaurarTudo()).toEqual(PADRAO_LEITURA);
  });
});

describe('RN-02.16g · catálogo de cinco faces', () => {
  it('cinco faces com o corpo e a entrelinha iniciais da tabela', () => {
    expect(Object.entries(FACES).map(([id, f]) => [id, f.familia, f.corpo, f.entrelinha])).toEqual([
      ['spectral', 'Spectral', 16, 27],
      ['eb_garamond', 'EB Garamond', 17, 27],
      ['public_sans', 'Public Sans', 15.5, 26],
      ['atkinson', 'Atkinson Hyperlegible', 17, 28],
      ['courier_prime', 'Courier Prime', 13.5, 24],
    ]);
  });

  it('o catálogo tem serifada, sans e alta legibilidade', () => {
    const papeis = Object.values(FACES).map((f) => f.papel);
    expect(papeis).toEqual(expect.arrayContaining(['serifada', 'sans', 'alta_legibilidade']));
  });

  it('Spectral é o padrão', () => {
    expect(PADRAO_LEITURA.face).toBe('spectral');
    expect(corpoEfetivo(PADRAO_LEITURA)).toBe(16);
    expect(entrelinhaEfetiva(PADRAO_LEITURA)).toBe(27);
  });

  it('trocar de face mantém o ajuste da leitora e não mexe em tema nem luz', () => {
    const p = aplicar(PADRAO_LEITURA, { ajusteCorpo: 1, ajusteEntrelinha: 2, tema: 'escuro' });
    const atk = aplicar(p, { face: 'atkinson' });
    expect(atk.ajusteCorpo).toBe(1);
    expect(corpoEfetivo(atk)).toBe(18);
    expect(entrelinhaEfetiva(atk)).toBe(30);
    expect(atk.tema).toBe('escuro');
  });
});

describe('corpo e entrelinha', () => {
  it('corpo vai de 12 a 20 px, em meios pixels', () => {
    expect(corpoEfetivo(aplicar(PADRAO_LEITURA, { ajusteCorpo: 10 }))).toBe(20);
    expect(corpoEfetivo(aplicar(PADRAO_LEITURA, { ajusteCorpo: -10 }))).toBe(12);
    expect(aplicar(PADRAO_LEITURA, { ajusteCorpo: 0.7 }).ajusteCorpo).toBe(0.5);
  });

  it('entrelinha é sempre pixel inteiro, e nunca menor que 1,2 × o corpo', () => {
    const p = aplicar(PADRAO_LEITURA, { ajusteEntrelinha: -20 });
    expect(Number.isInteger(entrelinhaEfetiva(p))).toBe(true);
    expect(entrelinhaEfetiva(p)).toBeGreaterThanOrEqual(Math.ceil(16 * 1.2));
    expect(
      Number.isInteger(entrelinhaEfetiva(aplicar(PADRAO_LEITURA, { face: 'public_sans' })))
    ).toBe(true);
  });
});

describe('RN-02.13a · âncora de posição em três níveis', () => {
  it('padrão posicao_numero; aceita só os três níveis', () => {
    expect(PADRAO_LEITURA.ancora).toBe('posicao_numero');
    expect(normalizarPreferencias({ ancora: 'qualquer' }).ancora).toBe('posicao_numero');
    expect(normalizarPreferencias({ ancora: 'posicao' }).ancora).toBe('posicao');
  });
});

describe('RN-02.17 e RN-02.17f · tema e retorno sensorial', () => {
  it('quatro temas de leitura; retorno sensorial é uma chave só, ligada por padrão', () => {
    for (const tema of ['claro', 'sepia', 'escuro', 'preto'] as const) {
      expect(aplicar(PADRAO_LEITURA, { tema }).tema).toBe(tema);
    }
    expect(PADRAO_LEITURA.retornoSensorial).toBe(true);
    expect(aplicar(PADRAO_LEITURA, { retornoSensorial: false }).retornoSensorial).toBe(false);
  });
});

describe('normalizarPreferencias · o que vem do banco nunca quebra o leitor', () => {
  it('campos ausentes ou inválidos voltam ao padrão', () => {
    expect(normalizarPreferencias(null)).toEqual(PADRAO_LEITURA);
    expect(
      normalizarPreferencias({ face: 'comic_sans', temperatura: 'x', margem: 'media' })
    ).toEqual(PADRAO_LEITURA);
  });
});

describe('paraReadium · tradução para as preferências do navegador EPUB', () => {
  it('corpo em fração de 16 px, entrelinha como razão, alinhamento e hifenização', () => {
    expect(paraReadium(PADRAO_LEITURA)).toEqual({
      fontFamily: 'Spectral',
      fontSize: 1,
      lineHeight: 27 / 16,
      pageMargins: 1.25,
      textAlign: 'justify',
      hyphens: true,
      publisherStyles: false,
    });
    const esquerda = paraReadium(
      aplicar(PADRAO_LEITURA, { alinhamento: 'esquerda', margem: 'estreita' })
    );
    expect(esquerda).toMatchObject({ textAlign: 'start', hyphens: false, pageMargins: 0.75 });
  });
});

describe('RN-02.12 · página canônica', () => {
  it('1 página = 1.500 caracteres; a primeira é a 1', () => {
    expect(PAGINA_CANONICA_CARACTERES).toBe(1500);
    expect(paginaCanonica(0)).toBe(1);
    expect(paginaCanonica(1499)).toBe(1);
    expect(paginaCanonica(1500)).toBe(2);
  });
});
