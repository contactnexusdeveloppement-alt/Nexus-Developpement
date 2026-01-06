-- Link prospects to sales_partners for proper data isolation
-- This migration adds the sales_partner_id foreign key and updates RLS policies

-- Add sales_partner_id column to prospects table
ALTER TABLE public.prospects 
ADD COLUMN IF NOT EXISTS sales_partner_id UUID REFERENCES public.sales_partners(id) ON DELETE SET NULL;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_prospects_sales_partner_id ON public.prospects(sales_partner_id);

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.prospects;

-- Create new RLS policies for prospects

-- Admins can view all prospects
CREATE POLICY "Admins can view all prospects" 
ON public.prospects 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can view only their own prospects
CREATE POLICY "Sales partners can view own prospects" 
ON public.prospects 
FOR SELECT 
TO authenticated
USING (
  sales_partner_id IN (
    SELECT id FROM public.sales_partners WHERE user_id = auth.uid()
  )
);

-- Admins can insert prospects
CREATE POLICY "Admins can insert prospects" 
ON public.prospects 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can insert their own prospects
CREATE POLICY "Sales partners can insert own prospects" 
ON public.prospects 
FOR INSERT 
TO authenticated
WITH CHECK (
  sales_partner_id IN (
    SELECT id FROM public.sales_partners WHERE user_id = auth.uid()
  )
);

-- Admins can update all prospects
CREATE POLICY "Admins can update prospects" 
ON public.prospects 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can update only their own prospects
CREATE POLICY "Sales partners can update own prospects" 
ON public.prospects 
FOR UPDATE 
TO authenticated
USING (
  sales_partner_id IN (
    SELECT id FROM public.sales_partners WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  sales_partner_id IN (
    SELECT id FROM public.sales_partners WHERE user_id = auth.uid()
  )
);

-- Admins can delete prospects
CREATE POLICY "Admins can delete prospects" 
ON public.prospects 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can delete their own prospects
CREATE POLICY "Sales partners can delete own prospects" 
ON public.prospects 
FOR DELETE 
TO authenticated
USING (
  sales_partner_id IN (
    SELECT id FROM public.sales_partners WHERE user_id = auth.uid()
  )
);
