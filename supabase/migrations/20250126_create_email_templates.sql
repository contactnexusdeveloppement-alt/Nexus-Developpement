-- Migration: Create email response templates system
-- Created: 2025-01-26

-- Create email_response_templates table
CREATE TABLE IF NOT EXISTS email_response_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT valid_category CHECK (category IN ('quote_response', 'follow_up', 'rejection', 'custom'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_response_templates_category ON email_response_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_response_templates_active ON email_response_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_response_templates_created_by ON email_response_templates(created_by);

-- Enable Row Level Security
ALTER TABLE email_response_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only authenticated users can access templates
CREATE POLICY "Authenticated users can view templates"
    ON email_response_templates FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create templates"
    ON email_response_templates FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can update their own templates"
    ON email_response_templates FOR UPDATE
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates"
    ON email_response_templates FOR DELETE
    USING (created_by = auth.uid());

-- Insert default templates
INSERT INTO email_response_templates (name, category, subject, body, variables) VALUES
(
    'Réponse Positive - Devis',
    'quote_response',
    'Re: Demande de devis - {{client_name}}',
    E'Bonjour {{client_name}},\n\nMerci pour votre intérêt concernant {{services}}.\n\nNous avons bien reçu votre demande et sommes ravis de pouvoir vous accompagner sur votre projet : {{project_details}}.\n\nVotre budget estimé de {{budget}} nous permet d''envisager une solution sur-mesure adaptée à vos besoins.\n\nJe vous propose un appel de 30 minutes pour discuter des détails et vous présenter notre approche.\n\nQuand seriez-vous disponible cette semaine ?\n\nCordialement,\nL''équipe {{company_name}}',
    '["client_name", "services", "project_details", "budget", "company_name"]'::jsonb
),
(
    'Demande d''Informations',
    'follow_up',
    'Besoin de précisions - {{client_name}}',
    E'Bonjour {{client_name}},\n\nMerci pour votre demande concernant {{services}}.\n\nPour vous préparer un devis précis, j''aurais besoin de quelques informations complémentaires :\n\n- Quel est le délai souhaité pour la livraison ?\n- Avez-vous des exemples de sites/applications qui vous inspirent ?\n- Y a-t-il des fonctionnalités spécifiques essentielles pour vous ?\n\nJe reste à votre disposition pour échanger.\n\nCordialement,\n{{company_name}}',
    '["client_name", "services", "company_name"]'::jsonb
),
(
    'Refus Poli - Budget',
    'rejection',
    'Re: Demande de devis - {{client_name}}',
    E'Bonjour {{client_name}},\n\nMerci pour votre intérêt pour nos services.\n\nAprès analyse de votre projet ({{project_details}}), le budget indiqué ({{budget}}) ne nous permettrait malheureusement pas de vous offrir la qualité que nous visons.\n\nNous vous recommandons de considérer des alternatives comme des solutions no-code (Webflow, Framer) ou des plateformes open-source qui pourraient mieux correspondre à votre budget.\n\nNous restons ouverts à échanger si votre budget évolue à l''avenir.\n\nBonne continuation dans votre projet,\n{{company_name}}',
    '["client_name", "project_details", "budget", "company_name"]'::jsonb
);

-- Add a trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_response_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_response_templates_updated_at_trigger
    BEFORE UPDATE ON email_response_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_email_response_templates_updated_at();
