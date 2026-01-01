-- Supabase Storage Bucket Setup
-- This file documents the storage bucket configuration
-- Execute these commands in Supabase Dashboard > Storage

/*
1. Create bucket 'client-documents':
   - Name: client-documents
   - Public: NO (private)
   - File size limit: 50MB
   - Allowed MIME types: 
     * application/pdf
     * image/png
     * image/jpeg
     * image/jpg
     * image/webp
     * application/vnd.openxmlformats-officedocument.wordprocessingml.document
     * application/msword
     * text/plain

2. Bucket Structure:
   client-documents/
     └── {client_email}/
         ├── quotes/
         ├── contracts/
         ├── invoices/
         └── assets/

3. Storage Policies (RLS):
*/

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-documents');

-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can read files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'client-documents');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'client-documents');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'client-documents');

/*
4. To create bucket via SQL (if not using dashboard):
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'client-documents',
    'client-documents',
    false,
    52428800, -- 50MB in bytes
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
