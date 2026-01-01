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
