-- Add qualification_data column to quote_requests table
-- This column will store the responses from the Quote Wizard Modal in JSON format

ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS qualification_data JSONB DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN public.quote_requests.qualification_data IS 'Stores qualification wizard responses in JSON format (service type, pages, features, design, technical, budget)';
