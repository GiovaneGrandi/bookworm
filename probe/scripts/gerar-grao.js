// P-1 / AJ-14 — PNG 7x7 tileável do grão de papel, réplica do radial-gradient de
// direcao-visual.md §4.1: radial-gradient(rgba(96,74,46,.075) .5px, transparent .6px)
// sobre background-size 7px 7px. Gerado em @3x (21x21px) para não borrar em telas de alta
// densidade; ImageBackground do app usa resizeMode 'repeat' com width/height lógicos de 7.
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const SCALE = 3;
const SIZE = 7 * SCALE; // 21
const png = new PNG({ width: SIZE, height: SIZE });

const cx = SIZE / 2;
const cy = SIZE / 2;
const rSolid = 0.5 * SCALE; // raio do centro sólido
const rFade = 0.6 * SCALE; // raio onde já é transparente
const [r, g, b] = [96, 74, 46];
const maxAlpha = 0.075 * 255;

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const dx = x - cx + 0.5;
    const dy = y - cy + 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let alpha = 0;
    if (dist <= rSolid) {
      alpha = maxAlpha;
    } else if (dist <= rFade) {
      const t = (rFade - dist) / (rFade - rSolid);
      alpha = maxAlpha * t;
    }
    const idx = (SIZE * y + x) << 2;
    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;
    png.data[idx + 3] = Math.round(alpha);
  }
}

const outPath = path.join(__dirname, '..', 'assets', 'grao-7.png');
png.pack().pipe(fs.createWriteStream(outPath)).on('finish', () => {
  console.log('gerado:', outPath, `${SIZE}x${SIZE} (@${SCALE}x de 7x7)`);
});
