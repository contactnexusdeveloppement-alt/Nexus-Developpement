-- =====================================================
-- PHASE 3 - MIGRATION 2: INTÉGRATIONS (STRIPE & EMAILS)
-- =====================================================
-- Date: 2025-12-24
-- Description: Tables pour Stripe et SendGrid
-- =====================================================

-- Table des paiements Stripe
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled')),
  client_secret TEXT,
  payment_method_types TEXT[] DEFAULT '{"card"}',
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des logs d'emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  from_email TEXT NOT NULL DEFAULT 'contact@nexus-dev.fr',
  subject TEXT NOT NULL,
  template_id TEXT,
  template_name TEXT,
  variables JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sendgrid_message_id TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  error_message TEXT,
  related_to_type TEXT,
  related_to_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des templates d'emails
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '{}',
  sendgrid_template_id TEXT,
  category TEXT, -- 'transactional', 'marketing', 'notification'
  active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_intents_invoice ON payment_intents(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_stripe ON payment_intents(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_to ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);

-- Triggers updated_at
CREATE TRIGGER update_payment_intents_updated_at
  BEFORE UPDATE ON payment_intents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer un lien de paiement Stripe
CREATE OR REPLACE FUNCTION create_payment_link(p_invoice_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_invoice RECORD;
  v_payment_intent_id UUID;
BEGIN
  -- Récupérer la facture
  SELECT * INTO v_invoice FROM invoices WHERE id = p_invoice_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invoice % not found', p_invoice_id;
  END IF;

  -- Créer le payment intent (sera complété par Edge Function)
  INSERT INTO payment_intents (invoice_id, amount, currency, status)
  VALUES (p_invoice_id, v_invoice.total_amount, 'eur', 'pending')
  RETURNING id INTO v_payment_intent_id;

  -- Retourner l'URL (sera générée par Edge Function)
  RETURN '/pay/' || v_payment_intent_id::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour logger un email
CREATE OR REPLACE FUNCTION log_email(
  p_to_email TEXT,
  p_subject TEXT,
  p_template_name TEXT,
  p_variables JSONB DEFAULT '{}',
  p_related_to_type TEXT DEFAULT NULL,
  p_related_to_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO email_logs (
    to_email,
    subject,
    template_name,
    variables,
    related_to_type,
    related_to_id,
    status
  ) VALUES (
    p_to_email,
    p_subject,
    p_template_name,
    p_variables,
    p_related_to_type,
    p_related_to_id,
    'pending'
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Insérer templates d'emails par défaut
INSERT INTO email_templates (name, subject, html_content, text_content, category, description) VALUES
  (
    'quote_confirmation',
    'Confirmation de votre demande de devis',
    '<h1>Merci {{client_name}} !</h1><p>Nous avons bien reçu votre demande de devis.</p><p>Notre équipe va l''étudier et vous répondra sous 24-48h.</p>',
    'Merci {{client_name}} ! Nous avons bien reçu votre demande de devis.',
    'transactional',
    'Email de confirmation après demande de devis'
  ),
  (
    'quote_followup',
    'Relance - Votre devis Nexus Développement',
    '<h1>Bonjour {{client_name}},</h1><p>Nous vous avons envoyé un devis il y a quelques jours.</p><p>Avez-vous des questions ? Notre équipe est disponible pour en discuter.</p>',
    'Bonjour {{client_name}}, nous vous avons envoyé un devis il y a quelques jours.',
    'marketing',
    'Email de relance devis sans réponse'
  ),
  (
    'project_started',
    'Votre projet démarre !',
    '<h1>Bonne nouvelle {{client_name}} !</h1><p>Votre projet <strong>{{project_name}}</strong> vient de démarrer.</p><p>Vous recevrez des mises à jour régulières sur l''avancement.</p>',
    'Bonne nouvelle ! Votre projet {{project_name}} vient de démarrer.',
    'transactional',
    'Email de démarrage de projet'
  ),
  (
    'invoice_sent',
    'Facture {{invoice_number}} - Nexus Développement',
    '<h1>Facture {{invoice_number}}</h1><p>Bonjour {{client_name}},</p><p>Veuillez trouver ci-joint votre facture d''un montant de {{total_amount}}€.</p><p>Échéance : {{due_date}}</p><p><a href="{{payment_link}}">Payer en ligne</a></p>',
    'Facture {{invoice_number}} - Montant: {{total_amount}}€',
    'transactional',
    'Email d''envoi de facture'
  ),
  (
    'invoice_overdue',
    'Rappel - Facture {{invoice_number}} échue',
    '<h1>Rappel de paiement</h1><p>Bonjour {{client_name}},</p><p>La facture {{invoice_number}} d''un montant de {{total_amount}}€ est arrivée à échéance.</p><p>Merci de procéder au règlement dans les plus brefs délais.</p>',
    'Rappel: Facture {{invoice_number}} échue - {{total_amount}}€',
    'transactional',
    'Email de relance facture impayée'
  ),
  (
    'payment_received',
    'Paiement reçu - Merci !',
    '<h1>Paiement confirmé</h1><p>Bonjour {{client_name}},</p><p>Nous avons bien reçu votre paiement de {{amount}}€ pour la facture {{invoice_number}}.</p><p>Merci pour votre confiance !</p>',
    'Paiement confirmé - {{amount}}€ pour facture {{invoice_number}}',
    'transactional',
    'Email de confirmation de paiement'
  ),
  (
    'welcome',
    'Bienvenue chez Nexus Développement !',
    '<h1>Bienvenue {{client_name}} !</h1><p>Nous sommes ravis de vous compter parmi nos clients.</p><p>Notre équipe est à votre disposition pour réussir votre projet digital.</p>',
    'Bienvenue {{client_name}} ! Nous sommes ravis de vous compter parmi nos clients.',
    'marketing',
    'Email de bienvenue nouveau client'
  )
ON CONFLICT (name) DO NOTHING;

-- RLS Policies
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage payment intents"
  ON payment_intents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can view email logs"
  ON email_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can manage email templates"
  ON email_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- =====================================================
-- FIN DE LA MIGRATION INTÉGRATIONS
-- =====================================================
