export interface Document {
    id: string;
    name: string;
    type: 'contract' | 'quote' | 'invoice' | 'proposal' | 'attachment' | 'other';
    file_url: string;
    file_size?: number;
    mime_type?: string;
    related_to_type?: 'quote' | 'project' | 'opportunity' | 'client' | 'invoice';
    related_to_id?: string;
    client_email?: string;
    status: 'draft' | 'sent' | 'signed' | 'archived' | 'cancelled';
    signed_at?: string;
    signature_url?: string;
    uploaded_by?: string;
    tags: string[];
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface DocumentTemplate {
    id: string;
    name: string;
    type: 'quote' | 'invoice' | 'contract' | 'proposal' | 'email';
    content: string;
    variables: Record<string, string>;
    active: boolean;
    is_default: boolean;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Reminder {
    id: string;
    user_id: string;
    type: 'follow_up' | 'deadline' | 'payment' | 'meeting' | 'task' | 'other';
    title: string;
    description?: string;
    related_to_type?: 'quote' | 'project' | 'opportunity' | 'client' | 'invoice';
    related_to_id?: string;
    due_date: string;
    completed: boolean;
    completed_at?: string;
    snoozed_until?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
    created_at: string;
    updated_at: string;
}
