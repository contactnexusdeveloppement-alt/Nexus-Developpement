import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

export interface UploadOptions {
    onProgress?: (progress: number) => void;
    onSuccess?: (filePath: string) => void;
    onError?: (error: Error) => void;
}

export const useSupabaseStorage = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    /**
     * Upload a file to Supabase storage
     */
    const uploadFile = async (
        file: File,
        clientEmail: string,
        category: 'quote' | 'contract' | 'invoice' | 'asset' | 'other',
        options?: UploadOptions
    ) => {
        setUploading(true);
        setProgress(0);

        try {
            // Generate unique file path
            const timestamp = Date.now();
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filePath = `${clientEmail}/${category}/${timestamp}_${sanitizedFileName}`;

            // Upload to storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('client-documents')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            setProgress(50);
            options?.onProgress?.(50);

            // Save metadata to documents table
            const { error: dbError } = await supabase.from('documents').insert({
                client_email: clientEmail,
                document_type: category,
                file_name: file.name,
                file_path: filePath,
                file_size: file.size,
                mime_type: file.type,
                uploaded_by: 'admin' // TODO: Get from auth context
            });

            if (dbError) {
                // Rollback: delete uploaded file
                await supabase.storage.from('client-documents').remove([filePath]);
                throw dbError;
            }

            setProgress(100);
            options?.onProgress?.(100);
            options?.onSuccess?.(filePath);
            toast.success(`Fichier "${file.name}" uploadÃ© avec succÃ¨s`);

            return { data: uploadData, filePath };
        } catch (error: any) {
            console.error('Upload error:', error);
            options?.onError?.(error);
            toast.error(`Erreur upload: ${error.message}`);
            throw error;
        } finally {
            setUploading(false);
        }
    };

        /**
     * Download a file from storage
     */
        const downloadFile = async (filePath: string, fileName: string) => {
        try {
            const { data, error } = await supabase.storage
                .from('client-documents')
                .download(filePath);

            if (error) throw error;

            // Force extract extension from storage path
            const ext = filePath.split('.').pop() || 'bin';
            const baseName = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
            const finalName = `${baseName}.${ext}`;

            // Use proper MIME type
            const blob = new Blob([data], { type: data.type || 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = finalName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            toast.success(`Téléchargé: ${finalName}`);
        } catch (error: any) {
            console.error('Download error:', error);
            toast.error(`Erreur: ${error.message}`);
            throw error;
        }
    };

    /**
     * Get public URL for a file (for preview)
     */
    const getFileUrl = (filePath: string) => {
        const { data } = supabase.storage
            .from('client-documents')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    /**
     * Delete a file from storage and database
     */
    const deleteFile = async (filePath: string, documentId: string) => {
        try {
            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('client-documents')
                .remove([filePath]);

            if (storageError) throw storageError;

            // Delete from database
            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .eq('id', documentId);

            if (dbError) throw dbError;

            toast.success('Fichier supprimÃ©');
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(`Erreur suppression: ${error.message}`);
            throw error;
        }
    };

    /**
     * List all documents for a client
     */
    const listDocuments = async (clientEmail: string) => {
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('client_email', clientEmail)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('List documents error:', error);
            toast.error(`Erreur chargement: ${error.message}`);
            throw error;
        }
    };

    return {
        uploadFile,
        downloadFile,
        getFileUrl,
        deleteFile,
        listDocuments,
        uploading,
        progress
    };
};

