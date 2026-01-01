import { Resend } from 'resend';

// Check for Resend API key
if (!import.meta.env.VITE_RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not set - emails will not be sent');
}

// Initialize Resend client
export const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

// Configuration
export const RESEND_CONFIG = {
    from: import.meta.env.VITE_RESEND_FROM_EMAIL || 'noreply@nexus-dev.com',
    adminEmail: import.meta.env.VITE_RESEND_ADMIN_EMAIL || 'admin@nexus-dev.com',
    enabled: !!import.meta.env.VITE_RESEND_API_KEY,
};

// Test the configuration
if (RESEND_CONFIG.enabled) {
    console.log('✅ Resend configured:', {
        from: RESEND_CONFIG.from,
        adminEmail: RESEND_CONFIG.adminEmail,
    });
} else {
    console.warn('⚠️ Resend disabled - set VITE_RESEND_API_KEY to enable email sending');
}
