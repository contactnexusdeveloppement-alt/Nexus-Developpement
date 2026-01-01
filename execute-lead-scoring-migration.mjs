import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres:LdTf7E6C8RxUgSdj@db.oowoybqlxlfcuddjxnkb.supabase.co:5432/postgres';

async function executeMigration() {
    console.log('🚀 Exécution migration Lead Scoring...\n');

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connecté à PostgreSQL!\n');

        const sqlPath = path.join(__dirname, 'supabase', 'migrations', '20251224000010_create_lead_scoring.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 Fichier SQL chargé');
        console.log('📏 Taille:', sqlContent.length, 'caractères\n');
        console.log('⚡ Exécution de la migration...\n');

        await client.query(sqlContent);

        console.log('✅ Migration Lead Scoring exécutée avec succès!\n');

        // Vérifier les tables créées
        const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('lead_scores', 'scoring_criteria')
      ORDER BY tablename;
    `);

        console.log(`✅ ${result.rows.length}/2 tables créées:`);
        result.rows.forEach(row => console.log(`   ✓ ${row.tablename}`));

        // Vérifier les scores calculés
        const scoresResult = await client.query('SELECT COUNT(*) as count FROM lead_scores');
        console.log(`\n📊 ${scoresResult.rows[0].count} leads scorés automatiquement\n`);

        console.log('🎉 Migration terminée!\n');

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
    } finally {
        await client.end();
        console.log('🔌 Connexion fermée.\n');
    }
}

executeMigration();
