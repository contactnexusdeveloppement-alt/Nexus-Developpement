-- Add missing quote_number column if it doesn't exist
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS quote_number TEXT;

-- Optional: Create a generic sequence for existing quotes to avoid "BROUILLON" everywhere
-- Only applied to rows where quote_number is NULL
DO $$
DECLARE
    r RECORD;
    counter INTEGER := 1;
BEGIN
    FOR r IN SELECT id, created_at FROM public.quotes WHERE quote_number IS NULL ORDER BY created_at LOOP
        UPDATE public.quotes
        SET quote_number = 'Q-' || to_char(r.created_at, 'YYYYMMDD') || '-' || lpad(counter::text, 4, '0')
        WHERE id = r.id;
        counter := counter + 1;
    END LOOP;
END $$;
