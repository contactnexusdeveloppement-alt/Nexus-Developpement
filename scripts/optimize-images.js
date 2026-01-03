import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');

async function optimizeImages() {
    console.log('🎨 Starting image optimization...\n');

    try {
        // 1. Optimize nexus-logo.png (460x460 -> 96x96 WebP)
        console.log('📦 Optimizing logo...');
        const logoPath = path.join(publicDir, 'nexus-logo.png');
        const logoWebpPath = path.join(publicDir, 'nexus-logo.webp');

        await sharp(logoPath)
            .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .webp({ quality: 90, lossless: false })
            .toFile(logoWebpPath);

        const logoStats = await fs.stat(logoWebpPath);
        console.log(`✅ Logo optimized: ${(logoStats.size / 1024).toFixed(2)} KB (96x96 WebP)\n`);

        // 2. Optimize og-image.png to WebP
        console.log('📦 Optimizing OG image...');
        const ogPath = path.join(publicDir, 'og-image.png');
        const ogWebpPath = path.join(publicDir, 'og-image.webp');

        await sharp(ogPath)
            .webp({ quality: 85 })
            .toFile(ogWebpPath);

        const ogStats = await fs.stat(ogWebpPath);
        console.log(`✅ OG image optimized: ${(ogStats.size / 1024).toFixed(2)} KB (WebP)\n`);

        // 3. Optimize favicon.png to WebP
        console.log('📦 Optimizing favicon...');
        const faviconPath = path.join(publicDir, 'favicon.png');
        const faviconWebpPath = path.join(publicDir, 'favicon.webp');

        try {
            await sharp(faviconPath)
                .webp({ quality: 85 })
                .toFile(faviconWebpPath);

            const faviconStats = await fs.stat(faviconWebpPath);
            console.log(`✅ Favicon optimized: ${(faviconStats.size / 1024).toFixed(2)} KB (WebP)\n`);
        } catch (err) {
            console.log('⚠️  Skipping favicon (not critical)\n');
        }

        // 4. Optimize email-logo.png
        console.log('📦 Optimizing email logo...');
        const emailLogoPath = path.join(publicDir, 'email-logo.png');
        const emailLogoWebpPath = path.join(publicDir, 'email-logo.webp');

        try {
            await sharp(emailLogoPath)
                .resize(200, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp({ quality: 85 })
                .toFile(emailLogoWebpPath);

            const emailStats = await fs.stat(emailLogoWebpPath);
            console.log(`✅ Email logo optimized: ${(emailStats.size / 1024).toFixed(2)} KB (WebP)\n`);
        } catch (err) {
            console.log('⚠️  Skipping email logo (not found)\n');
        }

        // 5. Optimize project images
        console.log('📦 Optimizing project images...');
        const projectsDir = path.join(publicDir, 'projects');

        try {
            const projectFiles = await fs.readdir(projectsDir);
            const pngJpgFiles = projectFiles.filter(f =>
                f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
            );

            for (const file of pngJpgFiles) {
                const inputPath = path.join(projectsDir, file);
                const outputPath = path.join(projectsDir, file.replace(/\.(png|jpg|jpeg)$/, '.webp'));

                // Skip if WebP already exists
                try {
                    await fs.access(outputPath);
                    console.log(`⏭️  Skipping ${file} (WebP already exists)`);
                    continue;
                } catch {
                    // File doesn't exist, proceed with conversion
                }

                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                const stats = await fs.stat(outputPath);
                console.log(`✅ ${file} -> ${(stats.size / 1024).toFixed(2)} KB`);
            }
            console.log('');
        } catch (err) {
            console.log('⚠️  No projects directory found (skipping)\n');
        }

        console.log('✨ Image optimization complete!\n');
        console.log('📊 Summary:');
        console.log('- Logo: 96x96 WebP for fast loading');
        console.log('- OG Image: WebP format');
        console.log('- Project images: Converted to WebP\n');
        console.log('⚠️  Note: Update image references in your code to use .webp extension');
        console.log('💡 Tip: Keep original PNG files as backup\n');

    } catch (error) {
        console.error('❌ Error during optimization:', error);
        process.exit(1);
    }
}

optimizeImages();
