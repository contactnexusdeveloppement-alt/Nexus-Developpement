-- Migration to fix RLS policies for user_roles table
-- Allows admins to manage user roles

-- Allow admins to insert new user roles
CREATE POLICY IF NOT EXISTS "Admins can insert user roles"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to update user roles
CREATE POLICY IF NOT EXISTS "Admins can update user roles"
    ON public.user_roles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to delete user roles
CREATE POLICY IF NOT EXISTS "Admins can delete user roles"
    ON public.user_roles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Allow authenticated users to view their own roles
CREATE POLICY IF NOT EXISTS "Users can view own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Allow admins to view all roles
CREATE POLICY IF NOT EXISTS "Admins can view all roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
