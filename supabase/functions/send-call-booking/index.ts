import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Utility function to escape HTML special characters
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface CallBookingRequest {
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  time_slot: string;
  duration: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, booking_date, time_slot, duration }: CallBookingRequest = await req.json();

    console.log("Received call booking request:", { name, email, phone, booking_date, time_slot, duration });

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Insert booking into database
    const { error: insertError } = await supabase
      .from('call_bookings')
      .insert({
        name,
        email,
        phone,
        booking_date,
        time_slot,
        duration,
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("Booking inserted successfully");

    // Format date for display
    const dateObj = new Date(booking_date);
    const formattedDate = dateObj.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Duration label
    const durationLabel = duration === 15 ? '15 minutes' : duration === 30 ? '30 minutes' : '1 heure';

    // Escape all user-provided data
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeTimeSlot = escapeHtml(time_slot);

    // Admin notification email - Couleurs solides et responsive
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                📞 Nouvelle Réservation d'Appel
              </h1>
              <p style="margin: 10px 0 0 0; color: #93c5fd; font-size: 15px;">
                Un client souhaite vous parler
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 10px 15px 30px 15px;">
              
              <!-- Date & Time Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 12px; margin-bottom: 15px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      📅 Détails du rendez-vous
                    </h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px; width: 35%;">Date :</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${escapeHtml(formattedDate)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">Heure :</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${safeTimeSlot}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">Durée :</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${durationLabel}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Client Info Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 12px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      👤 Coordonnées du client
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
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">Téléphone :</td>
                        <td style="padding: 6px 0;">
                          <a href="tel:${safePhone}" style="color: #38bdf8; font-size: 14px; text-decoration: none; font-weight: 600;">${safePhone}</a>
                        </td>
                      </tr>
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

    // Client confirmation email - Couleurs solides et responsive
    const clientEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                ✅ Votre appel est confirmé !
              </h1>
              <p style="margin: 10px 0 0 0; color: #93c5fd; font-size: 15px;">
                Merci ${safeName} pour votre réservation
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 10px 15px 30px 15px;">
              
              <!-- Confirmation Message -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #166534; border-radius: 12px; margin-bottom: 15px; border: 2px solid #22c55e;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0; color: #86efac; font-size: 15px; font-weight: 600;">
                      🎉 Votre rendez-vous téléphonique a bien été enregistré
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Date & Time Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 12px; margin-bottom: 15px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      📅 Récapitulatif de votre rendez-vous
                    </h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px; width: 35%;">Date :</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${escapeHtml(formattedDate)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">Heure :</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${safeTimeSlot}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #93c5fd; font-size: 13px;">Durée :</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${durationLabel}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- How it works Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 12px; margin-bottom: 15px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      📞 Comment ça se passe ?
                    </h2>
                    <p style="margin: 0 0 12px 0; color: #e2e8f0; font-size: 14px; line-height: 1.5;">
                      Nous vous appellerons au numéro <strong style="color: #38bdf8;">${safePhone}</strong> à l'heure convenue.
                    </p>
                    <p style="margin: 0; color: #e2e8f0; font-size: 14px; line-height: 1.5;">
                      Assurez-vous d'être disponible et dans un endroit calme pour notre échange.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Contact Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a5a; border-radius: 12px; border: 2px solid #3b82f6;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      💬 Besoin de modifier votre rendez-vous ?
                    </h2>
                    <p style="margin: 0 0 10px 0; color: #e2e8f0; font-size: 14px;">
                      Contactez-nous :
                    </p>
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

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 15px 20px 25px 20px; text-align: center; border-top: 1px solid #3b82f6;">
              <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px; font-weight: 600;">
                Nexus Développement
              </p>
              <p style="margin: 0 0 8px 0; color: #93c5fd; font-size: 11px;">
                Votre partenaire digital de confiance<br>
                Sites web • Applications • Automatisation
              </p>
              <p style="margin: 0;"><a href="https://nexusdeveloppement.fr" style="color: #38bdf8; font-size: 11px; text-decoration: none;">🌐 Visitez notre site</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send notification email to admin via Resend API
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nexus Développement <noreply@send.nexusdeveloppement.fr>",
        to: ["contact.nexus.developpement@gmail.com"],
        reply_to: email,
        subject: `📞 Nouvelle réservation d'appel - ${safeName}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminEmailResponse.ok) {
      const errorData = await adminEmailResponse.json();
      console.error("Admin email error:", errorData);
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const adminEmailResult = await adminEmailResponse.json();
    console.log("Admin email sent successfully:", adminEmailResult);

    // Send confirmation email to client
    const clientEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nexus Développement <noreply@send.nexusdeveloppement.fr>",
        to: [email],
        subject: `✅ Confirmation de votre appel - ${escapeHtml(formattedDate)} à ${safeTimeSlot}`,
        html: clientEmailHtml,
      }),
    });

    if (!clientEmailResponse.ok) {
      const errorData = await clientEmailResponse.json();
      console.error("Client email error:", errorData);
    } else {
      const clientEmailResult = await clientEmailResponse.json();
      console.log("Client email sent successfully:", clientEmailResult);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Réservation enregistrée et emails envoyés" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in send-call-booking function:", error);
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
