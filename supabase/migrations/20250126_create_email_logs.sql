-- Migration: Create email logs table for tracking sent emails
-- Created: 2025-01-26

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  body_html TEXT,
  body_text TEXT,
  template_used VARCHAR(100),
  related_quote_id UUID REFERENCES quotes(id),
  related_call_id UUID REFERENCES call_bookings(id),
  resend_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_quote ON email_logs(related_quote_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_call ON email_logs(related_call_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- Enable Row Level Security
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only authenticated users can view logs
CREATE POLICY "Authenticated users can view email logs"
    ON email_logs FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert email logs"
    ON email_logs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
