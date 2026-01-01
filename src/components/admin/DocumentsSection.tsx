import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Upload,
    File,
    FileText,
    Image as ImageIcon,
    Download,
    Trash2,
    Eye,
    Filter,
    Loader2
} from 'lucide-react';
import { useSupabaseStorage } from '@/hooks/useSupabaseStorage';
import { formatFileSize, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { CategoryModal } from './CategoryModal';
import EmptyState from './widgets/EmptyState';

interface DocumentsSectionProps {
    clientEmail: string;
    onUploadComplete?: () => void;
}

type DocumentType = 'all' | 'quote' | 'contract' | 'invoice' | 'asset' | 'other';

interface Document {
    id: string;
    client_email: string;
    document_type: string;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    created_at: string;
}

export const DocumentsSection = ({ clientEmail, onUploadComplete }: DocumentsSectionProps) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<DocumentType>('all');
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const [uploadCategory, setUploadCategory] = useState<Exclude<DocumentType, 'all'>>('quote');
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);

    const {
        uploadFile,
        downloadFile,
        deleteFile,
        listDocuments,
        uploading,
        progress
    } = useSupabaseStorage();

    // Load documents
    useEffect(() => {
        loadDocuments();
    }, [clientEmail]);

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const docs = await listDocuments(clientEmail);
            setDocuments(docs || []);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle file drop
    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setPendingFiles(acceptedFiles);
        // Files will be uploaded when user confirms category
    };

    // Upload files with selected category
    const handleUpload = async () => {
        for (const file of pendingFiles) {
            try {
                await uploadFile(file, clientEmail, uploadCategory);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }
        await loadDocuments();
        onUploadComplete?.();
        setPendingFiles([]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 50 * 1024 * 1024 // 50MB
    });

    // Auto-detect and set category from filename
    useEffect(() => {
        if (pendingFiles.length > 0) {
            const fileName = pendingFiles[0].name.toLowerCase();
            if (fileName.includes('devis') || fileName.includes('quote')) setUploadCategory('quote');
            else if (fileName.includes('contrat') || fileName.includes('contract')) setUploadCategory('contract');
            else if (fileName.includes('facture') || fileName.includes('invoice')) setUploadCategory('invoice');
            else if (fileName.includes('logo') || fileName.includes('asset')) setUploadCategory('asset');
            else setUploadCategory('other');
        }
    }, [pendingFiles]);

    // Handle delete
    const handleDelete = async (doc: Document) => {
        if (!confirm(`Supprimer "${doc.file_name}" ?`)) return;

        try {
            await deleteFile(doc.file_path, doc.id);
            await loadDocuments();
            toast.success('Document supprimé');
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    // Handle download
    const handleDownload = async (doc: Document) => {
        try {
            await downloadFile(doc.file_path, doc.file_name);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    // Filter documents
    const filteredDocuments = documents.filter(doc =>
        filter === 'all' || doc.document_type === filter
    );

    // Get document icon
    const getIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
        if (mimeType === 'application/pdf') return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    // Get counts
    const counts = {
        all: documents.length,
        quote: documents.filter(d => d.document_type === 'quote').length,
        contract: documents.filter(d => d.document_type === 'contract').length,
        invoice: documents.filter(d => d.document_type === 'invoice').length,
        asset: documents.filter(d => d.document_type === 'asset').length,
        other: documents.filter(d => d.document_type === 'other').length
    };

    return (
        <div className="space-y-6">
            {/* Upload Zone */}
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                    ${isDragActive
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-600 hover:bg-slate-900/50'
                    }
                `}
            >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                {uploading ? (
                    <div className="space-y-2">
                        <Loader2 className="w-6 h-6 mx-auto animate-spin text-blue-400" />
                        <p className="text-sm text-slate-300">Upload en cours... {progress}%</p>
                    </div>
                ) : isDragActive ? (
                    <p className="text-slate-300">Déposez les fichiers ici...</p>
                ) : (
                    <div>
                        <p className="text-slate-300 mb-2">
                            Glissez-déposez des fichiers ici, ou cliquez pour sélectionner
                        </p>
                        <p className="text-xs text-slate-500">
                            PDF, Images, Word • Max 50MB
                        </p>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-500" />
                {(['all', 'quote', 'contract', 'invoice', 'asset', 'other'] as DocumentType[]).map(type => (
                    <Button
                        key={type}
                        size="sm"
                        variant={filter === type ? 'default' : 'outline'}
                        onClick={() => setFilter(type)}
                        className="text-xs"
                    >
                        {type === 'all' ? 'Tous' :
                            type === 'quote' ? 'Devis' :
                                type === 'contract' ? 'Contrats' :
                                    type === 'invoice' ? 'Factures' :
                                        type === 'asset' ? 'Assets' : 'Autres'}
                        {counts[type] > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {counts[type]}
                            </Badge>
                        )}
                    </Button>
                ))}
            </div>

            {/* Documents List */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-400" />
                </div>
            ) : filteredDocuments.length === 0 ? (
                <div className="py-8">
                    <EmptyState
                        icon="📄"
                        message={filter === 'all' ? 'Aucun document' : `Aucun document de type "${filter}"`}
                        description={filter === 'all'
                            ? "Uploadez des documents via la zone ci-dessus"
                            : "Essayez de modifier le filtre"}
                    />
                </div>
            ) : (
                <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                        {filteredDocuments.map(doc => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="text-slate-400">
                                        {getIcon(doc.mime_type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {doc.file_name}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{formatFileSize(doc.file_size)}</span>
                                            <span>•</span>
                                            <span>{formatDate(doc.created_at)}</span>
                                            <Badge variant="outline" className="ml-2 text-xs">
                                                {doc.document_type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setPreviewDoc(doc)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDownload(doc)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(doc)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {/* Preview Modal - Simple version for now */}
            {previewDoc && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setPreviewDoc(null)}
                >
                    <div className="bg-slate-950 border border-white/10 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">{previewDoc.file_name}</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewDoc(null)}
                            >
                                Fermer
                            </Button>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Preview non disponible pour ce type de fichier. Utilisez le bouton télécharger.
                        </p>
                    </div>
                </div>
            )}

            {/* Category Selection Modal */}
            <CategoryModal
                isOpen={pendingFiles.length > 0}
                files={pendingFiles}
                category={uploadCategory}
                onCategoryChange={(cat) => setUploadCategory(cat as Exclude<DocumentType, 'all'>)}
                onConfirm={handleUpload}
                onCancel={() => setPendingFiles([])}
                uploading={uploading}
                progress={progress}
            />
        </div>
    );
};

