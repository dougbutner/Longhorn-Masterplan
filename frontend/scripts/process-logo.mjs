/**
 * Make near-black pixels transparent and emit favicons.
 * Usage: node scripts/process-logo.mjs [input-path]
 * Default input: public/longhorn-horns.png
 */
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const src = process.argv[2] ?? join(pub, "longhorn-horns.png");

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r < 40 && g < 40 && b < 40) data[i + 3] = 0;
}
const raw = { width: info.width, height: info.height, channels: 4 };
const buf = Buffer.from(data);
await sharp(buf, { raw }).png().toFile(join(pub, "longhorn-horns.png"));
await sharp(buf, { raw })
  .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(pub, "favicon.png"));
await sharp(buf, { raw })
  .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(pub, "favicon-32.png"));
console.log(`Processed ${info.width}x${info.height} → longhorn-horns.png, favicon.png, favicon-32.png`);
