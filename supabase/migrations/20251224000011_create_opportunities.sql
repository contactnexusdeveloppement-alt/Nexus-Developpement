-- =====================================================
-- PHASE 2 - MIGRATION 2: OPPORTUNITÉS COMMERCIALES
-- =====================================================
-- Date: 2025-12-24
-- Description: Système de gestion des opportunités et pipeline commercial
-- =====================================================

-- Table des opportunités
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID REFERENCES quote_requests(id) ON DELETE SET NULL,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  stage TEXT NOT NULL DEFAULT 'prospecting' CHECK (stage IN (
    'prospecting',    -- Prospection
    'qualification',  -- Qualification
    'proposal',       -- Proposition
    'negotiation',    -- Négociation
    'closed_won',     -- Gagné
    'closed_lost'     -- Perdu
  )),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  amount DECIMAL(10,2),
  expected_close_date DATE,
  actual_close_date DATE,
  lost_reason TEXT,
  assigned_to UUID, -- user_id du commercial assigné
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'referral', 'cold_call', 'linkedin', 'event', 'other')),
  tags TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des activités commerciales
CREATE TABLE IF NOT EXISTS sales_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'demo', 'proposal', 'note', 'task')),
  subject TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_opportunities_client ON opportunities(client_email);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_assigned ON opportunities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_opportunities_quote ON opportunities(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_close_date ON opportunities(expected_close_date);
CREATE INDEX IF NOT EXISTS idx_sales_activities_opportunity ON sales_activities(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_sales_activities_type ON sales_activities(type);
CREATE INDEX IF NOT EXISTS idx_sales_activities_completed ON sales_activities(completed);

-- Triggers pour updated_at
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour la probabilité selon le stage
CREATE OR REPLACE FUNCTION update_opportunity_probability()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour la probabilité par défaut selon le stage
  IF NEW.probability = OLD.probability OR NEW.probability IS NULL THEN
    NEW.probability := CASE NEW.stage
      WHEN 'prospecting' THEN 10
      WHEN 'qualification' THEN 25
      WHEN 'proposal' THEN 50
      WHEN 'negotiation' THEN 75
      WHEN 'closed_won' THEN 100
      WHEN 'closed_lost' THEN 0
      ELSE NEW.probability
    END;
  END IF;

  -- Mettre à jour la date de clôture si gagné ou perdu
  IF NEW.stage IN ('closed_won', 'closed_lost') AND OLD.stage NOT IN ('closed_won', 'closed_lost') THEN
    NEW.actual_close_date := CURRENT_DATE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_opportunity_probability
  BEFORE INSERT OR UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_opportunity_probability();

-- Fonction pour créer automatiquement une opportunité depuis un lead qualifié
CREATE OR REPLACE FUNCTION auto_create_opportunity_from_qualified_lead()
RETURNS TRIGGER AS $$
DECLARE
  v_quote RECORD;
  v_opportunity_exists BOOLEAN;
BEGIN
  -- Vérifier si le lead est qualifié
  IF NEW.quality = 'qualified' AND (OLD.quality IS NULL OR OLD.quality != 'qualified') THEN
    
    -- Récupérer les infos du devis
    SELECT * INTO v_quote
    FROM quote_requests
    WHERE id = NEW.quote_request_id;

    -- Vérifier si une opportunité n'existe pas déjà
    SELECT EXISTS(
      SELECT 1 FROM opportunities WHERE quote_request_id = NEW.quote_request_id
    ) INTO v_opportunity_exists;

    IF NOT v_opportunity_exists THEN
      -- Créer l'opportunité
      INSERT INTO opportunities (
        quote_request_id,
        client_email,
        client_name,
        name,
        description,
        stage,
        amount,
        source
      ) VALUES (
        NEW.quote_request_id,
        v_quote.email,
        v_quote.name,
        'Opportunité - ' || v_quote.name,
        v_quote.project_details,
        'qualification',
        CASE v_quote.budget
          WHEN '> 50000€' THEN 60000
          WHEN '20000€ - 50000€' THEN 35000
          WHEN '10000€ - 20000€' THEN 15000
          WHEN '5000€ - 10000€' THEN 7500
          ELSE 3000
        END,
        'website'
      );

      -- Notifier les admins
      PERFORM notify_all_admins(
        'new_opportunity',
        'Nouvelle opportunité créée',
        'Une opportunité a été créée automatiquement pour ' || v_quote.name,
        '/admin?tab=opportunities'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_opportunity
  AFTER INSERT OR UPDATE ON lead_scores
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_opportunity_from_qualified_lead();

-- Fonction pour alerter si opportunité stagne
CREATE OR REPLACE FUNCTION alert_stale_opportunity()
RETURNS void AS $$
DECLARE
  opp_rec RECORD;
BEGIN
  FOR opp_rec IN 
    SELECT * FROM opportunities 
    WHERE stage NOT IN ('closed_won', 'closed_lost')
    AND updated_at < NOW() - INTERVAL '7 days'
  LOOP
    PERFORM notify_all_admins(
      'opportunity_stale',
      'Opportunité inactive',
      'L''opportunité "' || opp_rec.name || '" n''a pas été mise à jour depuis 7 jours',
      '/admin?tab=opportunities&id=' || opp_rec.id
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer les statistiques du pipeline
CREATE OR REPLACE FUNCTION get_pipeline_stats()
RETURNS TABLE (
  total_opportunities INTEGER,
  total_value DECIMAL(10,2),
  weighted_value DECIMAL(10,2),
  won_count INTEGER,
  won_value DECIMAL(10,2),
  lost_count INTEGER,
  avg_deal_size DECIMAL(10,2),
  conversion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_opportunities,
    COALESCE(SUM(amount), 0) as total_value,
    COALESCE(SUM(amount * probability / 100.0), 0) as weighted_value,
    COUNT(*) FILTER (WHERE stage = 'closed_won')::INTEGER as won_count,
    COALESCE(SUM(amount) FILTER (WHERE stage = 'closed_won'), 0) as won_value,
    COUNT(*) FILTER (WHERE stage = 'closed_lost')::INTEGER as lost_count,
    COALESCE(AVG(amount) FILTER (WHERE stage = 'closed_won'), 0) as avg_deal_size,
    CASE 
      WHEN COUNT(*) FILTER (WHERE stage IN ('closed_won', 'closed_lost')) > 0 
      THEN (COUNT(*) FILTER (WHERE stage = 'closed_won')::DECIMAL / 
            COUNT(*) FILTER (WHERE stage IN ('closed_won', 'closed_lost')) * 100)
      ELSE 0
    END as conversion_rate
  FROM opportunities;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage opportunities"
  ON opportunities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can manage sales activities"
  ON sales_activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- =====================================================
-- FIN DE LA MIGRATION OPPORTUNITÉS
-- =====================================================
