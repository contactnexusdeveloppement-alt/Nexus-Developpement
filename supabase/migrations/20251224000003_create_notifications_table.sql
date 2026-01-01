-- Migration: Create Notifications Table
-- Description: Table for managing in-app notifications
-- Date: 2025-12-24

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  type TEXT NOT NULL,
  -- Types: new_lead, quote_pending, quote_accepted, payment_received, 
  --        project_overdue, invoice_overdue, milestone_completed, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  -- Lien vers l'élément concerné (ex: /admin?tab=projects&id=xxx)
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Admin users can manage all notifications
CREATE POLICY "Admin users can manage all notifications"
  ON notifications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Fonction pour créer une notification pour tous les admins
CREATE OR REPLACE FUNCTION notify_all_admins(
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  SELECT user_id, p_type, p_title, p_message, p_link
  FROM user_roles
  WHERE role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les anciennes notifications (> 30 jours et lues)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE read = TRUE
  AND created_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour notifier les admins lors d'un nouveau devis
CREATE OR REPLACE FUNCTION notify_new_quote()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_all_admins(
    'new_lead',
    'Nouvelle demande de devis',
    'Une nouvelle demande de devis a été reçue de ' || NEW.name,
    '/admin?tab=clients&email=' || NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_quote
  AFTER INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_quote();

-- Trigger pour notifier les admins lors d'un nouvel appel réservé
CREATE OR REPLACE FUNCTION notify_new_call()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_all_admins(
    'new_call',
    'Nouvel appel réservé',
    'Un nouvel appel a été réservé avec ' || NEW.name || ' le ' || TO_CHAR(NEW.booking_date, 'DD/MM/YYYY') || ' à ' || NEW.time_slot,
    '/admin?tab=clients&email=' || NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_call
  AFTER INSERT ON call_bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_call();

-- Trigger pour notifier lors d'un paiement reçu
CREATE OR REPLACE FUNCTION notify_payment_received()
RETURNS TRIGGER AS $$
DECLARE
  invoice_number TEXT;
  client_name TEXT;
BEGIN
  SELECT i.invoice_number, i.client_name INTO invoice_number, client_name
  FROM invoices i
  WHERE i.id = NEW.invoice_id;
  
  PERFORM notify_all_admins(
    'payment_received',
    'Paiement reçu',
    'Paiement de ' || NEW.amount || '€ reçu pour la facture ' || invoice_number || ' (' || client_name || ')',
    '/admin?tab=invoices&id=' || NEW.invoice_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_payment
  AFTER INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_received();

-- Comments pour documentation
COMMENT ON TABLE notifications IS 'Notifications in-app pour les utilisateurs';
COMMENT ON FUNCTION notify_all_admins IS 'Crée une notification pour tous les utilisateurs admin';
COMMENT ON FUNCTION cleanup_old_notifications IS 'Supprime les notifications lues de plus de 30 jours';
