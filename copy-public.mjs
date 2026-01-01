import { cp } from 'fs/promises';
import { existsSync } from 'fs';

async function copyPublic() {
    try {
        if (existsSync('public')) {
            console.log('📁 Copying public directory to dist...');
            await cp('public', 'dist', { recursive: true });
            console.log('✅ Public directory copied successfully!');
        } else {
            console.log('⚠️  No public directory found');
        }
    } catch (error) {
        console.error('❌ Error copying public directory:', error);
        process.exit(1);
    }
}

copyPublic();
