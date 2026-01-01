import { sendEmail } from './emailService';
import { RESEND_CONFIG } from './resendClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Send quote request confirmation to client
 */
export const sendQuoteConfirmation = async (quoteData: any) => {
    const servicesHtml = quoteData.services
        .map((s: string) => `<li style="margin: 5px 0;">${s}</li>`)
        .join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
    h1 { margin: 0; font-size: 24px; }
    ul { padding-left: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Demande bien reçue !</h1>
    </div>
    
    <div class="content">
      <p>Bonjour <strong>${quoteData.name}</strong>,</p>
      
      <p>Nous avons bien reçu votre demande de devis et vous en remercions !</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0;">📋 Votre projet</h3>
        <p><strong>Services demandés :</strong></p>
        <ul>${servicesHtml}</ul>
        
        ${quoteData.project_details ? `<p><strong>Description :</strong><br/>${quoteData.project_details}</p>` : ''}
        
        ${quoteData.budget ? `<p><strong>Budget estimé :</strong> ${quoteData.budget}</p>` : ''}
      </div>
      
      <p><strong>Prochaines étapes :</strong></p>
      <ol>
        <li>Notre équipe va analyser votre demande en détail</li>
        <li>Nous vous recontacterons sous <strong>24-48h</strong></li>
        <li>Nous discuterons ensemble de votre projet</li>
      </ol>
      
      <p>En attendant, n'hésitez pas à nous contacter si vous avez des questions !</p>
      
      <p style="margin-top: 30px;">
        Cordialement,<br/>
        <strong>L'équipe Nexus Développement</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>Demande soumise le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
      <p>Référence : <code>${quoteData.id?.slice(0, 8)}</code></p>
      <p style="margin-top: 15px;">
        Nexus Développement | contact@nexus-dev.com
      </p>
    </div>
  </div>
</body>
</html>
  `;

    return sendEmail({
        to: quoteData.email,
        subject: `Demande de devis bien reçue - ${quoteData.name}`,
        html,
        type: 'quote_confirmation',
        recipientName: quoteData.name,
        templateUsed: 'quote_confirmation',
        relatedQuoteId: quoteData.id,
        metadata: { quote: quoteData },
    });
};

/**
 * Send quote notification to admin
 */
export const sendQuoteNotification = async (quoteData: any) => {
    const servicesHtml = quoteData.services
        .map((s: string) => `<li>${s}</li>`)
        .join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
    .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    h1 { margin: 0; font-size: 24px; }
    h3 { color: #1f2937; margin-top: 0; }
    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🆕 Nouvelle demande de devis</h1>
    </div>
    
    <div class="content">
      <div class="section">
        <h3>👤 Client</h3>
        <p><strong>Nom :</strong> ${quoteData.name}</p>
        <p><strong>Email :</strong> <a href="mailto:${quoteData.email}">${quoteData.email}</a></p>
        ${quoteData.phone ? `<p><strong>Téléphone :</strong> <a href="tel:${quoteData.phone}">${quoteData.phone}</a></p>` : ''}
      </div>
      
      <div class="section">
        <h3>💼 Projet</h3>
        <p><strong>Services :</strong></p>
        <ul>${servicesHtml}</ul>
        
        ${quoteData.project_details ? `<p><strong>Description :</strong><br/>${quoteData.project_details}</p>` : ''}
        
        ${quoteData.budget ? `<p><strong>Budget :</strong> <span class="highlight">${quoteData.budget}</span></p>` : ''}
        
        ${quoteData.urgency ? `<p><strong>Urgence :</strong> ${quoteData.urgency}</p>` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:8080/nx-panel-8f4a/dashboard?tab=clients" class="button">
          📊 Voir dans le dashboard
        </a>
      </div>
      
      <p style="text-align: center; color: #6b7280; font-size: 14px;">
        Reçu le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })} | Réf: ${quoteData.id?.slice(0, 8)}
      </p>
    </div>
  </div>
</body>
</html>
  `;

    return sendEmail({
        to: RESEND_CONFIG.adminEmail,
        subject: `🆕 Nouvelle demande de devis - ${quoteData.name}`,
        html,
        type: 'quote_notification',
        recipientName: 'Admin',
        templateUsed: 'quote_notification',
        relatedQuoteId: quoteData.id,
        metadata: { quote: quoteData },
    });
};

/**
 * Send call booking confirmation to client
 */
export const sendCallConfirmation = async (callData: any) => {
    const callDate = new Date(`${callData.booking_date} ${callData.time_slot}`);
    const formattedDate = format(callDate, 'EEEE dd MMMM yyyy', { locale: fr });
    const formattedTime = format(callDate, 'HH:mm', { locale: fr });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .call-details { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border: 2px solid #3b82f6; }
    .detail-item { display: flex; align-items: center; margin: 15px 0; font-size: 16px; }
    .icon { font-size: 24px; margin-right: 15px; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    h1 { margin: 0; font-size: 24px; }
    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📞 Appel confirmé !</h1>
    </div>
    
    <div class="content">
      <p>Bonjour <strong>${callData.name}</strong>,</p>
      
      <p>Votre appel avec Nexus Développement est <strong>confirmé</strong> !</p>
      
      <div class="call-details">
        <div class="detail-item">
          <span class="icon">📅</span>
          <div>
            <strong>Date</strong><br/>
            ${formattedDate}
          </div>
        </div>
        
        <div class="detail-item">
          <span class="icon">⏰</span>
          <div>
            <strong>Heure</strong><br/>
            ${formattedTime}
          </div>
        </div>
        
        ${callData.phone ? `
        <div class="detail-item">
          <span class="icon">📱</span>
          <div>
            <strong>Numéro</strong><br/>
            ${callData.phone}
          </div>
        </div>
        ` : ''}
        
        ${callData.call_type ? `
        <div class="detail-item">
          <span class="icon">💬</span>
          <div>
            <strong>Type d'appel</strong><br/>
            ${callData.call_type === 'discovery' ? 'Appel découverte' : 'Devis personnalisé'}
          </div>
        </div>
        ` : ''}
      </div>
      
      <div class="alert">
        <strong>⏰ Important :</strong> Nous vous appellerons à l'heure convenue. Assurez-vous d'être disponible !
      </div>
      
      ${callData.project_details ? `
      <p><strong>Vous souhaitez discuter de :</strong><br/>
      ${callData.project_details}</p>
      ` : ''}
      
      <p style="margin-top: 30px;">
        <strong>Besoin de modifier ou annuler ?</strong><br/>
        Contactez-nous à <a href="mailto:contact@nexus-dev.com">contact@nexus-dev.com</a>
      </p>
      
      <p style="margin-top: 30px;">
        À bientôt !<br/>
        <strong>L'équipe Nexus Développement</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>Appel réservé le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
      <p>Référence : <code>${callData.id?.slice(0, 8)}</code></p>
    </div>
  </div>
</body>
</html>
  `;

    return sendEmail({
        to: callData.email,
        subject: `Appel confirmé le ${formattedDate} à ${formattedTime}`,
        html,
        type: 'call_confirmation',
        recipientName: callData.name,
        templateUsed: 'call_confirmation',
        relatedCallId: callData.id,
        metadata: { call: callData },
    });
};

/**
 * Send call booking notification to admin
 */
export const sendCallNotification = async (callData: any) => {
    const callDate = new Date(`${callData.booking_date} ${callData.time_slot}`);
    const formattedDate = format(callDate, 'EEEE dd MMMM yyyy', { locale: fr });
    const formattedTime = format(callDate, 'HH:mm', { locale: fr });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
    .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    h1 { margin: 0; font-size: 24px; }
    h3 { color: #1f2937; margin-top: 0; }
    .time-badge { background: #fbbf24; color: #78350f; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📞 Nouvel appel planifié</h1>
    </div>
    
    <div class="content">
      <div style="text-align: center; margin: 20px 0;">
        <span class="time-badge">📅 ${formattedDate} à ${formattedTime}</span>
      </div>
      
      <div class="section">
        <h3>👤 Client</h3>
        <p><strong>Nom :</strong> ${callData.name}</p>
        <p><strong>Email :</strong> <a href="mailto:${callData.email}">${callData.email}</a></p>
        ${callData.phone ? `<p><strong>Téléphone :</strong> <a href="tel:${callData.phone}">${callData.phone}</a></p>` : ''}
      </div>
      
      <div class="section">
        <h3>📞 Détails de l'appel</h3>
        <p><strong>Type :</strong> ${callData.call_type === 'discovery' ? 'Appel découverte' : 'Devis personnalisé'}</p>
        ${callData.project_details ? `<p><strong>Sujet :</strong><br/>${callData.project_details}</p>` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:8080/nx-panel-8f4a/dashboard?tab=clients" class="button">
          📊 Voir dans le dashboard
        </a>
      </div>
      
      <p style="text-align: center; color: #6b7280; font-size: 14px;">
        Réservé le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })} | Réf: ${callData.id?.slice(0, 8)}
      </p>
    </div>
  </div>
</body>
</html>
  `;

    return sendEmail({
        to: RESEND_CONFIG.adminEmail,
        subject: `📞 Nouvel appel planifié - ${formattedDate} à ${formattedTime}`,
        html,
        type: 'call_notification',
        recipientName: 'Admin',
        templateUsed: 'call_notification',
        relatedCallId: callData.id,
        metadata: { call: callData },
    });
};

/**
 * Send quote pricing email to client
 */
export const sendQuotePricing = async (quoteData: any, pricingDetails: {
    total_price: number;
    services_breakdown: string[];
    estimated_timeline?: string;
    payment_terms?: string;
    validity_period?: string;
    admin_name?: string;
}) => {
    const vatAmount = pricingDetails.total_price * 0.2;
    const totalTTC = pricingDetails.total_price * 1.2;

    const servicesHtml = pricingDetails.services_breakdown
        .map((s: string) => `<li style="margin: 8px 0;">${s}</li>`)
        .join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .pricing-box { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border: 2px solid #8b5cf6; }
    .price-line { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .total { background: #8b5cf6; color: white; padding: 15px; font-size: 20px; font-weight: bold; margin-top: 15px; border-radius: 6px; }
    .button { background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-size: 16px; font-weight: bold; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    h1 { margin: 0; font-size: 24px; }
    ul { padding-left: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💼 Votre devis personnalisé</h1>
    </div>
    
    <div class="content">
      <p>Bonjour <strong>${quoteData.name}</strong>,</p>
      
      <p>Suite à notre échange concernant votre projet, voici votre devis personnalisé :</p>
      
      <h3>📋 Services inclus</h3>
      <ul>${servicesHtml}</ul>
      
      <div class="pricing-box">
        <h3 style="margin-top: 0;">💰 Tarification</h3>
        
        <div class="price-line">
          <span>Prix total HT</span>
          <strong>${pricingDetails.total_price.toLocaleString('fr-FR')} €</strong>
        </div>
        
        <div class="price-line">
          <span>TVA (20%)</span>
          <strong>${vatAmount.toLocaleString('fr-FR')} €</strong>
        </div>
        
        <div class="total">
          <div style="display: flex; justify-content: space-between;">
            <span>Total TTC</span>
            <span>${totalTTC.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
      </div>
      
      ${pricingDetails.estimated_timeline || pricingDetails.payment_terms || pricingDetails.validity_period ? `
      <h3>📄 Conditions</h3>
      <ul>
        ${pricingDetails.estimated_timeline ? `<li><strong>Délai estimé :</strong> ${pricingDetails.estimated_timeline}</li>` : ''}
        ${pricingDetails.payment_terms ? `<li><strong>Paiement :</strong> ${pricingDetails.payment_terms}</li>` : ''}
        ${pricingDetails.validity_period ? `<li><strong>Validité du devis :</strong> ${pricingDetails.validity_period}</li>` : ''}
      </ul>
      ` : ''}
      
      <p style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
        <strong>Note :</strong> Ce devis est établi sur la base des informations communiquées. 
        Pour toute modification, n'hésitez pas à nous contacter.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:contact@nexus-dev.com?subject=Question sur devis ${quoteData.id?.slice(0, 8)}" class="button">
          ✉️ Poser une question
        </a>
      </div>
      
      <p style="margin-top: 30px;">
        Cordialement,<br/>
        <strong>${pricingDetails.admin_name || 'L\'équipe Nexus Développement'}</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>Devis émis le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
      <p>Référence : <code>${quoteData.id?.slice(0, 8)}</code></p>
      <p style="margin-top: 15px;">
        Nexus Développement | contact@nexus-dev.com
      </p>
    </div>
  </div>
</body>
</html>
  `;

    return sendEmail({
        to: quoteData.email,
        subject: `Votre devis personnalisé - ${quoteData.name}`,
        html,
        type: 'quote_pricing',
        recipientName: quoteData.name,
        templateUsed: 'quote_pricing',
        relatedQuoteId: quoteData.id,
        metadata: { quote: quoteData, pricing: pricingDetails },
    });
};
