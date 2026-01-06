-- Add 'sales' role to the existing app_role enum
-- This migration extends the RBAC system to support sales partners

-- Add the new role value to the enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales';

-- Create an index on user_roles for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
