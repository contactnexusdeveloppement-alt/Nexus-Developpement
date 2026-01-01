-- Migration: Create Invoicing and Payment Tables
-- Description: Tables for managing invoices, invoice items, and payments
-- Date: 2025-12-24

-- Table des factures
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_address TEXT,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 20.00,
  tax_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lignes de facture (items)
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  order_index INTEGER NOT NULL
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'card', 'check', 'cash', 'stripe', 'paypal', 'other')),
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_invoices_project ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_dates ON invoices(issue_date, due_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- Trigger pour updated_at automatique
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer le numéro de facture automatique
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  month TEXT;
  counter INTEGER;
  new_number TEXT;
BEGIN
  year := TO_CHAR(CURRENT_DATE, 'YYYY');
  month := TO_CHAR(CURRENT_DATE, 'MM');
  
  -- Compter les factures du mois en cours
  SELECT COUNT(*) + 1 INTO counter
  FROM invoices
  WHERE invoice_number LIKE 'FAC-' || year || month || '%';
  
  -- Format: FAC-YYYYMM-XXX (ex: FAC-202512-001)
  new_number := 'FAC-' || year || month || '-' || LPAD(counter::TEXT, 3, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le statut de la facture (overdue si dépassée)
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la facture est envoyée et la date d'échéance est dépassée
  IF NEW.status = 'sent' AND NEW.due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_invoice_overdue
  BEFORE INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_status();

-- Fonction pour mettre à jour le statut de la facture après paiement
CREATE OR REPLACE FUNCTION check_invoice_paid()
RETURNS TRIGGER AS $$
DECLARE
  total_paid DECIMAL(10,2);
  invoice_total DECIMAL(10,2);
BEGIN
  -- Calculer le total payé pour cette facture
  SELECT COALESCE(SUM(amount), 0) INTO total_paid
  FROM payments
  WHERE invoice_id = NEW.invoice_id;
  
  -- Récupérer le montant total de la facture
  SELECT total_amount INTO invoice_total
  FROM invoices
  WHERE id = NEW.invoice_id;
  
  -- Si le total payé >= montant facture, marquer comme payée
  IF total_paid >= invoice_total THEN
    UPDATE invoices
    SET status = 'paid'
    WHERE id = NEW.invoice_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_on_payment
  AFTER INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION check_invoice_paid();

-- Row Level Security (RLS)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies: Admin users can do everything
CREATE POLICY "Admin users can manage invoices"
  ON invoices
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can manage invoice items"
  ON invoice_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can manage payments"
  ON payments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Comments pour documentation
COMMENT ON TABLE invoices IS 'Factures clients avec suivi de paiement';
COMMENT ON TABLE invoice_items IS 'Lignes de facturation (prestations)';
COMMENT ON TABLE payments IS 'Paiements reçus pour les factures';
COMMENT ON FUNCTION generate_invoice_number() IS 'Génère automatiquement un numéro de facture unique au format FAC-YYYYMM-XXX';
