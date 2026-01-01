/**
 * Email Template Utilities
 * Helper functions for managing and processing email templates
 */

export interface EmailTemplate {
    id: string;
    name: string;
    category: 'quote_response' | 'follow_up' | 'rejection' | 'custom';
    subject: string;
    body: string;
    variables: string[];
    created_at: string;
    updated_at: string;
    created_by: string;
    is_active: boolean;
}

export interface TemplateData {
    client_name?: string;
    client_email?: string;
    project_details?: string;
    services?: string;
    budget?: string;
    company_name?: string;
    admin_name?: string;
    [key: string]: string | undefined;
}

/**
 * Replace template variables with actual data
 * Variables are in the format {{variable_name}}
 */
export const replaceVariables = (
    template: { subject: string; body: string },
    data: TemplateData
): { subject: string; body: string } => {
    let { subject, body } = template;

    // Replace each variable in both subject and body
    Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        const replacement = value || `[${key}]`; // Fallback to [key] if value is empty
        subject = subject.replace(regex, replacement);
        body = body.replace(regex, replacement);
    });

    return { subject, body };
};

/**
 * Extract all variables from a template string
 * Returns array of variable names without the {{ }}
 */
export const extractVariables = (text: string): string[] => {
    const matches = text.match(/{{(\w+)}}/g);
    if (!matches) return [];

    // Remove duplicates and extract variable names
    const variables = matches.map(m => m.slice(2, -2));
    return [...new Set(variables)];
};

/**
 * Validate that a template only uses allowed variables
 */
export const validateTemplate = (
    template: string,
    allowedVars: string[]
): { valid: boolean; errors: string[] } => {
    const vars = extractVariables(template);
    const invalid = vars.filter(v => !allowedVars.includes(v));

    return {
        valid: invalid.length === 0,
        errors: invalid.map(v => `Variable invalide: {{${v}}}`)
    };
};

/**
 * List of all allowed template variables
 */
export const ALLOWED_VARIABLES = [
    'client_name',
    'client_email',
    'project_details',
    'services',
    'budget',
    'company_name',
    'admin_name',
] as const;

/**
 * Variable descriptions for help text
 */
export const VARIABLE_DESCRIPTIONS: Record<string, string> = {
    client_name: 'Nom du client',
    client_email: 'Email du client',
    project_details: 'Description du projet',
    services: 'Services demandés (séparés par virgule)',
    budget: 'Budget estimé',
    company_name: 'Nom de votre entreprise',
    admin_name: 'Votre nom',
};

/**
 * Template category labels for UI
 */
export const CATEGORY_LABELS: Record<EmailTemplate['category'], string> = {
    quote_response: 'Réponse au devis',
    follow_up: 'Suivi / Relance',
    rejection: 'Refus poli',
    custom: 'Personnalisé',
};

/**
 * Template category colors for badges
 */
export const CATEGORY_COLORS: Record<EmailTemplate['category'], string> = {
    quote_response: 'bg-green-500/10 text-green-300 border-green-500/30',
    follow_up: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    rejection: 'bg-red-500/10 text-red-300 border-red-500/30',
    custom: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
};
