import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

async function optimizeProjectImages() {
    console.log('🎨 Optimizing project images...\n');

    const optimizations = [
        {
            input: 'public/projects/concession-home.webp',
            output: 'public/projects/concession-home-optimized.webp',
            width: 600,
            quality: 75
        }
    ];

    try {
        for (const opt of optimizations) {
            const stats = await fs.stat(opt.input);
            const originalSize = (stats.size / 1024).toFixed(2);

            await sharp(opt.input)
                .resize(opt.width, null, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: opt.quality })
                .toFile(opt.output);

            const newStats = await fs.stat(opt.output);
            const newSize = (newStats.size / 1024).toFixed(2);
            const savings = ((stats.size - newStats.size) / 1024).toFixed(2);

            console.log(`✅ ${path.basename(opt.input)}`);
            console.log(`   Original: ${originalSize} KB → Optimized: ${newSize} KB`);
            console.log(`   Savings: ${savings} KB (${((savings / originalSize) * 100).toFixed(1)}%)\n`);

            // Replace original with optimized
            await fs.rename(opt.output, opt.input);
        }

        console.log('✨ All images optimized successfully!');
    } catch (error) {
        console.error('❌ Error optimizing images:', error);
        process.exit(1);
    }
}

optimizeProjectImages();
