-- Enable DELETE for authenticated users on prospects table
-- This allows sales partners to delete prospects

CREATE POLICY "Enable delete for authenticated users" ON "public"."prospects"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);
