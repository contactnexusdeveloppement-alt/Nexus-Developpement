import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de connexion PostgreSQL Supabase
const connectionString = 'postgresql://postgres:LdTf7E6C8RxUgSdj@db.oowoybqlxlfcuddjxnkb.supabase.co:5432/postgres';

async function executeMigration() {
    console.log('🚀 Connexion à la base de données Supabase...\n');

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('✅ Connecté à PostgreSQL!\n');

        // Lire le fichier SQL
        const sqlPath = path.join(__dirname, 'supabase', 'migrations', 'CONSOLIDATED_MIGRATION_PHASE1.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 Fichier SQL chargé');
        console.log('📏 Taille:', sqlContent.length, 'caractères\n');

        console.log('⚡ Exécution des migrations (commande par commande)...\n');

        // Diviser le SQL en commandes individuelles
        const commands = sqlContent
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('/*'));

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (let i = 0; i < commands.length; i++) {
            const command = commands[i] + ';';

            try {
                await client.query(command);
                successCount++;
                process.stdout.write('✅');
            } catch (error) {
                // Ignorer les erreurs "already exists" et "duplicate"
                if (error.message.includes('already exists') ||
                    error.message.includes('duplicate') ||
                    error.message.includes('does not exist')) {
                    skipCount++;
                    process.stdout.write('⏭️ ');
                } else {
                    errorCount++;
                    console.log(`\n❌ Erreur commande ${i + 1}:`, error.message.substring(0, 150));
                }
            }

            // Pause courte pour éviter de surcharger
            if (i % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log('\n\n' + '='.repeat(60));
        console.log('📊 RÉSUMÉ DE L\'EXÉCUTION');
        console.log('='.repeat(60));
        console.log(`✅ Succès: ${successCount} commandes`);
        console.log(`⏭️  Ignorées (déjà existantes): ${skipCount} commandes`);
        console.log(`❌ Erreurs: ${errorCount} commandes`);
        console.log('='.repeat(60) + '\n');

        // Vérifier les tables créées
        console.log('🔍 Vérification des tables créées...\n');

        const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('projects', 'project_milestones', 'project_deliverables', 'invoices', 'invoice_items', 'payments', 'notifications')
      ORDER BY tablename;
    `);

        console.log(`✅ ${result.rows.length}/7 tables créées:`);
        result.rows.forEach(row => {
            console.log(`   ✓ ${row.tablename}`);
        });

        if (result.rows.length === 7) {
            console.log('\n🎉 Migration Phase 1 terminée avec succès!\n');
        } else {
            console.log('\n⚠️  Certaines tables manquent. Vérifiez les erreurs ci-dessus.\n');
        }

    } catch (error) {
        console.error('\n❌ ERREUR FATALE:', error.message);
        console.error('\nDétails:', error.stack);
    } finally {
        await client.end();
        console.log('🔌 Connexion fermée.\n');
    }
}

executeMigration();
