-- Update quote number format to YYYY-MM-DD-XXXX (e.g., 2026-01-12-0001)

-- Drop the old function and recreate with new format
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  sequence_part TEXT;
  last_number INTEGER;
BEGIN
  -- Format: YYYY-MM-DD (e.g., 2026-01-12)
  date_part := TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD');
  
  -- Get the last quote number for today
  -- Handle both old format (Q-YYYYMMDD-XXXX) and new format (YYYY-MM-DD-XXXX)
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(quote_number FROM '\d{4}$') AS INTEGER)),
    0
  ) INTO last_number
  FROM public.quotes
  WHERE quote_number LIKE date_part || '-%';
  
  sequence_part := LPAD((last_number + 1)::TEXT, 4, '0');
  
  RETURN date_part || '-' || sequence_part;
END;
$$ LANGUAGE plpgsql;

-- The trigger already exists and will use the updated function
COMMENT ON FUNCTION public.generate_quote_number() IS 'Generates quote number in format YYYY-MM-DD-XXXX';
