import { Loader2 } from 'lucide-react';

export const ModalLoadingSkeleton = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-slate-950 border border-white/10 rounded-lg p-12">
            <div className="space-y-4 text-center">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-400" />
                <p className="text-slate-400">Chargement du modal...</p>
            </div>
        </div>
    </div>
);
