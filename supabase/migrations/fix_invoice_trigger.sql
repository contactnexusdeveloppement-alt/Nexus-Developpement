-- =====================================================
-- FIX: Trigger manquant pour génération auto invoice_number
-- =====================================================
-- Ce trigger appelle automatiquement generate_invoice_number()
-- lors de la création d'une facture
-- =====================================================

-- Créer le trigger pour auto-générer invoice_number
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger AVANT insertion
DROP TRIGGER IF EXISTS trigger_set_invoice_number ON invoices;
CREATE TRIGGER trigger_set_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_number();

-- Vérification
SELECT 'Trigger créé avec succès !' AS status;
