export interface Opportunity {
    id: string;
    quote_request_id?: string;
    client_email: string;
    client_name: string;
    name: string;
    description?: string;
    stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
    probability: number;
    amount?: number;
    expected_close_date?: string;
    actual_close_date?: string;
    lost_reason?: string;
    assigned_to?: string;
    source: 'website' | 'referral' | 'cold_call' | 'linkedin' | 'event' | 'other';
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
}

export interface SalesActivity {
    id: string;
    opportunity_id: string;
    type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'note' | 'task';
    subject: string;
    description?: string;
    completed: boolean;
    due_date?: string;
    completed_at?: string;
    created_by?: string;
    created_at: string;
}

export interface PipelineStats {
    total_opportunities: number;
    total_value: number;
    weighted_value: number;
    won_count: number;
    won_value: number;
    lost_count: number;
    avg_deal_size: number;
    conversion_rate: number;
}

export interface OpportunityWithActivities extends Opportunity {
    activities?: SalesActivity[];
    activity_count?: number;
    last_activity?: string;
}
