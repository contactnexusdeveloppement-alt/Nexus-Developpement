-- EMERGENCY FIX SCRIPT V2
-- Run this in your Supabase Dashboard > SQL Editor

-- 1. Ensure sales_partners has ALL required columns
DO $$ 
BEGIN 
    -- Check and add user_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'user_id') THEN
        ALTER TABLE public.sales_partners ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Check and add email
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'email') THEN
        ALTER TABLE public.sales_partners ADD COLUMN email TEXT DEFAULT '';
    END IF;

    -- Check and add first_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'first_name') THEN
        ALTER TABLE public.sales_partners ADD COLUMN first_name TEXT DEFAULT '';
    END IF;

    -- Check and add last_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'last_name') THEN
        ALTER TABLE public.sales_partners ADD COLUMN last_name TEXT DEFAULT '';
    END IF;

    -- Check and add is_active
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_partners' AND column_name = 'is_active') THEN
        ALTER TABLE public.sales_partners ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 2. Force schema cache reload (important!)
NOTIFY pgrst, 'reload schema';

-- 3. Re-apply policies just in case
DROP POLICY IF EXISTS "Users can manage own sales profile" ON public.sales_partners;
CREATE POLICY "Users can manage own sales profile" ON public.sales_partners
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Ensure prospects table exists (same as before, but safe to run again)
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

-- 5. Grant permissions (just in case)
GRANT ALL ON public.sales_partners TO postgres, authenticated, service_role;
GRANT ALL ON public.prospects TO postgres, authenticated, service_role;
