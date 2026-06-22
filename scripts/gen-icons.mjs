// Regenerate all favicons from the TRANSPARENT vector mark (logo-mark.svg),
// each centered on a transparent square with even padding so the triangle is
// never edge-clipped. Run: node scripts/gen-icons.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const P = (p) => resolve(process.cwd(), p);
const SRC = P("public/brand/logo-mark.svg");
const svg = readFileSync(SRC);

// Render the mark to a transparent size×size PNG buffer with ~12% padding.
async function iconBuf(size, padFrac = 0.12) {
  const pad = Math.round(size * padFrac);
  const inner = size - pad * 2;
  const mark = await sharp(svg, { density: 600 })
    .resize({ width: inner, height: inner, fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const m = await sharp(mark).metadata();
  const left = Math.round((size - m.width) / 2);
  const top = Math.round((size - m.height) / 2);
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: mark, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// Multi-size .ico from PNG-encoded entries (16/32/48).
function buildIco(entries) {
  const count = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const bodies = [];
  entries.forEach((e, i) => {
    const o = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o + 0);
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(e.buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += e.buf.length;
    bodies.push(e.buf);
  });
  return Buffer.concat([header, dir, ...bodies]);
}

const [b16, b32, b48, b180, b192, b512] = await Promise.all([
  iconBuf(16, 0.06), iconBuf(32, 0.09), iconBuf(48, 0.1),
  iconBuf(180, 0.14), iconBuf(192, 0.14), iconBuf(512, 0.14),
]);

writeFileSync(P("public/favicon.ico"), buildIco([
  { size: 16, buf: b16 }, { size: 32, buf: b32 }, { size: 48, buf: b48 },
]));
writeFileSync(P("public/icon-192.png"), b192);
writeFileSync(P("public/icon-512.png"), b512);
writeFileSync(P("public/apple-icon.png"), b180);

console.log(JSON.stringify({
  favicon_ico: "16/32/48 transparent",
  "icon-192": b192.length,
  "icon-512": b512.length,
  "apple-icon(180)": b180.length,
}, null, 2));
