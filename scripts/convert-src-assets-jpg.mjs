import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');

async function convertJpgToWebp() {
    console.log('🔄 Converting src/assets JPG to WebP...\n');

    const files = fs.readdirSync(srcAssetsDir).filter(f => f.endsWith('.jpg'));
    let converted = 0;

    for (const file of files) {
        const input = path.join(srcAssetsDir, file);
        const output = input.replace('.jpg', '.webp');

        if (fs.existsSync(output)) {
            console.log(`⏭️  Exists: ${file.replace('.jpg', '.webp')}`);
            continue;
        }

        try {
            await sharp(input).webp({ quality: 85 }).toFile(output);
            console.log(`✅ Converted: ${file}`);
            converted++;
        } catch (e) {
            console.log(`❌ Error: ${file} - ${e.message}`);
        }
    }

    console.log(`\n📊 Converted: ${converted} files`);
}

convertJpgToWebp();
