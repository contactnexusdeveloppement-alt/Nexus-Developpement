import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credentials Supabase
const SUPABASE_URL = 'https://oowoybqlxlfcuddjxnkb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vd295YnFseGxmY3VkZGp4bmtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQzMjE0MiwiZXhwIjoyMDgyMDA4MTQyfQ.t-oF9YWPHr51pOTEexCv9UkO8yd-Gn9aIIkZP66Y5SA';

async function executeSQL(sql) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({ query: sql })
    });

    return response;
}

async function executeMigration() {
    console.log('🚀 Exécution des migrations SQL Phase 1...\n');

    try {
        // Lire le fichier SQL
        const sqlPath = path.join(__dirname, 'supabase', 'migrations', 'CONSOLIDATED_MIGRATION_PHASE1.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 Fichier SQL chargé');
        console.log('📏 Taille:', sqlContent.length, 'caractères\n');

        // Exécuter tout le SQL en une seule fois
        console.log('⚡ Exécution du script SQL complet...\n');

        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ query: sqlContent })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Erreur lors de l\'exécution:', errorText);

            // Essayer une approche alternative avec pg-admin
            console.log('\n🔄 Tentative avec approche alternative...\n');

            // Utiliser l'API Database directement
            const dbResponse = await fetch(`${SUPABASE_URL}/database/v1/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                },
                body: JSON.stringify({
                    query: sqlContent,
                    params: []
                })
            });

            if (!dbResponse.ok) {
                console.log('❌ Approche alternative échouée aussi');
                console.log('\n⚠️  L\'API REST de Supabase ne permet pas d\'exécuter du SQL arbitraire.');
                console.log('📝 Veuillez exécuter le script manuellement dans le SQL Editor.\n');
                console.log('🔗 Lien direct: https://supabase.com/dashboard/project/oowoybqlxlfcuddjxnkb/sql/new\n');
                return;
            }
        }

        console.log('✅ Script SQL exécuté avec succès!\n');

        // Vérifier les tables créées
        console.log('🔍 Vérification des tables...\n');

        const tables = ['projects', 'project_milestones', 'project_deliverables', 'invoices', 'invoice_items', 'payments', 'notifications'];

        for (const table of tables) {
            const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id&limit=0`, {
                method: 'GET',
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                }
            });

            if (checkResponse.ok) {
                console.log(`✅ Table "${table}" existe`);
            } else {
                console.log(`❌ Table "${table}" n'existe pas`);
            }
        }

        console.log('\n✅ Migration terminée!\n');

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
    }
}

executeMigration();
