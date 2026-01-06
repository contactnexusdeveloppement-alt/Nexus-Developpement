-- Create sales_partners table to store sales team member information
-- This table extends the auth.users with business-specific data for sales partners

CREATE TABLE IF NOT EXISTS public.sales_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.00, -- Percentage (e.g., 10.00 for 10%)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Create index for faster lookups
CREATE INDEX idx_sales_partners_user_id ON public.sales_partners(user_id);
CREATE INDEX idx_sales_partners_email ON public.sales_partners(email);
CREATE INDEX idx_sales_partners_active ON public.sales_partners(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.sales_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales_partners

-- Admins can view all sales partners
CREATE POLICY "Admins can view all sales partners" 
ON public.sales_partners 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can view their own profile
CREATE POLICY "Sales partners can view own profile" 
ON public.sales_partners 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Admins can insert new sales partners
CREATE POLICY "Admins can insert sales partners" 
ON public.sales_partners 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can update sales partners
CREATE POLICY "Admins can update sales partners" 
ON public.sales_partners 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can update their own profile (limited fields)
CREATE POLICY "Sales partners can update own profile" 
ON public.sales_partners 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can delete sales partners
CREATE POLICY "Admins can delete sales partners" 
ON public.sales_partners 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Trigger to auto-update updated_at
CREATE TRIGGER update_sales_partners_updated_at 
BEFORE UPDATE ON public.sales_partners 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();
