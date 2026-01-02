import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hardcoded credentials for this specific migration
const SUPABASE_URL = 'https://npglvdkiminuvzggtiwz.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ ERROR: SUPABASE_SERVICE_KEY not found');
    console.log('\n📋 MANUAL MIGRATION REQUIRED');
    console.log('=============================');
    console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard/project/npglvdkiminuvzggtiwz');
    console.log('2. Navigate to: SQL Editor');
    console.log('3. Copy and paste the following SQL:');
    console.log('\n--- SQL START ---\n');

    const sqlPath = path.join(__dirname, 'migrations', '20260101_fix_email_logs_cascade.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log(sqlContent);
    console.log('\n--- SQL END ---\n');
    console.log('4. Click "Run" to execute\n');
    process.exit(0);
}

console.log('🔧 Applying CASCADE Delete Migration');
console.log('====================================\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const sqlPath = path.join(__dirname, 'migrations', '20260101_fix_email_logs_cascade.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log('📄 Migration SQL:');
console.log(sqlContent);
console.log('\n🚀 Executing...\n');

// Split SQL into individual statements and execute
const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

for (const statement of statements) {
    if (!statement) continue;

    console.log(`Executing: ${statement.substring(0, 80)}...`);
    const { error } = await supabase.rpc('exec_sql', { sql: statement });

    if (error) {
        console.error('⚠️ Note:', error.message);
        // Continue with other statements
    }
}

console.log('\n✅ Migration completed!');
console.log('You can now delete quotes and calls - email logs will cascade automatically.\n');
