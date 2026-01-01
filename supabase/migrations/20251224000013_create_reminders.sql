-- =====================================================
-- PHASE 2 - MIGRATION 4: RAPPELS ET NOTIFICATIONS AVANCÉES
-- =====================================================
-- Date: 2025-12-24
-- Description: Système de rappels et notifications avancées
-- =====================================================

-- Table des rappels
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('follow_up', 'deadline', 'payment', 'meeting', 'task', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  related_to_type TEXT CHECK (related_to_type IN ('quote', 'project', 'opportunity', 'client', 'invoice')),
  related_to_id UUID,
  due_date TIMESTAMPTZ NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  recurrence TEXT CHECK (recurrence IN ('none', 'daily', 'weekly', 'monthly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(completed);
CREATE INDEX IF NOT EXISTS idx_reminders_priority ON reminders(priority);
CREATE INDEX IF NOT EXISTS idx_reminders_related ON reminders(related_to_type, related_to_id);

-- Trigger pour updated_at
CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer rappel automatique après devis
CREATE OR REPLACE FUNCTION auto_create_follow_up_reminder()
RETURNS TRIGGER AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Récupérer un admin pour assigner le rappel
  SELECT user_id INTO v_admin_id
  FROM user_roles
  WHERE role = 'admin'
  LIMIT 1;

  IF v_admin_id IS NOT NULL THEN
    -- Créer rappel de follow-up 3 jours après le devis
    INSERT INTO reminders (
      user_id,
      type,
      title,
      description,
      related_to_type,
      related_to_id,
      due_date,
      priority
    ) VALUES (
      v_admin_id,
      'follow_up',
      'Follow-up devis - ' || NEW.name,
      'Relancer le client ' || NEW.name || ' concernant le devis',
      'quote',
      NEW.id,
      NOW() + INTERVAL '3 days',
      CASE 
        WHEN NEW.budget IN ('> 50000€', '20000€ - 50000€') THEN 'high'
        ELSE 'medium'
      END
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_follow_up
  AFTER INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_follow_up_reminder();

-- Fonction pour créer rappel avant échéance facture
CREATE OR REPLACE FUNCTION auto_create_invoice_reminder()
RETURNS TRIGGER AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Récupérer un admin
  SELECT user_id INTO v_admin_id
  FROM user_roles
  WHERE role = 'admin'
  LIMIT 1;

  IF v_admin_id IS NOT NULL AND NEW.status = 'sent' THEN
    -- Créer rappel 5 jours avant échéance
    INSERT INTO reminders (
      user_id,
      type,
      title,
      description,
      related_to_type,
      related_to_id,
      due_date,
      priority
    ) VALUES (
      v_admin_id,
      'payment',
      'Échéance facture - ' || NEW.invoice_number,
      'La facture ' || NEW.invoice_number || ' arrive à échéance',
      'invoice',
      NEW.id,
      NEW.due_date - INTERVAL '5 days',
      CASE 
        WHEN NEW.total_amount > 10000 THEN 'high'
        ELSE 'medium'
      END
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_invoice_reminder
  AFTER INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_invoice_reminder();

-- Fonction pour notifier rappels dus
CREATE OR REPLACE FUNCTION notify_due_reminders()
RETURNS void AS $$
DECLARE
  reminder_rec RECORD;
BEGIN
  FOR reminder_rec IN 
    SELECT r.*, ur.user_id
    FROM reminders r
    JOIN user_roles ur ON r.user_id = ur.user_id
    WHERE r.completed = FALSE
    AND r.due_date <= NOW()
    AND (r.snoozed_until IS NULL OR r.snoozed_until <= NOW())
  LOOP
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      reminder_rec.user_id,
      'reminder_due',
      '⏰ Rappel : ' || reminder_rec.title,
      reminder_rec.description,
      '/admin?tab=reminders&id=' || reminder_rec.id
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own reminders"
  ON reminders FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin users can manage all reminders"
  ON reminders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- =====================================================
-- FIN DE LA MIGRATION RAPPELS
-- =====================================================
