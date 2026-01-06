import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pngsToConvert = [
    'src/assets/bodystart-project.png',
    'src/assets/chloe_durand.png',
    'src/assets/emma_dubois.png',
    'src/assets/julie_morel.png',
    'src/assets/logo.png',
    'src/assets/lucas_martin.png',
    'src/assets/maxime_leroy.png',
    'src/assets/sarah_chen.png',
    'src/assets/theo_gautier.png',
    'src/assets/thomas_petit.png',
    'src/assets/restaurant/images/bar.png',
    'src/assets/restaurant/images/burger.png',
    'src/assets/restaurant/images/drinks.png',
    'src/assets/restaurant/images/hero.png',
    'src/assets/restaurant/images/kitchen.png',
    'src/assets/restaurant/images/map.png',
    'src/assets/restaurant/images/ribs.png',
    'src/assets/restaurant/images/starters.png',
    'src/assets/restaurant/images/steak.png'
];

async function convertAssetsPng() {
    console.log('🔄 Converting src/assets PNG to WebP...\n');

    let converted = 0;
    let skipped = 0;

    for (const pngPath of pngsToConvert) {
        const inputPath = path.join(__dirname, '..', pngPath);
        const outputPath = inputPath.replace('.png', '.webp');

        if (fs.existsSync(outputPath)) {
            console.log(`⏭️  Skipped: ${pngPath}`);
            skipped++;
            continue;
        }

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  Not found: ${pngPath}`);
            continue;
        }

        try {
            await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath);
            const orig = fs.statSync(inputPath).size;
            const newS = fs.statSync(outputPath).size;
            console.log(`✅ ${path.basename(pngPath)} → ${((1 - newS / orig) * 100).toFixed(0)}% smaller`);
            converted++;
        } catch (e) {
            console.log(`❌ Error: ${pngPath}`);
        }
    }

    console.log(`\n📊 Converted: ${converted}, Skipped: ${skipped}`);
}

convertAssetsPng();
