// Gera assets/livros/declaracao.pdf a partir do texto de domínio público baixado do Project
// Gutenberg (assets/livros/declaracao-fonte.txt). Roda uma vez, offline, no Estágio 1.
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const srcPath = path.join(__dirname, '..', 'assets', 'livros', 'declaracao-fonte.txt');
const outPath = path.join(__dirname, '..', 'assets', 'livros', 'declaracao.pdf');

const raw = fs.readFileSync(srcPath, 'utf-8');
const startMarker = '*** START OF THE PROJECT GUTENBERG';
const endMarker = '*** END OF THE PROJECT GUTENBERG';
const startIdx = raw.indexOf(startMarker);
const endIdx = raw.indexOf(endMarker);
const startLineEnd = raw.indexOf('\n', startIdx);
const body = raw.slice(startLineEnd + 1, endIdx).trim();

const doc = new PDFDocument({ size: 'A5', margins: { top: 56, bottom: 56, left: 48, right: 48 } });
doc.pipe(fs.createWriteStream(outPath));

doc.info.Title = 'The Declaration of Independence of the United States of America';
doc.info.Author = 'Thomas Jefferson (domínio público — Project Gutenberg eBook #1)';

doc.font('Times-Bold').fontSize(16).text('THE DECLARATION OF INDEPENDENCE', { align: 'center' });
doc.moveDown(2);
doc.font('Times-Roman').fontSize(11);

const paragraphs = body.split(/\n\s*\n/).map((p) => p.replace(/\r?\n/g, ' ').trim()).filter(Boolean);
paragraphs.forEach((p) => {
  doc.text(p, { align: 'justify', lineGap: 2 });
  doc.moveDown(1);
});

doc.end();
console.log('gerado:', outPath, `(${paragraphs.length} parágrafos)`);
