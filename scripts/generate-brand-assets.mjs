/**
 * Generates the Verdstamp brand assets from the supplied wordmark.
 *
 * Source: scripts/assets/verdstamp-logo-source.png (1024x332 screenshot).
 * The screenshot has a baked-in transparency checkerboard, so the script
 * derives alpha from colour saturation before producing clean PNGs.
 *
 * Run with: node scripts/generate-brand-assets.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCE = path.join(ROOT, "scripts/assets/verdstamp-logo-source.png");
const BRAND_DIR = path.join(ROOT, "public/brand");
const ICONS_DIR = path.join(ROOT, "public/icons");
const APP_DIR = path.join(ROOT, "src/app");
const MANROPE = path.join(ROOT, "public/font/Manrope-VariableFont_wght.ttf");

const BRAND_DARK = "#082a14";
const BRAND_MID = "#0d4a27";
const BRAND_LIGHT = "#7ed957";
const BRAND_MINT = "#a9efbf";
const WORDMARK_LIGHT = "#f2f7ef";

fs.mkdirSync(BRAND_DIR, { recursive: true });
fs.mkdirSync(ICONS_DIR, { recursive: true });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const hex = value => [
  parseInt(value.slice(1, 3), 16),
  parseInt(value.slice(3, 5), 16),
  parseInt(value.slice(5, 7), 16),
];

/** Point fontconfig at the bundled Manrope font so SVG text renders in brand type. */
function configureFonts() {
  const dir = path.join(os.tmpdir(), "verdstamp-brand-fonts");
  const cache = path.join(dir, "cache");
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(MANROPE, path.join(dir, "Manrope-VariableFont_wght.ttf"));
  const config = path.join(dir, "fonts.conf");
  fs.writeFileSync(
    config,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${dir}</dir>
  <cachedir>${cache}</cachedir>
</fontconfig>
`,
  );
  process.env.FONTCONFIG_FILE = config;
  try {
    execFileSync("fc-cache", ["-f"], { env: process.env, stdio: "ignore" });
  } catch {
    // fc-cache is optional; rendering still falls back to an available sans.
  }
}

async function buildWordmarks() {
  const { data, info } = await sharp(SOURCE)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = width * height;

  const alpha = new Float32Array(pixels);
  const rgb = new Uint8Array(pixels * 3);
  for (let i = 0; i < pixels; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    alpha[i] = smoothstep(9, 27, chroma);
    rgb[i * 3] = r;
    rgb[i * 3 + 1] = g;
    rgb[i * 3 + 2] = b;
  }

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] > 0.06) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // Replace the gray checkerboard bleed on anti-aliased edges with nearby solid brand colour.
  const clean = new Uint8Array(pixels * 3);
  clean.set(rgb);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const i = y * width + x;
      if (alpha[i] <= 0.04 || alpha[i] >= 0.999) continue;
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let weight = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const j = ny * width + nx;
          if (alpha[j] > 0.9) {
            const w = 1 / (1 + Math.abs(dx) + Math.abs(dy));
            sr += rgb[j * 3] * w;
            sg += rgb[j * 3 + 1] * w;
            sb += rgb[j * 3 + 2] * w;
            weight += w;
          }
        }
      }
      if (weight > 0) {
        clean[i * 3] = Math.round(sr / weight);
        clean[i * 3 + 1] = Math.round(sg / weight);
        clean[i * 3 + 2] = Math.round(sb / weight);
      }
    }
  }

  const pad = 2;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, maxX - minX + 1 + pad * 2);
  const cropH = Math.min(height - cropY, maxY - minY + 1 + pad * 2);

  const wordmark = Buffer.alloc(cropW * cropH * 4);
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const sourceIndex = (y + cropY) * width + (x + cropX);
      const targetIndex = (y * cropW + x) * 4;
      wordmark[targetIndex] = clean[sourceIndex * 3];
      wordmark[targetIndex + 1] = clean[sourceIndex * 3 + 1];
      wordmark[targetIndex + 2] = clean[sourceIndex * 3 + 2];
      wordmark[targetIndex + 3] = Math.round(alpha[sourceIndex] * 255);
    }
  }

  await sharp(wordmark, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(BRAND_DIR, "verdstamp-wordmark-light.png"));

  const dark = Buffer.from(wordmark);
  const darkMark = hex("#2f9d5c");
  const lightMark = hex(BRAND_MINT);
  const wordmarkColor = hex(WORDMARK_LIGHT);
  const split = 165; // cropped x where the leaf mark ends and the wordmark begins
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const index = (y * cropW + x) * 4;
      if (dark[index + 3] === 0) continue;
      if (x < split) {
        const r = dark[index];
        const g = dark[index + 1];
        const b = dark[index + 2];
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const t = clamp((luminance - 0.03) / 0.55, 0, 1);
        dark[index] = Math.round(lerp(darkMark[0], lightMark[0], t));
        dark[index + 1] = Math.round(lerp(darkMark[1], lightMark[1], t));
        dark[index + 2] = Math.round(lerp(darkMark[2], lightMark[2], t));
      } else {
        dark[index] = wordmarkColor[0];
        dark[index + 1] = wordmarkColor[1];
        dark[index + 2] = wordmarkColor[2];
      }
    }
  }
  await sharp(dark, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(BRAND_DIR, "verdstamp-wordmark-dark.png"));

  // Square leaf marks. The original artwork has 158x109px of content, so pad it
  // into a square to keep the icon optically centred.
  const markWidth = 160;
  const markSize = Math.max(markWidth, cropH) + 12;
  const offsetX = Math.round((markSize - markWidth) / 2);
  const offsetY = Math.round((markSize - cropH) / 2);

  async function squareMark(source, output) {
    const rgba = Buffer.alloc(markSize * markSize * 4);
    for (let y = 0; y < cropH; y++) {
      for (let x = 0; x < markWidth; x++) {
        const sourceIndex = (y * cropW + x) * 4;
        const targetIndex = ((y + offsetY) * markSize + (x + offsetX)) * 4;
        for (let channel = 0; channel < 4; channel++) {
          rgba[targetIndex + channel] = source[sourceIndex + channel];
        }
      }
    }
    await sharp(rgba, {
      raw: { width: markSize, height: markSize, channels: 4 },
    })
      .png()
      .toFile(output);
    return rgba;
  }

  await squareMark(wordmark, path.join(BRAND_DIR, "verdstamp-mark.png"));
  const lightMarkBuffer = await squareMark(dark, path.join(BRAND_DIR, "verdstamp-mark-light.png"));

  return { cropW, cropH, lightMarkBuffer, markSize };
}

function iconSvg({ size, mark, padding, rounded = true }) {
  const markSize = Math.round(size * padding);
  const x = Math.round((size - markSize) / 2);
  const y = Math.round((size - markSize) / 2);
  const radius = rounded ? Math.round(size * 0.22) : 0;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="icon-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BRAND_MID}"/>
      <stop offset="1" stop-color="${BRAND_DARK}"/>
    </linearGradient>
    <radialGradient id="icon-glow" cx="0.25" cy="0.15" r="0.9">
      <stop offset="0" stop-color="${BRAND_LIGHT}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${BRAND_LIGHT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#icon-bg)"/>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#icon-glow)"/>
  <image href="data:image/png;base64,${mark.toString("base64")}" x="${x}" y="${y}" width="${markSize}" height="${markSize}"/>
</svg>`;
}

async function buildIcons(lightMarkBuffer, markSize) {
  const mark = await sharp(lightMarkBuffer, {
    raw: { width: markSize, height: markSize, channels: 4 },
  })
    .png()
    .toBuffer();

  const rounded = Buffer.from(
    iconSvg({ size: 512, mark, padding: 0.64, rounded: true }),
  );
  const maskable = Buffer.from(
    iconSvg({ size: 512, mark, padding: 0.54, rounded: false }),
  );
  const apple = Buffer.from(
    iconSvg({ size: 180, mark, padding: 0.6, rounded: false }),
  );

  await sharp(rounded).png().toFile(path.join(ICONS_DIR, "icon-512.png"));
  await sharp(rounded).resize(192).png().toFile(path.join(ICONS_DIR, "icon-192.png"));
  await sharp(maskable).png().toFile(path.join(ICONS_DIR, "maskable-512.png"));
  await sharp(apple).png().toFile(path.join(ICONS_DIR, "apple-icon-180.png"));
  await sharp(rounded).png().toFile(path.join(APP_DIR, "icon.png"));
  await sharp(apple).png().toFile(path.join(APP_DIR, "apple-icon.png"));

  // Multi-resolution favicon.
  const faviconPng = path.join(os.tmpdir(), "verdstamp-favicon-512.png");
  await sharp(rounded).png().toFile(faviconPng);
  try {
    execFileSync(
      "magick",
      [faviconPng, "-define", "icon:auto-resize=48,32,16", path.join(APP_DIR, "favicon.ico")],
      { stdio: "ignore" },
    );
  } catch {
    // ImageMagick is optional; keep the existing favicon if it is unavailable.
  }
}

async function buildOpenGraph({ lightMarkBuffer, markSize }) {
  const wordmark = fs
    .readFileSync(path.join(BRAND_DIR, "verdstamp-wordmark-dark.png"))
    .toString("base64");
  const mark = (
    await sharp(lightMarkBuffer, {
      raw: { width: markSize, height: markSize, channels: 4 },
    })
      .png()
      .toBuffer()
  ).toString("base64");

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#061f10"/>
      <stop offset="0.55" stop-color="#0a351c"/>
      <stop offset="1" stop-color="${BRAND_MID}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.22" r="0.65">
      <stop offset="0" stop-color="#4aad69" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#4aad69" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.2" fill="${BRAND_MINT}" fill-opacity="0.10"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <image href="data:image/png;base64,${mark}" x="800" y="88" width="360" height="360" opacity="0.12"/>
  <image href="data:image/png;base64,${wordmark}" x="72" y="64" width="328" height="64"/>
  <text x="72" y="296" font-family="Manrope" font-size="74" font-weight="800" fill="${WORDMARK_LIGHT}" letter-spacing="-1.5">Buy, swap &amp; transfer</text>
  <text x="72" y="378" font-family="Manrope" font-size="74" font-weight="800" fill="${BRAND_LIGHT}" letter-spacing="-1.5">crypto with confidence.</text>
  <text x="72" y="462" font-family="Manrope" font-size="28" font-weight="500" fill="#b9dcc4">Transparent fees. Deep liquidity. 24/7 support.</text>
  <rect x="72" y="528" width="238" height="48" rx="24" fill="${BRAND_LIGHT}" fill-opacity="0.12" stroke="${BRAND_LIGHT}" stroke-opacity="0.35"/>
  <text x="96" y="559" font-family="Manrope" font-size="21" font-weight="700" fill="${BRAND_MINT}" letter-spacing="0.2">verdstampdigital.app</text>
  <text x="1128" y="559" text-anchor="end" font-family="Manrope" font-size="20" font-weight="600" fill="#7fa98c">Verdstamp · Trusted Markets</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(BRAND_DIR, "verdstamp-og.png"));
}

async function main() {
  configureFonts();
  const { lightMarkBuffer, markSize } = await buildWordmarks();
  await buildIcons(lightMarkBuffer, markSize);
  await buildOpenGraph({ lightMarkBuffer, markSize });
  console.log("Verdstamp brand assets generated.");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
