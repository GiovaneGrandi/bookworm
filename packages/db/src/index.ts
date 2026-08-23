// Schema Drizzle (SQLite local desde o Estágio 6; mesmo desenho de tabela servirá o Postgres no
// Estágio 9, stack.md §4). Só o schema mora aqui — a conexão real (`expo-sqlite`) fica em
// `apps/app`, para este pacote continuar sem dependência de React Native.
export * from './ddl.js';
export * from './schema/index.js';
