/**
 * Formatting utilities for dashboard
 */

/**
 * Format price in EUR
 */
export const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined) return 'N/A';

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
    if (!bytes) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

/**
 * Get badge color for call outcome
 */
export const getOutcomeBadgeColor = (outcome: string): string => {
    const lower = outcome.toLowerCase();

    if (lower.includes('qualifié') || lower.includes('intéressé') || lower.includes('positif')) {
        return 'bg-green-500/20 text-green-300 border-green-500/30';
    }

    if (lower.includes('rappeler') || lower.includes('suivi') || lower.includes('attente')) {
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }

    if (lower.includes('non') || lower.includes('perdu') || lower.includes('refus')) {
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }

    return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
};

/**
 * Get status badge color for projects
 */
export const getProjectStatusColor = (status: string): string => {
    switch (status) {
        case 'planning':
            return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'active':
            return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'on_hold':
            return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        case 'completed':
            return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'cancelled':
            return 'bg-red-500/20 text-red-300 border-red-500/30';
        default:
            return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
};

/**
 * Get status label in French
 */
export const getProjectStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        planning: 'Planification',
        active: 'En cours',
        on_hold: 'En attente',
        completed: 'Terminé',
        cancelled: 'Annulé'
    };
    return labels[status] || status;
};

/**
 * Get document type icon name
 */
export const getDocumentIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType === 'application/pdf') return 'FileText';
    if (mimeType.includes('word')) return 'FileText';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Table';
    return 'File';
};

/**
 * Format date in French format
 */
export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A';

    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(d);
    } catch {
        return 'Date invalide';
    }
};

/**
 * Calculate days since date
 */
export const daysSince = (date: string | Date): number => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get relative time (e.g., "il y a 2 jours")
 */
export const getRelativeTime = (date: string | Date): string => {
    const days = daysSince(date);

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
    return `Il y a ${Math.floor(days / 365)} ans`;
};
