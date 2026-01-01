export interface LeadScore {
    id: string;
    quote_request_id: string;
    score: number;
    quality: 'cold' | 'warm' | 'hot' | 'qualified';
    factors: {
        budget: number;
        timeline: number;
        engagement: number;
        fit: number;
    };
    budget_score: number;
    timeline_score: number;
    engagement_score: number;
    fit_score: number;
    calculated_at: string;
    updated_at: string;
}

export interface ScoringCriteria {
    id: string;
    name: string;
    category: 'budget' | 'timeline' | 'engagement' | 'fit';
    weight: number;
    conditions: Record<string, any>;
    active: boolean;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface LeadScoreBreakdown {
    total: number;
    quality: LeadScore['quality'];
    breakdown: {
        budget: { score: number; max: 30; percentage: number };
        timeline: { score: number; max: 20; percentage: number };
        engagement: { score: number; max: 25; percentage: number };
        fit: { score: number; max: 25; percentage: number };
    };
}
