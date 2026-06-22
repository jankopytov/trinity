// Build OG share images from the greenhouse photo: cover-crop + bottom scrim +
// Trinity lockup (logo-light, white) + tagline. Run: node scripts/gen-og.mjs
import sharp from "sharp";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const P = (p) => resolve(process.cwd(), p);
const BAND = P("public/images/home/home-band.jpg");
const LOGO = readFileSync(P("public/brand/logo-light.svg"));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function build({ w, h, out, taglineSize, lockupH, line1, line2 }) {
  // 1) cover-crop the greenhouse
  const base = sharp(BAND).resize(w, h, { fit: "cover", position: "centre" });

  // 2) bottom-up dark scrim
  const scrim = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#060B14" stop-opacity="0.86"/>
        <stop offset="0.42" stop-color="#060B14" stop-opacity="0.45"/>
        <stop offset="0.75" stop-color="#060B14" stop-opacity="0.12"/>
        <stop offset="1" stop-color="#060B14" stop-opacity="0"/>
      </linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
    </svg>`
  );

  // 3) white lockup (mark + wordmark)
  const lockup = await sharp(LOGO, { density: 600 }).resize({ height: lockupH }).png().toBuffer();
  const lockMeta = await sharp(lockup).metadata();

  // layout: left padding, stacked lockup over tagline, bottom-anchored
  const padL = Math.round(w * 0.06);
  const padB = Math.round(h * 0.085);
  const lineGap = Math.round(taglineSize * 1.28);
  const taglineBlockH = (line2 ? 2 : 1) * lineGap;
  const taglineTop = h - padB - taglineBlockH + taglineSize; // baseline of line1
  const lockupTop = taglineTop - taglineSize - Math.round(lockupH * 1.05) - 10;

  // 4) tagline text
  const tagline = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <style>.t{font-family:'Helvetica Neue',Arial,sans-serif;font-weight:300;fill:#F1F4F6;letter-spacing:-0.5px;}</style>
      <text x="${padL}" y="${taglineTop}" class="t" font-size="${taglineSize}">${esc(line1)}</text>
      ${line2 ? `<text x="${padL}" y="${taglineTop + lineGap}" class="t" font-size="${taglineSize}">${esc(line2)}</text>` : ""}
    </svg>`
  );

  await base
    .composite([
      { input: scrim, left: 0, top: 0 },
      { input: lockup, left: padL, top: lockupTop },
      { input: tagline, left: 0, top: 0 },
    ])
    .jpeg({ quality: 90, mozjpeg: true, progressive: true })
    .toFile(P(out));

  const m = await sharp(P(out)).metadata();
  return { out, w: m.width, h: m.height, kb: +(statSync(P(out)).size / 1024).toFixed(0), lockup: { w: lockMeta.width, h: lockMeta.height } };
}

const r1 = await build({
  w: 1200, h: 630, out: "public/brand/og.jpg",
  taglineSize: 38, lockupH: 52,
  line1: "Die Infrastruktur, an der die Apotheken",
  line2: "Deutschlands hängen.",
});
const r2 = await build({
  w: 1200, h: 1200, out: "public/brand/og-square.jpg",
  taglineSize: 44, lockupH: 60,
  line1: "Die Infrastruktur, an der die Apotheken",
  line2: "Deutschlands hängen.",
});
console.log(JSON.stringify({ og: r1, ogSquare: r2 }, null, 2));
