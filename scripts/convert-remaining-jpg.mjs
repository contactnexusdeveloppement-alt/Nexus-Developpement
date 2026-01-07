import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const jpgs = [
    'public/assets/adam_lecharles.jpg',
    'public/assets/theo_jacobee.jpg',
    'public/salon/assets/hero-bg-2.jpg',
    'public/salon/assets/hero-bg-3.jpg',
    'public/salon/assets/portfolio-balayage.jpg',
    'public/salon/assets/portfolio-beard.jpg',
    'public/salon/assets/portfolio-braid.jpg',
    'public/salon/assets/portfolio-bun.jpg',
    'public/salon/assets/portfolio-wavy.jpg',
    'src/assets/adam_lecharles.jpg',
    'src/assets/theo_jacobee.jpg'
];

async function convert() {
    console.log('🔄 Converting remaining JPGs to WebP...\n');
    let converted = 0;

    for (const jpg of jpgs) {
        const input = path.join(root, jpg);
        const output = input.replace('.jpg', '.webp');

        if (!fs.existsSync(input)) {
            console.log(`⚠️  Not found: ${jpg}`);
            continue;
        }

        if (fs.existsSync(output)) {
            console.log(`⏭️  Exists: ${path.basename(output)}`);
            continue;
        }

        try {
            await sharp(input).webp({ quality: 85 }).toFile(output);
            console.log(`✅ ${path.basename(jpg)}`);
            converted++;
        } catch (e) {
            console.log(`❌ ${jpg}: ${e.message}`);
        }
    }

    console.log(`\n📊 Converted: ${converted}`);
}

convert();
