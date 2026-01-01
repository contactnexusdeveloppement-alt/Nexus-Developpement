import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

interface CategoryModalProps {
    isOpen: boolean;
    files: File[];
    category: string;
    onCategoryChange: (category: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
    uploading: boolean;
    progress: number;
}

export const CategoryModal = ({
    isOpen,
    files,
    category,
    onCategoryChange,
    onConfirm,
    onCancel,
    uploading,
    progress
}: CategoryModalProps) => {
    if (!isOpen || files.length === 0) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <div
                className="bg-slate-950 border border-white/10 rounded-lg p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-white mb-4">
                    Catégoriser {files.length} fichier(s)
                </h3>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-sm text-slate-400 mb-2 block">
                            Fichiers sélectionnés:
                        </label>
                        <div className="bg-slate-900/50 rounded p-2 max-h-32 overflow-y-auto">
                            {files.map((file, idx) => (
                                <div key={idx} className="text-sm text-slate-300 truncate">
                                    • {file.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-400 mb-2 block">
                            Catégorie:
                        </label>
                        <select
                            value={category}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="quote">📄 Devis</option>
                            <option value="contract">📋 Contrat</option>
                            <option value="invoice">💰 Facture</option>
                            <option value="asset">🎨 Asset (Logo, etc.)</option>
                            <option value="other">📁 Autre</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                            Détection automatique basée sur le nom du fichier
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                        disabled={uploading}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 bg-blue-600 hover:bg-blue-500"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {progress}%
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Uploader
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
