-- Enrich prospects table with mandatory contact details
ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS phone TEXT;
