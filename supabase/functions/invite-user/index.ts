import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteUserRequest {
    email: string
    firstName: string
    lastName: string
    role: 'admin' | 'sales'
    phone?: string
    redirectTo?: string
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        // Create Supabase admin client with service_role key
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('Missing environment variables')
            return new Response(
                JSON.stringify({ success: false, error: 'Server configuration error' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // Verify the calling user is an admin
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            console.error('No authorization header provided')
            return new Response(
                JSON.stringify({ success: false, error: 'Authorization header required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            )
        }

        const token = authHeader.replace('Bearer ', '')
        console.log('Token received, length:', token.length)

        const { data: { user: callingUser }, error: authError } = await supabaseAdmin.auth.getUser(token)

        if (authError) {
            console.error('Auth error:', authError.message)
            return new Response(
                JSON.stringify({ success: false, error: `Authentication failed: ${authError.message}` }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            )
        }

        if (!callingUser) {
            console.error('No user found for token')
            return new Response(
                JSON.stringify({ success: false, error: 'Invalid token - user not found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            )
        }

        console.log('User authenticated:', callingUser.id, callingUser.email)

        // Check if calling user has admin role
        const { data: callerRoles, error: roleError } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', callingUser.id)
            .eq('role', 'admin')

        console.log('Role check result:', { callerRoles, roleError })

        if (roleError) {
            console.error('Role check error:', roleError.message)
            return new Response(
                JSON.stringify({ success: false, error: `Role verification failed: ${roleError.message}` }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        if (!callerRoles || callerRoles.length === 0) {
            console.error('User is not an admin:', callingUser.id)
            return new Response(
                JSON.stringify({ success: false, error: 'Only admins can invite users' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
            )
        }

        console.log('Admin role confirmed for user:', callingUser.email)

        // Parse request body
        const { email, firstName, lastName, role, phone, redirectTo }: InviteUserRequest = await req.json()

        if (!email || !firstName || !lastName || !role) {
            throw new Error('Missing required fields: email, firstName, lastName, role')
        }

        // Use inviteUserByEmail to send an invitation with password setup link
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            redirectTo: redirectTo || `${req.headers.get('origin')}/auth/callback`,
            data: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`.trim(),
                phone: phone || null,
                role: role,
            }
        })

        if (inviteError) {
            console.error('Invite error:', inviteError)
            throw new Error(`Failed to invite user: ${inviteError.message}`)
        }

        if (!inviteData.user) {
            throw new Error('User invitation failed - no user data returned')
        }

        const userId = inviteData.user.id

        // Insert user role
        const { error: roleInsertError } = await supabaseAdmin
            .from('user_roles')
            .upsert({
                user_id: userId,
                role: role,
            }, { onConflict: 'user_id,role' })

        if (roleInsertError) {
            console.error('Role insertion error:', roleInsertError)
            // Don't throw - user was created, role can be added later
        }

        // Create profile entry
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                full_name: `${firstName} ${lastName}`.trim(),
                role: role,
            })

        if (profileError) {
            console.error('Profile creation error:', profileError)
            // Don't throw - might be created by trigger
        }

        // If role is 'sales', create sales_partner entry
        if (role === 'sales') {
            const { error: salesError } = await supabaseAdmin
                .from('sales_partners')
                .upsert({
                    id: userId,
                    commission_rate: 10, // Default 10% commission
                    is_active: true,
                }, { onConflict: 'id' })

            if (salesError) {
                console.error('Sales partner creation error:', salesError)
                // Don't throw - main invitation was successful
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Invitation email sent to ${email}`,
                userId: userId,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        console.error('Error in invite-user function:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
