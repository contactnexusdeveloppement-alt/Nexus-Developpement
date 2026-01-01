import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  name: string;
  email: string;
  phone?: string;
  businessType?: string;
  services: string[];
  projectDetails?: string;
  budget?: string;
  timeline?: string;
  consentGiven?: boolean;
}

const serviceLabels: Record<string, string> = {
  website: "Création d'un site web",
  webapp: "Application web",
  mobile: "Application mobile",
  automation: "Automatisation de processus",
  logo: "Création de logo",
  branding: "Branding visuel complet",
  custom: "Service sur mesure"
};

// Fonction d'échappement HTML pour prévenir les injections
const escapeHtml = (text: string | undefined | null): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    const quoteData: QuoteRequest = await req.json();

    console.log("Received quote request:", quoteData);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Store the quote request in the database
    const { data: dbData, error: dbError } = await supabase
      .from('quote_requests')
      .insert({
        name: quoteData.name,
        email: quoteData.email,
        phone: quoteData.phone || null,
        business_type: quoteData.businessType || null,
        services: quoteData.services,
        project_details: quoteData.projectDetails || null,
        budget: quoteData.budget || null,
        timeline: quoteData.timeline || null,
        consent_given: quoteData.consentGiven ?? true,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Quote stored in database:", dbData);

    // Check if Resend API key is configured
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set. Skipping email sending.");
      return new Response(
        JSON.stringify({ success: true, message: "Demande de devis enregistrée (Emails non envoyés: configuration manquante)" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Échapper toutes les données utilisateur avant de les utiliser dans le HTML
    const safeName = escapeHtml(quoteData.name);
    const safeEmail = escapeHtml(quoteData.email);
    const safePhone = escapeHtml(quoteData.phone);
    const safeBusinessType = escapeHtml(quoteData.businessType);
    const safeProjectDetails = escapeHtml(quoteData.projectDetails);
    const safeBudget = escapeHtml(quoteData.budget);
    const safeTimeline = escapeHtml(quoteData.timeline);

    // Créer la liste des services
    const servicesListHtml = quoteData.services
      .map(serviceId => `
        <tr>
          <td style="padding: 8px 0; color: #e2e8f0; font-size: 14px;">
            ✓ ${escapeHtml(serviceLabels[serviceId] || serviceId)}
          </td>
        </tr>
      `)
      .join("");

    // Email Admin - Structure unifiée avec couleurs solides et responsive mobile
    const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle Demande de Devis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 20px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0ea5e9 100%); border-radius: 20px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 30px 20px 20px 20px; text-align: center;">
              <a href="https://nexusdeveloppement.fr" target="_blank" style="text-decoration: none;"><img src="https://nexusdeveloppement.fr/email-logo.png" alt="Nexus Développement" style="max-width: 100px; height: auto; margin-bottom: 15px; border: 0;" /></a>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                📩 Nouvelle Demande de Devis
              </h1>
              <p style="margin: 10px 0 0 0; color: #93c5fd; font-size: 15px;">
                Une nouvelle opportunité vous attend !
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 10px 15px 30px 15px;">
              
              <!-- Contact Client Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 12px; margin-bottom: 15px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      👤 Contact Client
                    </h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px; width: 35%;">Nom :</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${safeName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">Email :</td>
                        <td style="padding: 6px 0;">
                          <a href="mailto:${safeEmail}" style="color: #38bdf8; font-size: 14px; text-decoration: none; word-break: break-all;">${safeEmail}</a>
                        </td>
                      </tr>
                      ${safePhone ? `
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">Téléphone :</td>
                        <td style="padding: 6px 0;">
                          <a href="tel:${safePhone}" style="color: #38bdf8; font-size: 14px; text-decoration: none; font-weight: 600;">${safePhone}</a>
                        </td>
                      </tr>
                      ` : ''}
                      ${safeBusinessType ? `
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">Activité :</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px;">${safeBusinessType}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Services Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 12px; margin-bottom: 15px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      🎯 Services Demandés
                    </h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${servicesListHtml}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Détails Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 12px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      📋 Détails du Projet
                    </h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${safeBudget ? `
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px; width: 35%;">💰 Budget :</td>
                        <td style="padding: 6px 0; color: #4ade80; font-size: 14px; font-weight: 600;">${safeBudget}</td>
                      </tr>
                      ` : ''}
                      ${safeTimeline ? `
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">⏱️ Délai :</td>
                        <td style="padding: 6px 0; color: #fbbf24; font-size: 14px; font-weight: 500;">${safeTimeline}</td>
                      </tr>
                      ` : ''}
                      ${safeProjectDetails ? `
                      <tr>
                        <td colspan="2" style="padding: 10px 0;">
                          <span style="color: #93c5fd; font-size: 13px;">📝 Description :</span>
                          <p style="color: #e2e8f0; font-size: 14px; line-height: 1.5; margin: 6px 0 0 0; white-space: pre-wrap;">${safeProjectDetails}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 15px 20px 25px 20px; text-align: center; border-top: 1px solid #3b82f6;">
              <p style="margin: 0; color: #93c5fd; font-size: 11px;">
                Nexus Développement - Agence Digitale<br>
                Cette notification a été envoyée automatiquement
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Envoyer l'email à l'adresse de contact via l'API Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nexus Développement <noreply@send.nexusdeveloppement.fr>",
        to: ["contact.nexus.developpement@gmail.com"],
        reply_to: quoteData.email,
        subject: `📩 Nouvelle demande de devis - ${safeName}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      // Log the error but don't fail the request completely
      const errorData = await emailResponse.json();
      console.error("Resend API error:", errorData);
    } else {
      const emailResult = await emailResponse.json();
      console.log("Email sent successfully to admin:", emailResult);
    }

    // Email Client - Structure unifiée avec couleurs solides
    const clientEmailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de votre demande de devis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0ea5e9 100%); border-radius: 20px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <a href="https://nexusdeveloppement.fr" target="_blank" style="text-decoration: none;"><img src="https://nexusdeveloppement.fr/email-logo.png" alt="Nexus Développement" style="max-width: 120px; height: auto; margin-bottom: 15px; border: 0;" /></a>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ✅ Demande Reçue !
              </h1>
              <p style="margin: 10px 0 0 0; color: #93c5fd; font-size: 16px;">
                Merci ${safeName} pour votre confiance
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              
              <!-- Confirmation Message -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #166534; border-radius: 16px; margin-bottom: 20px; border: 1px solid #22c55e;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0; color: #86efac; font-size: 16px; font-weight: 600;">
                      🎉 Votre demande de devis a bien été enregistrée
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Recap Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 16px; margin-bottom: 20px; border: 1px solid #3b82f6;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                      📋 Récapitulatif de votre demande
                    </h2>
                    
                    <!-- Services -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <span style="color: #93c5fd; font-size: 13px;">Services demandés</span>
                        </td>
                      </tr>
                      ${servicesListHtml}
                    </table>
                    
                    ${safeBudget ? `
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #3b82f6; padding-top: 12px; margin-top: 12px;">
                      <tr>
                        <td>
                          <span style="color: #93c5fd; font-size: 13px;">💰 Budget estimé</span><br>
                          <span style="color: #4ade80; font-size: 15px; font-weight: 500;">${safeBudget}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${safeTimeline ? `
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #3b82f6; padding-top: 12px; margin-top: 12px;">
                      <tr>
                        <td>
                          <span style="color: #93c5fd; font-size: 13px;">⏱️ Délai souhaité</span><br>
                          <span style="color: #fbbf24; font-size: 15px; font-weight: 500;">${safeTimeline}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${safeProjectDetails ? `
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #3b82f6; padding-top: 12px; margin-top: 12px;">
                      <tr>
                        <td>
                          <span style="color: #93c5fd; font-size: 13px;">📝 Description du projet</span>
                          <p style="color: #e2e8f0; font-size: 14px; line-height: 1.5; margin: 8px 0 0 0; white-space: pre-wrap;">${safeProjectDetails}</p>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <!-- Timeline Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e40af; border-radius: 16px; margin-bottom: 20px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">
                      ⏱️ Notre équipe analyse votre projet et vous recontactera sous <strong style="color: #7dd3fc;">24-48h</strong>.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Contact Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 16px; margin-bottom: 20px; border: 1px solid #3b82f6;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                      📞 Besoin de nous joindre ?
                    </h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 5px 0;">
                          <a href="mailto:contact.nexus.developpement@gmail.com" style="color: #38bdf8; font-size: 14px; text-decoration: none;">
                            📧 contact.nexus.developpement@gmail.com
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <a href="tel:+33761847580" style="color: #38bdf8; font-size: 14px; text-decoration: none;">
                            📞 +33 7 61 84 75 80
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0;">
                    <p style="margin: 0 0 15px 0; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                      Nous sommes impatients de travailler avec vous sur ce projet !
                    </p>
                    <p style="margin: 0; color: #e2e8f0; font-size: 15px;">
                      Cordialement,<br>
                      <strong style="color: #7dd3fc;">L'équipe Nexus Développement</strong>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 30px 40px; text-align: center; border-top: 1px solid #3b82f6;">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                Nexus Développement
              </p>
              <p style="margin: 0 0 10px 0; color: #93c5fd; font-size: 12px;">
                Votre partenaire digital de confiance<br>
                Sites web • Applications • Automatisation
              </p>
              <p style="margin: 0;"><a href="https://nexusdeveloppement.fr" style="color: #38bdf8; font-size: 12px; text-decoration: none;">🌐 Visitez notre site</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Envoyer l'email de confirmation au client
    try {
      const clientEmailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Nexus Développement <noreply@send.nexusdeveloppement.fr>",
          to: [quoteData.email],
          subject: "✅ Confirmation de votre demande de devis - Nexus Développement",
          html: clientEmailHtml,
        }),
      });

      if (clientEmailResponse.ok) {
        const clientEmailResult = await clientEmailResponse.json();
        console.log("Confirmation email sent to client:", clientEmailResult);
      } else {
        const clientErrorData = await clientEmailResponse.json();
        console.error("Failed to send confirmation email to client:", clientErrorData);
      }
    } catch (clientEmailError) {
      console.error("Error sending confirmation email to client:", clientEmailError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email envoyé avec succès" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in send-quote function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
