-- Migration: Fix foreign key constraints on email_logs to allow cascading deletes
-- Created: 2026-01-01
-- This migration adds ON DELETE CASCADE to foreign keys so deleting quotes/calls
-- will automatically delete associated email logs

-- First, we need to drop the existing constraints
ALTER TABLE email_logs 
  DROP CONSTRAINT IF EXISTS email_logs_related_quote_id_fkey;

ALTER TABLE email_logs 
  DROP CONSTRAINT IF EXISTS email_logs_related_call_id_fkey;

-- Now recreate them with ON DELETE CASCADE
ALTER TABLE email_logs
  ADD CONSTRAINT email_logs_related_quote_id_fkey
  FOREIGN KEY (related_quote_id)
  REFERENCES quote_requests(id)
  ON DELETE CASCADE;

ALTER TABLE email_logs
  ADD CONSTRAINT email_logs_related_call_id_fkey
  FOREIGN KEY (related_call_id)
  REFERENCES call_bookings(id)
  ON DELETE CASCADE;
