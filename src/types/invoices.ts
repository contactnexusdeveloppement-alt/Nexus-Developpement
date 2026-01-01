export interface Invoice {
    id: string;
    project_id?: string;
    invoice_number: string;
    client_email: string;
    client_name: string;
    client_address?: string;
    issue_date: string;
    due_date: string;
    amount: number;
    tax_rate: number;
    tax_amount?: number;
    total_amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    payment_method?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
    order_index: number;
}

export interface Payment {
    id: string;
    invoice_id: string;
    amount: number;
    payment_date: string;
    payment_method: 'bank_transfer' | 'card' | 'check' | 'cash' | 'stripe' | 'paypal' | 'other';
    reference?: string;
    notes?: string;
    created_at: string;
}

export interface InvoiceWithDetails extends Invoice {
    items?: InvoiceItem[];
    payments?: Payment[];
    total_paid?: number;
    balance_due?: number;
}
