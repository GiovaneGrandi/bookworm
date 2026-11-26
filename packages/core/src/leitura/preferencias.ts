// Preferências de leitura: os 10 controles do painel (RN-02.16, RN-02.16a–g, RN-02.13a, RN-02.17,
// RN-02.17f). Um registro só, por conta (RN-02.16), aplicado ao vivo sobre o texto (RN-02.16e).

export type Face = 'spectral' | 'eb_garamond' | 'public_sans' | 'atkinson' | 'courier_prime';
export type TemaLeitura = 'claro' | 'sepia' | 'escuro' | 'preto';
export type Margem = 'estreita' | 'media' | 'larga';
export type Alinhamento = 'justificado' | 'esquerda';
export type Ancora = 'nenhuma' | 'posicao' | 'posicao_numero';
export type Peso = 'fina' | 'normal' | 'grossa';
export type Espaco = 'normal' | 'aberto' | 'largo';
export type EspacoParagrafos = 'colados' | 'meia' | 'linha';
export type Recuo = 'nenhum' | 'curto' | 'longo';

export type PreferenciasLeitura = {
  /** Kelvin (RN-02.16a). */
  temperatura: number;
  /** Fração do brilho do sistema, de 0,2 a 1: só escurece (RN-02.16b). */
  brilho: number;
  tema: TemaLeitura;
  face: Face;
  /**
   * Ajuste da leitora sobre o corpo inicial da face, em px. Guardar o ajuste (e não o corpo)
   * é o que deixa os eixos independentes em RN-02.16g: trocar de face mantém a mancha
   * aparente que a leitora escolheu, e cada face continua partindo do seu valor da tabela.
   */
  ajusteCorpo: number;
  /** Idem, para a entrelinha, em px inteiros. */
  ajusteEntrelinha: number;
  margem: Margem;
  alinhamento: Alinhamento;
  ancora: Ancora;
  /** A chave única de RN-02.17f. */
  retornoSensorial: boolean;

  // A segunda camada do painel ("Mais"): ajustes além do inventário mínimo de RN-02.16d.
  peso: Peso;
  espacoLetras: Espaco;
  espacoPalavras: Espaco;
  espacoParagrafos: EspacoParagrafos;
  recuo: Recuo;
  /** Ler descendo o texto, em vez de virar páginas. */
  rolagem: boolean;
  /** A textura de papel sob o texto, nos temas claros. */
  grao: boolean;
  /** RN-02.16c: a temperatura acompanha a hora do dia. Opt-in. */
  temperaturaPeloHorario: boolean;
  /** Escuro quando o celular está escuro; claro quando está claro. */
  temaSegueCelular: boolean;
  /** Imagens mais apagadas nos temas escuro e preto. */
  imagensSuaves: boolean;
};

export const TEMPERATURA_LUZ = { min: 2700, max: 6500, padrao: 4200 } as const;

/** RN-02.16g: corpo e entrelinha iniciais de cada face. */
export const FACES = {
  spectral: { familia: 'Spectral', corpo: 16, entrelinha: 27, papel: 'serifada' },
  eb_garamond: { familia: 'EB Garamond', corpo: 17, entrelinha: 27, papel: 'old_style' },
  public_sans: { familia: 'Public Sans', corpo: 15.5, entrelinha: 26, papel: 'sans' },
  atkinson: {
    familia: 'Atkinson Hyperlegible',
    corpo: 17,
    entrelinha: 28,
    papel: 'alta_legibilidade',
  },
  courier_prime: { familia: 'Courier Prime', corpo: 13.5, entrelinha: 24, papel: 'monoespaco' },
} as const satisfies Record<
  Face,
  { familia: string; corpo: number; entrelinha: number; papel: string }
>;

export const PADRAO_LEITURA: PreferenciasLeitura = {
  temperatura: TEMPERATURA_LUZ.padrao,
  brilho: 1,
  tema: 'claro',
  face: 'spectral',
  ajusteCorpo: 0,
  ajusteEntrelinha: 0,
  margem: 'media',
  alinhamento: 'justificado',
  ancora: 'posicao_numero', // ANCORA_POSICAO_PADRAO
  retornoSensorial: true,
  peso: 'normal',
  espacoLetras: 'normal',
  espacoPalavras: 'normal',
  espacoParagrafos: 'colados',
  recuo: 'curto',
  rolagem: false,
  grao: false,
  temperaturaPeloHorario: false,
  temaSegueCelular: false,
  imagensSuaves: true,
};

export type Aba = 'luz' | 'letra' | 'pagina';
export type Controle = keyof PreferenciasLeitura;

/** Os três instrumentos de direcao-visual.md §9, pela pergunta que a leitora faz. */
export const ABAS_DO_PAINEL: Record<Aba, Controle[]> = {
  luz: ['temperatura', 'brilho', 'tema'],
  letra: ['face', 'ajusteCorpo', 'ajusteEntrelinha'],
  pagina: ['margem', 'alinhamento', 'ancora', 'retornoSensorial'],
};

/**
 * A segunda camada de cada instrumento, atrás de "Mais": o painel não vira cabine (Q-02.8), e o
 * inventário mínimo de RN-02.16d continua na primeira camada.
 */
export const MAIS_DO_PAINEL: Record<Aba, Controle[]> = {
  luz: ['temperaturaPeloHorario', 'temaSegueCelular', 'imagensSuaves', 'grao'],
  letra: ['peso', 'espacoLetras', 'espacoPalavras'],
  pagina: ['espacoParagrafos', 'recuo', 'rolagem'],
};

export const CORPO = { min: 12, max: 20 } as const;
const AJUSTE_CORPO = { min: -6, max: 6 };
const AJUSTE_ENTRELINHA = { min: -8, max: 12 };
const BRILHO = { min: 0.2, max: 1 };

const TEMAS: readonly TemaLeitura[] = ['claro', 'sepia', 'escuro', 'preto'];
const MARGENS: readonly Margem[] = ['estreita', 'media', 'larga'];
const ALINHAMENTOS: readonly Alinhamento[] = ['justificado', 'esquerda'];
const ANCORAS: readonly Ancora[] = ['nenhuma', 'posicao', 'posicao_numero'];
const PESOS: readonly Peso[] = ['fina', 'normal', 'grossa'];
const ESPACOS: readonly Espaco[] = ['normal', 'aberto', 'largo'];
const ESPACOS_PARAGRAFOS: readonly EspacoParagrafos[] = ['colados', 'meia', 'linha'];
const RECUOS: readonly Recuo[] = ['nenhum', 'curto', 'longo'];

const entre = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const numero = (v: unknown, padrao: number) =>
  typeof v === 'number' && Number.isFinite(v) ? v : padrao;
const umDe = <T extends string>(v: unknown, opcoes: readonly T[], padrao: T): T =>
  opcoes.includes(v as T) ? (v as T) : padrao;
const chave = (v: unknown, padrao: boolean) => (typeof v === 'boolean' ? v : padrao);

/** Aplica uma mudança e devolve preferências válidas: cada campo preso à sua faixa. */
export function aplicar(
  atual: PreferenciasLeitura,
  mudanca: Partial<PreferenciasLeitura>
): PreferenciasLeitura {
  const p = { ...atual, ...mudanca };
  return {
    temperatura:
      Math.round(entre(p.temperatura, TEMPERATURA_LUZ.min, TEMPERATURA_LUZ.max) / 50) * 50,
    brilho: Math.round(entre(p.brilho, BRILHO.min, BRILHO.max) * 100) / 100,
    tema: p.tema,
    face: p.face,
    ajusteCorpo: Math.round(entre(p.ajusteCorpo, AJUSTE_CORPO.min, AJUSTE_CORPO.max) * 2) / 2,
    ajusteEntrelinha: Math.round(
      entre(p.ajusteEntrelinha, AJUSTE_ENTRELINHA.min, AJUSTE_ENTRELINHA.max)
    ),
    margem: p.margem,
    alinhamento: p.alinhamento,
    ancora: p.ancora,
    retornoSensorial: p.retornoSensorial,
    peso: p.peso,
    espacoLetras: p.espacoLetras,
    espacoPalavras: p.espacoPalavras,
    espacoParagrafos: p.espacoParagrafos,
    recuo: p.recuo,
    rolagem: p.rolagem,
    grao: p.grao,
    temperaturaPeloHorario: p.temperaturaPeloHorario,
    temaSegueCelular: p.temaSegueCelular,
    imagensSuaves: p.imagensSuaves,
  };
}

/** Lê o que veio do banco: campo ausente ou inválido volta ao padrão. */
export function normalizarPreferencias(bruto: unknown): PreferenciasLeitura {
  const b = (bruto && typeof bruto === 'object' ? bruto : {}) as Record<string, unknown>;
  const d = PADRAO_LEITURA;
  return aplicar(d, {
    temperatura: numero(b.temperatura, d.temperatura),
    brilho: numero(b.brilho, d.brilho),
    tema: umDe(b.tema, TEMAS, d.tema),
    face: umDe(b.face, Object.keys(FACES) as Face[], d.face),
    ajusteCorpo: numero(b.ajusteCorpo, d.ajusteCorpo),
    ajusteEntrelinha: numero(b.ajusteEntrelinha, d.ajusteEntrelinha),
    margem: umDe(b.margem, MARGENS, d.margem),
    alinhamento: umDe(b.alinhamento, ALINHAMENTOS, d.alinhamento),
    ancora: umDe(b.ancora, ANCORAS, d.ancora),
    retornoSensorial: chave(b.retornoSensorial, d.retornoSensorial),
    peso: umDe(b.peso, PESOS, d.peso),
    espacoLetras: umDe(b.espacoLetras, ESPACOS, d.espacoLetras),
    espacoPalavras: umDe(b.espacoPalavras, ESPACOS, d.espacoPalavras),
    espacoParagrafos: umDe(b.espacoParagrafos, ESPACOS_PARAGRAFOS, d.espacoParagrafos),
    recuo: umDe(b.recuo, RECUOS, d.recuo),
    rolagem: chave(b.rolagem, d.rolagem),
    grao: chave(b.grao, d.grao),
    temperaturaPeloHorario: chave(b.temperaturaPeloHorario, d.temperaturaPeloHorario),
    temaSegueCelular: chave(b.temaSegueCelular, d.temaSegueCelular),
    imagensSuaves: chave(b.imagensSuaves, d.imagensSuaves),
  });
}

/** ↺ esta aba (RN-02.16f): as duas camadas daquele instrumento. */
export function restaurarAba(atual: PreferenciasLeitura, aba: Aba): PreferenciasLeitura {
  const campos = [...ABAS_DO_PAINEL[aba], ...MAIS_DO_PAINEL[aba]];
  const padrao = Object.fromEntries(campos.map((c) => [c, PADRAO_LEITURA[c]]));
  return aplicar(atual, padrao);
}

/** ↺ tudo ao padrão (RN-02.16f). */
export function restaurarTudo(): PreferenciasLeitura {
  return { ...PADRAO_LEITURA };
}

export function corpoEfetivo(p: PreferenciasLeitura): number {
  return entre(FACES[p.face].corpo + p.ajusteCorpo, CORPO.min, CORPO.max);
}

/** Entrelinha em pixel inteiro, entre 1,2 e 2,2 vezes o corpo. */
export function entrelinhaEfetiva(p: PreferenciasLeitura): number {
  const corpo = corpoEfetivo(p);
  return entre(
    Math.round(FACES[p.face].entrelinha + p.ajusteEntrelinha),
    Math.ceil(corpo * 1.2),
    Math.floor(corpo * 2.2)
  );
}

const MARGEM_READIUM: Record<Margem, number> = { estreita: 0.75, media: 1.25, larga: 2 };
/** Peso em fração do normal (1 = 400). */
const PESO_READIUM: Record<Peso, number> = { fina: 0.75, normal: 1, grossa: 1.5 };
const LETRAS_READIUM: Record<Espaco, number> = { normal: 0, aberto: 0.05, largo: 0.1 };
const PALAVRAS_READIUM: Record<Espaco, number> = { normal: 0, aberto: 0.15, largo: 0.3 };
/** Em linhas da entrelinha: o espaço entre parágrafos anda na pauta. */
const PARAGRAFOS_EM_LINHAS: Record<EspacoParagrafos, number> = { colados: 0, meia: 0.5, linha: 1 };
const RECUO_READIUM: Record<Recuo, number> = { nenhum: 0, curto: 1, longo: 2 };

/**
 * O que o navegador EPUB do Readium recebe. Tema, cores e luz não entram aqui: as cores são
 * tokens do app, e temperatura e brilho são camadas por cima da página (stack.md, Q-ST.2).
 */
export function paraReadium(p: PreferenciasLeitura, tema: TemaLeitura = p.tema) {
  const corpo = corpoEfetivo(p);
  const justificado = p.alinhamento === 'justificado';
  const escuro = tema === 'escuro' || tema === 'preto';
  return {
    fontFamily: FACES[p.face].familia,
    fontSize: corpo / 16,
    lineHeight: entrelinhaEfetiva(p) / corpo,
    pageMargins: MARGEM_READIUM[p.margem],
    textAlign: justificado ? ('justify' as const) : ('start' as const),
    hyphens: justificado,
    // Sem isso o Readium respeita o CSS da editora e ignora entrelinha e alinhamento.
    publisherStyles: false,
    fontWeight: PESO_READIUM[p.peso],
    letterSpacing: LETRAS_READIUM[p.espacoLetras],
    wordSpacing: PALAVRAS_READIUM[p.espacoPalavras],
    paragraphSpacing: (PARAGRAFOS_EM_LINHAS[p.espacoParagrafos] * entrelinhaEfetiva(p)) / 16,
    paragraphIndent: RECUO_READIUM[p.recuo],
    scroll: p.rolagem,
    ...(escuro && p.imagensSuaves ? { imageFilter: 'darken' as const } : {}),
  };
}

/** Cor de corpo negro aproximada (Tanner Helland), em RGB de 0 a 255. */
function corpoNegro(kelvin: number): [number, number, number] {
  const t = kelvin / 100;
  const r = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -0.1332047592;
  const g =
    t <= 66
      ? 99.4708025861 * Math.log(t) - 161.1195681661
      : 288.1221695283 * (t - 60) ** -0.0755148492;
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [r, g, b].map((v) => entre(v, 0, 255)) as [number, number, number];
}

/**
 * A cor que tinge a página para uma temperatura (RN-02.16a), para compor em "multiply":
 * branco em 4.200 K (o neutro), âmbar abaixo, azulado acima. `intensidade` aproxima do branco.
 */
export function corDaTemperatura(
  kelvin: number,
  intensidade = 1
): { r: number; g: number; b: number } {
  const k = entre(kelvin, TEMPERATURA_LUZ.min, TEMPERATURA_LUZ.max);
  const alvo = corpoNegro(k);
  const neutro = corpoNegro(TEMPERATURA_LUZ.padrao);
  const razao = alvo.map((v, i) => v / (neutro[i] ?? 1));
  const maior = Math.max(...razao);
  const [r = 1, g = 1, b = 1] = razao.map((v) => v / maior);
  const misturar = (v: number) => Math.round(255 * (1 - intensidade * (1 - v)));
  return { r: misturar(r), g: misturar(g), b: misturar(b) };
}

/**
 * RN-02.16c: a temperatura pela hora do dia (0 a 24, com fração). Fria de dia, quente à noite,
 * mudando aos poucos entre 17h e 21h e entre 5h e 7h.
 */
const DIA = 5000;
const NOITE = 2900;
export function temperaturaDoHorario(horas: number): number {
  const h = ((horas % 24) + 24) % 24;
  const meio = (de: number, ate: number, inicio: number, fim: number) =>
    de + ((ate - de) * (h - inicio)) / (fim - inicio);
  let k: number;
  if (h >= 7 && h < 17) k = DIA;
  else if (h >= 17 && h < 21) k = meio(DIA, NOITE, 17, 21);
  else if (h >= 5 && h < 7) k = meio(NOITE, DIA, 5, 7);
  else k = NOITE;
  return Math.round(entre(k, TEMPERATURA_LUZ.min, TEMPERATURA_LUZ.max) / 50) * 50;
}

/**
 * O tema que vale agora. Seguindo o celular: escuro quando ele está escuro (ou preto, para quem
 * escolheu preto), claro quando está claro (ou sépia, para quem escolheu sépia).
 */
export function temaEfetivo(p: PreferenciasLeitura, celularEscuro: boolean): TemaLeitura {
  if (!p.temaSegueCelular) return p.tema;
  if (celularEscuro) return p.tema === 'preto' ? 'preto' : 'escuro';
  return p.tema === 'sepia' ? 'sepia' : 'claro';
}

export type Predefinicao = { id: string; nome: string; ajustes: Partial<PreferenciasLeitura> };

/** Atalhos de fábrica: mexem só na luz, para não desfazer a letra e a página de ninguém. */
export const PREDEFINICOES_DE_FABRICA: readonly Predefinicao[] = [
  { id: 'dia', nome: 'Dia', ajustes: { temperatura: 4200, brilho: 1, tema: 'claro' } },
  { id: 'noite', nome: 'Noite', ajustes: { temperatura: 2900, brilho: 0.6, tema: 'escuro' } },
];

export const NOME_DE_PREDEFINICAO_MAX = 24;

/** Nome de predefinição: espaços colapsados; null se vazio ou longo demais. */
export function limparNomeDePredefinicao(nome: string): string | null {
  const limpo = nome.replace(/\s+/g, ' ').trim();
  return limpo && limpo.length <= NOME_DE_PREDEFINICAO_MAX ? limpo : null;
}

/** As predefinições da leitora, vindas do banco: nome limpo e ajustes válidos; o resto sai. */
export function normalizarPredefinicoes(bruto: unknown): Predefinicao[] {
  if (!Array.isArray(bruto)) return [];
  return bruto.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const { id, nome, ajustes } = item as Record<string, unknown>;
    const limpo = typeof nome === 'string' ? limparNomeDePredefinicao(nome) : null;
    if (typeof id !== 'string' || !limpo) return [];
    return [{ id, nome: limpo, ajustes: normalizarPreferencias(ajustes) }];
  });
}
