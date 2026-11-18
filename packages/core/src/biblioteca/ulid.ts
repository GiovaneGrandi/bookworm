// ULID: 48 bits de tempo + 80 de acaso, em base32 de Crockford. O tempo e a fonte de acaso
// entram como parâmetro, para o núcleo continuar sem I/O (RN-ST.7).
const ALFABETO = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function gerarUlid(agora: number, aleatorio: () => number): string {
  let tempo = '';
  let t = Math.floor(agora);
  for (let i = 0; i < 10; i++) {
    tempo = ALFABETO[t % 32] + tempo;
    t = Math.floor(t / 32);
  }
  let acaso = '';
  for (let i = 0; i < 16; i++) acaso += ALFABETO[Math.floor(aleatorio() * 32) % 32];
  return tempo + acaso;
}
