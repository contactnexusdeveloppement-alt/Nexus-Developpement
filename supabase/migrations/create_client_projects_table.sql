-- Migration: Create client_projects table
-- Description: Track projects linked to clients with progress and status

CREATE TABLE IF NOT EXISTS client_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_email TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_type TEXT,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE,
    end_date DATE,
    estimated_value NUMERIC(10,2),
    linked_quote_id UUID,
    linked_invoice_ids UUID[],
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (linked_quote_id) REFERENCES quote_requests(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_client_projects_client ON client_projects(client_email);
CREATE INDEX IF NOT EXISTS idx_client_projects_status ON client_projects(status);
CREATE INDEX IF NOT EXISTS idx_client_projects_dates ON client_projects(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_client_projects_quote ON client_projects(linked_quote_id);

-- Enable Row Level Security
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all projects"
    ON client_projects FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert projects"
    ON client_projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update projects"
    ON client_projects FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete projects"
    ON client_projects FOR DELETE
    USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_client_projects_updated_at
    BEFORE UPDATE ON client_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE client_projects IS 'Track projects for each client with status and progress';
COMMENT ON COLUMN client_projects.status IS 'Project status: planning, active, on_hold, completed, cancelled';
COMMENT ON COLUMN client_projects.progress IS 'Project completion percentage (0-100)';
COMMENT ON COLUMN client_projects.linked_quote_id IS 'Reference to the quote that generated this project';
COMMENT ON COLUMN client_projects.linked_invoice_ids IS 'Array of invoice IDs associated with this project';
