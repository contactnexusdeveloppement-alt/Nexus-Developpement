import { Loader2 } from 'lucide-react';

export const TabLoadingFallback = () => (
    <div className="flex items-center justify-center h-96">
        <div className="space-y-4 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-400" />
            <p className="text-slate-400 text-sm">Chargement...</p>
        </div>
    </div>
);
