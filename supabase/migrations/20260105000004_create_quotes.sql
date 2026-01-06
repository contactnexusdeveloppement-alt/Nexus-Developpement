-- Create quotes table for the dynamic quote generator
-- This table stores all generated quotes with pack, options, and pricing details

CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT UNIQUE NOT NULL,
    prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
    sales_partner_id UUID NOT NULL REFERENCES public.sales_partners(id) ON DELETE CASCADE,
    
    -- Quote content
    selected_pack JSONB NOT NULL, -- {name, price, description, features: []}
    selected_options JSONB DEFAULT '[]'::jsonb, -- [{name, price, description}]
    
    -- Pricing
    pack_amount DECIMAL(10,2) NOT NULL,
    options_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status and metadata
    status TEXT DEFAULT 'draft' NOT NULL,
    valid_until DATE,
    pdf_url TEXT, -- URL to generated PDF in storage
    
    -- Notes
    internal_notes TEXT,
    client_notes TEXT, -- Notes visible to client on the quote
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT quotes_status_check CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired'))
);

-- Create indexes
CREATE INDEX idx_quotes_prospect_id ON public.quotes(prospect_id);
CREATE INDEX idx_quotes_sales_partner_id ON public.quotes(sales_partner_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quotes_created_at ON public.quotes(created_at DESC);
CREATE INDEX idx_quotes_quote_number ON public.quotes(quote_number);

-- Function to generate quote number (format: Q-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  sequence_part TEXT;
  last_number INTEGER;
BEGIN
  date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get the last quote number for today
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(quote_number FROM '\d{4}$') AS INTEGER)),
    0
  ) INTO last_number
  FROM public.quotes
  WHERE quote_number LIKE 'Q-' || date_part || '-%';
  
  sequence_part := LPAD((last_number + 1)::TEXT, 4, '0');
  
  RETURN 'Q-' || date_part || '-' || sequence_part;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate quote number if not provided
CREATE OR REPLACE FUNCTION public.set_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := public.generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_quote_number
BEFORE INSERT ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.set_quote_number();

-- Enable Row Level Security
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quotes

-- Admins can view all quotes
CREATE POLICY "Admins can view all quotes" 
ON public.quotes 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can view their own quotes
CREATE POLICY "Sales partners can view own quotes" 
ON public.quotes 
FOR SELECT 
TO authenticated
USING (
  sales_partner_id IN (
    SELECT id FROM public.sales_partners WHERE user_id = auth.uid()
  )
);

-- Admins can insert quotes
CREATE POLICY "Admins can insert quotes" 
ON public.quotes 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can insert their own quotes
CREATE POLICY "Sales partners can insert own quotes" 
ON public.quotes 
FOR INSERT 
TO authenticated
WITH CHECK (
  sales_partner_id IN (
    SELECT id FROM public.sales_partners WHERE user_id = auth.uid()
  )
);

-- Admins can update all quotes
CREATE POLICY "Admins can update quotes" 
ON public.quotes 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can update their own quotes
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

-- Admins can delete quotes
CREATE POLICY "Admins can delete quotes" 
ON public.quotes 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Sales partners can delete their own draft quotes
CREATE POLICY "Sales partners can delete own draft quotes" 
ON public.quotes 
FOR DELETE 
TO authenticated
USING (
  status = 'draft' 
  AND sales_partner_id IN (
    SELECT id FROM public.sales_partners WHERE user_id = auth.uid()
  )
);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_quotes_updated_at 
BEFORE UPDATE ON public.quotes 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();
