import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendQuoteRequest {
    email: string;
    pdfBase64: string;
    quoteNumber: string;
    clientName: string;
}

const handler = async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { email, pdfBase64, quoteNumber, clientName }: SendQuoteRequest = await req.json();

        if (!email || !pdfBase64) {
            throw new Error("Missing email or PDF data");
        }

        // Strip data URI prefix if present (e.g., "data:application/pdf;base64,")
        const base64Content = pdfBase64.includes(',')
            ? pdfBase64.split(',')[1]
            : pdfBase64;

        // In Resend sandbox mode, we can only send to verified emails
        // For production, set RESEND_SANDBOX_MODE=false
        const isSandbox = Deno.env.get("RESEND_SANDBOX_MODE") !== "false";
        const adminEmail = "contact.nexus.developpement@gmail.com";

        // Determine the actual recipient
        const toEmail = isSandbox ? adminEmail : email;
        const subjectPrefix = isSandbox ? "[TEST] " : "";
        const sandboxNotice = isSandbox
            ? `<p style="background: #fff3cd; padding: 10px; border-radius: 5px; color: #856404;"><strong>⚠️ Mode Test:</strong> Cet email était destiné à: ${email}</p>`
            : "";

        console.log(`Sending email to: ${toEmail} (sandbox: ${isSandbox}, original: ${email})`);

        const { data, error } = await resend.emails.send({
            from: Deno.env.get("RESEND_FROM_EMAIL") || "Nexus Développement <noreply@send.nexusdeveloppement.fr>",
            to: [toEmail],
            subject: `${subjectPrefix}Votre devis ${quoteNumber} - Nexus Développement`,
            html: `
        <div style="font-family: sans-serif; color: #333;">
            ${sandboxNotice}
            <h2>Bonjour ${clientName},</h2>
            <p>Veuillez trouver ci-joint votre devis <strong>${quoteNumber}</strong>.</p>
            <p>Notre équipe reste à votre disposition pour toute question.</p>
            <br/>
            <p>Cordialement,</p>
            <p><strong>L'équipe Nexus Développement</strong><br/>
            <a href="https://nexusdeveloppement.fr" style="color: #6d7ff0;">nexusdeveloppement.fr</a></p>
        </div>
      `,
            attachments: [
                {
                    content: base64Content,
                    filename: `Devis_${quoteNumber}.pdf`,
                },
            ],
        });

        if (error) {
            console.error('Resend error:', JSON.stringify(error));
            return new Response(JSON.stringify({
                error: error.message || 'Unknown Resend error',
                details: error
            }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        console.log('Email sent successfully:', data);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({
            error: error.message || 'Unknown error',
            stack: error.stack
        }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
};

serve(handler);
