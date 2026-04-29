// Script de compression manuelle des images du dossier public/.
// À lancer ponctuellement : `node scripts/compress-images.mjs`
import sharp from "sharp";
import { promises as fs } from "fs";

const ROOT_PUBLIC = `${process.cwd()}/public`;

async function replaceFile(src, transform) {
  const buffer = await transform(sharp(src)).toBuffer();
  await fs.writeFile(src, buffer);
}

console.log("Compressing favicons...");

await sharp(`${ROOT_PUBLIC}/favicon-512.png`)
  .resize(32, 32)
  .png({ compressionLevel: 9, palette: true, quality: 80 })
  .toFile(`${ROOT_PUBLIC}/favicon-32.png`);
console.log("  favicon-32.png");

await sharp(`${ROOT_PUBLIC}/favicon-512.png`)
  .resize(192, 192)
  .png({ compressionLevel: 9, palette: true, quality: 80 })
  .toFile(`${ROOT_PUBLIC}/favicon-192.png`);
console.log("  favicon-192.png");

await replaceFile(`${ROOT_PUBLIC}/favicon.png`, (s) =>
  s.resize(48, 48).png({ compressionLevel: 9, palette: true, quality: 85 })
);
console.log("  favicon.png (48x48)");

await replaceFile(`${ROOT_PUBLIC}/favicon-512.png`, (s) =>
  s.resize(512, 512).png({ compressionLevel: 9, palette: true, quality: 80 })
);
console.log("  favicon-512.png");

console.log("\nCompressing portfolio webp...");
const portfolio = ["AETHELRED.webp", "Océan & Terre.webp", "LUMINA.webp", "Aura creative.webp"];
for (const f of portfolio) {
  await replaceFile(`${ROOT_PUBLIC}/${f}`, (s) => s.webp({ quality: 70, effort: 6 }));
  console.log(`  ${f}`);
}

console.log("\nDone.");
