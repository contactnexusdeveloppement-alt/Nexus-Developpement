import { resend, RESEND_CONFIG } from './resendClient';
import { supabase } from '@/integrations/supabase/client';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    text?: string;
    type: string;
    recipientName?: string;
    templateUsed?: string;
    metadata?: Record<string, any>;
    relatedQuoteId?: string;
    relatedCallId?: string;
}

interface SendEmailResult {
    success: boolean;
    data?: any;
    error?: string;
}

/**
 * Send an email via Resend and log it to database
 */
export const sendEmail = async (params: SendEmailParams): Promise<SendEmailResult> => {
    // If Resend is not configured, just log and return
    if (!RESEND_CONFIG.enabled) {
        console.warn('📧 Email would be sent (Resend disabled):', {
            to: params.to,
            subject: params.subject,
            type: params.type,
        });

        // Still log to database
        await logEmail({ ...params, status: 'skipped', error_message: 'Resend not configured' });

        return {
            success: false,
            error: 'Resend not configured',
        };
    }

    try {
        // Send via Resend
        const { data, error } = await resend.emails.send({
            from: RESEND_CONFIG.from,
            to: params.to,
            subject: params.subject,
            html: params.html,
            text: params.text || stripHtml(params.html),
        });

        if (error) throw error;

        console.log('✅ Email sent successfully:', {
            to: params.to,
            subject: params.subject,
            resendId: data?.id,
        });

        // Log success to database
        await logEmail({
            ...params,
            resendId: data?.id,
            status: 'sent',
        });

        return { success: true, data };
    } catch (error: any) {
        console.error('❌ Email send failed:', error);

        // Log failure to database
        await logEmail({
            ...params,
            status: 'failed',
            error_message: error.message || String(error),
        });

        return { success: false, error: error.message || String(error) };
    }
};

/**
 * Log email to database
 */
const logEmail = async (params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    type: string;
    recipientName?: string;
    templateUsed?: string;
    metadata?: Record<string, any>;
    relatedQuoteId?: string;
    relatedCallId?: string;
    resendId?: string;
    status: string;
    error_message?: string;
}) => {
    try {
        await supabase.from('email_logs').insert({
            type: params.type,
            recipient_email: params.to,
            recipient_name: params.recipientName,
            subject: params.subject,
            body_html: params.html,
            body_text: params.text,
            template_used: params.templateUsed,
            resend_id: params.resendId,
            status: params.status,
            error_message: params.error_message,
            related_quote_id: params.relatedQuoteId,
            related_call_id: params.relatedCallId,
            metadata: params.metadata,
        });
    } catch (error) {
        console.error('Failed to log email:', error);
    }
};

/**
 * Strip HTML tags for text version
 */
const stripHtml = (html: string): string => {
    return html
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};
