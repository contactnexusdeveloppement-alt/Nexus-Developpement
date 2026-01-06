import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pngsToConvert = [
    'agence-immo/screenshot.png',
    'assets/bodystart-project.png',
    'assets/chloe_durand.png',
    'assets/emma_dubois.png',
    'assets/julie_morel.png',
    'assets/logo.png',
    'assets/lucas_martin.png',
    'assets/maxime_leroy.png',
    'assets/sarah_chen.png',
    'assets/theo_gautier.png',
    'assets/thomas_petit.png',
    'concession/bmw-m3-competition.png',
    'concession/car-audi-q5.png',
    'concession/car-mercedes-a.png',
    'concession/car-peugeot-3008.png',
    'concession/car-renault-clio-4.png',
    'concession/car-vw-golf-8.png',
    'concession/service-detailing-new.png',
    'concession/service-detailing.png',
    'concession/service-mechanic-new.png',
    'concession/service-sourcing.png',
    'concession/tesla-model-3.png',
    'images/theo_jacobee.png',
    'salon/assets/hero-bg.png',
    'salon/assets/portfolio-bob.png',
    'salon/assets/portfolio-fade.png',
    'salon/assets/portfolio-ombre.png',
    'salon/assets/salon-interior.png'
];

async function convertPngToWebp() {
    console.log('🔄 Converting PNG images to WebP...\n');

    let converted = 0;
    let failed = 0;

    for (const pngPath of pngsToConvert) {
        const inputPath = path.join(__dirname, '..', 'public', pngPath);
        const outputPath = inputPath.replace('.png', '.webp');

        // Skip if webp already exists
        if (fs.existsSync(outputPath)) {
            console.log(`⏭️  Skipped (exists): ${pngPath}`);
            continue;
        }

        // Skip if source doesn't exist
        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  Source not found: ${pngPath}`);
            failed++;
            continue;
        }

        try {
            await sharp(inputPath)
                .webp({ quality: 85 })
                .toFile(outputPath);

            const originalSize = fs.statSync(inputPath).size;
            const newSize = fs.statSync(outputPath).size;
            const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

            console.log(`✅ ${pngPath} → ${savings}% smaller`);
            converted++;
        } catch (error) {
            console.log(`❌ Error: ${pngPath} - ${error.message}`);
            failed++;
        }
    }

    console.log(`\n📊 Done! Converted: ${converted}, Failed: ${failed}`);
}

convertPngToWebp();
