import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { migrar } from './migracoes';
import * as schema from './schema';

// Um banco local só (Q8). `enableChangeListener` alimenta as live queries da mesa e da gaveta.
const sqlite = openDatabaseSync('bookworm.db', { enableChangeListener: true });
sqlite.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
migrar(sqlite);

export const db = drizzle(sqlite, { schema });
