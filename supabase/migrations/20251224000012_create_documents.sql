-- =====================================================
-- PHASE 2 - MIGRATION 3: GESTION DOCUMENTAIRE
-- =====================================================
-- Date: 2025-12-24
-- Description: Système de gestion des documents et templates
-- =====================================================

-- Table des documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('contract', 'quote', 'invoice', 'proposal', 'attachment', 'other')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  related_to_type TEXT CHECK (related_to_type IN ('quote', 'project', 'opportunity', 'client', 'invoice')),
  related_to_id UUID,
  client_email TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'archived', 'cancelled')),
  signed_at TIMESTAMPTZ,
  signature_url TEXT,
  uploaded_by UUID,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des templates de documents
CREATE TABLE IF NOT EXISTS document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quote', 'invoice', 'contract', 'proposal', 'email')),
  content TEXT NOT NULL, -- HTML ou Markdown
  variables JSONB DEFAULT '{}', -- Variables à remplacer
  active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_email);
CREATE INDEX IF NOT EXISTS idx_documents_related ON documents(related_to_type, related_to_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_templates_type ON document_templates(type);
CREATE INDEX IF NOT EXISTS idx_document_templates_active ON document_templates(active);

-- Triggers pour updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON document_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour notifier nouveau document
CREATE OR REPLACE FUNCTION notify_new_document()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type IN ('contract', 'quote', 'invoice') AND NEW.status = 'sent' THEN
    PERFORM notify_all_admins(
      'document_sent',
      'Document envoyé',
      'Le document "' || NEW.name || '" a été envoyé au client',
      '/admin?tab=documents&id=' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_document
  AFTER INSERT OR UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_document();

-- Insérer des templates par défaut
INSERT INTO document_templates (name, type, content, variables, is_default, description) VALUES
  (
    'Devis Standard',
    'quote',
    '<html><body><h1>Devis {{quote_number}}</h1><p>Client: {{client_name}}</p><p>Montant: {{amount}}€</p></body></html>',
    '{"quote_number": "string", "client_name": "string", "amount": "number"}',
    true,
    'Template de devis par défaut'
  ),
  (
    'Facture Standard',
    'invoice',
    '<html><body><h1>Facture {{invoice_number}}</h1><p>Client: {{client_name}}</p><p>Total: {{total}}€</p></body></html>',
    '{"invoice_number": "string", "client_name": "string", "total": "number"}',
    true,
    'Template de facture par défaut'
  )
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage documents"
  ON documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can manage document templates"
  ON document_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- =====================================================
-- FIN DE LA MIGRATION DOCUMENTS
-- =====================================================
