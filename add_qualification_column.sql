-- Migration: Add qualification_data column to quote_requests
-- This migration should be run via Supabase Dashboard or CLI

ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS qualification_data JSONB DEFAULT NULL;

COMMENT ON COLUMN public.quote_requests.qualification_data IS 'Stores qualification wizard responses in JSON format (service type, pages, features, design, technical, budget)';

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
