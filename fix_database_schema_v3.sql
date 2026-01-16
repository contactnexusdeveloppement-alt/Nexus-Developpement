-- EMERGENCY FIX SCRIPT V3
-- Run this in Supabase SQL Editor

-- 1. Ensure the ID column has a default value generator
ALTER TABLE public.sales_partners 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Do the same for prospects just in case
ALTER TABLE public.prospects 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Double check other columns exist (from V2)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'user_id') THEN
        ALTER TABLE public.sales_partners ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'email') THEN
        ALTER TABLE public.sales_partners ADD COLUMN email TEXT DEFAULT '';
    END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'first_name') THEN
        ALTER TABLE public.sales_partners ADD COLUMN first_name TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'last_name') THEN
        ALTER TABLE public.sales_partners ADD COLUMN last_name TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'is_active') THEN
        ALTER TABLE public.sales_partners ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 4. Refresh schema cache
NOTIFY pgrst, 'reload schema';
