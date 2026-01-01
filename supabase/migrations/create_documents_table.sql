-- Migration: Create documents table
-- Description: Store client documents (quotes, contracts, invoices, assets)

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_email);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at DESC);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own documents"
    ON documents FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own documents"
    ON documents FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own documents"
    ON documents FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own documents"
    ON documents FOR DELETE
    USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE documents IS 'Store client documents uploaded via the admin dashboard';
COMMENT ON COLUMN documents.document_type IS 'Type of document: quote, contract, invoice, asset, or other';
COMMENT ON COLUMN documents.file_path IS 'Path in Supabase storage bucket';
