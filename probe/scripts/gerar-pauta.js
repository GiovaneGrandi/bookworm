// PNG tileável de papel pautado para o cartão P-10 (interrupção da pauta) — passo de 27px,
// a mesma entrelinha do corpo (direcao-visual.md §3.2 e §4.1: "pauta obriga grade").
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const SCALE = 2;
const PASSO = 27 * SCALE; // 54
const png = new PNG({ width: PASSO, height: PASSO });

const [r, g, b] = [36, 31, 25]; // --tinta
const alpha = Math.round(0.16 * 255); // --tinta-16, linha discreta

for (let y = 0; y < PASSO; y++) {
  for (let x = 0; x < PASSO; x++) {
    const idx = (PASSO * y + x) << 2;
    const naLinha = y === PASSO - 1;
    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;
    png.data[idx + 3] = naLinha ? alpha : 0;
  }
}

const outPath = path.join(__dirname, '..', 'assets', 'pauta.png');
png.pack().pipe(fs.createWriteStream(outPath)).on('finish', () => {
  console.log('gerado:', outPath, `${PASSO}x${PASSO} (@${SCALE}x de passo 27px)`);
});
