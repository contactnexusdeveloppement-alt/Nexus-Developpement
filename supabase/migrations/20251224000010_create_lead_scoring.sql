-- =====================================================
-- PHASE 2 - MIGRATION 1: LEAD SCORING
-- =====================================================
-- Date: 2025-12-24
-- Description: Système de scoring et qualification des leads
-- =====================================================

-- Table pour le scoring des leads
CREATE TABLE IF NOT EXISTS lead_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID UNIQUE REFERENCES quote_requests(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  quality TEXT DEFAULT 'cold' CHECK (quality IN ('cold', 'warm', 'hot', 'qualified')),
  factors JSONB DEFAULT '{}', -- Détails des facteurs de scoring
  budget_score INTEGER DEFAULT 0,
  timeline_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  fit_score INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les critères de scoring (configuration)
CREATE TABLE IF NOT EXISTS scoring_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('budget', 'timeline', 'engagement', 'fit')),
  weight INTEGER DEFAULT 10 CHECK (weight >= 0 AND weight <= 100),
  conditions JSONB NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_lead_scores_quote ON lead_scores(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_quality ON lead_scores(quality);
CREATE INDEX IF NOT EXISTS idx_lead_scores_score ON lead_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scoring_criteria_category ON scoring_criteria(category);
CREATE INDEX IF NOT EXISTS idx_scoring_criteria_active ON scoring_criteria(active);

-- Trigger pour updated_at
CREATE TRIGGER update_lead_scores_updated_at
  BEFORE UPDATE ON lead_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scoring_criteria_updated_at
  BEFORE UPDATE ON scoring_criteria
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer le score d'un lead
CREATE OR REPLACE FUNCTION calculate_lead_score(p_quote_request_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_budget_score INTEGER := 0;
  v_timeline_score INTEGER := 0;
  v_engagement_score INTEGER := 0;
  v_fit_score INTEGER := 0;
  v_budget TEXT;
  v_timeline TEXT;
  v_services TEXT[];
  v_call_count INTEGER;
  v_quality TEXT;
BEGIN
  -- Récupérer les données du devis
  SELECT budget, timeline, services INTO v_budget, v_timeline, v_services
  FROM quote_requests
  WHERE id = p_quote_request_id;

  -- Score Budget (0-30 points)
  v_budget_score := CASE v_budget
    WHEN '> 50000€' THEN 30
    WHEN '20000€ - 50000€' THEN 25
    WHEN '10000€ - 20000€' THEN 20
    WHEN '5000€ - 10000€' THEN 15
    WHEN '< 5000€' THEN 10
    ELSE 0
  END;

  -- Score Timeline (0-20 points)
  v_timeline_score := CASE v_timeline
    WHEN 'Urgent (< 1 mois)' THEN 20
    WHEN '1-3 mois' THEN 18
    WHEN '3-6 mois' THEN 15
    WHEN '> 6 mois' THEN 10
    ELSE 5
  END;

  -- Score Engagement (0-25 points)
  -- Compter le nombre d'appels réservés
  SELECT COUNT(*) INTO v_call_count
  FROM call_bookings cb
  JOIN quote_requests qr ON cb.email = qr.email
  WHERE qr.id = p_quote_request_id;

  v_engagement_score := LEAST(v_call_count * 10, 25);

  -- Score Fit Produit (0-25 points)
  -- Plus de services = meilleur fit
  v_fit_score := LEAST(array_length(v_services, 1) * 5, 25);

  -- Score total
  v_score := v_budget_score + v_timeline_score + v_engagement_score + v_fit_score;

  -- Déterminer la qualité
  v_quality := CASE
    WHEN v_score >= 75 THEN 'qualified'
    WHEN v_score >= 60 THEN 'hot'
    WHEN v_score >= 40 THEN 'warm'
    ELSE 'cold'
  END;

  -- Insérer ou mettre à jour le score
  INSERT INTO lead_scores (
    quote_request_id, 
    score, 
    quality, 
    budget_score, 
    timeline_score, 
    engagement_score, 
    fit_score,
    factors
  )
  VALUES (
    p_quote_request_id,
    v_score,
    v_quality,
    v_budget_score,
    v_timeline_score,
    v_engagement_score,
    v_fit_score,
    jsonb_build_object(
      'budget', v_budget_score,
      'timeline', v_timeline_score,
      'engagement', v_engagement_score,
      'fit', v_fit_score
    )
  )
  ON CONFLICT (quote_request_id) DO UPDATE SET
    score = EXCLUDED.score,
    quality = EXCLUDED.quality,
    budget_score = EXCLUDED.budget_score,
    timeline_score = EXCLUDED.timeline_score,
    engagement_score = EXCLUDED.engagement_score,
    fit_score = EXCLUDED.fit_score,
    factors = EXCLUDED.factors,
    calculated_at = NOW(),
    updated_at = NOW();

  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour calculer automatiquement le score à la création d'un devis
CREATE OR REPLACE FUNCTION auto_calculate_lead_score()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_lead_score(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_calculate_lead_score
  AFTER INSERT OR UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_lead_score();

-- Trigger pour recalculer le score quand un appel est réservé
CREATE OR REPLACE FUNCTION recalculate_lead_score_on_call()
RETURNS TRIGGER AS $$
DECLARE
  v_quote_id UUID;
BEGIN
  -- Trouver le devis associé à cet email
  SELECT id INTO v_quote_id
  FROM quote_requests
  WHERE email = NEW.email
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_quote_id IS NOT NULL THEN
    PERFORM calculate_lead_score(v_quote_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recalculate_on_call
  AFTER INSERT ON call_bookings
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_lead_score_on_call();

-- Insérer des critères de scoring par défaut
INSERT INTO scoring_criteria (name, category, weight, conditions, description) VALUES
  ('Budget élevé', 'budget', 30, '{"min_budget": 50000}', 'Budget supérieur à 50k€'),
  ('Budget moyen', 'budget', 20, '{"min_budget": 10000, "max_budget": 50000}', 'Budget entre 10k€ et 50k€'),
  ('Timeline urgent', 'timeline', 20, '{"timeline": "Urgent (< 1 mois)"}', 'Besoin urgent'),
  ('Appel réservé', 'engagement', 10, '{"has_call": true}', 'A réservé un appel'),
  ('Services multiples', 'fit', 15, '{"min_services": 2}', 'Demande plusieurs services')
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_criteria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage lead scores"
  ON lead_scores FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can manage scoring criteria"
  ON scoring_criteria FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Calculer le score pour tous les devis existants
DO $$
DECLARE
  quote_rec RECORD;
BEGIN
  FOR quote_rec IN SELECT id FROM quote_requests LOOP
    PERFORM calculate_lead_score(quote_rec.id);
  END LOOP;
END $$;

-- =====================================================
-- FIN DE LA MIGRATION LEAD SCORING
-- =====================================================
