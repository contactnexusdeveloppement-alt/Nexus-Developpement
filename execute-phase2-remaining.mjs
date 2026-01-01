import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres:LdTf7E6C8RxUgSdj@db.oowoybqlxlfcuddjxnkb.supabase.co:5432/postgres';

async function executeAllMigrations() {
    console.log('🚀 Exécution migrations Documents + Rappels...\n');

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connecté à PostgreSQL!\n');

        // Migration Documents
        console.log('📄 Migration Documents...');
        const docsSql = fs.readFileSync(
            path.join(__dirname, 'supabase', 'migrations', '20251224000012_create_documents.sql'),
            'utf8'
        );
        await client.query(docsSql);
        console.log('✅ Documents migration OK\n');

        // Migration Rappels
        console.log('📄 Migration Rappels...');
        const remindersSql = fs.readFileSync(
            path.join(__dirname, 'supabase', 'migrations', '20251224000013_create_reminders.sql'),
            'utf8'
        );
        await client.query(remindersSql);
        console.log('✅ Rappels migration OK\n');

        // Vérifier les tables
        const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('documents', 'document_templates', 'reminders')
      ORDER BY tablename;
    `);

        console.log(`✅ ${result.rows.length}/3 tables créées:`);
        result.rows.forEach(row => console.log(`   ✓ ${row.tablename}`));

        console.log('\n🎉 Toutes les migrations Phase 2 terminées!\n');

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
    } finally {
        await client.end();
        console.log('🔌 Connexion fermée.\n');
    }
}

executeAllMigrations();
