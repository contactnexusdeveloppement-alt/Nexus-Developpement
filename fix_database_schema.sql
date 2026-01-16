-- EMERGENCY FIX SCRIPT
-- Run this in your Supabase Dashboard > SQL Editor

-- 1. Fix sales_partners table (add missing user_id)
CREATE TABLE IF NOT EXISTS public.sales_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add user_id if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'user_id') THEN
        ALTER TABLE public.sales_partners ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Create Prospects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    phone TEXT,
    business_type TEXT,
    status TEXT DEFAULT 'new',
    sales_partner_id UUID REFERENCES public.sales_partners(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.sales_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

-- 4. Create basic policies to allow access (Fixes 404/400 errors)
-- Note: In production you'd want stricter policies, but this gets you unblocked.

-- Allow users to read/insert their own sales_partner profile
DROP POLICY IF EXISTS "Users can manage own sales profile" ON public.sales_partners;
CREATE POLICY "Users can manage own sales profile" ON public.sales_partners
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow admins full access (optional, if you have admin role)
-- CREATE POLICY "Admins full access" ON public.sales_partners ...

-- Prospects policies
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.prospects;
CREATE POLICY "Users see linked prospects" ON public.prospects
    FOR ALL
    USING (sales_partner_id IN (SELECT id FROM public.sales_partners WHERE user_id = auth.uid()))
    WITH CHECK (sales_partner_id IN (SELECT id FROM public.sales_partners WHERE user_id = auth.uid()));

-- Allow inserting prospects even if no partner linked (for admin usage or manual fixes)
CREATE POLICY "Allow basic insert" ON public.prospects
    FOR INSERT
    WITH CHECK (true);
