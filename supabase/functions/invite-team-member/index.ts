import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
// Use the verified domain email or the onboarding one if still in sandbox
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';

interface InviteRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'sales' | 'super_admin';
  commissionRate?: number;
  redirectUrl?: string; // Add redirectUrl
  phone?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create Admin Client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify Authorization (optional but good practice to check if caller is authenticated user)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Check if the user making the request is an admin (using standard client logic or just trusting the role if we implemented RLS properly)
    // For extra security provided by Edge Function environment, we can re-verify the user's role here:
    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await supabaseClient.auth.getUser();

    if (!caller) throw new Error('Unauthorized');

    // Check caller role in DB
    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .single();

    if (!callerRole || (callerRole.role !== 'admin' && callerRole.role !== 'super_admin')) {
      throw new Error('Only admins can invite team members');
    }

    // Parse Request Body
    const { email, firstName, lastName, role, commissionRate, redirectUrl, phone } = await req.json() as InviteRequest;

    if (!email || !firstName || !lastName || !role) {
      throw new Error('Missing required fields');
    }

    console.log(`Starting invitation for ${email} as ${role}`);

    // 1. Generate Invite Link
    // Use SITE_URL env var with fallback to localhost for development
    const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:8080';
    const finalRedirectUrl = `${SITE_URL}/auth/callback`;

    console.log('=== URL Configuration ===');
    console.log('SITE_URL env var:', Deno.env.get('SITE_URL'));
    console.log('Received redirectUrl from client:', redirectUrl);
    console.log('Using finalRedirectUrl:', finalRedirectUrl);

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email,
      options: {
        redirectTo: `${finalRedirectUrl}?type=invite&next=/dashboard/settings/profile`,
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          role: role,
        }
      }
    });

    if (linkError) {
      console.error('Error generating link:', linkError);
      throw linkError;
    }

    // Log full Supabase response to debug the action_link
    console.log('=== Supabase generateLink Response ===');
    console.log('Full linkData:', JSON.stringify(linkData, null, 2));

    const { user, properties } = linkData;
    // action_link can be at linkData.properties.action_link OR linkData.action_link
    const action_link = properties?.action_link || (linkData as any).action_link;

    console.log('Extracted action_link:', action_link);

    // Validate action_link before using it
    if (!action_link || action_link.includes('undefined')) {
      console.error('INVALID action_link generated:', action_link);
      throw new Error('Failed to generate valid invitation link');
    }

    console.log(`User created with ID: ${user.id}`);

    // 2. Insert into profiles / team_members / sales_partners

    // Insert into user_roles (Critical for Auth)
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: user.id, role: role });

    if (roleError) console.error('Error inserting role:', roleError);

    // Insert into profiles FIRST (Required by FK constraint on sales_partners)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        role: role,
        commission_rate: commissionRate || 0,
        phone: phone || null,
      });

    if (profileError) {
      console.error('Error inserting profile:', profileError);
      throw new Error(`Database Error (profiles): ${profileError.message}`);
    }

    // Insert into sales_partners AFTER profiles (Critical for TeamManagement.tsx view)
    // Check if user exists in sales_partners to handle retries
    const { data: existingPartner } = await supabaseAdmin
      .from('sales_partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let salesPartnerError;

    if (existingPartner) {
      // Update existing record
      const { error } = await supabaseAdmin
        .from('sales_partners')
        .update({
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          commission_rate: commissionRate || 0,
          is_active: true
        })
        .eq('user_id', user.id);
      salesPartnerError = error;
    } else {
      // Insert new record
      const { error } = await supabaseAdmin
        .from('sales_partners')
        .insert({
          user_id: user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          commission_rate: commissionRate || 0,
          is_active: true
        });
      salesPartnerError = error;
    }

    if (salesPartnerError) {
      console.error('Error inserting/updating sales_partner:', salesPartnerError);
      throw new Error(`Database Error (sales_partners): ${salesPartnerError.message}`);
    }

    // 3. Send Email via Resend
    console.log(`Sending email to ${email} via Resend...`);

    // Simple HTML template
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Invitation à rejoindre l'équipe Nexus</h2>
        <p>Bonjour ${firstName},</p>
        <p>L'administrateur vous a invité à rejoindre la plateforme Nexus Développement en tant que <strong>${role}</strong>.</p>
        <p>Cliquez sur le lien ci-dessous pour accepter l'invitation et configurer votre mot de passe :</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${action_link}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Accepter l'invitation
          </a>
        </p>
        <p>Si le bouton ne fonctionne pas, copiez ce lien : <br>${action_link}</p>
        <p>À bientôt,<br>L'équipe Nexus</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Nexus Admin <${RESEND_FROM_EMAIL}>`,
        to: [email],
        subject: "Invitation à rejoindre l'équipe Nexus",
        html: htmlContent,
      }),
    });

    const emailData = await res.json();

    if (!res.ok) {
      console.error('Resend API Error:', emailData);
      // If email fails, we might want to delete the user? 
      // For now, let's just throw error, user already created though.
      // Ideally we should rollback: await supabaseAdmin.auth.admin.deleteUser(user.id);
      throw new Error(`Email sending failed: ${emailData.message || 'Unknown error'}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Invitation sent successfully', userId: user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
