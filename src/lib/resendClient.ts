import { Resend } from 'resend';

// Initialize Resend client
export const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

// Configuration
export const RESEND_CONFIG = {
    from: import.meta.env.VITE_RESEND_FROM_EMAIL || 'noreply@nexus-dev.com',
    adminEmail: import.meta.env.VITE_RESEND_ADMIN_EMAIL || 'admin@nexus-dev.com',
    enabled: !!import.meta.env.VITE_RESEND_API_KEY,
};
