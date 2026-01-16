-- EMERGENCY FIX SCRIPT V4 - Drop bad FK constraint
-- The sales_partners.id column is incorrectly constrained to auth.users
-- This is WRONG. Only user_id should reference auth.users, not id.

-- 1. Drop the bad constraint
ALTER TABLE public.sales_partners DROP CONSTRAINT IF EXISTS sales_partners_id_fkey;

-- 2. Ensure id has correct default
ALTER TABLE public.sales_partners ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Ensure user_id references auth.users correctly (this is the CORRECT FK)
-- First drop if exists to avoid conflict
ALTER TABLE public.sales_partners DROP CONSTRAINT IF EXISTS sales_partners_user_id_fkey;
ALTER TABLE public.sales_partners 
ADD CONSTRAINT sales_partners_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Refresh cache
NOTIFY pgrst, 'reload schema';
