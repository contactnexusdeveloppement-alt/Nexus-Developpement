import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Get authorization header
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            console.log('No authorization header found');
            return new Response(
                JSON.stringify({ error: 'Authorization required' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Initialize Supabase clients
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

        // Client for checking caller's permissions
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });

        // Admin client for user deletion
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Verify the caller is authenticated
        const { data: { user: caller }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !caller) {
            console.log('Auth error:', authError);
            return new Response(
                JSON.stringify({ error: 'Invalid authentication' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        console.log('User authenticated:', caller.email);

        // Check if the caller is an admin
        const { data: roleData, error: roleError } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', caller.id)
            .single();

        if (roleError || roleData?.role !== 'admin') {
            console.log('Role check failed:', roleError || 'Not admin');
            return new Response(
                JSON.stringify({ error: 'Admin access required' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        console.log('Admin role confirmed for:', caller.email);

        // Parse request body
        const { userId } = await req.json();

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'userId is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Prevent self-deletion
        if (userId === caller.id) {
            return new Response(
                JSON.stringify({ error: 'You cannot delete your own account' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        console.log('Attempting to delete user:', userId);

        // Delete the user from auth.users (this will cascade to profiles, user_roles, sales_partners)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return new Response(
                JSON.stringify({ error: `Failed to delete user: ${deleteError.message}` }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        console.log('User deleted successfully:', userId);

        return new Response(
            JSON.stringify({ success: true, message: 'User deleted successfully' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error in delete-user function:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
