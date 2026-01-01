import { Skeleton } from '@/components/ui/skeleton';

export const DocumentCardSkeleton = () => (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
        <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-5 h-5 rounded" />
            <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
        <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
        </div>
    </div>
);

export const ProjectCardSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-12 w-24" />
        </div>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-2 w-full mb-4" />
        <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
        </div>
    </div>
);

export const QuoteCardSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex gap-4 mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
        </div>
    </div>
);

export const CallCardSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <div className="flex justify-between mb-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-24" />
        </div>
    </div>
);

export const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-300">Chargement...</p>
        </div>
    </div>
);
