// Scaffold do Estágio 2 (stack.md §5) — só a casca, sem rota de produto ainda. O job diário,
// as rotas de sessão e o servidor Better Auth entram no Estágio 9.
import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/saude', async () => ({ status: 'ok' }));

const porta = Number(process.env.PORT ?? 3000);
app.listen({ port: porta, host: '0.0.0.0' }).catch((erro) => {
  app.log.error(erro);
  process.exit(1);
});
