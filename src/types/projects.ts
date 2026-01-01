export interface Project {
    id: string;
    client_email: string;
    quote_id?: string;
    name: string;
    description?: string;
    status: 'planned' | 'in_progress' | 'review' | 'delivered' | 'closed';
    start_date?: string;
    expected_end_date?: string;
    actual_end_date?: string;
    budget?: number;
    spent?: number;
    created_at: string;
    updated_at: string;
}

export interface ProjectMilestone {
    id: string;
    project_id: string;
    name: string;
    description?: string;
    due_date?: string;
    completed_at?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    order_index: number;
    created_at: string;
}

export interface ProjectDeliverable {
    id: string;
    project_id: string;
    milestone_id?: string;
    name: string;
    description?: string;
    file_url?: string;
    status: 'pending' | 'in_review' | 'approved' | 'rejected';
    delivered_at?: string;
    approved_at?: string;
    created_at: string;
}

export interface ProjectWithDetails extends Project {
    milestones?: ProjectMilestone[];
    deliverables?: ProjectDeliverable[];
}
