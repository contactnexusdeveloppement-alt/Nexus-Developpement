-- Consolidated migration: Execute all Phase 1 database changes
-- Run this entire file in Supabase SQL Editor

-- ============================================
-- 1. CREATE DOCUMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_email TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('quote', 'contract', 'invoice', 'asset', 'other')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_email);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at DESC);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents" ON documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert documents" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update documents" ON documents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete documents" ON documents FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 2. CREATE CLIENT_PROJECTS TABLE
-- ============================================

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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_projects_client ON client_projects(client_email);
CREATE INDEX IF NOT EXISTS idx_client_projects_status ON client_projects(status);
CREATE INDEX IF NOT EXISTS idx_client_projects_dates ON client_projects(start_date, end_date);

ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects" ON client_projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert projects" ON client_projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update projects" ON client_projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete projects" ON client_projects FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 3. SHARED TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_client_projects_updated_at
    BEFORE UPDATE ON client_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. STORAGE BUCKET SETUP
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'client-documents',
    'client-documents',
    false,
    52428800, -- 50MB
    ARRAY[
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'client-documents');

CREATE POLICY "Authenticated users can read" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'client-documents');

CREATE POLICY "Authenticated users can delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'client-documents');

CREATE POLICY "Authenticated users can update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'client-documents');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ All Phase 1 migrations executed successfully!';
    RAISE NOTICE '✅ Tables created: documents, client_projects';
    RAISE NOTICE '✅ Storage bucket created: client-documents';
    RAISE NOTICE '✅ RLS policies configured';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '1. Regenerate TypeScript types: npx supabase gen types typescript...';
    RAISE NOTICE '2. Test document upload in UI';
    RAISE NOTICE '';
END $$;
