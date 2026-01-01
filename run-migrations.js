import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES modules workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERREUR: Variables d\'environnement Supabase manquantes');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeMigration() {
    console.log('🚀 Début de l\'exécution des migrations...\n');

    try {
        // Lire le fichier SQL
        const sqlPath = path.join(__dirname, 'supabase', 'migrations', 'CONSOLIDATED_MIGRATION_PHASE1.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 Fichier SQL chargé:', sqlPath);
        console.log('📏 Taille:', sqlContent.length, 'caractères\n');

        // Vérifier si les tables existent déjà
        console.log('🔍 Vérification des tables existantes...\n');

        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('id')
            .limit(1);

        if (!projectsError) {
            console.log('✅ La table "projects" existe déjà!');
            console.log('   → Nombre de projets:', projects?.length || 0);
        } else if (projectsError.code === '42P01' || projectsError.message.includes('does not exist')) {
            console.log('❌ La table "projects" n\'existe pas encore');
        } else {
            console.log('⚠️  Erreur lors de la vérification projects:', projectsError.message);
        }

        const { data: invoices, error: invoicesError } = await supabase
            .from('invoices')
            .select('id')
            .limit(1);

        if (!invoicesError) {
            console.log('✅ La table "invoices" existe déjà!');
            console.log('   → Nombre de factures:', invoices?.length || 0);
        } else if (invoicesError.code === '42P01' || invoicesError.message.includes('does not exist')) {
            console.log('❌ La table "invoices" n\'existe pas encore');
        } else {
            console.log('⚠️  Erreur lors de la vérification invoices:', invoicesError.message);
        }

        const { data: notifications, error: notificationsError } = await supabase
            .from('notifications')
            .select('id')
            .limit(1);

        if (!notificationsError) {
            console.log('✅ La table "notifications" existe déjà!');
            console.log('   → Nombre de notifications:', notifications?.length || 0);
        } else if (notificationsError.code === '42P01' || notificationsError.message.includes('does not exist')) {
            console.log('❌ La table "notifications" n\'existe pas encore');
        } else {
            console.log('⚠️  Erreur lors de la vérification notifications:', notificationsError.message);
        }

        console.log('\n' + '='.repeat(60));
        console.log('⚠️  IMPORTANT: Exécution manuelle requise');
        console.log('='.repeat(60));
        console.log('\nLe client Supabase JavaScript ne peut pas exécuter de SQL arbitraire.');
        console.log('Vous devez exécuter les migrations manuellement.\n');

        console.log('🔗 Étapes à suivre:');
        console.log('1. Ouvrez votre dashboard Supabase:');
        console.log('   https://supabase.com/dashboard/project/oowoybqlxlfcuddjxnkb/sql/new\n');
        console.log('2. Copiez le contenu du fichier:');
        console.log('   supabase/migrations/CONSOLIDATED_MIGRATION_PHASE1.sql\n');
        console.log('3. Collez-le dans l\'éditeur SQL et cliquez sur "Run"\n');
        console.log('4. Relancez ce script pour vérifier que les tables sont créées\n');

    } catch (error) {
        console.error('❌ ERREUR:', error.message);
        process.exit(1);
    }
}

executeMigration();
