import { strFromU8, unzipSync } from 'fflate';

export type Formato = 'epub' | 'pdf';

/** Reconhece o formato pelos bytes, não pela extensão: assinatura do PDF ou mimetype do EPUB. */
export function detectarFormato(bytes: Uint8Array): Formato | null {
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'pdf'; // %PDF
  }
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) return null; // PK
  try {
    const { mimetype } = unzipSync(bytes, { filter: (f) => f.name === 'mimetype' });
    return mimetype && strFromU8(mimetype).trim() === 'application/epub+zip' ? 'epub' : null;
  } catch {
    return null;
  }
}
