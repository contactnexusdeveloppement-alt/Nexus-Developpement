import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:LdTf7E6C8RxUgSdj@db.oowoybqlxlfcuddjxnkb.supabase.co:5432/postgres';

async function createInvoiceTrigger() {
    console.log('🔧 Création du trigger pour auto-génération invoice_number...\n');

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connecté à PostgreSQL!\n');

        // Créer la fonction trigger
        const createFunctionSQL = `
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
    `;

        console.log('📝 Création de la fonction set_invoice_number()...');
        await client.query(createFunctionSQL);
        console.log('✅ Fonction créée!\n');

        // Supprimer l'ancien trigger s'il existe
        console.log('🗑️  Suppression de l\'ancien trigger (si existe)...');
        await client.query('DROP TRIGGER IF EXISTS trigger_set_invoice_number ON invoices;');
        console.log('✅ Ancien trigger supprimé!\n');

        // Créer le nouveau trigger
        const createTriggerSQL = `
CREATE TRIGGER trigger_set_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_number();
    `;

        console.log('🎯 Création du trigger...');
        await client.query(createTriggerSQL);
        console.log('✅ Trigger créé avec succès!\n');

        // Test: vérifier que le trigger existe
        const checkTrigger = await client.query(`
      SELECT trigger_name, event_manipulation, event_object_table 
      FROM information_schema.triggers 
      WHERE trigger_name = 'trigger_set_invoice_number';
    `);

        if (checkTrigger.rows.length > 0) {
            console.log('✅ VÉRIFICATION: Trigger bien installé!');
            console.log('   Nom:', checkTrigger.rows[0].trigger_name);
            console.log('   Table:', checkTrigger.rows[0].event_object_table);
            console.log('   Événement:', checkTrigger.rows[0].event_manipulation);
        } else {
            console.log('⚠️  Trigger non trouvé dans la vérification');
        }

        console.log('\n🎉 SUCCÈS! Le bouton "Créer facture" devrait maintenant fonctionner!');
        console.log('   Les numéros de facture seront générés automatiquement au format: FAC-202412-001\n');

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
        console.error('Détails:', error);
    } finally {
        await client.end();
        console.log('🔌 Connexion fermée.\n');
    }
}

createInvoiceTrigger();
