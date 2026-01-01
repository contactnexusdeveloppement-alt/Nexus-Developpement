-- =====================================================
-- PHASE 3 - MIGRATION 1: WORKFLOWS AUTOMATISÉS
-- =====================================================
-- Date: 2025-12-24
-- Description: Moteur de workflows pour automatisation
-- =====================================================

-- Table des workflows
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('status_change', 'time_based', 'manual', 'webhook', 'event')),
  trigger_config JSONB NOT NULL DEFAULT '{}',
  conditions JSONB DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des exécutions de workflows
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  trigger_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  actions_log JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workflows_trigger ON workflows(trigger_type);
CREATE INDEX IF NOT EXISTS idx_workflows_active ON workflows(active);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);

-- Trigger updated_at
CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour exécuter un workflow
CREATE OR REPLACE FUNCTION execute_workflow(
  p_workflow_id UUID,
  p_trigger_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_execution_id UUID;
  v_workflow RECORD;
  v_action JSONB;
  v_conditions_met BOOLEAN := TRUE;
BEGIN
  -- Récupérer le workflow
  SELECT * INTO v_workflow FROM workflows WHERE id = p_workflow_id AND active = TRUE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workflow % not found or inactive', p_workflow_id;
  END IF;

  -- Créer l'exécution
  INSERT INTO workflow_executions (workflow_id, trigger_data, status, started_at)
  VALUES (p_workflow_id, p_trigger_data, 'running', NOW())
  RETURNING id INTO v_execution_id;

  -- TODO: Vérifier les conditions
  -- Pour l'instant, on exécute toujours

  -- Marquer comme complété (les actions seront exécutées par Edge Functions)
  UPDATE workflow_executions
  SET status = 'completed', completed_at = NOW()
  WHERE id = v_execution_id;

  RETURN v_execution_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer notification depuis workflow
CREATE OR REPLACE FUNCTION workflow_action_create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Insérer workflows par défaut
INSERT INTO workflows (name, description, trigger_type, trigger_config, actions) VALUES
  (
    'Devis Accepté → Créer Projet',
    'Crée automatiquement un projet quand un devis est accepté',
    'status_change',
    '{"table": "quote_requests", "field": "status", "value": "accepted"}',
    '[
      {"type": "create_project", "config": {"from_quote": true}},
      {"type": "send_email", "config": {"template": "project_started", "to": "client"}},
      {"type": "create_notification", "config": {"type": "project_created", "title": "Nouveau projet créé"}}
    ]'
  ),
  (
    'Projet Livré → Créer Facture',
    'Crée une facture brouillon quand un projet est livré',
    'status_change',
    '{"table": "projects", "field": "status", "value": "delivered"}',
    '[
      {"type": "create_invoice", "config": {"status": "draft", "from_project": true}},
      {"type": "create_notification", "config": {"type": "invoice_draft", "title": "Facture brouillon créée"}}
    ]'
  ),
  (
    'Relance Devis 7 jours',
    'Envoie un email de relance si le devis n''a pas de réponse après 7 jours',
    'time_based',
    '{"table": "quote_requests", "field": "created_at", "delay_days": 7, "condition": {"status": "pending"}}',
    '[
      {"type": "send_email", "config": {"template": "quote_followup", "to": "client"}},
      {"type": "create_reminder", "config": {"type": "follow_up", "priority": "medium"}}
    ]'
  ),
  (
    'Relance Facture Échue',
    'Envoie un email de relance pour facture impayée',
    'time_based',
    '{"table": "invoices", "field": "due_date", "delay_days": 1, "condition": {"status": "sent"}}',
    '[
      {"type": "send_email", "config": {"template": "invoice_overdue", "to": "client"}},
      {"type": "create_task", "config": {"title": "Relancer client pour facture impayée", "priority": "high"}}
    ]'
  ),
  (
    'Onboarding Nouveau Client',
    'Série d''actions pour accueillir un nouveau client',
    'event',
    '{"event": "client_created"}',
    '[
      {"type": "send_email", "config": {"template": "welcome", "to": "client"}},
      {"type": "create_task", "config": {"title": "Appel découverte client", "due_days": 2}},
      {"type": "wait", "config": {"days": 3}},
      {"type": "send_email", "config": {"template": "onboarding_checklist", "to": "client"}}
    ]'
  )
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage workflows"
  ON workflows FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can view workflow executions"
  ON workflow_executions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- =====================================================
-- FIN DE LA MIGRATION WORKFLOWS
-- =====================================================
