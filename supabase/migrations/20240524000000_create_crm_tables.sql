-- Create PROSPECTS table
CREATE TABLE IF NOT EXISTS public.prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    company_name TEXT,
    role TEXT,
    source TEXT CHECK (source IN ('website_call', 'website_quote', 'referral', 'outbound', 'unknown')),
    status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost')) DEFAULT 'new',
    lead_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create QUALIFICATION_DATA table
CREATE TABLE IF NOT EXISTS public.qualification_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
    business_activity TEXT,
    current_challenges TEXT[], -- Array of strings
    goals TEXT,
    budget_range TEXT CHECK (budget_range IN ('<2k', '2k-5k', '5k-10k', '10k+', 'unknown')),
    timeline TEXT CHECK (timeline IN ('urgent', '1-3_months', '3-6_months', 'long_term', 'unknown')),
    decision_maker BOOLEAN DEFAULT FALSE,
    tech_stack TEXT,
    competitors TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(prospect_id)
);

-- Create INTERACTIONS table
CREATE TABLE IF NOT EXISTS public.interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('discovery_call', 'follow_up', 'email', 'strategy_session', 'other')),
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    summary TEXT,
    next_step TEXT,
    recording_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Create policies (simplified for now: allow authenticated users full access)
-- Ideally you restrict this to admin users only
CREATE POLICY "Enable all for authenticated users" ON public.prospects FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON public.qualification_data FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON public.interactions FOR ALL TO authenticated USING (true);
