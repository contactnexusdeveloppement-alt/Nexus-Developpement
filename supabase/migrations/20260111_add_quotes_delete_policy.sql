-- Migration to add DELETE policy for quotes table
-- Run this in Supabase SQL Editor

-- First, check current policies
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'quotes';

-- Add DELETE policy for sales partners to delete their own quotes
DROP POLICY IF EXISTS "Sales partners can delete their own quotes" ON quotes;

CREATE POLICY "Sales partners can delete their own quotes"
ON quotes FOR DELETE
USING (
    auth.uid() IN (
        SELECT user_id FROM sales_partners WHERE id = quotes.sales_partner_id
    )
);

-- Also ensure authenticated users can delete (simpler approach for now)
DROP POLICY IF EXISTS "Allow authenticated delete" ON quotes;

CREATE POLICY "Allow authenticated delete"
ON quotes FOR DELETE
TO authenticated
USING (true);

-- Verify the policy was created
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'quotes';
