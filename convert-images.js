const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
    'public/projects/concession-home.png',
    'public/restaurant/screenshot.png',
    'public/salon/screenshot.png'
];

async function convertImages() {
    for (const imagePath of images) {
        const inputPath = path.join(process.cwd(), imagePath);
        const outputPath = inputPath.replace('.png', '.webp');

        try {
            await sharp(inputPath)
                .resize(800, null, { withoutEnlargement: true }) // Max width 800px
                .webp({ quality: 80 }) // WebP quality 80%
                .toFile(outputPath);

            const stats = fs.statSync(outputPath);
            console.log(`✅ ${imagePath} → ${outputPath} (${(stats.size / 1024).toFixed(2)} KB)`);
        } catch (error) {
            console.error(`❌ Erreur pour ${imagePath}:`, error.message);
        }
    }
}

convertImages().then(() => {
    console.log('\n🎉 Conversion terminée !');
    console.log('📝 Supprime maintenant les fichiers PNG originaux si tout est OK');
});
