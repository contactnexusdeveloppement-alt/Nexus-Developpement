import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Supabase credentials from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ ERROR: Supabase credentials not found in environment');
    console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set');
    process.exit(1);
}

console.log('🔧 Supabase Migration Script');
console.log('============================\n');
console.log(`📍 URL: ${SUPABASE_URL}`);
console.log(`🔑 Key: ${SUPABASE_KEY.substring(0, 20)}...\n`);

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Read SQL migration file
const sqlPath = path.join(__dirname, '..', 'migrations', 'phase1_complete.sql');
console.log(`📄 Reading migration file: ${sqlPath}`);

const sqlContent = fs.readFileSync(sqlPath, 'utf8');
console.log(`✅ SQL file loaded (${sqlContent.length} characters)\n`);

// Execute migration
console.log('🚀 Executing migration...\n');

try {
    // Note: Using RPC to execute raw SQL requires a Postgres function
    // Alternative: Execute individual commands
    const { data, error } = await supabase.rpc('exec_sql', {
        sql: sqlContent
    });

    if (error) {
        console.error('❌ Migration failed:', error);

        // Fallback: Try executing via edge function or manual steps
        console.log('\n⚠️ Direct SQL execution not supported with current credentials');
        console.log('📝 Alternative: Copy SQL to Supabase Dashboard → SQL Editor');
        console.log('\nSQL to execute:');
        console.log('================');
        console.log(sqlContent.substring(0, 500) + '...\n');
        process.exit(1);
    }

    console.log('✅ Migration executed successfully!');
    console.log(data);

} catch (err) {
    console.error('❌ Unexpected error:', err);
    console.log('\n📋 MANUAL MIGRATION REQUIRED');
    console.log('=============================');
    console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Navigate to: SQL Editor');
    console.log('3. Create new query');
    console.log(`4. Copy content from: ${sqlPath}`);
    console.log('5. Paste and execute\n');

    process.exit(1);
}

console.log('\n✅ All done!');
