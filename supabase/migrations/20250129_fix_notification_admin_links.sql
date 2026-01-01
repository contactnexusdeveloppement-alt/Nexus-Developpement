-- Migration to fix notification links from /admin to /nx-panel-8f4a
-- This migration updates all triggers that create notifications to use the correct admin path

-- Fix: Trigger for new quote requests
CREATE OR REPLACE FUNCTION notify_new_quote_request()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(
    NULL, -- broadcast to all admins
    'new_lead',
    'Nouvelle demande de devis',
    'Un nouveau client a soumis une demande de devis.',
    '/nx-panel-8f4a/dashboard?tab=clients&email=' || NEW.email || '&quoteId=' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix: Trigger for new call bookings
CREATE OR REPLACE FUNCTION notify_new_call_booking()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(
    NULL, -- broadcast to all admins
    'new_call',
    'Nouvel appel réservé',
    'Un nouveau client a réservé un créneau d''appel.',
    '/nx-panel-8f4a/dashboard?tab=clients&email=' || NEW.email || '&callId=' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix: Trigger for invoice overdue notifications
CREATE OR REPLACE FUNCTION check_overdue_invoices()
RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  SELECT 
    NULL,
    'invoice_overdue',
    'Facture impayée',
    'La facture ' || invoice_number || ' est en retard de paiement.',
    '/nx-panel-8f4a/dashboard?tab=invoices&id=' || invoice_id
  FROM invoices
  WHERE status = 'sent'
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Fix: Trigger for document upload notifications
CREATE OR REPLACE FUNCTION notify_document_upload()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(
    NULL,
    'deliverable_submitted',
    'Nouveau document uploadé',
    'Un nouveau document a été ajouté: ' || NEW.name,
    '/nx-panel-8f4a/dashboard?tab=documents&id=' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix: Trigger for opportunity status changes
CREATE OR REPLACE FUNCTION notify_opportunity_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM create_notification(
      NULL,
      'system',
      'Statut d''opportunité changé',
      'L''opportunité "' || NEW.title || '" est passée de ' || OLD.status || ' à ' || NEW.status,
      '/nx-panel-8f4a/dashboard?tab=opportunities&id=' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix: Reminder notification function
CREATE OR REPLACE FUNCTION send_reminder_notifications()
RETURNS void AS $$
DECLARE
  reminder_rec RECORD;
BEGIN
  FOR reminder_rec IN
    SELECT * FROM reminders
    WHERE due_date <= CURRENT_TIMESTAMP + INTERVAL '1 hour'
      AND due_date > CURRENT_TIMESTAMP
      AND is_completed = false
  LOOP
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      reminder_rec.user_id,
      'system',
      'Rappel: ' || reminder_rec.title,
      reminder_rec.description,
      '/nx-panel-8f4a/dashboard?tab=reminders&id=' || reminder_rec.id
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Comment
COMMENT ON FUNCTION notify_new_quote_request IS 'Fixed to use /nx-panel-8f4a instead of /admin';
COMMENT ON FUNCTION notify_new_call_booking IS 'Fixed to use /nx-panel-8f4a instead of /admin';
COMMENT ON FUNCTION check_overdue_invoices IS 'Fixed to use /nx-panel-8f4a instead of /admin';
COMMENT ON FUNCTION notify_document_upload IS 'Fixed to use /nx-panel-8f4a instead of /admin';
COMMENT ON FUNCTION notify_opportunity_status_change IS 'Fixed to use /nx-panel-8f4a instead of /admin';
COMMENT ON FUNCTION send_reminder_notifications IS 'Fixed to use /nx-panel-8f4a instead of /admin';
