import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres:LdTf7E6C8RxUgSdj@db.oowoybqlxlfcuddjxnkb.supabase.co:5432/postgres';

async function executePhase3Migrations() {
    console.log('🚀 Exécution migrations Phase 3...\n');

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connecté à PostgreSQL!\n');

        // Migration Workflows
        console.log('📄 Migration Workflows...');
        const workflowsSql = fs.readFileSync(
            path.join(__dirname, 'supabase', 'migrations', '20251224000020_create_workflows.sql'),
            'utf8'
        );
        await client.query(workflowsSql);
        console.log('✅ Workflows migration OK\n');

        // Migration Intégrations
        console.log('📄 Migration Intégrations...');
        const integrationsSql = fs.readFileSync(
            path.join(__dirname, 'supabase', 'migrations', '20251224000021_create_integrations.sql'),
            'utf8'
        );
        await client.query(integrationsSql);
        console.log('✅ Intégrations migration OK\n');

        // Vérifier les tables
        const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('workflows', 'workflow_executions', 'payment_intents', 'email_logs', 'email_templates')
      ORDER BY tablename;
    `);

        console.log(`✅ ${result.rows.length}/5 tables créées:`);
        result.rows.forEach(row => console.log(`   ✓ ${row.tablename}`));

        // Compter les workflows et templates
        const workflowsCount = await client.query('SELECT COUNT(*) as count FROM workflows');
        const templatesCount = await client.query('SELECT COUNT(*) as count FROM email_templates');

        console.log(`\n📊 ${workflowsCount.rows[0].count} workflows configurés`);
        console.log(`📧 ${templatesCount.rows[0].count} templates d'emails créés\n`);

        console.log('🎉 Phase 3 migrations terminées!\n');

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
    } finally {
        await client.end();
        console.log('🔌 Connexion fermée.\n');
    }
}

executePhase3Migrations();
