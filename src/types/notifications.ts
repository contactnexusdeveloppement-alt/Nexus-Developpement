export interface Notification {
    id: string;
    user_id?: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    created_at: string;
}

export type NotificationType =
    | 'new_lead'
    | 'new_call'
    | 'quote_pending'
    | 'quote_accepted'
    | 'payment_received'
    | 'project_overdue'
    | 'invoice_overdue'
    | 'milestone_completed'
    | 'deliverable_submitted'
    | 'system';
