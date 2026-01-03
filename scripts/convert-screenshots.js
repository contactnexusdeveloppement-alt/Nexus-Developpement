const sharp = require('sharp');
const path = require('path');

async function convertScreenshots() {
    console.log('🎨 Converting project screenshots to WebP...\n');

    try {
        // Convert salon screenshot
        await sharp('public/salon/screenshot.png')
            .webp({ quality: 80 })
            .toFile('public/salon/screenshot.webp');
        console.log('✅ public/salon/screenshot.webp created');

        // Convert restaurant screenshot
        await sharp('public/restaurant/screenshot.png')
            .webp({ quality: 80 })
            .toFile('public/restaurant/screenshot.webp');
        console.log('✅ public/restaurant/screenshot.webp created');

        console.log('\n✨ All screenshots converted successfully!');
    } catch (error) {
        console.error('❌ Error converting screenshots:', error);
        process.exit(1);
    }
}

convertScreenshots();
