import fs from 'node:fs';
import path from 'node:path';

function createIcoFromPngs(pngPaths, outPath) {
  const pngBuffers = pngPaths.map((p) => fs.readFileSync(p));
  const count = pngBuffers.length;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(count, 4); // count

  const dirEntries = [];
  let offset = 6 + count * 16;

  for (let i = 0; i < count; i++) {
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    // Parse width and height from PNG IHDR chunk (bytes 16-24)
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);

    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset

    dirEntries.push(entry);
    offset += buf.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngBuffers]);
  fs.writeFileSync(outPath, icoBuffer);
  console.log(`Generated ${outPath} (${icoBuffer.length} bytes)`);
}

const sizes = [256, 128, 64, 48, 32, 16];
const paths = sizes.map((s) => path.join('assets', s === 256 ? 'icon-256.png' : `icon-${s}.png`));
createIcoFromPngs(paths, path.join('assets', 'icon.ico'));
