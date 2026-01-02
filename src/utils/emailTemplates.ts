/**
 * Email Templates for Client Communication
 * Phase 1: Structure and placeholders
 * Phase 2: Real email integration with Resend/SendGrid
 */

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    category: 'quote' | 'follow-up' | 'appointment' | 'general';
}

export const emailTemplates: EmailTemplate[] = [
    {
        id: 'quote-follow-up',
        name: 'Relance Devis',
        subject: 'Votre devis Nexus Développement',
        category: 'quote',
        body: `Bonjour {{client_name}},

Nous revenons vers vous concernant votre demande de devis pour {{service_type}}.

Nous serions ravis d'échanger avec vous pour affiner votre projet et vous proposer une solution sur mesure.

Êtes-vous disponible pour un appel cette semaine ?

Cordialement,
L'équipe Nexus Développement`
    },
    {
        id: 'appointment-confirmation',
        name: 'Confirmation Rendez-vous',
        subject: 'Confirmation de votre rendez-vous',
        category: 'appointment',
        body: `Bonjour {{client_name}},

Nous confirmons votre rendez-vous pour le {{date}} à {{time}}.

Nous discuterons de votre projet {{service_type}} et répondrons à toutes vos questions.

À très bientôt !

Cordialement,
L'équipe Nexus Développement`
    },
    {
        id: 'qualified-quote-next-steps',
        name: 'Prochaines Étapes (Devis Qualifié)',
        subject: 'Suite à notre échange - Prochaines étapes',
        category: 'quote',
        body: `Bonjour {{client_name}},

Merci pour notre échange concernant votre projet {{service_type}}.

Comme discuté, voici les prochaines étapes :
1. Validation du cahier des charges
2. Signature du devis
3. Lancement du projet

N'hésitez pas si vous avez des questions.

Cordialement,
L'équipe Nexus Développement`
    },
    {
        id: 'project-kickoff',
        name: 'Lancement Projet',
        subject: '🚀 Lancement de votre projet',
        category: 'general',
        body: `Bonjour {{client_name}},

Nous sommes ravis de démarrer votre projet {{project_name}} !

Votre chef de projet vous contactera dans les 48h pour planifier le kick-off meeting.

Informations projet :
- Type : {{service_type}}
- Durée estimée : {{timeline}}
- Contact : {{contact_email}}

Bienvenue chez Nexus Développement !

Cordialement,
L'équipe`
    }
];

/**
 * Get template by ID
 */
export const getTemplate = (templateId: string): EmailTemplate | undefined => {
    return emailTemplates.find(t => t.id === templateId);
};

/**
 * Replace template variables
 */
export const fillTemplate = (template: EmailTemplate, variables: Record<string, string>): EmailTemplate => {
    let subject = template.subject;
    let body = template.body;

    Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        subject = subject.replace(new RegExp(placeholder, 'g'), value);
        body = body.replace(new RegExp(placeholder, 'g'), value);
    });

    return {
        ...template,
        subject,
        body
    };
};

/**
 * Send email (placeholder for Phase 2 integration)
 */
export const sendEmail = async (
    to: string,
    template: EmailTemplate,
    variables: Record<string, string>
): Promise<{ success: boolean; message: string }> => {
    // Phase 2: Real implementation with Resend/SendGrid
    // Email will be sent via emailService.ts

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        message: `Email "${template.name}" envoyé à ${to} (simulation)`
    };
};
