// `drizzle-kit generate` — produz o SQL de migração a partir do schema TS em `src/schema/`.
// `apps/app` roda essas migrações contra `expo-sqlite` na abertura do app (Estágio 6, passo 1).
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema/index.ts',
  out: './drizzle',
});
