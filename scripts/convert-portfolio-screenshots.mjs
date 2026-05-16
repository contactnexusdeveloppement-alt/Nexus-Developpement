/**
 * Convertit les captures d'écran de portfolio (PNG brutes) en WebP optimisés
 * pour `public/projects/`.
 *
 * Usage :
 *   1. Déposer les PNG bruts dans le dossier source (par défaut Ned_web/src/assets/)
 *   2. Ajouter une entrée dans MAPPINGS ci-dessous
 *   3. node scripts/convert-portfolio-screenshots.mjs
 *
 * Le script :
 *   - resize en 1600×1000 (ratio 8:5 = 1.6, aligné avec les cards Portfolio
 *     qui utilisent désormais `aspect-[8/5]`). Garantit zéro crop CSS dans
 *     les cards : ce qu'on capture = ce qui s'affiche.
 *   - qualité WebP 85 (bon compromis poids/perception)
 *   - cover + position 'top' : si la source est plus large que 1.6 (ex:
 *     screenshot 16:9 brut), on coupe le bas; le haut (navbar + hero)
 *     reste intact.
 *   - skip si le webp cible existe déjà (pour éviter d'écraser des manips manuelles)
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier source des PNG bruts (modifie si besoin)
const SOURCE_DIR = "C:/Users/Adam/Desktop/Ned_web/src/assets";

// Dossier cible (relatif à la racine du repo)
const TARGET_DIR = path.join(__dirname, "..", "public", "projects");

// Mapping source -> destination
const MAPPINGS = [
  { src: "arno-polynice.png", dst: "arno-polynice.webp" },
  { src: "orient-relais.png", dst: "orient-relais.webp" },
  { src: "bodystart-nutrition.png", dst: "bodystart.webp" },
];

async function run() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
    console.log(`📁 Created: ${TARGET_DIR}`);
  }

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const { src, dst } of MAPPINGS) {
    const inputPath = path.join(SOURCE_DIR, src);
    const outputPath = path.join(TARGET_DIR, dst);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Source not found: ${inputPath}`);
      failed++;
      continue;
    }
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipped (exists): ${dst}`);
      skipped++;
      continue;
    }

    try {
      await sharp(inputPath)
        .resize({ width: 1600, height: 1000, fit: "cover", position: "top" })
        .webp({ quality: 85 })
        .toFile(outputPath);

      const originalSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      console.log(
        `✅ ${dst}  (${(newSize / 1024).toFixed(0)} ko, -${savings}% vs PNG)`,
      );
      ok++;
    } catch (err) {
      console.log(`❌ ${dst}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 OK ${ok} · skipped ${skipped} · failed ${failed}`);
}

run();
