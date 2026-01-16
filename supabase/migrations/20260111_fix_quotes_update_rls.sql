-- Ensure prospect_id is nullable to allow Draft quotes without prospect
ALTER TABLE public.quotes ALTER COLUMN prospect_id DROP NOT NULL;

-- Re-create UPDATE policy to ensure it's correctly applied
DROP POLICY IF EXISTS "Sales partners can update own quotes" ON public.quotes;

CREATE POLICY "Sales partners can update own quotes"
ON public.quotes
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
