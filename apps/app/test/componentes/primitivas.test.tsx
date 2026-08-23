// Snapshot dos componentes — inventário do §6 renderizado uma vez por estado aplicável
// (design-system.md §7, "cada componente do inventário declara quais estados se aplicam e
// nenhum deles fica sem desenho"). Import do config do Unistyles primeiro, como no layout raiz.
// `render` de @testing-library/react-native 14+ é assíncrono (React 19) — todo teste `await`s.
import '../../src/tema/unistyles.js';

import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { BwBotao } from '../../src/componentes/BwBotao.js';
import { BwCabeca } from '../../src/componentes/BwCabeca.js';
import { BwCarimbo } from '../../src/componentes/BwCarimbo.js';
import { BwCartao } from '../../src/componentes/BwCartao.js';
import { BwCelebracao } from '../../src/componentes/BwCelebracao.js';
import { BwDadoTabular } from '../../src/componentes/BwDadoTabular.js';
import { BwDormencia } from '../../src/componentes/BwDormencia.js';
import { BwFicha } from '../../src/componentes/BwFicha.js';
import { BwFolha } from '../../src/componentes/BwFolha.js';
import { BwImportar } from '../../src/componentes/BwImportar.js';
import { BwItem } from '../../src/componentes/BwItem.js';
import { BwNumeroCelebracao } from '../../src/componentes/BwNumeroCelebracao.js';
import { BwProgressoDia } from '../../src/componentes/BwProgressoDia.js';
import { BwVazio } from '../../src/componentes/BwVazio.js';

describe('bw-folha', () => {
  it.each(['repouso', 'carregando', 'vazio', 'offline'] as const)('estado %s', async (estado) => {
    const { toJSON } = await render(
      <BwFolha estado={estado}>
        <Text>conteúdo</Text>
      </BwFolha>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-cabeca', () => {
  it('repouso, sem voltar nem ação', async () => {
    const { toJSON } = await render(<BwCabeca titulo="Jardim" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('repouso, com voltar e ação', async () => {
    const { toJSON } = await render(
      <BwCabeca
        titulo="Detalhe"
        aoVoltar={() => {}}
        acao={{ rotulo: 'editar', aoTocar: () => {} }}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-botao', () => {
  it.each(['primario', 'secundario', 'texto'] as const)(
    'variante %s, repouso',
    async (variante) => {
      const { toJSON } = await render(
        <BwBotao rotulo="continuar" aoTocar={() => {}} variante={variante} />
      );
      expect(toJSON()).toMatchSnapshot();
    }
  );

  it('desabilitado', async () => {
    const { toJSON } = await render(<BwBotao rotulo="continuar" aoTocar={() => {}} desabilitado />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('carregando', async () => {
    const { toJSON } = await render(<BwBotao rotulo="continuar" aoTocar={() => {}} carregando />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-cartao', () => {
  it('repouso', async () => {
    const { toJSON } = await render(
      <BwCartao>
        <Text>conteúdo</Text>
      </BwCartao>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-ficha', () => {
  it('repouso', async () => {
    const { toJSON } = await render(
      <BwFicha>
        <Text>conteúdo</Text>
      </BwFicha>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('selecionado', async () => {
    const { toJSON } = await render(
      <BwFicha selecionado>
        <Text>conteúdo</Text>
      </BwFicha>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-item', () => {
  it('repouso', async () => {
    const { toJSON } = await render(
      <BwItem titulo="Obra" subtitulo="12 páginas" aoTocar={() => {}} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('selecionado', async () => {
    const { toJSON } = await render(<BwItem titulo="Obra" aoTocar={() => {}} selecionado />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-numero-celebracao', () => {
  it.each([false, true])('entrando=%s', async (entrando) => {
    const { toJSON } = await render(
      <BwNumeroCelebracao numero={23} oQueMede="dias de ofensiva" entrando={entrando} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-dado-tabular', () => {
  it.each(['repouso', 'carregando', 'vazio'] as const)('estado %s', async (estado) => {
    const { toJSON } = await render(<BwDadoTabular rotulo="páginas" valor="15" estado={estado} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-carimbo', () => {
  it.each([false, true])('batendo=%s', async (batendo) => {
    const { toJSON } = await render(<BwCarimbo texto="lido" batendo={batendo} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-progresso-dia', () => {
  it('vazio (meta 0)', async () => {
    const { toJSON } = await render(<BwProgressoDia realizado={0} meta={0} unidade="páginas" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('parcial', async () => {
    const { toJSON } = await render(<BwProgressoDia realizado={5} meta={15} unidade="páginas" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('cumprido', async () => {
    const { toJSON } = await render(<BwProgressoDia realizado={15} meta={15} unidade="páginas" />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-vazio', () => {
  it('sem saída', async () => {
    const { toJSON } = await render(
      <BwVazio titulo="Sem obras" explicacao="Importe a primeira." />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('com saída', async () => {
    const { toJSON } = await render(
      <BwVazio
        titulo="Sem obras"
        explicacao="Importe a primeira."
        saida={{ rotulo: 'Importar', aoTocar: () => {} }}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-celebracao', () => {
  it('pendente — não renderiza nada (RN-04.10c)', async () => {
    const { toJSON } = await render(
      <BwCelebracao
        estado="pendente"
        novoNumero={24}
        oQueMede="dias"
        mensagem="Você chegou a 24 dias!"
      />
    );
    expect(toJSON()).toBeNull();
  });

  it('exibida', async () => {
    const { toJSON } = await render(
      <BwCelebracao
        estado="exibida"
        novoNumero={24}
        oQueMede="dias"
        mensagem="Você chegou a 24 dias!"
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-dormencia', () => {
  it('mostra os três números (RN-04.14a)', async () => {
    const { toJSON } = await render(
      <BwDormencia contagemEncerrada={23} melhorMarca={41} mensagem="Volte quando puder." />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('bw-importar', () => {
  it.each(['repouso', 'arrastando', 'carregando'] as const)('estado %s', async (estado) => {
    const { toJSON } = await render(<BwImportar estado={estado} aoTocar={() => {}} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('erro', async () => {
    const { toJSON } = await render(
      <BwImportar estado="erro" mensagemDeErro="Formato não suportado" aoTocar={() => {}} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
